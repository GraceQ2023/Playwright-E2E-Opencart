import {Page, Locator} from '@playwright/test';
import { BasePage } from './BasePage';
import { MyAccountPage } from './MyAccountPage';


export class RegisterSuccessPage extends BasePage {

    private readonly continueBtn: Locator;

    constructor(page: Page) {
        super(page);
    
        this.continueBtn = page.locator('a:has-text("Continue")')
    }


    /**
     * Check if register success page is loaded
     * @returns 
     */
    async isPageLoaded(): Promise<boolean> {
        // const title:string = await this.page.title();
        // return title.toLowerCase().includes('register account');
        return this.waitForStablePage('your account has been created!');
    }


    async clickContinue(): Promise<MyAccountPage> {
        await this.continueBtn.click();
        return new MyAccountPage(this.page);
    }

}