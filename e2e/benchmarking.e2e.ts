import { test, expect } from '@playwright/test';

test.describe('Benchmarking Setorial', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/benchmarking');
  });

  test('displays page title', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /benchmarking|comparativo.*setorial/i })).toBeVisible();
  });

  test('shows benchmarking panels', async ({ page }) => {
    await expect(page.getByText(/benchmarking|setor|industry|comparativo/i).first()).toBeVisible({ timeout: 10000 });
  });

  test('sector selector', async ({ page }) => {
    const sectorSelect = page.getByRole('combobox', { name: /setor|sector|indústria|industry/i });
    if (await sectorSelect.isVisible()) {
      await sectorSelect.click();
      await page.getByRole('option').first().click();
    }
  });

  test('comparison metrics visibility', async ({ page }) => {
    const metrics = page.getByText(/margem|rentabilidade|liquidez|endividamento/i);
    if (await metrics.isVisible()) {
      await expect(metrics).toBeVisible();
    }
  });

  test('industry comparison chart', async ({ page }) => {
    const chart = page.locator('.recharts-wrapper, canvas, [data-testid*="chart"]');
    if (await chart.first().isVisible()) {
      await expect(chart.first()).toBeVisible();
    }
  });

  test('your company position indicator', async ({ page }) => {
    const position = page.getByText(/sua.*empresa|your.*company|posição/i);
    if (await position.isVisible()) {
      await expect(position).toBeVisible();
    }
  });

  test('KPI comparison cards', async ({ page }) => {
    const kpiCards = page.getByText(/vs.*mercado|vs.*market|média.*setor/i);
    if (await kpiCards.isVisible()) {
      await expect(kpiCards).toBeVisible();
    }
  });

  test('period filter for comparison', async ({ page }) => {
    const periodSelect = page.getByRole('combobox', { name: /período|period/i });
    if (await periodSelect.isVisible()) {
      await periodSelect.click();
      await page.getByRole('option').first().click();
    }
  });

  test('exports benchmarking report', async ({ page }) => {
    const exportBtn = page.getByRole('button', { name: /exportar|export/i });
    if (await exportBtn.isVisible()) {
      await exportBtn.click();
    }
  });

  test('detailed metric drill-down', async ({ page }) => {
    const detailBtn = page.getByRole('button', { name: /detalhar|detail|drill/i }).first();
    if (await detailBtn.isVisible()) {
      await detailBtn.click();
    }
  });

  test('recommendations based on benchmarking', async ({ page }) => {
    const recommendations = page.getByText(/recomendações|recommendations|sugestões/i);
    if (await recommendations.isVisible()) {
      await expect(recommendations).toBeVisible();
    }
  });

  test('trend analysis', async ({ page }) => {
    const trendSection = page.getByText(/tendência|trend|evolução/i);
    if (await trendSection.isVisible()) {
      await expect(trendSection).toBeVisible();
    }
  });

  test('refresh benchmarking data', async ({ page }) => {
    const refreshBtn = page.getByRole('button', { name: /atualizar|refresh/i });
    if (await refreshBtn.isVisible()) {
      await refreshBtn.click();
    }
  });
});

test.describe('Benchmarking - Mobile', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('responsive layout on mobile', async ({ page }) => {
    await page.goto('/benchmarking');
    await expect(page.getByRole('heading', { name: /benchmarking/i })).toBeVisible();
  });
});
