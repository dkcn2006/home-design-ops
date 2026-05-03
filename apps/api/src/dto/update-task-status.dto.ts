import { IsIn, IsNotEmpty } from "class-validator";
import type { TaskStatus } from "@home-design-ops/shared";

const taskStatuses: TaskStatus[] = [
  "backlog", "todo", "in_progress", "blocked", "waiting_client",
  "waiting_internal", "done", "canceled"
];

export class UpdateTaskStatusDto {
  @IsIn(taskStatuses)
  @IsNotEmpty()
  status!: TaskStatus;
}
