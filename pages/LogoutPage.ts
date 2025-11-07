import { Page, Locator } from '@playwright/test';
import { HomePage } from './HomePage';

export class LogoutPage {
    private readonly page: Page;
    private readonly continueBtn: Locator;
    private readonly logoutMsg: Locator;

    constructor(page: Page) {
        this.page = page;
        this.continueBtn = page.getByRole('link', { name: 'Continue' })
        this.logoutMsg = page.locator('#content')
    }

    /**
     * check if logout was successful
     * @returns {Promise<boolean>}
     */
    async isLogoutSuccess(): Promise<boolean> {
        const contentText = await this.logoutMsg.textContent() ?? '';
        return contentText.includes('You have been logged off your account');
    }


    /**
     * Clicks the Continue button after logout
     * @returns Promise<HomePage> - Returns instance of HomePage
     */
    async clickContinue(): Promise<HomePage> {
        await this.continueBtn.click();
        return new HomePage(this.page);
    }

}