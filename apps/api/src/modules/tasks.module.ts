import { Body, Controller, Get, Module, Param, Patch, Query } from "@nestjs/common";
import type { UpdateTaskAssigneeInput, UpdateTaskStatusInput } from "@home-design-ops/shared";
import { DemoRepositoryService } from "../services/demo-repository.service";

@Controller("tasks")
class TasksController {
  constructor(private readonly repository: DemoRepositoryService) {}

  @Get("my")
  getMyTasks(@Query("assigneeId") assigneeId = "user-sales-1") {
    return this.repository.getMyTasks(assigneeId);
  }

  @Patch(":id/status")
  updateStatus(@Param("id") id: string, @Body() body: UpdateTaskStatusInput) {
    return this.repository.updateTaskStatus(id, body);
  }

  @Patch(":id/assignee")
  updateAssignee(@Param("id") id: string, @Body() body: UpdateTaskAssigneeInput) {
    return this.repository.updateTaskAssignee(id, body);
  }
}

@Module({
  controllers: [TasksController]
})
export class TasksModule {}
