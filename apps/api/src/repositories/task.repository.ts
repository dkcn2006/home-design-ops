import type {
  ProjectTaskCard,
  ProjectTask,
  UpdateTaskAssigneeInput,
  UpdateTaskStatusInput
} from "@home-design-ops/shared";

export interface TaskRepository {
  getMyTasks(assigneeId: string): ProjectTaskCard[];
  updateTaskStatus(taskId: string, input: UpdateTaskStatusInput): ProjectTask;
  updateTaskAssignee(taskId: string, input: UpdateTaskAssigneeInput): ProjectTask;
}
