import { test, expect } from '@playwright/test';
import { AdminUsersPage } from '../../pages/admin-portal/admin-users.page';
import { AdminLoginPage } from '../../pages/admin-portal/login.page';
import { Logger } from '../../utils/logger';

test.describe('Admin Users Management', () => {
    let adminUsersPage: AdminUsersPage;
    let adminLoginPage: AdminLoginPage;
    const timestamp = Date.now();
    const uniqueEmail = `test${timestamp}@example.com`;
    // Generate a random string of letters for username
    const uniqueUsername = `testadmin${Math.random().toString(36).replace(/[0-9]/g, '').slice(-5)}`;
    const uniquePhone = `1${timestamp.toString().slice(-9)}`; // Creates a 10-digit number starting with 1

    test.beforeEach(async ({ page }) => {
        Logger.step('Setting up test environment');
        adminLoginPage = new AdminLoginPage(page);
        adminUsersPage = new AdminUsersPage(page);
        
        // Login to admin portal
        await adminLoginPage.navigate();
        await adminLoginPage.login('superadmin', 'Pass@1234');
        
        // Wait for navigation to complete
        await page.waitForLoadState('networkidle');
        
        // Navigate to admin users page
        await adminUsersPage.navigateToAdminUsers();
        await page.waitForLoadState('networkidle');
    });

    test('should add and delete an admin user', async ({ page }) => {
        try {
            Logger.step('Starting admin user management test');
            
            // Click Add Admin User button
            await adminUsersPage.clickAddAdminUser();
            
            // Add new admin user
            await adminUsersPage.fillAdminUserForm(
                'Test',
                'User',
                uniqueUsername,
                uniquePhone,
                uniqueEmail
            );
            
            // Save the admin user
            await adminUsersPage.saveAdminUser();
            await page.waitForLoadState('networkidle');
            
            // Verify user is added
            const isUserAdded = await adminUsersPage.verifyAdminUserInList(uniqueEmail);
            expect(isUserAdded).toBeTruthy();
            
            // Click action button and delete user
            await adminUsersPage.clickActionButton(uniqueEmail);
            await page.waitForTimeout(1000); // Wait for action menu to appear
            await adminUsersPage.deleteAdminUser(uniqueEmail);
            await page.waitForLoadState('networkidle');
            
            // Verify user is deleted
            const isUserDeleted = await adminUsersPage.verifyAdminUserInList(uniqueEmail);
            expect(isUserDeleted).toBeFalsy();
            
            Logger.info('Admin user management test completed successfully');
        } catch (error) {
            Logger.error('Admin user management test failed', error as Error);
            throw error;
        }
    });
}); 