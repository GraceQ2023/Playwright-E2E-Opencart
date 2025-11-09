import fs from 'fs';
import { parse } from 'csv-parse/sync';

export class DataProvider {

    static getTestDataFromJson(filePath: string): any[] {
        const rawData = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(rawData);
    }

    
    static getTestDataFromCsv(filePath: string): any[] {
        const rawData = fs.readFileSync(filePath, 'utf-8');
        return parse(rawData, {
            columns: true,
            skip_empty_lines: true
        });
    }
}



