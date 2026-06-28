import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',

  // Store visual baselines under tests/snapshots/ instead of next to the spec.
  snapshotPathTemplate: 'tests/snapshots/{projectName}/{arg}{ext}',

  use: {
    baseURL: 'http://localhost:5173',
    viewport: { width: 1280, height: 800 },
  },

  // Make screenshots deterministic across runs/machines.
  expect: {
    toHaveScreenshot: {
      animations: 'disabled',
    },
  },

  // Start the Vite dev server for the tests.
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: true,
    timeout: 120000,
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
