export type { CustomerRepository } from "./customer.repository";
export type { LeadRepository } from "./lead.repository";
export type { ProjectRepository } from "./project.repository";
export type { TaskRepository } from "./task.repository";
export type { DashboardRepository } from "./dashboard.repository";

export const CUSTOMER_REPOSITORY = Symbol("CUSTOMER_REPOSITORY");
export const LEAD_REPOSITORY = Symbol("LEAD_REPOSITORY");
export const PROJECT_REPOSITORY = Symbol("PROJECT_REPOSITORY");
export const TASK_REPOSITORY = Symbol("TASK_REPOSITORY");
export const DASHBOARD_REPOSITORY = Symbol("DASHBOARD_REPOSITORY");
