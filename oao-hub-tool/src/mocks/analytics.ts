export interface ConfigMetric {
  config_id: string
  bank_code: string
  bank_name: string
  category: string
  impressions: number
  clicks: number
  ctr: number        // %
  conversions: number
  cvr: number        // %
  avg_time_on_page: number // seconds
  // daily breakdown (last 7 days)
  daily: { date: string; impressions: number; clicks: number }[]
}

const today = new Date()
const last7 = Array.from({ length: 7 }, (_, i) => {
  const d = new Date(today)
  d.setDate(d.getDate() - (6 - i))
  return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })
})

export const mockAnalytics: ConfigMetric[] = [
  {
    config_id: 'cfg-001',
    bank_code: 'CATHAY',
    bank_name: 'Cathay United Bank',
    category: 'Bank Account',
    impressions: 142_500,
    clicks: 18_720,
    ctr: 13.1,
    conversions: 3_240,
    cvr: 17.3,
    avg_time_on_page: 74,
    daily: [
      { date: last7[0], impressions: 18_200, clicks: 2_310 },
      { date: last7[1], impressions: 19_400, clicks: 2_580 },
      { date: last7[2], impressions: 20_100, clicks: 2_750 },
      { date: last7[3], impressions: 21_500, clicks: 2_900 },
      { date: last7[4], impressions: 20_800, clicks: 2_640 },
      { date: last7[5], impressions: 22_300, clicks: 3_010 },
      { date: last7[6], impressions: 20_200, clicks: 2_530 },
    ],
  },
  {
    config_id: 'cfg-002',
    bank_code: 'MSB',
    bank_name: 'Maritime Bank',
    category: 'Loan',
    impressions: 98_300,
    clicks: 11_240,
    ctr: 11.4,
    conversions: 1_870,
    cvr: 16.6,
    avg_time_on_page: 91,
    daily: [
      { date: last7[0], impressions: 12_100, clicks: 1_350 },
      { date: last7[1], impressions: 13_500, clicks: 1_540 },
      { date: last7[2], impressions: 14_200, clicks: 1_620 },
      { date: last7[3], impressions: 15_100, clicks: 1_710 },
      { date: last7[4], impressions: 14_600, clicks: 1_660 },
      { date: last7[5], impressions: 15_900, clicks: 1_840 },
      { date: last7[6], impressions: 12_900, clicks: 1_520 },
    ],
  },
  {
    config_id: 'cfg-003',
    bank_code: 'VPB_CC',
    bank_name: 'VPBank',
    category: 'Credit Card',
    impressions: 31_200,
    clicks: 2_890,
    ctr: 9.3,
    conversions: 340,
    cvr: 11.8,
    avg_time_on_page: 58,
    daily: [
      { date: last7[0], impressions: 3_200, clicks: 280 },
      { date: last7[1], impressions: 4_100, clicks: 390 },
      { date: last7[2], impressions: 4_800, clicks: 450 },
      { date: last7[3], impressions: 5_100, clicks: 480 },
      { date: last7[4], impressions: 4_700, clicks: 430 },
      { date: last7[5], impressions: 5_200, clicks: 490 },
      { date: last7[6], impressions: 4_100, clicks: 370 },
    ],
  },
]

export const SUMMARY = {
  totalImpressions: mockAnalytics.reduce((s, m) => s + m.impressions, 0),
  totalClicks: mockAnalytics.reduce((s, m) => s + m.clicks, 0),
  totalConversions: mockAnalytics.reduce((s, m) => s + m.conversions, 0),
  avgCtr: parseFloat(
    (mockAnalytics.reduce((s, m) => s + m.ctr, 0) / mockAnalytics.length).toFixed(1)
  ),
}
