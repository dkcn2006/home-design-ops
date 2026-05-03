import { Controller, Get, Inject, Module, Param, Query } from "@nestjs/common";
import type { UserRole } from "@home-design-ops/shared";
import { DASHBOARD_REPOSITORY, PROJECT_REPOSITORY } from "../repositories";
import type { DashboardRepository, ProjectRepository } from "../repositories";

@Controller("projects")
class ProjectsController {
  constructor(
    @Inject(PROJECT_REPOSITORY) private readonly projectRepository: ProjectRepository,
    @Inject(DASHBOARD_REPOSITORY) private readonly dashboardRepository: DashboardRepository
  ) {}

  @Get()
  findAll() {
    return this.projectRepository.getProjects();
  }

  @Get("overview")
  getOverview() {
    return this.dashboardRepository.getPortfolioOverview();
  }

  @Get("workspace-home")
  getWorkspaceHome() {
    return this.projectRepository.getWorkspaceHome();
  }

  @Get("dashboard")
  getDashboardByRole(@Query("role") role: UserRole = "sales") {
    return this.dashboardRepository.getDashboard(role);
  }

  @Get("role-workbench")
  getRoleWorkbench(@Query("role") role: UserRole = "sales") {
    return this.dashboardRepository.getRoleWorkbench(role);
  }

  @Get(":id/archive")
  getArchive(@Param("id") id: string) {
    return this.projectRepository.getProjectArchive(id);
  }

  @Get(":id/tasks")
  getProjectTasks(@Param("id") id: string) {
    return this.projectRepository.getProjectTasks(id);
  }

  @Get(":id/task-board")
  getProjectTaskBoard(@Param("id") id: string) {
    return this.projectRepository.getProjectTaskBoard(id);
  }

  @Get(":id/requirements")
  getRequirement(@Param("id") id: string) {
    return this.projectRepository.getRequirementSheet(id);
  }

  @Get(":id/design-versions")
  getDesignVersions(@Param("id") id: string) {
    return this.projectRepository.getDesignVersions(id);
  }

  @Get(":id/renderings")
  getRenderings(@Param("id") id: string) {
    return this.projectRepository.getRenderingVersions(id);
  }

  @Get(":id/construction-drawings")
  getConstructionDrawings(@Param("id") id: string) {
    return this.projectRepository.getConstructionDrawingVersions(id);
  }

  @Get(":id/quotations")
  getQuotations(@Param("id") id: string) {
    return this.projectRepository.getQuotations(id);
  }

  @Get(":id/change-orders")
  getChangeOrders(@Param("id") id: string) {
    return this.projectRepository.getChangeOrders(id);
  }

  @Get(":id/milestones")
  getMilestones(@Param("id") id: string) {
    return this.projectRepository.getMilestones(id);
  }

  @Get(":id/inspections")
  getInspections(@Param("id") id: string) {
    return this.projectRepository.getInspections(id);
  }
}

@Module({
  controllers: [ProjectsController]
})
export class ProjectsModule {}
