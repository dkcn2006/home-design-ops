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

function getCardClass(status: TaskStatus) {
  switch (status) {
    case "blocked":
      return "atelier-board-task-blocked";
    case "in_progress":
      return "atelier-board-task-inprogress";
    case "waiting_client":
      return "atelier-board-task-waiting";
    default:
      return "";
  }
}

function getPriorityClass(priority: string) {
  if (priority === "urgent" || priority === "high") return "atelier-board-priority-high";
  if (priority === "medium") return "atelier-board-priority-med";
  return "atelier-board-priority-low";
}

export default async function ProjectBoardPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const board: ProjectTaskBoard = await getProjectTaskBoard(id);

  const hasBlockedInSpace = (spaceGroup: (typeof board.spaces)[0]) =>
    spaceGroup.phases.some((p) => p.tasks.some((t) => t.task.status === "blocked"));

  return (
    <div className="atelier-board">
      {/* Header + Stats */}
      <section className="atelier-board-header">
        <div>
          <h1>任务看板</h1>
          <p>
            {board.project.name} — 按空间与阶段查看任务执行状态，快速判断阻塞点、待客户确认事项和逾期风险。
          </p>
        </div>
        <div className="atelier-board-stats">
          <div className="atelier-board-stat">
            <span>总任务</span>
            <strong>{board.summary.totalTaskCount}</strong>
          </div>
          <div className="atelier-board-stat-divider" />
          <div className="atelier-board-stat">
            <span className="atelier-board-stat-dot atelier-board-stat-dot-error">已阻塞</span>
            <strong className="atelier-board-stat-error">{board.summary.blockedTaskCount}</strong>
          </div>
          <div className="atelier-board-stat-divider" />
          <div className="atelier-board-stat">
            <span className="atelier-board-stat-dot atelier-board-stat-dot-primary">待确认</span>
            <strong className="atelier-board-stat-primary">{board.summary.waitingClientCount}</strong>
          </div>
          <div className="atelier-board-stat-divider" />
          <div className="atelier-board-stat">
            <span>逾期</span>
            <strong>{board.summary.overdueTaskCount}</strong>
          </div>
        </div>
      </section>

      {/* Filter Bar */}
      <div className="atelier-board-filter">
        <div className="atelier-board-filter-left">
          <span>负责人:</span>
          <div className="atelier-board-avatars">
            <div className="atelier-board-avatar">销</div>
            <div className="atelier-board-avatar">设</div>
            <div className="atelier-board-avatar">深</div>
          </div>
        </div>
        <div className="atelier-board-filter-right">
          <button className="atelier-board-filter-btn">阶段 ▾</button>
          <button className="atelier-board-filter-btn">优先级 ▾</button>
          <button className="atelier-board-filter-icon">☰</button>
        </div>
      </div>

      {/* Board Canvas */}
      <div className="atelier-board-canvas">
        {board.spaces.map((spaceGroup) => (
          <section className="atelier-board-space" key={spaceGroup.space.id}>
            <div className="atelier-board-space-header">
              <h2>{spaceGroup.space.name}</h2>
              {hasBlockedInSpace(spaceGroup) && (
                <span className="atelier-board-space-badge">
                  <span>⚠</span> 存在阻塞
                </span>
              )}
            </div>

            <div className="atelier-board-phases">
              {spaceGroup.phases.map((phaseGroup) => (
                <div className="atelier-board-phase" key={phaseGroup.phase.id}>
                  <div className="atelier-board-phase-header">
                    <h3>{phaseGroup.phase.name}</h3>
                    <span>{phaseGroup.tasks.length}</span>
                  </div>
                  <div className="atelier-board-tasks">
                    {phaseGroup.tasks.map(({ task, assignee }) => (
                      <div
                        className={`atelier-board-task ${getCardClass(task.status)}`}
                        key={task.id}
                      >
                        <div className="atelier-board-task-top">
                          <span className={`atelier-board-priority ${getPriorityClass(task.priority)}`}>
                            {priorityLabels[task.priority]}
                          </span>
                          <span className="atelier-board-task-more">⋯</span>
                        </div>

                        <h4>{task.title}</h4>

                        {task.blockedReason && (
                          <div className="atelier-board-task-blocked-reason">
                            <span>⚠</span>
                            <p>{task.blockedReason}</p>
                          </div>
                        )}

                        {task.linkedEntities.length > 0 && (
                          <div className="atelier-board-task-entities">
                            {task.linkedEntities.map((entity) => (
                              <span key={`${entity.type}-${entity.entityId}`}>{entity.label}</span>
                            ))}
                          </div>
                        )}

                        <div className="atelier-board-task-bottom">
                          <div className="atelier-board-task-date">
                            <span>◷</span>
                            {task.dueDate ? (
                              <span>{task.dueDate}</span>
                            ) : (
                              <span>未设截止</span>
                            )}
                          </div>
                          <div className="atelier-board-task-owner">
                            {assignee ? assignee.avatarInitials : roleLabels[task.ownerRole].slice(0, 1)}
                          </div>
                        </div>
                      </div>
                    ))}
                    {phaseGroup.tasks.length === 0 && (
                      <div className="atelier-board-task-empty">
                        <span>+</span>
                        <span>暂无任务</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}

        {board.spaces.length === 0 && (
          <div className="atelier-board-empty">当前项目暂无任务数据</div>
        )}
      </div>

      {/* Back link */}
      <div className="atelier-board-back">
        <Link href={`/projects/${id}` as Route}>← 返回项目档案</Link>
      </div>
    </div>
  );
}
