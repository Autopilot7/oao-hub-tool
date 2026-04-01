// ─── Enums ────────────────────────────────────────────────────────────────────

export type ConfigStatus = 'ACTIVE' | 'INACTIVE' | 'DRAFT'
export type Category = 'bank_account' | 'loan' | 'credit_card' | 'insurance' | 'promotion'
export type CTAName =
  | 'CONFIRM_CONDITION'
  | 'NOT_ELIGIBLE'
  | 'MAINTENANCE'
  | 'DEEPLINK'
  | 'ERROR_PAGE'
export type CTAAction =
  | 'CONFIRM_CONDITION'
  | 'DEEPLINK'
  | 'COPY'
  | 'OPEN_KYC_FLOW'
  | 'NFC'
  | 'UPDATE_NFC'
  | 'ADJUST_KYC_NFC'
  | 'KYC_NFC'
  | 'ERROR_PAGE'

export type FlowType = 'FIRST' | 'ALL'
export type ContinueOnError = 'ALLOWED' | 'STOPPED'
export type Operator = '=' | '!=' | '<' | '<=' | '>' | '>=' | 'in' | 'not_in' | 'exists' | 'contains' | 'trend_up'
export type Logic = 'ALL' | 'ANY'
export type ExperimentStatus = 'draft' | 'running' | 'paused' | 'completed'
export type BundleStatus = 'ACTIVE' | 'DRAFT'

// ─── CTA ──────────────────────────────────────────────────────────────────────

export interface CTAObject {
  id: string
  cta_name: CTAName
  button_name: string
  action: CTAAction
  description?: string
  zpa_link?: string
  zpi_link?: string
  extra_info?: string // JSON string
}

// ─── Configuration Tool ───────────────────────────────────────────────────────

export interface HeroBanner {
  enabled: boolean
  title: string
  subtitle: string
  image_url: string
}

export interface FreezeBanner {
  enabled: boolean
  title: string
  subtitle: string
}

export interface BaseCard {
  enabled: boolean
  title: string
  subtitle: string
  title_color: string
  subtitle_color: string
  content_color: string
  bg_color: string
  bg_transparent: boolean
  bg_image_url: string
  logo_left_url: string
  logo_right_url: string
  top_right_shape_url: string
}

export interface ExploredCard {
  enabled: boolean
  badge: string
  description: string // rich text HTML
}

export interface DetailBlock {
  enabled: boolean
  top_image_url: string
  content_primary: string // rich text HTML
  content_secondary: string // rich text HTML
}

export interface SubContentObject {
  id: string
  label: string
  zpa_link: string
  zpi_link?: string
}

export interface GuidanceObject {
  id: string
  content: string
  image_url: string
  order: number
}

export interface MainConfiguration {
  id: string
  bank_code: string
  name: string
  status: ConfigStatus
  category: Category
  extra_title: string
  hero_banner: HeroBanner
  freeze_banner: FreezeBanner
  base_card: BaseCard
  explored_card: ExploredCard
  detail_block: DetailBlock
  cta_list: CTAObject[]
  created_by: string
  created_at: string
  updated_at: string
  version: number
  // ── Partner content fields (merged từ PartnerConfiguration) ──
  description?: string
  header_title: string
  header_image_url: string
  main_content: string       // rich text HTML
  sub_content_list: SubContentObject[]
  guidances: GuidanceObject[]
}

/** @deprecated Dùng MainConfiguration thay thế */
export type PartnerConfiguration = MainConfiguration

// ─── Decision Flow ────────────────────────────────────────────────────────────

export interface ConditionObject {
  id: string
  fact_name: string
  operator: Operator
  value: string | number | string[]
  enabled: boolean
}

export interface RuleGroupObject {
  id: string
  order: number
  name: string
  logic: Logic
  conditions: ConditionObject[]
  local_facts: Record<string, string>
  actions: { type: string; value: string }[]
}

export interface DecisionFlow {
  id: number
  name: string
  flow_id: string
  version: number
  status: 'ACTIVE' | 'INACTIVE'
  flow_type: FlowType
  produce_execution_result: boolean
  continue_on_error: ContinueOnError
  description?: string
  rule_groups: RuleGroupObject[]
  created_at: string
  updated_at: string
}

// ─── Segment Bundle ───────────────────────────────────────────────────────────

export interface SegmentBundle {
  id: string
  name: string
  category: Category
  description?: string
  editable: boolean
  rules: RuleGroupObject[]
  status: BundleStatus
  created_by: string
  created_at: string
  updated_at: string
}

// ─── A/B Testing ─────────────────────────────────────────────────────────────

export interface Variant {
  id: string
  experiment_id: string
  name: string
  segment_bundle_id: string
  segment_bundle_name: string
  segment_bundle_snapshot: RuleGroupObject[]
  traffic_split: number
}

export interface Experiment {
  id: string
  name: string
  category: Category
  status: ExperimentStatus
  traffic_allocation: number
  start_time: string
  end_time: string
  created_at: string
  variants: Variant[]
}

export interface ExperimentMetrics {
  variant_id: string
  variant_name: string
  impressions: number
  clicks: number
  conversions: number
  ctr: number
  cvr: number
  revenue: number
}

// ─── Try Rule ─────────────────────────────────────────────────────────────────

export interface TryRuleInput {
  zalopayId: string
  platform: string
  os: string
  appVersion: string
  extraInfo: string
}

export interface TryRuleResult {
  matched: boolean
  result_value: string
  rule_breakdown: {
    rule_group_name: string
    matched: boolean
    conditions: { fact: string; operator: string; value: string; passed: boolean }[]
  }[]
}

// ─── Fact definitions ─────────────────────────────────────────────────────────

export type FactValueType = 'text' | 'number' | 'dropdown' | 'multi_select'

export interface FactDefinition {
  name: string
  label: string
  value_type: FactValueType
  options?: string[]
}
