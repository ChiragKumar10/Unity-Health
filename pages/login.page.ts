import { Page } from '@playwright/test';
import { BasePage } from './base.page';
import { Logger } from '../utils/logger';

export class LoginPage extends BasePage {
    // Selectors
    private readonly usernameInput = '#username, input[name="username"], input[type="text"]';
    private readonly passwordInput = '#password, input[name="password"], input[type="password"]';
    private readonly loginButton = 'button[type="submit"], button:has-text("Login"), input[type="submit"]';
    private readonly errorMessage = '.error-message, .alert-error, .error';

    constructor(page: Page) {
        super(page);
    }

    async waitForPageLoad() {
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForLoadState('domcontentloaded');
    }

    async login(username: string, password: string) {
        Logger.step('Attempting to login');
        try {
            await this.waitForPageLoad();
            
            // Wait for form to be interactive
            await this.page.waitForSelector(this.usernameInput, { state: 'visible', timeout: 10000 });
            
            await this.fill(this.usernameInput, username);
            await this.fill(this.passwordInput, password);
            await this.click(this.loginButton);
            
            Logger.info('Login attempt completed');
        } catch (error) {
            Logger.error('Login failed', error as Error);
            throw error;
        }
    }

    async isErrorMessageVisible(): Promise<boolean> {
        return await this.isVisible(this.errorMessage);
    }

    async getErrorMessage(): Promise<string> {
        return await this.getText(this.errorMessage);
    }

    async navigateToLogin() {
        await this.page.goto('/auth/login');
        await this.page.waitForLoadState('networkidle');
    }

    async loginWithEmail(email: string, password: string) {
        await this.page.fill(this.emailInput, email);
        await this.page.fill(this.passwordInput, password);
        await this.page.click(this.loginButton);
        await this.page.waitForLoadState('networkidle');
    }
} 