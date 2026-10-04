import starter from './starters/16-task-filter.jsx?raw'
import type { Lesson } from './types'

export const lesson16: Lesson = {
  id: 16,
  course: 'effects',
  topic: 'You might not need an effect',
  title: 'Filter tasks without an effect',
  project: 'Task board',
  prerequisite: 15,
  request: '"Hide completed" works, but ticking a task does nothing until the filter is switched. Make the list always match the tasks, and remove the effect that copies them.',
  steps: [
    'Tick "Review pull request" and watch it stay unticked.',
    'Find visibleTasks. It is a copy of tasks that an effect refreshes only when hideDone changes.',
    'Delete the visibleTasks state and the effect, and calculate the list while rendering.',
    'Run the checks.',
  ],
  concept:
    'Effects are for staying in sync with things outside React. If a value can be calculated from props and state, calculate it during render instead. A copy kept in state needs an effect to refresh it, renders twice, and goes stale whenever a dependency is missed.',
  objectives: [
    { id: 'hides-done', label: '"Hide completed" hides finished tasks' },
    { id: 'follows-tasks', label: 'Ticking a task updates the list straight away' },
    { id: 'no-copied-state', label: 'The visible list is calculated, not stored' },
  ],
  hints: [
    'The effect only refreshes visibleTasks when hideDone changes, so changes to tasks are missed. Could visibleTasks be worked out from tasks and hideDone directly?',
    'Remove const [visibleTasks, setVisibleTasks] = useState(...) and the useEffect below it.',
    'Write const visibleTasks = hideDone ? tasks.filter(task => !task.done) : tasks; before return.',
  ],
  filename: 'TaskFilter.jsx',
  starter,
  focus: {
    edit: [/const \[visibleTasks/, /^  useEffect\(\(\) => \{/],
    related: [/visibleTasks\.map/],
  },
}
