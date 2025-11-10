import { Page, Locator } from '@playwright/test';
import { HomePage } from './HomePage';

export class OrderConfirmationPage {
    private readonly page: Page;
    private readonly continueBtn: Locator;

    constructor(page: Page) {
        this.page = page;
        this.continueBtn = page.locator('a:has-text("Continue")');
  }


    async isPageLoaded(): Promise<boolean> {
        // let title:string = await this.page.title();
        // return title.toLowerCase().includes('your order has been placed');
        try {
            await this.page.waitForSelector('h1:has-text("Your order has been placed!")', { timeout: 5000 });
            const title = await this.page.title();
            return title.toLowerCase().includes('your order has been placed');
        } catch {
            return false;
        }
    }


    async clickContinue(): Promise<HomePage> {
        await this.continueBtn.click();
        return new HomePage(this.page);
    }
}
