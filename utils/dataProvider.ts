/**
 * DataProvider Utility - provides methods to read test data from JSON and CSV files.
 * 
 */


import fs from 'fs';
import { parse } from 'csv-parse/sync';

export class DataProvider {

    /**
     * Reads test data from a JSON file
     * @param filePath 
     * @returns Array of test data objects
     */
    static getTestDataFromJson(filePath: string): any[] {
        const rawData = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(rawData);
    }

    
    /**
     * Reads test data from a CSV file
     * @param filePath 
     * @returns Array of test data objects
     */
    static getTestDataFromCsv(filePath: string): any[] {
        const rawData = fs.readFileSync(filePath, 'utf-8');
        return parse(rawData, {
            columns: true,
            skip_empty_lines: true
        });
    }
}



