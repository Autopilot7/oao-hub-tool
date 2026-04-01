import { useState } from 'react'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { RuleGroupObject, ConditionObject, Logic, Operator } from '../../types'
import { FACT_DEFINITIONS, OPERATORS_BY_TYPE, OPERATOR_LABELS } from '../../mocks/factDefinitions'
import { Toggle } from '../../components/shared/Toggle'

interface RuleBuilderProps {
  ruleGroups: RuleGroupObject[]
  onChange: (groups: RuleGroupObject[]) => void
  editMode: boolean
}

function ConditionRow({
  cond,
  onChange,
  onRemove,
  editMode,
}: {
  cond: ConditionObject
  onChange: (c: ConditionObject) => void
  onRemove: () => void
  editMode: boolean
}) {
  const factDef = FACT_DEFINITIONS.find((f) => f.name === cond.fact_name)
  const availableOps = factDef ? OPERATORS_BY_TYPE[factDef.value_type] ?? [] : Object.keys(OPERATOR_LABELS)

  const renderValueInput = () => {
    if (!factDef) {
      return (
        <input className="form-input text-xs" value={String(cond.value)} onChange={(e) => onChange({ ...cond, value: e.target.value })} disabled={!editMode} placeholder="Giá trị..." />
      )
    }
    if (cond.operator === 'exists') {
      return <input className="form-input text-xs bg-surface-50" value="(không cần giá trị)" disabled readOnly />
    }
    if (cond.operator === 'in' || cond.operator === 'not_in') {
      if (factDef.value_type === 'multi_select' || factDef.value_type === 'dropdown') {
        const selected = Array.isArray(cond.value) ? cond.value : []
        return (
          <div className="flex flex-wrap gap-1">
            {factDef.options?.map((opt) => (
              <label key={opt} className="flex items-center gap-1 text-xs cursor-pointer">
                <input
                  type="checkbox"
                  checked={selected.includes(opt)}
                  disabled={!editMode}
                  onChange={(e) => {
                    const next = e.target.checked ? [...selected, opt] : selected.filter((v) => v !== opt)
                    onChange({ ...cond, value: next })
                  }}
                />
                {opt}
              </label>
            ))}
          </div>
        )
      }
      return (
        <input className="form-input text-xs" value={Array.isArray(cond.value) ? cond.value.join(', ') : String(cond.value)} onChange={(e) => onChange({ ...cond, value: e.target.value.split(',').map((v) => v.trim()) })} disabled={!editMode} placeholder="Giá trị 1, Giá trị 2, ..." />
      )
    }
    if (factDef.value_type === 'dropdown' && factDef.options) {
      return (
        <select className="form-select text-xs" value={String(cond.value)} onChange={(e) => onChange({ ...cond, value: e.target.value })} disabled={!editMode}>
          <option value="">Chọn...</option>
          {factDef.options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      )
    }
    if (factDef.value_type === 'number') {
      return (
        <input className="form-input text-xs" type="number" value={String(cond.value)} onChange={(e) => onChange({ ...cond, value: e.target.value })} disabled={!editMode} placeholder="0" />
      )
    }
    return (
      <input className="form-input text-xs" value={String(cond.value)} onChange={(e) => onChange({ ...cond, value: e.target.value })} disabled={!editMode} placeholder="Giá trị..." />
    )
  }

  return (
    <div className={`flex items-start gap-2 p-2 rounded-lg ${!cond.enabled ? 'opacity-50' : ''} bg-white border border-surface-100`}>
      <Toggle value={cond.enabled} onChange={(v) => onChange({ ...cond, enabled: v })} disabled={!editMode} />
      <div className="flex-1 grid grid-cols-3 gap-2">
        <select
          className="form-select text-xs"
          value={cond.fact_name}
          onChange={(e) => onChange({ ...cond, fact_name: e.target.value, value: '' })}
          disabled={!editMode}
        >
          <option value="">Chọn Fact...</option>
          {FACT_DEFINITIONS.map((f) => (
            <option key={f.name} value={f.name}>{f.label}</option>
          ))}
        </select>
        <select
          className="form-select text-xs"
          value={cond.operator}
          onChange={(e) => onChange({ ...cond, operator: e.target.value as Operator })}
          disabled={!editMode}
        >
          {availableOps.map((op) => (
            <option key={op} value={op}>{OPERATOR_LABELS[op] ?? op}</option>
          ))}
        </select>
        <div>{renderValueInput()}</div>
      </div>
      {editMode && (
        <button type="button" onClick={onRemove} className="text-red-400 hover:text-red-600 mt-1.5 shrink-0">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  )
}

/** Sortable wrapper cho một RuleGroup card — dùng @dnd-kit */
function SortableRuleGroup({
  group,
  index,
  onChange,
  onRemove,
  editMode,
}: {
  group: RuleGroupObject
  index: number
  onChange: (g: RuleGroupObject) => void
  onRemove: () => void
  editMode: boolean
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: group.id })
  const [collapsed, setCollapsed] = useState(false)

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const addCondition = () => {
    const newCond: ConditionObject = { id: `c-${Date.now()}`, fact_name: '', operator: '=', value: '', enabled: true }
    onChange({ ...group, conditions: [...group.conditions, newCond] })
  }

  const updateCond = (idx: number, cond: ConditionObject) =>
    onChange({ ...group, conditions: group.conditions.map((c, i) => i === idx ? cond : c) })

  const removeCond = (idx: number) =>
    onChange({ ...group, conditions: group.conditions.filter((_, i) => i !== idx) })

  return (
    <div ref={setNodeRef} style={style} className="border border-surface-200 rounded-xl overflow-hidden">
      <div className="flex items-center gap-3 px-4 py-3 bg-surface-50">
        {/* Drag handle — chỉ hiện khi edit mode */}
        {editMode && (
          <button
            type="button"
            className="cursor-grab text-ink-300 hover:text-ink-500 shrink-0"
            title="Kéo để đổi thứ tự"
            {...attributes}
            {...listeners}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
            </svg>
          </button>
        )}

        <span className="text-xs font-bold text-ink-400 w-5">#{group.order}</span>

        <div className="flex-1 min-w-0" onClick={() => setCollapsed(!collapsed)}>
          {editMode ? (
            <input
              className="form-input text-sm font-medium py-0.5 px-2"
              value={group.name}
              onChange={(e) => onChange({ ...group, name: e.target.value })}
              onClick={(e) => e.stopPropagation()}
              placeholder="Tên rule group..."
            />
          ) : (
            <p className="text-sm font-medium text-ink-900 truncate cursor-pointer">{group.name || 'Untitled Rule Group'}</p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-ink-400">Logic:</span>
          <select
            className="form-select text-xs w-20 py-0.5"
            value={group.logic}
            onChange={(e) => onChange({ ...group, logic: e.target.value as Logic })}
            disabled={!editMode}
          >
            <option value="ALL">ALL (AND)</option>
            <option value="ANY">ANY (OR)</option>
          </select>
        </div>

        <span className="text-xs text-ink-400">{group.conditions.length} conditions</span>

        {editMode && (
          <button type="button" onClick={onRemove} className="text-red-400 hover:text-red-600">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        )}

        <button type="button" onClick={() => setCollapsed(!collapsed)}>
          <svg className={`w-4 h-4 text-ink-400 transition-transform ${collapsed ? '' : 'rotate-180'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        </button>
      </div>

      {!collapsed && (
        <div className="p-4 space-y-3">
          <div className="space-y-2">
            {group.conditions.map((cond, i) => (
              <ConditionRow key={cond.id} cond={cond} onChange={(c) => updateCond(i, c)} onRemove={() => removeCond(i)} editMode={editMode} />
            ))}
            {editMode && (
              <button type="button" onClick={addCondition} className="text-xs text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                Add Condition
              </button>
            )}
          </div>

          <div className="pt-2 border-t border-surface-100">
            <p className="text-xs font-medium text-ink-500 mb-2">Local Facts (key-value)</p>
            <div className="space-y-1">
              {Object.entries(group.local_facts).map(([k, v]) => (
                <div key={k} className="flex items-center gap-2">
                  <span className="font-mono text-xs bg-surface-100 px-2 py-0.5 rounded text-ink-600">{k}</span>
                  <span className="text-xs text-ink-400">=</span>
                  {editMode ? (
                    <>
                      <input className="form-input text-xs w-32" value={v} onChange={(e) => onChange({ ...group, local_facts: { ...group.local_facts, [k]: e.target.value } })} />
                      <button type="button" onClick={() => { const lf = { ...group.local_facts }; delete lf[k]; onChange({ ...group, local_facts: lf }) }} className="text-red-400 hover:text-red-600 text-xs">✕</button>
                    </>
                  ) : (
                    <span className="font-mono text-xs text-ink-700">{v}</span>
                  )}
                </div>
              ))}
              {editMode && (
                <button
                  type="button"
                  className="text-xs text-primary-600 hover:text-primary-700 font-medium"
                  onClick={() => {
                    const key = prompt('Key:')
                    if (!key) return
                    const val = prompt('Value:') ?? ''
                    onChange({ ...group, local_facts: { ...group.local_facts, [key]: val } })
                  }}
                >
                  + Add Local Fact
                </button>
              )}
            </div>
          </div>

          <div className="pt-2 border-t border-surface-100">
            <p className="text-xs font-medium text-ink-500 mb-2">Actions (kết quả trả về nếu rule match)</p>
            {group.actions.map((action, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-xs text-ink-400">Response:</span>
                {editMode ? (
                  <input className="form-input text-xs w-48" value={action.value} onChange={(e) => onChange({ ...group, actions: group.actions.map((a, ai) => ai === i ? { ...a, value: e.target.value } : a) })} placeholder="NOT_ELIGIBLE / CATHAY / ..." />
                ) : (
                  <span className="font-mono text-xs font-medium text-green-700 bg-green-50 px-2 py-0.5 rounded">{action.value}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export function RuleBuilder({ ruleGroups, onChange, editMode }: RuleBuilderProps) {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))

  const addGroup = () => {
    const newGroup: RuleGroupObject = {
      id: `rg-${Date.now()}`,
      order: ruleGroups.length + 1,
      name: '',
      logic: 'ALL',
      conditions: [],
      local_facts: {},
      actions: [{ type: 'response', value: '' }],
    }
    onChange([...ruleGroups, newGroup])
  }

  const updateGroup = (idx: number, group: RuleGroupObject) =>
    onChange(ruleGroups.map((g, i) => i === idx ? group : g))

  const removeGroup = (idx: number) =>
    onChange(ruleGroups.filter((_, i) => i !== idx).map((g, i) => ({ ...g, order: i + 1 })))

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIdx = ruleGroups.findIndex((g) => g.id === active.id)
    const newIdx = ruleGroups.findIndex((g) => g.id === over.id)
    const reordered = arrayMove(ruleGroups, oldIdx, newIdx).map((g, i) => ({ ...g, order: i + 1 }))
    onChange(reordered)
  }

  return (
    <div className="space-y-3">
      {ruleGroups.length === 0 && (
        <div className="text-center py-8 text-ink-400 text-sm border-2 border-dashed border-surface-200 rounded-xl">
          Chưa có rule group nào. {editMode && 'Bấm "+ Add Rule Group" để bắt đầu.'}
        </div>
      )}

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={ruleGroups.map((g) => g.id)} strategy={verticalListSortingStrategy}>
          {ruleGroups.map((group, i) => (
            <SortableRuleGroup
              key={group.id}
              group={group}
              index={i}
              onChange={(g) => updateGroup(i, g)}
              onRemove={() => removeGroup(i)}
              editMode={editMode}
            />
          ))}
        </SortableContext>
      </DndContext>

      {editMode && (
        <button type="button" onClick={addGroup} className="btn-secondary w-full justify-center text-sm">
          + Add Rule Group
        </button>
      )}
    </div>
  )
}
