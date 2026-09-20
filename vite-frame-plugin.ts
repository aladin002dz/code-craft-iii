import { resolve } from 'node:path'
import { build, type Plugin } from 'vite'

const VIRTUAL_ID = 'virtual:frame-runtime'
const RESOLVED_ID = `\0${VIRTUAL_ID}`
const FRAME_DIR = resolve(import.meta.dirname, 'src/frame')

/**
 * Bundles src/frame (React, the inspector hook, the checks, the styles) into one
 * self-contained script and exposes it as a string: `import script from 'virtual:frame-runtime'`.
 *
 * The preview iframe is sandboxed without same-origin access, so it has an opaque origin and
 * could only load separate script or CSS files if the host sent CORS headers. Inlining the
 * script into the frame's srcdoc removes every subresource request: no hosting headers, no
 * base-path concerns, and no network access from inside the frame.
 */
export function frameRuntime(): Plugin {
  return {
    name: 'state-quest-frame-runtime',
    resolveId: id => (id === VIRTUAL_ID ? RESOLVED_ID : null),
    async load(id) {
      if (id !== RESOLVED_ID) return null
      const result = await build({
        configFile: false,
        logLevel: 'silent',
        mode: 'production',
        // Libraries are not given NODE_ENV automatically; this selects React's production build.
        define: { 'process.env.NODE_ENV': '"production"' },
        build: {
          write: false,
          target: 'es2022',
          lib: { entry: resolve(FRAME_DIR, 'main.ts'), formats: ['iife'], name: 'StateQuestFrame' },
          rollupOptions: { output: { inlineDynamicImports: true } },
        },
      })
      const outputs = Array.isArray(result) ? result.flatMap(item => item.output) : 'output' in result ? result.output : []
      const chunk = outputs.find(item => item.type === 'chunk')
      if (!chunk || chunk.type !== 'chunk') throw new Error('Could not bundle the preview frame runtime.')
      for (const file of Object.keys(chunk.modules)) if (file.startsWith(FRAME_DIR)) this.addWatchFile(file)
      return `export default ${JSON.stringify(chunk.code)}`
    },
    handleHotUpdate({ file, server }) {
      // Frame code is bundled separately, so a change there needs a fresh bundle and page.
      if (!file.startsWith(FRAME_DIR)) return
      const module = server.moduleGraph.getModuleById(RESOLVED_ID)
      if (module) server.moduleGraph.invalidateModule(module)
      server.ws.send({ type: 'full-reload' })
      return []
    },
  }
}
