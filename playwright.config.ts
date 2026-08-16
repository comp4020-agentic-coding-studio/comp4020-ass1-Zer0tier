import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  testMatch: "**/*.pw.ts",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? "github" : "line",
  use: {
    baseURL: "http://127.0.0.1:4321/comp4020-ass1-Zer0tier/",
    trace: "retain-on-failure",
  },
  webServer: {
    command: "pnpm preview --host 127.0.0.1 --port 4321",
    url: "http://127.0.0.1:4321/comp4020-ass1-Zer0tier/",
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },
});
