/**
 * Edit Account Test Suite
 * 
 * Test case 1: Verify user cannot update email to an existing registered email
 * Test case 2: Verify user can successfully update account information with correct data
 */


import {test, expect} from '@playwright/test';
import { TestConfig } from '../test.config';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';
import { MyAccountPage } from '../pages/MyAccountPage';
import { MyAccInfoPage } from '../pages/MyAccInfoPage';
import { RandomDataUtil } from '../utils/randomDataGenerator';


test.describe('Edit Account Functionality', () => {

    let homePage: HomePage;
    let loginPage: LoginPage;
    let myAccountPage: MyAccountPage;
    let myAccInfoPage: MyAccInfoPage;

    test.beforeEach(async ({page}) => {
        await page.goto(TestConfig.appUrl); 
        homePage = new HomePage(page);
        loginPage = new LoginPage(page);
        myAccountPage = new MyAccountPage(page);
        myAccInfoPage = new MyAccInfoPage(page);
    });


    /**     
     * Test Case 1: Verify user cannot update email to an existing registered email
     */
    test('Verify user cannot update email to an existing registered email @regression', async () => {

        await homePage.goToLoginPage();
        await loginPage.login(TestConfig.newUser.email, TestConfig.newUser.password);
        expect.soft(await myAccountPage.isPageLoaded()).toBeTruthy();

        await myAccountPage.clickEditAccount();
        expect.soft(await myAccInfoPage.isPageLoaded()).toBeTruthy();

        let updateData = {
            email: TestConfig.validUser.email, // upated with an existing email
        };

        await myAccInfoPage.updateAccInfo(updateData);
        await myAccInfoPage.clickContinue();

        expect(await myAccInfoPage.isWarningAlertDisplayed(), 'Warning alert should appear when using other existing email').toBeTruthy();
        expect(await myAccInfoPage.getWarningAlertText()).toContain('Warning: E-Mail address is already registered!');

    });


    /**     
     * Test Case 2: Verify user can successfully update account information with correct data
     */
    test('Verify user can successfully update account information @regression @sanity', async () => {

        await homePage.goToLoginPage();
        await loginPage.login(TestConfig.newUser.email, TestConfig.newUser.password);
        expect.soft(await myAccountPage.isPageLoaded()).toBeTruthy();

        await myAccountPage.clickEditAccount();
        expect.soft(await myAccInfoPage.isPageLoaded()).toBeTruthy();

        let updateData = {
            firstName: RandomDataUtil.generateFirstName(),
            lastName: RandomDataUtil.generateLastName(),
        };

        await myAccInfoPage.updateAccInfo(updateData);
        await myAccInfoPage.clickContinue();

        expect(await myAccountPage.isConfirmationMsgDisplayed()).toBeTruthy();
        expect(await myAccountPage.getConfirmationText()).toContain('Success: Your account has been successfully updated.');

        await myAccountPage.clickEditAccount();
        expect.soft(await myAccInfoPage.isPageLoaded()).toBeTruthy();
        const currentFirstName = (await myAccInfoPage.getAccInfo()).firstName;
        const currentLastName = (await myAccInfoPage.getAccInfo()).lastName;
        
        expect(currentFirstName).toBe(updateData.firstName);
        expect(currentLastName).toBe(updateData.lastName);
    });

});