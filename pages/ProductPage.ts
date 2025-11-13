import{Page, Locator} from '@playwright/test';
import { CartPage } from './CartPage';
import { BasePage } from './BasePage';


export class ProductPage extends BasePage {
    // define locators
    private readonly quantityInput: Locator;
    private readonly addToCartButton: Locator;
    private readonly confirmationAlert: Locator;
    private readonly shoppingCartLink: Locator; 

    constructor(page: Page) {
        super(page);
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
        return this.waitForStablePage(productName);
    }


    /**
     * Set product quantity for adding to cart
     * @param qty 
     */
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
     * Check if confirmation is displayed after adding product to cart
     * @returns {Promise<boolean>}
     */
    async isConfirmAlertDisplayed(): Promise<boolean> {
        try {
            await this.confirmationAlert.waitFor({ state: 'visible', timeout: 3000 });
            const confirmationAlert = await this.confirmationAlert.textContent();
            return confirmationAlert?.includes('Success: You have added') || false;
        } catch {
            return false;
        }
    }


    /**
     * Navigate to Shopping Cart page
     * @returns {Promise<CartPage>}
     */
    async navigateToShoppingCart(): Promise<CartPage> {
        await this.shoppingCartLink.click();
        return new CartPage(this.page);
    }
    
}