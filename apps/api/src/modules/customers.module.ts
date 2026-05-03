import { Controller, Get, Inject, Module } from "@nestjs/common";
import { CUSTOMER_REPOSITORY } from "../repositories";
import type { CustomerRepository } from "../repositories";

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
