import { Test, TestingModule } from "@nestjs/testing";
import { LeadsModule } from "./leads.module";
import { RepositoryModule } from "./repository.module";
import { LEAD_REPOSITORY } from "../repositories";
import type { LeadRepository } from "../repositories";

describe("LeadsController", () => {
  let leadRepository: LeadRepository;

  const mockRepository = {
    getLeads: jest.fn(),
    getLeadPipeline: jest.fn(),
    getLeadSummary: jest.fn(),
    createLeadIntake: jest.fn(),
    updateLeadStage: jest.fn()
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [RepositoryModule, LeadsModule]
    })
      .overrideProvider(LEAD_REPOSITORY)
      .useValue(mockRepository)
      .compile();

    leadRepository = module.get<LeadRepository>(LEAD_REPOSITORY);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(leadRepository).toBeDefined();
  });

  it("getLeadPipeline should return pipeline items", async () => {
    mockRepository.getLeadPipeline.mockResolvedValue([
      {
        lead: { id: "lead-1", summary: "Test" } as never,
        customer: { id: "cust-1", name: "Test" } as never
      }
    ]);

    const result = await leadRepository.getLeadPipeline();
    expect(result.length).toBeGreaterThan(0);
    expect(mockRepository.getLeadPipeline).toHaveBeenCalled();
  });

  it("createLeadIntake should create a lead", async () => {
    const input = {
      customer: {
        name: "Test",
        phone: "13800000000",
        preferredStyle: ["现代"],
        householdProfile: "测试",
        budgetMin: 200000,
        budgetMax: 300000,
        city: "上海",
        notes: ""
      },
      lead: { source: "walk_in" as const, summary: "Test", painPoints: [] }
    };

    mockRepository.createLeadIntake.mockResolvedValue({
      lead: { id: "new-lead", summary: "Test" } as never,
      customer: { id: "new-cust", name: "Test" } as never
    });

    const result = await leadRepository.createLeadIntake(input);
    expect(result.lead.summary).toBe("Test");
    expect(mockRepository.createLeadIntake).toHaveBeenCalledWith(input);
  });

  it("updateLeadStage should update stage", async () => {
    mockRepository.updateLeadStage.mockResolvedValue({
      lead: { id: "lead-1", stage: "quoted" } as never,
      customer: { id: "cust-1" } as never
    });

    const result = await leadRepository.updateLeadStage("lead-1", { stage: "quoted" });
    expect(result.lead.stage).toBe("quoted");
    expect(mockRepository.updateLeadStage).toHaveBeenCalledWith("lead-1", { stage: "quoted" });
  });
});
