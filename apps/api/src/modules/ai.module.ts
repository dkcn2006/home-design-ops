import { Body, Controller, Module, Post } from "@nestjs/common";
import {
  AiDrawingReview,
  AiInspectionDigest,
  AiLayoutSuggestion,
  AiRenderingSuggestion,
  AiRequirementSuggestion
} from "@home-design-ops/shared";
import { AiOrchestrationService } from "../services/ai-orchestration.service";

@Controller("ai")
class AiController {
  constructor(private readonly ai: AiOrchestrationService) {}

  @Post("requirements")
  summarizeRequirement(@Body("content") content: string): AiRequirementSuggestion {
    return this.ai.buildRequirementSuggestion(content);
  }

  @Post("layout")
  generateLayout(@Body() payload: { brief: string; budget?: number }): AiLayoutSuggestion {
    return this.ai.buildLayoutSuggestion(payload.brief, payload.budget);
  }

  @Post("rendering")
  generateRenderingGuidance(@Body("content") content: string): AiRenderingSuggestion {
    return this.ai.buildRenderingSuggestion(content);
  }

  @Post("drawings/review")
  reviewDrawing(@Body("content") content: string): AiDrawingReview {
    return this.ai.buildDrawingReview(content);
  }

  @Post("inspections/digest")
  summarizeInspection(@Body("content") content: string): AiInspectionDigest {
    return this.ai.buildInspectionDigest(content);
  }
}

@Module({
  controllers: [AiController],
  providers: [AiOrchestrationService]
})
export class AiModule {}

