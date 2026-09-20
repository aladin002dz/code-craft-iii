// Runs inside the sandboxed preview frame (and, for unit tests, inside jsdom).
import * as React from 'react'
import * as jsxRuntime from 'react/jsx-runtime'
import { createRoot, type Root } from 'react-dom/client'
import { watchContainer } from './inspect'

const modules: Record<string, unknown> = {
  react: React,
  'react/jsx-runtime': jsxRuntime,
  'react-dom/client': { createRoot },
}

function requireModule(name: string) {
  if (name in modules) return modules[name]
  throw new Error(`Cannot import "${name}". These lessons only use "react".`)
}

/** Evaluate compiled learner code and return its default export. Frame-only: never call from the app. */
export function evaluateComponent(js: string): React.ComponentType {
  const module = { exports: {} as { default?: unknown } }
  new Function('require', 'module', 'exports', js)(requireModule, module, module.exports)
  const component = module.exports.default
  if (typeof component !== 'function') {
    throw new Error('Export your component with "export default function ..." so the preview can render it.')
  }
  return component as React.ComponentType
}

class Boundary extends React.Component<{ children: React.ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  render() {
    return this.state.failed ? null : this.props.children
  }
}

export type Mounted = {
  remount(): void
  unmount(): void
}

/** Render `Component` into `container`. Errors thrown while rendering are sent to `onError`. */
export function mountComponent(container: HTMLElement, Component: React.ComponentType, onError: (error: unknown) => void): Mounted {
  let root: Root | null = null
  const start = () => {
    container.replaceChildren()
    watchContainer(container)
    root = createRoot(container, { onCaughtError: onError, onUncaughtError: onError })
    root.render(React.createElement(Boundary, null, React.createElement(Component)))
  }
  const stop = () => {
    root?.unmount()
    root = null
  }
  start()
  return {
    remount() {
      stop()
      start()
    },
    unmount: stop,
  }
}
