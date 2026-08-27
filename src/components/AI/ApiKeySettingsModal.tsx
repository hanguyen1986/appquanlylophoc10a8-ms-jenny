import React, { useState, useEffect } from 'react';
import { 
  X, 
  Key, 
  Sparkles, 
  ExternalLink, 
  Check, 
  AlertTriangle, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  RefreshCw, 
  CheckCircle2,
  Zap,
  Bot,
  SlidersHorizontal,
  Info
} from 'lucide-react';
import { 
  GeminiService, 
  AI_MODELS, 
  FALLBACK_MODEL_CHAIN 
} from '../../services/geminiService';

interface ApiKeySettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApiKeySaved?: (apiKey: string) => void;
}

export const ApiKeySettingsModal: React.FC<ApiKeySettingsModalProps> = ({
  isOpen,
  onClose,
  onApiKeySaved,
}) => {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [selectedModel, setSelectedModel] = useState('gemini-3-flash-preview');
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [testMessage, setTestMessage] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setApiKey(GeminiService.getApiKey());
      setSelectedModel(GeminiService.getSelectedModel());
      setTestStatus('idle');
      setTestMessage('');
      setSavedSuccess(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTestKey = async () => {
    if (!apiKey.trim()) {
      setTestStatus('error');
      setTestMessage('Vui lòng nhập API key trước khi kiểm tra.');
      return;
    }

    setTestStatus('testing');
    setTestMessage('Đang kiểm tra kết nối với Google Gemini API...');

    const res = await GeminiService.testApiKey(apiKey.trim());
    if (res.success) {
      setTestStatus('success');
      setTestMessage(res.message);
    } else {
      setTestStatus('error');
      setTestMessage(res.message);
    }
  };

  const handleSave = () => {
    GeminiService.setApiKey(apiKey.trim());
    GeminiService.setSelectedModel(selectedModel);
    setSavedSuccess(true);
    if (onApiKeySaved) {
      onApiKeySaved(apiKey.trim());
    }
    setTimeout(() => {
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden text-slate-800 text-xs">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-md shadow-emerald-900/40">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  Thiết Lập Model & Gemini API Key
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  AI Trợ Lý Chủ Nhiệm
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Nhập API Key cá nhân để sử dụng tính năng sinh nhận xét học bạ và trợ lý thông minh
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-5">
          {/* Instructions Box with Red CTA as specified in AI_INSTRUCTIONS */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-50 to-amber-50 border border-rose-200 text-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-rose-700 text-sm">
                <Sparkles className="w-4 h-4 text-rose-600 animate-pulse" />
                <span>Lấy Gemini API Key Miễn Phí (Google AI Studio)</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-rose-600 text-white">
                Bắt buộc để dùng AI
              </span>
            </div>
            <p className="text-slate-700 leading-relaxed text-[11px]">
              Để kích hoạt toàn bộ tính năng Trợ lý AI (Sinh nhận xét học bạ chuẩn TT22, Soạn thông báo phụ huynh, Viết báo cáo tổng kết), bạn chỉ cần truy cập Google AI Studio để lấy API Key miễn phí:
            </p>
            <div className="pt-1">
              <a
                href="https://aistudio.google.com/api-keys"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-sm transition-all"
              >
                <span>Nhấn vào đây để lấy API Key tại Google AI Studio</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Model Selection (Cards layout specified in AI_INSTRUCTIONS) */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                <Bot className="w-4 h-4 text-emerald-600" />
                <span>Chọn Mô Hình AI Ưu Tiên (Model Selection)</span>
              </label>
              <span className="text-[11px] text-slate-500 font-medium">
                Tự động Fallback chuyển model nếu lỗi
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {AI_MODELS.map((m) => {
                const isSelected = selectedModel === m.id;
                return (
                  <div
                    key={m.id}
                    onClick={() => setSelectedModel(m.id)}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'bg-emerald-50/80 border-emerald-500 ring-2 ring-emerald-500 shadow-xs'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-1.5">
                        <span className={`font-bold text-xs ${isSelected ? 'text-emerald-900' : 'text-slate-900'}`}>
                          {m.name}
                        </span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                      </div>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold inline-block mb-1.5 ${
                        m.isDefault ? 'bg-emerald-200 text-emerald-900' : 'bg-slate-200 text-slate-700'
                      }`}>
                        {m.badge}
                      </span>
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        {m.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Fallback explanation */}
            <div className="p-2.5 rounded-xl bg-slate-100 border border-slate-200 text-[11px] text-slate-600 flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span>
                <strong>Cơ chế tự phục hồi (Fallback):</strong> Khi model gặp lỗi 429 hoặc quá tải, hệ thống sẽ tự động thử lần lượt theo chuỗi: <code className="bg-white px-1 py-0.2 rounded border font-mono text-[10px]">gemini-3-flash-preview</code> → <code className="bg-white px-1 py-0.2 rounded border font-mono text-[10px]">gemini-3-pro-preview</code> → <code className="bg-white px-1 py-0.2 rounded border font-mono text-[10px]">gemini-2.5-flash</code>.
              </span>
            </div>
          </div>

          {/* API Key Input */}
          <div className="space-y-2">
            <label className="font-bold text-slate-900 text-xs block">
              Google Gemini API Key của bạn *
            </label>
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                placeholder="AIzaSy..."
                value={apiKey}
                onChange={(e) => {
                  setApiKey(e.target.value);
                  setTestStatus('idle');
                }}
                className="w-full px-3.5 py-2.5 pr-20 rounded-xl border border-slate-300 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 text-xs font-mono bg-slate-50 focus:bg-white transition-all"
              />
              <div className="absolute right-2 top-2 flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="p-1 rounded text-slate-400 hover:text-slate-700"
                  title={showKey ? 'Ẩn API Key' : 'Hiện API Key'}
                >
                  {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500">
              <span>Key được lưu an toàn trong trình duyệt (localStorage) của bạn.</span>
              {apiKey && (
                <button
                  type="button"
                  onClick={() => setApiKey('')}
                  className="text-rose-600 hover:underline font-semibold"
                >
                  Xóa Key
                </button>
              )}
            </div>
          </div>

          {/* Test Status Banner */}
          {testStatus !== 'idle' && (
            <div
              className={`p-3 rounded-xl border flex items-start gap-2.5 ${
                testStatus === 'testing'
                  ? 'bg-sky-50 border-sky-200 text-sky-800'
                  : testStatus === 'success'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800 font-semibold'
                  : 'bg-rose-50 border-rose-200 text-rose-800 font-medium'
              }`}
            >
              {testStatus === 'testing' && <RefreshCw className="w-4 h-4 text-sky-600 animate-spin shrink-0 mt-0.5" />}
              {testStatus === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />}
              {testStatus === 'error' && <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />}
              <span className="leading-relaxed">{testMessage}</span>
            </div>
          )}

          {savedSuccess && (
            <div className="p-3 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-900 font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Đã lưu thiết lập API Key thành công!</span>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={handleTestKey}
            disabled={testStatus === 'testing'}
            className="px-3.5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${testStatus === 'testing' ? 'animate-spin' : ''}`} />
            <span>Kiểm tra kết nối</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-100 font-semibold text-slate-700 cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-bold text-white shadow-sm flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Lưu Thiết Lập</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
