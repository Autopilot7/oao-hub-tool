import type { ConfigStatus, ExperimentStatus, BundleStatus } from '../../types'

type BadgeStatus = ConfigStatus | ExperimentStatus | BundleStatus | 'ACTIVE' | 'INACTIVE'

const CLASS_MAP: Record<string, string> = {
  ACTIVE: 'badge-active',
  INACTIVE: 'badge-inactive',
  DRAFT: 'badge-draft',
  draft: 'badge-draft',
  running: 'badge-running',
  paused: 'badge-paused',
  completed: 'badge-completed',
}

const LABEL_MAP: Record<string, string> = {
  ACTIVE: 'Active',
  INACTIVE: 'Inactive',
  DRAFT: 'Draft',
  draft: 'Draft',
  running: 'Running',
  paused: 'Paused',
  completed: 'Completed',
}

export function Badge({ status }: { status: BadgeStatus }) {
  return (
    <span className={CLASS_MAP[status] ?? 'badge bg-surface-100 text-ink-500'}>
      {LABEL_MAP[status] ?? status}
    </span>
  )
}
