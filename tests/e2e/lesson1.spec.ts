import { expect, test } from '@playwright/test'
import { editor, expectPreviewReady, objective, preview, runChecks, setCode, starter } from './helpers'

const STARTER = starter('1-settings-panel.jsx')
const TODO = '// TODO: switch the theme when the button is clicked.'
const withHandler = (body: string) => STARTER.replace(TODO, body)
const SOLUTION = withHandler('setIsDark(!isDark);')

test.beforeEach(async ({ page }) => {
  await page.goto('#/lesson/1')
  await expectPreviewReady(page)
})

test('the starter visibly fails: the button does nothing and every objective fails with guidance', async ({ page }) => {
  const button = preview(page).getByRole('button', { name: 'Switch to dark mode' })
  await expect(preview(page).getByRole('heading', { name: 'Appearance' })).toBeVisible()
  await button.click()
  await page.waitForTimeout(250)
  await expect(button).toBeVisible()
  await expect(preview(page).locator('section')).toHaveClass('panel light')
  await expect(page.getByTestId('state-isDark')).toContainText('false')

  await runChecks(page)
  for (const id of ['toggles-state', 'theme-follows-state', 'label-follows-state']) {
    await expect(objective(page, id)).toHaveAttribute('data-state', 'failed')
  }
  await expect(objective(page, 'toggles-state')).toContainText('Call setIsDark inside handleToggle')
  await expect(page.getByTestId('status-pill')).toHaveText('0 of 3 checks passed')
  await expect(page.getByTestId('next-lesson')).toBeDisabled()
})

test('a correct solution changes the real preview, the inspector, and completes the lesson', async ({ page }) => {
  await setCode(page, SOLUTION)

  const section = preview(page).locator('section')
  await expect(preview(page).getByRole('button', { name: 'Switch to dark mode' })).toBeVisible()
  await preview(page).getByRole('button', { name: 'Switch to dark mode' }).click()
  await expect(section).toHaveClass('panel dark')
  await expect(preview(page).getByRole('button', { name: 'Switch to light mode' })).toBeVisible()
  await expect(page.getByTestId('state-isDark')).toContainText('true')
  await preview(page).getByRole('button', { name: 'Switch to light mode' }).click()
  await expect(section).toHaveClass('panel light')
  await expect(page.getByTestId('state-isDark')).toContainText('false')

  await runChecks(page)
  for (const id of ['toggles-state', 'theme-follows-state', 'label-follows-state']) {
    await expect(objective(page, id)).toHaveAttribute('data-state', 'passed')
  }
  await expect(page.getByTestId('status-pill')).toHaveText('✓ 3 of 3 checks passed')
  await expect(page.getByTestId('next-lesson')).toBeEnabled()
})

test('an equivalent functional-update solution passes too', async ({ page }) => {
  await setCode(page, withHandler('setIsDark(previous => !previous);'))
  await runChecks(page)
  await expect(page.getByTestId('status-pill')).toHaveText('✓ 3 of 3 checks passed')
})

test('a wrong solution fails with a specific explanation and does not unlock the next lesson', async ({ page }) => {
  await setCode(page, withHandler('setIsDark(true);'))
  await runChecks(page)
  await expect(objective(page, 'toggles-state')).toHaveAttribute('data-state', 'failed')
  await expect(objective(page, 'toggles-state')).toContainText('second click should switch isDark back')
  await expect(page.getByTestId('status-pill')).not.toContainText('✓')
  await expect(page.getByTestId('next-lesson')).toBeDisabled()
})

test('editing after a passing run marks the results stale instead of contradicting them', async ({ page }) => {
  await setCode(page, SOLUTION)
  await runChecks(page)
  await expect(page.getByTestId('status-pill')).toHaveText('✓ 3 of 3 checks passed')

  await setCode(page, SOLUTION + '\n')
  // Completion was earned, so Next stays available, but the checklist no longer claims the new code passed.
  await expect(page.getByTestId('status-pill')).toHaveText('Completed. Run checks again after editing')
  await expect(objective(page, 'toggles-state')).toHaveAttribute('data-state', 'pending')
  await expect(page.getByTestId('next-lesson')).toBeEnabled()
})

test('a syntax error keeps the last working preview and recovers when fixed', async ({ page }) => {
  await setCode(page, SOLUTION)
  await expect(preview(page).getByRole('button', { name: 'Switch to dark mode' })).toBeVisible()

  await setCode(page, SOLUTION.replace('<h2>Appearance</h2>', '<h2>Appearance</h2'), { rendered: false })
  await expect(page.getByTestId('preview-error')).toContainText('Syntax error on line')
  await expect(page.getByTestId('preview-error')).toContainText('last working preview')
  await expect(preview(page).getByRole('heading', { name: 'Appearance' })).toBeVisible()

  await runChecks(page)
  await expect(objective(page, 'toggles-state')).toContainText('Fix the syntax error')

  await setCode(page, SOLUTION)
  await expect(page.getByTestId('preview-error')).toHaveCount(0)
})

test('a runtime error in the preview is reported and recoverable', async ({ page }) => {
  await setCode(page, withHandler("throw new Error('handler exploded');"))
  await preview(page).getByRole('button', { name: 'Switch to dark mode' }).click()
  await expect(page.getByTestId('preview-error')).toContainText('handler exploded')

  await setCode(page, SOLUTION)
  await expect(page.getByTestId('preview-error')).toHaveCount(0)
  await preview(page).getByRole('button', { name: 'Switch to dark mode' }).click()
  await expect(preview(page).getByRole('button', { name: 'Switch to light mode' })).toBeVisible()
})

test('a render-time crash is reported without breaking the app', async ({ page }) => {
  await setCode(page, STARTER.replace('<h2>Appearance</h2>', '<h2>{missing.value}</h2>'))
  await expect(page.getByTestId('preview-error')).toContainText('missing')
  await expect(page.getByRole('heading', { level: 1, name: 'Make the theme toggle work' })).toBeVisible()

  await setCode(page, SOLUTION)
  await expect(page.getByTestId('preview-error')).toHaveCount(0)
  await expect(preview(page).getByRole('heading', { name: 'Appearance' })).toBeVisible()
})

test('an infinite loop is caught and the app stays usable', async ({ page }) => {
  await setCode(page, withHandler('setIsDark(!isDark);').replace('const [isDark', 'while (true) {}\n  const [isDark'), { rendered: false })
  await expect(page.getByTestId('preview-error')).toContainText('stopped responding', { timeout: 15_000 })

  // The application itself is still responsive: it can recover by fixing the code.
  await setCode(page, SOLUTION)
  await expect(page.getByTestId('preview-error')).toHaveCount(0)
  await expect(preview(page).getByRole('button', { name: 'Switch to dark mode' })).toBeVisible()
})

test('hints reveal one at a time and Reset restores the starter', async ({ page }) => {
  await page.getByRole('button', { name: 'Hint', exact: true }).click()
  await expect(page.getByTestId('hint-1')).toBeVisible()
  await expect(page.getByTestId('hint-2')).toHaveCount(0)
  await page.getByRole('button', { name: 'Hint (1/3)' }).click()
  await expect(page.getByTestId('hint-2')).toBeVisible()

  await setCode(page, SOLUTION)
  await page.getByRole('button', { name: /Reset/ }).click()
  await page.getByRole('button', { name: 'Yes, reset' }).click()
  await expect(editor(page)).toContainText('TODO: switch the theme')
})

test('drafts and completion survive a refresh', async ({ page }) => {
  await setCode(page, SOLUTION)
  await runChecks(page)
  await expect(page.getByTestId('status-pill')).toHaveText('✓ 3 of 3 checks passed')
  await page.waitForTimeout(700) // drafts are saved shortly after typing

  await page.reload()
  await expectPreviewReady(page)
  await expect(editor(page)).toContainText('setIsDark(!isDark);')
  await expect(page.getByTestId('next-lesson')).toBeEnabled()
  await expect(page.getByText(/^1 of \d+ complete$/)).toBeVisible()
})

test('keyboard users can finish the lesson without a mouse', async ({ page }) => {
  await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur())
  for (let presses = 0; presses < 40; presses++) {
    await page.keyboard.press('Tab')
    if (await page.evaluate(() => document.activeElement?.classList.contains('cm-content'))) break
  }
  await expect(editor(page)).toBeFocused()
  await page.keyboard.press('Control+A')
  await page.keyboard.insertText(SOLUTION)

  // Ctrl+Enter runs the checks from inside the editor.
  await page.keyboard.press('Control+Enter')
  await expect(page.getByTestId('status-pill')).toHaveText('✓ 3 of 3 checks passed')

  // Escape then Tab leaves the editor instead of trapping focus.
  await page.keyboard.press('Escape')
  await page.keyboard.press('Tab')
  await expect(editor(page)).not.toBeFocused()
})

test('the workspace collapses into usable tabs on a phone-sized screen and keeps editor content', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 800 })
  await page.reload()
  await expectPreviewReady(page)
  await expect(page.getByRole('navigation', { name: 'Workspace panels' })).toBeVisible()

  await setCode(page, SOLUTION)
  await page.getByRole('button', { name: 'Preview', exact: true }).click()
  await expect(preview(page).getByRole('button', { name: 'Switch to dark mode' })).toBeVisible()
  await preview(page).getByRole('button', { name: 'Switch to dark mode' }).click()
  await expect(page.getByTestId('state-isDark')).toContainText('true')

  await page.getByRole('button', { name: 'Code', exact: true }).click()
  await expect(editor(page)).toContainText('setIsDark(!isDark);')

  await runChecks(page)
  await expect(page.getByTestId('status-pill')).toHaveText('✓ 3 of 3 checks passed')
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)
  expect(overflow).toBe(false)
})

test('the app makes no requests outside its own origin', async ({ page }) => {
  const external: string[] = []
  page.on('request', request => {
    if (!request.url().startsWith('http://localhost:4173') && !request.url().startsWith('data:') && !request.url().startsWith('blob:')) {
      external.push(request.url())
    }
  })
  await page.reload()
  await expectPreviewReady(page)
  await setCode(page, SOLUTION)
  await runChecks(page)
  expect(external).toEqual([])
})
