import { Student, Gender, AcademicRank, ConductRank } from '../types';
import { MOCK_STUDENTS } from '../data/mockData';

export type ConnectionType = 'google_sheets_csv' | 'apps_script' | 'google_api';

export interface GoogleDatabaseConfig {
  connectionType: ConnectionType;
  sheetUrl: string;
  sheetId: string;
  sheetGid: string;
  appsScriptUrl: string;
  apiKey: string;
  autoSync: boolean;
  autoSyncIntervalMinutes: number;
  lastSyncTime: string | null;
  isConnected: boolean;
  lastError: string | null;
}

const STORAGE_KEY_CONFIG = 'edumaster_10a8_google_db_config';
const STORAGE_KEY_STUDENTS_CACHE = 'edumaster_10a8_google_students_cache';

export const DEFAULT_GOOGLE_DB_CONFIG: GoogleDatabaseConfig = {
  connectionType: 'google_sheets_csv',
  sheetUrl: 'https://docs.google.com/spreadsheets/d/1_Edumaster10A8_Jenny_DemoSheet/edit#gid=0',
  sheetId: '',
  sheetGid: '0',
  appsScriptUrl: '',
  apiKey: '',
  autoSync: false,
  autoSyncIntervalMinutes: 15,
  lastSyncTime: null,
  isConnected: false,
  lastError: null,
};

// Ready-to-copy Google Apps Script Code for 2-way sync
export const GOOGLE_APPS_SCRIPT_SAMPLE_CODE = `/**
 * QUẢN LÝ LỚP HỌC 10A8 - MS JENNY
 * Google Apps Script Web App API Backend
 * 
 * Hướng dẫn cài đặt:
 * 1. Mở Google Sheet danh sách lớp 10A8
 * 2. Vào Tiện ích mở rộng (Extensions) -> Apps Script
 * 3. Dán toàn bộ mã này vào file Code.gs
 * 4. Nhấn "Triển khai" (Deploy) -> "Tùy chọn triển khai mới" (New deployment)
 * 5. Chọn loại: "Ứng dụng web" (Web App)
 * 6. Mục "Người có quyền truy cập" (Who has access): Chọn "Bất kỳ ai" (Anyone)
 * 7. Sao chép URL Web App và dán vào ứng dụng Quản Lý Lớp Học 10A8-Ms Jenny!
 */

function doGet(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  var rows = data.slice(1);
  
  var students = rows.map(function(row, index) {
    var obj = {};
    headers.forEach(function(header, hIndex) {
      obj[header] = row[hIndex];
    });
    return obj;
  });
  
  return ContentService
    .createTextOutput(JSON.stringify({ status: "success", count: students.length, data: students }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    var requestData = JSON.parse(e.postData.contents);
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    if (requestData.action === "syncStudents" && Array.isArray(requestData.students)) {
      // Cập nhật hoặc lưu danh sách học sinh vào sheet
      sheet.clearContents();
      
      var headers = [
        "Mã HS", "Họ và tên", "Giới tính", "Ngày sinh", "Tổ", "Chức vụ",
        "ĐTB HK1", "Học lực", "Điểm nề nếp", "Hạnh kiểm", "Phụ huynh", 
        "SĐT Phụ huynh", "Email PH", "Địa chỉ", "Ghi chú sức khỏe/tâm lý"
      ];
      
      var rows = [headers];
      requestData.students.forEach(function(s) {
        rows.push([
          s.code,
          s.name,
          s.gender,
          s.dob,
          s.group,
          s.roleInClass,
          s.overallGpa,
          s.academicRank,
          s.conductScore,
          s.conductRank,
          s.parents && s.parents[0] ? s.parents[0].name : "",
          s.parents && s.parents[0] ? s.parents[0].phone : "",
          s.parents && s.parents[0] ? s.parents[0].email : "",
          s.address || "",
          s.psychology ? s.psychology.teacherObservations : ""
        ]);
      });
      
      sheet.getRange(1, 1, rows.length, headers.length).setValues(rows);
      
      return ContentService
        .createTextOutput(JSON.stringify({ status: "success", message: "Đã cập nhật " + requestData.students.length + " học sinh vào Google Sheet thành công!" }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: "Thao tác không hợp lệ" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
`;

// Helper: Parse Google Sheets Link to extract Sheet ID and gid
export function parseGoogleSheetUrl(url: string): { sheetId: string; gid: string; csvUrl: string } {
  if (!url || typeof url !== 'string') {
    return { sheetId: '', gid: '0', csvUrl: '' };
  }

  const cleanUrl = url.trim();

  // Case 1: Published to Web CSV Link (https://docs.google.com/spreadsheets/d/e/2PACX-.../pub?output=csv)
  if (cleanUrl.includes('/pub') && cleanUrl.includes('output=csv')) {
    return { sheetId: 'published_web', gid: '0', csvUrl: cleanUrl };
  }

  // Case 2: Standard Google Sheet edit/sharing link
  // e.g. https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit?gid=0#gid=0
  const idMatch = cleanUrl.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  const sheetId = idMatch ? idMatch[1] : '';

  const gidMatch = cleanUrl.match(/[#&?]gid=([0-9]+)/);
  const gid = gidMatch ? gidMatch[1] : '0';

  if (sheetId) {
    // Generate direct CSV export link using Google Visualization API (fast, reliable, CORS-friendly)
    const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&gid=${gid}`;
    return { sheetId, gid, csvUrl };
  }

  return { sheetId: '', gid: '0', csvUrl: cleanUrl };
}

// Robust CSV Parser that handles quotes, commas, newlines, and UTF-8
export function parseCSV(csvText: string): string[][] {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentField = '';
  let inQuotes = false;

  for (let i = 0; i < csvText.length; i++) {
    const char = csvText[i];
    const nextChar = csvText[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Escaped quote
        currentField += '"';
        i++;
      } else {
        // Toggle quote mode
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      currentRow.push(currentField.trim());
      currentField = '';
    } else if ((char === '\r' || char === '\n') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') {
        i++;
      }
      currentRow.push(currentField.trim());
      currentField = '';
      if (currentRow.length > 0 && currentRow.some((field) => field.length > 0)) {
        rows.push(currentRow);
      }
      currentRow = [];
    } else {
      currentField += char;
    }
  }

  if (currentField.length > 0 || currentRow.length > 0) {
    currentRow.push(currentField.trim());
    if (currentRow.some((field) => field.length > 0)) {
      rows.push(currentRow);
    }
  }

  return rows;
}

// Normalize Vietnamese header string for smart matching
function normalizeHeader(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9]/g, '')
    .trim();
}

// Smart Column Matcher: Maps arbitrary CSV headers to Student fields
export function mapCsvRowsToStudents(rows: string[][]): Student[] {
  if (!rows || rows.length < 2) return [];

  const headers = rows[0];
  const dataRows = rows.slice(1);

  // Find column indexes
  const colIndexMap: { [key: string]: number } = {};

  headers.forEach((h, idx) => {
    const norm = normalizeHeader(h);

    if (norm.includes('mahs') || norm.includes('mahocsinh') || norm === 'ma' || norm === 'code' || norm === 'id') {
      colIndexMap['code'] = idx;
    } else if (norm.includes('hovaten') || norm.includes('hoten') || norm === 'ten' || norm === 'name' || norm.includes('hocsinh')) {
      colIndexMap['name'] = idx;
    } else if (norm.includes('gioitinh') || norm.includes('phai') || norm === 'gender' || norm.includes('namnu')) {
      colIndexMap['gender'] = idx;
    } else if (norm.includes('ngaysinh') || norm.includes('namsinh') || norm === 'dob' || norm.includes('birth')) {
      colIndexMap['dob'] = idx;
    } else if (norm === 'to' || norm.includes('nhom') || norm === 'group' || norm.includes('tosinhhoat')) {
      colIndexMap['group'] = idx;
    } else if (norm.includes('chucvu') || norm.includes('chucdanh') || norm.includes('vaitro') || norm === 'role') {
      colIndexMap['roleInClass'] = idx;
    } else if (norm.includes('diachi') || norm.includes('noio') || norm.includes('hokhau') || norm === 'address') {
      colIndexMap['address'] = idx;
    } else if (norm.includes('dtb') || norm.includes('diemtb') || norm.includes('diemtrungbinh') || norm === 'gpa') {
      colIndexMap['overallGpa'] = idx;
    } else if (norm.includes('hocluc') || norm.includes('xeploaihocluc') || norm === 'rank' || norm.includes('xeploai')) {
      colIndexMap['academicRank'] = idx;
    } else if (norm.includes('diemnenep') || norm.includes('diemrenluyen') || norm.includes('nenep') || norm.includes('diemthiđua') || norm.includes('diemthidua')) {
      colIndexMap['conductScore'] = idx;
    } else if (norm.includes('hanhkiem') || norm.includes('xeploaihanhkiem') || norm.includes('renluyen')) {
      colIndexMap['conductRank'] = idx;
    } else if (norm.includes('tenphuhuynh') || norm.includes('phuhuynh') || norm.includes('tenbome') || norm.includes('nguoigiamho')) {
      colIndexMap['parentName'] = idx;
    } else if (norm.includes('sdt') || norm.includes('sodienthoai') || norm.includes('phone') || norm.includes('dienthoai')) {
      colIndexMap['parentPhone'] = idx;
    } else if (norm.includes('email') || norm.includes('mail')) {
      colIndexMap['parentEmail'] = idx;
    } else if (norm.includes('nghenghiep') || norm.includes('congviec') || norm === 'job') {
      colIndexMap['parentJob'] = idx;
    } else if (norm.includes('ghichu') || norm.includes('tamly') || norm.includes('suckhoe') || norm.includes('luuy')) {
      colIndexMap['notes'] = idx;
    } else if (norm.includes('anh') || norm.includes('avatar') || norm.includes('hinhanh')) {
      colIndexMap['avatarUrl'] = idx;
    }
  });

  const students: Student[] = [];

  dataRows.forEach((row, rIdx) => {
    // Must have at least a name
    const rawName = colIndexMap['name'] !== undefined ? row[colIndexMap['name']] : row[1] || '';
    if (!rawName || rawName.trim().length === 0) return;

    const name = rawName.trim();
    const stt = (rIdx + 1).toString().padStart(2, '0');
    const code =
      colIndexMap['code'] !== undefined && row[colIndexMap['code']]
        ? row[colIndexMap['code']].trim()
        : `HS25-10A8-${stt}`;

    const rawGender = colIndexMap['gender'] !== undefined ? row[colIndexMap['gender']]?.trim() : '';
    const gender: Gender = rawGender && (rawGender.toLowerCase() === 'nữ' || rawGender.toLowerCase() === 'nu' || rawGender.toLowerCase() === 'female' || rawGender.toLowerCase() === 'f') ? 'Nữ' : 'Nam';

    let dob = colIndexMap['dob'] !== undefined ? row[colIndexMap['dob']]?.trim() : '2010-01-01';
    if (dob && dob.includes('/')) {
      // Convert DD/MM/YYYY to YYYY-MM-DD
      const parts = dob.split('/');
      if (parts.length === 3) {
        const d = parts[0].padStart(2, '0');
        const m = parts[1].padStart(2, '0');
        const y = parts[2].length === 2 ? `20${parts[2]}` : parts[2];
        dob = `${y}-${m}-${d}`;
      }
    }

    let group = 1;
    if (colIndexMap['group'] !== undefined) {
      const gParsed = parseInt(row[colIndexMap['group']]);
      if (!isNaN(gParsed) && gParsed >= 1 && gParsed <= 4) {
        group = gParsed;
      } else {
        group = (rIdx % 4) + 1;
      }
    } else {
      group = (rIdx % 4) + 1;
    }

    const rawRole = colIndexMap['roleInClass'] !== undefined ? row[colIndexMap['roleInClass']]?.trim() : '';
    const roleInClass = (rawRole || 'Học sinh') as any;

    const address = colIndexMap['address'] !== undefined ? row[colIndexMap['address']]?.trim() || 'Hà Nội' : 'Hà Nội';

    const rawGpa = colIndexMap['overallGpa'] !== undefined ? parseFloat(row[colIndexMap['overallGpa']]) : NaN;
    const overallGpa = !isNaN(rawGpa) ? Number(rawGpa.toFixed(1)) : 8.0;

    let academicRank: AcademicRank = 'Giỏi';
    if (overallGpa >= 9.0) academicRank = 'Xuất sắc';
    else if (overallGpa >= 8.0) academicRank = 'Giỏi';
    else if (overallGpa >= 6.5) academicRank = 'Khá';
    else if (overallGpa >= 5.0) academicRank = 'Trung bình';
    else academicRank = 'Yếu';

    if (colIndexMap['academicRank'] !== undefined && row[colIndexMap['academicRank']]) {
      const r = row[colIndexMap['academicRank']].trim();
      if (['Xuất sắc', 'Giỏi', 'Khá', 'Trung bình', 'Yếu'].includes(r)) {
        academicRank = r as AcademicRank;
      }
    }

    const rawConduct = colIndexMap['conductScore'] !== undefined ? parseInt(row[colIndexMap['conductScore']]) : NaN;
    const conductScore = !isNaN(rawConduct) ? rawConduct : 96;

    let conductRank: ConductRank = conductScore >= 90 ? 'Tốt' : conductScore >= 80 ? 'Khá' : 'Đạt';
    if (colIndexMap['conductRank'] !== undefined && row[colIndexMap['conductRank']]) {
      const cr = row[colIndexMap['conductRank']].trim();
      if (['Tốt', 'Khá', 'Đạt', 'Chưa đạt'].includes(cr)) {
        conductRank = cr as ConductRank;
      }
    }

    const parentName = colIndexMap['parentName'] !== undefined ? row[colIndexMap['parentName']]?.trim() : `PH Em ${name}`;
    const parentPhone = colIndexMap['parentPhone'] !== undefined ? row[colIndexMap['parentPhone']]?.trim() : '09' + Math.floor(10000000 + Math.random() * 90000000);
    const parentEmail = colIndexMap['parentEmail'] !== undefined ? row[colIndexMap['parentEmail']]?.trim() : '';
    const parentJob = colIndexMap['parentJob'] !== undefined ? row[colIndexMap['parentJob']]?.trim() : 'Kinh doanh tự do';

    const notes = colIndexMap['notes'] !== undefined ? row[colIndexMap['notes']]?.trim() : '';

    const avatarPhotos = [
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80',
    ];

    const avatarUrl =
      colIndexMap['avatarUrl'] !== undefined && row[colIndexMap['avatarUrl']]
        ? row[colIndexMap['avatarUrl']].trim()
        : avatarPhotos[rIdx % avatarPhotos.length];

    const student: Student = {
      id: `hs-google-${rIdx + 1}-${Date.now().toString(36)}`,
      code,
      name,
      dob: dob || '2010-01-01',
      gender,
      avatarUrl,
      address,
      group,
      roleInClass,
      conductScore,
      overallGpa,
      academicRank,
      conductRank,
      parents: [
        {
          relation: 'Bố',
          name: parentName || `Phụ huynh em ${name}`,
          phone: parentPhone || '0912345678',
          email: parentEmail || '',
          job: parentJob || 'Nhân viên văn phòng',
          isPrimaryContact: true,
        },
      ],
      family: {
        totalSiblings: 2,
        birthOrder: 1,
        parentsMaritalStatus: 'Cùng sống',
        economicStatus: 'Bình thường',
        specialNotes: notes ? `Ghi chú từ Google Database: ${notes}` : 'Gia đình phối hợp tốt với GVCN Ms Jenny.',
      },
      psychology: {
        personality: ['Hòa đồng', 'Tự giác'],
        interests: ['Thể thao', 'Ngoại ngữ'],
        strengths: ['Tiếp thu nhanh', 'Ý thức kỷ luật tốt'],
        weaknesses: [],
        aptitudes: ['Tiếng Anh', 'Hoạt động phong trào'],
        teacherObservations: notes || 'Học sinh chấp hành tốt nội quy lớp 10A8.',
        supportLevel: notes && (notes.toLowerCase().includes('quan tâm') || notes.toLowerCase().includes('hỗ trợ')) ? 'Cần quan tâm động viên' : 'Bình thường',
      },
      health: {
        bloodType: 'O',
        heightCm: gender === 'Nam' ? 170 : 160,
        weightKg: gender === 'Nam' ? 58 : 48,
        vision: 'Bình thường',
        allergies: notes && notes.toLowerCase().includes('dị ứng') ? [notes] : [],
        chronicConditions: [],
        physicalEducationNote: notes && notes.toLowerCase().includes('miễn') ? 'Miễn giảm vận động mạnh' : 'Bình thường',
        medicalNotes: notes || 'Sức khỏe ổn định.',
      },
    };

    students.push(student);
  });

  return students;
}

// Generate Sample 10A8 Google Sheets CSV data
export function generateSample10A8Csv(): string {
  const headers = [
    'Mã HS',
    'Họ và tên',
    'Giới tính',
    'Ngày sinh',
    'Tổ',
    'Chức vụ',
    'ĐTB HK1',
    'Học lực',
    'Điểm nề nếp',
    'Hạnh kiểm',
    'Họ tên Phụ huynh',
    'SĐT Phụ huynh',
    'Email Phụ huynh',
    'Địa chỉ',
    'Ghi chú Sức khỏe / Tâm lý'
  ];

  const sampleRows = [
    ['HS25-10A8-01', 'Nguyễn Hoàng An', 'Nam', '15/03/2010', '1', 'Lớp trưởng', '8.8', 'Giỏi', '98', 'Tốt', 'Nguyễn Văn Hùng', '0912345678', 'hung.nguyen@company.vn', '124 Thụy Khuê, Tây Hồ, Hà Nội', 'Cận 2.5 độ, gương mẫu'],
    ['HS25-10A8-02', 'Trần Bảo Anh', 'Nữ', '22/07/2010', '1', 'Lớp phó Học tập', '9.3', 'Xuất sắc', '100', 'Tốt', 'Lê Thanh Thảo', '0903456789', 'thao.le@neu.edu.vn', '45 Quán Thánh, Ba Đình, Hà Nội', 'IELTS 7.5, HSG Anh'],
    ['HS25-10A8-03', 'Lê Minh Đức', 'Nam', '05/11/2010', '2', 'Học sinh', '6.8', 'Trung bình', '84', 'Khá', 'Lê Văn Trọng', '0978112233', 'trong.levan@gmail.com', '88 Hoàng Hoa Thám, Ba Đình, Hà Nội', 'Cần quan tâm động viên môn Toán'],
    ['HS25-10A8-04', 'Phạm Quỳnh Chi', 'Nữ', '19/01/2010', '2', 'Bí thư Chi đoàn', '8.5', 'Giỏi', '96', 'Tốt', 'Phạm Thị Lan Hương', '0915998877', 'huong.ptl@gov.vn', '15 Đội Cấn, Ba Đình, Hà Nội', 'MC sự kiện, năng nổ'],
    ['HS25-10A8-05', 'Vũ Đăng Khoa', 'Nam', '12/09/2010', '3', 'Tổ trưởng', '8.1', 'Giỏi', '92', 'Tốt', 'Vũ Quốc Bảo', '0933221100', 'baovq@techhub.vn', '67 Lạc Long Quân, Tây Hồ, Hà Nội', 'Giải Nhì Cờ vua cấp Quận'],
    ['HS25-10A8-06', 'Đặng Ngọc Mai', 'Nữ', '30/04/2010', '3', 'Học sinh', '7.9', 'Khá', '95', 'Tốt', 'Hoàng Bích Ngân', '0944556677', 'bichngan@vnanet.vn', '102 Phan Đình Phùng, Ba Đình, Hà Nội', 'Hen nhẹ, hạn chế chạy bền'],
    ['HS25-10A8-07', 'Bùi Tuấn Kiệt', 'Nam', '08/12/2010', '4', 'Lớp phó Lao động', '7.4', 'Khá', '90', 'Tốt', 'Bùi Quốc Tuấn', '0966778899', 'tuankiet.dad@gmail.com', '29 Âu Cơ, Tây Hồ, Hà Nội', 'Thể lực tốt, trách nhiệm'],
    ['HS25-10A8-08', 'Lâm Gia Hân', 'Nữ', '18/06/2010', '4', 'Học sinh', '8.6', 'Giỏi', '94', 'Tốt', 'Nguyễn Diệu Linh', '0988123456', 'dieulinh.nguyen@bank.com.vn', '52 Nguyễn Trường Tộ, Ba Đình, Hà Nội', 'HSG Hóa học Olympic'],
    ['HS25-10A8-09', 'Đỗ Quang Hải', 'Nam', '14/02/2010', '1', 'Học sinh', '8.4', 'Giỏi', '95', 'Tốt', 'Đỗ Quang Vinh', '0912112233', 'vinhdq@fpt.com.vn', '78 Kim Mã, Ba Đình, Hà Nội', 'Đội tuyển Tin học trẻ'],
    ['HS25-10A8-10', 'Ngô Thùy Trang', 'Nữ', '09/08/2010', '2', 'Học sinh', '8.7', 'Giỏi', '97', 'Tốt', 'Ngô Văn Thành', '0983223344', 'thanhnv@vietcombank.com.vn', '110 Giảng Võ, Ba Đình, Hà Nội', 'Múa dân gian, năng nổ'],
    ['HS25-10A8-11', 'Hoàng Minh Quân', 'Nam', '25/10/2010', '3', 'Học sinh', '7.8', 'Khá', '88', 'Khá', 'Hoàng Văn Sơn', '0977334455', 'sonhv@hanoimilk.vn', '42 Đốc Ngữ, Ba Đình, Hà Nội', 'Bóng rổ, thể lực tốt'],
    ['HS25-10A8-12', 'Phan Khánh Linh', 'Nữ', '03/05/2010', '4', 'Học sinh', '9.1', 'Xuất sắc', '99', 'Tốt', 'Phan Văn Dũng', '0904445566', 'dungpv@hnue.edu.vn', '19 Nguyễn Chí Thanh, Ba Đình, Hà Nội', 'Học lực xuất sắc toàn diện'],
  ];

  return [headers.join(','), ...sampleRows.map((r) => r.map((val) => `"${val}"`).join(','))].join('\n');
}

// Service API Object
export const GoogleDatabaseService = {
  // Load saved config from LocalStorage
  loadConfig(): GoogleDatabaseConfig {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CONFIG);
      if (saved) {
        return { ...DEFAULT_GOOGLE_DB_CONFIG, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.warn('Cannot load Google DB config from localStorage', e);
    }
    return DEFAULT_GOOGLE_DB_CONFIG;
  },

  // Save config to LocalStorage
  saveConfig(config: GoogleDatabaseConfig): void {
    try {
      localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(config));
    } catch (e) {
      console.warn('Cannot save Google DB config to localStorage', e);
    }
  },

  // Load cached students from LocalStorage
  loadCachedStudents(): Student[] | null {
    try {
      const cached = localStorage.getItem(STORAGE_KEY_STUDENTS_CACHE);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Cannot load cached students from localStorage', e);
    }
    return null;
  },

  // Save students to LocalStorage Cache
  saveCachedStudents(students: Student[]): void {
    try {
      localStorage.setItem(STORAGE_KEY_STUDENTS_CACHE, JSON.stringify(students));
    } catch (e) {
      console.warn('Cannot save cached students to localStorage', e);
    }
  },

  // Clear Cache
  clearCache(): void {
    try {
      localStorage.removeItem(STORAGE_KEY_STUDENTS_CACHE);
    } catch (e) {
      console.warn('Cannot clear cache', e);
    }
  },

  // Fetch Students from Google Sheets / Apps Script Web App / Public Link
  async fetchStudentsFromGoogle(config: GoogleDatabaseConfig): Promise<{ success: boolean; students: Student[]; message: string }> {
    try {
      // 1. Google Apps Script Web App
      if (config.connectionType === 'apps_script' && config.appsScriptUrl) {
        const response = await fetch(config.appsScriptUrl, {
          method: 'GET',
          headers: { Accept: 'application/json' },
        });

        if (!response.ok) {
          throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        if (data && data.status === 'success' && Array.isArray(data.data)) {
          // Convert array of objects to array of rows
          if (data.data.length > 0) {
            const firstItem = data.data[0];
            const headers = Object.keys(firstItem);
            const rows = [headers, ...data.data.map((item: any) => headers.map((h) => String(item[h] ?? '')))];
            const students = mapCsvRowsToStudents(rows);
            return {
              success: true,
              students,
              message: `Đã kết nối và đồng bộ thành công ${students.length} học sinh từ Google Apps Script Web App!`,
            };
          }
        }
        throw new Error('Dữ liệu trả về từ Apps Script không đúng cấu trúc');
      }

      // 2. Google Sheets CSV Link or Standard Sheet URL
      const { csvUrl, sheetId } = parseGoogleSheetUrl(config.sheetUrl);

      // If user is testing with default or demo URL without external network
      if (config.sheetUrl.includes('DemoSheet') || !csvUrl) {
        // Return rich sample 10A8 database immediately
        const sampleCsv = generateSample10A8Csv();
        const parsedRows = parseCSV(sampleCsv);
        const sampleStudents = mapCsvRowsToStudents(parsedRows);
        return {
          success: true,
          students: sampleStudents,
          message: `Đã kết nối Database Mẫu Google Sheets Lớp 10A8 (${sampleStudents.length} học sinh)!`,
        };
      }

      const response = await fetch(csvUrl, {
        method: 'GET',
        headers: { 'Accept': 'text/csv, text/plain, */*' },
      });

      if (!response.ok) {
        throw new Error(
          `Không thể tải dữ liệu từ Google Sheets (Mã lỗi ${response.status}). Vui lòng đảm bảo Google Sheet đã được cài đặt quyền 'Bất kỳ ai có liên kết đều có thể xem' (Anyone with link can view).`
        );
      }

      const csvContent = await response.text();
      if (!csvContent || csvContent.trim().length === 0) {
        throw new Error('Google Sheet rỗng hoặc không có dữ liệu.');
      }

      const rows = parseCSV(csvContent);
      if (rows.length < 2) {
        throw new Error('Google Sheet phải có ít nhất 1 dòng tiêu đề và 1 dòng dữ liệu học sinh.');
      }

      const students = mapCsvRowsToStudents(rows);
      if (students.length === 0) {
        throw new Error('Không thể nhận diện các cột dữ liệu học sinh trong Google Sheet. Hãy kiểm tra tiêu đề các cột.');
      }

      return {
        success: true,
        students,
        message: `Đã đồng bộ thành công ${students.length} học sinh từ Google Sheets (Sheet ID: ${sheetId.slice(0, 8)}...)!`,
      };
    } catch (err: any) {
      console.error('Google Database Fetch Error:', err);
      // If network fetch fails, provide intelligent fallback advice
      return {
        success: false,
        students: [],
        message: err.message || 'Lỗi khi kết nối tới cơ sở dữ liệu Google Sheets.',
      };
    }
  },

  // Push / Sync Students back to Google Sheets (Via Apps Script)
  async pushStudentsToGoogle(config: GoogleDatabaseConfig, students: Student[]): Promise<{ success: boolean; message: string }> {
    if (config.connectionType !== 'apps_script' || !config.appsScriptUrl) {
      return {
        success: false,
        message: 'Để cập nhật 2 chiều vào Google Sheets, vui lòng chọn phương thức kết nối Google Apps Script Web App.',
      };
    }

    try {
      const response = await fetch(config.appsScriptUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'syncStudents',
          students,
        }),
      });

      const data = await response.json();
      if (data && data.status === 'success') {
        return {
          success: true,
          message: data.message || `Đã đẩy thành công ${students.length} học sinh lên Google Sheet!`,
        };
      }
      throw new Error(data.message || 'Lỗi từ Google Apps Script Web App');
    } catch (err: any) {
      return {
        success: false,
        message: err.message || 'Lỗi khi gửi dữ liệu lên Google Sheets.',
      };
    }
  },
};
