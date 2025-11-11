import { Page, Locator} from '@playwright/test';
import { MyAccountPage } from './MyAccountPage';


export interface AccountData {
    firstName?: string;
    lastName?: string;
    email?: string;
    telephone?: string;
}


export class MyAccInfoPage {

    private readonly page: Page;
    
    private readonly fNameInput: Locator;
    private readonly lNameInput: Locator;
    private readonly emailInput: Locator;
    private readonly telInput: Locator;
    private readonly continueBtn: Locator;
    private readonly backBtn: Locator;
    private readonly warningAlert: Locator;


    constructor(page: Page) {
        this.page = page;
        
        this.fNameInput = page.locator('#input-firstname');
        this.lNameInput = page.locator('#input-lastname');
        this.emailInput = page.locator('#input-email');
        this.telInput = page.locator('#input-telephone');
        this.continueBtn = page.locator('input[type="submit"]');
        this.backBtn = page.locator('a:has-text("Back")');
        this.warningAlert = page.locator('div.alert.alert-danger.alert-dismissible');
    }

    /**
     * Check if My Account Information page is loaded
     * @returns 
     */
    async isPageLoaded(): Promise<boolean> {
        let title:string = await this.page.title();
        return title.toLowerCase().includes('my account information');
    }

    /**
     * Update account information fields with the provided data
     * @param data 
     */
    async updateAccInfo(data: AccountData): Promise<void> {
        if (data.firstName !== undefined) {
            await this.fNameInput.fill('');
            await this.fNameInput.fill(data.firstName);
        }
        if (data.lastName !== undefined) {
            await this.lNameInput.fill('');
            await this.lNameInput.fill(data.lastName);
        }
        if (data.email !== undefined) {
            await this.emailInput.fill('');
            await this.emailInput.fill(data.email);
        }
        if (data.telephone !== undefined) {
            await this.telInput.fill('');
            await this.telInput.fill(data.telephone);
        }
    }


    /**
     * Clicks on Continue button and navigate to the My Account page
     * @returns {Promise<MyAccountPage>}
     */
    async clickContinue():Promise<MyAccountPage> {
        await this.continueBtn.click();
        await this.page.waitForLoadState('networkidle'); // wait for redirect + data loading
        return new MyAccountPage(this.page);
    }

   
    /**
     * Click Back button and navigate to the My Account page
     * @returns {MyAccountPage}
     */
    async clickBack(): Promise<MyAccountPage> {
        await this.backBtn.click();
        await this.page.waitForLoadState('networkidle'); // wait for redirect + data loading
        return new MyAccountPage(this.page);
    }


    /**
     * Get current account information
     * @returns {Promise<AccountData>}
     */
    async getAccInfo(): Promise<AccountData> {

        // using inputValue() to get the value of input field
        const firstName = await this.fNameInput.inputValue(); 
        const lastName = await this.lNameInput.inputValue();
        const email = await this.emailInput.inputValue();
        const telephone = await this.telInput.inputValue();
        return { firstName, lastName, email, telephone };
    }


    /**
     * Check if warning alert is displayed
     * @returns 
     */
    async isWarningAlertDisplayed(): Promise<boolean> {

        try {
            await this.warningAlert.waitFor({ state: 'visible', timeout: 3000 });
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Get warning alert text
     * @returns 
     */
    async getWarningAlertText(): Promise<string> {
        const alertText = await this.warningAlert.textContent();
        return alertText?.trim() || '';
    }

}

