import type {
  CreateLeadIntakeInput,
  Lead,
  LeadPipelineItem,
  LeadSummary,
  UpdateLeadStageInput
} from "@home-design-ops/shared";

export interface LeadRepository {
  getLeads(): Lead[] | Promise<Lead[]>;
  getLeadPipeline(): LeadPipelineItem[] | Promise<LeadPipelineItem[]>;
  getLeadSummary(): LeadSummary | Promise<LeadSummary>;
  createLeadIntake(input: CreateLeadIntakeInput): LeadPipelineItem | Promise<LeadPipelineItem>;
  updateLeadStage(leadId: string, input: UpdateLeadStageInput): LeadPipelineItem | Promise<LeadPipelineItem>;
}
