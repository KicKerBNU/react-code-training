import { Header } from './components/ui'
import { SessionProvider, useSession } from './state/SessionContext'
import { HomeScreen } from './screens/HomeScreen'
import { BriefingScreen, DashboardScreen, IntroScreen, WelcomeScreen } from './screens/FlowScreens'
import { EditorScreen } from './screens/EditorScreen'
import { McqScreen, WrittenScreen } from './screens/KnowledgeScreens'
import { ResultsScreen, StudyArticleScreen, StudyHubScreen } from './screens/StudyScreens'

function Shell() {
  const { screen, submitAssessment } = useSession()

  const body = {
    home: <HomeScreen />,
    welcome: <WelcomeScreen />,
    intro: <IntroScreen />,
    dashboard: <DashboardScreen />,
    briefing: <BriefingScreen />,
    editor: <EditorScreen />,
    mcq: <McqScreen />,
    written: <WrittenScreen />,
    results: <ResultsScreen />,
    study: <StudyHubScreen />,
    'study-article': <StudyArticleScreen />,
  }[screen]

  return (
    <div className="app-shell">
      <Header onSubmitAssessment={submitAssessment} />
      {body}
    </div>
  )
}

export default function App() {
  return (
    <SessionProvider>
      <Shell />
    </SessionProvider>
  )
}
