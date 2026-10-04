import type { CheckContext } from './context'
import type { CheckDef } from './run'

const layout = (ctx: CheckContext) => ctx.text(ctx.need(ctx.labelled('Layout'), 'Keep the layout line (aria-label="Layout").'))
const toggle = (ctx: CheckContext, name: string) => ctx.click(ctx.need(ctx.button(name), `Keep the ${name} button.`))

export const lesson12: CheckDef[] = [
  {
    id: 'follows-resize',
    async run(ctx) {
      await ctx.resizeWindow(360)
      ctx.expect(
        /\b360px\b/.test(layout(ctx)) && /compact/i.test(layout(ctx)),
        `The window became 360px wide but the panel still says "${layout(ctx)}". Subscribe to the window's "resize" event and store window.innerWidth.`,
      )
      await ctx.resizeWindow(900)
      ctx.expect(/\b900px\b/.test(layout(ctx)) && /full/i.test(layout(ctx)), `At 900px the panel should use the full layout, but says "${layout(ctx)}".`)
    },
  },
  {
    id: 'one-listener',
    async run(ctx) {
      ctx.expect(ctx.windowListeners('resize') === 1, `MemberList should register exactly one resize listener, but ${ctx.windowListeners('resize')} are registered.`)
      await ctx.resizeWindow(500)
      await ctx.resizeWindow(380)
      ctx.expect(ctx.windowListeners('resize') === 1, `After a few resizes there are ${ctx.windowListeners('resize')} resize listeners. Remove the old one before adding another.`)
    },
  },
  {
    id: 'removes-listener',
    async run(ctx) {
      ctx.expect(ctx.windowListeners('resize') === 1, 'Add a resize listener first, then remove it in the cleanup.')
      await toggle(ctx, 'Hide members')
      ctx.expect(
        ctx.windowListeners('resize') === 0,
        'The member list is gone but its resize listener is still attached to window. Return a cleanup that calls window.removeEventListener with the same function.',
      )
      await toggle(ctx, 'Show members')
      await toggle(ctx, 'Hide members')
      ctx.expect(ctx.windowListeners('resize') === 0, 'Showing and hiding the list again left a listener behind.')
    },
  },
]
