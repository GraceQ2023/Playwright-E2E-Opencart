/**
 * Login Test Suite
 * 
 * Test case 1: Verify valid login
 * Test case 2: Verify invalid login
 */


import {test, expect} from '@playwright/test';
import { TestConfig } from '../../test.config';
import { HomePage } from '../../pages/HomePage';
import { LoginPage } from '../../pages/LoginPage';
import { MyAccountPage } from '../../pages/MyAccountPage';


test.describe('User Login Functionality', () => {

    let homePage: HomePage;
    let loginPage: LoginPage;
    let myAccountPage: MyAccountPage;

    test.beforeEach(async ({page}) => {

        homePage = new HomePage(page);
        loginPage = new LoginPage(page);
        myAccountPage = new MyAccountPage(page);

        await page.goto(TestConfig.appUrl); // navigate to app URL
        await homePage.goToLoginPage();
    });


    /**
     * Test Case 1: Verify valid login
     */
    test('Verify valid login @master @sanity @regression', async () => {

        await loginPage.login(TestConfig.validUser.email, TestConfig.validUser.password);
        const isLoggedIn = await myAccountPage.isPageLoaded();
        expect(isLoggedIn).toBeTruthy();

    });


    /**
     * Test Case 2: Verify invalid login
     */
    test('Verify invalid login @regression', async () => {

        await loginPage.login(TestConfig.invalidUser.email, TestConfig.invalidUser.password);
        const errorMsg = await loginPage.getLoginErrorMsg();

        const possibleErrorMessages = [
            'Warning: No match for E-Mail Address and/or Password.',
            ' Warning: Your account has exceeded allowed number of login attempts. Please try again in 1 hour.'
        ];

        // Check if the actual error message matches any expected one
        const isErrorContained = possibleErrorMessages.some(expectedMsg => errorMsg.includes(expectedMsg));
        expect(isErrorContained).toBeTruthy();
    });

});