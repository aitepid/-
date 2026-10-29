import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Send, Trash2, Sparkles, CornerDownLeft, Play, Cpu, ShieldCheck, Zap, HardDrive } from 'lucide-react';

interface TerminalLine {
  id: string;
  type: 'input' | 'output-text' | 'output-system' | 'output-success' | 'output-error' | 'output-info';
  content: string;
}

export const InteractiveShell: React.FC = () => {
  const [inputVal, setInputVal] = useState<string>('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState<number>(-1);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const [lines, setLines] = useState<TerminalLine[]>([
    { id: '1', type: 'output-system', content: 'HilbertOS Shell v4.8-NATIVE (x86_64/ARM64/RISC-V)' },
    { id: '2', type: 'output-info', content: '输入 "help" 或 "?" 查看 HilbertOS 希尔伯特微码 Shell 绝密指令列表。' },
    { id: '3', type: 'output-success', content: '提示: 可输入 "hermes" 激活 Hermes 自动超级计算 AI Agent 内核！' },
  ]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lines]);

  const executeCommand = async (cmdStr: string) => {
    const trimmed = cmdStr.trim();
    if (!trimmed) return;

    // Record to history
    setHistory(prev => [trimmed, ...prev]);
    setHistoryIdx(-1);

    // Append Input line
    const inputLine: TerminalLine = {
      id: Date.now().toString(),
      type: 'input',
      content: `hilbert-os@kernel-v4.8:~# ${trimmed}`
    };

    setLines(prev => [...prev, inputLine]);
    setInputVal('');

    const args = trimmed.split(/\s+/);
    const cmd = args[0].toLowerCase();

    if (cmd === 'clear' || cmd === 'cls') {
      setLines([]);
      return;
    }

    if (cmd === 'help' || cmd === '?') {
      const helpOutput: TerminalLine[] = [
        { id: Date.now().toString() + '1', type: 'output-system', content: '=== HilbertOS 希尔伯特微码 Shell 指令全集 ===' },
        { id: Date.now().toString() + '2', type: 'output-text', content: '【元算子与数据结构】' },
        { id: Date.now().toString() + '3', type: 'output-info', content: '  hilbert-encode <order>      : 执行阶数 N 希尔伯特 2D/3D 分形编码并测评 Cache 局部性' },
        { id: Date.now().toString() + '4', type: 'output-info', content: '  hilbert-slice <matrix_id>   : 希尔伯特元算子降维切片' },
        { id: Date.now().toString() + '5', type: 'output-text', content: '【Python 科学计算与 JIT 环境】' },
        { id: Date.now().toString() + '6', type: 'output-info', content: '  python3 / python            : 启动 HilbertOS 原生 CPython 3.12 JIT 交互式 REPL' },
        { id: Date.now().toString() + '7', type: 'output-info', content: '  python3 -c "<code>"         : 运行单行 Python 科学计算与张量调度' },
        { id: Date.now().toString() + '8', type: 'output-info', content: '  python3 <script.py>         : 启动 Python 科学计算脚本并接入 Hilbert 算力' },
        { id: Date.now().toString() + '9', type: 'output-info', content: '  pip list                    : 查询 HilbertOS 内核绑定的 Python 科学计算包' },
        { id: Date.now().toString() + '10', type: 'output-text', content: '【集群算力与热插拔】' },
        { id: Date.now().toString() + '11', type: 'output-info', content: '  mesh-status / mesh-list     : 查询全网 P2P 活跃计算节点与算力输出' },
        { id: Date.now().toString() + '12', type: 'output-info', content: '  hotplug attach <name>       : 命令行物理热插拔挂载算力硬件' },
        { id: Date.now().toString() + '13', type: 'output-text', content: '【AI 动态解构与微码】' },
        { id: Date.now().toString() + '14', type: 'output-info', content: '  ai-compile <自然语言需求>    : 召唤 Gemini AI 解构科研需求并生成裸机机器码' },
        { id: Date.now().toString() + '15', type: 'output-info', content: '  reg-inspect                 : 打印底层 CPU / AVX-512 SIMD 硬件寄存器状态' },
        { id: Date.now().toString() + '16', type: 'output-info', content: '  zkp-verify                  : 触发全网零知识证明 (Zero-Knowledge Proof) 验证' },
        { id: Date.now().toString() + '17', type: 'output-info', content: '  uname -a                    : 显示微内核架构版本' },
        { id: Date.now().toString() + '18', type: 'output-info', content: '  clear                       : 清空终端视窗' },
      ];
      setLines(prev => [...prev, ...helpOutput]);
      return;
    }

    // Call Backend API Endpoint
    setIsExecuting(true);
    try {
      const res = await fetch('/api/os/shell-exec', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: trimmed })
      });
      const data = await res.json();

      if (data.output && Array.isArray(data.output)) {
        const newLines: TerminalLine[] = data.output.map((item: any, idx: number) => ({
          id: `${Date.now()}_${idx}`,
          type: item.type === 'error' ? 'output-error' :
                item.type === 'success' ? 'output-success' :
                item.type === 'system' ? 'output-system' :
                item.type === 'info' ? 'output-info' : 'output-text',
          content: item.text
        }));
        setLines(prev => [...prev, ...newLines]);
      }
    } catch (err: any) {
      setLines(prev => [
        ...prev,
        { id: Date.now().toString(), type: 'output-error', content: `[Shell Error] 执行异常: ${err.message || '网络连接中断'}` }
      ]);
    } finally {
      setIsExecuting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      executeCommand(inputVal);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length > 0 && historyIdx < history.length - 1) {
        const nextIdx = historyIdx + 1;
        setHistoryIdx(nextIdx);
        setInputVal(history[nextIdx]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIdx > 0) {
        const nextIdx = historyIdx - 1;
        setHistoryIdx(nextIdx);
        setInputVal(history[nextIdx]);
      } else if (historyIdx === 0) {
        setHistoryIdx(-1);
        setInputVal('');
      }
    }
  };

  const presetShellCommands = [
    { label: '🤖 hermes (激活 Agent)', cmd: 'hermes' },
    { label: '🤖 hermes "优化 1428 节点算力"', cmd: 'hermes "优化全网 1428 个计算节点算力与热耗散"' },
    { label: 'help', cmd: 'help' },
    { label: '🐍 python3', cmd: 'python3' },
    { label: '📦 pip list', cmd: 'pip list' },
    { label: '🌐 mesh-status', cmd: 'mesh-status' },
    { label: '🧬 hilbert-encode 4', cmd: 'hilbert-encode 4' },
    { label: '清屏', cmd: 'clear' },
  ];

  return (
    <div className="space-y-4 font-mono text-xs">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-emerald-400" />
            <h2 className="text-base font-bold text-emerald-300">
              HilbertOS 交互式 Shell 命令控制台 (Hilbert Microkernel Shell)
            </h2>
          </div>
          <p className="text-xs text-slate-300 font-sans">
            输入原生 Linux/HilbertOS Shell 微码指令，或使用 <span className="text-emerald-300 font-bold">ai-compile</span> 命令让 AI 实时编译低级机器码汇编与调度矩阵。
          </p>
        </div>

        {/* Quick Launch Chips */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {presetShellCommands.map((item, idx) => (
            <button
              key={idx}
              onClick={() => executeCommand(item.cmd)}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 rounded text-[11px] transition-all hover:scale-105 cursor-pointer"
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Terminal Window */}
      <div className="bg-slate-950 rounded-xl border border-emerald-500/40 shadow-2xl overflow-hidden flex flex-col min-h-[460px]">
        {/* Terminal Header Bar */}
        <div className="bg-slate-900 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
            </div>
            <span className="text-xs font-bold text-slate-300 ml-2">
              hilbert-os@baremetal-v4.8:~# (bash)
            </span>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-slate-400">
            <span>Encoding: UTF-8</span>
            <span>TTY: /dev/pts/0</span>
            <button
              onClick={() => setLines([])}
              className="text-slate-400 hover:text-slate-200 flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              清屏
            </button>
          </div>
        </div>

        {/* Terminal Console Output Scroll Area */}
        <div className="flex-1 p-4 space-y-1.5 overflow-y-auto max-h-[420px] bg-slate-950/90 font-mono text-[12px] leading-relaxed">
          {lines.map((line) => {
            if (line.type === 'input') {
              return (
                <div key={line.id} className="text-cyan-400 font-bold flex items-center gap-1">
                  <span>{line.content}</span>
                </div>
              );
            }
            if (line.type === 'output-system') {
              return (
                <div key={line.id} className="text-amber-300 font-bold">
                  {line.content}
                </div>
              );
            }
            if (line.type === 'output-success') {
              return (
                <div key={line.id} className="text-emerald-400">
                  {line.content}
                </div>
              );
            }
            if (line.type === 'output-error') {
              return (
                <div key={line.id} className="text-rose-400 font-bold">
                  {line.content}
                </div>
              );
            }
            if (line.type === 'output-info') {
              return (
                <div key={line.id} className="text-indigo-300">
                  {line.content}
                </div>
              );
            }
            return (
              <div key={line.id} className="text-slate-300">
                {line.content}
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        {/* Input Command Line Prompt */}
        <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2">
          <span className="text-emerald-400 font-bold flex items-center gap-1">
            hilbert-os@kernel-v4.8:~#
          </span>
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isExecuting}
            placeholder="输入 Shell 指令 (如 'help', 'mesh-status', 'ai-compile ...')"
            className="flex-1 bg-transparent text-slate-100 outline-none font-mono text-xs placeholder:text-slate-600"
            autoFocus
          />
          <button
            onClick={() => executeCommand(inputVal)}
            disabled={isExecuting || !inputVal.trim()}
            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold rounded text-xs flex items-center gap-1 disabled:opacity-40 transition-all cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            执行
          </button>
        </div>
      </div>
    </div>
  );
};
