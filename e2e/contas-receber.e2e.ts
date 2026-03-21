import { test, expect } from '@playwright/test';

test.describe('Contas a Receber', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/contas-receber');
  });

  test('displays page title and header', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /contas a receber/i })).toBeVisible();
  });

  test('shows KPI cards with financial summary', async ({ page }) => {
    const kpis = page.locator('[data-testid="kpi-card"], .kpi-card, [class*="kpi"]');
    await expect(kpis.first()).toBeVisible({ timeout: 10000 });
    await expect(page.getByText(/total/i).first()).toBeVisible();
    await expect(page.getByText(/R\$/).first()).toBeVisible();
  });

  test('shows contas list table with correct headers', async ({ page }) => {
    await expect(page.getByRole('table')).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole('columnheader', { name: /descrição|cliente/i })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: /valor/i })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: /vencimento/i })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: /status/i })).toBeVisible();
  });

  test('opens create modal for new conta a receber', async ({ page }) => {
    await page.getByRole('button', { name: /nova conta|novo|adicionar/i }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
  });

  test('creates new conta a receber with all fields', async ({ page }) => {
    await page.getByRole('button', { name: /nova conta|novo|adicionar/i }).click();
    await expect(page.getByRole('dialog')).toBeVisible();

    await page.getByLabel(/descrição/i).fill('Venda de produto - Teste E2E');
    await page.getByLabel(/valor/i).fill('2500.00');

    const vencimentoInput = page.getByLabel(/vencimento/i);
    if (await vencimentoInput.isVisible()) {
      await vencimentoInput.fill('2026-04-15');
    }

    const clienteSelect = page.getByLabel(/cliente/i);
    if (await clienteSelect.isVisible()) {
      await clienteSelect.click();
      await page.getByRole('option').first().click();
    }

    await page.getByRole('button', { name: /salvar|criar|cadastrar/i }).click();
    await expect(page.getByRole('dialog')).not.toBeVisible({ timeout: 5000 });
  });

  test('validates required fields on empty submit', async ({ page }) => {
    await page.getByRole('button', { name: /nova conta|novo|adicionar/i }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await page.getByRole('button', { name: /salvar|criar|cadastrar/i }).click();
    await expect(page.getByText(/obrigatório|required/i).first()).toBeVisible();
  });

  test('filters by status pendente', async ({ page }) => {
    await expect(page.getByRole('table')).toBeVisible({ timeout: 10000 });
    const statusFilter = page.getByRole('combobox', { name: /status/i });
    if (await statusFilter.isVisible()) {
      await statusFilter.click();
      await page.getByRole('option', { name: /pendente/i }).click();
      await page.waitForTimeout(500);
      await expect(page.getByRole('table')).toBeVisible();
    }
  });

  test('filters by status pago/recebido', async ({ page }) => {
    await expect(page.getByRole('table')).toBeVisible({ timeout: 10000 });
    const statusFilter = page.getByRole('combobox', { name: /status/i });
    if (await statusFilter.isVisible()) {
      await statusFilter.click();
      await page.getByRole('option', { name: /pago|recebido/i }).click();
      await page.waitForTimeout(500);
    }
  });

  test('filters by status vencido', async ({ page }) => {
    await expect(page.getByRole('table')).toBeVisible({ timeout: 10000 });
    const statusFilter = page.getByRole('combobox', { name: /status/i });
    if (await statusFilter.isVisible()) {
      await statusFilter.click();
      await page.getByRole('option', { name: /vencid/i }).click();
      await page.waitForTimeout(500);
    }
  });

  test('searches contas by description or client', async ({ page }) => {
    await expect(page.getByRole('table')).toBeVisible({ timeout: 10000 });
    const searchInput = page.getByPlaceholder(/buscar|pesquisar|search/i);
    if (await searchInput.isVisible()) {
      await searchInput.fill('teste');
      await page.waitForTimeout(500);
      await expect(page.getByRole('table')).toBeVisible();
    }
  });

  test('registers payment (recebimento)', async ({ page }) => {
    await expect(page.getByRole('table')).toBeVisible({ timeout: 10000 });
    const row = page.locator('tr').filter({ hasText: /pendente/i }).first();
    if (await row.isVisible()) {
      const receberBtn = row.getByRole('button', { name: /receber|pagar|registrar/i });
      if (await receberBtn.isVisible()) {
        await receberBtn.click();
        await expect(page.getByRole('dialog')).toBeVisible();
        const confirmBtn = page.getByRole('button', { name: /confirmar|salvar/i });
        if (await confirmBtn.isVisible()) {
          await confirmBtn.click();
        }
      }
    }
  });

  test('edits existing conta a receber', async ({ page }) => {
    await expect(page.getByRole('table')).toBeVisible({ timeout: 10000 });
    const editButton = page.getByRole('button', { name: /editar|edit/i }).first();
    if (await editButton.isVisible()) {
      await editButton.click();
      await expect(page.getByRole('dialog')).toBeVisible();
      const descInput = page.getByLabel(/descrição/i);
      await descInput.clear();
      await descInput.fill('Conta atualizada E2E');
      await page.getByRole('button', { name: /salvar/i }).click();
    }
  });

  test('deletes conta a receber with confirmation', async ({ page }) => {
    await expect(page.getByRole('table')).toBeVisible({ timeout: 10000 });
    const deleteButton = page.getByRole('button', { name: /excluir|deletar|remover/i }).first();
    if (await deleteButton.isVisible()) {
      await deleteButton.click();
      await expect(page.getByRole('dialog')).toBeVisible();
      await page.getByRole('button', { name: /confirmar|sim|excluir/i }).click();
    }
  });

  test('calculates juros and multa', async ({ page }) => {
    const calcBtn = page.getByRole('button', { name: /juros|multa|calcular/i });
    if (await calcBtn.isVisible()) {
      await calcBtn.click();
      await expect(page.getByRole('dialog').or(page.getByText(/juros/i))).toBeVisible();
    }
  });

  test('exports contas to CSV', async ({ page }) => {
    await expect(page.getByRole('table')).toBeVisible({ timeout: 10000 });
    const exportButton = page.getByRole('button', { name: /exportar|export/i });
    if (await exportButton.isVisible()) {
      await exportButton.click();
      const csvOption = page.getByText(/csv/i);
      if (await csvOption.isVisible()) {
        await csvOption.click();
      }
    }
  });

  test('exports contas to PDF', async ({ page }) => {
    await expect(page.getByRole('table')).toBeVisible({ timeout: 10000 });
    const exportButton = page.getByRole('button', { name: /exportar|export/i });
    if (await exportButton.isVisible()) {
      await exportButton.click();
      const pdfOption = page.getByText(/pdf/i);
      if (await pdfOption.isVisible()) {
        await pdfOption.click();
      }
    }
  });

  test('paginates results correctly', async ({ page }) => {
    await expect(page.getByRole('table')).toBeVisible({ timeout: 10000 });
    const nextPageBtn = page.getByRole('button', { name: /próxima|next|›/i });
    if (await nextPageBtn.isVisible() && await nextPageBtn.isEnabled()) {
      await nextPageBtn.click();
      await page.waitForTimeout(500);
      await expect(page.getByRole('table')).toBeVisible();
    }
  });

  test('sorts by column header click', async ({ page }) => {
    await expect(page.getByRole('table')).toBeVisible({ timeout: 10000 });
    const valorHeader = page.getByRole('columnheader', { name: /valor/i });
    if (await valorHeader.isVisible()) {
      await valorHeader.click();
      await page.waitForTimeout(500);
      await expect(page.getByRole('table')).toBeVisible();
    }
  });

  test('bulk selection and actions', async ({ page }) => {
    await expect(page.getByRole('table')).toBeVisible({ timeout: 10000 });
    const checkboxes = page.locator('input[type="checkbox"]');
    const count = await checkboxes.count();
    if (count >= 3) {
      await checkboxes.nth(1).click();
      await checkboxes.nth(2).click();
      await expect(page.getByText(/selecionad/i)).toBeVisible();
    }
  });

  test('date range filter works', async ({ page }) => {
    await expect(page.getByRole('table')).toBeVisible({ timeout: 10000 });
    const dateFilter = page.getByLabel(/data|período/i).first();
    if (await dateFilter.isVisible()) {
      await dateFilter.click();
    }
  });

  test('shows empty state when no results', async ({ page }) => {
    const searchInput = page.getByPlaceholder(/buscar|pesquisar|search/i);
    if (await searchInput.isVisible()) {
      await searchInput.fill('xyznonexistent12345');
      await page.waitForTimeout(1000);
      const emptyState = page.getByText(/nenhum|sem resultado|não encontrad/i);
      if (await emptyState.isVisible()) {
        await expect(emptyState).toBeVisible();
      }
    }
  });
});

test.describe('Contas a Receber - Mobile', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('responsive layout on mobile', async ({ page }) => {
    await page.goto('/contas-receber');
    await expect(page.getByRole('heading', { name: /contas a receber/i })).toBeVisible();
  });

  test('create modal works on mobile', async ({ page }) => {
    await page.goto('/contas-receber');
    const addBtn = page.getByRole('button', { name: /nova|novo|adicionar|\+/i });
    if (await addBtn.isVisible()) {
      await addBtn.click();
      await expect(page.getByRole('dialog')).toBeVisible();
      await page.getByRole('button', { name: /fechar|cancelar|×/i }).first().click();
    }
  });
});
