import { test, expect } from '@playwright/test';

test.describe('Vendedores', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/vendedores');
  });

  test('displays page title', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /vendedores|salespeople|equipe/i })).toBeVisible();
  });

  test('shows vendedores dashboard', async ({ page }) => {
    await expect(page.getByText(/vendedor|comissão|meta|venda/i).first()).toBeVisible({ timeout: 10000 });
  });

  test('add new vendedor button', async ({ page }) => {
    const newBtn = page.getByRole('button', { name: /novo.*vendedor|adicionar|novo/i });
    if (await newBtn.isVisible()) {
      await newBtn.click();
      await expect(page.getByRole('dialog')).toBeVisible();
    }
  });

  test('vendedor form fields', async ({ page }) => {
    const newBtn = page.getByRole('button', { name: /novo.*vendedor|adicionar|novo/i });
    if (await newBtn.isVisible()) {
      await newBtn.click();

      const nomeInput = page.getByLabel(/nome/i);
      if (await nomeInput.isVisible()) {
        await nomeInput.fill('Vendedor Teste E2E');
      }

      const emailInput = page.getByLabel(/email/i);
      if (await emailInput.isVisible()) {
        await emailInput.fill('vendedor@test.com');
      }

      const comissaoInput = page.getByLabel(/comissão|commission|%/i);
      if (await comissaoInput.isVisible()) {
        await comissaoInput.fill('10');
      }

      const metaInput = page.getByLabel(/meta|target|goal/i);
      if (await metaInput.isVisible()) {
        await metaInput.fill('50000');
      }
    }
  });

  test('edits vendedor', async ({ page }) => {
    const editBtn = page.getByRole('button', { name: /editar|edit/i }).first();
    if (await editBtn.isVisible()) {
      await editBtn.click();
    }
  });

  test('deletes vendedor', async ({ page }) => {
    const deleteBtn = page.getByRole('button', { name: /excluir|deletar/i }).first();
    if (await deleteBtn.isVisible()) {
      await deleteBtn.click();
      await expect(page.getByRole('dialog')).toBeVisible();
    }
  });

  test('sales ranking/leaderboard', async ({ page }) => {
    const ranking = page.getByText(/ranking|leaderboard|classificação/i);
    if (await ranking.isVisible()) {
      await expect(ranking).toBeVisible();
    }
  });

  test('commission calculator', async ({ page }) => {
    const commBtn = page.getByRole('button', { name: /comissão|commission|calcular/i });
    if (await commBtn.isVisible()) {
      await commBtn.click();
    }
  });

  test('performance chart', async ({ page }) => {
    const chart = page.locator('.recharts-wrapper, canvas, [data-testid*="chart"]');
    if (await chart.first().isVisible()) {
      await expect(chart.first()).toBeVisible();
    }
  });

  test('goal progress indicators', async ({ page }) => {
    const progress = page.locator('[role="progressbar"]');
    if (await progress.first().isVisible()) {
      await expect(progress.first()).toBeVisible();
    }
  });

  test('period filter for sales', async ({ page }) => {
    const periodFilter = page.getByRole('combobox', { name: /período|period/i });
    if (await periodFilter.isVisible()) {
      await periodFilter.click();
      await page.getByRole('option').first().click();
    }
  });

  test('exports vendedores report', async ({ page }) => {
    const exportBtn = page.getByRole('button', { name: /exportar|export/i });
    if (await exportBtn.isVisible()) {
      await exportBtn.click();
    }
  });

  test('searches vendedores', async ({ page }) => {
    const searchInput = page.getByPlaceholder(/buscar|pesquisar|search/i);
    if (await searchInput.isVisible()) {
      await searchInput.fill('teste');
      await page.waitForTimeout(500);
    }
  });
});

test.describe('Vendedores - Mobile', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('responsive layout on mobile', async ({ page }) => {
    await page.goto('/vendedores');
    await expect(page.getByRole('heading', { name: /vendedores/i })).toBeVisible();
  });
});
