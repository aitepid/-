export type SystemTab = 'cluster' | 'hilbert' | 'kernel' | 'security' | 'deploy' | 'api' | 'shell';

export type NodeArchitecture = 'x86_64' | 'ARM64' | 'RISC-V' | 'GPU_CUDA' | 'GPU_ROCM';
export type NodeType = 'PC Desktop' | 'Mobile Device' | 'Baremetal Supercomputer' | 'Edge IoT' | 'VM Instance';
export type NodeStatus = 'online' | 'busy' | 'syncing' | 'quarantined';

export interface ComputeNode {
  id: string;
  name: string;
  type: NodeType;
  architecture: NodeArchitecture;
  location: string;
  lat: number;
  lng: number;
  tflops: number;
  cpuUsage: number;
  vramUsageGb: number;
  totalVramGb: number;
  hilbertCompressionPct: number;
  zkpVerified: boolean;
  activeThreads: number;
  temperatureC: number;
  latencyMs: number;
  status: NodeStatus;
  ipHash: string;
  joinedAt: string;
}

export interface RegisterState {
  RAX: string;
  RBX: string;
  RCX: string;
  RDX: string;
  RSI: string;
  RDI: string;
  R8: string;
  R9: string;
  R10: string;
  ZMM0: string; // AVX-512 Hilbert Tensor Vector Register
  ZMM1: string;
  PC: string;
  SP: string;
}

export interface DeconstructedOperator {
  id: string;
  name: string;
  complexity: string;
  spatialLocalityScore: number;
  memorySavingsPct: number;
}

export interface NodeAllocation {
  type: string;
  nodeCount: number;
  allocationRatio: string;
  gflops: number;
}

export interface DispatchResult {
  success: boolean;
  mode: 'ai-generated' | 'simulated';
  workloadName: string;
  deconstructedOperators: DeconstructedOperator[];
  machineCodeSnippet: string;
  nodeAllocations: NodeAllocation[];
  loadBalanceMetrics: {
    estimatedCompletionTimeMs: number;
    throughputGflops: number;
    thermalProtectionMarginPct: number;
    energySavedKWh: number;
  };
  reasoning: string;
}

export interface KernelLogEntry {
  id: string;
  timestamp: string;
  level: 'SYS_INFO' | 'KERNEL_WARN' | 'DISPATCH' | 'ZKP_PROOF' | 'HOT_PLUG';
  message: string;
  subsystem: string;
}
