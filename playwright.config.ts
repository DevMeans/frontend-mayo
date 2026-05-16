import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 120000,
  expect: {
    timeout: 15000
  },
  fullyParallel: false,
  workers: 1,
  reporter: 'list',
  use: {
    baseURL: 'http://127.0.0.1:4200',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'off',
    headless: true,
    channel: 'chrome'
  },
  webServer: [
    {
      command: 'npm run dev --prefix ../backend',
      url: 'http://127.0.0.1:3000',
      reuseExistingServer: true,
      timeout: 120000
    },
    {
      command: 'npm start -- --host 127.0.0.1 --port 4200',
      url: 'http://127.0.0.1:4200',
      reuseExistingServer: true,
      timeout: 120000
    }
  ]
});
