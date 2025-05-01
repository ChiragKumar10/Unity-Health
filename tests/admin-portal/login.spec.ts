import { test, expect } from '@playwright/test';
import { AdminLoginPage } from '../../pages/admin-portal/login.page';

test.describe('Admin Portal Login Tests', () => {
    let loginPage: AdminLoginPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new AdminLoginPage(page);
    });

    test('Successful login with valid credentials', async ({ page }) => {
        // Navigate to login page
        await page.goto('https://qa.unityhealth360.com/');
        
        // Login with valid credentials
        await loginPage.login('superadmin', 'Pass@1234');
        
        // Verify successful login by checking URL
        await expect(page).toHaveURL(/.*admin\/groups/);
    });

    test('Failed login with invalid credentials', async ({ page }) => {
        // Navigate to login page
        await page.goto('https://qa.unityhealth360.com/');
        
        // Login with invalid credentials
        await loginPage.login('invalid@123', 'invalid');
        
        // Verify field-level error message
        await expect(page.locator('text=Invalid password')).toBeVisible();
    });

    test('Login with empty credentials', async ({ page }) => {
        // Navigate to login page
        await page.goto('https://qa.unityhealth360.com/');
        
        // Login with empty credentials
        await loginPage.login('', '');
        
        // Verify both required field validation messages
        await expect(page.getByText('Username is required')).toBeVisible();
        await expect(page.getByText('Password is required')).toBeVisible();
    });
}); 