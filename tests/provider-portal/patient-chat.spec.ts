import { test, expect } from '@playwright/test';
import { ProviderLoginPage } from '../../pages/provider-portal/login.page';
import { ProviderEnrollmentsPage } from '../../pages/provider-portal/enrollments.page';
import { Logger } from '../../utils/logger';

test.describe('Provider Portal Patient Chat', () => {
    let loginPage: ProviderLoginPage;
    let enrollmentsPage: ProviderEnrollmentsPage;
    const testPatientName = 'Automation';
    const testMessage = 'Hello, this is a test message';

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

    test('should navigate to patient chart and send a chat message', async () => {
        Logger.step('Starting patient chat test');
        
        // Navigate to enrollments section
        await enrollmentsPage.navigateToEnrollments();
        
        // Select patient by name
        await enrollmentsPage.selectPatientByName(testPatientName);
        
        // Get and verify patient name in chart
        const chartPatientName = await enrollmentsPage.getPatientChartName();
        expect(chartPatientName).toContain(testPatientName);
        
        // Send chat message
        await enrollmentsPage.sendChatMessage(testMessage);
        
        Logger.info('Patient chat test completed successfully');
    });
}); 