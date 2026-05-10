import { describe, it, expect, vi } from "vitest";
import { submitConfirmationAction, createLeadIntakeAction, updateLeadStageAction } from "./actions";

// Mock the data layer
vi.mock("./data", () => ({
  updateConfirmation: vi.fn().mockResolvedValue({ id: "conf-1", status: "confirmed" }),
  createLeadIntake: vi.fn().mockResolvedValue({ lead: { id: "new-lead" } }),
  updateLeadStage: vi.fn().mockResolvedValue({ lead: { id: "lead-1", stage: "quoted" } })
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn()
}));

describe("Server Actions", () => {
  describe("submitConfirmationAction", () => {
    it("should return error on missing fields", async () => {
      const formData = new FormData();
      const result = await submitConfirmationAction(formData);
      expect(result).toEqual({ success: false, error: "Missing confirmation payload", code: "INVALID_INPUT" });
    });

    it("should process valid confirmation", async () => {
      const formData = new FormData();
      formData.append("projectId", "proj-1");
      formData.append("confirmationId", "conf-1");
      formData.append("status", "confirmed");
      formData.append("note", "客户已确认");

      await expect(submitConfirmationAction(formData)).resolves.not.toThrow();
    });
  });

  describe("createLeadIntakeAction", () => {
    it("should process valid lead intake", async () => {
      const formData = new FormData();
      formData.append("customerName", "测试客户");
      formData.append("phone", "13800000000");
      formData.append("preferredStyle", "现代,简约");
      formData.append("householdProfile", "三口之家");
      formData.append("budgetMin", "200000");
      formData.append("budgetMax", "300000");
      formData.append("city", "上海");
      formData.append("source", "walk_in");
      formData.append("summary", "测试线索");

      await expect(createLeadIntakeAction(formData)).resolves.not.toThrow();
    });
  });

  describe("updateLeadStageAction", () => {
    it("should return error on missing fields", async () => {
      const formData = new FormData();
      const result = await updateLeadStageAction(formData);
      expect(result).toEqual({ success: false, error: "Missing lead stage payload", code: "INVALID_INPUT" });
    });

    it("should process valid stage update", async () => {
      const formData = new FormData();
      formData.append("leadId", "lead-1");
      formData.append("stage", "quoted");

      await expect(updateLeadStageAction(formData)).resolves.not.toThrow();
    });
  });
});
