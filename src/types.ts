export type Gender = 'Nam' | 'Nữ';

export type AttendanceStatus = 'present' | 'excused' | 'unexcused' | 'late';

export type AcademicRank = 'Xuất sắc' | 'Giỏi' | 'Khá' | 'Trung bình' | 'Yếu';
export type ConductRank = 'Tốt' | 'Khá' | 'Đạt' | 'Chưa đạt';

export interface ParentInfo {
  relation: 'Bố' | 'Mẹ' | 'Người giám hộ';
  name: string;
  phone: string;
  email: string;
  job: string;
  isPrimaryContact: boolean;
}

export interface FamilyBackground {
  totalSiblings: number;
  birthOrder: number;
  parentsMaritalStatus: 'Cùng sống' | 'Ly hôn' | 'Mất bố/mẹ' | 'Sống với ông bà';
  economicStatus: 'Bình thường' | 'Khá giả' | 'Hộ nghèo' | 'Cận nghèo' | 'Chính sách con thương binh';
  specialNotes: string;
}

export interface PsychologicalProfile {
  personality: string[];
  interests: string[];
  strengths: string[];
  weaknesses: string[];
  aptitudes: string[]; // Năng khiếu: Vẽ, Đàn, Thể thao, Hùng biện...
  teacherObservations: string;
  supportLevel: 'Bình thường' | 'Cần quan tâm động viên' | 'Đặc biệt cần hỗ trợ tâm lý';
}

export interface HealthProfile {
  bloodType: 'A' | 'B' | 'AB' | 'O' | 'Chưa rõ';
  heightCm: number;
  weightKg: number;
  vision: 'Bình thường' | 'Cận thị' | 'Loạn thị';
  allergies: string[];
  chronicConditions: string[]; // Bệnh nền: Hen suyễn, Tim bẩm sinh...
  physicalEducationNote: 'Bình thường' | 'Miễn giảm vận động mạnh' | 'Theo dõi đặc biệt';
  medicalNotes: string;
}

export interface Student {
  id: string;
  code: string; // Mã học sinh: HS2025-001
  name: string;
  dob: string; // YYYY-MM-DD
  gender: Gender;
  avatarUrl: string;
  address: string;
  group: number; // Tổ 1, 2, 3, 4
  roleInClass: 'Học sinh' | 'Lớp trưởng' | 'Lớp phó Học tập' | 'Lớp phó Lao động' | 'Tổ trưởng' | 'Bí thư Chi đoàn' | 'Cờ đỏ';
  parents: ParentInfo[];
  family: FamilyBackground;
  psychology: PsychologicalProfile;
  health: HealthProfile;
  conductScore: number; // Điểm rèn luyện nề nếp (khởi điểm 100)
  overallGpa: number; // Điểm trung bình các môn
  academicRank: AcademicRank;
  conductRank: ConductRank;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  date: string; // YYYY-MM-DD
  status: AttendanceStatus;
  session: 'Sáng' | 'Chiều';
  reason?: string;
  notifiedParent: boolean;
}

export interface DisciplineEvent {
  id: string;
  studentId: string;
  studentName: string;
  group: number;
  type: 'violation' | 'commendation';
  category: string; // Đi muộn, Không thuộc bài, Đồng phục, Giúp bạn, Phát biểu tốt, Đạt giải...
  scoreChange: number; // e.g. -2, +5
  description: string;
  date: string; // YYYY-MM-DD
  recordedBy: string;
  verified: boolean;
}

export interface SubjectScore {
  subjectId: string;
  subjectName: string;
  oralScores: number[]; // Điểm miệng (hệ số 1)
  test15mScores: number[]; // Điểm 15 phút (hệ số 1)
  test1PeriodScores: number[]; // Điểm 1 tiết / giữa kỳ (hệ số 2)
  finalScore?: number; // Điểm cuối kỳ (hệ số 3)
  averageScore?: number;
}

export interface StudentGrades {
  studentId: string;
  studentName: string;
  semester: 'HK1' | 'HK2' | 'Cả năm';
  academicYear: string;
  subjects: SubjectScore[];
  gpa: number;
  academicRank: AcademicRank;
  teacherComment: string;
}

export interface MessageThread {
  id: string;
  type: 'broadcast' | 'individual';
  recipientIds: string[]; // studentIds or 'all'
  recipientNames: string;
  channel: 'App' | 'SMS' | 'Zalo';
  title: string;
  content: string;
  sentAt: string;
  status: 'Đã gửi' | 'Đã đọc' | 'Chờ gửi';
  repliesCount: number;
}

export interface ParentAppointment {
  id: string;
  studentId: string;
  studentName: string;
  parentName: string;
  phone: string;
  type: 'Trực tiếp tại trường' | 'Trực tuyến (Meet/Zoom)';
  date: string;
  time: string;
  topic: string;
  status: 'Chờ xác nhận' | 'Đã duyệt' | 'Đã hoàn thành' | 'Đã hủy';
  meetingLinkOrRoom: string;
  notes?: string;
}

export interface CalendarTask {
  id: string;
  title: string;
  category: 'Giảng dạy' | 'Chủ nhiệm' | 'Họp trường/Tổ' | 'Hạn nộp báo cáo' | 'Phong trào';
  date: string;
  time: string;
  priority: 'Cao' | 'Trung bình' | 'Thấp';
  completed: boolean;
  location?: string;
  description?: string;
}

export interface PeriodicReport {
  id: string;
  title: string;
  type: 'weekly' | 'monthly' | 'term';
  period: string; // Tuần 12, Tháng 11/2025, Học kỳ I...
  createdDate: string;
  totalStudents: number;
  attendanceRate: number;
  excellentCount: number;
  goodCount: number;
  averageCount: number;
  weakCount: number;
  topViolations: { category: string; count: number }[];
  topCommendations: { category: string; count: number }[];
  summaryNote: string;
  status: 'Bản nháp' | 'Đã duyệt nộp BGH' | 'Chờ gửi';
}
