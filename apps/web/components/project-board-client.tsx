"use client";

import { useCallback, useMemo } from "react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import type { Route } from "next";
import type { ProjectTaskBoard, TaskStatus } from "@home-design-ops/shared";
import {
  SlidersHorizontal,
  AlertTriangle,
  Clock,
  Plus
} from "lucide-react";
import { EmptyState } from "./ui/empty-state";

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

interface ProjectBoardClientProps {
  projectId: string;
  board: ProjectTaskBoard;
  filters: {
    assignee?: string;
    status?: string;
    priority?: string;
  };
}

export function ProjectBoardClient({ board, filters }: ProjectBoardClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      return params.toString();
    },
    [searchParams]
  );

  const setFilter = useCallback(
    (name: string, value: string) => {
      const qs = createQueryString(name, value);
      router.replace(`${pathname}?${qs}` as Route, { scroll: false });
    },
    [createQueryString, pathname, router]
  );

  const clearFilters = useCallback(() => {
    router.replace(pathname as Route, { scroll: false });
  }, [pathname, router]);

  const filteredBoard = useMemo(() => {
    if (!filters.assignee && !filters.status && !filters.priority) {
      return board;
    }

    return {
      ...board,
      spaces: board.spaces.map((spaceGroup) => ({
        ...spaceGroup,
        phases: spaceGroup.phases.map((phaseGroup) => ({
          ...phaseGroup,
          tasks: phaseGroup.tasks.filter(({ task, assignee }) => {
            if (filters.assignee) {
              const match = assignee
                ? assignee.id === filters.assignee
                : task.ownerRole === filters.assignee;
              if (!match) return false;
            }
            if (filters.status && task.status !== filters.status) return false;
            if (filters.priority && task.priority !== filters.priority) return false;
            return true;
          })
        }))
      }))
    };
  }, [board, filters]);

  const hasActiveFilters = filters.assignee || filters.status || filters.priority;

  // Collect unique assignees from board
  const assignees = useMemo(() => {
    const map = new Map<string, { id: string; name: string; initials: string }>();
    board.spaces.forEach((space) => {
      space.phases.forEach((phase) => {
        phase.tasks.forEach(({ assignee, task }) => {
          if (assignee) {
            map.set(assignee.id, {
              id: assignee.id,
              name: assignee.name,
              initials: assignee.avatarInitials
            });
          } else {
            const roleKey = task.ownerRole;
            map.set(roleKey, {
              id: roleKey,
              name: roleLabels[roleKey],
              initials: roleLabels[roleKey].slice(0, 1)
            });
          }
        });
      });
    });
    return Array.from(map.values());
  }, [board]);

  const hasBlockedInSpace = (spaceGroup: (typeof filteredBoard.spaces)[0]) =>
    spaceGroup.phases.some((p) => p.tasks.some((t) => t.task.status === "blocked"));

  const totalFilteredTasks = filteredBoard.spaces.reduce(
    (sum, space) => sum + space.phases.reduce((pSum, phase) => pSum + phase.tasks.length, 0),
    0
  );

  return (
    <>
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
            {assignees.map((a) => (
              <button
                key={a.id}
                type="button"
                className={`atelier-board-avatar ${filters.assignee === a.id ? "atelier-board-avatar-active" : ""}`}
                onClick={() =>
                  setFilter("assignee", filters.assignee === a.id ? "" : a.id)
                }
                title={a.name}
                aria-pressed={filters.assignee === a.id}
              >
                {a.initials}
              </button>
            ))}
          </div>
        </div>
        <div className="atelier-board-filter-right">
          <select
            className="atelier-board-filter-select"
            value={filters.status ?? ""}
            onChange={(e) => setFilter("status", e.target.value)}
            aria-label="按阶段筛选"
          >
            <option value="">阶段：全部</option>
            {Object.entries(statusLabels).map(([status, label]) => (
              <option key={status} value={status}>
                {label}
              </option>
            ))}
          </select>
          <select
            className="atelier-board-filter-select"
            value={filters.priority ?? ""}
            onChange={(e) => setFilter("priority", e.target.value)}
            aria-label="按优先级筛选"
          >
            <option value="">优先级：全部</option>
            <option value="urgent">紧急</option>
            <option value="high">高</option>
            <option value="medium">中</option>
            <option value="low">低</option>
          </select>
          <button
            type="button"
            className="atelier-board-filter-icon"
            onClick={clearFilters}
            disabled={!hasActiveFilters}
            title="清除筛选"
            aria-label="清除筛选"
          >
            <SlidersHorizontal size={18} strokeWidth={1.5} />
          </button>
        </div>
      </div>

      {/* Result count */}
      {hasActiveFilters && (
        <div className="atelier-board-filter-info">
          筛选结果：{totalFilteredTasks} 个任务
          {totalFilteredTasks === 0 && (
            <span className="atelier-board-filter-info-hint"> — 没有匹配的任务，请调整筛选条件</span>
          )}
        </div>
      )}

      {/* Board Canvas */}
      <div className="atelier-board-canvas">
        {filteredBoard.spaces.map((spaceGroup) => (
          <section className="atelier-board-space" key={spaceGroup.space.id}>
            <div className="atelier-board-space-header">
              <h2>{spaceGroup.space.name}</h2>
              {hasBlockedInSpace(spaceGroup) && (
                <span className="atelier-board-space-badge">
                  <AlertTriangle size={14} strokeWidth={2} /> 存在阻塞
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
                            <AlertTriangle size={14} strokeWidth={2} />
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
                            <Clock size={14} strokeWidth={1.5} />
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
                      <EmptyState
                        icon={<Plus size={16} strokeWidth={2} />}
                        title="暂无任务"
                        className="atelier-board-task-empty-compact"
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}

        {filteredBoard.spaces.length === 0 && (
          <EmptyState title="当前项目暂无任务数据" />
        )}
      </div>
    </>
  );
}
