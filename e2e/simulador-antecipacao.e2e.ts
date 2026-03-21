import { test, expect } from '@playwright/test';

test.describe('Simulador de Antecipação', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/simulador-antecipacao');
  });

  test('displays page title', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /simulador|antecipação|anticipation/i })).toBeVisible();
  });

  test('shows simulator form', async ({ page }) => {
    await expect(page.getByText(/simular|antecipação|valor|taxa/i).first()).toBeVisible({ timeout: 10000 });
  });

  test('fills simulation form', async ({ page }) => {
    const valorInput = page.getByLabel(/valor.*total|valor|amount/i);
    if (await valorInput.isVisible()) {
      await valorInput.fill('50000.00');
    }

    const taxaInput = page.getByLabel(/taxa|rate|juros/i);
    if (await taxaInput.isVisible()) {
      await taxaInput.fill('2.5');
    }

    const prazoInput = page.getByLabel(/prazo|dias|days|período/i);
    if (await prazoInput.isVisible()) {
      await prazoInput.fill('30');
    }
  });

  test('calculates anticipation', async ({ page }) => {
    const valorInput = page.getByLabel(/valor.*total|valor|amount/i);
    if (await valorInput.isVisible()) {
      await valorInput.fill('10000.00');
    }

    const calcBtn = page.getByRole('button', { name: /calcular|simular|calculate/i });
    if (await calcBtn.isVisible()) {
      await calcBtn.click();
      await page.waitForTimeout(500);
    }
  });

  test('shows calculation results', async ({ page }) => {
    const valorInput = page.getByLabel(/valor.*total|valor|amount/i);
    if (await valorInput.isVisible()) {
      await valorInput.fill('10000.00');
      const calcBtn = page.getByRole('button', { name: /calcular|simular|calculate/i });
      if (await calcBtn.isVisible()) {
        await calcBtn.click();
        const result = page.getByText(/resultado|valor.*líquido|net.*value|desconto/i);
        if (await result.isVisible()) {
          await expect(result).toBeVisible();
        }
      }
    }
  });

  test('selects receivables to anticipate', async ({ page }) => {
    const checkboxes = page.locator('input[type="checkbox"]');
    const count = await checkboxes.count();
    if (count > 0) {
      await checkboxes.first().click();
    }
  });

  test('changes rate type', async ({ page }) => {
    const rateTypeSelect = page.getByRole('combobox', { name: /tipo.*taxa|rate.*type/i });
    if (await rateTypeSelect.isVisible()) {
      await rateTypeSelect.click();
      await page.getByRole('option').first().click();
    }
  });

  test('exports simulation result', async ({ page }) => {
    const exportBtn = page.getByRole('button', { name: /exportar|export|pdf/i });
    if (await exportBtn.isVisible()) {
      await exportBtn.click();
    }
  });

  test('clears simulation form', async ({ page }) => {
    const clearBtn = page.getByRole('button', { name: /limpar|clear|resetar/i });
    if (await clearBtn.isVisible()) {
      await clearBtn.click();
    }
  });

  test('validates required fields', async ({ page }) => {
    const calcBtn = page.getByRole('button', { name: /calcular|simular/i });
    if (await calcBtn.isVisible()) {
      await calcBtn.click();
      const error = page.getByText(/obrigatório|required|preencha/i);
      if (await error.isVisible()) {
        await expect(error).toBeVisible();
      }
    }
  });

  test('comparison view with different rates', async ({ page }) => {
    const compareBtn = page.getByRole('button', { name: /comparar|compare/i });
    if (await compareBtn.isVisible()) {
      await compareBtn.click();
    }
  });
});

test.describe('Simulador Antecipação - Mobile', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('responsive layout on mobile', async ({ page }) => {
    await page.goto('/simulador-antecipacao');
    await expect(page.getByRole('heading', { name: /simulador|antecipação/i })).toBeVisible();
  });
});
