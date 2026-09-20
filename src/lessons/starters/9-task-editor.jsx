import { useState } from 'react';

const people = [
  { id: 'ada', name: 'Ada' },
  { id: 'grace', name: 'Grace' },
];

function TaskRow({ task }) {
  const [draft, setDraft] = useState(task.title);

  return (
    <li>
      <label className="field">
        {task.label}
        <input value={draft} onChange={event => setDraft(event.target.value)} />
      </label>
    </li>
  );
}

function CommentForm({ person }) {
  const [comment, setComment] = useState('');

  return (
    <label className="field">
      Comment for {person.name}
      <input value={comment} onChange={event => setComment(event.target.value)} />
    </label>
  );
}

export default function TaskEditor() {
  const [tasks, setTasks] = useState([
    { id: 'a', label: 'Task A', title: 'Review PR' },
    { id: 'b', label: 'Task B', title: 'Ship update' },
  ]);
  const [personId, setPersonId] = useState('ada');
  const person = people.find(item => item.id === personId);

  return (
    <section className="card">
      <div className="eyebrow">Task board</div>
      <h2>Edit tasks</h2>
      <button className="secondary" onClick={() => setTasks([...tasks].reverse())}>Swap order</button>
      <ul className="task-list">
        {tasks.map((task, index) => (
          <TaskRow key={index} task={task} />
        ))}
      </ul>
      <div className="actions">
        {people.map(item => (
          <button key={item.id} className={item.id === personId ? '' : 'secondary'} onClick={() => setPersonId(item.id)}>
            {item.name}
          </button>
        ))}
      </div>
      <CommentForm person={person} />
    </section>
  );
}
