import { useState } from 'react'
import { PageLayout } from '../../components/layout/PageLayout'
import { mockAnalytics, SUMMARY, type ConfigMetric } from '../../mocks/analytics'

/* ── helpers ── */
const fmt = (n: number) =>
  n >= 1_000_000
    ? `${(n / 1_000_000).toFixed(1)}M`
    : n >= 1_000
      ? `${(n / 1_000).toFixed(1)}K`
      : String(n)

const COLORS: Record<string, string> = {
  'cfg-001': '#1d4ed8',
  'cfg-002': '#059669',
  'cfg-003': '#7c3aed',
}

/* ── KPI Card ── */
function KpiCard({ label, value, sub, accent }: { label: string; value: string; sub?: string; accent?: string }) {
  return (
    <div className="card">
      <div className="card-body">
        <p className="text-xs text-ink-400 font-medium">{label}</p>
        <p className={`text-2xl font-bold mt-1 ${accent ?? 'text-ink-900'}`}>{value}</p>
        {sub && <p className="text-xs text-ink-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  )
}

/* ── Horizontal Bar chart ── */
function BarChart({ data, metric }: { data: ConfigMetric[]; metric: 'impressions' | 'clicks' | 'conversions' }) {
  const max = Math.max(...data.map((d) => d[metric]))
  return (
    <div className="space-y-3">
      {data.map((d) => {
        const pct = max > 0 ? (d[metric] / max) * 100 : 0
        return (
          <div key={d.config_id} className="flex items-center gap-3">
            <div className="w-24 shrink-0">
              <p className="text-xs font-medium text-ink-700 truncate">{d.bank_name}</p>
              <p className="text-[10px] text-ink-400">{d.bank_code}</p>
            </div>
            <div className="flex-1 bg-surface-100 rounded-full h-5 overflow-hidden">
              <div
                className="h-full rounded-full flex items-center justify-end pr-2 transition-all duration-500"
                style={{ width: `${pct}%`, backgroundColor: COLORS[d.config_id] ?? '#64748b' }}
              >
                <span className="text-[9px] font-bold text-white/90">{fmt(d[metric])}</span>
              </div>
            </div>
            <span className="w-14 text-right text-xs font-mono text-ink-500 shrink-0">{fmt(d[metric])}</span>
          </div>
        )
      })}
    </div>
  )
}

/* ── Sparkline (7 ngày) ── */
function Sparkline({ daily, color }: { daily: ConfigMetric['daily']; metric?: string; color: string }) {
  const vals = daily.map((d) => d.impressions)
  const max = Math.max(...vals)
  const min = Math.min(...vals)
  const H = 32
  const W = 80
  const pts = vals.map((v, i) => {
    const x = (i / (vals.length - 1)) * W
    const y = max === min ? H / 2 : H - ((v - min) / (max - min)) * H
    return `${x},${y}`
  }).join(' ')
  return (
    <svg width={W} height={H} className="overflow-visible">
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={pts.split(' ').at(-1)!.split(',')[0]} cy={pts.split(' ').at(-1)!.split(',')[1]} r="2.5" fill={color} />
    </svg>
  )
}

/* ── Main page ── */
export function AnalyticsDashboard() {
  const [barMetric, setBarMetric] = useState<'impressions' | 'clicks' | 'conversions'>('impressions')
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const selected = selectedId ? mockAnalytics.find((m) => m.config_id === selectedId) : null

  return (
    <PageLayout
      title="Analytics Dashboard"
      subtitle="Hiệu suất từng Partner Configuration — 30 ngày gần nhất"
    >
      {/* KPI Summary */}
      <div className="grid grid-cols-4 gap-4">
        <KpiCard label="Total Impressions" value={fmt(SUMMARY.totalImpressions)} sub="Tổng lượt hiển thị" />
        <KpiCard label="Total Clicks" value={fmt(SUMMARY.totalClicks)} sub="Tổng lượt click" accent="text-primary-700" />
        <KpiCard label="Total Conversions" value={fmt(SUMMARY.totalConversions)} sub="Hoàn thành đăng ký" accent="text-green-700" />
        <KpiCard label="Avg CTR" value={`${SUMMARY.avgCtr}%`} sub="Click-through Rate TB" accent="text-purple-700" />
      </div>

      {/* Bar Chart */}
      <div className="card">
        <div className="card-header">
          <h2>So sánh hiệu suất theo Partner</h2>
          <div className="flex bg-surface-100 rounded-lg p-0.5 gap-0.5">
            {(['impressions', 'clicks', 'conversions'] as const).map((m) => (
              <button
                key={m}
                onClick={() => setBarMetric(m)}
                className={`text-xs px-2.5 py-1 rounded-md font-medium capitalize transition-colors ${
                  barMetric === m ? 'bg-white text-ink-900 shadow-sm' : 'text-ink-400 hover:text-ink-600'
                }`}
              >
                {m === 'impressions' ? 'Impressions' : m === 'clicks' ? 'Clicks' : 'Conversions'}
              </button>
            ))}
          </div>
        </div>
        <div className="card-body">
          <BarChart data={mockAnalytics} metric={barMetric} />
        </div>
      </div>

      {/* Per-config table */}
      <div className="card">
        <div className="card-header"><h2>Chi tiết từng Configuration</h2></div>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Partner</th>
                <th>Category</th>
                <th className="text-right">Impressions</th>
                <th className="text-right">Clicks</th>
                <th className="text-right">CTR</th>
                <th className="text-right">Conversions</th>
                <th className="text-right">CVR</th>
                <th className="text-right">Avg Time</th>
                <th>Trend (7d)</th>
              </tr>
            </thead>
            <tbody>
              {mockAnalytics.map((m) => (
                <tr
                  key={m.config_id}
                  className={`cursor-pointer ${selectedId === m.config_id ? 'bg-primary-50' : ''}`}
                  onClick={() => setSelectedId(selectedId === m.config_id ? null : m.config_id)}
                >
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: COLORS[m.config_id] ?? '#64748b' }} />
                      <div>
                        <p className="font-medium text-ink-900">{m.bank_name}</p>
                        <p className="text-[10px] text-ink-400 font-mono">{m.bank_code}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="text-xs bg-surface-100 text-ink-600 px-2 py-0.5 rounded-full">{m.category}</span>
                  </td>
                  <td className="text-right font-mono text-sm">{fmt(m.impressions)}</td>
                  <td className="text-right font-mono text-sm text-primary-700">{fmt(m.clicks)}</td>
                  <td className="text-right">
                    <span className={`text-sm font-semibold ${m.ctr >= 12 ? 'text-green-600' : m.ctr >= 10 ? 'text-yellow-600' : 'text-red-500'}`}>
                      {m.ctr}%
                    </span>
                  </td>
                  <td className="text-right font-mono text-sm text-green-700">{fmt(m.conversions)}</td>
                  <td className="text-right">
                    <span className={`text-sm font-semibold ${m.cvr >= 16 ? 'text-green-600' : 'text-ink-600'}`}>
                      {m.cvr}%
                    </span>
                  </td>
                  <td className="text-right text-sm text-ink-500">{m.avg_time_on_page}s</td>
                  <td>
                    <Sparkline daily={m.daily} color={COLORS[m.config_id] ?? '#64748b'} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Daily breakdown panel — expand khi click row */}
      {selected && (
        <div className="card border-l-4" style={{ borderLeftColor: COLORS[selected.config_id] ?? '#64748b' }}>
          <div className="card-header">
            <div>
              <h2>Daily Breakdown — {selected.bank_name}</h2>
              <p className="text-xs text-ink-400 mt-0.5">7 ngày gần nhất</p>
            </div>
            <button className="btn-ghost text-xs" onClick={() => setSelectedId(null)}>Đóng</button>
          </div>
          <div className="card-body">
            <div className="flex items-end gap-2 h-24">
              {selected.daily.map((d) => {
                const maxImp = Math.max(...selected.daily.map((x) => x.impressions))
                const pct = (d.impressions / maxImp) * 100
                return (
                  <div key={d.date} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-[8px] text-ink-400">{fmt(d.impressions)}</span>
                    <div className="w-full rounded-t-sm" style={{ height: `${pct * 0.6}px`, backgroundColor: COLORS[selected.config_id], opacity: 0.8 }} />
                    <span className="text-[8px] text-ink-400">{d.date}</span>
                  </div>
                )
              })}
            </div>
            <div className="mt-3 grid grid-cols-7 gap-2">
              {selected.daily.map((d) => (
                <div key={d.date} className="text-center">
                  <p className="text-[9px] text-ink-500">{fmt(d.clicks)} clicks</p>
                  <p className="text-[9px] text-ink-300">{((d.clicks / d.impressions) * 100).toFixed(1)}%</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  )
}
