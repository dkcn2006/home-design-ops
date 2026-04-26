import { getMyTasks, getWorkspaceHome } from "../../lib/data";
import TaskInbox from "../../components/task-inbox";
import type { TaskStatus } from "@home-design-ops/shared";

function toDateKey(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function isOverdue(dueDate?: string, status?: TaskStatus): boolean {
  if (!dueDate || status === "done" || status === "canceled") return false;
  return toDateKey(new Date(dueDate)) < toDateKey(new Date());
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "上午好";
  if (hour < 18) return "下午好";
  return "晚上好";
}

export default async function MyTasksPage({
  searchParams
}: {
  searchParams: Promise<{ assigneeId?: string }>;
}) {
  const { assigneeId } = await searchParams;
  const id = assigneeId ?? "user-sales-1";

  const [tasks, workspaceHome] = await Promise.all([
    getMyTasks(id),
    getWorkspaceHome()
  ]);

  const activeTasks = tasks.filter(
    (t) => t.task.status !== "done" && t.task.status !== "canceled"
  );

  const stats = {
    todo: activeTasks.length,
    waitingClient: tasks.filter((t) => t.task.status === "waiting_client").length,
    blocked: tasks.filter((t) => t.task.status === "blocked").length,
    overdue: tasks.filter((t) =>
      isOverdue(t.task.dueDate, t.task.status)
    ).length
  };

  const assigneeName =
    tasks.find((t) => t.assignee)?.assignee?.name ??
    (id.includes("designer")
      ? "李设计师"
      : id.includes("sales")
        ? "销售顾问"
        : id.includes("pm") || id.includes("manager")
          ? "项目经理"
          : id);

  return (
    <TaskInbox
      tasks={tasks}
      stats={stats}
      activities={workspaceHome.activities}
      assigneeId={id}
      assigneeName={assigneeName}
      greeting={getGreeting()}
    />
  );
}
