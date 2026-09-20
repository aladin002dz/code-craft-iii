import starter from './starters/2-cart-quantity.jsx?raw'
import type { Lesson } from './types'

export const lesson2: Lesson = {
  id: 2,
  topic: 'useState and setters',
  title: 'Add quantity controls',
  project: 'Shopping cart',
  prerequisite: 1,
  request: 'The cart item shows a quantity, but the + and − buttons do nothing. Give the item real, remembered quantity that starts at 1.',
  steps: [
    'Replace the plain quantity variable with state that starts at 1.',
    'Make + add one to the quantity.',
    'Make − remove one, but never let the quantity drop below 0.',
    'Run the checks.',
  ],
  concept:
    'useState returns the current value and a setter: const [quantity, setQuantity] = useState(1). A plain variable is forgotten on the next render; state is remembered. Call the setter to ask React for a new render with the new value.',
  objectives: [
    { id: 'starts-at-one', label: 'Quantity is state that starts at 1' },
    { id: 'increase', label: '+ adds one' },
    { id: 'decrease', label: '− removes one and stops at 0' },
  ],
  hints: [
    'A variable declared with const quantity = 1 is the same on every render, and nothing can change it. Which hook remembers a value between renders?',
    'useState(1) gives you an array of two things: the current value and a function that changes it. Destructure them: const [quantity, setQuantity] = useState(1);',
    'In increase, call setQuantity with the new value. In decrease, only do it when quantity is greater than 0.',
  ],
  filename: 'CartItem.jsx',
  starter,
  focus: {
    edit: [/const quantity = /, /function increase/, /function decrease/],
    related: [/useState\(/, /\{quantity\}/],
  },
}
