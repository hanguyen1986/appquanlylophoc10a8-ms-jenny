import React, { useState } from 'react';
import { 
  Award, 
  BookOpen, 
  TrendingUp, 
  TrendingDown, 
  Search, 
  Sparkles, 
  Download, 
  Save, 
  Filter, 
  Calculator,
  ChevronRight,
  AlertCircle,
  FileSpreadsheet,
  RefreshCw,
  Copy,
  Check,
  Key,
  Bot,
  AlertTriangle,
  Zap,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { Student, StudentGrades, SubjectScore } from '../../types';
import { SUBJECTS_LIST } from '../../data/mockData';
import { GeminiService } from '../../services/geminiService';

interface GradeManagementViewProps {
  students: Student[];
  gradesData: StudentGrades[];
  onUpdateScore: (studentId: string, subjectId: string, field: string, value: number) => void;
  onOpenApiKeyModal?: () => void;
}

export const GradeManagementView: React.FC<GradeManagementViewProps> = ({
  students,
  gradesData,
  onUpdateScore,
  onOpenApiKeyModal,
}) => {
  const [selectedSubject, setSelectedSubject] = useState<string>('toan');
  const [selectedSemester, setSelectedSemester] = useState<'HK1' | 'HK2' | 'Cả năm'>('HK1');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'matrix' | 'analytics' | 'comments'>('matrix');

  // AI Generation State
  const [aiComments, setAiComments] = useState<{ [studentId: string]: string }>({});
  const [isGeneratingAll, setIsGeneratingAll] = useState(false);
  const [generatingStudentId, setGeneratingStudentId] = useState<string | null>(null);
  const [generationStep, setGenerationStep] = useState<1 | 2 | 3>(1);
  const [stepStatus, setStepStatus] = useState<'idle' | 'running' | 'completed' | 'error'>('idle');
  const [globalAiError, setGlobalAiError] = useState<string | null>(null);
  const [usedModelName, setUsedModelName] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const currentSubjectObj = SUBJECTS_LIST.find((s) => s.id === selectedSubject) || SUBJECTS_LIST[0];

  // Grade distribution mockup for chart
  const gradeDistributionData = [
    { range: '< 5.0 (Yếu)', count: 1, fill: '#ef4444' },
    { range: '5.0 - 6.4 (TB)', count: 4, fill: '#f97316' },
    { range: '6.5 - 7.9 (Khá)', count: 12, fill: '#f59e0b' },
    { range: '8.0 - 8.9 (Giỏi)', count: 14, fill: '#0ea5e9' },
    { range: '9.0 - 10 (Xuất sắc)', count: 5, fill: '#10b981' },
  ];

  // Generate AI Comment for a single student
  const handleGenerateSingleComment = async (student: Student) => {
    if (!GeminiService.hasApiKey()) {
      if (onOpenApiKeyModal) onOpenApiKeyModal();
      return;
    }

    setGeneratingStudentId(student.id);
    setGlobalAiError(null);

    const result = await GeminiService.generateStudentComment(student);
    if (result.success) {
      setAiComments((prev) => ({ ...prev, [student.id]: result.text }));
      setUsedModelName(result.usedModel);
    } else {
      setGlobalAiError(result.error || 'Lỗi không xác định từ AI Model');
    }
    setGeneratingStudentId(null);
  };

  // Generate AI Comments for all students with step progress & strict error state management
  const handleGenerateAllComments = async () => {
    if (!GeminiService.hasApiKey()) {
      if (onOpenApiKeyModal) onOpenApiKeyModal();
      return;
    }

    setIsGeneratingAll(true);
    setGlobalAiError(null);
    setStepStatus('running');

    try {
      // STEP 1: Phân tích kết quả học tập
      setGenerationStep(1);
      await new Promise((r) => setTimeout(r, 400));

      // STEP 2: Tổng hợp nề nếp & năng khiếu
      setGenerationStep(2);
      await new Promise((r) => setTimeout(r, 400));

      // STEP 3: Gọi Gemini AI sinh nhận xét
      setGenerationStep(3);

      const newComments: { [id: string]: string } = {};
      let hasError = false;
      let lastErrMsg = '';

      for (let i = 0; i < students.length; i++) {
        const st = students[i];
        const res = await GeminiService.generateStudentComment(st);
        if (res.success) {
          newComments[st.id] = res.text;
          setUsedModelName(res.usedModel);
          setAiComments((prev) => ({ ...prev, [st.id]: res.text }));
        } else {
          hasError = true;
          lastErrMsg = res.error || 'Lỗi API trong quá trình xử lý';
          break; // Stop immediately on error as required by AI_INSTRUCTIONS
        }
      }

      if (hasError) {
        // As required by AI_INSTRUCTIONS:
        // Set error message in red, verbatim from API, and change status to "Đã dừng do lỗi"
        setStepStatus('error');
        setGlobalAiError(lastErrMsg);
      } else {
        setStepStatus('completed');
      }
    } catch (err: any) {
      setStepStatus('error');
      setGlobalAiError(err.message || 'Lỗi hệ thống trong quá trình sinh dữ liệu');
    } finally {
      setIsGeneratingAll(false);
    }
  };

  const handleCopyComment = (studentId: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(studentId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-5">
      {/* Top Header & Selector */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-sky-100 text-sky-700">
              <Award className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-slate-900">Quản Lý Sổ Điểm & Tiến Độ Học Tập</h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-100 text-sky-800 border border-sky-300">
                  Lớp 10A8 - Ms Jenny
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Quy chế đánh giá Thông tư 22/2021/TT-BGDĐT • Năm học 2025-2026
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center bg-slate-100 p-0.5 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setSelectedSemester('HK1')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  selectedSemester === 'HK1' ? 'bg-white text-emerald-700 shadow-xs font-bold' : 'text-slate-500'
                }`}
              >
                Học kỳ I
              </button>
              <button
                onClick={() => setSelectedSemester('HK2')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  selectedSemester === 'HK2' ? 'bg-white text-emerald-700 shadow-xs font-bold' : 'text-slate-500'
                }`}
              >
                Học kỳ II
              </button>
            </div>

            <button
              onClick={() => alert("Đã xuất bảng điểm tổng hợp HK1 Lớp 10A8 định dạng Excel (.xlsx)")}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center gap-1.5 border border-slate-200 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Xuất Sổ điểm</span>
            </button>
          </div>
        </div>

        {/* Subjects Horizontal Scroll Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none border-t border-slate-100 pt-3">
          {SUBJECTS_LIST.map((subj) => {
            const isSelected = selectedSubject === subj.id;
            return (
              <button
                key={subj.id}
                onClick={() => setSelectedSubject(subj.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-sm ring-1 ring-slate-800'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/80'
                }`}
              >
                <span>{subj.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Mode Sub-Tabs */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setActiveTab('matrix')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'matrix' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          📊 Bảng nhập điểm chi tiết môn {currentSubjectObj.name}
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'analytics' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          📈 Phân tích Phổ điểm & Tiến bộ
        </button>
        <button
          onClick={() => setActiveTab('comments')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'comments' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Trợ lý AI Gợi ý Nhận xét Học bạ (TT22)</span>
        </button>
      </div>

      {/* VIEW 1: GRADE MATRIX TABLE */}
      {activeTab === 'matrix' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
            <span className="font-bold text-slate-700">
              Công thức ĐTB Môn: (Miệng + 15p + Giữa kỳ x 2 + Cuối kỳ x 3) / 7
            </span>
            <span className="text-slate-500 italic">
              💡 Nhập điểm trực tiếp vào ô, hệ thống tự động làm tròn 1 chữ số thập phân
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-100/70 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-3">STT</th>
                  <th className="py-3 px-4">Học sinh</th>
                  <th className="py-3 px-3">Điểm Miệng (H1)</th>
                  <th className="py-3 px-3">15 Phút (H1)</th>
                  <th className="py-3 px-3">Giữa Kỳ (H2)</th>
                  <th className="py-3 px-3">Cuối Kỳ (H3)</th>
                  <th className="py-3 px-3 font-bold text-emerald-800">ĐTB Môn</th>
                  <th className="py-3 px-3 font-bold text-slate-900">ĐTB Chung</th>
                  <th className="py-3 px-4 text-center">Xếp loại</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.map((st, index) => {
                  const studentGrade = gradesData.find((g) => g.studentId === st.id);
                  const subjScore = studentGrade?.subjects.find((s) => s.subjectId === selectedSubject);

                  const oral = subjScore?.oralScores[0] ?? (st.overallGpa >= 8.5 ? 9 : 7.5);
                  const test15 = subjScore?.test15mScores[0] ?? (st.overallGpa >= 8.5 ? 9 : 7.0);
                  const midterm = subjScore?.test1PeriodScores[0] ?? (st.overallGpa >= 8.5 ? 8.5 : 7.0);
                  const final = subjScore?.finalScore ?? (st.overallGpa >= 8.5 ? 9.0 : 6.5);

                  // Calculation: (oral + test15 + midterm*2 + final*3)/7
                  const calculatedAvg = Number(((oral + test15 + midterm * 2 + final * 3) / 7).toFixed(1));

                  return (
                    <tr key={st.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-3 font-semibold text-slate-400">{index + 1}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <img src={st.avatarUrl} alt={st.name} className="w-7 h-7 rounded-full object-cover" />
                          <div>
                            <div className="font-bold text-slate-900">{st.name}</div>
                            <div className="text-[10px] text-slate-400">Tổ {st.group} • {st.code}</div>
                          </div>
                        </div>
                      </td>

                      {/* Oral */}
                      <td className="py-3 px-3">
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          max="10"
                          defaultValue={oral}
                          className="w-14 px-2 py-1 rounded border border-slate-300 text-center font-semibold text-slate-900 focus:bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                        />
                      </td>

                      {/* 15 mins */}
                      <td className="py-3 px-3">
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          max="10"
                          defaultValue={test15}
                          className="w-14 px-2 py-1 rounded border border-slate-300 text-center font-semibold text-slate-900 focus:bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                        />
                      </td>

                      {/* Midterm */}
                      <td className="py-3 px-3">
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          max="10"
                          defaultValue={midterm}
                          className="w-14 px-2 py-1 rounded border border-slate-300 text-center font-semibold text-slate-900 focus:bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                        />
                      </td>

                      {/* Final */}
                      <td className="py-3 px-3">
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          max="10"
                          defaultValue={final}
                          className="w-14 px-2 py-1 rounded border border-slate-300 text-center font-semibold text-slate-900 focus:bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                        />
                      </td>

                      {/* Subject Avg */}
                      <td className="py-3 px-3">
                        <span className="font-bold text-sm text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          {calculatedAvg}
                        </span>
                      </td>

                      {/* Overall GPA */}
                      <td className="py-3 px-3 font-bold text-slate-900 text-sm">{st.overallGpa}</td>

                      {/* Rank */}
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                            st.academicRank === 'Xuất sắc'
                              ? 'bg-emerald-100 text-emerald-800'
                              : st.academicRank === 'Giỏi'
                              ? 'bg-sky-100 text-sky-800'
                              : st.academicRank === 'Khá'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {st.academicRank}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 2: ANALYTICS & DISTRIBUTION */}
      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Grade Distribution BarChart */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <h2 className="text-sm font-bold text-slate-900">Phổ điểm môn {currentSubjectObj.name} (Lớp 10A8)</h2>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={gradeDistributionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="range" tick={{ fontSize: 11, fill: '#64748b' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                  <Tooltip />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]} maxBarSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Academic Progress Trends & Alert */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-slate-900">Đánh giá Biến động & Cảnh báo Học tập Lớp 10A8</h2>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-2.5">
                <TrendingUp className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-emerald-900 block">Học sinh Tiến bộ Vượt bậc:</span>
                  <p className="text-emerald-800 mt-0.5">
                    <strong>Trần Bảo Anh</strong> và <strong>Lâm Gia Hân</strong> duy trì điểm số xuất sắc &gt; 9.0;{' '}
                    <strong>Bùi Tuấn Kiệt</strong> tăng +0.8 điểm môn Toán giữa kỳ.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2.5">
                <TrendingDown className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-rose-900 block">Học sinh Có dấu hiệu Sa sút:</span>
                  <p className="text-rose-800 mt-0.5">
                    <strong>Lê Minh Đức</strong> (ĐTB Toán 6.1 - giảm 1.2 điểm so với đầu năm). Đề xuất GVCN Ms Jenny trao đổi phụ huynh để hỗ trợ gia sư kèm cặp.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: AI COMMENTS GENERATOR (UPGRADED WITH GEMINI SERVICE & FALLBACK) */}
      {activeTab === 'comments' && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          {/* Header with AI Trigger */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <h2 className="text-sm font-bold text-slate-900">
                  Trợ Lý AI Gợi Ý Lời Phê Học Bạ & Sổ Liên Lạc (Thông tư 22/2021/TT-BGDĐT)
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-300">
                  Google Gemini AI
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Tự động tổng hợp dữ liệu ĐTB, học lực, điểm nề nếp thi đua, tâm lý và năng khiếu của {students.length} học sinh Lớp 10A8
              </p>
            </div>

            <div className="flex items-center gap-2">
              {!GeminiService.hasApiKey() && onOpenApiKeyModal && (
                <button
                  onClick={onOpenApiKeyModal}
                  className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all animate-pulse cursor-pointer"
                >
                  <Key className="w-3.5 h-3.5" />
                  <span>Lấy API key để sử dụng app</span>
                </button>
              )}

              <button
                onClick={handleGenerateAllComments}
                disabled={isGeneratingAll}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all disabled:opacity-50 cursor-pointer"
              >
                <Sparkles className={`w-4 h-4 ${isGeneratingAll ? 'animate-spin text-amber-300' : ''}`} />
                <span>{isGeneratingAll ? 'AI Đang sinh nhận xét...' : `AI Sinh Lời Phê Toàn Lớp 10A8 (${students.length} HS)`}</span>
              </button>
            </div>
          </div>

          {/* Progress Bar & Steps (Required by AI_INSTRUCTIONS) */}
          {stepStatus !== 'idle' && (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 flex items-center gap-2">
                  <Bot className="w-4 h-4 text-emerald-600" />
                  Tiến trình sinh lời phê AI:
                </span>
                <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                  stepStatus === 'running' 
                    ? 'bg-sky-100 text-sky-800' 
                    : stepStatus === 'completed' 
                    ? 'bg-emerald-100 text-emerald-800' 
                    : 'bg-rose-100 text-rose-800'
                }`}>
                  {stepStatus === 'running' ? 'Đang thực hiện' : stepStatus === 'completed' ? 'Hoàn tất' : 'Đã dừng do lỗi'}
                </span>
              </div>

              {/* Progress Steps Grid */}
              <div className="grid grid-cols-3 gap-2 text-[11px]">
                <div className={`p-2.5 rounded-xl border flex items-center gap-2 ${
                  generationStep >= 1 && stepStatus !== 'error'
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-semibold'
                    : stepStatus === 'error' && generationStep === 1
                    ? 'bg-rose-50 border-rose-300 text-rose-900 font-bold'
                    : 'bg-white border-slate-200 text-slate-400'
                }`}>
                  {generationStep > 1 && stepStatus !== 'error' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <div className="w-4 h-4 rounded-full border border-current flex items-center justify-center text-[9px]">1</div>}
                  <span>1. Phân tích kết quả học tập</span>
                </div>

                <div className={`p-2.5 rounded-xl border flex items-center gap-2 ${
                  generationStep >= 2 && stepStatus !== 'error'
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-semibold'
                    : stepStatus === 'error' && generationStep === 2
                    ? 'bg-rose-50 border-rose-300 text-rose-900 font-bold'
                    : 'bg-white border-slate-200 text-slate-400'
                }`}>
                  {generationStep > 2 && stepStatus !== 'error' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <div className="w-4 h-4 rounded-full border border-current flex items-center justify-center text-[9px]">2</div>}
                  <span>2. Tổng hợp nề nếp & tâm lý</span>
                </div>

                <div className={`p-2.5 rounded-xl border flex items-center gap-2 ${
                  generationStep >= 3 && stepStatus === 'completed'
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-semibold'
                    : stepStatus === 'error' && generationStep === 3
                    ? 'bg-rose-50 border-rose-300 text-rose-900 font-bold'
                    : generationStep === 3 && stepStatus === 'running'
                    ? 'bg-sky-50 border-sky-300 text-sky-900 font-semibold'
                    : 'bg-white border-slate-200 text-slate-400'
                }`}>
                  {stepStatus === 'completed' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : stepStatus === 'error' ? <XCircle className="w-4 h-4 text-rose-600" /> : <div className="w-4 h-4 rounded-full border border-current flex items-center justify-center text-[9px]">3</div>}
                  <span>3. Sinh lời phê chuẩn TT22</span>
                </div>
              </div>
            </div>
          )}

          {/* VERBATIM RED ERROR BANNER (REQUIRED BY AI_INSTRUCTIONS) */}
          {globalAiError && (
            <div className="p-4 rounded-2xl bg-rose-50 border-2 border-rose-300 text-rose-900 text-xs space-y-2 animate-in fade-in">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-rose-800 text-sm">
                  <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
                  <span>Trạng thái: Đã dừng do lỗi</span>
                </div>
                {onOpenApiKeyModal && (
                  <button
                    onClick={onOpenApiKeyModal}
                    className="px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs"
                  >
                    Thay đổi API Key
                  </button>
                )}
              </div>
              <div className="p-2.5 rounded-xl bg-white/80 border border-rose-200 font-mono text-[11px] text-rose-950 break-all leading-relaxed">
                <strong>Lỗi nguyên văn từ Google Gemini API:</strong>
                <p className="mt-1">{globalAiError}</p>
              </div>
              <p className="text-[11px] text-rose-700">
                💡 Gợi ý: Nếu gặp lỗi <code>429 RESOURCE_EXHAUSTED</code> hoặc hạn ngạch API miễn phí tạm thời hết lượt, bạn có thể vào <strong>Settings (API Key)</strong> để đổi API Key mới hoặc chuyển đổi model dự phòng.
              </p>
            </div>
          )}

          {/* Student Comments List */}
          <div className="space-y-3 pt-1">
            {students.map((st) => {
              const currentComment =
                aiComments[st.id] ||
                (st.overallGpa >= 9.0
                  ? 'Em có năng lực tự học xuất sắc, tư duy logic nhạy bén, gương mẫu và tích cực kèm cặp giúp đỡ bạn bè trong lớp 10A8.'
                  : st.overallGpa >= 8.0
                  ? 'Chăm ngoan, tiếp thu bài nhanh, chấp hành tốt nội quy nề nếp thi đua; cần phát huy hơn nữa ở môn Ngữ văn.'
                  : 'Có ý thức học tập và rèn luyện tốt, tuy nhiên cần rèn luyện tính tập trung trong các giờ lý thuyết để bứt phá học kỳ tới.');

              const isRegeneratingThis = generatingStudentId === st.id;

              return (
                <div
                  key={st.id}
                  className="p-4 rounded-2xl bg-slate-50 hover:bg-slate-100/70 border border-slate-200/80 transition-all flex flex-col md:flex-row md:items-start justify-between gap-3 text-xs"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <img src={st.avatarUrl} alt={st.name} className="w-10 h-10 rounded-2xl object-cover border border-slate-200 shrink-0 mt-0.5" />
                    <div className="min-w-0 space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">{st.name}</span>
                        <span className="text-slate-500 font-medium">({st.code} • Tổ {st.group})</span>
                        <span className="px-2 py-0.5 rounded-full font-bold text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-200">
                          ĐTB: {st.overallGpa} ({st.academicRank})
                        </span>
                        <span className="px-2 py-0.5 rounded-full font-bold text-[10px] bg-amber-100 text-amber-800 border border-amber-200">
                          Nề nếp: {st.conductScore} đ ({st.conductRank})
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-white border border-slate-200/80 text-slate-800 leading-relaxed font-normal">
                        <span className="text-slate-400 font-serif mr-1 text-sm">“</span>
                        <span>{currentComment}</span>
                        <span className="text-slate-400 font-serif ml-1 text-sm">”</span>
                      </div>

                      {aiComments[st.id] && (
                        <div className="flex items-center gap-2 text-[10px] text-emerald-700 font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Đã sinh bằng Gemini AI ({usedModelName || 'Gemini 3 Flash'})</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions for this student */}
                  <div className="flex items-center gap-2 self-end md:self-start shrink-0 pt-1">
                    <button
                      onClick={() => handleGenerateSingleComment(st)}
                      disabled={isRegeneratingThis || isGeneratingAll}
                      title="AI Viết lại lời phê riêng cho học sinh này"
                      className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-bold border border-slate-200 flex items-center gap-1.5 transition-all shadow-xs disabled:opacity-50 cursor-pointer text-xs"
                    >
                      <Sparkles className={`w-3.5 h-3.5 text-amber-500 ${isRegeneratingThis ? 'animate-spin' : ''}`} />
                      <span>{isRegeneratingThis ? 'Đang viết...' : 'AI Viết lại'}</span>
                    </button>

                    <button
                      onClick={() => handleCopyComment(st.id, currentComment)}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer text-xs"
                    >
                      {copiedId === st.id ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedId === st.id ? 'Đã sao chép' : 'Sao chép'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
