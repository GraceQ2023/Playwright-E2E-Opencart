
export class TestConfig{

// Application URL
    static readonly appUrl = 'http://localhost/opencart';

// User credentials 
    static readonly validUser = {
        email: 'grace.test@gmail.com',
        password: 'test1234'
    };

    static readonly newUser = {
        fName: 'test17',
        lName: 'test17',
        email: 'test17@gmail.com',
        tel: '123456',
        password: 'test'
    };

     static readonly invalidUser = {
        email: 'invalid.user@gmail.com',
        password: 'test@1'
    };

// Product info

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