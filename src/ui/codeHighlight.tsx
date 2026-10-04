import { jsxLanguage } from '@codemirror/lang-javascript'
import { highlightCode, tagHighlighter, tags } from '@lezer/highlight'
import { useMemo, type ReactNode } from 'react'

/**
 * Token classes shared by the editor and every read-only snippet, so examples are coloured
 * exactly like the code learners edit. The colours live in styles.css (`.tok-*`).
 */
export const codeHighlighter = tagHighlighter([
  { tag: [tags.keyword, tags.controlKeyword, tags.moduleKeyword], class: 'tok-keyword' },
  { tag: [tags.string, tags.special(tags.string)], class: 'tok-string' },
  { tag: [tags.number, tags.bool, tags.null], class: 'tok-literal' },
  { tag: [tags.function(tags.variableName), tags.function(tags.propertyName)], class: 'tok-function' },
  { tag: [tags.definition(tags.variableName)], class: 'tok-definition' },
  { tag: [tags.tagName, tags.angleBracket], class: 'tok-tag' },
  { tag: tags.attributeName, class: 'tok-attribute' },
  { tag: [tags.propertyName], class: 'tok-property' },
  { tag: [tags.comment, tags.lineComment], class: 'tok-comment' },
  { tag: [tags.operator, tags.punctuation, tags.bracket], class: 'tok-punctuation' },
])

/** Split JSX source into coloured spans using the same parser as the editor. */
export function highlightJsx(source: string): ReactNode[] {
  const nodes: ReactNode[] = []
  highlightCode(
    source,
    jsxLanguage.parser.parse(source),
    codeHighlighter,
    (text, classes) => nodes.push(classes ? <span key={nodes.length} className={classes}>{text}</span> : text),
    () => nodes.push('\n'),
  )
  return nodes
}

/** A read-only, syntax-coloured code snippet. */
export function Code({ children }: { children: string }) {
  const highlighted = useMemo(() => highlightJsx(children), [children])
  return <code className="highlighted-code">{highlighted}</code>
}
