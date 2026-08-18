import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom'
import MainLayout from '@/components/Layout/MainLayout'
import Dashboard from '@/pages/Dashboard'
import Devices from '@/pages/Devices'
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
          <Route path="/devices" element={<Devices />} />
          <Route path="/project-details" element={<ProjectDetails />} />
          <Route path="/project-details/:projectId" element={<ProjectDetails />} />
          <Route path="/alarm" element={<Alarms />} />
          <Route path="/battery" element={<Battery />} />
          <Route path="/battery/:batteryId" element={<Battery />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </MainLayout>
    </Router>
  )
}

export default App
