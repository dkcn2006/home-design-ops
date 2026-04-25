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
  projectTasks,
  projects,
  quotations,
  renderingVersions,
  requirementSheets,
  spaces,
  users,
  workflowPhases,
  workItems
} from "@home-design-ops/shared";
import type {
  CreateLeadIntakeInput,
  DashboardSummary,
  LeadSummary,
  MetricCard,
  LeadPipelineItem,
  PortfolioOverview,
  ProjectArchive,
  ProjectTaskBoard,
  RoleWorkbench,
  RoleProjectFocusItem,
  TaskFlowItem,
  UpdateTaskAssigneeInput,
  UpdateTaskStatusInput,
  UpdateLeadStageInput,
  UpdateConfirmationInput,
  UserRole,
  WorkspaceActivityItem,
  WorkspaceHome,
  WorkspaceRiskItem
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

  getLeadSummary(): LeadSummary {
    const today = "2026-04-19";
    const staleBefore = "2026-04-09";
    const stageCounts = leads.reduce(
      (result, lead) => {
        result[lead.stage] += 1;
        return result;
      },
      {
        new: 0,
        contacted: 0,
        measured: 0,
        proposal: 0,
        quoted: 0,
        negotiating: 0,
        won: 0,
        lost: 0
      } satisfies LeadSummary["stageCounts"]
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
      todayFollowUpCount: leads.filter((lead) => lead.nextFollowUpAt === today).length,
      overdueFollowUpCount: leads.filter((lead) => lead.nextFollowUpAt && lead.nextFollowUpAt < today && lead.stage !== "won" && lead.stage !== "lost").length,
      staleLeadCount: leads.filter((lead) => lead.lastContactedAt && lead.lastContactedAt < staleBefore && lead.stage !== "won" && lead.stage !== "lost").length,
      highIntentCount: leads.filter((lead) => lead.intentLevel === "high" && lead.stage !== "won" && lead.stage !== "lost").length,
      stageCounts
    };
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
      intentLevel: input.lead.intentLevel ?? "medium",
      ownerId: input.lead.ownerId ?? "user-sales-1",
      budgetRange: input.lead.budgetRange ?? `${Math.round(input.customer.budgetMin / 10000)}-${Math.round(input.customer.budgetMax / 10000)} 万`,
      houseInfo: input.lead.houseInfo ?? `${input.customer.city} 客户需求待补充`,
      requirementSummary: input.lead.requirementSummary ?? input.lead.summary,
      nextFollowUpAt: input.lead.nextFollowUpAt,
      lastContactedAt: now.slice(0, 10),
      lastContactSummary: input.lead.lastContactSummary ?? "新线索已录入，等待首次跟进。",
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

  getUsers() {
    return users;
  }

  getWorkflowPhases() {
    return workflowPhases;
  }

  getProjectTasks(projectId: string) {
    this.ensureProject(projectId);
    return projectTasks.filter((task) => task.projectId === projectId);
  }

  getProjectTaskBoard(projectId: string): ProjectTaskBoard {
    const project = this.ensureProject(projectId);
    const tasks = this.getProjectTasks(projectId);
    const today = "2026-04-19";
    const activeRiskTasks = tasks.filter((task) => task.status === "blocked" || task.status === "waiting_client");
    const blockedSpaceIds = new Set(activeRiskTasks.map((task) => task.spaceId ?? "space-project"));
    const projectLevelSpace = {
      id: "space-project",
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
      createdBy: project.createdBy,
      projectId,
      name: "全项目",
      type: "other" as const,
      areaSqm: project.areaSqm,
      constraints: ["跨空间事项"]
    };
    const projectSpaces = [...spaces.filter((space) => space.projectId === projectId), projectLevelSpace];

    return {
      project: {
        id: project.id,
        code: project.code,
        name: project.name,
        status: project.status
      },
      summary: {
        totalTaskCount: tasks.length,
        blockedTaskCount: tasks.filter((task) => task.status === "blocked").length,
        waitingClientCount: tasks.filter((task) => task.status === "waiting_client").length,
        overdueTaskCount: tasks.filter((task) => task.dueDate && task.dueDate < today && task.status !== "done" && task.status !== "canceled").length,
        blockedSpaceCount: blockedSpaceIds.size
      },
      spaces: projectSpaces.map((space) => ({
        space,
        phases: workflowPhases
          .map((phase) => ({
            phase,
            tasks: tasks
              .filter((task) => (task.spaceId ?? "space-project") === space.id && task.phaseId === phase.id)
              .map((task) => ({
                task,
                assignee: users.find((user) => user.id === task.assigneeId),
                phase,
                space
              }))
          }))
          .filter((phaseGroup) => phaseGroup.tasks.length > 0)
      })).filter((spaceGroup) => spaceGroup.phases.length > 0)
    };
  }

  getMyTasks(assigneeId: string) {
    return projectTasks
      .filter((task) => task.assigneeId === assigneeId)
      .map((task) => ({
        task,
        assignee: users.find((user) => user.id === task.assigneeId),
        phase: workflowPhases.find((phase) => phase.id === task.phaseId),
        space: task.spaceId ? spaces.find((space) => space.id === task.spaceId) : undefined
      }))
      .sort((a, b) => (a.task.dueDate ?? "").localeCompare(b.task.dueDate ?? ""));
  }

  updateTaskStatus(taskId: string, input: UpdateTaskStatusInput) {
    const task = this.ensureTask(taskId);
    task.status = input.status;
    task.updatedAt = new Date().toISOString();
    task.completedAt = input.status === "done" ? task.updatedAt : undefined;
    return task;
  }

  updateTaskAssignee(taskId: string, input: UpdateTaskAssigneeInput) {
    const task = this.ensureTask(taskId);
    const assignee = users.find((user) => user.id === input.assigneeId);
    if (!assignee) {
      throw new NotFoundException(`User ${input.assigneeId} was not found`);
    }
    task.assigneeId = input.assigneeId;
    task.updatedAt = new Date().toISOString();
    return task;
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

  getWorkspaceHome(): WorkspaceHome {
    const overview = this.getPortfolioOverview();
    const tasks = this.buildTaskFlow();
    const risks = this.buildRisks();
    const activities = this.buildActivities();
    const roleDefinitions = this.getRoleDefinitions();

    return {
      metrics: {
        ...overview.metrics,
        overdueTasks: tasks.filter((item) => item.status !== "done" && item.dueDate < "2026-04-19").length,
        activeRisks: risks.length
      },
      tasks: tasks.slice(0, 8),
      risks: risks.slice(0, 6),
      activities: activities.slice(0, 8),
      roleSummaries: roleDefinitions.map((definition) => ({
        role: definition.role,
        label: definition.label,
        summary: definition.summary,
        taskCount: tasks.filter((item) => item.role === definition.role && item.status !== "done").length,
        riskCount: risks.filter((item) => item.ownerRole === definition.role).length,
        activeProjects: definition.dashboard.metrics.activeProjects,
        primaryTask: tasks.find((item) => item.role === definition.role)?.title,
        targetPath: `/role/${definition.role}`
      })),
      stageSummary: [
        { stage: "discovery", label: "待量房", count: overview.projects.filter((item) => item.status === "discovery").length },
        { stage: "design", label: "方案设计", count: overview.projects.filter((item) => item.status === "design").length },
        { stage: "detailing", label: "施工准备", count: overview.projects.filter((item) => item.status === "detailing").length },
        { stage: "delivery", label: "施工中", count: overview.projects.filter((item) => item.status === "delivery").length },
        { stage: "completed", label: "已完工", count: overview.projects.filter((item) => item.status === "completed").length }
      ],
      projectLine: overview.projects
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

  getRoleWorkbench(role: UserRole): RoleWorkbench {
    if (role !== "sales" && role !== "designer" && role !== "project_manager") {
      throw new NotFoundException(`Workbench for role ${role} was not found`);
    }

    const definition = this.getRoleDefinitions().find((item) => item.role === role);
    if (!definition) {
      throw new NotFoundException(`Workbench for role ${role} was not found`);
    }

    const tasks = this.buildTaskFlow().filter((item) => item.role === role);
    const risks = this.buildRisks().filter((item) => item.ownerRole === role || (role === "project_manager" && item.ownerRole === "detailer"));
    const activity = this.buildActivities().filter((item) => tasks.some((task) => task.projectId && task.projectId === item.projectId));

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

  private buildTaskFlow(): TaskFlowItem[] {
    return workItems
      .map((item) => {
        const project = item.projectId ? projects.find((projectEntry) => projectEntry.id === item.projectId) : undefined;
        const lead = item.leadId ? leads.find((leadEntry) => leadEntry.id === item.leadId) : undefined;
        const customer = project
          ? customers.find((customerEntry) => customerEntry.id === project.customerId)
          : lead
            ? customers.find((customerEntry) => customerEntry.id === lead.customerId)
            : undefined;

        return {
          id: item.id,
          title: item.title,
          summary: item.summary,
          dueDate: item.dueDate,
          role: item.role,
          status: item.status,
          priority: item.priority,
          type: item.type,
          projectId: project?.id,
          projectName: project?.name,
          customerName: customer?.name,
          targetPath: item.targetPath
        };
      })
      .sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  }

  private buildRisks(): WorkspaceRiskItem[] {
    const issueRisks: WorkspaceRiskItem[] = inspections.flatMap((inspection) =>
      inspection.issues.flatMap((issue, index) => {
        if (issue.resolved) {
          return [];
        }
        const project = projects.find((item) => item.id === inspection.projectId);
        const ownerRole = this.toWorkspaceRole(issue.assigneeRole);
        if (!ownerRole) {
          return [];
        }
        return [
          {
            id: `${inspection.id}-issue-${index}`,
            title: issue.title,
            summary: `${inspection.summary}，需由${issue.assigneeRole}继续处理。`,
            severity: issue.severity,
            ownerRole,
            projectId: project?.id,
            projectName: project?.name,
            targetPath: project ? `/projects/${project.id}` : "/"
          }
        ];
      })
    );

    const confirmationRisks: WorkspaceRiskItem[] = confirmations
      .filter((item) => item.status === "pending")
      .map((item) => {
        const project = projects.find((projectEntry) => projectEntry.id === item.projectId);
        return {
          id: item.id,
          title: `${item.clientName} 尚未完成${item.type === "change_order" ? "增减项" : "客户"}确认`,
          summary: "关键确认节点仍未闭环，后续设计、报价或施工推进会受到影响。",
          severity: "medium",
          ownerRole: "sales",
          projectId: project?.id,
          projectName: project?.name,
          targetPath: project ? `/client/${project.id}` : "/"
        } satisfies WorkspaceRiskItem;
      });

    const milestoneRisks: WorkspaceRiskItem[] = milestones.flatMap((item) => {
      if (item.status === "done") {
        return [];
      }
        const project = projects.find((projectEntry) => projectEntry.id === item.projectId);
        const ownerRole = this.toWorkspaceRole(item.ownerRole);
        if (!ownerRole) {
          return [];
        }
        return [
          {
            id: item.id,
            title: `${item.name} 节点待推进`,
            summary: `${item.plannedDate} 前需要完成准备，避免项目推进延迟。`,
            severity: item.status === "in_progress" ? "medium" : "low",
            ownerRole,
            projectId: project?.id,
            projectName: project?.name,
            targetPath: project ? `/projects/${project.id}` : "/"
          }
        ];
      });

    return [...issueRisks, ...confirmationRisks, ...milestoneRisks].sort((a, b) => {
      const severityOrder: Record<WorkspaceRiskItem["severity"], number> = { high: 0, medium: 1, low: 2 };
      return severityOrder[a.severity] - severityOrder[b.severity];
    });
  }

  private buildActivities(): WorkspaceActivityItem[] {
    const confirmationActivities = confirmations.map((item) => {
      const project = projects.find((projectEntry) => projectEntry.id === item.projectId);
      return {
        id: item.id,
        type: "confirmation",
        title: `${item.clientName}${item.status === "pending" ? "待处理" : item.status === "confirmed" ? "已确认" : "已驳回"}${item.type === "change_order" ? "增减项" : "确认"}`,
        summary: item.note ?? "客户侧确认记录已写入项目留痕。",
        occurredAt: item.updatedAt,
        projectId: project?.id,
        projectName: project?.name,
        targetPath: project ? `/client/${project.id}` : "/"
      } satisfies WorkspaceActivityItem;
    });

    const changeActivities = changeOrders.map((item) => {
      const project = projects.find((projectEntry) => projectEntry.id === item.projectId);
      return {
        id: item.id,
        type: "change_order",
        title: `设计变更：${item.title}`,
        summary: `${item.reason}，金额变化 ¥${item.amountDelta.toLocaleString()}。`,
        occurredAt: item.updatedAt,
        projectId: project?.id,
        projectName: project?.name,
        targetPath: project ? `/projects/${project.id}` : "/"
      } satisfies WorkspaceActivityItem;
    });

    const milestoneActivities = milestones.map((item) => {
      const project = projects.find((projectEntry) => projectEntry.id === item.projectId);
      return {
        id: item.id,
        type: "milestone",
        title: `施工节点：${item.name}`,
        summary: `${item.plannedDate} 计划推进，当前状态 ${item.status}。`,
        occurredAt: item.updatedAt,
        projectId: project?.id,
        projectName: project?.name,
        targetPath: project ? `/projects/${project.id}` : "/"
      } satisfies WorkspaceActivityItem;
    });

    return [...confirmationActivities, ...changeActivities, ...milestoneActivities].sort((a, b) =>
      b.occurredAt.localeCompare(a.occurredAt)
    );
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
        dashboard: dashboards.find((item) => item.role === "sales")!,
        metricBuilder: (tasks, risks) => [
          { label: "今日待跟进", value: String(tasks.length), note: "线索跟进与客户确认", tone: "attention" },
          {
            label: "待客户确认",
            value: String(confirmations.filter((item) => item.status === "pending").length),
            note: "需要推动客户回复",
            tone: "attention"
          },
          {
            label: "签约金额视图",
            value: `¥${quotations.reduce((sum, item) => sum + item.amount, 0).toLocaleString()}`,
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
        dashboard: dashboards.find((item) => item.role === "designer")!,
        metricBuilder: (tasks, risks) => [
          { label: "待出图任务", value: String(tasks.filter((item) => item.type === "design_output").length), note: "方案与材质说明" },
          { label: "待确认反馈", value: String(tasks.filter((item) => item.type === "client_confirmation").length), note: "等待客户确认闭环", tone: "attention" },
          { label: "设计风险", value: String(risks.length), note: "图纸与现场问题" },
          { label: "当前项目", value: String(projects.filter((item) => item.status !== "completed").length), note: "跨项目协同中" }
        ]
      },
      {
        role: "project_manager",
        label: "项目经理工作台",
        title: "项目经理工作台",
        summary: "聚焦施工节点、验收待办和延期风险项目。",
        dashboard: dashboards.find((item) => item.role === "project_manager")!,
        metricBuilder: (tasks, risks) => [
          { label: "今日施工节点", value: String(tasks.filter((item) => item.type === "milestone").length), note: "需要现场推进" },
          { label: "待处理问题", value: String(tasks.filter((item) => item.type === "inspection_issue").length), note: "问题闭环压力", tone: "attention" },
          { label: "风险项目", value: String(risks.length), note: "节点或问题预警", tone: "attention" },
          { label: "在建项目", value: String(projects.filter((item) => item.status === "delivery" || item.status === "detailing").length), note: "当前负责范围" }
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

  private buildId(prefix: string, collection: Array<{ id: string }>) {
    return `${prefix}-${collection.length + 1}`;
  }

  private ensureProject(projectId: string) {
    const project = projects.find((item) => item.id === projectId);
    if (!project) {
      throw new NotFoundException(`Project ${projectId} was not found`);
    }
    return project;
  }

  private ensureTask(taskId: string) {
    const task = projectTasks.find((item) => item.id === taskId);
    if (!task) {
      throw new NotFoundException(`Task ${taskId} was not found`);
    }
    return task;
  }
}
