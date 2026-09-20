/// <reference types="vite/client" />

declare module 'virtual:frame-runtime' {
  /** The self-contained preview frame script (see vite-frame-plugin.ts). */
  const script: string
  export default script
}
