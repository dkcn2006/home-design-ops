import type {
  ConfirmationRecord,
  DashboardSummary,
  PortfolioOverview,
  ProjectArchive,
  UpdateConfirmationInput,
  UserRole
} from "@home-design-ops/shared";

const API_BASE_URL =
  process.env.INTERNAL_API_BASE_URL ??
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  "http://localhost:4000/api";

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {})
    }
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }

  return response.json() as Promise<T>;
}

export function getPortfolioOverview() {
  return apiFetch<PortfolioOverview>("/projects/overview");
}

export function getDashboard(role: UserRole) {
  return apiFetch<DashboardSummary>(`/projects/dashboard?role=${role}`);
}

export function getArchive(projectId: string) {
  return apiFetch<ProjectArchive>(`/projects/${projectId}/archive`);
}

export function updateConfirmation(projectId: string, confirmationId: string, input: UpdateConfirmationInput) {
  return apiFetch<ConfirmationRecord>(`/projects/${projectId}/confirmations/${confirmationId}`, {
    method: "PATCH",
    body: JSON.stringify(input)
  });
}
