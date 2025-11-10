/**
 * Test Case: End-to-End Test workflow 1
 *
 * Purpose:
 * This test simulates a complete user flow on an e-commerce site.
 * 
 * Steps:
 * 1) Register a new account
 * 2) Logout after registration
 * 3) Login using the newly registered account
 * 4) Search for a product and add it to the shopping cart
 * 5) Verify cart contents
 * 6) Proceed to checkout 
 * 7) Logout
 */

import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { RegisterPage } from '../pages/RegisterPage';
import { LoginPage } from '../pages/LoginPage';
import { SearchResultPage } from '../pages/SearchResultPage';
import { ProductPage } from '../pages/ProductPage';
import { CartPage } from '../pages/CartPage';
import { MyAccountPage } from '../pages/MyAccountPage';
import { LogoutPage } from '../pages/LogoutPage';
import { RandomDataUtil } from '../utils/randomDataGenerator';
import { TestConfig } from '../test.config';
import { CheckoutPage } from '../pages/CheckoutPage';
import { OrderConfirmationPage } from '../pages/OrderConfirmationPage';


// E2E Workflow Test: Register → Login → Search Product → Add to Cart → Checkout (skipped) → Logout
test.describe('E2E Workflow 1: Register → Logout → Login → Search Product → Add product to Cart → Verify Cart → Checkout → Logout @end-to-end', { tag: ['@e2e', '@workflow1'] }, () => {

    test('Should complete registration, login, product search, add to cart, checkout, and logout flow', async ({ page }) => {

        // Initialize page objects
        const homePage = new HomePage(page);
        const registerPage = new RegisterPage(page);
        const loginPage = new LoginPage(page);
        const searchResultPage = new SearchResultPage(page);
        const productPage = new ProductPage(page);
        const cartPage = new CartPage(page);
        const myAccountPage = new MyAccountPage(page);
        const logoutPage = new LogoutPage(page);
        const checkoutPage = new CheckoutPage(page);
        const product = TestConfig.product;
        const registeredEmail = RandomDataUtil.generateEmail();
        const registeredPassword = RandomDataUtil.generatePassword();
        let orderConfirmationPage: OrderConfirmationPage;

        // Step 0: Navigate to home page
        await test.step('Navigate to homepage', async () => {
            await page.goto(TestConfig.appUrl);
            expect(await homePage.isPageLoaded(), 'Home page should be loaded').toBeTruthy();
        });

        console.log("✅ Navigated to home page and started the test!");


         // Step 1: Register a new account 
        await test.step('Register a new user', async () => {

            await homePage.goToRegisterPage();

            await registerPage.fillRegistrationForm({
                fName: RandomDataUtil.generateFirstName(),
                lName: RandomDataUtil.generateLastName(),
                email: registeredEmail,
                tel: RandomDataUtil.generatePhoneNumber(),
                pwd: registeredPassword,
                confirmPwd: registeredPassword,
            });

            await registerPage.agreeToPrivacyPolicy();
            await registerPage.submitRegistrationForm();
            expect(await registerPage.isRegistrationSuccess(), 'Registration should be successful').toBeTruthy();
        });

        console.log("✅ Registration is completed!");


        // Step 2: Logout after registration
        await test.step('Logout after registration', async () => {

            await myAccountPage.clickLogout();
            expect( await logoutPage.isLoggedOutMessageDisplayed(), 'Logout confirmation should be displayed').toBeTruthy();
            await logoutPage.clickContinue();
            expect( await homePage.isPageLoaded(), 'Home page should be loaded after logout').toBeTruthy();
        });

        console.log("✅ Logout is completed!");


        // Step 3: Login with new registered email

        await test.step('Login with new registered account', async () => {
            await homePage.goToLoginPage();
            expect( await loginPage.isPageLoaded(), 'Login page should be loaded').toBeTruthy();
            await loginPage.login(registeredEmail, registeredPassword);
            expect( await myAccountPage.isPageLoaded(), 'My Account page should be loaded after login').toBeTruthy();
        });

        console.log("✅ Login using the new registered account is completed!");


        // Step 4: Search and select a product 

        await test.step('Search and select a product', async () => {

            await homePage.searchProduct(product.name);
            expect( await searchResultPage.isPageLoaded(), 'Search Results page should be loaded').toBeTruthy();
            expect( await searchResultPage.hasProduct(product.name), 'Product should be listed in search results').toBeTruthy();
            await searchResultPage.selectProductIfExists(product.name);
            expect( await productPage.isPageLoaded(product.name), 'Product page should be loaded').toBeTruthy();
        });

        console.log("✅ Searched product and found!");


        // Step 5; Add product to cart 

        await test.step('Add product to shopping cart', async () => {

            await productPage.addProductToCart(product.quantity.toString());
            expect( await productPage.isConfirmAlertDisplayed(), 'Product added confirmation should be displayed').toBeTruthy();
            await productPage.navigateToShoppingCart();
            expect( await cartPage.isPageLoaded(), 'Shopping Cart page should be loaded').toBeTruthy();

        });

        console.log("✅ Product added to cart!");


        // Step 6: verify cart contents

        await test.step('Verify shopping cart contents', async () => {
            const cartItems = await cartPage.getCartItems();
            const targetItem = cartItems.find(
                item => item.name.toLowerCase().includes(product.name.toLowerCase())
            );

            expect(targetItem, 'Product should be found in the cart').toBeTruthy(); // check product is found
            expect(targetItem?.quantity, 'Product quantity in cart should match').toBe(Number(product.quantity)); // verify quantity


        });

        console.log("✅ Shopping cart verification completed!");


        // Step 7: Checkout process

        await test.step('Checkout process', async () => {

            await cartPage.clickCheckoutBtn();
            expect(await checkoutPage.isPageLoaded(), 'Checkout page should be loaded').toBeTruthy();

            await checkoutPage.fillCheckoutForm_RegisteredUserFirstOrder({
                firstName: RandomDataUtil.generateFirstName(),
                lastName: RandomDataUtil.generateLastName(),
                address: RandomDataUtil.generateStreetAddress(),
                city: RandomDataUtil.generateCity(),
                postCode: '3000',
                country: 'Australia',
                state: 'Victoria',
            });

            orderConfirmationPage = await checkoutPage.clickConfirmOrder();  // capture the returned page object
            expect (await orderConfirmationPage.isPageLoaded(), 'Order confirmation page should be loaded').toBeTruthy();

        });

        console.log("✅ Checkout process is completed and order confirmation is displayed!");


        // Final Step: Logout
        await test.step('Logout from account', async () => {

            const homePageAfterOrder: HomePage = await orderConfirmationPage.clickContinue();
            expect(await homePageAfterOrder.isPageLoaded(), 'Home page should be loaded').toBeTruthy();

            // Navigate to My Account and logout
            await homePageAfterOrder.goToLogoutPage();
            expect(await logoutPage.isLoggedOutMessageDisplayed(), 'Logout confirmation should be displayed').toBeTruthy();
            await logoutPage.clickContinue();
            expect(await homePage.isPageLoaded(), 'Home page should be loaded after logout').toBeTruthy();

        });

        console.log("✅ Logout is completed and returned to Home Page!");

    });

});