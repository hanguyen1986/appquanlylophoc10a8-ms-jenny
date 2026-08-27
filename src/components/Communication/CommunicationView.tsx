import React, { useState } from 'react';
import { 
  MessageSquareQuote, 
  Send, 
  Phone, 
  Calendar, 
  Users, 
  CheckCircle2, 
  Clock, 
  Video, 
  Plus, 
  Search, 
  Sparkles,
  MessageCircle,
  FileText,
  Key,
  Bot,
  RefreshCw,
  AlertTriangle
} from 'lucide-react';
import { Student, MessageThread, ParentAppointment } from '../../types';
import { GeminiService } from '../../services/geminiService';

interface CommunicationViewProps {
  students: Student[];
  messages: MessageThread[];
  appointments: ParentAppointment[];
  onSendMessage: (msg: Omit<MessageThread, 'id' | 'sentAt' | 'repliesCount'>) => void;
  onAddAppointment: (apt: Omit<ParentAppointment, 'id'>) => void;
  onOpenApiKeyModal?: () => void;
}

export const CommunicationView: React.FC<CommunicationViewProps> = ({
  students,
  messages,
  appointments,
  onSendMessage,
  onAddAppointment,
  onOpenApiKeyModal,
}) => {
  const [activeTab, setActiveTab] = useState<'broadcast' | 'direct' | 'appointments'>('broadcast');

  // Message form state
  const [msgTitle, setMsgTitle] = useState('');
  const [msgContent, setMsgContent] = useState('');
  const [msgChannel, setMsgChannel] = useState<'App' | 'SMS' | 'Zalo'>('App');
  const [selectedRecipientType, setSelectedRecipientType] = useState<'all' | 'custom'>('all');
  const [selectedStudentId, setSelectedStudentId] = useState(students[0]?.id || '');

  // AI draft state
  const [isDraftingAi, setIsDraftingAi] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  // Appointment form state
  const [showAptModal, setShowAptModal] = useState(false);
  const [aptStudentId, setAptStudentId] = useState(students[0]?.id || '');
  const [aptType, setAptType] = useState<'Trực tiếp tại trường' | 'Trực tuyến (Meet/Zoom)'>('Trực tiếp tại trường');
  const [aptDate, setAptDate] = useState('2026-08-28');
  const [aptTime, setAptTime] = useState('16:30 - 17:00');
  const [aptTopic, setAptTopic] = useState('');

  // Sample templates for teacher
  const messageTemplates = [
    {
      title: 'Nhắc nhở học tập & chuyên cần',
      content: 'Kính gửi Quý phụ huynh, em [Tên HS] tuần này có biểu hiện mất tập trung trong giờ học. Kính đề nghị gia đình phối hợp nhắc nhở con chuẩn bị bài kỹ trước khi đến lớp.',
    },
    {
      title: 'Tuyên dương thành tích xuất sắc',
      content: 'Kính gửi Quý phụ huynh, GVCN Ms Jenny xin chúc mừng em [Tên HS] đã đạt kết quả xuất sắc trong kỳ kiểm tra vừa qua và tích cực phát biểu xây dựng bài!',
    },
    {
      title: 'Mời họp trao đổi định hướng',
      content: 'Kính mời Quý phụ huynh sắp xếp buổi trao đổi ngắn vào chiều thứ Sáu để cùng thảo luận về kế hoạch bồi dưỡng học sinh giỏi cho con.',
    }
  ];

  const handleAiDraft = async () => {
    if (!GeminiService.hasApiKey()) {
      if (onOpenApiKeyModal) onOpenApiKeyModal();
      return;
    }

    setIsDraftingAi(true);
    setAiError(null);

    const targetStudent = students.find((s) => s.id === selectedStudentId);

    const result = await GeminiService.generateParentMessage({
      type: selectedRecipientType,
      topic: msgTitle || 'Thông báo học tập & nề nếp lớp 10A8',
      studentName: targetStudent?.name,
      keyNotes: msgContent || 'Nhắc nhở học tập và nề nếp thi đua',
      channel: msgChannel,
    });

    if (result.success) {
      setMsgContent(result.text);
      if (!msgTitle) {
        setMsgTitle(`[Lớp 10A8] Thông báo từ GVCN Ms Jenny`);
      }
    } else {
      setAiError(result.error || 'Không thể tạo nội dung AI');
    }

    setIsDraftingAi(false);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!msgTitle.trim() || !msgContent.trim()) return;

    const recipientName =
      selectedRecipientType === 'all'
        ? 'Toàn bộ Phụ huynh Lớp 10A8 (36 PH)'
        : `PH Em ${students.find((s) => s.id === selectedStudentId)?.name}`;

    onSendMessage({
      type: selectedRecipientType === 'all' ? 'broadcast' : 'individual',
      recipientIds: selectedRecipientType === 'all' ? ['all'] : [selectedStudentId],
      recipientNames: recipientName,
      channel: msgChannel,
      title: msgTitle,
      content: msgContent,
      status: 'Đã gửi',
    });

    setMsgTitle('');
    setMsgContent('');
    alert('Đã gửi thông báo thành công tới phụ huynh qua kênh ' + msgChannel);
  };

  const handleCreateAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    const student = students.find((s) => s.id === aptStudentId);
    if (!student) return;

    onAddAppointment({
      studentId: student.id,
      studentName: student.name,
      parentName: `${student.parents[0]?.name} (${student.parents[0]?.relation})`,
      phone: student.parents[0]?.phone || '',
      type: aptType,
      date: aptDate,
      time: aptTime,
      topic: aptTopic || 'Trao đổi tình hình học tập và nề nếp',
      status: 'Chờ xác nhận',
      meetingLinkOrRoom: aptType === 'Trực tuyến (Meet/Zoom)' ? 'https://meet.google.com/edu-class-10a8' : 'Phòng Tiếp PH (Tầng 1)',
    });

    setShowAptModal(false);
    setAptTopic('');
  };

  return (
    <div className="space-y-5">
      {/* Header & Tabs */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="p-2 rounded-xl bg-sky-100 text-sky-700">
            <MessageSquareQuote className="w-5 h-5" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-slate-900">Sổ Liên Lạc Điện Tử & Giao Tiếp Phụ Huynh</h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-100 text-sky-800 border border-sky-300">
                Lớp 10A8 - Ms Jenny
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">Đa kênh tích hợp: Ứng dụng EduMaster, SMS Brandname & Zalo OA</p>
          </div>
        </div>

        <div className="flex items-center bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('broadcast')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'broadcast' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            📢 Gửi Thông báo Lớp
          </button>
          <button
            onClick={() => setActiveTab('direct')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'direct' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            💬 Hộp thư & Lịch sử
          </button>
          <button
            onClick={() => setActiveTab('appointments')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'appointments' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            📅 Lịch hẹn Tiếp PH ({appointments.length})
          </button>
        </div>
      </div>

      {/* TAB 1: COMPOSE & BROADCAST */}
      {activeTab === 'broadcast' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Compose Form */}
          <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Send className="w-4 h-4 text-emerald-600" />
                Soạn Tin Nhắn / Thông Báo
              </h2>

              <button
                type="button"
                onClick={handleAiDraft}
                disabled={isDraftingAi}
                className="px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
              >
                <Sparkles className={`w-3.5 h-3.5 ${isDraftingAi ? 'animate-spin' : ''}`} />
                <span>{isDraftingAi ? 'AI Đang viết...' : '✨ AI Soạn thông điệp'}</span>
              </button>
            </div>

            {aiError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{aiError}</span>
              </div>
            )}

            <form onSubmit={handleSend} className="space-y-3.5 text-xs text-slate-700">
              {/* Recipient & Channel Picker */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block text-slate-700 mb-1">Đối tượng nhận:</label>
                  <select
                    value={selectedRecipientType}
                    onChange={(e) => setSelectedRecipientType(e.target.value as any)}
                    className="w-full p-2 rounded-lg border border-slate-300 bg-slate-50 text-xs font-medium"
                  >
                    <option value="all">Toàn bộ 36 Phụ huynh (Lớp 10A8)</option>
                    <option value="custom">Gửi riêng từng Phụ huynh học sinh</option>
                  </select>
                </div>

                {selectedRecipientType === 'custom' && (
                  <div>
                    <label className="font-semibold block text-slate-700 mb-1">Chọn học sinh:</label>
                    <select
                      value={selectedStudentId}
                      onChange={(e) => setSelectedStudentId(e.target.value)}
                      className="w-full p-2 rounded-lg border border-slate-300 bg-slate-50 text-xs"
                    >
                      {students.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name} - PH: {s.parents[0]?.name} ({s.parents[0]?.phone})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="font-semibold block text-slate-700 mb-1">Kênh phát tin:</label>
                  <div className="flex items-center gap-2">
                    {(['App', 'SMS', 'Zalo'] as const).map((ch) => (
                      <button
                        key={ch}
                        type="button"
                        onClick={() => setMsgChannel(ch)}
                        className={`flex-1 py-1.5 rounded-lg border font-semibold text-xs transition-all cursor-pointer ${
                          msgChannel === ch
                            ? 'bg-slate-900 text-white border-slate-900'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {ch === 'App' ? '📱 App Edu' : ch === 'SMS' ? '✉️ SMS' : '💬 Zalo OA'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="font-semibold block text-slate-700 mb-1">Tiêu đề thông báo *</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Thông báo Họp Phụ huynh / Kế hoạch Dã ngoại..."
                  value={msgTitle}
                  onChange={(e) => setMsgTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="font-semibold block text-slate-700 mb-1">Nội dung chi tiết *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Nhập nội dung thông điệp gửi tới phụ huynh hoặc nhấn '✨ AI Soạn thông điệp' ở trên..."
                  value={msgContent}
                  onChange={(e) => setMsgContent(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] text-slate-400">Tự động gắn chữ ký: Ms Jenny - GVCN 10A8</span>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" /> Gửi thông báo ngay
                </button>
              </div>
            </form>
          </div>

          {/* Quick Templates Sidebar */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              Mẫu Soạn sẵn Tiêu chuẩn
            </h3>

            <div className="space-y-2.5">
              {messageTemplates.map((tpl, i) => (
                <div
                  key={i}
                  onClick={() => {
                    setMsgTitle(tpl.title);
                    setMsgContent(tpl.content);
                  }}
                  className="p-3 rounded-xl bg-slate-50 hover:bg-emerald-50/60 border border-slate-200 hover:border-emerald-300 cursor-pointer transition-all text-xs"
                >
                  <h4 className="font-bold text-slate-900 mb-1 text-emerald-800">{tpl.title}</h4>
                  <p className="text-slate-600 line-clamp-2 text-[11px]">{tpl.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DIRECT MESSAGES & THREADS */}
      {activeTab === 'direct' && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900">Lịch sử Thông Báo & Tin Nhắn Đã Gửi</h2>

          <div className="space-y-3">
            {messages.map((m) => (
              <div key={m.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                      m.channel === 'App' ? 'bg-emerald-100 text-emerald-800' : m.channel === 'SMS' ? 'bg-sky-100 text-sky-800' : 'bg-purple-100 text-purple-800'
                    }`}>
                      {m.channel}
                    </span>
                    <h3 className="font-bold text-slate-900 text-sm">{m.title}</h3>
                  </div>
                  <span className="text-slate-400 text-[11px]">{m.sentAt}</span>
                </div>

                <p className="text-slate-700 bg-white p-3 rounded-lg border border-slate-200/60 leading-relaxed">
                  {m.content}
                </p>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                  <span>Người nhận: <strong className="text-slate-800">{m.recipientNames}</strong></span>
                  <span className="text-emerald-700 font-semibold">{m.repliesCount} phản hồi / đã đọc</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: APPOINTMENTS */}
      {activeTab === 'appointments' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900">Danh sách Lịch hẹn Gặp Phụ huynh Lớp 10A8</h2>
            <button
              onClick={() => setShowAptModal(true)}
              className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Lên lịch hẹn mới
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {appointments.map((apt) => (
              <div key={apt.id} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3 text-xs">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">{apt.topic}</h3>
                    <div className="text-slate-500 mt-0.5">
                      Học sinh: <strong className="text-slate-800">{apt.studentName}</strong> • {apt.parentName}
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                    apt.status === 'Đã duyệt' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {apt.status}
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 space-y-1 text-slate-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{apt.date} • {apt.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {apt.type.includes('Trực tuyến') ? <Video className="w-3.5 h-3.5 text-sky-600" /> : <Users className="w-3.5 h-3.5 text-purple-600" />}
                    <span>{apt.meetingLinkOrRoom}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Create Appointment Modal */}
          {showAptModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
              <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md p-5 space-y-4 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <h3 className="font-bold text-slate-900 text-sm">Tạo Lịch Hẹn Tiếp Phụ Huynh</h3>
                  <button onClick={() => setShowAptModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">✕</button>
                </div>

                <form onSubmit={handleCreateAppointment} className="space-y-3">
                  <div>
                    <label className="font-semibold block text-slate-700 mb-1">Chọn Học sinh</label>
                    <select
                      value={aptStudentId}
                      onChange={(e) => setAptStudentId(e.target.value)}
                      className="w-full p-2 rounded-lg border border-slate-300 bg-slate-50 text-xs"
                    >
                      {students.map((s) => (
                        <option key={s.id} value={s.id}>{s.name} (Tổ {s.group})</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold block text-slate-700 mb-1">Hình thức tiếp</label>
                    <select
                      value={aptType}
                      onChange={(e) => setAptType(e.target.value as any)}
                      className="w-full p-2 rounded-lg border border-slate-300 bg-slate-50 text-xs"
                    >
                      <option value="Trực tiếp tại trường">Trực tiếp tại phòng tiếp PH trường</option>
                      <option value="Trực tuyến (Meet/Zoom)">Trực tuyến qua Google Meet / Zoom</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="font-semibold block text-slate-700 mb-1">Ngày hẹn</label>
                      <input
                        type="date"
                        value={aptDate}
                        onChange={(e) => setAptDate(e.target.value)}
                        className="w-full p-2 rounded-lg border border-slate-300 text-xs"
                      />
                    </div>
                    <div>
                      <label className="font-semibold block text-slate-700 mb-1">Khung giờ</label>
                      <input
                        type="text"
                        value={aptTime}
                        onChange={(e) => setAptTime(e.target.value)}
                        placeholder="16:30 - 17:00"
                        className="w-full p-2 rounded-lg border border-slate-300 text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-semibold block text-slate-700 mb-1">Chủ đề trao đổi *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ví dụ: Trao đổi về định hướng khối thi và kèm cặp môn Toán..."
                      value={aptTopic}
                      onChange={(e) => setAptTopic(e.target.value)}
                      className="w-full p-2 rounded-lg border border-slate-300 text-xs"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                    <button
                      type="button"
                      onClick={() => setShowAptModal(false)}
                      className="px-3.5 py-1.5 rounded-lg border border-slate-300 font-semibold text-slate-600 cursor-pointer"
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 font-bold text-white shadow-xs cursor-pointer"
                    >
                      Gửi giấy hẹn PH
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
