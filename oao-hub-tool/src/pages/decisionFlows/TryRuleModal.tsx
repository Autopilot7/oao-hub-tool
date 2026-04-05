import { useState } from 'react'
import type { DecisionFlow, TryRuleInput } from '../../types'

interface TryRuleModalProps {
  flow: DecisionFlow
  onClose: () => void
}

// Simulate rule evaluation on frontend
function evaluateFlow(flow: DecisionFlow, input: TryRuleInput) {
  const breakdown = flow.rule_groups.map((rg) => {
    const condResults = rg.conditions.map((c) => ({
      fact: c.fact_name,
      operator: c.operator,
      value: Array.isArray(c.value) ? c.value.join(', ') : String(c.value),
      passed: c.enabled && (() => {
        if (c.fact_name === 'Platform' && c.operator === '=') return input.platform === c.value
        if (c.fact_name === 'Os' && c.operator === '=') return input.os === c.value
        if (c.fact_name === 'App version') return true
        return Math.random() > 0.35
      })(),
    }))

    const groupMatched =
      rg.logic === 'ALL'
        ? condResults.every((cr) => cr.passed)
        : condResults.some((cr) => cr.passed)

    return { rule_group_name: rg.name, matched: groupMatched, conditions: condResults, action: rg.actions[0]?.value ?? '' }
  })

  const firstMatch = breakdown.find((b) => b.matched)
  return { breakdown, matched: !!firstMatch, result_value: firstMatch?.action ?? 'No match — default response' }
}

export function TryRuleModal({ flow, onClose }: TryRuleModalProps) {
  const [input, setInput] = useState<TryRuleInput>({
    zalopayId: '',
    platform: 'ZPA',
    os: 'IOS',
    appVersion: '9.9.9',
    extraInfo: '{}',
  })
  const [result, setResult] = useState<ReturnType<typeof evaluateFlow> | null>(null)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = () => {
    if (!input.zalopayId) return
    const res = evaluateFlow(flow, input)
    setResult(res)
    setSubmitted(true)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="px-6 py-4 border-b border-surface-200 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-ink-900">Try Rule</h3>
            <p className="text-xs text-ink-400">Flow: <span className="font-mono">{flow.name}</span></p>
          </div>
          <button onClick={onClose} className="btn-ghost p-1">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Input form */}
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="form-label">ZaloPay ID * (bắt buộc)</label>
              <input className="form-input font-mono" value={input.zalopayId} onChange={(e) => setInput((s) => ({ ...s, zalopayId: e.target.value }))} placeholder="Nhập ZaloPay ID..." />
            </div>
            <div>
              <label className="form-label">Platform</label>
              <select className="form-select" value={input.platform} onChange={(e) => setInput((s) => ({ ...s, platform: e.target.value }))}>
                <option value="ZPA">ZPA</option>
                <option value="ZPI">ZPI</option>
              </select>
            </div>
            <div>
              <label className="form-label">OS</label>
              <select className="form-select" value={input.os} onChange={(e) => setInput((s) => ({ ...s, os: e.target.value }))}>
                <option value="IOS">IOS</option>
                <option value="ANDROID">ANDROID</option>
              </select>
            </div>
            <div>
              <label className="form-label">App Version</label>
              <input className="form-input font-mono text-xs" value={input.appVersion} onChange={(e) => setInput((s) => ({ ...s, appVersion: e.target.value }))} />
            </div>
            <div>
              <label className="form-label">Extra Info (JSON)</label>
              <input className="form-input font-mono text-xs" value={input.extraInfo} onChange={(e) => setInput((s) => ({ ...s, extraInfo: e.target.value }))} />
            </div>
          </div>

          <button className="btn-primary w-full justify-center" onClick={handleSubmit} disabled={!input.zalopayId}>
            Submit — Evaluate Rule
          </button>

          {/* Results */}
          {submitted && result && (
            <div className="space-y-4">
              <div className={`p-4 rounded-xl border-2 ${result.matched ? 'bg-green-50 border-green-200' : 'bg-surface-50 border-surface-200'}`}>
                <p className="text-xs font-medium text-ink-500 mb-1">Kết quả evaluate</p>
                <p className={`text-lg font-bold ${result.matched ? 'text-green-700' : 'text-ink-500'}`}>{result.result_value}</p>
                <p className="text-xs text-ink-400 mt-1">ZaloPay ID: <span className="font-mono">{input.zalopayId}</span></p>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-semibold text-ink-700">Breakdown từng Rule Group</p>
                {result.breakdown.map((b, i) => (
                  <div key={i} className={`border rounded-lg overflow-hidden ${b.matched ? 'border-green-200' : 'border-surface-200'}`}>
                    <div className={`flex items-center justify-between px-3 py-2 ${b.matched ? 'bg-green-50' : 'bg-surface-50'}`}>
                      <p className="text-sm font-medium text-ink-900">{b.rule_group_name}</p>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${b.matched ? 'bg-green-100 text-green-700' : 'bg-surface-200 text-ink-500'}`}>
                        {b.matched ? `MATCHED → ${b.action}` : 'NOT MATCHED'}
                      </span>
                    </div>
                    <div className="p-3 space-y-1">
                      {b.conditions.map((c, ci) => (
                        <div key={ci} className="flex items-center gap-2 text-xs">
                          <span className={`w-4 h-4 rounded-full flex items-center justify-center ${c.passed ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                            {c.passed ? '✓' : '✗'}
                          </span>
                          <span className="text-ink-600 font-medium">{c.fact}</span>
                          <span className="text-ink-400">{c.operator}</span>
                          <span className="font-mono text-ink-700">{c.value || '(empty)'}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
