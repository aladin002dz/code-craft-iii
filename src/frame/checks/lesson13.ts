import type { CheckContext } from './context'
import type { CheckDef } from './run'

const clock = (ctx: CheckContext) => ctx.text(ctx.need(ctx.labelled('Elapsed time'), 'Keep the clock (aria-label="Elapsed time").'))
const toggle = (ctx: CheckContext, name: 'Start' | 'Pause') => ctx.click(ctx.need(ctx.button(name), `Keep the ${name} button.`))

export const lesson13: CheckDef[] = [
  {
    id: 'ticks-while-running',
    async run(ctx) {
      await toggle(ctx, 'Start')
      await ctx.wait(3000)
      ctx.expect(clock(ctx) === '00:03', `After three seconds running, the clock should show 00:03, but shows ${clock(ctx)}.`)
    },
  },
  {
    id: 'pause-stops',
    async run(ctx) {
      await toggle(ctx, 'Start')
      await ctx.wait(2000)
      await toggle(ctx, 'Pause')
      await ctx.wait(3000)
      ctx.expect(
        clock(ctx) === '00:02',
        `Pause should stop the clock at 00:02, but it kept counting to ${clock(ctx)}. The interval is still running: return a cleanup function that calls clearInterval.`,
      )
    },
  },
  {
    id: 'one-interval',
    async run(ctx) {
      await toggle(ctx, 'Start')
      await toggle(ctx, 'Pause')
      await toggle(ctx, 'Start')
      await ctx.wait(2000)
      ctx.expect(
        clock(ctx) === '00:02',
        `After Start, Pause, Start and two seconds, the clock should show 00:02, but shows ${clock(ctx)}. Each Start added another interval; clean up the old one before the effect runs again.`,
      )
      ctx.expect(ctx.pendingTimers() === 1, `Exactly one interval should be running, but ${ctx.pendingTimers()} are.`)
    },
  },
  {
    id: 'cleans-up-on-close',
    async run(ctx) {
      await toggle(ctx, 'Start')
      await ctx.wait(1000)
      await ctx.click(ctx.need(ctx.button('Close timer'), 'Keep the Close timer button.'))
      ctx.expect(
        ctx.pendingTimers() === 0,
        'The timer was closed but its interval is still running in the background. React runs your cleanup when the component goes away, so clear the interval there.',
      )
    },
  },
]
