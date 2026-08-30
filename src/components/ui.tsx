import { mockAssessment } from '../data/catalog'
import { useSession } from '../state/SessionContext'

function format(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000))
  const h = Math.floor(total / 3600)
  const m = Math.floor((total % 3600) / 60)
  const s = total % 60
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  return `${m}:${String(s).padStart(2, '0')}`
}

export function Timer() {
  const { remainingMs, mode } = useSession()
  if (mode !== 'assessment') return <span className="timer">Time left: Unlimited</span>
  const cls = remainingMs < 5 * 60_000 ? 'timer danger' : remainingMs < 15 * 60_000 ? 'timer warn' : 'timer'
  return <span className={cls}>Time left: {format(remainingMs)}</span>
}

export function Header({
  onSubmitAssessment,
}: {
  onSubmitAssessment?: () => void
}) {
  const { mode, screen, leave } = useSession()
  return (
    <header className="topbar">
      <div className="brand">
        <div className="mark">C</div>
        <div>
          Assessment Lab
          <small>{mockAssessment.company} · Coderbyte-style trainer</small>
        </div>
      </div>
      <div className="topbar-actions">
        {mode === 'assessment' && screen !== 'welcome' && screen !== 'intro' && screen !== 'results' ? (
          <Timer />
        ) : null}
        {mode === 'assessment' &&
        screen !== 'welcome' &&
        screen !== 'intro' &&
        screen !== 'results' &&
        onSubmitAssessment ? (
          <button className="btn btn-green" onClick={onSubmitAssessment}>
            Submit Assessment
          </button>
        ) : null}
        {mode !== 'idle' && screen !== 'results' ? (
          <button className="btn btn-ghost" onClick={leave}>
            {mode === 'assessment' ? 'Leave Assessment' : 'Home'}
          </button>
        ) : null}
      </div>
    </header>
  )
}

export function Pill({ children, tone }: { children: string; tone?: 'easy' | 'medium' | 'hard' }) {
  return <span className={`pill ${tone ?? ''}`}>{children}</span>
}

export function MarkdownBody({ text }: { text: string }) {
  const blocks = text.split(/```(?:tsx|ts|js)?\n?/)
  return (
    <div className="note">
      {blocks.map((block, index) => {
        if (index % 2 === 1) {
          return (
            <pre key={index}>
              <code>{block.replace(/```$/, '').trim()}</code>
            </pre>
          )
        }
        const html = block
          .replaceAll('&', '&amp;')
          .replaceAll('<', '&lt;')
          .replaceAll('>', '&gt;')
          .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
          .replace(/`([^`]+)`/g, '<code>$1</code>')
        return <div key={index} dangerouslySetInnerHTML={{ __html: html }} />
      })}
    </div>
  )
}

export const editorOptions = {
  minimap: { enabled: false },
  fontSize: 14,
  tabSize: 2,
  automaticLayout: true,
  scrollBeyondLastLine: false,
  wordWrap: 'on' as const,
  padding: { top: 12 },
}
