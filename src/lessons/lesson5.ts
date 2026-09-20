import starter from './starters/5-volume-settings.jsx?raw'
import type { Lesson } from './types'

export const lesson5: Lesson = {
  id: 5,
  topic: 'One source of truth',
  title: 'Keep two controls in sync',
  project: 'Settings panel',
  prerequisite: 4,
  request: 'The volume slider and the number field each keep their own copy of the volume, so they drift apart. Make them always agree.',
  steps: [
    'Move the slider and notice the number stays put, then try the number field.',
    'Count how many values React is storing for one setting.',
    'Keep a single volume value and let both inputs read it and update it.',
    'Run the checks.',
  ],
  concept:
    'When two pieces of state describe the same fact, they can disagree. Store the fact once, and let every control that shows or edits it use that one value. The controls are just two views of the same state.',
  objectives: [
    { id: 'slider-updates-number', label: 'Moving the slider updates the number field' },
    { id: 'number-updates-slider', label: 'Typing a number moves the slider' },
    { id: 'single-source', label: 'The volume is stored only once' },
  ],
  hints: [
    'The inspector shows two state values for one setting. Which one should the other follow?',
    'Delete one of the two useState lines and rename the other to volume. Both inputs should use value={volume}.',
    'Both onChange handlers should call the same setter: setVolume(Number(event.target.value)).',
  ],
  filename: 'VolumeSettings.jsx',
  starter,
  focus: {
    edit: [/const \[sliderValue/, /const \[numberValue/],
    related: [/value=\{/],
  },
}
