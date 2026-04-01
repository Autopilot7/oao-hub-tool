import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useBundleStore } from '../../stores/useBundleStore'
import { PageLayout } from '../../components/layout/PageLayout'
import { Badge } from '../../components/shared/Badge'
import { ConfirmDialog } from '../../components/shared/ConfirmDialog'
import type { Category } from '../../types'

const CATEGORY_LABELS: Record<string, string> = {
  bank_account: 'Bank Account', loan: 'Loan', credit_card: 'Credit Card',
  insurance: 'Insurance', promotion: 'Promotion',
}

export function BundleList() {
  const { bundles, remove, clone } = useBundleStore()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [filterCat, setFilterCat] = useState<Category | ''>('')
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [toast, setToast] = useState('')
  const [toastError, setToastError] = useState('')

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2500) }
  const showError = (msg: string) => { setToastError(msg); setTimeout(() => setToastError(''), 4500) }

  const filtered = bundles.filter((b) => {
    const matchSearch = b.name.toLowerCase().includes(search.toLowerCase())
    const matchCat = !filterCat || b.category === filterCat
    return matchSearch && matchCat
  })

  return (
    <PageLayout
      title="Segment Bundle"
      subtitle="Bộ rule đóng gói sẵn theo nhóm mục tiêu người dùng"
      actions={
        <button className="btn-primary" onClick={() => navigate('/segment-bundles/new')}>+ Add New Bundle</button>
      }
    >
      {toast && <div className="fixed top-4 right-4 z-50 bg-ink-900 text-white text-sm px-4 py-2 rounded-lg shadow-lg">{toast}</div>}
      {toastError && <div className="fixed top-16 right-4 z-50 bg-red-600 text-white text-sm px-4 py-2 rounded-lg shadow-lg max-w-sm">{toastError}</div>}

      <div className="flex flex-wrap gap-3">
        <input className="form-input w-64" placeholder="Tìm theo tên..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <select className="form-select w-44" value={filterCat} onChange={(e) => setFilterCat(e.target.value as Category | '')}>
          <option value="">Tất cả Category</option>
          <option value="bank_account">Bank Account</option>
          <option value="loan">Loan</option>
          <option value="credit_card">Credit Card</option>
          <option value="insurance">Insurance</option>
          <option value="promotion">Promotion</option>
        </select>
        <span className="text-xs text-ink-400 self-center ml-auto">{filtered.length} bundles</span>
      </div>

      <div className="card">
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Category</th>
                <th>Rules</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="text-center text-ink-400 py-8">Không có kết quả</td></tr>
              )}
              {filtered.map((b) => (
                <tr key={b.id}>
                  <td className="font-mono text-xs text-ink-400">{b.id}</td>
                  <td>
                    <p className="font-medium text-ink-900">{b.name}</p>
                    <p className="text-xs text-ink-400 max-w-xs truncate">{b.description}</p>
                  </td>
                  <td>
                    <span className="text-xs bg-surface-100 text-ink-600 px-2 py-0.5 rounded-full font-medium">
                      {CATEGORY_LABELS[b.category]}
                    </span>
                  </td>
                  <td className="text-ink-400 text-xs">{b.rules.reduce((sum, r) => sum + r.conditions.length, 0)} conditions</td>
                  <td><Badge status={b.status} /></td>
                  <td>
                    <div className="flex gap-1">
                      <button className="btn-ghost text-xs" onClick={() => navigate(`/segment-bundles/${b.id}`)}>View</button>
                      <button className="btn-ghost text-xs" onClick={() => { clone(b.id); showToast('Đã clone bundle') }}>Clone</button>
                      <button className="btn-ghost text-xs text-red-500 hover:bg-red-50" onClick={() => setDeleteId(b.id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmDialog
        open={deleteId !== null}
        title="Xóa Segment Bundle"
        message="Bạn có chắc muốn xóa bundle này không? Bundle đang được dùng bởi experiment running/paused sẽ không xoá được."
        confirmLabel="Xóa"
        danger
        onConfirm={() => {
          const err = remove(deleteId!)
          setDeleteId(null)
          if (err) { showError(err) } else { showToast('Đã xoá bundle') }
        }}
        onCancel={() => setDeleteId(null)}
      />
    </PageLayout>
  )
}
