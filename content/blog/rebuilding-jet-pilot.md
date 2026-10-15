---
title: "Rebuilding a Kubernetes desktop client in Rust and Tauri"
description: "Notes from overhauling JET Pilot: a kube-rs watch engine, a kubectl credential helper, in-app SSO and keeping a Tauri app around 26 MiB."
date: 2026-10-14
# A draft: rendered at its URL with noindex, kept out of /blog/, the sitemap and RSS.
# Remove this line (or set it to false) to publish.
draft: true
---

<!-- author: this draft was written with an AI assistant from the code and PR descriptions. This Week in Rust does not accept LLM-written articles, and r/rust/HN readers will notice. Rewrite it in your own words before submitting anywhere; treat this as an outline with verified facts. -->

<!-- author: every PR description in #84-#107 ends with a "Generated with Claude Code" line. Readers will see that. Decide whether and how to say how the overhaul was built; a sentence near the end is probably enough. -->

In version 1.35 of JET Pilot, the pods view refreshed by running `kubectl get pods -o json` once a second, and every other list ran kubectl every five seconds. If your kubeconfig used an exec plugin like `aws eks get-token`, each of those runs started a credential plugin as well. That worked. It just wasn't a good way to talk to a Kubernetes API server.

JET Pilot is an open-source (MIT) Kubernetes desktop client for macOS, Windows and Linux, built with Rust, [kube-rs](https://kube.rs), Tauri v2 and Vue 3. It went quiet for about a year after 1.35.0 in March 2025. This October I picked it up again, and the releases from 1.36.0 (4 October) to 2.1.1 (12 October) rebuilt most of it. This post covers the parts I think are interesting to others building on kube-rs or Tauri, rough edges included.

<!-- image: the Clusters hub with a few clusters from different providers, dark theme -->

## 1. From polling kubectl to a watch hub

The fix for polling is watching, and kube-rs makes that easy: `kube::runtime::watcher` gives you a stream of `Init`, `InitApply`, `InitDone`, `Apply` and `Delete` events, with re-listing and resource versions handled for you. Most of the work was around that stream.

The backend now has a `WatchHub`. The frontend subscribes to a (kubeconfig, context, resource, namespaces) key and gets messages over a Tauri channel. The hub runs one watcher per (context, group/version/resource, namespace scope), so two views showing pods in the same namespace share one connection. Resources are resolved through API discovery into `DynamicObject`s, which means CRDs work the same way as built-in kinds.

A few decisions that mattered:

**Serialize once, in Rust.** Each object is turned into the JSON row the UI needs as soon as it arrives. `managedFields` is stripped (it's often the biggest part of an object and the UI never shows it), `apiVersion`/`kind` are filled in, and the row is tagged with its context and kubeconfig. The store keeps that string. Snapshots and deltas are then built by string concatenation, and the channel sends raw JSON without encoding it a second time:

```rust
// src-tauri/src/watch/mod.rs
pub fn channel_sink(channel: Channel<InvokeResponseBody>) -> Sink {
    Arc::new(move |message: String| channel.send(InvokeResponseBody::Json(message)).is_ok())
}
```

**Batch, and coalesce inside the batch.** Changes are collected for 150 ms before they are sent. Inside a batch, several updates to one object become the latest version. An object that is added and deleted within the same batch is never sent at all. A completed re-list (after a `410 Gone`, for example) is diffed against the current store, so the UI only gets the rows that actually changed and the other rows keep their identity.

**Keep watchers warm.** Watchers are reference-counted by subscriptions. When the last subscriber leaves, the watcher keeps running for 60 seconds, so going back to a list gets a snapshot from memory straight away. There is a cap of 64 concurrent watchers. Idle ones are evicted first; past that limit, subscribing fails and the frontend falls back to kubectl polling for that context.

**A UI needs a different backoff than a controller.** kube-runtime's default backoff is the one controllers use. For a UI it left lists stale for a while after a short outage, so the hub uses its own: exponential from 500 ms to 5 s with ±20% jitter, reset after every successful event:

```rust
// simplified from src-tauri/src/watch/mod.rs
let config = watcher::Config::default().any_semantic(); // initial list may come from the watch cache
let stream = watcher(api, config).backoff(WatchBackoff::new());

loop {
    tokio::select! {
        event = stream.next() => match event {
            Some(Ok(event)) => {
                if entry.apply(event) && !paused { entry.flush(); }       // end of a (re)list: send now
                if deadline.is_none() && entry.has_pending() {
                    deadline = Some(Instant::now() + BATCH_INTERVAL);       // 150 ms
                }
            }
            Some(Err(err)) => { /* classify: forbidden / unauthorized stop; the rest retries */ }
            None => break,
        },
        _ = sleep_until(deadline), if deadline.is_some() && !paused => { entry.flush(); deadline = None; }
        _ = paused.changed() => { /* window shown again: flush what piled up */ }
    }
}
```

**Errors are part of the protocol.** Every scope reports a status (`syncing`, `ready`, `relisting`, `error`, `forbidden`, `unauthorized`, `failed`). `forbidden` and `unauthorized` stop the watcher instead of retrying forever; after you sign in, those watchers restart with a fresh client.

On the frontend, a multi-cluster list is one source per context, each a `Map` keyed by uid, merged for the table. Rows carry their context, so row actions go to the right cluster. If a watch can't start, that one context falls back to polling and tries watching again later, starting after a minute and backing off up to ten.

For numbers I only have what I measured while building it, against [kwok](https://kwok.sigs.k8s.io/) on one machine (PR #91): a 2,000-pod snapshot in 0.71 s cold and 126 ms warm, and about 200 ms from a scale or delete to the UI. A real cluster across a real network will be slower; I haven't benchmarked one.

## 2. Clusters you add should work in your terminal too

2.0 lets you add clusters inside the app: paste a kubeconfig, import a file, type in a server and token, or connect a cloud account. People use k9s, kubectl and scripts next to a GUI, so I didn't want those clusters to only work in JET Pilot.

So added clusters go into a normal kubeconfig, `~/.kube/jet-pilot/config` (mode 0600). The secrets don't. Tokens, client keys and secret exec environment variables go into a small vault, and each user entry runs a credential helper that ships with the app:

```yaml
# roughly what an added cluster's user entry looks like
users:
  - name: jetpilot-<cluster-id>
    user:
      exec:
        apiVersion: client.authentication.k8s.io/v1
        command: /home/me/.kube/jet-pilot/bin/jetpilot-auth
        args: [credential, static, --id, <cluster-id>]
        interactiveMode: Never
        installHint: Added with JET Pilot. Open JET Pilot to reinstall its credential helper.
```

Settings shows the line to copy, something like `export KUBECONFIG="$HOME/.kube/config:$HOME/.kube/jet-pilot/config"`, and then `kubectl` and k9s use the same clusters.

Some details that took more care than I expected:

- **`jetpilot-auth` is a second `[[bin]]` in the same Cargo package.** It depends only on a small workspace crate, `jp-auth-core`, with no Tauri or kube dependency. Tauri bundles extra `[[bin]]` targets next to the app binary, and at startup the app copies the helper to `~/.kube/jet-pilot/bin`, a stable path even when the app runs from a read-only AppImage mount. The copy is written as a new file and renamed into place, because macOS caches code signatures per inode.
- **stdout is only the `ExecCredential`.** Anything for humans goes to stderr through a redaction pass, the panic hook never prints a payload, and exit codes say what went wrong (3: no credentials stored, 4: vault locked).
- **The vault** is one file: a plaintext JSON header, then XChaCha20-Poly1305 ciphertext with the header bytes as associated data. The master key lives in the OS keychain through the `keyring` crate (macOS Keychain, Windows Credential Manager, Secret Service on Linux). On Linux machines without a Secret Service, you set a passphrase instead (Argon2id). To make the helper work in other terminals after you unlock, the derived key is kept in the kernel's user keyring for 12 hours.
- **We share the file with kubectl.** Writes use client-go's convention, an `O_EXCL` `config.lock` next to the file, so a `kubectl config use-context` running at the same time can't interleave with us. Then it's read, change, check, temp file, fsync, rename. Our metadata goes into context `extensions`, which kubectl keeps, and entries we didn't write are left alone.
- **The writer refuses inline secrets.** Before every write, `assert_no_inline_secrets` checks our `jetpilot-*` users for tokens, client keys, passwords and secret exec env vars, and the write fails if it finds any. It's a small check, but it means a bug elsewhere can't quietly put a token in plain text on disk.

Inside the app, the same entries don't spawn the helper; the credential is minted in-process.

## 3. Signing in from a GUI is a different problem

When kube-rs needs a token from an exec plugin, it runs the plugin with `std::process::Command::output()`; in interactive mode stderr is inherited, and there's no timeout. For a CLI that's right: the plugin prints "open this URL and enter ABCD-EFGH" in your terminal and waits. In a desktop app nobody sees that stderr, and a plugin waiting for a browser sign-in just blocks whatever asked for a client.

So JET Pilot has its own credential broker that runs exec plugins on tokio instead:

- stdin closed, `KUBERNETES_EXEC_INFO` set with `"interactive": false`, its own process group on Unix, and killed together with its children on timeout (20 s) or when dropped;
- stdout capped at 1 MiB and parsed as an `ExecCredential`;
- if a background run prints something that looks like a sign-in prompt (a device code or a browser URL), it is killed right away and reported as "sign-in needed", instead of a browser tab popping open while you're reading logs;
- credentials are cached until 60 seconds before they expire, and concurrent requests for the same credential share one plugin run;
- clients get the token per request through a `tower` layer.

Signing in is a separate session that you start. It runs the right command (`aws sso login`, `gcloud auth login`, `az login`, or the plugin itself with `"interactive": true`), redacts every line, and turns device codes and URLs in the output into events the dialog shows, with the verification domain clearly visible. When it succeeds, the clients sharing that credential are rebuilt, and watches, metrics, log streams and port forwards reconnect.

<!-- image: the sign-in dialog showing a device code and the verification domain -->

### IAM Identity Center without the AWS CLI

For AWS, 2.0 goes a step further and does the IAM Identity Center device flow itself with the AWS SDK for Rust: `RegisterClient`, `StartDeviceAuthorization`, then polling `CreateToken` as RFC 8628 describes:

```rust
// simplified from crates/jp-auth-core/src/aws/sso.rs
loop {
    if now() > authorization.expires_at { return Err(DeviceFlowError::Expired); }
    match create_token(&registration, &authorization.device_code).await {
        Ok(output) => return grant(output),
        Err(e) if e.code() == "AuthorizationPendingException" => {}
        Err(e) if e.code() == "SlowDownException" => interval += 5,
        Err(e) if e.code() == "ExpiredTokenException" => return Err(DeviceFlowError::Expired),
        Err(e) if e.code() == "AccessDeniedException" => return Err(DeviceFlowError::Denied),
        Err(other) => return Err(other.into()),
    }
    sleep(Duration::from_secs(interval)).await;
}
```

Two compatibility details took most of the time:

1. **The token goes into the standard `~/.aws/sso/cache`, written exactly as the AWS CLI v2 writes it.** That includes the file name (the SHA-1 of the `sso-session` name or the start URL), the key order, and Python's `json.dumps` separators and escaping. A unit test compares the output byte for byte with a sample of what the CLI writes. So after you sign in in JET Pilot, `aws` commands for that portal work without another sign-in. `~/.aws/config` is never written.
2. **EKS tokens are made without the CLI.** An EKS bearer token is a presigned `sts:GetCallerIdentity` URL with an `x-k8s-aws-id` header, base64url encoded and prefixed with `k8s-aws-v1.`. The test fixes the clock and credentials and compares the result with a token generated by botocore, which is what `aws eks get-token` uses.

This is what lets `jetpilot-auth credential aws-eks` work in a terminal with no AWS CLI installed. As of 2.1 it can also chain into a team role with `sts:AssumeRole` after the Identity Center sign-in (PR #106), which came out of the first feedback on 2.0.

Cluster discovery uses the same plumbing for nine providers. AWS goes through the SDK and checks EKS in every account and region it can reach, six regions at a time. Google Cloud and Azure use the `gcloud` and `az` sign-ins you already have. DigitalOcean (API token or doctl), Akamai/Linode, Civo, Scaleway, Vultr and Exoscale use small REST clients on rustls. To be clear about testing: I built these against fake servers, fake CLI scripts and recorded real-world output, and checked only parts live (such as TLS to the Identity Center OIDC endpoint). Most providers haven't been tried against real accounts yet. If one breaks for you, I'd like to hear about it.

## 4. Guardrails, and where they actually live

You can mark a cluster as **protected** or **read-only**. On a protected cluster, destructive actions (delete, drain, scale to zero, Helm upgrade/rollback/uninstall, apply) ask you to type the resource name, and YAML always goes through a server-side dry run first. On a read-only cluster, everything that changes something is hidden or blocked; logs, describe, shells and port forwards still work.

To be accurate about it: the guardrails are enforced in the frontend, not in the Rust backend. The policy is a pure, unit-tested TypeScript module. Menus and dialogs call it, and the service layer has a backstop for code paths that forget, which refuses mutating kubectl/Helm verbs and apply/delete calls for read-only clusters:

```ts
// src/services/Kubernetes.ts
static async kubectl(args: string[], call?: GuardedCall): Promise<string> {
  const refusal = (await backstop()).cliRefusal("kubectl", args, call);
  if (refusal) throw new Error(refusal);
  return invoke("run_kubectl", { args: args });
}
```

The built-in terminal shows a banner for protected and read-only clusters but doesn't block what you type there. The guardrails exist to stop a mistake in the UI. They are not access control. If you need a cluster to really be read-only for someone, use RBAC. Moving the read-only check into the backend commands is something I'd like to do.

<!-- image: the typed confirmation dialog on a protected cluster -->

## 5. Staying small, and testing the UI without a cluster

The 2.1.1 installers on the release page are 26 MiB for the Apple Silicon `.dmg` and 15 MiB for the Windows setup `.exe`; the `.deb` is about 27 MiB. Most of that difference with Electron-based clients comes from Tauri using the system webview (WebKit on macOS and Linux, WebView2 on Windows) instead of shipping a browser. That's a platform choice, not a clever trick on my part, and it has costs: the Linux AppImage is about 99 MiB because it bundles WebKitGTK, and a layout that looks right in one webview still needs checking in the others.

The Rust side is where the megabytes went. The AWS SDK, aws-config and rustls added about 8 MB to the app binary, and the helper grew from 1.7 to 10.7 MB stripped once it had to speak HTTPS and read AWS profiles. I chose rustls with ring instead of aws-lc so the Windows CI doesn't need cmake and NASM. `opt-level = "s"` only saved about 0.8 MB on the helper, so I didn't keep it.

For the frontend there is a budget in CI. `bundle-budget.json` limits the gzipped JavaScript and CSS that `index.html` loads before the shell renders, and `npm run size:check` fails the build when it goes over:

```json
{ "initialJsGzipKb": 191, "initialCssGzipKb": 18.5 }
```

The file's `_comment` records every increase and why (cluster names at first paint: +2 kB; the sign-in core every view reports into: +3 kB). Monaco, the terminal and the resource graph are lazy-loaded. Having to write down a reason for each kilobyte was more useful than the limit itself.

The other tool I'd recommend to anyone building a Tauri app is a **mocked-IPC harness**. `npm run harness` runs the real Vue app in a normal browser, with `mockIPC` from `@tauri-apps/api/mocks` answering every command from fixtures. That includes the watch channel: the mock sends the same `status` / `snapshot` / `delta` messages the Rust hub does. Scenarios are query parameters: `?scenario=large` (5,000 pods with a stream of changes), `?scenario=auth-expired`, `?readonly=1`, and so on. I use it for most UI work, to reproduce bugs (the removal bug fixed in 2.1.1 was confirmed there before and after the fix), and with Playwright for the website's screenshots. The catch is that a mock can drift from the real backend.

## What I'd do differently

- **Keying.** The active-context state is still keyed by context name, not (kubeconfig, context), so two files with the same context name can't both be active. The importer renames clashes, but files you reference yourself can still run into it.
- **Less verified than I'd like.** Much of the sign-in and cloud code has only met fakes. The tests are strict about formats, but formats aren't other people's real accounts.
- **Guardrails in the backend**, as described above.

## Try it, and tell me what breaks

JET Pilot is free and MIT licensed. It isn't trying to replace k9s in a terminal, or Lens, Freelens or Headlamp if those already fit how you work; it's another option for people who want a native desktop app.

- Website and downloads: https://jet-pilot.app
- Source: https://github.com/unxsist/jet-pilot

I'd most like feedback on the parts I couldn't test myself: sign-in with your own identity provider, the cloud providers other than AWS, Windows, and very large clusters. GitHub issues are the best place for it. If you've built something similar on kube-rs or Tauri and solved these problems differently, I'd like to hear that too.
