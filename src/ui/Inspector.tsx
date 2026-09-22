import { useEffect, useRef } from 'react'
import { formatValue, type InspectorGroup } from '../runtime/inspector'
import { useI18n } from '../i18n/I18nProvider'

type Props = { groups: InspectorGroup[]; running: boolean }

function valueClass(value: unknown) {
  if (typeof value === 'string') return 'v-string'
  if (typeof value === 'number') return 'v-number'
  if (typeof value === 'boolean') return 'v-boolean'
  return 'v-object'
}

/** Shows what React currently holds for the previewed component. It observes; it never owns state. */
export function Inspector({ groups, running }: Props) {
  const { copy } = useI18n()
  const previous = useRef(new Map<string, string>())

  const rendered = groups.flatMap(group => group.rows.map(row => [row.id, formatValue(row.value)] as const))
  useEffect(() => {
    previous.current = new Map(rendered)
  })

  return (
    <section className="inspector" aria-labelledby="inspector-title">
      <header className="pane-header">
        <h2 id="inspector-title">{copy.inspector.title}</h2>
        <span className="pane-note">{copy.inspector.note}</span>
      </header>
      <div className="inspector-body" data-testid="inspector">
        {groups.length === 0 ? (
          <p className="inspector-empty">{running ? copy.inspector.noState : copy.inspector.waiting}</p>
        ) : (
          groups.map(group => (
            <div className="inspector-group" key={group.id}>
              <div className="inspector-component">
                {group.component}
                {group.instance !== null && <span className="inspector-key"> key={group.instance}</span>}
              </div>
              {group.rows.map(row => {
                const text = formatValue(row.value)
                const before = previous.current.get(row.id)
                const changed = before !== undefined && before !== text
                return (
                  <div className="inspector-row" key={row.id} data-testid={`state-${row.name}`}>
                    <span className="state-name">{row.name}</span>
                    <span className="state-colon">:</span>
                    <pre key={changed ? `${row.id}:${text}` : row.id} className={`state-value ${valueClass(row.value)}${changed ? ' flash' : ''}`}>
                      {text}
                    </pre>
                  </div>
                )
              })}
            </div>
          ))
        )}
      </div>
    </section>
  )
}
