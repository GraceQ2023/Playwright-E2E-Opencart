import{Page, Locator} from '@playwright/test';
import { ProductPage } from './ProductPage';
import { BasePage } from './BasePage';

export class SearchResultPage extends BasePage {

    // private readonly page: Page;
    private readonly noResultsMsg: Locator;

    constructor(page: Page) {
        // this.page = page;
        super(page);

        this.noResultsMsg = page.getByText('There is no product that matches the search criteria.');
    }

    /**
     * Verify if search results page is loaded
     * @returns {Promise<boolean>}
     */
    async isPageLoaded(): Promise<boolean> {
        // let title:string = await this.page.title();
        // return title.includes('Search -');
        return this.waitForStablePage('search -');
    }

    /**
     * Check if a product exists in search results
     * @param productName 
     * @returns {Promise<boolean>}
     */
    async hasProduct(productName: string): Promise<boolean> {
        const allProducts = await this.page.locator('h4 a').allInnerTexts();
        return allProducts.some(name => name.toLowerCase() === productName.toLowerCase());
    }


    /**
     * Select a product if it exists
     * @param productName 
     * @returns {Promise<ProductPage | null>}
     */
    async selectProductIfExists(productName: string): Promise<ProductPage | null> {

        const product = this.page.locator('h4 a', { hasText: productName });
        if (await product.count() > 0) {
            await product.first().click();
            return new ProductPage(this.page);
        }
        return null;
    }


    /**
     * Check if no results message is displayed
     * @returns {Promise<boolean>}
     */
    async isNoResultsMsgDisplayed(): Promise<boolean> {
        return await this.noResultsMsg.isVisible();
    }


    /**
     *  Get all product names in search results
     * @returns 
     */
    async getAllProductNames(): Promise<string[]> {
        const names = await this.page.locator('h4 a').allInnerTexts();
        return names.map(name => name.trim());
    }

}