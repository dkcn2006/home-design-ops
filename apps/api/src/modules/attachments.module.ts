import { Controller, Get, Inject, Module, Param } from "@nestjs/common";
import { PROJECT_REPOSITORY } from "../repositories";
import type { ProjectRepository } from "../repositories";

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
