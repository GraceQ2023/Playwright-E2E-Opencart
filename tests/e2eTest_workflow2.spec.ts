/**
 * Test Case: End-to-End Test workflow 2 with Database Verification
 * 
 * Purpose:
 * This test verifies the update of account information for an existing user, with database verification.
 * 
 * Steps:
 * 1) Login with existing account
 * 2) Navigate to Edit Account Information
 * 3) Update account information: first name and email
 * 4) Logout after update
 * 5) Login with updated email
 * 6) Verify updated account information (UI)
 * 7) Logout
 * 8) Verify updated account information in database
 */


import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';
import { MyAccountPage } from '../pages/MyAccountPage';
import { MyAccInfoPage} from '../pages/MyAccInfoPage';
import { LogoutPage } from '../pages/LogoutPage';
import { RandomDataUtil } from '../utils/randomDataGenerator';
import { TestConfig } from '../test.config';
import { DBUtil } from '../utils/dbUtil';


test.describe('E2E Workflow 2: Update Account Info', { tag: ['@e2e', '@workflow2', '@db'] }, () => {

    test('Verify update account information and database consistency', async ({ page }) => {

        // Declare page objects 
        let homePage: HomePage;
        let myAccountPage: MyAccountPage;
        let myAccInfoPage: MyAccInfoPage;
        let logoutPage: LogoutPage;
        let loginPage: LoginPage;

        // --- Step 0: Generate test data ---
        const existingFirstName = TestConfig.newUser.fName;
        const existingLastName = TestConfig.newUser.lName;
        const existingEmail = TestConfig.newUser.email;
        const existingTelephone = TestConfig.newUser.tel;
        const existingPassword = TestConfig.newUser.password;

        let updateData = {
            firstName: RandomDataUtil.generateFirstName(),
            email: RandomDataUtil.generateEmail(),
        };


        // --- Step 1: Navigate to home page ---
        await test.step('Navigate to homepage', async () => {

            homePage = new HomePage(page);
            await page.goto(TestConfig.appUrl);
            expect(await homePage.isPageLoaded(), 'Home page should be loaded').toBeTruthy();
        });

        console.log("✅ Navigated to home page!");


        // --- Step 2: Login with existing account ---
        await test.step('Login with existing account', async () => {

            myAccountPage = new MyAccountPage(page)
            loginPage = new LoginPage(page);
            await homePage.goToLoginPage();
            expect(await loginPage.isPageLoaded(), 'Login page should be loaded').toBeTruthy();
            await loginPage.login(existingEmail, existingPassword);
            expect(await myAccountPage.isPageLoaded(), 'My Account page should be loaded after login').toBeTruthy();

        });

        console.log("✅ Logged in with existing account!");


        // --- Step 3: Navigate to Edit Account ---
        await test.step('Navigate to my account information page', async () => {

            myAccInfoPage = await myAccountPage.clickEditAccount();  
            expect(await myAccInfoPage.isPageLoaded(), 'My Account Information page should be loaded').toBeTruthy();
        });

        console.log("✅ Navigated to my account information page");


        // --- Step 4: Update account information ---
        await test.step('Update firstname and email', async () => {

            await myAccInfoPage.updateAccInfo(updateData);
            myAccountPage = await myAccInfoPage.clickContinue();  
            expect(await myAccountPage.isConfirmationMsgDisplayed(), 'Confirmation message should be displayed').toBeTruthy();
            const confirmationText = await myAccountPage.getConfirmationText();
            expect(confirmationText).toContain('Success: Your account has been successfully updated.');
       
        });

        console.log("✅ Account information updated successfully (UI)!");


        // --- Step 5: Logout after update ---
        await test.step('Logout after account update', async () => {
            
            logoutPage = await myAccountPage.clickLogout();
            // expect(await logoutPage.isLoggedOutMessageDisplayed(), 'Logout confirmation should be displayed').toBeTruthy();
            expect(await logoutPage.isPageLoaded()).toBeTruthy();
            await logoutPage.clickContinue();
            expect(await homePage.isPageLoaded(), 'Home page should be loaded after logout').toBeTruthy();
        });

        console.log("✅ Logged out successfully!");


        // --- Step 6: Login with updated email ---
        await test.step('Login again using updated email', async () => {

            await homePage.goToLoginPage();
            await loginPage.login(updateData.email, existingPassword);
            expect(await myAccountPage.isPageLoaded(), 'My Account page should be loaded after login with new email').toBeTruthy();
        });

        console.log("✅ Logged in successfully with updated email!");


        // --- Step 7: Verify updated account information (UI) ---
        await test.step('Verify updated account information (UI)', async () => {

            myAccInfoPage = await myAccountPage.clickEditAccount();
            const currentAccInfo = await myAccInfoPage.getAccInfo();

            expect(currentAccInfo.firstName, 'First should match updated firstname').toBe(updateData.firstName);
            expect(currentAccInfo.lastName, 'Last name should remain unchanged').toBe(existingLastName);
            expect(currentAccInfo.email, 'Email should match updated email').toBe(updateData.email);
            expect(currentAccInfo.telephone, 'Telephone should remain unchanged').toBe(existingTelephone);
        });

        console.log("✅ Verified updated account information on UI!");


        // --- Step 8: Logout after verification ---
        await test.step('Logout after verification', async () => {

            myAccountPage = await myAccInfoPage.clickContinue(); 
            logoutPage = await myAccountPage.clickLogout();
            // expect(await logoutPage.isLoggedOutMessageDisplayed(), 'Logout confirmation should be displayed').toBeTruthy();
            expect(await logoutPage.isPageLoaded()).toBeTruthy();
            await logoutPage.clickContinue();
            expect(await homePage.isPageLoaded(), 'Home page should be loaded after logout').toBeTruthy();
        });

        console.log("✅ Logged out successfully after verification!");


        // --- Step 9: Database verification ---
        await test.step('Verify updated account information in database', async () => {

            const dbResult = await DBUtil.getCustomerByEmail(updateData.email);
            expect(dbResult.length, 'Customer record should exist in database').toBeGreaterThan(0);

            const dbCustomer = dbResult[0];
            expect(dbCustomer.firstname).toBe(updateData.firstName);
            expect(dbCustomer.lastname).toBe(existingLastName);
            expect(dbCustomer.email).toBe(updateData.email);
            expect(dbCustomer.telephone).toBe(existingTelephone);
        });

        console.log("✅ Database verification completed!");
    });

});