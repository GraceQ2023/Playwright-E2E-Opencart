import {Page, Locator} from '@playwright/test';

export class LoginPage {
    private readonly page: Page;

    // define locators
    private readonly emailInput: Locator;
    private readonly pwInput: Locator;
    private readonly loginBtn: Locator;
    private readonly loginErrorMsg: Locator;

    constructor(page: Page) {
        this.page = page;

        // initialize locators
        this.emailInput = page.getByLabel('E-Mail Address');
        this.pwInput = page.getByLabel('Password');
        this.loginBtn = page.locator('input[type="submit"]');
        this.loginErrorMsg = page.locator('div.alert.alert-danger.alert-dismissible')
    }

    /**
     * Check if login page is loaded
     * @returns 
     */
    async isLoginPageLoaded(): Promise<boolean> {
        let title:string = await this.page.title();
        if(title.includes('Account Login')){
            return true;
        }
        return false;
    }

    /**
     * Perform login action
     * @param email 
     * @param password 
     */
    async login(email: string, password: string): Promise<void> {
        await this.emailInput.fill(email);
        await this.pwInput.fill(password);
        await this.loginBtn.click();
    }

    /**
     * Get login error message text
     * @returns error message 
     */
    async getLoginErrorMsg(): Promise<string> {
        return await this.loginErrorMsg.textContent() || '';
    }
}