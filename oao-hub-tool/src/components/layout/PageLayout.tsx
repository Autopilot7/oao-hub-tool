interface PageLayoutProps {
  title: string
  subtitle?: string
  actions?: React.ReactNode
  children: React.ReactNode
}

export function PageLayout({ title, subtitle, actions, children }: PageLayoutProps) {
  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <header className="bg-white border-b border-surface-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div>
          <h1 className="text-lg font-semibold text-ink-900 leading-tight">{title}</h1>
          {subtitle && <p className="text-xs text-ink-400 mt-0.5">{subtitle}</p>}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </header>
      <main className="flex-1 p-6 space-y-5">{children}</main>
    </div>
  )
}
