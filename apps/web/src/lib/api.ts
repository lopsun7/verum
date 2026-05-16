import { dashboardMock, type DashboardPayload } from "@/lib/demo-data";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export async function getDashboardPayload(): Promise<DashboardPayload> {
  if (!apiUrl) {
    return dashboardMock;
  }

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
