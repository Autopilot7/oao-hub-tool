import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useExperimentStore } from '../../stores/useExperimentStore'
import { useBundleStore } from '../../stores/useBundleStore'
import { PageLayout } from '../../components/layout/PageLayout'
import { Badge } from '../../components/shared/Badge'
import type { Experiment, Variant, Category } from '../../types'

const EMPTY: Experiment = {
  id: '', name: '', category: 'bank_account', status: 'draft',
  traffic_allocation: 100,
  start_time: new Date().toISOString().slice(0, 16),
  end_time: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString().slice(0, 16),
  created_at: new Date().toISOString(),
  variants: [],
}

function MetricsDashboard({ experimentId }: { experimentId: string }) {
  const { metrics } = useExperimentStore()
  const data = metrics[experimentId]

  if (!data || data.length === 0) {
    return <p className="text-ink-400 text-sm text-center py-6">Chưa có dữ liệu metrics</p>
  }

  const fmt = (n: number) => n.toLocaleString('vi-VN')
  const pct = (n: number) => (n * 100).toFixed(1) + '%'
  const currency = (n: number) =>
    n >= 1e9 ? (n / 1e9).toFixed(2) + ' tỷ' : n >= 1e6 ? (n / 1e6).toFixed(1) + ' triệu' : fmt(n)

  const best = (key: keyof typeof data[0]) => {
    const max = Math.max(...data.map((d) => Number(d[key])))
    return max
  }

  return (
    <div className="overflow-x-auto">
      <table className="table">
        <thead>
          <tr>
            <th>Metric</th>
            {data.map((d) => <th key={d.variant_id} className="text-center">{d.variant_name}</th>)}
          </tr>
        </thead>
        <tbody>
          {[
            { label: 'Impressions', key: 'impressions' as const, fmt: fmt },
            { label: 'Clicks', key: 'clicks' as const, fmt: fmt },
            { label: 'Conversions', key: 'conversions' as const, fmt: fmt },
            { label: 'CTR', key: 'ctr' as const, fmt: pct },
            { label: 'CVR', key: 'cvr' as const, fmt: pct },
            { label: 'Revenue', key: 'revenue' as const, fmt: currency },
          ].map(({ label, key, fmt: f }) => {
            const bestVal = best(key)
            return (
              <tr key={key}>
                <td className="font-medium text-ink-700">{label}</td>
                {data.map((d) => {
                  const val = Number(d[key])
                  const isBest = val === bestVal && val > 0
                  return (
                    <td key={d.variant_id} className={`text-center ${isBest ? 'text-green-700 font-semibold' : 'text-ink-600'}`}>
                      {isBest && <span className="text-green-400 mr-1 text-xs">▲</span>}
                      {f(val)}
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export function ExperimentDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getById, save, add, transition } = useExperimentStore()
  const { bundles } = useBundleStore()
  const isNew = id === 'new'

  const [form, setForm] = useState<Experiment>(EMPTY)
  const [editMode, setEditMode] = useState(isNew)
  const [toast, setToast] = useState('')
  const [activeTab, setActiveTab] = useState<'setup' | 'metrics'>('setup')

  useEffect(() => {
    if (!isNew) {
      const found = getById(id!)
      if (found) setForm(JSON.parse(JSON.stringify(found)))
      else navigate('/experiments')
    }
  }, [id])

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2500) }
  const patch = <K extends keyof Experiment>(k: K, v: Experiment[K]) => setForm((f) => ({ ...f, [k]: v }))
  const canEdit = form.status === 'draft' || isNew

  const handleSave = () => {
    if (!form.name || form.variants.length < 2) { showToast('Cần ít nhất 2 variants và name'); return }
    const totalSplit = form.variants.reduce((s, v) => s + v.traffic_split, 0)
    if (Math.abs(totalSplit - 100) > 0.01) { showToast('Tổng traffic split phải = 100%'); return }
    if (isNew) {
      const newId = `exp-${Date.now()}`
      add({ ...form, id: newId })
      navigate(`/experiments/${newId}`)
    } else {
      save(form)
      setEditMode(false)
    }
    showToast('Đã lưu')
  }

  const addVariant = () => {
    const newV: Variant = {
      id: `var-${Date.now()}`, experiment_id: form.id,
      name: `Variant ${String.fromCharCode(65 + form.variants.length)}`,
      segment_bundle_id: '', segment_bundle_name: '', segment_bundle_snapshot: [],
      traffic_split: 0,
    }
    patch('variants', [...form.variants, newV])
  }

  const updateVariant = (idx: number, patch_: Partial<Variant>) => {
    patch('variants', form.variants.map((v, i) => {
      if (i !== idx) return v
      const bundle = bundles.find((b) => b.id === patch_.segment_bundle_id)
      return { ...v, ...patch_, segment_bundle_name: bundle?.name ?? v.segment_bundle_name }
    }))
  }

  const removeVariant = (idx: number) =>
    patch('variants', form.variants.filter((_, i) => i !== idx))

  const totalSplit = form.variants.reduce((s, v) => s + (v.traffic_split || 0), 0)

  return (
    <PageLayout
      title={isNew ? 'Tạo Experiment mới' : form.name}
      subtitle={`${form.category} · ${form.variants.length} variants`}
      actions={
        <div className="flex items-center gap-2">
          {!isNew && <Badge status={form.status} />}
          {form.status === 'draft' && !isNew && (
            <button className="btn text-green-600 bg-green-50 hover:bg-green-100 border border-green-200 text-xs" onClick={() => { transition(id!, 'start'); showToast('Đã start experiment') }}>Start</button>
          )}
          {form.status === 'running' && (
            <>
              <button className="btn text-orange-500 bg-orange-50 hover:bg-orange-100 border border-orange-200 text-xs" onClick={() => { transition(id!, 'pause'); showToast('Đã pause') }}>Pause</button>
              <button className="btn text-red-500 bg-red-50 hover:bg-red-100 border border-red-200 text-xs" onClick={() => { transition(id!, 'complete'); showToast('Đã complete') }}>Stop</button>
            </>
          )}
          {form.status === 'paused' && (
            <>
              <button className="btn text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-xs" onClick={() => { transition(id!, 'resume'); showToast('Đã resume') }}>Resume</button>
              <button className="btn text-red-500 bg-red-50 hover:bg-red-100 border border-red-200 text-xs" onClick={() => { transition(id!, 'complete'); showToast('Đã complete') }}>Stop</button>
            </>
          )}
          {canEdit && (
            !editMode ? (
              <button className="btn-primary" onClick={() => setEditMode(true)}>Edit</button>
            ) : (
              <>
                <button className="btn-secondary" onClick={() => { if (isNew) navigate(-1); else setEditMode(false) }}>Cancel</button>
                <button className="btn-primary" onClick={handleSave}>Save</button>
              </>
            )
          )}
        </div>
      }
    >
      {toast && <div className="fixed top-4 right-4 z-50 bg-ink-900 text-white text-sm px-4 py-2 rounded-lg shadow-lg">{toast}</div>}

      {/* Tabs */}
      {!isNew && (
        <div className="tab-bar">
          <button className={activeTab === 'setup' ? 'tab-item-active' : 'tab-item'} onClick={() => setActiveTab('setup')}>Setup</button>
          <button className={activeTab === 'metrics' ? 'tab-item-active' : 'tab-item'} onClick={() => setActiveTab('metrics')}>Metrics Dashboard</button>
        </div>
      )}

      {(isNew || activeTab === 'setup') && (
        <>
          {/* Basic Information */}
          <div className="card">
            <div className="card-header"><h2>Basic Information</h2></div>
            <div className="card-body grid grid-cols-2 gap-4">
              <div>
                <label className="form-label">Name *</label>
                <input className="form-input" value={form.name} onChange={(e) => patch('name', e.target.value)} disabled={!editMode} placeholder="VD: Bank Account Bundle Q2" />
              </div>
              <div>
                <label className="form-label">Category *</label>
                <select className="form-select" value={form.category} onChange={(e) => patch('category', e.target.value as Category)} disabled={!editMode}>
                  <option value="bank_account">Bank Account</option>
                  <option value="loan">Loan</option>
                  <option value="credit_card">Credit Card</option>
                  <option value="insurance">Insurance</option>
                  <option value="promotion">Promotion</option>
                </select>
              </div>
              <div>
                <label className="form-label">Traffic Allocation (%) *</label>
                <input className="form-input" type="number" min={1} max={100} value={form.traffic_allocation} onChange={(e) => patch('traffic_allocation', Number(e.target.value))} disabled={!editMode} />
                <p className="text-xs text-ink-400 mt-0.5">% user eligible của category tham gia experiment</p>
              </div>
              <div className="col-span-2 grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Start Time *</label>
                  <input className="form-input" type="datetime-local" value={form.start_time.slice(0, 16)} onChange={(e) => patch('start_time', e.target.value)} disabled={!editMode} />
                </div>
                <div>
                  <label className="form-label">End Time * (phải sau Start Time)</label>
                  <input className="form-input" type="datetime-local" value={form.end_time.slice(0, 16)} onChange={(e) => patch('end_time', e.target.value)} disabled={!editMode} />
                </div>
              </div>
            </div>
          </div>

          {/* Variants */}
          <div className="card">
            <div className="card-header">
              <div>
                <h2>Variants</h2>
                <p className="text-xs text-ink-400 mt-0.5">
                  Tối thiểu 2 variants. Tổng traffic split phải = 100%.
                  <span className={`ml-2 font-medium ${Math.abs(totalSplit - 100) > 0.01 ? 'text-red-500' : 'text-green-600'}`}>
                    Hiện tại: {totalSplit}%
                  </span>
                </p>
              </div>
              {editMode && form.variants.length < 5 && (
                <button className="btn-secondary text-xs" onClick={addVariant}>+ Add Variant</button>
              )}
            </div>
            <div className="card-body space-y-4">
              {form.variants.length < 2 && editMode && (
                <div className="text-center py-6 text-ink-400 text-sm border-2 border-dashed border-surface-200 rounded-xl">
                  Thêm ít nhất 2 variants để chạy experiment
                </div>
              )}
              {form.variants.map((v, i) => (
                <div key={v.id} className="p-4 bg-surface-50 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-ink-700">{v.name}</h3>
                    {editMode && (
                      <button type="button" className="text-red-400 hover:text-red-600 text-xs" onClick={() => removeVariant(i)}>Remove</button>
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="form-label">Variant Name *</label>
                      <input className="form-input text-xs" value={v.name} onChange={(e) => updateVariant(i, { name: e.target.value })} disabled={!editMode} />
                    </div>
                    <div>
                      <label className="form-label">Segment Bundle *</label>
                      <select className="form-select text-xs" value={v.segment_bundle_id} onChange={(e) => updateVariant(i, { segment_bundle_id: e.target.value })} disabled={!editMode}>
                        <option value="">Chọn bundle...</option>
                        {bundles.filter((b) => b.category === form.category).map((b) => (
                          <option key={b.id} value={b.id}>{b.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="form-label">Traffic Split (%) *</label>
                      <input className="form-input text-xs" type="number" min={0} max={100} value={v.traffic_split} onChange={(e) => updateVariant(i, { traffic_split: Number(e.target.value) })} disabled={!editMode} />
                    </div>
                  </div>
                  {form.status !== 'draft' && (
                    <div className="mt-2">
                      <p className="text-xs text-ink-400">Bundle snapshot (immutable khi experiment running)</p>
                      <p className="text-xs font-mono text-ink-600 bg-surface-100 px-2 py-1 rounded mt-1">{v.segment_bundle_name || '—'}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {!isNew && activeTab === 'metrics' && (
        <div className="card">
          <div className="card-header">
            <h2>Metrics Dashboard</h2>
            <p className="text-xs text-ink-400">So sánh side-by-side giữa các variants. Giá trị tốt nhất được highlight.</p>
          </div>
          <div className="card-body">
            <MetricsDashboard experimentId={id!} />
          </div>
        </div>
      )}
    </PageLayout>
  )
}
