import { Body, Controller, Get, Inject, Module, Param, Patch, Query } from "@nestjs/common";
import { UpdateTaskStatusDto, UpdateTaskAssigneeDto } from "../dto";
import { TASK_REPOSITORY } from "../repositories";
import type { TaskRepository } from "../repositories";

@Controller("tasks")
class TasksController {
  constructor(
    @Inject(TASK_REPOSITORY) private readonly repository: TaskRepository
  ) {}

  @Get("my")
  getMyTasks(@Query("assigneeId") assigneeId = "user-sales-1") {
    return this.repository.getMyTasks(assigneeId);
  }

  @Patch(":id/status")
  updateStatus(@Param("id") id: string, @Body() body: UpdateTaskStatusDto) {
    return this.repository.updateTaskStatus(id, body);
  }

  @Patch(":id/assignee")
  updateAssignee(@Param("id") id: string, @Body() body: UpdateTaskAssigneeDto) {
    return this.repository.updateTaskAssignee(id, body);
  }
}

@Module({
  controllers: [TasksController]
})
export class TasksModule {}
