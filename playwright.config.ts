import { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
  testDir: './tests',
  timeout: 60000,
  expect: {
    timeout: 10000,
  },
  retries: 0,
  use: {
    baseURL: 'http://localhost:3000',
    headless: false,
    viewport: { width: 1280, height: 720 },
    screenshot: 'only-on-failure',
    ignoreHTTPSErrors: true,
    actionTimeout: 15000,
    navigationTimeout: 30000,
  },
};

export default config; 