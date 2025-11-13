
export class TestConfig{

// Application URL
    // static readonly appUrl = 'http://localhost/opencart';

    // loopback ip address for localhost, works for both local and CI environments
    static readonly appUrl ='http://127.0.0.1/opencart/'; 


    // Valid user credentials 
    static readonly validUser = {
        email: 'grace.test@gmail.com',
        password: 'test1234'
    };


    // Valid user credentials - new user for edit account tests
    static readonly newUser = {
        fName: 'test17',
        lName: 'test17',
        email: 'test17@gmail.com',
        tel: '123456',
        password: 'test'
    };


    // Invalid user credentials for negative testing
     static readonly invalidUser = {
        email: 'invalid.user@gmail.com',
        password: 'test@1'
    };


    // Product details for product related tests (search, add to cart, checkout)
    static readonly product = {
        name: 'iMac',
        quantity: 3,
        totalPrice: '$366.00'
    };


    // DB configs
    // static readonly apiEndpoint = 'http://localhost/opencart/api';
    static readonly dbConfig = {
        dbHost: 'localhost',
        dbUser: 'root',
        dbPassword: '',
        dbName: 'openshop'
    };

}