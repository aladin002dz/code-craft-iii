import { patchStarter } from '../harness'

const handler = /\/\/ TODO: switch the theme when the button is clicked\./

/** Correct: flip the current value. */
export const solution = () => patchStarter(1, handler, 'setIsDark(!isDark);')

/** Correct and equivalent: functional update. */
export const solutionFunctional = () => patchStarter(1, handler, 'setIsDark(previous => !previous);')

/** Correct and equivalent: written with an if/else and a local variable. */
export const solutionVerbose = () =>
  patchStarter(1, handler, 'let next;\n    if (isDark) { next = false; } else { next = true; }\n    setIsDark(next);')

/** Wrong: always sets true, so it can never switch back. */
export const alwaysTrue = () => patchStarter(1, handler, 'setIsDark(true);')

/** Wrong: toggles state, but the label ignores it. */
export const labelIgnoresState = () =>
  patchStarter(1, /\{isDark \? 'Switch to light mode' : 'Switch to dark mode'\}/, 'Switch theme')
    .replace(handler, 'setIsDark(!isDark);')

/** Wrong: toggles state, but the theme class ignores it. */
export const themeIgnoresState = () =>
  patchStarter(1, /className=\{isDark \? 'panel dark' : 'panel light'\}/, "className='panel light'").replace(handler, 'setIsDark(!isDark);')

/** Wrong: throws when clicked. */
export const throwsOnClick = () => patchStarter(1, handler, "throw new Error('boom');")
