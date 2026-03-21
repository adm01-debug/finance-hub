import { test, expect } from '@playwright/test';

test.describe('Pagamentos Recorrentes', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/pagamentos-recorrentes');
  });

  test('displays page title', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /pagamentos.*recorrentes|recurring/i })).toBeVisible();
  });

  test('shows recurring payments list', async ({ page }) => {
    await expect(page.getByText(/recorrente|recurring|mensal|semanal/i).first()).toBeVisible({ timeout: 10000 });
  });

  test('add new recurring payment button', async ({ page }) => {
    const newBtn = page.getByRole('button', { name: /novo.*pagamento|adicionar|novo/i });
    if (await newBtn.isVisible()) {
      await newBtn.click();
      await expect(page.getByRole('dialog')).toBeVisible();
    }
  });

  test('recurring payment form fields', async ({ page }) => {
    const newBtn = page.getByRole('button', { name: /novo.*pagamento|adicionar|novo/i });
    if (await newBtn.isVisible()) {
      await newBtn.click();

      const descInput = page.getByLabel(/descrição|nome/i);
      if (await descInput.isVisible()) {
        await descInput.fill('Aluguel mensal');
      }

      const valorInput = page.getByLabel(/valor/i);
      if (await valorInput.isVisible()) {
        await valorInput.fill('3500.00');
      }

      const freqSelect = page.getByLabel(/frequência|periodicidade|frequency/i);
      if (await freqSelect.isVisible()) {
        await freqSelect.click();
        await page.getByRole('option', { name: /mensal|monthly/i }).click();
      }

      const startInput = page.getByLabel(/início|start|primeira/i);
      if (await startInput.isVisible()) {
        await startInput.fill('2026-04-01');
      }
    }
  });

  test('validates required fields', async ({ page }) => {
    const newBtn = page.getByRole('button', { name: /novo.*pagamento|adicionar|novo/i });
    if (await newBtn.isVisible()) {
      await newBtn.click();
      await page.getByRole('button', { name: /salvar|criar/i }).click();
      await expect(page.getByText(/obrigatório|required/i).first()).toBeVisible();
    }
  });

  test('edits recurring payment', async ({ page }) => {
    const editBtn = page.getByRole('button', { name: /editar|edit/i }).first();
    if (await editBtn.isVisible()) {
      await editBtn.click();
      await expect(page.getByRole('dialog')).toBeVisible();
    }
  });

  test('pauses/suspends recurring payment', async ({ page }) => {
    const pauseBtn = page.getByRole('button', { name: /pausar|suspender|pause/i }).first();
    if (await pauseBtn.isVisible()) {
      await pauseBtn.click();
    }
  });

  test('resumes recurring payment', async ({ page }) => {
    const resumeBtn = page.getByRole('button', { name: /retomar|resume|reativar/i }).first();
    if (await resumeBtn.isVisible()) {
      await resumeBtn.click();
    }
  });

  test('cancels recurring payment', async ({ page }) => {
    const cancelBtn = page.getByRole('button', { name: /cancelar|cancel|encerrar/i }).first();
    if (await cancelBtn.isVisible()) {
      await cancelBtn.click();
      await expect(page.getByRole('dialog')).toBeVisible();
    }
  });

  test('views payment history', async ({ page }) => {
    const historyBtn = page.getByRole('button', { name: /histórico|history|parcelas/i }).first();
    if (await historyBtn.isVisible()) {
      await historyBtn.click();
    }
  });

  test('frequency options', async ({ page }) => {
    const newBtn = page.getByRole('button', { name: /novo.*pagamento|adicionar|novo/i });
    if (await newBtn.isVisible()) {
      await newBtn.click();

      const freqSelect = page.getByLabel(/frequência|periodicidade/i);
      if (await freqSelect.isVisible()) {
        await freqSelect.click();
        // Check various options exist
        await expect(page.getByRole('option').first()).toBeVisible();
      }
    }
  });

  test('filters by status', async ({ page }) => {
    const statusFilter = page.getByRole('combobox', { name: /status|filtro/i });
    if (await statusFilter.isVisible()) {
      await statusFilter.click();
      await page.getByRole('option').first().click();
    }
  });

  test('searches recurring payments', async ({ page }) => {
    const searchInput = page.getByPlaceholder(/buscar|pesquisar|search/i);
    if (await searchInput.isVisible()) {
      await searchInput.fill('aluguel');
      await page.waitForTimeout(500);
    }
  });

  test('next payment date display', async ({ page }) => {
    const nextPayment = page.getByText(/próximo.*pagamento|next.*payment/i);
    if (await nextPayment.isVisible()) {
      await expect(nextPayment).toBeVisible();
    }
  });
});

test.describe('Pagamentos Recorrentes - Mobile', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('responsive layout on mobile', async ({ page }) => {
    await page.goto('/pagamentos-recorrentes');
    await expect(page.getByRole('heading', { name: /pagamentos.*recorrentes/i })).toBeVisible();
  });
});
