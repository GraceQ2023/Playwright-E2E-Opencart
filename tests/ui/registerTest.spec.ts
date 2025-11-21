/**
 * Registration Test Suite
 * 
 * Test case 1: Verify valid registration
 * Test case 2: Verify invalid registration - password mismatch
 * Test case 3: Verify invalid registration - email already registered
 * Test case 4: Verify invalid registration - not checking privacy policy
 */


import {test, expect} from '@playwright/test';
import { TestConfig } from '../../test.config';
import { HomePage } from '../../pages/HomePage';
import { RegisterPage } from '../../pages/RegisterPage';
import { RandomDataUtil } from '../../utils/randomDataGenerator';
import { RegisterSuccessPage } from '../../pages/RegisterSuccessPage';


test.describe('User Registration Functionality', () => {

    let homePage: HomePage;
    let registerPage: RegisterPage;
    let registerSuccessPage: RegisterSuccessPage;

    test.beforeEach(async ({page}) => {
        homePage = new HomePage(page);
        registerPage = new RegisterPage(page);
        registerSuccessPage = new RegisterSuccessPage(page);

        await page.goto(TestConfig.appUrl); 
        await homePage.goToRegisterPage();
    });


    /**
     * Test Case 1: Verify valid registration
     */
    test('Verify valid registration @master @sanity', async () => {

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

        expect(await registerSuccessPage.isPageLoaded()).toBeTruthy();

    });


    /**
     * Test Case 2: Verify invalid registration - password mismatch
     */
    test('Verify invalid registration 1: password mismatch @regression', async () => {

        expect(await registerPage.isPageLoaded()).toBeTruthy();
        
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

        const errorMsg: string = await registerPage.getFieldErrorMsg();
        expect(errorMsg).toContain('Password confirmation does not match password!');
    });


    /**
     * Test Case 3: Verify invalid registration - email already registered
     */
    test('Verify invalid registration 2: email already registered @regression', async () => {

        expect(await registerPage.isPageLoaded()).toBeTruthy();
        
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

        const warningMsg: string = await registerPage.getWarningMsg();
        expect(warningMsg).toContain('Warning: E-Mail Address is already registered!');

    });


    /**     
     * Test Case 4: Verify invalid registration - not checking privacy policy
     */
    test('Verify invalid registration 3: not checking privacy policy @regression', async () => {

        expect(await registerPage.isPageLoaded()).toBeTruthy();
 
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
        
        const warningMsg: string = await registerPage.getWarningMsg();
        expect(warningMsg).toContain('Warning: You must agree to the Privacy Policy!');
    });

});