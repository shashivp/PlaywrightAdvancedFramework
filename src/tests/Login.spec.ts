import { test, expect } from '@playwright/test';
import { LoginPage } from '@pages/LoginPage';
import { createLogger } from '@utils/logger';

const log = createLogger('login.spec');

/**
 * TTACart - Login Tests
 * 
 * Test Suite: Login functionality for TTACart application
 * Target URL: https://app.thetestingacademy.com
 * 
 * Test Cases:
 * - Valid login with standard user credentials
 * - Verify login form is hidden after successful login
 * - Invalid login with wrong credentials
 * - Error message validation
 */
test.describe('TTACart - Login', () => {
    let loginPage: LoginPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        await test.step('Navigate to login page', async () => {
            log.info('Navigating to the TTACart login page');
            await loginPage.open();
        });
    });

    test('should login successfully with valid credentials @p0', async ({ page }) => {
        await test.step('Enter credentials and submit login form', async () => {
            log.info('Logging in as standard_user');
            await loginPage.loginAs('standard_user', 'tta_secret');
        });

        await test.step('Verify login was successful', async () => {
            log.info('Verifying login form is hidden after successful login');
            await expect(page.locator('[data-test="login-button"]')).toBeHidden();
            log.info('✓ Login successful - login button is hidden');
        });
    });

    test('should display error message with invalid credentials @p1', async ({ page }) => {
        await test.step('Enter invalid credentials', async () => {
            log.info('Attempting login with invalid credentials');
            await loginPage.loginAs('invalid_user', 'wrong_password');
        });

        await test.step('Verify error message is displayed', async () => {
            log.info('Verifying error message is shown for invalid credentials');
            const errorBox = page.locator('[data-test="error"]');
            await expect(errorBox).toBeVisible();
            log.info('✓ Error message displayed correctly');
        });
    });
});