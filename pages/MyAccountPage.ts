import { Page, Locator, expect } from '@playwright/test';
import { LogoutPage } from './LogoutPage'; // Import LogoutPage if needed
import { MyAccInfoPage } from './MyAccInfoPage';

export class MyAccountPage {
    private readonly page: Page;
    
    // Locators using CSS selectors
    private readonly logoutLink: Locator;
    private readonly editAccountLink: Locator;
    private readonly confirmationMsg: Locator;

    constructor(page: Page) {
        this.page = page;
        
        // Initialize locators with CSS selectors
        this.logoutLink = page.locator('#column-right a:has-text("Logout")');
        this.editAccountLink = page.locator('#column-right a:has-text("Edit Account")');
        this.confirmationMsg = page.locator('.alert.alert-success.alert-dismissible');
    }

    /**
     * Verifies if My Account page is displayed
     * @returns Promise<boolean> 
     */
    async isPageLoaded(): Promise<boolean> {
        let title:string = await this.page.title();
        return title.toLowerCase().includes('my account');
    }

    /**
     * Clicks on logout link
     * @returns Promise<LogoutPage> 
     */
    async clickLogout(): Promise<LogoutPage> {
            await this.logoutLink.click();
            return new LogoutPage(this.page);
    }


    /**
     * Clicks on Edit Account link to navigate to My Account Information page
     * @returns Promise<MyAccInfoPage>
     */
    async clickEditAccount(): Promise<MyAccInfoPage> {
        await this.editAccountLink.click();
        return new MyAccInfoPage(this.page);
    }


        /**
     * Check if the confirmation message is displayed
     * @returns {Promise<boolean>}
     */
    async isConfirmationMsgDisplayed(): Promise<boolean> {
        // .isVisible() is a clean way to check for element existence/visibility
        return await this.confirmationMsg.isVisible();
    }


    /**
     * Get the confirmation message text
     * @returns {Promise<string>}
     */
    async getConfirmationText(): Promise<string> {
        return (await this.confirmationMsg.textContent())?.trim() ?? '';
    }

    
}