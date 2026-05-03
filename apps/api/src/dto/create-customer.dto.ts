import { IsString, IsOptional, IsArray, IsNumber, IsNotEmpty } from "class-validator";

export class CreateCustomerDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  phone!: string;

  @IsString()
  @IsOptional()
  email?: string;

  @IsArray()
  @IsString({ each: true })
  preferredStyle!: string[];

  @IsString()
  @IsNotEmpty()
  householdProfile!: string;

  @IsNumber()
  budgetMin!: number;

  @IsNumber()
  budgetMax!: number;

  @IsString()
  @IsNotEmpty()
  city!: string;

  @IsString()
  notes!: string;
}
