import type {
  ConfirmationRecord,
  CreateLeadIntakeInput,
  DashboardSummary,
  LeadSummary,
  LeadPipelineItem,
  PortfolioOverview,
  ProjectArchive,
  ProjectTaskBoard,
  ProjectTaskCard,
  RoleWorkbench,
  UpdateLeadStageInput,
  UpdateConfirmationInput,
  UpdateTaskStatusInput,
  UpdateTaskAssigneeInput,
  UserRole,
  WorkspaceHome
} from "@home-design-ops/shared";

const API_BASE_URL =
  process.env.INTERNAL_API_BASE_URL ??
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  "http://127.0.0.1:4010/api";

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

export function getWorkspaceHome() {
  return apiFetch<WorkspaceHome>("/projects/workspace-home");
}

export function getDashboard(role: UserRole) {
  return apiFetch<DashboardSummary>(`/projects/dashboard?role=${role}`);
}

export function getRoleWorkbench(role: UserRole) {
  return apiFetch<RoleWorkbench>(`/projects/role-workbench?role=${role}`);
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

export function getLeadPipeline() {
  return apiFetch<LeadPipelineItem[]>("/sales/leads");
}

export function getLeadSummary() {
  return apiFetch<LeadSummary>("/sales/leads/summary");
}

export function createLeadIntake(input: CreateLeadIntakeInput) {
  return apiFetch<LeadPipelineItem>("/leads/intake", {
    method: "POST",
    body: JSON.stringify(input)
  });
}

export function updateLeadStage(leadId: string, input: UpdateLeadStageInput) {
  return apiFetch<LeadPipelineItem>(`/leads/${leadId}/stage`, {
    method: "PATCH",
    body: JSON.stringify(input)
  });
}

export function getProjectTaskBoard(projectId: string) {
  return apiFetch<ProjectTaskBoard>(`/projects/${projectId}/task-board`);
}

export function getMyTasks(assigneeId = "user-sales-1") {
  return apiFetch<ProjectTaskCard[]>(`/tasks/my?assigneeId=${encodeURIComponent(assigneeId)}`);
}

export function updateTaskStatus(taskId: string, input: UpdateTaskStatusInput) {
  return apiFetch<{ id: string; status: string }>(`/tasks/${taskId}/status`, {
    method: "PATCH",
    body: JSON.stringify(input)
  });
}

export function updateTaskAssignee(taskId: string, input: UpdateTaskAssigneeInput) {
  return apiFetch<{ id: string; assigneeId: string }>(`/tasks/${taskId}/assignee`, {
    method: "PATCH",
    body: JSON.stringify(input)
  });
}
