import React, { useState } from 'react';
import { X, Save, User, Phone, Heart, Brain, Activity } from 'lucide-react';
import { Student, Gender, AcademicRank, ConductRank } from '../../types';

interface StudentEditModalProps {
  student: Student | null;
  onClose: () => void;
  onSave: (student: Student) => void;
}

export const StudentEditModal: React.FC<StudentEditModalProps> = ({
  student,
  onClose,
  onSave,
}) => {
  const isNew = !student;

  const [formData, setFormData] = useState<Student>(
    student || {
      id: `hs-${Date.now()}`,
      code: `HS25-10A8-${Math.floor(Math.random() * 90 + 10)}`,
      name: '',
      dob: '2010-01-01',
      gender: 'Nam',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      address: '',
      group: 1,
      roleInClass: 'Học sinh',
      conductScore: 100,
      overallGpa: 8.0,
      academicRank: 'Giỏi',
      conductRank: 'Tốt',
      parents: [
        {
          relation: 'Bố',
          name: '',
          phone: '',
          email: '',
          job: '',
          isPrimaryContact: true,
        },
      ],
      family: {
        totalSiblings: 1,
        birthOrder: 1,
        parentsMaritalStatus: 'Cùng sống',
        economicStatus: 'Bình thường',
        specialNotes: '',
      },
      psychology: {
        personality: ['Hòa đồng', 'Chăm chỉ'],
        interests: ['Đọc sách'],
        strengths: ['Tự giác'],
        weaknesses: [],
        aptitudes: [],
        teacherObservations: '',
        supportLevel: 'Bình thường',
      },
      health: {
        bloodType: 'O',
        heightCm: 165,
        weightKg: 50,
        vision: 'Bình thường',
        allergies: [],
        chronicConditions: [],
        physicalEducationNote: 'Bình thường',
        medicalNotes: '',
      },
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-slate-900 p-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-emerald-400" />
            <h2 className="font-bold text-base">
              {isNew ? 'Thêm Hồ sơ Học sinh Mới' : `Chỉnh sửa Hồ sơ: ${formData.name}`}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto flex-1 space-y-5 text-xs text-slate-700">
          {/* Section 1: Basic */}
          <div>
            <h3 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-3 pb-1 border-b border-slate-200">
              1. Thông tin Lý lịch Cơ bản
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="font-semibold block text-slate-700 mb-1">Họ và tên *</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Nguyễn Văn An"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 text-xs"
                />
              </div>

              <div>
                <label className="font-semibold block text-slate-700 mb-1">Mã định danh HS</label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                />
              </div>

              <div>
                <label className="font-semibold block text-slate-700 mb-1">Giới tính</label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value as Gender })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                >
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                </select>
              </div>

              <div>
                <label className="font-semibold block text-slate-700 mb-1">Ngày sinh</label>
                <input
                  type="date"
                  value={formData.dob}
                  onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                />
              </div>

              <div>
                <label className="font-semibold block text-slate-700 mb-1">Phân công Tổ</label>
                <select
                  value={formData.group}
                  onChange={(e) => setFormData({ ...formData, group: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                >
                  <option value={1}>Tổ 1</option>
                  <option value={2}>Tổ 2</option>
                  <option value={3}>Tổ 3</option>
                  <option value={4}>Tổ 4</option>
                </select>
              </div>

              <div>
                <label className="font-semibold block text-slate-700 mb-1">Chức vụ lớp</label>
                <select
                  value={formData.roleInClass}
                  onChange={(e) => setFormData({ ...formData, roleInClass: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                >
                  <option value="Học sinh">Học sinh</option>
                  <option value="Lớp trưởng">Lớp trưởng</option>
                  <option value="Lớp phó Học tập">Lớp phó Học tập</option>
                  <option value="Lớp phó Lao động">Lớp phó Lao động</option>
                  <option value="Tổ trưởng">Tổ trưởng</option>
                  <option value="Bí thư Chi đoàn">Bí thư Chi đoàn</option>
                </select>
              </div>

              <div className="sm:col-span-3">
                <label className="font-semibold block text-slate-700 mb-1">Địa chỉ thường trú</label>
                <input
                  type="text"
                  placeholder="Số nhà, phố, quận/huyện, tỉnh/TP"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Parents */}
          <div>
            <h3 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-3 pb-1 border-b border-slate-200">
              2. Thông tin Phụ huynh chính
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="font-semibold block text-slate-700 mb-1">Họ tên Phụ huynh</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Nguyễn Văn Hùng"
                  value={formData.parents[0]?.name || ''}
                  onChange={(e) => {
                    const newParents = [...formData.parents];
                    newParents[0] = { ...newParents[0], name: e.target.value };
                    setFormData({ ...formData, parents: newParents });
                  }}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                />
              </div>

              <div>
                <label className="font-semibold block text-slate-700 mb-1">Số điện thoại liên hệ *</label>
                <input
                  type="tel"
                  placeholder="0912345678"
                  value={formData.parents[0]?.phone || ''}
                  onChange={(e) => {
                    const newParents = [...formData.parents];
                    newParents[0] = { ...newParents[0], phone: e.target.value };
                    setFormData({ ...formData, parents: newParents });
                  }}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                />
              </div>

              <div>
                <label className="font-semibold block text-slate-700 mb-1">Nghề nghiệp</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Kỹ sư, Bác sĩ, Kinh doanh..."
                  value={formData.parents[0]?.job || ''}
                  onChange={(e) => {
                    const newParents = [...formData.parents];
                    newParents[0] = { ...newParents[0], job: e.target.value };
                    setFormData({ ...formData, parents: newParents });
                  }}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Psychology & Support */}
          <div>
            <h3 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-3 pb-1 border-b border-slate-200">
              3. Tâm sinh lý & Theo dõi của GVCN
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-semibold block text-slate-700 mb-1">Mức độ hỗ trợ cần thiết</label>
                <select
                  value={formData.psychology.supportLevel}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      psychology: { ...formData.psychology, supportLevel: e.target.value as any },
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                >
                  <option value="Bình thường">Bình thường</option>
                  <option value="Cần quan tâm động viên">Cần quan tâm động viên</option>
                  <option value="Đặc biệt cần hỗ trợ tâm lý">Đặc biệt cần hỗ trợ tâm lý</option>
                </select>
              </div>

              <div>
                <label className="font-semibold block text-slate-700 mb-1">Thể dục & Vận động</label>
                <select
                  value={formData.health.physicalEducationNote}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      health: { ...formData.health, physicalEducationNote: e.target.value as any },
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                >
                  <option value="Bình thường">Bình thường</option>
                  <option value="Miễn giảm vận động mạnh">Miễn giảm vận động mạnh</option>
                  <option value="Theo dõi đặc biệt">Theo dõi đặc biệt</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="font-semibold block text-slate-700 mb-1">Ghi chú nhận xét riêng của GVCN</label>
                <textarea
                  rows={2}
                  placeholder="Ghi chú về tính cách, hoàn cảnh hoặc các lưu ý đặc biệt..."
                  value={formData.psychology.teacherObservations}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      psychology: { ...formData.psychology, teacherObservations: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                />
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-slate-300 hover:bg-slate-100 font-semibold text-slate-700"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 font-semibold text-white flex items-center gap-1.5 shadow-sm"
            >
              <Save className="w-4 h-4" />
              <span>{isNew ? 'Thêm mới học sinh' : 'Lưu thay đổi'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
