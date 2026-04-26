"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Route } from "next";
import type { ProjectTaskCard, TaskStatus } from "@home-design-ops/shared";

type FilterKey = "all" | "inbox" | "today" | "blocked" | "dueSoon";

interface TaskInboxProps {
  tasks: ProjectTaskCard[];
  stats: {
    total: number;
    done: number;
    blocked: number;
    overdue: number;
    dueSoon: number;
  };
  assigneeId: string;
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

const priorityLabels = {
  urgent: "紧急",
  high: "高",
  medium: "中",
  low: "低"
} as const;

const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };

const filterLabels: Record<FilterKey, string> = {
  all: "全部",
  inbox: "收件箱",
  today: "今天",
  blocked: "阻塞",
  dueSoon: "即将到期"
};

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

function isToday(dueDate?: string): boolean {
  if (!dueDate) return false;
  return toDateKey(new Date(dueDate)) === toDateKey(new Date());
}

export default function TaskInbox({ tasks, stats, assigneeId }: TaskInboxProps) {
  const [filter, setFilter] = useState<FilterKey>("all");
  const [search, setSearch] = useState("");

  const filteredTasks = useMemo(() => {
    let result = tasks.filter((t) => t.task.status !== "canceled");

    switch (filter) {
      case "inbox":
        result = result.filter(
          (t) => t.task.status === "backlog" || t.task.status === "todo"
        );
        break;
      case "today":
        result = result.filter((t) => isToday(t.task.dueDate));
        break;
      case "blocked":
        result = result.filter((t) => t.task.status === "blocked");
        break;
      case "dueSoon":
        result = result.filter((t) =>
          isDueSoon(t.task.dueDate, t.task.status)
        );
        break;
    }

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter((t) =>
        t.task.title.toLowerCase().includes(q)
      );
    }

    return result.sort((a, b) => {
      const aOverdue = isOverdue(a.task.dueDate, a.task.status);
      const bOverdue = isOverdue(b.task.dueDate, b.task.status);
      if (aOverdue && !bOverdue) return -1;
      if (!aOverdue && bOverdue) return 1;

      const pDiff =
        priorityOrder[a.task.priority] - priorityOrder[b.task.priority];
      if (pDiff !== 0) return pDiff;

      if (a.task.dueDate && b.task.dueDate) {
        return (
          new Date(a.task.dueDate).getTime() -
          new Date(b.task.dueDate).getTime()
        );
      }
      return 0;
    });
  }, [tasks, filter, search]);

  const visibleCount = filteredTasks.length;
  const totalCount = tasks.length;

  return (
    <div className="atelier-inbox">
      {/* Header */}
      <div className="atelier-inbox-header">
        <div>
          <h1>我的任务</h1>
          <p className="atelier-inbox-subtitle">
            {visibleCount} / {totalCount} 项任务
            {assigneeId !== "user-sales-1" && ` · 视角: ${assigneeId}`}
          </p>
        </div>
        <div className="atelier-inbox-actions">
          <div className="atelier-inbox-search">
            <span className="atelier-inbox-search-icon">&#9906;</span>
            <input
              type="text"
              placeholder="搜索任务..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="atelier-inbox-btn-primary">+ 新建任务</button>
        </div>
      </div>

      {/* Stats */}
      <div className="atelier-inbox-stats">
        <div className="atelier-inbox-stat">
          <span>总任务</span>
          <strong>{stats.total}</strong>
        </div>
        <div className="atelier-inbox-stat-divider" />
        <div className="atelier-inbox-stat">
          <span>已完成</span>
          <strong>{stats.done}</strong>
        </div>
        <div className="atelier-inbox-stat-divider" />
        <div className="atelier-inbox-stat">
          <span>已阻塞</span>
          <strong>{stats.blocked}</strong>
        </div>
        <div className="atelier-inbox-stat-divider" />
        <div className="atelier-inbox-stat">
          <span>已逾期</span>
          <strong
            className={
              stats.overdue > 0 ? "atelier-inbox-stat-alert" : undefined
            }
          >
            {stats.overdue}
          </strong>
        </div>
        <div className="atelier-inbox-stat-divider" />
        <div className="atelier-inbox-stat">
          <span>即将到期</span>
          <strong
            className={
              stats.dueSoon > 0 ? "atelier-inbox-stat-warn" : undefined
            }
          >
            {stats.dueSoon}
          </strong>
        </div>
      </div>

      {/* Filters */}
      <div className="atelier-inbox-filters">
        {(Object.keys(filterLabels) as FilterKey[]).map((key) => (
          <button
            key={key}
            className={`atelier-inbox-filter ${
              filter === key ? "atelier-inbox-filter-active" : ""
            }`}
            onClick={() => setFilter(key)}
          >
            {filterLabels[key]}
          </button>
        ))}
      </div>

      {/* Task Table */}
      {filteredTasks.length > 0 ? (
        <div className="atelier-inbox-table-wrap">
          <table className="atelier-inbox-table">
            <thead>
              <tr>
                <th>任务</th>
                <th>负责人</th>
                <th>截止</th>
                <th>优先级</th>
                <th>状态</th>
                <th>位置</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map(({ task, assignee, phase, space }) => {
                const overdue = isOverdue(task.dueDate, task.status);
                return (
                  <tr
                    key={task.id}
                    className={overdue ? "atelier-inbox-row-overdue" : ""}
                  >
                    <td className="atelier-inbox-cell-title">
                      <Link
                        href={`/projects/${task.projectId}/board` as Route}
                      >
                        {task.title}
                      </Link>
                      {task.blockedReason && (
                        <span className="atelier-inbox-blocked-hint">
                          &#9888; {task.blockedReason}
                        </span>
                      )}
                    </td>
                    <td>
                      <div className="atelier-inbox-assignee">
                        <div className="atelier-inbox-avatar">
                          {assignee ? assignee.name.charAt(0) : "?"}
                        </div>
                        <span>{assignee?.name ?? "未分配"}</span>
                      </div>
                    </td>
                    <td
                      className={
                        overdue ? "atelier-inbox-cell-overdue" : undefined
                      }
                    >
                      {task.dueDate ? (
                        <span className="atelier-inbox-date">
                          <span>&#128197;</span>
                          {task.dueDate}
                        </span>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td>
                      <span
                        className={`atelier-inbox-badge atelier-inbox-priority-${task.priority}`}
                      >
                        {priorityLabels[task.priority]}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`atelier-inbox-badge atelier-inbox-status-${task.status}`}
                      >
                        {statusLabels[task.status]}
                      </span>
                    </td>
                    <td>
                      <span className="atelier-inbox-project">
                        {space?.name ?? "全项目"} · {phase?.name ?? "-"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="atelier-inbox-empty">
          <span className="atelier-inbox-empty-icon">&#128203;</span>
          <p>没有找到符合条件的任务</p>
          <span>调整过滤器或搜索关键词以查看其他任务</span>
        </div>
      )}
    </div>
  );
}
