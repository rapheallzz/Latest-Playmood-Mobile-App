const { test, expect } = require('@playwright/test');

test('Login and Registration Screen Flow', async ({ page }) => {
  await page.goto('http://localhost:8081');

  // Capture a screenshot of the initial screen
  await page.screenshot({ path: 'screenshots/01_initial_screen.png' });

  // Navigate to the Login screen
  await page.click('text="Sign In"');
  await page.waitForSelector('text="Login"');

  // Capture a screenshot of the Login screen
  await page.screenshot({ path: 'screenshots/02_login_screen.png' });

  // Test inline validation for email
  await page.fill('input[placeholder="Email"]', 'invalid-email');
  expect(await page.isVisible('text=Invalid email address')).toBe(true);

  // Test inline validation for password
  await page.fill('input[placeholder="Password"]', 'short');
  expect(await page.isVisible('text=Password must be at least 8 characters')).toBe(true);

  // Navigate to the Registration screen
  await page.click('text="Create an Account"');
  await page.waitForSelector('text="Register"');

  // Capture a screenshot of the Registration screen
  await page.screenshot({ path: 'screenshots/03_registration_screen.png' });

  // Test inline validation for email
  await page.locator('input[placeholder="Email"]').last().fill('invalid-email');
  await expect(page.locator('text=Invalid email address').last()).toBeVisible();

  // Test inline validation for password
  await page.locator('input[placeholder="Password"]').last().fill('short');
  await expect(page.locator('text=Password must be at least 8 characters').last()).toBeVisible();
});
