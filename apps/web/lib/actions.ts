"use server";

import { revalidatePath } from "next/cache";
import type { ConfirmationStatus } from "@home-design-ops/shared";
import { updateConfirmation } from "./data";

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
