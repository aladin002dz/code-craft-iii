import { useEffect, useState } from 'react';

function format(totalSeconds) {
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
  const seconds = String(totalSeconds % 60).padStart(2, '0');
  return `${minutes}:${seconds}`;
}

function Stopwatch() {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;
    setInterval(() => {
      setSeconds(previous => previous + 1);
    }, 1000);
  }, [running]);

  return (
    <>
      <output className="clock" aria-label="Elapsed time">{format(seconds)}</output>
      <div className="actions">
        <button onClick={() => setRunning(!running)}>{running ? 'Pause' : 'Start'}</button>
        <button className="secondary" onClick={() => setSeconds(0)}>Reset</button>
      </div>
    </>
  );
}

export default function FocusTimer() {
  const [open, setOpen] = useState(true);

  return (
    <section className="card">
      <div className="eyebrow">Focus timer</div>
      <h2>Deep work session</h2>
      {open ? <Stopwatch /> : <p className="muted">The timer is closed.</p>}
      <button className="link-button" onClick={() => setOpen(!open)}>
        {open ? 'Close timer' : 'Open timer'}
      </button>
    </section>
  );
}
