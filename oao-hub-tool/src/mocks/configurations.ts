import type { MainConfiguration } from '../types'

export const mockConfigurations: MainConfiguration[] = [
  {
    id: 'cfg-001',
    bank_code: 'CATHAY',
    name: 'Cathay United Bank',
    status: 'ACTIVE',
    category: 'bank_account',
    extra_title: '<b>Ưu đãi mở tài khoản</b>',
    hero_banner: {
      enabled: true,
      title: 'Mở tài khoản Cathay',
      subtitle: 'Nhận ngay ưu đãi lãi suất cao nhất thị trường',
      image_url: 'https://placehold.co/800x300/1d4ed8/ffffff?text=Cathay+Banner',
    },
    freeze_banner: {
      enabled: true,
      title: 'Cathay United Bank',
      subtitle: 'Lãi suất 8.5%/năm',
    },
    base_card: {
      enabled: true,
      title: 'Cathay United Bank',
      subtitle: 'Tài khoản tiết kiệm lãi suất cao',
      title_color: '#ffffff',
      subtitle_color: '#e2e8f0',
      content_color: '#cbd5e1',
      bg_color: '#1d4ed8',
      bg_transparent: false,
      bg_image_url: '',
      logo_left_url: 'https://placehold.co/80x32/ffffff/1d4ed8?text=CATHAY',
      logo_right_url: '',
      top_right_shape_url: '',
    },
    explored_card: {
      enabled: true,
      badge: 'Hạn mức 40 triệu',
      description: '<ul><li>Lãi suất 8.5%/năm</li><li>Miễn phí chuyển khoản</li><li>Rút tiền miễn phí</li></ul>',
    },
    detail_block: {
      enabled: true,
      top_image_url: 'https://placehold.co/600x200/e2e8f0/64748b?text=Detail+Image',
      content_primary: '<h2>Quyền lợi nổi bật</h2><ul><li>Lãi suất 8.5%/năm</li><li>Không phí duy trì</li></ul>',
      content_secondary: '<h2>Điều kiện</h2><ul><li>Tuổi từ 18-60</li><li>Có CCCD</li></ul>',
    },
    cta_list: [
      { id: 'cta-001', cta_name: 'CONFIRM_CONDITION', button_name: 'Mở ngay', action: 'CONFIRM_CONDITION', description: 'CTA chính cho user đủ điều kiện', zpa_link: '', zpi_link: '', extra_info: '{}' },
      { id: 'cta-002', cta_name: 'NOT_ELIGIBLE', button_name: 'Tìm hiểu thêm', action: 'DEEPLINK', description: 'Cho user không đủ điều kiện', zpa_link: 'https://cathaybank.com.vn', zpi_link: '', extra_info: '{}' },
    ],
    // Partner content
    description: 'Trang chi tiết cho Cathay United Bank',
    header_title: 'Mở tài khoản ngân hàng Cathay United',
    header_image_url: 'https://placehold.co/200x60/1d4ed8/ffffff?text=CATHAY+LOGO',
    main_content: `<h2>Quyền lợi nổi bật</h2>
<ul>
  <li>Lãi suất tiết kiệm lên đến 8.5%/năm</li>
  <li>Miễn phí chuyển khoản nội địa không giới hạn</li>
  <li>Thẻ ATM miễn phí năm đầu</li>
  <li>Rút tiền miễn phí tại 19,000+ ATM</li>
</ul>
<h2>Điều kiện tham gia</h2>
<ul>
  <li>Công dân Việt Nam từ 18-60 tuổi</li>
  <li>Có CCCD/CMND còn hiệu lực</li>
  <li>Có tài khoản ZaloPay active</li>
</ul>`,
    sub_content_list: [
      { id: 'sc-001', label: 'Xem điều khoản chương trình', zpa_link: 'https://cathaybank.com.vn/dieu-khoan', zpi_link: '' },
      { id: 'sc-002', label: 'Chính sách bảo mật', zpa_link: 'https://cathaybank.com.vn/bao-mat', zpi_link: 'https://cathaybank.com.vn/bao-mat-zalo' },
    ],
    guidances: [
      { id: 'g-001', content: 'Bước 1: Nhấn "Mở ngay" và xác nhận thông tin', image_url: 'https://placehold.co/300x200/dbeafe/1d4ed8?text=Step+1', order: 1 },
      { id: 'g-002', content: 'Bước 2: Chụp ảnh CCCD và xác thực khuôn mặt', image_url: 'https://placehold.co/300x200/dbeafe/1d4ed8?text=Step+2', order: 2 },
      { id: 'g-003', content: 'Bước 3: Tài khoản được mở trong vòng 5 phút', image_url: 'https://placehold.co/300x200/dbeafe/1d4ed8?text=Step+3', order: 3 },
    ],
    created_by: 'admin@zalopay.vn',
    created_at: '2025-01-10T08:00:00Z',
    updated_at: '2025-03-15T10:30:00Z',
    version: 3,
  },
  {
    id: 'cfg-002',
    bank_code: 'MSB',
    name: 'Maritime Bank — Vay tiêu dùng',
    status: 'ACTIVE',
    category: 'loan',
    extra_title: '',
    hero_banner: {
      enabled: true,
      title: 'Vay tiêu dùng MSB',
      subtitle: 'Giải ngân trong 24 giờ, lãi suất từ 1.2%/tháng',
      image_url: 'https://placehold.co/800x300/059669/ffffff?text=MSB+Banner',
    },
    freeze_banner: {
      enabled: true,
      title: 'MSB — Vay tiêu dùng',
      subtitle: 'Lãi suất từ 1.2%/tháng',
    },
    base_card: {
      enabled: true,
      title: 'Maritime Bank',
      subtitle: 'Vay tiêu dùng linh hoạt',
      title_color: '#ffffff',
      subtitle_color: '#d1fae5',
      content_color: '#a7f3d0',
      bg_color: '#059669',
      bg_transparent: false,
      bg_image_url: '',
      logo_left_url: 'https://placehold.co/80x32/ffffff/059669?text=MSB',
      logo_right_url: '',
      top_right_shape_url: '',
    },
    explored_card: {
      enabled: true,
      badge: 'Vay đến 200 triệu',
      description: '<ul><li>Lãi suất từ 1.2%/tháng</li><li>Giải ngân trong 24h</li><li>Không cần tài sản đảm bảo</li></ul>',
    },
    detail_block: {
      enabled: true,
      top_image_url: 'https://placehold.co/600x200/d1fae5/059669?text=MSB+Detail',
      content_primary: '<h2>Quyền lợi</h2><ul><li>Vay tối đa 200 triệu</li><li>Trả góp 12-60 tháng</li></ul>',
      content_secondary: '',
    },
    cta_list: [
      { id: 'cta-003', cta_name: 'CONFIRM_CONDITION', button_name: 'Vay ngay', action: 'CONFIRM_CONDITION', description: '', zpa_link: '', zpi_link: '', extra_info: '{}' },
    ],
    // Partner content
    description: 'Trang chi tiết vay tiêu dùng MSB',
    header_title: 'Vay tiêu dùng trực tuyến Maritime Bank',
    header_image_url: 'https://placehold.co/200x60/059669/ffffff?text=MSB+LOGO',
    main_content: `<h2>Quyền lợi nổi bật</h2>
<ul>
  <li>Vay tối đa 200 triệu đồng</li>
  <li>Lãi suất từ 1.2%/tháng</li>
  <li>Giải ngân trong 24 giờ làm việc</li>
  <li>Trả góp linh hoạt 12-60 tháng</li>
  <li>Không cần tài sản đảm bảo</li>
</ul>
<h2>Điều kiện</h2>
<ul>
  <li>Tuổi từ 22-60</li>
  <li>Thu nhập tối thiểu 5 triệu/tháng</li>
  <li>Không có nợ xấu</li>
</ul>`,
    sub_content_list: [
      { id: 'sc-003', label: 'Xem điều khoản vay', zpa_link: 'https://msb.com.vn/vay/dieu-khoan', zpi_link: '' },
    ],
    guidances: [
      { id: 'g-004', content: 'Điền thông tin cá nhân và khoản vay', image_url: 'https://placehold.co/300x200/d1fae5/059669?text=Step+1', order: 1 },
      { id: 'g-005', content: 'Upload CCCD và xác thực eKYC', image_url: 'https://placehold.co/300x200/d1fae5/059669?text=Step+2', order: 2 },
    ],
    created_by: 'po@zalopay.vn',
    created_at: '2025-02-01T09:00:00Z',
    updated_at: '2025-03-20T14:00:00Z',
    version: 2,
  },
  {
    id: 'cfg-003',
    bank_code: 'VPB_CC',
    name: 'VPBank Credit Card',
    status: 'DRAFT',
    category: 'credit_card',
    extra_title: '',
    hero_banner: { enabled: false, title: '', subtitle: '', image_url: '' },
    freeze_banner: { enabled: false, title: '', subtitle: '' },
    base_card: {
      enabled: true,
      title: 'VPBank',
      subtitle: 'Thẻ tín dụng hoàn tiền',
      title_color: '#1e3a8a',
      subtitle_color: '#334155',
      content_color: '#64748b',
      bg_color: '#ffffff',
      bg_transparent: false,
      bg_image_url: '',
      logo_left_url: 'https://placehold.co/80x32/1e3a8a/ffffff?text=VPB',
      logo_right_url: '',
      top_right_shape_url: '',
    },
    explored_card: {
      enabled: true,
      badge: '',
      description: '<ul><li>Hoàn tiền 2%</li><li>Miễn phí năm đầu</li></ul>',
    },
    detail_block: { enabled: false, top_image_url: '', content_primary: '', content_secondary: '' },
    cta_list: [
      { id: 'cta-004', cta_name: 'CONFIRM_CONDITION', button_name: 'Đăng ký ngay', action: 'CONFIRM_CONDITION', description: '', zpa_link: '', zpi_link: '', extra_info: '{}' },
    ],
    // Partner content (empty draft)
    description: '',
    header_title: '',
    header_image_url: '',
    main_content: '',
    sub_content_list: [],
    guidances: [],
    created_by: 'admin@zalopay.vn',
    created_at: '2025-03-25T10:00:00Z',
    updated_at: '2025-03-25T10:00:00Z',
    version: 1,
  },
]
