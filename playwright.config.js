const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './verification',
  use: {
    headless: true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
});
