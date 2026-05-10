// @ts-nocheck
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
  Space,
  TaskFlowItem,
  WorkspaceRiskItem,
  WorkspaceActivityItem,
  MetricCard,
  RoleProjectFocusItem,
  RiskSeverity
} from "@home-design-ops/shared";
import { createDateContext, type DateContext } from "@home-design-ops/shared";

// ─── 内联仪表盘模板（原 seed dashboards） ───
// 在 Prisma 生产模式下，仪表盘数据来源于实时聚合，此处仅保留固定配置结构。
const dashboardTemplates: DashboardSummary[] = [
  {
    role: "sales",
    metrics: { activeProjects: 0, pendingConfirmations: 0, quotationValue: 0, openIssues: 0 },
    focus: ["补齐客户需求结构化记录", "跟进待确认增项"],
    projects: []
  },
  {
    role: "designer",
    metrics: { activeProjects: 0, pendingConfirmations: 0, quotationValue: 0, openIssues: 0 },
    focus: ["完成方案 V3 调整", "整理材质说明待客户确认"],
    projects: []
  },
  {
    role: "project_manager",
    metrics: { activeProjects: 0, pendingConfirmations: 0, quotationValue: 0, openIssues: 0 },
    focus: ["推进施工图交底", "关闭高柜电源位问题"],
    projects: []
  }
];

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
    const leads: any[] = await this.prisma.lead.findMany({ include: { customer: true } });
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
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      select: { id: true, code: true, name: true, status: true, createdAt: true, updatedAt: true, createdBy: true, areaSqm: true }
    });
    if (!project) {
      throw new NotFoundException(`Project ${projectId} was not found`);
    }

    const [tasks, projectSpaces, phases] = (await Promise.all([
      this.prisma.projectTask.findMany({
        where: { projectId },
        include: { assignee: true, phase: true, space: true }
      }),
      this.prisma.space.findMany({ where: { projectId } }),
      this.prisma.workflowPhase.findMany({ orderBy: { order: "asc" } })
    ])) as any[];

    const today = this.date.today;
    const activeRiskTasks = tasks.filter((task) => task.status === "blocked" || task.status === "waiting_client");
    const blockedSpaceIds = new Set(activeRiskTasks.map((task) => task.spaceId ?? "space-project"));

    const projectLevelSpace: Space = {
      id: "space-project",
      createdAt: project.createdAt.toISOString(),
      updatedAt: project.updatedAt.toISOString(),
      createdBy: project.createdBy,
      updatedBy: "",
      projectId,
      name: "全项目",
      type: "other",
      areaSqm: project.areaSqm,
      constraints: ["跨空间事项"]
    };

    const allSpaces = [...projectSpaces.map((s) => this.toSpace(s)), projectLevelSpace];

    const summary = {
      totalTaskCount: tasks.length,
      blockedTaskCount: tasks.filter((task) => task.status === "blocked").length,
      waitingClientCount: tasks.filter((task) => task.status === "waiting_client").length,
      overdueTaskCount: tasks.filter((task) => {
        const due = task.dueDate ? (task.dueDate as Date).toISOString().slice(0, 10) : undefined;
        return due && due < today && task.status !== "done" && task.status !== "canceled";
      }).length,
      blockedSpaceCount: blockedSpaceIds.size
    };

    const spaceGroups = allSpaces.map((space) => {
      const spaceTaskCards: ProjectTaskCard[] = tasks
        .filter((task) => (task.spaceId ?? "space-project") === space.id)
        .map((task) => ({
          task: task as unknown as ProjectTask,
          assignee: (task as unknown as { assignee: User }).assignee,
          phase: (task as unknown as { phase: WorkflowPhase }).phase,
          space: task.spaceId ? (task as unknown as { space: Space }).space : undefined
        }));

      const phaseGroups = phases
        .map((phase) => ({
          phase: phase as unknown as WorkflowPhase,
          tasks: spaceTaskCards.filter((card) => card.task.phaseId === phase.id)
        }))
        .filter((group) => group.tasks.length > 0);

      return { space, phases: phaseGroups };
    }).filter((group) => group.phases.length > 0);

    return {
      project: {
        id: project.id,
        code: project.code,
        name: project.name,
        status: project.status as Project["status"]
      },
      summary,
      spaces: spaceGroups
    };
  }

  async getProjectArchive(projectId: string): Promise<ProjectArchive> {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      include: {
        customer: true,
        lead: true,
        spaces: true,
        requirementSheet: true,
        designVersions: true,
        renderingVersions: true,
        constructionDrawingVersions: true,
        quotations: true,
        changeOrders: true,
        milestones: true,
        inspections: true,
        confirmations: true,
        attachments: true
      }
    });

    if (!project) {
      throw new NotFoundException(`Project ${projectId} was not found`);
    }

    return {
      project: project as unknown as Project,
      customer: project.customer as unknown as Customer,
      lead: project.lead as unknown as Lead,
      spaces: project.spaces as unknown as Space[],
      requirementSheet: project.requirementSheet as unknown as RequirementSheet,
      designVersions: project.designVersions as unknown as DesignVersion[],
      renderingVersions: project.renderingVersions as unknown as RenderingVersion[],
      constructionDrawingVersions: project.constructionDrawingVersions as unknown as ConstructionDrawingVersion[],
      quotations: project.quotations as unknown as Quotation[],
      changeOrders: project.changeOrders as unknown as ChangeOrder[],
      milestones: project.milestones as unknown as ProjectMilestone[],
      inspections: project.inspections as unknown as InspectionRecord[],
      confirmations: project.confirmations as unknown as ConfirmationRecord[],
      attachments: project.attachments as unknown as Attachment[]
    };
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

    // 联动更新关联的 waiting_client 任务
    const linkedTasks: any[] = await this.prisma.projectTask.findMany({
      where: {
        projectId,
        status: "waiting_client"
      }
    });

    const linkedTask = linkedTasks.find((task) => {
      const entities = (task.linkedEntities as Array<{ type: string; entityId: string }>) ?? [];
      return entities.some((e) => e.type === "confirmation_record" && e.entityId === confirmationId);
    });

    if (linkedTask) {
      const updateData: Prisma.ProjectTaskUpdateInput = { updatedAt: new Date() };
      if (input.status === "confirmed") {
        updateData.status = "done";
        updateData.completedAt = new Date();
        updateData.blockedReason = null;
      } else if (input.status === "rejected") {
        updateData.status = "blocked";
        updateData.blockedReason = input.note?.trim()
          ? `客户驳回：${input.note.trim()}`
          : "客户驳回确认，等待重新沟通。";
      }
      await this.prisma.projectTask.update({ where: { id: linkedTask.id }, data: updateData });
    }

    // 同步更新 workItems 中对应的客户确认任务
    const linkedWorkItems: any[] = await this.prisma.workItem.findMany({
      where: {
        projectId,
        type: "client_confirmation",
        status: { in: ["todo", "in_progress", "blocked"] }
      }
    });

    for (const workItem of linkedWorkItems) {
      const wiUpdate: Prisma.WorkItemUpdateInput = { updatedAt: new Date() };
      if (input.status === "confirmed") {
        wiUpdate.status = "done";
      } else if (input.status === "rejected") {
        wiUpdate.status = "blocked";
        wiUpdate.summary = input.note?.trim()
          ? `客户驳回：${input.note.trim()}`
          : workItem.summary;
      }
      await this.prisma.workItem.update({ where: { id: workItem.id }, data: wiUpdate });
    }

    return confirmation as unknown as ConfirmationRecord;
  }

  async getAttachments(projectId: string): Promise<Attachment[]> {
    return this.prisma.attachment.findMany({ where: { projectId } }) as unknown as Promise<Attachment[]>;
  }

  async getWorkspaceHome(): Promise<WorkspaceHome> {
    const overview = await this.getPortfolioOverview();
    const tasks = await this.buildTaskFlow();
    const risks = await this.buildRisks();
    const activities = await this.buildActivities();

    const roleDefinitions = this.getRoleDefinitions();
    const today = this.date.today;

    const roleSummaries = roleDefinitions.map((definition) => ({
      role: definition.role,
      label: definition.label,
      summary: definition.summary,
      taskCount: tasks.filter((item) => item.role === definition.role && item.status !== "done").length,
      riskCount: risks.filter((item) => item.ownerRole === definition.role).length,
      activeProjects: definition.dashboard.metrics.activeProjects,
      primaryTask: tasks.find((item) => item.role === definition.role)?.title,
      targetPath: `/role/${definition.role}`
    }));

    const stageSummary = [
      { stage: "discovery" as const, label: "待量房", count: overview.projects.filter((item) => item.status === "discovery").length },
      { stage: "design" as const, label: "方案设计", count: overview.projects.filter((item) => item.status === "design").length },
      { stage: "detailing" as const, label: "施工准备", count: overview.projects.filter((item) => item.status === "detailing").length },
      { stage: "delivery" as const, label: "施工中", count: overview.projects.filter((item) => item.status === "delivery").length },
      { stage: "completed" as const, label: "已完工", count: overview.projects.filter((item) => item.status === "completed").length }
    ];

    return {
      metrics: {
        ...overview.metrics,
        overdueTasks: tasks.filter((item) => item.status !== "done" && this.date.isOverdue(item.dueDate)).length,
        activeRisks: risks.length
      },
      tasks: tasks.slice(0, 8),
      risks: risks.slice(0, 6),
      activities: activities.slice(0, 8),
      roleSummaries,
      stageSummary,
      projectLine: overview.projects
    };
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
    const updateData: Prisma.ProjectTaskUpdateInput = {
      status: input.status,
      updatedAt: new Date()
    };
    if (input.status === "done") {
      updateData.completedAt = new Date();
    } else {
      updateData.completedAt = null;
    }

    const task = await this.prisma.projectTask.update({
      where: { id: taskId },
      data: updateData
    });

    // P7.2: 待客户确认任务自动生成确认记录
    if (input.status === "waiting_client") {
      const existingConfirmation = await this.prisma.confirmationRecord.findFirst({
        where: { targetId: taskId }
      });
      if (!existingConfirmation) {
        const project = await this.prisma.project.findUnique({
          where: { id: task.projectId },
          include: { customer: true }
        });
        const now = new Date();
        await this.prisma.confirmationRecord.create({
          data: {
            projectId: task.projectId,
            targetId: taskId,
            type: "proposal",
            status: "pending",
            clientName: project?.customer?.name ?? "客户",
            note: "",
            createdAt: now,
            updatedAt: now,
            createdBy: "system",
            updatedBy: "system"
          }
        });
      }
    }

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
    const [
      customers,
      leads,
      projects,
      pendingConfirmations,
      inspections,
      quotations,
      requirementSheets,
      designVersions,
      renderingVersions,
      constructionDrawingVersions,
      milestones
    ] = (await Promise.all([
      this.prisma.customer.findMany(),
      this.prisma.lead.findMany(),
      this.prisma.project.findMany(),
      this.prisma.confirmationRecord.findMany({ where: { status: "pending" } }),
      this.prisma.inspectionRecord.findMany(),
      this.prisma.quotation.findMany(),
      this.prisma.requirementSheet.findMany(),
      this.prisma.designVersion.findMany(),
      this.prisma.renderingVersion.findMany(),
      this.prisma.constructionDrawingVersion.findMany(),
      this.prisma.projectMilestone.findMany()
    ])) as any[];

    const openIssues = inspections.reduce((sum, inspection) => {
      const issues = (inspection.issues as Array<{ resolved?: boolean }>) ?? [];
      return sum + issues.filter((issue) => !issue.resolved).length;
    }, 0);

    const totalQuotationValue = quotations.reduce((sum, q) => sum + (q.amount ?? 0), 0);

    const projectItems = projects.map((project) => {
      const customer = customers.find((c) => c.id === project.customerId);
      const lead = leads.find((l) => l.id === project.leadId);
      const requirementSheet = requirementSheets.find((r) => r.id === project.currentRequirementSheetId);
      const nextMilestone = milestones
        .filter((m) => m.projectId === project.id && m.status !== "done")
        .sort((a, b) => a.plannedDate.toISOString().localeCompare(b.plannedDate.toISOString()))[0];

      return {
        id: project.id,
        code: project.code,
        name: project.name,
        customerName: customer?.name ?? "",
        city: customer?.city ?? "",
        status: project.status as Project["status"],
        leadStage: lead?.stage as Lead["stage"] ?? "new",
        areaSqm: project.areaSqm,
        budgetRange: {
          min: customer?.budgetMin ?? 0,
          max: customer?.budgetMax ?? 0
        },
        currentRequirementSummary: requirementSheet?.summary ?? "",
        currentDesignVersion: designVersions.find((dv) => dv.id === project.currentDesignVersionId)?.version,
        currentRenderingVersion: renderingVersions.find((rv) => rv.id === project.currentRenderingVersionId)?.version,
        currentConstructionDrawingVersion: constructionDrawingVersions.find(
          (cdv) => cdv.id === project.currentConstructionDrawingVersionId
        )?.version,
        quotationAmount: quotations
          .filter((q) => q.projectId === project.id)
          .reduce((sum, q) => sum + (q.amount ?? 0), 0),
        pendingConfirmationCount: pendingConfirmations.filter((c) => c.projectId === project.id).length,
        openIssueCount: inspections
          .filter((i) => i.projectId === project.id)
          .reduce((sum, inspection) => {
            const issues = (inspection.issues as Array<{ resolved?: boolean }>) ?? [];
            return sum + issues.filter((issue) => !issue.resolved).length;
          }, 0),
        nextMilestone: nextMilestone
          ? {
              name: nextMilestone.name,
              plannedDate: nextMilestone.plannedDate.toISOString().slice(0, 10),
              status: nextMilestone.status as ProjectMilestone["status"]
            }
          : undefined
      };
    });

    return {
      metrics: {
        customers: customers.length,
        leads: leads.length,
        activeProjects: projects.filter((p) => p.status !== "completed").length,
        pendingConfirmations: pendingConfirmations.length,
        openIssues,
        totalQuotationValue
      },
      projects: projectItems
    };
  }

  async getDashboard(role: UserRole): Promise<DashboardSummary> {
    const template = dashboardTemplates.find((d) => d.role === role);
    if (!template) {
      throw new NotFoundException(`Dashboard for role ${role} was not found`);
    }

    const metrics = await this.buildDashboardMetrics(template);

    // 为 dashboard 的 projects 填充实时数据
    const projects: any[] = await this.prisma.project.findMany({
      where: { status: { not: "completed" } },
      include: { customer: true }
    });

    const focusProjects: RoleProjectFocusItem[] = projects.slice(0, 3).map((project) => ({
      id: project.id,
      name: project.name,
      status: project.status as Project["status"],
      nextAction: "推进中",
      customerName: (project as unknown as { customer: Customer }).customer?.name ?? "",
      targetPath: `/projects/${project.id}`
    }));

    return {
      role,
      metrics,
      focus: template.focus,
      projects: focusProjects
    };
  }

  async getRoleWorkbench(role: UserRole): Promise<RoleWorkbench> {
    if (role !== "sales" && role !== "designer" && role !== "project_manager") {
      throw new NotFoundException(`Workbench for role ${role} was not found`);
    }

    const definition = this.getRoleDefinitions().find((item) => item.role === role);
    if (!definition) {
      throw new NotFoundException(`Workbench for role ${role} was not found`);
    }

    const allTasks = await this.buildTaskFlow();
    const allRisks = await this.buildRisks();
    const allActivities = await this.buildActivities();

    const tasks = allTasks.filter((item) => item.role === role);
    const risks = allRisks.filter(
      (item) => item.ownerRole === role || (role === "project_manager" && item.ownerRole === "detailer")
    );
    const activity = allActivities.filter((item) =>
      tasks.some((task) => task.projectId && task.projectId === item.projectId)
    );

    return {
      role,
      title: definition.title,
      subtitle: definition.summary,
      metrics: definition.metricBuilder(tasks, risks),
      inbox: tasks,
      risks,
      activity: activity.slice(0, 6),
      focusProjects: definition.dashboard.projects
    };
  }

  async getUsers(): Promise<User[]> {
    return this.prisma.user.findMany() as unknown as Promise<User[]>;
  }

  async getWorkflowPhases(): Promise<WorkflowPhase[]> {
    return this.prisma.workflowPhase.findMany() as unknown as Promise<WorkflowPhase[]>;
  }

  // ─── 私有辅助方法 ───

  private toSpace(prismaSpace: Record<string, unknown>): Space {
    return {
      id: prismaSpace.id as string,
      createdAt: (prismaSpace.createdAt as Date).toISOString(),
      updatedAt: (prismaSpace.updatedAt as Date).toISOString(),
      createdBy: prismaSpace.createdBy as string,
      updatedBy: prismaSpace.updatedBy as string,
      projectId: prismaSpace.projectId as string,
      name: prismaSpace.name as string,
      type: prismaSpace.type as Space["type"],
      areaSqm: prismaSpace.areaSqm as number,
      constraints: prismaSpace.constraints as string[]
    };
  }

  private async buildTaskFlow(): Promise<TaskFlowItem[]> {
    const workItems: any[] = await this.prisma.workItem.findMany();
    const projects: any[] = await this.prisma.project.findMany({ include: { customer: true } });
    const leads = await this.prisma.lead.findMany({ include: { customer: true } });

    return workItems
      .map((item) => {
        const project = item.projectId
          ? projects.find((p) => p.id === item.projectId)
          : undefined;
        const lead = item.leadId
          ? leads.find((l) => l.id === item.leadId)
          : undefined;
        const customer = project
          ? (project as unknown as { customer: Customer }).customer
          : lead
            ? (lead as unknown as { customer: Customer }).customer
            : undefined;

        return {
          id: item.id,
          title: item.title,
          summary: item.summary,
          dueDate: item.dueDate.toISOString().slice(0, 10),
          role: item.role as TaskFlowItem["role"],
          status: item.status as TaskFlowItem["status"],
          priority: item.priority as TaskFlowItem["priority"],
          type: item.type as TaskFlowItem["type"],
          projectId: project?.id,
          projectName: project?.name,
          customerName: customer?.name,
          targetPath: item.targetPath
        };
      })
      .sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  }

  private async buildRisks(): Promise<WorkspaceRiskItem[]> {
    const [inspections, confirmations, milestones, projects] = (await Promise.all([
      this.prisma.inspectionRecord.findMany({ include: { milestone: true } }),
      this.prisma.confirmationRecord.findMany(),
      this.prisma.projectMilestone.findMany(),
      this.prisma.project.findMany()
    ])) as any[];

    const issueRisks: WorkspaceRiskItem[] = inspections.flatMap((inspection) => {
      const issues = (inspection.issues as Array<{ resolved?: boolean; title: string; severity: RiskSeverity; assigneeRole: UserRole }>) ?? [];
      const project = projects.find((p) => p.id === inspection.projectId);
      return issues.flatMap((issue, index) => {
        if (issue.resolved) return [];
        const ownerRole = this.toWorkspaceRole(issue.assigneeRole);
        if (!ownerRole) return [];
        return [{
          id: `${inspection.id}-issue-${index}`,
          title: issue.title,
          summary: `${inspection.summary}，需由${issue.assigneeRole}继续处理。`,
          severity: issue.severity,
          ownerRole,
          projectId: project?.id,
          projectName: project?.name,
          targetPath: project ? `/projects/${project.id}` : "/"
        }];
      });
    });

    const confirmationRisks: WorkspaceRiskItem[] = confirmations
      .filter((item) => item.status === "pending")
      .map((item) => {
        const project = projects.find((p) => p.id === item.projectId);
        return {
          id: item.id,
          title: `${item.clientName} 尚未完成${item.type === "change_order" ? "增减项" : "客户"}确认`,
          summary: "关键确认节点仍未闭环，后续设计、报价或施工推进会受到影响。",
          severity: "medium",
          ownerRole: "sales",
          projectId: project?.id,
          projectName: project?.name,
          targetPath: project ? `/client/${project.id}` : "/"
        };
      });

    const milestoneRisks: WorkspaceRiskItem[] = milestones.flatMap((item) => {
      if (item.status === "done") return [];
      const project = projects.find((p) => p.id === item.projectId);
      const ownerRole = this.toWorkspaceRole(item.ownerRole);
      if (!ownerRole) return [];
      return [{
        id: item.id,
        title: `${item.name} 节点待推进`,
        summary: `${item.plannedDate.toISOString().slice(0, 10)} 前需要完成准备，避免项目推进延迟。`,
        severity: item.status === "in_progress" ? "medium" : "low",
        ownerRole,
        projectId: project?.id,
        projectName: project?.name,
        targetPath: project ? `/projects/${project.id}` : "/"
      }];
    });

    const rejectedConfirmationRisks: WorkspaceRiskItem[] = confirmations
      .filter((item) => item.status === "rejected")
      .map((item) => {
        const project = projects.find((p) => p.id === item.projectId);
        return {
          id: `${item.id}-rejected`,
          title: `${item.clientName} 驳回了${item.type === "change_order" ? "增减项" : "客户"}确认`,
          summary: item.note ? `客户意见：${item.note}` : "客户驳回确认，需重新沟通并推动再次确认。",
          severity: "high",
          ownerRole: "sales",
          projectId: project?.id,
          projectName: project?.name,
          targetPath: project ? `/client/${project.id}` : "/"
        };
      });

    return [...issueRisks, ...confirmationRisks, ...milestoneRisks, ...rejectedConfirmationRisks].sort((a, b) => {
      const severityOrder: Record<WorkspaceRiskItem["severity"], number> = { high: 0, medium: 1, low: 2 };
      return severityOrder[a.severity] - severityOrder[b.severity];
    });
  }

  private async buildActivities(): Promise<WorkspaceActivityItem[]> {
    const [confirmations, changeOrders, milestones, projects] = (await Promise.all([
      this.prisma.confirmationRecord.findMany(),
      this.prisma.changeOrder.findMany(),
      this.prisma.projectMilestone.findMany(),
      this.prisma.project.findMany()
    ])) as any[];

    const confirmationActivities = confirmations.map((item) => {
      const project = projects.find((p) => p.id === item.projectId);
      const statusText = item.status === "pending" ? "待处理" : item.status === "confirmed" ? "已确认" : "已驳回";
      const typeText = item.type === "change_order" ? "增减项" : "确认";
      return {
        id: item.id,
        type: "confirmation" as const,
        title: `${item.clientName}${statusText}${typeText}`,
        summary: "客户侧确认记录已写入项目留痕。",
        occurredAt: item.updatedAt.toISOString(),
        projectId: project?.id,
        projectName: project?.name,
        targetPath: project ? `/client/${project.id}` : "/"
      };
    });

    const changeActivities = changeOrders.map((item) => {
      const project = projects.find((p) => p.id === item.projectId);
      return {
        id: item.id,
        type: "change_order" as const,
        title: `设计变更：${item.title}`,
        summary: `${item.reason}，金额变化 ¥${(item.amountDelta ?? 0).toLocaleString()}。`,
        occurredAt: item.updatedAt.toISOString(),
        projectId: project?.id,
        projectName: project?.name,
        targetPath: project ? `/projects/${project.id}` : "/"
      };
    });

    const milestoneActivities = milestones.map((item) => {
      const project = projects.find((p) => p.id === item.projectId);
      return {
        id: item.id,
        type: "milestone" as const,
        title: `施工节点：${item.name}`,
        summary: `${item.plannedDate.toISOString().slice(0, 10)} 计划推进，当前状态 ${item.status}。`,
        occurredAt: item.updatedAt.toISOString(),
        projectId: project?.id,
        projectName: project?.name,
        targetPath: project ? `/projects/${project.id}` : "/"
      };
    });

    return [...confirmationActivities, ...changeActivities, ...milestoneActivities].sort((a, b) =>
      b.occurredAt.localeCompare(a.occurredAt)
    );
  }

  private async buildDashboardMetrics(dashboard: DashboardSummary): Promise<DashboardSummary["metrics"]> {
    const [pendingConfirmations, quotations, inspections, projects] = (await Promise.all([
      this.prisma.confirmationRecord.findMany({ where: { status: "pending" } }),
      this.prisma.quotation.findMany(),
      this.prisma.inspectionRecord.findMany(),
      this.prisma.project.findMany()
    ])) as any[];

    const openIssues = inspections.reduce((sum, inspection) => {
      const issues = (inspection.issues as Array<{ resolved?: boolean }>) ?? [];
      return sum + issues.filter((issue) => !issue.resolved).length;
    }, 0);

    const quotationValue = quotations.reduce((sum, q) => sum + (q.amount ?? 0), 0);

    return {
      ...dashboard.metrics,
      activeProjects: projects.filter((p) => p.status !== "completed").length,
      pendingConfirmations: pendingConfirmations.length,
      quotationValue,
      openIssues
    };
  }

  private getRoleDefinitions(): Array<{
    role: Extract<UserRole, "sales" | "designer" | "project_manager">;
    label: string;
    title: string;
    summary: string;
    dashboard: DashboardSummary;
    metricBuilder: (tasks: TaskFlowItem[], risks: WorkspaceRiskItem[]) => MetricCard[];
  }> {
    return [
      {
        role: "sales",
        label: "销售工作台",
        title: "销售工作台",
        summary: "聚焦今日待跟进、高意向客户和待客户确认事项。",
        dashboard: dashboardTemplates.find((item) => item.role === "sales")!,
        metricBuilder: (tasks, risks) => [
          { label: "今日待跟进", value: String(tasks.length), note: "线索跟进与客户确认", tone: "attention" },
          {
            label: "待客户确认",
            value: String(0), // 实时值由调用方决定
            note: "需要推动客户回复",
            tone: "attention"
          },
          {
            label: "签约金额视图",
            value: "¥0", // 实时值由调用方决定
            note: "当前报价池",
            tone: "positive"
          },
          { label: "转化阻塞", value: String(risks.length), note: "需立即处理的风险点" }
        ]
      },
      {
        role: "designer",
        label: "设计工作台",
        title: "设计工作台",
        summary: "围绕待出图、待客户确认和设计变更组织当前工作。",
        dashboard: dashboardTemplates.find((item) => item.role === "designer")!,
        metricBuilder: (tasks, risks) => [
          { label: "待出图任务", value: String(tasks.filter((item) => item.type === "design_output").length), note: "方案与材质说明" },
          { label: "待确认反馈", value: String(tasks.filter((item) => item.type === "client_confirmation").length), note: "等待客户确认闭环", tone: "attention" },
          { label: "设计风险", value: String(risks.length), note: "图纸与现场问题" },
          { label: "当前项目", value: String(0), note: "跨项目协同中" }
        ]
      },
      {
        role: "project_manager",
        label: "项目经理工作台",
        title: "项目经理工作台",
        summary: "聚焦施工节点、验收待办和延期风险项目。",
        dashboard: dashboardTemplates.find((item) => item.role === "project_manager")!,
        metricBuilder: (tasks, risks) => [
          { label: "今日施工节点", value: String(tasks.filter((item) => item.type === "milestone").length), note: "需要现场推进" },
          { label: "待处理问题", value: String(tasks.filter((item) => item.type === "inspection_issue").length), note: "问题闭环压力", tone: "attention" },
          { label: "风险项目", value: String(risks.length), note: "节点或问题预警", tone: "attention" },
          { label: "在建项目", value: String(0), note: "当前负责范围" }
        ]
      }
    ];
  }

  private toWorkspaceRole(role: UserRole): WorkspaceRiskItem["ownerRole"] | null {
    if (role === "sales" || role === "designer" || role === "detailer" || role === "project_manager") {
      return role;
    }
    return null;
  }
}
