import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Sidebar } from './components/layout/Sidebar'

import { ConfigList } from './pages/configurations/ConfigList'
import { ConfigDetail } from './pages/configurations/ConfigDetail'
import { DecisionList } from './pages/decisionFlows/DecisionList'
import { DecisionDetail } from './pages/decisionFlows/DecisionDetail'
import { BundleList } from './pages/segmentBundles/BundleList'
import { BundleDetail } from './pages/segmentBundles/BundleDetail'
import { ExperimentList } from './pages/experiments/ExperimentList'
import { ExperimentDetail } from './pages/experiments/ExperimentDetail'

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen bg-surface-50">
        <Sidebar />
        <div className="flex-1 min-w-0">
          <Routes>
            <Route path="/" element={<Navigate to="/configurations" replace />} />

            <Route path="/configurations" element={<ConfigList />} />
            <Route path="/configurations/:id" element={<ConfigDetail />} />

            {/* Redirect cũ từ /partner-configurations → /configurations */}
            <Route path="/partner-configurations" element={<Navigate to="/configurations" replace />} />
            <Route path="/partner-configurations/:id" element={<Navigate to="/configurations" replace />} />

            <Route path="/decision-flows" element={<DecisionList />} />
            <Route path="/decision-flows/:id" element={<DecisionDetail />} />

            <Route path="/segment-bundles" element={<BundleList />} />
            <Route path="/segment-bundles/:id" element={<BundleDetail />} />

            <Route path="/experiments" element={<ExperimentList />} />
            <Route path="/experiments/:id" element={<ExperimentDetail />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  )
}
