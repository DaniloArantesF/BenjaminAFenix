import { test, expect } from '@playwright/test';

test('Basic Test', async ({ page }) => {
  await page.goto('http://localhost:3000');
});