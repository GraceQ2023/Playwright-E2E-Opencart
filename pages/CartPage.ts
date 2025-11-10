import{Page, Locator} from '@playwright/test';
import { HomePage } from './HomePage';
import { CheckoutPage } from './CheckoutPage';

export interface CartItem{
    name: string;
    quantity: number;
    totalPrice: number;
}


export class CartPage {
    private readonly page: Page;

    // define locators
    private readonly cartTableRows: Locator;
    private readonly continueShoppingBtn: Locator;
    private readonly checkoutBtn: Locator;

    constructor(page: Page) {
        this.page = page;

        // initialize locators
        this.cartTableRows = page.locator('#checkout-cart form table.table-bordered tbody tr'); // only rows in the cart table body, not including header row for column names
        this.continueShoppingBtn = page.getByRole('link', { name: 'Continue Shopping' });
        // this.checkoutBtn = page.getByRole('link', { name: 'Checkout' });

        this.checkoutBtn = page.locator("//a[@class='btn btn-primary']")
    }

    /**
     * check if shopping cart page is loaded
     * @returns {Promise<boolean>}
     */
    async isPageLoaded(): Promise<boolean> {
        let title:string = await this.page.title();
        return title.toLowerCase().includes('shopping cart');
    }


    async getCartItems(): Promise<CartItem[]> {

        const items: CartItem[] = [];

        await this.page.waitForSelector('table.table-bordered tbody tr td.text-left a', { state: 'visible', timeout: 20000 });

        const rows = this.cartTableRows;
        const count = await rows.count();

        for (let i = 0; i < count; i++) {
            const row = rows.nth(i);

            const name = (await row.locator('td.text-left >> a').textContent())?.trim() || '';
            const quantityText = (await row.locator('td.text-left input.form-control').inputValue())?.trim() || '0';
            const totalPriceText = (await row.locator('td.text-right').last().textContent())?.trim() || '';
            const totalPrice = parseFloat(totalPriceText.replace(/[^0-9.]/g, ''));   // convert price text to number: remove $ and commas, e.g. $1,806.00 -> 1806.00

            items.push({
                name,
                quantity: parseInt(quantityText),
                totalPrice,
            });
        }
        return items;
    }


    /**
     * Get total number of items in the cart
     * @returns Promise<number>
     */
    async getCartItemCount(): Promise<number> {
        return await this.cartTableRows.count();
    }


    /**
     * Click on Continue Shopping button to go back to home page
     */
    async clickContinueShopping(): Promise<HomePage> {
        await this.continueShoppingBtn.click();
        return new HomePage(this.page);
    }


    /**
     * Click on the Checkout button to proceed to checkout
     */
    async clickCheckoutBtn(): Promise<CheckoutPage> {
        await this.checkoutBtn.click();
        return new CheckoutPage(this.page);
    }


}

