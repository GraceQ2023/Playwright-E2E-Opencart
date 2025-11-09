import {test, expect} from '@playwright/test';
import { TestConfig } from '../test.config';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';

import { MyAccountPage } from '../pages/MyAccountPage';
import { MyAccInfoPage } from '../pages/MyAccInfoPage';


test.describe('Edit Account Functionality', () => {
    let homePage: HomePage;
    let loginPage: LoginPage;
    let myAccountPage: MyAccountPage;
    let myAccInfoPage: MyAccInfoPage;
    let config: TestConfig;

    // Hook runs before each test in this describe block 
    test.beforeEach(async ({page}) => {

        // initialize page objects
        // config = new TestConfig(); // load config file (url, credentials..))
        await page.goto(TestConfig.appUrl); // navigate to base url 

        homePage = new HomePage(page);
        loginPage = new LoginPage(page);
        myAccountPage = new MyAccountPage(page);
        myAccInfoPage = new MyAccInfoPage(page);
        
    });


    // Edit account information test
    test('User cannot update email to an existing registered email @master @regression', async () => {

        await homePage.goToLoginPage();
        await loginPage.login(TestConfig.newUser.email, TestConfig.newUser.password);
        expect.soft(await myAccountPage.isPageLoaded()).toBeTruthy();

        await myAccountPage.clickEditAccount();
        expect.soft(await myAccInfoPage.isPageLoaded()).toBeTruthy();

        const newEmail = TestConfig.validUser.email; // upated with an existing email to trigger warning

        await myAccInfoPage.updateAccInfo({
    
            email: newEmail,
            
        });

        await myAccInfoPage.clickContinue();

        expect(await myAccInfoPage.isWarningAlertDisplayed(), 'Warning alert should appear when using other existing email').toBeTruthy();
        expect(await myAccInfoPage.getWarningAlertText()).toContain('Warning: E-Mail address is already registered!');

    });

    test('User can successfully update account information @regression', async () => {

        await homePage.goToLoginPage();
        await loginPage.login(TestConfig.newUser.email, TestConfig.newUser.password);
        expect.soft(await myAccountPage.isPageLoaded()).toBeTruthy();

        await myAccountPage.clickEditAccount();
        expect.soft(await myAccInfoPage.isPageLoaded()).toBeTruthy();

        const newFirstName = 'TestFirst' + Math.floor(Math.random() * 1000);
        const newLastName = 'TestLast' + Math.floor(Math.random() * 1000);

        console.log(`Updating name to: ${newFirstName} ${newLastName}`);

        await myAccInfoPage.updateAccInfo({
            firstName: newFirstName,
            lastName: newLastName,
        });

        await myAccInfoPage.clickContinue();

        expect(await myAccountPage.isConfirmationMsgDisplayed()).toBeTruthy();
        expect(await myAccountPage.getConfirmationText()).toContain('Success: Your account has been successfully updated.');

        // Optionally, verify that the updated information is reflected in the account page
        await myAccountPage.clickEditAccount();
        expect.soft(await myAccInfoPage.isPageLoaded()).toBeTruthy();
        const currentFirstName = (await myAccInfoPage.getAccInfo()).firstName;
        const currentLastName = (await myAccInfoPage.getAccInfo()).lastName;
        
        expect(currentFirstName).toBe(newFirstName);
        expect(currentLastName).toBe(newLastName);
    });

});