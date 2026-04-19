import { dashboards, getProjectArchive } from "@home-design-ops/shared";
import type { ProjectArchive, UserRole } from "@home-design-ops/shared";

export function getDashboard(role: UserRole) {
  return dashboards.find((item) => item.role === role) ?? dashboards[0];
}

export function getArchive(projectId: string): ProjectArchive {
  const archive = getProjectArchive(projectId);
  if (!archive) {
    throw new Error(`Archive ${projectId} not found`);
  }
  return archive;
}

