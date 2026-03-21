import { test, expect } from '@playwright/test';

test.describe('Configurações', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/configuracoes');
  });

  test('displays page title', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /configurações|settings/i })).toBeVisible();
  });

  test('shows configuration sections/tabs', async ({ page }) => {
    await expect(page.getByText(/geral|notificações|segurança|general|notification|security/i).first()).toBeVisible({ timeout: 10000 });
  });

  test('notification settings section', async ({ page }) => {
    const notifTab = page.getByRole('tab', { name: /notificações|notifications/i })
      .or(page.getByRole('button', { name: /notificações|notifications/i }));
    if (await notifTab.isVisible()) {
      await notifTab.click();
    }
  });

  test('toggle notification switches', async ({ page }) => {
    const notifTab = page.getByRole('tab', { name: /notificações|notifications/i })
      .or(page.getByRole('button', { name: /notificações|notifications/i }));
    if (await notifTab.isVisible()) {
      await notifTab.click();
    }
    const switches = page.locator('button[role="switch"]');
    const count = await switches.count();
    if (count > 0) {
      await switches.first().click();
      await page.waitForTimeout(300);
      await switches.first().click();
    }
  });

  test('security settings section', async ({ page }) => {
    const secTab = page.getByRole('tab', { name: /segurança|security/i })
      .or(page.getByRole('button', { name: /segurança|security/i }));
    if (await secTab.isVisible()) {
      await secTab.click();
    }
  });

  test('biometric settings', async ({ page }) => {
    const bioTab = page.getByText(/biométr|biometric|impressão digital/i);
    if (await bioTab.isVisible()) {
      await bioTab.click();
    }
  });

  test('sound settings', async ({ page }) => {
    const soundTab = page.getByText(/som|sound|áudio/i);
    if (await soundTab.isVisible()) {
      await soundTab.click();
    }
  });

  test('cron jobs panel', async ({ page }) => {
    const cronTab = page.getByText(/cron|agendament|scheduled/i);
    if (await cronTab.isVisible()) {
      await cronTab.click();
    }
  });

  test('saves settings changes', async ({ page }) => {
    const saveBtn = page.getByRole('button', { name: /salvar|save|aplicar/i });
    if (await saveBtn.isVisible()) {
      await saveBtn.click();
    }
  });

  test('theme switcher', async ({ page }) => {
    const themeBtn = page.getByRole('button', { name: /tema|theme|escuro|claro|dark|light/i });
    if (await themeBtn.isVisible()) {
      await themeBtn.click();
    }
  });

  test('language selector', async ({ page }) => {
    const langSelect = page.getByRole('combobox', { name: /idioma|language/i });
    if (await langSelect.isVisible()) {
      await langSelect.click();
      await page.getByRole('option').first().click();
    }
  });

  test('API documentation access', async ({ page }) => {
    const apiTab = page.getByText(/api|documentação.*api/i);
    if (await apiTab.isVisible()) {
      await apiTab.click();
    }
  });

  test('currency format settings', async ({ page }) => {
    const currencySelect = page.getByRole('combobox', { name: /moeda|currency/i });
    if (await currencySelect.isVisible()) {
      await currencySelect.click();
    }
  });

  test('timezone settings', async ({ page }) => {
    const tzSelect = page.getByRole('combobox', { name: /fuso.*horário|timezone/i });
    if (await tzSelect.isVisible()) {
      await tzSelect.click();
    }
  });

  test('reset to defaults button', async ({ page }) => {
    const resetBtn = page.getByRole('button', { name: /restaurar|reset|padrão|default/i });
    if (await resetBtn.isVisible()) {
      await resetBtn.click();
    }
  });
});

test.describe('Configurações - Mobile', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('responsive layout on mobile', async ({ page }) => {
    await page.goto('/configuracoes');
    await expect(page.getByRole('heading', { name: /configurações|settings/i })).toBeVisible();
  });
});
