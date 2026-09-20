# Handoff: State Quest, session 1

Read `AGENTS.md` and `PROJECT_BRIEF.md` first. This file records where implementation stopped and what to do next. Nothing has been committed (`git init -b main` was run; there are no commits).

## Where things stand

**Phase 1 is close but not finished.** Lesson 1 works end to end in real Chrome. Lessons 2–9 are written but not wired in or tested.

| Area | State |
| --- | --- |
| Scaffold, router (hash history), workspace UI, editor, preview, inspector, checklist, hints, reset, drafts, progress | Built. `npx tsc -b` passes. |
| Lesson 1 unit tests (`tests/lesson1.test.ts`, jsdom) | 8/8 passed earlier. Not re-run after the later frame/UI changes. |
| Lesson 1 e2e (`tests/e2e/lesson1.spec.ts`, Playwright + Chrome) | **13 of 14 pass** on the last run. The failing one is "an infinite loop is caught and the app stays usable"; it timed out at 30 s waiting on a `.preview-stage` attribute. Not diagnosed. See `test-results/lesson1-an-infinite-loop-is-caught-and-the-app-stays-usable/test-failed-1.png`. |
| Lessons 2–9 | Starters, definitions and checks are written (`src/lessons/lessonN.ts`, `src/lessons/starters/*.jsx`, `src/frame/checks/lessonN.ts`). **Not registered** in `src/lessons/index.ts` or `src/frame/checks/index.ts`, and there are no fixtures or tests for them yet. Treat them as unverified drafts. |
| GitHub Pages workflow | Not written. |
| `PROJECT_BRIEF.md` / `AGENTS.md` updates | Not done. |

## Decisions made (record these in `PROJECT_BRIEF.md`)

1. **Sandpack was dropped.** The runtime is self-hosted: Sucrase compiles learner JSX in the app (`src/runtime/compile.ts`), and it runs in a `sandbox="allow-scripts"` iframe bundling its own React. Reason: no third-party bundler dependency, and checks and inspection stay under our control. I chose this by design analysis; I did not prototype Sandpack. `@codesandbox/sandpack-react` was uninstalled.
2. **The frame gets no subresources.** `vite-frame-plugin.ts` bundles `src/frame` into one IIFE string (virtual module `virtual:frame-runtime`, lazy-loaded chunk, ~230 KB / 72 KB gzip). It is inlined into the iframe `srcdoc`. I tried separate module files first; a sandboxed frame has an opaque origin, so that would need CORS headers that `vite preview` doesn't send and that I couldn't verify on GitHub Pages. The frame makes zero network requests. Base path does not affect it.
3. **The inspector reads real state.** `src/frame/hook-install.ts` installs a minimal React devtools hook before react-dom loads, and `src/frame/inspect.ts` reads `useState`/`useReducer` hooks from committed fibers. Variable names are recovered from the learner's source (`src/runtime/inspector.ts`); values always come from React. Learner code needs no marker attributes.
4. **Checks are typed functions** in `src/frame/checks/`, run inside the frame against the learner's actual DOM (click, type, read state). They pass equivalent solutions and give specific failure messages. Lesson 6's checks deep-freeze state so in-place mutation throws.
5. **One completion status.** `src/runtime/status.ts` (`deriveStatus`) drives the checklist, status pill and Next button. Completion, once earned, persists; editing afterwards shows "Completed. Run checks again after editing" and marks objectives pending.
6. **Preview timing.** Startup wait (spawn → frame `ready`) is 20 s; execution wait (`init` → first render) is 5 s and means "endless loop". Checks time out at 15 s. The preview header shows "Updating…" / "Up to date", and the stage exposes `data-fresh`, which the tests use.
7. **Lesson 6 drag and drop uses native HTML5 DnD** (with ↑/↓ buttons as the keyboard alternative). `@dnd-kit/react` is installed but unused. Decide whether to use it (for example a host-side "order these statements" activity) or remove it.
8. **Storage** has three versioned keys (`progress`, `drafts`, `preferences`) in `src/state/`, with defensive parsing. No unit tests yet.

## The main open problem: flaky preview startup under load

Symptoms seen in Playwright with 2 workers: the first preview frame sometimes never renders (banner: "stopped responding", or `data-ready` stays false). It did not happen in sequential runs.

What I changed, in order of how much it seemed to help:
- Turned Playwright tracing off (traces snapshot each iframe's 230 KB `srcdoc`).
- Made pending/checks frames `opacity: 0` and layered underneath instead of `display:none` / `visibility:hidden` (`.preview-frame.pending`, `.checks-frame` in `src/styles.css`). My theory is that Chrome deprioritizes invisible out-of-process frames, which starves them of CPU.
- Split the watchdog into startup vs. execution phases (`src/runtime/PreviewController.ts`).

Result: 12/12 clean startups in a dedicated run, and 13/14 in the full suite. The one remaining failure may be the same issue or something specific to the loop test. **I have not proven the root cause.** Next steps:
1. Look at the failing screenshot to see whether it failed in `beforeEach` or after `setCode`.
2. Re-run the spec several times (`npx playwright test --repeat-each=5 --workers=2`) to see if it is flaky or deterministic.
3. If startup is still slow, consider a blob URL frame instead of `srcdoc` (lighter DOM), or keeping one warm frame.

## Environment gotchas

- **Stale servers:** `playwright.config.ts` uses `reuseExistingServer: !process.env.CI`. A leftover `vite preview` on port 4173 makes Playwright test an old build. Before running e2e, check `netstat -ano | grep :4173` and kill leftovers. This caused a lot of confusion this session.
- **Git Bash mangles `BASE_PATH=/state-quest/`** into a Windows path. Pass `BASE_PATH=state-quest` (the config normalizes it).
- **The Claude desktop browser pane blocks all iframe navigation to localhost**, so it cannot show the preview. Use Playwright with the installed Chrome (`channel: 'chrome'`) for anything involving the frame.
- `.claude/launch.json` defines a `state-quest-dev` server on port 5173.
- `VisualDesign.png` in the root is byte-identical to `docs/design/state-quest-lesson-1-mockup.png`; it can be deleted.
- Build warnings (harmless for now): main chunk ~1 MB; `vite.config.ts` imports `./vite-frame-plugin` without an extension (Vite native config loader warning); `inlineDynamicImports` ignored with `codeSplitting: false`.

## Commands

```bash
npm run dev          # Vite dev server
npm run build        # tsc -b && vite build (set BASE_PATH=state-quest to test the Pages path)
npm test             # Vitest (jsdom): runs lesson checks against fixtures
npm run test:e2e     # Playwright + Chrome; builds with BASE_PATH=state-quest and serves on :4173
```

## Next steps, in order

1. Diagnose the one failing e2e test (above) and get Lesson 1 to a stable green. This finishes the Phase 1 milestone's browser verification.
2. Register lessons 2–9: add them to `src/lessons/index.ts` and `src/frame/checks/index.ts`. `LESSON_COUNT` in `src/state/stores.ts` is already 9.
3. For each of lessons 2–9, add `tests/fixtures/lessonN.ts` (correct solution, an equivalent solution, and one or two wrong ones) and a Vitest file, modeled on `tests/fixtures/lesson1.ts` and `tests/lesson1.test.ts`. Confirm each starter fails at least one objective and each correct solution passes all of them. Add a data test that objective ids match check ids, and that every starter compiles.
4. In `src/frame/checks/run.ts`, append a hint when a check fails with a mutation-style error (`/not extensible|read.only|Cannot assign to read only/`), such as "This usually means state was changed in place; make a copy". Lesson 6 relies on it.
5. Unit tests for `storage.ts` / `stores.ts` (invalid JSON, wrong version, out-of-range ids, unavailable storage), `status.ts`, `inspector.ts` (name recovery, formatting) and `protocol.ts` (rejects malformed messages).
6. Write `.github/workflows/deploy.yml` (checkout, setup-node, `npm ci`, `npm test`, `npm run build`, configure-pages, upload-pages-artifact, deploy-pages). Vite already derives the base from `GITHUB_REPOSITORY`. Use the repository's real default branch (currently only a local `main`). Verify after deploy that direct `#/lesson/N` links work on refresh.
7. Extend e2e: locked-lesson route, next-lesson navigation, a pass-through of all nine lessons, lesson 6 drag and drop, reduced-motion.
8. Update `PROJECT_BRIEF.md` (runtime decision above; network needs: none from the frame) and `AGENTS.md` (commands, the stale-server and `BASE_PATH` gotchas). Optionally add a `CLAUDE.md` that imports `@AGENTS.md`.
9. Phase 2/3 polish per the brief: purposeful animation, dnd-kit decision, accessibility pass (screen-reader labels, focus after actions), responsive checks at more widths, code-splitting the app bundle.

## Known limitations to keep reporting honestly

- An endless loop in learner code freezes only its own frame in my tests, and the watchdog recovers. I have not verified this across browsers, and a loop triggered later by a click in the live preview is not detected (there is no heartbeat).
- A learner can forge check results in their own browser; progress is client-side only, as the brief accepts.
- The frame runtime needs no network, but the app has only been tested in Chrome on Windows.
