import{Page, Locator} from '@playwright/test';
import { CartPage } from './CartPage';

export class ProductPage {
    private readonly page: Page;

    // define locators
    private readonly quantityInput: Locator;
    private readonly addToCartButton: Locator;
    private readonly confirmationAlert: Locator;
    private readonly shoppingCartLink: Locator; 

    constructor(page: Page) {
        this.page = page;

        // initialize locators
        this.quantityInput = page.locator("#input-quantity");
        this.addToCartButton = page.locator('#button-cart');
        this.confirmationAlert = page.locator(".alert.alert-success.alert-dismissible");
        this.shoppingCartLink = page.getByTitle('Shopping Cart');
    }


    /**
     * Verify if product page is loaded
     */
    async isPageLoaded(productName: string): Promise<boolean> {
        let title:string = (await this.page.title()).toLowerCase();
        return title.includes(productName.toLowerCase());
    }


    async setQuantity(qty: string): Promise<void> {
        await this.quantityInput.fill('');
        await this.quantityInput.fill(qty);
    }


    /**
     * Add product to cart 
     * @param quantity 
     * @returns 
     */
    async addProductToCart(quantity: string): Promise<void> {
        await this.setQuantity(quantity);
        await this.addToCartButton.click();
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

    async isConfirmationAlertDisplayed(): Promise<boolean> {
    return await this.confirmationAlert.isVisible();
}

}