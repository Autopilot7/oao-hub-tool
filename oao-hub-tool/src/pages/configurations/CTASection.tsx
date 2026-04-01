import { useState } from 'react'
import type { CTAObject, CTAAction, CTAName } from '../../types'

const CTA_NAMES: CTAName[] = ['CONFIRM_CONDITION', 'NOT_ELIGIBLE', 'MAINTENANCE', 'DEEPLINK', 'ERROR_PAGE']
const ACTIONS: CTAAction[] = ['CONFIRM_CONDITION', 'DEEPLINK', 'COPY', 'OPEN_KYC_FLOW', 'NFC', 'UPDATE_NFC', 'ADJUST_KYC_NFC', 'KYC_NFC', 'ERROR_PAGE']

interface CTASectionProps {
  ctaList: CTAObject[]
  onChange: (list: CTAObject[]) => void
  editMode: boolean
}

export function CTASection({ ctaList, onChange, editMode }: CTASectionProps) {
  const [activeTab, setActiveTab] = useState(0)

  const usedNames = ctaList.map((c) => c.cta_name)
  const availableNames = (idx: number) =>
    CTA_NAMES.filter((n) => !usedNames.includes(n) || ctaList[idx]?.cta_name === n)

  const update = (idx: number, patch: Partial<CTAObject>) => {
    const next = ctaList.map((c, i) => (i === idx ? { ...c, ...patch } : c))
    onChange(next)
  }

  const add = () => {
    const unused = CTA_NAMES.find((n) => !usedNames.includes(n))
    if (!unused) return
    const newCTA: CTAObject = {
      id: `cta-${Date.now()}`,
      cta_name: unused,
      button_name: '',
      action: 'CONFIRM_CONDITION',
      description: '',
      zpa_link: '',
      zpi_link: '',
      extra_info: '{}',
    }
    onChange([...ctaList, newCTA])
    setActiveTab(ctaList.length)
  }

  const remove = (idx: number) => {
    const next = ctaList.filter((_, i) => i !== idx)
    onChange(next)
    setActiveTab(Math.max(0, activeTab - 1))
  }

  const active = ctaList[activeTab]

  return (
    <div className="space-y-3">
      {/* Tab bar */}
      <div className="flex items-center gap-1 border-b border-surface-200 pb-0">
        {ctaList.map((cta, i) => (
          <button
            key={cta.id}
            type="button"
            onClick={() => setActiveTab(i)}
            className={`px-3 py-2 text-xs font-medium border-b-2 -mb-px transition-colors ${
              i === activeTab
                ? 'border-primary-600 text-primary-700'
                : 'border-transparent text-ink-500 hover:text-ink-700'
            }`}
          >
            {cta.cta_name}
          </button>
        ))}
        {editMode && usedNames.length < CTA_NAMES.length && (
          <button type="button" onClick={add} className="px-3 py-2 text-xs text-primary-600 hover:text-primary-700 font-medium">
            + Add CTA
          </button>
        )}
      </div>

      {/* Active CTA form */}
      {active && (
        <div className="space-y-4 pt-1">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">CTA Name (Type) *</label>
              <select
                className="form-select"
                value={active.cta_name}
                onChange={(e) => update(activeTab, { cta_name: e.target.value as CTAName })}
                disabled={!editMode}
              >
                {availableNames(activeTab).map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="form-label">Button Name * (max 15 ký tự)</label>
              <input
                className="form-input"
                maxLength={15}
                value={active.button_name}
                onChange={(e) => update(activeTab, { button_name: e.target.value })}
                disabled={!editMode}
                placeholder="VD: Mở ngay"
              />
              <p className="char-count">{active.button_name.length}/15</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Action *</label>
              <select
                className="form-select"
                value={active.action}
                onChange={(e) => update(activeTab, { action: e.target.value as CTAAction })}
                disabled={!editMode}
              >
                {ACTIONS.map((a) => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
            <div>
              <label className="form-label">Description (nội bộ, không hiển thị ra app)</label>
              <input
                className="form-input"
                value={active.description ?? ''}
                onChange={(e) => update(activeTab, { description: e.target.value })}
                disabled={!editMode}
                placeholder="Ghi chú nội bộ..."
              />
            </div>
          </div>

          {active.action === 'DEEPLINK' && (
            <div className="grid grid-cols-2 gap-4 p-3 bg-blue-50 rounded-lg">
              <div>
                <label className="form-label">ZPA Link * (bắt buộc khi Action = DEEPLINK)</label>
                <input
                  className="form-input"
                  value={active.zpa_link ?? ''}
                  onChange={(e) => update(activeTab, { zpa_link: e.target.value })}
                  disabled={!editMode}
                  placeholder="https://..."
                  type="url"
                />
              </div>
              <div>
                <label className="form-label">ZPI Link (Zalo mini app, optional)</label>
                <input
                  className="form-input"
                  value={active.zpi_link ?? ''}
                  onChange={(e) => update(activeTab, { zpi_link: e.target.value })}
                  disabled={!editMode}
                  placeholder="https://..."
                  type="url"
                />
              </div>
            </div>
          )}

          {active.action !== 'ERROR_PAGE' && active.action !== 'DEEPLINK' && (
            <div>
              <label className="form-label">Extra Info (JSON object, optional)</label>
              <textarea
                className="form-textarea font-mono text-xs"
                rows={3}
                value={active.extra_info ?? '{}'}
                onChange={(e) => update(activeTab, { extra_info: e.target.value })}
                disabled={!editMode}
                placeholder="{}"
              />
              {(() => {
                try { JSON.parse(active.extra_info ?? '{}'); return <p className="text-xs text-green-600 mt-0.5">Valid JSON</p> }
                catch { return <p className="text-xs text-red-500 mt-0.5">Invalid JSON</p> }
              })()}
            </div>
          )}

          {editMode && ctaList.length > 1 && (
            <button type="button" className="btn text-red-500 hover:bg-red-50 text-xs" onClick={() => remove(activeTab)}>
              Xóa CTA này
            </button>
          )}
        </div>
      )}
    </div>
  )
}
