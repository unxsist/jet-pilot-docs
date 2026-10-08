# updates.jet-pilot.app

A Cloudflare Worker that serves the app's update manifest and counts how many
installs are in use, without storing anything about a single install.

- `GET /latest.json`: the manifest the website publishes at
  `www.jet-pilot.app/latest.json` (cached for five minutes). The app's
  updater and the Homebrew cask's livecheck read it.
- Every update check from the app adds 1 to a few daily totals in D1
  (`migrations/`, `src/count.ts`). The app's startup check (jet-pilot
  `src/lib/usage.ts`) sends its version, platform and whether it is the
  install's first check today, this ISO week or this month; summing those
  flags gives daily, weekly and monthly active installs. Checks without the
  headers (versions before 2.1, installs that turned counting off, manual
  checks) are counted as `plain`. No request, IP address or identifier is
  stored, and Workers observability (request logs) is off.
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
touches this folder (and on demand), after applying new migrations. One-time
setup:

1. `npx wrangler login`, then `npx wrangler d1 create jet-pilot-usage` and put
   the database id in `wrangler.jsonc`.
2. `npx wrangler secret put STATS_PASSWORD`.
3. Add the `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` repository
   secrets.
4. `updates.jet-pilot.app` is a Workers custom domain, so the jet-pilot.app
   zone must be on Cloudflare. Delete any existing `updates` DNS record before
   the first deploy; Cloudflare creates its own.

The free Workers plan allows 100,000 requests and 100,000 D1 row writes a day.
A counted check writes up to four rows.
