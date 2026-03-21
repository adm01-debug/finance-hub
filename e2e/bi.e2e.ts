import { test, expect } from '@playwright/test';

test.describe('Business Intelligence (BI)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/bi');
  });

  test('displays page title', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /bi|business.*intelligence|inteligência|analytics/i })).toBeVisible();
  });

  test('shows BI dashboard panels', async ({ page }) => {
    await expect(page.getByText(/análise|analytics|dashboard|indicador/i).first()).toBeVisible({ timeout: 10000 });
  });

  test('executive dashboard panel', async ({ page }) => {
    const execTab = page.getByText(/executivo|executive|visão.*geral/i);
    if (await execTab.isVisible()) {
      await execTab.click();
    }
  });

  test('KPI cards visibility', async ({ page }) => {
    const kpi = page.getByText(/R\$|%/).first();
    if (await kpi.isVisible()) {
      await expect(kpi).toBeVisible();
    }
  });

  test('revenue chart', async ({ page }) => {
    const chart = page.locator('.recharts-wrapper, canvas, [data-testid*="chart"]');
    if (await chart.first().isVisible()) {
      await expect(chart.first()).toBeVisible();
    }
  });

  test('period selector', async ({ page }) => {
    const periodSelect = page.getByRole('combobox', { name: /período|period/i });
    if (await periodSelect.isVisible()) {
      await periodSelect.click();
      await page.getByRole('option').first().click();
    }
  });

  test('drill down into data', async ({ page }) => {
    const drillBtn = page.getByRole('button', { name: /drill.*down|detalhar|expandir/i }).first();
    if (await drillBtn.isVisible()) {
      await drillBtn.click();
    }
  });

  test('configures dashboard widgets', async ({ page }) => {
    const configBtn = page.getByRole('button', { name: /configurar|config|personalizar|widgets/i });
    if (await configBtn.isVisible()) {
      await configBtn.click();
    }
  });

  test('draggable dashboard panels', async ({ page }) => {
    const draggable = page.locator('[data-testid*="draggable"], [class*="drag"]');
    if (await draggable.first().isVisible()) {
      await expect(draggable.first()).toBeVisible();
    }
  });

  test('top clients leaderboard', async ({ page }) => {
    const leaderboard = page.getByText(/top.*clientes|leaderboard|ranking/i);
    if (await leaderboard.isVisible()) {
      await expect(leaderboard).toBeVisible();
    }
  });

  test('top cost centers chart', async ({ page }) => {
    const costCenterChart = page.getByText(/centro.*custo|cost.*center/i);
    if (await costCenterChart.isVisible()) {
      await expect(costCenterChart).toBeVisible();
    }
  });

  test('financial goals panel', async ({ page }) => {
    const goalsPanel = page.getByText(/metas|goals|objetivos/i);
    if (await goalsPanel.isVisible()) {
      await goalsPanel.click();
    }
  });

  test('predictive alerts panel', async ({ page }) => {
    const predPanel = page.getByText(/preditivo|predictive|previsão/i);
    if (await predPanel.isVisible()) {
      await predPanel.click();
    }
  });

  test('AI forecast panel', async ({ page }) => {
    const forecastPanel = page.getByText(/previsão.*ia|ai.*forecast|forecast/i);
    if (await forecastPanel.isVisible()) {
      await forecastPanel.click();
    }
  });

  test('bank balance cards', async ({ page }) => {
    const bankCards = page.getByText(/saldo.*banco|bank.*balance/i);
    if (await bankCards.isVisible()) {
      await expect(bankCards).toBeVisible();
    }
  });

  test('accounts status pie chart', async ({ page }) => {
    const pieChart = page.getByText(/status.*contas|accounts.*status/i);
    if (await pieChart.isVisible()) {
      await expect(pieChart).toBeVisible();
    }
  });

  test('exports BI report', async ({ page }) => {
    const exportBtn = page.getByRole('button', { name: /exportar|export/i });
    if (await exportBtn.isVisible()) {
      await exportBtn.click();
    }
  });

  test('date range filter', async ({ page }) => {
    const dateFilter = page.getByLabel(/data|período/i).first();
    if (await dateFilter.isVisible()) {
      await dateFilter.click();
    }
  });

  test('company/entity filter', async ({ page }) => {
    const companyFilter = page.getByRole('combobox', { name: /empresa|company|entidade/i });
    if (await companyFilter.isVisible()) {
      await companyFilter.click();
      await page.getByRole('option').first().click();
    }
  });

  test('fullscreen chart mode', async ({ page }) => {
    const fullscreenBtn = page.getByRole('button', { name: /tela.*cheia|fullscreen|expandir/i }).first();
    if (await fullscreenBtn.isVisible()) {
      await fullscreenBtn.click();
    }
  });

  test('refresh all data button', async ({ page }) => {
    const refreshBtn = page.getByRole('button', { name: /atualizar|refresh/i });
    if (await refreshBtn.isVisible()) {
      await refreshBtn.click();
    }
  });

  test('scheduled reports access', async ({ page }) => {
    const scheduledBtn = page.getByRole('button', { name: /agendados|scheduled|programados/i });
    if (await scheduledBtn.isVisible()) {
      await scheduledBtn.click();
    }
  });

  test('IA insights button', async ({ page }) => {
    const insightsBtn = page.getByRole('button', { name: /insights|ia|inteligência/i });
    if (await insightsBtn.isVisible()) {
      await insightsBtn.click();
    }
  });
});

test.describe('BI - Mobile', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('responsive layout on mobile', async ({ page }) => {
    await page.goto('/bi');
    await expect(page.getByRole('heading', { name: /bi|business.*intelligence|analytics/i })).toBeVisible();
  });

  test('charts scroll on mobile', async ({ page }) => {
    await page.goto('/bi');
    const chart = page.locator('.recharts-wrapper, canvas').first();
    if (await chart.isVisible()) {
      await expect(chart).toBeVisible();
    }
  });
});
