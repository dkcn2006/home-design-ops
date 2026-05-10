import { Controller, Get, Inject, Module, Param, UseGuards } from "@nestjs/common";
import { InternalGuard } from "../guards/roles.guard";
import { PROJECT_REPOSITORY } from "../repositories";
import type { ProjectRepository } from "../repositories";

@UseGuards(InternalGuard)
@Controller("projects/:id/attachments")
class AttachmentsController {
  constructor(
    @Inject(PROJECT_REPOSITORY) private readonly repository: ProjectRepository
  ) {}

  @Get()
  findAll(@Param("id") id: string) {
    return this.repository.getAttachments(id);
  }
}

@Module({
  controllers: [AttachmentsController]
})
export class AttachmentsModule {}
