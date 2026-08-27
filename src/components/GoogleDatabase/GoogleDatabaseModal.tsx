import React, { useState } from 'react';
import { 
  X, 
  Database, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink, 
  Copy, 
  Check, 
  Download, 
  UploadCloud, 
  FileSpreadsheet, 
  Code, 
  HelpCircle, 
  Settings2, 
  ShieldCheck, 
  Sparkles,
  Layers,
  ArrowRight
} from 'lucide-react';
import { 
  GoogleDatabaseConfig, 
  GOOGLE_APPS_SCRIPT_SAMPLE_CODE, 
  generateSample10A8Csv,
  parseGoogleSheetUrl 
} from '../../services/googleDatabaseService';
import { Student } from '../../types';

interface GoogleDatabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: GoogleDatabaseConfig;
  onSaveConfig: (config: GoogleDatabaseConfig) => void;
  onSyncNow: () => Promise<void>;
  onPushToGoogle: () => Promise<void>;
  isSyncing: boolean;
  studentCount: number;
  students: Student[];
}

export const GoogleDatabaseModal: React.FC<GoogleDatabaseModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig,
  onSyncNow,
  onPushToGoogle,
  isSyncing,
  studentCount,
  students,
}) => {
  const [activeTab, setActiveTab] = useState<'config' | 'guide' | 'schema' | 'export'>('config');
  const [formConfig, setFormConfig] = useState<GoogleDatabaseConfig>({ ...config });
  const [copiedScript, setCopiedScript] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopyScript = () => {
    navigator.clipboard.writeText(GOOGLE_APPS_SCRIPT_SAMPLE_CODE);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2500);
  };

  const handleDownloadSampleCsv = () => {
    const csvContent = generateSample10A8Csv();
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'DanhSach_Lop10A8_MsJenny_GoogleSheet_Mau.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSaveAndSync = async () => {
    onSaveConfig(formConfig);
    setSaveSuccessMsg('Đang kiểm tra kết nối và đồng bộ...');
    await onSyncNow();
    setSaveSuccessMsg('Đã kết nối và lưu cấu hình Google Database thành công!');
    setTimeout(() => setSaveSuccessMsg(null), 3000);
  };

  const handleUsePresetDemo = () => {
    const newCfg: GoogleDatabaseConfig = {
      ...formConfig,
      connectionType: 'google_sheets_csv',
      sheetUrl: 'https://docs.google.com/spreadsheets/d/1_Edumaster10A8_Jenny_DemoSheet/edit#gid=0',
      autoSync: true,
      autoSyncIntervalMinutes: 15,
      isConnected: true,
      lastError: null,
    };
    setFormConfig(newCfg);
    onSaveConfig(newCfg);
    onSyncNow();
  };

  const parsedInfo = parseGoogleSheetUrl(formConfig.sheetUrl);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Modal Top Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 p-4 sm:p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-md shadow-emerald-900/40">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  Kết Nối Cơ Sở Dữ Liệu Trực Tuyến Google Sheets
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  Lớp 10A8 - Ms Jenny
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Đồng bộ trực tiếp danh sách học sinh, điểm số và chuyên cần từ Google Drive / Google Sheets
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Tabs Navigation */}
        <div className="flex items-center border-b border-slate-200 bg-slate-50 px-4 overflow-x-auto scrollbar-none text-xs font-semibold">
          {[
            { id: 'config', label: '1. Cấu hình Kết nối', icon: Settings2 },
            { id: 'guide', label: '2. Hướng dẫn & Apps Script', icon: HelpCircle },
            { id: 'schema', label: '3. Cột Dữ liệu Mẫu 10A8', icon: Layers },
            { id: 'export', label: '4. Đẩy Dữ Liệu Lên Sheet', icon: UploadCloud },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-3 px-4 border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
                  isActive
                    ? 'border-emerald-600 text-emerald-700 bg-white shadow-xs font-bold'
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 text-slate-800 text-xs space-y-5">
          {saveSuccessMsg && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-2 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{saveSuccessMsg}</span>
            </div>
          )}

          {/* TAB 1: CONNECTION CONFIG */}
          {activeTab === 'config' && (
            <div className="space-y-4">
              {/* Connection Status Card */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl ${formConfig.isConnected ? 'bg-emerald-600 text-white' : 'bg-amber-500 text-white'}`}>
                    <Database className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">Trạng thái Cơ sở dữ liệu:</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        formConfig.isConnected ? 'bg-emerald-200 text-emerald-900' : 'bg-amber-200 text-amber-900'
                      }`}>
                        {formConfig.isConnected ? '🟢 Đã kết nối trực tuyến' : '🟡 Đang dùng dữ liệu mặc định'}
                      </span>
                    </div>
                    <p className="text-slate-600 mt-0.5">
                      Hiện có <strong className="text-emerald-700">{studentCount} học sinh</strong> trong bộ nhớ • Lần đồng bộ cuối:{' '}
                      <span className="font-semibold text-slate-700">{formConfig.lastSyncTime || 'Vừa xong'}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={onSyncNow}
                    disabled={isSyncing}
                    className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all disabled:opacity-50 cursor-pointer"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                    <span>{isSyncing ? 'Đang đồng bộ...' : 'Đồng bộ ngay'}</span>
                  </button>
                </div>
              </div>

              {/* Connection Method Selector */}
              <div className="space-y-2">
                <label className="font-bold text-slate-900 text-xs block">Phương thức kết nối Google:</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div
                    onClick={() => setFormConfig({ ...formConfig, connectionType: 'google_sheets_csv' })}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      formConfig.connectionType === 'google_sheets_csv'
                        ? 'bg-emerald-50/70 border-emerald-500 ring-1 ring-emerald-500 shadow-xs'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                        <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                        Link Google Sheets (Đơn giản nhất)
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">Khuyên dùng</span>
                    </div>
                    <p className="text-slate-500 text-[11px] leading-relaxed">
                      Dán link Google Sheet trực tiếp (quyền xem công khai). Hệ thống tự động chuyển đổi sang endpoint CSV và đồng bộ tức thì.
                    </p>
                  </div>

                  <div
                    onClick={() => setFormConfig({ ...formConfig, connectionType: 'apps_script' })}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      formConfig.connectionType === 'apps_script'
                        ? 'bg-emerald-50/70 border-emerald-500 ring-1 ring-emerald-500 shadow-xs'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                        <Code className="w-4 h-4 text-purple-600" />
                        Google Apps Script Web App (2 Chiều)
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-100 text-purple-800 font-bold">Đọc & Ghi 2-Way</span>
                    </div>
                    <p className="text-slate-500 text-[11px] leading-relaxed">
                      Cài đặt đoạn mã Apps Script vào Google Sheet để hỗ trợ đọc dữ liệu và đẩy ngược điểm số/học sinh từ app vào Google Sheet.
                    </p>
                  </div>
                </div>
              </div>

              {/* Form Input based on Method */}
              {formConfig.connectionType === 'google_sheets_csv' ? (
                <div className="space-y-3 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="font-semibold text-slate-800">
                        Đường dẫn Google Sheets (URL hoặc Link Chia Sẻ) *
                      </label>
                      <button
                        type="button"
                        onClick={handleUsePresetDemo}
                        className="text-emerald-700 font-bold hover:underline text-[11px] flex items-center gap-1"
                      >
                        <Sparkles className="w-3 h-3 text-amber-500" />
                        Dùng Google Sheet Mẫu 10A8
                      </button>
                    </div>
                    <input
                      type="url"
                      placeholder="https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit#gid=0"
                      value={formConfig.sheetUrl}
                      onChange={(e) => setFormConfig({ ...formConfig, sheetUrl: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 text-xs bg-white"
                    />
                    {parsedInfo.sheetId && (
                      <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Sheet ID nhận diện: <code className="bg-slate-200 px-1 py-0.5 rounded text-[10px]">{parsedInfo.sheetId}</code> (Gid: {parsedInfo.gid})
                      </p>
                    )}
                  </div>

                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-[11px] space-y-1">
                    <span className="font-bold block flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-600" /> Lưu ý quan trọng về quyền truy cập:
                    </span>
                    <p>
                      Mở Google Sheet trên trình duyệt, nhấn nút <strong>"Chia sẻ" (Share)</strong> ở góc phải trên cùng → Mục <strong>"Quyền truy cập chung" (General access)</strong> → Chọn <strong>"Bất kỳ ai có đường liên kết" (Anyone with the link)</strong> và quyền <strong>"Người xem" (Viewer)</strong>.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <div>
                    <label className="font-semibold text-slate-800 block mb-1">
                      URL Google Apps Script Web App (Exec URL) *
                    </label>
                    <input
                      type="url"
                      placeholder="https://script.google.com/macros/s/AKfycbx.../exec"
                      value={formConfig.appsScriptUrl}
                      onChange={(e) => setFormConfig({ ...formConfig, appsScriptUrl: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-1 focus:ring-emerald-500 text-xs bg-white"
                    />
                    <p className="text-[11px] text-slate-500 mt-1">
                      Xem hướng dẫn 4 bước cài đặt mã Apps Script tại tab <strong>"2. Hướng dẫn & Apps Script"</strong>.
                    </p>
                  </div>
                </div>
              )}

              {/* Auto Sync Settings */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <input
                    type="checkbox"
                    id="autoSync"
                    checked={formConfig.autoSync}
                    onChange={(e) => setFormConfig({ ...formConfig, autoSync: e.target.checked })}
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <div>
                    <label htmlFor="autoSync" className="font-bold text-slate-900 cursor-pointer">
                      Tự động làm mới dữ liệu từ Google Sheets trong nền (Auto Sync)
                    </label>
                    <span className="text-[11px] text-slate-500 block">
                      Tự động tải danh sách mới nhất định kỳ mà không làm gián đoạn công việc của giáo viên.
                    </span>
                  </div>
                </div>

                {formConfig.autoSync && (
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-[11px] text-slate-600">Chu kỳ:</span>
                    <select
                      value={formConfig.autoSyncIntervalMinutes}
                      onChange={(e) => setFormConfig({ ...formConfig, autoSyncIntervalMinutes: Number(e.target.value) })}
                      className="px-2 py-1 rounded-lg border border-slate-300 text-xs bg-white"
                    >
                      <option value={5}>Mỗi 5 phút</option>
                      <option value={15}>Mỗi 15 phút</option>
                      <option value={30}>Mỗi 30 phút</option>
                      <option value={60}>Mỗi 1 giờ</option>
                    </select>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleDownloadSampleCsv}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Tải file Excel Mẫu 10A8 (.csv)</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold cursor-pointer"
                  >
                    Đóng
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveAndSync}
                    disabled={isSyncing}
                    className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1.5 shadow-sm transition-all disabled:opacity-50 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Lưu Cấu Hình & Đồng Bộ</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: STEP-BY-STEP GUIDE & APPS SCRIPT */}
          {activeTab === 'guide' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1">
                  <span className="font-bold text-emerald-900 block text-xs">Bước 1: Tạo Google Sheet</span>
                  <p className="text-emerald-800 text-[11px]">
                    Tạo bảng tính mới trên Google Drive hoặc tải file mẫu CSV bên dưới và mở bằng Google Sheets.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-sky-50 border border-sky-200 space-y-1">
                  <span className="font-bold text-sky-900 block text-xs">Bước 2: Cấp Quyền Truy Cập</span>
                  <p className="text-sky-800 text-[11px]">
                    Nhấn nút "Chia sẻ" → Chọn "Bất kỳ ai có liên kết" để ứng dụng có thể đọc dữ liệu danh sách lớp.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-purple-50 border border-purple-200 space-y-1">
                  <span className="font-bold text-purple-900 block text-xs">Bước 3: Dán Link Vào App</span>
                  <p className="text-purple-800 text-[11px]">
                    Sao chép URL Google Sheets và dán vào ô cấu hình để đồng bộ tức thì.
                  </p>
                </div>
              </div>

              {/* Apps Script Box */}
              <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Code className="w-4 h-4 text-emerald-400" />
                    <span className="font-bold text-xs text-white">Mã Google Apps Script Backend (Hỗ trợ Đọc & Ghi 2 Chiều)</span>
                  </div>

                  <button
                    onClick={handleCopyScript}
                    className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    {copiedScript ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedScript ? 'Đã sao chép!' : 'Sao chép mã'}</span>
                  </button>
                </div>

                <pre className="p-3 rounded-xl bg-slate-950 text-slate-300 font-mono text-[11px] max-h-60 overflow-y-auto leading-relaxed border border-slate-800">
                  {GOOGLE_APPS_SCRIPT_SAMPLE_CODE}
                </pre>
              </div>
            </div>
          )}

          {/* TAB 3: SCHEMA & COLUMN MAPPING */}
          {activeTab === 'schema' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Cấu Trúc Cột Tiêu Chuẩn Trong Google Sheet</h3>
                  <p className="text-slate-500 text-xs">Hệ thống tự động nhận diện tiêu đề cột tiếng Việt có dấu, không dấu hoặc tiếng Anh.</p>
                </div>

                <button
                  onClick={handleDownloadSampleCsv}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Tải File Mẫu (.csv)</span>
                </button>
              </div>

              <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold">
                    <tr>
                      <th className="p-2.5">STT</th>
                      <th className="p-2.5">Tên cột gợi ý</th>
                      <th className="p-2.5">Ví dụ dữ liệu</th>
                      <th className="p-2.5">Các biến thể tự nhận diện</th>
                      <th className="p-2.5">Mục đích</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {[
                      { stt: 1, col: 'Mã HS', eg: 'HS25-10A8-01', aliases: 'Mã học sinh, code, id', desc: 'Mã định danh duy nhất của học sinh' },
                      { stt: 2, col: 'Họ và tên', eg: 'Nguyễn Hoàng An', aliases: 'Họ tên, tên, name, học sinh', desc: 'Tên học sinh (Bắt buộc)' },
                      { stt: 3, col: 'Giới tính', eg: 'Nam / Nữ', aliases: 'gender, phái, nam/nữ', desc: 'Xác định giới tính' },
                      { stt: 4, col: 'Ngày sinh', eg: '15/03/2010', aliases: 'dob, năm sinh, ngaysinh', desc: 'Ngày tháng năm sinh' },
                      { stt: 5, col: 'Tổ', eg: '1, 2, 3, 4', aliases: 'to, nhóm, group, tổ sinh hoạt', desc: 'Phân tổ thi đua trong lớp' },
                      { stt: 6, col: 'Chức vụ', eg: 'Lớp trưởng, Cán sự', aliases: 'vai trò, chucvu, role', desc: 'Ban cán sự lớp 10A8' },
                      { stt: 7, col: 'ĐTB HK1', eg: '8.8', aliases: 'dtb, điểm tb, gpa', desc: 'Điểm trung bình học kỳ 1' },
                      { stt: 8, col: 'Học lực', eg: 'Xuất sắc / Giỏi / Khá', aliases: 'xếp loại học lực, rank', desc: 'Xếp loại học lực theo TT22' },
                      { stt: 9, col: 'Điểm nề nếp', eg: '98', aliases: 'điểm rèn luyện, nề nếp', desc: 'Điểm thi đua rèn luyện' },
                      { stt: 10, col: 'Hạnh kiểm', eg: 'Tốt / Khá / Đạt', aliases: 'xếp loại hạnh kiểm', desc: 'Xếp loại hạnh kiểm' },
                      { stt: 11, col: 'Họ tên Phụ huynh', eg: 'Nguyễn Văn Hùng', aliases: 'phụ huynh, tên bố mẹ', desc: 'Người liên hệ chính' },
                      { stt: 12, col: 'SĐT Phụ huynh', eg: '0912345678', aliases: 'sđt, phone, điện thoại', desc: 'Gửi SMS & gọi điện khẩn' },
                      { stt: 13, col: 'Địa chỉ', eg: '124 Thụy Khuê, Tây Hồ', aliases: 'nơi ở, address', desc: 'Địa chỉ liên lạc' },
                      { stt: 14, col: 'Ghi chú sức khỏe/tâm lý', eg: 'Cận 2.5 độ, dị ứng tôm', aliases: 'lưu ý, bệnh nền, ghi chú', desc: 'Sổ tay theo dõi riêng của GVCN' },
                    ].map((row) => (
                      <tr key={row.stt} className="hover:bg-slate-50">
                        <td className="p-2.5 font-semibold text-slate-400">{row.stt}</td>
                        <td className="p-2.5 font-bold text-emerald-800">{row.col}</td>
                        <td className="p-2.5 font-mono text-[11px] text-slate-800">{row.eg}</td>
                        <td className="p-2.5 text-slate-500 text-[11px]">{row.aliases}</td>
                        <td className="p-2.5 text-slate-600">{row.desc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: EXPORT & WRITE BACK TO GOOGLE SHEETS */}
          {activeTab === 'export' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <h3 className="font-bold text-slate-900 text-sm">Ghi Ngược Danh Sách Hiện Tại Lên Google Sheets</h3>
                <p className="text-slate-600 text-xs leading-relaxed">
                  Bạn có thể đẩy toàn bộ <strong>{students.length} học sinh lớp 10A8</strong> (kèm điểm số và chuyên cần mới nhất) vào bảng tính Google Sheets của bạn.
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={onPushToGoogle}
                    disabled={isSyncing || formConfig.connectionType !== 'apps_script'}
                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold flex items-center gap-1.5 shadow-sm transition-all disabled:opacity-50 cursor-pointer"
                  >
                    <UploadCloud className="w-4 h-4" />
                    <span>Đẩy {students.length} học sinh lên Google Apps Script</span>
                  </button>

                  <button
                    onClick={handleDownloadSampleCsv}
                    className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Xuất CSV để Import thủ công vào Google Drive</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
