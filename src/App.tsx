import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom'
import MainLayout from '@/components/Layout/MainLayout'
import Dashboard from '@/pages/Dashboard'
import Projects from '@/pages/Projects'
import ProjectDetails from '@/pages/ProjectDetails'
import Alarms from '@/pages/Alarms'
import Battery from '@/pages/Battery'
import './styles/globals.css'

function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/project-details" element={<Projects />} />
          <Route path="/project-details/:projectId" element={<ProjectDetails />} />
          <Route path="/project-details/:projectId/:section" element={<ProjectDetails />} />
          <Route path="/alarms" element={<Alarms />} />
          <Route path="/battery" element={<Battery />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </MainLayout>
    </Router>
  )
}

export default App
