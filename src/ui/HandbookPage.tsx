import { Link } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'
import source from '../lessons/introduction.jsx?raw'
import type { StateSnapshot } from '../frame/protocol'
import { compileLearnerCode } from '../runtime/compile'
import { frameDocument, loadFrameRuntime } from '../runtime/frameDocument'
import { PreviewController } from '../runtime/PreviewController'
import { buildInspector } from '../runtime/inspector'
import { Inspector } from './Inspector'

function StateBasics() {
  return (
    <section className="intro-copy handbook-section">
      <div className="eyebrow">01 / The essentials</div>
      <h2>State is a component’s memory</h2>
      <p>State is information a component keeps between renders. A cart remembers its item count; a settings panel remembers whether dark mode is on.</p>
      <p>A render is React calling your component to work out what to show. Updating state asks React to render again, so the screen reflects the new value.</p>
      <h2>Meet useState</h2>
      <pre><code>const [count, setCount] = useState(0)</code></pre>
      <dl className="state-parts">
        <dt><code>count</code></dt><dd>The current value for this render.</dd>
        <dt><code>setCount</code></dt><dd>The function you call to request a new value.</dd>
        <dt><code>0</code></dt><dd>The starting value when this component first appears. React remembers later updates.</dd>
      </dl>
      <h2>From a click to a new screen</h2>
      <p>When you click Add to cart, the handler calls <code>setCount(count + 1)</code>. React renders Cart again with the new count, then updates the text on screen.</p>
      <p className="handbook-note"><strong>Remember the snapshot.</strong> Each render sees a snapshot of state. Calling the setter requests the next render; it does not change the count variable in the handler that is already running.</p>
      <p>A normal local variable alone cannot do this: changing it does not request a render, and a variable declared inside the component is recreated when the component runs again.</p>
    </section>
  )
}

function CartExample() {
  const stage = useRef<HTMLDivElement>(null)
  const [snapshot, setSnapshot] = useState<StateSnapshot>([])
  const [ready, setReady] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let cancelled = false
    let controller: PreviewController | undefined
    setReady(false)
    setSnapshot([])
    setError(null)
    loadFrameRuntime().then(script => {
      if (cancelled) return
      const compiled = compileLearnerCode(source, 'Cart.jsx')
      if (!compiled.ok) { setError(compiled.message); return }
      controller = new PreviewController(stage.current!, frameDocument(script), 0, {
        onRendered: () => setReady(true),
        onState: setSnapshot,
        onError: setError,
        onUnresponsive: () => setError('The example could not start. Try resetting it.'),
      })
      controller.load(compiled.js)
    }).catch(() => { if (!cancelled) setError('The example could not load. Try resetting it.') })
    return () => { cancelled = true; controller?.destroy() }
  }, [attempt])

  return (
    <div className="intro-example">
      <section className="pane">
        <header className="pane-header"><h2>Cart.jsx</h2><span>Read-only example</span></header>
        <pre className="intro-source"><code>{source}</code></pre>
      </section>
      <section className="pane">
        <header className="pane-header"><h2>Try it</h2><button className="btn" onClick={() => setAttempt(value => value + 1)}>Reset example</button></header>
        {error && <p role="alert">{error}</p>}
        <div className="preview-stage intro-stage" ref={stage}>{!ready && !error && <p>Starting example…</p>}</div>
        <Inspector groups={buildInspector(snapshot, source)} running={ready} />
      </section>
    </div>
  )
}

export function HandbookPage() {
  const [answer, setAnswer] = useState<number | null>(null)
  return (
    <article className="reading-page">
      <header className="handbook-hero">
        <div className="eyebrow">React state / A practical field guide</div>
        <h1>Handbook</h1>
        <p>Understand the idea. Try a working example. Keep the essentials close while you build.</p>
        <div className="handbook-meta">3–5 minute introduction · No coding required · Revisit anytime</div>
      </header>
      <StateBasics />
      <section className="handbook-section" aria-labelledby="example-heading">
        <div className="eyebrow">02 / See it happen</div>
        <h2 id="example-heading">One click, one state update</h2>
        <p>Click Add to cart a few times. The code below runs the preview, and the inspector reads its actual React state. Watch the count and inspector change together.</p>
        <CartExample />
        <ol className="render-steps">
          <li><strong>You click</strong><span>The handler calls <code>setCount(count + 1)</code>.</span></li>
          <li><strong>React renders again</strong><span>Cart runs with the new count.</span></li>
          <li><strong>The screen updates</strong><span>The text reflects that new value.</span></li>
        </ol>
      </section>
      <section className="handbook-section handbook-prediction" aria-labelledby="prediction-heading">
        <div className="eyebrow">03 / Check your understanding</div>
        <h2 id="prediction-heading">Predict the next screen</h2>
        <p>Imagine the count is 2. You click Add to cart once. What will the screen show after React renders again?</p>
        <div className="intro-actions" role="group" aria-label="Choose the next count">
          {[2, 3, 0].map(value => <button className="btn" key={value} aria-pressed={answer === value} onClick={() => setAnswer(value)}>{value} items</button>)}
        </div>
        <p role="status">{answer === null ? 'Choose an answer to check your understanding.' : answer === 3 ? 'Exactly. The handler requests 2 + 1, so the next render shows 3 items.' : answer === 2 ? 'Try again. The click requests a new count: 2 + 1. The next render uses that new value.' : 'Try again. 0 is only the initial value. React remembers the updated count between renders.'}</p>
      </section>
      <section className="handbook-section" aria-labelledby="reference-heading">
        <div className="eyebrow">04 / Keep for reference</div>
        <h2 id="reference-heading">Patterns to remember</h2>
        <p>Start with these three patterns. They prevent the state bugs beginners are most likely to meet in real projects. Examples are read-only; useState examples assume an import from React.</p>
        <div className="handbook-reference">
          <details><summary>Updating objects and arrays without mutation</summary><p>Treat state as read-only. Create a new object or array instead of changing the existing one. Use spread to copy an object, <code>map</code> to replace an item, and <code>filter</code> to remove an item.</p>
            <pre className="pattern-example" tabIndex={0} aria-label="Code example"><code>{"const [tasks, setTasks] = useState([\n  { id: 1, title: 'Review draft', done: false },\n  { id: 2, title: 'Send feedback', done: false },\n])\n\nfunction markDone(id) {\n  setTasks(tasks.map(task =>\n    task.id === id ? { ...task, done: true } : task\n  ))\n}\n\nfunction removeTask(id) {\n  setTasks(tasks.filter(task => task.id !== id))\n}"}</code></pre>
            <p><code>map</code> and <code>filter</code> create new arrays. The spread creates a new object for the changed task. Spread is shallow, so copy each nested level you change rather than mutating it.</p>
          </details>
          <details><summary>When the next state depends on the previous state</summary><p>Use a functional update: <code>setCount(current =&gt; current + 1)</code>. Each updater receives the latest queued value, not the snapshot captured by the current render.</p>
            <pre className="pattern-example" tabIndex={0} aria-label="Code example"><code>{"function AddThree() {\n  const [count, setCount] = useState(0)\n\n  function handleClick() {\n    setCount(current => current + 1)\n    setCount(current => current + 1)\n    setCount(current => current + 1)\n  }\n\n  return <button onClick={handleClick}>Count: {count}</button>\n}"}</code></pre>
            <p>Starting at 0, one click shows 3. Three <code>setCount(count + 1)</code> calls would all request 1 because they read the same render’s snapshot.</p>
          </details>
          <details><summary>Updating parent state from a child</summary><p>Keep one source of truth in the parent. Pass the current value and an update callback to the child through props. The child requests a change instead of keeping a separate copy.</p>
            <pre className="pattern-example" tabIndex={0} aria-label="Code example"><code>{"function Settings() {\n  const [volume, setVolume] = useState(50)\n\n  return (\n    <>\n      <VolumeSlider\n        volume={volume}\n        onVolumeChange={setVolume}\n      />\n      <p>Volume: {volume}%</p>\n    </>\n  )\n}\n\nfunction VolumeSlider({ volume, onVolumeChange }) {\n  return (\n    <input type=\"range\" min=\"0\" max=\"100\" value={volume}\n      onChange={event => onVolumeChange(Number(event.target.value))} />\n  )\n}"}</code></pre>
            <p><code>Settings</code> owns the state and passes its setter as a clearly named callback prop. The slider requests updates, while the slider and label continue to read the same value.</p>
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
