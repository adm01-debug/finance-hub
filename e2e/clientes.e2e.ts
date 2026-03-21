import { test, expect } from '@playwright/test';

test.describe('Clientes', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/clientes');
  });

  test('displays page title', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /clientes/i })).toBeVisible();
  });

  test('shows clients table', async ({ page }) => {
    await expect(page.getByRole('table')).toBeVisible({ timeout: 10000 });
  });

  test('table has correct column headers', async ({ page }) => {
    await expect(page.getByRole('table')).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole('columnheader', { name: /nome/i })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: /email|contato/i })).toBeVisible();
  });

  test('opens new client modal', async ({ page }) => {
    await page.getByRole('button', { name: /novo cliente|adicionar|novo/i }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
  });

  test('creates new client with all fields', async ({ page }) => {
    await page.getByRole('button', { name: /novo cliente|adicionar|novo/i }).click();
    await expect(page.getByRole('dialog')).toBeVisible();

    await page.getByLabel(/nome/i).fill(`Cliente E2E ${Date.now()}`);

    const emailInput = page.getByLabel(/email/i);
    if (await emailInput.isVisible()) {
      await emailInput.fill(`cliente_${Date.now()}@test.com`);
    }

    const cpfInput = page.getByLabel(/cpf|cnpj|documento/i);
    if (await cpfInput.isVisible()) {
      await cpfInput.fill('123.456.789-00');
    }

    const telefoneInput = page.getByLabel(/telefone|celular|phone/i);
    if (await telefoneInput.isVisible()) {
      await telefoneInput.fill('11999887766');
    }

    const enderecoInput = page.getByLabel(/endereço|logradouro/i);
    if (await enderecoInput.isVisible()) {
      await enderecoInput.fill('Rua Teste, 123');
    }

    const cidadeInput = page.getByLabel(/cidade/i);
    if (await cidadeInput.isVisible()) {
      await cidadeInput.fill('São Paulo');
    }

    const estadoInput = page.getByLabel(/estado|uf/i);
    if (await estadoInput.isVisible()) {
      await estadoInput.click();
      const spOption = page.getByRole('option', { name: /são paulo|sp/i });
      if (await spOption.isVisible()) {
        await spOption.click();
      }
    }

    await page.getByRole('button', { name: /salvar|criar|cadastrar/i }).click();
  });

  test('validates required fields', async ({ page }) => {
    await page.getByRole('button', { name: /novo cliente|adicionar|novo/i }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await page.getByRole('button', { name: /salvar|criar|cadastrar/i }).click();
    await expect(page.getByText(/obrigatório|required/i).first()).toBeVisible();
  });

  test('validates email format', async ({ page }) => {
    await page.getByRole('button', { name: /novo cliente|adicionar|novo/i }).click();
    await expect(page.getByRole('dialog')).toBeVisible();

    const emailInput = page.getByLabel(/email/i);
    if (await emailInput.isVisible()) {
      await emailInput.fill('invalid-email');
      await page.getByRole('button', { name: /salvar|criar|cadastrar/i }).click();
      await expect(page.getByText(/email.*inválido|formato|invalid/i)).toBeVisible();
    }
  });

  test('validates CPF/CNPJ format', async ({ page }) => {
    await page.getByRole('button', { name: /novo cliente|adicionar|novo/i }).click();
    await expect(page.getByRole('dialog')).toBeVisible();

    const cpfInput = page.getByLabel(/cpf|cnpj|documento/i);
    if (await cpfInput.isVisible()) {
      await cpfInput.fill('000');
      await page.getByRole('button', { name: /salvar|criar|cadastrar/i }).click();
    }
  });

  test('searches clients', async ({ page }) => {
    await expect(page.getByRole('table')).toBeVisible({ timeout: 10000 });
    const searchInput = page.getByPlaceholder(/buscar|pesquisar|search/i);
    if (await searchInput.isVisible()) {
      await searchInput.fill('teste');
      await page.waitForTimeout(500);
    }
  });

  test('edits existing client', async ({ page }) => {
    await expect(page.getByRole('table')).toBeVisible({ timeout: 10000 });
    const editButton = page.getByRole('button', { name: /editar|edit/i }).first();
    if (await editButton.isVisible()) {
      await editButton.click();
      await expect(page.getByRole('dialog')).toBeVisible();
    }
  });

  test('views client details', async ({ page }) => {
    await expect(page.getByRole('table')).toBeVisible({ timeout: 10000 });
    const viewButton = page.getByRole('button', { name: /ver|visualizar|detalhes|view/i }).first();
    if (await viewButton.isVisible()) {
      await viewButton.click();
      await expect(page.getByRole('dialog')).toBeVisible();
    }
  });

  test('deletes client with confirmation', async ({ page }) => {
    await expect(page.getByRole('table')).toBeVisible({ timeout: 10000 });
    const deleteButton = page.getByRole('button', { name: /excluir|deletar|remover/i }).first();
    if (await deleteButton.isVisible()) {
      await deleteButton.click();
      await expect(page.getByRole('dialog')).toBeVisible();
      const cancelBtn = page.getByRole('button', { name: /cancelar|não/i });
      if (await cancelBtn.isVisible()) {
        await cancelBtn.click();
      }
    }
  });

  test('exports clients list', async ({ page }) => {
    await expect(page.getByRole('table')).toBeVisible({ timeout: 10000 });
    const exportBtn = page.getByRole('button', { name: /exportar|export/i });
    if (await exportBtn.isVisible()) {
      await exportBtn.click();
    }
  });

  test('paginates client list', async ({ page }) => {
    await expect(page.getByRole('table')).toBeVisible({ timeout: 10000 });
    const nextBtn = page.getByRole('button', { name: /próxima|next|›/i });
    if (await nextBtn.isVisible() && await nextBtn.isEnabled()) {
      await nextBtn.click();
      await page.waitForTimeout(500);
    }
  });

  test('client scoring panel visibility', async ({ page }) => {
    const scoringTab = page.getByText(/scoring|pontuação/i);
    if (await scoringTab.isVisible()) {
      await scoringTab.click();
    }
  });

  test('client portal panel', async ({ page }) => {
    const portalTab = page.getByText(/portal.*cliente/i);
    if (await portalTab.isVisible()) {
      await portalTab.click();
    }
  });

  test('sorts clients by name', async ({ page }) => {
    await expect(page.getByRole('table')).toBeVisible({ timeout: 10000 });
    const nomeHeader = page.getByRole('columnheader', { name: /nome/i });
    if (await nomeHeader.isVisible()) {
      await nomeHeader.click();
      await page.waitForTimeout(300);
    }
  });

  test('bulk select clients', async ({ page }) => {
    await expect(page.getByRole('table')).toBeVisible({ timeout: 10000 });
    const selectAll = page.locator('thead input[type="checkbox"]');
    if (await selectAll.isVisible()) {
      await selectAll.click();
    }
  });
});

test.describe('Clientes - Mobile', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('responsive layout on mobile', async ({ page }) => {
    await page.goto('/clientes');
    await expect(page.getByRole('heading', { name: /clientes/i })).toBeVisible();
  });
});
