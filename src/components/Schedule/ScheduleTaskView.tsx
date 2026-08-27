import React, { useState } from 'react';
import { 
  CalendarDays, 
  CheckSquare, 
  Plus, 
  Clock, 
  AlertCircle, 
  MapPin, 
  Calendar as CalendarIcon, 
  CheckCircle2, 
  Trash2,
  Filter
} from 'lucide-react';
import { CalendarTask } from '../../types';

interface ScheduleTaskViewProps {
  tasks: CalendarTask[];
  onToggleTask: (taskId: string) => void;
  onAddTask: (task: Omit<CalendarTask, 'id'>) => void;
  onDeleteTask: (taskId: string) => void;
}

export const ScheduleTaskView: React.FC<ScheduleTaskViewProps> = ({
  tasks,
  onToggleTask,
  onAddTask,
  onDeleteTask,
}) => {
  const [viewMode, setViewMode] = useState<'timeline' | 'tasks'>('tasks');
  const [showAddModal, setShowAddModal] = useState(false);

  // New task form state
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'Giảng dạy' | 'Chủ nhiệm' | 'Họp trường/Tổ' | 'Hạn nộp báo cáo' | 'Phong trào'>('Chủ nhiệm');
  const [date, setDate] = useState('2026-08-27');
  const [time, setTime] = useState('09:00');
  const [priority, setPriority] = useState<'Cao' | 'Trung bình' | 'Thấp'>('Trung bình');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddTask({
      title,
      category,
      date,
      time,
      priority,
      location,
      description,
      completed: false,
    });

    setShowAddModal(false);
    setTitle('');
    setLocation('');
    setDescription('');
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="p-2 rounded-xl bg-purple-100 text-purple-700">
            <CalendarDays className="w-5 h-5" />
          </span>
          <div>
            <h1 className="text-lg font-bold text-slate-900">Lịch Công Tác & Sổ Nhắc Việc GVCN</h1>
            <p className="text-xs text-slate-500">Quản lý thời khóa biểu, lịch họp tổ chuyên môn, hạn nộp hồ sơ & sự kiện lớp</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-100 p-0.5 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setViewMode('tasks')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'tasks' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-500'
              }`}
            >
              ✓ Sổ nhắc việc (To-Do)
            </button>
            <button
              onClick={() => setViewMode('timeline')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'timeline' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-500'
              }`}
            >
              📅 Lịch tuần chi tiết
            </button>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Thêm công việc</span>
          </button>
        </div>
      </div>

      {/* VIEW: TASKS LIST */}
      {viewMode === 'tasks' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Main Tasks List */}
          <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900">Danh Sách Việc Cần Làm</h2>
              <span className="text-xs text-slate-500 font-medium">
                {tasks.filter((t) => !t.completed).length} việc chưa hoàn thành
              </span>
            </div>

            <div className="space-y-2.5">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className={`p-3.5 rounded-xl border transition-all flex items-start justify-between gap-3 ${
                    task.completed
                      ? 'bg-slate-50 border-slate-200 opacity-60'
                      : task.priority === 'Cao'
                      ? 'bg-amber-50/50 border-amber-200 hover:border-amber-300'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => onToggleTask(task.id)}
                      className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center transition-all cursor-pointer ${
                        task.completed
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'border-slate-300 hover:border-emerald-500 bg-white'
                      }`}
                    >
                      {task.completed && <CheckCircle2 className="w-4 h-4" />}
                    </button>

                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className={`font-bold text-xs ${task.completed ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                          {task.title}
                        </h3>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          task.priority === 'Cao' ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {task.priority}
                        </span>
                      </div>

                      {task.description && (
                        <p className="text-slate-600 text-[11px] mt-1">{task.description}</p>
                      )}

                      <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-2">
                        <span className="flex items-center gap-1 font-medium text-slate-600">
                          <Clock className="w-3 h-3 text-emerald-600" /> {task.date} ({task.time})
                        </span>
                        <span>•</span>
                        <span className="text-slate-600 font-semibold">{task.category}</span>
                        {task.location && (
                          <>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-slate-400" /> {task.location}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => onDeleteTask(task.id)}
                    className="p-1 rounded text-slate-400 hover:text-rose-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Schedule Assistant */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4 text-xs">
            <h3 className="font-bold text-slate-900 text-sm">Thời Khóa Biểu Tuần - Lớp 10A8</h3>

            <div className="space-y-2">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-800 block text-xs mb-1">Thứ Hai:</span>
                <span className="text-slate-600 text-[11px]">Chào cờ • Toán (2T) • Ngữ văn • Tiếng Anh</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-800 block text-xs mb-1">Thứ Ba:</span>
                <span className="text-slate-600 text-[11px]">Vật lí • Hóa học • Sinh học • Tin học</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-800 block text-xs mb-1">Thứ Sáu:</span>
                <span className="text-slate-600 text-[11px]">Lịch sử • Địa lí • GDKT&PL • Sinh hoạt Lớp (GVCN)</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* TIMELINE VIEW */
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900">Lịch Trình Công Tác Trong Tuần (25/08 - 31/08/2025)</h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-xs">
            {['Thứ 2 (25/8)', 'Thứ 3 (26/8)', 'Thứ 4 (27/8)', 'Thứ 5 (28/8)', 'Thứ 6 (29/8)'].map((day, i) => (
              <div key={i} className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="font-bold text-slate-900 block border-b border-slate-200 pb-1">{day}</span>
                {i === 1 && (
                  <div className="p-2 rounded bg-emerald-100 text-emerald-800 text-[11px] font-semibold">
                    10h00: Điểm danh & Báo cáo sĩ số
                  </div>
                )}
                {i === 3 && (
                  <div className="p-2 rounded bg-purple-100 text-purple-800 text-[11px] font-semibold">
                    14h00: Họp Tổ Toán
                  </div>
                )}
                {i === 4 && (
                  <div className="p-2 rounded bg-amber-100 text-amber-800 text-[11px] font-semibold">
                    11h15: Tiết Sinh hoạt Lớp
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md p-5 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <h3 className="font-bold text-slate-900 text-sm">Thêm Lịch Công Tác / Nhắc Việc</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="font-semibold block text-slate-700 mb-1">Tên công việc / Sự kiện *</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Nộp sổ điểm về BGH / Họp phụ huynh..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-300 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold block text-slate-700 mb-1">Phân loại</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full p-2 rounded-lg border border-slate-300 bg-slate-50 text-xs"
                  >
                    <option value="Chủ nhiệm">Chủ nhiệm</option>
                    <option value="Giảng dạy">Giảng dạy</option>
                    <option value="Họp trường/Tổ">Họp trường/Tổ</option>
                    <option value="Hạn nộp báo cáo">Hạn nộp báo cáo</option>
                    <option value="Phong trào">Phong trào</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold block text-slate-700 mb-1">Mức độ ưu tiên</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full p-2 rounded-lg border border-slate-300 bg-slate-50 text-xs"
                  >
                    <option value="Cao">Gấp / Quan trọng</option>
                    <option value="Trung bình">Trung bình</option>
                    <option value="Thấp">Thấp</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold block text-slate-700 mb-1">Ngày thực hiện</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-300 text-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold block text-slate-700 mb-1">Giờ</label>
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-300 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold block text-slate-700 mb-1">Địa điểm (nếu có)</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Phòng Hội đồng / Phòng học 204..."
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-300 text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3.5 py-1.5 rounded-lg border border-slate-300 font-semibold text-slate-600"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 font-bold text-white shadow-xs"
                >
                  Lưu vào lịch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

