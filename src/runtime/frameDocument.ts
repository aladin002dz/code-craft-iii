let runtime: Promise<string> | undefined

/** The preview frame script, loaded once and only when a lesson opens. */
export function loadFrameRuntime(): Promise<string> {
  runtime ??= import('virtual:frame-runtime').then(module => module.default)
  return runtime
}

/** A complete HTML document for the sandboxed frame, with the runtime inline and nothing to fetch. */
export function frameDocument(script: string): string {
  // Keep the bundle from ending its own <script> element or opening an HTML comment.
  const safe = script.replace(/<\/script/gi, '<\\/script').replace(/<!--/g, '<\\!--')
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Preview</title></head><body><div id="root"></div><script>${safe}</script></body></html>`
}
