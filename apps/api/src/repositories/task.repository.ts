import type {
  ProjectTaskCard,
  ProjectTask,
  UpdateTaskAssigneeInput,
  UpdateTaskStatusInput
} from "@home-design-ops/shared";

export interface TaskRepository {
  getMyTasks(assigneeId: string): ProjectTaskCard[] | Promise<ProjectTaskCard[]>;
  updateTaskStatus(taskId: string, input: UpdateTaskStatusInput): ProjectTask | Promise<ProjectTask>;
  updateTaskAssignee(taskId: string, input: UpdateTaskAssigneeInput): ProjectTask | Promise<ProjectTask>;
}
