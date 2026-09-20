# State Quest implementation status

Read `AGENTS.md` and `PROJECT_BRIEF.md` before changing the app. The original foundation was committed as `a29655f` on `main`; the work described below is currently in the working tree.

## Implemented

- React, TypeScript, Vite, TanStack hash routing, CodeMirror, responsive workspace, sandboxed React preview, state inspector, behavior checks, hints, reset, browser drafts, and completion persistence.
- All nine agreed lessons are registered with their starters and checks. A single completion result drives each checklist and progression action.
- Sucrase compiles learner JSX. Acorn adds a bounded synchronous-loop guard before code enters the sandbox. The preview runtime is inlined into an opaque-origin iframe and makes no subresource requests.
- Lesson 6 task reordering works by pointer drag and by move buttons. Both call the learner's `moveTask` implementation.
- `.github/workflows/deploy.yml` builds and deploys the static app from `main` to GitHub Pages. Vite derives the Pages base from `GITHUB_REPOSITORY`; the browser test uses the actual repository path, `/code-craft-iii/`.

## Verification completed on Windows Chrome

- `tsc -b` passes.
- `vitest run` passes 23 tests, including all nine starter/solution pairs, objective mapping, storage recovery, completion status, and message validation.
- The full 16-case browser suite passes with two workers. It includes the nine-lesson journey, pointer dragging and button reordering in Lesson 6, completion after refresh, and Lesson 1 syntax/runtime recovery, infinite-loop recovery, keyboard completion, mobile panels, drafts, and no third-party requests.
- A production build succeeded with the actual `/code-craft-iii/` asset base.

On this machine, `npm` on `PATH` resolves to a broken roaming launcher. Set `npm_config_prefix=C:\Program Files\nodejs` for commands that invoke npm, or run the npm CLI through `node` directly. Playwright reports all test results but its Windows process sometimes remains open during web-server teardown; interrupt it after recording the results. `node_modules` and the npm cache are ignored by Git.

## Still to verify or finish

- Verify GitHub Pages deployment after pushing: repository Pages source must be GitHub Actions, and `https://aladin002dz.github.io/code-craft-iii/#/lesson/1` should refresh correctly. No deployment has been performed in this session.
- Test cross-browser behavior, especially sandbox startup and pointer dragging, and review screen-reader focus/announcements and reduced motion.
- Main app bundle is about 1.2 MB before gzip. Consider lazy loading the workspace/compiler if load time is too high.
