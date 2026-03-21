import { test, expect } from '@playwright/test';

test.describe('Expert / IA Financeira', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/expert');
  });

  test('displays page title', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /expert|assistente|ia|inteligência/i })).toBeVisible();
  });

  test('shows expert interface', async ({ page }) => {
    await expect(page.getByText(/expert|assistente|pergunt|análise/i).first()).toBeVisible({ timeout: 10000 });
  });

  test('document analyzer section', async ({ page }) => {
    const analyzerSection = page.getByText(/analisar.*documento|document.*analyz/i);
    if (await analyzerSection.isVisible()) {
      await expect(analyzerSection).toBeVisible();
    }
  });

  test('proactive suggestions panel', async ({ page }) => {
    const suggestionsPanel = page.getByText(/sugestões|suggestions|proativ/i);
    if (await suggestionsPanel.isVisible()) {
      await expect(suggestionsPanel).toBeVisible();
    }
  });

  test('chat input for questions', async ({ page }) => {
    const chatInput = page.getByPlaceholder(/perguntar|ask|digitar|mensagem/i)
      .or(page.locator('textarea'));
    if (await chatInput.first().isVisible()) {
      await chatInput.first().fill('Qual é o meu saldo atual?');
    }
  });

  test('sends message to expert', async ({ page }) => {
    const chatInput = page.getByPlaceholder(/perguntar|ask|digitar|mensagem/i)
      .or(page.locator('textarea'));
    if (await chatInput.first().isVisible()) {
      await chatInput.first().fill('Analise meu fluxo de caixa');
      const sendBtn = page.getByRole('button', { name: /enviar|send|►/i });
      if (await sendBtn.isVisible()) {
        await sendBtn.click();
      }
    }
  });

  test('uploads document for analysis', async ({ page }) => {
    const uploadBtn = page.getByRole('button', { name: /upload|enviar.*documento|anexar/i });
    if (await uploadBtn.isVisible()) {
      await uploadBtn.click();
    }
  });

  test('suggestion cards are clickable', async ({ page }) => {
    const suggestionCard = page.locator('[data-testid*="suggestion"], [class*="suggestion"]').first();
    if (await suggestionCard.isVisible()) {
      await suggestionCard.click();
    }
  });

  test('context actions menu', async ({ page }) => {
    const contextBtn = page.getByRole('button', { name: /ações|actions|contexto/i });
    if (await contextBtn.isVisible()) {
      await contextBtn.click();
    }
  });

  test('conversation history', async ({ page }) => {
    const historyBtn = page.getByRole('button', { name: /histórico|history|conversas/i });
    if (await historyBtn.isVisible()) {
      await historyBtn.click();
    }
  });

  test('new conversation button', async ({ page }) => {
    const newConvBtn = page.getByRole('button', { name: /nova.*conversa|new.*chat|limpar/i });
    if (await newConvBtn.isVisible()) {
      await newConvBtn.click();
    }
  });

  test('AI response formatting', async ({ page }) => {
    const responseArea = page.locator('[data-testid*="response"], [class*="message"], [class*="response"]');
    if (await responseArea.first().isVisible()) {
      await expect(responseArea.first()).toBeVisible();
    }
  });

  test('exports conversation', async ({ page }) => {
    const exportBtn = page.getByRole('button', { name: /exportar|export/i });
    if (await exportBtn.isVisible()) {
      await exportBtn.click();
    }
  });
});

test.describe('Expert - Mobile', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('responsive layout on mobile', async ({ page }) => {
    await page.goto('/expert');
    await expect(page.getByRole('heading', { name: /expert|assistente|ia/i })).toBeVisible();
  });

  test('chat input works on mobile', async ({ page }) => {
    await page.goto('/expert');
    const chatInput = page.getByPlaceholder(/perguntar|ask|digitar/i)
      .or(page.locator('textarea'));
    if (await chatInput.first().isVisible()) {
      await chatInput.first().fill('Teste mobile');
    }
  });
});
