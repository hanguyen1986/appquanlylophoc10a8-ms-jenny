import React, { useState } from 'react';
import { 
  Bell, 
  Search, 
  PlusCircle, 
  GraduationCap, 
  Calendar, 
  Smartphone, 
  Monitor, 
  Sparkles,
  ChevronDown,
  CheckCircle2,
  AlertTriangle,
  Send,
  UserCheck,
  Database,
  Key,
  Settings
} from 'lucide-react';
import { GoogleDatabaseConfig } from '../services/googleDatabaseService';
import { DatabaseStatusBadge } from './GoogleDatabase/DatabaseStatusBadge';

interface NavbarProps {
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
  onOpenQuickAttendance?: () => void;
  onOpenQuickDiscipline?: () => void;
  onOpenQuickMessage?: () => void;
  onOpenQuickTask?: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  databaseConfig: GoogleDatabaseConfig;
  isDatabaseSyncing: boolean;
  studentCount: number;
  onOpenDatabaseModal: () => void;
  onQuickSyncDatabase: () => void;
  hasApiKey: boolean;
  onOpenApiKeyModal: () => void;
  selectedClass?: string;
  onSelectClass?: (cls: string) => void;
  onOpenClassListModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenQuickAttendance,
  onOpenQuickDiscipline,
  onOpenQuickMessage,
  onOpenQuickTask,
  searchQuery,
  onSearchChange,
  databaseConfig,
  isDatabaseSyncing,
  studentCount,
  onOpenDatabaseModal,
  onQuickSyncDatabase,
  hasApiKey,
  onOpenApiKeyModal,
  selectedClass = '10A8',
  onSelectClass = () => {},
  onOpenClassListModal,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showQuickMenu, setShowQuickMenu] = useState(false);

  const notifications = [
    { id: 1, title: 'PH em Lê Minh Đức xác nhận hẹn gặp lúc 16:30', time: '10 phút trước', type: 'success' },
    { id: 2, title: '02 học sinh vắng sáng nay (Đặng Ngọc Mai có phép)', time: '35 phút trước', type: 'warning' },
    { id: 3, title: 'Hạn nộp báo cáo thi đua tuần 2 trước 17h00 hôm nay', time: '2 giờ trước', type: 'alert' },
  ];

  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40 px-3 sm:px-4 py-2.5 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand & Class Selector */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-md shadow-emerald-900/40 shrink-0">
            <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm sm:text-base tracking-tight text-white">
                QUẢN LÝ LỚP HỌC <span className="text-emerald-400">10A8-MS JENNY</span>
              </span>
              <span className="hidden xl:inline-block px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800/60">
                Sổ Chủ Nhiệm 4.0
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-300">
              <span className="font-semibold text-slate-100 hidden sm:inline">THPT Chu Văn An</span>
              <span className="hidden sm:inline">•</span>
              <div className="relative inline-block">
                <select 
                  value={selectedClass} 
                  onChange={(e) => {
                    if (e.target.value === 'manage_classes') {
                      if (onOpenClassListModal) onOpenClassListModal();
                    } else {
                      onSelectClass(e.target.value);
                    }
                  }}
                  className="bg-slate-800/90 text-emerald-300 font-bold px-2 py-0.5 rounded-md border border-slate-700 hover:border-emerald-500 text-[11px] focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
                >
                  <option value="10A8">Lớp 10A8 (Ms Jenny - 36 HS)</option>
                  <option value="10A1">Lớp 10A1 (Thầy Hoàng Minh - 38 HS)</option>
                  <option value="10A2">Lớp 10A2 (Cô Thu Hương - 40 HS)</option>
                  <option value="11A8">Lớp 11A8 (Thầy Vũ Đức - 42 HS)</option>
                  <option value="12A8">Lớp 12A8 (Cô Mai Phương - 39 HS)</option>
                  <option value="manage_classes">⚙️ Quản lý danh sách lớp...</option>
                </select>
              </div>
              <span className="hidden md:inline text-slate-400">• HK I (2025-2026)</span>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="hidden lg:flex flex-1 max-w-xs xl:max-w-sm items-center relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
          <input
            type="text"
            placeholder="Tìm nhanh học sinh 10A8, SĐT, mã HS..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-slate-800/90 text-xs sm:text-sm text-slate-100 placeholder-slate-400 pl-9 pr-8 py-1.5 rounded-xl border border-slate-700 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
          />
          {searchQuery && (
            <button 
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 text-xs text-slate-400 hover:text-slate-200"
            >
              ✕
            </button>
          )}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* REQUIRED BY AI_INSTRUCTIONS: Settings (API Key) Button with RED CTA text */}
          <button
            onClick={onOpenApiKeyModal}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer shadow-xs ${
              hasApiKey
                ? 'bg-slate-800/90 border-slate-700 text-slate-200 hover:border-emerald-500 hover:text-emerald-300'
                : 'bg-rose-950/80 border-rose-600/80 text-rose-300 hover:bg-rose-900/90 animate-pulse'
            }`}
            title="Cài đặt API Key & Model AI"
          >
            <Key className={`w-3.5 h-3.5 ${hasApiKey ? 'text-emerald-400' : 'text-rose-400'}`} />
            <span className="hidden sm:inline">Settings (API Key)</span>
            {!hasApiKey ? (
              <span className="text-[10px] font-extrabold text-rose-400 bg-rose-950 px-1.5 py-0.2 rounded border border-rose-600/60 ml-0.5">
                Lấy API key để sử dụng app
              </span>
            ) : (
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 px-1.5 py-0.2 rounded border border-emerald-800/60 ml-0.5">
                AI Sẵn sàng
              </span>
            )}
          </button>

          {/* Google Database Status Badge */}
          <DatabaseStatusBadge
            config={databaseConfig}
            isSyncing={isDatabaseSyncing}
            studentCount={studentCount}
            onOpenModal={onOpenDatabaseModal}
            onQuickSync={onQuickSyncDatabase}
          />

          {/* Quick Action Button */}
          <div className="relative">
            <button
              onClick={() => setShowQuickMenu(!showQuickMenu)}
              className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm transition-all active:scale-95 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden xl:inline">Thao tác</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-80" />
            </button>

            {showQuickMenu && (
              <div 
                className="absolute right-0 mt-2 w-56 bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl py-2 z-50 text-xs text-slate-200"
                onClick={() => setShowQuickMenu(false)}
              >
                <button
                  onClick={onOpenApiKeyModal}
                  className="w-full px-3.5 py-2 text-left hover:bg-slate-700/70 flex items-center gap-2.5 transition-colors text-amber-400 font-semibold"
                >
                  <Key className="w-4 h-4 text-amber-400" />
                  <span>Cài đặt Gemini API Key</span>
                </button>
                <button
                  onClick={onOpenDatabaseModal}
                  className="w-full px-3.5 py-2 text-left hover:bg-slate-700/70 flex items-center gap-2.5 transition-colors text-emerald-400 font-semibold"
                >
                  <Database className="w-4 h-4 text-emerald-400" />
                  <span>Cài đặt Google Database</span>
                </button>
                {onOpenClassListModal && (
                  <button
                    onClick={onOpenClassListModal}
                    className="w-full px-3.5 py-2 text-left hover:bg-slate-700/70 flex items-center gap-2.5 transition-colors text-sky-400 font-semibold"
                  >
                    <GraduationCap className="w-4 h-4 text-sky-400" />
                    <span>Quản lý Danh sách Lớp</span>
                  </button>
                )}
                <div className="border-t border-slate-700/60 my-1" />
                <button
                  onClick={onOpenQuickAttendance}
                  className="w-full px-3.5 py-2 text-left hover:bg-slate-700/70 flex items-center gap-2.5 transition-colors"
                >
                  <UserCheck className="w-4 h-4 text-emerald-400" />
                  <span>Điểm danh 1-chạm</span>
                </button>
                <button
                  onClick={onOpenQuickDiscipline}
                  className="w-full px-3.5 py-2 text-left hover:bg-slate-700/70 flex items-center gap-2.5 transition-colors"
                >
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Ghi nhận Nề nếp / Khen</span>
                </button>
                <button
                  onClick={onOpenQuickMessage}
                  className="w-full px-3.5 py-2 text-left hover:bg-slate-700/70 flex items-center gap-2.5 transition-colors"
                >
                  <Send className="w-4 h-4 text-sky-400" />
                  <span>Gửi tin nhắn Phụ huynh</span>
                </button>
                <button
                  onClick={onOpenQuickTask}
                  className="w-full px-3.5 py-2 text-left hover:bg-slate-700/70 flex items-center gap-2.5 transition-colors"
                >
                  <Calendar className="w-4 h-4 text-purple-400" />
                  <span>Thêm việc cần làm</span>
                </button>
              </div>
            )}
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors cursor-pointer"
              title="Thông báo mới"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-slate-900 animate-pulse"></span>
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl p-3 z-50 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-700">
                  <span className="font-semibold text-slate-200">Thông báo & Nhắc nhở</span>
                  <span className="text-[10px] text-emerald-400 font-medium bg-emerald-950 px-1.5 py-0.5 rounded border border-emerald-800">3 mới</span>
                </div>
                <div className="space-y-2 mt-2 max-h-64 overflow-y-auto">
                  {notifications.map((n) => (
                    <div key={n.id} className="p-2 rounded-xl bg-slate-900/60 hover:bg-slate-900 border border-slate-700/50 transition-colors">
                      <p className="text-slate-200 font-medium leading-tight">{n.title}</p>
                      <span className="text-[10px] text-slate-400 mt-1 block">{n.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Teacher Profile Avatar */}
          <div className="flex items-center gap-2 pl-1.5 sm:pl-2 border-l border-slate-800">
            <img
              src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80"
              alt="Ms Jenny"
              className="w-8 h-8 rounded-full ring-2 ring-emerald-500/60 object-cover"
            />
            <div className="hidden xl:block text-left">
              <div className="text-xs font-bold text-slate-200 leading-tight">Ms Jenny</div>
              <div className="text-[10px] text-emerald-400 font-semibold">GVCN 10A8</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
