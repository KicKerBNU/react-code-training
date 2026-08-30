import type { ReactChallenge } from '../types'

async function waitForTableRows(
  document: Document,
  wait: (ms?: number) => Promise<void>,
  minRows: number,
) {
  for (let attempt = 0; attempt < 100; attempt += 1) {
    if (document.querySelectorAll('#agents-table tbody tr').length >= minRows) return
    await wait(100)
  }
  throw new Error(
    'Timed out waiting for table rows. Use fetch() against the JSONPlaceholder URL and keep the browser online.',
  )
}

export const reactChallenges: ReactChallenge[] = [
  {
    id: 'react-toggle',
    kind: 'react',
    title: 'React Button Toggle',
    difficulty: 'easy',
    timeSuggestedMin: 8,
    prompt: `We provided some simple React template code. Your goal is to modify the component so the button can toggle between an ON state and an OFF state.

When the button is on and it is clicked, it turns off and the text inside it changes from ON to OFF, and vice versa. Use component state for this challenge.

You are free to add classes and styles, but make sure you leave the element IDs as they are.`,
    examples: [
      {
        title: 'Behavior',
        body: 'Initial render shows ON. First click → OFF. Second click → ON.',
      },
    ],
    concepts: ['useState', 'event handlers', 'conditional rendering'],
    hints: [
      'Store a boolean in useState. The button label is derived from that boolean.',
      'Wire onClick to a setter. Prefer setOn(prev => !prev) so you never read a stale value.',
      'Do not rename id="toggle". Hidden tests query that ID.',
    ],
    starter: `import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';

function Toggle() {
  function handleClick() {
    // TODO
  }

  return (
    <button id="toggle">
      ON
    </button>
  );
}

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<Toggle />);
`,
    solution: `import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';

function Toggle() {
  const [on, setOn] = useState(true);

  function handleClick() {
    setOn((prev) => !prev);
  }

  return (
    <button id="toggle" onClick={handleClick}>
      {on ? 'ON' : 'OFF'}
    </button>
  );
}

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<Toggle />);
`,
    tests: [
      {
        id: 'toggle-id',
        name: 'Renders a button with id="toggle"',
        hidden: false,
        async run({ document, must }) {
          must(document.getElementById('toggle'), 'Expected #toggle')
        },
      },
      {
        id: 'toggle-initial',
        name: 'Initial label is ON',
        hidden: false,
        async run({ document, must, text }) {
          const button = must(document.getElementById('toggle'), 'Expected #toggle')
          if (text(button) !== 'ON') throw new Error(`Expected ON, got "${text(button)}"`)
        },
      },
      {
        id: 'toggle-off',
        name: 'First click switches the label to OFF',
        hidden: false,
        async run({ document, must, click, text }) {
          const button = must(document.getElementById('toggle'), 'Expected #toggle')
          await click(button, '#toggle')
          if (text(button) !== 'OFF') throw new Error(`Expected OFF after click, got "${text(button)}"`)
        },
      },
      {
        id: 'toggle-back',
        name: 'Second click switches the label back to ON',
        hidden: true,
        async run({ document, must, click, text }) {
          const button = must(document.getElementById('toggle'), 'Expected #toggle')
          await click(button, '#toggle')
          await click(button, '#toggle')
          if (text(button) !== 'ON') throw new Error(`Expected ON after two clicks, got "${text(button)}"`)
        },
      },
    ],
  },
  {
    id: 'react-counter',
    kind: 'react',
    title: 'React Simple Counter',
    difficulty: 'easy',
    timeSuggestedMin: 10,
    prompt: `Build a counter that starts at 0. Clicking Increment should add 1. Clicking Decrement should subtract 1, but the value must never go below 0.

Keep the provided element IDs.`,
    examples: [
      {
        title: 'Behavior',
        body: 'Start at 0. Increment twice → 2. Decrement three times → 0 (never negative).',
      },
    ],
    concepts: ['useState', 'derived disabled state', 'event handlers'],
    hints: [
      'One piece of state is enough: the numeric count.',
      'Decrement should no-op (or be disabled) when count is already 0.',
      'Tests read #count, #increment, and #decrement.',
    ],
    starter: `import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';

function Counter() {
  return (
    <div>
      <h2 id="count">0</h2>
      <button id="decrement">Decrement</button>
      <button id="increment">Increment</button>
    </div>
  );
}

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<Counter />);
`,
    solution: `import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <h2 id="count">{count}</h2>
      <button id="decrement" onClick={() => setCount((n) => Math.max(0, n - 1))}>
        Decrement
      </button>
      <button id="increment" onClick={() => setCount((n) => n + 1)}>
        Increment
      </button>
    </div>
  );
}

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<Counter />);
`,
    tests: [
      {
        id: 'counter-start',
        name: 'Starts at 0',
        hidden: false,
        async run({ document, must, text }) {
          if (text(must(document.getElementById('count'), '#count')) !== '0') {
            throw new Error('Count should start at 0')
          }
        },
      },
      {
        id: 'counter-inc',
        name: 'Increment increases the count',
        hidden: false,
        async run({ document, must, click, text }) {
          await click(document.getElementById('increment'), '#increment')
          await click(document.getElementById('increment'), '#increment')
          if (text(must(document.getElementById('count'), '#count')) !== '2') {
            throw new Error('Expected 2 after two increments')
          }
        },
      },
      {
        id: 'counter-floor',
        name: 'Decrement never goes below 0',
        hidden: true,
        async run({ document, must, click, text }) {
          await click(document.getElementById('decrement'), '#decrement')
          await click(document.getElementById('decrement'), '#decrement')
          if (text(must(document.getElementById('count'), '#count')) !== '0') {
            throw new Error('Count went below 0')
          }
        },
      },
    ],
  },
  {
    id: 'react-live-text',
    kind: 'react',
    title: 'React Live Paragraph',
    difficulty: 'easy',
    timeSuggestedMin: 8,
    prompt: `Make the paragraph with id="output" always mirror whatever the user types into the input with id="input". The paragraph should start empty.

This is a controlled input challenge. Leave the provided IDs unchanged.`,
    examples: [
      {
        title: 'Behavior',
        body: 'Typing "hold please" into the input immediately shows "hold please" in #output.',
      },
    ],
    concepts: ['controlled inputs', 'useState', 'value + onChange'],
    hints: [
      'The input must be controlled: value={text} onChange={e => setText(e.target.value)}.',
      'Render the same state in the paragraph.',
      'Do not use defaultValue if you want the paragraph to stay in sync.',
    ],
    starter: `import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';

function LiveText() {
  return (
    <div>
      <input id="input" type="text" />
      <p id="output"></p>
    </div>
  );
}

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<LiveText />);
`,
    solution: `import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';

function LiveText() {
  const [text, setText] = useState('');

  return (
    <div>
      <input
        id="input"
        type="text"
        value={text}
        onChange={(event) => setText(event.target.value)}
      />
      <p id="output">{text}</p>
    </div>
  );
}

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<LiveText />);
`,
    tests: [
      {
        id: 'live-empty',
        name: 'Output starts empty',
        hidden: false,
        async run({ document, must, text }) {
          if (text(must(document.getElementById('output'), '#output')) !== '') {
            throw new Error('Output should start empty')
          }
        },
      },
      {
        id: 'live-mirror',
        name: 'Output mirrors the input',
        hidden: false,
        async run({ document, must, setValue, text }) {
          await setValue(document.getElementById('input') as HTMLInputElement, 'hold please', '#input')
          if (text(must(document.getElementById('output'), '#output')) !== 'hold please') {
            throw new Error('Output did not mirror the typed value')
          }
        },
      },
    ],
  },
  {
    id: 'react-color-select',
    kind: 'react',
    title: 'React Color Dropdown',
    difficulty: 'easy',
    timeSuggestedMin: 10,
    prompt: `The select with id="color-select" should contain three options: Red, Green, and Blue.

A box with id="color-box" must display the selected color name and use that color as its background.

Default selection is Red.`,
    examples: [
      {
        title: 'Behavior',
        body: 'Choosing Green updates #color-box text to Green and background to green.',
      },
    ],
    concepts: ['controlled select', 'inline styles', 'derived UI'],
    hints: [
      'Keep the selected value in state. Initialize it to "Red".',
      'style={{ backgroundColor: color.toLowerCase() }} is enough for this challenge.',
      'Leave option values as Red, Green, and Blue — tests check those strings.',
    ],
    starter: `import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';

function ColorPicker() {
  return (
    <div>
      <select id="color-select">
      </select>
      <div id="color-box"></div>
    </div>
  );
}

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<ColorPicker />);
`,
    solution: `import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';

function ColorPicker() {
  const [color, setColor] = useState('Red');

  return (
    <div>
      <select
        id="color-select"
        value={color}
        onChange={(event) => setColor(event.target.value)}
      >
        <option>Red</option>
        <option>Green</option>
        <option>Blue</option>
      </select>
      <div id="color-box" style={{ backgroundColor: color.toLowerCase(), padding: 24 }}>
        {color}
      </div>
    </div>
  );
}

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<ColorPicker />);
`,
    tests: [
      {
        id: 'color-options',
        name: 'Select has Red, Green, and Blue',
        hidden: false,
        async run({ document, must }) {
          const select = must(document.getElementById('color-select'), '#color-select') as HTMLSelectElement
          const labels = [...select.options].map((option) => option.text)
          for (const color of ['Red', 'Green', 'Blue']) {
            if (!labels.includes(color)) throw new Error(`Missing option ${color}`)
          }
        },
      },
      {
        id: 'color-default',
        name: 'Default selection is Red',
        hidden: false,
        async run({ document, must, text }) {
          const box = must(document.getElementById('color-box'), '#color-box')
          if (text(box) !== 'Red') throw new Error('Default box text should be Red')
        },
      },
      {
        id: 'color-change',
        name: 'Changing the select updates the box',
        hidden: true,
        async run({ document, must, setValue, text, window }) {
          const select = must(document.getElementById('color-select'), '#color-select') as HTMLSelectElement
          await setValue(select, 'Blue', '#color-select')
          const box = must(document.getElementById('color-box'), '#color-box')
          if (text(box) !== 'Blue') throw new Error('Box text should become Blue')
          const bg = window.getComputedStyle(box).backgroundColor
          if (!bg.includes('0, 0, 255') && !bg.includes('blue')) {
            throw new Error(`Expected a blue background, got ${bg}`)
          }
        },
      },
    ],
  },
  {
    id: 'react-queue-list',
    kind: 'react',
    title: 'React Queue List',
    difficulty: 'medium',
    timeSuggestedMin: 18,
    prompt: `Render the provided agents in a list. Clicking a list item should make it the only selected item by adding the class "active".

The search box with id="search" should filter the list by name, case-insensitive, as the user types.

Each row must keep a data-name attribute with the agent's name so tests can find it. Do not rename the provided IDs.`,
    examples: [
      {
        title: 'Filter',
        body: 'Typing "li" leaves "Ava Reed" and "Luis Costa" visible, and hides "Noah Patel".',
      },
      {
        title: 'Selection',
        body: 'Click Ava, then Noah. Only Noah has class "active".',
      },
    ],
    concepts: ['lists + keys', 'filter', 'single-select state', 'className'],
    hints: [
      'Keep the original array in a constant. Derive the visible list with .filter().',
      'Store selectedName in state. className={name === selectedName ? "active" : undefined}.',
      'data-name is how tests find rows after you filter. Do not skip it.',
    ],
    starter: `import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';

const AGENTS = ['Ava Reed', 'Noah Patel', 'Luis Costa'];

function QueueList() {
  return (
    <div>
      <input id="search" placeholder="Filter agents" />
      <ul id="item-list">
      </ul>
    </div>
  );
}

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<QueueList />);
`,
    solution: `import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';

const AGENTS = ['Ava Reed', 'Noah Patel', 'Luis Costa'];

function QueueList() {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<string | null>(null);
  const visible = AGENTS.filter((name) =>
    name.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div>
      <input
        id="search"
        placeholder="Filter agents"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
      <ul id="item-list">
        {visible.map((name) => (
          <li
            key={name}
            data-name={name}
            className={name === selected ? 'active' : undefined}
            onClick={() => setSelected(name)}
          >
            {name}
          </li>
        ))}
      </ul>
    </div>
  );
}

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<QueueList />);
`,
    tests: [
      {
        id: 'list-render',
        name: 'Renders all three agents',
        hidden: false,
        async run({ document }) {
          const names = ['Ava Reed', 'Noah Patel', 'Luis Costa']
          for (const name of names) {
            if (!document.querySelector(`[data-name="${name}"]`)) {
              throw new Error(`Missing row for ${name}`)
            }
          }
        },
      },
      {
        id: 'list-filter',
        name: 'Search filters the list',
        hidden: false,
        async run({ document, setValue }) {
          await setValue(document.getElementById('search') as HTMLInputElement, 'li', '#search')
          if (document.querySelector('[data-name="Noah Patel"]')) {
            throw new Error('Noah Patel should be filtered out')
          }
          if (!document.querySelector('[data-name="Ava Reed"]') || !document.querySelector('[data-name="Luis Costa"]')) {
            throw new Error('Ava and Luis should remain visible')
          }
        },
      },
      {
        id: 'list-select',
        name: 'Clicking a row applies class active to only that row',
        hidden: true,
        async run({ document, click }) {
          const ava = document.querySelector('[data-name="Ava Reed"]')
          const noah = document.querySelector('[data-name="Noah Patel"]')
          await click(ava, 'Ava Reed')
          await click(noah, 'Noah Patel')
          if (!noah?.classList.contains('active')) throw new Error('Noah should be active')
          if (ava?.classList.contains('active')) throw new Error('Ava should no longer be active')
        },
      },
    ],
  },
  {
    id: 'react-directory',
    kind: 'react',
    title: 'React Agent Directory',
    difficulty: 'medium',
    timeSuggestedMin: 25,
    prompt: `Create a simple directory form at the top that lets the user enter a first name, last name, and phone number, with a submit button.

When the form is submitted, that person should appear in a table below, along with every previous entry. The table must stay sorted alphabetically by last name.

When the application loads, the input fields (not the table) should already be prepopulated with:

- First name = Coder
- Last name = Byte
- Phone = 8885559999

After a successful submit, clear the inputs to empty strings (""). Do not reset them with null. A controlled React input should always receive a string: the typed value, a prefilled default, or "".

You are free to add classes and styles, but make sure you leave the element IDs as they are.`,
    examples: [
      {
        title: 'Sorting',
        body: 'Submitting (Mia, Young) then (Alex, Adler) lists Adler before Young.',
      },
    ],
    concepts: ['controlled forms', 'preventDefault', 'immutable array updates', 'sorting'],
    hints: [
      'This is the classic Coderbyte-style form+table challenge. Read IDs first, then implement behavior.',
      'Call event.preventDefault() on submit or the page will reload in a real browser.',
      'Sort a copy: [...entries].sort((a, b) => a.last.localeCompare(b.last)). Never mutate state in place.',
      'Prepopulate the inputs, not the table. Tests fail if Coder Byte is already a row on load.',
      'After submit, set each field to "" — not null. value={null} makes React warn and can flip the input to uncontrolled.',
    ],
    starter: `import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';

function DirectoryForm() {
  return (
    <form id="directory-form">
      <label>
        First name:
        <input id="firstName" name="firstName" />
      </label>
      <label>
        Last name:
        <input id="lastName" name="lastName" />
      </label>
      <label>
        Phone:
        <input id="phone" name="phone" />
      </label>
      <button id="submit" type="submit">Add</button>
    </form>
  );
}

function InformationTable() {
  return (
    <table id="informationTable">
      <thead>
        <tr>
          <th>First name</th>
          <th>Last name</th>
          <th>Phone</th>
        </tr>
      </thead>
      <tbody>
      </tbody>
    </table>
  );
}

function Application() {
  return (
    <div>
      <DirectoryForm />
      <InformationTable />
    </div>
  );
}

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<Application />);
`,
    solution: `import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';

type Entry = {
  firstName: string;
  lastName: string;
  phone: string;
};

const DEFAULT_ENTRY: Entry = {
  firstName: 'Coder',
  lastName: 'Byte',
  phone: '8885559999',
};

const EMPTY_ENTRY: Entry = {
  firstName: '',
  lastName: '',
  phone: '',
};

function DirectoryForm({ onAdd }: { onAdd: (entry: Entry) => void }) {
  const [form, setForm] = useState<Entry>(DEFAULT_ENTRY);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!form.firstName || !form.lastName || !form.phone) return;
    onAdd(form);
    setForm(EMPTY_ENTRY);
  }

  return (
    <form id="directory-form" onSubmit={handleSubmit}>
      <label>
        First name:
        <input id="firstName" name="firstName" value={form.firstName} onChange={handleChange} />
      </label>
      <label>
        Last name:
        <input id="lastName" name="lastName" value={form.lastName} onChange={handleChange} />
      </label>
      <label>
        Phone:
        <input id="phone" name="phone" value={form.phone} onChange={handleChange} />
      </label>
      <button id="submit" type="submit">Add</button>
    </form>
  );
}

function InformationTable({ entries }: { entries: Entry[] }) {
  const sorted = [...entries].sort((a, b) => a.lastName.localeCompare(b.lastName));

  return (
    <table id="informationTable">
      <thead>
        <tr>
          <th>First name</th>
          <th>Last name</th>
          <th>Phone</th>
        </tr>
      </thead>
      <tbody>
        {sorted.map((entry) => (
          <tr key={\`\${entry.firstName}-\${entry.lastName}-\${entry.phone}\`}>
            <td>{entry.firstName}</td>
            <td>{entry.lastName}</td>
            <td>{entry.phone}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function Application() {
  const [entries, setEntries] = useState<Entry[]>([]);

  function addEntry(entry: Entry) {
    setEntries((current) => [...current, entry]);
  }

  return (
    <div>
      <DirectoryForm onAdd={addEntry} />
      <InformationTable entries={entries} />
    </div>
  );
}

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<Application />);
`,
    tests: [
      {
        id: 'dir-prefill',
        name: 'Inputs are prepopulated on load',
        hidden: false,
        async run({ document, must }) {
          const first = must(document.getElementById('firstName'), '#firstName') as HTMLInputElement
          const last = must(document.getElementById('lastName'), '#lastName') as HTMLInputElement
          const phone = must(document.getElementById('phone'), '#phone') as HTMLInputElement
          if (first.value !== 'Coder') throw new Error('firstName should start as Coder')
          if (last.value !== 'Byte') throw new Error('lastName should start as Byte')
          if (phone.value !== '8885559999') throw new Error('phone should start as 8885559999')
        },
      },
      {
        id: 'dir-empty-table',
        name: 'Table starts empty',
        hidden: false,
        async run({ document, must }) {
          const table = must(document.getElementById('informationTable'), '#informationTable')
          const rows = table.querySelectorAll('tbody tr')
          if (rows.length !== 0) throw new Error('Table should not be pre-filled')
        },
      },
      {
        id: 'dir-submit',
        name: 'Submitting adds a sorted row and resets the form',
        hidden: false,
        async run({ document, must, click, setValue, wait }) {
          await click(document.getElementById('submit'), '#submit')
          await wait(80)
          const table = must(document.getElementById('informationTable'), '#informationTable')
          if (!table.textContent?.includes('Coder') || !table.textContent?.includes('Byte')) {
            throw new Error('Submitted default row was not added')
          }
          const first = must(document.getElementById('firstName'), '#firstName') as HTMLInputElement
          const last = must(document.getElementById('lastName'), '#lastName') as HTMLInputElement
          const phone = must(document.getElementById('phone'), '#phone') as HTMLInputElement
          for (const field of [first, last, phone]) {
            if (field.value === 'null') {
              throw new Error('Do not use null for input values. Reset with an empty string "".')
            }
          }
          if (first.value !== '' || last.value !== '' || phone.value !== '') {
            throw new Error('After submit, reset firstName, lastName, and phone to empty strings')
          }
          await setValue(first, 'Mia', '#firstName')
          await setValue(document.getElementById('lastName') as HTMLInputElement, 'Adler', '#lastName')
          await setValue(document.getElementById('phone') as HTMLInputElement, '5550100', '#phone')
          await click(document.getElementById('submit'), '#submit')
          await wait(80)
          const bodyText = [...table.querySelectorAll('tbody tr')].map((row) => row.textContent ?? '')
          const adlerIndex = bodyText.findIndex((row) => row.includes('Adler'))
          const byteIndex = bodyText.findIndex((row) => row.includes('Byte'))
          if (adlerIndex < 0 || byteIndex < 0) throw new Error('Both rows should be present')
          if (adlerIndex > byteIndex) throw new Error('Rows should be sorted by last name')
        },
      },
    ],
  },
  {
    id: 'react-theme-context',
    kind: 'react',
    title: 'React Theme Context',
    difficulty: 'medium',
    timeSuggestedMin: 18,
    prompt: `Finish the theme switcher using React Context.

- ThemeProvider should store the current theme ("light" | "dark") and a toggle function.
- Toolbar reads that context and renders a button with id="toggle-theme".
- The wrapper with id="app-shell" must have class "light" or "dark" matching the theme.
- Default theme is light.`,
    examples: [
      {
        title: 'Behavior',
        body: 'Click #toggle-theme once → #app-shell has class "dark". Click again → "light".',
      },
    ],
    concepts: ['createContext', 'useContext', 'providers', 'lifting state'],
    hints: [
      'createContext, provide { theme, toggle }, consume with useContext in Toolbar.',
      'Do not pass theme as a prop into Toolbar — tests are checking that context works.',
      'className={theme} on #app-shell is the whole visual contract.',
    ],
    starter: `import React, { useState, createContext, useContext } from 'react';
import { createRoot } from 'react-dom/client';

type Theme = 'light' | 'dark';

const ThemeContext = createContext<{ theme: Theme; toggle: () => void } | null>(null);

function ThemeProvider({ children }: { children: React.ReactNode }) {
  // TODO: provide theme + toggle
  return <>{children}</>;
}

function Toolbar() {
  return <button id="toggle-theme">Toggle theme</button>;
}

function AppShell() {
  return (
    <div id="app-shell">
      <Toolbar />
    </div>
  );
}

function Application() {
  return (
    <ThemeProvider>
      <AppShell />
    </ThemeProvider>
  );
}

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<Application />);
`,
    solution: `import React, { useState, createContext, useContext } from 'react';
import { createRoot } from 'react-dom/client';

type Theme = 'light' | 'dark';

const ThemeContext = createContext<{ theme: Theme; toggle: () => void } | null>(null);

function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');
  const toggle = () => setTheme((current) => (current === 'light' ? 'dark' : 'light'));
  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

function Toolbar() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('Toolbar must be used within ThemeProvider');
  return (
    <button id="toggle-theme" onClick={ctx.toggle}>
      Toggle theme
    </button>
  );
}

function AppShell() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('AppShell must be used within ThemeProvider');
  return (
    <div id="app-shell" className={ctx.theme}>
      <Toolbar />
    </div>
  );
}

function Application() {
  return (
    <ThemeProvider>
      <AppShell />
    </ThemeProvider>
  );
}

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<Application />);
`,
    tests: [
      {
        id: 'theme-default',
        name: 'Default theme is light',
        hidden: false,
        async run({ document, must }) {
          const shell = must(document.getElementById('app-shell'), '#app-shell')
          if (!shell.classList.contains('light')) throw new Error('#app-shell should have class light')
        },
      },
      {
        id: 'theme-toggle',
        name: 'Toggle switches light and dark',
        hidden: false,
        async run({ document, must, click }) {
          await click(document.getElementById('toggle-theme'), '#toggle-theme')
          const shell = must(document.getElementById('app-shell'), '#app-shell')
          if (!shell.classList.contains('dark') || shell.classList.contains('light')) {
            throw new Error('Expected dark after one click')
          }
          await click(document.getElementById('toggle-theme'), '#toggle-theme')
          if (!shell.classList.contains('light')) throw new Error('Expected light after two clicks')
        },
      },
    ],
  },
  {
    id: 'react-tic-tac-toe',
    kind: 'react',
    title: 'React Tic Tac Toe',
    difficulty: 'hard',
    timeSuggestedMin: 30,
    prompt: `Complete a 3x3 tic-tac-toe game.

- Squares are buttons with ids square-0 through square-8, left-to-right, top-to-bottom.
- X goes first. Players alternate. A filled square cannot be overwritten.
- #status should read "Next player: X" / "Next player: O", or "Winner: X" / "Winner: O".
- If the board is full with no winner, #status should read "Draw".
- #reset starts a new game.`,
    examples: [
      {
        title: 'Win',
        body: 'X in squares 0, 1, 2 → status becomes "Winner: X".',
      },
    ],
    concepts: ['lifting state', 'derived state', 'immutable board updates', 'game logic'],
    hints: [
      'Board is (string | null)[] of length 9. Clicking index i copies the array, writes X or O, then setState.',
      'Check 8 winning lines after every move. Do not accept clicks when there is already a winner.',
      'Draw = every cell filled and no winner. Reset all of it in one handler.',
    ],
    starter: `import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';

function Square({ id, value, onClick }: { id: string; value: string | null; onClick: () => void }) {
  return (
    <button id={id} onClick={onClick} style={{ width: 64, height: 64, fontSize: 24 }}>
      {value}
    </button>
  );
}

function Board() {
  return (
    <div>
      <div id="status">Next player: X</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 64px)' }}>
      </div>
      <button id="reset">Reset</button>
    </div>
  );
}

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<Board />);
`,
    solution: `import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';

type Mark = 'X' | 'O' | null;

const LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function winnerOf(board: Mark[]): Mark {
  for (const [a, b, c] of LINES) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) return board[a];
  }
  return null;
}

function Square({ id, value, onClick }: { id: string; value: string | null; onClick: () => void }) {
  return (
    <button id={id} onClick={onClick} style={{ width: 64, height: 64, fontSize: 24 }}>
      {value}
    </button>
  );
}

function Board() {
  const [board, setBoard] = useState<Mark[]>(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const winner = winnerOf(board);
  const draw = !winner && board.every(Boolean);
  const status = winner
    ? \`Winner: \${winner}\`
    : draw
      ? 'Draw'
      : \`Next player: \${xIsNext ? 'X' : 'O'}\`;

  function handleClick(index: number) {
    if (board[index] || winner) return;
    const next = board.slice();
    next[index] = xIsNext ? 'X' : 'O';
    setBoard(next);
    setXIsNext(!xIsNext);
  }

  return (
    <div>
      <div id="status">{status}</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 64px)' }}>
        {board.map((value, index) => (
          <Square
            key={index}
            id={\`square-\${index}\`}
            value={value}
            onClick={() => handleClick(index)}
          />
        ))}
      </div>
      <button
        id="reset"
        onClick={() => {
          setBoard(Array(9).fill(null));
          setXIsNext(true);
        }}
      >
        Reset
      </button>
    </div>
  );
}

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<Board />);
`,
    tests: [
      {
        id: 'ttt-squares',
        name: 'Renders square-0 through square-8',
        hidden: false,
        async run({ document }) {
          for (let i = 0; i < 9; i += 1) {
            if (!document.getElementById(`square-${i}`)) throw new Error(`Missing square-${i}`)
          }
        },
      },
      {
        id: 'ttt-win',
        name: 'Detects a winner on the top row',
        hidden: false,
        async run({ document, must, click, text }) {
          await click(document.getElementById('square-0'), 'square-0')
          await click(document.getElementById('square-3'), 'square-3')
          await click(document.getElementById('square-1'), 'square-1')
          await click(document.getElementById('square-4'), 'square-4')
          await click(document.getElementById('square-2'), 'square-2')
          if (text(must(document.getElementById('status'), '#status')) !== 'Winner: X') {
            throw new Error('Expected Winner: X')
          }
        },
      },
      {
        id: 'ttt-reset',
        name: 'Reset restores an empty board',
        hidden: true,
        async run({ document, must, click, text }) {
          await click(document.getElementById('square-0'), 'square-0')
          await click(document.getElementById('reset'), '#reset')
          if (text(document.getElementById('square-0')) !== '') throw new Error('Board should clear')
          if (text(must(document.getElementById('status'), '#status')) !== 'Next player: X') {
            throw new Error('Status should reset')
          }
        },
      },
    ],
  },
  {
    id: 'react-forecast',
    kind: 'react',
    title: 'React Forecast Panel',
    difficulty: 'hard',
    timeSuggestedMin: 25,
    prompt: `Build a small forecast lookup.

fetchForecast(city) is already defined. It resolves with { city, temp, condition } or rejects if the city is unknown.

Requirements:
- Search with #city-input and submit via #search-btn.
- While the request is in flight, #status must read "Loading".
- On success, render #city-name, #temp, and #condition.
- On failure, #status must read "City not found".
- Known cities: Lisbon, Porto, Faro.`,
    examples: [
      {
        title: 'Success',
        body: 'Lisbon → city-name Lisbon, temp 22, condition Sunny.',
      },
      {
        title: 'Error',
        body: 'Madrid → status "City not found".',
      },
    ],
    concepts: ['useEffect vs event-driven fetch', 'loading/error UI', 'async/await', 'stale requests'],
    hints: [
      'Fetch on button click, not on every keystroke. Keep city query in state, results in another.',
      'Set status to Loading before await. Clear it on success so you do not leave Loading on screen.',
      'Wrap fetchForecast in try/catch. Do not let a rejected promise become an unhandled error.',
    ],
    starter: `import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';

const DATA: Record<string, { temp: number; condition: string }> = {
  Lisbon: { temp: 22, condition: 'Sunny' },
  Porto: { temp: 18, condition: 'Cloudy' },
  Faro: { temp: 26, condition: 'Clear' },
};

function fetchForecast(city: string): Promise<{ city: string; temp: number; condition: string }> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const found = DATA[city];
      if (!found) reject(new Error('City not found'));
      else resolve({ city, ...found });
    }, 200);
  });
}

function ForecastPanel() {
  return (
    <div>
      <input id="city-input" />
      <button id="search-btn">Search</button>
      <div id="status"></div>
    </div>
  );
}

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<ForecastPanel />);
`,
    solution: `import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';

const DATA: Record<string, { temp: number; condition: string }> = {
  Lisbon: { temp: 22, condition: 'Sunny' },
  Porto: { temp: 18, condition: 'Cloudy' },
  Faro: { temp: 26, condition: 'Clear' },
};

function fetchForecast(city: string): Promise<{ city: string; temp: number; condition: string }> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const found = DATA[city];
      if (!found) reject(new Error('City not found'));
      else resolve({ city, ...found });
    }, 200);
  });
}

function ForecastPanel() {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('');
  const [result, setResult] = useState<{ city: string; temp: number; condition: string } | null>(null);

  async function handleSearch() {
    setStatus('Loading');
    setResult(null);
    try {
      const forecast = await fetchForecast(query.trim());
      setResult(forecast);
      setStatus('');
    } catch {
      setStatus('City not found');
    }
  }

  return (
    <div>
      <input
        id="city-input"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
      <button id="search-btn" onClick={handleSearch}>Search</button>
      <div id="status">{status}</div>
      {result && (
        <div>
          <div id="city-name">{result.city}</div>
          <div id="temp">{result.temp}</div>
          <div id="condition">{result.condition}</div>
        </div>
      )}
    </div>
  );
}

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<ForecastPanel />);
`,
    tests: [
      {
        id: 'wx-loading',
        name: 'Shows Loading while the request is in flight',
        hidden: false,
        async run({ document, must, setValue, click, text, wait }) {
          await setValue(document.getElementById('city-input') as HTMLInputElement, 'Lisbon', '#city-input')
          const clickPromise = click(document.getElementById('search-btn'), '#search-btn')
          await wait(40)
          if (text(must(document.getElementById('status'), '#status')) !== 'Loading') {
            throw new Error('Expected Loading immediately after search')
          }
          await clickPromise
          await wait(260)
        },
      },
      {
        id: 'wx-success',
        name: 'Renders Lisbon forecast data',
        hidden: false,
        async run({ document, must, setValue, click, text, wait }) {
          await setValue(document.getElementById('city-input') as HTMLInputElement, 'Lisbon', '#city-input')
          await click(document.getElementById('search-btn'), '#search-btn')
          await wait(280)
          if (text(must(document.getElementById('city-name'), '#city-name')) !== 'Lisbon') {
            throw new Error('city-name should be Lisbon')
          }
          if (text(must(document.getElementById('temp'), '#temp')) !== '22') {
            throw new Error('temp should be 22')
          }
          if (text(must(document.getElementById('condition'), '#condition')) !== 'Sunny') {
            throw new Error('condition should be Sunny')
          }
        },
      },
      {
        id: 'wx-error',
        name: 'Unknown cities show City not found',
        hidden: true,
        async run({ document, must, setValue, click, text, wait }) {
          await setValue(document.getElementById('city-input') as HTMLInputElement, 'Madrid', '#city-input')
          await click(document.getElementById('search-btn'), '#search-btn')
          await wait(280)
          if (text(must(document.getElementById('status'), '#status')) !== 'City not found') {
            throw new Error('Expected City not found')
          }
        },
      },
    ],
  },
  {
    id: 'react-city-weather',
    kind: 'react',
    title: 'React City Weather Search',
    difficulty: 'medium',
    timeSuggestedMin: 20,
    prompt: `Build a weather lookup for three cities. The data is a local object — do not fetch and do not wrap the lookup in a timeout.

CITIES maps a city name to { temperature, humidity, windSpeed }.

Known cities: Austin, Denver, Miami.

Requirements:
- Search with #city-input and #search-btn. Trim the query. Match is exact: "Austin" works, "austin" does not.
- On a match, render #temperature, #humidity, and #wind-speed with those numbers. #status must be empty.
- If the city is missing (unknown name or empty input), #status must read "City not found" and the weather numbers must not stay on screen.
- After a successful search, add that city as a button inside #recent-searches. Button text is the city name. Each button must have data-city="{city}".
- Do not add a button for a failed search. Do not add the same city twice.
- Clicking a recent button shows that city's weather again and clears "City not found". The user should not need to press Search.

Leave the provided IDs and CITIES as they are.`,
    examples: [
      {
        title: 'Hit',
        body: 'Austin → temperature 31, humidity 40, windSpeed 12. A recent button labeled Austin appears.',
      },
      {
        title: 'Miss',
        body: 'Madrid → status "City not found". No Madrid button is added.',
      },
      {
        title: 'Recent',
        body: 'Search Austin, then Madrid, then click the Austin button → Austin weather is back and status is empty.',
      },
    ],
    concepts: ['controlled input', 'object lookup', 'conditional render', 'recent-search list'],
    hints: [
      'Keep query, status, result, and recents as four pieces of state. Look up CITIES[query.trim()] — no Promise.',
      'On miss, set result to null so the weather block unmounts. On hit, set status to "".',
      'Add to recents only when the lookup succeeds and the name is not already in the array: if (!recents.includes(name)) setRecents([...recents, name]).',
    ],
    starter: `import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';

type Weather = { temperature: number; humidity: number; windSpeed: number };

const CITIES: Record<string, Weather> = {
  Austin: { temperature: 31, humidity: 40, windSpeed: 12 },
  Denver: { temperature: 18, humidity: 22, windSpeed: 20 },
  Miami: { temperature: 29, humidity: 70, windSpeed: 8 },
};

function CityWeatherSearch() {
  return (
    <div>
      <input id="city-input" />
      <button id="search-btn" type="button">Search</button>
      <div id="status"></div>
      <div id="recent-searches"></div>
    </div>
  );
}

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<CityWeatherSearch />);
`,
    solution: `import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';

type Weather = { temperature: number; humidity: number; windSpeed: number };

const CITIES: Record<string, Weather> = {
  Austin: { temperature: 31, humidity: 40, windSpeed: 12 },
  Denver: { temperature: 18, humidity: 22, windSpeed: 20 },
  Miami: { temperature: 29, humidity: 70, windSpeed: 8 },
};

function CityWeatherSearch() {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('');
  const [result, setResult] = useState<(Weather & { city: string }) | null>(null);
  const [recents, setRecents] = useState<string[]>([]);

  function showCity(name: string) {
    const weather = CITIES[name];
    if (!weather) {
      setStatus('City not found');
      setResult(null);
      return false;
    }
    setStatus('');
    setResult({ city: name, ...weather });
    return true;
  }

  function handleSearch() {
    const name = query.trim();
    const found = showCity(name);
    if (found && !recents.includes(name)) {
      setRecents([...recents, name]);
    }
  }

  function handleRecent(name: string) {
    setQuery(name);
    showCity(name);
  }

  return (
    <div>
      <input
        id="city-input"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
      <button id="search-btn" type="button" onClick={handleSearch}>Search</button>
      <div id="status">{status}</div>
      <div id="recent-searches">
        {recents.map((city) => (
          <button key={city} type="button" data-city={city} onClick={() => handleRecent(city)}>
            {city}
          </button>
        ))}
      </div>
      {result && (
        <div>
          <div>Temperature <span id="temperature">{result.temperature}</span></div>
          <div>Humidity <span id="humidity">{result.humidity}</span></div>
          <div>Wind Speed <span id="wind-speed">{result.windSpeed}</span></div>
        </div>
      )}
    </div>
  );
}

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<CityWeatherSearch />);
`,
    tests: [
      {
        id: 'wx-hit',
        name: 'Renders Austin temperature, humidity, and wind speed',
        hidden: false,
        async run({ document, must, setValue, click, text, wait }) {
          await setValue(document.getElementById('city-input') as HTMLInputElement, 'Austin', '#city-input')
          await click(document.getElementById('search-btn'), '#search-btn')
          await wait(40)
          if (text(must(document.getElementById('status'), '#status')) !== '') {
            throw new Error('Status should be empty after a hit')
          }
          if (text(must(document.getElementById('temperature'), '#temperature')) !== '31') {
            throw new Error('temperature should be 31')
          }
          if (text(must(document.getElementById('humidity'), '#humidity')) !== '40') {
            throw new Error('humidity should be 40')
          }
          if (text(must(document.getElementById('wind-speed'), '#wind-speed')) !== '12') {
            throw new Error('wind-speed should be 12')
          }
          const recent = document.querySelector('[data-city="Austin"]')
          if (!recent || text(recent) !== 'Austin') {
            throw new Error('Successful search should add an Austin button in #recent-searches')
          }
        },
      },
      {
        id: 'wx-miss',
        name: 'Unknown cities show City not found and hide weather',
        hidden: false,
        async run({ document, must, setValue, click, text, wait }) {
          await setValue(document.getElementById('city-input') as HTMLInputElement, 'Madrid', '#city-input')
          await click(document.getElementById('search-btn'), '#search-btn')
          await wait(40)
          if (text(must(document.getElementById('status'), '#status')) !== 'City not found') {
            throw new Error('Expected City not found')
          }
          const temp = document.getElementById('temperature')
          if (temp && text(temp) !== '') {
            throw new Error('Weather numbers must not stay on screen after a miss')
          }
          if (document.querySelector('[data-city="Madrid"]')) {
            throw new Error('Do not add a recent button for a city that was not found')
          }
        },
      },
      {
        id: 'wx-recent',
        name: 'Recent city button restores that forecast',
        hidden: false,
        async run({ document, must, setValue, click, text, wait }) {
          await setValue(document.getElementById('city-input') as HTMLInputElement, 'Austin', '#city-input')
          await click(document.getElementById('search-btn'), '#search-btn')
          await setValue(document.getElementById('city-input') as HTMLInputElement, 'Madrid', '#city-input')
          await click(document.getElementById('search-btn'), '#search-btn')
          await wait(40)
          await click(document.querySelector('[data-city="Austin"]'), 'Austin recent')
          await wait(40)
          if (text(must(document.getElementById('status'), '#status')) !== '') {
            throw new Error('Clicking a recent city should clear City not found')
          }
          if (text(must(document.getElementById('temperature'), '#temperature')) !== '31') {
            throw new Error('Austin recent button should show temperature 31')
          }
        },
      },
      {
        id: 'wx-unique-recents',
        name: 'Does not duplicate recent buttons',
        hidden: true,
        async run({ document, setValue, click, wait }) {
          await setValue(document.getElementById('city-input') as HTMLInputElement, 'Austin', '#city-input')
          await click(document.getElementById('search-btn'), '#search-btn')
          await click(document.getElementById('search-btn'), '#search-btn')
          await setValue(document.getElementById('city-input') as HTMLInputElement, 'Denver', '#city-input')
          await click(document.getElementById('search-btn'), '#search-btn')
          await wait(40)
          if (document.querySelectorAll('[data-city="Austin"]').length !== 1) {
            throw new Error('Austin should appear only once in recents')
          }
          if (!document.querySelector('[data-city="Denver"]')) {
            throw new Error('Denver should be added after a successful search')
          }
        },
      },
    ],
  },
  {
    id: 'react-agent-panel',
    kind: 'react',
    title: 'React Agent Panel',
    difficulty: 'medium',
    timeSuggestedMin: 25,
    prompt: `Build an agent panel with three components that do not talk to each other directly.

- Application is the parent. It owns the selected agent name, the view count, and the note text.
- AgentList is a child. Clicking a row selects that agent. The selected row must have class "active". Only one row is active at a time.
- AgentDetail is a sibling of the list. It reads data from the parent, never from AgentList.

When nothing is selected, #agent-detail must read "No agent selected" and #note must be empty.

When the selected agent changes, use an effect (component lifecycle):
- increment #view-count by 1
- set #note to "Loading"
- after the provided loadNote() resolves, put that string in #note
- if the user selects another agent before loadNote finishes, ignore the stale result (clean up the effect)

Keep the element IDs and the AGENTS / loadNote helpers as they are.`,
    examples: [
      {
        title: 'Selection',
        body: 'Click Ava Reed → #detail-name is Ava Reed, that row has class active, #note becomes Queue specialist.',
      },
      {
        title: 'Siblings',
        body: 'AgentList does not receive note or viewCount. AgentDetail does not receive an onSelect callback.',
      },
    ],
    concepts: ['lifting state', 'parent / child / siblings', 'useEffect', 'cleanup / stale responses'],
    hints: [
      'Siblings never pass props to each other. The parent stores selectedName and passes data down and callbacks down.',
      'useEffect(() => { ...; return () => { cancelled = true } }, [selectedName]) is the lifecycle piece.',
      'loadNote is async. Set Loading first, then await. If selectedName changed, the cleanup flag must skip setNote.',
    ],
    starter: `import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

type Agent = { name: string; ext: string };

const AGENTS: Agent[] = [
  { name: 'Ava Reed', ext: '101' },
  { name: 'Noah Patel', ext: '202' },
  { name: 'Luis Costa', ext: '303' },
];

const NOTES: Record<string, string> = {
  'Ava Reed': 'Queue specialist',
  'Noah Patel': 'Night shift',
  'Luis Costa': 'Spanish queue',
};

function loadNote(name: string): Promise<string> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(NOTES[name] ?? ''), 50);
  });
}

function AgentList() {
  return (
    <ul id="agent-list">
    </ul>
  );
}

function AgentDetail() {
  return (
    <div>
      <div id="agent-detail">No agent selected</div>
      <div id="detail-name"></div>
      <div id="detail-ext"></div>
    </div>
  );
}

function Application() {
  return (
    <div>
      <div id="view-count">0</div>
      <div id="note"></div>
      <AgentList />
      <AgentDetail />
    </div>
  );
}

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<Application />);
`,
    solution: `import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

type Agent = { name: string; ext: string };

const AGENTS: Agent[] = [
  { name: 'Ava Reed', ext: '101' },
  { name: 'Noah Patel', ext: '202' },
  { name: 'Luis Costa', ext: '303' },
];

const NOTES: Record<string, string> = {
  'Ava Reed': 'Queue specialist',
  'Noah Patel': 'Night shift',
  'Luis Costa': 'Spanish queue',
};

function loadNote(name: string): Promise<string> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(NOTES[name] ?? ''), 50);
  });
}

function AgentList({
  selectedName,
  onSelect,
}: {
  selectedName: string | null;
  onSelect: (name: string) => void;
}) {
  return (
    <ul id="agent-list">
      {AGENTS.map((agent) => (
        <li
          key={agent.name}
          data-name={agent.name}
          className={agent.name === selectedName ? 'active' : undefined}
          onClick={() => onSelect(agent.name)}
        >
          {agent.name}
        </li>
      ))}
    </ul>
  );
}

function AgentDetail({ agent }: { agent: Agent | null }) {
  return (
    <div>
      <div id="agent-detail">{agent ? agent.name : 'No agent selected'}</div>
      <div id="detail-name">{agent?.name ?? ''}</div>
      <div id="detail-ext">{agent?.ext ?? ''}</div>
    </div>
  );
}

function Application() {
  const [selectedName, setSelectedName] = useState<string | null>(null);
  const [viewCount, setViewCount] = useState(0);
  const [note, setNote] = useState('');
  const agent = AGENTS.find((item) => item.name === selectedName) ?? null;

  useEffect(() => {
    if (!selectedName) {
      setNote('');
      return;
    }
    setViewCount((current) => current + 1);
    let cancelled = false;
    setNote('Loading');
    loadNote(selectedName).then((text) => {
      if (!cancelled) setNote(text);
    });
    return () => {
      cancelled = true;
    };
  }, [selectedName]);

  return (
    <div>
      <div id="view-count">{viewCount}</div>
      <div id="note">{note}</div>
      <AgentList selectedName={selectedName} onSelect={setSelectedName} />
      <AgentDetail agent={agent} />
    </div>
  );
}

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<Application />);
`,
    tests: [
      {
        id: 'panel-empty',
        name: 'Starts with no agent selected',
        hidden: false,
        async run({ document, must, text }) {
          if (text(must(document.getElementById('agent-detail'), '#agent-detail')) !== 'No agent selected') {
            throw new Error('#agent-detail should start as No agent selected')
          }
          if (text(must(document.getElementById('view-count'), '#view-count')) !== '0') {
            throw new Error('#view-count should start at 0')
          }
        },
      },
      {
        id: 'panel-select',
        name: 'Selecting an agent updates the sibling detail via the parent',
        hidden: false,
        async run({ document, must, click, text, wait }) {
          await click(document.querySelector('[data-name="Ava Reed"]'), 'Ava Reed')
          await wait(80)
          if (text(must(document.getElementById('detail-name'), '#detail-name')) !== 'Ava Reed') {
            throw new Error('Parent should pass the selected agent into AgentDetail')
          }
          if (text(must(document.getElementById('detail-ext'), '#detail-ext')) !== '101') {
            throw new Error('Extension should come from the selected agent')
          }
          if (!document.querySelector('[data-name="Ava Reed"]')?.classList.contains('active')) {
            throw new Error('Selected row should have class active')
          }
          if (text(must(document.getElementById('note'), '#note')) !== 'Queue specialist') {
            throw new Error('Effect should load the note for the selected agent')
          }
          if (text(must(document.getElementById('view-count'), '#view-count')) !== '1') {
            throw new Error('Selecting an agent should increment view-count')
          }
        },
      },
      {
        id: 'panel-switch',
        name: 'Switching agents updates siblings and ignores a stale note',
        hidden: true,
        async run({ document, must, click, text, wait }) {
          await click(document.querySelector('[data-name="Ava Reed"]'), 'Ava Reed')
          await click(document.querySelector('[data-name="Noah Patel"]'), 'Noah Patel')
          await wait(80)
          if (text(must(document.getElementById('detail-name'), '#detail-name')) !== 'Noah Patel') {
            throw new Error('Detail should follow the parent selectedName')
          }
          if (document.querySelector('[data-name="Ava Reed"]')?.classList.contains('active')) {
            throw new Error('Only the selected sibling row should be active')
          }
          if (text(must(document.getElementById('note'), '#note')) !== 'Night shift') {
            throw new Error('Stale note from Ava should not overwrite Noah')
          }
          if (text(must(document.getElementById('view-count'), '#view-count')) !== '2') {
            throw new Error('Each selection change should increment view-count')
          }
        },
      },
    ],
  },
  {
    id: 'react-call-session',
    kind: 'react',
    title: 'React Call Session',
    difficulty: 'medium',
    timeSuggestedMin: 20,
    prompt: `Model a live call with a parent and two children.

- Application owns whether the call is live and the elapsed tick count.
- CallControls is a child with #start and #end. It must not store the tick count.
- CallClock is a sibling. It displays #ticks and #status.

When the call is not live, #status is Idle. When it is live, #status is On call.

Use an effect in CallClock: while the call is live, increment the parent's tick count every 100ms. Return a cleanup function that clears the interval when the call ends or the clock unmounts. Ending the call must freeze #ticks (it must not keep growing).

#start starts a call. #end stops it but does not have to reset ticks to 0.`,
    examples: [
      {
        title: 'Lifecycle',
        body: 'Start → status On call, ticks increase. End → status Idle, ticks stay at the last number.',
      },
    ],
    concepts: ['lifting state', 'useEffect cleanup', 'intervals', 'sibling views'],
    hints: [
      'The interval belongs in CallClock (or the parent), not in the click handler. Clicks only set live to true/false.',
      'useEffect(() => { if (!live) return; const id = setInterval(...); return () => clearInterval(id) }, [live]).',
      'Pass setTicks from the parent. CallClock should not own the source of truth if CallControls also needs to stay in sync — the parent does.',
    ],
    starter: `import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

function CallControls() {
  return (
    <div>
      <button id="start">Start</button>
      <button id="end">End</button>
    </div>
  );
}

function CallClock() {
  return (
    <div>
      <div id="status">Idle</div>
      <div id="ticks">0</div>
    </div>
  );
}

function Application() {
  return (
    <div>
      <CallControls />
      <CallClock />
    </div>
  );
}

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<Application />);
`,
    solution: `import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

function CallControls({
  onStart,
  onEnd,
}: {
  onStart: () => void;
  onEnd: () => void;
}) {
  return (
    <div>
      <button id="start" onClick={onStart}>Start</button>
      <button id="end" onClick={onEnd}>End</button>
    </div>
  );
}

function CallClock({
  live,
  ticks,
  onTick,
}: {
  live: boolean;
  ticks: number;
  onTick: () => void;
}) {
  useEffect(() => {
    if (!live) return;
    const id = window.setInterval(onTick, 100);
    return () => window.clearInterval(id);
  }, [live]);

  return (
    <div>
      <div id="status">{live ? 'On call' : 'Idle'}</div>
      <div id="ticks">{ticks}</div>
    </div>
  );
}

function Application() {
  const [live, setLive] = useState(false);
  const [ticks, setTicks] = useState(0);

  return (
    <div>
      <CallControls onStart={() => setLive(true)} onEnd={() => setLive(false)} />
      <CallClock live={live} ticks={ticks} onTick={() => setTicks((n) => n + 1)} />
    </div>
  );
}

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<Application />);
`,
    tests: [
      {
        id: 'call-idle',
        name: 'Starts idle at 0 ticks',
        hidden: false,
        async run({ document, must, text }) {
          if (text(must(document.getElementById('status'), '#status')) !== 'Idle') {
            throw new Error('Status should start as Idle')
          }
          if (text(must(document.getElementById('ticks'), '#ticks')) !== '0') {
            throw new Error('Ticks should start at 0')
          }
        },
      },
      {
        id: 'call-live',
        name: 'Start puts the sibling clock on call and ticks up',
        hidden: false,
        async run({ document, must, click, text, wait }) {
          await click(document.getElementById('start'), '#start')
          if (text(must(document.getElementById('status'), '#status')) !== 'On call') {
            throw new Error('Status should become On call')
          }
          await wait(250)
          const ticks = Number(text(must(document.getElementById('ticks'), '#ticks')))
          if (!(ticks >= 1)) throw new Error('CallClock effect should increment ticks while live')
        },
      },
      {
        id: 'call-cleanup',
        name: 'End freezes ticks because the interval is cleaned up',
        hidden: true,
        async run({ document, must, click, text, wait }) {
          await click(document.getElementById('start'), '#start')
          await wait(250)
          await click(document.getElementById('end'), '#end')
          if (text(must(document.getElementById('status'), '#status')) !== 'Idle') {
            throw new Error('Status should return to Idle')
          }
          const frozen = Number(text(must(document.getElementById('ticks'), '#ticks')))
          await wait(250)
          const later = Number(text(must(document.getElementById('ticks'), '#ticks')))
          if (later !== frozen) {
            throw new Error('Ticks kept increasing after End — clear the interval in the effect cleanup')
          }
        },
      },
    ],
  },
  {
    id: 'react-zustand-queue',
    kind: 'react',
    title: 'React Zustand Queue',
    difficulty: 'medium',
    timeSuggestedMin: 22,
    prompt: `Three sibling components must share an agent queue. Do not lift the array into Application with useState, and do not use Context.

Use a Zustand store (import { create } from 'zustand'). This editor provides create() with the same API you use in production:

\`\`\`ts
const useQueueStore = create<QueueStore>((set) => ({
  agents: [],
  add: (name) => set((state) => ({ agents: [...state.agents, name] })),
}))
\`\`\`

Requirements:
- QueueComposer: #agent-input and #add-btn. Adding a non-empty name pushes it onto the store and clears the input.
- QueueBoard: #queue-list. Each row is a <li data-name="..."> with a button data-remove="..." that removes that agent.
- QueueStats: #queue-count shows how many agents are in the store. #clear-btn empties the store.

Application only renders the three children. It must not pass agents as props.

This is the contrast with Agent Directory: there the parent owned the list. Here distant siblings subscribe to one store.`,
    examples: [
      {
        title: 'Add',
        body: 'Type Ava, click Add → list shows Ava, #queue-count is 1, input is empty.',
      },
      {
        title: 'Remove / clear',
        body: 'Remove Ava → count 0. Add two names, Clear → list empty.',
      },
    ],
    concepts: ['Zustand', 'external store', 'siblings without prop drilling', 'useState vs Context vs store'],
    hints: [
      'create() returns a hook. In each component: const agents = useQueueStore((s) => s.agents) and const add = useQueueStore((s) => s.add).',
      'Application has no queue state. If you find yourself passing agents={agents}, you went back to lifting.',
      'Updates must copy the array: [...state.agents, name] and filter — never agents.push.',
    ],
    starter: `import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { create } from 'zustand';

type QueueStore = {
  agents: string[];
  add: (name: string) => void;
  remove: (name: string) => void;
  clear: () => void;
};

const useQueueStore = create<QueueStore>((set) => ({
  agents: [],
  add: (name) => set((state) => ({ agents: state.agents })),
  remove: (name) => set((state) => ({ agents: state.agents })),
  clear: () => set({ agents: [] }),
}));

function QueueComposer() {
  return (
    <div>
      <input id="agent-input" />
      <button id="add-btn" type="button">Add</button>
    </div>
  );
}

function QueueBoard() {
  return <ul id="queue-list"></ul>;
}

function QueueStats() {
  return (
    <div>
      <div id="queue-count">0</div>
      <button id="clear-btn" type="button">Clear</button>
    </div>
  );
}

function Application() {
  return (
    <div>
      <QueueComposer />
      <QueueBoard />
      <QueueStats />
    </div>
  );
}

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<Application />);
`,
    solution: `import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { create } from 'zustand';

type QueueStore = {
  agents: string[];
  add: (name: string) => void;
  remove: (name: string) => void;
  clear: () => void;
};

const useQueueStore = create<QueueStore>((set) => ({
  agents: [],
  add: (name) => set((state) => ({ agents: [...state.agents, name] })),
  remove: (name) => set((state) => ({ agents: state.agents.filter((item) => item !== name) })),
  clear: () => set({ agents: [] }),
}));

function QueueComposer() {
  const [name, setName] = useState('');
  const add = useQueueStore((state) => state.add);

  function handleAdd() {
    const next = name.trim();
    if (!next) return;
    add(next);
    setName('');
  }

  return (
    <div>
      <input
        id="agent-input"
        value={name}
        onChange={(event) => setName(event.target.value)}
      />
      <button id="add-btn" type="button" onClick={handleAdd}>Add</button>
    </div>
  );
}

function QueueBoard() {
  const agents = useQueueStore((state) => state.agents);
  const remove = useQueueStore((state) => state.remove);

  return (
    <ul id="queue-list">
      {agents.map((agent) => (
        <li key={agent} data-name={agent}>
          {agent}
          <button type="button" data-remove={agent} onClick={() => remove(agent)}>
            Remove
          </button>
        </li>
      ))}
    </ul>
  );
}

function QueueStats() {
  const count = useQueueStore((state) => state.agents.length);
  const clear = useQueueStore((state) => state.clear);

  return (
    <div>
      <div id="queue-count">{count}</div>
      <button id="clear-btn" type="button" onClick={clear}>Clear</button>
    </div>
  );
}

function Application() {
  return (
    <div>
      <QueueComposer />
      <QueueBoard />
      <QueueStats />
    </div>
  );
}

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<Application />);
`,
    tests: [
      {
        id: 'zs-empty',
        name: 'Starts with an empty queue and count 0',
        hidden: false,
        async run({ document, must, text }) {
          if (text(must(document.getElementById('queue-count'), '#queue-count')) !== '0') {
            throw new Error('#queue-count should start at 0')
          }
          if (document.querySelectorAll('#queue-list [data-name]').length !== 0) {
            throw new Error('Queue should start empty')
          }
        },
      },
      {
        id: 'zs-add',
        name: 'Siblings see a store add without props from Application',
        hidden: false,
        async run({ document, must, setValue, click, text, wait }) {
          await setValue(document.getElementById('agent-input') as HTMLInputElement, 'Ava', '#agent-input')
          await click(document.getElementById('add-btn'), '#add-btn')
          await wait(40)
          if (!document.querySelector('[data-name="Ava"]')) throw new Error('QueueBoard should render Ava from the store')
          if (text(must(document.getElementById('queue-count'), '#queue-count')) !== '1') {
            throw new Error('QueueStats should read the same store and show 1')
          }
          const input = must(document.getElementById('agent-input'), '#agent-input') as HTMLInputElement
          if (input.value !== '') throw new Error('Composer input should reset to an empty string')
        },
      },
      {
        id: 'zs-remove-clear',
        name: 'Remove and clear update every subscriber',
        hidden: true,
        async run({ document, must, setValue, click, text, wait }) {
          await setValue(document.getElementById('agent-input') as HTMLInputElement, 'Ava', '#agent-input')
          await click(document.getElementById('add-btn'), '#add-btn')
          await setValue(document.getElementById('agent-input') as HTMLInputElement, 'Noah', '#agent-input')
          await click(document.getElementById('add-btn'), '#add-btn')
          await wait(40)
          await click(document.querySelector('[data-remove="Ava"]'), 'remove Ava')
          await wait(40)
          if (document.querySelector('[data-name="Ava"]')) throw new Error('Ava should be removed from the store')
          if (text(must(document.getElementById('queue-count'), '#queue-count')) !== '1') {
            throw new Error('Count should drop to 1')
          }
          await click(document.getElementById('clear-btn'), '#clear-btn')
          await wait(40)
          if (text(must(document.getElementById('queue-count'), '#queue-count')) !== '0') {
            throw new Error('Clear should empty the store')
          }
        },
      },
    ],
  },
  {
    id: 'react-agent-table',
    kind: 'react',
    title: 'React Agent Fetch Table',
    difficulty: 'medium',
    timeSuggestedMin: 25,
    prompt: `Load users from a real HTTP API and show them in a table, sorted by name.

GET this public endpoint (no API key, CORS enabled):

https://jsonplaceholder.typicode.com/users

It returns a JSON array. Each item has at least:
- id (number)
- name (string)
- username (string)
- email (string)

Requirements:
- Click #load-btn to call fetch() on that URL. Do not fake the list with a local timeout.
- While the request is in flight, #status must read "Loading".
- If !response.ok or fetch throws, #status must read "Failed" and the table body stays empty.
- On success, render #agents-table with columns Name, Username, Email.
- Sort a copy of the array by name with localeCompare. Do not mutate the array from response.json().
- Each body row must have data-name="{name}".
- After success, #status must be empty.

You need a network connection. Leave the element IDs as they are.`,
    examples: [
      {
        title: 'Request',
        body: 'const response = await fetch("https://jsonplaceholder.typicode.com/users")',
      },
      {
        title: 'Sort',
        body: 'API order is not alphabetical. The table must be sorted by name (e.g. Chelsey before Leanne).',
      },
    ],
    concepts: ['fetch', 'response.ok / json()', 'loading and error UI', 'derived sorted lists', 'tables'],
    hints: [
      'setStatus("Loading") then await fetch. Check response.ok before response.json().',
      'const users = await response.json() as User[]. Then [...users].sort((a, b) => a.name.localeCompare(b.name)).',
      'try/catch around fetch: network errors and !ok both become Failed.',
    ],
    starter: `import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';

const USERS_URL = 'https://jsonplaceholder.typicode.com/users';

type User = {
  id: number;
  name: string;
  username: string;
  email: string;
};

function AgentFetchTable() {
  return (
    <div>
      <button id="load-btn" type="button">Load users</button>
      <div id="status"></div>
      <table id="agents-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Username</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
        </tbody>
      </table>
    </div>
  );
}

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<AgentFetchTable />);
`,
    solution: `import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';

const USERS_URL = 'https://jsonplaceholder.typicode.com/users';

type User = {
  id: number;
  name: string;
  username: string;
  email: string;
};

function AgentFetchTable() {
  const [status, setStatus] = useState('');
  const [users, setUsers] = useState<User[]>([]);

  async function handleLoad() {
    setStatus('Loading');
    setUsers([]);
    try {
      const response = await fetch(USERS_URL);
      if (!response.ok) throw new Error('Failed');
      const list = (await response.json()) as User[];
      setUsers(list);
      setStatus('');
    } catch {
      setStatus('Failed');
    }
  }

  const ordered = [...users].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div>
      <button id="load-btn" type="button" onClick={handleLoad}>Load users</button>
      <div id="status">{status}</div>
      <table id="agents-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Username</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {ordered.map((user) => (
            <tr key={user.id} data-name={user.name}>
              <td>{user.name}</td>
              <td>{user.username}</td>
              <td>{user.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<AgentFetchTable />);
`,
    tests: [
      {
        id: 'fetch-loading',
        name: 'Shows Loading while the request is in flight',
        hidden: false,
        async run({ document, must, click, text, wait }) {
          const clickPromise = click(document.getElementById('load-btn'), '#load-btn')
          await wait(40)
          const status = text(must(document.getElementById('status'), '#status'))
          const alreadyLoaded = document.querySelectorAll('#agents-table tbody tr').length >= 10
          if (status !== 'Loading' && !alreadyLoaded) {
            throw new Error('Expected Loading immediately after click (or rows if the API was instant)')
          }
          await clickPromise
          await waitForTableRows(document, wait, 10)
        },
      },
      {
        id: 'fetch-sorted-table',
        name: 'Renders JSONPlaceholder users sorted by name',
        hidden: false,
        async run({ document, must, click, text, wait }) {
          await click(document.getElementById('load-btn'), '#load-btn')
          await waitForTableRows(document, wait, 10)
          await wait(40)
          if (text(must(document.getElementById('status'), '#status')) !== '') {
            throw new Error('Status should be empty after success')
          }
          const rows = [...document.querySelectorAll('#agents-table tbody tr')]
          const names = rows.map((row) => row.getAttribute('data-name') ?? '')
          if (names.length < 10) throw new Error('Expected at least 10 users from /users')
          const sorted = [...names].sort((a, b) => a.localeCompare(b))
          if (names.join('\n') !== sorted.join('\n')) {
            throw new Error('Rows must be sorted by name with localeCompare')
          }
          const first = must(rows[0], 'first row')
          if (!text(first).includes(names[0])) {
            throw new Error('Row text should include the user name')
          }
        },
      },
      {
        id: 'fetch-copy',
        name: 'Each row exposes data-name from the API',
        hidden: true,
        async run({ document, click, wait }) {
          await click(document.getElementById('load-btn'), '#load-btn')
          await waitForTableRows(document, wait, 10)
          const missing = [...document.querySelectorAll('#agents-table tbody tr')].filter(
            (row) => !row.getAttribute('data-name'),
          )
          if (missing.length > 0) throw new Error('Every body row needs data-name="{name}"')
        },
      },
    ],
  },
]
