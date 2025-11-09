
import {test, expect} from '@playwright/test';
import { TestConfig } from '../test.config';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';
import { MyAccountPage } from '../pages/MyAccountPage';


test.describe('User Login Functionality', () => {
    let homePage: HomePage;
    let loginPage: LoginPage;
    let myAccountPage: MyAccountPage;
    let config: TestConfig;

    // Hook runs before each test in this describe block 
    test.beforeEach(async ({page}) => {

        // initialize page objects
        config = new TestConfig(); // load config file (url, credentials..))
        homePage = new HomePage(page);
        loginPage = new LoginPage(page);
        myAccountPage = new MyAccountPage(page);

        await page.goto(TestConfig.appUrl); // navigate to base url 
        await homePage.goToLoginPage();
    });



    // Valid login test
    test('Verify valid login @master @sanity @regression', async () => {

        await loginPage.login(TestConfig.validUser.email, TestConfig.validUser.password);
        const isLoggedIn = await myAccountPage.isPageLoaded();
        expect(isLoggedIn).toBeTruthy();
    });

    // Invalid login test
    test('Verify invalid login @regression', async () => {

        await loginPage.login(TestConfig.invalidUser.email, TestConfig.invalidUser.password);
        const errorMsg: string = await loginPage.getLoginErrorMsg();
        expect(errorMsg).toContain('Warning: No match for E-Mail Address and/or Password.');
    });

});