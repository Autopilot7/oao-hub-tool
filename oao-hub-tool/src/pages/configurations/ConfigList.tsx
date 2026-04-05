import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useConfigStore } from '../../stores/useConfigStore'
import { useAuthStore } from '../../stores/useAuthStore'
import { PageLayout } from '../../components/layout/PageLayout'
import { Badge } from '../../components/shared/Badge'
import { ConfirmDialog } from '../../components/shared/ConfirmDialog'
import type { Category, ConfigStatus } from '../../types'

const CATEGORY_LABELS: Record<string, string> = {
  bank_account: 'Bank Account',
  loan: 'Loan',
  credit_card: 'Credit Card',
  insurance: 'Insurance',
  promotion: 'Promotion',
}

export function ConfigList() {
  const { visibleConfigs, remove } = useConfigStore()
  const configs = visibleConfigs()
  const { currentUser } = useAuthStore()
  const canDelete = currentUser?.role === 'admin'
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<ConfigStatus | ''>('')
  const [filterCategory, setFilterCategory] = useState<Category | ''>('')
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const filtered = configs.filter((c) => {
    const matchSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.bank_code.toLowerCase().includes(search.toLowerCase())
    const matchStatus = !filterStatus || c.status === filterStatus
    const matchCategory = !filterCategory || c.category === filterCategory
    return matchSearch && matchStatus && matchCategory
  })

  return (
    <PageLayout
      title="Partner Configuration"
      subtitle="Config giao diện (Trang 1-2) + nội dung landing (Trang 3) cho từng bank partner"
      actions={
        <button className="btn-primary" onClick={() => navigate('/configurations/new')}>
          + Add New
        </button>
      }
    >
      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <input
          className="form-input w-64"
          placeholder="Tìm theo tên hoặc bank code..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select className="form-select w-40" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as ConfigStatus | '')}>
          <option value="">Tất cả Status</option>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
          <option value="DRAFT">Draft</option>
        </select>
        <select className="form-select w-44" value={filterCategory} onChange={(e) => setFilterCategory(e.target.value as Category | '')}>
          <option value="">Tất cả Category</option>
          <option value="bank_account">Bank Account</option>
          <option value="loan">Loan</option>
          <option value="credit_card">Credit Card</option>
          <option value="insurance">Insurance</option>
          <option value="promotion">Promotion</option>
        </select>
        <span className="text-xs text-ink-400 ml-auto">{filtered.length} kết quả</span>
      </div>

      {/* Table */}
      <div className="card">
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Bank Code</th>
                <th>Category</th>
                <th>Status</th>
                <th>Version</th>
                <th>Updated</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center text-ink-400 py-8">
                    Không có kết quả nào
                  </td>
                </tr>
              )}
              {filtered.map((c) => (
                <tr key={c.id}>
                  <td>
                    {(() => {
                      const [bankName, productDesc] = c.name.split('—').map((s) => s.trim())
                      return (
                        <>
                          <p className="font-medium text-ink-900">{bankName}</p>
                          {productDesc && <p className="text-[10px] text-ink-400">{productDesc}</p>}
                        </>
                      )
                    })()}
                  </td>
                  <td className="font-mono text-xs font-medium text-primary-700 bg-primary-50/50 rounded">{c.bank_code}</td>
                  <td>{CATEGORY_LABELS[c.category]}</td>
                  <td><Badge status={c.status} /></td>
                  <td className="text-ink-400 font-mono text-xs">v{c.version}</td>
                  <td className="text-ink-400 text-xs">{new Date(c.updated_at).toLocaleDateString('vi-VN')}</td>
                  <td>
                    <div className="flex items-center gap-1">
                      <button className="btn-ghost text-xs" onClick={() => navigate(`/configurations/${c.id}`)}>
                        View
                      </button>
                      {canDelete && (
                        <button className="btn-ghost text-xs text-red-500 hover:bg-red-50" onClick={() => setDeleteId(c.id)}>
                          Delete
                        </button>
                      )}
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
        title="Xóa Configuration"
        message={`Bạn có chắc muốn xóa config này không? Hành động này không thể hoàn tác.`}
        confirmLabel="Xóa"
        danger
        onConfirm={() => { remove(deleteId!); setDeleteId(null) }}
        onCancel={() => setDeleteId(null)}
      />
    </PageLayout>
  )
}
