
import asyncio
from playwright.async_api import async_playwright, expect

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()
        try:
            await page.goto("http://localhost:8081")
            await page.wait_for_load_state('networkidle')

            # Navigate to the Login screen
            await page.get_by_role("button", name="Sign In").click()

            # Fill in the login form
            await page.get_by_label("Email").fill("test@test.com")
            await page.get_by_label("Password").fill("password")
            await page.get_by_role("button", name="Login").click()

            # Verify successful login by checking for the Logout button
            logout_button = page.get_by_role("button", name="Logout")
            await expect(logout_button).to_be_visible(timeout=10000)
            print("Login successful, user is on the authenticated screen.")

            # Logout
            await logout_button.click()

            # Verify successful logout by checking for the Sign In button
            signin_button = page.get_by_role("button", name="Sign In")
            await expect(signin_button).to_be_visible(timeout=10000)
            print("Logout successful, user is on the unauthenticated screen.")

            await page.screenshot(path="final_screenshot.png")
            print("Test passed: Login and logout flow completed successfully.")

        except Exception as e:
            print(f"An error occurred: {e}")
            await page.screenshot(path="error_screenshot.png")
        finally:
            await browser.close()

if __name__ == "__main__":
    asyncio.run(main())
