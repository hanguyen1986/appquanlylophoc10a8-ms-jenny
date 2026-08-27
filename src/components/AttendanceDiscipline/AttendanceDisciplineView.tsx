import React, { useState } from 'react';
import { 
  CheckSquare, 
  Sparkles, 
  AlertTriangle, 
  Trophy, 
  Calendar, 
  UserCheck, 
  UserX, 
  Clock, 
  Plus, 
  Search, 
  Send, 
  Filter, 
  CheckCircle2,
  TrendingDown,
  TrendingUp,
  History,
  ShieldAlert
} from 'lucide-react';
import { Student, AttendanceRecord, DisciplineEvent, AttendanceStatus } from '../../types';

interface AttendanceDisciplineViewProps {
  students: Student[];
  attendance: AttendanceRecord[];
  disciplineEvents: DisciplineEvent[];
  onUpdateAttendance: (studentId: string, status: AttendanceStatus, reason?: string) => void;
  onAddDisciplineEvent: (event: Omit<DisciplineEvent, 'id'>) => void;
  onNotifyParent: (studentName: string, reason: string) => void;
}

export const AttendanceDisciplineView: React.FC<AttendanceDisciplineViewProps> = ({
  students,
  attendance,
  disciplineEvents,
  onUpdateAttendance,
  onAddDisciplineEvent,
  onNotifyParent,
}) => {
  const [subTab, setSubTab] = useState<'attendance' | 'discipline' | 'ranking'>('attendance');
  const [selectedDate, setSelectedDate] = useState('2026-08-26');
  const [selectedSession, setSelectedSession] = useState<'Sáng' | 'Chiều'>('Sáng');
  const [groupFilter, setGroupFilter] = useState<number | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Form state for adding discipline event
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [eventStudentId, setEventStudentId] = useState(students[0]?.id || '');
  const [eventType, setEventType] = useState<'violation' | 'commendation'>('commendation');
  const [eventCategory, setEventCategory] = useState('Phát biểu xuất sắc');
  const [eventScoreChange, setEventScoreChange] = useState<number>(3);
  const [eventDescription, setEventDescription] = useState('');

  const violationCategories = [
    { name: 'Đi học muộn', defaultScore: -2 },
    { name: 'Không thuộc bài / thiếu BTVN', defaultScore: -2 },
    { name: 'Sai quy định đồng phục', defaultScore: -2 },
    { name: 'Mất trật tự trong giờ học', defaultScore: -3 },
    { name: 'Sử dụng ĐTDĐ trong lớp', defaultScore: -5 },
    { name: 'Nghỉ học không phép', defaultScore: -5 },
  ];

  const commendationCategories = [
    { name: 'Phát biểu xuất sắc', defaultScore: 3 },
    { name: 'Đạt điểm 10 kiểm tra miệng', defaultScore: 3 },
    { name: 'Giúp đỡ bạn tiến bộ', defaultScore: 5 },
    { name: 'Trực nhật & Vệ sinh gương mẫu', defaultScore: 3 },
    { name: 'Đạt giải Học sinh giỏi / Phong trào', defaultScore: 10 },
  ];

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    const student = students.find((s) => s.id === eventStudentId);
    if (!student) return;

    onAddDisciplineEvent({
      studentId: student.id,
      studentName: student.name,
      group: student.group,
      type: eventType,
      category: eventCategory,
      scoreChange: eventType === 'commendation' ? Math.abs(eventScoreChange) : -Math.abs(eventScoreChange),
      description: eventDescription || (eventType === 'commendation' ? 'Tuyên dương học sinh' : 'Ghi nhận nhắc nhở nề nếp'),
      date: selectedDate,
      recordedBy: 'Ms Jenny (GVCN)',
      verified: true,
    });

    setShowAddEventModal(false);
    setEventDescription('');
  };

  // Quick preset: Mark all present
  const handleMarkAllPresent = () => {
    students.forEach((st) => {
      onUpdateAttendance(st.id, 'present');
    });
  };

  const filteredStudents = students.filter((s) => {
    const matchSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchGroup = groupFilter === 'all' || s.group === groupFilter;
    return matchSearch && matchGroup;
  });

  const presentCount = attendance.filter((a) => a.status === 'present').length;
  const excusedCount = attendance.filter((a) => a.status === 'excused').length;
  const unexcusedCount = attendance.filter((a) => a.status === 'unexcused').length;
  const lateCount = attendance.filter((a) => a.status === 'late').length;

  return (
    <div className="space-y-5">
      {/* Sub Tabs Bar */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setSubTab('attendance')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              subTab === 'attendance'
                ? 'bg-white text-emerald-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            📋 Điểm danh Chuyên cần
          </button>
          <button
            onClick={() => setSubTab('discipline')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              subTab === 'discipline'
                ? 'bg-white text-emerald-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ⚡ Ghi nhận Nề nếp & Khen thưởng
          </button>
          <button
            onClick={() => setSubTab('ranking')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              subTab === 'ranking'
                ? 'bg-white text-emerald-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🏆 Thi đua theo Tổ
          </button>
        </div>

        {/* Global Action on Sub-bar */}
        <div className="flex items-center gap-2">
          {subTab === 'attendance' && (
            <button
              onClick={handleMarkAllPresent}
              className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold text-xs border border-emerald-200 transition-colors"
            >
              ✓ Đánh dấu có mặt tất cả
            </button>
          )}
          {subTab === 'discipline' && (
            <button
              onClick={() => setShowAddEventModal(true)}
              className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Ghi nhận sự việc</span>
            </button>
          )}
        </div>
      </div>

      {/* SUB-TAB 1: ATTENDANCE */}
      {subTab === 'attendance' && (
        <div className="space-y-4">
          {/* Controls & Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[11px] font-semibold text-slate-500 block">Có mặt</span>
                <span className="text-xl font-bold text-emerald-600">{presentCount} HS</span>
              </div>
              <span className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                <UserCheck className="w-4 h-4" />
              </span>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[11px] font-semibold text-slate-500 block">Vắng có phép</span>
                <span className="text-xl font-bold text-amber-600">{excusedCount} HS</span>
              </div>
              <span className="p-2 rounded-lg bg-amber-50 text-amber-600">
                <Clock className="w-4 h-4" />
              </span>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[11px] font-semibold text-slate-500 block">Vắng không phép</span>
                <span className="text-xl font-bold text-rose-600">{unexcusedCount} HS</span>
              </div>
              <span className="p-2 rounded-lg bg-rose-50 text-rose-600">
                <UserX className="w-4 h-4" />
              </span>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[11px] font-semibold text-slate-500 block">Đi muộn</span>
                <span className="text-xl font-bold text-purple-600">{lateCount} HS</span>
              </div>
              <span className="p-2 rounded-lg bg-purple-50 text-purple-600">
                <AlertTriangle className="w-4 h-4" />
              </span>
            </div>
          </div>

          {/* Date & Filter selectors */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                <Calendar className="w-4 h-4 text-emerald-600" />
                <span>Ngày điểm danh:</span>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="px-2.5 py-1 rounded-lg border border-slate-300 text-xs text-slate-800 bg-slate-50"
                />
              </div>

              <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-xs font-semibold">
                <button
                  onClick={() => setSelectedSession('Sáng')}
                  className={`px-2.5 py-1 rounded-md transition-all ${
                    selectedSession === 'Sáng' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-500'
                  }`}
                >
                  Buổi Sáng
                </button>
                <button
                  onClick={() => setSelectedSession('Chiều')}
                  className={`px-2.5 py-1 rounded-md transition-all ${
                    selectedSession === 'Chiều' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-500'
                  }`}
                >
                  Buổi Chiều
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Tìm học sinh..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs w-44"
              />
              <select
                value={groupFilter}
                onChange={(e) => setGroupFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-700 bg-slate-50"
              >
                <option value="all">Tất cả tổ</option>
                <option value={1}>Tổ 1</option>
                <option value={2}>Tổ 2</option>
                <option value={3}>Tổ 3</option>
                <option value={4}>Tổ 4</option>
              </select>
            </div>
          </div>

          {/* Attendance Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">STT</th>
                  <th className="py-3 px-4">Học sinh</th>
                  <th className="py-3 px-3">Tổ</th>
                  <th className="py-3 px-4">Trạng thái điểm danh (1-Chạm)</th>
                  <th className="py-3 px-4">Lý do / Ghi chú</th>
                  <th className="py-3 px-4 text-right">Thông báo Phụ huynh</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.map((st, index) => {
                  const record = attendance.find((a) => a.studentId === st.id);
                  const currentStatus = record?.status || 'present';

                  return (
                    <tr key={st.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 font-semibold text-slate-400">{index + 1}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <img src={st.avatarUrl} alt={st.name} className="w-7 h-7 rounded-full object-cover" />
                          <div>
                            <div className="font-bold text-slate-900">{st.name}</div>
                            <div className="text-[10px] text-slate-400">{st.code}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3 font-semibold text-slate-700">Tổ {st.group}</td>
                      <td className="py-3 px-4">
                        <div className="inline-flex items-center bg-slate-100 p-0.5 rounded-lg gap-1">
                          <button
                            onClick={() => onUpdateAttendance(st.id, 'present')}
                            className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                              currentStatus === 'present'
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : 'text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            ✓ Có mặt
                          </button>
                          <button
                            onClick={() => onUpdateAttendance(st.id, 'excused', 'Có đơn xin phép')}
                            className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                              currentStatus === 'excused'
                                ? 'bg-amber-600 text-white shadow-xs'
                                : 'text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            P (Phép)
                          </button>
                          <button
                            onClick={() => onUpdateAttendance(st.id, 'unexcused', 'Không có phép')}
                            className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                              currentStatus === 'unexcused'
                                ? 'bg-rose-600 text-white shadow-xs'
                                : 'text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            KP (K.Phép)
                          </button>
                          <button
                            onClick={() => onUpdateAttendance(st.id, 'late', 'Đến muộn')}
                            className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                              currentStatus === 'late'
                                ? 'bg-purple-600 text-white shadow-xs'
                                : 'text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            Muộn
                          </button>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <input
                          type="text"
                          placeholder={currentStatus === 'present' ? 'Bình thường' : 'Nhập lý do vắng/muộn...'}
                          defaultValue={record?.reason || ''}
                          onBlur={(e) => onUpdateAttendance(st.id, currentStatus, e.target.value)}
                          className="px-2 py-1 rounded border border-slate-200 text-xs w-full max-w-xs bg-slate-50 focus:bg-white"
                        />
                      </td>
                      <td className="py-3 px-4 text-right">
                        {currentStatus !== 'present' && (
                          <button
                            onClick={() => onNotifyParent(st.name, record?.reason || currentStatus)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 font-semibold text-[11px]"
                          >
                            <Send className="w-3 h-3" />
                            <span>Gửi SMS PH</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: DISCIPLINE & COMMENDATIONS */}
      {subTab === 'discipline' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <History className="w-4 h-4 text-slate-500" />
              Lịch sử Ghi nhận Vi phạm & Tuyên dương
            </h2>
            <button
              onClick={() => setShowAddEventModal(true)}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" /> Thêm ghi nhận mới
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {disciplineEvents.map((evt) => {
              const isCommendation = evt.type === 'commendation';

              return (
                <div
                  key={evt.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    isCommendation
                      ? 'bg-emerald-50/40 border-emerald-200 hover:border-emerald-400'
                      : 'bg-rose-50/40 border-rose-200 hover:border-rose-400'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`p-2 rounded-xl ${
                          isCommendation ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                        }`}
                      >
                        {isCommendation ? <Sparkles className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-sm text-slate-900">{evt.studentName}</h3>
                          <span className="text-[11px] text-slate-500">Tổ {evt.group}</span>
                        </div>
                        <div className="text-xs font-semibold text-slate-700">{evt.category}</div>
                      </div>
                    </div>

                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        isCommendation
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-rose-100 text-rose-800 border border-rose-300'
                      }`}
                    >
                      {evt.scoreChange > 0 ? `+${evt.scoreChange} điểm` : `${evt.scoreChange} điểm`}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 mt-2.5 leading-relaxed bg-white/70 p-2.5 rounded-lg border border-slate-200/60">
                    "{evt.description}"
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 mt-3 pt-2 border-t border-slate-200/60">
                    <span>Người ghi nhận: {evt.recordedBy}</span>
                    <span>{evt.date}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: GROUP RANKING */}
      {subTab === 'ranking' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Ranking Cards */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-500" />
              Bảng xếp hạng Thi đua 4 Tổ (Tuần 2)
            </h2>

            <div className="space-y-3">
              {[
                { group: 1, name: 'Tổ 1 (Xuất sắc)', score: 98, rank: 'Hạng 1 🥇', plus: 12, minus: 0, leader: 'Nguyễn Hoàng An' },
                { group: 3, name: 'Tổ 3 (Tiên tiến)', score: 94, rank: 'Hạng 2 🥈', plus: 6, minus: 0, leader: 'Vũ Đăng Khoa' },
                { group: 4, name: 'Tổ 4 (Khá)', score: 92, rank: 'Hạng 3 🥉', plus: 5, minus: 1, leader: 'Bùi Tuấn Kiệt' },
                { group: 2, name: 'Tổ 2 (Cần cố gắng)', score: 89, rank: 'Hạng 4', plus: 3, minus: 4, leader: 'Phạm Quỳnh Chi' },
              ].map((item, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-slate-700">{item.rank.split(' ')[0]}</span>
                    <div>
                      <h3 className="font-bold text-xs text-slate-900">{item.name}</h3>
                      <span className="text-[11px] text-slate-500">Tổ trưởng: {item.leader}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-base font-bold text-emerald-700">{item.score} đ</div>
                    <div className="text-[10px] text-slate-400">
                      <span className="text-emerald-600 font-semibold">+{item.plus}</span> /{' '}
                      <span className="text-rose-600 font-semibold">-{item.minus}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Criteria & Guidelines */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3 text-xs text-slate-700">
            <h2 className="text-sm font-bold text-slate-900">Quy định Thang điểm Thi đua Lớp 10A8</h2>
            <div className="space-y-2">
              <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200">
                <span className="font-bold text-emerald-800 block mb-1">Điểm cộng (+):</span>
                <ul className="list-disc list-inside space-y-0.5 text-emerald-900 text-[11px]">
                  <li>Phát biểu xây dựng bài: +3 điểm/lượt</li>
                  <li>Điểm 10 miệng/15p: +3 điểm/điểm 10</li>
                  <li>Trực nhật lớp sạch sẽ: +3 điểm/buổi</li>
                  <li>Giải phong trào trường/Đoàn: +10 điểm/giải</li>
                </ul>
              </div>

              <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200">
                <span className="font-bold text-rose-800 block mb-1">Điểm trừ (-):</span>
                <ul className="list-disc list-inside space-y-0.5 text-rose-900 text-[11px]">
                  <li>Đi học muộn: -2 điểm/lần</li>
                  <li>Không thuộc bài: -2 điểm/lần</li>
                  <li>Mất trật tự trong giờ: -3 điểm/lần</li>
                  <li>Nghỉ học không phép: -5 điểm/buổi</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add Discipline / Commendation Event */}
      {showAddEventModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <h3 className="font-bold text-slate-900 text-sm">Ghi nhận Sự kiện Nề nếp / Tuyên dương</h3>
              <button
                onClick={() => setShowAddEventModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="space-y-3 text-xs">
              {/* Type Switcher */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setEventType('commendation');
                    setEventCategory('Phát biểu xuất sắc');
                    setEventScoreChange(3);
                  }}
                  className={`py-2 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all ${
                    eventType === 'commendation'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Khen thưởng / Tuyên dương</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEventType('violation');
                    setEventCategory('Đi học muộn');
                    setEventScoreChange(2);
                  }}
                  className={`py-2 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all ${
                    eventType === 'violation'
                      ? 'bg-rose-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  <AlertTriangle className="w-4 h-4" />
                  <span>Vi phạm / Nhắc nhở</span>
                </button>
              </div>

              <div>
                <label className="font-semibold block text-slate-700 mb-1">Chọn Học sinh</label>
                <select
                  value={eventStudentId}
                  onChange={(e) => setEventStudentId(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-300 bg-slate-50 text-xs"
                >
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} (Tổ {s.group})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold block text-slate-700 mb-1">Loại sự việc</label>
                <select
                  value={eventCategory}
                  onChange={(e) => {
                    setEventCategory(e.target.value);
                    const list = eventType === 'commendation' ? commendationCategories : violationCategories;
                    const match = list.find((c) => c.name === e.target.value);
                    if (match) setEventScoreChange(Math.abs(match.defaultScore));
                  }}
                  className="w-full p-2 rounded-lg border border-slate-300 bg-slate-50 text-xs"
                >
                  {(eventType === 'commendation' ? commendationCategories : violationCategories).map((c, i) => (
                    <option key={i} value={c.name}>
                      {c.name} ({c.defaultScore > 0 ? `+${c.defaultScore}` : c.defaultScore} đ)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold block text-slate-700 mb-1">Mô tả chi tiết nội dung sự việc</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Ví dụ: Em phát biểu xây dựng bài 3 lần trong giờ Toán tiết 2..."
                  value={eventDescription}
                  onChange={(e) => setEventDescription(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-300 text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowAddEventModal(false)}
                  className="px-3.5 py-1.5 rounded-lg border border-slate-300 font-semibold text-slate-600"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 font-bold text-white shadow-xs"
                >
                  Ghi vào sổ theo dõi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

