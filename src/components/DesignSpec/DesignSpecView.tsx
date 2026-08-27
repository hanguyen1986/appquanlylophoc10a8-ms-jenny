import React, { useState } from 'react';
import { 
  BookOpenCheck, 
  Layers, 
  Layout, 
  Smartphone, 
  Monitor, 
  CheckCircle2, 
  Palette, 
  Type, 
  MousePointer, 
  ShieldCheck, 
  Sparkles,
  ChevronRight,
  ArrowRight,
  GitFork,
  Compass,
  FileCheck
} from 'lucide-react';

export const DesignSpecView: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'vision' | 'ia' | 'modules' | 'design_system' | 'responsive' | 'roadmap'>('vision');

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 p-6 rounded-3xl border border-slate-700/80 shadow-md text-white">
        <div className="flex items-center gap-2 mb-2">
          <span className="px-3 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/40">
            Hồ Sơ Thiết Kế Chuyên Gia UI/UX & Sản Phẩm EdTech
          </span>
        </div>
        <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
          Kiến Trúc Thông Tin & Đặc Tả Thiết Kế Hệ Thống Quản Lý Lớp Chủ Nhiệm (EduMaster VN)
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed max-w-3xl">
          Giải pháp công nghệ giáo dục chuyên sâu giải phóng giáo viên chủ nhiệm khỏi 70% áp lực hành chính giấy tờ, tối ưu hóa quy trình nhập liệu 1-chạm và nâng cao chất lượng đồng hành cùng học sinh.
        </p>
      </div>

      {/* Navigation Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {[
          { id: 'vision', label: '1. Tầm nhìn & Nguyên tắc' },
          { id: 'ia', label: '2. Kiến trúc thông tin (IA)' },
          { id: 'modules', label: '3. Thiết kế 7 Phân hệ UI/UX' },
          { id: 'design_system', label: '4. Yếu tố thiết kế chung' },
          { id: 'responsive', label: '5. Tối ưu Đa nền tảng' },
          { id: 'roadmap', label: '6. Kết luận & Lộ trình' },
        ].map((sec) => (
          <button
            key={sec.id}
            onClick={() => setActiveSection(sec.id as any)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeSection === sec.id
                ? 'bg-emerald-600 text-white shadow-sm ring-1 ring-emerald-500'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {sec.label}
          </button>
        ))}
      </div>

      {/* SECTION 1: VISION & PRINCIPLES */}
      {activeSection === 'vision' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6 text-slate-800 text-sm">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Compass className="w-5 h-5 text-emerald-600" />
              1. Giới Thiệu Chung & Tầm Nhìn Thiết Kế (Teacher-Centric Design)
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Định vị sản phẩm: Nền tảng trợ lý số toàn diện của Giáo viên Chủ nhiệm phổ thông tại Việt Nam
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 space-y-2">
              <h3 className="font-bold text-emerald-900 text-sm">🎯 Vấn đề cốt lõi của GVCN</h3>
              <ul className="list-disc list-inside text-xs text-emerald-950 space-y-1 leading-relaxed">
                <li>Phải ghi chép phân tán trên nhiều sổ tay: Sổ điểm danh, Sổ đầu bài, Sổ theo dõi nề nếp, Sổ điểm bộ môn.</li>
                <li>Mất trung bình 45–60 phút mỗi tuần để tổng hợp thủ công báo cáo thi đua và tính điểm ĐTB.</li>
                <li>Khó theo dõi liên tục sự biến động về tâm lý, sức khỏe và hoàn cảnh khó khăn của học sinh.</li>
                <li>Kênh liên lạc với phụ huynh rời rạc giữa tin nhắn SMS, nhóm Zalo và các cuộc gọi khẩn cấp.</li>
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-sky-50/60 border border-sky-200/80 space-y-2">
              <h3 className="font-bold text-sky-900 text-sm">💡 Giải pháp của EduMaster VN</h3>
              <ul className="list-disc list-inside text-xs text-sky-950 space-y-1 leading-relaxed">
                <li><strong>Gom tụ một điểm chạm (Single Source of Truth):</strong> Toàn bộ 5 hồ sơ thành phần nằm trong một trang quản trị.</li>
                <li><strong>Cơ chế Nhập liệu 1-Chạm (Micro-interactions):</strong> Điểm danh tức thì chỉ bằng 1 cú chạm chuyển trạng thái.</li>
                <li><strong>Tự động hóa báo cáo (Zero-admin overhead):</strong> Tự động tính ĐTB, sinh báo cáo tuần/tháng theo biểu mẫu Bộ GD&ĐT.</li>
                <li><strong>Sổ liên lạc đa kênh thông minh:</strong> Gửi thông báo kèm xác nhận đã đọc và lịch hẹn trực tuyến tự động.</li>
              </ul>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-slate-900 text-sm mb-3">4 Nguyên Tắc Thiết Kế Trọng Tâm (Core Design Pillars)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-emerald-700 text-sm block mb-1">1. Trực quan (Visual First)</span>
                <p className="text-slate-600 leading-relaxed">
                  Sử dụng màu sắc ngữ cảnh (Xanh = Đủ, Vàng = Phép, Đỏ = K.Phép/Cảnh báo) và biểu đồ phổ điểm trực quan giúp nhận diện tức thì tình trạng lớp.
                </p>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-sky-700 text-sm block mb-1">2. Khoa học (Educational Logic)</span>
                <p className="text-slate-600 leading-relaxed">
                  Tuân thủ chuẩn quy chế đánh giá xếp loại học sinh theo Thông tư 22/2021/TT-BGDĐT và chuẩn mẫu báo cáo sư phạm tại các trường THCS/THPT.
                </p>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-amber-700 text-sm block mb-1">3. Tối giản (Minimal Clicks)</span>
                <p className="text-slate-600 leading-relaxed">
                  Triệt tiêu các bước điền form rườm rà. Thiết lập sẵn các mẫu soạn sẵn, gợi ý tự động và tính toán điểm trung bình theo thời gian thực.
                </p>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-purple-700 text-sm block mb-1">4. Linh hoạt (Cross-device)</span>
                <p className="text-slate-600 leading-relaxed">
                  Trải nghiệm mượt mà trên điện thoại của GVCN khi đứng lớp và tối ưu hóa dashboard phân tích mở rộng khi làm việc trên máy tính bàn.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: INFORMATION ARCHITECTURE */}
      {activeSection === 'ia' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6 text-slate-800 text-sm">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-emerald-600" />
              2. Kiến Trúc Thông Tin (Information Architecture - IA)
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Mô hình phân cấp dữ liệu 3 tầng (Lớp học → Phân hệ nghiệp vụ → Hồ sơ chi tiết / Thao tác tương tác)
            </p>
          </div>

          {/* Sơ đồ IA Tree */}
          <div className="p-4 rounded-2xl bg-slate-900 text-white font-mono text-xs overflow-x-auto space-y-3">
            <div className="text-emerald-400 font-bold text-sm">CẤU TRÚC ĐIỀU HƯỚNG TỔNG THỂ (GLOBAL NAVIGATION TREE)</div>
            <div className="text-slate-300 leading-loose">
              ├── <strong>[TẦNG 1: GLOBAL HEADER]</strong> (Bộ chọn Lớp: 10A8, 11B2... | Học kỳ: HK1/HK2 | Tìm kiếm nhanh | Thao tác 1-chạm)<br />
              │<br />
              ├── <strong>[TẦNG 2: 7 PHÂN HỆ NGHIỆP VỤ CỐT LÕI]</strong><br />
              │   ├── <strong>3.1. Dashboard Tổng quan:</strong> Sĩ số tức thời, Điểm thi đua, Cảnh báo học sinh nguy cơ, Việc cần làm hôm nay.<br />
              │   ├── <strong>3.2. Quản lý Hồ sơ HS:</strong> Grid / Table view, Bộ lọc theo Tổ & Học lực, Drawer 5 tab chi tiết.<br />
              │   ├── <strong>3.3. Chuyên cần & Nề nếp:</strong> Điểm danh ngày/buổi, Ghi nhận vi phạm/tuyên dương, Xếp hạng thi đua 4 Tổ.<br />
              │   ├── <strong>3.4. Điểm số & Tiến độ:</strong> Ma trận điểm 10 môn, ĐTB tự động theo TT22, Biểu đồ phổ điểm, AI gợi ý nhận xét.<br />
              │   ├── <strong>3.5. Liên lạc Phụ huynh:</strong> Thông báo toàn lớp, Nhắn tin riêng từng PH, Lịch hẹn tiếp PH trực tiếp & Meet.<br />
              │   ├── <strong>3.6. Lịch & Nhắc việc:</strong> Thời khóa biểu, Lịch báo giảng, Sổ To-do list phân cấp khẩn cấp.<br />
              │   └── <strong>3.7. Báo cáo Thống kê:</strong> Sơ kết tuần/tháng/học kỳ, Bản in PDF chuẩn mẫu A4, Xuất file Excel (.xlsx).<br />
              │<br />
              └── <strong>[TẦNG 3: SUB-MODALS & ACTIONS]</strong> (Chỉnh sửa hồ sơ, Thêm sự kiện nề nếp, Tạo lịch hẹn, Trích lục in ấn)
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: 7 MODULES DETAILED UI/UX */}
      {activeSection === 'modules' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6 text-slate-800 text-sm">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Layout className="w-5 h-5 text-emerald-600" />
              3. Đặc Tả Thiết Kế UI/UX Chi Tiết Theo 7 Phân Hệ Chức Năng
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Phân tích các thành phần UI, luồng tương tác và tối ưu hóa trải nghiệm người dùng
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                num: '3.1',
                title: 'Trang Tổng Quan (Homeroom Dashboard)',
                target: 'Giúp GVCN nắm trọn tình hình lớp học chỉ trong 10 giây đầu ngày.',
                ui: '4 Thẻ chỉ số KPI (Sĩ số, Vắng, Thi đua, Việc cần làm); Biểu đồ cột chuyên cần tuần; Biểu đồ tròn xếp loại học lực; Widget điểm danh nhanh 1-chạm; Danh sách cảnh báo học sinh cần quan tâm đặc biệt.',
                ux: 'Hỗ trợ thao tác điểm danh trực tiếp không cần chuyển trang, các thẻ học sinh cần quan tâm bấm vào sẽ kích hoạt ngay Drawer hồ sơ.',
              },
              {
                num: '3.2',
                title: 'Quản Lý Hồ Sơ Học Sinh (Student Profiles Master)',
                target: 'Lưu trữ toàn diện 5 khía cạnh của học sinh: Lý lịch, Phụ huynh, Gia cảnh, Tâm lý & Sức khỏe.',
                ui: 'Thanh tìm kiếm thông minh kết hợp lọc đa chiều (theo Tổ 1-4, Học lực, Cán sự, diện cần lưu ý); Chuyển đổi linh hoạt giữa Dạng Thẻ (Grid View) và Dạng Bảng (Table View); Drawer chi tiết 5 Tab phân định rõ ràng.',
                ux: 'Cảnh báo nổi bật với học sinh có lưu ý dị ứng thuốc hoặc có biến động tâm lý gia đình; hỗ trợ gọi điện thoại và gửi tin nhắn cho phụ huynh bằng 1 click.',
              },
              {
                num: '3.3',
                title: 'Theo Dõi Chuyên Cần & Nề Nếp Kỷ Luật',
                target: 'Quản lý điểm danh theo thời gian thực và tự động tính điểm thi đua nề nếp cho 4 Tổ.',
                ui: 'Bảng điểm danh ngày chia buổi Sáng/Chiều với nút chọn trạng thái (Có mặt / Phép / K.Phép / Muộn); Nút "Đánh dấu có mặt tất cả"; Bảng xếp hạng thi đua 4 Tổ với biểu đồ thanh tiến độ; Form ghi nhận vi phạm/khen thưởng với thang điểm định sẵn.',
                ux: 'Tự động kích hoạt thông báo SMS/App tới phụ huynh khi học sinh vắng hoặc đi muộn; Tự động cộng/trừ điểm thi đua vào bảng xếp hạng tổ tương ứng.',
              },
              {
                num: '3.4',
                title: 'Quản Lý Tiến Độ Học Tập & Sổ Điểm Tổng Hợp',
                target: 'Nhập điểm trực quan, tự động tính ĐTB và dự báo nguy cơ sa sút học tập.',
                ui: 'Thanh cuộn chọn môn học; Bảng nhập điểm chi tiết với các cột Điểm Miệng, 15 Phút, Giữa Kỳ (H2), Cuối Kỳ (H3); Cột tính ĐTB Môn và ĐTB Chung tự động; Phổ điểm trực quan; AI Smart Assistant gợi ý lời phê học bạ.',
                ux: 'Hỗ trợ phím tắt điều hướng nhanh giữa các ô điểm (Enter / Tab); Phát hiện và gắn cờ cảnh báo đối với học sinh có điểm dưới 5.0.',
              },
              {
                num: '3.5',
                title: 'Công Cụ Liên Lạc Thông Minh Giáo Viên - Phụ Huynh',
                target: 'Giao tiếp đa kênh minh bạch, bảo mật và lưu vết lịch sử tương tác.',
                ui: 'Trình soạn thông báo lớp tích hợp thư viện mẫu (Mẫu mời họp, nhắc nhở, khen thưởng); Bộ chọn kênh gửi (App EduMaster / SMS / Zalo OA); Quản lý lịch hẹn tiếp phụ huynh (Trực tiếp / Google Meet).',
                ux: 'Hiển thị trạng thái đã nhận / đã đọc của phụ huynh; Phụ huynh xác nhận lịch hẹn sẽ tự động đồng bộ vào Lịch công tác của giáo viên.',
              },
              {
                num: '3.6',
                title: 'Hệ Thống Nhắc Lịch Công Tác & Sổ Việc',
                target: 'Giải quyết tình trạng quên lịch họp, trễ hạn nộp sổ điểm hoặc bỏ sót sự kiện phong trào.',
                ui: 'Chuyển đổi giữa Sổ Việc Cần Làm (To-do List phân loại theo mức độ ưu tiên) và Lịch Tuần (Timeline); Thời khóa biểu lớp 10A8 cố định.',
                ux: 'Đánh dấu hoàn thành việc nhanh bằng checkbox với hiệu ứng trực quan; phân loại màu sắc công việc theo tính chất.',
              },
              {
                num: '3.7',
                title: 'Báo Cáo Thống Kê Định Kỳ Chuẩn Mẫu',
                target: 'Tự động tạo báo cáo sơ kết tuần, tháng và học kỳ chuẩn biểu mẫu hành chính Bộ GD&ĐT.',
                ui: 'Khu vực cấu hình tham số báo cáo; Bản xem trước trang giấy in A4 hoàn chỉnh có đầy đủ quốc hiệu, tiêu ngữ, bảng biểu và chữ ký; Nút xuất file Excel và In trực tiếp.',
                ux: 'Tự động đổ số liệu chuyên cần, nề nếp và học lực từ các phân hệ vào bản báo cáo mà giáo viên không phải gõ lại tay.',
              },
            ].map((m, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-emerald-600 text-white font-bold">{m.num}</span>
                  <h3 className="font-bold text-slate-900 text-sm">{m.title}</h3>
                </div>
                <p className="text-slate-700"><strong>Mục tiêu:</strong> {m.target}</p>
                <p className="text-slate-700"><strong>Thành phần UI:</strong> {m.ui}</p>
                <p className="text-emerald-800"><strong>Điểm sáng UX:</strong> {m.ux}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 4: DESIGN SYSTEM & GENERAL UI ELEMENTS */}
      {activeSection === 'design_system' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6 text-slate-800 text-sm">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Palette className="w-5 h-5 text-emerald-600" />
              4. Các Yếu Tố Thiết Kế Chung (Design System & Design Tokens)
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Bảng quy chuẩn màu sắc, kiểu chữ và các thành phần giao diện kiểm soát tính đồng bộ
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <h3 className="font-bold text-slate-900">Bảng màu Giáo dục (Palette)</h3>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between p-1.5 rounded bg-emerald-600 text-white font-semibold">
                  <span>Emerald / Mint (#059669)</span>
                  <span>Màu chủ đạo (Primary)</span>
                </div>
                <div className="flex items-center justify-between p-1.5 rounded bg-slate-900 text-white font-semibold">
                  <span>Slate (#0f172a)</span>
                  <span>Thanh điều hướng & Header</span>
                </div>
                <div className="flex items-center justify-between p-1.5 rounded bg-amber-500 text-white font-semibold">
                  <span>Amber (#f59e0b)</span>
                  <span>Thi đua & Cảnh báo</span>
                </div>
                <div className="flex items-center justify-between p-1.5 rounded bg-rose-600 text-white font-semibold">
                  <span>Rose (#e11d48)</span>
                  <span>Vắng k.phép & Y tế khẩn</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <h3 className="font-bold text-slate-900">Typography & Tỷ lệ</h3>
              <ul className="list-disc list-inside text-slate-600 space-y-1 leading-relaxed">
                <li>Font hệ thống tối ưu tiếng Việt (Inter / Plus Jakarta Sans).</li>
                <li>H1 Tiêu đề trang: 20–24px (Bold 700).</li>
                <li>H2 / H3 Phân mục: 14–16px (Semibold 600).</li>
                <li>Body văn bản & Bảng: 12–14px (Regular 400).</li>
                <li>Nhãn tag / Badge trạng thái: 10–11px (Bold 700).</li>
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <h3 className="font-bold text-slate-900">Tối ưu hóa Nhập liệu</h3>
              <ul className="list-disc list-inside text-slate-600 space-y-1 leading-relaxed">
                <li>Trường số tự động validate phạm vi điểm 0.0 - 10.0.</li>
                <li>Autocomplete và chip chọn nhanh cho năng khiếu & tính cách.</li>
                <li>Thao tác xác nhận có dialog phản hồi trực quan, ngăn chặn xóa nhầm dữ liệu học sinh.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 5: RESPONSIVE DESIGN */}
      {activeSection === 'responsive' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6 text-slate-800 text-sm">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-emerald-600" />
              5. Khả Năng Hiển Thị Tối Ưu Trên Đa Nền Tảng (Responsive Architecture)
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Chiến lược thích ứng giao diện từ điện thoại thông minh (Mobile) đến máy tính bàn (Desktop)
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                <Smartphone className="w-4 h-4 text-emerald-600" />
                <h3>Phiên bản Di động (Mobile / Smartphone)</h3>
              </div>
              <ul className="list-disc list-inside text-slate-700 space-y-1.5 leading-relaxed">
                <li><strong>Thao tác 1 tay (Thumb-Zone Friendly):</strong> Các nút bấm điểm danh và gọi điện thoại cho phụ huynh có kích thước tối thiểu 44x44px.</li>
                <li><strong>Bố cục dạng Thẻ cuộn dọc:</strong> Chuyển đổi các bảng biểu phức tạp thành danh thiếp học sinh với các thông tin cốt lõi nhất.</li>
                <li><strong>Bottom Navigation Bar:</strong> Thanh điều hướng 5 tab gắn đáy màn hình giúp chuyển nhanh giữa Tổng quan, Hồ sơ, Điểm danh, Sổ điểm và Tin nhắn.</li>
              </ul>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                <Monitor className="w-4 h-4 text-sky-600" />
                <h3>Phiên bản Máy tính / Web (Desktop & Tablet)</h3>
              </div>
              <ul className="list-disc list-inside text-slate-700 space-y-1.5 leading-relaxed">
                <li><strong>Dashboard mở rộng (Multi-column):</strong> Hiển thị song song biểu đồ thống kê, bảng điểm danh và sổ nhắc việc trên cùng một màn hình rộng.</li>
                <li><strong>Nhập liệu tốc độ cao bằng bàn phím:</strong> Hỗ trợ phím mũi tên, Tab, Enter để giáo viên nhập điểm một mạch cho cả 36 học sinh.</li>
                <li><strong>Trình xem trước Báo cáo A4 & In ấn:</strong> Chế độ xem trang in đúng chuẩn hành chính, không bị vỡ layout khi in ra giấy hoặc xuất PDF.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 6: ROADMAP & CONCLUSION */}
      {activeSection === 'roadmap' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6 text-slate-800 text-sm">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-emerald-600" />
              6. Kết Luận & Lộ Trình Phát Triển Sản Phẩm (Product Roadmap)
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Kế hoạch đưa sản phẩm vào ứng dụng thực tế tại các trường học Việt Nam
            </p>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200">
              <span className="font-bold text-emerald-900 text-xs block mb-1">Giai đoạn 1: Interactive High-Fidelity Prototype (Hiện tại)</span>
              <p className="text-emerald-800 leading-relaxed">
                Hoàn thiện bản mẫu tương tác thực tế với đầy đủ 7 phân hệ, cấu trúc dữ liệu chuẩn sư phạm, ma trận điểm, và cơ chế mô phỏng responsive đa thiết bị.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="font-bold text-slate-900 text-xs block mb-1">Giai đoạn 2: Thử nghiệm thực địa & Đánh giá mức độ hài lòng (Teacher Usability Testing)</span>
              <p className="text-slate-600 leading-relaxed">
                Triển khai thí điểm tại 5 trường THPT (20 lớp học) để đo lường thời gian tiết kiệm được trong quy trình điểm danh và sơ kết tuần của GVCN.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="font-bold text-slate-900 text-xs block mb-1">Giai đoạn 3: Tích hợp Cơ sở dữ liệu ngành & Trợ lý AI Giáo dục</span>
              <p className="text-slate-600 leading-relaxed">
                Đồng bộ hai chiều với CSDL ngành của Bộ Giáo dục & Đào tạo (SMAS / vnEdu / eNetViet) và tích hợp AI phân tích hành vi học tập sớm để ngăn ngừa nguy cơ bỏ học.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

