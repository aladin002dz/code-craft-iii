import { useState } from 'react';

export default function TaskBoard() {
  const [tasks, setTasks] = useState([
    { id: 'a', title: 'Write release notes' },
    { id: 'b', title: 'Review pull request' },
  ]);
  const [draft, setDraft] = useState('');

  function addTask() {
    if (!draft.trim()) return;
    // TODO 1: add { id: String(Date.now()), title: draft } by building a new array.
    setDraft('');
  }

  function removeTask(id) {
    // TODO 2: keep every task except the one with this id.
  }

  function moveTask(from, to) {
    if (to < 0 || to >= tasks.length) return;
    // TODO 3: build a reordered copy of tasks (never change the original), then update state.
  }

  return (
    <section className="card">
      <div className="eyebrow">Task board</div>
      <h2>Launch checklist</h2>
      <div className="actions">
        <input
          aria-label="New task"
          placeholder="Add a task"
          value={draft}
          onChange={event => setDraft(event.target.value)}
        />
        <button onClick={addTask}>Add</button>
      </div>
      <ul className="task-list">
        {tasks.map((task, index) => (
          <li
            key={task.id}
            data-task-index={index}
          >
            <span
              className="drag-handle"
              aria-hidden="true"
              onPointerDown={event => event.currentTarget.setPointerCapture(event.pointerId)}
              onPointerUp={event => {
                const target = document.elementFromPoint(event.clientX, event.clientY)?.closest('[data-task-index]');
                if (target) moveTask(index, Number(target.getAttribute('data-task-index')));
              }}
            >⋮⋮</span>
            <span className="title">{task.title}</span>
            <button className="icon-button" aria-label={`Move ${task.title} up`} onClick={() => moveTask(index, index - 1)}>↑</button>
            <button className="icon-button" aria-label={`Move ${task.title} down`} onClick={() => moveTask(index, index + 1)}>↓</button>
            <button className="icon-button" aria-label={`Remove ${task.title}`} onClick={() => removeTask(task.id)}>×</button>
          </li>
        ))}
      </ul>
    </section>
  );
}
