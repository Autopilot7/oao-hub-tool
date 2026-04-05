import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '../types'

export const MOCK_USERS: User[] = [
  {
    id: 'u1',
    email: 'admin@zalopay.vn',
    name: 'Admin ZaloPay',
    role: 'admin',
    avatar: 'AD',
  },
  {
    id: 'u2',
    email: 'po@zalopay.vn',
    name: 'Product Owner',
    role: 'po',
    avatar: 'PO',
  },
  {
    id: 'u3',
    email: 'partner@cathay.vn',
    name: 'Cathay Partner',
    role: 'partner',
    avatar: 'CA',
    bank_code: 'CATHAY',
  },
]

interface AuthStore {
  currentUser: User | null
  login: (userId: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      currentUser: null,

      login: (userId) => {
        const user = MOCK_USERS.find((u) => u.id === userId) ?? null
        set({ currentUser: user })
      },

      logout: () => set({ currentUser: null }),
    }),
    {
      name: 'oao-hub-auth',
    }
  )
)
