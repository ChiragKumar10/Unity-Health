import { test, expect } from '@playwright/test';
import { ProviderLoginPage } from '../../pages/provider-portal/login.page';

test.describe('Provider Portal Login', () => {
    let loginPage: ProviderLoginPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new ProviderLoginPage(page);
    });

    test('should login to provider portal and navigate to work list', async ({ page }) => {
        // Navigate to provider portal
        await page.goto('https://automation.qa.unityhealth360.com/');
        
        // Login with valid credentials
        await loginPage.login('automation', 'Test@123');
        
        // Verify successful login by checking work list URL
        await expect(page).toHaveURL(/.*work-list/);
        
        // Additional verification that we're on the work list page
        await expect(page.locator('text=Provider Work List')).toBeVisible();
    });
}); 