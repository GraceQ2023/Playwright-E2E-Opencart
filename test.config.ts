
export class TestConfig{

// Application URL
    static readonly appUrl = 'http://localhost/opencart';

// User credentials 
    static readonly validUser = {
        email: 'grace.test@gmail.com',
        password: 'test1234'
    };

    static readonly newUser = {
        email: 'test10@gmail.com',
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

// API & DB configs
    static readonly apiEndpoint = 'http://localhost/opencart/api';
    static readonly dbConfig = {
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'openshop'
    };

}