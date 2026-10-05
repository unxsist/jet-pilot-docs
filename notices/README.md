# Reaching installed versions

Two ways to tell users something without shipping a release. Both go live when
the site deploys (on every push to `main`, and after every JET Pilot release).

## `public/announcements.json`: the announcements feed

JET Pilot 1.39 and newer fetch `https://www.jet-pilot.app/announcements.json` on
every launch and show the announcements meant for them in a dialog. Target a
version range and/or platforms, e.g. to reach a release whose updater is broken:

```json
{
  "announcements": [
    {
      "id": "2026-11-broken-updater",
      "title": "Update JET Pilot by hand",
      "body": "This version can't install updates itself. Download the latest version from [jet-pilot.app](https://www.jet-pilot.app).",
      "severity": "critical",
      "platforms": ["macos"],
      "minVersion": "1.40.0",
      "maxVersion": "1.40.2",
      "expiresAt": "2027-01-01",
      "link": { "label": "Download", "url": "https://www.jet-pilot.app" }
    }
  ]
}
```

Only `id`, `title` and `body` (Markdown) are required.

- `id` must be unique and never reused.
- `severity` is `info` (the default), `warning` or `critical`. Users dismiss
  `info` and `warning` announcements for good. A `critical` announcement comes
  back on every launch until the app is out of its version range.
- `platforms` takes `macos`, `windows` and `linux`.
- `minVersion` and `maxVersion` are inclusive.
- `expiresAt` hides the announcement from that date on.
- `link.url` must be `https://`.

Malformed entries are skipped. The format lives in `src/lib/announcements.ts` in
unxsist/jet-pilot.

## `notices/update-notice.md`: the update dialog notes

Every JET Pilot version shows the release notes from `latest.json` in its update
dialog, including versions from before the announcements feed. On deploy,
`scripts/patch-update-manifest.mjs` puts this file above those notes. Use it for
what all clients updating to the latest release should read. Leave it empty
when there's nothing to say.
