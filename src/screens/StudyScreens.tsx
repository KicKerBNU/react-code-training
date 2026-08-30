import { catalog, catalogById, isAlgoItem, isReactItem, mockAssessment } from '../data/catalog'
import { studyArticles } from '../data/studyNotes'
import { scoreFromResults } from '../lib/runners'
import { useSession } from '../state/SessionContext'
import { MarkdownBody, Pill } from '../components/ui'
import type { McqSet } from '../types'

export function ResultsScreen() {
  const { candidate, coding, mcq, written, reset, remainingMs } = useSession()

  const rows = mockAssessment.itemIds.map((id) => {
    const item = catalogById[id]
    if (item.kind === 'react' || item.kind === 'algo') {
      const results = coding[id]?.results ?? []
      return {
        id,
        title: item.title,
        detail: coding[id]?.submitted ? `${scoreFromResults(results)}/10` : 'Not submitted',
        extra: coding[id]?.pasteCount ? `${coding[id].pasteCount} paste event(s)` : '',
      }
    }
    if (item.kind === 'mcq') {
      const set = item as McqSet
      const attempt = mcq[id]
      const correct = set.questions.filter((q) => attempt?.answers[q.id] === q.correctId).length
      return {
        id,
        title: item.title,
        detail: attempt?.submitted ? `${correct}/${set.questions.length}` : 'Not submitted',
        extra: '',
      }
    }
    const attempt = written[id]
    const answered = Object.values(attempt?.answers ?? {}).filter((value) => value.trim()).length
    return {
      id,
      title: item.title,
      detail: attempt?.submitted ? `${answered}/${item.questions.length} answered` : 'Not submitted',
      extra: 'Human-graded on the real platform',
    }
  })

  return (
    <div className="page">
      <h1>Assessment submitted</h1>
      <p className="lede">
        On Coderbyte you would now see a thank-you page and leave. The company receives the report.
        This trainer shows your local scores so you can learn.
      </p>
      <div className="card">
        <p>
          <strong>{candidate.name}</strong> · {candidate.email}
        </p>
        <p className="muted">
          {remainingMs === 0 ? 'Time expired — auto-submitted.' : 'Submitted while time remained.'}
        </p>
        <div className="results-grid">
          {rows.map((row) => (
            <div className="item-row" key={row.id}>
              <div>
                <h3>{row.title}</h3>
                <p>{row.extra}</p>
              </div>
              <div className="score">{row.detail}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
        <button className="btn btn-green" onClick={reset}>
          Back to home
        </button>
      </div>
    </div>
  )
}

export function StudyHubScreen() {
  const { openArticle, openItem } = useSession()
  const reactItems = catalog.filter(isReactItem)
  const algoItems = catalog.filter(isAlgoItem)

  return (
    <div className="page-wide">
      <h1>Study hub</h1>
      <p className="lede">
        Stay on the React drills. They are the same shape as Agent Directory: state in a parent,
        children that receive props, siblings that never talk directly, and effects for load / cleanup.
        Hints and solutions stay hidden until you ask.
      </p>
      <h2>Guides</h2>
      <div className="study-grid">
        {studyArticles.map((article) => (
          <button className="card study-card" key={article.id} onClick={() => openArticle(article.id)}>
            <h2>{article.title}</h2>
            <p>
              {article.minutes} min · {article.tags.join(' · ')}
            </p>
          </button>
        ))}
      </div>
      <h2>React challenges</h2>
      <div className="item-list">
        {reactItems.map((item) => (
          <div className="item-row" key={item.id}>
            <div>
              <h3>{item.title}</h3>
              <p>{item.concepts.join(' · ')}</p>
            </div>
            <Pill tone={item.difficulty}>{item.difficulty}</Pill>
            <button className="btn btn-green" onClick={() => openItem(item.id, 'editor')}>
              Practice
            </button>
          </div>
        ))}
      </div>
      <h2>Knowledge</h2>
      <div className="item-list">
        {catalog
          .filter((item) => item.kind === 'mcq' || item.kind === 'written')
          .map((item) => (
            <div className="item-row" key={item.id}>
              <div>
                <h3>{item.title}</h3>
                <p>{item.kind === 'mcq' ? 'Multiple choice' : 'Open-ended'}</p>
              </div>
              <button
                className="btn btn-ghost"
                onClick={() => openItem(item.id, item.kind === 'mcq' ? 'mcq' : 'written')}
              >
                Practice
              </button>
            </div>
          ))}
      </div>
      <h2>Optional JS puzzles</h2>
      <p className="lede">
        Skip these unless a real invite lists algorithm challenges. They are not React.
      </p>
      <div className="item-list">
        {algoItems.map((item) => (
          <div className="item-row" key={item.id}>
            <div>
              <h3>{item.title}</h3>
              <p>{item.concepts.join(' · ')}</p>
            </div>
            <Pill tone={item.difficulty}>{item.difficulty}</Pill>
            <button className="btn btn-ghost" onClick={() => openItem(item.id, 'editor')}>
              Practice
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export function StudyArticleScreen() {
  const { articleId, setScreen } = useSession()
  const article = studyArticles.find((item) => item.id === articleId)
  if (!article) return <div className="page">Article not found.</div>
  return (
    <div className="page">
      <button className="btn btn-ghost" onClick={() => setScreen('study')}>
        ← Study hub
      </button>
      <p className="muted">
        {article.minutes} min · {article.tags.join(' · ')}
      </p>
      <h1>{article.title}</h1>
      <MarkdownBody text={article.body} />
    </div>
  )
}
