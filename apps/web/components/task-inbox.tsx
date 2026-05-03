"use client";

import {
  useMemo,
  useState,
  useTransition,
  useCallback,
  useEffect,
  type ReactNode
} from "react";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import type { Route } from "next";
import type {
  ProjectTaskCard,
  TaskStatus,
  WorkspaceActivityItem
} from "@home-design-ops/shared";
import {
  CheckCircle,
  AlertTriangle,
  Flag,
  FileText,
  Circle,
  Ban,
  ClipboardList,
  RefreshCw,
  ArrowRight,
  ArrowUpDown,
  CalendarClock,
  Loader2,
  XCircle
} from "lucide-react";
import { EmptyState } from "./ui/empty-state";
import { StatusBadge } from "./ui/status-badge";
import { updateTaskStatus } from "../lib/data";

type FilterKey = "all" | "in_progress" | "waiting_client" | "blocked";
type SortKey = "priority" | "dueDate" | "overdueFirst";

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
  today?: string;
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

const sortOptions: { key: SortKey; label: string }[] = [
  { key: "overdueFirst", label: "逾期优先" },
  { key: "priority", label: "优先级" },
  { key: "dueDate", label: "截止日期" }
];

function isOverdue(
  dueDate: string | undefined,
  today: string,
  status?: TaskStatus
): boolean {
  if (!dueDate || status === "done" || status === "canceled") return false;
  return dueDate < today;
}

function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffHours < 1) return "刚刚";
  if (diffHours < 24) return `${diffHours}小时前`;
  if (diffDays === 1) return "昨天";
  if (diffDays < 7) return `${diffDays} 天前`;
  return dateStr.slice(0, 10);
}

function getActivityDotClass(
  type: WorkspaceActivityItem["type"],
  index: number
): string {
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
      return index % 2 === 0
        ? "atelier-workspace-timeline-dot-default"
        : "atelier-workspace-timeline-dot-default";
  }
}

function getActivityIcon(type: WorkspaceActivityItem["type"]): ReactNode {
  switch (type) {
    case "confirmation":
      return <CheckCircle size={14} strokeWidth={2} />;
    case "inspection":
      return <AlertTriangle size={14} strokeWidth={2} />;
    case "milestone":
      return <Flag size={14} strokeWidth={2} />;
    case "change_order":
      return <FileText size={14} strokeWidth={2} />;
    default:
      return <Circle size={14} strokeWidth={2} />;
  }
}

type ToastType = "success" | "error";

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

export default function TaskInbox({
  tasks,
  stats,
  activities,
  assigneeName,
  greeting,
  today = new Date().toISOString().slice(0, 10)
}: TaskInboxProps) {
  const router = useRouter();
  const pathname = usePathname();
  const rawSearchParams = useSearchParams();

  const [filter, setFilter] = useState<FilterKey>(() => {
    const f = rawSearchParams?.get("filter");
    return (filterTabs.some((t) => t.key === f) ? f : "all") as FilterKey;
  });

  const [sort, setSort] = useState<SortKey>(() => {
    const s = rawSearchParams?.get("sort");
    return (sortOptions.some((o) => o.key === s) ? s : "overdueFirst") as SortKey;
  });

  const [localTasks, setLocalTasks] = useState(tasks);
  useEffect(() => {
    setLocalTasks(tasks);
  }, [tasks]);

  const [isPending, startTransition] = useTransition();
  const [pendingTaskId, setPendingTaskId] = useState<string | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [blockingTaskId, setBlockingTaskId] = useState<string | null>(null);
  const [blockedReason, setBlockedReason] = useState("");

  const showToast = useCallback((message: string, type: ToastType) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const syncUrl = useCallback(
    (nextFilter: FilterKey, nextSort: SortKey) => {
      const params = new URLSearchParams(rawSearchParams?.toString() ?? "");
      if (nextFilter === "all") {
        params.delete("filter");
      } else {
        params.set("filter", nextFilter);
      }
      if (nextSort === "overdueFirst") {
        params.delete("sort");
      } else {
        params.set("sort", nextSort);
      }
      router.replace(`${pathname}?${params.toString()}` as Route);
    },
    [rawSearchParams, pathname, router]
  );

  const handleFilterChange = useCallback(
    (key: FilterKey) => {
      setFilter(key);
      syncUrl(key, sort);
    },
    [sort, syncUrl]
  );

  const handleSortChange = useCallback(
    (key: SortKey) => {
      setSort(key);
      syncUrl(filter, key);
    },
    [filter, syncUrl]
  );

  const handleStatusUpdate = useCallback(
    (taskId: string, input: { status: TaskStatus; blockedReason?: string }) => {
      const previousTasks = localTasks;
      setPendingTaskId(taskId);
      setLocalTasks((prev) =>
        prev.map((item) =>
          item.task.id === taskId
            ? {
                ...item,
                task: {
                  ...item.task,
                  status: input.status,
                  blockedReason:
                    input.blockedReason ?? item.task.blockedReason
                }
              }
            : item
        )
      );

      startTransition(async () => {
        try {
          await updateTaskStatus(taskId, input);
        } catch (err) {
          setLocalTasks(previousTasks);
          showToast(
            err instanceof Error ? err.message : "更新失败，请重试",
            "error"
          );
        } finally {
          setPendingTaskId(null);
        }
      });
    },
    [localTasks, showToast]
  );

  const priorityCount = localTasks.filter(
    (t) =>
      t.task.status !== "done" &&
      t.task.status !== "canceled" &&
      (t.task.priority === "urgent" || t.task.priority === "high")
  ).length;

  const filteredTasks = useMemo(() => {
    let result = localTasks.filter(
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

    result.sort((a, b) => {
      const aOverdue = isOverdue(a.task.dueDate, today, a.task.status);
      const bOverdue = isOverdue(b.task.dueDate, today, b.task.status);

      if (sort === "overdueFirst") {
        if (aOverdue && !bOverdue) return -1;
        if (!aOverdue && bOverdue) return 1;
      }

      const pOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
      const pDiff = pOrder[a.task.priority] - pOrder[b.task.priority];
      if (pDiff !== 0) return pDiff;

      if (sort === "dueDate" || sort === "overdueFirst") {
        if (a.task.dueDate && b.task.dueDate) {
          return (
            new Date(a.task.dueDate).getTime() -
            new Date(b.task.dueDate).getTime()
          );
        }
        if (a.task.dueDate) return -1;
        if (b.task.dueDate) return 1;
      }

      return 0;
    });

    return result;
  }, [localTasks, filter, sort, today]);

  const displayedActivities = activities.slice(0, 6);

  const blockingTask = blockingTaskId
    ? localTasks.find((t) => t.task.id === blockingTaskId)?.task
    : undefined;

  return (
    <div className="atelier-workspace">
      {/* Toasts */}
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`atelier-toast atelier-toast-${toast.type}`}
          role="status"
          aria-live="polite"
        >
          {toast.type === "success" ? (
            <CheckCircle size={14} />
          ) : (
            <XCircle size={14} />
          )}
          {toast.message}
        </div>
      ))}

      {/* Block Reason Modal */}
      {blockingTaskId && (
        <div
          className="atelier-workspace-modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) setBlockingTaskId(null);
          }}
        >
          <div className="atelier-workspace-modal">
            <h4>标记阻塞：{blockingTask?.title}</h4>
            <textarea
              placeholder="请填写阻塞原因"
              value={blockedReason}
              onChange={(e) => setBlockedReason(e.target.value)}
              autoFocus
            />
            <div className="atelier-workspace-modal-actions">
              <button
                className="atelier-workspace-action-btn"
                onClick={() => {
                  setBlockingTaskId(null);
                  setBlockedReason("");
                }}
              >
                取消
              </button>
              <button
                className="atelier-workspace-action-btn atelier-workspace-action-btn-warn"
                disabled={!blockedReason.trim() || isPending}
                onClick={() => {
                  const reason = blockedReason.trim();
                  if (!reason) return;
                  setBlockingTaskId(null);
                  setBlockedReason("");
                  handleStatusUpdate(blockingTaskId, {
                    status: "blocked",
                    blockedReason: reason
                  });
                }}
              >
                {isPending && (
                  <Loader2 size={12} className="atelier-spin" />
                )}
                确认阻塞
              </button>
            </div>
          </div>
        </div>
      )}

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
            {/* Tabs + Sort */}
            <div className="atelier-workspace-tabs">
              {filterTabs.map((tab) => (
                <button
                  key={tab.key}
                  className={`atelier-workspace-tab ${
                    filter === tab.key ? "atelier-workspace-tab-active" : ""
                  }`}
                  onClick={() => handleFilterChange(tab.key)}
                >
                  {tab.label}
                  {tab.showDot && stats.waitingClient > 0 && (
                    <span className="atelier-workspace-tab-dot" />
                  )}
                </button>
              ))}
              <div className="atelier-workspace-sort">
                <ArrowUpDown size={14} strokeWidth={1.5} />
                <select
                  value={sort}
                  onChange={(e) =>
                    handleSortChange(e.target.value as SortKey)
                  }
                  aria-label="排序方式"
                >
                  {sortOptions.map((opt) => (
                    <option key={opt.key} value={opt.key}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
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
                    <th className="atelier-workspace-table-th-right">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTasks.map(({ task, assignee, phase, space }) => {
                    const overdue = isOverdue(
                      task.dueDate,
                      today,
                      task.status
                    );
                    const isBlocked = task.status === "blocked";
                    const rowPending = pendingTaskId === task.id;
                    return (
                      <tr
                        key={task.id}
                        className={
                          rowPending
                            ? "atelier-workspace-table-row-pending"
                            : isBlocked
                              ? "atelier-workspace-table-row-blocked"
                              : overdue
                                ? "atelier-workspace-table-row-overdue"
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
                          <Link
                            href={`/projects/${task.projectId}` as Route}
                          >
                            {task.projectId}
                          </Link>
                          {" · "}
                          {space?.name ?? "全项目"}
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
                          {overdue ? (
                            <span className="atelier-table-due-overdue">
                              <CalendarClock size={12} strokeWidth={2} />{" "}
                              {task.dueDate}
                            </span>
                          ) : (
                            task.dueDate ?? "-"
                          )}
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
                            <StatusBadge
                              tone="blocked"
                              icon={<Ban size={14} strokeWidth={2} />}
                            >
                              已阻塞
                            </StatusBadge>
                          ) : overdue ? (
                            <StatusBadge tone="danger">已逾期</StatusBadge>
                          ) : task.status === "waiting_client" ? (
                            <StatusBadge tone="waiting">待确认</StatusBadge>
                          ) : task.status === "in_progress" ? (
                            <StatusBadge tone="progress" dot>
                              进行中
                            </StatusBadge>
                          ) : (
                            <StatusBadge tone="default">
                              {statusLabels[task.status]}
                            </StatusBadge>
                          )}
                        </td>
                        <td className="atelier-workspace-table-td-right">
                          <div className="atelier-workspace-actions">
                            {(task.status === "todo" ||
                              task.status === "backlog") && (
                              <button
                                className="atelier-workspace-action-btn atelier-workspace-action-btn-primary"
                                disabled={isPending}
                                onClick={() =>
                                  handleStatusUpdate(task.id, {
                                    status: "in_progress"
                                  })
                                }
                              >
                                {rowPending && (
                                  <Loader2
                                    size={12}
                                    className="atelier-spin"
                                  />
                                )}
                                开始处理
                              </button>
                            )}
                            {(task.status === "in_progress" ||
                              task.status === "waiting_internal") && (
                              <button
                                className="atelier-workspace-action-btn atelier-workspace-action-btn-primary"
                                disabled={isPending}
                                onClick={() =>
                                  handleStatusUpdate(task.id, {
                                    status: "done"
                                  })
                                }
                              >
                                {rowPending && (
                                  <Loader2
                                    size={12}
                                    className="atelier-spin"
                                  />
                                )}
                                标记完成
                              </button>
                            )}
                            {task.status !== "done" &&
                              task.status !== "canceled" && (
                                <button
                                  className="atelier-workspace-action-btn atelier-workspace-action-btn-warn"
                                  disabled={isPending}
                                  onClick={() =>
                                    setBlockingTaskId(task.id)
                                  }
                                >
                                  标记阻塞
                                </button>
                              )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* View all button */}
            {filteredTasks.length > 0 && filter !== "all" && (
              <button
                className="atelier-workspace-viewall"
                onClick={() => handleFilterChange("all")}
              >
                查看全部任务
                <ArrowRight size={16} strokeWidth={1.5} />
              </button>
            )}

            {filteredTasks.length === 0 && (
              <EmptyState
                icon={<ClipboardList size={24} strokeWidth={1.5} />}
                title="该分类下暂无任务"
              />
            )}
          </div>
        </div>

        {/* Right Column: Timeline */}
        <aside className="atelier-workspace-aside">
          <div className="atelier-workspace-timeline-card">
            <h3>
              <RefreshCw size={18} strokeWidth={1.5} /> 设计动态 & 修订
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
                    {getActivityIcon(item.type)}
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
