import {Page, Locator} from '@playwright/test';
import { RegisterPage } from './RegisterPage';
import { LoginPage } from './LoginPage';
import { CartPage } from './CartPage';
import { CheckoutPage } from './CheckoutPage';
import { LogoutPage } from './LogoutPage';
import { SearchResultPage } from './SearchResultPage';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
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
    private readonly logoutLink: Locator;

    constructor(page: Page) {
        super(page); // call the constructor of BasePage class

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
        this.logoutLink = page.locator('a:has-text("Logout")')
    }


    /**
     * Check if homepage is loaded
     * @returns 
     */
    async isPageLoaded(): Promise<boolean> {
        return this.waitForStablePage('your store');
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
     * Navigate to Logout page
     * @returns 
     */
    async goToLogoutPage(): Promise<LogoutPage> {
        await this.myAccountDropdown.click();
        await this.logoutLink.click();
        return new LogoutPage(this.page);
    }


    /**
     * Search for a product 
     * @param productName 
     * @returns {Promise<SearchResultPage>}
     */
    async searchProduct(productName: string): Promise<SearchResultPage> {
        await this.searchInput.fill(productName.trim());
        await this.searchButton.click();
        return new SearchResultPage(this.page);
    }


    /**
     * Add product to cart from Homepage Featured product section
     * @param
     * @return product name added to cart
     */
    async addProductToCartFromHomePage(): Promise<string> {
        const productName = (await this.firstFeatureProduct.locator('h4 a').innerText()).trim();
        await this.firstFeatureProduct.scrollIntoViewIfNeeded();  // ensure element is in view
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
     * @returns {Promise<CartPage>}   
     */
    async navigateToShoppingCart(): Promise<CartPage> {
        await this.shoppingCartLink.click();
        return new CartPage(this.page);
    }

    
    /**
     * Navigate to Checkout page
     * @returns {Promise<CheckoutPage>} 
     */
    async navigateToCheckout(): Promise<CheckoutPage> {
        await this.checkoutLink.click();
        return new CheckoutPage(this.page);
    }

}