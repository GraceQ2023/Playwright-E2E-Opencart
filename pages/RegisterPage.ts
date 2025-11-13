
import {Page, Locator} from '@playwright/test';
import { BasePage } from './BasePage';
import { RegisterSuccessPage } from './RegisterSuccessPage';

interface registerData {
    fName: string, 
    lName: string, 
    email: string, 
    tel: string, 
    pwd: string, 
    confirmPwd: string
}

export class RegisterPage extends BasePage {
    //private readonly page: Page;

    // define locators
    private readonly fNameInput: Locator;
    private readonly lNameInput: Locator;
    private readonly emailInput: Locator;
    private readonly telInput: Locator;
    private readonly pwInput: Locator;
    private readonly confirmPwInput: Locator;
    private readonly privacyCheckbox: Locator;
    private readonly continueBtn: Locator;
    private readonly warningMsg: Locator;
    // private readonly confirmationMsg: Locator;
    private readonly fieldErrorMsg: Locator;

    constructor(page: Page) {
        //this.page = page;
        super(page);

        // initialize locators
        this.fNameInput = page.getByLabel('First Name');
        this.lNameInput = page.getByLabel('Last Name');
        this.emailInput = page.getByLabel('E-Mail');
        this.telInput = page.getByLabel('Telephone');
        this.pwInput = page.locator('input[name="password"]');
        this.confirmPwInput = page.getByRole('textbox', { name: 'Password Confirm' });
        this.privacyCheckbox = page.locator('[name="agree"]');
        this.continueBtn = page.locator("//input[@value='Continue']");
        this.warningMsg = page.locator(".alert.alert-danger.alert-dismissible");  // warning message for not accepting privacy policy
        this.fieldErrorMsg =  page.locator('.text-danger'); // field error messages
        // this.confirmationMsg = page.locator('h1:has-text("Your Account Has Been Created!")');
    }


    /**
     * Check if register page is loaded
     * @returns 
     */
    async isPageLoaded(): Promise<boolean> {
        // const title:string = await this.page.title();
        // return title.toLowerCase().includes('register account');
        return this.waitForStablePage('register account');
    }

    /**
     * Fill registration form
     * @param data
     */
    async fillRegistrationForm(data: registerData): Promise<void> {
    
        await this.fNameInput.fill(data.fName);
        await this.lNameInput.fill(data.lName);
        await this.emailInput.fill(data.email);
        await this.telInput.fill(data.tel);
        await this.pwInput.fill(data.pwd);
        await this.confirmPwInput.fill(data.confirmPwd);
    }

    
    /**
     * agree to privacy policy
     */
    async agreeToPrivacyPolicy(): Promise<void> {
        await this.privacyCheckbox.check();
    }


    /**
     * Submit the registration form
     */
    async submitRegistrationForm(): Promise<void> {
        await Promise.all([
            this.page.waitForLoadState('networkidle'),
            this.continueBtn.click()
        ]);
    }

    /**
     * Check if registration is successful
     * @returns the confirmation message text.
     */
    // async isRegistrationSuccess(): Promise<boolean> {
    //     return await this.confirmationMsg.isVisible();
    // }
    
    // async getConfirmationMsg(): Promise<string> {
    //     return (await this.confirmationMsg.textContent())?.trim() ?? '';   // return empty string if null
    // }

    /**
     * Get warning message for not accepting privacy policy
     * @returns the warning message text.
     */
    async getWarningMsg(): Promise<string> {
        if (await this.warningMsg.isVisible()) {
            return (await this.warningMsg.textContent())?.trim() ?? '';
        }   
        return '';
    }

    /**
     * Get the current visible field error message.
     * NOTE: Assumes only one field error is visible in the current test context.
     * @returns the error message text.
     */
    async getFieldErrorMsg(): Promise<string> {
        return (await this.fieldErrorMsg.textContent())?.trim() ?? ''; // return empty string if null
    }

}
