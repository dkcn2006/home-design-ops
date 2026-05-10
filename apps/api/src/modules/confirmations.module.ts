import { Body, Controller, Get, Inject, Module, Param, Patch, UseGuards } from "@nestjs/common";
import { InternalGuard } from "../guards/roles.guard";
import { UpdateConfirmationDto } from "../dto";
import { PROJECT_REPOSITORY } from "../repositories";
import type { ProjectRepository } from "../repositories";

@UseGuards(InternalGuard)
@Controller("projects/:id/confirmations")
class ConfirmationsController {
  constructor(
    @Inject(PROJECT_REPOSITORY) private readonly repository: ProjectRepository
  ) {}

  @Get()
  findAll(@Param("id") id: string) {
    return this.repository.getConfirmations(id);
  }

  @Patch(":confirmationId")
  update(
    @Param("id") projectId: string,
    @Param("confirmationId") confirmationId: string,
    @Body() body: UpdateConfirmationDto
  ) {
    return this.repository.updateConfirmation(projectId, confirmationId, body);
  }
}

@Module({
  controllers: [ConfirmationsController]
})
export class ConfirmationsModule {}
