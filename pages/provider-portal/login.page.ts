import { Page } from '@playwright/test';
import { BasePage } from '../base.page';
import { Logger } from '../../utils/logger';

export class ProviderLoginPage extends BasePage {
    // Selectors
    private readonly usernameInput = '//input[@id="userName"]';
    private readonly passwordInput = '//input[@type="password"]';
    private readonly submitButton = '//button[@type="submit"]';

    constructor(page: Page) {
        super(page);
    }

    async login(username: string, password: string): Promise<void> {
        Logger.step('Attempting to login to provider portal');
        try {
            await this.page.waitForLoadState('domcontentloaded');
            await this.page.waitForLoadState('networkidle');
            
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
} 