/* FAQ content, shared by the FAQ section and the FAQPage structured data. */
export const faqs = [
  {
    q: "Is JET Pilot really free?",
    a: `Yes. JET Pilot is open source under the MIT licence. There is no paid tier, no trial and no account — download it and go.`,
  },
  {
    q: "macOS says JET Pilot is “damaged” or can’t be opened. What now?",
    a: `Nothing is wrong with the app: JET Pilot isn’t notarized by Apple, so macOS quarantines it after download. Open Terminal and run <code>xattr -dr com.apple.quarantine "/Applications/JET Pilot.app"</code> once. Auto-updates keep working afterwards. Installing with Homebrew (<code>brew install --cask unxsist/tap/jet-pilot</code>) takes care of this for you.`,
  },
  {
    q: "Windows SmartScreen warns me about the installer.",
    a: `The Windows installers aren’t code-signed, so SmartScreen may show a warning the first time. Click <strong>More info</strong> and then <strong>Run anyway</strong>.`,
  },
  {
    q: "How do I run the AppImage on Linux?",
    a: `Make it executable first with <code>chmod +x JET.Pilot_*.AppImage</code>, then run it. Prefer packages? Use the .deb (Debian, Ubuntu) or .rpm (Fedora, RHEL) instead.`,
  },
  {
    q: "What do I need to connect to my clusters?",
    a: `A kubeconfig, or a cloud account. JET Pilot finds the kubeconfig files you already have, and from 2.0 it connects AWS, Google Cloud, Azure, DigitalOcean, Akamai, Civo, Scaleway, Vultr and Exoscale and finds the clusters in them. You can also paste a kubeconfig, import a file or enter a cluster by hand. It needs <code>kubectl</code> (plus <code>helm</code> for the Helm views); if you don’t have them, Settings › Advanced downloads checksum-verified copies. It works with any conformant cluster you can reach, including exec-plugin and SSO sign-ins such as kubelogin, AWS IAM Identity Center, gcloud and az.`,
  },
  {
    q: "How does signing in work?",
    a: `When a session runs out, JET Pilot shows a quiet notice and lets you sign in without leaving the app: device codes and sign-in links show up in a dialog, and your views, log streams and port forwards reconnect on their own. Background checks never start a sign-in, so no browser window opens out of nowhere.`,
  },
  {
    q: "Can I use several clusters and kubeconfig files at once?",
    a: `Yes. JET Pilot finds <code>~/.kube/config</code>, <code>$KUBECONFIG</code>, <code>~/.kube/*.yaml</code> and <code>~/.kube/config.d</code>, and the Clusters hub lists every context in them. Select several contexts and namespaces together: tables aggregate everything and show Context and Namespace columns so you always know where a resource lives.`,
  },
  {
    q: "How does JET Pilot stay up to date with my cluster?",
    a: `From v1.37, lists stream changes from the Kubernetes API through watches instead of polling <code>kubectl</code>. Changes show up in a fraction of a second — about 200 ms from scaling a Deployment to the update on screen in our tests against a real kube-apiserver — and coming back to a view is instant.`,
  },
  {
    q: "Can I use my VS Code theme?",
    a: `Yes. From v1.38, JET Pilot imports VS Code colour themes (JSONC and <code>include</code> chains too), Sublime Text <code>.sublime-color-scheme</code> files and TextMate <code>.tmTheme</code> files. Drop the file on Settings › Appearance, or install a theme from the Open VSX gallery inside the app. The workbench colours become JET Pilot’s palette, <code>tokenColors</code> colour the YAML editor and <code>terminal.ansi*</code> the terminal. Want to see it first? <a href="/themes/#try">Preview your theme on the website</a> — it’s converted in your browser.`,
  },
  {
    q: "Why only MIT-licensed themes from Open VSX?",
    a: `JET Pilot is MIT licensed, and we want everything it downloads and installs for you to fit that licence without reviewing extensions one by one. So the gallery only installs extensions whose licence is MIT, or allows MIT (such as <code>MIT OR Apache-2.0</code>). That still covers most popular themes — Catppuccin, Dracula, GitHub, Tokyo Night and many more. A theme under another licence isn’t blocked: you can import a file you already have yourself.`,
  },
  {
    q: "Does JET Pilot modify my kubeconfig?",
    a: `No. It reads your kubeconfig files and only writes to one when you export a cluster into it (after making a backup). Clusters you add in JET Pilot go into its own kubeconfig, <code>~/.kube/jet-pilot/config</code>, with their tokens and keys in your system keychain. The built-in terminal uses a temporary, owner-only kubeconfig that contains just the current context.`,
  },
  {
    q: "Do clusters I add in JET Pilot work in kubectl and k9s?",
    a: `Yes. JET Pilot’s kubeconfig gets credentials through a small helper, <code>jetpilot-auth</code>, so <code>KUBECONFIG=~/.kube/config:~/.kube/jet-pilot/config kubectl get pods</code> works, and so does k9s. Settings › Advanced shows the line to copy.`,
  },
  {
    q: "Does JET Pilot collect any data?",
    a: `No. There is no account, no analytics and no telemetry in the app. It talks to your clusters, and to the cloud accounts you connect, with your own credentials, and checks for updates.`,
  },
  {
    q: "How do updates work?",
    a: `JET Pilot has a built-in updater that checks for new versions and installs them for you. Homebrew users can also run <code>brew upgrade --cask unxsist/tap/jet-pilot</code>.`,
  },
  {
    q: "What is it built with?",
    a: `Rust and Tauri 2 for the native app, Vue 3 and TypeScript for the interface. Because Tauri uses the operating system’s own webview, installers stay around 20 MB.`,
  },
];

export const faqJsonLd = () =>
  JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a.replace(/<[^>]+>/g, "") },
    })),
  });
