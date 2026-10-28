import { defineConfig, devices } from "@playwright/test";
import { resolve } from "node:path";

const deployedURL = process.env.PLAYWRIGHT_BASE_URL;
// A trailing slash lets relative navigation preserve the Pages project path.
const baseURL = deployedURL
  ? `${deployedURL.replace(/\/+$/, "")}/`
  : "http://localhost:5173/";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  timeout: 60_000,
  retries: 1,
  reporter: "list",
  use: {
    baseURL,
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: deployedURL
    ? undefined
    : [
        {
          command: "pnpm dev:backend",
          cwd: resolve(__dirname, ".."),
          url: "http://localhost:3000/api/checklist",
          reuseExistingServer: true,
          timeout: 30_000,
        },
        {
          command: "pnpm --dir frontend exec vite",
          cwd: resolve(__dirname, ".."),
          url: "http://localhost:5173",
          reuseExistingServer: true,
          timeout: 30_000,
        },
      ],
});
