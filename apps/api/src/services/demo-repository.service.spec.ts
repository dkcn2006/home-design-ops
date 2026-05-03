import { Test, TestingModule } from "@nestjs/testing";
import { DemoRepositoryService } from "./demo-repository.service";
import { NotFoundException } from "@nestjs/common";

describe("DemoRepositoryService", () => {
  let service: DemoRepositoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DemoRepositoryService]
    }).compile();

    service = module.get<DemoRepositoryService>(DemoRepositoryService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("getCustomers", () => {
    it("返回客户列表", () => {
      const customers = service.getCustomers();
      expect(customers.length).toBeGreaterThan(0);
      expect(customers[0].name).toBeTruthy();
    });
  });

  describe("getLeadPipeline", () => {
    it("返回线索管道并关联客户", () => {
      const pipeline = service.getLeadPipeline();
      expect(pipeline.length).toBeGreaterThan(0);
      expect(pipeline[0].customer).toBeDefined();
      expect(pipeline[0].lead).toBeDefined();
    });
  });

  describe("getLeadSummary", () => {
    it("返回包含阶段统计的汇总", () => {
      const summary = service.getLeadSummary();
      expect(summary.total).toBeGreaterThan(0);
      expect(Object.keys(summary.stageCounts).length).toBeGreaterThan(0);
      expect(summary.conversionRate).toBeGreaterThanOrEqual(0);
    });
  });

  describe("getProjectArchive", () => {
    it("返回已知项目的完整档案", () => {
      const archive = service.getProjectArchive("proj-1");
      expect(archive).toBeDefined();
      expect(archive.project.id).toBe("proj-1");
      expect(archive.spaces.length).toBeGreaterThan(0);
    });

    it("不存在的项目抛出 NotFoundException", () => {
      expect(() => service.getProjectArchive("non-existent")).toThrow(NotFoundException);
    });
  });

  describe("createLeadIntake", () => {
    it("创建客户和线索并返回管道项", () => {
      const beforeCount = service.getCustomers().length;
      const result = service.createLeadIntake({
        customer: {
          name: "测试客户",
          phone: "13900000000",
          preferredStyle: ["现代"],
          householdProfile: "测试家庭",
          budgetMin: 200000,
          budgetMax: 300000,
          city: "上海",
          notes: ""
        },
        lead: {
          source: "walk_in",
          summary: "测试线索",
          painPoints: []
        }
      });

      expect(result.customer.name).toBe("测试客户");
      expect(result.lead.summary).toBe("测试线索");
      expect(service.getCustomers().length).toBe(beforeCount + 1);
    });
  });

  describe("updateLeadStage", () => {
    it("更新线索阶段", () => {
      const result = service.updateLeadStage("lead-1", { stage: "quoted" });
      expect(result.lead.stage).toBe("quoted");
    });

    it("不存在的线索抛出 NotFoundException", () => {
      expect(() => service.updateLeadStage("non-existent", { stage: "quoted" })).toThrow(NotFoundException);
    });
  });
});
