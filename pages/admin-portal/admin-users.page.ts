import { Page } from '@playwright/test';
import { BasePage } from '../base.page';
import { Logger } from '../../utils/logger';
import { AdminLoginPage } from './login.page';

export class AdminUsersPage extends BasePage {
    // Selectors
    private readonly settingsMenu = 'text=Settings';
    private readonly adminUsersMenu = 'text=Admin Users';
    private readonly addAdminUserButton = 'button:has-text("Add Admin User")';
    
    // Admin User Form selectors
    private readonly firstNameInput = '#firstName';
    private readonly lastNameInput = '#lastName';
    private readonly userNameInput = '#userName';
    private readonly countrySelect = '#country-select-demo';
    private readonly phoneInput = '#phone';
    private readonly emailInput = '#emailId';
    private readonly profilePhotoInput = '#image-upload-input-profilePhoto';
    private readonly saveButton = 'button:has-text("Save")';
    
    // Admin Users List selectors
    private readonly adminUsersTable = '[role="grid"]';
    private readonly adminUserRow = '[role="row"]:not([class*="MuiDataGrid-columnHeaders"])';
    private readonly actionButton = "button[aria-label='actions']";
    private readonly deleteMenuItem = "xpath=//button[text()='Delete']";
    private readonly successMessage = '.MuiAlert-message:has-text("successfully")';

    // Store user details
    private currentUserFirstName: string = '';
    private currentUserLastName: string = '';

    constructor(page: Page) {
        super(page);
    }

    async navigateToAdminUsers() {
        Logger.step('Navigating to Admin Users section');
        try {
            // Wait for the page to be fully loaded
            await this.page.waitForLoadState('networkidle');
            
            // Wait for the Settings menu to be visible
            await this.page.waitForSelector(this.settingsMenu, { state: 'visible', timeout: 10000 });
            await this.click(this.settingsMenu);
            
            // Wait for the Admin Users menu to be visible
            await this.page.waitForSelector(this.adminUsersMenu, { state: 'visible', timeout: 10000 });
            await this.click(this.adminUsersMenu);
            
            await this.page.waitForLoadState('networkidle');
            Logger.info('Successfully navigated to Admin Users section');
        } catch (error) {
            Logger.error('Failed to navigate to Admin Users section', error as Error);
            throw error;
        }
    }

    async clickAddAdminUser() {
        Logger.step('Clicking Add Admin User button');
        try {
            await this.click(this.addAdminUserButton);
            await this.page.waitForLoadState('networkidle');
            Logger.info('Add Admin User form opened');
        } catch (error) {
            Logger.error('Failed to open Add Admin User form', error as Error);
            throw error;
        }
    }

    async fillAdminUserForm(
        firstName: string,
        lastName: string,
        userName: string,
        phone: string,
        email: string,
        profilePhotoPath?: string
    ): Promise<void> {
        try {
            Logger.step('Filling Admin User form');
            // Store the first name and last name
            this.currentUserFirstName = firstName;
            this.currentUserLastName = lastName;
            
            // Wait for the form to be fully loaded
            await this.page.waitForLoadState('networkidle');
            await this.page.waitForSelector(this.firstNameInput, { state: 'visible' });
            
            // Fill each field with proper waits
            await this.fill(this.firstNameInput, firstName);
            await this.page.waitForTimeout(500); // Small delay between fields
            
            await this.fill(this.lastNameInput, lastName);
            await this.page.waitForTimeout(500);
            
            await this.fill(this.userNameInput, userName);
            await this.page.waitForTimeout(500);
            
            await this.fill(this.phoneInput, phone);
            await this.page.waitForTimeout(500);
            
            await this.fill(this.emailInput, email);
            await this.page.waitForTimeout(500);

            if (profilePhotoPath) {
                await this.page.setInputFiles(this.profilePhotoInput, profilePhotoPath);
            }
            Logger.info('Admin User form filled successfully');
        } catch (error) {
            Logger.error('Failed to fill Admin User form', error as Error);
            throw error;
        }
    }

    async saveAdminUser() {
        Logger.step('Saving Admin User');
        try {
            // Wait for save button to be clickable
            await this.page.waitForSelector(this.saveButton, { state: 'visible', timeout: 10000 });
            
            // Click save and wait for network request to start
            await Promise.all([
                this.page.waitForLoadState('networkidle'),
                this.click(this.saveButton)
            ]);
            
            // Wait for success message
            await this.page.waitForSelector(this.successMessage, { 
                state: 'visible', 
                timeout: 15000 
            });
            
            Logger.info('Admin User saved successfully');
        } catch (error) {
            Logger.error('Failed to save Admin User', error as Error);
            throw error;
        }
    }

    async verifyAdminUserInList(email: string): Promise<boolean> {
        Logger.step('Verifying Admin User in list');
        try {
            // Wait for any network requests to complete
            await this.page.waitForLoadState('networkidle');
            
            // Wait for the grid to be visible and stable
            await this.page.waitForSelector(this.adminUsersTable, { state: 'visible' });
            await this.page.waitForTimeout(1000); // Wait for grid data to stabilize
            
            // Try multiple times with a delay to find the user
            for (let attempt = 0; attempt < 3; attempt++) {
                const rows = await this.page.$$(this.adminUserRow);
                for (const row of rows) {
                    const rowText = await row.textContent();
                    if (rowText?.includes(email)) {
                        Logger.info(`Admin User with email ${email} found in list`);
                        return true;
                    }
                }
                // If not found, wait a bit and try again
                await this.page.waitForTimeout(1000);
                // Refresh the grid data
                await this.page.waitForLoadState('networkidle');
            }
            
            Logger.info(`Admin User with email ${email} not found in list`);
            return false;
        } catch (error) {
            Logger.error('Failed to verify Admin User in list', error as Error);
            throw error;
        }
    }

    async clickActionButton(email: string): Promise<boolean> {
        try {
            // Wait for network to be idle
            await this.page.waitForLoadState('networkidle');
            
            // Wait for the admin users table to be visible
            await this.page.waitForSelector(this.adminUsersTable, { state: 'visible' });
            
            // Wait for user rows to be visible
            await this.page.waitForSelector(this.adminUserRow, { state: 'visible' });
            
            // Construct the full name
            const fullName = `${this.currentUserFirstName} ${this.currentUserLastName}`;
            
            // Find the action button using the provided XPath
            const actionButton = this.page.locator(`//div//span[text()='${fullName}']/..//following-sibling::div/div[@class='MuiBox-root css-7c9ulp']`).first();
            
            // Directly click the action button
            await actionButton.click();
            Logger.info(`Successfully clicked action button for user ${email}`);
            return true;
        } catch (error) {
            Logger.error(`Failed to click action button: ${error}`);
            return false;
        }
    }

    async deleteAdminUser(email: string): Promise<void> {
        Logger.step('Deleting Admin User');
        try {
            // Wait for delete button to be visible
            await this.page.waitForSelector(this.deleteMenuItem, { state: 'visible', timeout: 10000 });
            
            // Click delete and wait for network request
            await Promise.all([
                this.page.waitForLoadState('networkidle'),
                this.page.click(this.deleteMenuItem)
            ]);
            
            // Wait for success message
            await this.page.waitForSelector(this.successMessage, { state: 'visible', timeout: 10000 });
            
            // Refresh the page to ensure we have the latest data
            await this.page.reload();
            await this.page.waitForLoadState('networkidle');
            
            // Navigate back to Admin Users section
            await this.navigateToAdminUsers();
            
            Logger.info(`Admin User with email ${email} deleted successfully`);
        } catch (error) {
            Logger.error('Failed to delete Admin User', error as Error);
            throw error;
        }
    }
} 