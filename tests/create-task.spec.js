const { test, expect } = require('@playwright/test');

test('Создание задачи: пользователь может добавить новую задачу', async ({ page }) => {
  await page.goto('https://avito-tech-internship-psi.vercel.app');

  // Клик по первой кнопке "Создать задачу"
  await page.getByRole('button', { name: /создать задачу/i }).first().click();

  // Дождаться появления окна по заголовку
  const modalBox = page.locator('h5:has-text("Создание задачи")').locator('..'); // поднимаемся к родителю (контейнер окна)
  await expect(modalBox).toBeVisible();

  // Заполняем поле "название задачи" ВНУТРИ модального окна
  const title = `Автотест ${Date.now()}`;
  const titleInput = modalBox.locator('input[type="text"].MuiInputBase-input');
  await expect(titleInput).toBeVisible();
  await titleInput.fill(title);

  // Заполняем поле "описание": только не readonly textarea
  const descInput = modalBox.locator('textarea.MuiInputBase-input:not([readonly])');
  await expect(descInput.first()).toBeVisible();
  await descInput.first().fill('Описание автотеста');

  // Заполняем ВСЕ обязательные дропдауны, КРОМЕ заблокированных (только в modalBox)
  const comboboxes = await modalBox.locator('div[role="combobox"][aria-required="true"]').all();
  for (const box of comboboxes) {
    const isDisabled = await box.getAttribute('aria-disabled');
    const classes = await box.getAttribute('class') || '';
    if (isDisabled === 'true' || classes.includes('Mui-disabled')) continue;
    await box.click();
    await page.locator('li[role="option"]').first().click();
  }

  // Клик по кнопке "Создать" только внутри модального окна
  const createBtn = modalBox.locator('button:has-text("Создать"):not([disabled])');
  await expect(createBtn).toBeVisible();
  await createBtn.click();

  // Проверить, что задача появилась в основном списке
  await expect(page.getByText(title)).toBeVisible();
});
