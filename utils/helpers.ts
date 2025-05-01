import { Page } from '@playwright/test';

export class Helpers {
    static async takeScreenshot(page: Page, name: string) {
        await page.screenshot({ 
            path: `./reports/screenshots/${name}-${Date.now()}.png`,
            fullPage: true 
        });
    }

    static generateRandomString(length: number): string {
        return Math.random().toString(36).substring(2, length + 2);
    }

    static generateRandomEmail(): string {
        return `test.${this.generateRandomString(8)}@example.com`;
    }

    static async waitForNetworkIdle(page: Page, timeout: number = 5000) {
        await page.waitForLoadState('networkidle', { timeout });
    }

    static formatDate(date: Date): string {
        return date.toISOString().split('T')[0];
    }
} 