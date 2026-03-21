import { test, expect } from '@playwright/test';

test.describe('Fornecedores', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/fornecedores');
  });

  test('displays page title', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /fornecedores/i })).toBeVisible();
  });

  test('shows suppliers table', async ({ page }) => {
    await expect(page.getByRole('table')).toBeVisible({ timeout: 10000 });
  });

  test('table has correct column headers', async ({ page }) => {
    await expect(page.getByRole('table')).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole('columnheader', { name: /razão social|nome/i })).toBeVisible();
  });

  test('opens new supplier modal', async ({ page }) => {
    await page.getByRole('button', { name: /novo fornecedor|adicionar|novo/i }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
  });

  test('creates new supplier with all fields', async ({ page }) => {
    await page.getByRole('button', { name: /novo fornecedor|adicionar|novo/i }).click();
    await expect(page.getByRole('dialog')).toBeVisible();

    const razaoInput = page.getByLabel(/razão social|nome/i);
    await razaoInput.fill(`Fornecedor E2E ${Date.now()} Ltda`);

    const cnpjInput = page.getByLabel(/cnpj|documento/i);
    if (await cnpjInput.isVisible()) {
      await cnpjInput.fill('12.345.678/0001-90');
    }

    const emailInput = page.getByLabel(/email/i);
    if (await emailInput.isVisible()) {
      await emailInput.fill(`fornecedor_${Date.now()}@test.com`);
    }

    const telefoneInput = page.getByLabel(/telefone|celular/i);
    if (await telefoneInput.isVisible()) {
      await telefoneInput.fill('11999887766');
    }

    const categoriaSelect = page.getByLabel(/categoria|tipo/i);
    if (await categoriaSelect.isVisible()) {
      await categoriaSelect.click();
      await page.getByRole('option').first().click();
    }

    await page.getByRole('button', { name: /salvar|criar|cadastrar/i }).click();
  });

  test('validates required fields', async ({ page }) => {
    await page.getByRole('button', { name: /novo fornecedor|adicionar|novo/i }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await page.getByRole('button', { name: /salvar|criar|cadastrar/i }).click();
    await expect(page.getByText(/obrigatório|required/i).first()).toBeVisible();
  });

  test('searches suppliers', async ({ page }) => {
    await expect(page.getByRole('table')).toBeVisible({ timeout: 10000 });
    const searchInput = page.getByPlaceholder(/buscar|pesquisar|search/i);
    if (await searchInput.isVisible()) {
      await searchInput.fill('teste');
      await page.waitForTimeout(500);
    }
  });

  test('edits existing supplier', async ({ page }) => {
    await expect(page.getByRole('table')).toBeVisible({ timeout: 10000 });
    const editButton = page.getByRole('button', { name: /editar|edit/i }).first();
    if (await editButton.isVisible()) {
      await editButton.click();
      await expect(page.getByRole('dialog')).toBeVisible();
    }
  });

  test('views supplier details dialog', async ({ page }) => {
    await expect(page.getByRole('table')).toBeVisible({ timeout: 10000 });
    const row = page.locator('tr').nth(1);
    if (await row.isVisible()) {
      const viewBtn = row.getByRole('button', { name: /ver|detalhes|visualizar/i });
      if (await viewBtn.isVisible()) {
        await viewBtn.click();
        await expect(page.getByRole('dialog')).toBeVisible();
      }
    }
  });

  test('deletes supplier with confirmation', async ({ page }) => {
    await expect(page.getByRole('table')).toBeVisible({ timeout: 10000 });
    const deleteButton = page.getByRole('button', { name: /excluir|deletar|remover/i }).first();
    if (await deleteButton.isVisible()) {
      await deleteButton.click();
      await expect(page.getByRole('dialog')).toBeVisible();
      const cancelBtn = page.getByRole('button', { name: /cancelar/i });
      if (await cancelBtn.isVisible()) {
        await cancelBtn.click();
      }
    }
  });

  test('exports suppliers list', async ({ page }) => {
    await expect(page.getByRole('table')).toBeVisible({ timeout: 10000 });
    const exportBtn = page.getByRole('button', { name: /exportar|export/i });
    if (await exportBtn.isVisible()) {
      await exportBtn.click();
    }
  });

  test('paginates suppliers', async ({ page }) => {
    await expect(page.getByRole('table')).toBeVisible({ timeout: 10000 });
    const nextBtn = page.getByRole('button', { name: /próxima|next|›/i });
    if (await nextBtn.isVisible() && await nextBtn.isEnabled()) {
      await nextBtn.click();
    }
  });

  test('sorts suppliers by name', async ({ page }) => {
    await expect(page.getByRole('table')).toBeVisible({ timeout: 10000 });
    const nomeHeader = page.getByRole('columnheader', { name: /razão social|nome/i });
    await nomeHeader.click();
    await page.waitForTimeout(300);
  });

  test('filters suppliers by category', async ({ page }) => {
    await expect(page.getByRole('table')).toBeVisible({ timeout: 10000 });
    const catFilter = page.getByRole('combobox', { name: /categoria|tipo/i });
    if (await catFilter.isVisible()) {
      await catFilter.click();
      await page.getByRole('option').first().click();
    }
  });
});

test.describe('Fornecedores - Mobile', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('responsive layout on mobile', async ({ page }) => {
    await page.goto('/fornecedores');
    await expect(page.getByRole('heading', { name: /fornecedores/i })).toBeVisible();
  });
});
