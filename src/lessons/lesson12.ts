import starter from './starters/12-member-list.jsx?raw'
import type { Lesson } from './types'

export const lesson12: Lesson = {
  id: 12,
  course: 'effects',
  topic: 'Subscribe to browser events',
  title: 'Adapt the member list to the window',
  project: 'Team chat',
  prerequisite: 11,
  request: 'The member list should switch to a compact layout on narrow windows. It reads the width once and never notices when the window changes.',
  steps: [
    'Switch the preview between full width (▭) and phone width (▯), and watch the width stay the same.',
    'In the effect, add handleResize as a "resize" listener on window.',
    'Return a cleanup that removes the same listener.',
    'Hide and show the members, then run the checks.',
  ],
  concept:
    'Browser events happen outside React. An effect connects your component to them: subscribe when the component appears and unsubscribe in the cleanup. Remove exactly the function you added, otherwise the old listener keeps running after the component is gone.',
  objectives: [
    { id: 'follows-resize', label: 'The layout follows the window width' },
    { id: 'one-listener', label: 'The list keeps one resize listener' },
    { id: 'removes-listener', label: 'Hiding the list removes its listener' },
  ],
  hints: [
    'handleResize already stores the new width. Nothing calls it yet. Which window event fires when the width changes?',
    'window.addEventListener(\'resize\', handleResize); subscribes. What should the cleanup do?',
    'Add return () => window.removeEventListener(\'resize\', handleResize); at the end of the effect.',
  ],
  filename: 'TeamPanel.jsx',
  starter,
  focus: {
    edit: [/\/\/ TODO: listen/],
    related: [/function handleResize/],
  },
}
