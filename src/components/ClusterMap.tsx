import React, { useState, useEffect, useRef } from 'react';
import { ComputeNode, NodeArchitecture } from '../types/os';
import { 
  Globe, 
  Cpu, 
  Smartphone, 
  Server, 
  Activity, 
  Zap, 
  ShieldCheck, 
  Thermometer, 
  RefreshCw, 
  Sliders, 
  XCircle, 
  CheckCircle2, 
  Plus, 
  ExternalLink,
  Layers
} from 'lucide-react';

interface ClusterMapProps {
  nodes: ComputeNode[];
  onSelectNode: (node: ComputeNode) => void;
  selectedNode: ComputeNode | null;
  onHotPlugNode: () => void;
  onBalanceWorkload: () => void;
  onQuarantineNode: (id: string) => void;
}

export const ClusterMap: React.FC<ClusterMapProps> = ({
  nodes,
  onSelectNode,
  selectedNode,
  onHotPlugNode,
  onBalanceWorkload,
  onQuarantineNode
}) => {
  const [archFilter, setArchFilter] = useState<string>('ALL');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const filteredNodes = nodes.filter(node => {
    if (archFilter === 'ALL') return true;
    if (archFilter === 'MOBILE') return node.type === 'Mobile Device';
    if (archFilter === 'DESKTOP') return node.type === 'PC Desktop';
    if (archFilter === 'SUPERCOMPUTER') return node.type === 'Baremetal Supercomputer';
    return node.architecture === archFilter;
  });

  const totalTflops = filteredNodes.reduce((acc, curr) => acc + curr.tflops, 0);
  const avgCompression = filteredNodes.reduce((acc, curr) => acc + curr.hilbertCompressionPct, 0) / (filteredNodes.length || 1);
  const avgLatency = filteredNodes.reduce((acc, curr) => acc + curr.latencyMs, 0) / (filteredNodes.length || 1);

  // Animated Mesh Connectivity Network Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    const resize = () => {
      if (canvas.parentElement) {
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = canvas.parentElement.clientHeight;
      }
    };
    resize();
    window.addEventListener('resize', resize);

    const render = () => {
      time += 0.02;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const width = canvas.width;
      const height = canvas.height;

      // Draw subtle grid lines representing Hilbert spatial memory plane
      ctx.strokeStyle = 'rgba(15, 23, 42, 0.8)';
      ctx.lineWidth = 1;
      const step = 40;
      for (let x = 0; x < width; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Map latitude / longitude to 2D canvas coordinates
      const mappedCoords = filteredNodes.map(node => {
        // Simple equirectangular projection
        const x = ((node.lng + 180) / 360) * (width - 100) + 50;
        const y = ((90 - node.lat) / 180) * (height - 80) + 40;
        return { ...node, x, y };
      });

      // Draw P2P Mesh interconnect lines
      for (let i = 0; i < mappedCoords.length; i++) {
        for (let j = i + 1; j < mappedCoords.length; j++) {
          const n1 = mappedCoords[i];
          const n2 = mappedCoords[j];
          const dist = Math.hypot(n1.x - n2.x, n1.y - n2.y);

          if (dist < 320) {
            const alpha = (1 - dist / 320) * 0.4;
            ctx.strokeStyle = `rgba(6, 182, 212, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(n1.x, n1.y);
            ctx.lineTo(n2.x, n2.y);
            ctx.stroke();

            // Animated packet pulses
            const pulsePos = (Math.sin(time * 3 + i + j) + 1) / 2;
            const px = n1.x + (n2.x - n1.x) * pulsePos;
            const py = n1.y + (n2.y - n1.y) * pulsePos;
            ctx.fillStyle = '#22d3ee';
            ctx.beginPath();
            ctx.arc(px, py, 2.5, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      // Draw Node points
      mappedCoords.forEach(node => {
        const isSelected = selectedNode?.id === node.id;

        // Glowing pulse circle
        ctx.fillStyle = node.status === 'busy' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(34, 211, 238, 0.2)';
        ctx.beginPath();
        ctx.arc(node.x, node.y, isSelected ? 22 : 12 + Math.sin(time * 4) * 2, 0, Math.PI * 2);
        ctx.fill();

        // Node core
        ctx.fillStyle = node.status === 'quarantined' 
          ? '#ef4444' 
          : node.status === 'busy' 
          ? '#f59e0b' 
          : '#06b6d4';
        ctx.beginPath();
        ctx.arc(node.x, node.y, isSelected ? 8 : 5, 0, Math.PI * 2);
        ctx.fill();

        // Label
        ctx.fillStyle = isSelected ? '#38bdf8' : '#94a3b8';
        ctx.font = '10px JetBrains Mono, monospace';
        ctx.fillText(`${node.name.split('-')[0]} (${node.tflops}T)`, node.x + 10, node.y + 3);
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
    };
  }, [filteredNodes, selectedNode]);

  return (
    <div className="space-[#1e293b] space-y-4">
      {/* Top Filter & Control Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/90 p-3 rounded-xl border border-slate-800">
        {/* Architecture Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <span className="text-xs text-slate-400 font-mono flex items-center gap-1 mr-1">
            <Sliders className="w-3.5 h-3.5" /> 筛选:
          </span>
          {[
            { id: 'ALL', label: '全域节点' },
            { id: 'x86_64', label: 'x86_64' },
            { id: 'ARM64', label: 'ARM64 (手机/PC)' },
            { id: 'RISC-V', label: 'RISC-V' },
            { id: 'GPU_CUDA', label: 'NVIDIA CUDA' },
            { id: 'GPU_ROCM', label: 'AMD ROCm' },
            { id: 'MOBILE', label: '📱 移动手机节点' },
          ].map(chip => (
            <button
              key={chip.id}
              onClick={() => setArchFilter(chip.id)}
              className={`px-2.5 py-1 rounded-md text-xs font-mono transition-all ${
                archFilter === chip.id
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {chip.label}
            </button>
          ))}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={onBalanceWorkload}
            className="px-3 py-1.5 bg-indigo-900/50 hover:bg-indigo-800/80 border border-indigo-500/40 text-indigo-200 text-xs font-mono rounded-lg flex items-center gap-1.5 transition-all shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5 text-indigo-400 animate-spin-slow" />
            自动负载均衡
          </button>
          <button
            onClick={onHotPlugNode}
            className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs font-mono rounded-lg flex items-center gap-1 transition-all shadow-md shadow-cyan-600/30"
          >
            <Plus className="w-3.5 h-3.5" />
            热插拔扩容
          </button>
        </div>
      </div>

      {/* Main Grid Map & Side Inspector Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Interactive Mesh Visualizer (Col-span-2) */}
        <div className="lg:col-span-2 relative min-h-[420px] bg-slate-950 rounded-xl border border-cyan-900/30 overflow-hidden shadow-2xl flex flex-col">
          {/* Header overlay */}
          <div className="absolute top-3 left-3 z-10 bg-slate-900/90 backdrop-blur border border-slate-800 px-3 py-1.5 rounded-lg flex items-center gap-2 text-xs font-mono text-cyan-300 shadow">
            <Globe className="w-4 h-4 text-cyan-400" />
            <span>实时分布式 P2P 算力网格拓扑</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>

          <div className="absolute top-3 right-3 z-10 flex items-center gap-2 bg-slate-900/90 border border-slate-800 px-2.5 py-1 rounded-lg text-[11px] font-mono text-slate-300 shadow">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-cyan-400" /> 就绪</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400" /> 高负载</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-500" /> 隔离</span>
          </div>

          {/* Interactive Canvas */}
          <div className="w-full flex-1 min-h-[380px] relative">
            <canvas ref={canvasRef} className="w-full h-full block cursor-pointer" />
          </div>

          {/* Bottom Telemetry Bar */}
          <div className="bg-slate-900/90 border-t border-slate-800 p-2.5 px-4 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
            <div>
              <span className="text-slate-400 block text-[10px]">包含节点数</span>
              <span className="text-cyan-300 font-bold">{filteredNodes.length} 个节点</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">显示算力</span>
              <span className="text-amber-300 font-bold">{totalTflops.toFixed(1)} TFLOPS</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">希尔伯特内存压缩率</span>
              <span className="text-indigo-300 font-bold">{avgCompression.toFixed(1)}%</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">平均通信时延</span>
              <span className="text-emerald-300 font-bold">{avgLatency.toFixed(1)} ms</span>
            </div>
          </div>
        </div>

        {/* Node List & Inspector (Col-span-1) */}
        <div className="flex flex-col space-y-3">
          <div className="bg-slate-900/90 rounded-xl border border-slate-800 p-3.5 space-y-3">
            <h3 className="text-xs font-mono font-semibold text-slate-300 flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-cyan-400">
                <Cpu className="w-4 h-4" /> 活跃计算节点列表
              </span>
              <span className="text-[10px] text-slate-500 font-normal">点击节点查看详情</span>
            </h3>

            <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
              {filteredNodes.map(node => {
                const isSelected = selectedNode?.id === node.id;
                return (
                  <div
                    key={node.id}
                    onClick={() => onSelectNode(node)}
                    className={`p-2.5 rounded-lg border transition-all cursor-pointer font-mono text-xs ${
                      isSelected
                        ? 'bg-cyan-950/60 border-cyan-500 shadow-md shadow-cyan-500/10'
                        : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-1.5">
                        {node.type === 'Mobile Device' ? (
                          <Smartphone className="w-3.5 h-3.5 text-pink-400" />
                        ) : node.type === 'Baremetal Supercomputer' ? (
                          <Server className="w-3.5 h-3.5 text-amber-400" />
                        ) : (
                          <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                        )}
                        <span className="font-semibold text-slate-200 truncate max-w-[140px]">
                          {node.name}
                        </span>
                      </div>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                        node.status === 'busy' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                        node.status === 'quarantined' ? 'bg-rose-950 text-rose-300 border border-rose-800' :
                        'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      }`}>
                        {node.status.toUpperCase()}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-1 text-[11px] text-slate-400">
                      <div>
                        架构: <span className="text-slate-200">{node.architecture}</span>
                      </div>
                      <div>
                        算力: <span className="text-cyan-300">{node.tflops}T</span>
                      </div>
                      <div>
                        CPU: <span className="text-amber-300">{node.cpuUsage}%</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Detailed Inspector Modal / Card */}
          {selectedNode && (
            <div className="bg-slate-900 border border-cyan-500/50 rounded-xl p-4 space-y-3 shadow-xl animate-fade-in">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-cyan-400" />
                  <span className="font-bold font-mono text-sm text-cyan-300">
                    {selectedNode.name}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                  {selectedNode.ipHash}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="bg-slate-950 p-2 rounded border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">算力输出</span>
                  <span className="text-amber-300 font-bold text-sm">{selectedNode.tflops} TFLOPS</span>
                </div>
                <div className="bg-slate-950 p-2 rounded border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">希尔伯特数据压缩</span>
                  <span className="text-indigo-300 font-bold text-sm">{selectedNode.hilbertCompressionPct}%</span>
                </div>
                <div className="bg-slate-950 p-2 rounded border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">显存/内存</span>
                  <span className="text-slate-200">{selectedNode.vramUsageGb} GB / {selectedNode.totalVramGb} GB</span>
                </div>
                <div className="bg-slate-950 p-2 rounded border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">硬件核心温度</span>
                  <span className="text-rose-400 font-semibold">{selectedNode.temperatureC}°C</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs font-mono pt-1">
                <span className="text-slate-400 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> ZK零知识验证:
                </span>
                <span className="text-emerald-400 font-bold">已通过校验</span>
              </div>

              {/* Inspector Actions */}
              <div className="pt-2 flex items-center gap-2">
                <button
                  onClick={() => onQuarantineNode(selectedNode.id)}
                  className="flex-1 py-1.5 bg-rose-950/60 hover:bg-rose-900 border border-rose-800 text-rose-300 text-xs font-mono rounded-lg transition-colors flex items-center justify-center gap-1"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  隔离节点
                </button>
                <button
                  onClick={onBalanceWorkload}
                  className="flex-1 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs font-mono rounded-lg transition-colors flex items-center justify-center gap-1 shadow"
                >
                  <Zap className="w-3.5 h-3.5" />
                  提速再调配
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
