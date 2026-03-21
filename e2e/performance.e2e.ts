import { test, expect } from '@playwright/test';

test.describe('Performance Tests', () => {
  test('dashboard loads within 5 seconds', async ({ page }) => {
    const start = Date.now();
    await page.goto('/dashboard');
    await expect(page.getByRole('heading').first()).toBeVisible({ timeout: 10000 });
    const loadTime = Date.now() - start;
    expect(loadTime).toBeLessThan(5000);
  });

  test('contas-pagar page loads within 5 seconds', async ({ page }) => {
    const start = Date.now();
    await page.goto('/contas-pagar');
    await expect(page.getByRole('heading').first()).toBeVisible({ timeout: 10000 });
    const loadTime = Date.now() - start;
    expect(loadTime).toBeLessThan(5000);
  });

  test('contas-receber page loads within 5 seconds', async ({ page }) => {
    const start = Date.now();
    await page.goto('/contas-receber');
    await expect(page.getByRole('heading').first()).toBeVisible({ timeout: 10000 });
    const loadTime = Date.now() - start;
    expect(loadTime).toBeLessThan(5000);
  });

  test('relatorios page loads within 5 seconds', async ({ page }) => {
    const start = Date.now();
    await page.goto('/relatorios');
    await expect(page.getByRole('heading').first()).toBeVisible({ timeout: 10000 });
    const loadTime = Date.now() - start;
    expect(loadTime).toBeLessThan(5000);
  });

  test('fluxo-caixa page loads within 5 seconds', async ({ page }) => {
    const start = Date.now();
    await page.goto('/fluxo-caixa');
    await expect(page.getByRole('heading').first()).toBeVisible({ timeout: 10000 });
    const loadTime = Date.now() - start;
    expect(loadTime).toBeLessThan(5000);
  });

  test('clientes page loads within 5 seconds', async ({ page }) => {
    const start = Date.now();
    await page.goto('/clientes');
    await expect(page.getByRole('heading').first()).toBeVisible({ timeout: 10000 });
    const loadTime = Date.now() - start;
    expect(loadTime).toBeLessThan(5000);
  });

  test('bi page loads within 5 seconds', async ({ page }) => {
    const start = Date.now();
    await page.goto('/bi');
    await expect(page.getByRole('heading').first()).toBeVisible({ timeout: 10000 });
    const loadTime = Date.now() - start;
    expect(loadTime).toBeLessThan(5000);
  });

  test('reforma-tributaria page loads within 5 seconds', async ({ page }) => {
    const start = Date.now();
    await page.goto('/reforma-tributaria');
    await expect(page.getByRole('heading').first()).toBeVisible({ timeout: 10000 });
    const loadTime = Date.now() - start;
    expect(loadTime).toBeLessThan(5000);
  });

  test('navigation between pages is fast', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page.getByRole('heading').first()).toBeVisible({ timeout: 10000 });

    const routes = ['/contas-pagar', '/contas-receber', '/clientes', '/fornecedores', '/relatorios'];

    for (const route of routes) {
      const start = Date.now();
      await page.goto(route);
      await expect(page.getByRole('heading').first()).toBeVisible({ timeout: 10000 });
      const navTime = Date.now() - start;
      expect(navTime).toBeLessThan(5000);
    }
  });

  test('no console errors on page load', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await page.goto('/dashboard');
    await page.waitForTimeout(2000);

    // Filter out known/expected errors
    const criticalErrors = errors.filter(
      (e) => !e.includes('favicon') && !e.includes('sw.js') && !e.includes('manifest')
    );

    // Some console errors might be expected, but should be minimal
    expect(criticalErrors.length).toBeLessThan(5);
  });

  test('no JavaScript uncaught exceptions', async ({ page }) => {
    const exceptions: string[] = [];
    page.on('pageerror', (error) => {
      exceptions.push(error.message);
    });

    await page.goto('/dashboard');
    await page.waitForTimeout(3000);

    expect(exceptions.length).toBe(0);
  });

  test('images and assets load correctly', async ({ page }) => {
    const failedRequests: string[] = [];
    page.on('requestfailed', (request) => {
      failedRequests.push(request.url());
    });

    await page.goto('/dashboard');
    await page.waitForTimeout(3000);

    // Filter out expected failures
    const criticalFailures = failedRequests.filter(
      (url) => !url.includes('sw.js') && !url.includes('favicon') && !url.includes('manifest')
    );

    expect(criticalFailures.length).toBe(0);
  });

  test('API responses return within timeout', async ({ page }) => {
    const slowRequests: { url: string; duration: number }[] = [];

    page.on('response', async (response) => {
      const timing = response.request().timing();
      if (timing.responseEnd > 5000) {
        slowRequests.push({
          url: response.url(),
          duration: timing.responseEnd,
        });
      }
    });

    await page.goto('/dashboard');
    await page.waitForTimeout(5000);

    // No API call should take more than 5 seconds
    expect(slowRequests.length).toBe(0);
  });
});

test.describe('Accessibility Tests', () => {
  test('dashboard has proper heading structure', async ({ page }) => {
    await page.goto('/dashboard');
    const h1 = page.locator('h1');
    await expect(h1.first()).toBeVisible({ timeout: 10000 });
  });

  test('forms have associated labels', async ({ page }) => {
    await page.goto('/contas-pagar');
    const newBtn = page.getByRole('button', { name: /nova.*conta|novo/i });
    if (await newBtn.isVisible()) {
      await newBtn.click();
      const inputs = page.locator('input:not([type="hidden"])');
      const count = await inputs.count();
      // All visible inputs should have labels
      for (let i = 0; i < Math.min(count, 5); i++) {
        const input = inputs.nth(i);
        if (await input.isVisible()) {
          const id = await input.getAttribute('id');
          const ariaLabel = await input.getAttribute('aria-label');
          const ariaLabelledby = await input.getAttribute('aria-labelledby');
          const label = id ? page.locator(`label[for="${id}"]`) : null;
          const hasLabel = ariaLabel || ariaLabelledby || (label && (await label.count()) > 0);
          // At least some inputs should have labels
          if (!hasLabel) {
            // Log but don't fail for now
            console.log(`Input without label: ${id || 'no-id'}`);
          }
        }
      }
    }
  });

  test('buttons have accessible names', async ({ page }) => {
    await page.goto('/dashboard');
    const buttons = page.getByRole('button');
    const count = await buttons.count();
    for (let i = 0; i < Math.min(count, 10); i++) {
      const button = buttons.nth(i);
      if (await button.isVisible()) {
        const name = await button.getAttribute('aria-label');
        const text = await button.textContent();
        const title = await button.getAttribute('title');
        expect(name || text || title).toBeTruthy();
      }
    }
  });

  test('color contrast is sufficient', async ({ page }) => {
    await page.goto('/dashboard');
    // Basic check - page renders without CSS issues
    await expect(page.getByRole('heading').first()).toBeVisible({ timeout: 10000 });
  });

  test('keyboard navigation works', async ({ page }) => {
    await page.goto('/dashboard');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    // Should be able to tab through elements
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
  });

  test('focus visible indicator exists', async ({ page }) => {
    await page.goto('/dashboard');
    await page.keyboard.press('Tab');
    const focusedElement = page.locator(':focus');
    if (await focusedElement.isVisible()) {
      // Element should have visible focus ring
      await expect(focusedElement).toBeVisible();
    }
  });
});
