const { test, expect } = require('@playwright/test');

test('Переход на доску проекта через страницу проектов', async ({ page }) => {
  await page.goto('https://avito-tech-internship-psi.vercel.app');

  // Находим и кликаем по ссылке "Проекты" только в header
  const header = page.locator('header');
  const projectsLink = header.getByRole('link', { name: /проекты/i });
  await expect(projectsLink).toBeVisible();
  await projectsLink.click();

  // Кликаем по первой кнопке "Перейти к доске"
  const boardBtn = page.getByRole('link', { name: /перейти к доске/i }).first();
  await expect(boardBtn).toBeVisible();
  await boardBtn.click();

  // Дождаться появления всех трёх колонок с названиями
  await expect(page.getByRole('heading', { name: 'To Do' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'In Progress' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Done' })).toBeVisible();
});
