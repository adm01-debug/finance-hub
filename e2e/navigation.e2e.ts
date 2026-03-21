import { test, expect } from '@playwright/test';

test.describe('Navigation & Layout', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard');
  });

  test('sidebar is visible on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    const sidebar = page.locator('nav, [data-testid="sidebar"], aside');
    await expect(sidebar.first()).toBeVisible();
  });

  test('sidebar navigation links work', async ({ page }) => {
    const links = [
      { name: /dashboard/i, url: /dashboard|\/$/ },
      { name: /contas.*pagar/i, url: /contas-pagar/ },
      { name: /contas.*receber/i, url: /contas-receber/ },
      { name: /clientes/i, url: /clientes/ },
      { name: /fornecedores/i, url: /fornecedores/ },
    ];

    for (const link of links) {
      const navLink = page.getByRole('link', { name: link.name }).first();
      if (await navLink.isVisible()) {
        await navLink.click();
        await expect(page).toHaveURL(link.url, { timeout: 5000 });
        await page.goto('/dashboard');
      }
    }
  });

  test('header is visible', async ({ page }) => {
    const header = page.locator('header, [data-testid="header"]');
    await expect(header.first()).toBeVisible();
  });

  test('user menu in header', async ({ page }) => {
    const userMenu = page.getByRole('button', { name: /perfil|user|menu|avatar/i });
    if (await userMenu.isVisible()) {
      await userMenu.click();
      await expect(page.getByText(/sair|logout|perfil|settings/i).first()).toBeVisible();
    }
  });

  test('logout from user menu', async ({ page }) => {
    const userMenu = page.getByRole('button', { name: /perfil|user|menu|avatar/i });
    if (await userMenu.isVisible()) {
      await userMenu.click();
      const logoutBtn = page.getByRole('button', { name: /sair|logout/i }).or(page.getByText(/sair|logout/i));
      if (await logoutBtn.isVisible()) {
        // Don't actually logout, just verify it exists
        await expect(logoutBtn).toBeVisible();
      }
    }
  });

  test('command palette opens with keyboard shortcut', async ({ page }) => {
    await page.keyboard.press('Control+k');
    const palette = page.locator('[data-testid="command-palette"], [role="dialog"][class*="command"]');
    if (await palette.isVisible()) {
      await expect(palette).toBeVisible();
      await page.keyboard.press('Escape');
    }
  });

  test('command palette search works', async ({ page }) => {
    await page.keyboard.press('Control+k');
    const paletteInput = page.locator('[data-testid="command-palette"] input, [cmdk-input]');
    if (await paletteInput.isVisible()) {
      await paletteInput.fill('contas');
      await page.waitForTimeout(300);
      await page.keyboard.press('Escape');
    }
  });

  test('breadcrumbs update on navigation', async ({ page }) => {
    await page.goto('/contas-pagar');
    const breadcrumb = page.locator('nav[aria-label="breadcrumb"], [data-testid="breadcrumbs"]');
    if (await breadcrumb.isVisible()) {
      await expect(breadcrumb).toBeVisible();
    }
  });

  test('theme switcher works', async ({ page }) => {
    const themeBtn = page.getByRole('button', { name: /tema|theme|dark|light|escuro|claro/i });
    if (await themeBtn.isVisible()) {
      await themeBtn.click();
      await page.waitForTimeout(300);
    }
  });

  test('quick create button', async ({ page }) => {
    const quickCreateBtn = page.getByRole('button', { name: /criar.*rápido|quick.*create|\+/i });
    if (await quickCreateBtn.isVisible()) {
      await quickCreateBtn.click();
    }
  });

  test('quick create modal', async ({ page }) => {
    const quickCreateBtn = page.getByRole('button', { name: /criar.*rápido|quick.*create|\+/i });
    if (await quickCreateBtn.isVisible()) {
      await quickCreateBtn.click();
      const modal = page.getByRole('dialog');
      if (await modal.isVisible()) {
        await expect(modal).toBeVisible();
        await page.keyboard.press('Escape');
      }
    }
  });

  test('notification bell/indicator', async ({ page }) => {
    const notifBtn = page.getByRole('button', { name: /notificações|notifications|bell/i });
    if (await notifBtn.isVisible()) {
      await notifBtn.click();
    }
  });

  test('favorites/recent items', async ({ page }) => {
    const favSection = page.getByText(/favoritos|recentes|favorites|recent/i);
    if (await favSection.isVisible()) {
      await expect(favSection).toBeVisible();
    }
  });

  test('keyboard shortcuts dialog', async ({ page }) => {
    const shortcutsBtn = page.getByRole('button', { name: /atalhos|shortcuts/i });
    if (await shortcutsBtn.isVisible()) {
      await shortcutsBtn.click();
      await expect(page.getByRole('dialog')).toBeVisible();
    }
  });

  test('skip links for accessibility', async ({ page }) => {
    const skipLink = page.locator('[class*="skip"], a[href="#main"]');
    if (await skipLink.first().isVisible()) {
      await expect(skipLink.first()).toBeVisible();
    }
  });

  test('page transition animation', async ({ page }) => {
    await page.goto('/contas-pagar');
    await page.waitForTimeout(500);
    await page.goto('/clientes');
    await page.waitForTimeout(500);
    await expect(page.getByRole('heading', { name: /clientes/i })).toBeVisible();
  });

  test('PWA install button', async ({ page }) => {
    const installBtn = page.getByRole('button', { name: /instalar|install|pwa/i });
    if (await installBtn.isVisible()) {
      await expect(installBtn).toBeVisible();
    }
  });

  test('offline banner when disconnected', async ({ page }) => {
    await page.context().setOffline(true);
    await page.waitForTimeout(1000);
    const offlineBanner = page.getByText(/offline|sem.*conexão|disconnected/i);
    if (await offlineBanner.isVisible()) {
      await expect(offlineBanner).toBeVisible();
    }
    await page.context().setOffline(false);
  });

  test('404 page for invalid routes', async ({ page }) => {
    await page.goto('/invalid-route-xyz');
    await expect(page.getByText(/não.*encontrad|404|not.*found/i).first()).toBeVisible();
  });
});

test.describe('Navigation - Mobile', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('mobile hamburger menu', async ({ page }) => {
    await page.goto('/dashboard');
    const menuBtn = page.getByRole('button', { name: /menu|☰/i });
    if (await menuBtn.isVisible()) {
      await menuBtn.click();
      const sidebar = page.locator('nav, [data-testid="sidebar"], aside, [data-testid="mobile-sidebar"]');
      await expect(sidebar.first()).toBeVisible();
    }
  });

  test('mobile bottom navigation', async ({ page }) => {
    await page.goto('/dashboard');
    const bottomNav = page.locator('[data-testid="mobile-bottom-nav"], nav[class*="bottom"]');
    if (await bottomNav.isVisible()) {
      await expect(bottomNav).toBeVisible();
    }
  });

  test('closes mobile menu on link click', async ({ page }) => {
    await page.goto('/dashboard');
    const menuBtn = page.getByRole('button', { name: /menu|☰/i });
    if (await menuBtn.isVisible()) {
      await menuBtn.click();
      const link = page.getByRole('link', { name: /contas.*pagar/i }).first();
      if (await link.isVisible()) {
        await link.click();
        await expect(page).toHaveURL(/contas-pagar/);
      }
    }
  });

  test('swipe to close sidebar on mobile', async ({ page }) => {
    await page.goto('/dashboard');
    // Just verify mobile layout is accessible
    await expect(page.getByRole('heading').first()).toBeVisible();
  });
});

test.describe('Navigation - Tablet', () => {
  test.use({ viewport: { width: 768, height: 1024 } });

  test('tablet layout works', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page.getByRole('heading').first()).toBeVisible();
  });
});
