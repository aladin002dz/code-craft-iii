import { useEffect, useState } from 'react';
import { NetworkLog } from './network.js';

export default function TeamDirectory() {
  const [members, setMembers] = useState(null);
  const [compact, setCompact] = useState(false);

  // Load the team from the server.
  fetch('/api/team')
    .then(response => response.json())
    .then(data => setMembers(data));

  return (
    <section className="card">
      <div className="eyebrow">Team chat · Directory</div>
      <h2>Team members</h2>
      <label className="check">
        <input type="checkbox" checked={compact} onChange={event => setCompact(event.target.checked)} />
        Compact view
      </label>
      {members === null ? (
        <p className="muted">Loading…</p>
      ) : (
        <ul className="member-list" aria-label="Team members">
          {members.map(member => (
            <li key={member.id}>
              <strong>{member.name}</strong>
              {!compact && <span className="muted"> · {member.role}</span>}
            </li>
          ))}
        </ul>
      )}
      <NetworkLog />
    </section>
  );
}
