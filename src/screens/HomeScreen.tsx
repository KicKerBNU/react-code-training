import { mockAssessment, catalog, isReactItem } from '../data/catalog'
import { studyArticles } from '../data/studyNotes'
import { useSession } from '../state/SessionContext'

export function HomeScreen() {
  const { setScreen, enterStudy, reset } = useSession()

  return (
    <div className="page">
      <div className="hero">
        <p className="muted">Practice environment for the Broadvoice Software Engineer screen</p>
        <h1>React + TypeScript, the way Coderbyte presents it</h1>
        <p className="lede">
          Coderbyte is a timed in-browser exam: a welcome page, a dashboard of mixed question types,
          an editor with the prompt on the left, live preview for React, hidden tests, and a clock you
          cannot pause. This trainer recreates that flow, then gives you a study hall for the React
          skills those challenges actually measure.
        </p>
      </div>

      <div className="grid-2">
        <div className="card">
          <h2>1. Mock assessment</h2>
          <p>
            {mockAssessment.durationMinutes / 60} hours. Name and email gate, React challenges (parent/child state, siblings, Zustand,
            effects), multiple choice, written questions, copy/paste flag, submit grading.
          </p>
          <div className="meta-row">
            <span className="pill">{mockAssessment.durationMinutes} min</span>
            <span className="pill">{mockAssessment.itemIds.length} items</span>
            <span className="pill">Hidden tests</span>
          </div>
          <button
            className="btn btn-green"
            onClick={() => {
              reset()
              setScreen('welcome')
            }}
          >
            Enter Coderbyte flow
          </button>
        </div>
        <div className="card">
          <h2>2. Study React</h2>
          <p>
            Untimed drills: forms, lists, lifted state, Zustand, context, fetch states, and effects.
            Hints and solutions are available after you try.
          </p>
          <div className="meta-row">
            <span className="pill">{studyArticles.length} guides</span>
            <span className="pill">{catalog.filter(isReactItem).length} React challenges</span>
          </div>
          <button className="btn btn-ghost" onClick={enterStudy}>
            Open study hub
          </button>
        </div>
      </div>
    </div>
  )
}
