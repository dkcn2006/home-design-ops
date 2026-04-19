import { Controller, Get, Module } from "@nestjs/common";
import { DemoRepositoryService } from "../services/demo-repository.service";

@Controller("leads")
class LeadsController {
  constructor(private readonly repository: DemoRepositoryService) {}

  @Get()
  findAll() {
    return this.repository.getLeads();
  }
}

@Module({
  controllers: [LeadsController]
})
export class LeadsModule {}

