import { Link } from '@tanstack/react-router'
import { courses } from '../lessons'
import { useI18n } from '../i18n/I18nProvider'
import { Code } from './codeHighlight'

const anatomy = 'useEffect(() => {\n  let ignore = false\n  fetch(`/api/users/${userId}`)\n    .then(response => response.json())\n    .then(data => {\n      if (!ignore) setUser(data)\n    })\n  return () => {\n    ignore = true\n  }\n}, [userId])'

const loadOnce = "function TeamDirectory() {\n  const [team, setTeam] = useState(null)\n  const [error, setError] = useState(null)\n\n  useEffect(() => {\n    fetch('/api/team')\n      .then(response => {\n        if (!response.ok) throw new Error(`HTTP ${response.status}`)\n        return response.json()\n      })\n      .then(data => setTeam(data))\n      .catch(error => setError(error))\n  }, [])\n\n  if (error) return <p>Could not load the team.</p>\n  if (!team) return <p>Loading…</p>\n  return <TeamList members={team} />\n}"

const subscriptions = "useEffect(() => {\n  window.addEventListener('resize', handleResize)\n  return () => window.removeEventListener('resize', handleResize)\n}, [])\n\nuseEffect(() => {\n  if (!running) return\n  const id = setInterval(tick, 1000)\n  return () => clearInterval(id)\n}, [running])\n\nuseEffect(() => {\n  const connection = createConnection(roomId)\n  connection.connect()\n  return () => connection.disconnect()\n}, [roomId])"

function EffectBasics() {
  const { copy } = useI18n()
  const text = copy.effectsHandbook
  return (
    <section className="handbook-section handbook-basics" aria-labelledby="effects-basics-heading">
      <div className="eyebrow">{text.sectionOne}</div>
      <div className="handbook-basics-grid">
        <article className="state-memory-card">
          <ol className="effect-timeline" aria-label={text.timelineLabel}>
            <li>{text.render}</li>
            <li>{text.screen}</li>
            <li className="effect-step">{text.effect}</li>
            <li className="cleanup-step">{text.cleanup}</li>
            <li className="effect-step">{text.nextEffect}</li>
          </ol>
          <h2 id="effects-basics-heading">{text.timelineTitle}</h2>
          <p>{text.timelineBody}</p>
        </article>
        <article className="state-anatomy-card">
          <span className="concept-label">{text.anatomy}</span>
          <pre dir="ltr" tabIndex={0} aria-label={text.codeExample}><Code>{anatomy}</Code></pre>
          <dl className="state-parts">
            <div><dt><code>fetch(…)</code></dt><dd>{text.setup}</dd></div>
            <div><dt><code>return () =&gt;</code></dt><dd>{text.cleanupPart}</dd></div>
            <div><dt><code>[userId]</code></dt><dd>{text.depsPart}</dd></div>
          </dl>
          <span className="concept-label deps-title">{text.depsTitle}</span>
          <dl className="deps-table">
            <div><dt>{text.noArray}</dt><dd>{text.noArrayWhen}</dd></div>
            <div><dt><code>[]</code></dt><dd>{text.emptyArrayWhen}</dd></div>
            <div><dt><code>[userId]</code></dt><dd>{text.withValuesWhen}</dd></div>
          </dl>
        </article>
      </div>
    </section>
  )
}

export function EffectsHandbookPage() {
  const { locale, copy } = useI18n()
  const text = copy.effectsHandbook
  const first = courses.find(course => course.id === 'effects')!.lessonIds[0]
  return (
    <article className="reading-page">
      <header className="handbook-hero">
        <div className="eyebrow">{text.hero}</div>
        <h1>{text.title}</h1>
      </header>
      <EffectBasics />
      <section className="handbook-section" aria-labelledby="effects-reference-heading">
        <div className="eyebrow">{text.sectionTwo}</div>
        <h2 id="effects-reference-heading">{text.patternsTitle}</h2>
        <div className="handbook-reference">
          <details><summary><span className="pattern-number">01</span><span>{text.fetchTitle}</span></summary>
            <p className="pattern-rule">{text.fetchRule}</p>
            <pre className="pattern-example" dir="ltr" tabIndex={0} aria-label={text.codeExample}><Code>{loadOnce}</Code></pre>
          </details>
          <details><summary><span className="pattern-number">02</span><span>{text.cleanupTitle}</span></summary>
            <p className="pattern-rule">{text.cleanupRule}</p>
            <pre className="pattern-example" dir="ltr" tabIndex={0} aria-label={text.codeExample}><Code>{subscriptions}</Code></pre>
          </details>
          <details><summary><span className="pattern-number">03</span><span>{text.renderTitle}</span></summary>
            <p className="pattern-rule">{text.renderRule}</p>
            <div className="copy-examples">
              <article>
                <div className="mutation-example bad"><span>{text.dont}</span><pre dir="ltr"><Code>{"const [visible, setVisible] = useState([])\nuseEffect(() => {\n  setVisible(tasks.filter(task => !task.done))\n}, [tasks])"}</Code></pre></div>
              </article>
              <article>
                <div className="mutation-example good"><span>{text.do}</span><pre dir="ltr"><Code>{"const visible = tasks.filter(\n  task => !task.done\n)"}</Code></pre></div>
              </article>
            </div>
          </details>
        </div>
      </section>
      <nav className="intro-actions handbook-footer" aria-label={text.continueLabel}>
        <Link className="btn primary" to="/lesson/$lessonId" params={{ lessonId: String(first) }}>{text.startLesson} {locale === 'ar' ? '←' : '→'}</Link>
        <Link className="btn" to="/course/$courseId" params={{ courseId: 'effects' }}>{text.back}</Link>
      </nav>
    </article>
  )
}
