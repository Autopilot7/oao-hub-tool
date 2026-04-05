import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../../stores/useAuthStore'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { currentUser } = useAuthStore()
  if (!currentUser) return <Navigate to="/login" replace />
  return <>{children}</>
}
