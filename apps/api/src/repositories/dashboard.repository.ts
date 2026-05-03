import type {
  DashboardSummary,
  PortfolioOverview,
  RoleWorkbench,
  User,
  UserRole,
  WorkflowPhase
} from "@home-design-ops/shared";

export interface DashboardRepository {
  getPortfolioOverview(): PortfolioOverview;
  getDashboard(role: UserRole): DashboardSummary;
  getRoleWorkbench(role: UserRole): RoleWorkbench;
  getUsers(): User[];
  getWorkflowPhases(): WorkflowPhase[];
}
