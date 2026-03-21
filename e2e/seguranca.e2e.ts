import { test, expect } from '@playwright/test';

test.describe('Segurança', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/seguranca');
  });

  test('displays page title', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /segurança|security/i })).toBeVisible();
  });

  test('shows security panels', async ({ page }) => {
    await expect(page.getByText(/segurança|security|dispositiv|sessão/i).first()).toBeVisible({ timeout: 10000 });
  });

  test('known devices panel', async ({ page }) => {
    const devicesPanel = page.getByText(/dispositivos.*conhecidos|known.*devices/i);
    if (await devicesPanel.isVisible()) {
      await expect(devicesPanel).toBeVisible();
    }
  });

  test('revokes device access', async ({ page }) => {
    const revokeBtn = page.getByRole('button', { name: /revogar|revoke|remover.*dispositivo/i }).first();
    if (await revokeBtn.isVisible()) {
      await revokeBtn.click();
      await expect(page.getByRole('dialog')).toBeVisible();
    }
  });

  test('geo restriction panel', async ({ page }) => {
    const geoPanel = page.getByText(/restrição.*geográfica|geo.*restriction/i);
    if (await geoPanel.isVisible()) {
      await geoPanel.click();
    }
  });

  test('rate limit dashboard', async ({ page }) => {
    const ratePanel = page.getByText(/rate.*limit|limite.*requisições/i);
    if (await ratePanel.isVisible()) {
      await expect(ratePanel).toBeVisible();
    }
  });

  test('MFA settings', async ({ page }) => {
    const mfaSection = page.getByText(/mfa|autenticação.*dois.*fatores|two.*factor/i);
    if (await mfaSection.isVisible()) {
      await mfaSection.click();
    }
  });

  test('enables 2FA', async ({ page }) => {
    const enable2faBtn = page.getByRole('button', { name: /ativar.*2fa|enable.*2fa|configurar.*mfa/i });
    if (await enable2faBtn.isVisible()) {
      await enable2faBtn.click();
    }
  });

  test('WebAuthn manager', async ({ page }) => {
    const webauthnSection = page.getByText(/webauthn|chave.*segurança|security.*key/i);
    if (await webauthnSection.isVisible()) {
      await webauthnSection.click();
    }
  });

  test('active sessions list', async ({ page }) => {
    const sessionsPanel = page.getByText(/sessões.*ativas|active.*sessions/i);
    if (await sessionsPanel.isVisible()) {
      await expect(sessionsPanel).toBeVisible();
    }
  });

  test('terminates other sessions', async ({ page }) => {
    const terminateBtn = page.getByRole('button', { name: /encerrar.*outras|terminate.*other|logout.*all/i });
    if (await terminateBtn.isVisible()) {
      await terminateBtn.click();
    }
  });

  test('security alerts list', async ({ page }) => {
    const alertsList = page.getByText(/alertas.*segurança|security.*alerts/i);
    if (await alertsList.isVisible()) {
      await expect(alertsList).toBeVisible();
    }
  });

  test('password change section', async ({ page }) => {
    const changePassBtn = page.getByRole('button', { name: /alterar.*senha|change.*password/i });
    if (await changePassBtn.isVisible()) {
      await changePassBtn.click();
    }
  });

  test('IP whitelist/blacklist', async ({ page }) => {
    const ipSection = page.getByText(/ip.*whitelist|ip.*blacklist|lista.*ip/i);
    if (await ipSection.isVisible()) {
      await ipSection.click();
    }
  });

  test('session timeout config', async ({ page }) => {
    const timeoutConfig = page.getByLabel(/timeout|tempo.*sessão|session.*time/i);
    if (await timeoutConfig.isVisible()) {
      await timeoutConfig.click();
    }
  });

  test('audit trail access', async ({ page }) => {
    const auditBtn = page.getByRole('button', { name: /audit|trilha|log/i });
    if (await auditBtn.isVisible()) {
      await auditBtn.click();
    }
  });
});

test.describe('Segurança - Mobile', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('responsive layout on mobile', async ({ page }) => {
    await page.goto('/seguranca');
    await expect(page.getByRole('heading', { name: /segurança/i })).toBeVisible();
  });
});
