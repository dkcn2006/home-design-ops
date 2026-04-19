import { Body, Controller, Get, Module, Param, Patch, Post } from "@nestjs/common";
import type { CreateLeadIntakeInput, UpdateLeadStageInput } from "@home-design-ops/shared";
import { DemoRepositoryService } from "../services/demo-repository.service";

@Controller("leads")
class LeadsController {
  constructor(private readonly repository: DemoRepositoryService) {}

  @Get()
  findAll() {
    return this.repository.getLeads();
  }

  @Get("pipeline")
  getPipeline() {
    return this.repository.getLeadPipeline();
  }

  @Post("intake")
  createIntake(@Body() body: CreateLeadIntakeInput) {
    return this.repository.createLeadIntake(body);
  }

  @Patch(":id/stage")
  updateStage(@Param("id") id: string, @Body() body: UpdateLeadStageInput) {
    return this.repository.updateLeadStage(id, body);
  }
}

@Module({
  controllers: [LeadsController]
})
export class LeadsModule {}
