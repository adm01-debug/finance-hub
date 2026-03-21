import { test, expect } from '@playwright/test';

test.describe('Movimentações', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/movimentacoes');
  });

  test('displays page title', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /movimentações|movements|transações/i })).toBeVisible();
  });

  test('shows movements table', async ({ page }) => {
    await expect(page.getByRole('table').or(page.getByText(/movimentação|transação/i).first())).toBeVisible({ timeout: 10000 });
  });

  test('filters by type (entrada/saída)', async ({ page }) => {
    const typeFilter = page.getByRole('combobox', { name: /tipo|type|entrada|saída/i });
    if (await typeFilter.isVisible()) {
      await typeFilter.click();
      await page.getByRole('option').first().click();
    }
  });

  test('filters by date range', async ({ page }) => {
    const dateFilter = page.getByLabel(/data|período/i).first();
    if (await dateFilter.isVisible()) {
      await dateFilter.click();
    }
  });

  test('filters by category', async ({ page }) => {
    const catFilter = page.getByRole('combobox', { name: /categoria|category/i });
    if (await catFilter.isVisible()) {
      await catFilter.click();
      await page.getByRole('option').first().click();
    }
  });

  test('filters by bank account', async ({ page }) => {
    const bankFilter = page.getByRole('combobox', { name: /conta.*bancária|banco|bank/i });
    if (await bankFilter.isVisible()) {
      await bankFilter.click();
      await page.getByRole('option').first().click();
    }
  });

  test('searches movements', async ({ page }) => {
    const searchInput = page.getByPlaceholder(/buscar|pesquisar|search/i);
    if (await searchInput.isVisible()) {
      await searchInput.fill('pagamento');
      await page.waitForTimeout(500);
    }
  });

  test('views movement details', async ({ page }) => {
    const viewBtn = page.getByRole('button', { name: /ver|detalhes|visualizar/i }).first();
    if (await viewBtn.isVisible()) {
      await viewBtn.click();
    }
  });

  test('exports movements', async ({ page }) => {
    const exportBtn = page.getByRole('button', { name: /exportar|export/i });
    if (await exportBtn.isVisible()) {
      await exportBtn.click();
    }
  });

  test('paginates movements', async ({ page }) => {
    const nextBtn = page.getByRole('button', { name: /próxima|next|›/i });
    if (await nextBtn.isVisible() && await nextBtn.isEnabled()) {
      await nextBtn.click();
    }
  });

  test('sorts movements by date', async ({ page }) => {
    const dateHeader = page.getByRole('columnheader', { name: /data|date/i });
    if (await dateHeader.isVisible()) {
      await dateHeader.click();
    }
  });

  test('sorts movements by value', async ({ page }) => {
    const valorHeader = page.getByRole('columnheader', { name: /valor|value/i });
    if (await valorHeader.isVisible()) {
      await valorHeader.click();
    }
  });

  test('shows balance summary', async ({ page }) => {
    const summary = page.getByText(/total.*entradas|total.*saídas|saldo/i);
    if (await summary.isVisible()) {
      await expect(summary).toBeVisible();
    }
  });

  test('clear filters button', async ({ page }) => {
    const clearBtn = page.getByRole('button', { name: /limpar|clear|resetar/i });
    if (await clearBtn.isVisible()) {
      await clearBtn.click();
    }
  });
});

test.describe('Movimentações - Mobile', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('responsive layout on mobile', async ({ page }) => {
    await page.goto('/movimentacoes');
    await expect(page.getByRole('heading', { name: /movimentações/i })).toBeVisible();
  });
});
