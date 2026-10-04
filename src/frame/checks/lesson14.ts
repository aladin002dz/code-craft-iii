import { openRooms } from '../supplied/chat'
import type { CheckContext } from './context'
import type { CheckDef } from './run'

const room = (ctx: CheckContext) => ctx.need(ctx.field('Room'), 'Keep the room picker (a <select> labelled "Room").')
const rooms = () => openRooms().map(name => `#${name}`).join(', ') || 'none'

export const lesson14: CheckDef[] = [
  {
    id: 'connects-on-open',
    async run(ctx) {
      ctx.expect(openRooms().includes('general'), `The chat should connect to #general when it opens. Open connections: ${rooms()}.`)
    },
  },
  {
    id: 'follows-room',
    async run(ctx) {
      await ctx.type(room(ctx), 'design')
      ctx.expect(
        openRooms().includes('design'),
        `After switching to #design there is no connection to #design (open: ${rooms()}). The effect reads roomId, so roomId belongs in its dependency array.`,
      )
    },
  },
  {
    id: 'one-connection',
    async run(ctx) {
      await ctx.type(room(ctx), 'design')
      await ctx.type(room(ctx), 'launch')
      const open = openRooms()
      ctx.expect(
        open.length === 1 && open[0] === 'launch',
        `After visiting #design and then #launch, only #launch should be open, but these are: ${rooms()}. Return a cleanup that disconnects, so React closes the old room before connecting to the new one.`,
      )
    },
  },
  {
    id: 'disconnects-on-leave',
    async run(ctx) {
      await ctx.click(ctx.need(ctx.button('Leave chat'), 'Keep the Leave chat button.'))
      ctx.expect(openRooms().length === 0, `After leaving the chat every connection should be closed, but these are open: ${rooms()}.`)
    },
  },
]
