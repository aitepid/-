/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { SystemTab, ComputeNode, KernelLogEntry } from './types/os';
import { INITIAL_COMPUTE_NODES } from './data/initialNodes';
import { Navbar } from './components/Navbar';
import { ClusterMap } from './components/ClusterMap';
import { HilbertEngine } from './components/HilbertEngine';
import { MachineCodeKernel } from './components/MachineCodeKernel';
import { SecurityMesh } from './components/SecurityMesh';
import { DeploymentLauncher } from './components/DeploymentLauncher';
import { DeveloperApi } from './components/DeveloperApi';
import { InteractiveShell } from './components/InteractiveShell';
import { HotPlugModal } from './components/HotPlugModal';
import { HermesDialogueModal } from './components/HermesDialogueModal';
import { KernelTerminalLog } from './components/KernelTerminalLog';

export default function App() {
  const [activeTab, setActiveTab] = useState<SystemTab>('cluster');
  const [nodes, setNodes] = useState<ComputeNode[]>(INITIAL_COMPUTE_NODES);
  const [selectedNode, setSelectedNode] = useState<ComputeNode | null>(INITIAL_COMPUTE_NODES[0]);
  const [deploymentMode, setDeploymentMode] = useState<'baremetal' | 'hypervisor'>('baremetal');
  const [isHotPlugOpen, setIsHotPlugOpen] = useState<boolean>(false);
  const [isHermesOpen, setIsHermesOpen] = useState<boolean>(false);
  const [isLogOpen, setIsLogOpen] = useState<boolean>(false);

  const [kernelLogs, setKernelLogs] = useState<KernelLogEntry[]>([
    { id: '1', timestamp: '04:23:01.012', level: 'SYS_INFO', subsystem: 'INIT', message: 'HilbertOS Native Microkernel v4.8 loaded. Bare-Metal page tables initialized.' },
    { id: '2', timestamp: '04:23:02.140', level: 'DISPATCH', subsystem: 'HILBERT_DATA', message: 'Hilbert Space Meta-Operator Order 4 spatial mapping active. Memory density +88.4%' },
    { id: '3', timestamp: '04:23:03.580', level: 'ZKP_PROOF', subsystem: 'P2P_MESH', message: 'Kyber-1024 Post-Quantum zero-trust encryption established across 8 global nodes.' },
  ]);

  // Total cluster TFLOPS
  const totalTflops = nodes.reduce((acc, curr) => acc + (curr.status !== 'quarantined' ? curr.tflops : 0), 0);
  const hilbertRatio = nodes.reduce((acc, curr) => acc + curr.hilbertCompressionPct, 0) / (nodes.length || 1);

  // Periodic Kernel Syscall Log Pulse
  useEffect(() => {
    const interval = setInterval(() => {
      const logMessages = [
        { sub: 'HILBERT_META', msg: 'sys_hilbert_encode(): 2D Spatial Fractal Tensor slice synchronized in 0.1ms', lvl: 'DISPATCH' },
        { sub: 'P2P_MESH', msg: 'sys_mesh_heartbeat(): P2P Node mesh latency stable @ 1.2ms', lvl: 'SYS_INFO' },
        { sub: 'ZKP_CORE', msg: 'sys_zk_verify(): Zero-Knowledge Polynomial proof validation succeeded.', lvl: 'ZKP_PROOF' },
        { sub: 'SIMD_KERNEL', msg: 'AVX-512 ZMM0-ZMM3 registers straight-through pass zero TLB miss.', lvl: 'DISPATCH' },
      ];
      const selected = logMessages[Math.floor(Math.random() * logMessages.length)];

      const newEntry: KernelLogEntry = {
        id: Date.now().toString(),
        timestamp: new Date().toLocaleTimeString() + '.' + Math.floor(Math.random() * 900 + 100),
        level: selected.lvl as any,
        subsystem: selected.sub,
        message: selected.msg,
      };

      setKernelLogs(prev => [newEntry, ...prev.slice(0, 49)]);
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  // Hot Plug New Node
  const handleAddNode = (newNode: ComputeNode) => {
    setNodes(prev => [newNode, ...prev]);
    setSelectedNode(newNode);

    // Append Kernel Log
    const newEntry: KernelLogEntry = {
      id: Date.now().toString(),
      timestamp: new Date().toLocaleTimeString() + '.000',
      level: 'HOT_PLUG',
      subsystem: 'HOT_PLUG',
      message: `热插拔硬件成功接纳新节点 [${newNode.name}] (${newNode.tflops} TFLOPS, ${newNode.architecture}). 全网算力自动均衡重组.`
    };
    setKernelLogs(prev => [newEntry, ...prev]);
  };

  // Balance Workload
  const handleBalanceWorkload = () => {
    setNodes(prev => prev.map(node => ({
      ...node,
      cpuUsage: Math.floor(30 + Math.random() * 40),
      latencyMs: +(Math.random() * 12 + 1).toFixed(1),
      status: node.status === 'quarantined' ? 'quarantined' : Math.random() > 0.3 ? 'online' : 'busy'
    })));

    const newEntry: KernelLogEntry = {
      id: Date.now().toString(),
      timestamp: new Date().toLocaleTimeString() + '.112',
      level: 'DISPATCH',
      subsystem: 'AI_SCHEDULER',
      message: 'AI 动态调度引擎已对全网算力节点完成 100% 热负载再均衡分片。'
    };
    setKernelLogs(prev => [newEntry, ...prev]);
  };

  // Quarantine Node
  const handleQuarantineNode = (id: string) => {
    setNodes(prev => prev.map(n => n.id === id ? { ...n, status: 'quarantined' } : n));
    if (selectedNode?.id === id) {
      setSelectedNode(prev => prev ? { ...prev, status: 'quarantined' } : null);
    }

    const newEntry: KernelLogEntry = {
      id: Date.now().toString(),
      timestamp: new Date().toLocaleTimeString() + '.888',
      level: 'KERNEL_WARN',
      subsystem: 'SECURITY_MESH',
      message: `零信任协议已隔离节点 [${id}]，防范潜在隐患。`
    };
    setKernelLogs(prev => [newEntry, ...prev]);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30">
      {/* OS Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        nodesCount={nodes.length}
        totalTflops={totalTflops}
        hilbertRatio={hilbertRatio}
        deploymentMode={deploymentMode}
        setDeploymentMode={setDeploymentMode}
        onOpenHotPlugModal={() => setIsHotPlugOpen(true)}
        onOpenHermesModal={() => setIsHermesOpen(true)}
        toggleLogDrawer={() => setIsLogOpen(!isLogOpen)}
        isLogOpen={isLogOpen}
      />

      {/* Main OS Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-4 pb-16">
        {activeTab === 'cluster' && (
          <ClusterMap
            nodes={nodes}
            onSelectNode={setSelectedNode}
            selectedNode={selectedNode}
            onHotPlugNode={() => setIsHotPlugOpen(true)}
            onBalanceWorkload={handleBalanceWorkload}
            onQuarantineNode={handleQuarantineNode}
          />
        )}

        {activeTab === 'hilbert' && <HilbertEngine />}

        {activeTab === 'kernel' && <MachineCodeKernel />}

        {activeTab === 'shell' && <InteractiveShell />}

        {activeTab === 'security' && <SecurityMesh />}

        {activeTab === 'deploy' && (
          <DeploymentLauncher
            deploymentMode={deploymentMode}
            setDeploymentMode={setDeploymentMode}
            onOpenHotPlugModal={() => setIsHotPlugOpen(true)}
          />
        )}

        {activeTab === 'api' && <DeveloperApi />}
      </main>

      {/* Hot Plug Hardware Modal */}
      <HotPlugModal
        isOpen={isHotPlugOpen}
        onClose={() => setIsHotPlugOpen(false)}
        onAddNode={handleAddNode}
      />

      {/* Hermes AI Agent Dialogue Modal */}
      <HermesDialogueModal
        isOpen={isHermesOpen}
        onClose={() => setIsHermesOpen(false)}
      />

      {/* Kernel Terminal Log Drawer */}
      <KernelTerminalLog
        isOpen={isLogOpen}
        onClose={() => setIsLogOpen(false)}
        logs={kernelLogs}
        onClearLogs={() => setKernelLogs([])}
      />
    </div>
  );
}
