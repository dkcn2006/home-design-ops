import { IsString, IsOptional, IsArray, IsIn, IsNotEmpty } from "class-validator";
import type { LeadSource, LeadStage, LeadIntentLevel } from "@home-design-ops/shared";

const leadSources: LeadSource[] = [
  "walk_in", "referral", "xiaohongshu", "douyin", "local_ads", "partner", "other"
];
const leadStages: LeadStage[] = [
  "new", "contacted", "measured", "proposal", "quoted", "negotiating", "won", "lost"
];
const intentLevels: LeadIntentLevel[] = ["high", "medium", "low"];

export class CreateLeadDto {
  @IsIn(leadSources)
  source!: LeadSource;

  @IsIn(leadStages)
  @IsOptional()
  stage?: LeadStage;

  @IsIn(intentLevels)
  @IsOptional()
  intentLevel?: LeadIntentLevel;

  @IsString()
  @IsOptional()
  ownerId?: string;

  @IsString()
  @IsOptional()
  budgetRange?: string;

  @IsString()
  @IsOptional()
  houseInfo?: string;

  @IsString()
  @IsOptional()
  requirementSummary?: string;

  @IsString()
  @IsOptional()
  nextFollowUpAt?: string;

  @IsString()
  @IsOptional()
  lastContactSummary?: string;

  @IsString()
  @IsOptional()
  expectedSignDate?: string;

  @IsString()
  @IsNotEmpty()
  summary!: string;

  @IsArray()
  @IsString({ each: true })
  painPoints!: string[];
}
