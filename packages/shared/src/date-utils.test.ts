import { describe, it, expect } from "vitest";
import { createDateContext, getToday } from "./date-utils";

describe("date-utils", () => {
  describe("createDateContext", () => {
    it("使用传入的 today 作为基准", () => {
      const ctx = createDateContext("2026-04-19");
      expect(ctx.today).toBe("2026-04-19");
    });

    it("无效输入回退到真实 today", () => {
      const ctx = createDateContext("not-a-date");
      expect(ctx.today).toBe(getToday());
    });

    it("isOverdue: 逾期日期返回 true", () => {
      const ctx = createDateContext("2026-04-19");
      expect(ctx.isOverdue("2026-04-18")).toBe(true);
      expect(ctx.isOverdue("2026-04-19")).toBe(false);
      expect(ctx.isOverdue("2026-04-20")).toBe(false);
    });

    it("isOverdue: undefined 返回 false", () => {
      const ctx = createDateContext("2026-04-19");
      expect(ctx.isOverdue(undefined)).toBe(false);
    });

    it("isStale: 超过阈值返回 true", () => {
      const ctx = createDateContext("2026-04-19");
      expect(ctx.isStale("2026-04-08", 10)).toBe(true);
      expect(ctx.isStale("2026-04-09", 10)).toBe(false);
      expect(ctx.isStale("2026-04-10", 10)).toBe(false);
    });

    it("isStale: undefined 返回 false", () => {
      const ctx = createDateContext("2026-04-19");
      expect(ctx.isStale(undefined, 10)).toBe(false);
    });

    it("isTodayFollowUp: 只有等于 today 才返回 true", () => {
      const ctx = createDateContext("2026-04-19");
      expect(ctx.isTodayFollowUp("2026-04-19")).toBe(true);
      expect(ctx.isTodayFollowUp("2026-04-18")).toBe(false);
      expect(ctx.isTodayFollowUp(undefined)).toBe(false);
    });

    it("isBeforeToday: 严格小于 today 返回 true", () => {
      const ctx = createDateContext("2026-04-19");
      expect(ctx.isBeforeToday("2026-04-18")).toBe(true);
      expect(ctx.isBeforeToday("2026-04-19")).toBe(false);
      expect(ctx.isBeforeToday(undefined)).toBe(false);
    });
  });
});
