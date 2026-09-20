import { transform } from 'sucrase'
import { parse, type Node } from 'acorn'
import { full } from 'acorn-walk'

export type CompileResult =
  | { ok: true; js: string }
  | { ok: false; message: string; line: number | null; column: number | null }

type LoopNode = Node & { body: Node }

/** Bound synchronous loops before they can pin a sandboxed frame's renderer indefinitely. */
function guardLoops(js: string): string {
  const tree = parse(js, { ecmaVersion: 'latest', sourceType: 'script' })
  const edits: { position: number; text: string }[] = []
  full(tree, node => {
    if (!['ForStatement', 'ForInStatement', 'ForOfStatement', 'WhileStatement', 'DoWhileStatement'].includes(node.type)) return
    const body = (node as LoopNode).body
    if (body.type === 'BlockStatement') {
      edits.push({ position: body.start + 1, text: '__stateQuestLoopGuard();' })
    } else {
      edits.push({ position: body.start, text: '{__stateQuestLoopGuard();' })
      edits.push({ position: body.end, text: '}' })
    }
  })
  for (const edit of edits.sort((a, b) => b.position - a.position)) {
    js = js.slice(0, edit.position) + edit.text + js.slice(edit.position)
  }
  return `let __stateQuestLoopCount = 0;\nfunction __stateQuestLoopGuard() {\n  if (++__stateQuestLoopCount > 100000) throw new Error('Code stopped responding: a loop ran too many times. Check its condition.');\n}\n${js}`
}

/**
 * Turn learner JSX into CommonJS the preview frame can run. Sucrase only strips JSX and
 * rewrites imports: no type checking, no evaluation. Nothing here runs the learner's code.
 */
export function compileLearnerCode(code: string, filename: string): CompileResult {
  try {
    const { code: js } = transform(code, {
      transforms: ['jsx', 'imports'],
      jsxRuntime: 'automatic',
      production: true,
      filePath: filename,
    })
    return { ok: true, js: guardLoops(js) }
  } catch (error) {
    const raw = error instanceof Error ? error.message : String(error)
    const position = /\((\d+):(\d+)\)\s*$/.exec(raw)
    return {
      ok: false,
      message: raw.replace(/\s*\(\d+:\d+\)\s*$/, ''),
      line: position ? Number(position[1]) : null,
      column: position ? Number(position[2]) : null,
    }
  }
}
