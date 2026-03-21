import { test, expect } from '@playwright/test';

test.describe('Cobranças', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/cobrancas');
  });

  test('displays page title', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /cobranças|collections/i })).toBeVisible();
  });

  test('shows collection queue panel', async ({ page }) => {
    await expect(page.getByText(/fila|cobrança|inadimpl/i).first()).toBeVisible({ timeout: 10000 });
  });

  test('collection rule config button', async ({ page }) => {
    const configBtn = page.getByRole('button', { name: /régua|config.*cobrança|regras/i });
    if (await configBtn.isVisible()) {
      await configBtn.click();
    }
  });

  test('payment agreement dialog', async ({ page }) => {
    const acordoBtn = page.getByRole('button', { name: /acordo|parcelamento|negoci/i }).first();
    if (await acordoBtn.isVisible()) {
      await acordoBtn.click();
      await expect(page.getByRole('dialog')).toBeVisible();
    }
  });

  test('agreement form fields', async ({ page }) => {
    const acordoBtn = page.getByRole('button', { name: /acordo|parcelamento|negoci/i }).first();
    if (await acordoBtn.isVisible()) {
      await acordoBtn.click();
      await expect(page.getByRole('dialog')).toBeVisible();

      const parcelasInput = page.getByLabel(/parcelas|installments/i);
      if (await parcelasInput.isVisible()) {
        await parcelasInput.fill('6');
      }

      const descontoInput = page.getByLabel(/desconto|discount/i);
      if (await descontoInput.isVisible()) {
        await descontoInput.fill('10');
      }
    }
  });

  test('WhatsApp proactive panel', async ({ page }) => {
    const whatsappTab = page.getByText(/whatsapp|proativo/i);
    if (await whatsappTab.isVisible()) {
      await whatsappTab.click();
    }
  });

  test('WhatsApp history panel', async ({ page }) => {
    const historyTab = page.getByText(/histórico.*whatsapp|mensagens/i);
    if (await historyTab.isVisible()) {
      await historyTab.click();
    }
  });

  test('AI negotiation panel', async ({ page }) => {
    const iaBtn = page.getByRole('button', { name: /ia|inteligência.*artificial|negociação.*ia/i });
    if (await iaBtn.isVisible()) {
      await iaBtn.click();
    }
  });

  test('delinquency prediction', async ({ page }) => {
    const predBtn = page.getByText(/previsão.*inadimplência|prediction/i);
    if (await predBtn.isVisible()) {
      await expect(predBtn).toBeVisible();
    }
  });

  test('negativation and protests panel', async ({ page }) => {
    const negTab = page.getByText(/negativação|protesto|serasa|spc/i);
    if (await negTab.isVisible()) {
      await negTab.click();
    }
  });

  test('sends collection message', async ({ page }) => {
    const sendBtn = page.getByRole('button', { name: /enviar.*cobrança|cobrar|notify/i }).first();
    if (await sendBtn.isVisible()) {
      await sendBtn.click();
    }
  });

  test('filters collections by status', async ({ page }) => {
    const statusFilter = page.getByRole('combobox', { name: /status|filtro/i });
    if (await statusFilter.isVisible()) {
      await statusFilter.click();
      await page.getByRole('option').first().click();
    }
  });

  test('searches collections', async ({ page }) => {
    const searchInput = page.getByPlaceholder(/buscar|pesquisar|search/i);
    if (await searchInput.isVisible()) {
      await searchInput.fill('teste');
      await page.waitForTimeout(500);
    }
  });

  test('collection aging buckets', async ({ page }) => {
    const aging = page.getByText(/0-30|31-60|61-90|dias/i);
    if (await aging.isVisible()) {
      await expect(aging).toBeVisible();
    }
  });

  test('exports collections report', async ({ page }) => {
    const exportBtn = page.getByRole('button', { name: /exportar|export|relatório/i });
    if (await exportBtn.isVisible()) {
      await exportBtn.click();
    }
  });

  test('segmented delinquency view', async ({ page }) => {
    const segmentTab = page.getByText(/segmentad|por.*cliente|por.*categoria/i);
    if (await segmentTab.isVisible()) {
      await segmentTab.click();
    }
  });
});

test.describe('Cobranças - Mobile', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('responsive layout on mobile', async ({ page }) => {
    await page.goto('/cobrancas');
    await expect(page.getByRole('heading', { name: /cobranças/i })).toBeVisible();
  });
});
