import type { StudyArticle } from '../types'

export const studyArticles: StudyArticle[] = [
  {
    id: 'coderbyte-ux',
    title: 'How the Coderbyte assessment actually feels',
    minutes: 7,
    tags: ['environment', 'timer', 'submit'],
    body: `Coderbyte is not LeetCode with a nicer skin. It is a timed, employer-configured exam in a browser IDE. The mix is chosen by Broadvoice, not by Coderbyte, so nobody can promise the exact questions. What you can train is the environment and the skill patterns that React + TypeScript screens keep reusing.

**The flow you will see**

1. A landing page asks for your name and email so the company can attach results to a candidate.
2. A welcome / instructions page shows the time limit on the left. The timer has not started yet.
3. Clicking Begin Assessment starts the clock. You cannot pause it. Closing the tab does not pause it either.
4. You land on a dashboard of every item: coding challenges, multiple choice, and written questions.
5. Coding items open a briefing page, then the editor. Left side is the prompt and sample cases. Right side is the editor. Frontend items also show a live preview of your component.
6. You click Submit Solution on each challenge so it is graded. Then you click Submit Assessment when you are done with everything.

**Rules that catch people**

- Do not rename the provided function. Algorithm files end with something like \`console.log(GraphChallenge(readline()))\`. Leave that line alone. The platform uses it to feed hidden tests.
- Do not rename the provided element IDs or strip starter markup. Tests query those IDs. You may add classes and styles.
- The editor flags copy/paste. Write in their editor. Looking things up is expected — Coderbyte even has a Reference Search pane — but pasting a finished solution from ChatGPT is a signal, not a shortcut.
- Sample cases on the left are not the whole suite. Hidden tests cover empty lists, sorting, disabled buttons, rejected fetches, and "did you mutate state".
- Submit the challenge and the assessment. A green editor is not a submitted assessment.

**How to spend 3 hours**

- 5 minutes: open every item, tag easy/medium/hard, pick an order. Do not start coding yet.
- Agent Directory: 35 minutes. Parent owns the list. Form and table are children.
- Agent Panel: 30 minutes. Siblings share nothing except through the parent. useEffect loads notes.
- Zustand Queue: 30 minutes. Siblings subscribe to a store. No props from Application.
- Call Session: 25 minutes. Interval lives in an effect with cleanup.
- Theme Context: 15 minutes.
- MCQ + written: 25 minutes. Written answers should be specific (merge vs rebase, a real migration tradeoff), not slogans.
- Last 10 minutes: click every Submit, then Submit Assessment.

Use this trainer's **Mock assessment** to rehearse that sequence until it feels boring.`,
  },
  {
    id: 'react-state',
    title: 'State, events, and the Coderbyte React starter',
    minutes: 8,
    tags: ['useState', 'events', 'JSX'],
    body: `Almost every Coderbyte React file looks the same: a functional component, a \`TODO\` handler, \`createRoot\`, and a render call you should not delete.

**The smallest correct pattern**

\`\`\`tsx
const [on, setOn] = useState(true);

function handleClick() {
  setOn((prev) => !prev);
}

return <button id="toggle" onClick={handleClick}>{on ? 'ON' : 'OFF'}</button>;
\`\`\`

Why the functional updater? Coderbyte tests click quickly. \`setOn(!on)\` can close over a stale \`on\` if something batches oddly. \`prev => !prev\` is always current.

**What belongs in state**

- Values the user can change: toggles, input text, selected row, theme, board cells.
- Not values you can derive: filtered lists, "is the form valid", winner of tic-tac-toe. Compute those during render.

**Events**

- Buttons: \`onClick\`.
- Inputs: \`onChange\` with \`event.target.value\`.
- Forms: \`onSubmit\` plus \`event.preventDefault()\`. Forgetting preventDefault is the #1 "it works in preview, tests say the table is empty" bug, because a native submit reloads the document.

**TypeScript in the editor**

You will often write \`React.ChangeEvent<HTMLInputElement>\` and \`React.FormEvent<HTMLFormElement>\`. If the file already imported \`{ useState }\` only, you can still use the \`React.\` namespace if \`import React from 'react'\` (or \`import React, { useState }\`) is there. Match the starter's import style.

Practice: Button Toggle, Simple Counter, Live Paragraph.`,
  },
  {
    id: 'lists-forms',
    title: 'Lists, keys, forms, and sorting',
    minutes: 9,
    tags: ['lists', 'forms', 'keys'],
    body: `The Agent Directory / Phone Book family of challenges is the one that shows up most often on React screens. It looks large. It is four habits.

**1. Controlled fields**

Every input has \`value\` + \`onChange\`. Prefill state with the values from the prompt (Coder / Byte / 8885559999 in the classic version). Tests read \`input.value\` on load. After submit, clear with \`""\` — never \`null\`. A controlled \`<input>\` must always get a string.

**2. Lifted collection**

The form does not own the table. The parent holds \`entries\`, the form calls \`onAdd(entry)\`, the table receives \`entries\`.

**3. Immutable add**

\`setEntries(current => [...current, entry])\`. Do not \`.push\` into state. Do not \`entries.sort()\` in place — sort a copy: \`[...entries].sort((a, b) => a.lastName.localeCompare(b.lastName))\`.

**4. Keys and IDs**

\`id="firstName"\`, \`id="lastName"\`, \`id="phone"\`, \`id="submit"\`, \`id="informationTable"\` are typical. If you "clean up" those IDs, you score 0 even if the UI looks right.

For filterable lists: keep the source array constant, derive \`visible = items.filter(...)\`, and put \`key\` on the \`li\`. For single-select, store the selected id/name and set \`className={item === selected ? 'active' : undefined}\`.

Practice: Queue List, then Agent Directory. Time yourself at 25 minutes on Directory until you can do it without peeking.`,
  },
  {
    id: 'effects-context',
    title: 'Effects, fetching, and Context',
    minutes: 8,
    tags: ['useEffect', 'fetch', 'context'],
    body: `**Fetching on click, not on mount**

Forecast / weather challenges usually want: type a city, click Search, show Loading, then data or an error. That is event-driven async, not \`useEffect\` on mount.

\`\`\`tsx
async function handleSearch() {
  setStatus('Loading');
  setResult(null);
  try {
    const data = await fetchForecast(query.trim());
    setResult(data);
    setStatus('');
  } catch {
    setStatus('City not found');
  }
}
\`\`\`

If you leave "Loading" on screen after success, hidden tests fail. If you forget \`try/catch\`, a rejected promise can take down the preview.

**City Weather Search** is the sync version: \`CITIES[name]\` is a local object, not \`fetch\`. Same click → result or "City not found" pattern, plus a recents list of buttons so a later click can restore a city you already found.

**Agent Fetch Table** uses that same click → Loading → data pattern against a real HTTP API (\`https://jsonplaceholder.typicode.com/users\`). Call \`fetch(url)\`, check \`response.ok\`, then \`await response.json()\`. Sort a *copy* of the array (\`[...users].sort(...)\`) so you do not mutate what the API returned. Stay online — there is no local mock list.

Use \`useEffect\` when the prompt says "when the city prop changes, load". Put the async function inside the effect, and clean up with an \`ignore\` flag or abort controller so a slow response cannot overwrite a newer one.

**Context**

\`createContext\`, provider with \`{ theme, toggle }\`, consumers with \`useContext\`. The wrapper's \`className\` is often the only thing tests assert. Default value of the context can be \`null\`; throw if a consumer is used outside the provider so you notice immediately.

Practice: Forecast Panel, City Weather Search, Agent Fetch Table, Theme Context, Agent Panel, Call Session, and Zustand Queue.`,
  },
  {
    id: 'typescript-react',
    title: 'TypeScript you actually need in 90 minutes',
    minutes: 6,
    tags: ['typescript', 'types'],
    body: `Coderbyte TypeScript files are not a types puzzle. They are React puzzles with a type checker. Stay in the shallow end.

**Model the data**

\`\`\`ts
type Entry = { firstName: string; lastName: string; phone: string };
type Mark = 'X' | 'O' | null;
\`\`\`

**Event handlers**

\`\`\`ts
function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
  const { name, value } = event.target;
  setForm(current => ({ ...current, [name]: value }));
}
\`\`\`

For a computed key, you may need a small assertion or a name union: \`name as keyof Entry\`.

**Arrays**

\`useState<Entry[]>([])\` and \`useState<Mark[]>(Array(9).fill(null))\`. If \`fill(null)\` infers \`null[]\`, annotate the state.

**What to skip**

Generics gymnastics, \`satisfies\`, branded types, and extra interfaces for every prop. If the starter is untyped JS, you can still write JS. If the starter is TS, add types where the compiler complains — usually state and events.

If the editor shows a TS error but the preview works, still fix it. Some company assessments compile with \`strict\` enough that a red file is a failed submit.`,
  },
  {
    id: 'state-management',
    title: 'useState, Context, Zustand, Redux — pick the smallest tool',
    minutes: 7,
    tags: ['zustand', 'context', 'architecture'],
    body: `Broadvoice-scale React is not "put everything in Redux." It is matching the tool to how far the data has to travel and how often it changes.

**useState (default)**

One component, or a parent with a few children, owns the data. Agent Directory is this: the form's fields and the table's rows live in React state next to the UI. Keystrokes never need a global store.

**Context**

A value many components read that barely changes: theme, locale, current user. You wrap a tree in a Provider. If the value updates often (a live queue), every consumer re-renders — that is when Context starts to hurt.

**Zustand**

An external store. \`create()\` returns a hook. No Provider. Distant siblings call \`useQueueStore(s => s.agents)\` and stay in sync. Use it when lifting to \`Application\` would thread props through a migration, or when the data is shared across routes.

\`\`\`ts
const useQueueStore = create<QueueStore>((set) => ({
  agents: [],
  add: (name) => set((state) => ({ agents: [...state.agents, name] })),
}))
\`\`\`

The input that types the new name can still be \`useState\` in QueueComposer. Only the shared list belongs in the store.

**Redux Toolkit**

Same job as Zustand for many teams, with more ceremony (slices, middleware, DevTools). Reach for it when the org already standardized on it, or you need a hard audit trail. Do not introduce it to hold one form.

**Rule of thumb**

Local UI → useState. Rare tree-wide reads → Context. Frequent, distant, shared → Zustand or Redux. Never the keystroke of a single input.

Practice: Agent Directory (lifted useState), Theme Context, then **Zustand Queue**.`,
  },
  {
    id: 'algorithms',
    title: 'Optional: if the real invite includes JS puzzles',
    minutes: 6,
    tags: ['skip-unless-needed'],
    body: `Skip this unless your Coderbyte invite explicitly lists algorithm / string / graph challenges. A React Software Engineer screen does not need anagrams to prove you can lift state.

If they do appear: they are plain TypeScript functions, not components. Normalize strings for anagrams, BFS for unweighted shortest path, trial division for the next prime. Leave \`console.log(Challenge(readline()))\` at the bottom.

They live under **Optional JS puzzles** in the study hub. Do not spend mock-assessment time on them.`,
  },
  {
    id: 'game-day',
    title: 'Game-day checklist for Broadvoice',
    minutes: 5,
    tags: ['strategy', 'broadvoice'],
    body: `This role is senior React + TypeScript, with a real legacy-to-React migration in a CCaaS product. The Coderbyte screen is still a screen: they are checking that you can implement UI under time, not that you can design their next design system.

**Before you click the link**

- Quiet room, charger, Chrome without aggressive ad blockers (Coderbyte's own guide says blockers break the page).
- Scratch paper for listing IDs and which component owns which piece of state.
- Decide your order: start with Agent Directory or Agent Panel while you are fresh.

**While coding React**

- Draw the tree: parent state, props down, events up. Siblings do not import each other.
- Highlight every ID and every default value in the prompt.
- If data must load or a timer must stop, that is \`useEffect\` plus a cleanup function — not a click handler leaking a \`setInterval\`.
- Use the live preview like a QA: click, type, submit, watch the sibling views update.

**Written questions**

They often ask git (merge vs rebase, revert vs reset) and teamwork. Tie answers to a migration: incremental slices, no big-bang, evidence from a spike. That matches how Broadvoice described the job.

**After you submit**

You will not usually see a score. The company does. This trainer shows scores so you can learn. On the real thing, assume silence is normal.

Train in this order: environment article → Toggle/Counter/Live Text → Queue List → **Agent Directory** → **Agent Panel** → **Zustand Queue** → Call Session → Theme + Forecast → one full timed mock.`,
  },
]
