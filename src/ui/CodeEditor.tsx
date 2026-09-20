import { defaultKeymap, history, historyKeymap, indentWithTab, temporarilySetTabFocusMode } from '@codemirror/commands'
import { javascript } from '@codemirror/lang-javascript'
import { HighlightStyle, bracketMatching, indentOnInput, syntaxHighlighting } from '@codemirror/language'
import { Annotation, EditorState, StateEffect, StateField, type Extension } from '@codemirror/state'
import { Decoration, EditorView, drawSelection, highlightActiveLine, keymap, lineNumbers, type DecorationSet } from '@codemirror/view'
import { tags } from '@lezer/highlight'
import { useEffect, useRef } from 'react'

export type LineMark = { line: number; kind: 'edit' | 'related' | 'error' }

const setMarks = StateEffect.define<LineMark[]>()
const external = Annotation.define<boolean>()

function buildDecorations(state: EditorState, marks: LineMark[]): DecorationSet {
  const decorations = marks
    .filter(mark => mark.line >= 1 && mark.line <= state.doc.lines)
    .map(mark => Decoration.line({ class: `cm-mark-${mark.kind}` }).range(state.doc.line(mark.line).from))
  return Decoration.set(decorations, true)
}

const markField = StateField.define<DecorationSet>({
  create: () => Decoration.none,
  update(value, transaction) {
    let next = value.map(transaction.changes)
    for (const effect of transaction.effects) if (effect.is(setMarks)) next = buildDecorations(transaction.state, effect.value)
    return next
  },
  provide: field => EditorView.decorations.from(field),
})

const theme = EditorView.theme(
  {
    '&': { height: '100%', backgroundColor: 'var(--code-bg)', color: 'var(--code-text)', fontSize: '14px' },
    '.cm-scroller': { fontFamily: 'var(--font-mono)', lineHeight: '1.65', overflow: 'auto' },
    '.cm-content': { padding: '14px 0', caretColor: '#fff' },
    '.cm-line': { padding: '0 16px 0 8px' },
    '.cm-gutters': { backgroundColor: 'var(--code-gutter)', color: 'var(--code-muted)', border: 'none', paddingLeft: '6px' },
    '.cm-lineNumbers .cm-gutterElement': { padding: '0 10px 0 6px', minWidth: '28px' },
    '.cm-activeLine': { backgroundColor: 'rgb(255 255 255 / 4%)' },
    '&.cm-focused': { outline: '2px solid var(--accent-soft)', outlineOffset: '-2px' },
    '&.cm-focused .cm-selectionBackground, .cm-selectionBackground, ::selection': { backgroundColor: 'rgb(90 140 235 / 38%)' },
    '.cm-cursor': { borderLeftColor: '#fff' },
    '.cm-mark-edit': { backgroundColor: 'rgb(60 120 240 / 26%)', boxShadow: 'inset 3px 0 0 #6ea3ff' },
    '.cm-mark-related': { backgroundColor: 'rgb(60 120 240 / 11%)' },
    '.cm-mark-error': { backgroundColor: 'rgb(255 90 90 / 22%)', boxShadow: 'inset 3px 0 0 #ff7b7b' },
  },
  { dark: true },
)

const highlight = HighlightStyle.define([
  { tag: [tags.keyword, tags.controlKeyword, tags.moduleKeyword], color: '#f28fb5' },
  { tag: [tags.string, tags.special(tags.string)], color: '#98e0a8' },
  { tag: [tags.number, tags.bool, tags.null], color: '#ffc27a' },
  { tag: [tags.function(tags.variableName), tags.function(tags.propertyName)], color: '#f5d77e' },
  { tag: [tags.definition(tags.variableName)], color: '#8fd0ff' },
  { tag: [tags.tagName, tags.angleBracket], color: '#f28f9b' },
  { tag: tags.attributeName, color: '#ffcf85' },
  { tag: [tags.propertyName], color: '#8fd0ff' },
  { tag: [tags.comment, tags.lineComment], color: '#7d8fae', fontStyle: 'italic' },
  { tag: [tags.operator, tags.punctuation, tags.bracket], color: '#b9c7de' },
])

type Props = {
  value: string
  onChange: (value: string) => void
  marks: LineMark[]
  label: string
  /** Called for Ctrl/Cmd+Enter. */
  onRun: () => void
}

export function CodeEditor({ value, onChange, marks, label, onRun }: Props) {
  const host = useRef<HTMLDivElement>(null)
  const view = useRef<EditorView | null>(null)
  // Handlers change every render; the editor is created once and reads the latest through refs.
  const handlers = useRef({ onChange, onRun })
  handlers.current = { onChange, onRun }

  useEffect(() => {
    const extensions: Extension[] = [
      lineNumbers(),
      history(),
      drawSelection(),
      highlightActiveLine(),
      indentOnInput(),
      bracketMatching(),
      javascript({ jsx: true }),
      syntaxHighlighting(highlight),
      theme,
      markField,
      EditorView.contentAttributes.of({ 'aria-label': label, 'aria-describedby': 'editor-help' }),
      keymap.of([
        { key: 'Mod-Enter', run: () => (handlers.current.onRun(), true) },
        // Escape then Tab moves focus out of the editor, so keyboard users are never trapped.
        { key: 'Escape', run: temporarilySetTabFocusMode },
        indentWithTab,
        ...defaultKeymap,
        ...historyKeymap,
      ]),
      EditorView.updateListener.of(update => {
        if (update.docChanged && !update.transactions.some(tr => tr.annotation(external))) {
          handlers.current.onChange(update.state.doc.toString())
        }
      }),
    ]
    const editor = new EditorView({ parent: host.current!, state: EditorState.create({ doc: value, extensions }) })
    view.current = editor
    return () => {
      editor.destroy()
      view.current = null
    }
    // The editor is created once per mount; later prop changes are applied by the effects below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Replace the document when the value changes from outside (Reset, switching drafts).
  useEffect(() => {
    const editor = view.current
    if (editor && editor.state.doc.toString() !== value) {
      editor.dispatch({ changes: { from: 0, to: editor.state.doc.length, insert: value }, annotations: external.of(true) })
    }
  }, [value])

  useEffect(() => {
    view.current?.dispatch({ effects: setMarks.of(marks) })
  }, [marks, value])

  return <div className="code-editor" ref={host} />
}
