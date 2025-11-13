/**
 * @fileoverview Test to verify database connection and execute a basic query.
 */

import {test, expect} from '@playwright/test';
import { DBUtil } from '../utils/dbUtil';


test('verify database connection and run basic query execution @master @db @sanity', async () => {

    // Simple query to fetch users
    const query = 'SELECT COUNT(*) AS customerCount FROM oc_customer';
    const result = await DBUtil.runQuery(query);

    console.log('✅ Query result:', result);

    expect(result.length).toBeGreaterThan(0);
    expect(result[0].customerCount).toBeGreaterThanOrEqual(0);
    console.log("✅ Database connection and query execution successful:", result);

    });