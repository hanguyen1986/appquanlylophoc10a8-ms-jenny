import React, { useState, useMemo } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  LayoutGrid, 
  Table as TableIcon, 
  Phone, 
  Heart, 
  Activity, 
  AlertCircle, 
  Award, 
  ExternalLink, 
  MoreVertical,
  CheckCircle,
  ShieldCheck, 
  Send, 
  Download,
  Database,
  RefreshCw,
  Trash2,
  X,
  School,
  Sparkles,
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';
import { Student, ClassInfo } from '../../types';

interface StudentDirectoryViewProps {
  students: Student[];
  onSelectStudent: (student: Student) => void;
  onEditStudent: (student: Student) => void;
  onAddNewStudent: () => void;
  onSendMessage: (student: Student) => void;
  onDeleteStudent?: (studentId: string) => void;
  onOpenDatabaseModal?: () => void;
  onQuickSyncDatabase?: () => void;
  isDatabaseSyncing?: boolean;
  isDatabaseConnected?: boolean;
  selectedClassId?: string;
  onSelectClass?: (classId: string) => void;
  onOpenClassListModal?: () => void;
  classes?: ClassInfo[];
}

export const StudentDirectoryView: React.FC<StudentDirectoryViewProps> = ({
  students,
  onSelectStudent,
  onEditStudent,
  onAddNewStudent,
  onSendMessage,
  onDeleteStudent,
  onOpenDatabaseModal,
  onQuickSyncDatabase,
  isDatabaseSyncing = false,
  isDatabaseConnected = false,
  selectedClassId = '10A8',
  onSelectClass,
  onOpenClassListModal,
  classes = [],
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Comprehensive Filters State
  const [selectedClassFilter, setSelectedClassFilter] = useState<string>(selectedClassId || 'all');
  const [selectedGroup, setSelectedGroup] = useState<number | 'all'>('all');
  const [selectedGender, setSelectedGender] = useState<'all' | 'Nam' | 'Nữ'>('all');
  const [selectedRank, setSelectedRank] = useState<string>('all');
  const [selectedConduct, setSelectedConduct] = useState<string>('all');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [selectedSupport, setSelectedSupport] = useState<string>('all');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState<boolean>(true);

  React.useEffect(() => {
    if (selectedClassId) {
      setSelectedClassFilter(selectedClassId);
    }
  }, [selectedClassId]);

  const isFiltered =
    searchQuery !== '' ||
    selectedClassFilter !== 'all' ||
    selectedGroup !== 'all' ||
    selectedGender !== 'all' ||
    selectedRank !== 'all' ||
    selectedConduct !== 'all' ||
    selectedRole !== 'all' ||
    selectedSupport !== 'all';

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedClassFilter('all');
    setSelectedGroup('all');
    setSelectedGender('all');
    setSelectedRank('all');
    setSelectedConduct('all');
    setSelectedRole('all');
    setSelectedSupport('all');
  };

  // Filter logic
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const matchSearch =
        searchQuery === '' ||
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (s.address && s.address.toLowerCase().includes(searchQuery.toLowerCase())) ||
        s.parents.some(
          (p) =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.phone.includes(searchQuery)
        );

      const matchClass =
        selectedClassFilter === 'all' ||
        !s.className ||
        s.className.toLowerCase() === selectedClassFilter.toLowerCase() ||
        s.code.toLowerCase().includes(selectedClassFilter.toLowerCase());

      const matchGroup = selectedGroup === 'all' || s.group === selectedGroup;
      const matchGender = selectedGender === 'all' || s.gender === selectedGender;
      const matchRank = selectedRank === 'all' || s.academicRank === selectedRank;
      const matchConduct = selectedConduct === 'all' || s.conductRank === selectedConduct;
      const matchRole =
        selectedRole === 'all' ||
        (selectedRole === 'bcs' && s.roleInClass !== 'Học sinh') ||
        s.roleInClass === selectedRole;

      const matchSupport =
        selectedSupport === 'all' ||
        (selectedSupport === 'care' &&
          (s.psychology.supportLevel !== 'Bình thường' ||
            s.health.physicalEducationNote !== 'Bình thường' ||
            s.overallGpa < 6.5)) ||
        (selectedSupport === 'health' && s.health.physicalEducationNote !== 'Bình thường') ||
        (selectedSupport === 'psychology' && s.psychology.supportLevel !== 'Bình thường');

      return (
        matchSearch &&
        matchClass &&
        matchGroup &&
        matchGender &&
        matchRank &&
        matchConduct &&
        matchRole &&
        matchSupport
      );
    });
  }, [
    students,
    searchQuery,
    selectedClassFilter,
    selectedGroup,
    selectedGender,
    selectedRank,
    selectedConduct,
    selectedRole,
    selectedSupport,
  ]);

  const handleExportExcel = () => {
    // Generate CSV for export
    const headers = ["Mã HS", "Lớp", "Họ và tên", "Giới tính", "Ngày sinh", "Tổ", "Chức vụ", "ĐTB", "Học lực", "Điểm nề nếp", "Hạnh kiểm", "Phụ huynh", "SĐT PH", "Địa chỉ", "Lưu ý"];
    const rows = filteredStudents.map(s => [
      `"${s.code}"`,
      `"${s.className || '10A8'}"`,
      `"${s.name}"`,
      `"${s.gender}"`,
      `"${s.dob}"`,
      `"${s.group}"`,
      `"${s.roleInClass}"`,
      `"${s.overallGpa}"`,
      `"${s.academicRank}"`,
      `"${s.conductScore}"`,
      `"${s.conductRank}"`,
      `"${s.parents[0]?.name || ''}"`,
      `"${s.parents[0]?.phone || ''}"`,
      `"${s.address || ''}"`,
      `"${s.health?.physicalEducationNote !== 'Bình thường' ? s.health?.physicalEducationNote : s.psychology?.supportLevel || ''}"`
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `DanhSach_HocSinh_${selectedClassFilter}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-5">
      {/* Header & Controls Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
                <Users className="w-5 h-5" />
              </span>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-lg font-bold text-slate-900">Quản Lý Hồ Sơ Học Sinh</h1>
                  {onOpenClassListModal && (
                    <button
                      onClick={onOpenClassListModal}
                      className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border border-emerald-300 flex items-center gap-1 transition-all cursor-pointer shadow-2xs"
                      title="Nhấn để xem và chuyển đổi danh sách lớp"
                    >
                      <School className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Lớp {selectedClassFilter === 'all' ? '10A8' : selectedClassFilter} - Ms Jenny</span>
                      <ChevronDown className="w-3 h-3 text-emerald-700" />
                    </button>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Đang hiển thị <strong className="text-emerald-700 font-bold">{filteredStudents.length} / {students.length} học sinh</strong> • Sổ chủ nhiệm điện tử chuẩn Bộ GD&ĐT
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {onOpenClassListModal && (
              <button
                onClick={onOpenClassListModal}
                className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-1.5 border border-slate-300/80 transition-all cursor-pointer shadow-2xs"
              >
                <School className="w-3.5 h-3.5 text-slate-700" />
                <span>Danh Sách Lớp ({classes.length || 5})</span>
              </button>
            )}

            {onOpenDatabaseModal && (
              <button
                onClick={onOpenDatabaseModal}
                className={`px-3 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 border transition-all cursor-pointer ${
                  isDatabaseConnected
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                    : 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100'
                }`}
              >
                <Database className="w-3.5 h-3.5" />
                <span>{isDatabaseConnected ? 'Google Sheets (Online)' : 'Kết nối Google Sheets'}</span>
              </button>
            )}

            {onQuickSyncDatabase && (
              <button
                onClick={onQuickSyncDatabase}
                disabled={isDatabaseSyncing}
                title="Đồng bộ lại dữ liệu từ Google Sheets"
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors disabled:opacity-50 cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isDatabaseSyncing ? 'animate-spin text-emerald-600' : ''}`} />
              </button>
            )}

            <button
              onClick={onAddNewStudent}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm học sinh</span>
            </button>

            <button
              onClick={handleExportExcel}
              className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 border border-slate-200 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Xuất Excel</span>
            </button>

            <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  viewMode === 'grid' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Dạng thẻ (Grid View)"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  viewMode === 'table' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Dạng bảng (Table View)"
              >
                <TableIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* BỘ LỌC TOÀN DIỆN */}
        <div className="space-y-3 pt-3 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
              <Filter className="w-4 h-4 text-emerald-600" />
              <span>Bộ Lọc & Tìm Kiếm Học Sinh:</span>
              {isFiltered && (
                <span className="px-2 py-0.2 rounded-full bg-emerald-100 text-emerald-800 text-[10px]">
                  Đang lọc {filteredStudents.length} kết quả
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {isFiltered && (
                <button
                  onClick={handleResetFilters}
                  className="text-[11px] text-rose-600 hover:text-rose-700 font-bold flex items-center gap-1 hover:underline cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Xóa bộ lọc</span>
                </button>
              )}

              <button
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className="text-[11px] text-slate-600 hover:text-slate-900 font-semibold flex items-center gap-1 cursor-pointer"
              >
                <SlidersHorizontal className="w-3 h-3" />
                <span>{showAdvancedFilters ? 'Thu gọn bộ lọc' : 'Mở rộng bộ lọc'}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Tìm theo tên, mã HS, SĐT bố mẹ, địa chỉ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:bg-white focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all font-medium"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600 text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-xs text-slate-500 whitespace-nowrap font-medium">Lớp:</span>
              <select
                value={selectedClassFilter}
                onChange={(e) => {
                  setSelectedClassFilter(e.target.value);
                  if (onSelectClass && e.target.value !== 'all') {
                    onSelectClass(e.target.value);
                  }
                }}
                className="w-full py-1.5 px-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:bg-white font-bold"
              >
                <option value="all">Tất cả các lớp</option>
                <option value="10A8">Lớp 10A8 (Ms Jenny - 36 HS)</option>
                <option value="10A1">Lớp 10A1 (Thầy Hoàng Minh - 38 HS)</option>
                <option value="10A2">Lớp 10A2 (Cô Thu Hương - 40 HS)</option>
                <option value="11A8">Lớp 11A8 (Thầy Vũ Đức - 42 HS)</option>
                <option value="12A8">Lớp 12A8 (Cô Mai Phương - 39 HS)</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-xs text-slate-500 whitespace-nowrap font-medium">Tổ:</span>
              <select
                value={selectedGroup}
                onChange={(e) => setSelectedGroup(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                className="w-full py-1.5 px-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:bg-white font-semibold"
              >
                <option value="all">Tất cả tổ (Tổ 1 - 4)</option>
                <option value={1}>Tổ 1</option>
                <option value={2}>Tổ 2</option>
                <option value={3}>Tổ 3</option>
                <option value={4}>Tổ 4</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-xs text-slate-500 whitespace-nowrap font-medium">Học lực:</span>
              <select
                value={selectedRank}
                onChange={(e) => setSelectedRank(e.target.value)}
                className="w-full py-1.5 px-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:bg-white font-semibold"
              >
                <option value="all">Tất cả xếp loại</option>
                <option value="Xuất sắc">Xuất sắc (&gt; 9.0)</option>
                <option value="Giỏi">Giỏi (8.0 - 8.9)</option>
                <option value="Khá">Khá (6.5 - 7.9)</option>
                <option value="Trung bình">Trung bình (5.0 - 6.4)</option>
              </select>
            </div>
          </div>

          {showAdvancedFilters && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-1 animate-in fade-in">
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-slate-500 whitespace-nowrap font-medium">Giới tính:</span>
                <select
                  value={selectedGender}
                  onChange={(e) => setSelectedGender(e.target.value as any)}
                  className="w-full py-1.5 px-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:bg-white font-medium"
                >
                  <option value="all">Tất cả giới tính</option>
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-xs text-slate-500 whitespace-nowrap font-medium">Hạnh kiểm:</span>
                <select
                  value={selectedConduct}
                  onChange={(e) => setSelectedConduct(e.target.value)}
                  className="w-full py-1.5 px-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:bg-white font-medium"
                >
                  <option value="all">Tất cả hạnh kiểm</option>
                  <option value="Tốt">Tốt (&ge; 90 đ)</option>
                  <option value="Khá">Khá (70 - 89 đ)</option>
                  <option value="Đạt">Đạt (50 - 69 đ)</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-xs text-slate-500 whitespace-nowrap font-medium">Chức vụ:</span>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-full py-1.5 px-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:bg-white font-medium"
                >
                  <option value="all">Tất cả chức vụ</option>
                  <option value="bcs">⭐ Ban cán sự lớp</option>
                  <option value="Lớp trưởng">Lớp trưởng</option>
                  <option value="Lớp phó Học tập">Lớp phó Học tập</option>
                  <option value="Bí thư Chi đoàn">Bí thư Chi đoàn</option>
                  <option value="Tổ trưởng">Tổ trưởng</option>
                  <option value="Học sinh">Thành viên</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-xs text-slate-500 whitespace-nowrap font-medium">Lưu ý:</span>
                <select
                  value={selectedSupport}
                  onChange={(e) => setSelectedSupport(e.target.value)}
                  className="w-full py-1.5 px-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:bg-white font-medium"
                >
                  <option value="all">Tất cả học sinh</option>
                  <option value="care">⚠️ Cần quan tâm đặc biệt</option>
                  <option value="health">🩺 Lưu ý sức khỏe / Miễn giảm TD</option>
                  <option value="psychology">🧠 Cần hỗ trợ động viên tâm lý</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Student List View */}
      {filteredStudents.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 text-center border border-slate-200">
          <Users className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-700">Không tìm thấy học sinh nào phù hợp</p>
          <p className="text-xs text-slate-400 mt-1">Hãy thử xóa bộ lọc hoặc tìm kiếm từ khóa khác.</p>
        </div>
      ) : viewMode === 'grid' ? (
        /* GRID CARDS VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredStudents.map((st) => {
            const hasSpecialCare =
              st.psychology.supportLevel !== 'Bình thường' || st.health.physicalEducationNote !== 'Bình thường';

            return (
              <div
                key={st.id}
                className="bg-white rounded-2xl border border-slate-200 hover:border-emerald-400 p-4 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Top row */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={st.avatarUrl}
                        alt={st.name}
                        className="w-12 h-12 rounded-2xl object-cover border border-slate-200 shrink-0"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 
                            onClick={() => onSelectStudent(st)}
                            className="font-bold text-sm text-slate-900 group-hover:text-emerald-700 cursor-pointer transition-colors"
                          >
                            {st.name}
                          </h3>
                        </div>
                        <div className="text-[11px] text-slate-500">
                          <span>{st.code}</span> • <span className="font-semibold text-slate-700">Tổ {st.group}</span> • <span className="text-slate-400">{st.className || '10A8'}</span>
                        </div>
                      </div>
                    </div>

                    <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-slate-100 text-slate-700 border border-slate-200">
                      {st.roleInClass}
                    </span>
                  </div>

                  {/* Badges / Metrics */}
                  <div className="grid grid-cols-2 gap-2 my-3 text-xs">
                    <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                      <span className="text-[10px] text-slate-400 block">ĐTB Học kỳ:</span>
                      <span className="font-bold text-slate-900">{st.overallGpa}</span>{' '}
                      <span className="text-[10px] text-emerald-600 font-semibold">({st.academicRank})</span>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                      <span className="text-[10px] text-slate-400 block">Điểm nề nếp:</span>
                      <span className="font-bold text-slate-900">{st.conductScore} đ</span>{' '}
                      <span className="text-[10px] text-amber-600 font-semibold">({st.conductRank})</span>
                    </div>
                  </div>

                  {/* Primary Parent Contact */}
                  <div className="text-xs text-slate-600 space-y-1 mb-3 pt-2 border-t border-slate-100">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Phụ huynh:</span>
                      <span className="font-semibold text-slate-800 truncate max-w-[150px]">
                        {st.parents[0]?.name} ({st.parents[0]?.relation})
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">SĐT:</span>
                      <a href={`tel:${st.parents[0]?.phone}`} className="font-semibold text-emerald-700 hover:underline">
                        {st.parents[0]?.phone}
                      </a>
                    </div>
                  </div>

                  {/* Warning / Special tags */}
                  {hasSpecialCare && (
                    <div className="p-2 rounded-lg bg-rose-50 border border-rose-100 text-[11px] text-rose-800 flex items-center gap-1.5 mb-3">
                      <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                      <span className="truncate">
                        {st.psychology.supportLevel !== 'Bình thường' ? st.psychology.supportLevel : st.health.physicalEducationNote}
                      </span>
                    </div>
                  )}
                </div>

                {/* Card Action Buttons */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
                  <button
                    onClick={() => onSelectStudent(st)}
                    className="text-emerald-700 font-bold hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
                  >
                    <span>Xem 5 mục hồ sơ</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onSendMessage(st)}
                      className="p-1.5 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 transition-colors cursor-pointer"
                      title="Gửi tin nhắn cho Phụ huynh"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onEditStudent(st)}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition-colors cursor-pointer"
                    >
                      Sửa
                    </button>
                    {onDeleteStudent && (
                      <button
                        onClick={() => {
                          if (confirm(`Bạn có chắc chắn muốn xóa học sinh ${st.name} khỏi danh sách lớp 10A8?`)) {
                            onDeleteStudent(st.id);
                          }
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Xóa học sinh"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Học sinh</th>
                  <th className="py-3 px-3">Mã HS</th>
                  <th className="py-3 px-3">Tổ</th>
                  <th className="py-3 px-3">Chức vụ</th>
                  <th className="py-3 px-3">Học lực (ĐTB)</th>
                  <th className="py-3 px-3">Nề nếp</th>
                  <th className="py-3 px-3">Phụ huynh liên hệ</th>
                  <th className="py-3 px-3">Lưu ý</th>
                  <th className="py-3 px-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.map((st) => (
                  <tr key={st.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div 
                        className="flex items-center gap-2.5 cursor-pointer"
                        onClick={() => onSelectStudent(st)}
                      >
                        <img src={st.avatarUrl} alt={st.name} className="w-8 h-8 rounded-full object-cover" />
                        <div>
                          <div className="font-bold text-slate-900 hover:text-emerald-700">{st.name}</div>
                          <div className="text-[10px] text-slate-400">{st.gender} • {st.dob}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3 font-medium text-slate-600">{st.code}</td>
                    <td className="py-3 px-3 font-bold text-slate-800">Tổ {st.group}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold text-[10px]">
                        {st.roleInClass}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-bold text-slate-900">{st.overallGpa}</span>
                      <span className="text-[10px] text-slate-500 block">({st.academicRank})</span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-bold text-slate-900">{st.conductScore} đ</span>
                      <span className="text-[10px] text-slate-500 block">({st.conductRank})</span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-800">{st.parents[0]?.name}</div>
                      <a href={`tel:${st.parents[0]?.phone}`} className="text-emerald-700 text-[11px] hover:underline">
                        {st.parents[0]?.phone}
                      </a>
                    </td>
                    <td className="py-3 px-3">
                      {st.psychology.supportLevel !== 'Bình thường' ? (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800">
                          Tâm lý
                        </span>
                      ) : st.health.physicalEducationNote !== 'Bình thường' ? (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                          Sức khỏe
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[10px]">Ổn định</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onSelectStudent(st)}
                          className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[11px] cursor-pointer"
                        >
                          Chi tiết
                        </button>
                        <button
                          onClick={() => onSendMessage(st)}
                          className="p-1 rounded bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 cursor-pointer"
                          title="Nhắn tin"
                        >
                          <Send className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
