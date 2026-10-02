import { expect, test } from '@playwright/test';

test('server-renders core and hydrates browser adapters without mismatch', async ({ page, request }) => {
  const response = await request.get('/');
  expect(response.ok()).toBeTruthy();
  const html = await response.text();
  expect(html).toContain('Kinetrell SSR boundary');
  expect(html).toContain('server-shell');

  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });

  await page.goto('/');
  await expect(page.getByText('Kinetrell SSR boundary')).toBeVisible();
  await expect(page.locator('#hydration-marker')).toHaveText('hydrated');

  expect(errors.filter((message) => /hydration|window is not defined|document is not defined/i.test(message))).toEqual([]);
});
