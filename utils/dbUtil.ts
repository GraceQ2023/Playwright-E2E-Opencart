/**
 * DB Utility - provides methods to interact with the database for test verification.
 */

import mysql from 'mysql2/promise';
import { TestConfig } from '../test.config';


export class DBUtil {
    
    /**
     * Establishes and returns a MySQL database connection
     * @returns Promise<mysql.Connection>
     */
    private static async getConnection(){
        return mysql.createConnection({
            host: TestConfig.dbConfig.dbHost,
            user: TestConfig.dbConfig.dbUser,
            password: TestConfig.dbConfig.dbPassword,
            database: TestConfig.dbConfig.dbName,
        });
    }

    /**
     * simple query runner for general queries
     */
    static async runQuery(query: string, params: any[] = []): Promise<any[]> {
        const connection = await this.getConnection();
        const [rows] = await connection.execute(query, params);
        await connection.end();
        return rows as any[];
    }

    /**
     * Query: Get customer record by email
     * @param email 
     * @returns Promise<any[]>
     */
    static async getCustomerByEmail(email: string): Promise<any[]> {

        const connection = await this.getConnection();

        const query = 'SELECT * FROM oc_customer WHERE email = ?';
        const [rows] = await connection.execute(query, [email]);
        await connection.end();
        return rows as any[];
    }
 
}