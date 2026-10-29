import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Key, 
  Lock, 
  CheckCircle2, 
  AlertTriangle, 
  Activity, 
  Radio, 
  RefreshCw, 
  Sparkles, 
  EyeOff, 
  Globe,
  XCircle
} from 'lucide-react';

export const SecurityMesh: React.FC = () => {
  const [zkpStage, setZkpStage] = useState<number>(3);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [hasAttackAlert, setHasAttackAlert] = useState<boolean>(false);
  const [logs, setLogs] = useState<Array<{ id: string; time: string; msg: string; type: 'success' | 'warn' | 'info' }>>([
    { id: '1', time: '12:04:18.002', msg: 'ZKP 校验成功: 节点 node-bj-01 验证 1,000,000Hilbert 矩阵证明有效 [0.2ms]', type: 'success' },
    { id: '2', time: '12:04:18.140', msg: '抗量子 Kyber-1024 握手完成: 节点 node-sv-02 通道加密完毕', type: 'info' },
    { id: '3', time: '12:04:18.590', msg: '环签名广播: 隐私节点身份混淆完成 (Ring Size: 64)', type: 'info' },
  ]);

  const runZkpDemo = () => {
    setIsSimulating(true);
    setZkpStage(0);

    setTimeout(() => setZkpStage(1), 600);
    setTimeout(() => setZkpStage(2), 1200);
    setTimeout(() => {
      setZkpStage(3);
      setIsSimulating(false);
      setLogs(prev => [
        {
          id: Date.now().toString(),
          time: new Date().toLocaleTimeString() + '.' + Math.floor(Math.random() * 900 + 100),
          msg: `全新 Zero-Knowledge Proof 验证生成: 耗时 ${ (0.1 + Math.random() * 0.3).toFixed(3) }ms，算力结果 100% 真实无篡改`,
          type: 'success'
        },
        ...prev.slice(0, 8)
      ]);
    }, 1800);
  };

  const triggerMaliciousAttack = () => {
    setHasAttackAlert(true);
    setLogs(prev => [
      {
        id: Date.now().toString(),
        time: new Date().toLocaleTimeString() + '.992',
        msg: '⚠️ 警告: 检测到未授权伪造节点 0x99A...FF82 试图注入篡改算力结果！',
        type: 'warn'
      },
      {
        id: (Date.now() + 1).toString(),
        time: new Date().toLocaleTimeString() + '.998',
        msg: '🛡️ 自动零信任隔离协议生效: 该恶意节点已被 HilbertOS 内核自动封禁隔离！',
        type: 'success'
      },
      ...prev.slice(0, 8)
    ]);

    setTimeout(() => setHasAttackAlert(false), 5000);
  };

  return (
    <div className="space-y-4 font-mono text-xs">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h2 className="text-base font-bold text-emerald-300">
              去中心化加密安全协议与 ZK 算力验证 (Decentralized ZKP Security Mesh)
            </h2>
          </div>
          <p className="text-xs text-slate-300 font-sans">
            HilbertOS 具备去中心化的加密安全体系：结合<span className="text-emerald-300 font-bold">零知识证明 (Zero-Knowledge Proofs)</span> 验证节点执行真实性，搭配<span className="text-cyan-300 font-bold">抗量子 Kyber-1024 密钥交换</span>与<span className="text-indigo-300 font-bold">环签名隐私通信</span>，保障全网算力任务数据完整与隐私安全。
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={triggerMaliciousAttack}
            className="px-3 py-1.5 bg-rose-950/80 hover:bg-rose-900 border border-rose-800 text-rose-300 rounded-lg flex items-center gap-1.5 transition-all shadow"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
            模拟恶意节点注入攻击
          </button>
        </div>
      </div>

      {/* Attack Alert Banner if active */}
      {hasAttackAlert && (
        <div className="bg-rose-950/90 border border-rose-500/80 p-3.5 rounded-xl flex items-center justify-between text-rose-200 animate-pulse shadow-2xl">
          <div className="flex items-center gap-2">
            <XCircle className="w-5 h-5 text-rose-400" />
            <span className="font-bold">
              [零信任安全报警] 内核零知识验证引擎成功拦截非法节点篡改请求！已秒级 quarantine 隔离。
            </span>
          </div>
          <span className="text-[10px] bg-rose-900 px-2 py-0.5 rounded text-rose-300">
            防御协议 ACTIVE
          </span>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: ZKP Stage Visualizer (Col 7) */}
        <div className="lg:col-span-7 bg-slate-950 rounded-xl border border-slate-800 p-4 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="font-bold text-slate-200 flex items-center gap-2">
              <Key className="w-4 h-4 text-emerald-400" />
              零知识算力验证流程演示 (ZKP Computation Verification)
            </span>

            <button
              onClick={runZkpDemo}
              disabled={isSimulating}
              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold rounded flex items-center gap-1 transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-3 h-3 ${isSimulating ? 'animate-spin' : ''}`} />
              重新演练 ZKP 算力校验
            </button>
          </div>

          {/* Stepper Pipeline */}
          <div className="space-y-3">
            {[
              { title: '1. 构造希尔伯特元算子计算 Commitment 承诺', desc: '不暴露节点原始输入矩阵的前提下打包算力电路散列' },
              { title: '2. 随机生成多项式多维评估 Challenge 质询', desc: '全域 P2P Mesh 算力网格生成随机非确定性验证点' },
              { title: '3. 裸机机器码微码 Gate 电路求值', desc: '执行底层硬件寄存器微码校验' },
              { title: '4. 零知识证明全局广播与 O(1) 秒级通过', desc: '证明已确认 100% 真实执行无防作弊' },
            ].map((st, idx) => {
              const isDone = zkpStage >= idx;
              const isCurrent = zkpStage === idx && isSimulating;
              return (
                <div
                  key={idx}
                  className={`p-3 rounded-lg border transition-all ${
                    isCurrent
                      ? 'bg-emerald-950/60 border-emerald-500/80 shadow-md shadow-emerald-500/20'
                      : isDone
                      ? 'bg-slate-900 border-slate-800 text-slate-300'
                      : 'bg-slate-950/50 border-slate-900 text-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`font-bold ${isDone ? 'text-emerald-400' : 'text-slate-500'}`}>
                      {st.title}
                    </span>
                    {isDone ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-slate-700" />
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">{st.desc}</p>
                </div>
              );
            })}
          </div>

          {/* Crypto Protocols Info Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
            <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 space-y-1">
              <span className="text-cyan-400 font-bold block flex items-center gap-1">
                <Lock className="w-3.5 h-3.5" /> 抗量子 Kyber-1024 传输
              </span>
              <p className="text-[11px] text-slate-400">
                P2P 节点间通信均经过 Post-Quantum 格加密算法护航，抵御未来量子计算机的离线破解。
              </p>
            </div>

            <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 space-y-1">
              <span className="text-indigo-400 font-bold block flex items-center gap-1">
                <EyeOff className="w-3.5 h-3.5" /> 环签名 Ring-Signature 匿名
              </span>
              <p className="text-[11px] text-slate-400">
                节点身份与任务数据完全解耦，计算节点无法感知任务来源者的真实物理 IP 与所有者信息。
              </p>
            </div>
          </div>
        </div>

        {/* Right: Security Telemetry Logs Stream (Col 5) */}
        <div className="lg:col-span-5 bg-slate-950 rounded-xl border border-slate-800 p-4 space-y-3 shadow-xl flex flex-col">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="font-bold text-slate-200 flex items-center gap-2">
              <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
              去中心化加密安全日志流 (Crypto Telemetry Stream)
            </span>
            <span className="text-[10px] text-slate-500">内核层实时防御</span>
          </div>

          <div className="flex-1 bg-slate-900 p-3 rounded-lg border border-slate-800 space-y-2 overflow-y-auto max-h-[380px]">
            {logs.map(log => (
              <div
                key={log.id}
                className={`p-2 rounded border text-[11px] font-mono leading-relaxed ${
                  log.type === 'warn'
                    ? 'bg-rose-950/60 border-rose-800/80 text-rose-300'
                    : log.type === 'success'
                    ? 'bg-emerald-950/40 border-emerald-900/60 text-emerald-300'
                    : 'bg-slate-950 border-slate-800 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] text-slate-500 mb-0.5">
                  <span>TIMESTAMP: {log.time}</span>
                  <span className="uppercase">{log.type}</span>
                </div>
                <p>{log.msg}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
