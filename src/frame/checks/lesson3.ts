import type { CheckContext } from './context'
import type { CheckDef } from './run'

const items = (ctx: CheckContext) => Number(ctx.text(ctx.need(ctx.labelled('Items in cart'), 'Keep the item count (aria-label="Items in cart").')))

export const lesson3: CheckDef[] = [
  {
    id: 'adds-three',
    async run(ctx) {
      const add3 = ctx.need(ctx.button('Add 3'), 'Keep the Add 3 button.')
      ctx.expect(items(ctx) === 0, 'The cart should start empty.')
      await ctx.click(add3)
      const after = items(ctx)
      ctx.expect(
        after !== 1,
        'Add 3 added only 1. The three calls all started from the same quantity, so they queued the same result. Let each update build on the one before it.',
      )
      ctx.expect(after === 3, `Add 3 should leave 3 items in an empty cart, but there are ${after}.`)
      await ctx.click(add3)
      ctx.expect(items(ctx) === 6, 'A second Add 3 should bring the cart to 6 items.')
    },
  },
  {
    id: 'adds-one',
    async run(ctx) {
      const add1 = ctx.need(ctx.button('Add 1'), 'Keep the Add 1 button.')
      await ctx.click(add1)
      ctx.expect(items(ctx) === 1, 'Add 1 should add exactly one item.')
      await ctx.click(add1)
      ctx.expect(items(ctx) === 2, 'A second Add 1 should bring the cart to 2 items.')
    },
  },
]
