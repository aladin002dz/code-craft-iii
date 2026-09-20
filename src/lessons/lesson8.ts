import starter from './starters/8-cart-summary.jsx?raw'
import type { Lesson } from './types'

export const lesson8: Lesson = {
  id: 8,
  topic: 'Derived state',
  title: 'Calculate the subtotal',
  project: 'Shopping cart',
  prerequisite: 7,
  request: 'The subtotal is stuck at $50 when the quantity changes. Fix it without keeping two values in sync.',
  steps: [
    'Click Add one and watch the quantity and subtotal disagree.',
    'Ask: can the subtotal be worked out from something React already stores?',
    'Calculate it during rendering instead of storing it.',
    'Run the checks.',
  ],
  concept:
    'If a value can be computed from existing state and props, compute it while rendering instead of storing it. Stored copies must be updated everywhere and can drift out of date. Here, subtotal is always quantity × unitPrice, so quantity is the only state.',
  objectives: [
    { id: 'initial-subtotal', label: 'Two lamps at $25 show a $50 subtotal' },
    { id: 'follows-quantity', label: 'The subtotal follows the quantity' },
    { id: 'no-duplicate-state', label: 'Only the quantity is stored' },
  ],
  hints: [
    'There are two state values, but the subtotal is completely determined by the quantity. What if it were not state at all?',
    'Remove the subtotal state and its setter. In the component body, write a normal variable that calculates it.',
    'const subtotal = quantity * unitPrice; goes above the return, and addOne only needs to update the quantity.',
  ],
  filename: 'CartSummary.jsx',
  starter,
  focus: {
    edit: [/const \[subtotal/, /function addOne/],
    related: [/\$\{subtotal\}/],
  },
}
