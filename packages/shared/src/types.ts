export type UserRole = "sales" | "designer" | "detailer" | "project_manager" | "client" | "admin";

export type LeadStage =
  | "new"
  | "following_up"
  | "site_measurement"
  | "proposal_pending"
  | "signed"
  | "closed";

export type AttachmentCategory =
  | "meeting_note"
  | "layout_model"
  | "rendering"
  | "construction_drawing"
  | "quotation"
  | "inspection"
  | "contract"
  | "other";

export type ConfirmationType = "proposal" | "quotation" | "change_order" | "milestone" | "completion";
export type ConfirmationStatus = "pending" | "confirmed" | "rejected";
export type VersionStatus = "draft" | "review" | "current" | "archived";
export type MilestoneStatus = "not_started" | "in_progress" | "blocked" | "done";
export type InspectionSeverity = "low" | "medium" | "high";
export type WorkItemStatus = "todo" | "in_progress" | "blocked" | "done";
export type WorkItemPriority = "high" | "medium" | "low";
export type WorkItemType =
  | "lead_follow_up"
  | "design_output"
  | "client_confirmation"
  | "quotation"
  | "milestone"
  | "inspection_issue"
  | "acceptance";
export type RiskSeverity = "high" | "medium" | "low";
export type ActivityType = "follow_up" | "confirmation" | "change_order" | "milestone" | "inspection";

export interface AuditFields {
  id: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface Customer extends AuditFields {
  name: string;
  phone: string;
  email?: string;
  preferredStyle: string[];
  householdProfile: string;
  budgetMin: number;
  budgetMax: number;
  city: string;
  notes: string;
}

export interface Lead extends AuditFields {
  customerId: string;
  source: string;
  stage: LeadStage;
  expectedSignDate?: string;
  summary: string;
  painPoints: string[];
}

export interface Space extends AuditFields {
  projectId: string;
  name: string;
  type: "living_room" | "kitchen" | "bedroom" | "bathroom" | "balcony" | "other";
  areaSqm: number;
  constraints: string[];
}

export interface RequirementSheet extends AuditFields {
  projectId: string;
  summary: string;
  goals: string[];
  risks: string[];
  pendingQuestions: string[];
  lifestyleTags: string[];
}

export interface Project extends AuditFields {
  customerId: string;
  leadId: string;
  code: string;
  name: string;
  location: string;
  areaSqm: number;
  status: "discovery" | "design" | "detailing" | "delivery" | "completed";
  currentRequirementSheetId: string;
  currentDesignVersionId?: string;
  currentRenderingVersionId?: string;
  currentConstructionDrawingVersionId?: string;
}

export interface DesignVersion extends AuditFields {
  projectId: string;
  version: string;
  summary: string;
  changeLog: string[];
  status: VersionStatus;
  fileAttachmentIds: string[];
}

export interface RenderingVersion extends AuditFields {
  projectId: string;
  version: string;
  styleDirection: string;
  highlights: string[];
  status: VersionStatus;
  fileAttachmentIds: string[];
}

export interface ConstructionDrawingVersion extends AuditFields {
  projectId: string;
  version: string;
  summary: string;
  checks: string[];
  status: VersionStatus;
  fileAttachmentIds: string[];
}

export interface Quotation extends AuditFields {
  projectId: string;
  linkedVersionId: string;
  amount: number;
  currency: string;
  summary: string;
  lineItems: Array<{ name: string; amount: number; category: string }>;
  status: "draft" | "submitted" | "approved";
}

export interface ChangeOrder extends AuditFields {
  projectId: string;
  linkedVersionId: string;
  title: string;
  reason: string;
  amountDelta: number;
  confirmationStatus: ConfirmationStatus;
}

export interface ProjectMilestone extends AuditFields {
  projectId: string;
  name: string;
  plannedDate: string;
  actualDate?: string;
  status: MilestoneStatus;
  ownerRole: UserRole;
}

export interface InspectionRecord extends AuditFields {
  projectId: string;
  milestoneId: string;
  summary: string;
  issues: Array<{
    title: string;
    severity: InspectionSeverity;
    assigneeRole: UserRole;
    resolved: boolean;
  }>;
}

export interface ConfirmationRecord extends AuditFields {
  projectId: string;
  targetId: string;
  type: ConfirmationType;
  status: ConfirmationStatus;
  clientName: string;
  note?: string;
}

export interface Attachment extends AuditFields {
  projectId?: string;
  filename: string;
  category: AttachmentCategory;
  url: string;
  linkedEntityId?: string;
}

export interface WorkItem extends AuditFields {
  role: Extract<UserRole, "sales" | "designer" | "detailer" | "project_manager">;
  type: WorkItemType;
  status: WorkItemStatus;
  priority: WorkItemPriority;
  title: string;
  summary: string;
  dueDate: string;
  targetPath: string;
  projectId?: string;
  leadId?: string;
}

export interface TaskFlowItem {
  id: string;
  title: string;
  summary: string;
  dueDate: string;
  role: WorkItem["role"];
  status: WorkItemStatus;
  priority: WorkItemPriority;
  type: WorkItemType;
  projectId?: string;
  projectName?: string;
  customerName?: string;
  targetPath: string;
}

export interface WorkspaceRiskItem {
  id: string;
  title: string;
  summary: string;
  severity: RiskSeverity;
  ownerRole: Extract<UserRole, "sales" | "designer" | "detailer" | "project_manager">;
  projectId?: string;
  projectName?: string;
  targetPath: string;
}

export interface WorkspaceActivityItem {
  id: string;
  type: ActivityType;
  title: string;
  summary: string;
  occurredAt: string;
  projectId?: string;
  projectName?: string;
  targetPath: string;
}

export interface MetricCard {
  label: string;
  value: string;
  note: string;
  tone?: "default" | "attention" | "positive";
}

export interface RoleProjectFocusItem {
  id: string;
  name: string;
  customerName: string;
  status: Project["status"];
  nextAction: string;
  targetPath: string;
}

export interface ProjectArchive {
  project: Project;
  customer: Customer;
  lead: Lead;
  spaces: Space[];
  requirementSheet: RequirementSheet;
  designVersions: DesignVersion[];
  renderingVersions: RenderingVersion[];
  constructionDrawingVersions: ConstructionDrawingVersion[];
  quotations: Quotation[];
  changeOrders: ChangeOrder[];
  milestones: ProjectMilestone[];
  inspections: InspectionRecord[];
  confirmations: ConfirmationRecord[];
  attachments: Attachment[];
}

export interface DashboardMetrics {
  activeProjects: number;
  pendingConfirmations: number;
  quotationValue: number;
  openIssues: number;
}

export interface DashboardSummary {
  role: UserRole;
  metrics: DashboardMetrics;
  focus: string[];
  projects: RoleProjectFocusItem[];
}

export interface ProjectPortfolioItem {
  id: string;
  code: string;
  name: string;
  customerName: string;
  city: string;
  status: Project["status"];
  leadStage: Lead["stage"];
  areaSqm: number;
  budgetRange: {
    min: number;
    max: number;
  };
  currentRequirementSummary: string;
  currentDesignVersion?: string;
  currentRenderingVersion?: string;
  currentConstructionDrawingVersion?: string;
  quotationAmount: number;
  pendingConfirmationCount: number;
  openIssueCount: number;
  nextMilestone?: {
    name: string;
    plannedDate: string;
    status: MilestoneStatus;
  };
}

export interface PortfolioOverview {
  metrics: {
    customers: number;
    leads: number;
    activeProjects: number;
    pendingConfirmations: number;
    openIssues: number;
    totalQuotationValue: number;
  };
  projects: ProjectPortfolioItem[];
}

export interface WorkspaceHome {
  metrics: PortfolioOverview["metrics"] & {
    overdueTasks: number;
    activeRisks: number;
  };
  tasks: TaskFlowItem[];
  risks: WorkspaceRiskItem[];
  activities: WorkspaceActivityItem[];
  roleSummaries: Array<{
    role: Extract<UserRole, "sales" | "designer" | "project_manager">;
    label: string;
    summary: string;
    taskCount: number;
    riskCount: number;
    activeProjects: number;
    primaryTask?: string;
    targetPath: string;
  }>;
  stageSummary: Array<{
    stage: Project["status"];
    label: string;
    count: number;
  }>;
  projectLine: ProjectPortfolioItem[];
}

export interface RoleWorkbench {
  role: Extract<UserRole, "sales" | "designer" | "project_manager">;
  title: string;
  subtitle: string;
  metrics: MetricCard[];
  inbox: TaskFlowItem[];
  risks: WorkspaceRiskItem[];
  activity: WorkspaceActivityItem[];
  focusProjects: RoleProjectFocusItem[];
}

export interface UpdateConfirmationInput {
  status: ConfirmationStatus;
  note?: string;
}

export interface CreateCustomerInput {
  name: string;
  phone: string;
  email?: string;
  preferredStyle: string[];
  householdProfile: string;
  budgetMin: number;
  budgetMax: number;
  city: string;
  notes: string;
}

export interface CreateLeadInput {
  source: string;
  stage?: LeadStage;
  expectedSignDate?: string;
  summary: string;
  painPoints: string[];
}

export interface CreateLeadIntakeInput {
  customer: CreateCustomerInput;
  lead: CreateLeadInput;
}

export interface UpdateLeadStageInput {
  stage: LeadStage;
}

export interface LeadPipelineItem {
  lead: Lead;
  customer: Customer;
  linkedProject?: Pick<Project, "id" | "name" | "status" | "code">;
}

export interface AiRequirementSuggestion {
  summary: string;
  goals: string[];
  risks: string[];
  pendingQuestions: string[];
  lifestyleTags: string[];
}

export interface AiLayoutSuggestion {
  layoutDirection: string;
  storageIdeas: string[];
  circulationAlerts: string[];
}

export interface AiRenderingSuggestion {
  narrative: string;
  preferredVisuals: string[];
  avoidVisuals: string[];
  recommendedOutputLevel: "directional" | "mid_fidelity" | "high_fidelity";
}

export interface AiDrawingReview {
  headline: string;
  issues: string[];
  handoffChecklist: string[];
}

export interface AiInspectionDigest {
  dailyReport: string;
  followUps: string[];
}
