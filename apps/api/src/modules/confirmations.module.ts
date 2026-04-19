import { Body, Controller, Get, Module, Param, Patch } from "@nestjs/common";
import type { UpdateConfirmationInput } from "@home-design-ops/shared";
import { DemoRepositoryService } from "../services/demo-repository.service";

@Controller("projects/:id/confirmations")
class ConfirmationsController {
  constructor(private readonly repository: DemoRepositoryService) {}

  @Get()
  findAll(@Param("id") id: string) {
    return this.repository.getConfirmations(id);
  }

  @Patch(":confirmationId")
  update(
    @Param("id") projectId: string,
    @Param("confirmationId") confirmationId: string,
    @Body() body: UpdateConfirmationInput
  ) {
    return this.repository.updateConfirmation(projectId, confirmationId, body);
  }
}

@Module({
  controllers: [ConfirmationsController]
})
export class ConfirmationsModule {}
