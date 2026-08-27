import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  CheckSquare, 
  Award, 
  MessageSquareQuote, 
  CalendarDays, 
  FileSpreadsheet, 
  BookOpenCheck,
  ChevronRight,
  Database
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab?: (tab: string) => void;
  onTabChange?: (tab: string) => void;
  badgeCounts?: {
    absentToday?: number;
    pendingTasks?: number;
    unreadMessages?: number;
    totalStudents?: number;
  };
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  onOpenDatabaseModal?: () => void;
  onOpenClassListModal?: () => void;
  selectedClassName?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  onTabChange,
  badgeCounts = { absentToday: 0, pendingTasks: 0, unreadMessages: 0, totalStudents: 36 },
  isCollapsed = false,
  onToggleCollapse,
  onOpenDatabaseModal,
  onOpenClassListModal,
  selectedClassName = '10A8',
}) => {
  const handleTabChange = (tabId: string) => {
    if (onTabChange) onTabChange(tabId);
    if (setActiveTab) setActiveTab(tabId);
  };

  const absentToday = badgeCounts?.absentToday ?? 0;
  const pendingTasks = badgeCounts?.pendingTasks ?? 0;
  const unreadMessages = badgeCounts?.unreadMessages ?? 0;
  const totalStudents = badgeCounts?.totalStudents ?? 36;

  const menuItems = [
    {
      id: 'dashboard',
      label: '3.1. Tổng quan Lớp 10A8',
      shortLabel: 'Tổng quan',
      icon: LayoutDashboard,
      desc: 'KPIs, điểm danh nhanh, việc cần làm',
      badge: null,
    },
    {
      id: 'students',
      label: '3.2. Hồ sơ Học sinh',
      shortLabel: 'Hồ sơ HS',
      icon: Users,
      desc: 'Lý lịch, phụ huynh, tâm lý, sức khỏe',
      badge: `${totalStudents} HS`,
    },
    {
      id: 'attendance',
      label: '3.3. Chuyên cần & Nề nếp',
      shortLabel: 'Chuyên cần',
      icon: CheckSquare,
      desc: 'Điểm danh, vi phạm, tuyên dương',
      badge: absentToday > 0 ? `${absentToday} vắng` : null,
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    },
    {
      id: 'grades',
      label: '3.4. Điểm số & Tiến độ',
      shortLabel: 'Sổ điểm',
      icon: Award,
      desc: 'Nhập điểm, ĐTB, xếp loại, biểu đồ',
      badge: 'HK1',
    },
    {
      id: 'communication',
      label: '3.5. Liên lạc Phụ huynh',
      shortLabel: 'Sổ liên lạc',
      icon: MessageSquareQuote,
      desc: 'Tin nhắn đa kênh, họp, sổ liên lạc',
      badge: unreadMessages > 0 ? `${unreadMessages}` : null,
      badgeColor: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
    },
    {
      id: 'schedule',
      label: '3.6. Lịch & Nhắc việc',
      shortLabel: 'Lịch & Việc',
      icon: CalendarDays,
      desc: 'Thời khóa biểu, họp tổ, to-do list',
      badge: pendingTasks > 0 ? `${pendingTasks} việc` : null,
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    },
    {
      id: 'reports',
      label: '3.7. Báo cáo Thống kê',
      shortLabel: 'Báo cáo',
      icon: FileSpreadsheet,
      desc: 'Xuất PDF/Excel sơ kết tuần/tháng/HK',
      badge: 'Mới',
    },
    {
      id: 'design_spec',
      label: '📐 Tài liệu Thiết kế UI/UX',
      shortLabel: 'Tài liệu IA',
      icon: BookOpenCheck,
      desc: 'Tầm nhìn, kiến trúc thông tin, quy tắc UX',
      badge: 'Đặc tả',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      isSpecial: true,
    },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0 min-h-[calc(100vh-61px)]">
      <div className="p-3">
        <div 
          onClick={onOpenClassListModal}
          className="px-3 py-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 hover:border-emerald-500/50 mb-3 cursor-pointer transition-all group"
          title="Bấm để chuyển đổi hoặc quản lý danh sách lớp"
        >
          <div className="flex items-center justify-between">
            <div className="text-[11px] uppercase tracking-wider text-slate-400 group-hover:text-emerald-400 font-semibold mb-0.5">
              Lớp {selectedClassName} • Ms Jenny
            </div>
            <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/60">
              Đổi lớp
            </span>
          </div>
          <div className="text-xs text-slate-300 flex items-center justify-between mt-1">
            <span>Tuần 2 • Học kỳ I</span>
            <span className="font-semibold text-emerald-400">{totalStudents} HS</span>
          </div>
        </div>

        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleTabChange(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-all group cursor-pointer ${
                  isActive
                    ? item.isSpecial
                      ? 'bg-gradient-to-r from-emerald-950 to-teal-900/70 border border-emerald-500/40 text-emerald-300 shadow-sm'
                      : 'bg-emerald-600 text-white font-medium shadow-md shadow-emerald-900/20'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`p-1.5 rounded-lg shrink-0 ${
                      isActive
                        ? item.isSpecial
                          ? 'bg-emerald-800/60 text-emerald-300'
                          : 'bg-emerald-700 text-white'
                        : 'bg-slate-800 text-slate-400 group-hover:text-slate-200'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <div className="text-xs font-medium truncate">{item.label}</div>
                    <div
                      className={`text-[10px] truncate ${
                        isActive ? 'text-emerald-100 opacity-90' : 'text-slate-400'
                      }`}
                    >
                      {item.desc}
                    </div>
                  </div>
                </div>

                {item.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full border shrink-0 font-semibold ${
                      item.badgeColor ||
                      (isActive
                        ? 'bg-white/20 text-white border-white/30'
                        : 'bg-slate-800 text-slate-300 border-slate-700')
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Database Quick Trigger */}
      {onOpenDatabaseModal && (
        <div className="px-3 pb-2">
          <button
            onClick={onOpenDatabaseModal}
            className="w-full flex items-center justify-between p-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 text-emerald-400 text-xs font-semibold transition-all group cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
              <span>Google Database</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-400" />
          </button>
        </div>
      )}

      {/* Footer system status */}
      <div className="mt-auto p-3 border-t border-slate-800/80 text-[11px] text-slate-400">
        <div className="flex items-center justify-between text-slate-300">
          <span>Chuẩn GDPT 2018</span>
          <span className="text-emerald-400 font-semibold">10A8-Ms Jenny</span>
        </div>
        <div className="text-[10px] text-slate-400 mt-0.5">
          Quản Lý Lớp Học Thông Minh 4.0
        </div>
      </div>
    </aside>
  );
};
