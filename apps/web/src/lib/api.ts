import { dashboardMock, type DashboardPayload } from "@aegis/shared";

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export async function getDashboardPayload(): Promise<DashboardPayload> {
  try {
    const response = await fetch(`${apiUrl}/api/dashboard`, {
      cache: "no-store"
    });

    if (!response.ok) {
      return dashboardMock;
    }

    return (await response.json()) as DashboardPayload;
  } catch {
    return dashboardMock;
  }
}

