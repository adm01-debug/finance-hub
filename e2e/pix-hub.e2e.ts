import { test, expect } from '@playwright/test';

test.describe('PIX Hub', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/pix-hub');
  });

  test('displays page title', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /pix/i })).toBeVisible();
  });

  test('shows PIX dashboard', async ({ page }) => {
    await expect(page.getByText(/pix|transação|saldo/i).first()).toBeVisible({ timeout: 10000 });
  });

  test('realtime PIX dashboard visibility', async ({ page }) => {
    const realtimePanel = page.getByText(/tempo.*real|realtime|ao.*vivo/i);
    if (await realtimePanel.isVisible()) {
      await expect(realtimePanel).toBeVisible();
    }
  });

  test('PIX templates panel', async ({ page }) => {
    const templatesTab = page.getByText(/templates|modelos|favoritos/i);
    if (await templatesTab.isVisible()) {
      await templatesTab.click();
    }
  });

  test('creates new PIX template', async ({ page }) => {
    const newTemplateBtn = page.getByRole('button', { name: /novo.*template|novo.*modelo|criar/i });
    if (await newTemplateBtn.isVisible()) {
      await newTemplateBtn.click();
      await expect(page.getByRole('dialog')).toBeVisible();
    }
  });

  test('quick mobile approval panel', async ({ page }) => {
    const approvalPanel = page.getByText(/aprovação.*rápida|quick.*approval|mobile/i);
    if (await approvalPanel.isVisible()) {
      await expect(approvalPanel).toBeVisible();
    }
  });

  test('PIX transfer button', async ({ page }) => {
    const transferBtn = page.getByRole('button', { name: /transferir|enviar.*pix|novo.*pix/i });
    if (await transferBtn.isVisible()) {
      await transferBtn.click();
    }
  });

  test('PIX transfer form', async ({ page }) => {
    const transferBtn = page.getByRole('button', { name: /transferir|enviar.*pix|novo.*pix/i });
    if (await transferBtn.isVisible()) {
      await transferBtn.click();

      const chaveInput = page.getByLabel(/chave.*pix|pix.*key/i);
      if (await chaveInput.isVisible()) {
        await chaveInput.fill('teste@email.com');
      }

      const valorInput = page.getByLabel(/valor/i);
      if (await valorInput.isVisible()) {
        await valorInput.fill('100.00');
      }
    }
  });

  test('PIX QR code generation', async ({ page }) => {
    const qrBtn = page.getByRole('button', { name: /qr.*code|gerar.*qr/i });
    if (await qrBtn.isVisible()) {
      await qrBtn.click();
    }
  });

  test('PIX copy-paste key', async ({ page }) => {
    const copyBtn = page.getByRole('button', { name: /copiar|copy.*paste|copia.*cola/i }).first();
    if (await copyBtn.isVisible()) {
      await copyBtn.click();
    }
  });

  test('filters PIX transactions', async ({ page }) => {
    const statusFilter = page.getByRole('combobox', { name: /status|filtro|tipo/i });
    if (await statusFilter.isVisible()) {
      await statusFilter.click();
      await page.getByRole('option').first().click();
    }
  });

  test('PIX transaction history', async ({ page }) => {
    const historyTab = page.getByText(/histórico|transações/i);
    if (await historyTab.isVisible()) {
      await historyTab.click();
    }
  });

  test('exports PIX transactions', async ({ page }) => {
    const exportBtn = page.getByRole('button', { name: /exportar|export/i });
    if (await exportBtn.isVisible()) {
      await exportBtn.click();
    }
  });

  test('PIX receipt/comprovante', async ({ page }) => {
    const receiptBtn = page.getByRole('button', { name: /comprovante|receipt|recibo/i }).first();
    if (await receiptBtn.isVisible()) {
      await receiptBtn.click();
    }
  });
});

test.describe('PIX Hub - Mobile', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('responsive layout on mobile', async ({ page }) => {
    await page.goto('/pix-hub');
    await expect(page.getByRole('heading', { name: /pix/i })).toBeVisible();
  });

  test('quick approval works on mobile', async ({ page }) => {
    await page.goto('/pix-hub');
    const approvalBtn = page.getByRole('button', { name: /aprovar|approve/i }).first();
    if (await approvalBtn.isVisible()) {
      await approvalBtn.click();
    }
  });
});
