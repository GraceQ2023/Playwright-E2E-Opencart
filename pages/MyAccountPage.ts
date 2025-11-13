import { Page, Locator} from '@playwright/test';
import { LogoutPage } from './LogoutPage'; 
import { MyAccInfoPage } from './MyAccInfoPage';
import { HomePage } from './HomePage';
import { BasePage } from './BasePage';

export class MyAccountPage extends BasePage {
    // define locators     
    private readonly logoutLink: Locator;
    private readonly editAccountLink: Locator;
    private readonly confirmationMsg: Locator;
    private readonly logoLink: Locator;

    constructor(page: Page) {
        super(page);
        
        this.logoutLink = page.locator('#column-right a:has-text("Logout")');
        this.editAccountLink = page.locator('#column-right a:has-text("Edit Account")');
        this.confirmationMsg = page.locator('.alert.alert-success.alert-dismissible');
        this.logoLink = page.locator("div[id='logo'] a");
    }

    /**
     * Verifies if My Account page is loaded
     * @returns Promise<boolean> 
     */
    async isPageLoaded(): Promise<boolean> {
        return this.waitForStablePage('my account');
    }

    /**
     * Click on logout link
     * @returns {Promise<LogoutPage>} 
     */
    async clickLogout(): Promise<LogoutPage> {
            await this.logoutLink.click();
            return new LogoutPage(this.page);
    }


    /**
     * Clicks on Edit Account link to navigate to My Account Information page
     * @returns {Promise<MyAccInfoPage>}
     */
    async clickEditAccount(): Promise<MyAccInfoPage> {
        await this.editAccountLink.click();
        return new MyAccInfoPage(this.page);
    }


    /**
     * Check if confirmation message is displayed
     * @returns {Promise<boolean>}
     */
    async isConfirmationMsgDisplayed(): Promise<boolean> {
        try {
            await this.confirmationMsg.waitFor({ state: 'visible', timeout: 4000 });
            return true;
        } catch {
            return false;
        }
    }


    /**
     * Get the confirmation message text
     * @returns {Promise<string>}
     */
    async getConfirmationText(): Promise<string> {
        return (await this.confirmationMsg.textContent())?.trim() ?? '';
    }

    
    /**
     * Navigate to homepage
     * @returns {Promise<HomePage>}
     */
    async navigateToHomePage(): Promise<HomePage> {
        await this.logoLink.click();
        return new HomePage(this.page);
    }
    
}