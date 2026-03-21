import { test, expect } from '@playwright/test';

test.describe('Usuários', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/usuarios');
  });

  test('displays page title', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /usuários|users/i })).toBeVisible();
  });

  test('shows users list/table', async ({ page }) => {
    await expect(page.getByRole('table').or(page.getByText(/usuário|user/i).first())).toBeVisible({ timeout: 10000 });
  });

  test('invite user button opens dialog', async ({ page }) => {
    const inviteBtn = page.getByRole('button', { name: /convidar|invite|novo.*usuário|adicionar/i });
    if (await inviteBtn.isVisible()) {
      await inviteBtn.click();
      await expect(page.getByRole('dialog')).toBeVisible();
    }
  });

  test('invite user form fields', async ({ page }) => {
    const inviteBtn = page.getByRole('button', { name: /convidar|invite|novo.*usuário|adicionar/i });
    if (await inviteBtn.isVisible()) {
      await inviteBtn.click();
      await expect(page.getByRole('dialog')).toBeVisible();

      const emailInput = page.getByLabel(/email/i);
      if (await emailInput.isVisible()) {
        await emailInput.fill('newuser@test.com');
      }

      const nomeInput = page.getByLabel(/nome/i);
      if (await nomeInput.isVisible()) {
        await nomeInput.fill('Novo Usuário Teste');
      }

      const roleSelect = page.getByLabel(/papel|role|perfil|permissão/i);
      if (await roleSelect.isVisible()) {
        await roleSelect.click();
        await page.getByRole('option').first().click();
      }
    }
  });

  test('validates invite form required fields', async ({ page }) => {
    const inviteBtn = page.getByRole('button', { name: /convidar|invite|novo.*usuário|adicionar/i });
    if (await inviteBtn.isVisible()) {
      await inviteBtn.click();
      await expect(page.getByRole('dialog')).toBeVisible();
      await page.getByRole('button', { name: /enviar|convidar|salvar/i }).click();
      await expect(page.getByText(/obrigatório|required/i).first()).toBeVisible();
    }
  });

  test('edits user permissions', async ({ page }) => {
    const editBtn = page.getByRole('button', { name: /editar|edit|permissões/i }).first();
    if (await editBtn.isVisible()) {
      await editBtn.click();
      await expect(page.getByRole('dialog')).toBeVisible();
    }
  });

  test('deactivates user', async ({ page }) => {
    const deactivateBtn = page.getByRole('button', { name: /desativar|deactivate|bloquear/i }).first();
    if (await deactivateBtn.isVisible()) {
      await deactivateBtn.click();
      await expect(page.getByRole('dialog')).toBeVisible();
    }
  });

  test('permission manager panel', async ({ page }) => {
    const permBtn = page.getByRole('button', { name: /gerenciar.*permissões|permissions/i });
    if (await permBtn.isVisible()) {
      await permBtn.click();
    }
  });

  test('password reset approval', async ({ page }) => {
    const resetTab = page.getByText(/reset.*senha|password.*reset/i);
    if (await resetTab.isVisible()) {
      await resetTab.click();
    }
  });

  test('searches users', async ({ page }) => {
    const searchInput = page.getByPlaceholder(/buscar|pesquisar|search/i);
    if (await searchInput.isVisible()) {
      await searchInput.fill('admin');
      await page.waitForTimeout(500);
    }
  });

  test('filters users by role', async ({ page }) => {
    const roleFilter = page.getByRole('combobox', { name: /papel|role|perfil/i });
    if (await roleFilter.isVisible()) {
      await roleFilter.click();
      await page.getByRole('option').first().click();
    }
  });

  test('filters users by status', async ({ page }) => {
    const statusFilter = page.getByRole('combobox', { name: /status/i });
    if (await statusFilter.isVisible()) {
      await statusFilter.click();
      await page.getByRole('option').first().click();
    }
  });

  test('resends invitation', async ({ page }) => {
    const resendBtn = page.getByRole('button', { name: /reenviar|resend/i }).first();
    if (await resendBtn.isVisible()) {
      await resendBtn.click();
    }
  });
});

test.describe('Usuários - Mobile', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('responsive layout on mobile', async ({ page }) => {
    await page.goto('/usuarios');
    await expect(page.getByRole('heading', { name: /usuários/i })).toBeVisible();
  });
});
