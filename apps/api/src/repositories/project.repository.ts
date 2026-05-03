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
  getProjects(): Project[];
  getProjectTasks(projectId: string): ProjectTask[];
  getProjectTaskBoard(projectId: string): ProjectTaskBoard;
  getProjectArchive(projectId: string): ProjectArchive;
  getRequirementSheet(projectId: string): RequirementSheet | undefined;
  getDesignVersions(projectId: string): DesignVersion[];
  getRenderingVersions(projectId: string): RenderingVersion[];
  getConstructionDrawingVersions(projectId: string): ConstructionDrawingVersion[];
  getQuotations(projectId: string): Quotation[];
  getChangeOrders(projectId: string): ChangeOrder[];
  getMilestones(projectId: string): ProjectMilestone[];
  getInspections(projectId: string): InspectionRecord[];
  getConfirmations(projectId: string): ConfirmationRecord[];
  updateConfirmation(
    projectId: string,
    confirmationId: string,
    input: UpdateConfirmationInput
  ): ConfirmationRecord;
  getAttachments(projectId: string): Attachment[];
  getWorkspaceHome(): WorkspaceHome;
}
