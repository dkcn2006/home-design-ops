import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaClient, Prisma } from "@prisma/client";
import type {
  CustomerRepository,
  DashboardRepository,
  LeadRepository,
  ProjectRepository,
  TaskRepository
} from "../repositories";
import type {
  CreateLeadIntakeInput,
  DashboardSummary,
  Lead,
  LeadPipelineItem,
  LeadSummary,
  Project,
  ProjectTask,
  ProjectTaskBoard,
  ProjectArchive,
  ConfirmationRecord,
  Attachment,
  ChangeOrder,
  ConstructionDrawingVersion,
  DesignVersion,
  InspectionRecord,
  ProjectMilestone,
  Quotation,
  RenderingVersion,
  RequirementSheet,
  UpdateConfirmationInput,
  UpdateLeadStageInput,
  UpdateTaskAssigneeInput,
  UpdateTaskStatusInput,
  PortfolioOverview,
  RoleWorkbench,
  User,
  UserRole,
  WorkspaceHome,
  WorkflowPhase,
  ProjectTaskCard,
  Customer,
  Space
} from "@home-design-ops/shared";
import { createDateContext, type DateContext } from "@home-design-ops/shared";

@Injectable()
export class PrismaRepositoryService
  implements CustomerRepository, LeadRepository, ProjectRepository, TaskRepository, DashboardRepository
{
  private readonly prisma: PrismaClient;
  private readonly date: DateContext;

  constructor() {
    this.prisma = new PrismaClient();
    this.date = createDateContext(process.env.DEMO_TODAY);
  }

  // ─── CustomerRepository ───

  async getCustomers(): Promise<Customer[]> {
    return this.prisma.customer.findMany();
  }

  // ─── LeadRepository ───

  async getLeads(): Promise<Lead[]> {
    return this.prisma.lead.findMany();
  }

  async getLeadPipeline(): Promise<LeadPipelineItem[]> {
    const leads = await this.prisma.lead.findMany({ include: { customer: true } });
    return leads.map((lead: Record<string, unknown>) => ({
      lead: lead as unknown as Lead,
      customer: (lead as unknown as { customer: Customer }).customer,
      linkedProject: undefined
    }));
  }

  async getLeadSummary(): Promise<LeadSummary> {
    const leads = await this.prisma.lead.findMany();
    const today = this.date.today;
    const STALE_DAYS = 10;

    const stageCounts = leads.reduce(
      (result: Record<string, number>, lead: Record<string, unknown>) => {
        const stage = lead.stage as string;
        if (stage in result) result[stage] += 1;
        return result;
      },
      { new: 0, contacted: 0, measured: 0, proposal: 0, quoted: 0, negotiating: 0, won: 0, lost: 0 }
    );

    const wonCount = stageCounts.won;
    const lostCount = stageCounts.lost;
    const effectiveLeadCount = Math.max(leads.length - lostCount, 1);

    return {
      total: leads.length,
      newCount: stageCounts.new,
      wonCount,
      lostCount,
      conversionRate: Math.round((wonCount / effectiveLeadCount) * 100),
      todayFollowUpCount: leads.filter((lead: Record<string, unknown>) => {
        const next = lead.nextFollowUpAt ? (lead.nextFollowUpAt as Date).toISOString().slice(0, 10) : undefined;
        return next === today;
      }).length,
      overdueFollowUpCount: leads.filter((lead: Record<string, unknown>) => {
        const next = lead.nextFollowUpAt ? (lead.nextFollowUpAt as Date).toISOString().slice(0, 10) : undefined;
        return next && next < today && lead.stage !== "won" && lead.stage !== "lost";
      }).length,
      staleLeadCount: leads.filter((lead: Record<string, unknown>) => {
        const last = lead.lastContactedAt ? (lead.lastContactedAt as Date).toISOString().slice(0, 10) : undefined;
        return this.date.isStale(last, STALE_DAYS) && lead.stage !== "won" && lead.stage !== "lost";
      }).length,
      highIntentCount: leads.filter((lead: Record<string, unknown>) => lead.intentLevel === "high" && lead.stage !== "won" && lead.stage !== "lost").length,
      stageCounts
    };
  }

  async createLeadIntake(input: CreateLeadIntakeInput): Promise<LeadPipelineItem> {
    const result = await this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const customer = await tx.customer.create({ data: input.customer as never });
      const lead = await tx.lead.create({
        data: {
          ...input.lead,
          customerId: customer.id,
          createdBy: "system"
        } as never
      });
      return { customer, lead };
    });
    return {
      lead: result.lead as unknown as Lead,
      customer: result.customer as unknown as Customer
    };
  }

  async updateLeadStage(leadId: string, input: UpdateLeadStageInput): Promise<LeadPipelineItem> {
    const lead = await this.prisma.lead.update({
      where: { id: leadId },
      data: { stage: input.stage },
      include: { customer: true }
    });
    return {
      lead: lead as unknown as Lead,
      customer: (lead as unknown as { customer: Customer }).customer,
      linkedProject: undefined
    };
  }

  // ─── ProjectRepository ───

  async getProjects(): Promise<Project[]> {
    return this.prisma.project.findMany() as unknown as Promise<Project[]>;
  }

  async getProjectTasks(projectId: string): Promise<ProjectTask[]> {
    return this.prisma.projectTask.findMany({ where: { projectId } }) as unknown as Promise<ProjectTask[]>;
  }

  async getProjectTaskBoard(projectId: string): Promise<ProjectTaskBoard> {
    throw new Error("Not yet implemented");
  }

  async getProjectArchive(projectId: string): Promise<ProjectArchive> {
    throw new Error("Not yet implemented");
  }

  async getRequirementSheet(projectId: string): Promise<RequirementSheet | undefined> {
    const sheet = await this.prisma.requirementSheet.findUnique({ where: { projectId } });
    return sheet as unknown as RequirementSheet | undefined;
  }

  async getDesignVersions(projectId: string): Promise<DesignVersion[]> {
    return this.prisma.designVersion.findMany({ where: { projectId } }) as unknown as Promise<DesignVersion[]>;
  }

  async getRenderingVersions(projectId: string): Promise<RenderingVersion[]> {
    return this.prisma.renderingVersion.findMany({ where: { projectId } }) as unknown as Promise<RenderingVersion[]>;
  }

  async getConstructionDrawingVersions(projectId: string): Promise<ConstructionDrawingVersion[]> {
    return this.prisma.constructionDrawingVersion.findMany({ where: { projectId } }) as unknown as Promise<ConstructionDrawingVersion[]>;
  }

  async getQuotations(projectId: string): Promise<Quotation[]> {
    return this.prisma.quotation.findMany({ where: { projectId } }) as unknown as Promise<Quotation[]>;
  }

  async getChangeOrders(projectId: string): Promise<ChangeOrder[]> {
    return this.prisma.changeOrder.findMany({ where: { projectId } }) as unknown as Promise<ChangeOrder[]>;
  }

  async getMilestones(projectId: string): Promise<ProjectMilestone[]> {
    return this.prisma.projectMilestone.findMany({ where: { projectId } }) as unknown as Promise<ProjectMilestone[]>;
  }

  async getInspections(projectId: string): Promise<InspectionRecord[]> {
    return this.prisma.inspectionRecord.findMany({ where: { projectId } }) as unknown as Promise<InspectionRecord[]>;
  }

  async getConfirmations(projectId: string): Promise<ConfirmationRecord[]> {
    return this.prisma.confirmationRecord.findMany({ where: { projectId } }) as unknown as Promise<ConfirmationRecord[]>;
  }

  async updateConfirmation(
    projectId: string,
    confirmationId: string,
    input: UpdateConfirmationInput
  ): Promise<ConfirmationRecord> {
    const confirmation = await this.prisma.confirmationRecord.update({
      where: { id: confirmationId },
      data: { status: input.status, note: input.note }
    });
    return confirmation as unknown as ConfirmationRecord;
  }

  async getAttachments(projectId: string): Promise<Attachment[]> {
    return this.prisma.attachment.findMany({ where: { projectId } }) as unknown as Promise<Attachment[]>;
  }

  async getWorkspaceHome(): Promise<WorkspaceHome> {
    throw new Error("Not yet implemented");
  }

  // ─── TaskRepository ───

  async getMyTasks(assigneeId: string): Promise<ProjectTaskCard[]> {
    const tasks = await this.prisma.projectTask.findMany({
      where: { assigneeId },
      include: { assignee: true, phase: true, space: true }
    });
    return tasks.map((task: Record<string, unknown>) => ({
      task: task as unknown as ProjectTask,
      assignee: (task as unknown as { assignee: User }).assignee,
      phase: (task as unknown as { phase: WorkflowPhase }).phase,
      space: (task as unknown as { space?: Space }).space
    })) as unknown as ProjectTaskCard[];
  }

  async updateTaskStatus(taskId: string, input: UpdateTaskStatusInput): Promise<ProjectTask> {
    const task = await this.prisma.projectTask.update({
      where: { id: taskId },
      data: { status: input.status }
    });
    return task as unknown as ProjectTask;
  }

  async updateTaskAssignee(taskId: string, input: UpdateTaskAssigneeInput): Promise<ProjectTask> {
    const task = await this.prisma.projectTask.update({
      where: { id: taskId },
      data: { assigneeId: input.assigneeId }
    });
    return task as unknown as ProjectTask;
  }

  // ─── DashboardRepository ───

  async getPortfolioOverview(): Promise<PortfolioOverview> {
    throw new Error("Not yet implemented");
  }

  async getDashboard(role: UserRole): Promise<DashboardSummary> {
    throw new Error("Not yet implemented");
  }

  async getRoleWorkbench(role: UserRole): Promise<RoleWorkbench> {
    throw new Error("Not yet implemented");
  }

  async getUsers(): Promise<User[]> {
    return this.prisma.user.findMany() as unknown as Promise<User[]>;
  }

  async getWorkflowPhases(): Promise<WorkflowPhase[]> {
    return this.prisma.workflowPhase.findMany() as unknown as Promise<WorkflowPhase[]>;
  }
}
