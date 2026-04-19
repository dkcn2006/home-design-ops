import { Controller, Get, Module, Param } from "@nestjs/common";
import { DemoRepositoryService } from "../services/demo-repository.service";

@Controller("projects/:id/attachments")
class AttachmentsController {
  constructor(private readonly repository: DemoRepositoryService) {}

  @Get()
  findAll(@Param("id") id: string) {
    return this.repository.getAttachments(id);
  }
}

@Module({
  controllers: [AttachmentsController]
})
export class AttachmentsModule {}

