import React, { useState } from 'react';
import { RegisterState, DispatchResult } from '../types/os';
import { 
  Terminal, 
  Cpu, 
  Zap, 
  Sparkles, 
  Code2, 
  Layers, 
  CheckCircle2, 
  Loader2, 
  Play, 
  Copy, 
  Check, 
  Clock, 
  Flame, 
  ShieldCheck,
  Server
} from 'lucide-react';

export const MachineCodeKernel: React.FC = () => {
  const [workloadName, setWorkloadName] = useState<string>('蛋白质折叠 3D 构象分子动力学模拟');
  const [description, setDescription] = useState<string>('对 1,000,000 个残基的蛋白质结构进行飞秒级分子动力学演算，利用希尔伯特空间哈希将原子坐标矩阵切片，分布至全域 1,000+ 节点协同计算。');
  const [targetArch, setTargetArch] = useState<string>('Heterogeneous (x86_64 + ARM64 + RISC-V)');
  const [nodeLimit, setNodeLimit] = useState<number>(256);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  // Simulated Register State
  const [registers, setRegisters] = useState<RegisterState>({
    RAX: '0x00007FFF8B92C000',
    RBX: '0x0000000000000400',
    RCX: '0x0000000000000100',
    RDX: '0x0000000000000088',
    RSI: '0x0000000000001000',
    RDI: '0x00007FFF8B92C400',
    R8:  '0x0000000000000001',
    R9:  '0x0000000000000020',
    R10: '0x0000000000000040',
    ZMM0: '0xFF12A4B8_88C123F0_00001192_FFFF4420',
    ZMM1: '0x0022C411_11883300_99AABBCC_DDEEFF00',
    PC:   '0x00000000004011B8',
    SP:   '0x00007FFFFFFF0000'
  });

  // Current Dispatch Result
  const [dispatchResult, setDispatchResult] = useState<DispatchResult | null>({
    success: true,
    mode: 'ai-generated',
    workloadName: '蛋白质折叠 3D 构象分子动力学模拟',
    deconstructedOperators: [
      { id: 'H-OP-01', name: '希尔伯特分子三维坐标空间降维编码', complexity: 'O(1)', spatialLocalityScore: 0.98, memorySavingsPct: 88.4 },
      { id: 'H-OP-02', name: 'AVX-512 / NEON 范德华力并行张量向量化', complexity: 'O(N/P)', spatialLocalityScore: 0.96, memorySavingsPct: 85.2 },
      { id: 'H-OP-03', name: '去中心化零知识状态校验与节点归并', complexity: 'O(log N)', spatialLocalityScore: 0.99, memorySavingsPct: 91.0 }
    ],
    machineCodeSnippet: `; HilbertOS 裸机汇编内核 & 希尔伯特元算子调度例程
section .hilbert_kernel
global _start_hilbert_dispatch

_start_hilbert_dispatch:
    mov rdi, qword [rel hilbert_space_ptr] ; 加载希尔伯特空间哈希指针
    vmovdqu32 zmm0, [rdi + rsi*4]           ; SIMD AVX-512 512-bit 向量空间加载
    vpackusdw zmm1, zmm0, zmm0             ; 希尔伯特元算子空间压缩 (节省 88.4% 内存)
    
    ; 触发 low-level Kernel 微码系统调用
    mov eax, 0x42                          ; SYS_HILBERT_MESH_DISPATCH
    mov rbx, 0x0100                        ; Target Node Mesh Cluster Mask
    sys_mesh_dispatch zmm1, rbx, rdx       ; 去中心化无损组播分发
    ret`,
    nodeAllocations: [
      { type: 'x86_64 高性能服务器 (Cloud Baremetal)', nodeCount: 64, allocationRatio: '45%', gflops: 38400 },
      { type: 'ARM64 移动分布网络 (iOS/Android)', nodeCount: 128, allocationRatio: '35%', gflops: 19200 },
      { type: 'RISC-V 边缘计算微核', nodeCount: 64, allocationRatio: '20%', gflops: 8900 }
    ],
    loadBalanceMetrics: {
      estimatedCompletionTimeMs: 124,
      throughputGflops: 66500,
      thermalProtectionMarginPct: 95.8,
      energySavedKWh: 14.2
    },
    reasoning: 'HilbertOS AI 调度内核成功将蛋白质残基三维矩阵拆解为 2D 希尔伯特分形空间碎片。节点通信由 P2P Mesh 无缝接管，寄存器直通避开经典 OS 内存页转换损耗。'
  });

  const presetWorkloads = [
    {
      title: '🧪 蛋白质折叠 3D 分子动力学',
      desc: '对 1,000,000 个残基的蛋白质结构进行飞秒级分子动力学演算，利用希尔伯特空间哈希将原子坐标矩阵切片。',
      arch: 'Heterogeneous (x86_64 + ARM64 + RISC-V)'
    },
    {
      title: '🌍 全球 10B 网格高分辨率气候预测',
      desc: '全球大气与海洋流体力学偏微分方程百亿网格协同计算，极致压缩多维格点缓存。',
      arch: 'x86_64 AVX-512 Cluster'
    },
    {
      title: '🧠 70B 大模型张量切片跨端推理',
      desc: '将 700 亿参数 LLM Transformer 矩阵分片分散投递至手机、PC 与裸机 GPU 混合并行推演。',
      arch: 'Heterogeneous (ARM64 + GPU CUDA)'
    },
    {
      title: '⚛️ 量子蒙特卡洛多体物理矩阵分解',
      desc: '量子多体薛定谔方程波函数高维蒙特卡洛采样，实时校验去中心化计算节点诚信。',
      arch: 'Heterogeneous (x86_64 + RISC-V)'
    }
  ];

  const handleAiDispatch = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/os/ai-dispatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workloadName,
          description,
          targetArchitecture: targetArch,
          nodeLimit
        })
      });

      const data = await response.json();
      if (data.success) {
        setDispatchResult(data);
        // Refresh registers to simulate low level state update
        setRegisters({
          RAX: `0x${Math.floor(Math.random() * 0xFFFFFFFFFFFFFFFF).toString(16).toUpperCase().padStart(16, '0')}`,
          RBX: '0x0000000000000800',
          RCX: '0x0000000000000200',
          RDX: '0x0000000000000120',
          RSI: '0x0000000000002000',
          RDI: '0x00007FFF8B92D000',
          R8:  '0x0000000000000002',
          R9:  '0x0000000000000040',
          R10: '0x0000000000000080',
          ZMM0: '0x' + Array.from({length: 32}, () => Math.floor(Math.random()*16).toString(16)).join('').toUpperCase(),
          ZMM1: '0x' + Array.from({length: 32}, () => Math.floor(Math.random()*16).toString(16)).join('').toUpperCase(),
          PC:   '0x00000000004020C0',
          SP:   '0x00007FFFFFFF0000'
        });
      }
    } catch (err) {
      console.error('Dispatch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const copyCode = () => {
    if (dispatchResult?.machineCodeSnippet) {
      navigator.clipboard.writeText(dispatchResult.machineCodeSnippet);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-bold font-mono text-cyan-300">
              裸机机器码内核与 AI 动态调度引擎 (AI Neural Dispatch Kernel)
            </h2>
          </div>
          <p className="text-xs text-slate-300">
            HilbertOS 以底层低级机器码与硬件寄存器微码为根基，集成 Gemini AI 驱动的动态调度引擎，可自动将复杂科研/HPC 任务解构为希尔伯特元算子并跨全域节点自动负载均衡。
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: AI Task Form & Presets (Col 5) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Preset Buttons */}
          <div className="bg-slate-900 rounded-xl border border-slate-800 p-4 space-y-3 shadow-xl">
            <span className="text-xs font-mono font-bold text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" /> 预设高性能科研计算预置集
            </span>

            <div className="space-y-2">
              {presetWorkloads.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setWorkloadName(item.title.replace(/^[^\s]+\s*/, ''));
                    setDescription(item.desc);
                    setTargetArch(item.arch);
                  }}
                  className="w-full text-left p-2.5 rounded-lg bg-slate-950/80 hover:bg-slate-800/80 border border-slate-800 hover:border-cyan-500/50 transition-all font-mono text-xs space-y-1 group"
                >
                  <div className="font-bold text-cyan-300 group-hover:text-cyan-200">
                    {item.title}
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-2">
                    {item.desc}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Form Controls */}
          <div className="bg-slate-900 rounded-xl border border-slate-800 p-4 space-y-3 shadow-xl font-mono text-xs">
            <div className="space-y-1">
              <label className="text-slate-300 font-bold block">任务名称 (Workload Title)</label>
              <input
                type="text"
                value={workloadName}
                onChange={(e) => setWorkloadName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded p-2 text-slate-200 outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-bold block">任务描述 / 数学算子需求</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded p-2 text-slate-200 outline-none text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-slate-400 block text-[10px]">目标架构 (Target Arch)</label>
                <select
                  value={targetArch}
                  onChange={(e) => setTargetArch(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded p-1.5 outline-none text-xs"
                >
                  <option value="Heterogeneous (x86_64 + ARM64 + RISC-V)">异构全域 (Heterogeneous)</option>
                  <option value="x86_64 AVX-512 Cluster">x86_64 AVX-512 集群</option>
                  <option value="ARM64 NEON/SVE Cluster">ARM64 SVE 移动 PC 节点</option>
                  <option value="RISC-V Vector Extension">RISC-V 矢量计算集群</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block text-[10px]">节点配额上限</label>
                <input
                  type="number"
                  value={nodeLimit}
                  onChange={(e) => setNodeLimit(parseInt(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded p-1.5 outline-none text-xs"
                />
              </div>
            </div>

            <button
              onClick={handleAiDispatch}
              disabled={isLoading}
              className="w-full py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-slate-950 font-extrabold text-xs rounded-lg shadow-lg shadow-cyan-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                  AI 内核正在解构希尔伯特算子...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 fill-slate-950" />
                  启动 AI 内核解构与全域调度
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Registers & AI Dispatch Output (Col 7) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Low-Level Machine Code & Hardware Register Monitor */}
          <div className="bg-slate-950 rounded-xl border border-slate-800 p-4 space-y-3 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-mono font-bold text-slate-200 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-cyan-400" />
                裸机内核硬件寄存器状态 (Bare-Metal SIMD Registers)
              </span>
              <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                零页表转换 (Zero-TLB Miss)
              </span>
            </div>

            {/* Register Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-[11px]">
              {Object.entries(registers).map(([reg, val]) => (
                <div key={reg} className="bg-slate-900 p-2 rounded border border-slate-800">
                  <span className="text-cyan-400 font-bold block text-[10px]">{reg}</span>
                  <span className="text-slate-300 truncate block text-[10px]">{val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* AI Dispatch Output Result */}
          {dispatchResult && (
            <div className="bg-slate-900 rounded-xl border border-cyan-500/40 p-4 space-y-4 shadow-2xl animate-fade-in font-mono text-xs">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="font-bold text-cyan-300 text-sm">
                    {dispatchResult.workloadName} - 调度成功
                  </span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                  {dispatchResult.mode === 'ai-generated' ? 'Gemini AI 智能引擎' : '内核原生例程'}
                </span>
              </div>

              {/* Deconstructed Hilbert Meta-Operators */}
              <div className="space-y-2">
                <span className="text-slate-400 block text-[11px] font-bold">
                  🧬 解构的希尔伯特数据元算子 (Hilbert Meta-Operators)
                </span>
                <div className="space-y-1.5">
                  {dispatchResult.deconstructedOperators.map((op, idx) => (
                    <div key={idx} className="bg-slate-950 p-2 rounded border border-slate-800 flex items-center justify-between">
                      <div>
                        <span className="text-cyan-300 font-bold mr-2">[{op.id}] {op.name}</span>
                        <span className="text-[10px] text-slate-500">复杂度: {op.complexity}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-indigo-300 font-bold text-[11px]">省内存 {op.memorySavingsPct}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Generated Assembly Machine Code */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 block text-[11px] font-bold">
                    ⚙️ 编译生成的裸机机器码 / 汇编例程
                  </span>
                  <button
                    onClick={copyCode}
                    className="text-[10px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                  >
                    {copiedCode ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    {copiedCode ? '已复制' : '复制汇编'}
                  </button>
                </div>

                <pre className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-[11px] text-emerald-400 overflow-x-auto leading-relaxed max-h-[160px]">
                  <code>{dispatchResult.machineCodeSnippet}</code>
                </pre>
              </div>

              {/* Node Allocations & Performance */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-950 p-3 rounded-lg border border-slate-800">
                <div>
                  <span className="text-slate-400 block text-[10px]">预估完成耗时</span>
                  <span className="text-cyan-300 font-bold text-sm flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-cyan-400" />
                    {dispatchResult.loadBalanceMetrics.estimatedCompletionTimeMs} ms
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">调度计算吞吐量</span>
                  <span className="text-amber-300 font-bold text-sm">
                    {dispatchResult.loadBalanceMetrics.throughputGflops.toLocaleString()} GFLOPS
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">温控降频余量</span>
                  <span className="text-emerald-400 font-bold text-sm">
                    {dispatchResult.loadBalanceMetrics.thermalProtectionMarginPct}%
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">相比经典OS节电</span>
                  <span className="text-indigo-300 font-bold text-sm">
                    {dispatchResult.loadBalanceMetrics.energySavedKWh} kWh
                  </span>
                </div>
              </div>

              {/* AI Reasoning Summary */}
              <p className="text-[11px] text-slate-400 bg-slate-950/50 p-2.5 rounded border border-slate-800/80 italic">
                "{dispatchResult.reasoning}"
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
