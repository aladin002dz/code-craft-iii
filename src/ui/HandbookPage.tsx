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
        <p>Return to these notes as the exercises introduce more ways to work with state.</p>
        <div className="handbook-reference">
          <details><summary>When the next value depends on the previous one</summary><p>Use a functional update: <code>setCount(c =&gt; c + 1)</code>. Three of these calls in one handler queue three increments. Three <code>setCount(count + 1)</code> calls request the same value because they all read the same render’s snapshot.</p></details>
          <details><summary>When components need to share a value</summary><p>Keep one source of truth. Move shared state to the closest common parent, then pass the value and update callbacks to children through props. Props are inputs; children should not mutate them.</p></details>
          <details><summary>When updating objects or arrays</summary><p>Create a new object or array instead of changing the existing one. Use spread to copy an object, map to replace an item, and filter to remove an item.</p></details>
          <details><summary>When a value can be calculated</summary><p>Calculate cart totals and filtered lists from existing state during rendering. Storing another copy creates extra values you must keep synchronized.</p></details>
          <details><summary>When state should stay or reset</summary><p>React preserves state by component type and position in the tree, with keys helping identify siblings. Use stable item IDs when reordering. Change a key deliberately when you want to reset a component’s state.</p></details>
        </div>
      </section>
      <nav className="intro-actions handbook-footer" aria-label="Continue learning">
        <Link className="btn primary" to="/lesson/$lessonId" params={{ lessonId: '1' }}>Start lesson 1 →</Link>
        <Link className="btn" to="/">Back to the course</Link>
      </nav>
    </article>
  )
}
