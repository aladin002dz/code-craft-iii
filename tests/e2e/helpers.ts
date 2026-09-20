import { expect, type Page } from '@playwright/test'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

export const starter = (file: string) => readFileSync(join(process.cwd(), 'src/lessons/starters', file), 'utf8')

/** The learner-visible preview frame. */
export const preview = (page: Page) => page.frameLocator('iframe.preview-frame:not(.pending)')

export const editor = (page: Page) => page.getByRole('textbox', { name: /Code editor/ })

/** Replace the editor content the way a paste would: real editor, real input events. */
export async function setCode(page: Page, code: string, { rendered = true } = {}) {
  await editor(page).click()
  await page.keyboard.press('Control+A')
  await page.keyboard.insertText(code)
  // The preview follows the editor after a short delay; wait until it shows this code.
  // Code that cannot render (syntax error, endless loop) never catches up, so callers opt out.
  if (rendered) await expect(page.locator('.preview-stage')).toHaveAttribute('data-fresh', 'true', { timeout: 30_000 })
}

export async function runChecks(page: Page) {
  await page.getByTestId('run-checks').click()
  await expect(page.getByTestId('run-checks')).toHaveText('Run checks')
}

export const objective = (page: Page, id: string) => page.getByTestId(`objective-${id}`)

export async function expectPreviewReady(page: Page) {
  // Starting a sandboxed frame can take a few seconds when the machine is busy.
  await expect(page.locator('.preview-stage')).toHaveAttribute('data-ready', 'true', { timeout: 30_000 })
}
