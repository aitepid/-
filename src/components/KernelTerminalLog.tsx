import React from 'react';
import { KernelLogEntry } from '../types/os';
import { Terminal, X, Trash2 } from 'lucide-react';

interface KernelTerminalLogProps {
  isOpen: boolean;
  onClose: () => void;
  logs: KernelLogEntry[];
  onClearLogs: () => void;
}

export const KernelTerminalLog: React.FC<KernelTerminalLogProps> = ({
  isOpen,
  onClose,
  logs,
  onClearLogs
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-slate-950/95 border-t border-cyan-500/50 p-3 shadow-2xl font-mono text-xs max-h-[260px] flex flex-col backdrop-blur-md">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-cyan-400" />
          <span className="font-bold text-cyan-300">
            HilbertOS 微码内核日志与系统调用追踪 (Syscall Log)
          </span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onClearLogs}
            className="text-slate-400 hover:text-slate-200 flex items-center gap-1 text-[11px]"
          >
            <Trash2 className="w-3.5 h-3.5" />
            清空
          </button>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-1 pr-1 font-mono text-[11px] leading-tight">
        {logs.map((log) => (
          <div key={log.id} className="flex items-start gap-2">
            <span className="text-slate-500 select-none">[{log.timestamp}]</span>
            <span className={`font-bold ${
              log.level === 'KERNEL_WARN' ? 'text-amber-400' :
              log.level === 'DISPATCH' ? 'text-cyan-400' :
              log.level === 'ZKP_PROOF' ? 'text-emerald-400' :
              log.level === 'HOT_PLUG' ? 'text-pink-400' :
              'text-slate-400'
            }`}>
              [{log.subsystem}]
            </span>
            <span className="text-slate-200">{log.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
