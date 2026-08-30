import { catalogById } from '../data/catalog'
import { useSession } from '../state/SessionContext'
import type { McqSet, WrittenSet } from '../types'

export function McqScreen() {
  const { activeItemId, mcq, saveMcqAnswer, submitMcq, setScreen, mode } = useSession()
  const item = activeItemId ? catalogById[activeItemId] : null
  if (!item || item.kind !== 'mcq') return <div className="page">Question set not found.</div>
  const set = item as McqSet
  const attempt = mcq[set.id] ?? { answers: {}, submitted: false }
  const back = mode === 'assessment' ? 'dashboard' : 'study'
  const correct = set.questions.filter((q) => attempt.answers[q.id] === q.correctId).length

  return (
    <div className="page">
      <button className="btn btn-ghost" onClick={() => setScreen(back)}>
        ← Back
      </button>
      <h1>{set.title}</h1>
      <p className="lede">
        Coderbyte multiple-choice items are one screen, several stems. There is no partial editor.
        Answer them, then submit the set.
      </p>
      <div className="written-box">
        {set.questions.map((question, index) => (
          <div className="card" key={question.id}>
            <h3>
              {index + 1}. {question.prompt}
            </h3>
            <div className="mcq-options">
              {question.options.map((option) => (
                <label key={option.id}>
                  <input
                    type="radio"
                    name={question.id}
                    checked={attempt.answers[question.id] === option.id}
                    onChange={() => saveMcqAnswer(set.id, question.id, option.id)}
                  />
                  <span>{option.text}</span>
                </label>
              ))}
            </div>
            {attempt.submitted ? (
              <p className={attempt.answers[question.id] === question.correctId ? 'pass' : 'fail'}>
                {attempt.answers[question.id] === question.correctId ? 'Correct. ' : 'Incorrect. '}
                {question.explanation}
              </p>
            ) : null}
          </div>
        ))}
      </div>
      <div style={{ marginTop: 16 }}>
        <button className="btn btn-green" onClick={() => submitMcq(set.id)}>
          Submit answers
        </button>
        {attempt.submitted ? (
          <p>
            Score: {correct}/{set.questions.length}
          </p>
        ) : null}
      </div>
    </div>
  )
}

export function WrittenScreen() {
  const { activeItemId, written, saveWrittenAnswer, submitWritten, setScreen, mode } = useSession()
  const item = activeItemId ? catalogById[activeItemId] : null
  if (!item || item.kind !== 'written') return <div className="page">Question set not found.</div>
  const set = item as WrittenSet
  const attempt = written[set.id] ?? { answers: {}, submitted: false }
  const back = mode === 'assessment' ? 'dashboard' : 'study'

  return (
    <div className="page">
      <button className="btn btn-ghost" onClick={() => setScreen(back)}>
        ← Back
      </button>
      <h1>{set.title}</h1>
      <p className="lede">
        Open-ended Coderbyte questions are graded by a human at the company. Be specific. Use a real
        git or teamwork example, not a slogan.
      </p>
      <div className="written-box">
        {set.questions.map((question, index) => (
          <div className="card" key={question.id}>
            <h3>
              {index + 1}. {question.prompt}
            </h3>
            <textarea
              rows={8}
              value={attempt.answers[question.id] ?? ''}
              onChange={(event) => saveWrittenAnswer(set.id, question.id, event.target.value)}
            />
            {attempt.submitted ? (
              <div className="hint">
                <strong>What a strong answer covers</strong>
                <ul>
                  {question.rubric.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
                <strong>Sample</strong>
                <p>{question.sampleAnswer}</p>
              </div>
            ) : null}
          </div>
        ))}
      </div>
      <div style={{ marginTop: 16 }}>
        <button className="btn btn-green" onClick={() => submitWritten(set.id)}>
          Submit written answers
        </button>
      </div>
    </div>
  )
}
