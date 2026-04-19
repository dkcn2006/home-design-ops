import { Controller, Get, Module, Param, Query } from "@nestjs/common";
import type { UserRole } from "@home-design-ops/shared";
import { DemoRepositoryService } from "../services/demo-repository.service";

@Controller("projects")
class ProjectsController {
  constructor(private readonly repository: DemoRepositoryService) {}

  @Get()
  findAll() {
    return this.repository.getProjects();
  }

  @Get("overview")
  getOverview() {
    return this.repository.getPortfolioOverview();
  }

  @Get("workspace-home")
  getWorkspaceHome() {
    return this.repository.getWorkspaceHome();
  }

  @Get("dashboard")
  getDashboardByRole(@Query("role") role: UserRole = "sales") {
    return this.repository.getDashboard(role);
  }

  @Get("role-workbench")
  getRoleWorkbench(@Query("role") role: UserRole = "sales") {
    return this.repository.getRoleWorkbench(role);
  }

  @Get(":id/archive")
  getArchive(@Param("id") id: string) {
    return this.repository.getProjectArchive(id);
  }

  @Get(":id/requirements")
  getRequirement(@Param("id") id: string) {
    return this.repository.getRequirementSheet(id);
  }

  @Get(":id/design-versions")
  getDesignVersions(@Param("id") id: string) {
    return this.repository.getDesignVersions(id);
  }

  @Get(":id/renderings")
  getRenderings(@Param("id") id: string) {
    return this.repository.getRenderingVersions(id);
  }

  @Get(":id/construction-drawings")
  getConstructionDrawings(@Param("id") id: string) {
    return this.repository.getConstructionDrawingVersions(id);
  }

  @Get(":id/quotations")
  getQuotations(@Param("id") id: string) {
    return this.repository.getQuotations(id);
  }

  @Get(":id/change-orders")
  getChangeOrders(@Param("id") id: string) {
    return this.repository.getChangeOrders(id);
  }

  @Get(":id/milestones")
  getMilestones(@Param("id") id: string) {
    return this.repository.getMilestones(id);
  }

  @Get(":id/inspections")
  getInspections(@Param("id") id: string) {
    return this.repository.getInspections(id);
  }

}

@Module({
  controllers: [ProjectsController]
})
export class ProjectsModule {}
