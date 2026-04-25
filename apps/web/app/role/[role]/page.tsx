import Link from "next/link";
import { notFound } from "next/navigation";
import type { Route } from "next";
import type { UserRole } from "@home-design-ops/shared";
import { getRoleWorkbench } from "../../../lib/data";

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
    <>
      <section className="workspace-header">
        <div className="workspace-emoji">🧭</div>
        <div className="workspace-copy">
          <div className="workspace-overline">role view / phase 2 workbench</div>
          <h1>{roleLabels[role]}工作台</h1>
          <p>{workbench.subtitle}</p>
        </div>
      </section>

      <section className="doc-properties">
        {workbench.metrics.slice(0, 4).map((metric) => (
          <div className="doc-property" key={metric.label}>
            <span>{metric.label}</span>
            <strong>{metric.value}</strong>
          </div>
        ))}
      </section>

      <section className="stats">
        {workbench.metrics.map((metric) => (
          <article className={`stat-card${metric.tone === "attention" ? " stat-card-emphasis" : ""}`} key={metric.label}>
            <div className="stat-card-head">
              <strong>{metric.label}</strong>
              <span className="stat-card-meta">{metric.note}</span>
            </div>
            <div className="stat-card-value stat-card-value-sm">{metric.value}</div>
          </article>
        ))}
      </section>

      <section className="cards-2 role-workbench-grid" style={{ marginTop: 22 }}>
        <article className="panel">
          <div className="section-title">
            <h2>当前待办</h2>
            <span>结构化任务流</span>
          </div>
          <ul className="clean operational-list">
            {workbench.inbox.map((task) => (
              <li key={task.id}>
                <div className="list-row-top">
                  <strong>{task.title}</strong>
                  <span className={`status-chip status-priority-${task.priority}`}>{priorityLabels[task.priority]}</span>
                </div>
                <div className="list-meta-row">
                  <span>{taskTypeLabels[task.type]}</span>
                  <span>{task.dueDate}</span>
                  <span>{task.projectName ?? task.customerName ?? "工作区任务"}</span>
                </div>
                <div className="muted">{task.summary}</div>
                <div className="list-link-row">
                  <span className="muted">状态：{task.status}</span>
                  <Link href={task.targetPath as Route} className="table-link">
                    打开处理
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </article>

        <article className="panel">
          <div className="section-title">
            <h2>{copy.focusTitle}</h2>
            <span>Phase 2 角色重点</span>
          </div>
          <p className="muted role-helper-copy">{copy.focusNote}</p>
          <ul className="clean compact-list operational-list">
            {workbench.focusProjects.map((project) => (
              <li key={project.id}>
                <div className="list-row-top">
                  <strong>{project.name}</strong>
                  <Link href={project.targetPath as Route} className="table-link">
                    查看项目
                  </Link>
                </div>
                <div className="muted">
                  {project.customerName} · 下一步：{project.nextAction}
                </div>
              </li>
            ))}
          </ul>
        </article>
      </section>

      <section className="cards-2 role-workbench-grid" style={{ marginTop: 22 }}>
        <article className="panel">
          <div className="section-title">
            <h2>风险预警</h2>
            <span>当前需要干预的事项</span>
          </div>
          <ul className="clean operational-list">
            {workbench.risks.map((risk) => (
              <li key={risk.id}>
                <div className="list-row-top">
                  <strong>{risk.title}</strong>
                  <span className={`status-chip status-risk-${risk.severity}`}>{risk.severity.toUpperCase()}</span>
                </div>
                <div className="muted">{risk.summary}</div>
                <div className="list-link-row">
                  <span className="muted">{risk.projectName ?? "全局风险"}</span>
                  <Link href={risk.targetPath as Route} className="table-link">
                    查看详情
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </article>

        <article className="panel">
          <div className="section-title">
            <h2>最近动态</h2>
            <span>确认、变更与节点留痕</span>
          </div>
          <ul className="clean operational-list">
            {workbench.activity.map((item) => (
              <li key={item.id}>
                <div className="list-row-top">
                  <strong>{item.title}</strong>
                  <Link href={item.targetPath as Route} className="table-link">
                    查看
                  </Link>
                </div>
                <div className="list-meta-row">
                  <span>{item.occurredAt.slice(0, 10)}</span>
                  <span>{item.projectName ?? "工作区"}</span>
                </div>
                <div className="muted">{item.summary}</div>
              </li>
            ))}
          </ul>
        </article>
      </section>
    </>
  );
}
