import Link from "next/link";
import type { Route } from "next";
import { getWorkspaceHome, getLeadSummary, getLeadPipeline } from "../lib/data";
import {
  ClipboardList,
  AlertTriangle,
  Handshake,
  Clock,
  ArrowRight,
  UserCheck,
  FolderKanban
} from "lucide-react";

const roleLabels = {
  sales: "销售",
  designer: "设计",
  detailer: "深化",
  project_manager: "项目经理"
} as const;

const taskTypeLabels = {
  lead_follow_up: "线索跟进",
  design_output: "设计输出",
  client_confirmation: "客户确认",
  quotation: "报价推进",
  milestone: "施工节点",
  inspection_issue: "问题处理",
  acceptance: "验收"
} as const;

const priorityLabels = {
  high: "高",
  medium: "中",
  low: "低"
} as const;

function getPhaseLabel(type: string) {
  if (type in taskTypeLabels) {
    return taskTypeLabels[type as keyof typeof taskTypeLabels];
  }
  return type;
}

function getTodayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

function isOverdue(dueDate?: string): boolean {
  if (!dueDate) return false;
  return dueDate < getTodayISO();
}

export default async function HomePage() {
  const [workspace, leadSummary, pipeline] = await Promise.all([
    getWorkspaceHome(),
    getLeadSummary(),
    getLeadPipeline()
  ]);

  const today = getTodayISO();

  // 今日优先处理事项
  const todayFollowUps = pipeline.filter(
    (item) => item.lead.nextFollowUpAt === today && item.lead.stage !== "won" && item.lead.stage !== "lost"
  );
  const overdueTasks = workspace.tasks.filter((task) =>
    isOverdue(task.dueDate) && task.status !== "done"
  );
  const blockedTasks = workspace.tasks.filter((task) => task.status === "blocked");
  const waitingClientTasks: typeof workspace.tasks = []; // WorkItem 无 waiting_client 状态，占位避免类型错误

  const actionItems = [
    {
      id: "follow-ups",
      label: "今日需跟进线索",
      count: todayFollowUps.length,
      icon: <Handshake size={18} strokeWidth={1.5} />,
      href: "/sales/leads" as Route,
      tone: todayFollowUps.length > 0 ? "attention" : "default"
    },
    {
      id: "overdue",
      label: "逾期任务",
      count: overdueTasks.length,
      icon: <Clock size={18} strokeWidth={1.5} />,
      href: "/tasks" as Route,
      tone: overdueTasks.length > 0 ? "attention" : "default"
    },
    {
      id: "waiting-client",
      label: "待客户确认",
      count: waitingClientTasks.length,
      icon: <UserCheck size={18} strokeWidth={1.5} />,
      href: "/projects/proj-1/board" as Route,
      tone: waitingClientTasks.length > 0 ? "attention" : "default"
    },
    {
      id: "blocked",
      label: "已阻塞",
      count: blockedTasks.length,
      icon: <AlertTriangle size={18} strokeWidth={1.5} />,
      href: "/projects/proj-1/board" as Route,
      tone: blockedTasks.length > 0 ? "attention" : "default"
    }
  ];

  return (
    <div className="atelier-page">
      {/* Page Header */}
      <header className="atelier-page-header">
        <div>
          <h1>今日运营</h1>
          <p>聚焦今日需要推进的事项，从优先处理到项目跟进。</p>
        </div>
      </header>

      {/* Action Items */}
      <section className="atelier-action-grid">
        {actionItems.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className={`atelier-action-card ${item.tone === "attention" ? "atelier-action-card-attention" : ""}`}
          >
            <div className="atelier-action-card-top">
              <span className="atelier-action-card-icon">{item.icon}</span>
              <span className="atelier-action-card-count">{item.count}</span>
            </div>
            <span className="atelier-action-card-label">{item.label}</span>
            <span className="atelier-action-card-arrow">
              <ArrowRight size={14} strokeWidth={1.5} />
            </span>
          </Link>
        ))}
      </section>

      {/* Summary Metrics */}
      <div className="atelier-summary-grid">
        <div className="atelier-summary-card">
          <span className="atelier-summary-label">活跃项目</span>
          <div className="atelier-summary-value-wrap">
            <span className="atelier-summary-value">{workspace.metrics.activeProjects}</span>
            <span className="atelier-summary-delta">进行中</span>
          </div>
        </div>
        <div className="atelier-summary-card">
          <span className="atelier-summary-label">待办任务</span>
          <span className="atelier-summary-value">{workspace.tasks.length}</span>
        </div>
        <div className="atelier-summary-card atelier-summary-card-accent">
          <div className="atelier-summary-card-decor" />
          <span className="atelier-summary-label atelier-summary-label-accent">活跃风险</span>
          <span className="atelier-summary-value atelier-summary-value-accent">
            {workspace.metrics.activeRisks}
          </span>
        </div>
        <div className="atelier-summary-card">
          <span className="atelier-summary-label">待确认</span>
          <span className="atelier-summary-value">{workspace.metrics.pendingConfirmations}</span>
        </div>
        <div className="atelier-summary-card">
          <span className="atelier-summary-label">线索总数</span>
          <span className="atelier-summary-value atelier-summary-value-tertiary">
            {leadSummary.total}
          </span>
        </div>
      </div>

      {/* Two Column: Tasks + Risks */}
      <div className="atelier-two-col">
        <div className="atelier-col-main">
          <div className="atelier-section-header">
            <h2>
              待办任务 <span>我的工作</span>
            </h2>
            <Link href="/tasks" className="atelier-view-all">
              查看全部任务 →
            </Link>
          </div>
          <div className="atelier-table-wrap">
            <table className="atelier-table">
              <thead>
                <tr>
                  <th>任务名称</th>
                  <th>项目 / 客户</th>
                  <th>类型</th>
                  <th>优先级</th>
                  <th>截止日期</th>
                </tr>
              </thead>
              <tbody>
                {workspace.tasks.slice(0, 6).map((task) => (
                  <tr key={task.id}>
                    <td className="atelier-table-title">{task.title}</td>
                    <td>
                      <div className="atelier-table-project">
                        <span>{task.projectName ?? task.customerName ?? "工作区任务"}</span>
                        <span className="atelier-table-project-space">
                          {roleLabels[task.role]}
                        </span>
                      </div>
                    </td>
                    <td className="atelier-table-phase">{getPhaseLabel(task.type)}</td>
                    <td>
                      <span className={`atelier-priority atelier-priority-${task.priority}`}>
                        {priorityLabels[task.priority]}
                      </span>
                    </td>
                    <td className={`atelier-table-due ${isOverdue(task.dueDate) ? "atelier-table-due-overdue" : ""}`}>
                      {task.dueDate ?? "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="atelier-col-side">
          <h2>
            风险预警 <span>风险警报</span>
          </h2>
          <div className="atelier-risk-stack">
            {workspace.risks.slice(0, 5).map((risk) => (
              <Link
                key={risk.id}
                href={(risk.targetPath ?? "/") as Route}
                className="atelier-risk-item"
              >
                <div>
                  <p className="atelier-risk-item-name">{risk.title}</p>
                  <p className="atelier-risk-item-count">{risk.summary.slice(0, 40)}…</p>
                </div>
                <span className="atelier-risk-item-arrow">›</span>
              </Link>
            ))}
            {workspace.risks.length === 0 && (
              <div className="atelier-risk-item">
                <p className="atelier-risk-item-name">暂无风险</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="atelier-quick-row">
        <div className="atelier-section-header">
          <h2>快捷操作</h2>
        </div>
        <div className="atelier-quick-grid">
          <Link href="/sales/leads" className="atelier-quick-card">
            <strong>新建线索</strong>
            <span>录入客户、来源与跟进节点</span>
          </Link>
          <Link href="/role/sales" className="atelier-quick-card">
            <strong>销售跟进</strong>
            <span>查看今日待跟进与客户确认</span>
          </Link>
          <Link href="/projects/proj-1" className="atelier-quick-card">
            <strong>项目主档</strong>
            <span>进入项目单一事实来源</span>
          </Link>
          <Link href="/client/proj-1" className="atelier-quick-card">
            <strong>客户确认</strong>
            <span>跟进客户确认与驳回反馈</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
