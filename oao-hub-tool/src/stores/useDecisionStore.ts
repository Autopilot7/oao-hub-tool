import { create } from 'zustand'
import type { DecisionFlow } from '../types'
import { mockDecisionFlows } from '../mocks/decisionFlows'

interface DecisionStore {
  flows: DecisionFlow[]
  getById: (id: number) => DecisionFlow | undefined
  save: (flow: DecisionFlow) => void
  add: (flow: DecisionFlow) => void
  remove: (id: number) => void
  clone: (id: number) => void
}

export const useDecisionStore = create<DecisionStore>((set, get) => ({
  flows: mockDecisionFlows,

  getById: (id) => get().flows.find((f) => f.id === id),

  save: (updated) =>
    set((state) => ({
      flows: state.flows.map((f) =>
        f.id === updated.id
          ? { ...updated, updated_at: new Date().toISOString(), version: updated.version + 1 }
          : f
      ),
    })),

  add: (flow) =>
    set((state) => ({
      flows: [...state.flows, { ...flow, id: Math.max(...state.flows.map((f) => f.id)) + 1 }],
    })),

  remove: (id) =>
    set((state) => ({ flows: state.flows.filter((f) => f.id !== id) })),

  clone: (id) => {
    const original = get().getById(id)
    if (!original) return
    const cloned: DecisionFlow = {
      ...original,
      id: Math.max(...get().flows.map((f) => f.id)) + 1,
      name: `${original.name}_COPY`,
      flow_id: `${original.flow_id}-copy-${Date.now()}`,
      version: 1,
      status: 'INACTIVE',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    set((state) => ({ flows: [...state.flows, cloned] }))
  },
}))
