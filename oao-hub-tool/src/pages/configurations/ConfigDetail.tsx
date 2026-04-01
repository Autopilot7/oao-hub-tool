import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useConfigStore } from '../../stores/useConfigStore'
import { PageLayout } from '../../components/layout/PageLayout'
import { Toggle } from '../../components/shared/Toggle'
import { ColorPicker } from '../../components/shared/ColorPicker'
import { ImageUpload } from '../../components/shared/ImageUpload'
import { RichTextEditor } from '../../components/shared/RichTextEditor'
import { ConfirmDialog } from '../../components/shared/ConfirmDialog'
import { Badge } from '../../components/shared/Badge'
import { CTASection } from './CTASection'
import { PhonePreview } from '../../components/shared/PhonePreview'
import type { MainConfiguration, Category, ConfigStatus, SubContentObject, GuidanceObject } from '../../types'

const EMPTY_CONFIG: MainConfiguration = {
  id: '',
  bank_code: '',
  name: '',
  status: 'DRAFT',
  category: 'bank_account',
  extra_title: '',
  hero_banner: { enabled: true, title: '', subtitle: '', image_url: '' },
  freeze_banner: { enabled: true, title: '', subtitle: '' },
  base_card: { enabled: true, title: '', subtitle: '', title_color: '#ffffff', subtitle_color: '#e2e8f0', content_color: '#cbd5e1', bg_color: '#1d4ed8', bg_transparent: false, bg_image_url: '', logo_left_url: '', logo_right_url: '', top_right_shape_url: '' },
  explored_card: { enabled: true, badge: '', description: '' },
  detail_block: { enabled: true, top_image_url: '', content_primary: '', content_secondary: '' },
  cta_list: [{ id: `cta-${Date.now()}`, cta_name: 'CONFIRM_CONDITION', button_name: '', action: 'CONFIRM_CONDITION', description: '', zpa_link: '', zpi_link: '', extra_info: '{}' }],
  created_by: 'admin@zalopay.vn',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  version: 1,
  // Partner content fields
  description: '',
  header_title: '',
  header_image_url: '',
  main_content: '',
  sub_content_list: [],
  guidances: [],
}

export function ConfigDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getById, save, add } = useConfigStore()
  const isNew = id === 'new'

  const [form, setForm] = useState<MainConfiguration>(EMPTY_CONFIG)
  const [editMode, setEditMode] = useState(isNew)
  const [showCancel, setShowCancel] = useState(false)
  const [showImport, setShowImport] = useState(false)
  const [importJson, setImportJson] = useState('')
  const [importError, setImportError] = useState('')
  const [toast, setToast] = useState('')

  useEffect(() => {
    if (!isNew) {
      const found = getById(id!)
      if (found) setForm(JSON.parse(JSON.stringify(found)))
      else navigate('/configurations')
    }
  }, [id])

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 2500)
  }

  const patch = <K extends keyof MainConfiguration>(key: K, value: MainConfiguration[K]) =>
    setForm((f) => ({ ...f, [key]: value }))

  const handleSave = () => {
    // Validation §9.1
    if (!form.name) { showToast('Name bắt buộc'); return }
    if (!form.bank_code) { showToast('Bank Code bắt buộc'); return }
    if (form.cta_list.length === 0) { showToast('Phải có ít nhất 1 CTA'); return }

    // Hero Banner validation §2.3.1
    if (form.hero_banner.enabled) {
      if (!form.hero_banner.title) { showToast('Hero Banner: Title bắt buộc khi bật'); return }
      if (!form.hero_banner.image_url) { showToast('Hero Banner: Image bắt buộc khi bật'); return }
    }

    // Freeze Banner validation §2.3.2
    if (form.freeze_banner.enabled && !form.freeze_banner.title) {
      showToast('Freeze Banner: Title bắt buộc khi bật'); return
    }

    // Background Card validation §9.1: phải có ít nhất 1 trong 2
    if (!form.base_card.bg_transparent && !form.base_card.bg_color && !form.base_card.bg_image_url) {
      showToast('Base Card: Phải có Background Color hoặc Background Image'); return
    }

    // CTA validation: DEEPLINK phải có ZPA Link
    for (const cta of form.cta_list) {
      if (cta.action === 'DEEPLINK' && !cta.zpa_link) {
        showToast(`CTA "${cta.cta_name}": ZPA Link bắt buộc khi Action = DEEPLINK`); return
      }
    }

    // Content section: validate khi status ACTIVE
    if (form.status === 'ACTIVE') {
      if (!form.header_image_url) { showToast('Content: Header Image bắt buộc khi ACTIVE'); return }
      for (let i = 0; i < form.guidances.length; i++) {
        const g = form.guidances[i]
        if (!g.content) { showToast(`Guidance #${i + 1}: Caption bắt buộc`); return }
        if (!g.image_url) { showToast(`Guidance #${i + 1}: Image bắt buộc`); return }
      }
      for (let i = 0; i < form.sub_content_list.length; i++) {
        const sc = form.sub_content_list[i]
        if (!sc.label) { showToast(`Sub Content #${i + 1}: Label bắt buộc`); return }
        if (!sc.zpa_link) { showToast(`Sub Content #${i + 1}: ZPA Link bắt buộc`); return }
      }
    }

    if (isNew) {
      const newId = `cfg-${Date.now()}`
      add({ ...form, id: newId })
      navigate(`/configurations/${newId}`)
    } else {
      save(form)
    }
    setEditMode(false)
    showToast('Đã lưu thành công')
  }

  // Sub Content helpers
  const addSubContent = () => {
    const item: SubContentObject = { id: `sc-${Date.now()}`, label: '', zpa_link: '', zpi_link: '' }
    patch('sub_content_list', [...form.sub_content_list, item])
  }
  const updateSubContent = (idx: number, p: Partial<SubContentObject>) =>
    patch('sub_content_list', form.sub_content_list.map((s, i) => i === idx ? { ...s, ...p } : s))
  const removeSubContent = (idx: number) =>
    patch('sub_content_list', form.sub_content_list.filter((_, i) => i !== idx))

  // Guidance helpers
  const addGuidance = () => {
    const item: GuidanceObject = { id: `g-${Date.now()}`, content: '', image_url: '', order: form.guidances.length + 1 }
    patch('guidances', [...form.guidances, item])
  }
  const updateGuidance = (idx: number, p: Partial<GuidanceObject>) =>
    patch('guidances', form.guidances.map((g, i) => i === idx ? { ...g, ...p } : g))
  const removeGuidance = (idx: number) =>
    patch('guidances', form.guidances.filter((_, i) => i !== idx).map((g, i) => ({ ...g, order: i + 1 })))

  const handleExport = () => {
    const json = JSON.stringify({ ...form, version: form.version }, null, 2)
    navigator.clipboard.writeText(json)
    showToast('Đã copy JSON vào clipboard')
  }

  const handleImport = () => {
    try {
      const parsed = JSON.parse(importJson)
      // PRD §2.1: chỉ block nếu thiếu field 'version' (schema detection)
      // KHÔNG block nếu version số khác nhau — đó là dùng để clone sang partner mới
      if (!('version' in parsed)) {
        setImportError('JSON phải có field "version"')
        return
      }
      // Giữ lại id, created_by, created_at của record hiện tại, override phần còn lại
      setForm((f) => ({ ...f, ...parsed, id: f.id, created_by: f.created_by, created_at: f.created_at }))
      setShowImport(false)
      setImportJson('')
      setImportError('')
      showToast('Import thành công — Nhớ bấm Save để lưu')
    } catch {
      setImportError('JSON không hợp lệ (parse error)')
    }
  }

  return (
    <PageLayout
      title={isNew ? 'Tạo Configuration mới' : form.name}
      subtitle={isNew ? 'Partner Configuration' : `Bank Code: ${form.bank_code} · v${form.version}`}
      actions={
        <div className="flex items-center gap-2">
          {!isNew && <Badge status={form.status} />}
          {/* Export: hiện ở CẢ view mode VÀ edit mode theo PRD §2.1 */}
          {!isNew && (
            <button className="btn-secondary text-xs" onClick={handleExport}>Export</button>
          )}
          {/* Import: chỉ hiện khi edit mode */}
          {editMode && !isNew && (
            <button className="btn-secondary text-xs" onClick={() => setShowImport(true)}>Import</button>
          )}
          <button className="btn-secondary text-xs" onClick={() => showToast('Cache đã reload')}>Reload Cache</button>
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
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-ink-900 text-white text-sm px-4 py-2 rounded-lg shadow-lg">{toast}</div>
      )}

      {/* Split layout: form (left) + phone preview (right sticky) */}
      <div className="flex gap-6 items-start">
      {/* ─── Form column ─── */}
      <div className="flex-1 min-w-0 space-y-6">

      {/* ① Basic Information */}
      <div className="card">
        <div className="card-header"><h2>① Basic Information</h2></div>
        <div className="card-body grid grid-cols-2 gap-4">
          <div>
            <label className="form-label">Name * (max 41 ký tự)</label>
            <input className="form-input" maxLength={41} value={form.name} onChange={(e) => patch('name', e.target.value)} disabled={!editMode} placeholder="VD: Cathay United Bank" />
            <p className="char-count">{form.name.length}/41</p>
          </div>
          <div>
            <label className="form-label">Bank Code *</label>
            <input className="form-input font-mono" value={form.bank_code} onChange={(e) => patch('bank_code', e.target.value.toUpperCase())} disabled={!editMode} placeholder="VD: CATHAY" />
          </div>
          <div>
            <label className="form-label">Status *</label>
            <select className="form-select" value={form.status} onChange={(e) => patch('status', e.target.value as ConfigStatus)} disabled={!editMode}>
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
              <option value="DRAFT">DRAFT</option>
            </select>
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
            <label className="form-label">Extra Title (badge đặc biệt, optional)</label>
            <input className="form-input" value={form.extra_title} onChange={(e) => patch('extra_title', e.target.value)} disabled={!editMode} placeholder="VD: Ưu đãi mở tài khoản" />
          </div>
        </div>
      </div>

      {/* ② Banner */}
      <div className="card">
        <div className="card-header"><h2>② Banner</h2></div>
        <div className="card-body space-y-6">
          {/* Hero Banner */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <h3>Hero Banner</h3>
              <Toggle value={form.hero_banner.enabled} onChange={(v) => patch('hero_banner', { ...form.hero_banner, enabled: v })} disabled={!editMode} />
              <span className="text-xs text-ink-400">{form.hero_banner.enabled ? 'Bật' : 'Tắt'}</span>
            </div>
            {form.hero_banner.enabled && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Title * (max 34 ký tự)</label>
                  <input className="form-input" maxLength={34} value={form.hero_banner.title} onChange={(e) => patch('hero_banner', { ...form.hero_banner, title: e.target.value })} disabled={!editMode} />
                  <p className="char-count">{form.hero_banner.title.length}/34</p>
                </div>
                <div>
                  <label className="form-label">Subtitle (max 70 ký tự)</label>
                  <input className="form-input" maxLength={70} value={form.hero_banner.subtitle} onChange={(e) => patch('hero_banner', { ...form.hero_banner, subtitle: e.target.value })} disabled={!editMode} />
                  <p className="char-count">{form.hero_banner.subtitle.length}/70</p>
                </div>
                <div className="col-span-2">
                  <ImageUpload label="Banner Image *" value={form.hero_banner.image_url} onChange={(url) => patch('hero_banner', { ...form.hero_banner, image_url: url })} disabled={!editMode} />
                </div>
              </div>
            )}
          </div>

          <div className="section-divider" />

          {/* Freeze Banner */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <h3>Freeze Banner</h3>
              <Toggle value={form.freeze_banner.enabled} onChange={(v) => patch('freeze_banner', { ...form.freeze_banner, enabled: v })} disabled={!editMode} />
              <span className="text-xs text-ink-400">{form.freeze_banner.enabled ? 'Bật' : 'Tắt'}</span>
            </div>
            <p className="text-xs text-ink-400 mb-3">Thanh nhỏ cố định đầu màn hình khi user scroll. Thumbnail lấy tự động từ Hero Banner.</p>
            {form.freeze_banner.enabled && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Title * (max 34 ký tự)</label>
                  <input className="form-input" maxLength={34} value={form.freeze_banner.title} onChange={(e) => patch('freeze_banner', { ...form.freeze_banner, title: e.target.value })} disabled={!editMode} />
                  <p className="char-count">{form.freeze_banner.title.length}/34</p>
                </div>
                <div>
                  <label className="form-label">Subtitle (max 70 ký tự)</label>
                  <input className="form-input" maxLength={70} value={form.freeze_banner.subtitle} onChange={(e) => patch('freeze_banner', { ...form.freeze_banner, subtitle: e.target.value })} disabled={!editMode} />
                  <p className="char-count">{form.freeze_banner.subtitle.length}/70</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ③ Page 1 — Base Card + Explored Card */}
      <div className="card">
        <div className="card-header"><h2>③ Page 1 Info — Card (Trang 1)</h2></div>
        <div className="card-body space-y-6">
          {/* Base Card */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <h3>Base Card</h3>
              <Toggle value={form.base_card.enabled} onChange={(v) => patch('base_card', { ...form.base_card, enabled: v })} disabled={!editMode} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="form-label">Title * (max 34 ký tự)</label>
                <input className="form-input" maxLength={34} value={form.base_card.title} onChange={(e) => patch('base_card', { ...form.base_card, title: e.target.value })} disabled={!editMode} />
                <p className="char-count">{form.base_card.title.length}/34</p>
              </div>
              <div>
                <label className="form-label">Subtitle (max 46 ký tự)</label>
                <input className="form-input" maxLength={46} value={form.base_card.subtitle} onChange={(e) => patch('base_card', { ...form.base_card, subtitle: e.target.value })} disabled={!editMode} />
                <p className="char-count">{form.base_card.subtitle.length}/46</p>
              </div>
              <div>
                <label className="form-label">Title Color *</label>
                <ColorPicker value={form.base_card.title_color} onChange={(v) => patch('base_card', { ...form.base_card, title_color: v })} disabled={!editMode} />
              </div>
              <div>
                <label className="form-label">Subtitle Color *</label>
                <ColorPicker value={form.base_card.subtitle_color} onChange={(v) => patch('base_card', { ...form.base_card, subtitle_color: v })} disabled={!editMode} />
              </div>
              <div>
                <label className="form-label">Content Color *</label>
                <ColorPicker value={form.base_card.content_color} onChange={(v) => patch('base_card', { ...form.base_card, content_color: v })} disabled={!editMode} />
              </div>
              <div>
                <label className="form-label">Background Color</label>
                <div className="flex items-center gap-3">
                  <ColorPicker value={form.base_card.bg_color} onChange={(v) => patch('base_card', { ...form.base_card, bg_color: v })} disabled={!editMode || form.base_card.bg_transparent} />
                  <label className="flex items-center gap-1.5 text-xs text-ink-500">
                    <input type="checkbox" checked={form.base_card.bg_transparent} onChange={(e) => patch('base_card', { ...form.base_card, bg_transparent: e.target.checked })} disabled={!editMode} />
                    Transparent
                  </label>
                </div>
              </div>
              <div className="col-span-2">
                <ImageUpload label="Background Image (optional, hỗ trợ gradient / special design)" value={form.base_card.bg_image_url} onChange={(url) => patch('base_card', { ...form.base_card, bg_image_url: url })} disabled={!editMode} />
              </div>
              <div>
                <ImageUpload label="Logo trái (brand logo)" value={form.base_card.logo_left_url} onChange={(url) => patch('base_card', { ...form.base_card, logo_left_url: url })} disabled={!editMode} />
              </div>
              <div>
                <ImageUpload label="Logo mờ phải (watermark)" value={form.base_card.logo_right_url} onChange={(url) => patch('base_card', { ...form.base_card, logo_right_url: url })} disabled={!editMode} />
              </div>
              <div className="col-span-2">
                <ImageUpload label="Top Right Shape (hình trang trí góc trên phải card)" value={form.base_card.top_right_shape_url} onChange={(url) => patch('base_card', { ...form.base_card, top_right_shape_url: url })} disabled={!editMode} />
              </div>
            </div>
          </div>

          <div className="section-divider" />

          {/* Explored Card */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <h3>Explored Card (gồm Benefits)</h3>
              <Toggle value={form.explored_card.enabled} onChange={(v) => patch('explored_card', { ...form.explored_card, enabled: v })} disabled={!editMode} />
            </div>
            <div className="space-y-4">
              <div>
                <label className="form-label">Badge (max 46 ký tự)</label>
                <input className="form-input" maxLength={46} value={form.explored_card.badge} onChange={(e) => patch('explored_card', { ...form.explored_card, badge: e.target.value })} disabled={!editMode} placeholder="VD: Hạn mức 40 triệu" />
                <p className="char-count">{form.explored_card.badge.length}/46</p>
              </div>
              <div>
                <label className="form-label">Description / Benefits * (rich text)</label>
                <RichTextEditor value={form.explored_card.description} onChange={(v) => patch('explored_card', { ...form.explored_card, description: v })} disabled={!editMode} placeholder="Danh sách quyền lợi..." />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ④ Page 2 — Detail Block */}
      <div className="card">
        <div className="card-header">
          <div className="flex items-center gap-3">
            <h2>④ Page 2 Info — Detail Block (Trang 2)</h2>
            <Toggle value={form.detail_block.enabled} onChange={(v) => patch('detail_block', { ...form.detail_block, enabled: v })} disabled={!editMode} />
            {!form.detail_block.enabled && <span className="text-xs text-orange-500">Tắt: flow skip thẳng Trang 1 → Trang 3</span>}
          </div>
        </div>
        {form.detail_block.enabled && (
          <div className="card-body space-y-4">
            <ImageUpload label="Top Image (ảnh lớn đầu trang 2)" value={form.detail_block.top_image_url} onChange={(url) => patch('detail_block', { ...form.detail_block, top_image_url: url })} disabled={!editMode} />
            <div>
              <label className="form-label">Content Primary *</label>
              <RichTextEditor value={form.detail_block.content_primary} onChange={(v) => patch('detail_block', { ...form.detail_block, content_primary: v })} disabled={!editMode} />
            </div>
            <div>
              <label className="form-label">Content Secondary (optional)</label>
              <RichTextEditor value={form.detail_block.content_secondary} onChange={(v) => patch('detail_block', { ...form.detail_block, content_secondary: v })} disabled={!editMode} />
            </div>
          </div>
        )}
      </div>

      {/* ⑤ CTA */}
      <div className="card">
        <div className="card-header"><h2>⑤ CTA Button + Redirect Links</h2></div>
        <div className="card-body">
          <CTASection ctaList={form.cta_list} onChange={(list) => patch('cta_list', list)} editMode={editMode} />
        </div>
      </div>

      {/* ⑥ Header + Main Content (Partner Content — Trang 3) */}
      <div className="card">
        <div className="card-header">
          <div>
            <h2>⑥ Partner Content — Header + Nội dung chính (Trang 3)</h2>
            <p className="text-xs text-ink-400 mt-0.5">Trang landing chi tiết hiển thị quyền lợi, điều kiện cho user</p>
          </div>
        </div>
        <div className="card-body space-y-4">
          <div>
            <label className="form-label">Description nội bộ (không hiển thị ra ngoài)</label>
            <textarea className="form-textarea" rows={2} value={form.description ?? ''} onChange={(e) => patch('description', e.target.value)} disabled={!editMode} />
          </div>
          <div>
            <label className="form-label">Header Title * (max 200 ký tự)</label>
            <input className="form-input" maxLength={200} value={form.header_title} onChange={(e) => patch('header_title', e.target.value)} disabled={!editMode} placeholder="VD: Vay tiêu dùng trực tuyến" />
            <p className="char-count">{form.header_title.length}/200</p>
          </div>
          <ImageUpload label="Header Image * (logo ngang của brand, bắt buộc khi ACTIVE)" value={form.header_image_url} onChange={(url) => patch('header_image_url', url)} disabled={!editMode} />
          <div>
            <label className="form-label">Main Content * (quyền lợi + điều kiện — rich text)</label>
            <RichTextEditor value={form.main_content} onChange={(v) => patch('main_content', v)} disabled={!editMode} placeholder="Nhập quyền lợi nổi bật và điều kiện chương trình..." />
          </div>
        </div>
      </div>

      {/* ⑦ Sub Content (Hyperlinks) */}
      <div className="card">
        <div className="card-header">
          <h2>⑦ Sub Content (Hyperlinks)</h2>
          {editMode && <button className="btn-secondary text-xs" onClick={addSubContent}>+ Add</button>}
        </div>
        <div className="card-body space-y-3">
          {form.sub_content_list.length === 0 && (
            <p className="text-ink-400 text-xs text-center py-4">Chưa có sub content</p>
          )}
          {form.sub_content_list.map((sc, i) => (
            <div key={sc.id} className="grid grid-cols-3 gap-3 p-3 bg-surface-50 rounded-lg items-start">
              <div>
                <label className="form-label">Label *</label>
                <input className="form-input text-xs" value={sc.label} onChange={(e) => updateSubContent(i, { label: e.target.value })} disabled={!editMode} placeholder="VD: Xem điều khoản" />
              </div>
              <div>
                <label className="form-label">ZPA Link *</label>
                <input className="form-input text-xs" value={sc.zpa_link} onChange={(e) => updateSubContent(i, { zpa_link: e.target.value })} disabled={!editMode} placeholder="https://..." />
              </div>
              <div className="flex gap-2 items-end">
                <div className="flex-1">
                  <label className="form-label">ZPI Link (optional)</label>
                  <input className="form-input text-xs" value={sc.zpi_link ?? ''} onChange={(e) => updateSubContent(i, { zpi_link: e.target.value })} disabled={!editMode} placeholder="https://..." />
                </div>
                {editMode && (
                  <button type="button" className="btn text-red-500 hover:bg-red-50 pb-2" onClick={() => removeSubContent(i)}>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ⑧ Guidances */}
      <div className="card">
        <div className="card-header">
          <h2>⑧ Guidances (Hướng dẫn từng bước)</h2>
          {editMode && <button className="btn-secondary text-xs" onClick={addGuidance}>+ Add Guidance</button>}
        </div>
        <div className="card-body space-y-4">
          {form.guidances.length === 0 && (
            <p className="text-ink-400 text-xs text-center py-4">Chưa có guidance</p>
          )}
          {form.guidances.map((g, i) => (
            <div key={g.id} className="flex gap-4 p-3 bg-surface-50 rounded-lg">
              <div className="text-xs font-bold text-ink-400 w-5 pt-1 shrink-0">{g.order}</div>
              <div className="flex-1 grid grid-cols-2 gap-3">
                <div>
                  <label className="form-label">Caption *</label>
                  <input className="form-input text-xs" value={g.content} onChange={(e) => updateGuidance(i, { content: e.target.value })} disabled={!editMode} placeholder="Mô tả bước..." />
                </div>
                <ImageUpload label="Image *" value={g.image_url} onChange={(url) => updateGuidance(i, { image_url: url })} disabled={!editMode} />
              </div>
              {editMode && (
                <button type="button" className="btn text-red-500 hover:bg-red-50 self-start mt-5 shrink-0" onClick={() => removeGuidance(i)}>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" /></svg>
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      </div>{/* end form column */}

      {/* ─── Phone Preview column ─── */}
      <div className="shrink-0 sticky top-6 self-start pt-1">
        <PhonePreview config={form} />
      </div>

      </div>{/* end split layout */}

      {/* Dialogs */}
      <ConfirmDialog
        open={showCancel}
        title="Hủy thay đổi?"
        message="Các thay đổi chưa lưu sẽ bị mất."
        confirmLabel="Hủy thay đổi"
        onConfirm={() => { const found = getById(id!); if (found) setForm(JSON.parse(JSON.stringify(found))); setEditMode(false); setShowCancel(false) }}
        onCancel={() => setShowCancel(false)}
      />

      {/* Import dialog */}
      {showImport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 space-y-4">
            <h3 className="font-semibold text-ink-900">Import Config JSON</h3>
            <p className="text-xs text-ink-500">Paste JSON (phải có field "version"). Các field có trong JSON sẽ override, không auto-save.</p>
            <textarea
              className="form-textarea font-mono text-xs w-full"
              rows={8}
              value={importJson}
              onChange={(e) => { setImportJson(e.target.value); setImportError('') }}
              placeholder='{ "version": 3, "name": "...", ... }'
            />
            {importError && <p className="text-xs text-red-500">{importError}</p>}
            <div className="flex gap-2 justify-end">
              <button className="btn-secondary" onClick={() => { setShowImport(false); setImportJson(''); setImportError('') }}>Hủy</button>
              <button className="btn-primary" onClick={handleImport}>Apply Import</button>
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  )
}
