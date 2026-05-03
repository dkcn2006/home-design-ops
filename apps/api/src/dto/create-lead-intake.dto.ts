import { ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { CreateCustomerDto } from "./create-customer.dto";
import { CreateLeadDto } from "./create-lead.dto";

export class CreateLeadIntakeDto {
  @ValidateNested()
  @Type(() => CreateCustomerDto)
  customer!: CreateCustomerDto;

  @ValidateNested()
  @Type(() => CreateLeadDto)
  lead!: CreateLeadDto;
}
