
/**
 * @fileoverview Data driven test for user registration functionality using CSV data source.
 * This test reads registration details and expected outcomes from CSV file
 */


import { test, expect } from '@playwright/test';
import { RegisterPage } from '../../pages/RegisterPage';
import { RegisterSuccessPage } from '../../pages/RegisterSuccessPage';
import { DataProvider } from '../../utils/dataProvider';
import { TestConfig } from '../../test.config';
import { HomePage } from '../../pages/HomePage';
import { RandomDataUtil } from '../../utils/randomDataGenerator';


// Data driven test for user registration functionality using CSV data source

// Load test data from CSV
const csvPath = "testData/registerdata.csv";
let registerTestData: any[] = [];

try {
  registerTestData = DataProvider.getTestDataFromCsv(csvPath);
} catch (error) {
  console.error(`❌ Failed to load CSV data from ${csvPath}:`, error);
}


test.describe('User Registration Functionality - Data Driven Test', () => {

    for (const data of registerTestData) {

        test(`Registration Test: ${data.testName} @dataDriven`, async ({ page }) => {

            const homePage = new HomePage(page);
            const registerPage = new RegisterPage(page);
            const registerSuccessPage = new RegisterSuccessPage(page);

            await page.goto(TestConfig.appUrl);
            await homePage.goToRegisterPage();
            expect(await registerPage.isPageLoaded()).toBeTruthy();

            // Generate random data where indicated
            const firstName = data.fName === 'RandomFirst' ? RandomDataUtil.generateFirstName() : data.fName;
            const lastName = data.lName === 'RandomLast' ? RandomDataUtil.generateLastName() : data.lName;
            const email = data.email === 'RandomEmail' ? RandomDataUtil.generateEmail() : data.email;
            const telephone = data.tel === 'RandomTel' ? RandomDataUtil.generatePhoneNumber() : data.tel;
            const password = data.pwd;
            const confirmPassword = data.confirmPwd;

            // Fill in registration form
            await registerPage.fillRegistrationForm(
                {
                    fName: firstName,
                    lName: lastName,
                    email: email,
                    tel: telephone,
                    pwd : password,
                    confirmPwd: confirmPassword,
                }
            );

            // Agree to privacy policy if true
            if (data.agreePrivacy.toLowerCase() === 'true') {
                await registerPage.agreeToPrivacyPolicy();
            }

            await registerPage.submitRegistrationForm();


            // Assert expected results
            if (data.expectedResult === 'success') {
                expect(await registerSuccessPage.isPageLoaded()).toBeTruthy();
            } else if (data.expectedResult === 'fieldError') {
                expect(await registerPage.getFieldErrorMsg()).toContain(data.expectedMsg);
            } else if (data.expectedResult === 'warning') {
                expect(await registerPage.getWarningMsg()).toContain(data.expectedMsg);
            }
        });
    }

});