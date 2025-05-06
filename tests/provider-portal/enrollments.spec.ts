import { test, expect } from '@playwright/test';
import { ProviderLoginPage } from '../../pages/provider-portal/login.page';
import { ProviderEnrollmentsPage } from '../../pages/provider-portal/enrollments.page';
import { Logger } from '../../utils/logger';

test.describe('Provider Portal Enrollments', () => {
    let loginPage: ProviderLoginPage;
    let enrollmentsPage: ProviderEnrollmentsPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new ProviderLoginPage(page);
        enrollmentsPage = new ProviderEnrollmentsPage(page);
        
        // Navigate to provider portal
        await page.goto('https://automation.qa.unityhealth360.com/');
        
        // Login with valid credentials
        await loginPage.login('automation', 'Test@123');
        
        // Wait for navigation to complete
        await page.waitForLoadState('networkidle');
    });

    test('should navigate to enrollments and open add enrollment form', async ({ page }) => {
        Logger.step('Starting enrollment navigation test');
        
        // Navigate to enrollments section
        await enrollmentsPage.navigateToEnrollments();
        
        // Verify Add Enrollment button is visible
        const isButtonVisible = await enrollmentsPage.isAddEnrollmentButtonVisible();
        expect(isButtonVisible).toBeTruthy();
        
        // Click add enrollment button
        await enrollmentsPage.clickAddEnrollment();
        
        // Verify enrollment form is visible
        const isFormVisible = await page.isVisible('//h5[text()="NEW ENROLLMENT"]');
        expect(isFormVisible).toBeTruthy();
        
        Logger.info('Enrollment navigation test completed successfully');
    });
}); 