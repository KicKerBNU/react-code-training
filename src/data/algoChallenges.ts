import type { AlgoChallenge } from '../types'

export const algoChallenges: AlgoChallenge[] = [
  {
    id: 'algo-transcript',
    kind: 'algo',
    title: 'String Challenge',
    difficulty: 'medium',
    timeSuggestedMin: 20,
    fnName: 'StringChallenge',
    prompt: `Have the function StringChallenge(str1, str2) take two strings and return the string "true" if the first string can be rearranged to match the second, otherwise return "false".

Ignore case, spaces, and punctuation. Only letters and digits matter.

Do not modify the function name or the console.log line at the bottom of the editor.`,
    examples: [
      {
        title: 'Input',
        body: 'StringChallenge("coder byte!", "ByteCoder")',
      },
      {
        title: 'Output',
        body: 'true',
      },
      {
        title: 'Input',
        body: 'StringChallenge("hello", "world")',
      },
      {
        title: 'Output',
        body: 'false',
      },
    ],
    concepts: ['frequency maps', 'normalization', 'anagrams'],
    hints: [
      'Normalize both strings: lowercase, then strip anything that is not a-z or 0-9.',
      'Count characters in str1, subtract while scanning str2, fail on a mismatch or leftover count.',
      'Return the strings "true" and "false", not booleans.',
    ],
    starter: `function StringChallenge(str1: string, str2: string): string {
  // TODO
  return str1 + str2;
}

// Do not modify the line below
console.log(StringChallenge(readline()));
`,
    solution: `function StringChallenge(str1: string, str2: string): string {
  const normalize = (value: string) =>
    value.toLowerCase().replace(/[^a-z0-9]/g, '').split('').sort().join('');
  return normalize(str1) === normalize(str2) ? 'true' : 'false';
}

// Do not modify the line below
console.log(StringChallenge(readline()));
`,
    tests: [
      {
        id: 'str-true',
        name: 'Rearrangeable strings return true',
        hidden: false,
        args: ['coder byte!', 'ByteCoder'],
        expected: 'true',
      },
      {
        id: 'str-false',
        name: 'Different letters return false',
        hidden: false,
        args: ['hello', 'world'],
        expected: 'false',
      },
      {
        id: 'str-punct',
        name: 'Punctuation and digits are handled',
        hidden: true,
        args: ['Queue-101', '101 queue'],
        expected: 'true',
      },
      {
        id: 'str-extra',
        name: 'Extra letters fail',
        hidden: true,
        args: ['aa', 'a'],
        expected: 'false',
      },
    ],
  },
  {
    id: 'algo-route',
    kind: 'algo',
    title: 'Graph Challenge',
    difficulty: 'hard',
    timeSuggestedMin: 25,
    fnName: 'GraphChallenge',
    prompt: `Have the function GraphChallenge(strArr) take an array of strings that models an undirected, unweighted graph.

Format:
- strArr[0] is N, the number of nodes
- the next N elements are node names
- every remaining element is an edge like "A-B"

Find the shortest path from the first node in the node list to the last node in the node list. Return the path as names joined by hyphens, for example "A-B-D".

If no path exists, return the string "no path". The graph has no cycles that you need to special-case beyond not revisiting nodes. Edges are bidirectional.

Do not modify the function name or the console.log line at the bottom of the editor.`,
    examples: [
      {
        title: 'Input',
        body: '["4","A","B","C","D","A-B","B-D","B-C","C-D"]',
      },
      {
        title: 'Output',
        body: 'A-B-D',
      },
      {
        title: 'Input',
        body: '["3","X","Y","Z","X-Y"]',
      },
      {
        title: 'Output',
        body: 'no path',
      },
    ],
    concepts: ['BFS', 'adjacency list', 'shortest path', 'queue'],
    hints: [
      'This is unweighted, so BFS — not DFS — gives the shortest path.',
      'Parse N, then nodes, then edges. Build an adjacency map. Edges go both ways.',
      'Store parent pointers while you BFS, then walk backwards from the end node to rebuild the path.',
    ],
    starter: `function GraphChallenge(strArr: string[]): string {
  // TODO
  return strArr[0];
}

// Do not modify the line below
console.log(GraphChallenge(readline()));
`,
    solution: `function GraphChallenge(strArr: string[]): string {
  const n = Number(strArr[0]);
  const nodes = strArr.slice(1, 1 + n);
  const edges = strArr.slice(1 + n);
  const graph = new Map<string, string[]>();

  for (const node of nodes) graph.set(node, []);
  for (const edge of edges) {
    const [a, b] = edge.split('-');
    graph.get(a)?.push(b);
    graph.get(b)?.push(a);
  }

  const start = nodes[0];
  const end = nodes[nodes.length - 1];
  const parent = new Map<string, string | null>([[start, null]]);
  const queue = [start];

  while (queue.length > 0) {
    const current = queue.shift()!;
    if (current === end) break;
    for (const next of graph.get(current) ?? []) {
      if (parent.has(next)) continue;
      parent.set(next, current);
      queue.push(next);
    }
  }

  if (!parent.has(end)) return 'no path';
  const path: string[] = [];
  let cursor: string | null = end;
  while (cursor) {
    path.push(cursor);
    cursor = parent.get(cursor) ?? null;
  }
  return path.reverse().join('-');
}

// Do not modify the line below
console.log(GraphChallenge(readline()));
`,
    tests: [
      {
        id: 'graph-short',
        name: 'Finds a 3-node shortest path',
        hidden: false,
        args: [['4', 'A', 'B', 'C', 'D', 'A-B', 'B-D', 'B-C', 'C-D']],
        expected: 'A-B-D',
      },
      {
        id: 'graph-none',
        name: 'Returns no path when disconnected',
        hidden: false,
        args: [['3', 'X', 'Y', 'Z', 'X-Y']],
        expected: 'no path',
      },
      {
        id: 'graph-direct',
        name: 'Prefers a direct edge over a longer walk',
        hidden: true,
        args: [['4', 'A', 'B', 'C', 'D', 'A-B', 'B-C', 'C-D', 'A-D']],
        expected: 'A-D',
      },
      {
        id: 'graph-same',
        name: 'Handles a two-node graph',
        hidden: true,
        args: [['2', 'HQ', 'Site', 'HQ-Site']],
        expected: 'HQ-Site',
      },
    ],
  },
  {
    id: 'algo-math',
    kind: 'algo',
    title: 'Math Challenge',
    difficulty: 'easy',
    timeSuggestedMin: 12,
    fnName: 'MathChallenge',
    prompt: `Have the function MathChallenge(num) return the next prime number strictly greater than num.

A prime is an integer greater than 1 with no positive divisors other than 1 and itself.

Do not modify the function name or the console.log line at the bottom of the editor.`,
    examples: [
      {
        title: 'Input',
        body: '8',
      },
      {
        title: 'Output',
        body: '11',
      },
      {
        title: 'Input',
        body: '13',
      },
      {
        title: 'Output',
        body: '17',
      },
    ],
    concepts: ['primes', 'loops', 'integer math'],
    hints: [
      'Write isPrime(n), then start at num + 1 and walk upward until you find one.',
      'Check divisors up to Math.sqrt(n). Skip even numbers after handling 2.',
      'Return a number, not a string.',
    ],
    starter: `function MathChallenge(num: number): number {
  // TODO
  return num;
}

// Do not modify the line below
console.log(MathChallenge(readline()));
`,
    solution: `function MathChallenge(num: number): number {
  const isPrime = (value: number) => {
    if (value < 2) return false;
    if (value === 2) return true;
    if (value % 2 === 0) return false;
    for (let i = 3; i * i <= value; i += 2) {
      if (value % i === 0) return false;
    }
    return true;
  };

  let candidate = num + 1;
  while (!isPrime(candidate)) candidate += 1;
  return candidate;
}

// Do not modify the line below
console.log(MathChallenge(readline()));
`,
    tests: [
      { id: 'math-8', name: 'Next prime after 8 is 11', hidden: false, args: [8], expected: 11 },
      { id: 'math-13', name: 'Next prime after 13 is 17', hidden: false, args: [13], expected: 17 },
      { id: 'math-1', name: 'Next prime after 1 is 2', hidden: true, args: [1], expected: 2 },
      { id: 'math-100', name: 'Next prime after 100 is 101', hidden: true, args: [100], expected: 101 },
    ],
  },
]
