# State Quest — product and implementation brief

## Purpose and status

Build a browser game that teaches React state through practical application features, editable code, live previews, and short interactive challenges.

State Quest is the working name. The user prefers the latest code-editor-and-preview design concept. Earlier fantasy islands, mascots, and lamp-room concepts were rejected as too childish and too far from real projects.

This brief records the design review and implementation direction. The application now has a working editor, sandboxed preview, state inspector, behavior checks, and nine lesson definitions. Generated mockups are visual references, not specifications for exact code, copy, lesson titles, or completion states; some details in them were inconsistent.

The latest proposed lesson-screen mockup is [docs/design/state-quest-lesson-1-mockup.png](docs/design/state-quest-lesson-1-mockup.png). It depicts the completed state of Lesson 1 to show how code, preview, inspector, checks, and progression align; the real exercise must begin in an incomplete state.

## Product direction

- Target learners: beginners who know basic JavaScript and JSX and are learning React state.
- Teach using real React code and small, recognizable product features.
- Reuse three small projects across the curriculum: a settings panel, a shopping cart, and a task board.
- Preserve a playful sense of progress through challenges, predictions, useful feedback, and completed objectives.
- Include animations and drag-and-drop activities where they reinforce a concept or implement a realistic feature.
- Keep learner-facing examples focused on React. The application itself uses TypeScript, but early examples should avoid unnecessary type syntax.
- Save progress and exercise drafts in the current browser. Cross-device accounts and cloud saves are outside the initial scope.

## Curriculum

Retain these nine topics in order. Feature names below are implementation proposals that may be refined without losing the topic.

| Level | Topic | Practical feature and learning objective |
| --- | --- | --- |
| 1 | State changes the screen | Repair a settings theme toggle. Connect an event, state update, and rendered appearance. |
| 2 | `useState` and setters | Build shopping-cart quantity controls with an initial value and increment/decrement behavior. |
| 3 | Updates and previous state | Repair an "Add 3" cart action. Predict queued updates and use functional updates when computing from previous state. |
| 4 | State vs. props | Extract a cart item or settings child component. Identify the state owner and pass values and callbacks through props. |
| 5 | One source of truth | Synchronize two controls for one setting, such as a slider and numeric input, using a single stored value. |
| 6 | Objects and arrays in state | Add, edit, remove, and reorder task-board items with immutable updates. Use drag and drop for reordering. |
| 7 | Lifting state up | Coordinate sibling search/filter controls and a task list through their closest shared parent. |
| 8 | Derived state | Calculate cart totals or visible task counts from existing state instead of storing synchronized duplicates. |
| 9 | Resetting and preserving state | Explore editable task rows with stable keys and intentionally reset a form when its identity changes. |

Teaching accuracy matters: explain that each render sees a state snapshot; do not present the setter as immediately mutating that snapshot. Teach functional updates using a concrete queued-update example. Use stable item IDs when reordering, and distinguish intentional resets from accidental resets caused by unstable keys.

Forms and controlled inputs, `useReducer`, and loading/error states can become a later chapter. Do not replace the agreed nine topics with these extensions.

## Lesson experience

Use this recurring flow:

1. Present a small, realistic feature request and observable success criteria.
2. Let the learner try the broken or incomplete feature.
3. Ask a short prediction when it helps expose a misconception.
4. Focus attention on the code that needs changing.
5. Run the edited React code and show the result in the live preview.
6. Highlight the state change and the affected part of the UI.
7. Run behavior checks and explain failures in useful, specific language.
8. Mark the lesson complete when its required checks pass and enable progression.

The first lesson should start with a broken or incomplete theme toggle. The learner completes the handler and sees how `isDark` controls both appearance and the button label. Provide a coherent starting component, progressive hints, and an explicit reset action.

Avoid putting a complete solution in the initial editor or revealing it through an inspector. Keep challenge difficulty in the React concept, not in writing unrelated CSS or navigating many files.

## Visual and interaction design

Use the professional code-lab concept:

- Compact header with the project, lesson, and progress.
- Collapsible sidebar with Instructions and Files views.
- A prominent syntax-highlighted code editor with line numbers.
- Live application preview alongside the editor.
- A compact state inspector associated with the preview.
- Clear Run checks, Reset, Hint, and Next lesson actions.
- A checklist of observable objectives and readable error feedback.

Use warm off-white, dark navy/ink, a restrained blue accent, crisp borders, modern readable typography, and subtle shadows. Use a monospace font for code. Avoid mascots, fantasy scenery, oversized slogans, decorative reward currency, and dense motivational copy.

Give most of the workspace to code and preview. On smaller screens, provide usable tabs or stacked panels instead of squeezing three narrow columns together. Preserve editor content when switching views.

Layout refinement: desktop uses three columns with more width reserved for the editor; tablets (900–1179px) keep the preview and inspector beside a switchable Lesson/Code panel; narrower screens show one panel at a time with grouped check and progression controls. Editor keyboard guidance sits below the code. The course map uses an introduction beside the lesson list on larger screens and a single column on phones.

Animate meaningful events: changed state values, affected preview elements, successful drops, and completed objectives. Keep animations brief, respect reduced-motion preferences, and avoid interfering with typing or focus.

Drag-and-drop activities must have a keyboard or button alternative. Use them for tasks such as reordering a real task list or arranging update statements, with a clear connection to the lesson.

## Required fixes identified in the design review

1. **Code and preview must match.** The mockup updates `isDark` without using it to render the theme or label. The implementation must show those connections explicitly. Every interactive preview feature must come from learner code or clearly identified supplied project code.
2. **Completion must be consistent.** Do not show "All checks passing" alongside unfinished required objectives and a disabled next action. Define one authoritative completion result and render the checklist and progression from it.
3. **Reduce surrounding clutter.** Shrink the header, remove filler slogans, and make the sidebar collapsible.
4. **Support beginners.** Start with one small component, highlight the relevant edit, and provide progressive hints. Supply unrelated styling separately.
5. **Use purposeful play.** Predictions, debugging, statement ordering, and task reordering should teach a specific concept. Feedback must explain what changed and why.

## Technical direction

### Application and hosting

- React + TypeScript + Vite for the application.
- TanStack Router with hash history for shareable lesson links that work on GitHub Pages without server rewrites.
- CSS and SVG for the professional interface and simple visualizations.
- Motion for useful state and layout animations.
- Pointer-based task dragging inside the sandboxed preview, with move buttons for keyboard access. The gesture wiring is supplied in the starter; the learner implements the immutable reorder function it calls. This avoids native HTML drag behavior across the sandbox boundary.
- React state for local UI and reducers/context where shared application state justifies them.
- Browser local storage for versioned progress, preferences, and drafts. Recover gracefully from missing, invalid, or unavailable storage.
- npm and a committed lockfile for reproducible installs.

GitHub Pages is the hosting target. Configure Vite's asset base for the actual repository path; use `/` for a root site or custom domain. Do not assume the local folder name is the remote repository name. Build static output and deploy it through GitHub Actions using the repository's actual default branch. No server runtime is required for the initial product.

### Code execution and editor

The editor uses CodeMirror. Sucrase compiles the learner's displayed JSX; the result runs in a sandboxed, opaque-origin iframe with an inlined React runtime. This self-hosted choice replaced the proposed Sandpack integration without a Sandpack prototype. The iframe makes no subresource requests; the app's assets are served from its own GitHub Pages origin. A small loop guard bounds synchronous loops in learner code so a runaway render can report an error and recover. The host reads committed React state through a minimal devtools hook in the frame, and behavior checks run against a separate frame executing the same learner code.

The editor/runtime decision must satisfy these requirements:

- Execute the displayed learner code in an isolated preview.
- Support the supplied React project files and editable exercise files.
- Report syntax and runtime errors without breaking the learning application.
- Support resetting and saving drafts.
- Report relevant state values from the executing exercise to the inspector.
- Run behavior checks against the learner's actual result, including incorrect solutions.
- Work from a static GitHub Pages deployment.

Keep any required instrumentation small and clearly explained. Validate messages exchanged between the preview and host application. Do not use `eval` in the main application or allow a preview to modify the parent app's progress directly.

The preview must never be a hardcoded imitation that changes independently of the learner's code. Do not grade by matching exact source strings; accept equivalent correct implementations. If the proposed runtime cannot support reliable inspection and checks, resolve that architecture before building all lessons.

An externally hosted bundler may require network access even though the app is hosted on GitHub Pages. Document the chosen runtime's actual network requirements; do not promise offline execution without implementing and verifying it.

### Content and state structure

Keep lesson content separate from the workspace interface. Each lesson should define its ID, topic, project, prerequisite, instructions, starter files, editable files, hints, objectives, and validation behavior.

Separate learner exercise state from application progress and UI preferences. The state inspector observes the executing exercise; it must not become a second state owner for that exercise.

Keep editor, preview, inspector, lesson instructions, and progression as reusable components. Prefer a small understandable architecture over introducing a generic plugin framework.

## Implementation sequence

### Phase 1: Working lesson and deployment foundation

1. Inspect the repository and applicable instructions before creating files.
2. Scaffold React, TypeScript, Vite, and TanStack Router hash routing.
3. Build the responsive workspace shell in the agreed visual style.
4. Prove the editor/runtime integration with the settings-panel lesson.
5. Make the displayed code, preview, inspector, and behavior checks work together.
6. Add progressive hints, reset, draft persistence, and completion persistence.
7. Add the GitHub Pages build/deploy workflow and verify asset paths and direct lesson links.

A complete first lesson is the first milestone. It is not the end of the planned nine-level product.

### Phase 2: Expand the curriculum

Implement the remaining eight topics using the reusable lesson structure and three practical projects. Add predictions, purposeful animations, and keyboard-accessible drag and drop at appropriate points. Keep prerequisite and completion behavior consistent across the lesson map and workspace.

### Phase 3: Final verification and polish

Verify the full learning journey, refresh/resume behavior, responsive layouts, keyboard access, reduced motion, runtime error recovery, and the deployed GitHub Pages paths. Refine feedback and copy based on the actual exercises.

## Verification and acceptance criteria

Use Vitest for meaningful application/lesson logic checks and browser interaction tests for the actual learning flow. Choose a browser-testing tool available in the environment, such as Playwright. Do not rely on screenshots alone to validate exercises.

The first lesson is ready when:

- The starter exercise visibly fails the intended behavior.
- Editing and running a correct solution changes the real preview.
- The state inspector reflects the executing component's relevant state.
- Incorrect solutions fail with specific feedback; correct equivalent solutions pass.
- Syntax and runtime errors are recoverable.
- Theme appearance and label follow the same state value.
- Required passing checks enable completion and the next lesson consistently.
- Refreshing restores a valid saved draft and progress.
- Keyboard users can complete the activity.
- The workspace remains usable on smaller screens.
- The production build works at the configured GitHub Pages base path, including directly opening and refreshing a hash lesson link.

Before considering the full game complete, apply equivalent acceptance checks to all nine lessons and verify the journey from first lesson to completion. Report what was implemented, what was verified, and any remaining limitations accurately.

## Agreed handbook

Merge Lesson 0 and the handbook into one page titled Handbook at /handbook. Remove Lesson 0 from visible navigation; redirect legacy /introduction links to the handbook. Preserve all nine exercises, completion totals, drafts, and prerequisites.

Improve the merged resource with a restrained editorial layout, numbered sections, clear code and definition panels, and responsive preview panels. Retain the no-coding introduction, component memory, useState explanation, accurate snapshots, executable cart with actual state inspection and reset, and prediction feedback. Add expandable reference notes on queued updates, shared state and props, immutable updates, derived state, and component identity. Exercise screens are outside this visual refresh.
