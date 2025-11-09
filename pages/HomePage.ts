import {Page, Locator} from '@playwright/test';
import { RegisterPage } from './RegisterPage';
import { LoginPage } from './LoginPage';
import { CartPage } from './CartPage';
import { CheckoutPage } from './CheckoutPage';

export class HomePage {
    private readonly page: Page; // private keyword to restrict access to this variable, enforces encapsulation

    // define locators 
    private readonly myAccountDropdown: Locator;
    private readonly loginLink: Locator;
    private readonly registerLink: Locator;
    private readonly searchInput: Locator;
    private readonly searchButton: Locator;
    private readonly firstFeatureProduct: Locator; 
    private readonly confirmationAlert: Locator;
    private readonly shoppingCartLink: Locator; 
    private readonly checkoutLink: Locator

    constructor(page: Page) {
        this.page = page;

        // initialize locators
        this.myAccountDropdown = page.locator('span:has-text("My Account")')
        this.registerLink = page.getByRole('link', { name: 'Register' })
        this.loginLink = page.getByRole('link', { name: 'Login' })
        this.searchInput = page.getByRole('textbox', { name: 'Search' })
        this.searchButton = page.locator('#search button[type="button"]');
        this.confirmationAlert = page.locator(".alert.alert-success.alert-dismissible");
        this.shoppingCartLink = page.getByTitle('Shopping Cart');
        this.checkoutLink = page.locator('span:has-text("Checkout")');
        this.firstFeatureProduct = page.locator('div.product-thumb.transition').first();
    }


    /**
     * Check if the homepage is loaded.
     * @returns 
     */
    async isPageLoaded(): Promise<boolean> {
        let title:string = await this.page.title();
        if(title.includes('Your Store')){
            return true;
        }
        return false;
    }

    /**
     * Navigate to Register page
     */
    async goToRegisterPage(): Promise<RegisterPage> {
        await this.myAccountDropdown.click();
        await this.registerLink.click();
        return new RegisterPage(this.page);
    }

    /**
     * Navigate to Login page
     */
    async goToLoginPage(): Promise<LoginPage> {
        await this.myAccountDropdown.click();
        await this.loginLink.click();
        return new LoginPage(this.page);
    }


    /**
     * Search for a product 
     * @param productName 
     */
    async searchProduct(productName: string): Promise<void> {
        await this.searchInput.fill(productName.trim());
        await Promise.all([
            this.page.waitForLoadState('networkidle'),   // add wait for page load
            this.searchButton.click(),
        ]);
    }


    /**
     * Add product to cart from Homepage Featured product section
     * @param productName 
     * @param quantity 
     */
    async addProductToCartFromHomePage(): Promise<string> {
        const productName = (await this.firstFeatureProduct.locator('h4 a').innerText()).trim();
        await this.firstFeatureProduct.scrollIntoViewIfNeeded();
        await this.firstFeatureProduct.locator('button[onclick*="cart.add"]').click();
        return productName;
    }


    /**
     * Check if confirmation alert is displayed and contains expected text
     * @returns 
     */
    async isConfirmAlertDisplayed(): Promise<boolean> {
        try {
            await this.confirmationAlert.waitFor({ state: 'visible', timeout: 2000 });
            const confirmationAlert = await this.confirmationAlert.textContent();
            return confirmationAlert?.includes('Success: You have added') || false;
        } catch {
            return false;
        }
    }


    /**
     * Navigate to Shopping Cart page
     * @returns Promise<CartPage> - Returns CartPage instance   
     */
    async navigateToShoppingCart(): Promise<CartPage> {

        await this.shoppingCartLink.click();
        return new CartPage(this.page);
    }

    // NOTE: only the checkout link inside the cart dropdown works for the complete checkout process
    async openCartDropdown(): Promise<void> {

        await this.page.locator('#cart button[data-toggle="dropdown"]').click();
        await this.page.locator('#cart .dropdown-menu').waitFor({ state: 'visible' });
    }


    /**
     * Navigate to checkout page
     * @returns Promise<CheckoutPage> - Returns CheckoutPage instance
     */
    async navigateToCheckout(): Promise<CheckoutPage> {
  
        await this.checkoutLink.click();
        return new CheckoutPage(this.page);
    }

    // async navigateToCheckout(): Promise<CheckoutPage> {

    //     await this.openCartDropdown();
    //     await this.checkoutLink.waitFor({ state: 'visible', timeout: 5000 });
    //     await this.checkoutLink.click();
    //     return new CheckoutPage(this.page);
    // }

}