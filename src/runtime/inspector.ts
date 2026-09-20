import type { JsonValue, StateSnapshot } from '../frame/protocol'

/**
 * React reports state by position, not by name. Recover the names the learner wrote
 * (`const [isDark, setIsDark] = useState(...)`) so the inspector can label each value.
 * The values always come from React; this only supplies labels, and falls back to
 * "state 1", "state 2" when the source doesn't match the usual pattern.
 */
export function stateNamesByComponent(code: string): Map<string, string[]> {
  const starts: { name: string; index: number }[] = []
  const componentStart = /(?:^|\n)\s*(?:export\s+default\s+)?(?:function\s+([A-Z]\w*)\s*\(|const\s+([A-Z]\w*)\s*=\s*(?:\(|function|memo\())/g
  for (let match = componentStart.exec(code); match; match = componentStart.exec(code)) {
    starts.push({ name: match[1] ?? match[2], index: match.index })
  }
  const names = new Map<string, string[]>()
  starts.forEach((start, position) => {
    const body = code.slice(start.index, starts[position + 1]?.index ?? code.length)
    const found: string[] = []
    const hook = /const\s*\[\s*([A-Za-z_$][\w$]*)\s*,\s*[A-Za-z_$][\w$]*\s*\]\s*=\s*(?:React\.)?use(?:State|Reducer)\s*\(/g
    for (let match = hook.exec(body); match; match = hook.exec(body)) found.push(match[1])
    names.set(start.name, found)
  })
  return names
}

export type InspectorRow = { id: string; name: string; value: JsonValue }
export type InspectorGroup = { id: string; component: string; instance: string | null; rows: InspectorRow[] }

export function buildInspector(snapshot: StateSnapshot, code: string): InspectorGroup[] {
  const names = stateNamesByComponent(code)
  const seen = new Map<string, number>()
  return snapshot.map(entry => {
    const count = (seen.get(entry.component) ?? 0) + 1
    seen.set(entry.component, count)
    const labels = names.get(entry.component) ?? []
    const id = `${entry.component}#${entry.key ?? count}`
    return {
      id,
      component: entry.component,
      instance: entry.key,
      rows: entry.values.map((value, index) => ({
        id: `${id}/${index}`,
        name: labels[index] ?? `state ${index + 1}`,
        value,
      })),
    }
  })
}

const IDENTIFIER = /^[A-Za-z_$][\w$]*$/

/** Format a value like JavaScript source, wrapping when it would not fit on one line. */
export function formatValue(value: JsonValue, indent = 0, width = 44): string {
  const inline = formatInline(value)
  if (inline.length <= width || typeof value !== 'object' || value === null) return inline
  const pad = '  '.repeat(indent + 1)
  const close = '  '.repeat(indent)
  if (Array.isArray(value)) {
    return `[\n${value.map(item => pad + formatValue(item, indent + 1, width)).join(',\n')}\n${close}]`
  }
  const lines = Object.entries(value).map(([key, item]) => `${pad}${IDENTIFIER.test(key) ? key : JSON.stringify(key)}: ${formatValue(item, indent + 1, width)}`)
  return `{\n${lines.join(',\n')}\n${close}}`
}

function formatInline(value: JsonValue): string {
  if (typeof value === 'string') return `'${value.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`
  if (value === null || typeof value !== 'object') return String(value)
  if (Array.isArray(value)) return `[${value.map(formatInline).join(', ')}]`
  const entries = Object.entries(value)
  if (entries.length === 0) return '{}'
  return `{ ${entries.map(([key, item]) => `${IDENTIFIER.test(key) ? key : JSON.stringify(key)}: ${formatInline(item)}`).join(', ')} }`
}
