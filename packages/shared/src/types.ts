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
  projects: Array<{
    id: string;
    name: string;
    status: Project["status"];
    nextAction: string;
  }>;
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

