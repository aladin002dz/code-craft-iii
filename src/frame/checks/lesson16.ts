import type { CheckContext } from './context'
import type { CheckDef } from './run'

const hideDone = (ctx: CheckContext) => ctx.need(ctx.field('Hide completed'), 'Keep the "Hide completed" checkbox.')
const rows = (ctx: CheckContext) => ctx.findAll('.task-list li').map(item => ctx.text(item))
const taskBox = (ctx: CheckContext, title: string) => ctx.need(ctx.field(title), `Keep the checkbox for "${title}".`)

export const lesson16: CheckDef[] = [
  {
    id: 'hides-done',
    async run(ctx) {
      await ctx.click(hideDone(ctx))
      const shown = rows(ctx)
      ctx.expect(
        shown.length === 2 && !shown.includes('Write release notes'),
        `With "Hide completed" on, only the two open tasks should show, but the list has: ${shown.join(', ') || 'nothing'}.`,
      )
    },
  },
  {
    id: 'follows-tasks',
    async run(ctx) {
      const box = taskBox(ctx, 'Review pull request')
      await ctx.click(box)
      ctx.expect(
        taskBox(ctx, 'Review pull request').checked,
        'Ticking "Review pull request" did not tick it. The visible list is a stale copy of tasks: calculate it from tasks during render.',
      )
      await ctx.click(hideDone(ctx))
      await ctx.click(taskBox(ctx, 'Record demo'))
      const shown = rows(ctx)
      ctx.expect(shown.length === 0, `With "Hide completed" on, ticking the last open task should hide it, but the list still shows: ${shown.join(', ')}.`)
    },
  },
  {
    id: 'no-copied-state',
    async run(ctx) {
      const arrays = ctx.stateOf('TaskFilter').filter(Array.isArray)
      ctx.expect(
        arrays.length === 1,
        'The visible tasks are still stored as a second copy in state. Remove visibleTasks state and its effect, and calculate the list while rendering.',
      )
      ctx.expect(
        ctx.effects('TaskFilter').length === 0,
        'TaskFilter still has an effect. Filtering only transforms data you already have, so it needs no effect.',
      )
    },
  },
]
