import { expect, test } from '@playwright/test';

test('loads the real GSAP + ScrollTrigger + Lenis renderer', async ({ page }) => {
  const consoleErrors: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text());
  });

  await page.goto('/');
  await expect(page.getByText('GSAP + ScrollTrigger + Lenis')).toBeVisible();

  const panel = page.locator('.motion-panel');
  await expect(panel).toBeVisible();

  const before = await panel.evaluate((element) => {
    const style = getComputedStyle(element);
    return { opacity: Number(style.opacity), transform: style.transform };
  });

  await page.locator('.stage').scrollIntoViewIfNeeded();
  await page.mouse.wheel(0, 500);
  await page.waitForTimeout(250);

  const after = await panel.evaluate((element) => {
    const style = getComputedStyle(element);
    return { opacity: Number(style.opacity), transform: style.transform };
  });

  expect(
    Math.abs(after.opacity - before.opacity) > 0.01 ||
      after.transform !== before.transform,
  ).toBeTruthy();
  expect(consoleErrors).toEqual([]);
});

test('does not trap PageDown keyboard input', async ({ page }) => {
  await page.goto('/');

  const hasScrollableDocument = await page.evaluate(
    () => document.documentElement.scrollHeight > window.innerHeight,
  );
  expect(hasScrollableDocument).toBeTruthy();

  await page.evaluate(() => {
    (window as any).__kinetrellPageDownPrevented = null;
    window.addEventListener(
      'keydown',
      (event) => {
        if (event.key !== 'PageDown') return;
        queueMicrotask(() => {
          (window as any).__kinetrellPageDownPrevented = event.defaultPrevented;
        });
      },
      { once: true },
    );
  });

  await page.keyboard.press('PageDown');
  await page.waitForTimeout(50);

  const prevented = await page.evaluate(
    () => (window as any).__kinetrellPageDownPrevented,
  );
  expect(prevented).toBe(false);
});

test('tears down without browser errors on reload', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));

  await page.goto('/');
  await expect(page.getByText('GSAP + ScrollTrigger + Lenis')).toBeVisible();
  await page.reload();
  await expect(page.getByText('GSAP + ScrollTrigger + Lenis')).toBeVisible();

  expect(errors).toEqual([]);
});
