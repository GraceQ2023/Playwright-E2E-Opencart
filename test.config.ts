
export class TestConfig{

// Application URL

    // for local testing 
    //static readonly appUrl = 'http://localhost/opencart';

    // for CI/Jenkins testing (build pipeline):
    static readonly appUrl ='http://127.0.0.1/opencart/'; 


    // Valid user credentials 
    static readonly validUser = {
        email: 'grace.test@gmail.com',
        password: 'test1234'
    };


    // Valid user credentials - new user for edit account tests
    static readonly newUser = {
        fName: 'test18',
        lName: 'test18',
        email: 'test18@gmail.com',
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