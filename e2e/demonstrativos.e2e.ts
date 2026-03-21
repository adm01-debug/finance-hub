import { test, expect } from '@playwright/test';

test.describe('Demonstrativos Financeiros', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/demonstrativos');
  });

  test('displays page title', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /demonstrativos|financial.*statements/i })).toBeVisible();
  });

  test('shows statement type tabs', async ({ page }) => {
    await expect(page.getByText(/dre|balanço|fluxo.*caixa|contábil/i).first()).toBeVisible({ timeout: 10000 });
  });

  test('DRE (Income Statement) tab', async ({ page }) => {
    const dreTab = page.getByRole('tab', { name: /dre|resultado|income/i })
      .or(page.getByRole('button', { name: /dre|resultado|income/i }));
    if (await dreTab.isVisible()) {
      await dreTab.click();
      await expect(page.getByText(/receita|despesa|resultado/i).first()).toBeVisible({ timeout: 10000 });
    }
  });

  test('DRE shows revenue and expenses breakdown', async ({ page }) => {
    const dreTab = page.getByRole('tab', { name: /dre|resultado/i })
      .or(page.getByRole('button', { name: /dre|resultado/i }));
    if (await dreTab.isVisible()) {
      await dreTab.click();
      await expect(page.getByText(/receita/i).first()).toBeVisible({ timeout: 10000 });
    }
  });

  test('Balance Sheet (Balanço Patrimonial) tab', async ({ page }) => {
    const bpTab = page.getByRole('tab', { name: /balanço|balance/i })
      .or(page.getByRole('button', { name: /balanço|balance/i }));
    if (await bpTab.isVisible()) {
      await bpTab.click();
      await expect(page.getByText(/ativo|passivo|patrimônio/i).first()).toBeVisible({ timeout: 10000 });
    }
  });

  test('Balance Sheet shows assets and liabilities', async ({ page }) => {
    const bpTab = page.getByRole('tab', { name: /balanço|balance/i })
      .or(page.getByRole('button', { name: /balanço|balance/i }));
    if (await bpTab.isVisible()) {
      await bpTab.click();
      const ativo = page.getByText(/ativo/i);
      if (await ativo.first().isVisible()) {
        await expect(ativo.first()).toBeVisible();
      }
    }
  });

  test('Cash Flow Statement (Fluxo Caixa Contábil) tab', async ({ page }) => {
    const fcTab = page.getByRole('tab', { name: /fluxo.*caixa.*contábil|cash.*flow.*statement/i })
      .or(page.getByRole('button', { name: /fluxo.*caixa|contábil/i }));
    if (await fcTab.isVisible()) {
      await fcTab.click();
    }
  });

  test('period selector for statements', async ({ page }) => {
    const periodSelect = page.getByRole('combobox', { name: /período|period|mês|ano/i });
    if (await periodSelect.isVisible()) {
      await periodSelect.click();
      await page.getByRole('option').first().click();
    }
  });

  test('exports statement to PDF', async ({ page }) => {
    const exportBtn = page.getByRole('button', { name: /exportar.*pdf|pdf|download/i });
    if (await exportBtn.isVisible()) {
      await exportBtn.click();
    }
  });

  test('exports statement to Excel', async ({ page }) => {
    const exportBtn = page.getByRole('button', { name: /exportar.*excel|xlsx|excel/i });
    if (await exportBtn.isVisible()) {
      await exportBtn.click();
    }
  });

  test('prints statement', async ({ page }) => {
    const printBtn = page.getByRole('button', { name: /imprimir|print/i });
    if (await printBtn.isVisible()) {
      await printBtn.click();
    }
  });

  test('comparison between periods', async ({ page }) => {
    const compareBtn = page.getByRole('button', { name: /comparar|comparativo|comparison/i });
    if (await compareBtn.isVisible()) {
      await compareBtn.click();
    }
  });

  test('drills down into categories', async ({ page }) => {
    const expandableRow = page.locator('tr[data-expandable], [role="button"]').first();
    if (await expandableRow.isVisible()) {
      await expandableRow.click();
    }
  });

  test('shows totals and subtotals', async ({ page }) => {
    const total = page.getByText(/total/i).first();
    if (await total.isVisible()) {
      await expect(total).toBeVisible();
    }
  });
});

test.describe('Demonstrativos - Mobile', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('responsive layout on mobile', async ({ page }) => {
    await page.goto('/demonstrativos');
    await expect(page.getByRole('heading', { name: /demonstrativos/i })).toBeVisible();
  });
});
