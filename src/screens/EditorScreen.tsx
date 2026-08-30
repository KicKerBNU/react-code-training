import { useEffect, useRef, useState } from 'react'
import Editor, { type OnMount } from '@monaco-editor/react'
import { catalogById } from '../data/catalog'
import { buildPreviewDocument, transpileReactSource } from '../lib/transpile'
import { runAlgoTests, runDomTests, scoreFromResults } from '../lib/runners'
import { useSession } from '../state/SessionContext'
import { editorOptions, Pill } from '../components/ui'
import type { AlgoChallenge, ReactChallenge } from '../types'

const REFS = [
  ['React docs: Your first component', 'https://react.dev/learn/your-first-component'],
  ['React docs: State', 'https://react.dev/learn/state-a-components-memory'],
  ['React docs: Passing data with Context', 'https://react.dev/learn/passing-data-deeply-with-context'],
  ['Zustand: create a store', 'https://zustand.docs.pmnd.rs/getting-started/introduction'],
  ['React docs: Lists and keys', 'https://react.dev/learn/rendering-lists'],
  ['React docs: Responding to events', 'https://react.dev/learn/responding-to-events'],
  ['MDN: Array.prototype.sort', 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort'],
  ['MDN: Map / BFS intuition', 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map'],
]

function configureMonaco(_: unknown, monaco: Parameters<OnMount>[1]) {
  monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
    jsx: monaco.languages.typescript.JsxEmit.React,
    jsxFactory: 'React.createElement',
    reactNamespace: 'React',
    allowNonTsExtensions: true,
    target: monaco.languages.typescript.ScriptTarget.ES2020,
    moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
    esModuleInterop: true,
    allowJs: true,
  })
  monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
    noSemanticValidation: true,
    noSyntaxValidation: false,
  })
}

export function EditorScreen() {
  const {
    activeItemId,
    mode,
    coding,
    updateCode,
    recordPaste,
    saveCodingResults,
    ensureCoding,
    setScreen,
  } = useSession()
  const item = activeItemId ? catalogById[activeItemId] : null
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [tab, setTab] = useState<'tests' | 'preview' | 'reference'>('preview')
  const [previewError, setPreviewError] = useState<string | null>(null)
  const [srcDoc, setSrcDoc] = useState('')
  const [running, setRunning] = useState(false)
  const [showHints, setShowHints] = useState(false)
  const [showSolution, setShowSolution] = useState(false)
  const [pasteBanner, setPasteBanner] = useState(false)

  useEffect(() => {
    if (!item || (item.kind !== 'react' && item.kind !== 'algo')) return
    ensureCoding(item.id, item.starter)
  }, [ensureCoding, item])

  const attempt = item ? coding[item.id] : undefined
  const code = attempt?.code ?? (item && 'starter' in item ? item.starter : '')

  useEffect(() => {
    if (!item || item.kind !== 'react') return
    const handle = window.setTimeout(() => {
      const result = transpileReactSource(code)
      if (result.error) {
        setPreviewError(result.error)
        return
      }
      setPreviewError(null)
      setSrcDoc(buildPreviewDocument(result.code))
    }, 400)
    return () => window.clearTimeout(handle)
  }, [code, item])

  useEffect(() => {
    function onMessage(event: MessageEvent) {
      if (event.data?.type === 'preview-error') setPreviewError(String(event.data.message))
      if (event.data?.type === 'preview-ready') setPreviewError(null)
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [])

  if (!item || (item.kind !== 'react' && item.kind !== 'algo')) {
    return <div className="page">Challenge not found.</div>
  }

  const challenge = item as ReactChallenge | AlgoChallenge
  const backScreen = mode === 'assessment' ? 'dashboard' : 'study'

  async function run(submit: boolean) {
    setRunning(true)
    setTab('tests')
    try {
      if (challenge.kind === 'algo') {
        const results = runAlgoTests(code, challenge)
        saveCodingResults(challenge.id, results, submit)
        return
      }
      const transpiled = transpileReactSource(code)
      if (transpiled.error) {
        setPreviewError(transpiled.error)
        saveCodingResults(
          challenge.id,
          challenge.tests.map((test) => ({
            id: test.id,
            name: test.name,
            hidden: test.hidden,
            passed: false,
            message: transpiled.error,
          })),
          submit,
        )
        return
      }
      const iframe = iframeRef.current
      if (!iframe) return
      const nextDoc = buildPreviewDocument(transpiled.code)
      setSrcDoc(nextDoc)
      setPreviewError(null)
      await new Promise<void>((resolve) => {
        const finish = () => resolve()
        iframe.addEventListener('load', finish, { once: true })
        iframe.srcdoc = nextDoc
        window.setTimeout(finish, 900)
      })
      const results = await runDomTests(iframe, challenge.tests)
      saveCodingResults(challenge.id, results, submit)
    } finally {
      setRunning(false)
    }
  }

  const visibleResults = (attempt?.results ?? []).map((result) =>
    mode === 'assessment' && result.hidden && !attempt?.submitted
      ? { ...result, name: 'Hidden test' }
      : result,
  )
  const score = scoreFromResults(attempt?.results ?? [])

  return (
    <div className="editor-screen">
      {pasteBanner ? (
        <div className="banner">
          The editor is set up to detect when you copy/paste code. Write your solution here. Looking
          things up in Reference Search is fine; pasting a finished answer is flagged, as on Coderbyte.
        </div>
      ) : null}
      <div className="editor-toolbar">
        <button className="btn btn-ghost" onClick={() => setScreen(backScreen)}>
          ← Back to {mode === 'assessment' ? 'assessment' : 'study hub'}
        </button>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-ghost" disabled={running} onClick={() => void run(false)}>
            Run tests
          </button>
          <button className="btn btn-green" disabled={running} onClick={() => void run(true)}>
            Submit Solution
          </button>
        </div>
      </div>
      <div className="editor-grid">
        <aside className="prompt-pane">
          <p className="muted">{challenge.kind === 'react' ? 'Frontend' : 'Algorithm'}</p>
          <h2>{challenge.title}</h2>
          <div className="meta-row">
            <Pill tone={challenge.difficulty}>{challenge.difficulty}</Pill>
            <span className="pill">{challenge.timeSuggestedMin} min</span>
          </div>
          {challenge.prompt.split('\n\n').map((paragraph) => (
            <p key={paragraph.slice(0, 24)}>{paragraph}</p>
          ))}
          <h3>Examples</h3>
          {challenge.examples.map((example) => (
            <div className="example" key={example.title + example.body}>
              <strong>{example.title}</strong>
              {'\n'}
              {example.body}
            </div>
          ))}
          {mode === 'study' ? (
            <>
              <button className="btn btn-ghost" onClick={() => setShowHints((v) => !v)}>
                {showHints ? 'Hide hints' : 'Show hints'}
              </button>
              {showHints
                ? challenge.hints.map((hint) => (
                    <div className="hint" key={hint}>
                      {hint}
                    </div>
                  ))
                : null}
              <button className="btn btn-ghost" onClick={() => setShowSolution((v) => !v)}>
                {showSolution ? 'Hide solution' : 'Reveal solution'}
              </button>
              {showSolution ? (
                <pre className="solution-box">
                  <code>{challenge.solution}</code>
                </pre>
              ) : null}
            </>
          ) : null}
        </aside>
        <div className="code-pane">
          <div className="code-split" style={challenge.kind === 'algo' ? { gridTemplateRows: '1fr 180px' } : undefined}>
            <div
              style={{ minHeight: 0 }}
              onPaste={() => {
                recordPaste(challenge.id)
                setPasteBanner(true)
              }}
            >
              <Editor
                height="100%"
                defaultLanguage="typescript"
                theme="vs-dark"
                value={code}
                path={`${challenge.id}.tsx`}
                options={editorOptions}
                onMount={configureMonaco}
                onChange={(value) => updateCode(challenge.id, value ?? '')}
              />
            </div>
            <div className="output-pane">
              <div className="tabs">
                {challenge.kind === 'react' ? (
                  <button className={`tab ${tab === 'preview' ? 'on' : ''}`} onClick={() => setTab('preview')}>
                    Preview
                  </button>
                ) : null}
                <button className={`tab ${tab === 'tests' ? 'on' : ''}`} onClick={() => setTab('tests')}>
                  Tests
                </button>
                <button className={`tab ${tab === 'reference' ? 'on' : ''}`} onClick={() => setTab('reference')}>
                  Reference Search
                </button>
                {attempt?.submitted ? <span className="muted">Score {score}/10</span> : null}
                {attempt && attempt.pasteCount > 0 ? (
                  <span className="muted">Paste events: {attempt.pasteCount}</span>
                ) : null}
              </div>
              {challenge.kind === 'react' ? (
                <div style={{ height: 150, marginBottom: 8 }}>
                  {previewError ? <p className="fail">{previewError}</p> : null}
                  <iframe
                    ref={iframeRef}
                    title="preview"
                    className="preview-frame"
                    sandbox="allow-scripts allow-same-origin"
                    srcDoc={srcDoc}
                    style={{ height: previewError ? 110 : 150 }}
                  />
                </div>
              ) : null}
              {tab === 'tests' ? (
                <div>
                  {visibleResults.length === 0 ? (
                    <p className="muted">Run tests or submit to grade this challenge against sample and hidden cases.</p>
                  ) : (
                    visibleResults.map((result) => (
                      <div className="test-row" key={result.id}>
                        <span className={result.passed ? 'pass' : 'fail'}>{result.passed ? 'PASS' : 'FAIL'}</span>
                        <div>
                          <div>{result.name}</div>
                          {result.message && (mode === 'study' || !result.hidden || attempt?.submitted) ? (
                            <div className="muted">{result.message}</div>
                          ) : null}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              ) : null}
              {tab === 'reference' ? (
                <div className="ref-links">
                  <p className="muted">
                    Coderbyte keeps a search pane in the editor so you can look things up without
                    leaving. Use these docs the same way.
                  </p>
                  {REFS.map(([label, href]) => (
                    <a key={href} href={href} target="_blank" rel="noreferrer">
                      {label}
                    </a>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
