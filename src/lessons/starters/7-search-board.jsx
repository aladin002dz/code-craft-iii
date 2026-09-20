import { useState } from 'react';

const allTasks = ['Review pull request', 'Write release notes', 'Prepare demo'];

function SearchBox() {
  const [query, setQuery] = useState('');

  return (
    <input
      aria-label="Search tasks"
      placeholder="Search tasks"
      value={query}
      onChange={event => setQuery(event.target.value)}
    />
  );
}

function TaskList() {
  return (
    <ul className="task-list">
      {allTasks.map(task => (
        <li key={task}>
          <span className="title">{task}</span>
        </li>
      ))}
    </ul>
  );
}

export default function SearchBoard() {
  return (
    <section className="card">
      <div className="eyebrow">Task board</div>
      <h2>Find a task</h2>
      <SearchBox />
      <TaskList />
    </section>
  );
}
