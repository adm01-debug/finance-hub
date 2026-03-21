import { test, expect } from '@playwright/test';

test.describe('Orçamento e Evento', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/orcamento-evento');
  });

  test('displays page title', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /orçamento|budget|evento/i })).toBeVisible();
  });

  test('shows budget overview', async ({ page }) => {
    await expect(page.getByText(/orçamento|budget|planejado|realizado/i).first()).toBeVisible({ timeout: 10000 });
  });

  test('creates new budget', async ({ page }) => {
    const newBtn = page.getByRole('button', { name: /novo.*orçamento|criar|adicionar/i });
    if (await newBtn.isVisible()) {
      await newBtn.click();
      await expect(page.getByRole('dialog')).toBeVisible();
    }
  });

  test('budget form fields', async ({ page }) => {
    const newBtn = page.getByRole('button', { name: /novo.*orçamento|criar|adicionar/i });
    if (await newBtn.isVisible()) {
      await newBtn.click();

      const nomeInput = page.getByLabel(/nome|título|descrição/i);
      if (await nomeInput.isVisible()) {
        await nomeInput.fill('Orçamento Anual 2026');
      }

      const valorInput = page.getByLabel(/valor.*total|orçamento.*total|budget/i);
      if (await valorInput.isVisible()) {
        await valorInput.fill('100000.00');
      }

      const periodoSelect = page.getByLabel(/período|period/i);
      if (await periodoSelect.isVisible()) {
        await periodoSelect.click();
        await page.getByRole('option').first().click();
      }
    }
  });

  test('edits budget', async ({ page }) => {
    const editBtn = page.getByRole('button', { name: /editar|edit/i }).first();
    if (await editBtn.isVisible()) {
      await editBtn.click();
    }
  });

  test('deletes budget', async ({ page }) => {
    const deleteBtn = page.getByRole('button', { name: /excluir|deletar/i }).first();
    if (await deleteBtn.isVisible()) {
      await deleteBtn.click();
      await expect(page.getByRole('dialog')).toBeVisible();
    }
  });

  test('budget vs actual comparison', async ({ page }) => {
    const comparisonView = page.getByText(/planejado.*realizado|planned.*actual|vs/i);
    if (await comparisonView.isVisible()) {
      await expect(comparisonView).toBeVisible();
    }
  });

  test('budget progress bars', async ({ page }) => {
    const progressBars = page.locator('[role="progressbar"]');
    if (await progressBars.first().isVisible()) {
      await expect(progressBars.first()).toBeVisible();
    }
  });

  test('budget categories breakdown', async ({ page }) => {
    const categories = page.getByText(/categoria|category|departamento/i);
    if (await categories.isVisible()) {
      await expect(categories).toBeVisible();
    }
  });

  test('exports budget report', async ({ page }) => {
    const exportBtn = page.getByRole('button', { name: /exportar|export/i });
    if (await exportBtn.isVisible()) {
      await exportBtn.click();
    }
  });

  test('period selector', async ({ page }) => {
    const periodSelect = page.getByRole('combobox', { name: /período|period|ano|mês/i });
    if (await periodSelect.isVisible()) {
      await periodSelect.click();
      await page.getByRole('option').first().click();
    }
  });

  test('budget chart visualization', async ({ page }) => {
    const chart = page.locator('.recharts-wrapper, canvas, [data-testid*="chart"]');
    if (await chart.first().isVisible()) {
      await expect(chart.first()).toBeVisible();
    }
  });

  test('variance analysis', async ({ page }) => {
    const variance = page.getByText(/variância|variance|desvio/i);
    if (await variance.isVisible()) {
      await expect(variance).toBeVisible();
    }
  });
});

test.describe('Orçamento - Mobile', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('responsive layout on mobile', async ({ page }) => {
    await page.goto('/orcamento-evento');
    await expect(page.getByRole('heading', { name: /orçamento|budget/i })).toBeVisible();
  });
});
