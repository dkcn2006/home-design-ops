"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Route } from "next";
import type {
  ProjectTaskCard,
  TaskStatus,
  WorkspaceActivityItem
} from "@home-design-ops/shared";

type FilterKey = "all" | "in_progress" | "waiting_client" | "blocked";

interface TaskInboxProps {
  tasks: ProjectTaskCard[];
  stats: {
    todo: number;
    waitingClient: number;
    blocked: number;
    overdue: number;
  };
  activities: WorkspaceActivityItem[];
  assigneeId: string;
  assigneeName: string;
  greeting: string;
}

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

const filterTabs: { key: FilterKey; label: string; showDot?: boolean }[] = [
  { key: "all", label: "全部待办" },
  { key: "in_progress", label: "进行中" },
  { key: "waiting_client", label: "待客户确认", showDot: true },
  { key: "blocked", label: "已阻塞" }
];

function toDateKey(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function isOverdue(dueDate?: string, status?: TaskStatus): boolean {
  if (!dueDate || status === "done" || status === "canceled") return false;
  return toDateKey(new Date(dueDate)) < toDateKey(new Date());
}

function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffHours < 1) return "刚刚";
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "昨天";
  if (diffDays < 7) return `${diffDays} 天前`;
  return dateStr.slice(0, 10);
}

function getActivityDotClass(
  type: WorkspaceActivityItem["type"],
  index: number
): string {
  // Map types to colors for visual variety
  switch (type) {
    case "confirmation":
      return "atelier-workspace-timeline-dot-primary";
    case "inspection":
      return "atelier-workspace-timeline-dot-error";
    case "milestone":
      return "atelier-workspace-timeline-dot-primary";
    case "change_order":
      return "atelier-workspace-timeline-dot-warn";
    default:
      // Alternate for follow_up
      return index % 2 === 0
        ? "atelier-workspace-timeline-dot-default"
        : "atelier-workspace-timeline-dot-default";
  }
}

function getActivityIcon(type: WorkspaceActivityItem["type"]): string {
  switch (type) {
    case "confirmation":
      return "✓";
    case "inspection":
      return "⚠";
    case "milestone":
      return "🚩";
    case "change_order":
      return "📝";
    default:
      return "•";
  }
}

export default function TaskInbox({
  tasks,
  stats,
  activities,
  assigneeName,
  greeting
}: TaskInboxProps) {
  const [filter, setFilter] = useState<FilterKey>("all");

  const priorityCount = tasks.filter(
    (t) =>
      t.task.status !== "done" &&
      t.task.status !== "canceled" &&
      (t.task.priority === "urgent" || t.task.priority === "high")
  ).length;

  const filteredTasks = useMemo(() => {
    let result = tasks.filter(
      (t) => t.task.status !== "done" && t.task.status !== "canceled"
    );

    switch (filter) {
      case "in_progress":
        result = result.filter((t) => t.task.status === "in_progress");
        break;
      case "waiting_client":
        result = result.filter((t) => t.task.status === "waiting_client");
        break;
      case "blocked":
        result = result.filter((t) => t.task.status === "blocked");
        break;
    }

    return result.sort((a, b) => {
      const aOverdue = isOverdue(a.task.dueDate, a.task.status);
      const bOverdue = isOverdue(b.task.dueDate, b.task.status);
      if (aOverdue && !bOverdue) return -1;
      if (!aOverdue && bOverdue) return 1;

      const pOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
      const pDiff = pOrder[a.task.priority] - pOrder[b.task.priority];
      if (pDiff !== 0) return pDiff;

      if (a.task.dueDate && b.task.dueDate) {
        return (
          new Date(a.task.dueDate).getTime() -
          new Date(b.task.dueDate).getTime()
        );
      }
      return 0;
    });
  }, [tasks, filter]);

  const displayedActivities = activities.slice(0, 6);

  return (
    <div className="atelier-workspace">
      {/* Header */}
      <div className="atelier-workspace-header">
        <div>
          <h1>
            {greeting}，{assigneeName}
          </h1>
          <p>
            你有 {priorityCount} 项高优先级任务需要处理
            {stats.overdue > 0 && (
              <span className="atelier-workspace-header-alert">
                ，其中 {stats.overdue} 项已逾期
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="atelier-workspace-grid">
        {/* Left Column */}
        <div className="atelier-workspace-main">
          {/* Metric Cards */}
          <div className="atelier-workspace-metrics">
            <div className="atelier-workspace-metric">
              <div className="atelier-workspace-metric-deco" />
              <span>待办任务</span>
              <strong>{stats.todo}</strong>
            </div>
            <div className="atelier-workspace-metric atelier-workspace-metric-accent">
              <div className="atelier-workspace-metric-deco atelier-workspace-metric-deco-accent" />
              <span>待客户确认</span>
              <strong>{stats.waitingClient}</strong>
            </div>
            <div className="atelier-workspace-metric">
              <div className="atelier-workspace-metric-deco atelier-workspace-metric-deco-error" />
              <span>已阻塞</span>
              <strong>{stats.blocked}</strong>
            </div>
            <div className="atelier-workspace-metric atelier-workspace-metric-danger">
              <div className="atelier-workspace-metric-deco atelier-workspace-metric-deco-danger" />
              <span>已逾期</span>
              <strong>{stats.overdue}</strong>
            </div>
          </div>

          {/* Tasks Section */}
          <div className="atelier-workspace-tasks">
            {/* Tabs */}
            <div className="atelier-workspace-tabs">
              {filterTabs.map((tab) => (
                <button
                  key={tab.key}
                  className={`atelier-workspace-tab ${
                    filter === tab.key
                      ? "atelier-workspace-tab-active"
                      : ""
                  }`}
                  onClick={() => setFilter(tab.key)}
                >
                  {tab.label}
                  {tab.showDot && stats.waitingClient > 0 && (
                    <span className="atelier-workspace-tab-dot" />
                  )}
                </button>
              ))}
            </div>

            {/* Table */}
            <div className="atelier-workspace-table-wrap">
              <table className="atelier-workspace-table">
                <thead>
                  <tr>
                    <th>任务名称</th>
                    <th>项目 / 空间</th>
                    <th>阶段</th>
                    <th>截止日期</th>
                    <th>负责人</th>
                    <th className="atelier-workspace-table-th-right">状态</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTasks.map(
                    ({ task, assignee, phase, space }) => {
                      const overdue = isOverdue(
                        task.dueDate,
                        task.status
                      );
                      const isBlocked = task.status === "blocked";
                      return (
                        <tr
                          key={task.id}
                          className={
                            isBlocked
                              ? "atelier-workspace-table-row-blocked"
                              : ""
                          }
                        >
                          <td
                            className={`atelier-workspace-table-title ${
                              overdue
                                ? "atelier-workspace-table-title-overdue"
                                : ""
                            }`}
                          >
                            <Link
                              href={
                                `/projects/${task.projectId}/board` as Route
                              }
                            >
                              {task.title}
                            </Link>
                          </td>
                          <td className="atelier-workspace-table-project">
                            {task.projectId} · {space?.name ?? "全项目"}
                          </td>
                          <td>
                            <span className="atelier-workspace-phase">
                              {phase?.name ?? "-"}
                            </span>
                          </td>
                          <td
                            className={
                              overdue
                                ? "atelier-workspace-table-date-overdue"
                                : "atelier-workspace-table-date"
                            }
                          >
                            {overdue
                              ? "已逾期"
                              : task.dueDate ?? "-"}
                          </td>
                          <td>
                            <div className="atelier-workspace-avatar">
                              <div
                                className={
                                  isBlocked
                                    ? "atelier-workspace-avatar-img atelier-workspace-avatar-grayscale"
                                    : "atelier-workspace-avatar-img"
                                }
                              >
                                {assignee?.avatarInitials ??
                                  assignee?.name?.charAt(0) ??
                                  "?"}
                              </div>
                            </div>
                          </td>
                          <td className="atelier-workspace-table-td-right">
                            {task.status === "blocked" ? (
                              <span className="atelier-workspace-badge atelier-workspace-badge-blocked">
                                <span>⊘</span> 已阻塞
                              </span>
                            ) : overdue ? (
                              <span className="atelier-workspace-badge atelier-workspace-badge-overdue">
                                已逾期
                              </span>
                            ) : task.status === "waiting_client" ? (
                              <span className="atelier-workspace-badge atelier-workspace-badge-waiting">
                                待确认
                              </span>
                            ) : task.status === "in_progress" ? (
                              <span className="atelier-workspace-badge atelier-workspace-badge-progress">
                                <span className="atelier-workspace-badge-dot" />
                                进行中
                              </span>
                            ) : (
                              <span className="atelier-workspace-badge atelier-workspace-badge-default">
                                {statusLabels[task.status]}
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    }
                  )}
                </tbody>
              </table>
            </div>

            {/* View all button */}
            {filteredTasks.length > 0 && (
              <button
                className="atelier-workspace-viewall"
                onClick={() => setFilter("all")}
              >
                查看全部任务
                <span>→</span>
              </button>
            )}

            {filteredTasks.length === 0 && (
              <div className="atelier-workspace-empty">
                <span>📋</span>
                <p>该分类下暂无任务</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Timeline */}
        <aside className="atelier-workspace-aside">
          <div className="atelier-workspace-timeline-card">
            <h3>
              <span>🔄</span> 设计动态 & 修订
            </h3>
            <div className="atelier-workspace-timeline">
              <div className="atelier-workspace-timeline-line" />
              {displayedActivities.map((item, index) => (
                <div
                  className="atelier-workspace-timeline-item"
                  key={item.id}
                >
                  <div
                    className={`atelier-workspace-timeline-dot ${getActivityDotClass(
                      item.type,
                      index
                    )}`}
                  >
                    <span>{getActivityIcon(item.type)}</span>
                  </div>
                  <div className="atelier-workspace-timeline-content">
                    <p>
                      {item.title}
                      {item.summary && item.summary.length > 20 && (
                        <span className="atelier-workspace-timeline-mention">
                          {" "}
                          @{assigneeName.split("·")[0]?.trim() ?? "你"}
                        </span>
                      )}
                    </p>
                    {item.summary && item.summary.length > 10 && (
                      <div className="atelier-workspace-timeline-quote">
                        &ldquo;{item.summary.slice(0, 60)}
                        {item.summary.length > 60 ? "..." : ""}&rdquo;
                      </div>
                    )}
                    <span className="atelier-workspace-timeline-time">
                      {formatRelativeTime(item.occurredAt)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
