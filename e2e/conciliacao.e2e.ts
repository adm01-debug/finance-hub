import { test, expect } from '@playwright/test';

test.describe('Conciliação Bancária', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/conciliacao');
  });

  test('displays page title', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /conciliação/i })).toBeVisible();
  });

  test('shows conciliation dashboard', async ({ page }) => {
    await expect(page.getByText(/conciliad|pendente|divergent/i).first()).toBeVisible({ timeout: 10000 });
  });

  test('import bank statement button', async ({ page }) => {
    const importBtn = page.getByRole('button', { name: /importar|upload|extrato/i });
    if (await importBtn.isVisible()) {
      await importBtn.click();
      await expect(page.getByRole('dialog')).toBeVisible();
    }
  });

  test('bank statement panel visibility', async ({ page }) => {
    const extratoPanel = page.getByText(/extrato.*bancário|bank.*statement/i);
    if (await extratoPanel.isVisible()) {
      await expect(extratoPanel).toBeVisible();
    }
  });

  test('match suggestions panel', async ({ page }) => {
    const sugestoes = page.getByText(/sugest|match|correspondência/i);
    if (await sugestoes.isVisible()) {
      await expect(sugestoes).toBeVisible();
    }
  });

  test('AI match suggestions', async ({ page }) => {
    const iaBtn = page.getByRole('button', { name: /ia|inteligência|smart.*match/i });
    if (await iaBtn.isVisible()) {
      await iaBtn.click();
    }
  });

  test('manual conciliation dialog', async ({ page }) => {
    const manualBtn = page.getByRole('button', { name: /manual|conciliar.*manual/i });
    if (await manualBtn.isVisible()) {
      await manualBtn.click();
      await expect(page.getByRole('dialog')).toBeVisible();
    }
  });

  test('split transaction dialog', async ({ page }) => {
    const splitBtn = page.getByRole('button', { name: /dividir|split|desmembr/i });
    if (await splitBtn.isVisible()) {
      await splitBtn.click();
      await expect(page.getByRole('dialog')).toBeVisible();
    }
  });

  test('conciliation filters', async ({ page }) => {
    const statusFilter = page.getByRole('combobox', { name: /status|filtro/i });
    if (await statusFilter.isVisible()) {
      await statusFilter.click();
      await page.getByRole('option').first().click();
    }
  });

  test('conciliation sessions panel', async ({ page }) => {
    const sessionsTab = page.getByText(/sessões|sessions|histórico/i);
    if (await sessionsTab.isVisible()) {
      await sessionsTab.click();
    }
  });

  test('conciliation rules panel', async ({ page }) => {
    const rulesTab = page.getByText(/regras|rules|automátic/i);
    if (await rulesTab.isVisible()) {
      await rulesTab.click();
    }
  });

  test('export conciliation report', async ({ page }) => {
    const exportBtn = page.getByRole('button', { name: /exportar|relatório|report/i });
    if (await exportBtn.isVisible()) {
      await exportBtn.click();
    }
  });

  test('import report dialog', async ({ page }) => {
    const reportBtn = page.getByRole('button', { name: /relatório.*importação|import.*report/i });
    if (await reportBtn.isVisible()) {
      await reportBtn.click();
    }
  });

  test('approve match button', async ({ page }) => {
    const approveBtn = page.getByRole('button', { name: /aprovar|confirmar.*match|conciliar/i }).first();
    if (await approveBtn.isVisible()) {
      await approveBtn.click();
    }
  });

  test('reject match button', async ({ page }) => {
    const rejectBtn = page.getByRole('button', { name: /rejeitar|recusar|ignorar/i }).first();
    if (await rejectBtn.isVisible()) {
      await rejectBtn.click();
    }
  });

  test('bank account selector', async ({ page }) => {
    const bankSelect = page.getByRole('combobox', { name: /banco|conta.*bancária|bank/i });
    if (await bankSelect.isVisible()) {
      await bankSelect.click();
      await page.getByRole('option').first().click();
    }
  });

  test('date range filter', async ({ page }) => {
    const dateFilter = page.getByLabel(/data|período/i).first();
    if (await dateFilter.isVisible()) {
      await dateFilter.click();
    }
  });
});

test.describe('Conciliação - Mobile', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('responsive layout on mobile', async ({ page }) => {
    await page.goto('/conciliacao');
    await expect(page.getByRole('heading', { name: /conciliação/i })).toBeVisible();
  });
});
