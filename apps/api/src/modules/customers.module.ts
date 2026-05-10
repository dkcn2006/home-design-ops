import { Controller, Get, Inject, Module, UseGuards } from "@nestjs/common";
import { InternalGuard } from "../guards/roles.guard";
import { CUSTOMER_REPOSITORY } from "../repositories";
import type { CustomerRepository } from "../repositories";

@UseGuards(InternalGuard)
@Controller("customers")
class CustomersController {
  constructor(
    @Inject(CUSTOMER_REPOSITORY) private readonly repository: CustomerRepository
  ) {}

  @Get()
  findAll() {
    return this.repository.getCustomers();
  }
}

@Module({
  controllers: [CustomersController]
})
export class CustomersModule {}
