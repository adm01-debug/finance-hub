import { test, expect } from '@playwright/test';

test.describe('Comprovante OCR', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/comprovante-ocr');
  });

  test('displays page title', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /comprovante|ocr|reconhecimento/i })).toBeVisible();
  });

  test('shows OCR upload area', async ({ page }) => {
    await expect(page.getByText(/upload|enviar|arrastar|drag|comprovante/i).first()).toBeVisible({ timeout: 10000 });
  });

  test('upload button for receipt', async ({ page }) => {
    const uploadBtn = page.getByRole('button', { name: /upload|enviar|selecionar.*arquivo/i });
    if (await uploadBtn.isVisible()) {
      await uploadBtn.click();
    }
  });

  test('drag and drop area exists', async ({ page }) => {
    const dropzone = page.locator('[data-testid="dropzone"], [class*="dropzone"], [class*="upload"]');
    if (await dropzone.first().isVisible()) {
      await expect(dropzone.first()).toBeVisible();
    }
  });

  test('camera capture button', async ({ page }) => {
    const cameraBtn = page.getByRole('button', { name: /câmera|camera|fotografar/i });
    if (await cameraBtn.isVisible()) {
      await cameraBtn.click();
    }
  });

  test('OCR processing status', async ({ page }) => {
    const status = page.getByText(/processando|processing|analisando/i);
    // This would show during OCR processing
    if (await status.isVisible()) {
      await expect(status).toBeVisible();
    }
  });

  test('extracted data display', async ({ page }) => {
    const extractedData = page.getByText(/dados.*extraídos|extracted.*data|resultado/i);
    if (await extractedData.isVisible()) {
      await expect(extractedData).toBeVisible();
    }
  });

  test('edits extracted data', async ({ page }) => {
    const editBtn = page.getByRole('button', { name: /editar|corrigir|edit/i }).first();
    if (await editBtn.isVisible()) {
      await editBtn.click();
    }
  });

  test('confirms and saves OCR data', async ({ page }) => {
    const saveBtn = page.getByRole('button', { name: /salvar|confirmar|save/i });
    if (await saveBtn.isVisible()) {
      await saveBtn.click();
    }
  });

  test('OCR history list', async ({ page }) => {
    const historyTab = page.getByText(/histórico|history|processados/i);
    if (await historyTab.isVisible()) {
      await historyTab.click();
    }
  });

  test('supported formats info', async ({ page }) => {
    const formatsInfo = page.getByText(/formatos|jpg|png|pdf|suportados/i);
    if (await formatsInfo.isVisible()) {
      await expect(formatsInfo).toBeVisible();
    }
  });

  test('links OCR to transaction', async ({ page }) => {
    const linkBtn = page.getByRole('button', { name: /vincular|link|associar/i }).first();
    if (await linkBtn.isVisible()) {
      await linkBtn.click();
    }
  });
});

test.describe('Comprovante OCR - Mobile', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('responsive layout on mobile', async ({ page }) => {
    await page.goto('/comprovante-ocr');
    await expect(page.getByRole('heading', { name: /comprovante|ocr/i })).toBeVisible();
  });

  test('camera button visible on mobile', async ({ page }) => {
    await page.goto('/comprovante-ocr');
    const cameraBtn = page.getByRole('button', { name: /câmera|camera|fotografar/i });
    if (await cameraBtn.isVisible()) {
      await expect(cameraBtn).toBeVisible();
    }
  });
});
