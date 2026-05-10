import { PrismaClient } from "@prisma/client";
import {
  customers,
  users,
  leads,
  workflowPhases,
  projects,
  spaces,
  attachments,
  designVersions,
  renderingVersions,
  constructionDrawingVersions,
  quotations,
  changeOrders,
  milestones,
  inspections,
  confirmations,
  projectTasks,
  workItems,
  requirementSheets,
  dashboards
} from "@home-design-ops/shared";

const prisma = new PrismaClient();

function toDate(iso: string | undefined | null): Date | undefined {
  if (!iso) return undefined;
  return new Date(iso);
}

async function main() {
  // Clear existing data (respect foreign key order)
  await prisma.workItem.deleteMany();
  await prisma.projectTask.deleteMany();
  await prisma.confirmationRecord.deleteMany();
  await prisma.inspectionRecord.deleteMany();
  await prisma.projectMilestone.deleteMany();
  await prisma.changeOrder.deleteMany();
  await prisma.quotation.deleteMany();
  await prisma.constructionDrawingVersion.deleteMany();
  await prisma.renderingVersion.deleteMany();
  await prisma.designVersion.deleteMany();
  await prisma.attachment.deleteMany();
  await prisma.space.deleteMany();
  await prisma.requirementSheet.deleteMany();
  await prisma.project.deleteMany();
  await prisma.lead.deleteMany();
  await prisma.workflowPhase.deleteMany();
  await prisma.user.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.dashboard.deleteMany();

  // Seed in dependency order
  for (const customer of customers) {
    await prisma.customer.create({
      data: {
        ...customer,
        createdAt: toDate(customer.createdAt) ?? new Date(),
        updatedAt: toDate(customer.updatedAt) ?? new Date()
      }
    });
  }

  for (const user of users) {
    await prisma.user.create({
      data: {
        ...user,
        createdAt: toDate(user.createdAt) ?? new Date(),
        updatedAt: toDate(user.updatedAt) ?? new Date()
      }
    });
  }

  for (const phase of workflowPhases) {
    await prisma.workflowPhase.create({
      data: {
        ...phase,
        createdAt: toDate(phase.createdAt) ?? new Date(),
        updatedAt: toDate(phase.updatedAt) ?? new Date()
      }
    });
  }

  for (const lead of leads) {
    await prisma.lead.create({
      data: {
        ...lead,
        nextFollowUpAt: toDate(lead.nextFollowUpAt),
        lastContactedAt: toDate(lead.lastContactedAt),
        expectedSignDate: toDate(lead.expectedSignDate),
        createdAt: toDate(lead.createdAt) ?? new Date(),
        updatedAt: toDate(lead.updatedAt) ?? new Date()
      }
    });
  }

  for (const project of projects) {
    await prisma.project.create({
      data: {
        ...project,
        createdAt: toDate(project.createdAt) ?? new Date(),
        updatedAt: toDate(project.updatedAt) ?? new Date()
      }
    });
  }

  for (const sheet of requirementSheets) {
    await prisma.requirementSheet.create({
      data: {
        ...sheet,
        createdAt: toDate(sheet.createdAt) ?? new Date(),
        updatedAt: toDate(sheet.updatedAt) ?? new Date()
      }
    });
  }

  for (const space of spaces) {
    await prisma.space.create({
      data: {
        ...space,
        createdAt: toDate(space.createdAt) ?? new Date(),
        updatedAt: toDate(space.updatedAt) ?? new Date()
      }
    });
  }

  for (const attachment of attachments) {
    await prisma.attachment.create({
      data: {
        ...attachment,
        createdAt: toDate(attachment.createdAt) ?? new Date(),
        updatedAt: toDate(attachment.updatedAt) ?? new Date()
      }
    });
  }

  for (const version of designVersions) {
    await prisma.designVersion.create({
      data: {
        ...version,
        createdAt: toDate(version.createdAt) ?? new Date(),
        updatedAt: toDate(version.updatedAt) ?? new Date()
      }
    });
  }

  for (const version of renderingVersions) {
    await prisma.renderingVersion.create({
      data: {
        ...version,
        createdAt: toDate(version.createdAt) ?? new Date(),
        updatedAt: toDate(version.updatedAt) ?? new Date()
      }
    });
  }

  for (const version of constructionDrawingVersions) {
    await prisma.constructionDrawingVersion.create({
      data: {
        ...version,
        createdAt: toDate(version.createdAt) ?? new Date(),
        updatedAt: toDate(version.updatedAt) ?? new Date()
      }
    });
  }

  for (const quotation of quotations) {
    await prisma.quotation.create({
      data: {
        ...quotation,
        createdAt: toDate(quotation.createdAt) ?? new Date(),
        updatedAt: toDate(quotation.updatedAt) ?? new Date()
      }
    });
  }

  for (const changeOrder of changeOrders) {
    await prisma.changeOrder.create({
      data: {
        ...changeOrder,
        createdAt: toDate(changeOrder.createdAt) ?? new Date(),
        updatedAt: toDate(changeOrder.updatedAt) ?? new Date()
      }
    });
  }

  for (const milestone of milestones) {
    await prisma.projectMilestone.create({
      data: {
        ...milestone,
        plannedDate: toDate(milestone.plannedDate) ?? new Date(),
        actualDate: toDate(milestone.actualDate),
        createdAt: toDate(milestone.createdAt) ?? new Date(),
        updatedAt: toDate(milestone.updatedAt) ?? new Date()
      }
    });
  }

  for (const inspection of inspections) {
    await prisma.inspectionRecord.create({
      data: {
        ...inspection,
        issues: inspection.issues as never,
        createdAt: toDate(inspection.createdAt) ?? new Date(),
        updatedAt: toDate(inspection.updatedAt) ?? new Date()
      }
    });
  }

  for (const confirmation of confirmations) {
    await prisma.confirmationRecord.create({
      data: {
        ...confirmation,
        createdAt: toDate(confirmation.createdAt) ?? new Date(),
        updatedAt: toDate(confirmation.updatedAt) ?? new Date()
      }
    });
  }

  for (const task of projectTasks) {
    await prisma.projectTask.create({
      data: {
        ...task,
        dueDate: toDate(task.dueDate),
        completedAt: toDate(task.completedAt),
        linkedEntities: task.linkedEntities as never,
        createdAt: toDate(task.createdAt) ?? new Date(),
        updatedAt: toDate(task.updatedAt) ?? new Date()
      }
    });
  }

  for (const item of workItems) {
    await prisma.workItem.create({
      data: {
        ...item,
        dueDate: toDate(item.dueDate) ?? new Date(),
        createdAt: toDate(item.createdAt) ?? new Date(),
        updatedAt: toDate(item.updatedAt) ?? new Date()
      }
    });
  }

  for (const dashboard of dashboards) {
    await prisma.dashboard.create({
      data: {
        role: dashboard.role,
        metrics: dashboard.metrics as never,
        focus: dashboard.focus as never,
        projects: dashboard.projects as never,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });
  }

  console.log("Seed completed successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
