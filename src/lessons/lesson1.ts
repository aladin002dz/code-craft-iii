import starter from './starters/1-settings-panel.jsx?raw'
import type { Lesson } from './types'

export const lesson1: Lesson = {
  id: 1,
  topic: 'State changes the screen',
  title: 'Make the theme toggle work',
  project: 'Settings panel',
  prerequisite: null,
  request: 'The Appearance panel has a theme button, but clicking it does nothing. Make it switch between light and dark mode.',
  steps: [
    'Click the button in the preview and notice that nothing changes.',
    'Find handleToggle. It runs on every click but never updates state.',
    'Make it store the opposite of the current isDark value.',
    'Run the checks.',
  ],
  concept:
    'isDark is remembered by React between renders. Calling setIsDark asks React to render again with a new value, and that render decides the theme and the button label. Both follow the same state value.',
  objectives: [
    { id: 'toggles-state', label: 'Each click flips isDark' },
    { id: 'theme-follows-state', label: 'The theme follows isDark' },
    { id: 'label-follows-state', label: 'The button label follows isDark' },
  ],
  hints: [
    'The button already calls handleToggle, but handleToggle never asks React to change anything. Which function is responsible for updating isDark?',
    'setIsDark is the setter for isDark. Call it inside handleToggle and pass the value isDark should have next.',
    'Pass the opposite of the current value: setIsDark(!isDark);',
  ],
  filename: 'SettingsPanel.jsx',
  starter,
  focus: {
    edit: [/function handleToggle/],
    related: [/isDark \?/],
  },
}
