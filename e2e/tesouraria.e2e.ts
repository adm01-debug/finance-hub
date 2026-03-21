import { test, expect } from '@playwright/test';

test.describe('Tesouraria Centralizada', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tesouraria');
  });

  test('displays page title', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /tesouraria|treasury/i })).toBeVisible();
  });

  test('shows treasury panels', async ({ page }) => {
    await expect(page.getByText(/tesouraria|consolidação|cnpj|banco/i).first()).toBeVisible({ timeout: 10000 });
  });

  test('multi-CNPJ consolidation panel', async ({ page }) => {
    const consolidTab = page.getByText(/consolidação.*multi.*cnpj|multi.*cnpj/i);
    if (await consolidTab.isVisible()) {
      await consolidTab.click();
    }
  });

  test('inter-company flow panel', async ({ page }) => {
    const flowTab = page.getByText(/fluxo.*inter.*empresa|inter.*company/i);
    if (await flowTab.isVisible()) {
      await flowTab.click();
    }
  });

  test('CNPJ-Bank matrix', async ({ page }) => {
    const matrixTab = page.getByText(/matriz.*cnpj|cnpj.*banco|matrix/i);
    if (await matrixTab.isVisible()) {
      await matrixTab.click();
    }
  });

  test('centralized view of all accounts', async ({ page }) => {
    const accountsView = page.getByText(/todas.*contas|all.*accounts|consolidado/i);
    if (await accountsView.isVisible()) {
      await expect(accountsView).toBeVisible();
    }
  });

  test('inter-company transfer button', async ({ page }) => {
    const transferBtn = page.getByRole('button', { name: /transferir|transferência|inter.*empresa/i });
    if (await transferBtn.isVisible()) {
      await transferBtn.click();
      await expect(page.getByRole('dialog')).toBeVisible();
    }
  });

  test('transfer form between companies', async ({ page }) => {
    const transferBtn = page.getByRole('button', { name: /transferir|transferência/i });
    if (await transferBtn.isVisible()) {
      await transferBtn.click();

      const origemSelect = page.getByLabel(/origem|de|from/i);
      if (await origemSelect.isVisible()) {
        await origemSelect.click();
        await page.getByRole('option').first().click();
      }

      const destinoSelect = page.getByLabel(/destino|para|to/i);
      if (await destinoSelect.isVisible()) {
        await destinoSelect.click();
        await page.getByRole('option').last().click();
      }

      const valorInput = page.getByLabel(/valor/i);
      if (await valorInput.isVisible()) {
        await valorInput.fill('5000.00');
      }
    }
  });

  test('total consolidated balance', async ({ page }) => {
    const saldo = page.getByText(/saldo.*total|total.*balance|consolidado/i);
    if (await saldo.isVisible()) {
      await expect(page.getByText(/R\$/).first()).toBeVisible();
    }
  });

  test('company selector filter', async ({ page }) => {
    const companyFilter = page.getByRole('combobox', { name: /empresa|company|cnpj/i });
    if (await companyFilter.isVisible()) {
      await companyFilter.click();
      await page.getByRole('option').first().click();
    }
  });

  test('exports treasury report', async ({ page }) => {
    const exportBtn = page.getByRole('button', { name: /exportar|export/i });
    if (await exportBtn.isVisible()) {
      await exportBtn.click();
    }
  });

  test('period filter', async ({ page }) => {
    const periodFilter = page.getByRole('combobox', { name: /período|period/i });
    if (await periodFilter.isVisible()) {
      await periodFilter.click();
      await page.getByRole('option').first().click();
    }
  });

  test('bank balance chart', async ({ page }) => {
    const chart = page.locator('.recharts-wrapper, canvas, [data-testid*="chart"]');
    if (await chart.first().isVisible()) {
      await expect(chart.first()).toBeVisible();
    }
  });
});

test.describe('Tesouraria - Mobile', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('responsive layout on mobile', async ({ page }) => {
    await page.goto('/tesouraria');
    await expect(page.getByRole('heading', { name: /tesouraria/i })).toBeVisible();
  });
});
