/**
 * Search Product Test Suite
 * 
 * Test case 1: Verify search product when product exists
 * Test case 2: Verify search product when product does not exist
 */


import {test, expect} from '@playwright/test';
import { TestConfig } from '../test.config';
import { HomePage } from '../pages/HomePage';
import { SearchResultPage } from '../pages/SearchResultPage';
import { RandomDataUtil } from '../utils/randomDataGenerator';


test.describe('Search Product Functionality', () => {

    let homePage: HomePage;
    let searchResultPage: SearchResultPage;

    test.beforeEach(async ({page}) => {
        homePage = new HomePage(page);
        searchResultPage = new SearchResultPage(page);
        await page.goto(TestConfig.appUrl); 
    });


   /**
    * Test Case 1: Verify search product when product exists
    */
    test('Verify search product when product exists @master @sanity @regression', async () => {

        const productName = TestConfig.product.name;
        await homePage.searchProduct(productName);
        expect(await searchResultPage.isPageLoaded()).toBeTruthy();
        expect(await searchResultPage.hasProduct(productName)).toBeTruthy();
    });
    
    
    /**
     * Test Case 2: Verify search product when product does not exist
     */
    test('Verify search product when product does not exist @regression', async () => {

        const productName = RandomDataUtil.generateDrink();
        await homePage.searchProduct(productName);
        expect(await searchResultPage.isPageLoaded()).toBeTruthy();
        expect(await searchResultPage.isNoResultsMsgDisplayed()).toBeTruthy();
    });

});