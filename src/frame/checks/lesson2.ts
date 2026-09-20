import type { CheckContext } from './context'
import type { CheckDef } from './run'

const shown = (ctx: CheckContext) => Number(ctx.text(ctx.need(ctx.labelled('Quantity'), 'Keep the quantity display (aria-label="Quantity").')))
const plus = (ctx: CheckContext) => ctx.need(ctx.button('Increase quantity'), 'Keep the + button (aria-label="Increase quantity").')
const minus = (ctx: CheckContext) => ctx.need(ctx.button('Decrease quantity'), 'Keep the − button (aria-label="Decrease quantity").')

export const lesson2: CheckDef[] = [
  {
    id: 'starts-at-one',
    async run(ctx) {
      ctx.expect(shown(ctx) === 1, 'The quantity should start at 1.')
      ctx.expect(ctx.allState().includes(1), 'The quantity is not stored in state yet. Use useState(1) so React can remember it.')
    },
  },
  {
    id: 'increase',
    async run(ctx) {
      await ctx.click(plus(ctx))
      ctx.expect(shown(ctx) === 2, `After clicking +, the quantity should be 2 but it is ${shown(ctx)}. Call setQuantity inside increase.`)
      await ctx.click(plus(ctx))
      ctx.expect(shown(ctx) === 3, 'Each click on + should add one more. The second click should make it 3.')
    },
  },
  {
    id: 'decrease',
    async run(ctx) {
      await ctx.click(plus(ctx))
      await ctx.click(plus(ctx))
      ctx.expect(shown(ctx) === 3, 'Get + working first: two clicks should make the quantity 3.')
      await ctx.click(minus(ctx))
      ctx.expect(shown(ctx) === 2, `After clicking −, the quantity should be 2 but it is ${shown(ctx)}. Call setQuantity inside decrease.`)
      for (let clicks = 0; clicks < 4; clicks++) await ctx.click(minus(ctx))
      ctx.expect(shown(ctx) === 0, `Clicking − past zero should leave the quantity at 0, but it shows ${shown(ctx)}. Only subtract when quantity is greater than 0.`)
    },
  },
]
