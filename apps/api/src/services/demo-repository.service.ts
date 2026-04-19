import { Injectable, NotFoundException } from "@nestjs/common";
import {
  attachments,
  changeOrders,
  confirmations,
  constructionDrawingVersions,
  customers,
  dashboards,
  designVersions,
  getProjectArchive,
  inspections,
  leads,
  milestones,
  projects,
  quotations,
  renderingVersions,
  requirementSheets
} from "@home-design-ops/shared";
import type { ProjectArchive, UserRole } from "@home-design-ops/shared";

@Injectable()
export class DemoRepositoryService {
  getCustomers() {
    return customers;
  }

  getLeads() {
    return leads;
  }

  getProjects() {
    return projects;
  }

  getProjectArchive(projectId: string): ProjectArchive {
    const archive = getProjectArchive(projectId);
    if (!archive) {
      throw new NotFoundException(`Project ${projectId} was not found`);
    }
    return archive;
  }

  getRequirementSheet(projectId: string) {
    return requirementSheets.find((item) => item.projectId === projectId);
  }

  getDesignVersions(projectId: string) {
    return designVersions.filter((item) => item.projectId === projectId);
  }

  getRenderingVersions(projectId: string) {
    return renderingVersions.filter((item) => item.projectId === projectId);
  }

  getConstructionDrawingVersions(projectId: string) {
    return constructionDrawingVersions.filter((item) => item.projectId === projectId);
  }

  getQuotations(projectId: string) {
    return quotations.filter((item) => item.projectId === projectId);
  }

  getChangeOrders(projectId: string) {
    return changeOrders.filter((item) => item.projectId === projectId);
  }

  getMilestones(projectId: string) {
    return milestones.filter((item) => item.projectId === projectId);
  }

  getInspections(projectId: string) {
    return inspections.filter((item) => item.projectId === projectId);
  }

  getConfirmations(projectId: string) {
    return confirmations.filter((item) => item.projectId === projectId);
  }

  getAttachments(projectId: string) {
    return attachments.filter((item) => item.projectId === projectId);
  }

  getDashboard(role: UserRole) {
    const dashboard = dashboards.find((item) => item.role === role);
    if (!dashboard) {
      throw new NotFoundException(`Dashboard for role ${role} was not found`);
    }
    return dashboard;
  }
}

