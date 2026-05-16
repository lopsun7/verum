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
type DecisionMode = "lowest-predicted" | "lowest-current" | "stable-liquidity";

type PoolOverride = Partial<
  Pick<ProtocolAllocation, "currentApr" | "utilization" | "liquidityScore" | "riskScore" | "availableLiquidityUsd">
>;

interface AgentConstraints {
  decisionMode: DecisionMode;
  maxUtilization: number;
  minLiquidityScore: number;
  maxRiskScore: number;
}

interface SimulationContextValue {
  dashboard: DashboardPayload;
  scenarioId: ScenarioId;
  blockNumber: number;
  autoMode: boolean;
  borrowAmount: number;
  currentProtocol: SupportedProtocol;
  isExecuting: boolean;
  constraints: AgentConstraints;
  setScenario: (scenario: ScenarioId) => void;
  setBorrowAmount: (amount: number) => void;
  setAutoMode: (enabled: boolean) => void;
  setCurrentProtocol: (protocol: SupportedProtocol) => void;
  updatePool: (protocol: SupportedProtocol, patch: PoolOverride) => void;
  randomizeMarket: () => void;
  resetMarket: () => void;
  updateConstraints: (patch: Partial<AgentConstraints>) => void;
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
  blockNumber: number,
  poolOverrides: Partial<Record<SupportedProtocol, PoolOverride>>
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

    const override = poolOverrides[pool.protocol];
    if (override) {
      currentApr = override.currentApr ?? currentApr;
      utilization = override.utilization ?? utilization;
      liquidityScore = override.liquidityScore ?? liquidityScore;
      riskScore = override.riskScore ?? riskScore;
      availableLiquidityUsd = override.availableLiquidityUsd ?? availableLiquidityUsd;
    }

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

function buildRecommendation(
  pools: ProtocolAllocation[],
  borrowAmount: number,
  currentProtocol: SupportedProtocol,
  constraints: AgentConstraints
): AllocationMove {
  const currentPool = pools.find((pool) => pool.protocol === currentProtocol) ?? pools[0]!;
  const eligiblePools = pools.filter(
    (pool) =>
      pool.utilization <= constraints.maxUtilization &&
      pool.liquidityScore >= constraints.minLiquidityScore &&
      pool.riskScore <= constraints.maxRiskScore
  );
  const candidates = eligiblePools.length ? eligiblePools : pools;
  const ranked = [...candidates].sort((left, right) => {
    const leftScore =
      constraints.decisionMode === "lowest-current"
        ? left.currentApr + left.riskScore / 120
        : constraints.decisionMode === "stable-liquidity"
          ? left.predictedApr + (100 - left.liquidityScore) / 60 + left.riskScore / 100
          : left.predictedApr + (100 - left.liquidityScore) / 120 + left.riskScore / 100;
    const rightScore =
      constraints.decisionMode === "lowest-current"
        ? right.currentApr + right.riskScore / 120
        : constraints.decisionMode === "stable-liquidity"
          ? right.predictedApr + (100 - right.liquidityScore) / 60 + right.riskScore / 100
          : right.predictedApr + (100 - right.liquidityScore) / 120 + right.riskScore / 100;

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
        ? `Morpho remains cheap right now, but the utilization spike breaks the current safety constraints for a stable borrower flow.`
        : `${bestPool.protocol} best matches the active constraints: mode=${constraints.decisionMode}, max util ${constraints.maxUtilization}%, min liquidity ${constraints.minLiquidityScore}.`,
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

function buildLogs(
  recommendation: AllocationMove,
  scenarioId: ScenarioId,
  blockNumber: number,
  constraints: AgentConstraints
): AgentLog[] {
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
      message: `Applied utilization thresholds and liquidity penalties with constraint mode "${constraints.decisionMode}".`,
      chain: recommendation.toChain
    },
    {
      id: `log-decision-${blockNumber}`,
      timestamp: new Date().toLocaleTimeString("en-US", { hour12: false }),
      agent: "DecisionAgent",
      level: "info",
      message: `Recommended moving debt from ${recommendation.fromProtocol} to ${recommendation.toProtocol} under the current guardrails.`,
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

function buildDashboard(
  scenarioId: ScenarioId,
  borrowAmount: number,
  currentProtocol: SupportedProtocol,
  blockNumber: number,
  poolOverrides: Partial<Record<SupportedProtocol, PoolOverride>>,
  constraints: AgentConstraints
): BuildResult {
  const allocations = scenarioAdjustedPools(scenarioId, borrowAmount, currentProtocol, blockNumber, poolOverrides);
  const recommendation = buildRecommendation(allocations, borrowAmount, currentProtocol, constraints);
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
    agentLogs: buildLogs(recommendation, scenarioId, blockNumber, constraints),
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
  const [poolOverrides, setPoolOverrides] = useState<Partial<Record<SupportedProtocol, PoolOverride>>>({});
  const [constraints, setConstraints] = useState<AgentConstraints>({
    decisionMode: "lowest-predicted",
    maxUtilization: 92,
    minLiquidityScore: 60,
    maxRiskScore: 35
  });
  const timeoutRef = useRef<Array<ReturnType<typeof setTimeout>>>([]);

  const { dashboard, recommendation } = useMemo(
    () => buildDashboard(scenarioId, borrowAmount, currentProtocol, blockNumber, poolOverrides, constraints),
    [scenarioId, borrowAmount, currentProtocol, blockNumber, poolOverrides, constraints]
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

  const updatePool = (protocol: SupportedProtocol, patch: PoolOverride) => {
    setPoolOverrides((current) => ({
      ...current,
      [protocol]: {
        ...current[protocol],
        ...patch
      }
    }));
    setBlockNumber((current) => current + 1);
  };

  const randomizeMarket = () => {
    const nextOverrides = Object.fromEntries(
      basePools.map((pool) => [
        pool.protocol,
        {
          currentApr: Number(randomBetween(4.7, 6.9).toFixed(2)),
          utilization: Math.round(randomBetween(68, 97)),
          liquidityScore: Math.round(randomBetween(52, 95)),
          riskScore: Math.round(randomBetween(12, 38)),
          availableLiquidityUsd: Math.round(randomBetween(700000, 3800000))
        }
      ])
    ) as Partial<Record<SupportedProtocol, PoolOverride>>;

    setPoolOverrides(nextOverrides);
    setBlockNumber((current) => current + 1);
  };

  const resetMarket = () => {
    setPoolOverrides({});
    setConstraints({
      decisionMode: "lowest-predicted",
      maxUtilization: 92,
      minLiquidityScore: 60,
      maxRiskScore: 35
    });
    setCurrentProtocol("Aave");
    setBorrowAmountState(dashboardMock.metric.activeBorrowUsd);
    setScenarioId("normal");
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
    constraints,
    setScenario: (scenario) => {
      setScenarioId(scenario);
      setBlockNumber((current) => current + 1);
    },
    setBorrowAmount: (amount) => {
      setBorrowAmountState(amount);
      setBlockNumber((current) => current + 1);
    },
    setAutoMode,
    setCurrentProtocol: (protocol) => {
      setCurrentProtocol(protocol);
      setBlockNumber((current) => current + 1);
    },
    updatePool,
    randomizeMarket,
    resetMarket,
    updateConstraints: (patch) => {
      setConstraints((current) => ({ ...current, ...patch }));
      setBlockNumber((current) => current + 1);
    },
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
