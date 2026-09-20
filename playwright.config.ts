import { defineConfig } from '@playwright/test'

// End-to-end tests run against the production build served under a GitHub Pages–style
// base path, so they also prove asset paths and direct hash links work when deployed.
const PORT = 4173
const BASE_PATH = 'state-quest'

export default defineConfig({
  testDir: 'tests/e2e',
  timeout: 45_000,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  reporter: [['list']],
  use: {
    baseURL: `http://localhost:${PORT}/${BASE_PATH}/`,
    // Use the Chrome already installed on the machine; CI installs it with `npx playwright install chrome`.
    channel: 'chrome',
    // Traces snapshot the DOM, including each preview frame's inline runtime, and slow the run down.
    trace: 'off',
    screenshot: 'only-on-failure',
  },
  webServer: {
    command: `npm run build && npm run preview -- --port ${PORT} --strictPort`,
    url: `http://localhost:${PORT}/${BASE_PATH}/`,
    env: { BASE_PATH },
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
})
