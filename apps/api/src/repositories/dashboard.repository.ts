import type {
  DashboardSummary,
  PortfolioOverview,
  RoleWorkbench,
  User,
  UserRole,
  WorkflowPhase
} from "@home-design-ops/shared";

export interface DashboardRepository {
  getPortfolioOverview(): PortfolioOverview | Promise<PortfolioOverview>;
  getDashboard(role: UserRole): DashboardSummary | Promise<DashboardSummary>;
  getRoleWorkbench(role: UserRole): RoleWorkbench | Promise<RoleWorkbench>;
  getUsers(): User[] | Promise<User[]>;
  getWorkflowPhases(): WorkflowPhase[] | Promise<WorkflowPhase[]>;
}
