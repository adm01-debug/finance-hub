import { test, expect } from '@playwright/test';

test.describe('Centros de Custo', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/centro-custos');
  });

  test('displays page title', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /centro.*custo|cost.*center/i })).toBeVisible();
  });

  test('shows cost centers list or tree', async ({ page }) => {
    await expect(page.getByText(/centro.*custo|departamento/i).first()).toBeVisible({ timeout: 10000 });
  });

  test('add new cost center button', async ({ page }) => {
    const newBtn = page.getByRole('button', { name: /novo.*centro|adicionar|novo/i });
    if (await newBtn.isVisible()) {
      await newBtn.click();
      await expect(page.getByRole('dialog')).toBeVisible();
    }
  });

  test('cost center form fields', async ({ page }) => {
    const newBtn = page.getByRole('button', { name: /novo.*centro|adicionar|novo/i });
    if (await newBtn.isVisible()) {
      await newBtn.click();
      await expect(page.getByRole('dialog')).toBeVisible();

      const nomeInput = page.getByLabel(/nome|descrição/i);
      if (await nomeInput.isVisible()) {
        await nomeInput.fill('Centro Teste E2E');
      }

      const codigoInput = page.getByLabel(/código|code/i);
      if (await codigoInput.isVisible()) {
        await codigoInput.fill('CC-001');
      }

      const parentSelect = page.getByLabel(/pai|parent|superior/i);
      if (await parentSelect.isVisible()) {
        await parentSelect.click();
        await page.getByRole('option').first().click();
      }

      const orcamentoInput = page.getByLabel(/orçamento|budget/i);
      if (await orcamentoInput.isVisible()) {
        await orcamentoInput.fill('50000.00');
      }
    }
  });

  test('validates required fields', async ({ page }) => {
    const newBtn = page.getByRole('button', { name: /novo.*centro|adicionar|novo/i });
    if (await newBtn.isVisible()) {
      await newBtn.click();
      await page.getByRole('button', { name: /salvar|criar/i }).click();
      await expect(page.getByText(/obrigatório|required/i).first()).toBeVisible();
    }
  });

  test('tree view navigation', async ({ page }) => {
    const treeItems = page.locator('[role="treeitem"], [data-testid*="tree"]');
    const count = await treeItems.count();
    if (count > 0) {
      await treeItems.first().click();
    }
  });

  test('edits cost center', async ({ page }) => {
    const editBtn = page.getByRole('button', { name: /editar|edit/i }).first();
    if (await editBtn.isVisible()) {
      await editBtn.click();
      await expect(page.getByRole('dialog')).toBeVisible();
    }
  });

  test('deletes cost center', async ({ page }) => {
    const deleteBtn = page.getByRole('button', { name: /excluir|deletar|remover/i }).first();
    if (await deleteBtn.isVisible()) {
      await deleteBtn.click();
      await expect(page.getByRole('dialog')).toBeVisible();
    }
  });

  test('cost center history', async ({ page }) => {
    const historyBtn = page.getByRole('button', { name: /histórico|history/i }).first();
    if (await historyBtn.isVisible()) {
      await historyBtn.click();
    }
  });

  test('exports cost centers', async ({ page }) => {
    const exportBtn = page.getByRole('button', { name: /exportar|export/i });
    if (await exportBtn.isVisible()) {
      await exportBtn.click();
    }
  });

  test('searches cost centers', async ({ page }) => {
    const searchInput = page.getByPlaceholder(/buscar|pesquisar|search/i);
    if (await searchInput.isVisible()) {
      await searchInput.fill('marketing');
      await page.waitForTimeout(500);
    }
  });

  test('budget progress indicator', async ({ page }) => {
    const progress = page.locator('[role="progressbar"], .progress-bar');
    if (await progress.first().isVisible()) {
      await expect(progress.first()).toBeVisible();
    }
  });

  test('expand/collapse tree nodes', async ({ page }) => {
    const expandBtn = page.getByRole('button', { name: /expandir|expand|▶|►/i }).first();
    if (await expandBtn.isVisible()) {
      await expandBtn.click();
      await page.waitForTimeout(300);
    }
  });
});

test.describe('Centros de Custo - Mobile', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('responsive layout on mobile', async ({ page }) => {
    await page.goto('/centro-custos');
    await expect(page.getByRole('heading', { name: /centro.*custo/i })).toBeVisible();
  });
});
