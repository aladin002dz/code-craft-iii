import { expect, test } from '@playwright/test'
import { expectPreviewReady } from './helpers'

test('language choice persists and Arabic uses RTL while code stays LTR', async ({ page }) => {
  await page.goto('./')
  const language = page.locator('.language-picker select')

  await language.selectOption('fr')
  await expect(page.getByRole('heading', { name: 'Apprenez l’état en réalisant de vraies fonctionnalités' })).toBeVisible()
  await page.getByRole('link', { name: 'Commencer la leçon 1' }).click()
  await expect(page.getByRole('heading', { name: 'Faites fonctionner le thème' })).toBeVisible()

  await page.reload()
  await expect(language).toHaveValue('fr')
  await language.selectOption('ar')
  await expect(page.locator('html')).toHaveAttribute('lang', 'ar')
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl')
  await expect(page.getByRole('heading', { name: 'شغّل زر تبديل السمة' })).toBeVisible()
  await expect(page.locator('.area-editor')).toHaveAttribute('dir', 'ltr')

  await expectPreviewReady(page)
  await page.getByTestId('run-checks').click()
  await expect(page.getByTestId('objective-toggles-state')).toContainText('لا تغيّر النقرة isDark بشكل صحيح')
})
