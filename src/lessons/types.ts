export type ProjectName = string

export type Objective = {
  /** Matches the id of a check in src/frame/checks. */
  id: string
  label: string
}

export type Prediction = {
  question: string
  /** Code the question refers to, shown read-only. */
  code?: string
  options: string[]
  answer: number
  /** Explains why the answer is right, whichever option was chosen. */
  explanation: string
}

export type Lesson = {
  id: number
  topic: string
  title: string
  project: ProjectName
  /** Lesson that must be completed first, or null for the first lesson. */
  prerequisite: number | null
  /** The feature request, in one or two sentences. */
  request: string
  steps: string[]
  /** The concept in plain words, shown after the steps. */
  concept: string
  objectives: Objective[]
  /** Progressive hints: nudge first, most specific last. */
  hints: string[]
  prediction?: Prediction
  filename: string
  starter: string
  /** Lines to draw attention to: `edit` is where the learner works, `related` is code that reacts to it. */
  focus: { edit: RegExp[]; related?: RegExp[] }
}
