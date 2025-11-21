/**
 * Test Case: End-to-End Test workflow 1 with Database Verification
 *
 * Purpose:
 * This test performs an end-to-end verification of the user registration, login, product search, add to cart, checkout, and logout process,
 * 
 * Steps:
 * 1) Register a new account
 * 2) Logout after registration
 * 3) Login using the newly registered account
 * 4) Search for a product and add it to shopping cart
 * 5) Verify cart contents
 * 6) Proceed to checkout 
 * 7) Logout
 * 8) Verify new customer exists in database
 */

import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';
import { RegisterPage } from '../../pages/RegisterPage';
import { RegisterSuccessPage } from '../../pages/RegisterSuccessPage';
import { LoginPage } from '../../pages/LoginPage';
import { SearchResultPage } from '../../pages/SearchResultPage';
import { ProductPage } from '../../pages/ProductPage';
import { CartPage } from '../../pages/CartPage';
import { MyAccountPage } from '../../pages/MyAccountPage';
import { LogoutPage } from '../../pages/LogoutPage';
import { RandomDataUtil } from '../../utils/randomDataGenerator';
import { TestConfig } from '../../test.config';
import { CheckoutPage } from '../../pages/CheckoutPage';
import { OrderConfirmationPage } from '../../pages/OrderConfirmationPage';
import { DBUtil } from '../../utils/dbUtil';


// E2E Workflow Test: Register → Login → Search Product → Add to Cart → Checkout → Logout
test.describe('E2E Workflow 1: Register → Logout → Login → Search Product → Add product to Cart → Verify Cart → Checkout → Logout → DB verification', { tag: ['@e2e', '@workflow1', '@db'] }, () => {

    test('Verify complete registration, login, product search, add to cart, checkout, and database verification', async ({ page }) => {

        // Declare page objects
        let homePage: HomePage;
        let registerPage: RegisterPage;
        let registerSuccessPage: RegisterSuccessPage;
        let loginPage: LoginPage;
        let searchResultPage: SearchResultPage;
        let productPage: ProductPage;
        let cartPage: CartPage;
        let myAccountPage: MyAccountPage;
        let logoutPage: LogoutPage;
        let checkoutPage: CheckoutPage;
        let orderConfirmationPage: OrderConfirmationPage;
        const product = TestConfig.product;

        // --- Step 0: Generate test data ---
        const registerEmail = RandomDataUtil.generateEmail();       // store generated email for later login
        const registerPassword = RandomDataUtil.generatePassword(); // store generated password for later login

        let registerData = {
            fName: RandomDataUtil.generateFirstName(),
            lName: RandomDataUtil.generateLastName(),
            email: registerEmail,
            tel: RandomDataUtil.generatePhoneNumber(),
            pwd: registerPassword,
            confirmPwd: registerPassword,
        };

        let checkoutData = {
            firstName: RandomDataUtil.generateFirstName(),
            lastName: RandomDataUtil.generateLastName(),
            address: RandomDataUtil.generateStreetAddress(),
            city: RandomDataUtil.generateCity(),
            postCode: '3000',
            country: 'Australia',
            state: 'Victoria',
        };


        // --- Step 1: Navigate to home page ---
        await test.step('Navigate to homepage', async () => {

            homePage = new HomePage(page);
            await page.goto(TestConfig.appUrl);
            expect(await homePage.isPageLoaded(), 'Home page should be loaded').toBeTruthy();
        });

        console.log("✅ Navigated to homepage and started the test!");


        // --- Step 2: Register a new user ---
        await test.step('Register a new user', async () => {

            registerPage = new RegisterPage(page);
            registerSuccessPage = new RegisterSuccessPage(page);
            await homePage.goToRegisterPage();
            await registerPage.fillRegistrationForm(registerData);
            await registerPage.agreeToPrivacyPolicy();
            await registerPage.submitRegistrationForm();
            expect(await registerSuccessPage.isPageLoaded(), 'Registration should be successful').toBeTruthy();
        });

        console.log("✅ Registration is completed!");
        

        // --- Step 3: Logout after registration ---
        await test.step('Logout after registration', async () => {

            myAccountPage = await registerSuccessPage.clickContinue();
            logoutPage = new LogoutPage(page);

            await myAccountPage.clickLogout();
            // expect(await logoutPage.isLoggedOutMessageDisplayed(), 'Logout confirmation should be displayed').toBeTruthy();
            expect(await logoutPage.isPageLoaded()).toBeTruthy();
            await logoutPage.clickContinue();
            expect(await homePage.isPageLoaded(), 'Home page should be loaded after logout').toBeTruthy();
        });

        console.log("✅ Logout is completed!");


        // --- Step 4: Login with new registered account ---
        await test.step('Login with new registered account', async () => {

            loginPage = new LoginPage(page);
            await homePage.goToLoginPage();
            expect( await loginPage.isPageLoaded(), 'Login page should be loaded').toBeTruthy();
            await loginPage.login(registerData.email, registerData.pwd);
            expect( await myAccountPage.isPageLoaded(), 'My Account page should be loaded after login').toBeTruthy();
        });

        console.log("✅ Login using the new registered account is completed!");


        // --- Step 5: Search and select a product ---
        await test.step('Search and select a product', async () => {

            searchResultPage = new SearchResultPage(page);
            productPage = new ProductPage(page)
            await homePage.searchProduct(product.name);
            expect(await searchResultPage.isPageLoaded(), 'Search Results page should be loaded').toBeTruthy();
            expect(await searchResultPage.hasProduct(product.name), 'Product should be listed in search results').toBeTruthy();
            await searchResultPage.selectProductIfExists(product.name);
            expect(await productPage.isPageLoaded(product.name), 'Product page should be loaded').toBeTruthy();
        });

        console.log("✅ Searched and product found!");


        // --- Step 6: Add product to cart ---
        await test.step('Add product to shopping cart', async () => {

            cartPage = new CartPage(page);
            await productPage.addProductToCart(product.quantity.toString());
            expect(await productPage.isConfirmAlertDisplayed(), 'Product added confirmation should be displayed').toBeTruthy();
            await productPage.navigateToShoppingCart();
            expect(await cartPage.isPageLoaded(), 'Shopping Cart page should be loaded').toBeTruthy();

        });

        console.log("✅ Product selected and added to cart!");


        // --- Step 7: Verify shopping cart contents ---
        await test.step('Verify shopping cart contents', async () => {

            const cartItems = await cartPage.getCartItems();
            const targetItem = cartItems.find(
                item => item.name.toLowerCase().includes(product.name.toLowerCase())
            );

            expect(targetItem, 'Product should be found in the cart').toBeTruthy(); // check product is found
            expect(targetItem?.quantity, 'Product quantity in cart should match').toBe(Number(product.quantity)); // verify quantity

        });

        console.log("✅ Cart verification completed!");


        // --- Step 8: Checkout process ---
        await test.step('Checkout process', async () => {

            checkoutPage = new CheckoutPage(page);
            await cartPage.clickCheckoutBtn();
            expect(await checkoutPage.isPageLoaded(), 'Checkout page should be loaded').toBeTruthy();

            await checkoutPage.fillCheckoutForm_RegisteredUserFirstOrder(checkoutData);
            orderConfirmationPage = await checkoutPage.clickConfirmOrder();  
            expect(await orderConfirmationPage.isPageLoaded(), 'Order confirmation page should be loaded').toBeTruthy();

        });

        console.log("✅ Checkout process is completed and order confirmation is displayed!");


        // --- Step 9: Logout after order completion ---
        await test.step('Logout from account', async () => {

            homePage = await orderConfirmationPage.clickContinue();
            expect(await homePage.isPageLoaded(), 'Home page should be loaded').toBeTruthy();

            await homePage.goToLogoutPage();
            // expect(await logoutPage.isLoggedOutMessageDisplayed(), 'Logout confirmation should be displayed').toBeTruthy();
            expect(await logoutPage.isPageLoaded()).toBeTruthy();
            await logoutPage.clickContinue();
            expect(await homePage.isPageLoaded(), 'Home page should be loaded after logout').toBeTruthy();

        });

        console.log("✅ Final logout completed!");

        
        // --- Step 10: Database verification ---
        await test.step('Verify new customer exists in database', async () => {

            const dbResult = await DBUtil.getCustomerByEmail(registerData.email);
            expect(dbResult.length, 'Customer record should exist in database').toBeGreaterThan(0);

            const dbCustomer = dbResult[0];
            expect(dbCustomer.firstname).toBe(registerData.fName);
            expect(dbCustomer.lastname).toBe(registerData.lName);
            expect(dbCustomer.email).toBe(registerData.email);

        });

        console.log("✅ Database verification for new customer is completed!");
    
    });

});
