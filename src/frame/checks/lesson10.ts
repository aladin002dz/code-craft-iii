import { requestCount } from '../supplied/network'
import type { CheckContext } from './context'
import type { CheckDef } from './run'

const names = (ctx: CheckContext) => ctx.findAll('.member-list li strong').map(item => ctx.text(item))
const compact = (ctx: CheckContext) => ctx.need(ctx.field('Compact view'), 'Keep the "Compact view" checkbox.')

export const lesson10: CheckDef[] = [
  {
    id: 'shows-loading',
    async run(ctx) {
      ctx.expect(/loading/i.test(ctx.text(ctx.container)), 'Before the response arrives, the directory should say Loading….')
      ctx.expect(names(ctx).length === 0, 'The team list should not appear before the server has answered.')
    },
  },
  {
    id: 'shows-team',
    async run(ctx) {
      await ctx.wait(1000)
      const shown = names(ctx)
      ctx.expect(
        shown.join(', ') === 'Ada Lovelace, Grace Hopper, Linus Torvalds',
        `After the response the list should show Ada Lovelace, Grace Hopper and Linus Torvalds, but shows: ${shown.join(', ') || 'nothing'}. Request /api/team and store the JSON with setMembers.`,
      )
    },
  },
  {
    id: 'fetches-once',
    async run(ctx) {
      await ctx.wait(3000)
      await ctx.click(compact(ctx))
      await ctx.click(compact(ctx))
      await ctx.wait(1000)
      const count = requestCount('/api/team')
      const inEffect = ctx.effects('TeamDirectory').some(effect => effect.runs > 0)
      ctx.expect(count > 0, 'The team was never requested. Call fetch(\'/api/team\') inside useEffect.')
      ctx.expect(
        count === 1,
        inEffect
          ? `The team was requested ${count} times. The effect runs after every render; add an empty dependency array [] so it runs only after the first.`
          : `The team was requested ${count} times. Code in the component body runs on every render, and each response causes another render. Move the request into useEffect with [].`,
      )
      ctx.expect(names(ctx).length === 3, 'The request was sent once, but the list is not showing the team.')
    },
  },
]
