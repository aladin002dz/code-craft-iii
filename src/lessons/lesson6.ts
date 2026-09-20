import starter from './starters/6-task-board.jsx?raw'
import type { Lesson } from './types'

export const lesson6: Lesson = {
  id: 6,
  topic: 'Objects and arrays in state',
  title: 'Update a task list',
  project: 'Task board',
  prerequisite: 5,
  request: 'The task board renders its list, but Add, Remove and reordering do nothing yet. Finish the three actions without changing the existing array.',
  steps: [
    'Add: build a new array that contains the old tasks plus the new one.',
    'Remove: build a new array without the task that has this id.',
    'Move: copy the array, move one item in the copy, then set it as the new state.',
    'Drag a task by its handle, or use the arrow buttons, then run the checks.',
  ],
  concept:
    'Never change a state array or object in place. React decides whether to re-render by comparing the new value with the old one, so give it a new array: [...tasks, task], tasks.filter(...), or a copy you reorder. In these exercises the checks freeze the state, so an in-place change fails loudly.',
  objectives: [
    { id: 'adds-task', label: 'Add puts a new task at the end and clears the field' },
    { id: 'removes-task', label: '× removes only that task' },
    { id: 'reorders-tasks', label: 'The arrow buttons and drag and drop reorder the list' },
  ],
  hints: [
    'push, splice and assigning to an index all change the array that React is already holding. What creates a new array instead?',
    'For add and remove: setTasks([...tasks, newTask]) and setTasks(tasks.filter(task => task.id !== id)).',
    'For move: const next = [...tasks]; const [moved] = next.splice(from, 1); next.splice(to, 0, moved); setTasks(next);',
  ],
  filename: 'TaskBoard.jsx',
  starter,
  focus: {
    edit: [/function addTask/, /function removeTask/, /function moveTask/],
    related: [/useState\(\[/],
  },
}
