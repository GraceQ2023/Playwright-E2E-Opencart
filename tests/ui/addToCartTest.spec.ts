/**
 * Add to Cart Test Suite
 * 
 * Test case 1: Verify add product to cart from product page 
 * Test case 2: Verify add product to cart from homepage section
 * 
 */


import {test, expect} from '@playwright/test';
import { TestConfig } from '../../test.config';
import { HomePage } from '../../pages/HomePage';
import { SearchResultPage } from '../../pages/SearchResultPage';
import { ProductPage } from '../../pages/ProductPage';
import { CartPage } from '../../pages/CartPage';


test.describe('Add to Cart Functionality', () => {

    let homePage: HomePage;
    let searchResultPage: SearchResultPage;
    let productPage: ProductPage;
    let cartPage: CartPage;

    test.beforeEach(async ({page}) => {
        homePage = new HomePage(page);
        searchResultPage = new SearchResultPage(page);
        productPage = new ProductPage(page);
        cartPage = new CartPage(page);
        await page.goto(TestConfig.appUrl); // navigate to base url
    });


    // Add to cart test - search product, add to cart, verify cart contents
    test('Verify add product to cart from product page from search result @master @sanity @regression', async () => {

        const productName = TestConfig.product.name;
        const productQty = TestConfig.product.quantity;

        await homePage.searchProduct(productName);
        expect(await searchResultPage.hasProduct(productName)).toBeTruthy();
        await searchResultPage.selectProductIfExists(productName);
        expect.soft(await productPage.isPageLoaded(productName)).toBeTruthy();
        await productPage.addProductToCart(productQty.toString());
        expect(await productPage.isConfirmAlertDisplayed()).toBeTruthy();
        await productPage.navigateToShoppingCart();
        expect(await cartPage.isPageLoaded()).toBeTruthy();

        const items = await cartPage.getCartItems();
        const target = items.find(
            item => item.name.toLowerCase().includes(productName.toLowerCase())
        );

        expect(target).toBeTruthy(); // check product is found
        expect(target?.quantity).toBe(Number(productQty)); // verify quantity equals to added quantity
    });


    // Add to cart test - add product from homepage section
    test('Verify add product to cart from homepage section @regression', async () => {

        const productName = await homePage.addProductToCartFromHomePage();
        expect.soft(await homePage.isConfirmAlertDisplayed()).toBeTruthy();
        await homePage.navigateToShoppingCart();
        expect.soft(await cartPage.isPageLoaded()).toBeTruthy();

        const items = await cartPage.getCartItems();
        const target = items.find(
            item => item.name.toLowerCase().includes(productName.toLowerCase())
        );

        expect(target).toBeTruthy(); // check product is found
        expect(target?.quantity).toBe(1); // verify quantity is 1
    });

})