import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { catalogById, mockAssessment } from '../data/catalog'
import type {
  CodingAttempt,
  McqAttempt,
  Screen,
  TestResult,
  WrittenAttempt,
} from '../types'

type Candidate = { name: string; email: string }

type SessionState = {
  screen: Screen
  candidate: Candidate
  mode: 'idle' | 'assessment' | 'study'
  activeItemId: string | null
  articleId: string | null
  startedAt: number | null
  endsAt: number | null
  coding: Record<string, CodingAttempt>
  mcq: Record<string, McqAttempt>
  written: Record<string, WrittenAttempt>
  assessmentSubmitted: boolean
}

const emptyCoding = (starter: string): CodingAttempt => ({
  code: starter,
  results: [],
  submitted: false,
  pasteCount: 0,
})

const initial: SessionState = {
  screen: 'home',
  candidate: { name: '', email: '' },
  mode: 'idle',
  activeItemId: null,
  articleId: null,
  startedAt: null,
  endsAt: null,
  coding: {},
  mcq: {},
  written: {},
  assessmentSubmitted: false,
}

type SessionContextValue = SessionState & {
  remainingMs: number
  setScreen: (screen: Screen) => void
  setCandidate: (candidate: Candidate) => void
  startAssessment: () => void
  openItem: (id: string, next: Screen) => void
  openArticle: (id: string) => void
  enterStudy: () => void
  updateCode: (id: string, code: string) => void
  recordPaste: (id: string) => void
  saveCodingResults: (id: string, results: TestResult[], submitted: boolean) => void
  saveMcqAnswer: (setId: string, questionId: string, optionId: string) => void
  submitMcq: (setId: string) => void
  saveWrittenAnswer: (setId: string, questionId: string, value: string) => void
  submitWritten: (setId: string) => void
  submitAssessment: () => void
  reset: () => void
  leave: () => void
  ensureCoding: (id: string, starter: string) => CodingAttempt
}

const SessionContext = createContext<SessionContextValue | null>(null)

export function SessionProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SessionState>(initial)
  const [now, setNow] = useState(Date.now())

  useEffect(() => {
    if (state.mode !== 'assessment' || !state.endsAt || state.assessmentSubmitted) return
    const timer = window.setInterval(() => setNow(Date.now()), 500)
    return () => window.clearInterval(timer)
  }, [state.mode, state.endsAt, state.assessmentSubmitted])

  useEffect(() => {
    if (state.mode !== 'assessment' || !state.endsAt || state.assessmentSubmitted) return
    if (now >= state.endsAt) {
      setState((current) => ({ ...current, assessmentSubmitted: true, screen: 'results' }))
    }
  }, [now, state.mode, state.endsAt, state.assessmentSubmitted])

  const remainingMs = state.endsAt ? Math.max(0, state.endsAt - now) : 0

  const value = useMemo<SessionContextValue>(() => {
    return {
      ...state,
      remainingMs,
      setScreen: (screen) => setState((current) => ({ ...current, screen })),
      setCandidate: (candidate) => setState((current) => ({ ...current, candidate })),
      startAssessment: () => {
        const startedAt = Date.now()
        setState((current) => ({
          ...current,
          mode: 'assessment',
          screen: 'dashboard',
          startedAt,
          endsAt: startedAt + mockAssessment.durationMinutes * 60_000,
          assessmentSubmitted: false,
          coding: {},
          mcq: {},
          written: {},
        }))
      },
      openItem: (id, next) => setState((current) => ({ ...current, activeItemId: id, screen: next })),
      openArticle: (id) => setState((current) => ({ ...current, articleId: id, screen: 'study-article' })),
      enterStudy: () => setState((current) => ({ ...current, mode: 'study', screen: 'study' })),
      updateCode: (id, code) =>
        setState((current) => ({
          ...current,
          coding: {
            ...current.coding,
            [id]: { ...(current.coding[id] ?? emptyCoding(code)), code },
          },
        })),
      recordPaste: (id) =>
        setState((current) => {
          const existing = current.coding[id]
          if (!existing) return current
          return {
            ...current,
            coding: { ...current.coding, [id]: { ...existing, pasteCount: existing.pasteCount + 1 } },
          }
        }),
      saveCodingResults: (id, results, submitted) =>
        setState((current) => {
          const existing = current.coding[id]
          if (!existing) return current
          return {
            ...current,
            coding: { ...current.coding, [id]: { ...existing, results, submitted: existing.submitted || submitted } },
          }
        }),
      saveMcqAnswer: (setId, questionId, optionId) =>
        setState((current) => {
          const existing = current.mcq[setId] ?? { answers: {}, submitted: false }
          return {
            ...current,
            mcq: {
              ...current.mcq,
              [setId]: { ...existing, answers: { ...existing.answers, [questionId]: optionId } },
            },
          }
        }),
      submitMcq: (setId) =>
        setState((current) => {
          const existing = current.mcq[setId] ?? { answers: {}, submitted: false }
          return { ...current, mcq: { ...current.mcq, [setId]: { ...existing, submitted: true } } }
        }),
      saveWrittenAnswer: (setId, questionId, value) =>
        setState((current) => {
          const existing = current.written[setId] ?? { answers: {}, submitted: false }
          return {
            ...current,
            written: {
              ...current.written,
              [setId]: { ...existing, answers: { ...existing.answers, [questionId]: value } },
            },
          }
        }),
      submitWritten: (setId) =>
        setState((current) => {
          const existing = current.written[setId] ?? { answers: {}, submitted: false }
          return { ...current, written: { ...current.written, [setId]: { ...existing, submitted: true } } }
        }),
      submitAssessment: () => setState((current) => ({ ...current, assessmentSubmitted: true, screen: 'results' })),
      reset: () => setState(initial),
      leave: () =>
        setState((current) =>
          current.mode === 'assessment'
            ? initial
            : { ...current, mode: 'idle', screen: 'home', activeItemId: null, articleId: null },
        ),
      ensureCoding: (id, starter) => {
        const existing = state.coding[id]
        if (existing) return existing
        const item = catalogById[id]
        const code = starter || ('starter' in item ? item.starter : '')
        queueMicrotask(() => {
          setState((current) => {
            if (current.coding[id]) return current
            return { ...current, coding: { ...current.coding, [id]: emptyCoding(code) } }
          })
        })
        return emptyCoding(code)
      },
    }
  }, [remainingMs, state])

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
}

export function useSession() {
  const value = useContext(SessionContext)
  if (!value) throw new Error('useSession must be used within SessionProvider')
  return value
}
