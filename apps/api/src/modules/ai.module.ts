import { Body, Controller, Module, Post } from "@nestjs/common";
import {
  AiDrawingReviewDto,
  AiInspectionDigestDto,
  AiLayoutDto,
  AiRenderingDto,
  AiRequirementDto
} from "../dto";
import { AiOrchestrationService } from "../services/ai-orchestration.service";

@Controller("ai")
class AiController {
  constructor(private readonly ai: AiOrchestrationService) {}

  @Post("requirements")
  summarizeRequirement(@Body() payload: AiRequirementDto) {
    return this.ai.buildRequirementSuggestion(payload.content);
  }

  @Post("layout")
  generateLayoutSuggestion(@Body() payload: AiLayoutDto) {
    return this.ai.buildLayoutSuggestion(payload.brief, payload.budget);
  }

  @Post("rendering")
  generateRenderingGuidance(@Body() payload: AiRenderingDto) {
    return this.ai.buildRenderingSuggestion(payload.content);
  }

  @Post("drawings/review")
  reviewDrawing(@Body() payload: AiDrawingReviewDto) {
    return this.ai.buildDrawingReview(payload.content);
  }

  @Post("inspections/digest")
  summarizeInspection(@Body() payload: AiInspectionDigestDto) {
    return this.ai.buildInspectionDigest(payload.content);
  }

  @Post("tasks/draft")
  generateTaskDraft(@Body("requirementSummary") requirementSummary: string) {
    return this.ai.generateTaskDraft(requirementSummary);
  }

  @Post("risks/summary")
  generateRiskSummary(
    @Body() payload: { blockedTasks: Array<{ title: string; blockedReason?: string }> }
  ) {
    return this.ai.generateRiskSummary(payload.blockedTasks);
  }
}

@Module({
  controllers: [AiController],
  providers: [AiOrchestrationService]
})
export class AiModule {}
