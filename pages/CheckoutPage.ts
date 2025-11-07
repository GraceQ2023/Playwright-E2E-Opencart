import{Page, Locator} from '@playwright/test';

export class CheckoutPage {
    private readonly page: Page;
    
    // Locators
    private readonly fNameInput: Locator;
    private readonly lNameInput: Locator;
    private readonly addressInput: Locator;
    private readonly cityInput: Locator;
    private readonly postCodeInput: Locator;
    private readonly countryDropdown: Locator;
    private readonly stateDropdown: Locator;
    private readonly continueBillingAddressBtn: Locator;
    private readonly continueDeliveryAddressBtn: Locator;
    private readonly continueDeliveryMethodBtn: Locator;
    private readonly termsCheckbox: Locator;
    private readonly continuePaymentBtn: Locator;
    private readonly confirmOrderBtn: Locator;
    private readonly confirmOrderMsg: Locator;


    constructor(page: Page) {
        this.page = page;
        
        // Initialize locators 
        this.fNameInput = page.locator('#input-payment-firstname');
        this.lNameInput = page.locator('#input-payment-lastname');
        this.addressInput = page.locator('#input-payment-address-1');
        this.cityInput = page.locator('#input-payment-city');
        this.postCodeInput = page.locator('#input-payment-postcode');
        this.countryDropdown = page.locator('#input-payment-country');
        this.stateDropdown = page.locator('#input-payment-zone');
        this.continueBillingAddressBtn = page.locator('#button-payment-address');
        this.continueDeliveryAddressBtn = page.locator('#button-shipping-address');
        this.continueDeliveryMethodBtn = page.locator('#button-shipping-method');
        this.termsCheckbox = page.locator('input[name="agree"]');
        this.continuePaymentBtn = page.locator('#button-payment-method');
        this.confirmOrderBtn = page.locator('#button-confirm');
        this.confirmOrderMsg = page.locator('#content h1');

        }

    /**
     * check if checkout page is loaded
     * @returns {Promise<boolean>}
     */
    async isPageLoaded(): Promise<boolean> {
        let title:string = await this.page.title();
        return title.toLowerCase().includes('checkout');
    }


    // fill in checkout form
    async fillCheckoutForm(checkoutData: {
        firstName: string;
        lastName: string;
        address: string;
        city: string;
        postCode: string;
        country: string;
        state: string;
        deliveryMsg?: string;
    }) {
        await this.fNameInput.fill(checkoutData.firstName);
        await this.lNameInput.fill(checkoutData.lastName);
        await this.addressInput.fill(checkoutData.address);
        await this.cityInput.fill(checkoutData.city);
        await this.postCodeInput.fill(checkoutData.postCode);
        await this.countryDropdown.selectOption({ label: checkoutData.country });
        await this.stateDropdown.selectOption({ label: checkoutData.state });
        await this.continueBillingAddressBtn.click();
        await this.continueDeliveryAddressBtn.click();
        await this.continueDeliveryMethodBtn.click();
        await this.termsCheckbox.check();
        await this.continuePaymentBtn.click();
    }


    // confirm order 
    async clickConfirmOrder() {
        await this.confirmOrderBtn.click();
    }


    async isOrderPlaced(): Promise<boolean> {
        // Handle alert if it appears
        this.page.once('dialog', dialog => dialog.accept().catch(() => {}));
        
        // Wait for order confirmation message
        const message = (await this.confirmOrderMsg.textContent())?.trim();
        return message === "Your order has been placed!";    
    }

}