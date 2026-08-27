import React from 'react';
import { 
  Users, 
  UserX, 
  Trophy, 
  BookOpen, 
  Calendar, 
  AlertCircle, 
  CheckCircle2, 
  ArrowUpRight, 
  ArrowDownRight, 
  Clock, 
  Send, 
  Sparkles,
  ChevronRight,
  TrendingUp,
  HeartHandshake
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  LineChart,
  Line
} from 'recharts';
import { Student, AttendanceRecord, CalendarTask, DisciplineEvent } from '../../types';

interface DashboardViewProps {
  students: Student[];
  attendance: AttendanceRecord[];
  tasks: CalendarTask[];
  disciplineEvents: DisciplineEvent[];
  onNavigateTab: (tab: string) => void;
  onSelectStudent: (student: Student) => void;
  onQuickTakeAttendance: (studentId: string, status: any) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  students,
  attendance,
  tasks,
  disciplineEvents,
  onNavigateTab,
  onSelectStudent,
  onQuickTakeAttendance,
}) => {
  const totalStudents = students.length;
  const presentToday = attendance.filter((a) => a.status === 'present').length;
  const excusedToday = attendance.filter((a) => a.status === 'excused').length;
  const unexcusedToday = attendance.filter((a) => a.status === 'unexcused').length;
  const lateToday = attendance.filter((a) => a.status === 'late').length;
  const absentTotal = excusedToday + unexcusedToday;

  const pendingTasks = tasks.filter((t) => !t.completed);

  // Chart data: attendance over the last 5 days
  const attendanceTrendData = [
    { day: 'T2 (22/8)', present: 36, absent: 0, rate: 100 },
    { day: 'T3 (23/8)', present: 35, absent: 1, rate: 97.2 },
    { day: 'T4 (24/8)', present: 36, absent: 0, rate: 100 },
    { day: 'T5 (25/8)', present: 34, absent: 2, rate: 94.4 },
    { day: 'T6 (26/8)', present: 34, absent: 2, rate: 94.4 },
  ];

  // Academic breakdown
  const academicData = [
    { name: 'Xuất sắc', count: students.filter((s) => s.academicRank === 'Xuất sắc').length, color: '#10b981' },
    { name: 'Giỏi', count: students.filter((s) => s.academicRank === 'Giỏi').length, color: '#0ea5e9' },
    { name: 'Khá', count: students.filter((s) => s.academicRank === 'Khá').length, color: '#f59e0b' },
    { name: 'Trung bình', count: students.filter((s) => s.academicRank === 'Trung bình').length, color: '#ef4444' },
  ];

  // Conduct points per Group
  const groupScoresData = [
    { group: 'Tổ 1', score: 98, rank: 'Hạng 1' },
    { group: 'Tổ 2', score: 89, rank: 'Hạng 4' },
    { group: 'Tổ 3', score: 94, rank: 'Hạng 2' },
    { group: 'Tổ 4', score: 92, rank: 'Hạng 3' },
  ];

  // Special attention students
  const studentsNeedCare = students.filter(
    (s) => s.psychology.supportLevel !== 'Bình thường' || s.health.physicalEducationNote !== 'Bình thường' || s.overallGpa < 7.0
  );

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 rounded-2xl p-5 border border-slate-700/80 shadow-sm text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
              Năm học 2025 - 2026
            </span>
            <span className="text-xs text-slate-300">Thứ Tư, 26 tháng 08, 2026</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Xin chào, Ms Jenny! 👋
          </h1>
          <p className="text-sm text-slate-300 mt-1">
            Hôm nay lớp 10A8 có <strong className="text-emerald-400 font-semibold">{presentToday}/{totalStudents}</strong> học sinh có mặt. Bạn có <strong className="text-amber-400 font-semibold">{pendingTasks.length} nhiệm vụ</strong> cần hoàn thành.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onNavigateTab('attendance')}
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium flex items-center gap-1.5 shadow-sm transition-all"
          >
            <CheckCircle2 className="w-4 h-4" />
            Điểm danh nhanh
          </button>
          <button
            onClick={() => onNavigateTab('communication')}
            className="px-3.5 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-white text-xs font-medium flex items-center gap-1.5 border border-slate-600 transition-all"
          >
            <Send className="w-4 h-4 text-sky-400" />
            Nhắn tin cả lớp
          </button>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Metric 1: Total Students & Attendance */}
        <div 
          onClick={() => onNavigateTab('attendance')}
          className="bg-white p-4 rounded-xl border border-slate-200 hover:border-emerald-400 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Chuyên cần hôm nay</span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 group-hover:scale-110 transition-transform">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{presentToday}/{totalStudents}</span>
            <span className="text-xs font-medium text-emerald-600 flex items-center">
              {((presentToday / totalStudents) * 100).toFixed(0)}%
            </span>
          </div>
          <div className="mt-1 text-[11px] text-slate-500 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-rose-500 inline-block"></span>
            <span>{absentTotal > 0 ? `${absentTotal} vắng (${excusedToday} phép, ${unexcusedToday} K.phép)` : 'Đủ sĩ số 100%'}</span>
          </div>
        </div>

        {/* Metric 2: Discipline Rank */}
        <div 
          onClick={() => onNavigateTab('attendance')}
          className="bg-white p-4 rounded-xl border border-slate-200 hover:border-amber-400 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Điểm thi đua tuần</span>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-600 group-hover:scale-110 transition-transform">
              <Trophy className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">96.5</span>
            <span className="text-xs font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
              #2 Toàn trường
            </span>
          </div>
          <div className="mt-1 text-[11px] text-slate-500 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
            <span>Tăng 1.5 điểm so với tuần 1</span>
          </div>
        </div>

        {/* Metric 3: Academic GPA */}
        <div 
          onClick={() => onNavigateTab('grades')}
          className="bg-white p-4 rounded-xl border border-slate-200 hover:border-sky-400 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">ĐTB Lớp HK1</span>
            <div className="p-2 rounded-lg bg-sky-50 text-sky-600 group-hover:scale-110 transition-transform">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">8.25</span>
            <span className="text-xs font-medium text-sky-600">Loại Giỏi</span>
          </div>
          <div className="mt-1 text-[11px] text-slate-500">
            <span>87.5% học sinh Khá & Giỏi</span>
          </div>
        </div>

        {/* Metric 4: Pending Tasks */}
        <div 
          onClick={() => onNavigateTab('schedule')}
          className="bg-white p-4 rounded-xl border border-slate-200 hover:border-purple-400 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Việc cần làm hôm nay</span>
            <div className="p-2 rounded-lg bg-purple-50 text-purple-600 group-hover:scale-110 transition-transform">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{pendingTasks.length}</span>
            <span className="text-xs font-medium text-rose-600">1 việc gấp</span>
          </div>
          <div className="mt-1 text-[11px] text-slate-500 truncate">
            <span>Hạn nộp lý lịch HS 10A8</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Charts & Quick Taker */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Visual Charts & Analytics */}
        <div className="lg:col-span-2 space-y-6">
          {/* Chart 1: Attendance Trends */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Diễn biến Chuyên cần Tuần 2</h3>
                <p className="text-xs text-slate-500">Tỷ lệ có mặt trung bình đạt 97.2%</p>
              </div>
              <button 
                onClick={() => onNavigateTab('attendance')}
                className="text-xs text-emerald-600 hover:text-emerald-700 font-semibold flex items-center gap-0.5"
              >
                Chi tiết <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={attendanceTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#cbd5e1' }} />
                  <YAxis domain={[30, 36]} tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#cbd5e1' }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                    formatter={(value: any, name: string) => [
                      name === 'present' ? `${value} học sinh có mặt` : `${value} vắng`,
                      name === 'present' ? 'Có mặt' : 'Vắng'
                    ]}
                  />
                  <Bar dataKey="present" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={32} name="present" />
                  <Bar dataKey="absent" fill="#ef4444" radius={[4, 4, 0, 0]} maxBarSize={32} name="absent" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Group Performance & Academic Distribution */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Group Conduct Score */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <h3 className="text-xs font-bold text-slate-800 mb-3 flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5 text-amber-500" />
                Bảng điểm Thi đua theo Tổ
              </h3>
              <div className="space-y-2.5">
                {groupScoresData.map((g, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-50 border border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${
                        idx === 0 ? 'bg-amber-400 text-slate-950' : 'bg-slate-200 text-slate-700'
                      }`}>
                        {idx + 1}
                      </span>
                      <span className="font-semibold text-slate-800">{g.group}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-24 bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div 
                          className="bg-emerald-500 h-full rounded-full" 
                          style={{ width: `${(g.score / 100) * 100}%` }}
                        ></div>
                      </div>
                      <span className="font-bold text-slate-900 w-10 text-right">{g.score} đ</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Academic Pie Chart */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <h3 className="text-xs font-bold text-slate-800 mb-2 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-sky-500" />
                Phân bố Xếp loại Học lực
              </h3>
              <div className="flex items-center justify-between h-40">
                <div className="w-1/2 h-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={academicData}
                        dataKey="count"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={30}
                        outerRadius={55}
                        paddingAngle={3}
                      >
                        {academicData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="w-1/2 space-y-1.5 text-[11px]">
                  {academicData.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: item.color }}></span>
                        <span className="text-slate-600">{item.name}</span>
                      </div>
                      <span className="font-bold text-slate-800">{item.count} HS</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Attendance Widget for Today */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700">
                  <CheckCircle2 className="w-4 h-4" />
                </span>
                <h3 className="text-sm font-bold text-slate-900">Điểm danh nhanh trong ngày (1-Chạm)</h3>
              </div>
              <span className="text-xs text-slate-500">Chạm vào trạng thái để đổi nhanh</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {students.slice(0, 6).map((st) => {
                const att = attendance.find((a) => a.studentId === st.id);
                const status = att?.status || 'present';

                return (
                  <div key={st.id} className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 flex items-center justify-between transition-colors">
                    <div 
                      className="flex items-center gap-2.5 min-w-0 cursor-pointer"
                      onClick={() => onSelectStudent(st)}
                    >
                      <img src={st.avatarUrl} alt={st.name} className="w-8 h-8 rounded-full object-cover shrink-0" />
                      <div className="truncate">
                        <div className="text-xs font-bold text-slate-800 truncate hover:text-emerald-600">{st.name}</div>
                        <div className="text-[10px] text-slate-500">Tổ {st.group} • {st.roleInClass}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => onQuickTakeAttendance(st.id, 'present')}
                        title="Có mặt"
                        className={`px-2 py-1 rounded text-[11px] font-semibold transition-all ${
                          status === 'present'
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                        }`}
                      >
                        Đủ
                      </button>
                      <button
                        onClick={() => onQuickTakeAttendance(st.id, 'excused')}
                        title="Vắng có phép"
                        className={`px-2 py-1 rounded text-[11px] font-semibold transition-all ${
                          status === 'excused'
                            ? 'bg-amber-600 text-white shadow-xs'
                            : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                        }`}
                      >
                        Phép
                      </button>
                      <button
                        onClick={() => onQuickTakeAttendance(st.id, 'unexcused')}
                        title="Vắng không phép"
                        className={`px-2 py-1 rounded text-[11px] font-semibold transition-all ${
                          status === 'unexcused'
                            ? 'bg-rose-600 text-white shadow-xs'
                            : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                        }`}
                      >
                        KP
                      </button>
                      <button
                        onClick={() => onQuickTakeAttendance(st.id, 'late')}
                        title="Đi muộn"
                        className={`px-2 py-1 rounded text-[11px] font-semibold transition-all ${
                          status === 'late'
                            ? 'bg-purple-600 text-white shadow-xs'
                            : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                        }`}
                      >
                        Muộn
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-3 text-center">
              <button
                onClick={() => onNavigateTab('attendance')}
                className="text-xs text-emerald-600 font-semibold hover:underline"
              >
                Mở toàn bộ sổ điểm danh {totalStudents} học sinh Lớp 10A8 & Ma trận chuyên cần tháng →
              </button>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Important Notices & Attention List */}
        <div className="space-y-6">
          {/* Attention / Alert Box: Students needing care */}
          <div className="bg-white p-4 rounded-2xl border border-rose-200 shadow-xs">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 rounded-lg bg-rose-100 text-rose-600">
                <AlertCircle className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                Học sinh Cần Quan tâm Đặc biệt
              </h3>
            </div>

            <div className="space-y-2.5">
              {studentsNeedCare.map((st) => (
                <div 
                  key={st.id} 
                  onClick={() => onSelectStudent(st)}
                  className="p-2.5 rounded-xl bg-rose-50/50 hover:bg-rose-50 border border-rose-100 cursor-pointer transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <img src={st.avatarUrl} alt={st.name} className="w-7 h-7 rounded-full object-cover shrink-0" />
                      <div>
                        <div className="text-xs font-bold text-slate-900">{st.name}</div>
                        <div className="text-[10px] text-slate-500">Tổ {st.group} • ĐTB: {st.overallGpa}</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold text-rose-700 bg-rose-100 px-1.5 py-0.5 rounded">
                      {st.psychology.supportLevel !== 'Bình thường' ? 'Tâm lý' : 'Sức khỏe'}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-600 mt-1.5 line-clamp-2 leading-relaxed">
                    {st.psychology.teacherObservations || st.health.medicalNotes}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-3 pt-2 border-t border-rose-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-500">Sổ tay theo dõi GVCN</span>
              <button 
                onClick={() => onNavigateTab('students')}
                className="text-xs font-semibold text-rose-600 hover:text-rose-700"
              >
                Xem chi tiết →
              </button>
            </div>
          </div>

          {/* Today Tasks & Work Calendar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-purple-100 text-purple-600">
                  <Calendar className="w-4 h-4" />
                </div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                  Lịch Công tác & Nhắc việc
                </h3>
              </div>
              <button 
                onClick={() => onNavigateTab('schedule')}
                className="text-[11px] text-purple-600 font-semibold hover:underline"
              >
                Toàn bộ
              </button>
            </div>

            <div className="space-y-2">
              {tasks.slice(0, 4).map((task) => (
                <div 
                  key={task.id} 
                  className={`p-2.5 rounded-xl border text-xs transition-all ${
                    task.completed 
                      ? 'bg-slate-50 border-slate-200 text-slate-400 line-through' 
                      : task.priority === 'Cao'
                        ? 'bg-amber-50/70 border-amber-200 text-slate-800'
                        : 'bg-slate-50 border-slate-200 text-slate-800'
                  }`}
                >
                  <div className="flex items-start justify-between gap-1.5">
                    <span className="font-semibold leading-tight">{task.title}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold shrink-0 ${
                      task.priority === 'Cao' ? 'bg-rose-100 text-rose-700' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {task.time}
                    </span>
                  </div>
                  {task.location && (
                    <div className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
                      <span>📍 {task.location}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Recent Discipline & Commendations */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-amber-100 text-amber-700">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                  Ghi nhận Nề nếp Mới nhất
                </h3>
              </div>
            </div>

            <div className="space-y-2">
              {disciplineEvents.slice(0, 3).map((d) => (
                <div 
                  key={d.id} 
                  className="p-2 rounded-lg bg-slate-50 border border-slate-200/80 text-xs flex items-center justify-between"
                >
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${d.type === 'commendation' ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                      <span className="font-bold text-slate-900">{d.studentName}</span>
                      <span className="text-[10px] text-slate-500">({d.category})</span>
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{d.description}</div>
                  </div>
                  <span className={`text-xs font-bold px-1.5 py-0.5 rounded shrink-0 ${
                    d.scoreChange > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                  }`}>
                    {d.scoreChange > 0 ? `+${d.scoreChange}` : d.scoreChange}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
