import { Page, Locator } from '@playwright/test';
import { HomePage } from './HomePage';
import { BasePage } from './BasePage';

export class LogoutPage extends BasePage {
    
    private readonly continueBtn: Locator;
    private readonly logoutMsg: Locator;

    constructor(page: Page) {
        super(page);

        this.continueBtn = page.getByRole('link', { name: 'Continue' })
        this.logoutMsg = page.locator('#content')
    }

    /**
     * check if Logout page is loaded
     * @returns {Promise<boolean>}
     */
    async isPageLoaded(): Promise<boolean> {
        return this.waitForStablePage('account logout');
    }


    /**
     * Clicks the Continue button to navigate back to HomePage
     * @returns {Promise<HomePage>} 
     */
    async clickContinue(): Promise<HomePage> {
        await this.continueBtn.click();
        return new HomePage(this.page);
    }

}