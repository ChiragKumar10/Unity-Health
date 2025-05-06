import { Page } from '@playwright/test';
import { BasePage } from '../base.page';
import { Logger } from '../../utils/logger';

export class ProviderLoginPage extends BasePage {
    // Selectors
    private readonly usernameInput = '//input[@name="userName"]';
    private readonly passwordInput = '//input[@type="password"]';
    private readonly submitButton = '//button[@type="submit"]';
    private readonly errorMessage = '//div[contains(@class, "MuiAlert-message") or contains(@class, "error-message") or contains(@class, "MuiFormHelperText-root")]';

    constructor(page: Page) {
        super(page);
    }

    async navigateToLogin() {
        Logger.step('Navigating to provider portal login page');
        try {
            await this.navigateToProviderPortal();
            await this.page.waitForLoadState('networkidle');
            Logger.info('Successfully navigated to provider portal login page');
        } catch (error) {
            Logger.error('Failed to navigate to provider portal login page', error as Error);
            throw error;
        }
    }

    async login(username: string, password: string): Promise<void> {
        Logger.step('Attempting to login to provider portal');
        try {
            await this.navigateToLogin();
            await this.page.waitForSelector(this.usernameInput, { state: 'visible', timeout: 10000 });
            await this.page.waitForSelector(this.passwordInput, { state: 'visible', timeout: 10000 });
            await this.page.fill(this.usernameInput, username);
            await this.page.fill(this.passwordInput, password);
            await this.page.click(this.submitButton);
            await this.page.waitForLoadState('networkidle');
            Logger.info('Login attempt completed');
        } catch (error) {
            Logger.error('Failed to login to provider portal', error as Error);
            throw error;
        }
    }

    async isErrorMessageVisible(): Promise<boolean> {
        try {
            // Wait for either an error message or successful navigation
            await Promise.race([
                this.page.waitForSelector(this.errorMessage, { state: 'visible', timeout: 10000 }),
                this.page.waitForURL(/.*worklist/, { timeout: 10000 })
            ]);
            
            // Check if we're still on the login page (which means there was an error)
            const currentUrl = this.page.url();
            return !currentUrl.includes('/worklist');
        } catch {
            return false;
        }
    }
} 