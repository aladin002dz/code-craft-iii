import { useEffect, useState } from 'react';

const members = [
  { id: 'ada', name: 'Ada Lovelace', role: 'Engine lead' },
  { id: 'grace', name: 'Grace Hopper', role: 'Compilers' },
  { id: 'linus', name: 'Linus Torvalds', role: 'Kernel' },
];

function MemberList() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    function handleResize() {
      setWidth(window.innerWidth);
    }
    // TODO: listen for "resize" on window, and stop listening when this component goes away.
  }, []);

  const compact = width < 420;

  return (
    <div className={compact ? 'members compact' : 'members'}>
      <output className="muted layout" aria-label="Layout">
        {width}px wide · {compact ? 'compact' : 'full'} layout
      </output>
      <ul>
        {members.map(member => (
          <li key={member.id}>
            <span className="avatar" aria-hidden="true">{member.name[0]}</span>
            <span className="member-name">{compact ? member.name.split(' ')[0] : member.name}</span>
            {!compact && <span className="muted">{member.role}</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function TeamPanel() {
  const [showMembers, setShowMembers] = useState(true);

  return (
    <section className="card">
      <div className="eyebrow">Team chat</div>
      <h2>Members</h2>
      <button className="secondary" onClick={() => setShowMembers(!showMembers)}>
        {showMembers ? 'Hide members' : 'Show members'}
      </button>
      {showMembers && <MemberList />}
    </section>
  );
}
