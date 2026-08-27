import { Student, DisciplineEvent, AttendanceRecord, StudentGrades, ParentAppointment, MessageThread, CalendarTask, PeriodicReport } from '../types';

export const INITIAL_STUDENTS: Student[] = [
  {
    id: 'hs-01',
    code: 'HS25-10A8-01',
    name: 'Nguyễn Hoàng An',
    dob: '2010-03-15',
    gender: 'Nam',
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    address: '124 Thụy Khuê, Tây Hồ, Hà Nội',
    group: 1,
    roleInClass: 'Lớp trưởng',
    conductScore: 98,
    overallGpa: 8.8,
    academicRank: 'Giỏi',
    conductRank: 'Tốt',
    parents: [
      {
        relation: 'Bố',
        name: 'Nguyễn Văn Hùng',
        phone: '0912345678',
        email: 'hung.nguyen@company.vn',
        job: 'Kỹ sư phần mềm',
        isPrimaryContact: true,
      },
      {
        relation: 'Mẹ',
        name: 'Trần Thị Thu Mai',
        phone: '0987654321',
        email: 'thumai.tran@gmail.com',
        job: 'Bác sĩ Đa khoa',
        isPrimaryContact: false,
      }
    ],
    family: {
      totalSiblings: 2,
      birthOrder: 1,
      parentsMaritalStatus: 'Cùng sống',
      economicStatus: 'Khá giả',
      specialNotes: 'Gia đình rất quan tâm việc học, thường xuyên trao đổi với GVCN.',
    },
    psychology: {
      personality: ['Chững chạc', 'Trách nhiệm', 'Hòa đồng', 'Tự tin'],
      interests: ['Lập trình', 'Bóng rổ', 'Đọc sách khoa học'],
      strengths: ['Khả năng lãnh đạo', 'Tư duy logic', 'Bình tĩnh giải quyết xung đột'],
      weaknesses: ['Đôi khi cầu toàn quá mức'],
      aptitudes: ['Thuyết trình', 'Chơi đàn Guitar', 'Toán học'],
      teacherObservations: 'Học sinh gương mẫu, quản lý lớp nền nếp rất tốt, được bạn bè tín nhiệm cao.',
      supportLevel: 'Bình thường',
    },
    health: {
      bloodType: 'O',
      heightCm: 172,
      weightKg: 62,
      vision: 'Cận thị',
      allergies: ['Dị ứng tôm cua biển'],
      chronicConditions: [],
      physicalEducationNote: 'Bình thường',
      medicalNotes: 'Cận 2.5 độ, ngồi bàn 2-3 để nhìn bảng rõ nhất.',
    }
  },
  {
    id: 'hs-02',
    code: 'HS25-10A8-02',
    name: 'Trần Bảo Anh',
    dob: '2010-07-22',
    gender: 'Nữ',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    address: '45 Quán Thánh, Ba Đình, Hà Nội',
    group: 1,
    roleInClass: 'Lớp phó Học tập',
    conductScore: 100,
    overallGpa: 9.3,
    academicRank: 'Xuất sắc',
    conductRank: 'Tốt',
    parents: [
      {
        relation: 'Mẹ',
        name: 'Lê Thanh Thảo',
        phone: '0903456789',
        email: 'thao.le@neu.edu.vn',
        job: 'Giảng viên Đại học',
        isPrimaryContact: true,
      }
    ],
    family: {
      totalSiblings: 1,
      birthOrder: 1,
      parentsMaritalStatus: 'Cùng sống',
      economicStatus: 'Khá giả',
      specialNotes: 'Bố công tác xa dài hạn, mẹ quán xuyến gia đình chu đáo.',
    },
    psychology: {
      personality: ['Chăm chỉ', 'Khiêm tốn', 'Cẩn thận', 'Sâu sắc'],
      interests: ['Văn học', 'Học ngoại ngữ', 'Vẽ tranh màu nước'],
      strengths: ['Tự học cao', 'Giao tiếp Tiếng Anh lưu loát IELTS 7.5', 'Viết lách'],
      weaknesses: ['Ít tham gia các hoạt động thể thao mạnh'],
      aptitudes: ['Vẽ minh họa', 'Hùng biện Tiếng Anh'],
      teacherObservations: 'Học lực top 1 lớp môn Anh & Văn, tích cực hỗ trợ các bạn kèm cặp học tập.',
      supportLevel: 'Bình thường',
    },
    health: {
      bloodType: 'A',
      heightCm: 160,
      weightKg: 48,
      vision: 'Bình thường',
      allergies: [],
      chronicConditions: [],
      physicalEducationNote: 'Bình thường',
      medicalNotes: 'Sức khỏe tốt.',
    }
  },
  {
    id: 'hs-03',
    code: 'HS25-10A8-03',
    name: 'Lê Minh Đức',
    dob: '2010-11-05',
    gender: 'Nam',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    address: '88 Hoàng Hoa Thám, Ba Đình, Hà Nội',
    group: 2,
    roleInClass: 'Học sinh',
    conductScore: 84,
    overallGpa: 6.8,
    academicRank: 'Trung bình',
    conductRank: 'Khá',
    parents: [
      {
        relation: 'Bố',
        name: 'Lê Văn Trọng',
        phone: '0978112233',
        email: 'trong.levan@gmail.com',
        job: 'Kinh doanh tự do',
        isPrimaryContact: true,
      }
    ],
    family: {
      totalSiblings: 3,
      birthOrder: 2,
      parentsMaritalStatus: 'Ly hôn',
      economicStatus: 'Bình thường',
      specialNotes: 'Sống cùng bố và bà nội, gia đình bận rộn ít có thời gian kèm cặp.',
    },
    psychology: {
      personality: ['Hiếu động', 'Nhạy cảm', 'Dễ phân tâm', 'Nhiệt tình'],
      interests: ['Game Esports', 'Bóng đá', 'Lắp ráp mô hình'],
      strengths: ['Phản xạ nhanh', 'Rất nghĩa khí với bạn bè'],
      weaknesses: ['Chưa tập trung trong giờ lý thuyết', 'Hay quên vở bài tập'],
      aptitudes: ['Đá bóng tiền đạo giỏi của trường'],
      teacherObservations: 'Em có tiềm năng nhưng tâm lý dạo gần đây hơi bất ổn do hoàn cảnh gia đình, cần GVCN trò chuyện lắng nghe riêng.',
      supportLevel: 'Cần quan tâm động viên',
    },
    health: {
      bloodType: 'B',
      heightCm: 168,
      weightKg: 55,
      vision: 'Bình thường',
      allergies: ['Dị ứng phấn hoa mùa xuân'],
      chronicConditions: ['Viêm mũi dị ứng'],
      physicalEducationNote: 'Bình thường',
      medicalNotes: 'Mang theo thuốc xịt mũi khi thời tiết thay đổi.',
    }
  },
  {
    id: 'hs-04',
    code: 'HS25-10A8-04',
    name: 'Phạm Quỳnh Chi',
    dob: '2010-01-19',
    gender: 'Nữ',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    address: '15 Đội Cấn, Ba Đình, Hà Nội',
    group: 2,
    roleInClass: 'Bí thư Chi đoàn',
    conductScore: 96,
    overallGpa: 8.5,
    academicRank: 'Giỏi',
    conductRank: 'Tốt',
    parents: [
      {
        relation: 'Mẹ',
        name: 'Phạm Thị Lan Hương',
        phone: '0915998877',
        email: 'huong.ptl@gov.vn',
        job: 'Công chức nhà nước',
        isPrimaryContact: true,
      }
    ],
    family: {
      totalSiblings: 2,
      birthOrder: 1,
      parentsMaritalStatus: 'Cùng sống',
      economicStatus: 'Khá giả',
      specialNotes: 'Gia đình truyền thống, ủng hộ các phong trào Đoàn trường.',
    },
    psychology: {
      personality: ['Năng nổ', 'Sáng tạo', 'Tự tin', 'Dễ gần'],
      interests: ['Nhảy hiện đại', 'MC sự kiện', 'Làm video ngắn'],
      strengths: ['Tổ chức sự kiện', 'Hoạt náo viên', 'Giao tiếp lưu loát'],
      weaknesses: ['Dễ ôm đồm nhiều việc phong trào ảnh hưởng giờ ôn thi'],
      aptitudes: ['Dẫn chương trình (MC)', 'Múa dân gian & Nhảy K-pop'],
      teacherObservations: 'Bí thư chi đoàn năng động, tổ chức văn nghệ xuất sắc.',
      supportLevel: 'Bình thường',
    },
    health: {
      bloodType: 'AB',
      heightCm: 164,
      weightKg: 50,
      vision: 'Cận thị',
      allergies: [],
      chronicConditions: [],
      physicalEducationNote: 'Bình thường',
      medicalNotes: 'Cận 1.75 độ.',
    }
  },
  {
    id: 'hs-05',
    code: 'HS25-10A8-05',
    name: 'Vũ Đăng Khoa',
    dob: '2010-09-12',
    gender: 'Nam',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    address: '67 Lạc Long Quân, Tây Hồ, Hà Nội',
    group: 3,
    roleInClass: 'Tổ trưởng',
    conductScore: 92,
    overallGpa: 8.1,
    academicRank: 'Giỏi',
    conductRank: 'Tốt',
    parents: [
      {
        relation: 'Bố',
        name: 'Vũ Quốc Bảo',
        phone: '0933221100',
        email: 'baovq@techhub.vn',
        job: 'Kiến trúc sư',
        isPrimaryContact: true,
      }
    ],
    family: {
      totalSiblings: 2,
      birthOrder: 2,
      parentsMaritalStatus: 'Cùng sống',
      economicStatus: 'Khá giả',
      specialNotes: 'Gia đình tạo điều kiện phát triển môn Khoa học tự nhiên.',
    },
    psychology: {
      personality: ['Điềm đạm', 'Thẳng thắn', 'Kỷ luật'],
      interests: ['Robotics', 'Cờ vua', 'Thiên văn học'],
      strengths: ['Tư duy toán học và vật lý rất tốt', 'Công bằng'],
      weaknesses: ['Môn Ngữ văn còn hạn chế diễn đạt cảm xúc'],
      aptitudes: ['Đạt giải Nhì Cờ vua cấp Quận'],
      teacherObservations: 'Tổ trưởng trách nhiệm, điểm danh và chấm nề nếp tổ nghiêm túc.',
      supportLevel: 'Bình thường',
    },
    health: {
      bloodType: 'O',
      heightCm: 175,
      weightKg: 65,
      vision: 'Bình thường',
      allergies: [],
      chronicConditions: [],
      physicalEducationNote: 'Bình thường',
      medicalNotes: 'Thể lực rất tốt.',
    }
  },
  {
    id: 'hs-06',
    code: 'HS25-10A8-06',
    name: 'Đặng Ngọc Mai',
    dob: '2010-04-30',
    gender: 'Nữ',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    address: '102 Phan Đình Phùng, Ba Đình, Hà Nội',
    group: 3,
    roleInClass: 'Học sinh',
    conductScore: 95,
    overallGpa: 7.9,
    academicRank: 'Khá',
    conductRank: 'Tốt',
    parents: [
      {
        relation: 'Mẹ',
        name: 'Hoàng Bích Ngân',
        phone: '0944556677',
        email: 'bichngan@vnanet.vn',
        job: 'Nhà báo',
        isPrimaryContact: true,
      }
    ],
    family: {
      totalSiblings: 1,
      birthOrder: 1,
      parentsMaritalStatus: 'Cùng sống',
      economicStatus: 'Bình thường',
      specialNotes: '',
    },
    psychology: {
      personality: ['Hiền lành', 'Ít nói', 'Tỉ mỉ'],
      interests: ['Nhiếp ảnh', 'Lịch sử', 'Chăm sóc thú cưng'],
      strengths: ['Ghi nhớ kiến thức xã hội tốt', 'Viết chữ đẹp'],
      weaknesses: ['Ngại đứng trước đám đông thuyết trình'],
      aptitudes: ['Nhiếp ảnh gia của lớp'],
      teacherObservations: 'Chăm ngoan, cần khuyến khích em tự tin phát biểu ý kiến nhiều hơn.',
      supportLevel: 'Bình thường',
    },
    health: {
      bloodType: 'A',
      heightCm: 158,
      weightKg: 46,
      vision: 'Cận thị',
      allergies: ['Dị ứng lông mèo'],
      chronicConditions: ['Hen phế quản nhẹ'],
      physicalEducationNote: 'Miễn giảm vận động mạnh',
      medicalNotes: 'Hạn chế chạy bền cự ly dài khi thời tiết lạnh ẩm.',
    }
  },
  {
    id: 'hs-07',
    code: 'HS25-10A8-07',
    name: 'Bùi Tuấn Kiệt',
    dob: '2010-12-08',
    gender: 'Nam',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    address: '29 Âu Cơ, Tây Hồ, Hà Nội',
    group: 4,
    roleInClass: 'Lớp phó Lao động',
    conductScore: 90,
    overallGpa: 7.4,
    academicRank: 'Khá',
    conductRank: 'Tốt',
    parents: [
      {
        relation: 'Bố',
        name: 'Bùi Quốc Tuấn',
        phone: '0966778899',
        email: 'tuankiet.dad@gmail.com',
        job: 'Kinh doanh nội thất',
        isPrimaryContact: true,
      }
    ],
    family: {
      totalSiblings: 2,
      birthOrder: 1,
      parentsMaritalStatus: 'Cùng sống',
      economicStatus: 'Bình thường',
      specialNotes: '',
    },
    psychology: {
      personality: ['Tháo vát', 'Nhiệt tình', 'Hài hước'],
      interests: ['Bóng chuyền', 'Cắm trại', 'Kỹ thuật mộc'],
      strengths: ['Chăm chỉ, chịu khó', 'Rất chu đáo trong phân công nhật lớp'],
      weaknesses: ['Học lệch các môn tự nhiên'],
      aptitudes: ['Bóng chuyền, sửa chữa đồ dùng học tập'],
      teacherObservations: 'Lớp phó lao động gương mẫu, luôn hoàn thành xuất sắc các buổi tổng vệ sinh.',
      supportLevel: 'Bình thường',
    },
    health: {
      bloodType: 'B',
      heightCm: 176,
      weightKg: 68,
      vision: 'Bình thường',
      allergies: [],
      chronicConditions: [],
      physicalEducationNote: 'Bình thường',
      medicalNotes: 'Thể lực rất sung mãn.',
    }
  },
  {
    id: 'hs-08',
    code: 'HS25-10A8-08',
    name: 'Lâm Gia Hân',
    dob: '2010-06-18',
    gender: 'Nữ',
    avatarUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80',
    address: '52 Nguyễn Trường Tộ, Ba Đình, Hà Nội',
    group: 4,
    roleInClass: 'Học sinh',
    conductScore: 94,
    overallGpa: 8.6,
    academicRank: 'Giỏi',
    conductRank: 'Tốt',
    parents: [
      {
        relation: 'Mẹ',
        name: 'Nguyễn Diệu Linh',
        phone: '0988123456',
        email: 'dieulinh.nguyen@bank.com.vn',
        job: 'Kiểm toán viên',
        isPrimaryContact: true,
      }
    ],
    family: {
      totalSiblings: 2,
      birthOrder: 2,
      parentsMaritalStatus: 'Cùng sống',
      economicStatus: 'Khá giả',
      specialNotes: '',
    },
    psychology: {
      personality: ['Thông minh', 'Nhẹ nhàng', 'Chăm chỉ'],
      interests: ['Hóa học thí nghiệm', 'Nấu ăn', 'Đàn Piano'],
      strengths: ['Khả năng ghi nhớ và phân tích công thức hóa học'],
      weaknesses: ['Đôi khi thiếu tự tin khi thi cử lớn'],
      aptitudes: ['Piano Grade 6', 'Hóa học Olympic'],
      teacherObservations: 'Thành viên nòng cốt đội tuyển HSG môn Hóa của khối 10.',
      supportLevel: 'Bình thường',
    },
    health: {
      bloodType: 'O',
      heightCm: 162,
      weightKg: 49,
      vision: 'Cận thị',
      allergies: ['Dị ứng kháng sinh nhóm Penicillin'],
      chronicConditions: [],
      physicalEducationNote: 'Bình thường',
      medicalNotes: 'Lưu ý cảnh báo dị ứng thuốc khi khám y tế học đường.',
    }
  }
];

export const INITIAL_DISCIPLINE_EVENTS: DisciplineEvent[] = [
  {
    id: 'disc-01',
    studentId: 'hs-03',
    studentName: 'Lê Minh Đức',
    group: 2,
    type: 'violation',
    category: 'Đi học muộn',
    scoreChange: -2,
    description: 'Đến lớp muộn 15 phút tiết 1 môn Toán không lý do chính đáng.',
    date: '2026-08-25',
    recordedBy: 'Đội Cờ đỏ Đoàn trường',
    verified: true,
  },
  {
    id: 'disc-02',
    studentId: 'hs-02',
    studentName: 'Trần Bảo Anh',
    group: 1,
    type: 'commendation',
    category: 'Thành tích xuất sắc',
    scoreChange: 5,
    description: 'Đạt Giải Nhất cuộc thi Hùng biện Tiếng Anh cấp Cụm trường.',
    date: '2026-08-24',
    recordedBy: 'Ms Jenny (GVCN)',
    verified: true,
  },
  {
    id: 'disc-03',
    studentId: 'hs-01',
    studentName: 'Nguyễn Hoàng An',
    group: 1,
    type: 'commendation',
    category: 'Ý thức gương mẫu',
    scoreChange: 3,
    description: 'Chủ động điều hành 15 phút truy bài đầu giờ nghiêm túc, hỗ trợ ban cán sự.',
    date: '2026-08-22',
    recordedBy: 'Ms Jenny (GVCN)',
    verified: true,
  },
  {
    id: 'disc-04',
    studentId: 'hs-07',
    studentName: 'Bùi Tuấn Kiệt',
    group: 4,
    type: 'commendation',
    category: 'Tập thể & Lao động',
    scoreChange: 3,
    description: 'Sửa chữa và kê lại hệ thống bàn ghế hỏng của lớp trong giờ sinh hoạt.',
    date: '2026-08-20',
    recordedBy: 'Thầy Tổng phụ trách Đoàn',
    verified: true,
  }
];

export const INITIAL_ATTENDANCE: AttendanceRecord[] = [
  {
    id: 'att-01',
    studentId: 'hs-01',
    date: '2026-08-26',
    status: 'present',
    session: 'Sáng',
    notifiedParent: false,
  },
  {
    id: 'att-02',
    studentId: 'hs-02',
    date: '2026-08-26',
    status: 'present',
    session: 'Sáng',
    notifiedParent: false,
  },
  {
    id: 'att-03',
    studentId: 'hs-03',
    date: '2026-08-26',
    status: 'late',
    session: 'Sáng',
    reason: 'Hỏng xe trên đường đến trường',
    notifiedParent: true,
  },
  {
    id: 'att-04',
    studentId: 'hs-04',
    date: '2026-08-26',
    status: 'present',
    session: 'Sáng',
    notifiedParent: false,
  },
  {
    id: 'att-05',
    studentId: 'hs-05',
    date: '2026-08-26',
    status: 'present',
    session: 'Sáng',
    notifiedParent: false,
  },
  {
    id: 'att-06',
    studentId: 'hs-06',
    date: '2026-08-26',
    status: 'excused',
    session: 'Sáng',
    reason: 'Sốt xuất huyết, phụ huynh có đơn xin phép',
    notifiedParent: true,
  },
  {
    id: 'att-07',
    studentId: 'hs-07',
    date: '2026-08-26',
    status: 'present',
    session: 'Sáng',
    notifiedParent: false,
  },
  {
    id: 'att-08',
    studentId: 'hs-08',
    date: '2026-08-26',
    status: 'present',
    session: 'Sáng',
    notifiedParent: false,
  }
];

export const INITIAL_GRADES_DATA: StudentGrades[] = [
  {
    studentId: 'hs-01',
    studentName: 'Nguyễn Hoàng An',
    semester: 'HK1',
    academicYear: '2025-2026',
    gpa: 8.8,
    academicRank: 'Giỏi',
    teacherComment: 'Học sinh có tư duy toán học và ngoại ngữ vượt trội, khả năng tự giác cao, tích cực giúp bạn.',
    subjects: [
      { subjectId: 'toan', subjectName: 'Toán', oralScores: [9, 10], test15mScores: [9], test1PeriodScores: [8.5, 9.0], finalScore: 9.2, averageScore: 9.0 },
      { subjectId: 'van', subjectName: 'Ngữ văn', oralScores: [8], test15mScores: [8.5], test1PeriodScores: [8.0], finalScore: 8.5, averageScore: 8.3 },
      { subjectId: 'anh', subjectName: 'Tiếng Anh', oralScores: [10], test15mScores: [9.5], test1PeriodScores: [9.5], finalScore: 9.8, averageScore: 9.6 },
      { subjectId: 'ly', subjectName: 'Vật lí', oralScores: [9], test15mScores: [9.0], test1PeriodScores: [8.5], finalScore: 9.0, averageScore: 8.9 },
      { subjectId: 'hoa', subjectName: 'Hóa học', oralScores: [8.5], test15mScores: [8.0], test1PeriodScores: [8.5], finalScore: 8.8, averageScore: 8.6 },
      { subjectId: 'tin', subjectName: 'Tin học', oralScores: [10], test15mScores: [10], test1PeriodScores: [10], finalScore: 10, averageScore: 10.0 }
    ]
  },
  {
    studentId: 'hs-02',
    studentName: 'Trần Bảo Anh',
    semester: 'HK1',
    academicYear: '2025-2026',
    gpa: 9.3,
    academicRank: 'Xuất sắc',
    teacherComment: 'Học lực xuất sắc toàn diện, dẫn đầu khối môn Tiếng Anh và Ngữ văn, bài làm trình bày khoa học.',
    subjects: [
      { subjectId: 'toan', subjectName: 'Toán', oralScores: [9, 9.5], test15mScores: [9], test1PeriodScores: [9.0, 9.0], finalScore: 9.0, averageScore: 9.1 },
      { subjectId: 'van', subjectName: 'Ngữ văn', oralScores: [9.5], test15mScores: [9.0], test1PeriodScores: [9.0], finalScore: 9.5, averageScore: 9.3 },
      { subjectId: 'anh', subjectName: 'Tiếng Anh', oralScores: [10], test15mScores: [10], test1PeriodScores: [10], finalScore: 10, averageScore: 10.0 },
      { subjectId: 'ly', subjectName: 'Vật lí', oralScores: [9], test15mScores: [8.5], test1PeriodScores: [9.0], finalScore: 9.0, averageScore: 8.9 },
      { subjectId: 'hoa', subjectName: 'Hóa học', oralScores: [9.0], test15mScores: [9.5], test1PeriodScores: [9.0], finalScore: 9.5, averageScore: 9.3 },
      { subjectId: 'tin', subjectName: 'Tin học', oralScores: [9.5], test15mScores: [9.5], test1PeriodScores: [9.5], finalScore: 9.5, averageScore: 9.5 }
    ]
  },
  {
    studentId: 'hs-03',
    studentName: 'Lê Minh Đức',
    semester: 'HK1',
    academicYear: '2025-2026',
    gpa: 6.8,
    academicRank: 'Trung bình',
    teacherComment: 'Cần tập trung hơn trong giờ học các môn tự nhiên, tránh để bài tập dồn cuối kỳ.',
    subjects: [
      { subjectId: 'toan', subjectName: 'Toán', oralScores: [6], test15mScores: [5.5], test1PeriodScores: [6.0], finalScore: 6.5, averageScore: 6.1 },
      { subjectId: 'van', subjectName: 'Ngữ văn', oralScores: [7], test15mScores: [6.5], test1PeriodScores: [7.0], finalScore: 7.0, averageScore: 6.9 },
      { subjectId: 'anh', subjectName: 'Tiếng Anh', oralScores: [7.5], test15mScores: [7.0], test1PeriodScores: [7.5], finalScore: 7.0, averageScore: 7.3 },
      { subjectId: 'ly', subjectName: 'Vật lí', oralScores: [6], test15mScores: [6.0], test1PeriodScores: [5.5], finalScore: 6.0, averageScore: 5.9 },
      { subjectId: 'hoa', subjectName: 'Hóa học', oralScores: [6.5], test15mScores: [6.0], test1PeriodScores: [6.5], finalScore: 7.0, averageScore: 6.6 },
      { subjectId: 'tin', subjectName: 'Tin học', oralScores: [8.5], test15mScores: [8.0], test1PeriodScores: [8.5], finalScore: 8.5, averageScore: 8.4 }
    ]
  }
];

export const INITIAL_MESSAGES: MessageThread[] = [
  {
    id: 'msg-01',
    type: 'broadcast',
    recipientIds: ['all'],
    recipientNames: 'Toàn bộ Phụ huynh Lớp 10A8 (36 PH)',
    channel: 'App',
    title: 'Thông báo: Lịch Họp Phụ huynh Đầu năm học 2025-2026',
    content: 'Kính gửi Quý phụ huynh, nhà trường xin trân trọng thông báo buổi họp phụ huynh đầu năm sẽ diễn ra vào lúc 08h00 sáng Chủ Nhật, ngày 31/08/2025 tại phòng học 204. Rất mong quý phụ huynh sắp xếp có mặt đúng giờ.',
    sentAt: '2026-08-25 16:30',
    status: 'Đã gửi',
    repliesCount: 32,
  },
  {
    id: 'msg-02',
    type: 'individual',
    recipientIds: ['hs-03'],
    recipientNames: 'PH Em Lê Minh Đức (Bố: Lê Văn Trọng)',
    channel: 'Zalo',
    title: 'Trao đổi về tình hình học tập và chuyên cần tuần qua',
    content: 'Chào anh Trọng, tuần này em Đức có 1 buổi đến muộn và điểm kiểm tra 15p môn Toán chưa đạt yêu cầu. Cô giáo muốn hẹn anh 15 phút sau giờ tan học để cùng trao đổi phương pháp hỗ trợ con.',
    sentAt: '2026-08-25 18:15',
    status: 'Đã đọc',
    repliesCount: 3,
  },
  {
    id: 'msg-03',
    type: 'broadcast',
    recipientIds: ['all'],
    recipientNames: 'Toàn bộ Phụ huynh Lớp 10A8 (36 PH)',
    channel: 'SMS',
    title: 'Khen thưởng nề nếp thi đua Tuần 2',
    content: 'Lớp 10A8 vinh dự xếp thứ 2 toàn trường về nề nếp thi đua tuần 2. Cảm ơn sự đồng hành sát sao của Quý Phụ huynh!',
    sentAt: '2026-08-24 17:00',
    status: 'Đã gửi',
    repliesCount: 18,
  }
];

export const INITIAL_APPOINTMENTS: ParentAppointment[] = [
  {
    id: 'apt-01',
    studentId: 'hs-03',
    studentName: 'Lê Minh Đức',
    parentName: 'Lê Văn Trọng (Bố)',
    phone: '0978112233',
    type: 'Trực tiếp tại trường',
    date: '2026-08-28',
    time: '16:30 - 17:00',
    topic: 'Trao đổi phương pháp học tập môn Tự nhiên và định hướng tâm lý',
    status: 'Đã duyệt',
    meetingLinkOrRoom: 'Phòng Hội đồng Sư phạm (Tầng 2)',
    notes: 'Phụ huynh đã xác nhận có mặt.',
  },
  {
    id: 'apt-02',
    studentId: 'hs-06',
    studentName: 'Đặng Ngọc Mai',
    parentName: 'Hoàng Bích Ngân (Mẹ)',
    phone: '0944556677',
    type: 'Trực tuyến (Meet/Zoom)',
    date: '2026-08-29',
    time: '20:00 - 20:30',
    topic: 'Cập nhật tình hình sức khỏe và kế hoạch học bù cho em Mai',
    status: 'Chờ xác nhận',
    meetingLinkOrRoom: 'https://meet.google.com/edu-class-10a8',
    notes: 'Em Mai đang điều trị sốt xuất huyết.',
  }
];

export const INITIAL_CALENDAR_TASKS: CalendarTask[] = [
  {
    id: 'task-01',
    title: 'Hoàn thiện hồ sơ lý lịch học sinh Lớp 10A8 đầu năm',
    category: 'Chủ nhiệm',
    date: '2026-08-27',
    time: '10:00',
    priority: 'Cao',
    completed: false,
    location: 'Văn phòng Đoàn / Trực tuyến',
    description: 'Kiểm tra khớp thông tin BHYT, SĐT phụ huynh và địa chỉ cư trú.',
  },
  {
    id: 'task-02',
    title: 'Họp Hội đồng Sư phạm & Tổ Chuyên môn Toán',
    category: 'Họp trường/Tổ',
    date: '2026-08-28',
    time: '14:00',
    priority: 'Cao',
    completed: false,
    location: 'Hội trường Lớn',
    description: 'Thống nhất ma trận đề kiểm tra giữa kỳ 1 theo chương trình GDPT 2018.',
  },
  {
    id: 'task-03',
    title: 'Tiết Sinh hoạt Lớp & Sơ kết Tuần 3',
    category: 'Chủ nhiệm',
    date: '2026-08-30',
    time: '11:15',
    priority: 'Trung bình',
    completed: false,
    location: 'Phòng học 204',
    description: 'Khen thưởng tổ xuất sắc, chấn chỉnh tình trạng đi muộn và chuẩn bị đại hội Chi đoàn.',
  },
  {
    id: 'task-04',
    title: 'Hạn nộp Báo cáo Thi đua Nề nếp Tháng 8 về BGH',
    category: 'Hạn nộp báo cáo',
    date: '2026-08-31',
    time: '17:00',
    priority: 'Cao',
    completed: false,
    location: 'Cổng thông tin Giáo vụ',
    description: 'Xuất biểu mẫu báo cáo tổng hợp chuyên cần và kỷ luật.',
  }
];

export const INITIAL_PERIODIC_REPORTS: PeriodicReport[] = [
  {
    id: 'rep-01',
    title: 'Báo cáo Sơ kết Thi đua & Nề nếp Tuần 2 (Tháng 8/2025)',
    type: 'weekly',
    period: 'Tuần 2 - Tháng 8/2025',
    createdDate: '2026-08-24',
    totalStudents: 36,
    attendanceRate: 98.6,
    excellentCount: 14,
    goodCount: 18,
    averageCount: 4,
    weakCount: 0,
    topViolations: [
      { category: 'Đi học muộn', count: 2 },
      { category: 'Chưa làm đủ bài tập Toán', count: 1 }
    ],
    topCommendations: [
      { category: 'Giải Nhất Hùng biện Tiếng Anh', count: 1 },
      { category: 'Trực nhật xuất sắc', count: 2 },
      { category: 'Phát biểu xây dựng bài tích cực', count: 8 }
    ],
    summaryNote: 'Lớp duy trì nề nếp tốt, ban cán sự lớp làm việc nghiêm túc, không khí học tập sôi nổi.',
    status: 'Đã duyệt nộp BGH'
  },
  {
    id: 'rep-02',
    title: 'Báo cáo Tổng hợp Tình hình Lớp Tháng 8/2025 (Dự thảo)',
    type: 'monthly',
    period: 'Tháng 8/2025',
    createdDate: '2026-08-26',
    totalStudents: 36,
    attendanceRate: 97.8,
    excellentCount: 12,
    goodCount: 20,
    averageCount: 4,
    weakCount: 0,
    topViolations: [
      { category: 'Đi học muộn', count: 4 },
      { category: 'Sử dụng điện thoại ngoài giờ cho phép', count: 1 }
    ],
    topCommendations: [
      { category: 'Khen thưởng phong trào Đoàn', count: 3 },
      { category: 'Đạt điểm 10 kiểm tra đầu giờ', count: 15 }
    ],
    summaryNote: 'Cần theo dõi thêm 02 học sinh có biểu hiện lơ là trong các tiết học buổi chiều.',
    status: 'Bản nháp'
  }
];

export const SUBJECTS_LIST = [
  { id: 'toan', name: 'Toán học', icon: 'Calculator' },
  { id: 'van', name: 'Ngữ văn', icon: 'BookOpen' },
  { id: 'anh', name: 'Tiếng Anh', icon: 'Globe' },
  { id: 'ly', name: 'Vật lí', icon: 'Zap' },
  { id: 'hoa', name: 'Hóa học', icon: 'FlaskConical' },
  { id: 'sinh', name: 'Sinh học', icon: 'Leaf' },
  { id: 'su', name: 'Lịch sử', icon: 'Landmark' },
  { id: 'dia', name: 'Địa lí', icon: 'Compass' },
  { id: 'tin', name: 'Tin học', icon: 'Laptop' },
  { id: 'gdcd', name: 'GDKT & Pháp luật', icon: 'Scale' },
];

// Alias Exports for Convenience
export const MOCK_STUDENTS = INITIAL_STUDENTS;
export const MOCK_ATTENDANCE_TODAY = INITIAL_ATTENDANCE;
export const MOCK_DISCIPLINE_EVENTS = INITIAL_DISCIPLINE_EVENTS;
export const MOCK_STUDENT_GRADES = INITIAL_GRADES_DATA;
export const MOCK_MESSAGES = INITIAL_MESSAGES;
export const MOCK_APPOINTMENTS = INITIAL_APPOINTMENTS;
export const MOCK_TASKS = INITIAL_CALENDAR_TASKS;
export const MOCK_PERIODIC_REPORTS = INITIAL_PERIODIC_REPORTS;


