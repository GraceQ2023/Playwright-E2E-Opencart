/**
 * Random Data Generator Utility - provides methods to generate random user data for testing.
 */

import { faker } from '@faker-js/faker';

export class RandomDataUtil{

    static generateFirstName(): string {
        return faker.person.firstName();
    }

    static generateLastName(): string {
        return faker.person.lastName();
    }

    static generateEmail(): string {
        return faker.internet.email();
    }

    static generatePassword(): string {
        return faker.internet.password(); // minimum 8 characters
    }

    static generatePhoneNumber(): string {
        return faker.phone.number(); 
    }

    static generateCountry(): string {
        return faker.location.country();
    }

    static generateCity(): string {
        return faker.location.city();
    }

    static generateAddress(): string {
        return faker.location.streetAddress();
    }

    static generateZipCode(): string {
        return faker.location.zipCode();
    }

    static generateDrink():string {
        return faker.commerce.productName();
    }

    static generateStreetAddress(): string {
        return faker.location.streetAddress();
    }

}