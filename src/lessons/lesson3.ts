import starter from './starters/3-cart-actions.jsx?raw'
import type { Lesson } from './types'

export const lesson3: Lesson = {
  id: 3,
  topic: 'Updates and previous state',
  title: 'Fix the Add 3 action',
  project: 'Shopping cart',
  prerequisite: 2,
  request: 'Add 1 works, but Add 3 only adds one item. Make it add exactly three without breaking Add 1.',
  steps: [
    'Answer the prediction, then try Add 3 in the preview.',
    'Look at how addThree reuses addOne, and what quantity each call sees.',
    'Change how the update is written so calls in the same click build on each other.',
    'Run the checks.',
  ],
  concept:
    'Each render sees one snapshot of state. Inside a single click, quantity is the same number every time you read it, so three setQuantity(quantity + 1) calls all queue "set to 1". Pass an updater function, setQuantity(previous => previous + 1), and React feeds each update the result of the one before it.',
  prediction: {
    question: 'The cart shows 0 items. A customer clicks Add 3. What does the cart show afterwards?',
    code: 'function addOne() {\n  setQuantity(quantity + 1);\n}\n\nfunction addThree() {\n  addOne();\n  addOne();\n  addOne();\n}',
    options: ['3', '1', '0'],
    answer: 1,
    explanation:
      'All three calls run during the same click, so each reads the same quantity, 0, and queues "set to 1". React applies the queue in order and ends at 1. Setting state does not change the quantity variable in the middle of the handler.',
  },
  objectives: [
    { id: 'adds-three', label: 'Add 3 adds exactly three' },
    { id: 'adds-one', label: 'Add 1 still adds one' },
  ],
  hints: [
    'Add 3 calls addOne three times in a row. What value of quantity does each of those calls see?',
    'A setter can take a function instead of a value. React calls it with the latest queued value: setQuantity(previous => ...).',
    'Inside addOne, use the previous value: setQuantity(previous => previous + 1);',
  ],
  filename: 'CartActions.jsx',
  starter,
  focus: {
    edit: [/function addOne/],
    related: [/function addThree/],
  },
}
