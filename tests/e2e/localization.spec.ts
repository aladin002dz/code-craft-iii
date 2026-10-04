import { expect, test } from '@playwright/test'
import { expectPreviewReady } from './helpers'

test('language choice persists and Arabic uses RTL while code stays LTR', async ({ page }) => {
  await page.goto('./')
  const language = page.locator('.language-picker select')

  await language.selectOption('fr')
  await expect(page.getByRole('heading', { name: 'Apprenez React en réalisant de vraies fonctionnalités' })).toBeVisible()
  await page.getByTestId('course-state').getByRole('link', { name: 'Ouvrir le cours' }).click()
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

test('the effects course is translated and its lesson numbers restart at 1', async ({ page }) => {
  await page.goto('./#/course/effects')
  await page.locator('.language-picker select').selectOption('ar')
  await expect(page.getByRole('heading', { name: 'اربط مكوّناتك بالعالم خارج React' })).toBeVisible()
  await page.getByRole('link', { name: 'ابدأ الدرس 1' }).click()
  await expect(page).toHaveURL(/#\/lesson\/10$/)
  await expect(page.getByRole('heading', { name: 'حمّل الفريق مرة واحدة' })).toBeVisible()
  await expect(page.locator('.crumbs')).toContainText('الدرس 1')
  await expect(page.locator('.area-editor')).toHaveAttribute('dir', 'ltr')
})
