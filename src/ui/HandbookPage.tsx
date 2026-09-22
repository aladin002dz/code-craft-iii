import { Link } from '@tanstack/react-router'

function StateBasics() {
  return (
    <section className="handbook-section handbook-basics" aria-labelledby="basics-heading">
      <div className="eyebrow">01 / State at a glance</div>
      <div className="handbook-basics-grid">
        <article className="state-memory-card">
          <div className="memory-visual" aria-hidden="true">
            <span>Component</span>
            <b>→</b>
            <strong><small>state</small>count = 2</strong>
          </div>
          <h2 id="basics-heading">State is memory</h2>
          <p>A value a component keeps between renders.</p>
        </article>
        <article className="state-anatomy-card">
          <span className="concept-label">useState anatomy</span>
          <pre><code>const [count, setCount] = useState(0)</code></pre>
          <dl className="state-parts">
            <div><dt><code>count</code></dt><dd>current value</dd></div>
            <div><dt><code>setCount</code></dt><dd>requests an update</dd></div>
            <div><dt><code>0</code></dt><dd>starting value</dd></div>
          </dl>
        </article>
      </div>
    </section>
  )
}

export function HandbookPage() {
  return (
    <article className="reading-page">
      <header className="handbook-hero">
        <div className="eyebrow">React state / Quick reference</div>
        <h1>Handbook</h1>
      </header>
      <StateBasics />
      <section className="handbook-section" aria-labelledby="reference-heading">
        <div className="eyebrow">02 / Use in real projects</div>
        <h2 id="reference-heading">Three patterns to remember</h2>
        <div className="handbook-reference">
          <details><summary><span className="pattern-number">01</span><span>Replace objects and arrays—don’t mutate them</span></summary>
            <p className="pattern-rule">Treat state as read-only. Give the setter a new value.</p>
            <div className="copy-examples">
              <article>
                <span className="concept-label">Object</span>
                <div className="mutation-example bad"><span>Don’t</span><code>settings.volume = 75</code></div>
                <div className="mutation-example good"><span>Do</span><pre tabIndex={0} aria-label="Correct object update"><code>{"setSettings({\n  ...settings,\n  volume: 75\n})"}</code></pre></div>
              </article>
              <article>
                <span className="concept-label">Array</span>
                <div className="mutation-example bad"><span>Don’t</span><code>tags.push('Testing')</code></div>
                <div className="mutation-example good"><span>Do</span><pre tabIndex={0} aria-label="Correct array update"><code>{"setTags([\n  ...tags,\n  'Testing'\n])"}</code></pre></div>
              </article>
            </div>
          </details>
          <details><summary><span className="pattern-number">02</span><span>When next state depends on previous state</span></summary>
            <p className="pattern-rule">Pass an updater function.</p>
            <pre className="pattern-example" tabIndex={0} aria-label="Code example"><code>{"function AddThree() {\n  const [count, setCount] = useState(0)\n\n  function handleClick() {\n    setCount(current => current + 1)\n    setCount(current => current + 1)\n    setCount(current => current + 1)\n  }\n\n  return <button onClick={handleClick}>Count: {count}</button>\n}"}</code></pre>
            <div className="pattern-flow value-flow" aria-label="Queued values progress from zero to three"><span>0</span><b>→</b><span>1</span><b>→</b><span>2</span><b>→</b><span>3</span></div>
          </details>
          <details><summary><span className="pattern-number">03</span><span>Update parent state from a child</span></summary>
            <p className="pattern-rule">Value down. Callback up. One source of truth.</p>
            <pre className="pattern-example" tabIndex={0} aria-label="Code example"><code>{"function Settings() {\n  const [volume, setVolume] = useState(50)\n\n  return (\n    <>\n      <VolumeSlider\n        volume={volume}\n        onVolumeChange={setVolume}\n      />\n      <p>Volume: {volume}%</p>\n    </>\n  )\n}\n\nfunction VolumeSlider({ volume, onVolumeChange }) {\n  return (\n    <input type=\"range\" min=\"0\" max=\"100\" value={volume}\n      onChange={event => onVolumeChange(Number(event.target.value))} />\n  )\n}"}</code></pre>
            <div className="pattern-flow parent-flow" aria-label="Parent passes the value down and the child calls the callback up"><span>Parent state</span><b>value ↓</b><span>Child</span><b>callback ↑</b></div>
          </details>
        </div>
      </section>
      <nav className="intro-actions handbook-footer" aria-label="Continue learning">
        <Link className="btn primary" to="/lesson/$lessonId" params={{ lessonId: '1' }}>Start lesson 1 →</Link>
        <Link className="btn" to="/">Back to the course</Link>
      </nav>
    </article>
  )
}
