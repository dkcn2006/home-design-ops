import { getMyTasks } from "../../lib/data";
import TaskInbox from "../../components/task-inbox";
import type { TaskStatus } from "@home-design-ops/shared";

function toDateKey(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function isOverdue(dueDate?: string, status?: TaskStatus): boolean {
  if (!dueDate || status === "done" || status === "canceled") return false;
  return toDateKey(new Date(dueDate)) < toDateKey(new Date());
}

function isDueSoon(dueDate?: string, status?: TaskStatus): boolean {
  if (!dueDate || status === "done" || status === "canceled") return false;
  const due = new Date(dueDate);
  const today = new Date();
  const sevenDays = new Date(today);
  sevenDays.setDate(today.getDate() + 7);
  const dueKey = toDateKey(due);
  const todayKey = toDateKey(today);
  const endKey = toDateKey(sevenDays);
  return dueKey >= todayKey && dueKey <= endKey;
}

export default async function MyTasksPage({
  searchParams
}: {
  searchParams: Promise<{ assigneeId?: string }>;
}) {
  const { assigneeId } = await searchParams;
  const tasks = await getMyTasks(assigneeId ?? "user-sales-1");

  const stats = {
    total: tasks.length,
    done: tasks.filter((t) => t.task.status === "done").length,
    blocked: tasks.filter((t) => t.task.status === "blocked").length,
    overdue: tasks.filter((t) =>
      isOverdue(t.task.dueDate, t.task.status)
    ).length,
    dueSoon: tasks.filter((t) =>
      isDueSoon(t.task.dueDate, t.task.status)
    ).length
  };

  return (
    <TaskInbox
      tasks={tasks}
      stats={stats}
      assigneeId={assigneeId ?? "user-sales-1"}
    />
  );
}
