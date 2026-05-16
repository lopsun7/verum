"use client";

import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";

import type {
  AgentLog,
  AllocationMove,
  BorrowForecastPoint,
  ChainAllocation,
  DashboardPayload,
  ProtocolAllocation,
  RiskVector,
  SupportedChain,
  SupportedProtocol,
  WalletSummary
} from "@/lib/demo-data";
import { dashboardMock } from "@/lib/demo-data";

type ScenarioId = "normal" | "morpho-spike" | "liquidity-crunch" | "safe-market";

interface SimulationContextValue {
  dashboard: DashboardPayload;
  scenarioId: ScenarioId;
  blockNumber: number;
  autoMode: boolean;
  borrowAmount: number;
  currentProtocol: SupportedProtocol;
  isExecuting: boolean;
  setScenario: (scenario: ScenarioId) => void;
  setBorrowAmount: (amount: number) => void;
  setAutoMode: (enabled: boolean) => void;
  manualTick: () => void;
  optimizeBorrow: () => void;
}

interface BuildResult {
  dashboard: DashboardPayload;
  recommendation: AllocationMove;
}

const SimulationContext = createContext<SimulationContextValue | null>(null);

const scenarioLabels: Record<ScenarioId, string> = {
  normal: "Normal Market",
  "morpho-spike": "Morpho Utilization Spike",
  "liquidity-crunch": "Liquidity Crunch",
  "safe-market": "Safe Market"
};

const basePools = dashboardMock.allocations;
const baseRiskVectors = dashboardMock.riskVectors;
const baseChains = dashboardMock.chains;
const baseWallets = dashboardMock.wallets;

function randomBetween(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function computePredictedApr(currentApr: number, utilization: number, liquidityScore: number) {
  let predicted = currentApr;

  if (utilization > 90) {
    predicted += 1.8;
  } else if (utilization > 80) {
    predicted += 0.7;
  } else if (utilization < 75) {
    predicted += 0.2;
  } else {
    predicted += 0.4;
  }

  if (liquidityScore < 70) {
    predicted += 0.35;
  }

  return Number(predicted.toFixed(2));
}

function scenarioAdjustedPools(
  scenarioId: ScenarioId,
  borrowAmount: number,
  currentProtocol: SupportedProtocol,
  blockNumber: number
): ProtocolAllocation[] {
  return basePools.map((pool) => {
    let utilization = pool.utilization;
    let currentApr = pool.currentApr;
    let liquidityScore = pool.liquidityScore;
    let riskScore = pool.riskScore;
    let availableLiquidityUsd = pool.availableLiquidityUsd;

    if (scenarioId === "morpho-spike" && pool.protocol === "Morpho") {
      utilization = 96;
      currentApr = 5.0;
      liquidityScore = 56;
      riskScore = 36;
      availableLiquidityUsd = 820000;
    }

    if (scenarioId === "liquidity-crunch") {
      utilization = Math.min(98, utilization + 6);
      liquidityScore = Math.max(45, liquidityScore - 18);
      riskScore = riskScore + 5;
      availableLiquidityUsd = Math.max(450000, availableLiquidityUsd * 0.72);
    }

    if (scenarioId === "safe-market") {
      utilization = Math.max(68, utilization - 8);
      liquidityScore = Math.min(96, liquidityScore + 6);
      riskScore = Math.max(10, riskScore - 4);
      availableLiquidityUsd = availableLiquidityUsd * 1.08;
    }

    const wave = Math.sin(blockNumber / 3 + pool.protocol.length);
    utilization = Math.max(60, Math.min(98, utilization + wave * 1.6));
    currentApr = Math.max(4.4, currentApr + wave * 0.08);
    availableLiquidityUsd = Math.max(400000, availableLiquidityUsd + wave * 40000);

    const predictedApr = computePredictedApr(currentApr, utilization, liquidityScore);
    const currentMonthlyCostUsd = Number(((borrowAmount * (currentApr / 100)) / 12).toFixed(2));
    const predictedMonthlyCostUsd = Number(((borrowAmount * (predictedApr / 100)) / 12).toFixed(2));

    return {
      ...pool,
      availableLiquidityUsd: Math.round(availableLiquidityUsd),
      currentApr: Number(currentApr.toFixed(2)),
      predictedApr,
      utilization: Math.round(utilization),
      liquidityScore: Math.round(liquidityScore),
      riskScore: Math.round(riskScore),
      currentMonthlyCostUsd,
      predictedMonthlyCostUsd,
      health: utilization > 90 || liquidityScore < 65 ? "Volatile" : utilization > 80 ? "Monitor" : "Stable",
      isCurrentPosition: pool.protocol === currentProtocol
    };
  });
}

function buildRecommendation(pools: ProtocolAllocation[], borrowAmount: number, currentProtocol: SupportedProtocol): AllocationMove {
  const currentPool = pools.find((pool) => pool.protocol === currentProtocol) ?? pools[0]!;
  const ranked = [...pools].sort((left, right) => {
    const leftScore = left.predictedApr + (100 - left.liquidityScore) / 120 + left.riskScore / 100;
    const rightScore = right.predictedApr + (100 - right.liquidityScore) / 120 + right.riskScore / 100;

    return leftScore - rightScore;
  });
  const bestPool = ranked[0]!;
  const expectedMonthlySavingsUsd = Number(
    Math.max(0, currentPool.predictedMonthlyCostUsd - bestPool.predictedMonthlyCostUsd).toFixed(2)
  );

  return {
    id: "sim-move-1",
    timestamp: new Date().toLocaleTimeString("en-US", { hour12: false }),
    fromProtocol: currentPool.protocol,
    toProtocol: bestPool.protocol,
    fromChain: currentPool.chain,
    toChain: bestPool.chain,
    asset: "USDC",
    amountUsd: borrowAmount,
    expectedMonthlySavingsUsd,
    confidence: bestPool.protocol === "Compound" ? 0.88 : bestPool.protocol === "Spark" ? 0.79 : 0.72,
    reason:
      bestPool.protocol === "Morpho" && bestPool.utilization > 90
        ? "Morpho remains cheap right now, but the utilization spike keeps it unstable for a borrower who wants rate predictability."
        : `${bestPool.protocol} has the best risk-adjusted predicted borrow rate. Morpho is cheaper right now, but high utilization creates rate volatility risk.`,
    status: "Ready",
    simulatedTxHash: "0xFAKE_AGENT_FORGE_2026_DEFI_OPTIMIZER",
    steps: [
      `Repay existing USDC debt on ${currentPool.protocol}.`,
      `Withdraw ETH collateral from ${currentPool.protocol}.`,
      `Deposit ETH collateral into ${bestPool.protocol}.`,
      `Borrow ${borrowAmount.toLocaleString()} USDC from ${bestPool.protocol}.`
    ]
  };
}

function buildForecasts(pools: ProtocolAllocation[]): BorrowForecastPoint[] {
  const byProtocol = Object.fromEntries(pools.map((pool) => [pool.protocol, pool])) as Record<SupportedProtocol, ProtocolAllocation>;

  return [
    { timestamp: "00:00", aave: byProtocol.Aave.currentApr, morpho: byProtocol.Morpho.currentApr, compound: byProtocol.Compound.currentApr, spark: byProtocol.Spark.currentApr },
    { timestamp: "04:00", aave: byProtocol.Aave.currentApr + 0.1, morpho: byProtocol.Morpho.currentApr + 0.4, compound: byProtocol.Compound.currentApr + 0.05, spark: byProtocol.Spark.currentApr + 0.08 },
    { timestamp: "08:00", aave: byProtocol.Aave.currentApr + 0.25, morpho: byProtocol.Morpho.currentApr + 0.9, compound: byProtocol.Compound.currentApr + 0.1, spark: byProtocol.Spark.currentApr + 0.12 },
    { timestamp: "12:00", aave: byProtocol.Aave.predictedApr - 0.05, morpho: byProtocol.Morpho.predictedApr - 0.15, compound: byProtocol.Compound.predictedApr, spark: byProtocol.Spark.predictedApr - 0.05 },
    { timestamp: "16:00", aave: byProtocol.Aave.predictedApr, morpho: byProtocol.Morpho.predictedApr, compound: byProtocol.Compound.predictedApr, spark: byProtocol.Spark.predictedApr },
    { timestamp: "20:00", aave: byProtocol.Aave.predictedApr - 0.08, morpho: byProtocol.Morpho.predictedApr - 0.1, compound: byProtocol.Compound.predictedApr + 0.04, spark: byProtocol.Spark.predictedApr + 0.05 }
  ].map((point) => ({
    ...point,
    aave: Number(point.aave.toFixed(2)),
    morpho: Number(point.morpho.toFixed(2)),
    compound: Number(point.compound.toFixed(2)),
    spark: Number(point.spark.toFixed(2))
  }));
}

function buildRiskVectors(pools: ProtocolAllocation[]): RiskVector[] {
  return pools.map((pool) => {
    const base = baseRiskVectors.find((vector) => vector.protocol === pool.protocol) ?? baseRiskVectors[0]!;
    const liquidityHealth = Math.max(40, Math.min(96, pool.liquidityScore));

    return {
      ...base,
      liquidityHealth,
      badDebtRisk: Math.max(55, Math.min(94, base.badDebtRisk - Math.round((pool.liquidityScore - 70) / 2))),
      exploitProbability: Math.max(5, Math.min(30, base.exploitProbability + (pool.utilization > 90 ? 6 : pool.utilization > 80 ? 2 : 0))),
      tvlTrend: Math.max(55, Math.min(95, base.tvlTrend + Math.round((pool.availableLiquidityUsd / 1_000_000 - 1.2) * 4)))
    };
  });
}

function buildChains(pools: ProtocolAllocation[]): ChainAllocation[] {
  const totals = new Map<SupportedChain, number>();

  for (const pool of pools) {
    totals.set(pool.chain, (totals.get(pool.chain) ?? 0) + pool.availableLiquidityUsd);
  }

  const grandTotal = [...totals.values()].reduce((sum, value) => sum + value, 0);

  return baseChains
    .filter((chain) => totals.has(chain.chain))
    .map((chain) => {
      const valueUsd = totals.get(chain.chain) ?? 0;

      return {
        chain: chain.chain,
        valueUsd,
        share: Number(((valueUsd / grandTotal) * 100).toFixed(1)),
        change24h: Number((chain.change24h + randomBetween(-0.4, 0.5)).toFixed(1))
      };
    });
}

function buildWallets(borrowAmount: number, currentProtocol: SupportedProtocol): WalletSummary[] {
  return baseWallets.map((wallet, index) => {
    if (index !== 0) {
      return wallet;
    }

    return {
      ...wallet,
      balances: [
        wallet.balances[0]!,
        { symbol: "USDC Debt", amount: borrowAmount, usdValue: borrowAmount },
        { symbol: "Current Venue", amount: 1, usdValue: currentProtocol.length }
      ]
    };
  });
}

function buildLogs(recommendation: AllocationMove, scenarioId: ScenarioId, blockNumber: number): AgentLog[] {
  return [
    {
      id: `log-rate-${blockNumber}`,
      timestamp: new Date().toLocaleTimeString("en-US", { hour12: false }),
      agent: "RateDataAgent",
      level: "info",
      message: `Loaded mock pool state for scenario "${scenarioLabels[scenarioId]}" at block ${blockNumber}.`,
      chain: recommendation.fromChain
    },
    {
      id: `log-pred-${blockNumber}`,
      timestamp: new Date().toLocaleTimeString("en-US", { hour12: false }),
      agent: "PredictionAgent",
      level: recommendation.toProtocol === "Morpho" ? "warn" : "info",
      message: "Applied utilization thresholds and liquidity penalties to predict short-term borrow APR movement.",
      chain: recommendation.toChain
    },
    {
      id: `log-decision-${blockNumber}`,
      timestamp: new Date().toLocaleTimeString("en-US", { hour12: false }),
      agent: "DecisionAgent",
      level: "info",
      message: `Recommended moving debt from ${recommendation.fromProtocol} to ${recommendation.toProtocol}.`,
      chain: recommendation.toChain
    },
    {
      id: `log-exec-${blockNumber}`,
      timestamp: new Date().toLocaleTimeString("en-US", { hour12: false }),
      agent: "ExecutionAgent",
      level: "critical",
      message: `Prepared simulated receipt ${recommendation.simulatedTxHash}.`,
      chain: recommendation.toChain
    }
  ];
}

function buildDashboard(scenarioId: ScenarioId, borrowAmount: number, currentProtocol: SupportedProtocol, blockNumber: number): BuildResult {
  const allocations = scenarioAdjustedPools(scenarioId, borrowAmount, currentProtocol, blockNumber);
  const recommendation = buildRecommendation(allocations, borrowAmount, currentProtocol);
  const dashboard: DashboardPayload = {
    metric: {
      activeBorrowUsd: borrowAmount,
      currentWeightedBorrowApr: allocations.find((pool) => pool.isCurrentPosition)?.currentApr ?? allocations[0]!.currentApr,
      bestPredictedBorrowApr: Math.min(...allocations.map((pool) => pool.predictedApr)),
      projectedMonthlySavingsUsd: recommendation.expectedMonthlySavingsUsd,
      aiConfidence: Math.round(recommendation.confidence * 100),
      executionReadiness: scenarioId === "liquidity-crunch" ? 76 : scenarioId === "morpho-spike" ? 89 : 94
    },
    chains: buildChains(allocations),
    allocations,
    forecasts: buildForecasts(allocations),
    riskVectors: buildRiskVectors(allocations),
    agentLogs: buildLogs(recommendation, scenarioId, blockNumber),
    moves: [recommendation],
    wallets: buildWallets(borrowAmount, currentProtocol)
  };

  return {
    dashboard,
    recommendation
  };
}

export function SimulationProvider({ children }: { children: React.ReactNode }) {
  const [scenarioId, setScenarioId] = useState<ScenarioId>("normal");
  const [blockNumber, setBlockNumber] = useState(19420591);
  const [autoMode, setAutoMode] = useState(true);
  const [borrowAmount, setBorrowAmountState] = useState(dashboardMock.metric.activeBorrowUsd);
  const [currentProtocol, setCurrentProtocol] = useState<SupportedProtocol>("Aave");
  const [isExecuting, setIsExecuting] = useState(false);
  const timeoutRef = useRef<Array<ReturnType<typeof setTimeout>>>([]);

  const { dashboard, recommendation } = useMemo(
    () => buildDashboard(scenarioId, borrowAmount, currentProtocol, blockNumber),
    [scenarioId, borrowAmount, currentProtocol, blockNumber]
  );

  useEffect(() => {
    if (!autoMode || isExecuting) {
      return;
    }

    const interval = setInterval(() => {
      setBlockNumber((current) => current + 1);
    }, 3500);

    return () => clearInterval(interval);
  }, [autoMode, isExecuting]);

  useEffect(() => {
    return () => {
      timeoutRef.current.forEach(clearTimeout);
    };
  }, []);

  const manualTick = () => {
    setBlockNumber((current) => current + 1);
  };

  const optimizeBorrow = () => {
    if (isExecuting) {
      return;
    }

    setIsExecuting(true);
    const queued = setTimeout(() => {
      setBlockNumber((current) => current + 1);
    }, 350);
    const confirmed = setTimeout(() => {
      setCurrentProtocol(recommendation.toProtocol);
      setBlockNumber((current) => current + 1);
      setIsExecuting(false);
    }, 1400);

    timeoutRef.current.push(queued, confirmed);
  };

  const value: SimulationContextValue = {
    dashboard: isExecuting
      ? {
          ...dashboard,
          moves: [
            {
              ...recommendation,
              status: "Simulating"
            }
          ]
        }
      : dashboard,
    scenarioId,
    blockNumber,
    autoMode,
    borrowAmount,
    currentProtocol,
    isExecuting,
    setScenario: (scenario) => {
      setScenarioId(scenario);
      setBlockNumber((current) => current + 1);
    },
    setBorrowAmount: (amount) => {
      setBorrowAmountState(amount);
      setBlockNumber((current) => current + 1);
    },
    setAutoMode,
    manualTick,
    optimizeBorrow
  };

  return <SimulationContext.Provider value={value}>{children}</SimulationContext.Provider>;
}

export function useSimulation() {
  const context = useContext(SimulationContext);

  if (!context) {
    throw new Error("useSimulation must be used within SimulationProvider");
  }

  return context;
}
