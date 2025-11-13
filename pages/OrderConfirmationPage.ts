import { Page, Locator } from '@playwright/test';
import { HomePage } from './HomePage';
import { BasePage } from './BasePage';


export class OrderConfirmationPage extends BasePage {

    // private readonly page: Page;
    private readonly continueBtn: Locator;

    constructor(page: Page) {
        // this.page = page;
        super(page);

        this.continueBtn = page.locator('a:has-text("Continue")');
  }


    async isPageLoaded(): Promise<boolean> {

        // try {
        //     await this.page.waitForSelector('h1:has-text("Your order has been placed!")', { timeout: 5000 });
        //     const title = await this.page.title();
        //     return title.toLowerCase().includes('your order has been placed');
        // } catch {
        //     return false;
        // }
        return this.waitForStablePage('your order has been placed');
    }


    async clickContinue(): Promise<HomePage> {
        await this.continueBtn.click();
        return new HomePage(this.page);
    }
}
