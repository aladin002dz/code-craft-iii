import type { CheckContext } from './context'
import type { CheckDef } from './run'

const search = (ctx: CheckContext) => ctx.need(ctx.field('Search tasks'), 'Keep the search field (aria-label="Search tasks").')
const visible = (ctx: CheckContext) => ctx.findAll('.task-list li').map(item => ctx.text(item))

export const lesson7: CheckDef[] = [
  {
    id: 'filters-list',
    async run(ctx) {
      await ctx.type(search(ctx), 'Release')
      const shown = visible(ctx)
      ctx.expect(shown.length !== 3, 'The list still shows every task. TaskList needs to know what was typed, so its parent has to hold the search text.')
      ctx.expect(shown.length === 1 && shown[0] === 'Write release notes', `Searching "Release" should leave only "Write release notes", but the list shows: ${shown.join(', ') || 'nothing'}.`)
    },
  },
  {
    id: 'clearing-restores',
    async run(ctx) {
      await ctx.type(search(ctx), 'demo')
      await ctx.type(search(ctx), '')
      const shown = visible(ctx)
      ctx.expect(shown.length === 3, `With an empty search every task should show, but only ${shown.length} do.`)
    },
  },
  {
    id: 'parent-owns-query',
    async run(ctx) {
      ctx.expect(
        ctx.stateOf('SearchBoard').some(value => typeof value === 'string'),
        'The search text should be state in SearchBoard, the closest parent of both SearchBox and TaskList.',
      )
      ctx.expect(ctx.stateOf('SearchBox').length === 0, 'SearchBox should no longer keep its own copy of the text. Receive it as a prop instead.')
    },
  },
]
