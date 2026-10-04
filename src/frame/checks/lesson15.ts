import type { CheckContext } from './context'
import type { CheckDef } from './run'

const edit = (ctx: CheckContext) => ctx.need(ctx.button('Edit'), 'Keep the Edit button.')
const field = (ctx: CheckContext) => ctx.field('Display name')

async function openEditor(ctx: CheckContext) {
  await ctx.click(edit(ctx))
  // Let short timers run too, so a focus call delayed some other way is judged by its result.
  await ctx.wait(100)
}

export const lesson15: CheckDef[] = [
  {
    id: 'opens-field',
    async run(ctx) {
      await openEditor(ctx)
      ctx.need(field(ctx), 'Clicking Edit should show the name field (aria-label="Display name").')
    },
  },
  {
    id: 'focuses-field',
    async run(ctx) {
      await openEditor(ctx)
      const input = ctx.need(field(ctx), 'Clicking Edit should show the name field (aria-label="Display name").')
      ctx.expect(
        input.ownerDocument.activeElement === input,
        'The name field appeared but the cursor is not in it. Call inputRef.current.focus() once the field is on the screen.',
      )
      await ctx.type(input, 'Ada King')
      await ctx.click(ctx.need(ctx.button('Save'), 'Keep the Save button.'))
      ctx.expect(ctx.text(ctx.container).includes('Ada King'), 'After saving, the new display name should be shown.')
    },
  },
  {
    id: 'focus-in-effect',
    async run(ctx) {
      await openEditor(ctx)
      const input = ctx.need(field(ctx), 'Clicking Edit should show the name field (aria-label="Display name").')
      ctx.expect(
        ctx.effects('DisplayName').some(effect => effect.runs > 0),
        'Focusing is a side effect: it changes something outside React’s output. Move it into useEffect so it runs after React has put the field on the screen.',
      )
      ctx.expect(input.ownerDocument.activeElement === input, 'The effect ran, but the field is not focused. Focus it when isEditing is true.')
    },
  },
]
