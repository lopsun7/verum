export type SupportedChain = "Ethereum" | "Base" | "Arbitrum" | "Optimism";

export type SupportedProtocol = "Aave" | "Morpho" | "Compound" | "Spark";

export type StableAsset = "USDC";

export interface PortfolioMetric {
  activeBorrowUsd: number;
  currentWeightedBorrowApr: number;
  bestPredictedBorrowApr: number;
  projectedMonthlySavingsUsd: number;
  aiConfidence: number;
  executionReadiness: number;
}

export interface ChainAllocation {
  chain: SupportedChain;
  valueUsd: number;
  share: number;
  change24h: number;
}

export interface ProtocolAllocation {
  protocol: SupportedProtocol;
  chain: SupportedChain;
  asset: StableAsset;
  availableLiquidityUsd: number;
  currentApr: number;
  predictedApr: number;
  utilization: number;
  liquidityScore: number;
  riskScore: number;
  health: "Stable" | "Monitor" | "Volatile";
  currentMonthlyCostUsd: number;
  predictedMonthlyCostUsd: number;
  isCurrentPosition?: boolean;
}

export interface BorrowForecastPoint {
  timestamp: string;
  aave: number;
  morpho: number;
  compound: number;
  spark: number;
}

export interface RiskVector {
  protocol: SupportedProtocol;
  smartContractRisk: number;
  auditCoverage: number;
  liquidityHealth: number;
  governanceDecentralization: number;
  oracleDependency: number;
  badDebtRisk: number;
  exploitProbability: number;
  tvlTrend: number;
}

export interface AgentLog {
  id: string;
  timestamp: string;
  agent: string;
  level: "info" | "warn" | "critical";
  message: string;
  chain?: SupportedChain;
}

export interface AllocationMove {
  id: string;
  timestamp: string;
  fromProtocol: SupportedProtocol;
  toProtocol: SupportedProtocol;
  fromChain: SupportedChain;
  toChain: SupportedChain;
  asset: StableAsset;
  amountUsd: number;
  expectedMonthlySavingsUsd: number;
  confidence: number;
  reason: string;
  status: "Queued" | "Simulating" | "Ready";
  simulatedTxHash: string;
  steps: string[];
}

export interface WalletSummary {
  address: string;
  chain: SupportedChain;
  walletProvider: "MetaMask" | "WalletConnect" | "Coinbase Wallet";
  balances: Array<{
    symbol: string;
    amount: number;
    usdValue: number;
  }>;
}

export interface DashboardPayload {
  metric: PortfolioMetric;
  chains: ChainAllocation[];
  allocations: ProtocolAllocation[];
  forecasts: BorrowForecastPoint[];
  riskVectors: RiskVector[];
  agentLogs: AgentLog[];
  moves: AllocationMove[];
  wallets: WalletSummary[];
}

export const dashboardMock: DashboardPayload = {
  metric: {
    activeBorrowUsd: 5000,
    currentWeightedBorrowApr: 6.4,
    bestPredictedBorrowApr: 5.9,
    projectedMonthlySavingsUsd: 3.0,
    aiConfidence: 88,
    executionReadiness: 94
  },
  chains: [
    { chain: "Ethereum", valueUsd: 10900, share: 58, change24h: 1.2 },
    { chain: "Base", valueUsd: 5200, share: 28, change24h: 2.4 },
    { chain: "Arbitrum", valueUsd: 1800, share: 10, change24h: -0.3 },
    { chain: "Optimism", valueUsd: 700, share: 4, change24h: 0.5 }
  ],
  allocations: [
    {
      protocol: "Aave",
      chain: "Ethereum",
      asset: "USDC",
      availableLiquidityUsd: 3_600_000,
      currentApr: 6.4,
      predictedApr: 7.1,
      utilization: 82,
      liquidityScore: 88,
      riskScore: 22,
      health: "Monitor",
      currentMonthlyCostUsd: 26.67,
      predictedMonthlyCostUsd: 29.58,
      isCurrentPosition: true
    },
    {
      protocol: "Compound",
      chain: "Ethereum",
      asset: "USDC",
      availableLiquidityUsd: 2_900_000,
      currentApr: 5.7,
      predictedApr: 5.9,
      utilization: 74,
      liquidityScore: 91,
      riskScore: 14,
      health: "Stable",
      currentMonthlyCostUsd: 23.75,
      predictedMonthlyCostUsd: 24.58
    },
    {
      protocol: "Morpho",
      chain: "Base",
      asset: "USDC",
      availableLiquidityUsd: 1_100_000,
      currentApr: 5.1,
      predictedApr: 6.9,
      utilization: 93,
      liquidityScore: 62,
      riskScore: 31,
      health: "Volatile",
      currentMonthlyCostUsd: 21.25,
      predictedMonthlyCostUsd: 28.75
    },
    {
      protocol: "Spark",
      chain: "Ethereum",
      asset: "USDC",
      availableLiquidityUsd: 2_100_000,
      currentApr: 5.9,
      predictedApr: 6.1,
      utilization: 78,
      liquidityScore: 84,
      riskScore: 18,
      health: "Stable",
      currentMonthlyCostUsd: 24.58,
      predictedMonthlyCostUsd: 25.42
    }
  ],
  forecasts: [
    { timestamp: "00:00", aave: 6.4, morpho: 5.1, compound: 5.7, spark: 5.9 },
    { timestamp: "04:00", aave: 6.6, morpho: 5.8, compound: 5.8, spark: 6.0 },
    { timestamp: "08:00", aave: 6.8, morpho: 6.3, compound: 5.8, spark: 6.0 },
    { timestamp: "12:00", aave: 7.0, morpho: 6.7, compound: 5.9, spark: 6.1 },
    { timestamp: "16:00", aave: 7.1, morpho: 6.9, compound: 5.9, spark: 6.1 },
    { timestamp: "20:00", aave: 7.0, morpho: 6.8, compound: 6.0, spark: 6.2 }
  ],
  riskVectors: [
    { protocol: "Aave", smartContractRisk: 86, auditCoverage: 94, liquidityHealth: 88, governanceDecentralization: 89, oracleDependency: 72, badDebtRisk: 84, exploitProbability: 8, tvlTrend: 91 },
    { protocol: "Compound", smartContractRisk: 82, auditCoverage: 92, liquidityHealth: 91, governanceDecentralization: 87, oracleDependency: 69, badDebtRisk: 88, exploitProbability: 7, tvlTrend: 84 },
    { protocol: "Morpho", smartContractRisk: 78, auditCoverage: 86, liquidityHealth: 62, governanceDecentralization: 80, oracleDependency: 67, badDebtRisk: 71, exploitProbability: 15, tvlTrend: 79 },
    { protocol: "Spark", smartContractRisk: 81, auditCoverage: 90, liquidityHealth: 84, governanceDecentralization: 73, oracleDependency: 64, badDebtRisk: 82, exploitProbability: 10, tvlTrend: 80 }
  ],
  agentLogs: [
    { id: "log-1", timestamp: "14:12:11", agent: "RateDataAgent", level: "info", message: "Collected mock USDC borrow APRs across Aave, Compound, Morpho, and Spark.", chain: "Ethereum" },
    { id: "log-2", timestamp: "14:12:17", agent: "PredictionAgent", level: "warn", message: "Morpho utilization above 90%; predicted borrow APR increased by 1.8 percentage points.", chain: "Base" },
    { id: "log-3", timestamp: "14:12:24", agent: "DecisionAgent", level: "info", message: "Compound selected as best risk-adjusted venue after APR, liquidity, and utilization comparison.", chain: "Ethereum" },
    { id: "log-4", timestamp: "14:12:31", agent: "ExecutionAgent", level: "critical", message: "Prepared simulated migration plan with fake receipt 0xFAKE_AGENT_FORGE_2026_DEFI_OPTIMIZER.", chain: "Ethereum" }
  ],
  moves: [
    {
      id: "move-1",
      timestamp: "14:12:32",
      fromProtocol: "Aave",
      toProtocol: "Compound",
      fromChain: "Ethereum",
      toChain: "Ethereum",
      asset: "USDC",
      amountUsd: 5000,
      expectedMonthlySavingsUsd: 3.0,
      confidence: 0.88,
      reason: "Compound has the best risk-adjusted predicted borrow APR. Morpho is cheaper right now, but 93% utilization creates rate volatility risk.",
      status: "Ready",
      simulatedTxHash: "0xFAKE_AGENT_FORGE_2026_DEFI_OPTIMIZER",
      steps: [
        "Repay existing USDC debt on Aave.",
        "Withdraw ETH collateral from Aave.",
        "Deposit ETH collateral into Compound.",
        "Borrow 5,000 USDC from Compound."
      ]
    },
    {
      id: "move-2",
      timestamp: "14:13:08",
      fromProtocol: "Aave",
      toProtocol: "Spark",
      fromChain: "Ethereum",
      toChain: "Ethereum",
      asset: "USDC",
      amountUsd: 5000,
      expectedMonthlySavingsUsd: 1.25,
      confidence: 0.73,
      reason: "Spark is stable, but still slightly more expensive than Compound on a predicted basis.",
      status: "Simulating",
      simulatedTxHash: "0xFAKE_AGENT_FORGE_2026_SPARK_FALLBACK",
      steps: [
        "Repay USDC debt on Aave.",
        "Move ETH collateral to Spark.",
        "Open replacement USDC borrow on Spark."
      ]
    }
  ],
  wallets: [
    {
      address: "0xA91E...5F0C",
      chain: "Ethereum",
      walletProvider: "MetaMask",
      balances: [
        { symbol: "ETH Collateral", amount: 4.2, usdValue: 14700 },
        { symbol: "USDC Debt", amount: 5000, usdValue: 5000 },
        { symbol: "Health Factor", amount: 1.86, usdValue: 1.86 }
      ]
    },
    {
      address: "0x88F2...9EA1",
      chain: "Base",
      walletProvider: "WalletConnect",
      balances: [
        { symbol: "USDC Buffer", amount: 2400, usdValue: 2400 },
        { symbol: "cbETH Collateral", amount: 1.1, usdValue: 3850 }
      ]
    }
  ]
};
