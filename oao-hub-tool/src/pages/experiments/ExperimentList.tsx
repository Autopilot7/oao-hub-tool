import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useExperimentStore } from '../../stores/useExperimentStore'
import { PageLayout } from '../../components/layout/PageLayout'
import { Badge } from '../../components/shared/Badge'
import type { ExperimentStatus, Category } from '../../types'

const CATEGORY_LABELS: Record<string, string> = {
  bank_account: 'Bank Account', loan: 'Loan', credit_card: 'Credit Card',
  insurance: 'Insurance', promotion: 'Promotion',
}

export function ExperimentList() {
  const { experiments, transition, clone } = useExperimentStore()
  const navigate = useNavigate()
  const [filterStatus, setFilterStatus] = useState<ExperimentStatus | ''>('')
  const [filterCat, setFilterCat] = useState<Category | ''>('')
  const [toast, setToast] = useState('')
  const [toastError, setToastError] = useState('')

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2500) }
  const showError = (msg: string) => { setToastError(msg); setTimeout(() => setToastError(''), 4000) }

  const handleTransition = (id: string, action: 'start' | 'pause' | 'resume' | 'complete', successMsg: string) => {
    const err = transition(id, action)
    if (err) { showError(err) } else { showToast(successMsg) }
  }

  const filtered = experiments.filter((e) => {
    const matchStatus = !filterStatus || e.status === filterStatus
    const matchCat = !filterCat || e.category === filterCat
    return matchStatus && matchCat
  })

  return (
    <PageLayout
      title="A/B Testing"
      subtitle="So sánh hiệu quả của các Segment Bundle khác nhau"
      actions={
        <button className="btn-primary" onClick={() => navigate('/experiments/new')}>+ Add New Experiment</button>
      }
    >
      {toast && <div className="fixed top-4 right-4 z-50 bg-ink-900 text-white text-sm px-4 py-2 rounded-lg shadow-lg">{toast}</div>}
      {toastError && <div className="fixed top-16 right-4 z-50 bg-red-600 text-white text-sm px-4 py-2 rounded-lg shadow-lg max-w-xs">{toastError}</div>}

      <div className="flex flex-wrap gap-3">
        <select className="form-select w-40" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as ExperimentStatus | '')}>
          <option value="">Tất cả Status</option>
          <option value="draft">Draft</option>
          <option value="running">Running</option>
          <option value="paused">Paused</option>
          <option value="completed">Completed</option>
        </select>
        <select className="form-select w-44" value={filterCat} onChange={(e) => setFilterCat(e.target.value as Category | '')}>
          <option value="">Tất cả Category</option>
          <option value="bank_account">Bank Account</option>
          <option value="loan">Loan</option>
          <option value="credit_card">Credit Card</option>
          <option value="insurance">Insurance</option>
          <option value="promotion">Promotion</option>
        </select>
        <span className="text-xs text-ink-400 self-center ml-auto">{filtered.length} experiments</span>
      </div>

      <div className="card">
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Status</th>
                <th>Variants</th>
                <th>Traffic</th>
                <th>Timeline</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="text-center text-ink-400 py-8">Không có kết quả</td></tr>
              )}
              {filtered.map((e) => (
                <tr key={e.id}>
                  <td>
                    <p className="font-medium text-ink-900">{e.name}</p>
                    <p className="text-xs text-ink-400 font-mono">{e.id}</p>
                  </td>
                  <td>
                    <span className="text-xs bg-surface-100 text-ink-600 px-2 py-0.5 rounded-full font-medium">
                      {CATEGORY_LABELS[e.category]}
                    </span>
                  </td>
                  <td><Badge status={e.status} /></td>
                  <td className="text-ink-500 text-xs">{e.variants.length} variants</td>
                  <td className="text-ink-500 text-xs">{e.traffic_allocation}%</td>
                  <td className="text-ink-400 text-xs">
                    <p>{new Date(e.start_time).toLocaleDateString('vi-VN')}</p>
                    <p>→ {new Date(e.end_time).toLocaleDateString('vi-VN')}</p>
                  </td>
                  <td>
                    <div className="flex gap-1 flex-wrap">
                      <button className="btn-ghost text-xs" onClick={() => navigate(`/experiments/${e.id}`)}>View</button>
                      {/* Clone — PRD §6.x */}
                      <button
                        className="btn-ghost text-xs text-purple-600 hover:bg-purple-50"
                        onClick={() => { clone(e.id); showToast(`Đã clone "${e.name}"`) }}
                      >Clone</button>
                      {/* Start — có validation */}
                      {e.status === 'draft' && (
                        <button className="btn-ghost text-xs text-green-600 hover:bg-green-50" onClick={() => handleTransition(e.id, 'start', 'Experiment đã start')}>Start</button>
                      )}
                      {e.status === 'running' && (
                        <button className="btn-ghost text-xs text-orange-500 hover:bg-orange-50" onClick={() => handleTransition(e.id, 'pause', 'Experiment đã pause')}>Pause</button>
                      )}
                      {e.status === 'paused' && (
                        <button className="btn-ghost text-xs text-blue-600 hover:bg-blue-50" onClick={() => handleTransition(e.id, 'resume', 'Experiment đã resume')}>Resume</button>
                      )}
                      {(e.status === 'running' || e.status === 'paused') && (
                        <button className="btn-ghost text-xs text-red-500 hover:bg-red-50" onClick={() => handleTransition(e.id, 'complete', 'Experiment đã complete')}>Stop</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </PageLayout>
  )
}
