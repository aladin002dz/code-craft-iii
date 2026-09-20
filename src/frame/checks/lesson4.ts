import type { CheckContext } from './context'
import type { CheckDef } from './run'

const childQuantity = (ctx: CheckContext) => Number(ctx.text(ctx.need(ctx.labelled('Quantity'), 'Keep the quantity display in CartItem (aria-label="Quantity").')))
const addButton = (ctx: CheckContext) => ctx.need(ctx.button('Add one'), 'Keep the Add one button in CartItem.')

export const lesson4: CheckDef[] = [
  {
    id: 'shows-parent-value',
    async run(ctx) {
      ctx.expect(ctx.text(ctx.container).includes('Desk lamp'), 'CartItem should show the name it is given ("Desk lamp"). Pass name from CartPanel.')
      const shown = childQuantity(ctx)
      ctx.expect(shown === 2, `CartPanel's quantity is 2, but CartItem shows ${shown}. Pass quantity as a prop and render it.`)
    },
  },
  {
    id: 'button-updates-parent',
    async run(ctx) {
      await ctx.click(addButton(ctx))
      const parent = ctx.stateOf('CartPanel')[0]
      ctx.expect(parent === 3, 'Clicking Add one did not change CartPanel\'s quantity. Pass addOne down as onAdd and call it from the button.')
      ctx.expect(childQuantity(ctx) === 3, 'The parent quantity changed, but CartItem still shows the old value. Render the quantity prop.')
    },
  },
  {
    id: 'parent-owns-state',
    async run(ctx) {
      ctx.expect(ctx.stateOf('CartPanel').includes(2), 'CartPanel should keep the quantity in state.')
      ctx.expect(
        ctx.stateOf('CartItem').length === 0,
        'CartItem should not keep its own copy of the quantity. Keep one owner (CartPanel) and pass the value down as a prop.',
      )
    },
  },
]
