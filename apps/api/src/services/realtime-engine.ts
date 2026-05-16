import { randomUUID } from "node:crypto";

import type { Server as SocketServer } from "socket.io";

import { dashboardMock, type AgentLog, type AllocationMove } from "@aegis/shared";

const agentNames = [
  "Yield Prediction Agent",
  "Risk Analysis Agent",
  "Execution Agent",
  "Sentiment Agent",
  "Explainability Agent"
] as const;

const agentMessages = [
  "TVL acceleration detected on Base lending venues.",
  "Governance proposal sentiment softened across monitored forums.",
  "Gas-aware route optimization selected alternate settlement path.",
  "Stablecoin depeg probability remained inside guardrails.",
  "Emergency defense playbook passed dry-run with zero slippage drift."
];

export function startRealtimeEngine(io: SocketServer) {
  setInterval(() => {
    const timestamp = new Date().toLocaleTimeString("en-US", {
      hour12: false
    });

    const log: AgentLog = {
      id: randomUUID(),
      timestamp,
      agent: agentNames[Math.floor(Math.random() * agentNames.length)],
      level: ["info", "warn", "critical"][Math.floor(Math.random() * 3)] as AgentLog["level"],
      message: agentMessages[Math.floor(Math.random() * agentMessages.length)],
      chain: dashboardMock.chains[Math.floor(Math.random() * dashboardMock.chains.length)]?.chain
    };

    const move: AllocationMove = {
      ...dashboardMock.moves[Math.floor(Math.random() * dashboardMock.moves.length)]!,
      id: randomUUID(),
      timestamp,
      status: ["Queued", "Simulating", "Executing", "Settled"][Math.floor(Math.random() * 4)] as AllocationMove["status"]
    };

    io.emit("agent-log", log);
    io.emit("allocation-move", move);
    io.emit("portfolio-update", {
      totalValueUsd: dashboardMock.metric.totalValueUsd + Math.floor(Math.random() * 90_000) - 45_000,
      aiConfidence: dashboardMock.metric.aiConfidence + Math.floor(Math.random() * 4) - 2
    });
  }, 7000);
}

