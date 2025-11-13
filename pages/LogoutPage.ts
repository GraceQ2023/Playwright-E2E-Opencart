import { Page, Locator } from '@playwright/test';
import { HomePage } from './HomePage';
import { BasePage } from './BasePage';

export class LogoutPage extends BasePage {
    
    // private readonly page: Page;
    private readonly continueBtn: Locator;
    private readonly logoutMsg: Locator;

    constructor(page: Page) {
        //this.page = page;
        super(page);

        this.continueBtn = page.getByRole('link', { name: 'Continue' })
        this.logoutMsg = page.locator('#content')
    }

    /**
     * check if Logout page is loaded
     * @returns 
     */

    async isPageLoaded(): Promise<boolean> {

        // let title:string = await this.page.title();
        // return title.toLowerCase().includes('account logout');
        return this.waitForStablePage('account logout');
    }



    /**
     * check if logout was successful
     * @returns {Promise<boolean>}
     */
    
    // async isLoggedOutMessageDisplayed(): Promise<boolean> {
    //     const contentText = await this.logoutMsg.textContent() ?? '';
    //     return contentText.includes('You have been logged off your account');
    // }


    /**
     * Clicks the Continue button after logout
     * @returns Promise<HomePage> - Returns instance of HomePage
     */
    async clickContinue(): Promise<HomePage> {
        await this.continueBtn.click();
        return new HomePage(this.page);
    }

}