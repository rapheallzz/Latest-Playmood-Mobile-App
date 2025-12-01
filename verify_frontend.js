const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    args: ['--disable-web-security']
  });
  const page = await browser.newPage();

  page.on('console', msg => console.log('PAGE LOG:', msg.text()));

  try {
    await page.goto('http://localhost:8081', { waitUntil: 'networkidle' });
    console.log('Navigated to localhost:8081');

    // Wait for the "Welcome to Playmood" screen and click "Sign In"
    await page.waitForSelector('text=Welcome to Playmood');
    console.log('Welcome screen found');
    await page.click('text=Sign In');
    console.log('Clicked Sign In on welcome screen');

    // Wait for the login form to appear
    await page.waitForSelector('input[placeholder="Email"]');
    console.log('Login form found');

    // Fill in the login form
    await page.fill('input[placeholder="Email"]', 'rightsortace@gmail.com');
    await page.fill('input[placeholder="Password"]', 'Password@#1234');
    console.log('Filled in login form');

    // Click the final "Login" button
    await page.click('text=Login');
    console.log('Clicked Login on login form');

    await page.waitForNavigation({ waitUntil: 'networkidle' });

    await page.screenshot({ path: 'final_screenshot.png' });
    console.log('Took final screenshot');

  } catch (error) {
    console.error('An error occurred:', error);
    await page.screenshot({ path: 'error.png' });
  } finally {
    await browser.close();
  }
})();
