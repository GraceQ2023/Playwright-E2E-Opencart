import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { MyAccountPage } from '../pages/MyAccountPage';
import { DataProvider } from '../utils/dataProvider';
import { TestConfig } from '../test.config';
import { HomePage } from '../pages/HomePage';


// Data driven test - Login functionality

// Load test data from CSV
const csvPath = "testData/logindata.csv";
let loginTestData: any[] = [];

try {
  loginTestData = DataProvider.getTestDataFromCsv(csvPath);
} catch (error) {
  console.error(`❌ Failed to load CSV data from ${csvPath}:`, error);
}


test.describe('Login Functionality - Data Driven Test', () => {

    for (const data of loginTestData) {

        test(`Login Test: ${data.testName} @dataDriven`, async ({ page }) => {

            await page.goto(TestConfig.appUrl);

            const homePage = new HomePage(page);
            const loginPage = new LoginPage(page);
            const myAccountPage = new MyAccountPage(page);

            await homePage.goToLoginPage();
            await loginPage.login(data.email, data.password);

            if (data.expected.trim().toLowerCase() === 'success') {
                const isLoggedIn = await myAccountPage.isPageLoaded();
                expect(isLoggedIn).toBeTruthy();
            } else {
                const errorMsg = await loginPage.getLoginErrorMsg();
                expect(errorMsg).toContain('Warning: No match for E-Mail Address and/or Password.');
            } 
        });
    }

});

