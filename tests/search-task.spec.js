const { test, expect } = require('@playwright/test');

test('Поиск задачи: корректный поиск по названию', async ({ page }) => {
  await page.goto('https://avito-tech-internship-psi.vercel.app');

  // 1. Создать уникальную задачу
  await page.getByRole('button', { name: /создать задачу/i }).first().click();
  const modalBox = page.locator('h5:has-text("Создание задачи")').locator('..');
  await expect(modalBox).toBeVisible();
  const title = `Поиск-${Date.now()}`;
  const titleInput = modalBox.locator('input[type="text"].MuiInputBase-input');
  await expect(titleInput).toBeVisible();
  await titleInput.fill(title);
  const descInput = modalBox.locator('textarea.MuiInputBase-input:not([readonly])');
  await expect(descInput.first()).toBeVisible();
  await descInput.first().fill('Описание для поиска задачи');
  const comboboxes = await modalBox.locator('div[role="combobox"][aria-required="true"]').all();
  for (const box of comboboxes) {
    const isDisabled = await box.getAttribute('aria-disabled');
    const classes = await box.getAttribute('class') || '';
    if (isDisabled === 'true' || classes.includes('Mui-disabled')) continue;
    await box.click();
    await page.locator('li[role="option"]').first().click();
  }
  const createBtn = modalBox.locator('button:has-text("Создать"):not([disabled])');
  await expect(createBtn).toBeVisible();
  await createBtn.click();

  // 2. Ввести часть названия в строку поиска
  const query = title.slice(0, Math.max(title.length - 3, 5));
  const searchInput = page.locator('input[placeholder="Поиск"]');
  await searchInput.fill(query);
  await searchInput.press('Enter');

  // 3. Проверка — задача есть среди результатов
  await expect(page.getByText(title)).toBeVisible();
});
