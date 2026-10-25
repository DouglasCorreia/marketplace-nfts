import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  reporter: [['line'], ['html', { open: 'never' }]],
  use: { baseURL: 'http://127.0.0.1:5173', trace: 'retain-on-failure', ...devices['Desktop Chrome'] },
  projects: [
    { name: 'desktop-chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile-chromium', use: { ...devices['Pixel 7'] } },
  ],
  webServer: { command: 'node node_modules/vite/bin/vite.js --host 127.0.0.1', url: 'http://127.0.0.1:5173', reuseExistingServer: true, timeout: 30_000 },
})
