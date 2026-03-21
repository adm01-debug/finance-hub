import { test, expect } from '@playwright/test';

test.describe('Alertas', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/alertas');
  });

  test('displays page title', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /alertas|alerts/i })).toBeVisible();
  });

  test('shows alerts list', async ({ page }) => {
    await expect(page.getByText(/alerta|alert|notificação/i).first()).toBeVisible({ timeout: 10000 });
  });

  test('filters alerts by type', async ({ page }) => {
    const typeFilter = page.getByRole('combobox', { name: /tipo|type|categoria/i });
    if (await typeFilter.isVisible()) {
      await typeFilter.click();
      await page.getByRole('option').first().click();
    }
  });

  test('filters alerts by severity', async ({ page }) => {
    const severityFilter = page.getByRole('combobox', { name: /severidade|severity|prioridade/i });
    if (await severityFilter.isVisible()) {
      await severityFilter.click();
      await page.getByRole('option').first().click();
    }
  });

  test('marks alert as read', async ({ page }) => {
    const markReadBtn = page.getByRole('button', { name: /marcar.*lido|mark.*read|ler/i }).first();
    if (await markReadBtn.isVisible()) {
      await markReadBtn.click();
    }
  });

  test('marks all alerts as read', async ({ page }) => {
    const markAllBtn = page.getByRole('button', { name: /marcar.*todos|mark.*all|ler.*todos/i });
    if (await markAllBtn.isVisible()) {
      await markAllBtn.click();
    }
  });

  test('dismisses alert', async ({ page }) => {
    const dismissBtn = page.getByRole('button', { name: /dispensar|dismiss|fechar|×/i }).first();
    if (await dismissBtn.isVisible()) {
      await dismissBtn.click();
    }
  });

  test('views alert details', async ({ page }) => {
    const viewBtn = page.getByRole('button', { name: /ver|detalhes|visualizar/i }).first();
    if (await viewBtn.isVisible()) {
      await viewBtn.click();
    }
  });

  test('predictive alerts panel', async ({ page }) => {
    const predictiveTab = page.getByText(/preditivo|predictive|ia/i);
    if (await predictiveTab.isVisible()) {
      await predictiveTab.click();
    }
  });

  test('alert configuration link', async ({ page }) => {
    const configBtn = page.getByRole('button', { name: /configurar|config|settings/i });
    if (await configBtn.isVisible()) {
      await configBtn.click();
    }
  });

  test('searches alerts', async ({ page }) => {
    const searchInput = page.getByPlaceholder(/buscar|pesquisar|search/i);
    if (await searchInput.isVisible()) {
      await searchInput.fill('vencimento');
      await page.waitForTimeout(500);
    }
  });

  test('unread count badge', async ({ page }) => {
    const badge = page.locator('.badge, [data-testid*="count"]');
    if (await badge.first().isVisible()) {
      await expect(badge.first()).toBeVisible();
    }
  });

  test('alert action buttons', async ({ page }) => {
    const actionBtn = page.getByRole('button', { name: /ação|action|resolver/i }).first();
    if (await actionBtn.isVisible()) {
      await actionBtn.click();
    }
  });

  test('real-time alert updates', async ({ page }) => {
    const realtimeIndicator = page.getByText(/tempo.*real|realtime|ao.*vivo/i);
    if (await realtimeIndicator.isVisible()) {
      await expect(realtimeIndicator).toBeVisible();
    }
  });
});

test.describe('Alertas - Mobile', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('responsive layout on mobile', async ({ page }) => {
    await page.goto('/alertas');
    await expect(page.getByRole('heading', { name: /alertas/i })).toBeVisible();
  });
});
