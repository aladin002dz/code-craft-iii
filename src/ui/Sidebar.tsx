import { useRef, type KeyboardEvent } from 'react'
import type { Lesson } from '../lessons/types'
import type { ObjectiveView } from '../runtime/status'
import { Checklist } from './Checklist'
import { PredictionCard } from './PredictionCard'
import { useI18n } from '../i18n/I18nProvider'

export type SidebarTab = 'instructions' | 'files'

type Props = {
  lesson: Lesson
  tab: SidebarTab
  onTab: (tab: SidebarTab) => void
  collapsed: boolean
  canCollapse: boolean
  onToggleCollapsed: () => void
  objectives: ObjectiveView[]
  checking: boolean
  hintsShown: number
  onNextHint: () => void
}

export function Sidebar({ lesson, tab, onTab, collapsed, canCollapse, onToggleCollapsed, objectives, checking, hintsShown, onNextHint }: Props) {
  const { copy } = useI18n()
  const tabs: { id: SidebarTab; label: string }[] = [
    { id: 'instructions', label: copy.sidebar.instructions },
    { id: 'files', label: copy.sidebar.files },
  ]
  const tabRefs = useRef<Record<SidebarTab, HTMLButtonElement | null>>({ instructions: null, files: null })

  function onKeyDown(event: KeyboardEvent) {
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return
    const next = tab === 'instructions' ? 'files' : 'instructions'
    onTab(next)
    tabRefs.current[next]?.focus()
    event.preventDefault()
  }

  return (
    <aside className={`sidebar${collapsed ? ' collapsed' : ''}`} aria-label={copy.sidebar.label}>
      <div className="sidebar-tabs" role="tablist" aria-label={copy.sidebar.views} onKeyDown={onKeyDown}>
        {!collapsed &&
          tabs.map(item => (
            <button
              key={item.id}
              ref={element => {
                tabRefs.current[item.id] = element
              }}
              role="tab"
              id={`tab-${item.id}`}
              aria-selected={tab === item.id}
              aria-controls={`panel-${item.id}`}
              tabIndex={tab === item.id ? 0 : -1}
              className="sidebar-tab"
              onClick={() => onTab(item.id)}
            >
              {item.label}
            </button>
          ))}
        {canCollapse && (
        <button
          className="icon-toggle"
          onClick={onToggleCollapsed}
          aria-expanded={!collapsed}
          aria-label={collapsed ? copy.sidebar.expand : copy.sidebar.collapse}
          title={collapsed ? copy.sidebar.expand : copy.sidebar.collapse}
        >
          {collapsed ? '»' : '«'}
        </button>
        )}
      </div>

      {!collapsed && tab === 'instructions' && (
        <div className="sidebar-panel" role="tabpanel" id="panel-instructions" aria-labelledby="tab-instructions">
          <div className="eyebrow">{copy.sidebar.yourTask}</div>
          <h1 className="task-title">{lesson.title}</h1>
          <p className="task-request">{lesson.request}</p>

          {lesson.prediction && <PredictionCard prediction={lesson.prediction} />}

          <ol className="steps">
            {lesson.steps.map(step => (
              <li key={step}>{step}</li>
            ))}
          </ol>

          <div className="eyebrow section-label">{copy.sidebar.checklist}</div>
          <Checklist objectives={objectives} checking={checking} />

          {hintsShown > 0 && (
            <div className="hints" aria-label={copy.sidebar.hints}>
              <div className="eyebrow section-label">{copy.sidebar.hints}</div>
              {lesson.hints.slice(0, hintsShown).map((hint, index) => (
                <p key={hint} className="hint" data-testid={`hint-${index + 1}`}>
                  <span className="hint-number">{index + 1}</span>
                  {hint}
                </p>
              ))}
              {hintsShown < lesson.hints.length && (
                <button className="link-button" onClick={onNextHint}>
                  {copy.sidebar.showAnother}
                </button>
              )}
            </div>
          )}

          <div className="key-idea">
            <div className="eyebrow">{copy.sidebar.keyIdea}</div>
            <p>{lesson.concept}</p>
          </div>
        </div>
      )}

      {!collapsed && tab === 'files' && (
        <div className="sidebar-panel" role="tabpanel" id="panel-files" aria-labelledby="tab-files">
          <ul className="file-list">
            <li className="file active">
              <span className="file-name">{lesson.filename}</span>
              <span className="file-badge">{copy.sidebar.editThis}</span>
            </li>
            <li className="file">
              <span className="file-name">styles.css</span>
              <span className="file-badge muted-badge">{copy.sidebar.supplied}</span>
            </li>
          </ul>
          <p className="muted-copy">{copy.sidebar.suppliedHelp}</p>
        </div>
      )}
    </aside>
  )
}
