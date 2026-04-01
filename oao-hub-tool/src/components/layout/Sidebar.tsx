import { NavLink } from 'react-router-dom'

const NAV = [
  {
    group: 'Content Config',
    items: [
      {
        to: '/configurations',
        label: 'Partner Configuration',
        desc: 'Visual + Content (Trang 1-3)',
        icon: (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-2 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        ),
      },
    ],
  },
  {
    group: 'Decision Engine',
    items: [
      {
        to: '/decision-flows',
        label: 'Decision Tool',
        desc: 'Rule flows',
        icon: (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
        ),
      },
      {
        to: '/segment-bundles',
        label: 'Segment Bundle',
        desc: 'Rule packages',
        icon: (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        ),
      },
    ],
  },
  {
    group: 'Experiments',
    items: [
      {
        to: '/experiments',
        label: 'A/B Testing',
        desc: 'Experiments',
        icon: (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        ),
      },
    ],
  },
]

export function Sidebar() {
  return (
    <aside className="w-56 shrink-0 h-screen sticky top-0 border-r border-surface-200 bg-white flex flex-col">
      <div className="px-4 py-4 border-b border-surface-100">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary-600 flex items-center justify-center">
            <span className="text-white text-xs font-bold">OA</span>
          </div>
          <div>
            <p className="text-sm font-bold text-ink-900 leading-tight">OAO Hub</p>
            <p className="text-[10px] text-ink-400">Admin Tool</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-4">
        {NAV.map((group) => (
          <div key={group.group}>
            <p className="text-[10px] font-semibold text-ink-300 uppercase tracking-widest px-2 mb-1">
              {group.group}
            </p>
            <ul className="space-y-0.5">
              {group.items.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      `flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm transition-colors ${
                        isActive
                          ? 'bg-primary-50 text-primary-700 font-medium'
                          : 'text-ink-600 hover:bg-surface-100 hover:text-ink-900'
                      }`
                    }
                  >
                    <span className="shrink-0">{item.icon}</span>
                    <div className="min-w-0">
                      <p className="truncate leading-tight">{item.label}</p>
                      <p className="text-[10px] text-ink-400 truncate">{item.desc}</p>
                    </div>
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className="px-4 py-3 border-t border-surface-100">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center">
            <span className="text-primary-700 text-[10px] font-bold">A</span>
          </div>
          <span className="text-xs text-ink-500 truncate">admin@zalopay.vn</span>
        </div>
      </div>
    </aside>
  )
}
