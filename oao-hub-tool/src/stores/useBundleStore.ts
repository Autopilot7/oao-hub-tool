import { create } from 'zustand'
import type { SegmentBundle } from '../types'
import { mockSegmentBundles } from '../mocks/segmentBundles'
import { useExperimentStore } from './useExperimentStore'

interface BundleStore {
  bundles: SegmentBundle[]
  getById: (id: string) => SegmentBundle | undefined
  save: (bundle: SegmentBundle) => void
  add: (bundle: SegmentBundle) => void
  /** Trả về error string nếu không xoá được, undefined nếu thành công */
  remove: (id: string) => string | undefined
  clone: (id: string) => void
}

export const useBundleStore = create<BundleStore>((set, get) => ({
  bundles: mockSegmentBundles,

  getById: (id) => get().bundles.find((b) => b.id === id),

  save: (updated) =>
    set((state) => ({
      bundles: state.bundles.map((b) =>
        b.id === updated.id ? { ...updated, updated_at: new Date().toISOString() } : b
      ),
    })),

  add: (bundle) => set((state) => ({ bundles: [...state.bundles, bundle] })),

  // PRD §5.x: bundle đang được sử dụng bởi running/paused experiment không được xoá
  remove: (id) => {
    const bundle = get().getById(id)
    if (!bundle) return undefined

    const experiments = useExperimentStore.getState().experiments
    const blocking = experiments.find(
      (e) =>
        (e.status === 'running' || e.status === 'paused') &&
        e.variants.some((v) => v.bundle_id === id)
    )
    if (blocking) {
      return `Bundle đang được dùng bởi experiment "${blocking.name}" (${blocking.status}). Dừng experiment trước khi xoá.`
    }

    set((state) => ({ bundles: state.bundles.filter((b) => b.id !== id) }))
    return undefined
  },

  clone: (id) => {
    const original = get().getById(id)
    if (!original) return
    const cloned: SegmentBundle = {
      ...original,
      id: `sb-${Date.now()}`,
      name: `${original.name} (Copy)`,
      editable: true,
      status: 'DRAFT',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    set((state) => ({ bundles: [...state.bundles, cloned] }))
  },
}))
