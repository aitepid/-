import React from 'react';
import { SystemTab } from '../types/os';
import { 
  Globe, 
  Cpu, 
  Terminal, 
  ShieldCheck, 
  HardDrive, 
  Code2, 
  Zap, 
  Flame, 
  PlusCircle, 
  Radio, 
  Activity,
  Layers,
  Bot
} from 'lucide-react';

interface NavbarProps {
  activeTab: SystemTab;
  setActiveTab: (tab: SystemTab) => void;
  nodesCount: number;
  totalTflops: number;
  hilbertRatio: number;
  deploymentMode: 'baremetal' | 'hypervisor';
  setDeploymentMode: (mode: 'baremetal' | 'hypervisor') => void;
  onOpenHotPlugModal: () => void;
  onOpenHermesModal: () => void;
  toggleLogDrawer: () => void;
  isLogOpen: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  nodesCount,
  totalTflops,
  hilbertRatio,
  deploymentMode,
  setDeploymentMode,
  onOpenHotPlugModal,
  onOpenHermesModal,
  toggleLogDrawer,
  isLogOpen
}) => {
  const navTabs: { id: SystemTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'cluster', label: '全球算力拓扑', icon: Globe },
    { id: 'hilbert', label: '希尔伯特元算子', icon: Layers },
    { id: 'kernel', label: '机器码与 AI 调度', icon: Terminal },
    { id: 'shell', label: 'Shell 控制台', icon: Terminal },
    { id: 'security', label: '去中心化加密', icon: ShieldCheck },
    { id: 'deploy', label: '裸机与 VM 部署', icon: HardDrive },
    { id: 'api', label: 'HPC 开发者 API', icon: Code2 },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-cyan-900/40 px-3 py-2.5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* Left Branding */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('cluster')}>
            <div className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-900 p-0.5 shadow-lg shadow-cyan-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[7px] flex items-center justify-center">
                <svg className="w-6 h-6 text-cyan-400 animate-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  {/* Hilbert Curve Fractal Micro-SVG Path */}
                  <path d="M4 4h4v4H4zM4 12h4v4H4zM12 12h4v-4h-4zM12 20h4v-4h-4zM20 20v-4h-4z" />
                  <path strokeLinecap="round" d="M8 6h4v10H8m8-6h4v8" />
                </svg>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-wider bg-gradient-to-r from-cyan-400 via-blue-300 to-indigo-200 bg-clip-text text-transparent">
                  HILBERT OS
                </span>
                <span className="text-[10px] px-1.5 py-0.5 font-mono rounded bg-cyan-950/80 text-cyan-300 border border-cyan-700/50">
                  v4.8-NATIVE
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono flex items-center gap-1.5">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                元算子分布式机器码内核
              </p>
            </div>
          </div>

          {/* Quick Action Badges for Mobile */}
          <div className="flex md:hidden items-center gap-1.5">
            <button
              onClick={onOpenHotPlugModal}
              className="px-2 py-1 bg-cyan-900/40 hover:bg-cyan-800/60 border border-cyan-500/40 text-cyan-300 rounded text-xs flex items-center gap-1 font-mono"
            >
              <PlusCircle className="w-3.5 h-3.5 text-cyan-400" />
              热插拔
            </button>
          </div>
        </div>

        {/* Center Live Telemetry Ticker */}
        <div className="hidden lg:flex items-center gap-4 py-1 px-3 bg-slate-900/80 border border-slate-800/80 rounded-lg text-xs font-mono text-slate-300">
          <div className="flex items-center gap-1.5" title="全球活跃节点数">
            <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span className="text-slate-400">节点:</span>
            <span className="text-cyan-300 font-bold">{nodesCount.toLocaleString()}</span>
          </div>

          <div className="h-3 w-px bg-slate-800" />

          <div className="flex items-center gap-1.5" title="全网总可用算力">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-slate-400">集群算力:</span>
            <span className="text-amber-300 font-bold">{totalTflops.toLocaleString()} TFLOPS</span>
          </div>

          <div className="h-3 w-px bg-slate-800" />

          <div className="flex items-center gap-1.5" title="希尔伯特排列空间数据压缩率">
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-slate-400">希尔伯特数据压缩:</span>
            <span className="text-indigo-300 font-bold">{hilbertRatio.toFixed(1)}%</span>
          </div>

          <div className="h-3 w-px bg-slate-800" />

          <div className="flex items-center gap-1.5" title="去中心化零知识证明加密">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-slate-400">ZK验证:</span>
            <span className="text-emerald-400 font-bold">100% 完整</span>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2 justify-end">
          {/* Hermes Agent Trigger Button */}
          <button
            onClick={onOpenHermesModal}
            className="px-3 py-1.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-slate-100 font-bold text-xs font-mono rounded-lg shadow-lg shadow-indigo-600/30 border border-indigo-400/40 flex items-center gap-1.5 transition-all hover:scale-105 cursor-pointer animate-pulse"
          >
            <Bot className="w-4 h-4 text-cyan-300" />
            <span>🤖 Hermes Agent 对话</span>
          </button>

          {/* Mode Switcher */}
          <div className="flex items-center bg-slate-900 p-0.5 rounded-lg border border-slate-800 text-xs font-mono">
            <button
              onClick={() => setDeploymentMode('baremetal')}
              className={`px-2 py-1 rounded transition-colors ${
                deploymentMode === 'baremetal'
                  ? 'bg-cyan-600 text-white font-semibold shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              裸机
            </button>
            <button
              onClick={() => setDeploymentMode('hypervisor')}
              className={`px-2 py-1 rounded transition-colors ${
                deploymentMode === 'hypervisor'
                  ? 'bg-indigo-600 text-white font-semibold shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              VM 虚拟机
            </button>
          </div>

          {/* Hot-Plug Hardware */}
          <button
            onClick={onOpenHotPlugModal}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-medium font-mono rounded-lg shadow-lg shadow-cyan-600/20 border border-cyan-400/30 transition-all hover:scale-105"
          >
            <PlusCircle className="w-4 h-4" />
            热插拔硬件
          </button>

          {/* Kernel Log Toggle */}
          <button
            onClick={toggleLogDrawer}
            className={`px-2.5 py-1.5 rounded-lg border text-xs font-mono flex items-center gap-1.5 transition-colors ${
              isLogOpen 
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50' 
                : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">内核日志</span>
          </button>
        </div>
      </div>

      {/* Main Tab Bar */}
      <div className="max-w-7xl mx-auto mt-2 pt-2 border-t border-slate-800/80 flex items-center gap-1 overflow-x-auto no-scrollbar">
        {navTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-500/10'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
              {tab.label}
            </button>
          );
        })}
      </div>
    </header>
  );
};
