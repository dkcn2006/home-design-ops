import Link from "next/link";
import { notFound } from "next/navigation";
import type { Route } from "next";
import type { UserRole } from "@home-design-ops/shared";
import { getRoleWorkbench } from "../../../lib/data";
import { AlertTriangle, Flag, FileText, ArrowRight } from "lucide-react";

const roleLabels: Record<UserRole, string> = {
  sales: "销售顾问",
  designer: "设计师",
  detailer: "深化设计",
  project_manager: "项目经理",
  client: "客户",
  admin: "管理员"
};

const taskTypeLabels = {
  lead_follow_up: "线索跟进",
  design_output: "待出图",
  client_confirmation: "待确认",
  quotation: "报价推进",
  milestone: "节点推进",
  inspection_issue: "问题关闭",
  acceptance: "验收"
} as const;

const priorityLabels = {
  high: "高优先级",
  medium: "中优先级",
  low: "低优先级"
} as const;

const phase2Copy = {
  sales: {
    focusTitle: "转化漏斗关注",
    focusNote: "优先看今日待跟进、高意向客户和待客户确认事项。"
  },
  designer: {
    focusTitle: "设计执行关注",
    focusNote: "优先看待出图、待客户确认和设计变更反馈。"
  },
  project_manager: {
    focusTitle: "交付推进关注",
    focusNote: "优先看施工节点、现场问题和延期风险。"
  }
} as const;

export default async function RolePage({ params }: { params: Promise<{ role: UserRole }> }) {
  const { role } = await params;
  if (role !== "sales" && role !== "designer" && role !== "project_manager") {
    notFound();
  }

  const workbench = await getRoleWorkbench(role);
  const copy = phase2Copy[role];

  return (
    <div className="role-workbench">
      {/* Header */}
      <header className="role-workbench-header">
        <div className="role-workbench-header-icon">🧭</div>
        <div>
          <span className="role-workbench-overline">Role View / Phase 2 Workbench</span>
          <h1>{roleLabels[role]}工作台</h1>
          <p>{workbench.subtitle}</p>
        </div>
      </header>

      {/* Metrics — single row */}
      <section className="role-workbench-metrics">
        {workbench.metrics.map((metric) => (
          <div
            className={`role-metric-card ${metric.tone === "attention" ? "role-metric-card-attention" : ""}`}
            key={metric.label}
          >
            <div className="role-metric-top">
              <span className="role-metric-label">{metric.label}</span>
              <span className="role-metric-note">{metric.note}</span>
            </div>
            <div className="role-metric-value">{metric.value}</div>
          </div>
        ))}
      </section>

      {/* Two-column grid: Inbox + Focus */}
      <div className="role-workbench-grid">
        {/* Current Inbox */}
        <section className="role-workbench-panel">
          <div className="role-workbench-panel-header">
            <h2>当前待办</h2>
            <span>结构化任务流</span>
          </div>
          <div className="role-task-list">
            {workbench.inbox.map((task) => (
              <div className="role-task-item" key={task.id}>
                <div className="role-task-item-top">
                  <strong>{task.title}</strong>
                  <span className={`role-priority role-priority-${task.priority}`}>
                    {priorityLabels[task.priority]}
                  </span>
                </div>
                <div className="role-task-meta">
                  <span>{taskTypeLabels[task.type]}</span>
                  <span>{task.dueDate}</span>
                  <span>{task.projectName ?? task.customerName ?? "工作区任务"}</span>
                </div>
                <p className="role-task-summary">{task.summary}</p>
                <div className="role-task-footer">
                  <span>状态：{task.status}</span>
                  <Link href={task.targetPath as Route} className="role-task-link">
                    打开处理 <ArrowRight size={12} strokeWidth={2} />
                  </Link>
                </div>
              </div>
            ))}
            {workbench.inbox.length === 0 && (
              <div className="role-empty">
                <FileText size={20} strokeWidth={1.5} />
                <p>当前暂无待办任务</p>
              </div>
            )}
          </div>
        </section>

        {/* Focus */}
        <section className="role-workbench-panel">
          <div className="role-workbench-panel-header">
            <h2>{copy.focusTitle}</h2>
            <span>Phase 2 角色重点</span>
          </div>
          <p className="role-panel-desc">{copy.focusNote}</p>
          <div className="role-focus-list">
            {workbench.focusProjects.map((project) => (
              <div className="role-focus-item" key={project.id}>
                <div className="role-focus-top">
                  <strong>{project.name}</strong>
                  <Link href={project.targetPath as Route} className="role-task-link">
                    查看项目 <ArrowRight size={12} strokeWidth={2} />
                  </Link>
                </div>
                <p className="role-focus-next">
                  {project.customerName} · 下一步：{project.nextAction}
                </p>
              </div>
            ))}
            {workbench.focusProjects.length === 0 && (
              <div className="role-empty">
                <Flag size={20} strokeWidth={1.5} />
                <p>当前无重点关注项目</p>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Two-column grid: Risks + Activity */}
      <div className="role-workbench-grid">
        {/* Risks */}
        <section className="role-workbench-panel">
          <div className="role-workbench-panel-header">
            <h2>风险预警</h2>
            <span>当前需要干预的事项</span>
          </div>
          <div className="role-risk-list">
            {workbench.risks.map((risk) => (
              <div className="role-risk-item" key={risk.id}>
                <div className="role-risk-top">
                  <div className="role-risk-title">
                    <AlertTriangle size={14} strokeWidth={2} />
                    <strong>{risk.title}</strong>
                  </div>
                  <span className={`role-severity role-severity-${risk.severity}`}>
                    {risk.severity.toUpperCase()}
                  </span>
                </div>
                <p className="role-risk-summary">{risk.summary}</p>
                <div className="role-risk-footer">
                  <span>{risk.projectName ?? "全局风险"}</span>
                  <Link href={risk.targetPath as Route} className="role-task-link">
                    查看详情 <ArrowRight size={12} strokeWidth={2} />
                  </Link>
                </div>
              </div>
            ))}
            {workbench.risks.length === 0 && (
              <div className="role-empty">
                <AlertTriangle size={20} strokeWidth={1.5} />
                <p>当前无风险预警</p>
              </div>
            )}
          </div>
        </section>

        {/* Activity */}
        <section className="role-workbench-panel">
          <div className="role-workbench-panel-header">
            <h2>最近动态</h2>
            <span>确认、变更与节点留痕</span>
          </div>
          <div className="role-activity-list">
            {workbench.activity.map((item) => (
              <div className="role-activity-item" key={item.id}>
                <div className="role-activity-top">
                  <strong>{item.title}</strong>
                  <Link href={item.targetPath as Route} className="role-task-link">
                    查看 <ArrowRight size={12} strokeWidth={2} />
                  </Link>
                </div>
                <div className="role-activity-meta">
                  <span>{item.occurredAt.slice(0, 10)}</span>
                  <span>{item.projectName ?? "工作区"}</span>
                </div>
                <p className="role-activity-summary">{item.summary}</p>
              </div>
            ))}
            {workbench.activity.length === 0 && (
              <div className="role-empty">
                <FileText size={20} strokeWidth={1.5} />
                <p>近期暂无动态</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
