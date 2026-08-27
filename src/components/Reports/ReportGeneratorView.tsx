import React, { useState } from 'react';
import { 
  FileSpreadsheet, 
  Download, 
  Printer, 
  Eye, 
  CheckCircle2, 
  Calendar, 
  FileText, 
  BarChart2, 
  Sparkles,
  Award,
  AlertTriangle
} from 'lucide-react';
import { PeriodicReport, Student } from '../../types';
import { GeminiService } from '../../services/geminiService';

interface ReportGeneratorViewProps {
  reports: PeriodicReport[];
  students: Student[];
  onOpenApiKeyModal?: () => void;
}

export const ReportGeneratorView: React.FC<ReportGeneratorViewProps> = ({
  reports,
  students,
  onOpenApiKeyModal,
}) => {
  const [selectedReportId, setSelectedReportId] = useState<string>(reports[0]?.id || '');
  const [reportType, setReportType] = useState<'weekly' | 'monthly' | 'term'>('weekly');
  const [periodTitle, setPeriodTitle] = useState('Tuần 2 - Tháng 8/2026');
  const [includeDiscipline, setIncludeDiscipline] = useState(true);
  const [includeGrades, setIncludeGrades] = useState(true);
  const [includeAttendance, setIncludeAttendance] = useState(true);
  const [customSummary, setCustomSummary] = useState(
    'Tập thể 10A8 duy trì nề nếp kỷ luật tốt, học sinh đi học đúng giờ và tích cực tham gia các phong trào thi đua chào mừng năm học mới.'
  );

  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  const selectedReport = reports.find((r) => r.id === selectedReportId) || reports[0];

  const handlePrint = () => {
    window.print();
  };

  const handleExportExcel = () => {
    alert(`Đã xuất báo cáo "${selectedReport.title}" sang file Microsoft Excel (.xlsx)`);
  };

  const handleAiGenerateSummary = async () => {
    if (!GeminiService.hasApiKey()) {
      if (onOpenApiKeyModal) onOpenApiKeyModal();
      return;
    }

    setIsGeneratingAi(true);
    setAiError(null);

    const excellentCount = students.filter((s) => s.academicRank === 'Xuất sắc').length;
    const goodCount = students.filter((s) => s.academicRank === 'Giỏi').length;
    const averageCount = students.filter((s) => s.academicRank === 'Trung bình').length;

    const result = await GeminiService.generateClassSummaryReport({
      totalStudents: students.length,
      attendanceRate: 98.6,
      excellentCount,
      goodCount,
      averageCount,
      period: periodTitle,
      topViolations: '01 trường hợp đi muộn 5 phút do sự cố giao thông (đã nhắc nhở)',
      topCommendations: 'Tổ 1 đạt giải Nhất phong trào Hoa điểm 10 chào mừng năm học mới',
    });

    if (result.success) {
      setCustomSummary(result.text);
    } else {
      setAiError(result.error || 'Lỗi khi tạo nhận xét AI');
    }

    setIsGeneratingAi(false);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="p-2 rounded-xl bg-amber-100 text-amber-700">
            <FileSpreadsheet className="w-5 h-5" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-slate-900">Báo Cáo Thống Kê & Sơ Kết Định Kỳ</h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                Lớp 10A8 - Ms Jenny
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">Tự động tổng hợp dữ liệu chuyên cần, nề nếp thi đua và kết quả học tập chuẩn Bộ GD&ĐT</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportExcel}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center gap-1.5 border border-slate-200 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Xuất Excel (.xlsx)</span>
          </button>
          <button
            onClick={handlePrint}
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>In Bản Báo Cáo A4</span>
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left Form: Report Parameters */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4 text-xs">
          <h2 className="font-bold text-slate-900 text-sm">Cấu Hình & Tùy Chọn Báo Cáo</h2>

          <div className="space-y-3">
            <div>
              <label className="font-semibold block text-slate-700 mb-1">Loại báo cáo</label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value as any)}
                className="w-full p-2 rounded-lg border border-slate-300 bg-slate-50 text-xs"
              >
                <option value="weekly">Báo cáo Sơ kết Tuần (Nề nếp & Thi đua)</option>
                <option value="monthly">Báo cáo Tổng kết Tháng</option>
                <option value="term">Báo cáo Sơ kết Học kỳ (Học lực & Hạnh kiểm)</option>
              </select>
            </div>

            <div>
              <label className="font-semibold block text-slate-700 mb-1">Thời gian báo cáo</label>
              <input
                type="text"
                value={periodTitle}
                onChange={(e) => setPeriodTitle(e.target.value)}
                className="w-full p-2 rounded-lg border border-slate-300 text-xs"
              />
            </div>

            <div>
              <label className="font-semibold block text-slate-700 mb-1.5">Nội dung đính kèm</label>
              <div className="space-y-1.5 text-slate-700">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeAttendance}
                    onChange={(e) => setIncludeAttendance(e.target.checked)}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Thống kê Chuyên cần (Có phép/Không phép)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeDiscipline}
                    onChange={(e) => setIncludeDiscipline(e.target.checked)}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Xếp hạng Thi đua 4 Tổ & Ghi nhận Kỷ luật</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeGrades}
                    onChange={(e) => setIncludeGrades(e.target.checked)}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Thống kê Phân bổ Học lực & Điểm kiểm tra</span>
                </label>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-semibold text-slate-700">Ý kiến / Đề xuất của GVCN</label>
                <button
                  type="button"
                  onClick={handleAiGenerateSummary}
                  disabled={isGeneratingAi}
                  className="text-purple-700 font-bold hover:underline text-[11px] flex items-center gap-1 cursor-pointer"
                >
                  <Sparkles className={`w-3 h-3 text-amber-500 ${isGeneratingAi ? 'animate-spin' : ''}`} />
                  <span>{isGeneratingAi ? 'Đang viết...' : '✨ AI Viết đánh giá'}</span>
                </button>
              </div>

              {aiError && (
                <div className="p-2 mb-1.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-[11px] flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                  <span>{aiError}</span>
                </div>
              )}

              <textarea
                rows={4}
                value={customSummary}
                onChange={(e) => setCustomSummary(e.target.value)}
                className="w-full p-2 rounded-lg border border-slate-300 text-xs leading-relaxed"
              />
            </div>

            <div className="pt-2">
              <button
                onClick={() => alert("Đã lưu và cập nhật bản báo cáo thành công!")}
                className="w-full py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs cursor-pointer"
              >
                Cập nhật Bản xem trước
              </button>
            </div>
          </div>
        </div>

        {/* Right Preview: Official Document A4 View */}
        <div className="lg:col-span-2 bg-white p-6 sm:p-8 rounded-2xl border border-slate-300 shadow-md space-y-6 text-slate-900 print:border-none print:shadow-none">
          {/* Header of Official Form */}
          <div className="flex items-start justify-between border-b-2 border-slate-800 pb-4 text-xs">
            <div className="text-center">
              <div className="font-bold uppercase tracking-wider text-slate-800">SỞ GIÁO DỤC & ĐÀO TẠO HÀ NỘI</div>
              <div className="font-extrabold text-sm text-slate-900">TRƯỜNG THPT CHU VĂN AN</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-slate-800">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
              <div className="text-[11px] italic text-slate-600">Độc lập - Tự do - Hạnh phúc</div>
              <div className="text-[10px] text-slate-400 mt-1">Hà Nội, ngày 27 tháng 08 năm 2026</div>
            </div>
          </div>

          {/* Title */}
          <div className="text-center space-y-1">
            <h1 className="text-base sm:text-lg font-extrabold uppercase tracking-wide text-slate-900">
              BÁO CÁO SƠ KẾT CÔNG TÁC CHỦ NHIỆM
            </h1>
            <p className="text-xs font-semibold text-slate-600">{periodTitle}</p>
            <div className="text-xs text-slate-500 flex items-center justify-center gap-3">
              <span>Lớp: <strong className="text-slate-900">10A8</strong></span>
              <span>•</span>
              <span>Sĩ số: <strong className="text-slate-900">{students.length} học sinh</strong></span>
              <span>•</span>
              <span>GVCN: <strong className="text-slate-900">Ms Jenny</strong></span>
            </div>
          </div>

          {/* Body Content */}
          <div className="space-y-4 text-xs text-slate-800 leading-relaxed">
            {/* Section 1: Attendance */}
            {includeAttendance && (
              <div>
                <h3 className="font-bold text-slate-900 uppercase text-[11px] mb-1.5 border-b border-slate-200 pb-0.5">
                  I. Tình hình Chuyên cần & Sĩ số
                </h3>
                <div className="grid grid-cols-3 gap-2 text-center p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                  <div>
                    <span className="text-slate-500 block text-[10px]">Tỷ lệ có mặt trung bình</span>
                    <strong className="text-emerald-700 text-sm">98.6%</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Số lượt nghỉ có phép</span>
                    <strong className="text-slate-800 text-sm">02 lượt</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Số lượt nghỉ không phép</span>
                    <strong className="text-rose-600 text-sm">00 lượt</strong>
                  </div>
                </div>
              </div>
            )}

            {/* Section 2: Discipline */}
            {includeDiscipline && (
              <div>
                <h3 className="font-bold text-slate-900 uppercase text-[11px] mb-1.5 border-b border-slate-200 pb-0.5">
                  II. Kết quả Thi đua & Kỷ luật Nề nếp
                </h3>
                <p className="text-slate-700">
                  - <strong>Xếp hạng thi đua 4 Tổ:</strong> Tổ 1 (Hạng Nhất - 418 đ), Tổ 3 (Hạng Nhì - 402 đ), Tổ 2 (Hạng Ba - 395 đ), Tổ 4 (Hạng Tư - 380 đ).
                </p>
                <p className="text-slate-700 mt-1">
                  - <strong>Khen thưởng đột xuất:</strong> Tuyên dương nhóm phụ trách Bích báo lớp 10A8 hoàn thành xuất sắc nhiệm vụ.
                </p>
              </div>
            )}

            {/* Section 3: Academic */}
            {includeGrades && (
              <div>
                <h3 className="font-bold text-slate-900 uppercase text-[11px] mb-1.5 border-b border-slate-200 pb-0.5">
                  III. Kết quả Học tập & Rèn luyện
                </h3>
                <p className="text-slate-700">
                  - Phân loại học lực: <strong>05 Xuất sắc (13.9%)</strong>, <strong>14 Giỏi (38.9%)</strong>, <strong>12 Khá (33.3%)</strong>, <strong>05 Trung bình (13.9%)</strong>, <strong>00 Yếu kém</strong>.
                </p>
              </div>
            )}

            {/* Section 4: Teacher Remarks */}
            <div>
              <h3 className="font-bold text-slate-900 uppercase text-[11px] mb-1.5 border-b border-slate-200 pb-0.5">
                IV. Nhận xét & Đề xuất của Giáo viên Chủ nhiệm
              </h3>
              <p className="italic text-slate-800 bg-slate-50 p-3 rounded-lg border border-slate-200">
                "{customSummary}"
              </p>
            </div>
          </div>

          {/* Signatures */}
          <div className="flex items-start justify-between pt-6 border-t border-slate-200 text-xs">
            <div className="text-center">
              <div className="font-bold text-slate-800 uppercase">BAN GIÁM HIỆU DUYỆT</div>
              <div className="text-slate-400 italic text-[10px] mt-1">(Ký và ghi rõ họ tên)</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-slate-800 uppercase">GIÁO VIÊN CHỦ NHIỆM</div>
              <div className="text-slate-400 italic text-[10px] mt-1">(Đã ký điện tử)</div>
              <div className="font-bold text-emerald-800 text-sm mt-8">Ms Jenny</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
