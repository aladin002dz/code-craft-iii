import starter from './starters/4-cart-panel.jsx?raw'
import type { Lesson } from './types'

export const lesson4: Lesson = {
  id: 4,
  topic: 'State vs. props',
  title: 'Pass the right props',
  project: 'Shopping cart',
  prerequisite: 3,
  request: 'The order panel knows the quantity, but the cart item it renders always shows 0 and its button does nothing. Connect them.',
  steps: [
    'Find which component owns the quantity state, and which only displays it.',
    'Pass the name, quantity and the add function from the parent to CartItem.',
    'Use those props inside CartItem instead of the hard-coded values.',
    'Run the checks.',
  ],
  concept:
    'State belongs to one component: the one that needs to change it. Children receive values as props, and receive functions as props when they need to ask the parent to change something. A prop is read-only for the child; the parent decides what it becomes.',
  objectives: [
    { id: 'shows-parent-value', label: 'CartItem shows the name and quantity it is given' },
    { id: 'button-updates-parent', label: 'Add one asks the parent to update its state' },
    { id: 'parent-owns-state', label: 'Only CartPanel stores the quantity' },
  ],
  hints: [
    'CartPanel renders <CartItem /> with no props at all, so CartItem has nothing to show. What does it need from its parent?',
    'Pass values like attributes: <CartItem name="Desk lamp" quantity={quantity} onAdd={addOne} />. Then read them in CartItem instead of the hard-coded 0.',
    'In CartItem, render {quantity} and give the button onClick={onAdd}. Do not add a new useState there: the parent already owns the quantity.',
  ],
  filename: 'CartPanel.jsx',
  starter,
  focus: {
    edit: [/function CartItem/, /<CartItem/],
    related: [/useState\(2\)/],
  },
}
