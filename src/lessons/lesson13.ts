import starter from './starters/13-focus-timer.jsx?raw'
import type { Lesson } from './types'

export const lesson13: Lesson = {
  id: 13,
  course: 'effects',
  topic: 'Run timers and clean them up',
  title: 'Make Pause stop the timer',
  project: 'Focus timer',
  prerequisite: 12,
  request: 'Start works, but Pause does not stop the clock, and starting again makes it count twice as fast. Make the timer start, pause and close cleanly.',
  steps: [
    'Answer the prediction. Then press Start, Pause and Start in the preview.',
    'Find the setInterval call. Nothing ever stops it.',
    'Keep the interval id and return a cleanup function that clears it.',
    'Run the checks.',
  ],
  concept:
    'An effect can return a cleanup function. React calls it before running the effect again and when the component leaves the screen. Anything an effect starts, such as an interval, a subscription or a connection, should be stopped by its cleanup.',
  prediction: {
    question: 'With this effect, you press Start, then Pause, then Start. How fast does the clock count now?',
    code: 'useEffect(() => {\n  if (!running) return;\n  setInterval(() => {\n    setSeconds(previous => previous + 1);\n  }, 1000);\n}, [running]);',
    options: ['One second per second', 'Two seconds per second', 'It stays paused'],
    answer: 1,
    explanation:
      'Pause only stops new intervals from starting. The first interval keeps running, and the second Start adds another one, so two intervals each add a second every second.',
  },
  objectives: [
    { id: 'ticks-while-running', label: 'The clock counts while running' },
    { id: 'pause-stops', label: 'Pause stops the clock' },
    { id: 'one-interval', label: 'Starting again uses a single interval' },
    { id: 'cleans-up-on-close', label: 'Closing the timer stops its interval' },
  ],
  hints: [
    'setInterval returns an id, and clearInterval(id) stops that interval. Where could the effect stop what it started?',
    'Return a function from the effect. React runs it when running changes and when the Stopwatch is removed.',
    'const id = setInterval(...); return () => clearInterval(id);',
  ],
  filename: 'FocusTimer.jsx',
  starter,
  focus: {
    edit: [/^  useEffect\(\(\) => \{/],
    related: [/onClick=\{\(\) => setRunning/],
  },
}
