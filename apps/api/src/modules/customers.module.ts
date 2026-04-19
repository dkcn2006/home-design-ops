import { Controller, Get, Module } from "@nestjs/common";
import { DemoRepositoryService } from "../services/demo-repository.service";

@Controller("customers")
class CustomersController {
  constructor(private readonly repository: DemoRepositoryService) {}

  @Get()
  findAll() {
    return this.repository.getCustomers();
  }
}

@Module({
  controllers: [CustomersController]
})
export class CustomersModule {}

