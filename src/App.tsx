import React, { useState, useEffect, useCallback } from 'react';
import { 
  MOCK_STUDENTS, 
  MOCK_ATTENDANCE_TODAY, 
  MOCK_DISCIPLINE_EVENTS, 
  MOCK_STUDENT_GRADES, 
  MOCK_MESSAGES, 
  MOCK_APPOINTMENTS, 
  MOCK_TASKS, 
  MOCK_PERIODIC_REPORTS 
} from './data/mockData';
import { 
  Student, 
  AttendanceRecord, 
  DisciplineEvent, 
  StudentGrades, 
  MessageThread, 
  ParentAppointment, 
  CalendarTask, 
  PeriodicReport,
  AttendanceStatus,
  ClassInfo
} from './types';

import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { DashboardView } from './components/Dashboard/DashboardView';
import { StudentDirectoryView } from './components/Students/StudentDirectoryView';
import { StudentDetailModal } from './components/Students/StudentDetailModal';
import { StudentEditModal } from './components/Students/StudentEditModal';
import { AttendanceDisciplineView } from './components/AttendanceDiscipline/AttendanceDisciplineView';
import { GradeManagementView } from './components/Grades/GradeManagementView';
import { CommunicationView } from './components/Communication/CommunicationView';
import { ScheduleTaskView } from './components/Schedule/ScheduleTaskView';
import { ReportGeneratorView } from './components/Reports/ReportGeneratorView';
import { DesignSpecView } from './components/DesignSpec/DesignSpecView';
import { GoogleDatabaseModal } from './components/GoogleDatabase/GoogleDatabaseModal';
import { GoogleDatabaseService, GoogleDatabaseConfig } from './services/googleDatabaseService';
import { ApiKeySettingsModal } from './components/AI/ApiKeySettingsModal';
import { GeminiService } from './services/geminiService';
import { ClassListModal } from './components/Classes/ClassListModal';

import { 
  LayoutDashboard, 
  Users, 
  ClipboardCheck, 
  GraduationCap, 
  MessageSquare, 
  Calendar, 
  FileSpreadsheet,
  BookOpenCheck,
  CheckCircle2,
  AlertCircle,
  Database,
  X
} from 'lucide-react';

const INITIAL_CLASSES: ClassInfo[] = [
  {
    id: '10A8',
    name: 'Lớp 10A8',
    grade: 10,
    schoolYear: '2025 - 2026',
    homeroomTeacher: 'Ms Jenny',
    room: 'Phòng 302',
    totalStudents: 36,
    description: 'Lớp chuyên Toán - Tiếng Anh (Chủ nhiệm chính)',
    isPrimary: true,
  },
  {
    id: '10A1',
    name: 'Lớp 10A1',
    grade: 10,
    schoolYear: '2025 - 2026',
    homeroomTeacher: 'Thầy Hoàng Minh',
    room: 'Phòng 301',
    totalStudents: 38,
    description: 'Lớp Tự nhiên A1',
  },
  {
    id: '10A2',
    name: 'Lớp 10A2',
    grade: 10,
    schoolYear: '2025 - 2026',
    homeroomTeacher: 'Cô Lê Thu Hương',
    room: 'Phòng 303',
    totalStudents: 40,
    description: 'Lớp Xã hội D1',
  },
  {
    id: '11A8',
    name: 'Lớp 11A8',
    grade: 11,
    schoolYear: '2025 - 2026',
    homeroomTeacher: 'Thầy Vũ Đức',
    room: 'Phòng 402',
    totalStudents: 42,
    description: 'Lớp khối 11 Tự nhiên',
  },
  {
    id: '12A8',
    name: 'Lớp 12A8',
    grade: 12,
    schoolYear: '2025 - 2026',
    homeroomTeacher: 'Cô Mai Phương',
    room: 'Phòng 502',
    totalStudents: 39,
    description: 'Lớp 12 Luyện thi Tốt nghiệp',
  },
];

export default function App() {
  // Global Navigation State
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Class Management State
  const [classes, setClasses] = useState<ClassInfo[]>(INITIAL_CLASSES);
  const [selectedClassId, setSelectedClassId] = useState<string>('10A8');
  const [showClassListModal, setShowClassListModal] = useState<boolean>(false);

  // API Key & Model Settings Modal State
  const [showApiKeyModal, setShowApiKeyModal] = useState<boolean>(false);
  const [hasApiKey, setHasApiKey] = useState<boolean>(() => GeminiService.hasApiKey());

  // Google Database State
  const [databaseConfig, setDatabaseConfig] = useState<GoogleDatabaseConfig>(() => GoogleDatabaseService.loadConfig());
  const [isDatabaseSyncing, setIsDatabaseSyncing] = useState<boolean>(false);
  const [showDatabaseModal, setShowDatabaseModal] = useState<boolean>(false);

  // Domain State
  const [students, setStudents] = useState<Student[]>(() => {
    const cached = GoogleDatabaseService.loadCachedStudents();
    return cached && cached.length > 0 ? cached : MOCK_STUDENTS;
  });
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(MOCK_ATTENDANCE_TODAY);
  const [disciplineEvents, setDisciplineEvents] = useState<DisciplineEvent[]>(MOCK_DISCIPLINE_EVENTS);
  const [gradesData, setGradesData] = useState<StudentGrades[]>(MOCK_STUDENT_GRADES);
  const [messages, setMessages] = useState<MessageThread[]>(MOCK_MESSAGES);
  const [appointments, setAppointments] = useState<ParentAppointment[]>(MOCK_APPOINTMENTS);
  const [tasks, setTasks] = useState<CalendarTask[]>(MOCK_TASKS);
  const [reports, setReports] = useState<PeriodicReport[]>(MOCK_PERIODIC_REPORTS);

  // Modal / Drawer Selection State
  const [selectedStudentForDetail, setSelectedStudentForDetail] = useState<Student | null>(null);
  const [selectedStudentForEdit, setSelectedStudentForEdit] = useState<Student | null>(null);
  const [showCreateStudentModal, setShowCreateStudentModal] = useState<boolean>(false);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'warning' | 'info'>('success');

  const showToast = (msg: string, type: 'success' | 'warning' | 'info' = 'success') => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Google Database Sync Function
  const handleSyncFromGoogle = useCallback(async (customConfig?: GoogleDatabaseConfig) => {
    const cfg = customConfig || databaseConfig;
    setIsDatabaseSyncing(true);

    try {
      const result = await GoogleDatabaseService.fetchStudentsFromGoogle(cfg);

      if (result.success && result.students.length > 0) {
        setStudents(result.students);
        GoogleDatabaseService.saveCachedStudents(result.students);

        const updatedConfig: GoogleDatabaseConfig = {
          ...cfg,
          isConnected: true,
          lastSyncTime: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
          lastError: null,
        };
        setDatabaseConfig(updatedConfig);
        GoogleDatabaseService.saveConfig(updatedConfig);

        showToast(result.message, 'success');
      } else {
        const errorConfig: GoogleDatabaseConfig = {
          ...cfg,
          isConnected: false,
          lastError: result.message,
        };
        setDatabaseConfig(errorConfig);
        GoogleDatabaseService.saveConfig(errorConfig);

        showToast(result.message || 'Không thể đồng bộ từ Google Database', 'warning');
      }
    } catch (err: any) {
      showToast(`Lỗi kết nối Google Database: ${err.message}`, 'warning');
    } finally {
      setIsDatabaseSyncing(false);
    }
  }, [databaseConfig]);

  // Google Database Push Function
  const handlePushToGoogle = async () => {
    setIsDatabaseSyncing(true);
    try {
      const result = await GoogleDatabaseService.pushStudentsToGoogle(databaseConfig, students);
      if (result.success) {
        showToast(result.message, 'success');
      } else {
        showToast(result.message, 'warning');
      }
    } catch (err: any) {
      showToast(`Lỗi khi đẩy dữ liệu lên Google: ${err.message}`, 'warning');
    } finally {
      setIsDatabaseSyncing(false);
    }
  };

  // Handle Save Configuration
  const handleSaveDatabaseConfig = (newConfig: GoogleDatabaseConfig) => {
    setDatabaseConfig(newConfig);
    GoogleDatabaseService.saveConfig(newConfig);
  };

  // Auto-Sync background timer
  useEffect(() => {
    if (!databaseConfig.autoSync || !databaseConfig.isConnected) return;

    const intervalMs = (databaseConfig.autoSyncIntervalMinutes || 15) * 60 * 1000;
    const timer = setInterval(() => {
      handleSyncFromGoogle();
    }, intervalMs);

    return () => clearInterval(timer);
  }, [databaseConfig.autoSync, databaseConfig.autoSyncIntervalMinutes, databaseConfig.isConnected, handleSyncFromGoogle]);

  // HANDLERS
  const handleUpdateAttendance = (studentId: string, status: AttendanceStatus, reason?: string) => {
    setAttendance((prev) => {
      const existingIdx = prev.findIndex((a) => a.studentId === studentId);
      if (existingIdx >= 0) {
        const copy = [...prev];
        copy[existingIdx] = {
          ...copy[existingIdx],
          status,
          reason: reason !== undefined ? reason : copy[existingIdx].reason,
          time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        };
        return copy;
      } else {
        const student = students.find((s) => s.id === studentId);
        return [
          ...prev,
          {
            id: `att-${Date.now()}`,
            studentId,
            studentName: student?.name || '',
            group: student?.group || 1,
            date: '2026-08-26',
            status,
            reason: reason || '',
            time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
          },
        ];
      }
    });
    showToast(`Đã cập nhật trạng thái chuyên cần cho học sinh`);
  };

  const handleAddDisciplineEvent = (eventData: Omit<DisciplineEvent, 'id'>) => {
    const newEvent: DisciplineEvent = {
      ...eventData,
      id: `disc-${Date.now()}`,
    };
    setDisciplineEvents((prev) => [newEvent, ...prev]);
    showToast(`Đã ghi nhận sự việc vào sổ nề nếp thi đua`);
  };

  const handleSaveStudent = (studentData: Student) => {
    let updatedList: Student[] = [];
    if (selectedStudentForEdit) {
      // Edit existing
      updatedList = students.map((s) => (s.id === studentData.id ? studentData : s));
      if (selectedStudentForDetail?.id === studentData.id) {
        setSelectedStudentForDetail(studentData);
      }
      showToast(`Đã cập nhật thông tin học sinh ${studentData.name}`);
    } else {
      // Create new
      updatedList = [studentData, ...students];
      showToast(`Đã thêm thành công học sinh mới: ${studentData.name}`);
    }
    setStudents(updatedList);
    GoogleDatabaseService.saveCachedStudents(updatedList);
    setSelectedStudentForEdit(null);
    setShowCreateStudentModal(false);
  };

  const handleDeleteStudent = (studentId: string) => {
    const student = students.find((s) => s.id === studentId);
    const updatedList = students.filter((s) => s.id !== studentId);
    setStudents(updatedList);
    GoogleDatabaseService.saveCachedStudents(updatedList);
    if (selectedStudentForDetail?.id === studentId) {
      setSelectedStudentForDetail(null);
    }
    showToast(`Đã xóa học sinh ${student?.name || ''} khỏi danh sách lớp 10A8`);
  };

  const handleSendMessage = (msg: Omit<MessageThread, 'id' | 'sentAt' | 'repliesCount'>) => {
    const newMsg: MessageThread = {
      ...msg,
      id: `msg-${Date.now()}`,
      sentAt: 'Vừa xong',
      repliesCount: 0,
    };
    setMessages((prev) => [newMsg, ...prev]);
    showToast(`Đã gửi thông báo thành công qua kênh ${msg.channel}`);
  };

  const handleAddAppointment = (apt: Omit<ParentAppointment, 'id'>) => {
    const newApt: ParentAppointment = {
      ...apt,
      id: `apt-${Date.now()}`,
    };
    setAppointments((prev) => [newApt, ...prev]);
    showToast(`Đã lên lịch hẹn phụ huynh thành công`);
  };

  const handleToggleTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleAddTask = (taskData: Omit<CalendarTask, 'id'>) => {
    const newTask: CalendarTask = {
      ...taskData,
      id: `task-${Date.now()}`,
    };
    setTasks((prev) => [newTask, ...prev]);
    showToast(`Đã thêm công việc vào sổ nhắc việc`);
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    showToast(`Đã xóa công việc`);
  };

  const handleNotifyParentFromQuick = (studentName: string, reason: string) => {
    handleSendMessage({
      type: 'individual',
      recipientIds: ['student-quick'],
      recipientNames: `PH Em ${studentName}`,
      channel: 'SMS',
      title: `[10A8-Ms Jenny] Thông báo chuyên cần ngày 26/08`,
      content: `Kính gửi Quý Phụ huynh, em ${studentName} hôm nay có ghi nhận: ${reason}. Kính mong gia đình theo dõi và phối hợp cùng GVCN Ms Jenny.`,
      status: 'Đã gửi',
    });
  };

  // Mobile Bottom Navigation Tabs
  const mobileNavItems = [
    { id: 'dashboard', label: 'Tổng quan', icon: LayoutDashboard },
    { id: 'students', label: 'Học sinh', icon: Users },
    { id: 'attendance', label: 'Chuyên cần', icon: ClipboardCheck },
    { id: 'grades', label: 'Sổ điểm', icon: GraduationCap },
    { id: 'communication', label: 'Liên lạc', icon: MessageSquare },
  ];

  // Calculate dynamic badge counts for sidebar
  const absentTodayCount = attendance.filter(
    (a) => a.status === 'excused' || a.status === 'unexcused'
  ).length;
  const pendingTasksCount = tasks.filter((t) => !t.completed).length;
  const unreadMessagesCount = 2;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans flex flex-col antialiased selection:bg-emerald-500 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-16 sm:bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl border border-slate-700 flex items-center gap-2.5 text-xs font-semibold animate-in fade-in slide-in-from-bottom-3">
          {toastType === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
          )}
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="ml-2 text-slate-400 hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Top Navigation */}
      <Navbar
        onOpenQuickAttendance={() => setActiveTab('attendance')}
        onOpenQuickDiscipline={() => setActiveTab('attendance')}
        onOpenQuickMessage={() => setActiveTab('communication')}
        onOpenQuickTask={() => setActiveTab('schedule')}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        databaseConfig={databaseConfig}
        isDatabaseSyncing={isDatabaseSyncing}
        studentCount={students.length}
        onOpenDatabaseModal={() => setShowDatabaseModal(true)}
        onQuickSyncDatabase={() => handleSyncFromGoogle()}
        hasApiKey={hasApiKey}
        onOpenApiKeyModal={() => setShowApiKeyModal(true)}
        selectedClass={selectedClassId}
        onSelectClass={(cls) => {
          setSelectedClassId(cls);
          showToast(`Đã chuyển sang quản lý Lớp ${cls}`, 'success');
        }}
        onOpenClassListModal={() => setShowClassListModal(true)}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Left Global Sidebar (Collapsible) */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onTabChange={setActiveTab}
          badgeCounts={{
            absentToday: absentTodayCount,
            pendingTasks: pendingTasksCount,
            unreadMessages: unreadMessagesCount,
            totalStudents: students.length,
          }}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          onOpenDatabaseModal={() => setShowDatabaseModal(true)}
          onOpenClassListModal={() => setShowClassListModal(true)}
          selectedClassName={selectedClassId}
        />

        {/* Main Content Scrollable Area */}
        <main className="flex-1 overflow-y-auto p-3.5 sm:p-6 lg:p-7 pb-20 sm:pb-8">
          {/* Active View Dispatcher */}
          {activeTab === 'dashboard' && (
            <DashboardView
              students={students}
              attendance={attendance}
              disciplineEvents={disciplineEvents}
              tasks={tasks}
              onNavigateTab={setActiveTab}
              onSelectStudent={setSelectedStudentForDetail}
              onQuickTakeAttendance={handleUpdateAttendance}
            />
          )}

          {activeTab === 'students' && (
            <StudentDirectoryView
              students={students}
              onSelectStudent={setSelectedStudentForDetail}
              onEditStudent={setSelectedStudentForEdit}
              onAddNewStudent={() => setShowCreateStudentModal(true)}
              onSendMessage={(st) => {
                setSelectedStudentForDetail(null);
                setActiveTab('communication');
              }}
              onDeleteStudent={handleDeleteStudent}
              onOpenDatabaseModal={() => setShowDatabaseModal(true)}
              onQuickSyncDatabase={() => handleSyncFromGoogle()}
              isDatabaseSyncing={isDatabaseSyncing}
              isDatabaseConnected={databaseConfig.isConnected}
              selectedClassId={selectedClassId}
              onSelectClass={(cls) => setSelectedClassId(cls)}
              onOpenClassListModal={() => setShowClassListModal(true)}
              classes={classes}
            />
          )}

          {activeTab === 'attendance' && (
            <AttendanceDisciplineView
              students={students}
              attendance={attendance}
              disciplineEvents={disciplineEvents}
              onUpdateAttendance={handleUpdateAttendance}
              onAddDisciplineEvent={handleAddDisciplineEvent}
              onNotifyParent={handleNotifyParentFromQuick}
            />
          )}

          {activeTab === 'grades' && (
            <GradeManagementView
              students={students}
              gradesData={gradesData}
              onUpdateScore={(sId, subId, field, val) => {
                showToast(`Đã lưu điểm cho học sinh`);
              }}
              onOpenApiKeyModal={() => setShowApiKeyModal(true)}
            />
          )}

          {activeTab === 'communication' && (
            <CommunicationView
              students={students}
              messages={messages}
              appointments={appointments}
              onSendMessage={handleSendMessage}
              onAddAppointment={handleAddAppointment}
              onOpenApiKeyModal={() => setShowApiKeyModal(true)}
            />
          )}

          {activeTab === 'schedule' && (
            <ScheduleTaskView
              tasks={tasks}
              onToggleTask={handleToggleTask}
              onAddTask={handleAddTask}
              onDeleteTask={handleDeleteTask}
            />
          )}

          {activeTab === 'reports' && (
            <ReportGeneratorView
              reports={reports}
              students={students}
              onOpenApiKeyModal={() => setShowApiKeyModal(true)}
            />
          )}

          {activeTab === 'design_spec' && (
            <DesignSpecView />
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar (Optimized for Smartphone) */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 px-2 py-1.5 flex items-center justify-around">
        {mobileNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center p-1 rounded-xl transition-all cursor-pointer ${
                isActive ? 'text-emerald-400 font-bold' : 'text-slate-400'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] mt-0.5">{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Google Database Modal */}
      <GoogleDatabaseModal
        isOpen={showDatabaseModal}
        onClose={() => setShowDatabaseModal(false)}
        config={databaseConfig}
        onSaveConfig={handleSaveDatabaseConfig}
        onSyncNow={handleSyncFromGoogle}
        onPushToGoogle={handlePushToGoogle}
        isSyncing={isDatabaseSyncing}
        studentCount={students.length}
        students={students}
      />

      {/* Gemini API Key & Model Settings Modal (Compliant with AI_INSTRUCTIONS) */}
      <ApiKeySettingsModal
        isOpen={showApiKeyModal}
        onClose={() => setShowApiKeyModal(false)}
        onApiKeySaved={(key) => {
          setHasApiKey(Boolean(key && key.length > 5));
          showToast('Đã lưu API Key Gemini thành công!', 'success');
        }}
      />

      {/* MODAL 1: 5-Tab Student Detail Drawer */}
      <StudentDetailModal
        student={selectedStudentForDetail}
        onClose={() => setSelectedStudentForDetail(null)}
        onEdit={(student) => {
          setSelectedStudentForDetail(null);
          setSelectedStudentForEdit(student);
        }}
        onSendMessage={(student) => {
          setSelectedStudentForDetail(null);
          setActiveTab('communication');
          showToast(`Đã chuyển đến giao tiếp với phụ huynh em ${student.name}`);
        }}
      />

      {/* MODAL 2: Edit or Create Student Modal */}
      {(selectedStudentForEdit || showCreateStudentModal) && (
        <StudentEditModal
          student={selectedStudentForEdit}
          onClose={() => {
            setSelectedStudentForEdit(null);
            setShowCreateStudentModal(false);
          }}
          onSave={handleSaveStudent}
        />
      )}

      {/* MODAL 3: Quản Lý & Chuyển Đổi Danh Sách Lớp Học */}
      <ClassListModal
        isOpen={showClassListModal}
        onClose={() => setShowClassListModal(false)}
        classes={classes}
        selectedClassId={selectedClassId}
        onSelectClass={(classId) => {
          setSelectedClassId(classId);
          showToast(`Đã chuyển sang quản lý Lớp ${classId}`, 'success');
        }}
        onAddNewClass={(newClass) => {
          setClasses((prev) => [...prev, newClass]);
          showToast(`Đã thêm mới ${newClass.name} thành công!`, 'success');
        }}
      />
    </div>
  );
}
