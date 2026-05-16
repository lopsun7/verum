export type SupportedChain =
  | "Ethereum"
  | "Base"
  | "Arbitrum"
  | "Optimism"
  | "Polygon"
  | "Solana";

export type SupportedProtocol =
  | "Aave"
  | "Morpho"
  | "Compound"
  | "Spark"
  | "Pendle"
  | "Ethena"
  | "MakerDAO";

export type StableAsset = "USDC" | "DAI" | "USDT" | "sUSDe";

export interface PortfolioMetric {
  totalValueUsd: number;
  predictedNetApy: number;
  realizedMonthlyAlpha: number;
  aiConfidence: number;
  gasEfficiency: number;
  protectedCapital: number;
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
  valueUsd: number;
  currentApy: number;
  predictedApy: number;
  riskScore: number;
  health: "Healthy" | "Watch" | "Exit";
}

export interface YieldForecastPoint {
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
  expectedGainBps: number;
  confidence: number;
  reason: string;
  status: "Queued" | "Simulating" | "Executing" | "Settled";
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
  forecasts: YieldForecastPoint[];
  riskVectors: RiskVector[];
  agentLogs: AgentLog[];
  moves: AllocationMove[];
  wallets: WalletSummary[];
}

export const dashboardMock: DashboardPayload = {
  metric: {
    totalValueUsd: 12480000,
    predictedNetApy: 12.8,
    realizedMonthlyAlpha: 3.4,
    aiConfidence: 91,
    gasEfficiency: 87,
    protectedCapital: 93
  },
  chains: [
    { chain: "Ethereum", valueUsd: 3980000, share: 31.9, change24h: 2.1 },
    { chain: "Base", valueUsd: 2560000, share: 20.5, change24h: 5.6 },
    { chain: "Arbitrum", valueUsd: 2240000, share: 17.9, change24h: 1.4 },
    { chain: "Optimism", valueUsd: 1710000, share: 13.7, change24h: -0.4 },
    { chain: "Polygon", valueUsd: 1090000, share: 8.7, change24h: 1.1 },
    { chain: "Solana", valueUsd: 900000, share: 7.3, change24h: 4.9 }
  ],
  allocations: [
    { protocol: "Aave", chain: "Ethereum", asset: "USDC", valueUsd: 2400000, currentApy: 6.2, predictedApy: 7.8, riskScore: 18, health: "Healthy" },
    { protocol: "Morpho", chain: "Base", asset: "USDC", valueUsd: 1840000, currentApy: 8.9, predictedApy: 11.6, riskScore: 22, health: "Healthy" },
    { protocol: "Compound", chain: "Arbitrum", asset: "USDT", valueUsd: 1360000, currentApy: 5.4, predictedApy: 6.8, riskScore: 27, health: "Watch" },
    { protocol: "Spark", chain: "Optimism", asset: "DAI", valueUsd: 1480000, currentApy: 7.1, predictedApy: 8.3, riskScore: 20, health: "Healthy" },
    { protocol: "Pendle", chain: "Ethereum", asset: "sUSDe", valueUsd: 2140000, currentApy: 13.8, predictedApy: 14.9, riskScore: 35, health: "Watch" },
    { protocol: "Ethena", chain: "Base", asset: "sUSDe", valueUsd: 1880000, currentApy: 15.1, predictedApy: 16.3, riskScore: 38, health: "Watch" },
    { protocol: "MakerDAO", chain: "Polygon", asset: "DAI", valueUsd: 1390000, currentApy: 4.7, predictedApy: 5.1, riskScore: 16, health: "Healthy" }
  ],
  forecasts: [
    { timestamp: "00:00", aave: 6.2, morpho: 8.9, compound: 5.4, spark: 7.1 },
    { timestamp: "04:00", aave: 6.6, morpho: 9.4, compound: 5.6, spark: 7.2 },
    { timestamp: "08:00", aave: 7.1, morpho: 10.1, compound: 5.9, spark: 7.5 },
    { timestamp: "12:00", aave: 7.5, morpho: 10.7, compound: 6.2, spark: 7.9 },
    { timestamp: "16:00", aave: 7.8, morpho: 11.6, compound: 6.8, spark: 8.3 },
    { timestamp: "20:00", aave: 7.4, morpho: 11.1, compound: 6.5, spark: 8.0 }
  ],
  riskVectors: [
    { protocol: "Aave", smartContractRisk: 88, auditCoverage: 94, liquidityHealth: 93, governanceDecentralization: 91, oracleDependency: 72, badDebtRisk: 90, exploitProbability: 8, tvlTrend: 84 },
    { protocol: "Morpho", smartContractRisk: 81, auditCoverage: 87, liquidityHealth: 86, governanceDecentralization: 79, oracleDependency: 68, badDebtRisk: 83, exploitProbability: 16, tvlTrend: 90 },
    { protocol: "Compound", smartContractRisk: 79, auditCoverage: 91, liquidityHealth: 78, governanceDecentralization: 89, oracleDependency: 74, badDebtRisk: 76, exploitProbability: 19, tvlTrend: 66 },
    { protocol: "Spark", smartContractRisk: 84, auditCoverage: 88, liquidityHealth: 82, governanceDecentralization: 72, oracleDependency: 65, badDebtRisk: 88, exploitProbability: 12, tvlTrend: 77 },
    { protocol: "Pendle", smartContractRisk: 71, auditCoverage: 80, liquidityHealth: 74, governanceDecentralization: 69, oracleDependency: 62, badDebtRisk: 70, exploitProbability: 24, tvlTrend: 83 },
    { protocol: "Ethena", smartContractRisk: 68, auditCoverage: 78, liquidityHealth: 75, governanceDecentralization: 61, oracleDependency: 57, badDebtRisk: 72, exploitProbability: 29, tvlTrend: 88 },
    { protocol: "MakerDAO", smartContractRisk: 90, auditCoverage: 96, liquidityHealth: 88, governanceDecentralization: 83, oracleDependency: 76, badDebtRisk: 92, exploitProbability: 6, tvlTrend: 71 }
  ],
  agentLogs: [
    { id: "log-1", timestamp: "13:04:11", agent: "Yield Prediction Agent", level: "info", message: "Base Morpho USDC utilization projected to rise 11.4% over the next 6h.", chain: "Base" },
    { id: "log-2", timestamp: "13:04:19", agent: "Sentiment Agent", level: "warn", message: "Governance chatter detected around Pendle PT curve compression.", chain: "Ethereum" },
    { id: "log-3", timestamp: "13:04:24", agent: "Risk Analysis Agent", level: "info", message: "MakerDAO DAI stability buffer remains above internal safety threshold.", chain: "Polygon" },
    { id: "log-4", timestamp: "13:04:36", agent: "Execution Agent", level: "critical", message: "Simulated bridge route switched from canonical to Hyperlane fallback for lower slippage.", chain: "Arbitrum" },
    { id: "log-5", timestamp: "13:04:42", agent: "Explainability Agent", level: "info", message: "Generated user-facing explanation for 520k USDC Base rotation.", chain: "Base" }
  ],
  moves: [
    {
      id: "move-1",
      timestamp: "13:05:02",
      fromProtocol: "Compound",
      toProtocol: "Morpho",
      fromChain: "Arbitrum",
      toChain: "Base",
      asset: "USDC",
      amountUsd: 520000,
      expectedGainBps: 142,
      confidence: 0.93,
      reason: "Predicted utilization spike and lower gas-adjusted execution cost on Base.",
      status: "Executing"
    },
    {
      id: "move-2",
      timestamp: "13:07:14",
      fromProtocol: "Pendle",
      toProtocol: "Aave",
      fromChain: "Ethereum",
      toChain: "Ethereum",
      asset: "sUSDe",
      amountUsd: 310000,
      expectedGainBps: 88,
      confidence: 0.81,
      reason: "Exploit probability drifted above watch threshold after sentiment anomaly.",
      status: "Simulating"
    },
    {
      id: "move-3",
      timestamp: "13:11:30",
      fromProtocol: "Spark",
      toProtocol: "MakerDAO",
      fromChain: "Optimism",
      toChain: "Polygon",
      asset: "DAI",
      amountUsd: 185000,
      expectedGainBps: 47,
      confidence: 0.74,
      reason: "Gas-normalized yield curve indicates safer reserve parking ahead of CPI event.",
      status: "Queued"
    }
  ],
  wallets: [
    {
      address: "0xA91E...5F0C",
      chain: "Ethereum",
      walletProvider: "MetaMask",
      balances: [
        { symbol: "USDC", amount: 4100000, usdValue: 4100000 },
        { symbol: "DAI", amount: 1210000, usdValue: 1210000 },
        { symbol: "ETH", amount: 402, usdValue: 1390000 }
      ]
    },
    {
      address: "0x88F2...9EA1",
      chain: "Base",
      walletProvider: "WalletConnect",
      balances: [
        { symbol: "USDC", amount: 2380000, usdValue: 2380000 },
        { symbol: "sUSDe", amount: 980000, usdValue: 980000 }
      ]
    },
    {
      address: "8i6h...q1Lm",
      chain: "Solana",
      walletProvider: "Coinbase Wallet",
      balances: [
        { symbol: "USDC", amount: 900000, usdValue: 900000 },
        { symbol: "SOL", amount: 5200, usdValue: 910000 }
      ]
    }
  ]
};
