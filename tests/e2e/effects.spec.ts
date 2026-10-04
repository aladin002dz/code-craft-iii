import { expect, test } from '@playwright/test'
import { expectPreviewReady, preview, runChecks, setCode, starter } from './helpers'
import { solutions } from '../fixtures/curriculum'

const files: Record<number, string> = {
  10: '10-team-directory.jsx',
  11: '11-profile-viewer.jsx',
  12: '12-member-list.jsx',
  13: '13-focus-timer.jsx',
  14: '14-chat-room.jsx',
  15: '15-display-name.jsx',
  16: '16-task-filter.jsx',
}

test('the home page lists both courses and each keeps its own map and handbook', async ({ page }) => {
  await page.goto('./')
  await expect(page.getByRole('heading', { name: 'React state', exact: true })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Effects with useEffect' })).toBeVisible()
  await expect(page.getByTestId('course-effects')).toContainText('0 of 7 complete')

  await page.getByTestId('course-effects').getByRole('link', { name: 'Open course' }).click()
  await expect(page).toHaveURL(/#\/course\/effects$/)
  await expect(page.locator('.lesson-map li')).toHaveCount(7)
  await expect(page.locator('.progress-count')).toHaveText('0 of 7 complete')

  await page.getByRole('link', { name: 'Handbook', exact: true }).first().click()
  await expect(page).toHaveURL(/#\/handbook\/effects$/)
  await expect(page.getByRole('heading', { name: 'Effects handbook' })).toBeVisible()
  await expect(page.locator('.handbook-reference details')).toHaveCount(3)
  await page.locator('.handbook-reference summary').nth(1).click()
  await expect(page.locator('.state-anatomy-card')).toContainText('if (!ignore) setUser(data)')
  await expect(page.locator('.handbook-reference summary').first()).toContainText('Load data when the component appears')

  // The effects course starts unlocked; a later lesson still needs its prerequisite.
  await page.goto('./#/lesson/11')
  await expect(page.getByTestId('locked')).toContainText('Finish lesson 1')
})

test('the first lesson shows a fetch in render repeating in the real preview, and the effect fetches once', async ({ page }) => {
  await page.goto('./#/lesson/10')
  await expectPreviewReady(page)
  const log = preview(page).getByLabel('Network log')
  await expect(preview(page).getByLabel('Team members')).toContainText('Grace Hopper')
  await expect(log).toContainText(/([3-9]|\d\d+) requests/, { timeout: 5_000 })

  await setCode(page, solutions[10](starter(files[10])))
  await expect(preview(page).getByLabel('Team members')).toContainText('Grace Hopper')
  await preview(page).getByLabel('Compact view').check()
  await page.waitForTimeout(1500)
  await expect(log).toContainText('1 request')
  await expect(log).toContainText('GET /api/team · 200')
  await expect(page.getByTestId('effect-1')).toContainText('ran 1×')
})

test('all seven effects lessons can be completed in order in the live browser', async ({ page }) => {
  test.setTimeout(180_000)
  await page.goto('./#/lesson/10')
  for (let id = 10; id <= 16; id++) {
    await expectPreviewReady(page)
    await setCode(page, solutions[id](starter(files[id])))
    if (id === 11) {
      await preview(page).getByRole('button', { name: 'Grace' }).click()
      await expect(preview(page).getByLabel('Profile')).toContainText('Grace Hopper')
    }
    if (id === 13) {
      await preview(page).getByRole('button', { name: 'Start' }).click()
      await expect(preview(page).getByLabel('Elapsed time')).toHaveText('00:01', { timeout: 5_000 })
      await preview(page).getByRole('button', { name: 'Pause' }).click()
      await expect(page.getByTestId('effect-1')).toContainText('cleaned up 1×')
    }
    if (id === 14) {
      await preview(page).getByLabel('Room').selectOption('design')
      const log = preview(page).getByLabel('Connection log')
      await expect(log).toContainText('Disconnected from #general')
      await expect(log).toContainText('Connected to #design')
      await expect(log).toContainText('1 open')
    }
    await runChecks(page)
    await expect(page.getByTestId('status-pill')).toContainText('✓')
    await expect(page.getByTestId('next-lesson')).toBeEnabled()
    await page.getByTestId('next-lesson').click()
    if (id < 16) await expect(page).toHaveURL(new RegExp(`#\\/lesson\\/${id + 1}$`))
  }
  await expect(page).toHaveURL(/#\/course\/effects$/)
  await expect(page.getByText('All seven lessons complete.')).toBeVisible()
  await page.goto('./')
  await expect(page.getByTestId('course-effects')).toContainText('7 of 7 complete')
  await expect(page.getByTestId('course-state')).toContainText('0 of 9 complete')
})
