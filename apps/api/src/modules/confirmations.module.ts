import { Body, Controller, Get, Inject, Module, Param, Patch } from "@nestjs/common";
import { UpdateConfirmationDto } from "../dto";
import { PROJECT_REPOSITORY } from "../repositories";
import type { ProjectRepository } from "../repositories";

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
