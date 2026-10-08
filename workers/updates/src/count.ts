/*
 * Whether a request is an update check from the app. The app checks for
 * updates when it starts (unless that's turned off) and when asked to, so the
 * number of checks a day roughly follows how often JET Pilot is started. The
 * app's updater (tauri-plugin-updater) names itself in its user agent;
 * browsers, crawlers and Homebrew's livecheck aren't counted.
 */
const UPDATER = /^tauri-plugin-updater\//;

export const isUpdateCheck = (headers: Headers) => UPDATER.test(headers.get("user-agent") ?? "");
