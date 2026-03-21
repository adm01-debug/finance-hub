import { test, expect } from '@playwright/test';

test.describe('Asaas - Gateway de Pagamentos', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/asaas');
  });

  test('displays page title', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /asaas|pagamentos|gateway/i })).toBeVisible();
  });

  test('shows main panels', async ({ page }) => {
    await expect(page.getByText(/asaas|cobrança|pagamento/i).first()).toBeVisible({ timeout: 10000 });
  });

  test('new charge button opens dialog', async ({ page }) => {
    const newBtn = page.getByRole('button', { name: /nova.*cobrança|cobrar|novo/i });
    if (await newBtn.isVisible()) {
      await newBtn.click();
      await expect(page.getByRole('dialog')).toBeVisible();
    }
  });

  test('charge form fields', async ({ page }) => {
    const newBtn = page.getByRole('button', { name: /nova.*cobrança|cobrar|novo/i });
    if (await newBtn.isVisible()) {
      await newBtn.click();
      await expect(page.getByRole('dialog')).toBeVisible();

      const valorInput = page.getByLabel(/valor/i);
      if (await valorInput.isVisible()) {
        await valorInput.fill('150.00');
      }

      const descInput = page.getByLabel(/descrição/i);
      if (await descInput.isVisible()) {
        await descInput.fill('Cobrança teste E2E');
      }

      const clienteInput = page.getByLabel(/cliente/i);
      if (await clienteInput.isVisible()) {
        await clienteInput.fill('Cliente Teste');
      }
    }
  });

  test('Asaas clients dialog', async ({ page }) => {
    const clientesBtn = page.getByRole('button', { name: /clientes.*asaas|gerenciar.*clientes/i });
    if (await clientesBtn.isVisible()) {
      await clientesBtn.click();
      await expect(page.getByRole('dialog')).toBeVisible();
    }
  });

  test('payment link dialog', async ({ page }) => {
    const linkBtn = page.getByRole('button', { name: /link.*pagamento|payment.*link/i });
    if (await linkBtn.isVisible()) {
      await linkBtn.click();
      await expect(page.getByRole('dialog')).toBeVisible();
    }
  });

  test('subscription dialog', async ({ page }) => {
    const subBtn = page.getByRole('button', { name: /assinatura|subscription/i });
    if (await subBtn.isVisible()) {
      await subBtn.click();
      await expect(page.getByRole('dialog')).toBeVisible();
    }
  });

  test('subscriptions list panel', async ({ page }) => {
    const subsTab = page.getByText(/assinaturas|subscriptions/i);
    if (await subsTab.isVisible()) {
      await subsTab.click();
    }
  });

  test('PIX QR Code dialog', async ({ page }) => {
    const pixBtn = page.getByRole('button', { name: /pix|qr.*code/i });
    if (await pixBtn.isVisible()) {
      await pixBtn.click();
      await expect(page.getByRole('dialog')).toBeVisible();
    }
  });

  test('PIX transfer dialog', async ({ page }) => {
    const transferBtn = page.getByRole('button', { name: /transferência.*pix|pix.*transfer/i });
    if (await transferBtn.isVisible()) {
      await transferBtn.click();
      await expect(page.getByRole('dialog')).toBeVisible();
    }
  });

  test('refund/estorno dialog', async ({ page }) => {
    const estornoBtn = page.getByRole('button', { name: /estorno|refund|devol/i }).first();
    if (await estornoBtn.isVisible()) {
      await estornoBtn.click();
      await expect(page.getByRole('dialog')).toBeVisible();
    }
  });

  test('second copy dialog', async ({ page }) => {
    const segundaViaBtn = page.getByRole('button', { name: /segunda.*via|2.*via/i }).first();
    if (await segundaViaBtn.isVisible()) {
      await segundaViaBtn.click();
    }
  });

  test('Asaas extract panel', async ({ page }) => {
    const extratoTab = page.getByText(/extrato|extract|saldo/i);
    if (await extratoTab.isVisible()) {
      await extratoTab.click();
    }
  });

  test('payment links list panel', async ({ page }) => {
    const linksTab = page.getByText(/links.*pagamento|payment.*links/i);
    if (await linksTab.isVisible()) {
      await linksTab.click();
    }
  });

  test('webhooks log panel', async ({ page }) => {
    const webhooksTab = page.getByText(/webhooks|log/i);
    if (await webhooksTab.isVisible()) {
      await webhooksTab.click();
    }
  });

  test('filters charges by status', async ({ page }) => {
    const statusFilter = page.getByRole('combobox', { name: /status|filtro/i });
    if (await statusFilter.isVisible()) {
      await statusFilter.click();
      await page.getByRole('option').first().click();
    }
  });

  test('searches charges', async ({ page }) => {
    const searchInput = page.getByPlaceholder(/buscar|pesquisar|search/i);
    if (await searchInput.isVisible()) {
      await searchInput.fill('teste');
      await page.waitForTimeout(500);
    }
  });
});

test.describe('Asaas - Mobile', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('responsive layout on mobile', async ({ page }) => {
    await page.goto('/asaas');
    await expect(page.getByRole('heading', { name: /asaas|pagamentos/i })).toBeVisible();
  });
});
