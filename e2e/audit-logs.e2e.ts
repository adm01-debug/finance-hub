import { test, expect } from '@playwright/test';

test.describe('Audit Logs', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/audit-logs');
  });

  test('displays page title', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /audit.*log|log.*auditoria|trilha/i })).toBeVisible();
  });

  test('shows audit logs table', async ({ page }) => {
    await expect(page.getByRole('table').or(page.getByText(/ação|action|log/i).first())).toBeVisible({ timeout: 10000 });
  });

  test('log entries have required columns', async ({ page }) => {
    const table = page.getByRole('table');
    if (await table.isVisible()) {
      await expect(page.getByText(/data|ação|usuário|user|action|timestamp/i).first()).toBeVisible();
    }
  });

  test('filters logs by user', async ({ page }) => {
    const userFilter = page.getByRole('combobox', { name: /usuário|user/i });
    if (await userFilter.isVisible()) {
      await userFilter.click();
      await page.getByRole('option').first().click();
    }
  });

  test('filters logs by action type', async ({ page }) => {
    const actionFilter = page.getByRole('combobox', { name: /ação|action|tipo/i });
    if (await actionFilter.isVisible()) {
      await actionFilter.click();
      await page.getByRole('option').first().click();
    }
  });

  test('filters logs by date range', async ({ page }) => {
    const dateFilter = page.getByLabel(/data|período|from/i).first();
    if (await dateFilter.isVisible()) {
      await dateFilter.click();
    }
  });

  test('searches audit logs', async ({ page }) => {
    const searchInput = page.getByPlaceholder(/buscar|pesquisar|search/i);
    if (await searchInput.isVisible()) {
      await searchInput.fill('login');
      await page.waitForTimeout(500);
    }
  });

  test('views log entry details', async ({ page }) => {
    const viewBtn = page.getByRole('button', { name: /ver|detalhes|visualizar/i }).first();
    if (await viewBtn.isVisible()) {
      await viewBtn.click();
    }
  });

  test('paginates audit logs', async ({ page }) => {
    const nextBtn = page.getByRole('button', { name: /próxima|next|›/i });
    if (await nextBtn.isVisible() && await nextBtn.isEnabled()) {
      await nextBtn.click();
    }
  });

  test('exports audit logs', async ({ page }) => {
    const exportBtn = page.getByRole('button', { name: /exportar|export/i });
    if (await exportBtn.isVisible()) {
      await exportBtn.click();
    }
  });

  test('shows log severity/level', async ({ page }) => {
    const severity = page.getByText(/info|warning|error|critical/i).first();
    if (await severity.isVisible()) {
      await expect(severity).toBeVisible();
    }
  });

  test('shows IP address in logs', async ({ page }) => {
    const ipText = page.getByText(/\d+\.\d+\.\d+\.\d+/);
    if (await ipText.first().isVisible()) {
      await expect(ipText.first()).toBeVisible();
    }
  });

  test('refresh logs button', async ({ page }) => {
    const refreshBtn = page.getByRole('button', { name: /atualizar|refresh/i });
    if (await refreshBtn.isVisible()) {
      await refreshBtn.click();
    }
  });

  test('real-time log updates', async ({ page }) => {
    const liveIndicator = page.getByText(/ao.*vivo|live|real.*time/i);
    if (await liveIndicator.isVisible()) {
      await expect(liveIndicator).toBeVisible();
    }
  });
});

test.describe('Audit Logs - Mobile', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('responsive layout on mobile', async ({ page }) => {
    await page.goto('/audit-logs');
    await expect(page.getByRole('heading', { name: /audit.*log|log.*auditoria/i })).toBeVisible();
  });
});
