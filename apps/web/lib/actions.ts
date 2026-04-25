"use server";

import { revalidatePath } from "next/cache";
import type { ConfirmationStatus, LeadSource, LeadStage } from "@home-design-ops/shared";
import { createLeadIntake, updateConfirmation, updateLeadStage } from "./data";

export async function submitConfirmationAction(formData: FormData) {
  const projectId = String(formData.get("projectId") ?? "");
  const confirmationId = String(formData.get("confirmationId") ?? "");
  const status = String(formData.get("status") ?? "");
  const note = String(formData.get("note") ?? "").trim();

  if (!projectId || !confirmationId || !status) {
    throw new Error("Missing confirmation payload");
  }

  await updateConfirmation(projectId, confirmationId, {
    status: status as ConfirmationStatus,
    note: note || undefined
  });

  revalidatePath(`/client/${projectId}`);
  revalidatePath(`/projects/${projectId}`);
  revalidatePath("/");
}

function parseList(value: FormDataEntryValue | null) {
  return String(value ?? "")
    .split(/[\n,，]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export async function createLeadIntakeAction(formData: FormData) {
  const budgetMin = Number(formData.get("budgetMin") ?? 0);
  const budgetMax = Number(formData.get("budgetMax") ?? 0);

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
      stage: (String(formData.get("stage") ?? "new") as LeadStage) || "new",
      expectedSignDate: String(formData.get("expectedSignDate") ?? "").trim() || undefined,
      summary: String(formData.get("summary") ?? "").trim(),
      painPoints: parseList(formData.get("painPoints"))
    }
  });

  revalidatePath("/sales/leads");
  revalidatePath("/");
  revalidatePath("/role/sales");
}

export async function updateLeadStageAction(formData: FormData) {
  const leadId = String(formData.get("leadId") ?? "");
  const stage = String(formData.get("stage") ?? "") as LeadStage;

  if (!leadId || !stage) {
    throw new Error("Missing lead stage payload");
  }

  await updateLeadStage(leadId, { stage });

  revalidatePath("/sales/leads");
  revalidatePath("/");
  revalidatePath("/role/sales");
}
