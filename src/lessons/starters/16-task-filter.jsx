import { useEffect, useState } from 'react';

const firstTasks = [
  { id: 'a', title: 'Write release notes', done: true },
  { id: 'b', title: 'Review pull request', done: false },
  { id: 'c', title: 'Record demo', done: false },
];

export default function TaskFilter() {
  const [tasks, setTasks] = useState(firstTasks);
  const [hideDone, setHideDone] = useState(false);
  const [visibleTasks, setVisibleTasks] = useState(firstTasks);

  useEffect(() => {
    setVisibleTasks(hideDone ? tasks.filter(task => !task.done) : tasks);
  }, [hideDone]);

  function toggle(id) {
    setTasks(tasks.map(task => (task.id === id ? { ...task, done: !task.done } : task)));
  }

  return (
    <section className="card">
      <div className="eyebrow">Task board</div>
      <h2>Launch checklist</h2>
      <label className="check">
        <input type="checkbox" checked={hideDone} onChange={event => setHideDone(event.target.checked)} />
        Hide completed
      </label>
      <ul className="task-list">
        {visibleTasks.map(task => (
          <li key={task.id}>
            <label className="check">
              <input type="checkbox" checked={task.done} onChange={() => toggle(task.id)} />
              <span className={task.done ? 'title done' : 'title'}>{task.title}</span>
            </label>
          </li>
        ))}
      </ul>
      <p className="muted">{visibleTasks.length} of {tasks.length} shown</p>
    </section>
  );
}
