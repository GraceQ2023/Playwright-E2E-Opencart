
import {test, expect} from '@playwright/test';
import { TestConfig } from '../test.config';
import { HomePage } from '../pages/HomePage';
import { RegisterPage } from '../pages/RegisterPage';
import { RandomDataUtil } from '../utils/randomDataGenerator';


test.describe('User Registration Functionality', () => {
    let homePage: HomePage;
    let registerPage: RegisterPage;
    let config: TestConfig;

    // Hook runs before and after each test in this describe block 
    test.beforeEach(async ({page}) => {

        // initialize page objects
        config = new TestConfig(); 
        homePage = new HomePage(page);
        registerPage = new RegisterPage(page);

        await page.goto(TestConfig.appUrl); 
        await homePage.goToRegisterPage();
    });


    // Valid registration test
    test('Verify valid registration @master @sanity @regression', async () => {

        expect(await registerPage.isPageLoaded()).toBeTruthy();

        // fill in registration form with random data
        const generatedPwd = RandomDataUtil.generatePassword();
        await registerPage.fillRegistrationForm(
            {
            fName: RandomDataUtil.generateFirstName(),
            lName: RandomDataUtil.generateLastName(),
            email: RandomDataUtil.generateEmail(),
            tel: RandomDataUtil.generatePhoneNumber(),
            pwd : generatedPwd,
            confirmPwd: generatedPwd,
            }
        );

        await registerPage.agreeToPrivacyPolicy();
        await registerPage.submitRegistrationForm();

        // verify registration success
        expect(await registerPage.isRegistrationSuccess()).toBeTruthy();

    });


    // Invalid registration test 1 - password mismatch
    test('Verify invalid registration 1 - password mismatch @regression', async () => {

        expect(await registerPage.isPageLoaded()).toBeTruthy();
        // fill in registration form with random data
        await registerPage.fillRegistrationForm(
            {
            fName: RandomDataUtil.generateFirstName(),
            lName: RandomDataUtil.generateLastName(),
            email: RandomDataUtil.generateEmail(),
            tel: RandomDataUtil.generatePhoneNumber(),
            pwd: RandomDataUtil.generatePassword(),
            confirmPwd: RandomDataUtil.generatePassword(),
            }
        );

        await registerPage.agreeToPrivacyPolicy();
        await registerPage.submitRegistrationForm();

        // verify error message is shown 
        const errorMsg: string = await registerPage.getFieldErrorMsg();
        expect(errorMsg).toContain('Password confirmation does not match password!');
    });


    // Invalid registration test 2 - email already registered
    test('Verify invalid registration 2 - email already registered @regression', async () => {

        expect(await registerPage.isPageLoaded()).toBeTruthy();
        // fill in registration form with random data
        const generatedPwd = RandomDataUtil.generatePassword();
        await registerPage.fillRegistrationForm(
            {
            fName: RandomDataUtil.generateFirstName(),
            lName: RandomDataUtil.generateLastName(),
            email: TestConfig.validUser.email,        // use existing email
            tel: RandomDataUtil.generatePhoneNumber(),
            pwd : generatedPwd,
            confirmPwd: generatedPwd,
            }
        );

        await registerPage.agreeToPrivacyPolicy();
        await registerPage.submitRegistrationForm();

        // verify warning message is shown 
         const warningMsg: string = await registerPage.getWarningMsg();
        expect(warningMsg).toContain('Warning: E-Mail Address is already registered!');
    });


    // Invalid registration test 3 - not checking privacy policy
    test('Verify invalid registration 3 - not checking privacy policy @regression', async () => {

        expect(await registerPage.isPageLoaded()).toBeTruthy();
        // fill in registration form with random data
        const generatedPwd = RandomDataUtil.generatePassword();
        await registerPage.fillRegistrationForm(
            {
            fName: RandomDataUtil.generateFirstName(),
            lName: RandomDataUtil.generateLastName(),
            email: RandomDataUtil.generateEmail(),
            tel: RandomDataUtil.generatePhoneNumber(),
            pwd : generatedPwd,
            confirmPwd: generatedPwd,
            }
        );

        await registerPage.submitRegistrationForm();

        // verify warning message is shown 
        const warningMsg: string = await registerPage.getWarningMsg();
        expect(warningMsg).toContain('Warning: You must agree to the Privacy Policy!');
    });

});