import type { Lesson } from '../lessons/types'
import type { LineMark } from '../ui/CodeEditor'

/** Number of lines a `{ ... }` block starting on `startIndex` spans, counting from 1 for a single line. */
function blockLength(lines: string[], startIndex: number): number {
  let depth = 0
  let opened = false
  for (let index = startIndex; index < lines.length; index++) {
    for (const char of lines[index]) {
      if (char === '{') {
        depth++
        opened = true
      } else if (char === '}') depth--
    }
    if (opened && depth <= 0) return index - startIndex + 1
  }
  return 1
}

/**
 * Lines to draw attention to, located by content so they follow the code as the learner
 * edits. A matching line that opens a block (a function, say) highlights the whole block.
 */
export function findFocusLines(code: string, focus: Lesson['focus']): LineMark[] {
  const lines = code.split('\n')
  const marks = new Map<number, LineMark['kind']>()
  const mark = (patterns: RegExp[] | undefined, kind: 'edit' | 'related', wholeBlock: boolean) => {
    lines.forEach((text, index) => {
      if (!patterns?.some(pattern => pattern.test(text))) return
      const length = wholeBlock ? blockLength(lines, index) : 1
      for (let line = index; line < index + length; line++) if (!marks.has(line + 1)) marks.set(line + 1, kind)
    })
  }
  mark(focus.edit, 'edit', true)
  mark(focus.related, 'related', false)
  return [...marks].map(([line, kind]) => ({ line, kind }))
}
