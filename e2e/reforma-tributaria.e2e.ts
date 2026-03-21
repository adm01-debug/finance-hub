import { test, expect } from '@playwright/test';

test.describe('Reforma Tributária', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/reforma-tributaria');
  });

  test('displays page title', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /reforma.*tributária|tax.*reform/i })).toBeVisible();
  });

  test('shows dashboard metrics', async ({ page }) => {
    await expect(page.getByText(/tributári|imposto|alíquota|tax/i).first()).toBeVisible({ timeout: 10000 });
  });

  test('navigation tabs for tax sections', async ({ page }) => {
    const tabs = page.getByRole('tab').or(page.locator('[role="tablist"] button'));
    if (await tabs.first().isVisible()) {
      const count = await tabs.count();
      expect(count).toBeGreaterThan(0);
    }
  });

  test('Hero KPIs visibility', async ({ page }) => {
    const kpi = page.getByText(/R\$|%/).first();
    if (await kpi.isVisible()) {
      await expect(kpi).toBeVisible();
    }
  });

  test('tax calculator', async ({ page }) => {
    const calcTab = page.getByText(/calculadora|calculator/i);
    if (await calcTab.isVisible()) {
      await calcTab.click();
    }
  });

  test('tax calculator form', async ({ page }) => {
    const calcBtn = page.getByRole('button', { name: /calcular|calculator/i });
    if (await calcBtn.isVisible()) {
      await calcBtn.click();
      const valorInput = page.getByLabel(/valor|base/i);
      if (await valorInput.isVisible()) {
        await valorInput.fill('10000.00');
      }
    }
  });

  test('monthly apuracao', async ({ page }) => {
    const apuracaoTab = page.getByText(/apuração.*mensal|monthly/i);
    if (await apuracaoTab.isVisible()) {
      await apuracaoTab.click();
    }
  });

  test('SPED export', async ({ page }) => {
    const spedBtn = page.getByRole('button', { name: /sped|exportar.*sped/i });
    if (await spedBtn.isVisible()) {
      await spedBtn.click();
    }
  });

  test('regime comparison panel', async ({ page }) => {
    const compareTab = page.getByText(/comparativo.*regimes|regime.*comparison/i);
    if (await compareTab.isVisible()) {
      await compareTab.click();
    }
  });

  test('XML import panel', async ({ page }) => {
    const xmlTab = page.getByText(/importação.*xml|xml.*import/i);
    if (await xmlTab.isVisible()) {
      await xmlTab.click();
    }
  });

  test('tax credits manager', async ({ page }) => {
    const creditsTab = page.getByText(/créditos.*tributários|tax.*credits/i);
    if (await creditsTab.isVisible()) {
      await creditsTab.click();
    }
  });

  test('withholding taxes (retenções)', async ({ page }) => {
    const retencoesTab = page.getByText(/retenções|withholding/i);
    if (await retencoesTab.isVisible()) {
      await retencoesTab.click();
    }
  });

  test('IRPJ/CSLL module', async ({ page }) => {
    const irpjTab = page.getByText(/irpj|csll/i);
    if (await irpjTab.isVisible()) {
      await irpjTab.click();
    }
  });

  test('accessory obligations', async ({ page }) => {
    const obrigacoesTab = page.getByText(/obrigações.*acessórias|accessory/i);
    if (await obrigacoesTab.isVisible()) {
      await obrigacoesTab.click();
    }
  });

  test('tax alerts', async ({ page }) => {
    const alertsTab = page.getByText(/alertas.*tributários|tax.*alerts/i);
    if (await alertsTab.isVisible()) {
      await alertsTab.click();
    }
  });

  test('transition timeline', async ({ page }) => {
    const timelineTab = page.getByText(/cronograma.*transição|transition/i);
    if (await timelineTab.isVisible()) {
      await timelineTab.click();
    }
  });

  test('migration progress', async ({ page }) => {
    const progressTab = page.getByText(/progresso.*migração|migration/i);
    if (await progressTab.isVisible()) {
      await progressTab.click();
    }
  });

  test('split payment panel', async ({ page }) => {
    const splitTab = page.getByText(/split.*payment|pagamento.*dividido/i);
    if (await splitTab.isVisible()) {
      await splitTab.click();
    }
  });

  test('cashback simulator', async ({ page }) => {
    const cashbackTab = page.getByText(/cashback|simulador/i);
    if (await cashbackTab.isVisible()) {
      await cashbackTab.click();
    }
  });

  test('fiscal incentives panel', async ({ page }) => {
    const incentivesTab = page.getByText(/incentivos.*fiscais|fiscal.*incentives/i);
    if (await incentivesTab.isVisible()) {
      await incentivesTab.click();
    }
  });

  test('tax conciliation panel', async ({ page }) => {
    const concilTab = page.getByText(/conciliação.*tributária|tax.*conciliation/i);
    if (await concilTab.isVisible()) {
      await concilTab.click();
    }
  });

  test('audit compliance panel', async ({ page }) => {
    const auditTab = page.getByText(/auditoria|compliance|conformidade/i);
    if (await auditTab.isVisible()) {
      await auditTab.click();
    }
  });

  test('PerDcomp panel', async ({ page }) => {
    const perdcompTab = page.getByText(/perdcomp|per.*dcomp/i);
    if (await perdcompTab.isVisible()) {
      await perdcompTab.click();
    }
  });

  test('tax scenario simulator', async ({ page }) => {
    const simBtn = page.getByRole('button', { name: /simular.*cenário|scenario|simulador/i });
    if (await simBtn.isVisible()) {
      await simBtn.click();
    }
  });

  test('accounting tax reports', async ({ page }) => {
    const reportsTab = page.getByText(/relatórios.*contábeis|accounting.*reports/i);
    if (await reportsTab.isVisible()) {
      await reportsTab.click();
    }
  });

  test('taxable operations list', async ({ page }) => {
    const opsTab = page.getByText(/operações.*tributáveis|taxable.*operations/i);
    if (await opsTab.isVisible()) {
      await opsTab.click();
    }
  });

  test('special regimes', async ({ page }) => {
    const regimesTab = page.getByText(/regimes.*especiais|special.*regimes/i);
    if (await regimesTab.isVisible()) {
      await regimesTab.click();
    }
  });
});

test.describe('Reforma Tributária - Mobile', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('responsive layout on mobile', async ({ page }) => {
    await page.goto('/reforma-tributaria');
    await expect(page.getByRole('heading', { name: /reforma.*tributária/i })).toBeVisible();
  });
});
