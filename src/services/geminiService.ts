import { Student } from '../types';

export interface AIModelOption {
  id: string;
  name: string;
  badge: string;
  desc: string;
  isDefault?: boolean;
}

export const AI_MODELS: AIModelOption[] = [
  {
    id: 'gemini-3-flash-preview',
    name: 'Gemini 3 Flash Preview',
    badge: 'Mặc định (Default)',
    desc: 'Tốc độ phản hồi cực nhanh, tối ưu cho xử lý dữ liệu học sinh và nhận xét số lượng lớn.',
    isDefault: true,
  },
  {
    id: 'gemini-3-pro-preview',
    name: 'Gemini 3 Pro Preview',
    badge: 'Mạnh mẽ nhất',
    desc: 'Mô hình tư duy sâu và lập luận phức tạp, tối ưu cho tổng hợp báo cáo sư phạm đa chiều.',
  },
  {
    id: 'gemini-2.5-flash',
    name: 'Gemini 2.5 Flash',
    badge: 'Dự phòng ổn định',
    desc: 'Mô hình dự phòng tốc độ cao với độ tin cậy và hạn ngạch quota ổn định.',
  },
];

// Fallback Chain Order
export const FALLBACK_MODEL_CHAIN = [
  'gemini-3-flash-preview',
  'gemini-3-pro-preview',
  'gemini-2.5-flash',
];

const STORAGE_KEY_API_KEY = 'gemini_api_key';
const STORAGE_KEY_SELECTED_MODEL = 'gemini_selected_model';

export interface GenerateResult {
  success: boolean;
  text: string;
  usedModel: string;
  error?: string;
  fallbackCount?: number;
}

export const GeminiService = {
  // Get API key with priority: localStorage -> process.env
  getApiKey(): string {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_API_KEY);
      if (stored && stored.trim().length > 0) {
        return stored.trim();
      }
    } catch (e) {
      console.warn('Cannot read from localStorage', e);
    }
    // Fallback to env if available
    try {
      const envKey = (import.meta as any).env?.VITE_GEMINI_API_KEY || (process as any)?.env?.GEMINI_API_KEY;
      if (envKey && typeof envKey === 'string' && envKey.trim().length > 0) {
        return envKey.trim();
      }
    } catch (e) {
      // ignore
    }
    return '';
  },

  // Save API key to localStorage
  setApiKey(key: string): void {
    try {
      if (key && key.trim().length > 0) {
        localStorage.setItem(STORAGE_KEY_API_KEY, key.trim());
      } else {
        localStorage.removeItem(STORAGE_KEY_API_KEY);
      }
    } catch (e) {
      console.warn('Cannot save API key to localStorage', e);
    }
  },

  // Check if API key exists
  hasApiKey(): boolean {
    const key = this.getApiKey();
    return Boolean(key && key.length > 5);
  },

  // Get selected model
  getSelectedModel(): string {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_SELECTED_MODEL);
      if (stored && FALLBACK_MODEL_CHAIN.includes(stored)) {
        return stored;
      }
    } catch (e) {
      // ignore
    }
    return 'gemini-3-flash-preview';
  },

  // Save selected model
  setSelectedModel(modelId: string): void {
    try {
      localStorage.setItem(STORAGE_KEY_SELECTED_MODEL, modelId);
    } catch (e) {
      // ignore
    }
  },

  // Low-level API call to Google Gemini REST endpoint
  async callGeminiApi(model: string, apiKey: string, prompt: string, systemInstruction?: string): Promise<string> {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const body: any = {
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2048,
      },
    };

    if (systemInstruction) {
      body.systemInstruction = {
        parts: [{ text: systemInstruction }],
      };
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      let errorDetail = `${response.status} ${response.statusText}`;
      try {
        const errorJson = await response.json();
        if (errorJson.error?.message) {
          errorDetail = `${response.status} ${errorJson.error.message}`;
        } else if (errorJson.error?.status) {
          errorDetail = `${response.status} ${errorJson.error.status}`;
        }
      } catch (e) {
        // ignore json parse error
      }
      throw new Error(errorDetail);
    }

    const data = await response.json();
    const candidate = data.candidates?.[0];
    if (!candidate) {
      throw new Error('API không trả về kết quả nội dung (Empty Candidate)');
    }

    const text = candidate.content?.parts?.map((p: any) => p.text).join('') || '';
    return text.trim();
  },

  // Test API Key
  async testApiKey(apiKey: string): Promise<{ success: boolean; message: string; modelTested: string }> {
    if (!apiKey || apiKey.trim().length === 0) {
      return { success: false, message: 'Vui lòng nhập API Key', modelTested: '' };
    }

    const testModel = 'gemini-3-flash-preview';
    try {
      const result = await this.callGeminiApi(testModel, apiKey.trim(), 'Xin chào, hãy trả lời "API Key hợp lệ"');
      return {
        success: true,
        message: 'Kết nối thành công! API Key hoạt động hoàn hảo với ' + testModel,
        modelTested: testModel,
      };
    } catch (err: any) {
      return {
        success: false,
        message: err.message || 'API Key không hợp lệ hoặc đã hết hạn mức (Quota)',
        modelTested: testModel,
      };
    }
  },

  // Generate content with Auto-Fallback & Multi-Model Retry Mechanism
  async generateWithFallback(prompt: string, systemInstruction?: string): Promise<GenerateResult> {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      return {
        success: false,
        text: '',
        usedModel: '',
        error: 'Chưa cấu hình API Key. Vui lòng nhấn nút "Lấy API key để sử dụng app" trên Header để nhập key.',
      };
    }

    const primaryModel = this.getSelectedModel();
    // Build ordered list of models to try, starting with the chosen model
    const modelsToTry = [
      primaryModel,
      ...FALLBACK_MODEL_CHAIN.filter((m) => m !== primaryModel),
    ];

    let lastError = '';
    let fallbackCount = 0;

    for (let i = 0; i < modelsToTry.length; i++) {
      const currentModel = modelsToTry[i];
      try {
        const text = await this.callGeminiApi(currentModel, apiKey, prompt, systemInstruction);
        return {
          success: true,
          text,
          usedModel: currentModel,
          fallbackCount: i,
        };
      } catch (err: any) {
        lastError = err.message || 'Unknown API error';
        fallbackCount++;
        console.warn(`Model ${currentModel} failed with error: ${lastError}. Trying next fallback model...`);
      }
    }

    // All models in fallback chain failed
    return {
      success: false,
      text: '',
      usedModel: modelsToTry[modelsToTry.length - 1],
      error: `Tất cả các mô hình AI đều thất bại: ${lastError}`,
      fallbackCount,
    };
  },

  // 1. Sinh nhận xét học bạ cá nhân hóa theo Thông tư 22/2021/TT-BGDĐT
  async generateStudentComment(student: Student): Promise<GenerateResult> {
    const systemPrompt = `Bạn là trợ lý AI chuyên môn sư phạm cho cô giáo chủ nhiệm Ms Jenny (Lớp 10A8 - Trường THPT Chu Văn An). 
Nhiệm vụ của bạn là viết lời nhận xét đánh giá kết quả rèn luyện và học tập của học sinh trong học kỳ I theo đúng quy định Thông tư 22/2021/TT-BGDĐT của Bộ Giáo dục & Đào tạo.

Yêu cầu nhận xét:
- Độ dài: 2 - 3 câu súc tích, mang tính giáo dục, khích lệ và định hướng phát triển.
- Nêu bật điểm mạnh về năng lực học tập, ý thức nề nếp thi đua, và lưu ý rèn luyện thêm (nếu có).
- Giọng văn chân thành, chuẩn mực sư phạm Việt Nam.
- Chỉ trả về nội dung nhận xét thuần túy, không thêm dấu ngoặc kép thừa hoặc phần giải thích.`;

    const userPrompt = `Hãy viết nhận xét học bạ học kỳ I cho học sinh sau:
- Họ và tên: ${student.name}
- Giới tính: ${student.gender}
- Chức vụ trong lớp: ${student.roleInClass} (Tổ ${student.group})
- Điểm trung bình học kỳ (ĐTB): ${student.overallGpa}
- Xếp loại học lực: ${student.academicRank}
- Điểm nề nếp rèn luyện: ${student.conductScore}/100 điểm (Xếp loại hạnh kiểm: ${student.conductRank})
- Nét tính cách & Năng khiếu: ${student.psychology?.personality?.join(', ') || 'Ngoan ngoãn'}; Năng khiếu: ${student.psychology?.aptitudes?.join(', ') || 'Không'}
- Ghi chú quan sát của GVCN: ${student.psychology?.teacherObservations || 'Chấp hành tốt nội quy lớp 10A8'}`;

    return this.generateWithFallback(userPrompt, systemPrompt);
  },

  // 2. AI Soạn thảo Thông báo / Tin nhắn gửi Phụ huynh
  async generateParentMessage(params: {
    type: 'broadcast' | 'individual';
    topic: string;
    studentName?: string;
    keyNotes?: string;
    channel: 'App' | 'SMS' | 'Zalo';
  }): Promise<GenerateResult> {
    const systemPrompt = `Bạn là trợ lý ảo soạn thảo tin nhắn cho cô giáo chủ nhiệm Ms Jenny - Lớp 10A8. 
Hãy viết thông điệp ngắn gọn, lịch thiệp, tôn trọng gửi tới Quý Phụ huynh học sinh.
Phù hợp với kênh gửi: ${params.channel} (nếu là SMS thì ngắn gọn, nếu App/Zalo thì đầy đủ thông điệp).
Luôn có lời chào mở đầu và ký tên cuối: "Cô Jenny - GVCN Lớp 10A8".`;

    const userPrompt = `Hãy soạn tin nhắn gửi phụ huynh với thông tin sau:
- Loại tin nhắn: ${params.type === 'broadcast' ? 'Gửi toàn thể phụ huynh lớp 10A8' : `Gửi riêng phụ huynh em ${params.studentName}`}
- Chủ đề: ${params.topic}
- Nội dung / Lưu ý quan trọng cần truyền tải: ${params.keyNotes || 'Thông báo chung từ nhà trường và GVCN'}
- Kênh phát tin: ${params.channel}`;

    return this.generateWithFallback(userPrompt, systemPrompt);
  },

  // 3. AI Sinh đánh giá tổng quan tình hình lớp 10A8 cho Báo cáo BGH
  async generateClassSummaryReport(summaryData: {
    totalStudents: number;
    attendanceRate: number;
    excellentCount: number;
    goodCount: number;
    averageCount: number;
    period: string;
    topViolations: string;
    topCommendations: string;
  }): Promise<GenerateResult> {
    const systemPrompt = `Bạn là trợ lý tổng hợp báo cáo sư phạm cho GVCN Ms Jenny - Lớp 10A8.
Hãy viết phần "III. Đánh giá chung của Giáo viên Chủ nhiệm" trong bản Báo cáo Sơ kết gửi Ban Giám Hiệu.
Văn phong hành chính chuẩn mực giáo dục, mạch lạc, nêu rõ ưu điểm về nề nếp thi đua, học lực và biện pháp giáo dục trong thời gian tới.`;

    const userPrompt = `Tổng hợp số liệu lớp 10A8 trong ${summaryData.period}:
- Sĩ số: ${summaryData.totalStudents} học sinh
- Tỷ lệ chuyên cần: ${summaryData.attendanceRate}%
- Phân loại học lực: ${summaryData.excellentCount} Xuất sắc, ${summaryData.goodCount} Giỏi, ${summaryData.averageCount} Trung bình
- Khen thưởng nổi bật: ${summaryData.topCommendations}
- Vi phạm cần chấn chỉnh: ${summaryData.topViolations}
Hãy viết đoạn đánh giá tổng quan ngắn gọn (khoảng 3 - 5 câu) cho GVCN.`;

    return this.generateWithFallback(userPrompt, systemPrompt);
  },
};
