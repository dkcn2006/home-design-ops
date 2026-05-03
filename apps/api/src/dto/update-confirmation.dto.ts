import { IsIn, IsNotEmpty, IsString, IsOptional } from "class-validator";
import type { ConfirmationStatus } from "@home-design-ops/shared";

const confirmationStatuses: ConfirmationStatus[] = ["pending", "confirmed", "rejected"];

export class UpdateConfirmationDto {
  @IsIn(confirmationStatuses)
  @IsNotEmpty()
  status!: ConfirmationStatus;

  @IsString()
  @IsOptional()
  note?: string;
}
