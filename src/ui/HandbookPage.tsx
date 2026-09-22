import { Link } from '@tanstack/react-router'
import { useI18n } from '../i18n/I18nProvider'

function StateBasics() {
  const { copy } = useI18n()
  return (
    <section className="handbook-section handbook-basics" aria-labelledby="basics-heading">
      <div className="eyebrow">{copy.handbook.sectionOne}</div>
      <div className="handbook-basics-grid">
        <article className="state-memory-card">
          <div className="memory-visual" aria-hidden="true">
            <span>{copy.handbook.component}</span>
            <b>→</b>
            <strong><small>{copy.handbook.state}</small>count = 2</strong>
          </div>
          <h2 id="basics-heading">{copy.handbook.memoryTitle}</h2>
          <p>{copy.handbook.memoryBody}</p>
        </article>
        <article className="state-anatomy-card">
          <span className="concept-label">{copy.handbook.anatomy}</span>
          <pre><code>const [count, setCount] = useState(0)</code></pre>
          <dl className="state-parts">
            <div><dt><code>count</code></dt><dd>{copy.handbook.currentValue}</dd></div>
            <div><dt><code>setCount</code></dt><dd>{copy.handbook.requestsUpdate}</dd></div>
            <div><dt><code>0</code></dt><dd>{copy.handbook.startingValue}</dd></div>
          </dl>
        </article>
      </div>
    </section>
  )
}

export function HandbookPage() {
  const { locale, copy } = useI18n()
  return (
    <article className="reading-page">
      <header className="handbook-hero">
        <div className="eyebrow">{copy.handbook.hero}</div>
        <h1>{copy.handbook.title}</h1>
      </header>
      <StateBasics />
      <section className="handbook-section" aria-labelledby="reference-heading">
        <div className="eyebrow">{copy.handbook.sectionTwo}</div>
        <h2 id="reference-heading">{copy.handbook.patternsTitle}</h2>
        <div className="handbook-reference">
          <details><summary><span className="pattern-number">01</span><span>{copy.handbook.replaceTitle}</span></summary>
            <p className="pattern-rule">{copy.handbook.replaceRule}</p>
            <div className="copy-examples">
              <article>
                <span className="concept-label">{copy.handbook.object}</span>
                <div className="mutation-example bad"><span>{copy.handbook.dont}</span><code>settings.volume = 75</code></div>
                <div className="mutation-example good"><span>{copy.handbook.do}</span><pre tabIndex={0} aria-label={copy.handbook.correctObject}><code>{"setSettings({\n  ...settings,\n  volume: 75\n})"}</code></pre></div>
              </article>
              <article>
                <span className="concept-label">{copy.handbook.array}</span>
                <div className="mutation-example bad"><span>{copy.handbook.dont}</span><code>tags.push('Testing')</code></div>
                <div className="mutation-example good"><span>{copy.handbook.do}</span><pre tabIndex={0} aria-label={copy.handbook.correctArray}><code>{"setTags([\n  ...tags,\n  'Testing'\n])"}</code></pre></div>
              </article>
            </div>
          </details>
          <details><summary><span className="pattern-number">02</span><span>{copy.handbook.previousTitle}</span></summary>
            <p className="pattern-rule">{copy.handbook.previousRule}</p>
            <pre className="pattern-example" tabIndex={0} aria-label={copy.handbook.codeExample}><code>{"function AddThree() {\n  const [count, setCount] = useState(0)\n\n  function handleClick() {\n    setCount(current => current + 1)\n    setCount(current => current + 1)\n    setCount(current => current + 1)\n  }\n\n  return <button onClick={handleClick}>Count: {count}</button>\n}"}</code></pre>
            <div className="pattern-flow value-flow" dir="ltr" aria-label={copy.handbook.queuedValues}><span>0</span><b>→</b><span>1</span><b>→</b><span>2</span><b>→</b><span>3</span></div>
          </details>
          <details><summary><span className="pattern-number">03</span><span>{copy.handbook.parentTitle}</span></summary>
            <p className="pattern-rule">{copy.handbook.parentRule}</p>
            <pre className="pattern-example" tabIndex={0} aria-label={copy.handbook.codeExample}><code>{"function Settings() {\n  const [volume, setVolume] = useState(50)\n\n  return (\n    <>\n      <VolumeSlider\n        volume={volume}\n        onVolumeChange={setVolume}\n      />\n      <p>Volume: {volume}%</p>\n    </>\n  )\n}\n\nfunction VolumeSlider({ volume, onVolumeChange }) {\n  return (\n    <input type=\"range\" min=\"0\" max=\"100\" value={volume}\n      onChange={event => onVolumeChange(Number(event.target.value))} />\n  )\n}"}</code></pre>
            <div className="pattern-flow parent-flow" aria-label={copy.handbook.parentFlow}><span>{copy.handbook.parentState}</span><b>{copy.handbook.valueDown}</b><span>{copy.handbook.child}</span><b>{copy.handbook.callbackUp}</b></div>
          </details>
        </div>
      </section>
      <nav className="intro-actions handbook-footer" aria-label={copy.handbook.continueLabel}>
        <Link className="btn primary" to="/lesson/$lessonId" params={{ lessonId: '1' }}>{copy.handbook.startLesson} {locale === 'ar' ? '←' : '→'}</Link>
        <Link className="btn" to="/">{copy.handbook.back}</Link>
      </nav>
    </article>
  )
}
