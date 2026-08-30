import type { AlgoChallenge, ChallengeTest, TestResult } from '../types'
import { createHarness, wait } from './domHarness'
import { transpileAlgoSource } from './transpile'

export async function runDomTests(
  iframe: HTMLIFrameElement,
  tests: ChallengeTest[],
): Promise<TestResult[]> {
  const win = iframe.contentWindow as (Window & typeof globalThis) | null
  const doc = iframe.contentDocument
  if (!win || !doc) {
    return tests.map((test) => ({
      id: test.id,
      name: test.name,
      hidden: test.hidden,
      passed: false,
      message: 'Preview did not load',
    }))
  }

  await wait(60)
  const harness = createHarness(win, doc)
  const results: TestResult[] = []

  for (const test of tests) {
    try {
      await test.run(harness)
      results.push({ id: test.id, name: test.name, hidden: test.hidden, passed: true })
    } catch (error) {
      results.push({
        id: test.id,
        name: test.name,
        hidden: test.hidden,
        passed: false,
        message: error instanceof Error ? error.message : String(error),
      })
    }
  }

  return results
}

export function runAlgoTests(source: string, challenge: AlgoChallenge): TestResult[] {
  const transpiled = transpileAlgoSource(source)
  if (transpiled.error) {
    return challenge.tests.map((test) => ({
      id: test.id,
      name: test.name,
      hidden: test.hidden,
      passed: false,
      message: transpiled.error,
    }))
  }

  let fn: ((...args: unknown[]) => unknown) | undefined
  try {
    fn = new Function(`${transpiled.code}\nreturn ${challenge.fnName};`)() as (
      ...args: unknown[]
    ) => unknown
  } catch (error) {
    return challenge.tests.map((test) => ({
      id: test.id,
      name: test.name,
      hidden: test.hidden,
      passed: false,
      message: error instanceof Error ? error.message : 'Function did not evaluate',
    }))
  }

  if (typeof fn !== 'function') {
    return challenge.tests.map((test) => ({
      id: test.id,
      name: test.name,
      hidden: test.hidden,
      passed: false,
      message: `Could not find function ${challenge.fnName}. Do not rename it, and do not remove the console.log line at the bottom.`,
    }))
  }

  return challenge.tests.map((test) => {
    try {
      const actual = fn(...test.args)
      const passed = Object.is(actual, test.expected) || JSON.stringify(actual) === JSON.stringify(test.expected)
      return {
        id: test.id,
        name: test.name,
        hidden: test.hidden,
        passed,
        message: passed ? undefined : `Expected ${formatValue(test.expected)} but got ${formatValue(actual)}`,
      }
    } catch (error) {
      return {
        id: test.id,
        name: test.name,
        hidden: test.hidden,
        passed: false,
        message: error instanceof Error ? error.message : String(error),
      }
    }
  })
}

function formatValue(value: unknown): string {
  if (typeof value === 'string') return `"${value}"`
  try {
    return JSON.stringify(value)
  } catch {
    return String(value)
  }
}

export function scoreFromResults(results: TestResult[]): number {
  if (results.length === 0) return 0
  const passed = results.filter((result) => result.passed).length
  return Math.round((passed / results.length) * 10)
}
