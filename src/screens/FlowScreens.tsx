import { catalogById, mockAssessment } from '../data/catalog'
import { useSession } from '../state/SessionContext'
import { Pill } from '../components/ui'

export function WelcomeScreen() {
  const { candidate, setCandidate, setScreen } = useSession()
  const ready = candidate.name.trim().length > 1 && candidate.email.includes('@')

  return (
    <div className="page">
      <h1>Candidate details</h1>
      <p className="lede">
        On the real platform this is the first screen after you open the invitation link. The company
        uses name and email to attach your report.
      </p>
      <form
        className="form card"
        onSubmit={(event) => {
          event.preventDefault()
          if (ready) setScreen('intro')
        }}
      >
        <label>
          Full name
          <input
            value={candidate.name}
            onChange={(event) => setCandidate({ ...candidate, name: event.target.value })}
            autoComplete="name"
          />
        </label>
        <label>
          Email
          <input
            value={candidate.email}
            onChange={(event) => setCandidate({ ...candidate, email: event.target.value })}
            autoComplete="email"
          />
        </label>
        <button className="btn btn-green" disabled={!ready} type="submit">
          Continue
        </button>
      </form>
    </div>
  )
}

export function IntroScreen() {
  const { startAssessment } = useSession()
  return (
    <div className="page">
      <div className="welcome-layout">
        <div className="card time-card">
          <div className="muted">Time allowed</div>
          <div className="big">{mockAssessment.durationMinutes}</div>
          <div>minutes</div>
          <p className="muted">The timer starts on Begin Assessment and cannot be paused.</p>
        </div>
        <div className="card">
          <h1>{mockAssessment.title}</h1>
          <p className="lede">{mockAssessment.welcome}</p>
          <ul>
            {mockAssessment.rules.map((rule) => (
              <li key={rule}>{rule}</li>
            ))}
          </ul>
          <button className="btn btn-green" onClick={startAssessment}>
            Begin Assessment
          </button>
        </div>
      </div>
    </div>
  )
}

export function DashboardScreen() {
  const { coding, mcq, written, openItem, submitAssessment } = useSession()

  return (
    <div className="page">
      <h1>Your assessment</h1>
      <p className="lede">
        This is the Coderbyte dashboard. Open any item, work in any order, and submit each one. The
        clock keeps running while you are in an editor.
      </p>
      <div className="item-list">
        {mockAssessment.itemIds.map((id, index) => {
          const item = catalogById[id]
          const done =
            item.kind === 'react' || item.kind === 'algo'
              ? coding[id]?.submitted
              : item.kind === 'mcq'
                ? mcq[id]?.submitted
                : written[id]?.submitted
          const next =
            item.kind === 'react' || item.kind === 'algo'
              ? 'briefing'
              : item.kind === 'mcq'
                ? 'mcq'
                : 'written'
          return (
            <div className="item-row" key={id}>
              <div>
                <h3>
                  {index + 1}. {item.title}
                </h3>
                <p>
                  {item.kind === 'react'
                    ? 'Frontend coding challenge'
                    : item.kind === 'algo'
                      ? 'Algorithm coding challenge'
                      : item.kind === 'mcq'
                        ? 'Multiple choice'
                        : 'Open-ended questions'}
                </p>
              </div>
              <Pill tone={item.difficulty}>{item.difficulty}</Pill>
              <button className="btn btn-green" onClick={() => openItem(id, next)}>
                {done ? 'Review' : 'Begin challenge'}
              </button>
            </div>
          )
        })}
      </div>
      <div style={{ marginTop: 24 }}>
        <button className="btn btn-green" onClick={submitAssessment}>
          Submit Assessment
        </button>
      </div>
    </div>
  )
}

export function BriefingScreen() {
  const { activeItemId, openItem, setScreen } = useSession()
  const item = activeItemId ? catalogById[activeItemId] : null
  if (!item || (item.kind !== 'react' && item.kind !== 'algo')) {
    return (
      <div className="page">
        <p>No challenge selected.</p>
        <button className="btn btn-ghost" onClick={() => setScreen('dashboard')}>
          Back
        </button>
      </div>
    )
  }

  return (
    <div className="page">
      <button className="btn btn-ghost" onClick={() => setScreen('dashboard')}>
        ← Back to assessment
      </button>
      <div className="card" style={{ marginTop: 16 }}>
        <p className="muted">Challenge briefing</p>
        <h1>{item.title}</h1>
        <p className="lede">
          Next you will get the Coderbyte editor: prompt on the left, code on the right
          {item.kind === 'react' ? ', live preview of your component,' : ','} sample cases, and Submit
          Solution. Suggested time: {item.timeSuggestedMin} minutes.
        </p>
        <div className="meta-row">
          <Pill tone={item.difficulty}>{item.difficulty}</Pill>
          {item.concepts.map((concept) => (
            <span className="pill" key={concept}>
              {concept}
            </span>
          ))}
        </div>
        <button className="btn btn-green" onClick={() => openItem(item.id, 'editor')}>
          Open editor
        </button>
      </div>
    </div>
  )
}
