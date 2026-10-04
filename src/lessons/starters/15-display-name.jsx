import { useEffect, useRef, useState } from 'react';

export default function DisplayName() {
  const [name, setName] = useState('Ada Lovelace');
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef(null);

  // Put the cursor in the field as soon as it appears.
  if (isEditing) {
    inputRef.current.focus();
  }

  return (
    <section className="card">
      <div className="eyebrow">Team chat · Profile</div>
      <h2>Display name</h2>
      {isEditing ? (
        <div className="actions">
          <input
            ref={inputRef}
            aria-label="Display name"
            value={name}
            onChange={event => setName(event.target.value)}
          />
          <button onClick={() => setIsEditing(false)}>Save</button>
        </div>
      ) : (
        <div className="actions">
          <strong className="display-name">{name}</strong>
          <button className="secondary" onClick={() => setIsEditing(true)}>Edit</button>
        </div>
      )}
    </section>
  );
}
