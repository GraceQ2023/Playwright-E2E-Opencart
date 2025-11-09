import {test, expect} from '@playwright/test';
import { TestConfig } from '../test.config';
import { HomePage } from '../pages/HomePage';
import { SearchResultPage } from '../pages/SearchResultPage';
import { RandomDataUtil } from '../utils/randomDataGenerator';


test.describe('Search Product Functionality', () => {
    let homePage: HomePage;
    let searchResultPage: SearchResultPage;
    let config: TestConfig;

    // Hook runs before each test in this describe block  
    test.beforeEach(async ({page}) => {

        // initialize page objects
        config = new TestConfig(); // load config file (url, credentials..))
        homePage = new HomePage(page);
        searchResultPage = new SearchResultPage(page);
        await page.goto(TestConfig.appUrl); // navigate to base url 

    });


    // Product search test - product exists
    test('Verify search product when product exists @master @sanity @regression', async () => {

        const productName = TestConfig.product.name;
        await homePage.searchProduct(productName);
        expect.soft(await searchResultPage.isPageLoaded()).toBeTruthy();
        expect.soft(await searchResultPage.hasProduct(productName)).toBeTruthy();
    });
    
    
    // Product search test - product does not exist
    test('Verify search product when product does not exist @master @sanity @regression', async () => {

        const productName = RandomDataUtil.generateDrink();
        await homePage.searchProduct(productName);
        expect.soft(await searchResultPage.isPageLoaded()).toBeTruthy();
        expect.soft(await searchResultPage.isNoResultsMsgDisplayed()).toBeTruthy();
    });

});

