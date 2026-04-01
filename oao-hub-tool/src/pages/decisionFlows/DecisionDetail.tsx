import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDecisionStore } from '../../stores/useDecisionStore'
import { PageLayout } from '../../components/layout/PageLayout'
import { Badge } from '../../components/shared/Badge'
import { ConfirmDialog } from '../../components/shared/ConfirmDialog'
import { RuleBuilder } from './RuleBuilder'
import { TryRuleModal } from './TryRuleModal'
import type { DecisionFlow, FlowType, ContinueOnError } from '../../types'

const EMPTY: DecisionFlow = {
  id: 0, name: '', flow_id: '', version: 1, status: 'ACTIVE',
  flow_type: 'FIRST', produce_execution_result: true, continue_on_error: 'ALLOWED',
  description: '', rule_groups: [],
  created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
}

export function DecisionDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getById, save, add, clone } = useDecisionStore()
  const isNew = id === 'new'
  const numId = isNew ? 0 : Number(id)

  const [form, setForm] = useState<DecisionFlow>(EMPTY)
  const [editMode, setEditMode] = useState(isNew)
  const [showCancel, setShowCancel] = useState(false)
  const [showTryRule, setShowTryRule] = useState(false)
  const [toast, setToast] = useState('')

  useEffect(() => {
    if (!isNew) {
      const found = getById(numId)
      if (found) setForm(JSON.parse(JSON.stringify(found)))
      else navigate('/decision-flows')
    }
  }, [id])

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2500) }
  const patch = <K extends keyof DecisionFlow>(k: K, v: DecisionFlow[K]) => setForm((f) => ({ ...f, [k]: v }))

  const handleSave = () => {
    if (!form.name) { showToast('Name bắt buộc'); return }

    // PRD §4.1: flow_id = auto-generate dựa trên name khi tạo mới
    // Format: SNAKE_UPPER_NAME + timestamp suffix đảm bảo unique
    const withFlowId = isNew
      ? { ...form, flow_id: form.name.trim().toUpperCase().replace(/\s+/g, '_') + '_' + Date.now() }
      : form

    if (isNew) {
      add(withFlowId)
      navigate('/decision-flows')
    } else {
      save(withFlowId)
      setEditMode(false)
    }
    showToast('Đã lưu')
  }

  return (
    <PageLayout
      title={isNew ? 'Tạo Decision Flow mới' : form.name}
      subtitle={`Flow ID: ${form.flow_id || '—'} · v${form.version}`}
      actions={
        <div className="flex items-center gap-2">
          {!isNew && <Badge status={form.status} />}
          {!isNew && <button className="btn-secondary text-xs" onClick={() => { clone(numId); showToast('Đã clone flow') }}>Clone</button>}
          {!isNew && <button className="btn-secondary text-xs" onClick={() => { navigator.clipboard.writeText(JSON.stringify(form, null, 2)); showToast('Đã copy JSON') }}>Copy JSON</button>}
          {!isNew && <button className="btn-secondary text-xs" onClick={() => showToast('Cache đã reload')}>Reload Cache</button>}
          {!isNew && <button className="btn-secondary text-xs text-blue-600" onClick={() => setShowTryRule(true)}>Try Rule</button>}
          {!editMode ? (
            <button className="btn-primary" onClick={() => setEditMode(true)}>Edit</button>
          ) : (
            <>
              <button className="btn-secondary" onClick={() => { if (isNew) navigate(-1); else setShowCancel(true) }}>Cancel</button>
              <button className="btn-primary" onClick={handleSave}>Save</button>
            </>
          )}
        </div>
      }
    >
      {toast && <div className="fixed top-4 right-4 z-50 bg-ink-900 text-white text-sm px-4 py-2 rounded-lg shadow-lg">{toast}</div>}

      {/* Basic Information */}
      <div className="card">
        <div className="card-header"><h2>Basic Information</h2></div>
        <div className="card-body grid grid-cols-2 gap-4">
          <div>
            <label className="form-label">Name * (max 32 ký tự)</label>
            <input className="form-input font-mono" maxLength={32} value={form.name} onChange={(e) => patch('name', e.target.value)} disabled={!editMode} placeholder="VD: TNC_CATHAY" />
            <p className="char-count">{form.name.length}/32</p>
          </div>
          <div>
            <label className="form-label">Flow ID (auto-generate)</label>
            <input className="form-input bg-surface-50 font-mono text-xs" value={form.flow_id || '(auto)'} disabled readOnly />
          </div>
          <div>
            <label className="form-label">Version</label>
            <input className="form-input bg-surface-50" value={`v${form.version}`} disabled readOnly />
          </div>
          <div>
            <label className="form-label">Status *</label>
            <select className="form-select" value={form.status} onChange={(e) => patch('status', e.target.value as 'ACTIVE' | 'INACTIVE')} disabled={!editMode}>
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
            </select>
          </div>
          <div>
            <label className="form-label">Flow Type *</label>
            <select className="form-select" value={form.flow_type} onChange={(e) => patch('flow_type', e.target.value as FlowType)} disabled={!editMode}>
              <option value="FIRST">FIRST — Trả kết quả rule đầu tiên match</option>
              <option value="ALL">ALL — Evaluate hết tất cả rule</option>
            </select>
          </div>
          <div>
            <label className="form-label">Continue On Error *</label>
            <select className="form-select" value={form.continue_on_error} onChange={(e) => patch('continue_on_error', e.target.value as ContinueOnError)} disabled={!editMode}>
              <option value="ALLOWED">ALLOWED — Tiếp tục nếu 1 rule lỗi</option>
              <option value="STOPPED">STOPPED — Dừng ngay</option>
            </select>
          </div>
          <div className="col-span-2 flex items-center gap-3">
            <label className="form-label mb-0">Produce Execution Result</label>
            <label className="flex items-center gap-2 cursor-pointer text-sm text-ink-600">
              <input type="checkbox" checked={form.produce_execution_result} onChange={(e) => patch('produce_execution_result', e.target.checked)} disabled={!editMode} className="w-4 h-4" />
              {form.produce_execution_result ? 'ON — Lưu kết quả evaluate vào DB' : 'OFF — Chỉ trả response, không lưu'}
            </label>
          </div>
          <div className="col-span-2">
            <label className="form-label">Description (max 200 ký tự)</label>
            <textarea className="form-textarea" rows={2} maxLength={200} value={form.description ?? ''} onChange={(e) => patch('description', e.target.value)} disabled={!editMode} />
            <p className="char-count">{(form.description ?? '').length}/200</p>
          </div>
        </div>
      </div>

      {/* Rule Groups */}
      <div className="card">
        <div className="card-header">
          <div>
            <h2>Rule Groups</h2>
            <p className="text-xs text-ink-400 mt-0.5">Evaluate từ trên xuống dưới. Rule match trước → trả kết quả (FIRST mode).</p>
          </div>
        </div>
        <div className="card-body">
          <RuleBuilder ruleGroups={form.rule_groups} onChange={(groups) => patch('rule_groups', groups)} editMode={editMode} />
        </div>
      </div>

      <ConfirmDialog
        open={showCancel}
        title="Hủy thay đổi?"
        message="Các thay đổi chưa lưu sẽ bị mất."
        confirmLabel="Hủy"
        onConfirm={() => { const found = getById(numId); if (found) setForm(JSON.parse(JSON.stringify(found))); setEditMode(false); setShowCancel(false) }}
        onCancel={() => setShowCancel(false)}
      />

      {showTryRule && <TryRuleModal flow={form} onClose={() => setShowTryRule(false)} />}
    </PageLayout>
  )
}
