import { useNavigate } from 'react-router-dom'
import { useAuthStore, MOCK_USERS } from '../../stores/useAuthStore'
import type { User } from '../../types'

const ROLE_LABELS: Record<string, string> = {
  admin: 'Admin — Toàn quyền',
  po: 'Product Owner — Xem & chỉnh sửa',
  partner: 'Partner — Xem configs của mình',
}

const ROLE_COLORS: Record<string, string> = {
  admin: 'bg-primary-100 text-primary-700 border-primary-200',
  po: 'bg-green-100 text-green-700 border-green-200',
  partner: 'bg-purple-100 text-purple-700 border-purple-200',
}

const AVATAR_COLORS: Record<string, string> = {
  admin: 'bg-primary-600',
  po: 'bg-green-600',
  partner: 'bg-purple-600',
}

function ProfileCard({ user, onSelect }: { user: User; onSelect: () => void }) {
  return (
    <button
      onClick={onSelect}
      className="w-full text-left p-5 rounded-2xl border-2 border-surface-200 hover:border-primary-300 hover:shadow-md transition-all bg-white group"
    >
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shrink-0 ${AVATAR_COLORS[user.role]}`}>
          {user.avatar}
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-ink-900 group-hover:text-primary-700 transition-colors">{user.name}</p>
          <p className="text-xs text-ink-400 mt-0.5">{user.email}</p>
          <span className={`inline-block mt-2 text-[10px] font-medium px-2 py-0.5 rounded-full border ${ROLE_COLORS[user.role]}`}>
            {ROLE_LABELS[user.role]}
          </span>
        </div>
        <svg className="w-5 h-5 text-ink-300 group-hover:text-primary-500 transition-colors shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
      {user.bank_code && (
        <div className="mt-3 pl-16 text-[10px] text-ink-400">
          Chỉ xem configs của: <span className="font-mono font-semibold text-purple-600">{user.bank_code}</span>
        </div>
      )}
    </button>
  )
}

export function LoginPage() {
  const { login } = useAuthStore()
  const navigate = useNavigate()

  const handleSelect = (userId: string) => {
    login(userId)
    navigate('/', { replace: true })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-50 to-primary-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-6">
        {/* Logo */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-primary-600 flex items-center justify-center mx-auto shadow-lg">
            <span className="text-white text-xl font-bold">OA</span>
          </div>
          <h1 className="text-2xl font-bold text-ink-900">OAO Hub</h1>
          <p className="text-sm text-ink-400">Chọn tài khoản để tiếp tục</p>
        </div>

        {/* Profile cards */}
        <div className="space-y-3">
          {MOCK_USERS.map((user) => (
            <ProfileCard key={user.id} user={user} onSelect={() => handleSelect(user.id)} />
          ))}
        </div>

      </div>
    </div>
  )
}
