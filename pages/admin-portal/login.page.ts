import { Page } from '@playwright/test';
import { BasePage } from '../base.page';
import { Logger } from '../../utils/logger';

export class AdminLoginPage extends BasePage {
    private readonly usernameInput = '//input[@name="userName"]';
    private readonly passwordInput = '//input[@type="password"]';
    private readonly submitButton = '//button[@type="submit"]';
    private readonly errorMessage = '//div[contains(@class, "MuiAlert-message") or contains(@class, "error-message") or contains(@class, "MuiFormHelperText-root")]';

    constructor(page: Page) {
        super(page);
    }

    async login(username: string, password: string): Promise<void> {
        Logger.step('Attempting to login');
        try {
            await this.page.fill(this.usernameInput, username);
            await this.page.fill(this.passwordInput, password);
            await this.page.click(this.submitButton);
            await this.page.waitForLoadState('networkidle');
            Logger.info('Login attempt completed');
        } catch (error) {
            Logger.error('Failed to login', error as Error);
            throw error;
        }
    }

    async isErrorMessageVisible(): Promise<boolean> {
        try {
            // Wait for either an error message or successful navigation
            await Promise.race([
                this.page.waitForSelector(this.errorMessage, { state: 'visible', timeout: 10000 }),
                this.page.waitForURL(/.*admin\/groups/, { timeout: 10000 })
            ]);
            
            // Check if we're still on the login page (which means there was an error)
            const currentUrl = this.page.url();
            return !currentUrl.includes('/admin/groups');
        } catch {
            return false;
        }
    }
} 