import { IsIn, IsNotEmpty } from "class-validator";
import type { LeadStage } from "@home-design-ops/shared";

const leadStages: LeadStage[] = [
  "new", "contacted", "measured", "proposal", "quoted", "negotiating", "won", "lost"
];

export class UpdateLeadStageDto {
  @IsIn(leadStages)
  @IsNotEmpty()
  stage!: LeadStage;
}
