import { transform } from 'sucrase'

export type CompileResult =
  | { ok: true; js: string }
  | { ok: false; message: string; line: number | null; column: number | null }

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
    return { ok: true, js }
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
