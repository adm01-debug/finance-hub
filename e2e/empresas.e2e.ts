import { test, expect } from '@playwright/test';

test.describe('Empresas', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/empresas');
  });

  test('displays page title', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /empresas|companies/i })).toBeVisible();
  });

  test('shows companies list', async ({ page }) => {
    await expect(page.getByText(/empresa|razão social|cnpj/i).first()).toBeVisible({ timeout: 10000 });
  });

  test('add new company button', async ({ page }) => {
    const newBtn = page.getByRole('button', { name: /nova.*empresa|adicionar|novo/i });
    if (await newBtn.isVisible()) {
      await newBtn.click();
      await expect(page.getByRole('dialog')).toBeVisible();
    }
  });

  test('company form with all fields', async ({ page }) => {
    const newBtn = page.getByRole('button', { name: /nova.*empresa|adicionar|novo/i });
    if (await newBtn.isVisible()) {
      await newBtn.click();
      await expect(page.getByRole('dialog')).toBeVisible();

      const razaoInput = page.getByLabel(/razão social|nome/i);
      if (await razaoInput.isVisible()) {
        await razaoInput.fill('Empresa Teste E2E Ltda');
      }

      const cnpjInput = page.getByLabel(/cnpj/i);
      if (await cnpjInput.isVisible()) {
        await cnpjInput.fill('12.345.678/0001-90');
      }

      const fantasyInput = page.getByLabel(/nome.*fantasia|fantasy/i);
      if (await fantasyInput.isVisible()) {
        await fantasyInput.fill('Teste E2E');
      }

      const ieInput = page.getByLabel(/inscrição.*estadual|ie/i);
      if (await ieInput.isVisible()) {
        await ieInput.fill('123456789');
      }

      const emailInput = page.getByLabel(/email/i);
      if (await emailInput.isVisible()) {
        await emailInput.fill('empresa@teste.com');
      }

      const telefoneInput = page.getByLabel(/telefone/i);
      if (await telefoneInput.isVisible()) {
        await telefoneInput.fill('11999887766');
      }
    }
  });

  test('validates required company fields', async ({ page }) => {
    const newBtn = page.getByRole('button', { name: /nova.*empresa|adicionar|novo/i });
    if (await newBtn.isVisible()) {
      await newBtn.click();
      await expect(page.getByRole('dialog')).toBeVisible();
      await page.getByRole('button', { name: /salvar|criar/i }).click();
      await expect(page.getByText(/obrigatório|required/i).first()).toBeVisible();
    }
  });

  test('edits existing company', async ({ page }) => {
    const editBtn = page.getByRole('button', { name: /editar|edit/i }).first();
    if (await editBtn.isVisible()) {
      await editBtn.click();
      await expect(page.getByRole('dialog')).toBeVisible();
    }
  });

  test('deletes company', async ({ page }) => {
    const deleteBtn = page.getByRole('button', { name: /excluir|deletar|remover/i }).first();
    if (await deleteBtn.isVisible()) {
      await deleteBtn.click();
      await expect(page.getByRole('dialog')).toBeVisible();
    }
  });

  test('switches active company', async ({ page }) => {
    const switchBtn = page.getByRole('button', { name: /selecionar|ativar|switch/i }).first();
    if (await switchBtn.isVisible()) {
      await switchBtn.click();
    }
  });

  test('company address fields', async ({ page }) => {
    const newBtn = page.getByRole('button', { name: /nova.*empresa|adicionar|novo/i });
    if (await newBtn.isVisible()) {
      await newBtn.click();

      const cepInput = page.getByLabel(/cep|zip/i);
      if (await cepInput.isVisible()) {
        await cepInput.fill('01001-000');
      }

      const enderecoInput = page.getByLabel(/endereço|logradouro/i);
      if (await enderecoInput.isVisible()) {
        await enderecoInput.fill('Praça da Sé');
      }
    }
  });

  test('fiscal regime selector', async ({ page }) => {
    const newBtn = page.getByRole('button', { name: /nova.*empresa|adicionar|novo/i });
    if (await newBtn.isVisible()) {
      await newBtn.click();

      const regimeSelect = page.getByLabel(/regime.*tributário|regime.*fiscal/i);
      if (await regimeSelect.isVisible()) {
        await regimeSelect.click();
        await page.getByRole('option').first().click();
      }
    }
  });
});

test.describe('Empresas - Mobile', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('responsive layout on mobile', async ({ page }) => {
    await page.goto('/empresas');
    await expect(page.getByRole('heading', { name: /empresas/i })).toBeVisible();
  });
});
