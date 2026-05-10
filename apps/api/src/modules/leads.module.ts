import { Body, Controller, Get, Inject, Module, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { InternalGuard } from "../guards/roles.guard";
import { CreateLeadIntakeDto, UpdateLeadStageDto } from "../dto";
import { LEAD_REPOSITORY } from "../repositories";
import type { LeadRepository } from "../repositories";

@UseGuards(InternalGuard)
@Controller("leads")
class LeadsController {
  constructor(
    @Inject(LEAD_REPOSITORY) private readonly repository: LeadRepository
  ) {}

  @Get()
  findAll() {
    return this.repository.getLeads();
  }

  @Get("pipeline")
  getPipeline() {
    return this.repository.getLeadPipeline();
  }

  @Post("intake")
  createIntake(@Body() body: CreateLeadIntakeDto) {
    return this.repository.createLeadIntake(body);
  }

  @Patch(":id/stage")
  updateStage(@Param("id") id: string, @Body() body: UpdateLeadStageDto) {
    return this.repository.updateLeadStage(id, body);
  }
}

@UseGuards(InternalGuard)
@Controller("sales/leads")
class SalesLeadsController {
  constructor(
    @Inject(LEAD_REPOSITORY) private readonly repository: LeadRepository
  ) {}

  @Get()
  getSalesLeads() {
    return this.repository.getLeadPipeline();
  }

  @Get("summary")
  getSalesLeadSummary() {
    return this.repository.getLeadSummary();
  }
}

@Module({
  controllers: [LeadsController, SalesLeadsController]
})
export class LeadsModule {}
