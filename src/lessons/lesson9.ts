import starter from './starters/9-task-editor.jsx?raw'
import type { Lesson } from './types'

export const lesson9: Lesson = {
  id: 9,
  topic: 'Resetting and preserving state',
  title: 'Preserve or reset on purpose',
  project: 'Task board',
  prerequisite: 8,
  request:
    'Two things go wrong here. Editing a task and then swapping the rows moves the text to the wrong task. And switching from Ada to Grace keeps the comment typed for Ada.',
  steps: [
    'Edit Task A, click Swap order, and see where the edit ends up.',
    'Type a comment for Ada, then switch to Grace.',
    'Give each row a key that identifies the task itself, not its position.',
    'Give the comment form a key that changes when the person changes, then run the checks.',
  ],
  concept:
    'React ties a component’s state to its place in the tree, identified by type and key. A stable key (the task id) keeps state with the same item when the list reorders. Changing the key on purpose (the person id) makes React throw the old instance away and start fresh. Position as a key preserves state by accident.',
  objectives: [
    { id: 'swap-reorders', label: 'Swap order puts Task B first' },
    { id: 'rows-keep-edits', label: 'An edited task keeps its text after the swap' },
    { id: 'reset-on-person-change', label: 'Switching person starts a fresh comment form' },
  ],
  hints: [
    'The rows use key={index}. After a swap, which row does React think is which?',
    'Use the task’s own id as the key: key={task.id}. The state then follows the task when the list reorders.',
    'For the reset, do the opposite on purpose: <CommentForm key={person.id} person={person} /> makes React start a new form when the person changes.',
  ],
  filename: 'TaskEditor.jsx',
  starter,
  focus: {
    edit: [/key=\{index\}/, /<CommentForm/],
    related: [/function TaskRow/, /function CommentForm/],
  },
}
