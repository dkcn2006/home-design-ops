import type {
  ConfirmationRecord,
  Attachment,
  ChangeOrder,
  ConstructionDrawingVersion,
  DesignVersion,
  InspectionRecord,
  Project,
  ProjectArchive,
  ProjectMilestone,
  ProjectTask,
  ProjectTaskBoard,
  Quotation,
  RenderingVersion,
  RequirementSheet,
  UpdateConfirmationInput,
  WorkspaceHome
} from "@home-design-ops/shared";

export interface ProjectRepository {
  getProjects(): Project[] | Promise<Project[]>;
  getProjectTasks(projectId: string): ProjectTask[] | Promise<ProjectTask[]>;
  getProjectTaskBoard(projectId: string): ProjectTaskBoard | Promise<ProjectTaskBoard>;
  getProjectArchive(projectId: string): ProjectArchive | Promise<ProjectArchive>;
  getRequirementSheet(projectId: string): RequirementSheet | undefined | Promise<RequirementSheet | undefined>;
  getDesignVersions(projectId: string): DesignVersion[] | Promise<DesignVersion[]>;
  getRenderingVersions(projectId: string): RenderingVersion[] | Promise<RenderingVersion[]>;
  getConstructionDrawingVersions(projectId: string): ConstructionDrawingVersion[] | Promise<ConstructionDrawingVersion[]>;
  getQuotations(projectId: string): Quotation[] | Promise<Quotation[]>;
  getChangeOrders(projectId: string): ChangeOrder[] | Promise<ChangeOrder[]>;
  getMilestones(projectId: string): ProjectMilestone[] | Promise<ProjectMilestone[]>;
  getInspections(projectId: string): InspectionRecord[] | Promise<InspectionRecord[]>;
  getConfirmations(projectId: string): ConfirmationRecord[] | Promise<ConfirmationRecord[]>;
  updateConfirmation(
    projectId: string,
    confirmationId: string,
    input: UpdateConfirmationInput
  ): ConfirmationRecord | Promise<ConfirmationRecord>;
  getAttachments(projectId: string): Attachment[] | Promise<Attachment[]>;
  getWorkspaceHome(): WorkspaceHome | Promise<WorkspaceHome>;
}
