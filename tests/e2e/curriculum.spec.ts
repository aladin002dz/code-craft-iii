import { expect, test } from '@playwright/test'
import { expectPreviewReady, preview, runChecks, setCode, starter } from './helpers'
import { solutions } from '../fixtures/curriculum'

const lesson1 = solutions[1](starter('1-settings-panel.jsx'))
const lesson2 = solutions[2](starter('2-cart-quantity.jsx'))

test('lesson links remain locked until the prerequisite passes, then advance to the next feature', async ({ page }) => {
  await page.goto('#/lesson/2')
  await expect(page.getByTestId('locked')).toContainText('Finish lesson 1')
  await page.reload()
  await expect(page.getByTestId('locked')).toBeVisible()

  await page.getByRole('link', { name: 'Go to lesson 1' }).click()
  await expectPreviewReady(page)
  await setCode(page, lesson1)
  await runChecks(page)
  await expect(page.getByTestId('next-lesson')).toBeEnabled()
  await page.getByTestId('next-lesson').click()
  await expect(page).toHaveURL(/#\/lesson\/2$/)
  await expectPreviewReady(page)
  await expect(preview(page).getByRole('heading', { name: 'Desk lamp' })).toBeVisible()

  await setCode(page, lesson2)
  await preview(page).getByRole('button', { name: 'Increase quantity' }).click()
  await expect(preview(page).getByLabel('Quantity', { exact: true })).toHaveText('2')
  await runChecks(page)
  await expect(page.getByTestId('status-pill')).toHaveText('✓ 3 of 3 checks passed')
  await page.getByTestId('next-lesson').click()
  await expect(page).toHaveURL(/#\/lesson\/3$/)
})

test('all nine lessons can be completed in order in the live browser', async ({ page }) => {
  test.setTimeout(150_000)
  const filenames = [
    '1-settings-panel.jsx', '2-cart-quantity.jsx', '3-cart-actions.jsx',
    '4-cart-panel.jsx', '5-volume-settings.jsx', '6-task-board.jsx',
    '7-search-board.jsx', '8-cart-summary.jsx', '9-task-editor.jsx',
  ]
  await page.goto('#/lesson/1')
  for (let id = 1; id <= 9; id++) {
    await expectPreviewReady(page)
    await setCode(page, solutions[id](starter(filenames[id - 1])))
    if (id === 6) {
      const rows = preview(page).locator('.task-list li')
      await rows.nth(1).locator('.drag-handle').dragTo(rows.nth(0).locator('.drag-handle'))
      await expect(rows.nth(0)).toContainText('Review pull request')
      await preview(page).getByRole('button', { name: 'Move Review pull request down' }).click()
      await expect(rows.nth(0)).toContainText('Write release notes')
    }
    await runChecks(page)
    await expect(page.getByTestId('status-pill')).toContainText('✓')
    await expect(page.getByTestId('next-lesson')).toBeEnabled()
    await page.getByTestId('next-lesson').click()
    if (id < 9) await expect(page).toHaveURL(new RegExp(`#\\/lesson\\/${id + 1}$`))
  }
  await expect(page.getByText('All nine lessons complete.')).toBeVisible()
  await page.reload()
  await expect(page.getByText('All nine lessons complete.')).toBeVisible()
})
