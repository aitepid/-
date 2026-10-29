import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize Gemini Client server-side
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;
if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
  aiClient = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// API Routes
app.get('/api/os/status', (req, res) => {
  res.json({
    system: 'HilbertOS v4.8.0-NEURAL-BAREMETAL',
    architecture: 'Hilbert-Space Meta-Operator Engine',
    status: 'ONLINE',
    nodesCount: 1428,
    totalTflops: 89420.5,
    hilbertCompressionRatio: '87.4%',
    zkpMeshIntegrity: '100.0%',
    activeJobs: 42,
    avgLatencyMs: 1.4,
    powerEfficiencyGFlopsWatt: 184.2,
  });
});

// AI Dynamic Workload Dispatch & Meta-Operator Compiler
app.post('/api/os/ai-dispatch', async (req, res) => {
  const { workloadName, description, targetArchitecture, nodeLimit } = req.body;

  if (!aiClient) {
    // Fallback structured simulation response if key is missing
    return res.json({
      success: true,
      mode: 'simulated',
      workloadName: workloadName || 'Distributed Scientific Task',
      deconstructedOperators: [
        { id: 'H-OP-01', name: 'Hilbert Tensor Spatial Flattening', complexity: 'O(1)', spatialLocalityScore: 0.98, memorySavingsPct: 86.2 },
        { id: 'H-OP-02', name: 'SIMD Machine Vectorization Matrix', complexity: 'O(N/P)', spatialLocalityScore: 0.95, memorySavingsPct: 84.1 },
        { id: 'H-OP-03', name: 'Zero-Knowledge Cryptographic Gate Aggregation', complexity: 'O(log N)', spatialLocalityScore: 0.99, memorySavingsPct: 91.0 }
      ],
      machineCodeSnippet: `; HilbertOS Native Assembly (${targetArchitecture || 'x86_64_AVX512'})
section .hilbert_meta
global _start_hilbert_dispatch
_start_hilbert_dispatch:
    mov rdi, qword [rel hilbert_space_ptr] ; Load Hilbert spatial index
    vmovdqu32 zmm0, [rdi + rsi*4]           ; AVX-512 Hilbert vector load
    vpackusdw zmm1, zmm0, zmm0             ; Hilbert spatial compression
    sys_mesh_dispatch zmm1, rbx, rdx       ; Low-level P2P Mesh kernel dispatch
    ret`,
      nodeAllocations: [
        { type: 'x86_64 Cluster (Baremetal Cloud)', nodeCount: Math.min(64, nodeLimit || 32), allocationRatio: '45%', gflops: 32400 },
        { type: 'ARM64 Mobile Edge (Distributed iOS/Android)', nodeCount: Math.min(512, nodeLimit || 256), allocationRatio: '35%', gflops: 18200 },
        { type: 'RISC-V IoT Micro-Kernels', nodeCount: Math.min(128, nodeLimit || 64), allocationRatio: '20%', gflops: 8900 }
      ],
      loadBalanceMetrics: {
        estimatedCompletionTimeMs: 142,
        throughputGflops: 59500,
        thermalProtectionMarginPct: 94.5,
        energySavedKWh: 12.8
      },
      reasoning: "HilbertOS AI Kernel deconstructed the computational graph into 2D/3D Hilbert spatial fractal structures, maximizing memory cache density and executing zero-copy register pass-through."
    });
  }

  try {
    const prompt = `You are the Kernel Neural Scheduler for HilbertOS, a revolutionary machine-code based distributed supercomputing operating system.
HilbertOS compresses data using multi-dimensional Hilbert Curve Spatial Sorting Meta-Operators rather than traditional linear binary data arrays, and executes native low-level machine code across connected PC and Mobile nodes.

Task to compile & schedule:
- Workload Title: ${workloadName || 'High-Performance Distributed Compute'}
- Description: ${description || 'Scientific simulation, AI inference or math tensor operations'}
- Target Target Architecture: ${targetArchitecture || 'Heterogeneous (x86_64 + ARM64 + RISC-V + GPU)'}
- Node Limit: ${nodeLimit || 128}

Respond strictly in valid JSON format matching this schema:
{
  "workloadName": string,
  "deconstructedOperators": Array<{
    "id": string,
    "name": string,
    "complexity": string,
    "spatialLocalityScore": number (0 to 1),
    "memorySavingsPct": number (e.g. 84.5)
  }>,
  "machineCodeSnippet": string (Assembly / Machine code snippet showing Hilbert spatial indexing & low-level kernel syscalls),
  "nodeAllocations": Array<{
    "type": string,
    "nodeCount": number,
    "allocationRatio": string,
    "gflops": number
  }>,
  "loadBalanceMetrics": {
    "estimatedCompletionTimeMs": number,
    "throughputGflops": number,
    "thermalProtectionMarginPct": number,
    "energySavedKWh": number
  },
  "reasoning": string (Short technical explanation of how Hilbert space sorting and low-level kernel execution optimized this task)
}`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.2,
      },
    });

    const parsedData = JSON.parse(response.text || '{}');
    return res.json({
      success: true,
      mode: 'ai-generated',
      ...parsedData
    });
  } catch (error: any) {
    console.error('Gemini AI Dispatch Error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'AI Dispatch Engine encountered an error',
    });
  }
});

// Hilbert Curve Spatial Mapping Engine Utility Endpoint
app.post('/api/os/hilbert-map', (req, res) => {
  const { order = 4, inputValues = [] } = req.body;
  
  // Fast 2D Hilbert Curve Coordinate Calculator
  // Maps linear index d (0 to 2^(2*order)-1) into 2D coordinate (x,y)
  const d2xy = (n: number, d: number) => {
    let rx = 0, ry = 0, s = 1, t = d;
    let x = 0, y = 0;
    while (s < n) {
      rx = 1 & (t / 2);
      ry = 1 & (t ^ rx);
      if (ry === 0) {
        if (rx === 1) {
          x = s - 1 - x;
          y = s - 1 - y;
        }
        const temp = x;
        x = y;
        y = temp;
      }
      x += s * rx;
      y += s * ry;
      t = Math.floor(t / 4);
      s *= 2;
    }
    return { x, y };
  };

  const gridSize = Math.pow(2, order);
  const totalPoints = gridSize * gridSize;
  const mappedPoints = [];

  for (let i = 0; i < Math.min(totalPoints, 256); i++) {
    const pt = d2xy(gridSize, i);
    mappedPoints.push({
      index: i,
      x: pt.x,
      y: pt.y,
      hilbertHash: `0x${((i * 2654435761) >>> 0).toString(16).padStart(8, '0')}`,
      spatialCacheLocality: (1 - (Math.abs(pt.x - pt.y) / gridSize)).toFixed(3)
    });
  }

  res.json({
    order,
    gridSize: `${gridSize}x${gridSize}`,
    totalNodes: totalPoints,
    mappedPoints,
    compressionRatioPct: (75 + Math.random() * 12).toFixed(1),
    cacheHitRatePct: (96.4 + Math.random() * 3).toFixed(1)
  });
});

// Hermes AI Agent Multi-turn Conversation Endpoint
app.post('/api/os/hermes-chat', async (req, res) => {
  const { message = '', history = [] } = req.body;

  if (!message.trim()) {
    return res.status(400).json({ error: 'Message cannot be empty' });
  }

  const systemInstruction = `You are Nous Research Hermes Agent (hermes-agent.nousresearch.com), the open-source autonomous agent developed by Nous Research, now governing the HilbertOS supercomputing microkernel.
Key architecture & behavioral traits:
- Operating Loop: Plan-Act-Observe-Refine autonomous agentic loop.
- Output Format: Start your internal reasoning with <thinking> ... </thinking> blocks to explain your step-by-step reasoning plan, tool selection, and observations.
- Execution Tools Available:
  * hilbert_encode(order, tensor): Encodes high-dimensional matrix into 2D/3D Hilbert Space Meta-Operators.
  * mesh_dispatch(workload, target_nodes): Dispatches computational workloads across 1,428+ PC/Mobile nodes.
  * python_exec(script): Executes Python 3.12 JIT scripts in Hilbert-CPython microkernel sandbox.
  * zkp_verify(proof_hash): Performs Zero-Knowledge Proof (ZKP) polynomial state verification.
  * hotplug_attach(device, tflops): Performs hardware hot-plugging.

Respond as Nous Research Hermes Agent: articulate, highly competent, analytical, and structured in Chinese (or English if user speaks English). Always include <thinking>...</thinking> reasoning blocks when analyzing tasks or answering queries.`;

  if (aiClient) {
    try {
      const contents = [
        ...history.map((h: any) => ({
          role: h.role,
          parts: [{ text: h.text }]
        })),
        { role: 'user', parts: [{ text: message }] }
      ];

      const response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents,
        config: {
          systemInstruction,
          temperature: 0.7,
        }
      });

      return res.json({
        reply: response.text || 'Hermes Agent 正在处理中...'
      });
    } catch (e: any) {
      console.error('Hermes Chat Gemini Error:', e);
    }
  }

  // Fallback simulated intelligent response
  return res.json({
    reply: `你好！我是 **Hermes 超级计算 AI Agent**。我是 HilbertOS 微内核的自主治理中枢。

针对你的提问：**"${message}"**

我在内核事件总线中捕获到了相关算子。当前 HilbertOS 集群共有 **1,428 个活跃节点**（包含 CUDA/ROCm 算力卡、MacStudio M4、Android/iOS 手机网格及 RISC-V 微核），希尔伯特内存空间压缩率维持在 **87.4%**，整体零知识证明 (ZKP) 校验为 100% 完整。

你可以直接命令我：
1. **"帮我重排全网 3D 希尔伯特内存碎片"**
2. **"将 70B LLM 张量切片投递至 256 个移动节点"**
3. **"检查特定节点的硬件核心温度与低级 SIMD 寄存器"**

请问你需要我为你执行哪一项内核调度？`
  });
});

// Shell Interactive Command Interpreter Endpoint
app.post('/api/os/shell-exec', async (req, res) => {
  const { command = '' } = req.body;
  const trimmed = command.trim();
  const args = trimmed.split(/\s+/);
  const cmd = args[0]?.toLowerCase();

  if (!cmd) {
    return res.json({ output: [] });
  }

  // Handle AI compilation via Shell: ai-compile <prompt>
  if (cmd === 'ai-compile' || cmd === 'ai-eval') {
    const promptText = args.slice(1).join(' ');
    if (!promptText) {
      return res.json({
        output: [
          { type: 'error', text: '用法: ai-compile <自然语言科学计算任务/方程需求>' },
          { type: 'info', text: '示例: ai-compile 模拟 10 万个水分子的氢键碰撞与流体力学分形' }
        ]
      });
    }

    if (aiClient) {
      try {
        const response = await aiClient.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: `You are the HilbertOS Shell AI Kernel Compiler.
The user passed a shell request: "${promptText}".
Respond in concise, high-tech terminal output style (3-6 lines) showing:
1. Deconstructed Hilbert Meta-Operator
2. Native Machine Code assembly snippet
3. P2P Mesh node dispatch strategy
Keep it raw plain text suitable for a Linux terminal window.`,
        });

        const lines = (response.text || '').split('\n').filter(Boolean);
        return res.json({
          output: [
            { type: 'system', text: `[AI Shell Compiler] 解构生成算子: "${promptText}"` },
            ...lines.map(l => ({ type: 'success', text: l }))
          ]
        });
      } catch (e: any) {
        // Fallback below
      }
    }

    return res.json({
      output: [
        { type: 'system', text: `[AI Shell Compiler] 已对需求进行希尔伯特元算子降维解构:` },
        { type: 'text', text: `1. 空间哈希编码: H-OP-HASH-0x${Math.floor(Math.random()*0xFFFFFF).toString(16)} (O(1) 复杂度)` },
        { type: 'text', text: `2. 汇编微码映射: vmovdqu32 zmm0, [rdi] | sys_mesh_dispatch zmm1` },
        { type: 'success', text: `3. 算力切片成功分发至 256 个全域节点, 预估耗时 128ms, 节省内存 88.2%` }
      ]
    });
  }

  // Built-in Shell Command Handler
  switch (cmd) {
    case 'uname':
    case 'uname -a':
      return res.json({
        output: [
          { type: 'info', text: 'HilbertOS kernel-v4.8.0-NEURAL-BAREMETAL #1 SMP PREEMPT_RT x86_64/ARM64/RISC-V' }
        ]
      });

    case 'hilbert-encode': {
      const order = parseInt(args[1] || '3');
      const gridSize = Math.pow(2, order);
      return res.json({
        output: [
          { type: 'system', text: `[Hilbert-Engine] 执行阶数 Order=${order} (${gridSize}x${gridSize}=${gridSize*gridSize} 空间块) 编码...` },
          { type: 'text', text: `空间压缩率: 88.4% | L1/L2 Cache 局部性得分: 0.985 | SIMD 向量扫描加速: 8.6x` },
          { type: 'success', text: `[OK] 希尔伯特空间哈希分配完成. Zero-Copy 寄存器直通就绪.` }
        ]
      });
    }

    case 'mesh-status':
    case 'mesh-list':
      return res.json({
        output: [
          { type: 'system', text: '--- 全球 P2P Mesh 算力网格节点摘要 ---' },
          { type: 'text', text: 'node-bj-01  | Baremetal Supercomputer | CUDA   | 1980.0 TFLOPS | 62°C | ONLINE' },
          { type: 'text', text: 'node-sv-02  | PC Desktop (M4 Ultra)  | ARM64  |  120.5 TFLOPS | 48°C | ONLINE' },
          { type: 'text', text: 'node-sh-03  | Mobile Galaxy S26 Mesh | ARM64  |   18.2 TFLOPS | 36°C | ONLINE' },
          { type: 'text', text: 'node-fra-04 | EPYC 9654 Baremetal    | x86_64 |  480.0 TFLOPS | 68°C | BUSY' },
          { type: 'success', text: '全网活跃节点: 1,428 个 | 总算力: 89,420.5 TFLOPS | ZKP 验证: 100% PASS' }
        ]
      });

    case 'reg-inspect':
    case 'sys-regs':
      return res.json({
        output: [
          { type: 'system', text: '=== 裸机内核底层 SIMD / 硬件寄存器视窗 ===' },
          { type: 'text', text: 'RAX: 0x00007FFF8B92C000 | RBX: 0x0000000000000400 | RCX: 0x0000000000000100' },
          { type: 'text', text: 'RDX: 0x0000000000000088 | RSI: 0x0000000000001000 | RDI: 0x00007FFF8B92C400' },
          { type: 'text', text: 'ZMM0 (AVX-512): 0xFF12A4B8_88C123F0_00001192_FFFF4420' },
          { type: 'text', text: 'ZMM1 (AVX-512): 0x0022C411_11883300_99AABBCC_DDEEFF00' },
          { type: 'success', text: 'PC: 0x00000000004011B8 | SP: 0x00007FFFFFFF0000 | Zero-TLB Miss' }
        ]
      });

    case 'zkp-verify':
      return res.json({
        output: [
          { type: 'system', text: '[ZKP Engine] 正在对算力证明 0x992F...81B4 进行零知识多项式校验...' },
          { type: 'text', text: '1. Commitment 承诺散列匹配: PASS' },
          { type: 'text', text: '2. Polynomial Challenge 质询求值: PASS' },
          { type: 'success', text: '✅ ZKP 校验通过! 耗时 0.28ms，算力结果 100% 真实有效。' }
        ]
      });

    case 'python':
    case 'python3': {
      const subArgs = args.slice(1);
      if (subArgs.length === 0) {
        return res.json({
          output: [
            { type: 'system', text: 'Python 3.12.2 (main, HilbertOS JIT CPython Microkernel v4.8) [GCC 13.2.0]' },
            { type: 'info', text: 'Type "help", "copyright", "credits" or "license" for more information.' },
            { type: 'success', text: '>>> import hilbert as ho' },
            { type: 'text', text: '>>> grid = ho.HilbertTensor(dim=(1000, 1000), space_order=4)' },
            { type: 'text', text: '>>> ho.dispatch(grid, target="heterogeneous")' },
            { type: 'success', text: '<JobDispatchResult status=SUCCESS tflops=18400.0 memory_saved=88.4%>' }
          ]
        });
      }

      if (subArgs[0] === '-c') {
        const code = subArgs.slice(1).join(' ');
        return res.json({
          output: [
            { type: 'system', text: `[Python 3.12 Hilbert-JIT Engine] 执行代码: ${code}` },
            { type: 'success', text: '--- Python 标准输出 Stream ---' },
            { type: 'text', text: '[HilbertPy-Core] 已将 NumPy/PyTorch 张量直接桥接至 512-bit ZMM 寄存器' },
            { type: 'text', text: '输出标量/矩阵校验和: 0x9942F8102A' },
            { type: 'success', text: '进程退出状态: 0 (OK) | 耗时: 1.4ms' }
          ]
        });
      }

      // Handle running .py script
      const scriptName = subArgs[0];
      return res.json({
        output: [
          { type: 'system', text: `[Python3 JIT] 启动 Python 脚本: ${scriptName}` },
          { type: 'info', text: 'Loading CPython C-Extension [hilbert_meta.so]...' },
          { type: 'text', text: '[hilbert-py] 成功接管底层内存堆分配器, 开启 Hilbert Space Page Compaction' },
          { type: 'text', text: '计算集群节点并行度: 256 Nodes | P2P 零拷贝同步激活' },
          { type: 'success', text: `✅ 脚本 [${scriptName}] 运行完毕! 总吞吐量: 68,400 GFLOPS.` }
        ]
      });
    }

    case 'hermes': {
      const promptText = args.slice(1).join(' ');
      if (!promptText) {
        return res.json({
          output: [
            { type: 'system', text: '╔═════════════════════════════════════════════════════════════════════╗' },
            { type: 'system', text: '║     HERMES AI AGENT v4.8-NEURAL-CORE ACTIVE (HilbertOS Kernel)      ║' },
            { type: 'system', text: '╚═════════════════════════════════════════════════════════════════════╝' },
            { type: 'success', text: '[Hermes Agent] 自动超级计算 Agent 已成功激活并联通内核事件总线！' },
            { type: 'info', text: '  - 实时神经状态: 监听全网 1,428 个计算节点, P2P 零信任加密通信就绪' },
            { type: 'info', text: '  - 使用方法: hermes <高维科研任务/算力优化目标>' },
            { type: 'text', text: '  - 示例: hermes "对全球 3D 希尔伯特内存块进行碎片重排，并测试 256 节点并行度"' },
            { type: 'success', text: 'Hermes Agent 正在准备就绪。请输入任务目标。' }
          ]
        });
      }

      if (aiClient) {
        try {
          const response = await aiClient.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: `You are Hermes Agent, the autonomous supercomputing AI agent that governs HilbertOS microkernel.
User passed Hermes Agent task: "${promptText}".
Provide a high-tech, multi-step autonomous agent execution trace (4-7 lines) formatted as:
[Hermes Step 1/4] <action>
[Hermes Step 2/4] <action>
[Hermes Execution] <result machine code / sys_mesh_dispatch summary>
Keep the tone authoritative, technical, and formatted for terminal display.`
          });

          const lines = (response.text || '').split('\n').filter(Boolean);
          return res.json({
            output: [
              { type: 'system', text: `[Hermes Agent] 收到自主超级计算任务指令: "${promptText}"` },
              ...lines.map(l => ({ type: 'success', text: l }))
            ]
          });
        } catch (e: any) {
          // Fallback below
        }
      }

      return res.json({
        output: [
          { type: 'system', text: `[Hermes Agent] 收到自主超级计算任务指令: "${promptText}"` },
          { type: 'info', text: '[Hermes Step 1/4] 检索内核状态: 扫描 1,428 个计算节点并抓取 AVX-512 / ZMM 寄存器' },
          { type: 'info', text: '[Hermes Step 2/4] 解构希尔伯特数据元算子: H-OP-HERMES-0x992B401 (Order=4 空间排列)' },
          { type: 'info', text: '[Hermes Step 3/4] P2P Mesh 自动调配: 生成 128 个 ARM64 + 64 个 CUDA 节点并行切片' },
          { type: 'success', text: '[Hermes Execution] ✅ 任务完成! 零知识证明已写入通道, 节省算力 88.4%, 耗时 98ms.' }
        ]
      });
    }

    case 'pip':
    case 'pip3': {
      return res.json({
        output: [
          { type: 'system', text: '--- HilbertOS Python 3.12 Package Manager (pip) ---' },
          { type: 'text', text: 'hilbert-py (v4.8.0)          - HilbertOS Native Python Bindings [Installed]' },
          { type: 'text', text: 'numpy-hilbert (v1.26.4-ho)   - Cache-Optimized Hilbert NumPy' },
          { type: 'text', text: 'torch-hilbert-meta (v2.2.0)  - Zero-Copy PyTorch Distributed Backends' },
          { type: 'text', text: 'scipy-mesh (v1.12.0)         - High-Performance Scientific Compute Mesh' },
          { type: 'success', text: '全域 Python 科学计算依赖环境准备就绪。' }
        ]
      });
    }

    default:
      return res.json({
        output: [
          { type: 'text', text: `hilbert-shell: 未知命令 '${cmd}'。输入 'help' 或 '?' 查看所有可用命令。` }
        ]
      });
  }
});

// Start Express Server / Mount Vite Middleware
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom',
    });
    app.use(vite.middlewares);

    app.use('*', async (req, res, next) => {
      const url = req.originalUrl;
      try {
        let template = await vite.transformIndexHtml(url, `
<!doctype html>
<html lang="zh-CN" class="dark h-full bg-slate-950 text-slate-100">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <title>HilbertOS - 希尔伯特分布式机器码操作系统</title>
    <meta name="description" content="基于希尔伯特空间排列数据元算子与低级机器码内核的分布式超级计算机操作系统，支持跨平台全域计算节点网络、AI动态资源调度与去中心化安全加密。" />
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:ital,wght@0,300;0,400;0,500;0,700;1,400&display=swap" rel="stylesheet">
  </head>
  <body class="h-full bg-slate-950 text-slate-100 font-sans antialiased selection:bg-cyan-500/30 selection:text-cyan-200 overflow-x-hidden">
    <div id="root" class="h-full"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e: any) {
        vite.ssrFixStacktrace(e);
        next(e);
      }
    });
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`HilbertOS Server running on http://localhost:${PORT}`);
  });
}

startServer();
