"use server";

import { revalidatePath } from "next/cache";
import type { ConfirmationStatus, LeadSource, LeadStage } from "@home-design-ops/shared";
import { createLeadIntake, updateConfirmation, updateLeadStage, ApiError } from "./data";

export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string; code?: string };

export async function submitConfirmationAction(formData: FormData): Promise<ActionResult> {
  const projectId = String(formData.get("projectId") ?? "");
  const confirmationId = String(formData.get("confirmationId") ?? "");
  const status = String(formData.get("status") ?? "");
  const note = String(formData.get("note") ?? "").trim();

  if (!projectId || !confirmationId || !status) {
    return { success: false, error: "Missing confirmation payload", code: "INVALID_INPUT" };
  }

  try {
    await updateConfirmation(projectId, confirmationId, {
      status: status as ConfirmationStatus,
      note: note || undefined
    });

    revalidatePath(`/client/${projectId}`);
    revalidatePath(`/projects/${projectId}`);
    revalidatePath("/");
    return { success: true, data: undefined };
  } catch (err) {
    if (err instanceof ApiError) {
      return { success: false, error: err.message, code: err.code };
    }
    return { success: false, error: err instanceof Error ? err.message : "提交失败" };
  }
}

function parseList(value: FormDataEntryValue | null) {
  return String(value ?? "")
    .split(/[\n,，]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export async function createLeadIntakeAction(formData: FormData): Promise<ActionResult> {
  const budgetMin = Number(formData.get("budgetMin") ?? 0);
  const budgetMax = Number(formData.get("budgetMax") ?? 0);

  try {
    await createLeadIntake({
      customer: {
        name: String(formData.get("customerName") ?? "").trim(),
        phone: String(formData.get("phone") ?? "").trim(),
        email: String(formData.get("email") ?? "").trim() || undefined,
        preferredStyle: parseList(formData.get("preferredStyle")),
        householdProfile: String(formData.get("householdProfile") ?? "").trim(),
        budgetMin,
        budgetMax,
        city: String(formData.get("city") ?? "").trim(),
        notes: String(formData.get("customerNotes") ?? "").trim()
      },
      lead: {
        source: (String(formData.get("source") ?? "other").trim() as LeadSource) || "other",
        stage: (String(formData.get("stage") ?? "new").trim() as LeadStage) || "new",
        expectedSignDate: String(formData.get("expectedSignDate") ?? "").trim() || undefined,
        summary: String(formData.get("summary") ?? "").trim(),
        painPoints: parseList(formData.get("painPoints"))
      }
    });

    revalidatePath("/sales/leads");
    revalidatePath("/");
    revalidatePath("/role/sales");
    return { success: true, data: undefined };
  } catch (err) {
    if (err instanceof ApiError) {
      return { success: false, error: err.message, code: err.code };
    }
    return { success: false, error: err instanceof Error ? err.message : "创建失败" };
  }
}

export async function updateLeadStageAction(formData: FormData): Promise<ActionResult> {
  const leadId = String(formData.get("leadId") ?? "");
  const stage = String(formData.get("stage") ?? "") as LeadStage;

  if (!leadId || !stage) {
    return { success: false, error: "Missing lead stage payload", code: "INVALID_INPUT" };
  }

  try {
    await updateLeadStage(leadId, { stage });

    revalidatePath("/sales/leads");
    revalidatePath("/");
    revalidatePath("/role/sales");
    return { success: true, data: undefined };
  } catch (err) {
    if (err instanceof ApiError) {
      return { success: false, error: err.message, code: err.code };
    }
    return { success: false, error: err instanceof Error ? err.message : "更新失败" };
  }
}
