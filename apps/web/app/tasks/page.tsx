import Link from "next/link";
import type { Route } from "next";
import type { TaskStatus } from "@home-design-ops/shared";
import { getMyTasks } from "../../lib/data";

const statusLabels: Record<TaskStatus, string> = {
  backlog: "待排期",
  todo: "待处理",
  in_progress: "进行中",
  blocked: "已阻塞",
  waiting_client: "待客户确认",
  waiting_internal: "待内部",
  done: "已完成",
  canceled: "已取消"
};

const priorityLabels = {
  urgent: "紧急",
  high: "高",
  medium: "中",
  low: "低"
} as const;

const roleLabels = {
  sales: "销售",
  designer: "设计",
  detailer: "深化",
  project_manager: "项目经理"
} as const;

export default async function MyTasksPage({
  searchParams
}: {
  searchParams: Promise<{ assigneeId?: string }>;
}) {
  const { assigneeId } = await searchParams;
  const tasks = await getMyTasks(assigneeId ?? "user-sales-1");

  const todoTasks = tasks.filter((t) => t.task.status !== "done" && t.task.status !== "canceled");
  const doneTasks = tasks.filter((t) => t.task.status === "done" || t.task.status === "canceled");

  return (
    <>
      <section className="workspace-header">
        <div className="workspace-emoji">✅</div>
        <div className="workspace-copy">
          <div className="workspace-overline">my work / task inbox</div>
          <h1>我的任务</h1>
          <p>
            按截止日期、状态和优先级查看跨项目任务。在没有真实登录前，可通过 URL 参数
            <code>?assigneeId=</code> 切换 demo 用户视角。
          </p>
        </div>
      </section>

      <section className="doc-properties">
        <div className="doc-property">
          <span>总任务</span>
          <strong>{tasks.length}</strong>
        </div>
        <div className="doc-property">
          <span>待处理</span>
          <strong>{todoTasks.length}</strong>
        </div>
        <div className="doc-property">
          <span>已完成</span>
          <strong>{doneTasks.length}</strong>
        </div>
        <div className="doc-property">
          <span>当前视角</span>
          <strong>{assigneeId ?? "user-sales-1"}</strong>
        </div>
      </section>

      <section className="panel">
        <div className="section-title">
          <h2>待处理任务</h2>
          <span>按截止日期升序</span>
        </div>
        {todoTasks.length > 0 ? (
          <ul className="clean operational-list">
            {todoTasks.map(({ task, assignee, phase, space }) => (
              <li key={task.id}>
                <div className="list-row-top">
                  <strong>{task.title}</strong>
                  <span className={`status-chip status-priority-${task.priority}`}>
                    {priorityLabels[task.priority]}
                  </span>
                </div>
                <div className="list-meta-row">
                  <span
                    className={`status-chip ${
                      task.status === "blocked" || task.status === "waiting_client"
                        ? "status-risk-high"
                        : task.status === "done"
                          ? "status-confirmed"
                          : ""
                    }`}
                  >
                    {statusLabels[task.status]}
                  </span>
                  {assignee ? <span>{assignee.name}</span> : null}
                  <span>{roleLabels[task.ownerRole]}</span>
                  {task.dueDate ? <span>截止 {task.dueDate}</span> : null}
                </div>
                <div className="muted">
                  {space?.name ?? "全项目"} · {phase?.name ?? "-"}
                </div>
                {task.blockedReason && (
                  <div className="muted" style={{ color: "#a04f42" }}>
                    阻塞：{task.blockedReason}
                  </div>
                )}
                {task.linkedEntities.length > 0 && (
                  <div className="list-meta-row" style={{ marginTop: 6 }}>
                    {task.linkedEntities.map((entity) => (
                      <span className="pill" key={`${entity.type}-${entity.entityId}`}>
                        {entity.label}
                      </span>
                    ))}
                  </div>
                )}
                <div className="list-link-row">
                  <span className="muted">项目：{task.projectId}</span>
                  <Link href={`/projects/${task.projectId}/board` as Route} className="table-link">
                    查看项目看板
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="empty-state">暂无待处理任务</div>
        )}
      </section>

      {doneTasks.length > 0 && (
        <section className="panel" style={{ marginTop: 22 }}>
          <div className="section-title">
            <h2>已完成 / 已取消</h2>
            <span>{doneTasks.length}</span>
          </div>
          <ul className="clean operational-list compact-list">
            {doneTasks.map(({ task, phase, space }) => (
              <li key={task.id}>
                <div className="list-row-top">
                  <strong style={{ textDecoration: "line-through", opacity: 0.7 }}>{task.title}</strong>
                  <span className="status-chip">{statusLabels[task.status]}</span>
                </div>
                <div className="list-meta-row">
                  <span>{space?.name ?? "全项目"}</span>
                  <span>{phase?.name ?? "-"}</span>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}
