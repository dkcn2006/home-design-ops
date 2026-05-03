import { IsString, IsOptional, IsNumber, Min, IsNotEmpty } from "class-validator";

export class AiRequirementDto {
  @IsString()
  @IsNotEmpty()
  content!: string;
}

export class AiLayoutDto {
  @IsString()
  @IsNotEmpty()
  brief!: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  budget?: number;
}

export class AiRenderingDto {
  @IsString()
  @IsNotEmpty()
  content!: string;
}

export class AiDrawingReviewDto {
  @IsString()
  @IsNotEmpty()
  content!: string;
}

export class AiInspectionDigestDto {
  @IsString()
  @IsNotEmpty()
  content!: string;
}
