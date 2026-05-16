"use client";

import { useEffect, useState } from "react";
import { io } from "socket.io-client";

import type { AgentLog } from "@/lib/demo-data";

import { cn } from "@/lib/utils";

const configuredWsUrl = process.env.NEXT_PUBLIC_WS_URL;

export function LiveActivityFeed({ initialLogs }: { initialLogs: AgentLog[] }) {
  const [logs, setLogs] = useState(initialLogs);

  useEffect(() => {
    setLogs(initialLogs);
  }, [initialLogs]);

  useEffect(() => {
    if (!configuredWsUrl) {
      return;
    }

    const socket = io(configuredWsUrl, {
      transports: ["websocket"],
      reconnectionAttempts: 2
    });

    socket.on("agent-log", (payload: AgentLog) => {
      setLogs((current) => [payload, ...current].slice(0, 8));
    });

    return () => {
      socket.close();
    };
  }, []);

  return (
    <div className="space-y-3">
      {logs.map((log) => (
        <div key={log.id} className="rounded-3xl border border-white/8 bg-slate-950/55 px-4 py-3">
          <div className="mb-2 flex items-center justify-between text-xs text-white/42">
            <span>{log.timestamp}</span>
            <span>{log.agent}</span>
          </div>
          <p
            className={cn(
              "text-sm leading-6",
              log.level === "critical" && "text-rose-300",
              log.level === "warn" && "text-amber-200",
              log.level === "info" && "text-slate-200"
            )}
          >
            {log.message}
          </p>
        </div>
      ))}
    </div>
  );
}
