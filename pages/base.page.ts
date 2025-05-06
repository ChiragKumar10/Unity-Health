import { Page } from '@playwright/test';
import { getEnvironmentConfig } from '../config/environment.config';
import { Logger } from '../utils/logger';

export class BasePage {
    readonly page: Page;
    readonly adminPortalUrl: string;
    readonly providerPortalUrl: string;

    constructor(page: Page) {
        this.page = page;
        const config = getEnvironmentConfig();
        this.adminPortalUrl = config.adminPortalUrl;
        this.providerPortalUrl = config.providerPortalUrl;
    }

    async navigateToAdminPortal() {
        await this.page.goto(this.adminPortalUrl);
    }

    async navigateToProviderPortal() {
        await this.page.goto(this.providerPortalUrl);
    }

    async waitForElement(selector: string, timeout: number = 10000) {
        await this.page.waitForSelector(selector, { timeout });
    }

    protected async click(selector: string): Promise<void> {
        try {
            await this.waitForElement(selector);
            await this.page.click(selector);
        } catch (error) {
            Logger.error(`Failed to click element with selector: ${selector}`, error as Error);
            throw error;
        }
    }

    protected async fill(selector: string, value: string): Promise<void> {
        try {
            await this.waitForElement(selector);
            await this.page.fill(selector, value);
        } catch (error) {
            Logger.error(`Failed to fill element with selector: ${selector}`, error as Error);
            throw error;
        }
    }

    protected async getText(selector: string): Promise<string> {
        try {
            await this.waitForElement(selector);
            return await this.page.innerText(selector);
        } catch (error) {
            Logger.error(`Failed to get text from element with selector: ${selector}`, error as Error);
            throw error;
        }
    }

    protected async isVisible(selector: string): Promise<boolean> {
        try {
            await this.page.waitForSelector(selector, { state: 'visible', timeout: 5000 });
            return true;
        } catch {
            return false;
        }
    }
} 