// This file should be moved to tests/provider-portal/vitals.spec.ts for proper organization under provider portal tests.
import { test, expect } from '@playwright/test';
import { ProviderLoginPage } from '../../pages/provider-portal/login.page';
import { ProviderEnrollmentsPage } from '../../pages/provider-portal/enrollments.page';

// Test patient name
const testPatientName = 'Automation';

test.describe('Provider Portal Vitals', () => {
  let loginPage: ProviderLoginPage;
  let enrollmentsPage: ProviderEnrollmentsPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new ProviderLoginPage(page);
    enrollmentsPage = new ProviderEnrollmentsPage(page);

    await page.goto('https://automation.qa.unityhealth360.com/');
    await loginPage.login('automation', 'Test@123');
    await page.waitForLoadState('networkidle');
    await enrollmentsPage.navigateToEnrollments();
    await enrollmentsPage.selectPatientByName(testPatientName);
    // Now you are on the patient chart page
  });

  test('Add Heart Rate vital and verify latest reading', async ({ page }) => {
    // 2. Go to Vitals section
    await page.locator("//button[text()='Vitals']").click();

    // 3. Click on Add Vital button
    await page.locator("//div[@class='MuiStack-root css-1cdqjih']/button[text()='Add Vital']").click();

    // 4. Click on dropdown and select Heart Rate using keyboard, then press Escape
    await page.locator("//input[@placeholder='Select']").click();
    await page.locator("//input[@placeholder='Select']").fill('Heart Rate');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    await page.keyboard.press('Escape'); // Close the dropdown/autocomplete

    // 5. Enter a random value between 1-100 using a unique selector
    const randomValue = Math.floor(Math.random() * 100) + 1;
    await page.locator('input#heartRate').fill(randomValue.toString());

    // 6. Click Save
    await page.locator("//button[text()='Save']").click();

    // Wait for 5 seconds to allow the UI to update
    await page.waitForTimeout(5000);

    // Reload the page to ensure the latest value is displayed
    await page.reload();

    // Go to Vitals section again
    await page.locator("//button[text()='Vitals']").click();

    // 7. Verify the Vitals card displays the latest reading using the provided XPath
    const vitalValueLocator = page.locator("//div[@class='MuiStack-root css-1pp9g65']/h6[text()='Heart Rate']/following-sibling::h5");
    await expect(vitalValueLocator).toHaveText(randomValue.toString(), { timeout: 10000 });
  });
}); 