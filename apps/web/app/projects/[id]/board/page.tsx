import Link from "next/link";
import type { Route } from "next";
import type { ProjectTaskBoard, TaskStatus } from "@home-design-ops/shared";
import { getProjectTaskBoard } from "../../../../lib/data";

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

function StatusChip({ status }: { status: TaskStatus }) {
  const extraClass =
    status === "blocked"
      ? "status-risk-high"
      : status === "waiting_client"
        ? "status-priority-medium"
        : status === "waiting_internal"
          ? "status-priority-medium"
          : status === "done"
            ? "status-confirmed"
            : status === "canceled"
              ? "status-risk-low"
              : "";
  return <span className={`status-chip ${extraClass}`}>{statusLabels[status]}</span>;
}

export default async function ProjectBoardPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const board: ProjectTaskBoard = await getProjectTaskBoard(id);

  return (
    <>
      <section className="workspace-header">
        <div className="workspace-emoji">📋</div>
        <div className="workspace-copy">
          <div className="workspace-overline">project board / execution view</div>
          <h1>{board.project.name}</h1>
          <p>
            按空间与阶段查看任务执行状态，快速判断阻塞点、待客户确认事项和逾期风险。
            这是项目档案的执行视图补充，不是档案替代。
          </p>
        </div>
      </section>

      <section className="doc-properties">
        <div className="doc-property">
          <span>项目编号</span>
          <strong>{board.project.code}</strong>
        </div>
        <div className="doc-property">
          <span>状态</span>
          <strong>{board.project.status}</strong>
        </div>
        <div className="doc-property">
          <span>总任务</span>
          <strong>{board.summary.totalTaskCount}</strong>
        </div>
        <div className="doc-property">
          <span>阻塞</span>
          <strong style={{ color: board.summary.blockedTaskCount > 0 ? "#a04f42" : undefined }}>
            {board.summary.blockedTaskCount}
          </strong>
        </div>
        <div className="doc-property">
          <span>待客户确认</span>
          <strong>{board.summary.waitingClientCount}</strong>
        </div>
        <div className="doc-property">
          <span>逾期</span>
          <strong style={{ color: board.summary.overdueTaskCount > 0 ? "#a04f42" : undefined }}>
            {board.summary.overdueTaskCount}
          </strong>
        </div>
      </section>

      <section style={{ marginBottom: 18 }}>
        <Link href={`/projects/${id}` as Route} className="ghost-button">
          ← 返回项目档案
        </Link>
      </section>

      {board.spaces.map((spaceGroup) => (
        <section className="panel board-space" key={spaceGroup.space.id} style={{ marginTop: 22 }}>
          <div className="section-title">
            <h2>{spaceGroup.space.name}</h2>
            <span>
              {spaceGroup.space.areaSqm} ㎡ ·{" "}
              {spaceGroup.phases.reduce((sum, p) => sum + p.tasks.length, 0)} 个任务
            </span>
          </div>

          <div className="phase-grid">
            {spaceGroup.phases.map((phaseGroup) => (
              <article className="phase-column" key={phaseGroup.phase.id}>
                <div className="section-title">
                  <h3>{phaseGroup.phase.name}</h3>
                  <span>{phaseGroup.tasks.length}</span>
                </div>
                <div className="stage-stack">
                  {phaseGroup.tasks.map(({ task, assignee }) => (
                    <div className="task-card" key={task.id}>
                      <div className="task-card-header">
                        <strong>{task.title}</strong>
                        <span
                          className={`status-chip status-priority-${task.priority}`}
                          title={`优先级: ${priorityLabels[task.priority]}`}
                        >
                          {priorityLabels[task.priority]}
                        </span>
                      </div>
                      <div className="task-meta-row">
                        <StatusChip status={task.status} />
                        {assignee ? (
                          <span title={assignee.name}>
                            {assignee.avatarInitials} · {roleLabels[task.ownerRole]}
                          </span>
                        ) : (
                          <span>{roleLabels[task.ownerRole]}</span>
                        )}
                        {task.dueDate ? <span>截止 {task.dueDate}</span> : null}
                      </div>
                      {task.linkedEntities.length > 0 && (
                        <div className="task-entity-row">
                          {task.linkedEntities.map((entity) => (
                            <span className="pill" key={`${entity.type}-${entity.entityId}`}>
                              {entity.label}
                            </span>
                          ))}
                        </div>
                      )}
                      {task.blockedReason && (
                        <div className="task-blocked-reason">{task.blockedReason}</div>
                      )}
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>
      ))}

      {board.spaces.length === 0 && (
        <section className="panel" style={{ marginTop: 22 }}>
          <div className="empty-state">当前项目暂无任务数据。</div>
        </section>
      )}
    </>
  );
}
