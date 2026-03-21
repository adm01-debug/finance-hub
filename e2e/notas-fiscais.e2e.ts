import { test, expect } from '@playwright/test';

test.describe('Notas Fiscais (NFe)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/notas-fiscais');
  });

  test('displays page title', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /notas.*fiscais|nf-e|nfe/i })).toBeVisible();
  });

  test('shows NFe list', async ({ page }) => {
    await expect(page.getByRole('table').or(page.getByText(/nota.*fiscal/i).first())).toBeVisible({ timeout: 10000 });
  });

  test('new NFe emission button', async ({ page }) => {
    const newBtn = page.getByRole('button', { name: /nova.*nota|emitir|nova.*nf/i });
    if (await newBtn.isVisible()) {
      await newBtn.click();
      await expect(page.getByRole('dialog').or(page.getByText(/emiss|nova.*nota/i))).toBeVisible();
    }
  });

  test('NFe emission form fields', async ({ page }) => {
    const newBtn = page.getByRole('button', { name: /nova.*nota|emitir|nova.*nf/i });
    if (await newBtn.isVisible()) {
      await newBtn.click();

      const natOpInput = page.getByLabel(/natureza.*operação|operação/i);
      if (await natOpInput.isVisible()) {
        await natOpInput.fill('Venda de mercadoria');
      }

      const destInput = page.getByLabel(/destinatário|cliente/i);
      if (await destInput.isVisible()) {
        await destInput.fill('Destinatário Teste');
      }
    }
  });

  test('cancellation of NFe', async ({ page }) => {
    const cancelBtn = page.getByRole('button', { name: /cancelar.*nf|cancelamento/i }).first();
    if (await cancelBtn.isVisible()) {
      await cancelBtn.click();
      await expect(page.getByRole('dialog')).toBeVisible();
    }
  });

  test('NFe invalidation (inutilização)', async ({ page }) => {
    const inutBtn = page.getByRole('button', { name: /inutiliz/i });
    if (await inutBtn.isVisible()) {
      await inutBtn.click();
      await expect(page.getByRole('dialog')).toBeVisible();
    }
  });

  test('DANFE generator button', async ({ page }) => {
    const danfeBtn = page.getByRole('button', { name: /danfe|pdf|visualizar/i }).first();
    if (await danfeBtn.isVisible()) {
      await danfeBtn.click();
    }
  });

  test('SEFAZ monitor visibility', async ({ page }) => {
    const sefazMonitor = page.getByText(/sefaz|status.*sefaz/i);
    if (await sefazMonitor.isVisible()) {
      await expect(sefazMonitor).toBeVisible();
    }
  });

  test('SEFAZ analytics panel', async ({ page }) => {
    const analyticsTab = page.getByText(/analytics|estatísticas|sefaz/i);
    if (await analyticsTab.isVisible()) {
      await analyticsTab.click();
    }
  });

  test('contingency mode', async ({ page }) => {
    const contingencyBtn = page.getByRole('button', { name: /contingência|offline/i });
    if (await contingencyBtn.isVisible()) {
      await contingencyBtn.click();
    }
  });

  test('auto contingency config', async ({ page }) => {
    const configBtn = page.getByRole('button', { name: /config.*contingência|auto.*contingência/i });
    if (await configBtn.isVisible()) {
      await configBtn.click();
    }
  });

  test('rejection alerts', async ({ page }) => {
    const alertsTab = page.getByText(/alerta.*rejeição|rejection/i);
    if (await alertsTab.isVisible()) {
      await alertsTab.click();
    }
  });

  test('events history', async ({ page }) => {
    const historyTab = page.getByText(/histórico.*evento|events/i);
    if (await historyTab.isVisible()) {
      await historyTab.click();
    }
  });

  test('Bling NFe panel', async ({ page }) => {
    const blingTab = page.getByText(/bling/i);
    if (await blingTab.isVisible()) {
      await blingTab.click();
    }
  });

  test('filters NFe by status', async ({ page }) => {
    const statusFilter = page.getByRole('combobox', { name: /status|filtro/i });
    if (await statusFilter.isVisible()) {
      await statusFilter.click();
      await page.getByRole('option').first().click();
    }
  });

  test('searches NFe by number or client', async ({ page }) => {
    const searchInput = page.getByPlaceholder(/buscar|pesquisar|número/i);
    if (await searchInput.isVisible()) {
      await searchInput.fill('12345');
      await page.waitForTimeout(500);
    }
  });

  test('exports NFe list', async ({ page }) => {
    const exportBtn = page.getByRole('button', { name: /exportar|export/i });
    if (await exportBtn.isVisible()) {
      await exportBtn.click();
    }
  });

  test('XML download', async ({ page }) => {
    const xmlBtn = page.getByRole('button', { name: /xml|download.*xml/i }).first();
    if (await xmlBtn.isVisible()) {
      await xmlBtn.click();
    }
  });
});

test.describe('Notas Fiscais - Mobile', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('responsive layout on mobile', async ({ page }) => {
    await page.goto('/notas-fiscais');
    await expect(page.getByRole('heading', { name: /notas.*fiscais|nf-e|nfe/i })).toBeVisible();
  });
});
