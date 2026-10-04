# Code Craft

Learn React state and effects by building working features in small, realistic projects. The code you edit is the code you see running.

**[https://mahfoudh.dev/code-craft-iii/](https://mahfoudh.dev/code-craft-iii/)**

## How the live code lab works

```mermaid
flowchart LR
    A[Read a feature request] --> B[Edit React code]
    B --> C[Try the live preview]
    C --> D[Inspect the state]
    D --> E[Run checks]
    E -->|Feedback| B
    E -->|All pass| F[Next lesson]
```

Each exercise starts with a small, incomplete React feature. You change its code, interact with the resulting UI, and use the state inspector and checks to understand the result. Checks accept equivalent working solutions, not one exact code answer.

## The sandbox at a glance

```mermaid
flowchart TB
    Editor[Code editor] --> Compile[Compile JSX]
    Compile --> Preview[Visible iframe: React preview]
    Compile --> Checks[Hidden iframe: behavior checks]
    Preview -->|state and effect updates| Inspector[State inspector]
    Checks -->|results| Progress[Objectives and progress]
```

The preview and checks run your compiled code in separate sandboxed iframes. An iframe is a small page inside the app, so its React component has its own document and styles.

| Setting | Purpose |
| --- | --- |
| `sandbox="allow-scripts"` | Lets React and learner code run. |
| No `allow-same-origin` | Prevents direct access to the app's DOM, cookies, and saved progress. |
| `postMessage` | Sends state, errors, and check results back to the app. |

## What happens when you edit?

| You do this | The lab does this |
| --- | --- |
| Edit valid JSX | Compiles it after a short pause and swaps in a fresh preview. |
| Click inside the preview | Runs your handler and shows React's committed state. |
| Make a syntax error | Keeps the last working preview visible and shows the error. |
| Run checks | Mounts the same code in a hidden frame and tests each objective. |
| Refresh | Restores drafts, progress, and preferences from browser storage. |

<details>
<summary>Technical details</summary>

React, the frame runtime, checks, and styles are bundled into the iframe's inline document. Messages are validated by sender, format, and a per-frame token. Loop guards and timeouts help the lab recover from unresponsive code.

For the effects course, the frame's `react` module wraps `useEffect` to count each effect's runs and cleanups for the inspector; React still decides when effects run. Checks run with a fake clock and tracked window listeners, so timer and subscription behaviour is tested instantly. Because the sandbox has no network access, `fetch('/api/...')` is answered by a supplied pretend server (`./network.js`, with a visible network log), and a supplied chat server (`./chat.js`) stands in for a real connection.

See [Workspace](src/ui/Workspace.tsx), [PreviewController](src/runtime/PreviewController.ts), [the compiler](src/runtime/compile.ts), and [the frame runtime](src/frame/runtime.ts).

</details>

## Courses

The home page lists both courses. Each has its own course map, handbook, and progress.

| Course | Lessons | Topics |
| --- | --- | --- |
| React state | 9 | State changes, `useState`, functional updates, props, one source of truth, immutable updates, lifting state, derived state, and state preservation, in a settings panel, shopping cart, and task board. |
| Effects with `useEffect` | 7 | Ordered from the most common use of effects: fetching data on load, refetching when a value changes (with stale-response cleanup), browser events, timers, external connections, DOM work, and when not to use an effect, in a team chat, focus timer, and task board. |

## Run locally

Requires Node.js 22 or newer.

```sh
npm ci
npm run dev
```

Use `npm test` for the lesson and application checks, and `npm run build` to create the static site in `dist/`.

The site is deployed to GitHub Pages by [the GitHub Actions workflow](.github/workflows/deploy.yml).
