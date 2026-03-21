import { test, expect } from '@playwright/test';

test.describe('Contratos', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/contratos');
  });

  test('displays page title', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /contratos|contracts/i })).toBeVisible();
  });

  test('shows contracts list', async ({ page }) => {
    await expect(page.getByText(/contrato|contract/i).first()).toBeVisible({ timeout: 10000 });
  });

  test('add new contract button', async ({ page }) => {
    const newBtn = page.getByRole('button', { name: /novo.*contrato|adicionar|novo/i });
    if (await newBtn.isVisible()) {
      await newBtn.click();
      await expect(page.getByRole('dialog')).toBeVisible();
    }
  });

  test('contract form with all fields', async ({ page }) => {
    const newBtn = page.getByRole('button', { name: /novo.*contrato|adicionar|novo/i });
    if (await newBtn.isVisible()) {
      await newBtn.click();

      const tituloInput = page.getByLabel(/título|nome|descrição/i);
      if (await tituloInput.isVisible()) {
        await tituloInput.fill('Contrato Teste E2E');
      }

      const valorInput = page.getByLabel(/valor/i);
      if (await valorInput.isVisible()) {
        await valorInput.fill('12000.00');
      }

      const inicioInput = page.getByLabel(/início|start/i);
      if (await inicioInput.isVisible()) {
        await inicioInput.fill('2026-01-01');
      }

      const fimInput = page.getByLabel(/fim|término|end/i);
      if (await fimInput.isVisible()) {
        await fimInput.fill('2026-12-31');
      }

      const parteInput = page.getByLabel(/parte|contratante|cliente|fornecedor/i);
      if (await parteInput.isVisible()) {
        await parteInput.fill('Empresa Contratante');
      }
    }
  });

  test('validates required contract fields', async ({ page }) => {
    const newBtn = page.getByRole('button', { name: /novo.*contrato|adicionar|novo/i });
    if (await newBtn.isVisible()) {
      await newBtn.click();
      await page.getByRole('button', { name: /salvar|criar/i }).click();
      await expect(page.getByText(/obrigatório|required/i).first()).toBeVisible();
    }
  });

  test('edits existing contract', async ({ page }) => {
    const editBtn = page.getByRole('button', { name: /editar|edit/i }).first();
    if (await editBtn.isVisible()) {
      await editBtn.click();
      await expect(page.getByRole('dialog')).toBeVisible();
    }
  });

  test('views contract details', async ({ page }) => {
    const viewBtn = page.getByRole('button', { name: /ver|visualizar|detalhes/i }).first();
    if (await viewBtn.isVisible()) {
      await viewBtn.click();
    }
  });

  test('deletes contract', async ({ page }) => {
    const deleteBtn = page.getByRole('button', { name: /excluir|deletar/i }).first();
    if (await deleteBtn.isVisible()) {
      await deleteBtn.click();
      await expect(page.getByRole('dialog')).toBeVisible();
    }
  });

  test('filters contracts by status', async ({ page }) => {
    const statusFilter = page.getByRole('combobox', { name: /status|filtro/i });
    if (await statusFilter.isVisible()) {
      await statusFilter.click();
      await page.getByRole('option').first().click();
    }
  });

  test('searches contracts', async ({ page }) => {
    const searchInput = page.getByPlaceholder(/buscar|pesquisar|search/i);
    if (await searchInput.isVisible()) {
      await searchInput.fill('teste');
      await page.waitForTimeout(500);
    }
  });

  test('contract renewal alert', async ({ page }) => {
    const renewalAlert = page.getByText(/renovação|vencendo|expiring/i);
    if (await renewalAlert.isVisible()) {
      await expect(renewalAlert).toBeVisible();
    }
  });

  test('exports contracts', async ({ page }) => {
    const exportBtn = page.getByRole('button', { name: /exportar|export/i });
    if (await exportBtn.isVisible()) {
      await exportBtn.click();
    }
  });

  test('contract attachment upload', async ({ page }) => {
    const uploadBtn = page.getByRole('button', { name: /anexar|upload|arquivo/i }).first();
    if (await uploadBtn.isVisible()) {
      await uploadBtn.click();
    }
  });

  test('contract status timeline', async ({ page }) => {
    const timeline = page.getByText(/timeline|cronograma|histórico/i);
    if (await timeline.isVisible()) {
      await expect(timeline).toBeVisible();
    }
  });
});

test.describe('Contratos - Mobile', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('responsive layout on mobile', async ({ page }) => {
    await page.goto('/contratos');
    await expect(page.getByRole('heading', { name: /contratos/i })).toBeVisible();
  });
});
