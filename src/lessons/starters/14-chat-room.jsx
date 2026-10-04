import { useEffect, useState } from 'react';
import { createConnection, ConnectionLog } from './chat.js';

const rooms = ['general', 'design', 'launch'];

function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(roomId);
    connection.connect();
  }, []);

  return <h3 className="room-title">Welcome to #{roomId}</h3>;
}

export default function ChatApp() {
  const [roomId, setRoomId] = useState('general');
  const [inChat, setInChat] = useState(true);

  return (
    <section className="card">
      <div className="eyebrow">Team chat</div>
      <div className="actions">
        <label className="field inline">
          Room
          <select value={roomId} onChange={event => setRoomId(event.target.value)}>
            {rooms.map(room => (
              <option key={room} value={room}>#{room}</option>
            ))}
          </select>
        </label>
        <button className="secondary" onClick={() => setInChat(!inChat)}>
          {inChat ? 'Leave chat' : 'Open chat'}
        </button>
      </div>
      {inChat && <ChatRoom roomId={roomId} />}
      <ConnectionLog />
    </section>
  );
}
