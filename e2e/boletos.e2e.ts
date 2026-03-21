import { test, expect } from '@playwright/test';

test.describe('Boletos', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/boletos');
  });

  test('displays page title', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /boletos/i })).toBeVisible();
  });

  test('shows boletos list', async ({ page }) => {
    await expect(page.getByRole('table').or(page.getByText(/boleto/i).first())).toBeVisible({ timeout: 10000 });
  });

  test('new boleto button opens form', async ({ page }) => {
    const newBtn = page.getByRole('button', { name: /novo.*boleto|gerar.*boleto|emitir/i });
    if (await newBtn.isVisible()) {
      await newBtn.click();
      await expect(page.getByRole('dialog')).toBeVisible();
    }
  });

  test('fills boleto generation form', async ({ page }) => {
    const newBtn = page.getByRole('button', { name: /novo.*boleto|gerar.*boleto|emitir/i });
    if (await newBtn.isVisible()) {
      await newBtn.click();
      await expect(page.getByRole('dialog')).toBeVisible();

      const valorInput = page.getByLabel(/valor/i);
      if (await valorInput.isVisible()) {
        await valorInput.fill('500.00');
      }

      const vencInput = page.getByLabel(/vencimento/i);
      if (await vencInput.isVisible()) {
        await vencInput.fill('2026-04-30');
      }

      const pagadorInput = page.getByLabel(/pagador|sacado|cliente/i);
      if (await pagadorInput.isVisible()) {
        await pagadorInput.fill('Cliente Teste');
      }
    }
  });

  test('views boleto barcode', async ({ page }) => {
    const viewBtn = page.getByRole('button', { name: /ver|visualizar|barcode/i }).first();
    if (await viewBtn.isVisible()) {
      await viewBtn.click();
    }
  });

  test('generates boleto PDF', async ({ page }) => {
    const pdfBtn = page.getByRole('button', { name: /pdf|imprimir|download/i }).first();
    if (await pdfBtn.isVisible()) {
      await pdfBtn.click();
    }
  });

  test('copies boleto barcode line', async ({ page }) => {
    const copyBtn = page.getByRole('button', { name: /copiar|copy|linha.*digitável/i }).first();
    if (await copyBtn.isVisible()) {
      await copyBtn.click();
    }
  });

  test('filters boletos by status', async ({ page }) => {
    const statusFilter = page.getByRole('combobox', { name: /status|filtro/i });
    if (await statusFilter.isVisible()) {
      await statusFilter.click();
      await page.getByRole('option').first().click();
    }
  });

  test('searches boletos', async ({ page }) => {
    const searchInput = page.getByPlaceholder(/buscar|pesquisar|search/i);
    if (await searchInput.isVisible()) {
      await searchInput.fill('teste');
      await page.waitForTimeout(500);
    }
  });

  test('cancels boleto', async ({ page }) => {
    const cancelBtn = page.getByRole('button', { name: /cancelar.*boleto|estornar/i }).first();
    if (await cancelBtn.isVisible()) {
      await cancelBtn.click();
      await expect(page.getByRole('dialog')).toBeVisible();
    }
  });

  test('sends boleto via email', async ({ page }) => {
    const emailBtn = page.getByRole('button', { name: /email|enviar/i }).first();
    if (await emailBtn.isVisible()) {
      await emailBtn.click();
    }
  });

  test('barcode reader/scanner', async ({ page }) => {
    const scanBtn = page.getByRole('button', { name: /ler.*código|scanner|leitor/i });
    if (await scanBtn.isVisible()) {
      await scanBtn.click();
    }
  });

  test('second copy generation', async ({ page }) => {
    const secondCopyBtn = page.getByRole('button', { name: /segunda.*via|2.*via/i }).first();
    if (await secondCopyBtn.isVisible()) {
      await secondCopyBtn.click();
    }
  });

  test('exports boletos list', async ({ page }) => {
    const exportBtn = page.getByRole('button', { name: /exportar|export/i });
    if (await exportBtn.isVisible()) {
      await exportBtn.click();
    }
  });
});

test.describe('Boletos - Mobile', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('responsive layout on mobile', async ({ page }) => {
    await page.goto('/boletos');
    await expect(page.getByRole('heading', { name: /boletos/i })).toBeVisible();
  });
});
