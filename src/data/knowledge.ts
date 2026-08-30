import type { McqSet, WrittenSet } from '../types'

export const mcqSet: McqSet = {
  id: 'mcq-react',
  kind: 'mcq',
  title: 'React + TypeScript Knowledge',
  difficulty: 'medium',
  timeSuggestedMin: 12,
  questions: [
    {
      id: 'q1',
      prompt: 'When rendering a list in React, what helps the reconciler know which items changed?',
      options: [
        { id: 'a', text: 'The array index as the only identifier' },
        { id: 'b', text: 'A stable key prop on each child' },
        { id: 'c', text: 'Wrapping the list in React.memo' },
        { id: 'd', text: 'Calling Array.prototype.sort first' },
      ],
      correctId: 'b',
      explanation:
        'Keys should be stable IDs. Indexes are a last resort because they break when the list is reordered or filtered.',
    },
    {
      id: 'q2',
      prompt: 'Which hook is the right default for combining mount and update side effects?',
      options: [
        { id: 'a', text: 'useMemo' },
        { id: 'b', text: 'useLayoutEffect' },
        { id: 'c', text: 'useEffect' },
        { id: 'd', text: 'useImperativeHandle' },
      ],
      correctId: 'c',
      explanation:
        'useEffect runs after paint for both mount and dependency updates. useLayoutEffect is for measuring DOM before paint.',
    },
    {
      id: 'q3',
      prompt: 'What does useMemo help you avoid?',
      options: [
        { id: 'a', text: 'Re-running expensive calculations when dependencies have not changed' },
        { id: 'b', text: 'All child re-renders, unconditionally' },
        { id: 'c', text: 'The need for keys on lists' },
        { id: 'd', text: 'Stale closures in event handlers' },
      ],
      correctId: 'a',
      explanation:
        'useMemo caches a computed value. It does not freeze the tree. For referential stability of callbacks, use useCallback.',
    },
    {
      id: 'q4',
      prompt: 'Which update is unsafe in React state?',
      options: [
        { id: 'a', text: 'setItems(items.map(item => item.id === id ? { ...item, done: true } : item))' },
        { id: 'b', text: 'items.push(next); setItems(items);' },
        { id: 'c', text: 'setItems(current => [...current, next])' },
        { id: 'd', text: 'setCount(c => c + 1)' },
      ],
      correctId: 'b',
      explanation:
        'Mutating the existing array and passing it back may skip a render. Always copy: map, filter, slice, or spread.',
    },
    {
      id: 'q5',
      prompt: 'In TypeScript + React, what is the usual event type for a text input onChange?',
      options: [
        { id: 'a', text: 'React.ChangeEvent<HTMLInputElement>' },
        { id: 'b', text: 'InputEvent<string>' },
        { id: 'c', text: 'React.FormEvent<unknown>' },
        { id: 'd', text: 'KeyboardEvent<HTMLDivElement>' },
      ],
      correctId: 'a',
      explanation:
        'ChangeEvent carries target.value with the correct element type. FormEvent is for submit handlers.',
    },
    {
      id: 'q6',
      prompt: 'Which statement about refs is true?',
      options: [
        { id: 'a', text: 'Updating ref.current re-renders the component' },
        { id: 'b', text: 'refs are for values that must persist without triggering a render' },
        { id: 'c', text: 'You cannot put a ref on a DOM node' },
        { id: 'd', text: 'useRef is only valid inside class components' },
      ],
      correctId: 'b',
      explanation:
        'ref.current is mutable and silent. Use it for DOM nodes, timers, and previous values — not for UI state.',
    },
    {
      id: 'q7',
      prompt: 'What is required for JSX to run in the browser during a Coderbyte-style challenge?',
      options: [
        { id: 'a', text: 'A Babel/TypeScript transform that turns JSX into React.createElement calls' },
        { id: 'b', text: 'A .jsx file extension only — the browser parses JSX natively' },
        { id: 'c', text: 'Putting JSX inside a <script type="text/html"> tag' },
        { id: 'd', text: 'Importing JSX from "react-dom/server"' },
      ],
      correctId: 'a',
      explanation:
        'Browsers do not understand JSX. The assessment editor transpiles it. You still write JSX in the starter file.',
    },
    {
      id: 'q8',
      prompt: 'You want to share theme state with nested components without prop drilling. What do you reach for first?',
      options: [
        { id: 'a', text: 'window.theme' },
        { id: 'b', text: 'React.createContext and a provider' },
        { id: 'c', text: 'A CSS variable only, with no React state' },
        { id: 'd', text: 'Redux, because Context cannot hold state' },
      ],
      correctId: 'b',
      explanation:
        'Context is the built-in tool for this. A CSS variable can style, but it will not by itself drive React conditionals.',
    },
    {
      id: 'q9',
      prompt: 'A login email field is only used inside one form component. Where should that value live?',
      options: [
        { id: 'a', text: 'Zustand / Redux, so every screen can read it' },
        { id: 'b', text: 'useState in that form' },
        { id: 'c', text: 'React Context at the app root' },
        { id: 'd', text: 'A module-level let email = ""' },
      ],
      correctId: 'b',
      explanation:
        'Keystrokes in a local form are component state. A global store would re-render unrelated screens for no benefit.',
    },
    {
      id: 'q10',
      prompt: 'Two distant sibling trees need the same queue that updates often. You want to avoid a Provider and prop drilling. What fits?',
      options: [
        { id: 'a', text: 'useState in App passed through every layer' },
        { id: 'b', text: 'Zustand (or another external store) that components subscribe to' },
        { id: 'c', text: 'useRef in a random child, read via document.querySelector' },
        { id: 'd', text: 'Copy the array into window.queue' },
      ],
      correctId: 'b',
      explanation:
        'Zustand holds state outside React and lets any component subscribe. Context still works, but a high-frequency queue at the root can re-render a large tree. useState in App is lifting, not a store.',
    },
    {
      id: 'q11',
      prompt: 'How does Zustand differ from React Context for shared state?',
      options: [
        { id: 'a', text: 'Zustand requires wrapping the tree in a Provider; Context does not' },
        { id: 'b', text: 'Context is only for TypeScript; Zustand is only for JavaScript' },
        { id: 'c', text: 'Zustand has no Provider — components call useStore() directly; Context needs a Provider' },
        { id: 'd', text: 'They are identical APIs with different package names' },
      ],
      correctId: 'c',
      explanation:
        'create() returns a hook. Any component can call it. Context consumers break without a matching Provider above them.',
    },
  ],
}

export const writtenSet: WrittenSet = {
  id: 'written-eng',
  kind: 'written',
  title: 'Engineering Communication',
  difficulty: 'medium',
  timeSuggestedMin: 15,
  questions: [
    {
      id: 'w1',
      prompt:
        'A teammate wants to rebase a public branch that other people are already using. You think a merge is safer. How do you explain the difference, and what do you recommend?',
      rubric: [
        'Defines merge as a non-rewriting join that preserves history',
        'Defines rebase as rewriting commits onto a new base',
        'Warns that rebasing shared history forces everyone else to recover',
        'Gives a clear recommendation for a public branch',
      ],
      sampleAnswer: `Merge creates a join commit and leaves existing SHAs alone, so everyone who already pulled the branch stays in sync. Rebase replays commits on top of a new base, which rewrites SHAs. That is fine on a local feature branch you have not shared. On a public branch, rebasing forces teammates to reset or reconcile divergent history. I would merge (or use a merge queue) for the shared branch, and keep rebase for cleaning up a private branch before the first push.`,
    },
    {
      id: 'w2',
      prompt:
        'You and a colleague disagree about introducing a new state library during a React migration. How do you handle the conflict so the team still ships?',
      rubric: [
        'Separates the product constraint from the technical preference',
        'Proposes a small spike or RFC instead of a big-bang rewrite',
        'Shows respect for the other engineer',
        'Ends with a reversible decision and a review point',
      ],
      sampleAnswer: `I would restate the migration goal: move screens to React without stopping delivery. A new state library is a bet, not a requirement for the first slices. I would suggest we keep local state + context for the current epic, spike the library on one isolated flow, and compare bundle size, mental overhead, and testability in a short write-up. That keeps the disagreement technical, gives us evidence, and leaves a reversible door if the spike fails.`,
    },
    {
      id: 'w3',
      prompt:
        'When would you keep state in useState, when in Context, and when in Zustand (or Redux) on a large React migration?',
      rubric: [
        'useState for local UI: forms, toggles, one-component lists',
        'Context for rare, tree-wide values: theme, locale, current user',
        'Zustand/Redux for frequent updates shared by distant screens, with a reason not to lift everything to App',
        'Warns against putting every keystroke in a global store',
      ],
      sampleAnswer: `useState stays the default — a directory form, a toggle, a local filter. Context is for values many components read that barely change, like theme or the signed-in user, so we are not threading props through the migration. Zustand (or Redux Toolkit) is for cross-cutting, high-churn state such as an agent queue or call session that distant siblings must share without re-rendering the whole shell. I would not put a single input's onChange into Zustand. Spike one store on one flow, measure re-renders, then keep or drop it.`,
    },
  ],
}
