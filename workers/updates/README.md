# updates.jet-pilot.app

A Cloudflare Worker that serves the app's update manifest and counts how
often it's asked for, without storing anything about anyone.

- `GET /latest.json`: the manifest the website publishes at
  `www.jet-pilot.app/latest.json` (cached for five minutes). The app's
  updater and the Homebrew cask's livecheck read it.
- Every update check from the app (its updater's user agent) adds 1 to that
  day's total in D1 (`migrations/`, `src/count.ts`). The app checks when it
  starts and when someone checks by hand, so the totals follow how often
  JET Pilot is used. Nothing else is stored: no request, IP address or
  identifier, and Workers observability (request logs) is off.
- `GET /stats`: a private stats page (HTTP Basic auth: any user name, the
  `STATS_PASSWORD` secret). `GET /stats.json` returns the same numbers.

## Develop

```sh
npm ci
npm test
echo 'STATS_PASSWORD="local"' > .dev.vars
npx wrangler d1 migrations apply jet-pilot-usage --local
npm run dev        # http://localhost:8787/latest.json, /stats
```

## Deploy

`.github/workflows/deploy-updates.yml` deploys on every push to `main` that
touches this folder (and on demand), after applying new migrations, with the
`CLOUDFLARE_API_TOKEN` (limited to Workers and D1 in the account, and Workers
routes and DNS on jet-pilot.app) and `CLOUDFLARE_ACCOUNT_ID` repository
secrets. The `STATS_PASSWORD` secret is set on the Worker
(`npx wrangler secret put STATS_PASSWORD`).

`updates.jet-pilot.app` is a Workers custom domain, which can't share its name
with other DNS records: delete the zone's `updates` records right before a
deploy attaches it.

The free Workers plan allows 100,000 requests and 100,000 D1 row writes a day.
Each counted check writes one row.
