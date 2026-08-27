import React, { useState } from 'react';
import { 
  X, 
  User, 
  Phone, 
  Heart, 
  Brain, 
  Activity, 
  Award, 
  MapPin, 
  Calendar, 
  Mail, 
  AlertTriangle, 
  ShieldCheck, 
  Edit3,
  Send,
  Printer
} from 'lucide-react';
import { Student } from '../../types';

interface StudentDetailModalProps {
  student: Student | null;
  onClose: () => void;
  onEdit: (student: Student) => void;
  onSendMessage: (student: Student) => void;
}

export const StudentDetailModal: React.FC<StudentDetailModalProps> = ({
  student,
  onClose,
  onEdit,
  onSendMessage,
}) => {
  const [activeTab, setActiveTab] = useState<'basic' | 'parents' | 'family' | 'psychology' | 'health'>('basic');

  if (!student) return null;

  const tabs = [
    { id: 'basic', label: '1. Thông tin cơ bản', icon: User },
    { id: 'parents', label: '2. Phụ huynh & Liên hệ', icon: Phone },
    { id: 'family', label: '3. Hoàn cảnh gia đình', icon: Heart },
    { id: 'psychology', label: '4. Tâm sinh lý & Năng khiếu', icon: Brain },
    { id: 'health', label: '5. Sức khỏe & Y tế', icon: Activity },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header with avatar & basic badge */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 p-4 sm:p-6 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={student.avatarUrl}
              alt={student.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-emerald-400 shadow-md"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">{student.name}</h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  {student.roleInClass}
                </span>
              </div>
              <div className="text-xs text-slate-300 mt-1 flex flex-wrap items-center gap-3">
                <span>Mã: <strong className="text-white">{student.code}</strong></span>
                <span>•</span>
                <span>Tổ {student.group}</span>
                <span>•</span>
                <span>ĐTB: <strong className="text-emerald-400 font-bold">{student.overallGpa}</strong> ({student.academicRank})</span>
                <span>•</span>
                <span>Nề nếp: <strong className="text-amber-400 font-bold">{student.conductScore} đ</strong> ({student.conductRank})</span>
              </div>
            </div>
          </div>

          {/* Header Action Buttons */}
          <div className="flex items-center gap-2 self-end sm:self-center">
            <button
              onClick={() => onSendMessage(student)}
              className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Nhắn PH</span>
            </button>
            <button
              onClick={() => onEdit(student)}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Chỉnh sửa</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center border-b border-slate-200 bg-slate-50 px-4 overflow-x-auto scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-3 px-3.5 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
                  isActive
                    ? 'border-emerald-600 text-emerald-700 bg-white shadow-xs'
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Contents */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 text-slate-800 text-sm space-y-6">
          {/* TAB 1: BASIC INFO */}
          {activeTab === 'basic' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Lý lịch Trích ngang</h3>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-400 block">Họ và tên:</span>
                    <span className="font-semibold text-slate-900 text-sm">{student.name}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Giới tính:</span>
                    <span className="font-semibold text-slate-900 text-sm">{student.gender}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Ngày sinh:</span>
                    <span className="font-semibold text-slate-900 text-sm">{student.dob}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Mã định danh:</span>
                    <span className="font-semibold text-slate-900 text-sm">{student.code}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-400 block">Địa chỉ thường trú:</span>
                    <span className="font-semibold text-slate-900 text-sm">{student.address}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Nhiệm vụ & Đoàn thể</h3>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-400 block">Phân công tổ:</span>
                    <span className="font-semibold text-slate-900 text-sm">Tổ {student.group}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Chức vụ ban cán sự:</span>
                    <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-xs inline-block">
                      {student.roleInClass}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Xếp loại học lực HK1:</span>
                    <span className="font-semibold text-slate-900 text-sm">{student.academicRank} ({student.overallGpa})</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Xếp loại rèn luyện:</span>
                    <span className="font-semibold text-slate-900 text-sm">{student.conductRank} ({student.conductScore} đ)</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PARENTS & CONTACT */}
          {activeTab === 'parents' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Thông tin Phụ huynh / Người giám hộ</h3>
                <span className="text-xs text-slate-500">Có {student.parents.length} người liên hệ</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {student.parents.map((p, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200 relative">
                    {p.isPrimaryContact && (
                      <span className="absolute top-3 right-3 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        Liên hệ chính
                      </span>
                    )}
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-7 h-7 rounded-full bg-slate-200 font-bold text-slate-700 flex items-center justify-center text-xs">
                        {p.relation[0]}
                      </span>
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">{p.name}</h4>
                        <span className="text-xs text-slate-500">{p.relation} • {p.job}</span>
                      </div>
                    </div>

                    <div className="space-y-1.5 text-xs mt-3 pt-2 border-t border-slate-200">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-emerald-600" /> SĐT:</span>
                        <a href={`tel:${p.phone}`} className="font-bold text-emerald-700 hover:underline">{p.phone}</a>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-sky-600" /> Email:</span>
                        <span className="text-slate-800">{p.email || 'Chưa cập nhật'}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: FAMILY BACKGROUND */}
          {activeTab === 'family' && (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Hoàn cảnh gia đình & Xã hội</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 block">Số anh chị em:</span>
                  <span className="font-bold text-slate-900 text-sm">{student.family.totalSiblings} người (Con thứ {student.family.birthOrder})</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Tình trạng hôn nhân PH:</span>
                  <span className="font-bold text-slate-900 text-sm">{student.family.parentsMaritalStatus}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Hoàn cảnh kinh tế:</span>
                  <span className="font-bold text-emerald-700 text-sm">{student.family.economicStatus}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 text-xs">
                <span className="text-slate-500 font-semibold block mb-1">Ghi chú riêng của GVCN:</span>
                <p className="text-slate-700 bg-white p-3 rounded-lg border border-slate-200 leading-relaxed italic">
                  {student.family.specialNotes || 'Chưa có ghi chú đặc biệt về gia cảnh.'}
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: PSYCHOLOGICAL PROFILE */}
          {activeTab === 'psychology' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Đặc điểm Tính cách & Sở thích</h3>
                  <div>
                    <span className="text-[11px] text-slate-500 block mb-1.5">Nét tính cách nổi bật:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {student.psychology.personality.map((p, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-md bg-sky-100 text-sky-800 text-xs font-medium">
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block mb-1.5">Sở thích cá nhân:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {student.psychology.interests.map((p, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 text-xs font-medium">
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Điểm mạnh & Năng khiếu</h3>
                  <div>
                    <span className="text-[11px] text-slate-500 block mb-1.5">Điểm mạnh & Năng khiếu:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {student.psychology.aptitudes.map((a, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-xs font-medium">
                          ⭐ {a}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block mb-1.5">Điểm cần rèn luyện:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {student.psychology.weaknesses.map((w, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 text-xs font-medium">
                          {w}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-700">Mức độ hỗ trợ tâm lý & động viên:</span>
                  <span className={`px-2 py-0.5 rounded font-bold ${
                    student.psychology.supportLevel === 'Bình thường'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {student.psychology.supportLevel}
                  </span>
                </div>
                <p className="text-slate-700 bg-white p-3 rounded-lg border border-slate-200 leading-relaxed italic">
                  💬 Nhận xét: "{student.psychology.teacherObservations}"
                </p>
              </div>
            </div>
          )}

          {/* TAB 5: HEALTH & MEDICAL */}
          {activeTab === 'health' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                  <span className="text-slate-400 text-xs block">Nhóm máu</span>
                  <span className="text-lg font-bold text-rose-600">{student.health.bloodType}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                  <span className="text-slate-400 text-xs block">Chiều cao</span>
                  <span className="text-lg font-bold text-slate-900">{student.health.heightCm} cm</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                  <span className="text-slate-400 text-xs block">Cân nặng</span>
                  <span className="text-lg font-bold text-slate-900">{student.health.weightKg} kg</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                  <span className="text-slate-400 text-xs block">Thị lực</span>
                  <span className="text-sm font-bold text-slate-900">{student.health.vision}</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Cảnh báo Y tế & Thể chất</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <span className="text-slate-500 font-semibold block mb-1">Dị ứng ghi nhận:</span>
                    {student.health.allergies.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {student.health.allergies.map((a, i) => (
                          <span key={i} className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 font-semibold text-xs flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" /> {a}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-slate-500 italic">Không có dị ứng đặc biệt</span>
                    )}
                  </div>

                  <div>
                    <span className="text-slate-500 font-semibold block mb-1">Chế độ Thể dục / Vận động:</span>
                    <span className={`px-2 py-0.5 rounded font-bold inline-block text-xs ${
                      student.health.physicalEducationNote === 'Bình thường'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}>
                      {student.health.physicalEducationNote}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200">
                  <span className="text-slate-500 font-semibold block mb-1">Ghi chú Y tế học đường:</span>
                  <p className="text-slate-700 bg-white p-2.5 rounded-lg border border-slate-200">
                    {student.health.medicalNotes || 'Sức khỏe ổn định, không có lưu ý y tế.'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Hồ sơ cập nhật: Học kỳ I, Năm học 2025-2026</span>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 text-slate-600 hover:text-slate-900 font-semibold"
          >
            <Printer className="w-4 h-4" /> In trích lục hồ sơ
          </button>
        </div>
      </div>
    </div>
  );
};
