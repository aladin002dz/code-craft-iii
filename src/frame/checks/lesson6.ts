import type { CheckContext } from './context'
import type { CheckDef } from './run'

const titles = (ctx: CheckContext) => ctx.findAll('.task-list li .title').map(item => ctx.text(item))

export const lesson6: CheckDef[] = [
  {
    id: 'adds-task',
    async run(ctx) {
      // Frozen state turns an in-place change (push, splice...) into an error instead of a silent bug.
      ctx.freezeState()
      const input = ctx.need(ctx.field('New task'), 'Keep the "New task" field.')
      await ctx.type(input, 'Prepare demo')
      await ctx.click(ctx.need(ctx.button('Add'), 'Keep the Add button.'))
      const after = titles(ctx)
      ctx.expect(after.length === 3, `Add should put a third task in the list, but there are ${after.length}. Set state to a new array that includes the new task.`)
      ctx.expect(after[2] === 'Prepare demo', 'The new task should be added at the end of the list.')
      ctx.expect(ctx.need(ctx.field('New task'), 'The field disappeared.').value === '', 'The new-task field should be cleared after adding.')
    },
  },
  {
    id: 'removes-task',
    async run(ctx) {
      ctx.freezeState()
      await ctx.click(ctx.need(ctx.button('Remove Write release notes'), 'Keep the × button (aria-label "Remove <task title>").'))
      const after = titles(ctx)
      ctx.expect(after.length === 1, `Removing a task should leave 1 task, but there are ${after.length}. Keep every task except the one with this id.`)
      ctx.expect(after[0] === 'Review pull request', 'Only "Write release notes" should be removed.')
    },
  },
  {
    id: 'reorders-tasks',
    async run(ctx) {
      ctx.freezeState()
      await ctx.click(ctx.need(ctx.button('Move Review pull request up'), 'Keep the ↑ buttons (aria-label "Move <task title> up").'))
      let order = titles(ctx)
      ctx.expect(
        order.join('|') === 'Review pull request|Write release notes',
        `Moving "Review pull request" up should put it first, but the order is: ${order.join(', ')}. Both tasks must stay in the list.`,
      )
      await ctx.click(ctx.need(ctx.button('Move Review pull request down'), 'Keep the ↓ buttons (aria-label "Move <task title> down").'))
      order = titles(ctx)
      ctx.expect(order.join('|') === 'Write release notes|Review pull request', 'Moving it back down should restore the original order.')
    },
  },
]
