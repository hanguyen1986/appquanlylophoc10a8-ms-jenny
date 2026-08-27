import React from 'react';
import { Database, RefreshCw, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { GoogleDatabaseConfig } from '../../services/googleDatabaseService';

interface DatabaseStatusBadgeProps {
  config: GoogleDatabaseConfig;
  isSyncing: boolean;
  studentCount: number;
  onOpenModal: () => void;
  onQuickSync: () => void;
}

export const DatabaseStatusBadge: React.FC<DatabaseStatusBadgeProps> = ({
  config,
  isSyncing,
  studentCount,
  onOpenModal,
  onQuickSync,
}) => {
  return (
    <div className="flex items-center gap-1.5 bg-slate-800/90 border border-slate-700/80 hover:border-emerald-500/70 p-1 pl-2 rounded-xl text-xs transition-all shadow-xs group">
      <div 
        onClick={onOpenModal} 
        className="flex items-center gap-1.5 cursor-pointer select-none"
        title="Quản lý kết nối Google Sheets Database"
      >
        <div className="relative">
          <Database className={`w-3.5 h-3.5 ${config.isConnected ? 'text-emerald-400' : 'text-amber-400'}`} />
          <span 
            className={`absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full ${
              config.isConnected ? 'bg-emerald-400 ring-1 ring-slate-900 animate-pulse' : 'bg-amber-400'
            }`} 
          />
        </div>

        <div className="flex flex-col text-left">
          <div className="flex items-center gap-1">
            <span className="font-bold text-[11px] text-slate-200 group-hover:text-emerald-300 transition-colors">
              Google Database
            </span>
            <span
              className={`text-[9px] px-1 py-0.2 rounded font-semibold ${
                config.isConnected
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/60'
                  : 'bg-amber-950 text-amber-300 border border-amber-800/60'
              }`}
            >
              {config.isConnected ? 'Online' : 'Mẫu 10A8'}
            </span>
          </div>

          <span className="text-[10px] text-slate-400 truncate max-w-[130px]">
            {isSyncing ? 'Đang đồng bộ...' : config.lastSyncTime ? `Đã đồng bộ • ${studentCount} HS` : `${studentCount} HS 10A8`}
          </span>
        </div>
      </div>

      {/* Quick Sync Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onQuickSync();
        }}
        disabled={isSyncing}
        title="Đồng bộ ngay từ Google Database"
        className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-emerald-400 transition-colors disabled:opacity-50 cursor-pointer"
      >
        <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-emerald-400' : ''}`} />
      </button>
    </div>
  );
};
