import { Page, Locator } from '@playwright/test';
import { HomePage } from './HomePage';
import { BasePage } from './BasePage';


export class OrderConfirmationPage extends BasePage {

    private readonly continueBtn: Locator;
    private readonly confirmationMessageTitle: Locator;

    constructor(page: Page) {
        super(page);

        this.continueBtn = page.locator('a:has-text("Continue")');
        this.confirmationMessageTitle = this.page.locator('h1:has-text("Your order has been placed!")');
  }


  /**
   * Checks if Order Confirmation page is loaded
   * @returns {Promise<boolean>}
   */
    async isPageLoaded(): Promise<boolean> {      
        // additional wait to deal with potential timing issues: navigation wait (from basepage) + explicit wait for confirmation message
        try{
             await this.waitForStablePage('your order has been placed!');
             await this.confirmationMessageTitle.waitFor({ state: 'visible', timeout: 10000});
             return await this.confirmationMessageTitle.isVisible(); 
        } catch(error){
            return false;
        }
    }

    /**
     * Clicks the Continue button to navigate back to Home Page
     * @returns {Promise<HomePage>}
     */

    async clickContinue(): Promise<HomePage> {
        await this.continueBtn.click();
        return new HomePage(this.page);
    }
}
