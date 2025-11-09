import {test, expect} from '@playwright/test';
import { TestConfig } from '../test.config';
import { HomePage } from '../pages/HomePage';
import { SearchResultPage } from '../pages/SearchResultPage';
import { ProductPage } from '../pages/ProductPage';
import { CartPage } from '../pages/CartPage';


test.describe('Add to Cart Functionality', () => {
    let homePage: HomePage;
    let searchResultPage: SearchResultPage;
    let productPage: ProductPage;
    let cartPage: CartPage;
    let config: TestConfig;

    // Hook runs before each test in this describe block  
    test.beforeEach(async ({page}) => {

        // initialize page objects
        config = new TestConfig(); // load config file (url, credentials..))
        homePage = new HomePage(page);
        searchResultPage = new SearchResultPage(page);
        productPage = new ProductPage(page);
        cartPage = new CartPage(page);
        await page.goto(TestConfig.appUrl); // navigate to base url

    });

    // Add to cart test - search product, add to cart, verify cart contents
    test('Verify add product to cart from product page @master @sanity @regression', async () => {

        const productName = TestConfig.product.name;
        const productQty = TestConfig.product.quantity;

        await homePage.searchProduct(productName);
        expect.soft(await searchResultPage.hasProduct(productName)).toBeTruthy();
        await searchResultPage.selectProductIfExists(productName);
        expect.soft(await productPage.isPageLoaded(productName)).toBeTruthy();
        await productPage.addProductToCart(productQty.toString());
        expect.soft(await productPage.isConfirmAlertDisplayed()).toBeTruthy();
        await productPage.navigateToShoppingCart();
        expect.soft(await cartPage.isPageLoaded()).toBeTruthy();

        const items = await cartPage.getCartItems();

        console.log('Cart items:', items);

        const target = items.find(
            item => item.name.toLowerCase().includes(productName.toLowerCase())
        );

        expect(target).toBeTruthy(); // check product is found
        expect(target?.quantity).toBe(Number(productQty)); // verify quantity
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