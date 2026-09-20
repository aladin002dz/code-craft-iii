import type { CheckContext } from './context'
import type { CheckDef } from './run'

const slider = (ctx: CheckContext) => ctx.need(ctx.field('Volume slider'), 'Keep the slider (aria-label="Volume slider").')
const number = (ctx: CheckContext) => ctx.need(ctx.field('Volume number'), 'Keep the number field (aria-label="Volume number").')

export const lesson5: CheckDef[] = [
  {
    id: 'slider-updates-number',
    async run(ctx) {
      await ctx.type(slider(ctx), '72')
      ctx.expect(slider(ctx).value === '72', 'The slider should move to the value it was given.')
      ctx.expect(number(ctx).value === '72', `The slider is at 72 but the number field shows ${number(ctx).value}. Both controls should read the same state.`)
    },
  },
  {
    id: 'number-updates-slider',
    async run(ctx) {
      await ctx.type(number(ctx), '25')
      ctx.expect(number(ctx).value === '25', 'The number field should show what was typed.')
      ctx.expect(slider(ctx).value === '25', `The number field says 25 but the slider is at ${slider(ctx).value}. Both controls should read the same state.`)
    },
  },
  {
    id: 'single-source',
    async run(ctx) {
      const stored = ctx.allState().length
      ctx.expect(stored === 1, `React is storing ${stored} values for one setting. Keep just one volume value and use it in both inputs.`)
    },
  },
]
