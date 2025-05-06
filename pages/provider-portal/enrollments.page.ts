import { Page } from '@playwright/test';
import { BasePage } from '../base.page';
import { Logger } from '../../utils/logger';

export class ProviderEnrollmentsPage extends BasePage {
    // Selectors
    private readonly enrollmentsMenu = 'text=Enrollments';
    private readonly addEnrollmentButton = 'button:has-text("Add Enrollment")';
    private readonly enrollmentForm = '//h5[text()="NEW ENROLLMENT"]';
    private readonly patientNameLink = '//div[@class="MuiBox-root css-uiztjl"]';
    private readonly patientChartName = '//h5[@class="MuiTypography-root MuiTypography-h5 css-1yaslnx"]';
    private readonly chatInput = '//textarea[@placeholder="Type your message..."]';
    private readonly sendMessageButton = '//button[@class="MuiButtonBase-root MuiIconButton-root MuiIconButton-sizeMedium css-1ox5szl"]';

    constructor(page: Page) {
        super(page);
    }

    async navigateToEnrollments() {
        Logger.step('Navigating to Enrollments section');
        try {
            await this.page.waitForLoadState('networkidle');
            await this.page.waitForSelector(this.enrollmentsMenu, { state: 'visible', timeout: 10000 });
            await this.click(this.enrollmentsMenu);
            await this.page.waitForLoadState('networkidle');
            Logger.info('Successfully navigated to Enrollments section');
        } catch (error) {
            Logger.error('Failed to navigate to Enrollments section', error as Error);
            throw error;
        }
    }

    async isAddEnrollmentButtonVisible(): Promise<boolean> {
        Logger.step('Checking if Add Enrollment button is visible');
        try {
            const isVisible = await this.isVisible(this.addEnrollmentButton);
            Logger.info(`Add Enrollment button is ${isVisible ? 'visible' : 'not visible'}`);
            return isVisible;
        } catch (error) {
            Logger.error('Failed to check Add Enrollment button visibility', error as Error);
            return false;
        }
    }

    async clickAddEnrollment() {
        Logger.step('Clicking Add Enrollment button');
        try {
            const isButtonVisible = await this.isAddEnrollmentButtonVisible();
            if (!isButtonVisible) {
                throw new Error('Add Enrollment button is not visible');
            }

            await this.click(this.addEnrollmentButton);
            await this.page.waitForSelector(this.enrollmentForm, { state: 'visible', timeout: 10000 });
            await this.page.waitForLoadState('networkidle');
            Logger.info('Add Enrollment form opened');
        } catch (error) {
            Logger.error('Failed to open Add Enrollment form', error as Error);
            throw error;
        }
    }

    async selectPatientByName(patientName: string) {
        Logger.step(`Selecting patient: ${patientName}`);
        try {
            const patientLink = this.page.locator(`${this.patientNameLink}[text()="${patientName}"]`);
            await patientLink.click();
            await this.page.waitForLoadState('networkidle');
            Logger.info(`Successfully selected patient: ${patientName}`);
        } catch (error) {
            Logger.error(`Failed to select patient: ${patientName}`, error as Error);
            throw error;
        }
    }

    async getPatientChartName(): Promise<string> {
        Logger.step('Getting patient name from chart');
        try {
            const nameElement = await this.page.waitForSelector(this.patientChartName, { state: 'visible', timeout: 10000 });
            const name = await nameElement.textContent();
            Logger.info(`Patient name in chart: ${name}`);
            return name || '';
        } catch (error) {
            Logger.error('Failed to get patient name from chart', error as Error);
            throw error;
        }
    }

    async sendChatMessage(message: string): Promise<void> {
        Logger.step(`Sending chat message: ${message}`);
        try {
            await this.page.waitForSelector(this.chatInput, { state: 'visible', timeout: 10000 });
            await this.page.fill(this.chatInput, message);
            await this.page.click(this.sendMessageButton);
            await this.page.waitForLoadState('networkidle');
            Logger.info('Message sent successfully');
        } catch (error) {
            Logger.error('Failed to send chat message', error as Error);
            throw error;
        }
    }
} 