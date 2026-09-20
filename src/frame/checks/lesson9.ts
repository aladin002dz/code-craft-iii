import type { CheckContext } from './context'
import type { CheckDef } from './run'

const rowLabels = (ctx: CheckContext) => ctx.findAll('.task-list li label').map(label => ctx.text(label))

export const lesson9: CheckDef[] = [
  {
    id: 'swap-reorders',
    async run(ctx) {
      await ctx.click(ctx.need(ctx.button('Swap order'), 'Keep the Swap order button.'))
      const order = rowLabels(ctx)
      ctx.expect(order[0] === 'Task B' && order[1] === 'Task A', `Swap order should list Task B, then Task A, but the rows are: ${order.join(', ')}.`)
    },
  },
  {
    id: 'rows-keep-edits',
    async run(ctx) {
      const taskA = ctx.need(ctx.field('Task A'), 'Keep the Task A field.')
      await ctx.type(taskA, 'Review launch PR')
      await ctx.click(ctx.need(ctx.button('Swap order'), 'Keep the Swap order button.'))
      const after = ctx.need(ctx.field('Task A'), 'Task A disappeared after the swap.')
      ctx.expect(
        after.value === 'Review launch PR',
        `Task A now shows "${after.value}" instead of the text you typed. The row state stayed at its position; give each row a key that identifies the task, such as task.id.`,
      )
      const taskB = ctx.need(ctx.field('Task B'), 'Task B disappeared after the swap.')
      ctx.expect(taskB.value === 'Ship update', `Task B should still show "Ship update" but shows "${taskB.value}".`)
    },
  },
  {
    id: 'reset-on-person-change',
    async run(ctx) {
      const commentFor = (name: string) => ctx.field(`Comment for ${name}`)
      await ctx.type(ctx.need(commentFor('Ada'), 'Keep the comment field ("Comment for Ada").'), 'Nice work')
      await ctx.click(ctx.need(ctx.button('Grace'), 'Keep the Grace button.'))
      const grace = ctx.need(commentFor('Grace'), 'After choosing Grace the field should read "Comment for Grace".')
      ctx.expect(
        grace.value === '',
        `Grace's comment box still contains "${grace.value}", left over from Ada. Give CommentForm a key that changes with the person so React starts it fresh.`,
      )
    },
  },
]
