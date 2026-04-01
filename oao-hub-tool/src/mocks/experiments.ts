import type { Experiment, ExperimentMetrics } from '../types'

export const mockExperiments: Experiment[] = [
  {
    id: 'exp-001',
    name: 'Bank Account Bundle Comparison Q1',
    category: 'bank_account',
    status: 'running',
    traffic_allocation: 100,
    start_time: '2025-03-01T00:00:00Z',
    end_time: '2025-04-01T00:00:00Z',
    created_at: '2025-02-25T09:00:00Z',
    variants: [
      {
        id: 'var-001',
        experiment_id: 'exp-001',
        name: 'Variant A — New-to-finance (threshold thấp)',
        segment_bundle_id: 'sb-001',
        segment_bundle_name: 'New-to-finance Users',
        segment_bundle_snapshot: [],
        traffic_split: 50,
      },
      {
        id: 'var-002',
        experiment_id: 'exp-001',
        name: 'Variant B — New-to-finance (threshold cao hơn)',
        segment_bundle_id: 'sb-001',
        segment_bundle_name: 'New-to-finance Users (clone)',
        segment_bundle_snapshot: [],
        traffic_split: 50,
      },
    ],
  },
  {
    id: 'exp-002',
    name: 'Credit Card High Spenders Test',
    category: 'credit_card',
    status: 'draft',
    traffic_allocation: 50,
    start_time: '2025-04-01T00:00:00Z',
    end_time: '2025-05-01T00:00:00Z',
    created_at: '2025-03-20T10:00:00Z',
    variants: [
      {
        id: 'var-003',
        experiment_id: 'exp-002',
        name: 'Variant A',
        segment_bundle_id: 'sb-002',
        segment_bundle_name: 'High Spenders',
        segment_bundle_snapshot: [],
        traffic_split: 50,
      },
      {
        id: 'var-004',
        experiment_id: 'exp-002',
        name: 'Variant B',
        segment_bundle_id: 'sb-002',
        segment_bundle_name: 'Lifestyle Users',
        segment_bundle_snapshot: [],
        traffic_split: 50,
      },
    ],
  },
  {
    id: 'exp-003',
    name: 'Loan Segment Q4 2024',
    category: 'loan',
    status: 'completed',
    traffic_allocation: 80,
    start_time: '2024-10-01T00:00:00Z',
    end_time: '2024-12-31T00:00:00Z',
    created_at: '2024-09-25T00:00:00Z',
    variants: [
      {
        id: 'var-005',
        experiment_id: 'exp-003',
        name: 'Control',
        segment_bundle_id: 'sb-003',
        segment_bundle_name: 'Liquidity-constrained Users',
        segment_bundle_snapshot: [],
        traffic_split: 60,
      },
      {
        id: 'var-006',
        experiment_id: 'exp-003',
        name: 'Treatment',
        segment_bundle_id: 'sb-003',
        segment_bundle_name: 'Income-flow Users',
        segment_bundle_snapshot: [],
        traffic_split: 40,
      },
    ],
  },
]

export const mockMetrics: Record<string, ExperimentMetrics[]> = {
  'exp-001': [
    { variant_id: 'var-001', variant_name: 'Variant A', impressions: 45200, clicks: 8136, conversions: 1220, ctr: 0.18, cvr: 0.15, revenue: 610000000 },
    { variant_id: 'var-002', variant_name: 'Variant B', impressions: 44800, clicks: 9408, conversions: 1505, ctr: 0.21, cvr: 0.16, revenue: 752500000 },
  ],
  'exp-003': [
    { variant_id: 'var-005', variant_name: 'Control', impressions: 120000, clicks: 18000, conversions: 2700, ctr: 0.15, cvr: 0.15, revenue: 1350000000 },
    { variant_id: 'var-006', variant_name: 'Treatment', impressions: 80000, clicks: 14400, conversions: 2304, ctr: 0.18, cvr: 0.16, revenue: 1152000000 },
  ],
}
