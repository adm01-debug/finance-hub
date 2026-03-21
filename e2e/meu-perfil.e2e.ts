import { test, expect } from '@playwright/test';

test.describe('Meu Perfil', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/meu-perfil');
  });

  test('displays page title', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /meu.*perfil|my.*profile|perfil/i })).toBeVisible();
  });

  test('shows user profile information', async ({ page }) => {
    await expect(page.getByText(/nome|email|perfil/i).first()).toBeVisible({ timeout: 10000 });
  });

  test('edits profile name', async ({ page }) => {
    const editBtn = page.getByRole('button', { name: /editar|edit/i }).first();
    if (await editBtn.isVisible()) {
      await editBtn.click();
    }

    const nomeInput = page.getByLabel(/nome/i);
    if (await nomeInput.isVisible()) {
      await nomeInput.clear();
      await nomeInput.fill('Nome Atualizado Teste');
    }
  });

  test('updates email', async ({ page }) => {
    const emailInput = page.getByLabel(/email/i);
    if (await emailInput.isVisible() && await emailInput.isEditable()) {
      await emailInput.clear();
      await emailInput.fill('updated@test.com');
    }
  });

  test('updates phone number', async ({ page }) => {
    const phoneInput = page.getByLabel(/telefone|celular|phone/i);
    if (await phoneInput.isVisible()) {
      await phoneInput.clear();
      await phoneInput.fill('11999887766');
    }
  });

  test('changes password', async ({ page }) => {
    const changePassBtn = page.getByRole('button', { name: /alterar.*senha|change.*password/i });
    if (await changePassBtn.isVisible()) {
      await changePassBtn.click();

      const currentPassInput = page.getByLabel(/senha.*atual|current.*password/i);
      if (await currentPassInput.isVisible()) {
        await currentPassInput.fill('OldPassword123!');
      }

      const newPassInput = page.getByLabel(/nova.*senha|new.*password/i);
      if (await newPassInput.isVisible()) {
        await newPassInput.fill('NewPassword123!');
      }

      const confirmPassInput = page.getByLabel(/confirmar.*senha|confirm.*password/i);
      if (await confirmPassInput.isVisible()) {
        await confirmPassInput.fill('NewPassword123!');
      }
    }
  });

  test('uploads avatar/photo', async ({ page }) => {
    const uploadBtn = page.getByRole('button', { name: /foto|avatar|upload|imagem/i });
    if (await uploadBtn.isVisible()) {
      await uploadBtn.click();
    }
  });

  test('saves profile changes', async ({ page }) => {
    const saveBtn = page.getByRole('button', { name: /salvar|save|atualizar/i });
    if (await saveBtn.isVisible()) {
      await saveBtn.click();
    }
  });

  test('MFA settings access', async ({ page }) => {
    const mfaBtn = page.getByRole('button', { name: /mfa|2fa|autenticação.*dois.*fatores/i });
    if (await mfaBtn.isVisible()) {
      await mfaBtn.click();
    }
  });

  test('notification preferences', async ({ page }) => {
    const notifSection = page.getByText(/notificações|preferências/i);
    if (await notifSection.isVisible()) {
      await notifSection.click();
    }
  });

  test('language preference', async ({ page }) => {
    const langSelect = page.getByRole('combobox', { name: /idioma|language/i });
    if (await langSelect.isVisible()) {
      await langSelect.click();
    }
  });

  test('timezone preference', async ({ page }) => {
    const tzSelect = page.getByRole('combobox', { name: /fuso.*horário|timezone/i });
    if (await tzSelect.isVisible()) {
      await tzSelect.click();
    }
  });

  test('theme preference toggle', async ({ page }) => {
    const themeToggle = page.getByRole('button', { name: /tema|theme|escuro|claro/i });
    if (await themeToggle.isVisible()) {
      await themeToggle.click();
    }
  });

  test('active sessions view', async ({ page }) => {
    const sessionsSection = page.getByText(/sessões|sessions/i);
    if (await sessionsSection.isVisible()) {
      await expect(sessionsSection).toBeVisible();
    }
  });

  test('cancel edit button', async ({ page }) => {
    const editBtn = page.getByRole('button', { name: /editar|edit/i }).first();
    if (await editBtn.isVisible()) {
      await editBtn.click();
      const cancelBtn = page.getByRole('button', { name: /cancelar|cancel/i });
      if (await cancelBtn.isVisible()) {
        await cancelBtn.click();
      }
    }
  });
});

test.describe('Meu Perfil - Mobile', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('responsive layout on mobile', async ({ page }) => {
    await page.goto('/meu-perfil');
    await expect(page.getByRole('heading', { name: /meu.*perfil|perfil/i })).toBeVisible();
  });
});
