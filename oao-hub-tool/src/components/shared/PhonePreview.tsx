import { useState } from 'react'
import type { MainConfiguration } from '../../types'

interface PhonePreviewProps {
  config: MainConfiguration
}

/* ── Tiny inline HTML renderer (safe for our own rich text) ── */
function RichContent({ html, className }: { html: string; className?: string }) {
  return (
    <div
      className={`prose prose-xs max-w-none text-[11px] leading-snug ${className ?? ''}`}
      dangerouslySetInnerHTML={{ __html: html || '<span style="color:#94a3b8">Chưa có nội dung...</span>' }}
    />
  )
}

/* ── Placeholder image ── */
function ImgPlaceholder({ src, alt, className }: { src: string; alt?: string; className?: string }) {
  if (src) {
    return <img src={src} alt={alt ?? ''} className={`object-cover ${className ?? ''}`} onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/300x120/e2e8f0/94a3b8?text=Image' }} />
  }
  return (
    <div className={`bg-surface-100 flex items-center justify-center text-ink-300 text-[9px] font-medium ${className ?? ''}`}>
      No image
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   Tab 1: Card View — mô phỏng cách card hiển thị trong list OAO
   ═══════════════════════════════════════════════════════════════ */
function CardView({ config }: { config: MainConfiguration }) {
  const card = config.base_card
  const hero = config.hero_banner
  const explored = config.explored_card

  const cardBg = card.bg_transparent
    ? 'transparent'
    : card.bg_image_url
      ? undefined
      : card.bg_color || '#1d4ed8'

  return (
    <div className="flex flex-col h-full">
      {/* Freeze Banner — sticky ở TOP (đúng với UX thực tế) */}
      {config.freeze_banner.enabled && (
        <div className="shrink-0 flex items-center gap-2 bg-white px-3 py-2 border-b border-surface-100 shadow-sm">
          <div className="w-7 h-7 rounded-lg bg-surface-100 shrink-0 overflow-hidden">
            <ImgPlaceholder src={hero.image_url} alt="" className="w-full h-full" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-semibold text-ink-900 truncate">{config.freeze_banner.title || '—'}</p>
            <p className="text-[9px] text-ink-400 truncate">{config.freeze_banner.subtitle}</p>
          </div>
          <div className="shrink-0 flex flex-col items-center gap-0.5">
            <svg className="w-3 h-3 text-ink-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
            <span className="text-[7px] text-ink-300">sticky</span>
          </div>
        </div>
      )}

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto overscroll-contain">
      <div className="px-3 py-3 space-y-3">

      {/* Hero Banner */}
      {hero.enabled && (
        <div className="rounded-xl overflow-hidden">
          <ImgPlaceholder src={hero.image_url} alt="hero" className="w-full h-[90px]" />
          {(hero.title || hero.subtitle) && (
            <div className="bg-white px-3 py-1.5">
              {hero.title && <p className="text-[11px] font-semibold text-ink-900 leading-tight">{hero.title}</p>}
              {hero.subtitle && <p className="text-[9px] text-ink-500 mt-0.5 leading-tight">{hero.subtitle}</p>}
            </div>
          )}
        </div>
      )}

      {/* Base Card */}
      <div
        className="rounded-2xl overflow-hidden relative shadow-md"
        style={{
          backgroundColor: cardBg,
          backgroundImage: card.bg_image_url ? `url(${card.bg_image_url})` : undefined,
          backgroundSize: 'cover',
        }}
      >
        {/* Top right shape decoration */}
        {card.top_right_shape_url && (
          <img src={card.top_right_shape_url} alt="" className="absolute top-0 right-0 w-16 h-16 object-contain opacity-60" />
        )}

        <div className="px-3 pt-3 pb-2 relative z-10">
          {/* Logos row */}
          <div className="flex items-center justify-between mb-2">
            {card.logo_left_url
              ? <img src={card.logo_left_url} alt="logo" className="h-5 object-contain max-w-[80px]" />
              : <span className="text-[9px] font-bold" style={{ color: card.title_color || '#fff' }}>{config.bank_code}</span>
            }
            {card.logo_right_url && (
              <img src={card.logo_right_url} alt="watermark" className="h-4 object-contain opacity-40 max-w-[48px]" />
            )}
          </div>

          {/* Card title */}
          {card.title && (
            <p className="text-[13px] font-bold leading-tight" style={{ color: card.title_color || '#fff' }}>
              {card.title}
            </p>
          )}
          {card.subtitle && (
            <p className="text-[9px] mt-0.5 leading-tight" style={{ color: card.subtitle_color || '#e2e8f0' }}>
              {card.subtitle}
            </p>
          )}
        </div>

        {/* Extra title badge */}
        {config.extra_title && (
          <div className="px-3 pb-2 relative z-10">
            <span
              className="text-[9px] font-semibold bg-white/20 text-white px-1.5 py-0.5 rounded-full"
              dangerouslySetInnerHTML={{ __html: config.extra_title }}
            />
          </div>
        )}

        {/* Explored card section */}
        {explored.enabled && (
          <div className="mx-3 mb-3 rounded-xl bg-white/10 backdrop-blur-sm p-2 relative z-10">
            {explored.badge && (
              <span className="text-[9px] font-semibold text-yellow-300">
                {explored.badge}
              </span>
            )}
            <RichContent
              html={explored.description}
              className="mt-1 [&_ul]:pl-3 [&_li]:text-[9px] [&_li]:leading-tight"
            />
          </div>
        )}
      </div>

      </div>
      </div>{/* end scrollable */}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   Tab 2: Detail Block — mô phỏng Trang 2 (quyền lợi + điều kiện)
   ═══════════════════════════════════════════════════════════════ */
function DetailView({ config }: { config: MainConfiguration }) {
  const block = config.detail_block

  if (!block.enabled) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center px-6 space-y-2">
        <div className="w-10 h-10 rounded-full bg-surface-100 flex items-center justify-center">
          <svg className="w-5 h-5 text-ink-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
          </svg>
        </div>
        <p className="text-[10px] text-ink-400 font-medium">Trang 2 đang tắt</p>
        <p className="text-[9px] text-ink-300">Flow sẽ bỏ qua trang này<br />và chuyển thẳng sang Trang 3</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto overscroll-contain">
        <div className="space-y-0">

          {/* Top image — full bleed */}
          {block.top_image_url ? (
            <img
              src={block.top_image_url}
              alt="detail"
              className="w-full object-cover"
              style={{ maxHeight: 130 }}
              onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/400x130/e2e8f0/94a3b8?text=Detail+Image' }}
            />
          ) : (
            <div className="w-full h-[90px] bg-surface-100 flex items-center justify-center">
              <span className="text-[9px] text-ink-300">Top Image chưa nhập</span>
            </div>
          )}

          <div className="px-3 py-3 space-y-3">
            {/* Content Primary */}
            {block.content_primary ? (
              <div className="bg-white rounded-xl p-3 shadow-sm border border-surface-50">
                <RichContent
                  html={block.content_primary}
                  className="[&_h2]:text-[12px] [&_h2]:font-bold [&_h2]:text-ink-900 [&_h2]:mb-1.5 [&_h2]:mt-2 first:[&_h2]:mt-0 [&_ul]:pl-3 [&_li]:text-[10px] [&_li]:leading-snug [&_li]:text-ink-700 [&_li]:mb-0.5 [&_h3]:text-[11px] [&_h3]:font-semibold [&_h3]:text-ink-800"
                />
              </div>
            ) : (
              <div className="bg-white rounded-xl p-3 border border-dashed border-surface-200">
                <span className="text-[9px] text-ink-300">Content Primary chưa nhập...</span>
              </div>
            )}

            {/* Content Secondary */}
            {block.content_secondary && (
              <div className="bg-white rounded-xl p-3 shadow-sm border border-surface-50">
                <RichContent
                  html={block.content_secondary}
                  className="[&_h2]:text-[12px] [&_h2]:font-bold [&_h2]:text-ink-900 [&_h2]:mb-1.5 [&_h2]:mt-2 first:[&_h2]:mt-0 [&_ul]:pl-3 [&_li]:text-[10px] [&_li]:leading-snug [&_li]:text-ink-600 [&_li]:mb-0.5"
                />
              </div>
            )}

            {/* Bottom padding for CTA */}
            <div className="h-12" />
          </div>
        </div>
      </div>

      {/* CTA sticky bottom */}
      {config.cta_list.length > 0 && (
        <div className="shrink-0 px-3 py-2 bg-white border-t border-surface-100 shadow-[0_-4px_12px_rgba(0,0,0,0.06)]">
          {config.cta_list.slice(0, 1).map((cta) => (
            <button
              key={cta.id}
              className="w-full py-2.5 rounded-2xl text-[12px] font-bold text-white shadow-md"
              style={{ backgroundColor: config.base_card.bg_color || '#1d4ed8' }}
            >
              {cta.button_name || 'Mở ngay'}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   Tab 3: Landing Page — mô phỏng Trang 3 (partner content)
   ═══════════════════════════════════════════════════════════════ */
function LandingView({ config }: { config: MainConfiguration }) {
  return (
    <div className="flex flex-col h-full">
      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto overscroll-contain">
        <div className="px-3 pt-3 pb-2 space-y-3">

          {/* Header logo */}
          <div className="flex justify-center">
            {config.header_image_url
              ? <img src={config.header_image_url} alt="header" className="h-10 object-contain max-w-[140px]" onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/140x40/e2e8f0/94a3b8?text=LOGO' }} />
              : <div className="h-10 w-28 bg-surface-100 rounded-lg flex items-center justify-center text-[9px] text-ink-300">Logo</div>
            }
          </div>

          {/* Header title */}
          <h2 className="text-[14px] font-bold text-ink-900 text-center leading-snug">
            {config.header_title || <span className="text-ink-300">Tiêu đề chưa nhập...</span>}
          </h2>

          {/* Main content */}
          <div className="bg-white rounded-xl p-3 shadow-sm border border-surface-50">
            <RichContent
              html={config.main_content}
              className="[&_h2]:text-[12px] [&_h2]:font-bold [&_h2]:text-ink-900 [&_h2]:mb-1 [&_ul]:pl-3 [&_li]:text-[10px] [&_li]:leading-snug [&_li]:text-ink-700 [&_li]:mb-0.5"
            />
          </div>

          {/* Guidances */}
          {config.guidances.length > 0 && (
            <div>
              <div className="grid grid-cols-2 gap-2">
                {config.guidances.map((g) => (
                  <div key={g.id} className="space-y-1">
                    <p className="text-[10px] font-bold text-ink-900">Bước {g.order}</p>
                    <p className="text-[9px] text-ink-500 leading-tight">{g.content || '—'}</p>
                    <div className="rounded-lg overflow-hidden">
                      <ImgPlaceholder src={g.image_url} alt={`step ${g.order}`} className="w-full h-[72px]" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sub content links */}
          {config.sub_content_list.length > 0 && (
            <div className="space-y-1.5">
              {config.sub_content_list.map((sc) => (
                <div key={sc.id} className="flex items-center gap-1.5 text-[10px] text-blue-600 underline">
                  <svg className="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  {sc.label || sc.zpa_link}
                </div>
              ))}
            </div>
          )}

          {/* Padding for CTA */}
          <div className="h-14" />
        </div>
      </div>

      {/* CTA sticky bottom */}
      {config.cta_list.length > 0 && (
        <div className="shrink-0 px-3 py-2 bg-white border-t border-surface-100 shadow-[0_-4px_12px_rgba(0,0,0,0.06)]">
          {config.cta_list.slice(0, 1).map((cta) => (
            <button
              key={cta.id}
              className="w-full py-2.5 rounded-2xl text-[12px] font-bold text-white shadow-md"
              style={{ backgroundColor: config.base_card.bg_color || '#1d4ed8' }}
            >
              {cta.button_name || 'Mở ngay'}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   Phone frame wrapper
   ═══════════════════════════════════════════════════════════════ */
const TAB_LABELS: Record<string, string> = {
  card: 'Trang 1',
  detail: 'Trang 2',
  landing: 'Trang 3',
}

export function PhonePreview({ config }: PhonePreviewProps) {
  const [tab, setTab] = useState<'card' | 'detail' | 'landing'>('card')

  return (
    <div className="flex flex-col items-center gap-3 select-none">
      {/* Tab switcher */}
      <div className="flex bg-surface-100 rounded-lg p-0.5 gap-0.5">
        {(['card', 'detail', 'landing'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`text-xs px-2.5 py-1 rounded-md font-medium transition-colors ${
              tab === t
                ? 'bg-white text-ink-900 shadow-sm'
                : 'text-ink-400 hover:text-ink-600'
            }`}
          >
            {TAB_LABELS[t]}
          </button>
        ))}
      </div>

      {/* Phone frame */}
      <div
        className="relative rounded-[36px] shadow-2xl overflow-hidden"
        style={{
          width: 235,
          height: 500,
          background: '#111',
          border: '6px solid #1a1a1a',
          boxShadow: '0 0 0 1px #333, 0 20px 60px rgba(0,0,0,0.4)',
        }}
      >
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-5 bg-[#111] rounded-b-2xl z-20 flex items-center justify-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-[#333]" />
          <div className="w-2.5 h-1 rounded-full bg-[#2a2a2a]" />
        </div>

        {/* Status bar */}
        <div className="absolute top-0 left-0 right-0 h-5 flex items-center justify-between px-5 pt-0.5 z-10">
          <span className="text-[8px] text-white font-semibold">23:44</span>
          <div className="flex items-center gap-0.5">
            <div className="flex gap-px items-end h-2.5">
              {[2, 3, 4, 4].map((h, i) => (
                <div key={i} className="w-1 rounded-sm bg-white/80" style={{ height: h * 2 }} />
              ))}
            </div>
            <svg className="w-3 h-3 text-white/80 mx-0.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M1.5 8.5a13 13 0 0121 0M5 12a10 10 0 0114 0M8.5 15.5a6 6 0 017 0M12 19h.01" stroke="currentColor" strokeWidth={2} strokeLinecap="round" fill="none" />
            </svg>
            <svg className="w-3.5 h-2.5 text-white/80" viewBox="0 0 24 10" fill="none">
              <rect x="0.5" y="0.5" width="19" height="9" rx="2.5" stroke="currentColor" strokeWidth="1.2" />
              <rect x="2" y="2" width="15" height="6" rx="1" fill="currentColor" opacity="0.8" />
              <path d="M21 3.5v3a1.5 1.5 0 000-3z" fill="currentColor" opacity="0.5" />
            </svg>
          </div>
        </div>

        {/* Screen background */}
        <div className="absolute inset-0 bg-[#f5f7fa]" />

        {/* Top nav bar */}
        <div className="absolute top-5 left-0 right-0 h-9 flex items-center justify-between px-3 z-10 bg-white/80 backdrop-blur-sm border-b border-surface-100/60">
          <button className="w-5 h-5 text-ink-400">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
          </button>
          <span className="text-[10px] font-semibold text-ink-700 truncate max-w-[120px]">
            {tab === 'card'
              ? config.name || 'OAO Hub'
              : tab === 'detail'
                ? 'Chi tiết sản phẩm'
                : config.header_title || config.name || 'Chi tiết'}
          </span>
          <button className="w-5 h-5 text-ink-400">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Content area */}
        <div className="absolute top-14 left-0 right-0 bottom-0 overflow-hidden bg-[#f5f7fa]">
          {tab === 'card' && <div className="h-full overflow-y-auto overscroll-contain"><CardView config={config} /></div>}
          {tab === 'detail' && <DetailView config={config} />}
          {tab === 'landing' && <LandingView config={config} />}
        </div>
      </div>

    </div>
  )
}
