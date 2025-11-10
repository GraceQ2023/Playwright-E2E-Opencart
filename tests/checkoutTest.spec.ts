


// Step 7: Attempt checkout process (skipped due to demo site limitations)
// Note: Checkout steps are skipped as the demo site does not support full checkout functionality


import { test, expect } from '@playwright/test';
import { CheckoutPage } from '../pages/CheckoutPage';
import { RandomDataUtil } from '../utils/randomDataGenerator';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';
import { TestConfig } from '../test.config';
import { MyAccountPage } from '../pages/MyAccountPage';


test.describe('Checkout Functionality', () => {
    let homePage: HomePage;
    let loginPage: LoginPage;
    let checkoutPage: CheckoutPage;
    let myAccountPage: MyAccountPage;

    test.beforeEach(async ({page}) => {

        // initialize page objects

        homePage = new HomePage(page);
        loginPage = new LoginPage(page);
        checkoutPage = new CheckoutPage(page);
        myAccountPage = new MyAccountPage(page);
        await page.goto(TestConfig.appUrl); 
    });



    test('Guest checkout proceeds up to payment warning', async () => {
    
        await homePage.addProductToCartFromHomePage();
        await homePage.navigateToCheckout();
        expect.soft(await checkoutPage.isPageLoaded()).toBeTruthy();
        
        await checkoutPage.chooseCheckoutOption('Guest Checkout');

        await checkoutPage.fillCheckoutForm_GuestCheckout({
            firstName: RandomDataUtil.generateFirstName(),
            lastName: RandomDataUtil.generateLastName(),
            email: RandomDataUtil.generateEmail(),
            tel: RandomDataUtil.generatePhoneNumber(),
            address: RandomDataUtil.generateStreetAddress(),
            city: RandomDataUtil.generateCity(),
            postCode: '3000',
            country: 'Australia',
            state: 'Victoria',
        });

        expect(await checkoutPage.isWarningMsgDisplayed()).toBeTruthy();

    });



    test('Registered user first checkout proceeds up to payment warning', async () => {

        await homePage.goToLoginPage();
        expect.soft(await loginPage.isPageLoaded()).toBeTruthy();
        await loginPage.login(TestConfig.newUser.email, TestConfig.newUser.password);
        expect.soft(await myAccountPage.isPageLoaded()).toBeTruthy();
        await myAccountPage.navigateToHomePage();
        expect.soft(await homePage.isPageLoaded()).toBeTruthy();

        await homePage.addProductToCartFromHomePage();
        await homePage.navigateToCheckout();
        expect.soft(await checkoutPage.isPageLoaded()).toBeTruthy();

        await checkoutPage.fillCheckoutForm_RegisteredUserFirstOrder({
            firstName: RandomDataUtil.generateFirstName(),
            lastName: RandomDataUtil.generateLastName(),
            address: RandomDataUtil.generateStreetAddress(),
            city: RandomDataUtil.generateCity(),
            postCode: '3000',
            country: 'Australia',
            state: 'New South Wales',
        });

        expect(await checkoutPage.isWarningMsgDisplayed()).toBeTruthy();
    });


    test('Returning customer checkout proceeds up to payment warning', async () => {

        await homePage.addProductToCartFromHomePage();
        expect.soft(await homePage.isConfirmAlertDisplayed()).toBeTruthy();
        await homePage.navigateToCheckout();
        expect.soft(await checkoutPage.isPageLoaded()).toBeTruthy();

        await checkoutPage.loginAsReturningCustomer(TestConfig.validUser.email, TestConfig.validUser.password);

        expect(await checkoutPage.isWarningMsgDisplayed()).toBeTruthy();
    });

});
