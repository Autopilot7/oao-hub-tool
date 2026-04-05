import { create } from 'zustand'
import type { MainConfiguration } from '../types'
import { mockConfigurations } from '../mocks/configurations'
import { useAuthStore } from './useAuthStore'

interface ConfigStore {
  configs: MainConfiguration[]
  /** Trả về configs đã filter theo role của currentUser */
  visibleConfigs: () => MainConfiguration[]
  getById: (id: string) => MainConfiguration | undefined
  save: (config: MainConfiguration) => void
  add: (config: MainConfiguration) => void
  remove: (id: string) => void
}

export const useConfigStore = create<ConfigStore>((set, get) => ({
  configs: mockConfigurations,

  visibleConfigs: () => {
    const user = useAuthStore.getState().currentUser
    if (!user || user.role === 'admin' || user.role === 'po') return get().configs
    // partner chỉ thấy configs của bank mình
    return get().configs.filter((c) => c.bank_code === user.bank_code)
  },

  getById: (id) => get().configs.find((c) => c.id === id),

  save: (updated) =>
    set((state) => ({
      configs: state.configs.map((c) =>
        c.id === updated.id
          ? { ...updated, updated_at: new Date().toISOString(), version: updated.version + 1 }
          : c
      ),
    })),

  add: (config) =>
    set((state) => ({ configs: [...state.configs, config] })),

  remove: (id) =>
    set((state) => ({ configs: state.configs.filter((c) => c.id !== id) })),
}))
