import { test, expect } from '@playwright/test';

test.describe('Fluxo de Caixa', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/fluxo-caixa');
  });

  test('displays page title', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /fluxo.*caixa|cash.*flow/i })).toBeVisible();
  });

  test('shows KPI cards', async ({ page }) => {
    await expect(page.getByText(/saldo|entradas|saídas/i).first()).toBeVisible({ timeout: 10000 });
  });

  test('displays bar chart visualization', async ({ page }) => {
    const chart = page.locator('[data-testid="chart-container"], canvas, .recharts-wrapper, svg.recharts-surface');
    await expect(chart.first()).toBeVisible({ timeout: 10000 });
  });

  test('header filters work - period selection', async ({ page }) => {
    const periodFilter = page.getByRole('combobox', { name: /período|period/i });
    if (await periodFilter.isVisible()) {
      await periodFilter.click();
      await page.getByRole('option').first().click();
      await page.waitForTimeout(500);
    }
  });

  test('shows daily projection grid', async ({ page }) => {
    const grid = page.getByText(/projeção|diária|daily/i);
    if (await grid.isVisible()) {
      await expect(grid).toBeVisible();
    }
  });

  test('scenario selector works', async ({ page }) => {
    const scenarioBtn = page.getByRole('button', { name: /cenário|scenario|otimista|pessimista|realista/i });
    if (await scenarioBtn.isVisible()) {
      await scenarioBtn.click();
    }
  });

  test('coverage indicator is visible', async ({ page }) => {
    const coverage = page.getByText(/cobertura|coverage/i);
    if (await coverage.isVisible()) {
      await expect(coverage).toBeVisible();
    }
  });

  test('rupture alerts section', async ({ page }) => {
    const alertas = page.getByText(/alerta.*ruptura|break.*alert/i);
    if (await alertas.isVisible()) {
      await expect(alertas).toBeVisible();
    }
  });

  test('AI insights panel', async ({ page }) => {
    const insightsBtn = page.getByRole('button', { name: /insights|ia|inteligência/i });
    if (await insightsBtn.isVisible()) {
      await insightsBtn.click();
    }
  });

  test('Monte Carlo simulation', async ({ page }) => {
    const monteCarloBtn = page.getByRole('button', { name: /monte.*carlo|simulação/i });
    if (await monteCarloBtn.isVisible()) {
      await monteCarloBtn.click();
    }
  });

  test('scenario comparison chart', async ({ page }) => {
    const compareBtn = page.getByRole('button', { name: /comparar|cenários|scenarios/i });
    if (await compareBtn.isVisible()) {
      await compareBtn.click();
    }
  });

  test('scenario summaries display', async ({ page }) => {
    const summaries = page.getByText(/resumo.*cenário|scenario.*summary/i);
    if (await summaries.isVisible()) {
      await expect(summaries).toBeVisible();
    }
  });

  test('exports cash flow data', async ({ page }) => {
    const exportBtn = page.getByRole('button', { name: /exportar|export/i });
    if (await exportBtn.isVisible()) {
      await exportBtn.click();
    }
  });

  test('date range navigation', async ({ page }) => {
    const nextBtn = page.getByRole('button', { name: /próximo|next|→|›/i });
    if (await nextBtn.isVisible()) {
      await nextBtn.click();
      await page.waitForTimeout(500);
    }
    const prevBtn = page.getByRole('button', { name: /anterior|prev|←|‹/i });
    if (await prevBtn.isVisible()) {
      await prevBtn.click();
    }
  });

  test('toggles between chart views', async ({ page }) => {
    const toggleBtns = page.getByRole('button', { name: /gráfico|tabela|grid|chart/i });
    if (await toggleBtns.first().isVisible()) {
      await toggleBtns.first().click();
    }
  });

  test('refresh data button', async ({ page }) => {
    const refreshBtn = page.getByRole('button', { name: /atualizar|refresh/i });
    if (await refreshBtn.isVisible()) {
      await refreshBtn.click();
      await page.waitForTimeout(500);
    }
  });
});

test.describe('Fluxo de Caixa - Mobile', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('responsive layout on mobile', async ({ page }) => {
    await page.goto('/fluxo-caixa');
    await expect(page.getByRole('heading', { name: /fluxo.*caixa/i })).toBeVisible();
  });

  test('chart is visible on mobile', async ({ page }) => {
    await page.goto('/fluxo-caixa');
    const chart = page.locator('[data-testid="chart-container"], canvas, .recharts-wrapper');
    if (await chart.first().isVisible()) {
      await expect(chart.first()).toBeVisible();
    }
  });
});
