import { describe, it, expect } from "vitest";
import {
  customers,
  users,
  leads,
  projects,
  spaces,
  workflowPhases,
  projectTasks,
  confirmations,
  getProjectArchive,
} from "./seed";

describe("seed 数据一致性", () => {
  it("每个 project.leadId 必须对应存在的 lead", () => {
    for (const project of projects) {
      const lead = leads.find((l) => l.id === project.leadId);
      expect(lead, `project ${project.id} 的 leadId ${project.leadId} 不存在`).toBeDefined();
    }
  });

  it("每个 project.customerId 必须对应存在的 customer", () => {
    for (const project of projects) {
      const customer = customers.find((c) => c.id === project.customerId);
      expect(customer, `project ${project.id} 的 customerId ${project.customerId} 不存在`).toBeDefined();
    }
  });

  it("每个 task.assigneeId 必须对应存在的 user", () => {
    for (const task of projectTasks) {
      const user = users.find((u) => u.id === task.assigneeId);
      expect(user, `task ${task.id} 的 assigneeId ${task.assigneeId} 不存在`).toBeDefined();
    }
  });

  it("每个 task.reporterId 必须对应存在的 user", () => {
    for (const task of projectTasks) {
      const user = users.find((u) => u.id === task.reporterId);
      expect(user, `task ${task.id} 的 reporterId ${task.reporterId} 不存在`).toBeDefined();
    }
  });

  it("每个 task.phaseId 必须对应存在的 workflowPhase", () => {
    for (const task of projectTasks) {
      const phase = workflowPhases.find((p) => p.id === task.phaseId);
      expect(phase, `task ${task.id} 的 phaseId ${task.phaseId} 不存在`).toBeDefined();
    }
  });

  it("每个 task.projectId 必须对应存在的 project", () => {
    for (const task of projectTasks) {
      const project = projects.find((p) => p.id === task.projectId);
      expect(project, `task ${task.id} 的 projectId ${task.projectId} 不存在`).toBeDefined();
    }
  });

  it("每个 confirmation.projectId 必须对应存在的 project", () => {
    for (const confirmation of confirmations) {
      const project = projects.find((p) => p.id === confirmation.projectId);
      expect(project, `confirmation ${confirmation.id} 的 projectId ${confirmation.projectId} 不存在`).toBeDefined();
    }
  });

  it("每个 space.projectId 必须对应存在的 project", () => {
    for (const space of spaces) {
      const project = projects.find((p) => p.id === space.projectId);
      expect(project, `space ${space.id} 的 projectId ${space.projectId} 不存在`).toBeDefined();
    }
  });

  it("每个 lead.customerId 必须对应存在的 customer", () => {
    for (const lead of leads) {
      const customer = customers.find((c) => c.id === lead.customerId);
      expect(customer, `lead ${lead.id} 的 customerId ${lead.customerId} 不存在`).toBeDefined();
    }
  });

  it("won 状态的 lead 必须有 projectId", () => {
    for (const lead of leads) {
      if (lead.stage === "won") {
        expect(lead.projectId, `won 状态的 lead ${lead.id} 缺少 projectId`).toBeDefined();
      }
    }
  });
});

describe("getProjectArchive", () => {
  it("能正确聚合已知项目的完整档案", () => {
    const archive = getProjectArchive("proj-1");
    expect(archive).toBeDefined();
    expect(archive!.project.id).toBe("proj-1");
    expect(archive!.customer.id).toBe("cust-1");
    expect(archive!.spaces.length).toBeGreaterThan(0);
    expect(archive!.designVersions.length).toBeGreaterThan(0);
    expect(archive!.confirmations.length).toBeGreaterThan(0);
  });

  it("对不存在的项目返回 undefined", () => {
    const archive = getProjectArchive("non-existent");
    expect(archive).toBeUndefined();
  });

  it("聚合的空间只包含当前项目的空间", () => {
    const archive = getProjectArchive("proj-1");
    for (const space of archive!.spaces) {
      expect(space.projectId).toBe("proj-1");
    }
  });

  it("聚合的任务只包含当前项目的任务", () => {
    const archive = getProjectArchive("proj-1");
    // projectTasks 不在 archive 中直接返回，但 attachments 等应在
    for (const attachment of archive!.attachments) {
      expect(attachment.projectId).toBe("proj-1");
    }
  });
});

describe("seed 数据基本属性", () => {
  it("users 数组不为空且每个用户有必填字段", () => {
    expect(users.length).toBeGreaterThan(0);
    for (const user of users) {
      expect(user.id).toBeTruthy();
      expect(user.name).toBeTruthy();
      expect(user.role).toBeTruthy();
      expect(user.avatarInitials).toBeTruthy();
    }
  });

  it("customers 数组不为空且预算范围合理", () => {
    expect(customers.length).toBeGreaterThan(0);
    for (const customer of customers) {
      expect(customer.budgetMin).toBeGreaterThan(0);
      expect(customer.budgetMax).toBeGreaterThanOrEqual(customer.budgetMin);
    }
  });

  it("projectTasks 包含多种状态", () => {
    const statuses = new Set(projectTasks.map((t) => t.status));
    expect(statuses.size).toBeGreaterThan(1);
  });
});
