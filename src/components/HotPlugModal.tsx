import React, { useState } from 'react';
import { ComputeNode, NodeType, NodeArchitecture } from '../types/os';
import { 
  X, 
  PlusCircle, 
  Cpu, 
  Smartphone, 
  Server, 
  Zap, 
  HardDrive, 
  CheckCircle2 
} from 'lucide-react';

interface HotPlugModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddNode: (newNode: ComputeNode) => void;
}

export const HotPlugModal: React.FC<HotPlugModalProps> = ({
  isOpen,
  onClose,
  onAddNode
}) => {
  if (!isOpen) return null;

  const [nodeName, setNodeName] = useState<string>('HotPlug-GPU-Node-A9');
  const [nodeType, setNodeType] = useState<NodeType>('Baremetal Supercomputer');
  const [architecture, setArchitecture] = useState<NodeArchitecture>('GPU_CUDA');
  const [location, setLocation] = useState<string>('Hong Kong, CN');
  const [tflops, setTflops] = useState<number>(1450);
  const [vramGb, setVramGb] = useState<number>(512);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newNode: ComputeNode = {
      id: `node-hotplug-${Date.now().toString().slice(-4)}`,
      name: nodeName,
      type: nodeType,
      architecture,
      location,
      lat: 22.3193 + (Math.random() - 0.5) * 5,
      lng: 114.1694 + (Math.random() - 0.5) * 5,
      tflops,
      cpuUsage: 25,
      vramUsageGb: 64,
      totalVramGb: vramGb,
      hilbertCompressionPct: 88.5,
      zkpVerified: true,
      activeThreads: 256,
      temperatureC: 42,
      latencyMs: 8.2,
      status: 'online',
      ipHash: `0x${Math.floor(Math.random()*0xFFFFFF).toString(16)}...${Math.floor(Math.random()*0xFFFF).toString(16)}`,
      joinedAt: new Date().toISOString()
    };

    onAddNode(newNode);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-cyan-500/50 rounded-xl max-w-md w-full p-5 space-y-4 shadow-2xl font-mono text-xs animate-scale-in">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-cyan-400" />
            <h3 className="text-sm font-bold text-cyan-300">
              硬件热插拔扩容 (Hot-Plug Hardware Resource)
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-1">
            <label className="text-slate-300 font-bold block">硬件设备名称 (Node Name)</label>
            <input
              type="text"
              required
              value={nodeName}
              onChange={(e) => setNodeName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200 outline-none focus:border-cyan-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-slate-400 block text-[10px]">节点类型 (Type)</label>
              <select
                value={nodeType}
                onChange={(e) => setNodeType(e.target.value as NodeType)}
                className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200 outline-none text-xs"
              >
                <option value="Baremetal Supercomputer">Baremetal 超级计算机</option>
                <option value="PC Desktop">PC 桌面级节点</option>
                <option value="Mobile Device">📱 移动端网络 (Mobile)</option>
                <option value="Edge IoT">Edge RISC-V IoT</option>
              </select>
            </div>

            <div>
              <label className="text-slate-400 block text-[10px]">硬件架构 (Architecture)</label>
              <select
                value={architecture}
                onChange={(e) => setArchitecture(e.target.value as NodeArchitecture)}
                className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200 outline-none text-xs"
              >
                <option value="GPU_CUDA">NVIDIA GPU CUDA</option>
                <option value="GPU_ROCM">AMD ROCm Instinct</option>
                <option value="x86_64">x86_64 CPU</option>
                <option value="ARM64">ARM64 (Apple/Snapdragon)</option>
                <option value="RISC-V">RISC-V Vector</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-slate-400 block text-[10px]">插拔算力 (TFLOPS)</label>
              <input
                type="number"
                value={tflops}
                onChange={(e) => setTflops(parseFloat(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200 outline-none"
              />
            </div>

            <div>
              <label className="text-slate-400 block text-[10px]">显存/内存容量 (GB)</label>
              <input
                type="number"
                value={vramGb}
                onChange={(e) => setVramGb(parseInt(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200 outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-slate-300 font-bold block">物理地理位置 (Location)</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200 outline-none"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded font-bold"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-extrabold rounded shadow-lg shadow-cyan-600/30 flex items-center gap-1"
            >
              <Zap className="w-4 h-4 fill-slate-950" />
              立即热插拔上线
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
