import React, { useState, useEffect, useRef } from 'react';
import { Bot, Send, User, X, Sparkles, Loader2, Zap, ShieldCheck, Terminal, RefreshCw, Cpu, Layers } from 'lucide-react';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'hermes';
  text: string;
  timestamp: string;
  actionSuggest?: string;
}

interface HermesDialogueModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExecuteAction?: (actionName: string) => void;
}

export const HermesDialogueModal: React.FC<HermesDialogueModalProps> = ({
  isOpen,
  onClose,
  onExecuteAction
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'hermes',
      text: `你好！我是 **Nous Research Hermes Agent** (https://hermes-agent.nousresearch.com/)，Nous Research 开发的开源自主 Agent 系统。

我已经直连 HilbertOS 微内核与全网 **1,428 个计算节点**（包含 CUDA/ROCm 算力卡、ARM64 移动手机网格与 RISC-V 微核）。遵循 **Plan-Act-Observe-Refine** 自主推理循环：
1. **解构复杂的科研/HPC 任务**为希尔伯特空间排列数据元算子。
2. **生成底层的裸机机器码汇编例程**（如 AVX-512 / NEON 微码）。
3. **自主执行全域算力热负载均衡**与去中心化 ZKP 零知识安全校验。

请问有什么科学计算、代码生成或内核调度任务需要我协助？`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [inputVal, setInputVal] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  if (!isOpen) return null;

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || inputVal;
    if (!textToSend.trim() || isTyping) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!customText) setInputVal('');
    setIsTyping(true);

    try {
      // Build history for backend API
      const historyPayload = messages.map(m => ({
        role: m.sender === 'user' ? 'user' : 'model',
        text: m.text
      }));

      const response = await fetch('/api/os/hermes-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          history: historyPayload
        })
      });

      const data = await response.json();
      const replyText = data.reply || 'Hermes Agent 响应完毕。';

      const hermesReply: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'hermes',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, hermesReply]);
    } catch (err: any) {
      const errorReply: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'hermes',
        text: `[Hermes Agent 异常] 通信断开: ${err.message || '内核事件响应超时'}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorReply]);
    } finally {
      setIsTyping(false);
    }
  };

  const quickPrompts = [
    '🧪 解构 3D 蛋白质分子动力学算子',
    '🌍 优化全球 10B 格点气象流体力学方程',
    '🧠 将 70B LLM 张量切片投递至 256 个移动节点',
    '🛡️ 触发全网 ZKP 零知识证明通道校验',
    '⚡ 帮我执行全网节点热负载重排',
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4">
      <div className="bg-slate-900 border border-cyan-500/50 rounded-2xl max-w-3xl w-full h-[85vh] flex flex-col shadow-2xl overflow-hidden font-mono text-xs animate-scale-in">
        {/* Header Bar */}
        <div className="bg-slate-950 px-4 py-3 border-b border-cyan-900/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-indigo-600 p-0.5 shadow-lg shadow-cyan-500/30 flex items-center justify-center">
              <Bot className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm text-cyan-300">
                  NOUS RESEARCH HERMES AGENT
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  ONLINE
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-sans flex items-center gap-2">
                <span>Plan-Act-Observe-Refine 机制</span>
                <a
                  href="https://hermes-agent.nousresearch.com/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-cyan-400 hover:underline"
                >
                  hermes-agent.nousresearch.com
                </a>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Stream */}
        <div className="flex-1 p-4 space-y-4 overflow-y-auto bg-slate-950/60">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : ''}`}
              >
                {/* Avatar */}
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                  isUser
                    ? 'bg-cyan-600 text-slate-950'
                    : 'bg-indigo-600 text-slate-100 shadow-md shadow-indigo-500/30'
                }`}>
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                {/* Message Bubble */}
                <div className={`max-w-[85%] rounded-2xl p-3.5 space-y-1 shadow-lg leading-relaxed ${
                  isUser
                    ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-slate-950 font-medium rounded-tr-none'
                    : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none font-sans text-xs'
                }`}>
                  <div className="whitespace-pre-wrap">{msg.text}</div>
                  <div className={`text-[9px] font-mono text-right ${isUser ? 'text-slate-900/70' : 'text-slate-500'}`}>
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs p-2">
              <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
              <span>Hermes Agent 正在分析内核事件并生成回复...</span>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-3 py-2 bg-slate-950 border-t border-slate-800/80 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1 shrink-0 mr-1">
            <Sparkles className="w-3 h-3 text-amber-400" /> 推荐对话:
          </span>
          {quickPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(p)}
              disabled={isTyping}
              className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-cyan-300 rounded-full text-[11px] font-sans transition-all whitespace-nowrap cursor-pointer shrink-0"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Text Input Area */}
        <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2">
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            disabled={isTyping}
            placeholder="向 Hermes Agent 发送指令或提问（如：如何优化当前的 1,428 个节点？）..."
            className="flex-1 bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl p-2.5 px-3 text-slate-100 outline-none font-sans text-xs placeholder:text-slate-500"
            autoFocus
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={isTyping || !inputVal.trim()}
            className="px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-extrabold rounded-xl shadow-lg shadow-cyan-500/20 flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-40"
          >
            <Send className="w-4 h-4 fill-slate-950" />
            发送
          </button>
        </div>
      </div>
    </div>
  );
};
