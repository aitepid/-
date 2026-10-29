import React, { useState } from 'react';
import { 
  Code2, 
  Terminal, 
  Play, 
  Copy, 
  Check, 
  FileText, 
  CheckCircle2, 
  Loader2, 
  Database,
  Globe
} from 'lucide-react';

export const DeveloperApi: React.FC = () => {
  const [activeLang, setActiveLang] = useState<'python' | 'rust' | 'rest' | 'ts'>('python');
  const [copied, setCopied] = useState<boolean>(false);
  const [sandboxEndpoint, setSandboxEndpoint] = useState<string>('/api/os/ai-dispatch');
  const [sandboxPayload, setSandboxPayload] = useState<string>(JSON.stringify({
    workloadName: '基因组学 DNA 序列全比对',
    description: '100,000 条长读长 DNA 序列切片，利用希尔伯特空间哈希分配至全网 256 个节点协同做 BLAST 相似度比对。',
    targetArchitecture: 'Heterogeneous (x86_64 + ARM64)',
    nodeLimit: 128
  }, null, 2));

  const [sandboxResponse, setSandboxResponse] = useState<any>(null);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);

  const pythonCode = `# HilbertOS Python HPC SDK
from hilbert_hpc import HilbertClient, HilbertOperator

# 1. 连接 HilbertOS 去中心化算力集群
client = HilbertClient(
    mesh_seed="https://grid.hilbertos.org",
    auth_zkp_key="0x7f4a...99b2"
)

# 2. 构造希尔伯特空间排列数据元算子
tensor_data = get_large_scientific_matrix() # 10GB 科学计算矩阵
hilbert_operator = HilbertOperator.compress(
    matrix=tensor_data,
    space_order=4, # 希尔伯特 4 阶分形编码
    spatial_locality_mode="CACHE_FRIENDLY"
)

# 3. 全局多端自动负载均衡调度
job = client.dispatch(
    operator=hilbert_operator,
    target_arch=["x86_64", "ARM64", "RISC-V"],
    auto_rebalance=True
)

print(f"Task Dispatched! Expected completion: {job.estimated_time_ms}ms")
result = job.wait_for_result()
print(f"Result verified with ZKP proof: {result.proof_valid}")`;

  const rustCode = `// HilbertOS Native Rust FFI Bindings
use hilbert_native::{KernelEngine, HilbertSpace, MeshDispatch};

fn main() -> Result<(), Box<dyn std::error::Error>> {
    // 初始化低级机器码内核引擎
    let mut kernel = KernelEngine::init_baremetal()?;

    // 希尔伯特排列空间数据编码 (100% 寄存器直通)
    let raw_tensor = vec![0.0f32; 1_000_000];
    let hilbert_space = HilbertSpace::encode_2d(&raw_tensor, 4)?;

    // 触发 SYS_HILBERT_MESH_DISPATCH 系统微码调用
    let proof = kernel.execute_zkp_dispatch(&hilbert_space)?;
    
    println!("Hilbert Native execution completed with proof: {:?}", proof.hash);
    Ok(())
}`;

  const restApiDoc = `POST /api/os/ai-dispatch HTTP/1.1
Host: grid.hilbertos.org
Content-Type: application/json

{
  "workloadName": "量子蒙特卡洛矩阵分解",
  "description": "对高维波函数矩阵进行多节点分布采样",
  "targetArchitecture": "Heterogeneous",
  "nodeLimit": 64
}

-- 响应 200 OK --
{
  "success": true,
  "workloadName": "量子蒙特卡洛矩阵分解",
  "deconstructedOperators": [...],
  "machineCodeSnippet": "; Assembly code snippet...",
  "loadBalanceMetrics": {
    "estimatedCompletionTimeMs": 112,
    "throughputGflops": 68400
  }
}`;

  const tsCode = `import { HilbertOS } from '@hilbert-os/sdk';

const os = new HilbertOS({
  endpoint: 'http://localhost:3000/api/os',
});

// 提交科研计算任务
const response = await os.aiDispatch({
  workloadName: '大模型张量切片推理',
  description: '将 70B 模型切片至跨端手机和 PC',
  nodeLimit: 128
});

console.log('Deconstructed Operators:', response.deconstructedOperators);`;

  const getActiveCode = () => {
    switch (activeLang) {
      case 'python': return pythonCode;
      case 'rust': return rustCode;
      case 'rest': return restApiDoc;
      case 'ts': return tsCode;
    }
  };

  const handleRunApiTest = async () => {
    setIsExecuting(true);
    try {
      const res = await fetch(sandboxEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: sandboxPayload
      });
      const data = await res.json();
      setSandboxResponse(data);
    } catch (err: any) {
      setSandboxResponse({ error: err.message || 'API Call Failed' });
    } finally {
      setIsExecuting(false);
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(getActiveCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4 font-mono text-xs">
      {/* Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Code2 className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-bold text-cyan-300">
              开发者 API & HPC 科研接入中心 (Developer API & SDK Sandbox)
            </h2>
          </div>
          <p className="text-xs text-slate-300 font-sans">
            HilbertOS 提供多语言标准 SDK 与 REST/RPC 接口，支持现有的高校、科研院所及企业 HPC 业务无缝接入，将算力任务接入 HilbertOS 全球去中心化计算生态。
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Code Documentation View (Col 6) */}
        <div className="lg:col-span-6 bg-slate-950 rounded-xl border border-slate-800 p-4 space-y-3 shadow-xl flex flex-col">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
              {[
                { id: 'python', label: 'Python HPC SDK' },
                { id: 'rust', label: 'Rust Native FFI' },
                { id: 'rest', label: 'REST / RPC API' },
                { id: 'ts', label: 'TypeScript SDK' },
              ].map(lang => (
                <button
                  key={lang.id}
                  onClick={() => setActiveLang(lang.id as any)}
                  className={`px-2.5 py-1 rounded text-xs transition-all ${
                    activeLang === lang.id
                      ? 'bg-cyan-500 text-slate-950 font-bold'
                      : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>

            <button
              onClick={copyCode}
              className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 text-[11px]"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? '已复制' : '复制'}
            </button>
          </div>

          <pre className="flex-1 bg-slate-900 p-3.5 rounded-lg border border-slate-800 text-emerald-400 overflow-x-auto leading-relaxed max-h-[380px]">
            <code>{getActiveCode()}</code>
          </pre>
        </div>

        {/* Live API Test Bench Sandbox (Col 6) */}
        <div className="lg:col-span-6 bg-slate-950 rounded-xl border border-slate-800 p-4 space-y-3 shadow-xl flex flex-col">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="font-bold text-slate-200 flex items-center gap-2">
              <Play className="w-4 h-4 text-emerald-400" />
              在线 API 交互测试台 (Live API Bench Sandbox)
            </span>
            <span className="text-[10px] text-emerald-400">实时交互模拟</span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="bg-emerald-950 text-emerald-300 px-2 py-1 rounded border border-emerald-800 font-bold">
                POST
              </span>
              <input
                type="text"
                value={sandboxEndpoint}
                onChange={(e) => setSandboxEndpoint(e.target.value)}
                className="flex-1 bg-slate-900 border border-slate-800 rounded p-1.5 text-slate-200 outline-none text-xs"
              />
            </div>

            <div>
              <label className="text-slate-400 block text-[10px] mb-1">请求 Payload (JSON)</label>
              <textarea
                value={sandboxPayload}
                onChange={(e) => setSandboxPayload(e.target.value)}
                rows={5}
                className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-slate-200 outline-none font-mono text-[11px]"
              />
            </div>

            <button
              onClick={handleRunApiTest}
              disabled={isExecuting}
              className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-extrabold rounded flex items-center justify-center gap-1.5 transition-all shadow cursor-pointer disabled:opacity-50"
            >
              {isExecuting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-950" />
                  发送请求到 HilbertOS API...
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-slate-950" />
                  发送 API 测试请求
                </>
              )}
            </button>
          </div>

          {/* Response Payload Viewer */}
          {sandboxResponse && (
            <div className="space-y-1 pt-2 border-t border-slate-900">
              <span className="text-slate-400 block text-[10px] font-bold">
                API 响应结果 (Response 200 OK)
              </span>
              <pre className="p-3 bg-slate-900 rounded border border-slate-800 text-cyan-300 text-[11px] overflow-x-auto max-h-[160px]">
                <code>{JSON.stringify(sandboxResponse, null, 2)}</code>
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
