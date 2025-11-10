/**
 * Test Case: End-to-End Test workflow 2
 * 
 * Purpose:
 * This test verifies the update of account information for an existing user.
 * 
 * Steps:
 * 1) Login with existing account
 * 2) Navigate to Edit Account Information
 * 3) Update account information: telephone and email
 * 4) Logout after update
 * 5) Login with updated email
 * 6) Verify updated account information
 * 7) Logout
 */


import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';
import { MyAccountPage } from '../pages/MyAccountPage';
import { MyAccInfoPage, AccountData } from '../pages/MyAccInfoPage';
import { LogoutPage } from '../pages/LogoutPage';
import { RandomDataUtil } from '../utils/randomDataGenerator';
import { TestConfig } from '../test.config';

test.describe('E2E Workflow 2: Update Account Info @end-to-end', { tag: ['@e2e', '@workflow2'] }, () => {

    test('should update account information and verify changes', async ({ page }) => {

        // Step 0: Initialize page objects that do not depend on navigation
        const homePage = new HomePage(page);
        const loginPage = new LoginPage(page);

        // Step 1: Generate test data
        const existingEmail = TestConfig.newUser.email;
        const existingPassword = TestConfig.newUser.password;
        const newEmail = RandomDataUtil.generateEmail();
        const newTelephone = RandomDataUtil.generatePhoneNumber();

        // Step 0: Navigate to home page
        await test.step('Navigate to homepage', async () => {
            await page.goto(TestConfig.appUrl);
            expect(await homePage.isPageLoaded(), 'Home page should be loaded').toBeTruthy();
        });

        console.log("✅ Navigated to heome page and started the test!");


        // Step 1: Login with existing account
        let myAccountPage = new MyAccountPage(page);

        await test.step('Login with existing account', async () => {

            await homePage.goToLoginPage();
            expect(await loginPage.isPageLoaded(), 'Login page should be loaded').toBeTruthy();
            await loginPage.login(existingEmail, existingPassword);
            expect(await myAccountPage.isPageLoaded(), 'My Account page should be loaded after login').toBeTruthy();

        });

        console.log("✅ Logged in with existing account!");


        // Step 2: Navigate to Edit Account Information
        let myAccInfoPage: MyAccInfoPage;

        await test.step('Navigate to my account information page', async () => {
            myAccInfoPage = await myAccountPage.clickEditAccount();  
            expect(await myAccInfoPage.isPageLoaded(), 'My Account Information page should be loaded').toBeTruthy();
        });

        console.log("✅ Navigated to my account info page");


        // Step 3: Update telephone and email
        await test.step('Update account information', async () => {
            const updatedData: AccountData = {
                email: newEmail,
                telephone: newTelephone,
            };

            console.log(`📝 new Email: ${newEmail}, new Telephone: ${newTelephone}`);

            await myAccInfoPage.updateAccInfo(updatedData);
            myAccountPage = await myAccInfoPage.clickContinue();  // ?? 
            expect(await myAccountPage.isConfirmationMsgDisplayed(), 'Confirmation message should be displayed').toBeTruthy();

            const confirmationText = await myAccountPage.getConfirmationText();
            expect(confirmationText).toContain('Success: Your account has been successfully updated.');
       
        });

        console.log("✅ Account information updated successfully!");


        // Step 4: Logout after update
        let logoutPage: LogoutPage;

        await test.step('Logout after updating account info', async () => {
            
            logoutPage = await myAccountPage.clickLogout();
            expect(await logoutPage.isLoggedOutMessageDisplayed(), 'Logout confirmation should be displayed').toBeTruthy();
            await logoutPage.clickContinue();
            expect(await homePage.isPageLoaded(), 'Home page should be loaded after logout').toBeTruthy();
        });

        console.log("✅ Logged out successfully after updating account info!");


        // Step 5: Login with updated email
        await test.step('Login with updated email', async () => {

            await homePage.goToLoginPage();
            await loginPage.login(newEmail, existingPassword);
            expect(await myAccountPage.isPageLoaded(), 'My Account page should be loaded after login with new email').toBeTruthy();

        });

        console.log("✅ Logged in successfully with updated email!");


        // Step 6: Verify updated account information
        await test.step('Verify updated account information', async () => {

            myAccInfoPage = await myAccountPage.clickEditAccount();
            const currentAccInfo = await myAccInfoPage.getAccInfo();

            expect(currentAccInfo.email, 'Email should match updated email').toBe(newEmail);
            expect(currentAccInfo.telephone, 'Telephone should match updated telephone').toBe(newTelephone);
        });

        console.log("✅ Verified updated account information successfully!");


        // Step 7: Logout after verification
        await test.step('Logout', async () => {

            await myAccInfoPage.clickContinue(); 
            logoutPage = await myAccountPage.clickLogout();
            expect(await logoutPage.isLoggedOutMessageDisplayed(), 'Logout confirmation should be displayed').toBeTruthy();
            await logoutPage.clickContinue();
            expect(await homePage.isPageLoaded(), 'Home page should be loaded after logout').toBeTruthy();
        });

        console.log("✅ Logged out successfully!");

    });

});
