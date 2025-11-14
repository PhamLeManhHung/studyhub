import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Planner from './pages/Planner.jsx'
import SmartNotes from './pages/SmartNotes.jsx'
import Flashcards from './pages/Flashcards.jsx'
import ResourceHub from './pages/ResourceHub.jsx'
import LogicZone from './pages/LogicZone.jsx'
import Motivation from './pages/Motivation.jsx'
import StudyTools from './pages/StudyTools.jsx'

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/planner" element={<Planner />} />
          <Route path="/notes" element={<SmartNotes />} />
          <Route path="/flashcards" element={<Flashcards />} />
          <Route path="/resources" element={<ResourceHub />} />
          <Route path="/logic-zone" element={<LogicZone />} />
          <Route path="/motivation" element={<Motivation />} />
          <Route path="/tools" element={<StudyTools />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App