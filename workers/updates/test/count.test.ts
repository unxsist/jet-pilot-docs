import { describe, expect, it } from "vitest";
import { isUpdateCheck } from "../src/count";

const check = (userAgent?: string) => isUpdateCheck(new Headers(userAgent ? { "User-Agent": userAgent } : {}));

describe("isUpdateCheck", () => {
  it("counts the app's updater", () => {
    expect(check("tauri-plugin-updater/2.13.1")).toBe(true);
  });

  it("does not count browsers, crawlers or Homebrew", () => {
    expect(check("Mozilla/5.0")).toBe(false);
    expect(check("Homebrew/4.6.0 curl/8.7.1")).toBe(false);
    expect(check()).toBe(false);
  });
});
