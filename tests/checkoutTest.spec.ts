
import { test, expect } from '@playwright/test';
import { CheckoutPage } from '../pages/CheckoutPage';
import { RandomDataUtil } from '../utils/randomDataGenerator';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';
import { TestConfig } from '../test.config';
import { MyAccountPage } from '../pages/MyAccountPage';
import { OrderConfirmationPage } from '../pages/OrderConfirmationPage';

/**
 *  The checkout tests cover various checkout scenarios:
 *  - Guest checkout
 *  - Registered user first checkout
 *  - Returning customer checkout
 * 
 * However, due to the demo site's limitations, the checkout process is not fully functional, and not stable for automation.
 * Therefore, tests are marked as skipped until the site supports complete checkout functionality.
 */


test.describe('Checkout Functionality', () => {

    let homePage: HomePage;
    let loginPage: LoginPage;
    let checkoutPage: CheckoutPage;
    let myAccountPage: MyAccountPage;
    let orderConfirmationPage: OrderConfirmationPage;

    test.beforeEach(async ({page}) => {
        homePage = new HomePage(page);
        loginPage = new LoginPage(page);
        checkoutPage = new CheckoutPage(page);
        myAccountPage = new MyAccountPage(page);
        await page.goto(TestConfig.appUrl); 
    });



    test.skip ('Verify guest checkout process @wip', async () => {
    
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

        orderConfirmationPage = await checkoutPage.clickConfirmOrder();  
        expect (await orderConfirmationPage.isPageLoaded(), 'Order confirmation page should be loaded').toBeTruthy();
        // expect(await checkoutPage.isWarningMsgDisplayed()).toBeTruthy();

    });



    test.skip ('Verify registered user first checkout process @wip', async () => {

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

        orderConfirmationPage = await checkoutPage.clickConfirmOrder();  
        expect (await orderConfirmationPage.isPageLoaded(), 'Order confirmation page should be loaded').toBeTruthy();

    });


    test.skip ('Verify returning customer checkout process (up to warning shown) @wip', async () => {

        await homePage.addProductToCartFromHomePage();
        expect.soft(await homePage.isConfirmAlertDisplayed()).toBeTruthy();
        await homePage.navigateToCheckout();
        expect.soft(await checkoutPage.isPageLoaded()).toBeTruthy();

        await checkoutPage.loginAsReturningCustomer(TestConfig.validUser.email, TestConfig.validUser.password);
        await checkoutPage.fillCheckoutForm_ReturningCustomer();

        expect(await checkoutPage.isWarningMsgDisplayed()).toBeTruthy();
    });

});
