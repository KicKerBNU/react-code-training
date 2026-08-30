# Assessment Lab

Local trainer for a **Coderbyte-style Software Engineer (ReactJS, TypeScript)** screen. It has two jobs:

1. Rehearse the **Coderbyte user experience** (welcome gate, timer you cannot pause, dashboard of mixed items, in-browser editor, live React preview, hidden tests, copy/paste flag, submit).
2. **Study React + TypeScript** with drills that match the skills those assessments actually measure — not a leak of any company's real exam.

This is practice. Employers configure their own Coderbyte kits. Nobody can promise Broadvoice's exact questions.

## Run

```bash
yarn install
yarn dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

## How to train

### Mock assessment (the dress rehearsal)

Use this until the chrome feels boring:

1. Name and email (Coderbyte's candidate gate).
2. Instructions + 3-hour clock. **Begin Assessment** starts the timer. It does not pause.
3. Dashboard of React items: Agent Directory, Agent Panel, Zustand Queue, Call Session, Theme Context, multiple choice, written.
4. Coding items open a briefing page, then the editor: prompt on the left, Monaco on the right, live preview for React, Reference Search, **Run tests** / **Submit Solution**.
5. Sample tests are named. Hidden tests stay unnamed until you submit.
6. Copy/paste is counted and flagged, the same way Coderbyte records it.
7. **Submit Assessment** (or time expiry) ends the run and shows a local score report.

Do not rename provided element IDs. Tests query them.

### Study hub

Read **How the Coderbyte assessment actually feels** first, then drill in this order:

1. Button Toggle, Counter, Live Paragraph, Color Dropdown  
2. Queue List → **Agent Directory** (parent owns the list; form and table are children)  
3. **Agent Panel** (siblings + useEffect) → **Zustand Queue** (store, no prop drilling) → **Call Session** (interval cleanup)  
4. Theme Context, Forecast Panel, **City Weather Search** (local lookup + recents), **Agent Fetch Table** (live JSONPlaceholder fetch), Tic Tac Toe  
5. MCQ + written  
6. One full timed mock  

String / graph / math puzzles are under **Optional JS puzzles**. Skip them unless a real invite lists algorithm challenges.

Hints and solutions are available in study mode only.

## What this does *not* do

- It is not the real Coderbyte site and it does not use their copyrighted prompts verbatim.
- It does not proctor, record video, or send results to Broadvoice.
- A green local score is not a job offer. The live round after the screen still matters.

## Stack

Vite, React 19, TypeScript, Monaco, Sucrase (in-browser TSX), React 18 UMD in the preview iframe so challenge code matches a Coderbyte-like `createRoot` starter.
