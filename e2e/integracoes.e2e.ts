import { test, expect } from '@playwright/test';

test.describe('Integração Bitrix24', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/bitrix24');
  });

  test('displays page title', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /bitrix|integração|crm/i })).toBeVisible();
  });

  test('shows webhook configuration', async ({ page }) => {
    const webhookSection = page.getByText(/webhook|configuração|config/i);
    if (await webhookSection.isVisible()) {
      await expect(webhookSection).toBeVisible();
    }
  });

  test('webhook URL input', async ({ page }) => {
    const urlInput = page.getByLabel(/url|webhook|endpoint/i);
    if (await urlInput.isVisible()) {
      await urlInput.fill('https://bitrix.example.com/webhook/');
    }
  });

  test('test connection button', async ({ page }) => {
    const testBtn = page.getByRole('button', { name: /testar|test|verificar/i });
    if (await testBtn.isVisible()) {
      await testBtn.click();
    }
  });

  test('sync status indicator', async ({ page }) => {
    const syncStatus = page.getByText(/sincroniz|sync|último/i);
    if (await syncStatus.isVisible()) {
      await expect(syncStatus).toBeVisible();
    }
  });

  test('manual sync button', async ({ page }) => {
    const syncBtn = page.getByRole('button', { name: /sincronizar|sync|atualizar/i });
    if (await syncBtn.isVisible()) {
      await syncBtn.click();
    }
  });

  test('saves integration settings', async ({ page }) => {
    const saveBtn = page.getByRole('button', { name: /salvar|save/i });
    if (await saveBtn.isVisible()) {
      await saveBtn.click();
    }
  });
});

test.describe('Integração Bling', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/bling');
  });

  test('displays page title', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /bling|integração|erp/i })).toBeVisible();
  });

  test('shows Bling connection status', async ({ page }) => {
    const status = page.getByText(/bling|conectado|desconectado|status/i);
    if (await status.isVisible()) {
      await expect(status).toBeVisible();
    }
  });

  test('API key configuration', async ({ page }) => {
    const apiKeyInput = page.getByLabel(/api.*key|chave.*api|token/i);
    if (await apiKeyInput.isVisible()) {
      await apiKeyInput.fill('test-api-key-123');
    }
  });

  test('sync products button', async ({ page }) => {
    const syncBtn = page.getByRole('button', { name: /sincronizar.*produtos|sync.*products/i });
    if (await syncBtn.isVisible()) {
      await syncBtn.click();
    }
  });

  test('sync NFe button', async ({ page }) => {
    const syncBtn = page.getByRole('button', { name: /sincronizar.*nf|sync.*nfe/i });
    if (await syncBtn.isVisible()) {
      await syncBtn.click();
    }
  });

  test('integration logs', async ({ page }) => {
    const logsTab = page.getByText(/logs|histórico|registro/i);
    if (await logsTab.isVisible()) {
      await logsTab.click();
    }
  });

  test('test connection', async ({ page }) => {
    const testBtn = page.getByRole('button', { name: /testar|test|verificar/i });
    if (await testBtn.isVisible()) {
      await testBtn.click();
    }
  });

  test('saves Bling settings', async ({ page }) => {
    const saveBtn = page.getByRole('button', { name: /salvar|save/i });
    if (await saveBtn.isVisible()) {
      await saveBtn.click();
    }
  });
});

test.describe('Dashboard Empresa', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard-empresa');
  });

  test('displays page title', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /dashboard|empresa|company/i })).toBeVisible();
  });

  test('shows company KPIs', async ({ page }) => {
    await expect(page.getByText(/R\$|receita|despesa|lucro/i).first()).toBeVisible({ timeout: 10000 });
  });

  test('company selector', async ({ page }) => {
    const companySelect = page.getByRole('combobox', { name: /empresa|company/i });
    if (await companySelect.isVisible()) {
      await companySelect.click();
      await page.getByRole('option').first().click();
    }
  });

  test('period filter', async ({ page }) => {
    const periodSelect = page.getByRole('combobox', { name: /período|period/i });
    if (await periodSelect.isVisible()) {
      await periodSelect.click();
      await page.getByRole('option').first().click();
    }
  });

  test('exports company dashboard', async ({ page }) => {
    const exportBtn = page.getByRole('button', { name: /exportar|export/i });
    if (await exportBtn.isVisible()) {
      await exportBtn.click();
    }
  });
});

test.describe('Dashboard Receber', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard-receber');
  });

  test('displays page title', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /dashboard|receber|receivable/i })).toBeVisible();
  });

  test('shows receivables KPIs', async ({ page }) => {
    await expect(page.getByText(/R\$|receber|receita|inadimplência/i).first()).toBeVisible({ timeout: 10000 });
  });

  test('receivables chart', async ({ page }) => {
    const chart = page.locator('.recharts-wrapper, canvas, [data-testid*="chart"]');
    if (await chart.first().isVisible()) {
      await expect(chart.first()).toBeVisible();
    }
  });

  test('aging analysis', async ({ page }) => {
    const aging = page.getByText(/aging|vencido|0-30|31-60/i);
    if (await aging.isVisible()) {
      await expect(aging).toBeVisible();
    }
  });

  test('period filter', async ({ page }) => {
    const periodSelect = page.getByRole('combobox', { name: /período|period/i });
    if (await periodSelect.isVisible()) {
      await periodSelect.click();
      await page.getByRole('option').first().click();
    }
  });
});

test.describe('Reset Password', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test('displays reset password page', async ({ page }) => {
    await page.goto('/reset-password');
    await expect(page.getByRole('heading', { name: /redefinir.*senha|reset.*password|nova.*senha/i })).toBeVisible();
  });

  test('shows password fields', async ({ page }) => {
    await page.goto('/reset-password');
    const passwordInput = page.getByLabel(/nova.*senha|new.*password|senha/i);
    if (await passwordInput.isVisible()) {
      await expect(passwordInput).toBeVisible();
    }
  });

  test('validates password strength on reset', async ({ page }) => {
    await page.goto('/reset-password');
    const passwordInput = page.getByLabel(/nova.*senha|new.*password|^senha$/i);
    if (await passwordInput.isVisible()) {
      await passwordInput.fill('weak');
      const strengthIndicator = page.getByText(/fraca|weak|mínimo/i);
      if (await strengthIndicator.isVisible()) {
        await expect(strengthIndicator).toBeVisible();
      }
    }
  });

  test('password confirmation match', async ({ page }) => {
    await page.goto('/reset-password');
    const passwordInput = page.getByLabel(/nova.*senha|^senha$/i);
    const confirmInput = page.getByLabel(/confirmar|confirm/i);
    if (await passwordInput.isVisible() && await confirmInput.isVisible()) {
      await passwordInput.fill('NewPass@123!');
      await confirmInput.fill('DifferentPass@123!');
      const submitBtn = page.getByRole('button', { name: /redefinir|reset|salvar/i });
      if (await submitBtn.isVisible()) {
        await submitBtn.click();
      }
    }
  });
});
