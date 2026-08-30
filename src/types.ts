export type Difficulty = 'easy' | 'medium' | 'hard'

export type ItemKind = 'react' | 'algo' | 'mcq' | 'written'

export type Screen =
  | 'home'
  | 'welcome'
  | 'intro'
  | 'dashboard'
  | 'briefing'
  | 'editor'
  | 'mcq'
  | 'written'
  | 'results'
  | 'study'
  | 'study-article'

export type DomHarness = {
  document: Document
  window: Window & typeof globalThis
  wait: (ms?: number) => Promise<void>
  click: (el: Element | null, label: string) => Promise<void>
  setValue: (
    el: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null,
    value: string,
    label: string,
  ) => Promise<void>
  submitForm: (form: HTMLFormElement | null, label: string) => Promise<void>
  text: (el: Element | null) => string
  must: <T>(value: T | null | undefined, message: string) => T
}

export type ChallengeTest = {
  id: string
  name: string
  hidden: boolean
  run: (harness: DomHarness) => Promise<void>
}

export type AlgoCase = {
  id: string
  name: string
  hidden: boolean
  args: unknown[]
  expected: unknown
}

export type Example = {
  title: string
  body: string
}

export type ReactChallenge = {
  id: string
  kind: 'react'
  title: string
  difficulty: Difficulty
  timeSuggestedMin: number
  prompt: string
  examples: Example[]
  starter: string
  solution: string
  hints: string[]
  concepts: string[]
  tests: ChallengeTest[]
}

export type AlgoChallenge = {
  id: string
  kind: 'algo'
  title: string
  difficulty: Difficulty
  timeSuggestedMin: number
  prompt: string
  examples: Example[]
  starter: string
  solution: string
  hints: string[]
  concepts: string[]
  fnName: string
  tests: AlgoCase[]
}

export type McqOption = {
  id: string
  text: string
}

export type McqQuestion = {
  id: string
  prompt: string
  options: McqOption[]
  correctId: string
  explanation: string
}

export type McqSet = {
  id: string
  kind: 'mcq'
  title: string
  difficulty: Difficulty
  timeSuggestedMin: number
  questions: McqQuestion[]
}

export type WrittenQuestion = {
  id: string
  prompt: string
  rubric: string[]
  sampleAnswer: string
}

export type WrittenSet = {
  id: string
  kind: 'written'
  title: string
  difficulty: Difficulty
  timeSuggestedMin: number
  questions: WrittenQuestion[]
}

export type CodingChallenge = ReactChallenge | AlgoChallenge
export type CatalogItem = CodingChallenge | McqSet | WrittenSet

export type TestResult = {
  id: string
  name: string
  hidden: boolean
  passed: boolean
  message?: string
}

export type CodingAttempt = {
  code: string
  results: TestResult[]
  submitted: boolean
  pasteCount: number
}

export type McqAttempt = {
  answers: Record<string, string>
  submitted: boolean
}

export type WrittenAttempt = {
  answers: Record<string, string>
  submitted: boolean
}

export type StudyArticle = {
  id: string
  title: string
  minutes: number
  tags: string[]
  body: string
}

export type AssessmentDefinition = {
  id: string
  title: string
  company: string
  durationMinutes: number
  itemIds: string[]
  welcome: string
  rules: string[]
}
