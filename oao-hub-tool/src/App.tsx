import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Sidebar } from './components/layout/Sidebar'
import { ProtectedRoute } from './components/layout/ProtectedRoute'

import { LoginPage } from './pages/auth/LoginPage'
import { ConfigList } from './pages/configurations/ConfigList'
import { ConfigDetail } from './pages/configurations/ConfigDetail'
import { DecisionList } from './pages/decisionFlows/DecisionList'
import { DecisionDetail } from './pages/decisionFlows/DecisionDetail'
import { BundleList } from './pages/segmentBundles/BundleList'
import { BundleDetail } from './pages/segmentBundles/BundleDetail'
import { ExperimentList } from './pages/experiments/ExperimentList'
import { ExperimentDetail } from './pages/experiments/ExperimentDetail'
import { AnalyticsDashboard } from './pages/analytics/AnalyticsDashboard'

function MainLayout() {
  return (
    <div className="flex min-h-screen bg-surface-50">
      <Sidebar />
      <div className="flex-1 min-w-0">
        <Routes>
          <Route path="/" element={<Navigate to="/configurations" replace />} />

          <Route path="/configurations" element={<ConfigList />} />
          <Route path="/configurations/:id" element={<ConfigDetail />} />

          <Route path="/partner-configurations" element={<Navigate to="/configurations" replace />} />
          <Route path="/partner-configurations/:id" element={<Navigate to="/configurations" replace />} />

          <Route path="/decision-flows" element={<DecisionList />} />
          <Route path="/decision-flows/:id" element={<DecisionDetail />} />

          <Route path="/segment-bundles" element={<BundleList />} />
          <Route path="/segment-bundles/:id" element={<BundleDetail />} />

          <Route path="/experiments" element={<ExperimentList />} />
          <Route path="/experiments/:id" element={<ExperimentDetail />} />

          <Route path="/analytics" element={<AnalyticsDashboard />} />
        </Routes>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}
