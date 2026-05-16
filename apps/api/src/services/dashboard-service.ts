import { dashboardMock, type DashboardPayload } from "@aegis/shared";

import { prisma } from "../lib/prisma.js";

export async function getDashboardPayload(): Promise<DashboardPayload> {
  try {
    const latestSnapshots = await prisma.portfolioSnapshot.findMany({
      orderBy: {
        capturedAt: "desc"
      },
      take: 1,
      include: {
        chainAllocations: true,
        protocolAllocations: true
      }
    });

    if (!latestSnapshots.length) {
      return dashboardMock;
    }

    return dashboardMock;
  } catch {
    return dashboardMock;
  }
}
