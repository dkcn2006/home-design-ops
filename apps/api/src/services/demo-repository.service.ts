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
import type {
  CreateLeadIntakeInput,
  DashboardSummary,
  LeadPipelineItem,
  PortfolioOverview,
  ProjectArchive,
  UpdateLeadStageInput,
  UpdateConfirmationInput,
  UserRole
} from "@home-design-ops/shared";

@Injectable()
export class DemoRepositoryService {
  getCustomers() {
    return customers;
  }

  getLeads() {
    return leads;
  }

  getLeadPipeline(): LeadPipelineItem[] {
    return leads.map((lead) => {
      const customer = customers.find((item) => item.id === lead.customerId);
      if (!customer) {
        throw new NotFoundException(`Customer for lead ${lead.id} was not found`);
      }

      const linkedProject = projects.find((item) => item.leadId === lead.id);

      return {
        lead,
        customer,
        linkedProject: linkedProject
          ? {
              id: linkedProject.id,
              name: linkedProject.name,
              status: linkedProject.status,
              code: linkedProject.code
            }
          : undefined
      };
    });
  }

  createLeadIntake(input: CreateLeadIntakeInput): LeadPipelineItem {
    const now = new Date().toISOString();
    const customerId = this.buildId("cust", customers);
    const leadId = this.buildId("lead", leads);

    const customer = {
      id: customerId,
      createdAt: now,
      updatedAt: now,
      createdBy: "system",
      ...input.customer
    };

    const lead = {
      id: leadId,
      createdAt: now,
      updatedAt: now,
      createdBy: "system",
      customerId,
      source: input.lead.source,
      stage: input.lead.stage ?? "new",
      expectedSignDate: input.lead.expectedSignDate,
      summary: input.lead.summary,
      painPoints: input.lead.painPoints
    };

    customers.unshift(customer);
    leads.unshift(lead);

    return {
      lead,
      customer
    };
  }

  updateLeadStage(leadId: string, input: UpdateLeadStageInput) {
    const lead = leads.find((item) => item.id === leadId);
    if (!lead) {
      throw new NotFoundException(`Lead ${leadId} was not found`);
    }

    lead.stage = input.stage;
    lead.updatedAt = new Date().toISOString();

    const customer = customers.find((item) => item.id === lead.customerId);
    if (!customer) {
      throw new NotFoundException(`Customer for lead ${leadId} was not found`);
    }

    const linkedProject = projects.find((item) => item.leadId === lead.id);

    return {
      lead,
      customer,
      linkedProject: linkedProject
        ? {
            id: linkedProject.id,
            name: linkedProject.name,
            status: linkedProject.status,
            code: linkedProject.code
          }
        : undefined
    };
  }

  getProjects() {
    return projects;
  }

  getPortfolioOverview(): PortfolioOverview {
    return {
      metrics: {
        customers: customers.length,
        leads: leads.length,
        activeProjects: projects.filter((item) => item.status !== "completed").length,
        pendingConfirmations: confirmations.filter((item) => item.status === "pending").length,
        openIssues: inspections.flatMap((item) => item.issues).filter((item) => !item.resolved).length,
        totalQuotationValue: quotations.reduce((sum, item) => sum + item.amount, 0)
      },
      projects: projects.map((project) => {
        const customer = customers.find((item) => item.id === project.customerId);
        const lead = leads.find((item) => item.id === project.leadId);
        const requirementSheet = requirementSheets.find((item) => item.id === project.currentRequirementSheetId);
        const nextMilestone = milestones
          .filter((item) => item.projectId === project.id && item.status !== "done")
          .sort((a, b) => a.plannedDate.localeCompare(b.plannedDate))[0];

        if (!customer || !lead || !requirementSheet) {
          throw new NotFoundException(`Project ${project.id} is missing related data`);
        }

        return {
          id: project.id,
          code: project.code,
          name: project.name,
          customerName: customer.name,
          city: customer.city,
          status: project.status,
          leadStage: lead.stage,
          areaSqm: project.areaSqm,
          budgetRange: {
            min: customer.budgetMin,
            max: customer.budgetMax
          },
          currentRequirementSummary: requirementSheet.summary,
          currentDesignVersion: designVersions.find((item) => item.id === project.currentDesignVersionId)?.version,
          currentRenderingVersion: renderingVersions.find((item) => item.id === project.currentRenderingVersionId)?.version,
          currentConstructionDrawingVersion: constructionDrawingVersions.find(
            (item) => item.id === project.currentConstructionDrawingVersionId
          )?.version,
          quotationAmount: quotations
            .filter((item) => item.projectId === project.id)
            .reduce((sum, item) => sum + item.amount, 0),
          pendingConfirmationCount: confirmations.filter(
            (item) => item.projectId === project.id && item.status === "pending"
          ).length,
          openIssueCount: inspections
            .filter((item) => item.projectId === project.id)
            .flatMap((item) => item.issues)
            .filter((item) => !item.resolved).length,
          nextMilestone: nextMilestone
            ? {
                name: nextMilestone.name,
                plannedDate: nextMilestone.plannedDate,
                status: nextMilestone.status
              }
            : undefined
        };
      })
    };
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

  updateConfirmation(projectId: string, confirmationId: string, input: UpdateConfirmationInput) {
    const confirmation = confirmations.find((item) => item.projectId === projectId && item.id === confirmationId);
    if (!confirmation) {
      throw new NotFoundException(`Confirmation ${confirmationId} was not found in project ${projectId}`);
    }

    confirmation.status = input.status;
    confirmation.note = input.note?.trim() || confirmation.note;
    confirmation.updatedAt = new Date().toISOString();

    return confirmation;
  }

  getAttachments(projectId: string) {
    return attachments.filter((item) => item.projectId === projectId);
  }

  getDashboard(role: UserRole) {
    const dashboard = dashboards.find((item) => item.role === role);
    if (!dashboard) {
      throw new NotFoundException(`Dashboard for role ${role} was not found`);
    }

    return {
      ...dashboard,
      metrics: this.buildDashboardMetrics(dashboard)
    };
  }

  private buildDashboardMetrics(dashboard: DashboardSummary): DashboardSummary["metrics"] {
    const pendingConfirmations = confirmations.filter((item) => item.status === "pending").length;
    const quotationValue = quotations.reduce((sum, item) => sum + item.amount, 0);
    const openIssues = inspections.flatMap((item) => item.issues).filter((item) => !item.resolved).length;

    return {
      ...dashboard.metrics,
      activeProjects: projects.filter((item) => item.status !== "completed").length,
      pendingConfirmations,
      quotationValue,
      openIssues
    };
  }

  private buildId(prefix: string, collection: Array<{ id: string }>) {
    return `${prefix}-${collection.length + 1}`;
  }
}
