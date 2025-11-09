import {test, expect} from '@playwright/test';
import { TestConfig } from '../test.config';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';
import { LogoutPage } from '../pages/LogoutPage';
import { MyAccountPage } from '../pages/MyAccountPage';

test.describe('User Logout Functionality', () => {
    let homePage: HomePage;
    let loginPage: LoginPage;
    let myAccountPage: MyAccountPage;
    let logoutPage: LogoutPage;
    let config: TestConfig;

    // Hook runs before each test in this describe block 
    test.beforeEach(async ({page}) => {

        // initialize page objects
        config = new TestConfig(); // load config file (url, credentials..))
        await page.goto(TestConfig.appUrl); // navigate to base url 

        homePage = new HomePage(page);
        loginPage = new LoginPage(page);
        myAccountPage = new MyAccountPage(page);
        logoutPage = new LogoutPage(page);

    });


    test('User can successfully log out @master @regression', async () => {
        await homePage.goToLoginPage();
        await loginPage.login(TestConfig.validUser.email, TestConfig.validUser.password);
        expect.soft(await myAccountPage.isPageLoaded()).toBeTruthy();

        await myAccountPage.clickLogout();
        expect(await logoutPage.isLoggedOutMessageDisplayed()).toBeTruthy();
        await logoutPage.clickContinue();
        expect(await homePage.isPageLoaded()).toBeTruthy();

    });

});