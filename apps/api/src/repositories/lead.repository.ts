import type {
  CreateLeadIntakeInput,
  Lead,
  LeadPipelineItem,
  LeadSummary,
  UpdateLeadStageInput
} from "@home-design-ops/shared";

export interface LeadRepository {
  getLeads(): Lead[];
  getLeadPipeline(): LeadPipelineItem[];
  getLeadSummary(): LeadSummary;
  createLeadIntake(input: CreateLeadIntakeInput): LeadPipelineItem;
  updateLeadStage(leadId: string, input: UpdateLeadStageInput): LeadPipelineItem;
}
