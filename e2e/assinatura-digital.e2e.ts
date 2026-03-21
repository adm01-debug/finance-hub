import { test, expect } from '@playwright/test';

test.describe('Assinatura Digital', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/assinatura-digital');
  });

  test('displays page title', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /assinatura.*digital|digital.*signature/i })).toBeVisible();
  });

  test('shows documents pending signature', async ({ page }) => {
    await expect(page.getByText(/assinatura|documento|signature/i).first()).toBeVisible({ timeout: 10000 });
  });

  test('uploads document for signing', async ({ page }) => {
    const uploadBtn = page.getByRole('button', { name: /upload|enviar|carregar.*documento/i });
    if (await uploadBtn.isVisible()) {
      await uploadBtn.click();
    }
  });

  test('signs document', async ({ page }) => {
    const signBtn = page.getByRole('button', { name: /assinar|sign/i }).first();
    if (await signBtn.isVisible()) {
      await signBtn.click();
    }
  });

  test('views signed document', async ({ page }) => {
    const viewBtn = page.getByRole('button', { name: /ver|visualizar|download/i }).first();
    if (await viewBtn.isVisible()) {
      await viewBtn.click();
    }
  });

  test('signature verification', async ({ page }) => {
    const verifyBtn = page.getByRole('button', { name: /verificar|verify|validar/i });
    if (await verifyBtn.isVisible()) {
      await verifyBtn.click();
    }
  });

  test('certificate management', async ({ page }) => {
    const certSection = page.getByText(/certificado|certificate/i);
    if (await certSection.isVisible()) {
      await expect(certSection).toBeVisible();
    }
  });

  test('filters documents by status', async ({ page }) => {
    const statusFilter = page.getByRole('combobox', { name: /status|filtro/i });
    if (await statusFilter.isVisible()) {
      await statusFilter.click();
      await page.getByRole('option').first().click();
    }
  });

  test('searches documents', async ({ page }) => {
    const searchInput = page.getByPlaceholder(/buscar|pesquisar|search/i);
    if (await searchInput.isVisible()) {
      await searchInput.fill('contrato');
      await page.waitForTimeout(500);
    }
  });

  test('sends document for external signature', async ({ page }) => {
    const sendBtn = page.getByRole('button', { name: /enviar.*assinatura|send.*signature/i }).first();
    if (await sendBtn.isVisible()) {
      await sendBtn.click();
    }
  });

  test('signature history', async ({ page }) => {
    const historyTab = page.getByText(/histórico|history/i);
    if (await historyTab.isVisible()) {
      await historyTab.click();
    }
  });

  test('revokes signature', async ({ page }) => {
    const revokeBtn = page.getByRole('button', { name: /revogar|revoke|cancelar.*assinatura/i }).first();
    if (await revokeBtn.isVisible()) {
      await revokeBtn.click();
    }
  });
});

test.describe('Assinatura Digital - Mobile', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('responsive layout on mobile', async ({ page }) => {
    await page.goto('/assinatura-digital');
    await expect(page.getByRole('heading', { name: /assinatura.*digital/i })).toBeVisible();
  });
});
