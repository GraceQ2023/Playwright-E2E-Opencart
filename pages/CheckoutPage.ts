import{Page, Locator} from '@playwright/test';

/**
 *  NOTE: The checkout process on the demo site is not fully functional.
 *  The steps related to shipping method selection, payment method selection, and order confirmation
 *  cannot be completed as expected. Therefore, the methods below focus on filling out the forms
 *  and navigating up to the point where the process cannot proceed further.
 */


interface GuestCheckoutData {
    firstName: string;
    lastName: string;
    email: string;
    tel: string;
    address: string;
    city: string;
    postCode: string;
    country: string;
    state: string;
}

interface RegisteredCheckoutData {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    postCode: string;
    country: string;
    state: string;
}

export class CheckoutPage {
    private readonly page: Page;
    
    // Locators
    private readonly guestRadio: Locator;
    private readonly accContinueBtn: Locator;
    private readonly returningCustomerEmailInput: Locator;
    private readonly returningCustomerPwdInput: Locator;
    private readonly returningCustomerLoginBtn: Locator;
    private readonly billingFirstNameInput: Locator;
    private readonly billingLastNameInput: Locator;
    private readonly billingEmailInput: Locator;
    private readonly billingTelInput: Locator;
    private readonly billingAddressInput: Locator;
    private readonly billingCityInput: Locator;
    private readonly billingPostCodeInput: Locator;
    private readonly billingCountryDropdown: Locator;
    private readonly billingStateDropdown: Locator;
    private readonly continueBillingDetailsBtn: Locator; 
    private readonly continueBillingDetailsBtn_guest: Locator; // for guest checkout form
    private readonly existingAddressRadio: Locator;
    private readonly deliveryAddressContinueBtn: Locator;  // unable to proceed
    private readonly deliveryMethodContinueBtn: Locator;    // unable to proceed
    private readonly termsCheckbox: Locator;  // unable to proceed
    private readonly continuePaymentBtn: Locator;  // unable to proceed
    private readonly confirmOrderBtn: Locator;
    private readonly confirmOrderMsg: Locator;
    private readonly warningAlert: Locator;


    constructor(page: Page) {
        this.page = page;
        
        // checkout option locators
        this.guestRadio = page.locator('input[value="guest"]');
        this.accContinueBtn = page.locator('#button-account');
        this.returningCustomerEmailInput = page.locator('#input-email');
        this.returningCustomerPwdInput = page.locator('#input-password');
        this.returningCustomerLoginBtn = page.locator("//input[@id='button-login']")

        // billing details section
        this.billingFirstNameInput = page.locator('#input-payment-firstname');
        this.billingLastNameInput = page.locator('#input-payment-lastname');
        this.billingEmailInput = page.locator('#input-payment-email');
        this.billingTelInput = page.locator('#input-payment-telephone');
        this.billingAddressInput = page.locator('#input-payment-address-1');
        this.billingCityInput = page.locator('#input-payment-city');
        this.billingPostCodeInput = page.locator('#input-payment-postcode');
        this.billingCountryDropdown = page.locator('#input-payment-country');
        this.billingStateDropdown = page.locator('#input-payment-zone');
        this.continueBillingDetailsBtn_guest = page.locator("#button-guest");
        this.continueBillingDetailsBtn = page.locator('#button-payment-address')

        this.existingAddressRadio = page.locator('input[name="payment_address"][value="existing"]');
        
        
        // delivery, payment and confirm order locators
        this.deliveryAddressContinueBtn = page.locator('#button-shipping-address');
        this.deliveryMethodContinueBtn = page.locator('#button-shipping-method');
        this.termsCheckbox = page.locator('input[name="agree"]');
        this.continuePaymentBtn = page.locator('#button-payment-method');
        this.confirmOrderBtn = page.locator('#button-confirm');

        // messages
        this.confirmOrderMsg = page.locator('#content h1');
        this.warningAlert = page.locator('div.alert.alert-warning.alert-dismissible');
    }

    /**
     * check if checkout page is loaded
     * @returns {Promise<boolean>}
     */
    async isPageLoaded(): Promise<boolean> {
        let title:string = await this.page.title();
        return title.toLowerCase().includes('checkout');
    }


    // --- Helper wait ---
    async waitForSectionToExpand(sectionId: string) {
        await this.page.waitForSelector(`#${sectionId}.collapse.in, #${sectionId}.collapse.show`, {
            state: 'visible', timeout: 5000,
        });
    }


    // Choose checkout option - Guest checkout
    async chooseCheckoutOption(checkOutOption: string){
        if (checkOutOption.toLowerCase() === "guest checkout") {
            await this.guestRadio.click();
            await this.accContinueBtn.click();
            await this.page.waitForSelector('#input-payment-firstname', { state: 'visible', timeout: 5000 });
        }
    }

    // Choose checkout option -  Returning customer
    async loginAsReturningCustomer(email: string, password: string): Promise<void> {
        await this.returningCustomerEmailInput.fill(email);
        await this.returningCustomerPwdInput.fill(password);
        await this.returningCustomerLoginBtn.click();
        await this.page.waitForSelector('#collapse-payment-address', { state: 'visible', timeout: 6000 });
    }


    // fill in checkout form for registered user (first order)
    async fillCheckoutForm_RegisteredUserFirstOrder(data: RegisteredCheckoutData): Promise<void>  {
        await this.billingFirstNameInput.fill(data.firstName);
        await this.billingLastNameInput.fill(data.lastName);
        await this.billingAddressInput.fill(data.address);
        await this.billingCityInput.fill(data.city);
        await this.billingPostCodeInput.fill(data.postCode);
        await this.billingCountryDropdown.selectOption({ label: data.country });
        await this.billingStateDropdown.selectOption({ label: data.state });
        await this.continueBillingDetailsBtn.click();

        /**
         * The rest of the steps are currently not functional in the demo site.
         * - Expand the shipping address section and proceed through the delivery and payment steps
         * 
         * Below are the intended steps commented out:
         * await this.waitForSectionToExpand('collapse-shipping-address');
         * await this.continueDeliveryAddressBtn.click();
         * await this.continueDeliveryMethodBtn.click();
         * await this.termsCheckbox.check();
         * await this.continuePaymentBtn.click();
         */

    }


    // fill in checkout form - guest checkout
    async fillCheckoutForm_GuestCheckout(guestData: GuestCheckoutData): Promise<void> {
        await this.billingFirstNameInput.fill(guestData.firstName);
        await this.billingLastNameInput.fill(guestData.lastName);
        await this.billingEmailInput.fill(guestData.email);
        await this.billingTelInput.fill(guestData.tel);
        await this.billingAddressInput.fill(guestData.address);
        await this.billingCityInput.fill(guestData.city);
        await this.billingPostCodeInput.fill(guestData.postCode);
        await this.billingCountryDropdown.selectOption({ label: guestData.country });
        await this.billingStateDropdown.selectOption({ label: guestData.state });
        await this.continueBillingDetailsBtn_guest.click();
    
        /**
         * The rest of the steps are currently not functional in the demo site.
         * - Expand the shipping address section and proceed through the delivery and payment steps
         * 
         * Below are the intended steps commented out:
         * await this.waitForSectionToExpand('collapse-shipping-address');
         * await this.continueDeliveryAddressBtn.click();
         * await this.continueDeliveryMethodBtn.click();
         * await this.termsCheckbox.check();
         * await this.continuePaymentBtn.click();
         */
    }


    // fill in checkout form - registered returning user
    async fillCheckoutForm_ReturningCustomer(): Promise<void> {

        await this.page.waitForSelector('#collapse-payment-address', { state: 'visible', timeout: 5000 });
        const isExistingChecked = await this.existingAddressRadio.isChecked();

        if (!isExistingChecked) {
            await this.existingAddressRadio.check();
        }
        await this.continueBillingDetailsBtn.click();

    }
        

    /**
     * Click confirm order button
     */
    async clickConfirmOrder() {
        await this.confirmOrderBtn.click();
    }

    /**
     * Check if warning message is displayed
     * @returns 
     */

    async isWarningMsgDisplayed(): Promise<boolean> {
        try {
            await this.warningAlert.waitFor({ state: 'visible', timeout: 5000 });
            const warningMsg = await this.warningAlert.textContent();
            return warningMsg?.includes('Warning: No Payment options are available. Please contact us for assistance!') || false;
        } catch {
            return false;
        }
    }


    /**
     * Check if order confirmation message is displayed
     * @returns 
     */
    async isConfirmOrderMsgDisplayed(): Promise<boolean> {
        try {
            await this.confirmOrderMsg.waitFor({ state: 'visible', timeout: 5000 });
            const confirmOrderMsg = await this.confirmOrderMsg.textContent();
            return confirmOrderMsg?.includes('Your order has been placed!') || false;
        } catch {
            return false;
        }
    }

}