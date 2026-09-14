import type { AssessmentDefinition, CatalogItem } from '../types'
import { algoChallenges } from './algoChallenges'
import { mcqSet, writtenSet } from './knowledge'
import { reactChallenges } from './reactChallenges'

export const catalog: CatalogItem[] = [
  ...reactChallenges,
  ...algoChallenges,
  mcqSet,
  writtenSet,
]

export const catalogById = Object.fromEntries(catalog.map((item) => [item.id, item])) as Record<
  string,
  CatalogItem
>

export const mockAssessment: AssessmentDefinition = {
  id: 'broadvoice-react-ts',
  title: 'Software Engineer (ReactJS, TypeScript)',
  company: 'Broadvoice',
  durationMinutes: 180,
  itemIds: [
    'react-directory',
    'react-agent-panel',
    'react-zustand-queue',
    'react-call-session',
    'react-theme-context',
    'react-city-weather',
    'react-agent-table',
    'mcq-react',
    'written-eng',
  ],
  welcome: `This mock is a React + TypeScript screen: component challenges (forms, lifted state, siblings, Zustand, effects, context), a multiple-choice set, and written prompts.

The timer starts when you click Begin Assessment and cannot be paused. Work in the in-browser editor. Hidden tests run on submit. Copy/paste is flagged, the same way Coderbyte records it.

This is practice, not the real Broadvoice exam. Train parent/child state, sibling communication, stores vs local state, fetch + sorted tables, and useEffect cleanup.`,
  rules: [
    'You have 3 hours (180 minutes) for the entire assessment.',
    'Do not rename provided element IDs or helper functions in the starter.',
    'Agent Fetch Table must fetch https://jsonplaceholder.typicode.com/users — do not replace it with a local timeout list.',
    'Submit each challenge, then submit the assessment.',
    'You may use the Reference Search pane. Writing your own code is the point.',
    'Ad blockers can break the real Coderbyte page. This trainer runs locally.',
  ],
}

export function isCodingItem(item: CatalogItem): item is Extract<CatalogItem, { kind: 'react' | 'algo' }> {
  return item.kind === 'react' || item.kind === 'algo'
}

export function isReactItem(item: CatalogItem): item is Extract<CatalogItem, { kind: 'react' }> {
  return item.kind === 'react'
}

export function isAlgoItem(item: CatalogItem): item is Extract<CatalogItem, { kind: 'algo' }> {
  return item.kind === 'algo'
}
