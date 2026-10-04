import starter from './starters/14-chat-room.jsx?raw'
import type { Lesson } from './types'

export const lesson14: Lesson = {
  id: 14,
  course: 'effects',
  topic: 'Connect to an external system',
  title: 'Connect to the selected room',
  project: 'Team chat',
  prerequisite: 13,
  request: 'Switching rooms changes the heading, but the chat stays connected to #general, and leaving the chat never disconnects. Keep exactly one connection, to the room on screen.',
  steps: [
    'Switch rooms and leave the chat while watching the server log.',
    'Find the effect in ChatRoom. Which value does it read but not list as a dependency?',
    'Add that dependency, and return a cleanup that disconnects.',
    'Run the checks.',
  ],
  concept:
    'Think of an effect as keeping something in sync with your props and state: "be connected to roomId". When roomId changes, React runs the cleanup for the old room, then the effect for the new one. Every reactive value the effect reads belongs in its dependency array.',
  objectives: [
    { id: 'connects-on-open', label: 'Opening the chat connects to #general' },
    { id: 'follows-room', label: 'Switching rooms connects to the new room' },
    { id: 'one-connection', label: 'Only one room is ever connected' },
    { id: 'disconnects-on-leave', label: 'Leaving the chat disconnects' },
  ],
  hints: [
    'The effect uses roomId, but its dependency array is empty, so React never re-runs it for a new room.',
    'Use [roomId] as the dependencies. Then make sure the old connection closes before the new one opens.',
    'At the end of the effect, add return () => connection.disconnect();',
  ],
  filename: 'ChatApp.jsx',
  supplied: [{ filename: 'chat.js', description: 'createConnection(roomId) returns { connect(), disconnect() }. ConnectionLog shows every call.' }],
  starter,
  focus: {
    edit: [/function ChatRoom/],
    related: [/<ChatRoom roomId/],
  },
}
