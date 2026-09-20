import type { CheckContext } from './context'
import type { CheckDef } from './run'

const subtotal = (ctx: CheckContext) => ctx.text(ctx.need(ctx.labelled('Subtotal'), 'Keep the subtotal (aria-label="Subtotal").'))
const add = (ctx: CheckContext) => ctx.need(ctx.button('Add one'), 'Keep the Add one button.')

export const lesson8: CheckDef[] = [
  {
    id: 'initial-subtotal',
    async run(ctx) {
      ctx.expect(subtotal(ctx) === '$50', `Two lamps at $25 should show $50, but the subtotal is ${subtotal(ctx)}.`)
    },
  },
  {
    id: 'follows-quantity',
    async run(ctx) {
      await ctx.click(add(ctx))
      ctx.expect(subtotal(ctx) !== '$50', 'The subtotal is still $50 after adding a lamp. It has to change whenever the quantity does.')
      ctx.expect(subtotal(ctx) === '$75', `Three lamps at $25 should show $75, but the subtotal is ${subtotal(ctx)}.`)
      await ctx.click(add(ctx))
      ctx.expect(subtotal(ctx) === '$100', `Four lamps at $25 should show $100, but the subtotal is ${subtotal(ctx)}.`)
    },
  },
  {
    id: 'no-duplicate-state',
    async run(ctx) {
      const stored = ctx.allState().length
      ctx.expect(
        stored === 1,
        `React is storing ${stored} values, but only the quantity is needed. The subtotal can be calculated from it while rendering.`,
      )
    },
  },
]
