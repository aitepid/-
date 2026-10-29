import React, { useState } from 'react';
import { 
  HardDrive, 
  Cpu, 
  Server, 
  Download, 
  Terminal, 
  CheckCircle2, 
  Copy, 
  Check, 
  Settings, 
  Radio, 
  PlusCircle, 
  Layers,
  Zap,
  Smartphone
} from 'lucide-react';

interface DeploymentLauncherProps {
  deploymentMode: 'baremetal' | 'hypervisor';
  setDeploymentMode: (mode: 'baremetal' | 'hypervisor') => void;
  onOpenHotPlugModal: () => void;
}

export const DeploymentLauncher: React.FC<DeploymentLauncherProps> = ({
  deploymentMode,
  setDeploymentMode,
  onOpenHotPlugModal
}) => {
  const [selectedArch, setSelectedArch] = useState<string>('x86_64');
  const [includeCuda, setIncludeCuda] = useState<boolean>(true);
  const [includeRocm, setIncludeRocm] = useState<boolean>(true);
  const [includeNpu, setIncludeNpu] = useState<boolean>(true);
  const [copiedScript, setCopiedScript] = useState<boolean>(false);

  const baremetalInstallScript = `#!/usr/bin/env bash
# HilbertOS Bare-Metal Native Installer
echo "[HilbertOS] Initializing UEFI microkernel bootloader..."
curl -sSL https://get.hilbertos.org/kernel-v4.8.iso -o /tmp/hilbert-kernel.iso

# Write to target block device with zero-copy page alignment
sudo dd if=/tmp/hilbert-kernel.iso of=/dev/nvme0n1 bs=4M status=progress conv=fsync

# Register Hilbert Space Meta-Operator EFI entry
sudo efibootmgr --create --disk /dev/nvme0n1 --part 1 --label "HilbertOS Native" --loader "\\EFI\\HILBERT\\BOOTX64.EFI"
echo "[HilbertOS] Installation completed! Reboot into Bare-Metal HilbertOS."`;

  const hypervisorQemuScript = `<domain type='kvm'>
  <name>HilbertOS-Hypervisor-Node</name>
  <memory unit='GiB'>64</memory>
  <vcpu placement='static'>32</vcpu>
  <os>
    <type arch='${selectedArch}' machine='q35'>hvm</type>
    <loader readonly='yes' type='pflash'>/usr/share/OVMF/OVMF_CODE.fd</loader>
  </os>
  <features>
    <acpi/>
    <apic/>
    <hilbert_meta_operator_acceleration enabled='yes'/>
  </features>
  <devices>
    <disk type='file' device='disk'>
      <driver name='qemu' type='qcow2' cache='none' io='native'/>
      <source file='/var/lib/libvirt/images/hilbertos-v4.8.qcow2'/>
      <target dev='vda' bus='virtio'/>
    </disk>
    <hostdev mode='subsystem' type='pci' managed='yes'>
      <source><address domain='0x0000' bus='0x01' slot='0x00' function='0x0'/></source>
    </hostdev>
  </devices>
</domain>`;

  const activeScript = deploymentMode === 'baremetal' ? baremetalInstallScript : hypervisorQemuScript;

  const copyScript = () => {
    navigator.clipboard.writeText(activeScript);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2000);
  };

  return (
    <div className="space-y-4 font-mono text-xs">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <HardDrive className="w-5 h-5 text-indigo-400" />
            <h2 className="text-base font-bold text-indigo-300">
              裸机直接安装与 VM 虚拟机 Hypervisor 部署中心
            </h2>
          </div>
          <p className="text-xs text-slate-300 font-sans">
            HilbertOS 支持无依赖裸机 (Bare-Metal) 部署，也可运行于 QEMU/KVM、VMware、Proxmox 等虚拟机 Hypervisor 之上，全面兼容 x86_64, ARM64, RISC-V 架构并支持热插拔硬件调配。
          </p>
        </div>

        <button
          onClick={onOpenHotPlugModal}
          className="px-3.5 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-slate-950 font-bold rounded-lg flex items-center gap-1.5 transition-all shadow-md"
        >
          <PlusCircle className="w-4 h-4" />
          运行热插拔硬件测试
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Config Panel (Col 5) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Deployment Mode Switch Card */}
          <div className="bg-slate-950 rounded-xl border border-slate-800 p-4 space-y-3 shadow-xl">
            <span className="font-bold text-slate-200 block border-b border-slate-800 pb-2">
              1. 选择系统运行与部署模式
            </span>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setDeploymentMode('baremetal')}
                className={`p-3 rounded-lg border text-left space-y-1 transition-all cursor-pointer ${
                  deploymentMode === 'baremetal'
                    ? 'bg-cyan-950/80 border-cyan-500 text-cyan-300 shadow-md shadow-cyan-500/10'
                    : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold flex items-center gap-1">
                    <HardDrive className="w-4 h-4 text-cyan-400" /> 裸机模式
                  </span>
                  {deploymentMode === 'baremetal' && <CheckCircle2 className="w-4 h-4 text-cyan-400" />}
                </div>
                <p className="text-[10px] text-slate-400">
                  直接驱动物理 CPU/GPU，极佳性能与零 OS 虚拟化损耗。
                </p>
              </button>

              <button
                onClick={() => setDeploymentMode('hypervisor')}
                className={`p-3 rounded-lg border text-left space-y-1 transition-all cursor-pointer ${
                  deploymentMode === 'hypervisor'
                    ? 'bg-indigo-950/80 border-indigo-500 text-indigo-300 shadow-md shadow-indigo-500/10'
                    : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold flex items-center gap-1">
                    <Server className="w-4 h-4 text-indigo-400" /> VM 虚拟机
                  </span>
                  {deploymentMode === 'hypervisor' && <CheckCircle2 className="w-4 h-4 text-indigo-400" />}
                </div>
                <p className="text-[10px] text-slate-400">
                  QEMU/KVM/Proxmox 虚拟机镜像，快速接入私有云。
                </p>
              </button>
            </div>
          </div>

          {/* Architecture & Drivers Builder */}
          <div className="bg-slate-950 rounded-xl border border-slate-800 p-4 space-y-3 shadow-xl">
            <span className="font-bold text-slate-200 block border-b border-slate-800 pb-2">
              2. 目标 CPU 架构与微码驱动打包
            </span>

            <div className="space-y-2">
              <label className="text-slate-400 block text-[10px]">物理处理器架构 (Architecture)</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'x86_64', label: 'x86_64 (AMD/Intel)' },
                  { id: 'ARM64', label: 'ARM64 (Apple/Ampere)' },
                  { id: 'RISC-V', label: 'RISC-V (SiFive)' },
                  { id: 'LoongArch', label: 'LoongArch 龙芯' },
                ].map(arch => (
                  <button
                    key={arch.id}
                    onClick={() => setSelectedArch(arch.id)}
                    className={`p-2 rounded border text-left transition-all ${
                      selectedArch === arch.id
                        ? 'bg-indigo-900/60 border-indigo-500 text-indigo-200 font-bold'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    {arch.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-900">
              <label className="text-slate-400 block text-[10px]">微内核加速驱动绑定 (Microkernel Drivers)</label>

              <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeCuda}
                  onChange={(e) => setIncludeCuda(e.target.checked)}
                  className="accent-cyan-400"
                />
                <span>NVIDIA CUDA 直通驱动 (0-Overhead Pass-through)</span>
              </label>

              <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeRocm}
                  onChange={(e) => setIncludeRocm(e.target.checked)}
                  className="accent-cyan-400"
                />
                <span>AMD ROCm / Instinct 矢量加速驱动</span>
              </label>

              <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeNpu}
                  onChange={(e) => setIncludeNpu(e.target.checked)}
                  className="accent-cyan-400"
                />
                <span>移动端 Apple Neural Engine / Hexagon NPU 节点映射</span>
              </label>
            </div>
          </div>
        </div>

        {/* Generated Script / Config Viewer (Col 7) */}
        <div className="lg:col-span-7 bg-slate-950 rounded-xl border border-slate-800 p-4 space-y-3 shadow-xl flex flex-col">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="font-bold text-slate-200 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-cyan-400" />
              {deploymentMode === 'baremetal' ? '裸机 ISO 构建与 EFI 安装脚本' : 'QEMU/KVM 虚拟机 Domain 配置文件'}
            </span>

            <button
              onClick={copyScript}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded flex items-center gap-1 border border-slate-700"
            >
              {copiedScript ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedScript ? '已复制' : '复制代码'}
            </button>
          </div>

          <pre className="flex-1 bg-slate-900 p-3.5 rounded-lg border border-slate-800 text-emerald-400 overflow-x-auto leading-relaxed max-h-[380px]">
            <code>{activeScript}</code>
          </pre>

          <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 flex items-center justify-between text-slate-300">
            <div className="flex items-center gap-2">
              <Download className="w-4 h-4 text-cyan-400" />
              <span>下载预编译镜像 (HilbertOS-v4.8-{selectedArch}.iso)</span>
            </div>
            <button
              onClick={() => alert(`准备下载 HilbertOS-v4.8-${selectedArch}.iso 镜像文件...`)}
              className="px-3 py-1 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold rounded"
            >
              立即下载 (14.2 MB)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
