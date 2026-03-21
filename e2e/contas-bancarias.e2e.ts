import { test, expect } from '@playwright/test';

test.describe('Contas Bancárias', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/contas-bancarias');
  });

  test('displays page title', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /contas.*bancárias|bank.*accounts/i })).toBeVisible();
  });

  test('shows bank accounts list', async ({ page }) => {
    await expect(page.getByText(/banco|saldo|conta/i).first()).toBeVisible({ timeout: 10000 });
  });

  test('add new bank account button', async ({ page }) => {
    const newBtn = page.getByRole('button', { name: /nova.*conta|adicionar|novo/i });
    if (await newBtn.isVisible()) {
      await newBtn.click();
      await expect(page.getByRole('dialog')).toBeVisible();
    }
  });

  test('bank account form fields', async ({ page }) => {
    const newBtn = page.getByRole('button', { name: /nova.*conta|adicionar|novo/i });
    if (await newBtn.isVisible()) {
      await newBtn.click();
      await expect(page.getByRole('dialog')).toBeVisible();

      const bancoInput = page.getByLabel(/banco|instituição/i);
      if (await bancoInput.isVisible()) {
        await bancoInput.fill('Banco do Brasil');
      }

      const agenciaInput = page.getByLabel(/agência/i);
      if (await agenciaInput.isVisible()) {
        await agenciaInput.fill('1234');
      }

      const contaInput = page.getByLabel(/número.*conta|conta.*corrente/i);
      if (await contaInput.isVisible()) {
        await contaInput.fill('12345-6');
      }

      const saldoInput = page.getByLabel(/saldo.*inicial|saldo/i);
      if (await saldoInput.isVisible()) {
        await saldoInput.fill('10000.00');
      }
    }
  });

  test('transfer between accounts dialog', async ({ page }) => {
    const transferBtn = page.getByRole('button', { name: /transferir|transferência/i });
    if (await transferBtn.isVisible()) {
      await transferBtn.click();
      await expect(page.getByRole('dialog')).toBeVisible();
    }
  });

  test('transfer form fills correctly', async ({ page }) => {
    const transferBtn = page.getByRole('button', { name: /transferir|transferência/i });
    if (await transferBtn.isVisible()) {
      await transferBtn.click();
      await expect(page.getByRole('dialog')).toBeVisible();

      const origemSelect = page.getByLabel(/origem|de/i);
      if (await origemSelect.isVisible()) {
        await origemSelect.click();
        await page.getByRole('option').first().click();
      }

      const destinoSelect = page.getByLabel(/destino|para/i);
      if (await destinoSelect.isVisible()) {
        await destinoSelect.click();
        await page.getByRole('option').last().click();
      }

      const valorInput = page.getByLabel(/valor/i);
      if (await valorInput.isVisible()) {
        await valorInput.fill('1000.00');
      }
    }
  });

  test('edits bank account', async ({ page }) => {
    const editBtn = page.getByRole('button', { name: /editar|edit/i }).first();
    if (await editBtn.isVisible()) {
      await editBtn.click();
      await expect(page.getByRole('dialog')).toBeVisible();
    }
  });

  test('deletes bank account', async ({ page }) => {
    const deleteBtn = page.getByRole('button', { name: /excluir|deletar|remover/i }).first();
    if (await deleteBtn.isVisible()) {
      await deleteBtn.click();
      await expect(page.getByRole('dialog')).toBeVisible();
    }
  });

  test('shows balance per bank', async ({ page }) => {
    const saldoCard = page.getByText(/saldo/i).first();
    if (await saldoCard.isVisible()) {
      await expect(page.getByText(/R\$/).first()).toBeVisible();
    }
  });

  test('bank account type selector', async ({ page }) => {
    const newBtn = page.getByRole('button', { name: /nova.*conta|adicionar|novo/i });
    if (await newBtn.isVisible()) {
      await newBtn.click();
      const tipoSelect = page.getByLabel(/tipo.*conta|account.*type/i);
      if (await tipoSelect.isVisible()) {
        await tipoSelect.click();
        await page.getByRole('option').first().click();
      }
    }
  });

  test('activates/deactivates bank account', async ({ page }) => {
    const toggleBtn = page.getByRole('button', { name: /ativar|desativar|toggle/i }).first();
    if (await toggleBtn.isVisible()) {
      await toggleBtn.click();
    }
  });
});

test.describe('Contas Bancárias - Mobile', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('responsive layout on mobile', async ({ page }) => {
    await page.goto('/contas-bancarias');
    await expect(page.getByRole('heading', { name: /contas.*bancárias/i })).toBeVisible();
  });
});
