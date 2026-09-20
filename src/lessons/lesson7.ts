import starter from './starters/7-search-board.jsx?raw'
import type { Lesson } from './types'

export const lesson7: Lesson = {
  id: 7,
  topic: 'Lifting state up',
  title: 'Share the search text',
  project: 'Task board',
  prerequisite: 6,
  request: 'Typing in the search box should filter the task list, but the two components are siblings and the list has no idea what was typed.',
  steps: [
    'Find where the search text lives now, and who else needs it.',
    'Move the state to SearchBoard, the closest parent of both components.',
    'Pass the text and a way to change it to SearchBox, and the text to TaskList.',
    'Filter the tasks by that text, ignoring capital letters, then run the checks.',
  ],
  concept:
    'Siblings cannot read each other’s state. When two components need the same value, lift it to their closest common parent, then pass the value down as a prop and the setter (or a handler) down for changes. The parent becomes the single owner.',
  objectives: [
    { id: 'filters-list', label: 'Typing filters the list, ignoring capital letters' },
    { id: 'clearing-restores', label: 'Clearing the search shows every task again' },
    { id: 'parent-owns-query', label: 'The search text lives in SearchBoard, not SearchBox' },
  ],
  hints: [
    'SearchBox owns query, but TaskList never sees it. Which component renders both of them?',
    'Move const [query, setQuery] = useState(\'\') up into SearchBoard, then pass query and setQuery (or an onChange function) to SearchBox as props.',
    'Give TaskList a query prop and filter with allTasks.filter(task => task.toLowerCase().includes(query.toLowerCase())).',
  ],
  filename: 'SearchBoard.jsx',
  starter,
  focus: {
    edit: [/function SearchBox/, /function TaskList/, /export default function SearchBoard/],
  },
}
