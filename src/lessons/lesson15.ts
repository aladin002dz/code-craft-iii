import starter from './starters/15-display-name.jsx?raw'
import type { Lesson } from './types'

export const lesson15: Lesson = {
  id: 15,
  course: 'effects',
  topic: 'Work with the DOM after render',
  title: 'Focus the name field',
  project: 'Team chat',
  prerequisite: 14,
  request: 'Clicking Edit should open the display name field with the cursor already in it. Right now the click crashes the panel.',
  steps: [
    'Click Edit in the preview and read the error.',
    'Find the focus call. It runs while React is still working out what to show, before the field exists.',
    'Move it into useEffect, so it runs after React has put the field on the screen.',
    'Run the checks.',
  ],
  concept:
    'A ref only points to a DOM element once React has put that element on the screen. During render the field does not exist yet, so inputRef.current is null. Effects run after the screen is updated, which makes them the place for DOM work such as focusing, scrolling or measuring.',
  objectives: [
    { id: 'opens-field', label: 'Clicking Edit shows the name field' },
    { id: 'focuses-field', label: 'The cursor is in the field when it appears' },
    { id: 'focus-in-effect', label: 'Focusing happens in an effect, after render' },
  ],
  hints: [
    'While the component renders, the <input> has not been added to the page yet, so inputRef.current is still null. When does React let you run code after the screen is updated?',
    'Wrap the focus code in useEffect(() => { ... }, [isEditing]); so it runs after each render where isEditing changed.',
    'Inside the effect: if (isEditing) { inputRef.current.focus(); }',
  ],
  filename: 'DisplayName.jsx',
  starter,
  focus: {
    edit: [/if \(isEditing\) \{/],
    related: [/ref=\{inputRef\}/],
  },
}
