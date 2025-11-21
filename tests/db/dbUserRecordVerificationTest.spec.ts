/**
 * DB Integration Test - verifies user details in the database after registration.
 */

import { test, expect } from '@playwright/test';
import { DBUtil } from '../../utils/dbUtil';
import { TestConfig } from '../../test.config';

test('DB integration: Validate user details in database', async () => {
  const email = TestConfig.newUser.email;
  const dbResult = await DBUtil.getCustomerByEmail(email);
  expect(dbResult.length).toBeGreaterThan(0);
  expect(dbResult[0].firstname).toBe('test18');
  expect(dbResult[0].lastname).toBe('test18');
  expect(dbResult[0].email).toBe(email);
});
