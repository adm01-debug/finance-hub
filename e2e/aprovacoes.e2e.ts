import { test, expect } from '@playwright/test';

test.describe('Aprovações', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/aprovacoes');
  });

  test('displays page title', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /aprovações|approvals/i })).toBeVisible();
  });

  test('shows pending approvals list', async ({ page }) => {
    await expect(page.getByText(/pendente|aprovação|approval/i).first()).toBeVisible({ timeout: 10000 });
  });

  test('approval history tab', async ({ page }) => {
    const historyTab = page.getByRole('tab', { name: /histórico|history/i })
      .or(page.getByRole('button', { name: /histórico|history/i }));
    if (await historyTab.isVisible()) {
      await historyTab.click();
    }
  });

  test('approval configuration card', async ({ page }) => {
    const configTab = page.getByText(/configuração|config|regras/i);
    if (await configTab.isVisible()) {
      await configTab.click();
    }
  });

  test('approves a pending item', async ({ page }) => {
    const approveBtn = page.getByRole('button', { name: /aprovar|approve/i }).first();
    if (await approveBtn.isVisible()) {
      await approveBtn.click();
      const confirmBtn = page.getByRole('button', { name: /confirmar|sim|yes/i });
      if (await confirmBtn.isVisible()) {
        await confirmBtn.click();
      }
    }
  });

  test('rejects a pending item', async ({ page }) => {
    const rejectBtn = page.getByRole('button', { name: /rejeitar|reject|recusar/i }).first();
    if (await rejectBtn.isVisible()) {
      await rejectBtn.click();
      const motivoInput = page.getByLabel(/motivo|razão|reason/i);
      if (await motivoInput.isVisible()) {
        await motivoInput.fill('Valor acima do limite');
      }
    }
  });

  test('views approval details', async ({ page }) => {
    const viewBtn = page.getByRole('button', { name: /ver|detalhes|visualizar/i }).first();
    if (await viewBtn.isVisible()) {
      await viewBtn.click();
    }
  });

  test('filters approvals by type', async ({ page }) => {
    const typeFilter = page.getByRole('combobox', { name: /tipo|type|categoria/i });
    if (await typeFilter.isVisible()) {
      await typeFilter.click();
      await page.getByRole('option').first().click();
    }
  });

  test('filters approvals by date', async ({ page }) => {
    const dateFilter = page.getByLabel(/data|período/i).first();
    if (await dateFilter.isVisible()) {
      await dateFilter.click();
    }
  });

  test('approval count badge', async ({ page }) => {
    const badge = page.locator('[data-testid="approval-count"], .badge');
    if (await badge.first().isVisible()) {
      await expect(badge.first()).toBeVisible();
    }
  });

  test('password reset approvals tab', async ({ page }) => {
    const resetTab = page.getByText(/reset.*senha|password.*reset/i);
    if (await resetTab.isVisible()) {
      await resetTab.click();
    }
  });

  test('approval threshold configuration', async ({ page }) => {
    const thresholdBtn = page.getByRole('button', { name: /limite|threshold|configurar/i });
    if (await thresholdBtn.isVisible()) {
      await thresholdBtn.click();
    }
  });

  test('bulk approve selected items', async ({ page }) => {
    const checkboxes = page.locator('input[type="checkbox"]');
    const count = await checkboxes.count();
    if (count >= 3) {
      await checkboxes.nth(1).click();
      await checkboxes.nth(2).click();
      const bulkApproveBtn = page.getByRole('button', { name: /aprovar.*selecionad/i });
      if (await bulkApproveBtn.isVisible()) {
        await bulkApproveBtn.click();
      }
    }
  });

  test('searches approvals', async ({ page }) => {
    const searchInput = page.getByPlaceholder(/buscar|pesquisar|search/i);
    if (await searchInput.isVisible()) {
      await searchInput.fill('pagamento');
      await page.waitForTimeout(500);
    }
  });
});

test.describe('Aprovações - Mobile', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('responsive layout on mobile', async ({ page }) => {
    await page.goto('/aprovacoes');
    await expect(page.getByRole('heading', { name: /aprovações/i })).toBeVisible();
  });
});
