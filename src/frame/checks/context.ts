// Helpers checks use to drive and inspect the learner's rendered component.
// Checks interact the way a user would (find by visible text or label, click, type)
// so any correct implementation passes, regardless of how it is written.

import type { EffectRecord } from '../effects'
import { readRawState } from '../inspect'
import { realDelay, type Environment } from './environment'

export class CheckFailure extends Error {}

export type Query = string | RegExp

export type CheckContext = {
  container: HTMLElement
  /** First element matching a CSS selector. */
  find(selector: string): HTMLElement | null
  findAll(selector: string): HTMLElement[]
  /** Buttons matched by accessible name (aria-label, otherwise text). */
  button(name: Query): HTMLElement | null
  /** Inputs matched by aria-label, an associated <label>, or placeholder. */
  field(name: Query): HTMLInputElement | null
  /** Any element matched by aria-label. */
  labelled(name: Query): HTMLElement | null
  text(element: Element | null | undefined): string
  click(element: HTMLElement): Promise<void>
  type(element: HTMLInputElement, value: string): Promise<void>
  settle(): Promise<void>
  expect(condition: unknown, message: string): void
  /** Like `expect`, for values that may be missing. */
  need<T>(value: T | null | undefined, message: string): T
  /** State values held by React for every component that uses useState/useReducer. */
  state(): { component: string; key: string | null; values: unknown[] }[]
  /** Flat list of the state values of components with this name. */
  stateOf(component: string): unknown[]
  /** Flat list of every state value. */
  allState(): unknown[]
  /** Deep-freeze current state so accidental mutation throws instead of silently working. */
  freezeState(): void
  /** Effect counts of components with this name, or of every component. */
  effects(component?: string): EffectRecord[]
  /** Move the check's fake clock forward; timers due in that time run. */
  wait(ms: number): Promise<void>
  /** Timeouts and intervals still scheduled with the fake clock. */
  pendingTimers(): number
  windowListeners(type: string): number
  resizeWindow(width: number): Promise<void>
}

const clean = (value: string | null | undefined) => (value ?? '').replace(/\s+/g, ' ').trim()

function matches(name: string, query: Query) {
  return typeof query === 'string' ? name.toLowerCase().includes(query.toLowerCase()) : query.test(name)
}

function accessibleName(element: Element) {
  return clean(element.getAttribute('aria-label') ?? element.textContent)
}

function deepFreeze(value: unknown) {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    Object.freeze(value)
    Object.values(value).forEach(deepFreeze)
  }
}

export function createCheckContext(container: HTMLElement, pendingError: () => string | null, environment: Environment): CheckContext {
  const findAll = (selector: string) => Array.from(container.querySelectorAll<HTMLElement>(selector))

  const ctx: CheckContext = {
    container,
    find: selector => container.querySelector<HTMLElement>(selector),
    findAll,
    button: name => findAll('button, [role="button"]').find(el => matches(accessibleName(el), name)) ?? null,
    field(name) {
      const fields = findAll('input, textarea, select') as HTMLInputElement[]
      return (
        fields.find(el => {
          const labels = Array.from(el.labels ?? []).map(label => clean(label.textContent))
          const candidates = [el.getAttribute('aria-label'), el.placeholder, ...labels]
          return candidates.some(candidate => candidate && matches(clean(candidate), name))
        }) ?? null
      )
    },
    labelled: name => {
      const elements = findAll('[aria-label]')
      if (typeof name === 'string') {
        const exact = elements.find(el => clean(el.getAttribute('aria-label')).toLowerCase() === name.toLowerCase())
        if (exact) return exact
      }
      return elements.find(el => matches(clean(el.getAttribute('aria-label')), name)) ?? null
    },
    text: element => clean(element?.textContent),
    async settle() {
      await realDelay(30)
      const error = pendingError()
      if (error) throw new CheckFailure(`Your code threw an error: ${error}`)
    },
    async click(element) {
      element.click()
      await ctx.settle()
    },
    async type(element, value) {
      const prototype = Object.getPrototypeOf(element) as object
      const setter = Object.getOwnPropertyDescriptor(prototype, 'value')?.set
      setter?.call(element, value)
      element.dispatchEvent(new Event('input', { bubbles: true }))
      element.dispatchEvent(new Event('change', { bubbles: true }))
      await ctx.settle()
    },
    expect(condition, message) {
      if (!condition) throw new CheckFailure(message)
    },
    need(value, message) {
      if (value === null || value === undefined) throw new CheckFailure(message)
      return value
    },
    state: () => readRawState(),
    stateOf: component => readRawState().filter(entry => entry.component === component).flatMap(entry => entry.values),
    allState: () => readRawState().flatMap(entry => entry.values),
    freezeState() {
      readRawState().forEach(entry => entry.values.forEach(deepFreeze))
    },
    effects: component => readRawState().filter(entry => !component || entry.component === component).flatMap(entry => entry.effects),
    async wait(ms) {
      await environment.advance(ms)
      await ctx.settle()
    },
    pendingTimers: () => environment.pendingTimers(),
    windowListeners: type => environment.windowListeners(type),
    async resizeWindow(width) {
      environment.resizeWindow(width)
      await ctx.settle()
    },
  }
  return ctx
}
