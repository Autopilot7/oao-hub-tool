import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useBundleStore } from '../../stores/useBundleStore'
import { PageLayout } from '../../components/layout/PageLayout'
import { Badge } from '../../components/shared/Badge'
import { RuleBuilder } from '../decisionFlows/RuleBuilder'
import { ConfirmDialog } from '../../components/shared/ConfirmDialog'
import type { SegmentBundle, Category, BundleStatus } from '../../types'

const EMPTY: SegmentBundle = {
  id: '', name: '', category: 'bank_account', description: '',
  editable: true, rules: [], status: 'DRAFT',
  created_by: 'admin@zalopay.vn',
  created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
}

export function BundleDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getById, save, add } = useBundleStore()
  const isNew = id === 'new'

  const [form, setForm] = useState<SegmentBundle>(EMPTY)
  const [editMode, setEditMode] = useState(isNew)
  const [showCancel, setShowCancel] = useState(false)
  const [toast, setToast] = useState('')

  useEffect(() => {
    if (!isNew) {
      const found = getById(id!)
      if (found) setForm(JSON.parse(JSON.stringify(found)))
      else navigate('/segment-bundles')
    }
  }, [id])

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2500) }
  const patch = <K extends keyof SegmentBundle>(k: K, v: SegmentBundle[K]) => setForm((f) => ({ ...f, [k]: v }))

  const handleSave = (asDraft = false) => {
    if (!form.name) { showToast('Name bắt buộc'); return }
    const withStatus: SegmentBundle = { ...form, status: asDraft ? 'DRAFT' : 'ACTIVE' }
    if (isNew) {
      const newId = `sb-${Date.now()}`
      add({ ...withStatus, id: newId })
      navigate(`/segment-bundles/${newId}`)
    } else {
      save(withStatus)
      setEditMode(false)
    }
    showToast(asDraft ? 'Đã lưu draft' : 'Đã publish')
  }

  return (
    <PageLayout
      title={isNew ? 'Tạo Segment Bundle mới' : form.name}
      subtitle={`Category: ${form.category} · ${form.rules.length} rule groups`}
      actions={
        <div className="flex items-center gap-2">
          {!isNew && <Badge status={form.status} />}
          {!editMode ? (
            <button className="btn-primary" onClick={() => setEditMode(true)}>Edit</button>
          ) : (
            <>
              <button className="btn-secondary" onClick={() => { if (isNew) navigate(-1); else setShowCancel(true) }}>Cancel</button>
              <button className="btn-secondary" onClick={() => handleSave(true)}>Save Draft</button>
              <button className="btn-primary" onClick={() => handleSave(false)}>Publish</button>
            </>
          )}
        </div>
      }
    >
      {toast && <div className="fixed top-4 right-4 z-50 bg-ink-900 text-white text-sm px-4 py-2 rounded-lg shadow-lg">{toast}</div>}

      <div className="card">
        <div className="card-header"><h2>Bundle Information</h2></div>
        <div className="card-body grid grid-cols-2 gap-4">
          <div>
            <label className="form-label">Name *</label>
            <input className="form-input" value={form.name} onChange={(e) => patch('name', e.target.value)} disabled={!editMode} placeholder="VD: High Spenders" />
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
          <div className="col-span-2">
            <label className="form-label">Description (mục tiêu và context sử dụng)</label>
            <textarea className="form-textarea" rows={2} value={form.description ?? ''} onChange={(e) => patch('description', e.target.value)} disabled={!editMode} />
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div>
            <h2>Rules</h2>
            <p className="text-xs text-ink-400 mt-0.5">Cùng cấu trúc với Rule Groups trong Decision Flow</p>
          </div>
        </div>
        <div className="card-body">
          <RuleBuilder ruleGroups={form.rules} onChange={(groups) => patch('rules', groups)} editMode={editMode} />
        </div>
      </div>

      <ConfirmDialog
        open={showCancel}
        title="Hủy thay đổi?"
        message="Các thay đổi chưa lưu sẽ bị mất."
        confirmLabel="Hủy"
        onConfirm={() => { const found = getById(id!); if (found) setForm(JSON.parse(JSON.stringify(found))); setEditMode(false); setShowCancel(false) }}
        onCancel={() => setShowCancel(false)}
      />
    </PageLayout>
  )
}
