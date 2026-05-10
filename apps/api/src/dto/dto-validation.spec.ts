import "reflect-metadata";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { CreateCustomerDto } from "./create-customer.dto";
import { CreateLeadDto } from "./create-lead.dto";
import { UpdateLeadStageDto } from "./update-lead-stage.dto";
import { CreateLeadIntakeDto } from "./create-lead-intake.dto";

describe("DTO Validation", () => {
  describe("CreateCustomerDto", () => {
    it("should pass with valid data", async () => {
      const dto = plainToInstance(CreateCustomerDto, {
        name: "测试客户",
        phone: "13800000000",
        preferredStyle: ["现代"],
        householdProfile: "三口之家",
        budgetMin: 200000,
        budgetMax: 300000,
        city: "上海",
        notes: ""
      });
      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it("should fail without name", async () => {
      const dto = plainToInstance(CreateCustomerDto, {
        phone: "13800000000",
        preferredStyle: ["现代"],
        householdProfile: "三口之家",
        budgetMin: 200000,
        budgetMax: 300000,
        city: "上海",
        notes: ""
      });
      const errors = await validate(dto);
      expect(errors.some((e) => e.property === "name")).toBe(true);
    });

    it("should fail with invalid budget", async () => {
      const dto = plainToInstance(CreateCustomerDto, {
        name: "测试客户",
        phone: "13800000000",
        preferredStyle: ["现代"],
        householdProfile: "三口之家",
        budgetMin: "not-a-number",
        budgetMax: 300000,
        city: "上海",
        notes: ""
      });
      const errors = await validate(dto);
      expect(errors.some((e) => e.property === "budgetMin")).toBe(true);
    });
  });

  describe("CreateLeadDto", () => {
    it("should pass with valid source", async () => {
      const dto = plainToInstance(CreateLeadDto, {
        source: "walk_in",
        summary: "测试线索",
        painPoints: ["预算紧张"]
      });
      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it("should fail with invalid source", async () => {
      const dto = plainToInstance(CreateLeadDto, {
        source: "invalid_source",
        summary: "测试线索",
        painPoints: []
      });
      const errors = await validate(dto);
      expect(errors.some((e) => e.property === "source")).toBe(true);
    });

    it("should allow optional stage", async () => {
      const dto = plainToInstance(CreateLeadDto, {
        source: "referral",
        summary: "测试",
        painPoints: []
      });
      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });
  });

  describe("UpdateLeadStageDto", () => {
    it("should pass with valid stage", async () => {
      const dto = plainToInstance(UpdateLeadStageDto, { stage: "quoted" });
      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it("should fail with invalid stage", async () => {
      const dto = plainToInstance(UpdateLeadStageDto, { stage: "invalid" });
      const errors = await validate(dto);
      expect(errors.some((e) => e.property === "stage")).toBe(true);
    });

    it("should fail when stage is empty", async () => {
      const dto = plainToInstance(UpdateLeadStageDto, { stage: "" });
      const errors = await validate(dto);
      expect(errors.some((e) => e.property === "stage")).toBe(true);
    });
  });

  describe("CreateLeadIntakeDto", () => {
    it("should validate nested DTOs", async () => {
      const dto = plainToInstance(CreateLeadIntakeDto, {
        customer: {
          name: "测试",
          phone: "13800000000",
          preferredStyle: ["现代"],
          householdProfile: "测试",
          budgetMin: 200000,
          budgetMax: 300000,
          city: "上海",
          notes: ""
        },
        lead: {
          source: "walk_in",
          summary: "测试",
          painPoints: []
        }
      });
      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });
  });
});
