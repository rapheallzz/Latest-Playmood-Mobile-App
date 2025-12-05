
import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        try:
            await page.goto("http://localhost:8081")
            await page.locator('text="Sign In"').click()
            await page.wait_for_selector('input[type="email"]')

            await page.locator('input[type="email"]').fill("test@test.com")
            await page.locator('input[type="password"]').fill("123")
            await page.locator('div:has-text("Login")').nth(4).click()

            # Take a screenshot after the login click
            await page.screenshot(path="after_login_click.png")

            await page.wait_for_url("**/home", timeout=60000) # Increased timeout
            await page.locator('text="Upload"').click()
            await page.wait_for_url("**/upload")

            print("Successfully navigated to the upload screen.")
            await page.screenshot(path="upload_screen.png")

        except Exception as e:
            print(f"An error occurred: {e}")
            await page.screenshot(path="error_screenshot.png")
        finally:
            await browser.close()

if __name__ == "__main__":
    asyncio.run(main())
