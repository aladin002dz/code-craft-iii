import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { frameRuntime } from './vite-frame-plugin'

/**
 * GitHub Pages serves project sites from /<repository>/ and user sites from /.
 * Order of precedence: BASE_PATH (custom domains, previews), then the repository name
 * GitHub Actions provides, then "/" for local development.
 */
function resolveBase() {
  const explicit = process.env.BASE_PATH
  if (explicit) return `/${explicit.replace(/^\/+|\/+$/g, '')}/`.replace(/^\/\/$/, '/')
  const [owner = '', repository = ''] = (process.env.GITHUB_REPOSITORY ?? '').split('/')
  if (repository && repository.toLowerCase() !== `${owner}.github.io`.toLowerCase()) return `/${repository}/`
  return '/'
}

export default defineConfig({
  base: resolveBase(),
  plugins: [react(), frameRuntime()],
  test: {
    environment: 'jsdom',
    include: ['tests/**/*.test.{ts,tsx}'],
    exclude: ['tests/e2e/**', 'node_modules/**'],
  },
})
