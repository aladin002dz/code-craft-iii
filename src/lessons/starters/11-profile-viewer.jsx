import { useEffect, useState } from 'react';
import { NetworkLog } from './network.js';

const people = [
  { id: 'ada', name: 'Ada' },
  { id: 'grace', name: 'Grace' },
  { id: 'linus', name: 'Linus' },
];

export default function ProfileViewer() {
  const [personId, setPersonId] = useState('linus');
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    setProfile(null);
    fetch(`/api/profiles/${personId}`)
      .then(response => response.json())
      .then(data => setProfile(data));
  }, []);

  return (
    <section className="card">
      <div className="eyebrow">Team chat · Members</div>
      <h2>Profiles</h2>
      <div className="actions" role="group" aria-label="Choose a person">
        {people.map(person => (
          <button
            key={person.id}
            className={person.id === personId ? '' : 'secondary'}
            aria-pressed={person.id === personId}
            onClick={() => setPersonId(person.id)}
          >
            {person.name}
          </button>
        ))}
      </div>
      {profile ? (
        <article className="profile" aria-label="Profile">
          <h3>{profile.name}</h3>
          <p>{profile.role}</p>
          <p className="muted">{profile.status}</p>
        </article>
      ) : (
        <p className="muted profile-loading">Loading…</p>
      )}
      <NetworkLog />
    </section>
  );
}
