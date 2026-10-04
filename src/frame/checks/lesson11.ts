import type { CheckContext } from './context'
import type { CheckDef } from './run'

const choose = (ctx: CheckContext, name: string) => ctx.click(ctx.need(ctx.button(name), `Keep the ${name} button.`))
const shown = (ctx: CheckContext) => ctx.text(ctx.labelled('Profile')?.querySelector('h3'))

export const lesson11: CheckDef[] = [
  {
    id: 'loads-first',
    async run(ctx) {
      await ctx.wait(2000)
      ctx.expect(shown(ctx) === 'Linus Torvalds', `When the panel opens it should load Linus Torvalds, but it shows "${shown(ctx) || 'nothing'}".`)
    },
  },
  {
    id: 'follows-person',
    async run(ctx) {
      await ctx.wait(2000)
      await choose(ctx, 'Grace')
      await ctx.wait(2000)
      ctx.expect(
        shown(ctx) === 'Grace Hopper',
        `After choosing Grace the panel should show Grace Hopper, but shows "${shown(ctx) || 'nothing'}". The effect reads personId, so personId belongs in its dependency array.`,
      )
    },
  },
  {
    id: 'shows-loading',
    async run(ctx) {
      await ctx.wait(2000)
      await choose(ctx, 'Ada')
      ctx.expect(
        shown(ctx) === '',
        `While Ada's profile loads, the panel still shows "${shown(ctx)}". Run the effect again when personId changes, and clear the old profile at its start.`,
      )
    },
  },
  {
    id: 'ignores-stale',
    async run(ctx) {
      await ctx.wait(2000)
      await choose(ctx, 'Ada')
      await choose(ctx, 'Grace')
      await ctx.wait(2000)
      ctx.expect(
        shown(ctx) === 'Grace Hopper',
        shown(ctx) === 'Ada Lovelace'
          ? 'Grace is selected, but the panel shows Ada Lovelace. Ada’s slow response arrived last and overwrote Grace’s. In the cleanup, mark the old request as ignored and skip setProfile for it.'
          : `Grace is selected, but the panel shows "${shown(ctx) || 'nothing'}". Make the effect follow personId first, then ignore responses from requests that are out of date.`,
      )
    },
  },
]
