import { create } from 'zustand'
import type { Experiment, ExperimentMetrics } from '../types'
import { mockExperiments, mockMetrics } from '../mocks/experiments'

interface ExperimentStore {
  experiments: Experiment[]
  metrics: Record<string, ExperimentMetrics[]>
  getById: (id: string) => Experiment | undefined
  save: (exp: Experiment) => void
  add: (exp: Experiment) => void
  clone: (id: string) => void
  /** Trả về error string nếu transition không hợp lệ, undefined nếu thành công */
  transition: (id: string, action: 'start' | 'pause' | 'resume' | 'complete') => string | undefined
}

export const useExperimentStore = create<ExperimentStore>((set, get) => ({
  experiments: mockExperiments,
  metrics: mockMetrics,

  getById: (id) => get().experiments.find((e) => e.id === id),

  save: (updated) =>
    set((state) => ({
      experiments: state.experiments.map((e) => (e.id === updated.id ? updated : e)),
    })),

  add: (exp) => set((state) => ({ experiments: [...state.experiments, exp] })),

  // PRD §6.x: Clone experiment — copy toàn bộ, đặt status=draft
  clone: (id) => {
    const original = get().getById(id)
    if (!original) return
    const cloned: Experiment = {
      ...original,
      id: `exp-${Date.now()}`,
      name: `${original.name} (Clone)`,
      status: 'draft',
      created_at: new Date().toISOString(),
    }
    set((state) => ({ experiments: [...state.experiments, cloned] }))
  },

  transition: (id, action) => {
    const STATUS_MAP: Record<string, Record<string, string>> = {
      start:    { draft: 'running' },
      pause:    { running: 'paused' },
      resume:   { paused: 'running' },
      complete: { running: 'completed', paused: 'completed' },
    }

    const exp = get().getById(id)
    if (!exp) return 'Experiment không tồn tại'

    // PRD §6.x: Validate trước khi Start
    if (action === 'start') {
      if (!exp.name) return 'Experiment: Name bắt buộc'
      if (!exp.category) return 'Experiment: Category bắt buộc'
      if (!exp.start_time || !exp.end_time) return 'Experiment: Thời gian bắt đầu / kết thúc bắt buộc'
      if (exp.variants.length < 2) return 'Experiment: Phải có ít nhất 2 variants'

      const totalSplit = exp.variants.reduce((sum, v) => sum + (v.traffic_split ?? 0), 0)
      if (Math.abs(totalSplit - 100) > 0.5) {
        return `Experiment: Tổng traffic split phải = 100% (hiện tại: ${totalSplit}%)`
      }
    }

    const nextStatus = STATUS_MAP[action]?.[exp.status]
    if (!nextStatus) return `Không thể chuyển từ "${exp.status}" với action "${action}"`

    set((state) => ({
      experiments: state.experiments.map((e) =>
        e.id === id ? { ...e, status: nextStatus as Experiment['status'] } : e
      ),
    }))
    return undefined
  },
}))
