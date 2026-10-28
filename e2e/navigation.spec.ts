import { test, expect } from '@playwright/test';

test.describe('navegação e rotas', () => {
  test('home carrega com estrutura', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/MoviesLib/);
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('main')).toBeVisible();
  });

  test('URL direta /catalog/popular/1 carrega', async ({ page }) => {
    await page.goto('/catalog/popular/1');
    await expect(page.locator('main')).toBeVisible();
  });

  test('URL direta /movie-details/1 carrega', async ({ page }) => {
    await page.goto('/movie-details/1');
    await expect(page.locator('main')).toBeVisible();
  });

  test('URL direta /cast carrega', async ({ page }) => {
    await page.goto('/cast');
    await expect(page.locator('main')).toBeVisible();
  });

  test('URL direta /cast/2 carrega', async ({ page }) => {
    await page.goto('/cast/2');
    await expect(page.locator('main')).toBeVisible();
  });

  test('404 exibe página não encontrada', async ({ page }) => {
    await page.goto('/endereco-inexistente');
    await expect(page.getByText('404')).toBeVisible();
    await expect(page.getByText('Voltar ao início')).toBeVisible();
  });

  test('voltar do 404 para home', async ({ page }) => {
    await page.goto('/endereco-inexistente');
    await page.getByText('Voltar ao início').click();
    await expect(page).toHaveURL('/');
  });
});
