import { Controller, Get, Module, Param } from "@nestjs/common";
import { DemoRepositoryService } from "../services/demo-repository.service";

@Controller("projects/:id/confirmations")
class ConfirmationsController {
  constructor(private readonly repository: DemoRepositoryService) {}

  @Get()
  findAll(@Param("id") id: string) {
    return this.repository.getConfirmations(id);
  }
}

@Module({
  controllers: [ConfirmationsController]
})
export class ConfirmationsModule {}

