import mysql from 'mysql2/promise';
import { TestConfig } from '../test.config';

export class DBUtil {

    // establish and return a database connection
    private static async getConnection(){
        return mysql.createConnection({
            host: TestConfig.dbConfig.dbHost,
            user: TestConfig.dbConfig.dbUser,
            password: TestConfig.dbConfig.dbPassword,
            database: TestConfig.dbConfig.dbName,
        });
    }

    // simple query runner 
    static async runQuery(query: string, params: any[] = []): Promise<any[]> {
        const connection = await this.getConnection();
        const [rows] = await connection.execute(query, params);
        await connection.end();
        return rows as any[];
    }

    
    // Query: Get customer record by email
    static async getCustomerByEmail(email: string): Promise<any[]> {

        const connection = await this.getConnection();

        const query = 'SELECT * FROM oc_customer WHERE email = ?';
        const [rows] = await connection.execute(query, [email]);
        await connection.end();
        return rows as any[];
    }
 
}