import { test, expect } from '@playwright/test';
import { ProviderLoginPage } from '../../pages/provider-portal/login.page';
import { ProviderEnrollmentsPage } from '../../pages/provider-portal/enrollments.page';
import { Logger } from '../../utils/logger';

test.describe('Provider Portal Patient Chart', () => {
    let loginPage: ProviderLoginPage;
    let enrollmentsPage: ProviderEnrollmentsPage;
    const testPatientName = 'Automation';

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

    test('should navigate to patient chart and verify patient name', async () => {
        Logger.step('Starting patient chart navigation test');
        
        // Navigate to enrollments section
        await enrollmentsPage.navigateToEnrollments();
        
        // Select patient by name
        await enrollmentsPage.selectPatientByName(testPatientName);
        
        // Get and verify patient name in chart
        const chartPatientName = await enrollmentsPage.getPatientChartName();
        expect(chartPatientName).toContain(testPatientName);
        
        Logger.info('Patient chart navigation test completed successfully');
    });
}); 