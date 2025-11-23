const { test, expect } = require('@playwright/test');

test('Открытие карточки задачи: можно открыть задачу из списка и увидеть детали', async ({ page }) => {
  await page.goto('https://avito-tech-internship-psi.vercel.app');

  // 1. Создать уникальную задачу (по аналогии с первым автотестом)
  await page.getByRole('button', { name: /создать задачу/i }).first().click();
  const modalBox = page.locator('h5:has-text("Создание задачи")').locator('..');
  await expect(modalBox).toBeVisible();
  const title = `Открытие ${Date.now()}`;
  const titleInput = modalBox.locator('input[type="text"].MuiInputBase-input');
  await expect(titleInput).toBeVisible();
  await titleInput.fill(title);
  const descInput = modalBox.locator('textarea.MuiInputBase-input:not([readonly])');
  await expect(descInput.first()).toBeVisible();
  await descInput.first().fill('Описание для открытия карточки');
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

  // 2. Находим задачу в списке по названию
  const taskInList = page.getByText(title);
  await expect(taskInList).toBeVisible();

  // 3. Кликаем по названию задачи (предполагаем, что клик ведет к открытию карточки)
  await taskInList.click();

  // 4. Проверяем открытие карточки — в заголовке карточки задачи совпадает название
  await expect(page.getByText(title)).toBeVisible();
  await expect(page.getByText('Описание для открытия карточки')).toBeVisible();
});
