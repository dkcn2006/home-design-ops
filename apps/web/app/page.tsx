import Link from "next/link";
import type { Route } from "next";
import { getWorkspaceHome } from "../lib/data";

const roleLabels = {
  sales: "销售",
  designer: "设计",
  detailer: "深化",
  project_manager: "项目经理"
} as const;

const projectStageLabels = {
  discovery: "待量房",
  design: "方案设计",
  detailing: "施工准备",
  delivery: "施工中",
  completed: "已完工"
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
  high: "高优先级",
  medium: "中优先级",
  low: "低优先级"
} as const;

export default async function HomePage() {
  const workspace = await getWorkspaceHome();
  const [pilotProject] = workspace.projectLine;

  const quickLinks = [
    {
      href: "/sales/leads",
      label: "新建线索",
      note: "录入客户、来源与跟进节点",
      tag: "Lead"
    },
    {
      href: "/role/sales",
      label: "销售跟进",
      note: "查看今日待跟进与客户确认",
      tag: "Sales"
    },
    {
      href: pilotProject ? `/projects/${pilotProject.id}` : "/",
      label: "项目主档",
      note: "进入项目单一事实来源",
      tag: "Project"
    },
    {
      href: pilotProject ? `/client/${pilotProject.id}` : "/",
      label: "发起确认",
      note: "跟进客户确认与驳回反馈",
      tag: "Confirm"
    }
  ];

  return (
    <>
      <section className="workspace-header">
        <div className="workspace-emoji">🏠</div>
        <div className="workspace-copy">
          <div className="workspace-overline">workspace / overview</div>
          <h1>家装运营总览</h1>
          <p>首页直接读取后端结构化任务流，把待办、风险、动态和项目主线收在同一个工作区首页。</p>
        </div>
      </section>

      <section className="panel home-quick-panel">
        <div className="section-title">
          <h2>全局快捷操作</h2>
          <span>减少跳转，直接进入关键动作</span>
        </div>
        <div className="quick-link-grid">
          {quickLinks.map((link) => (
            <Link href={link.href as Route} className="quick-link-card" key={link.label}>
              <div className="quick-link-top">
                <strong>{link.label}</strong>
                <span className="pill">{link.tag}</span>
              </div>
              <div className="muted">{link.note}</div>
            </Link>
          ))}
        </div>
      </section>

      <section className="cards-2 home-priority-grid">
        <article className="panel">
          <div className="section-title">
            <h2>我的待办</h2>
            <span>来自后端任务流</span>
          </div>
          <ul className="clean operational-list">
            {workspace.tasks.map((task) => (
              <li key={task.id}>
                <div className="list-row-top">
                  <strong>{task.title}</strong>
                  <span className={`status-chip status-priority-${task.priority}`}>{priorityLabels[task.priority]}</span>
                </div>
                <div className="list-meta-row">
                  <span>{roleLabels[task.role]}</span>
                  <span>{taskTypeLabels[task.type]}</span>
                  <span>{task.dueDate}</span>
                </div>
                <div className="muted">{task.summary}</div>
                <div className="list-link-row">
                  <span className="muted">{task.projectName ?? task.customerName ?? "工作区任务"}</span>
                  <Link href={task.targetPath as Route} className="table-link">
                    查看详情
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </article>

        <article className="panel">
          <div className="section-title">
            <h2>风险与提醒</h2>
            <span>由确认、问题与节点聚合而成</span>
          </div>
          <ul className="clean operational-list">
            {workspace.risks.map((risk) => (
              <li key={risk.id}>
                <div className="list-row-top">
                  <strong>{risk.title}</strong>
                  <span className={`status-chip status-risk-${risk.severity}`}>{risk.severity.toUpperCase()}</span>
                </div>
                <div className="list-meta-row">
                  <span>{roleLabels[risk.ownerRole]}</span>
                  <span>{risk.projectName ?? "全局风险"}</span>
                </div>
                <div className="muted">{risk.summary}</div>
                <div className="list-link-row">
                  <span className="muted">需继续推进闭环</span>
                  <Link href={risk.targetPath as Route} className="table-link">
                    查看项目
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </article>
      </section>

      <section className="panel metrics-panel">
        <div className="section-title">
          <h2>核心经营指标</h2>
          <span>管理层快速判断经营情况与压力点</span>
        </div>
        <div className="stats">
          <article className="stat-card">
            <div className="stat-card-head">
              <strong>客户数</strong>
              <span className="stat-card-meta">客户档案沉淀</span>
            </div>
            <div className="stat-card-value">{workspace.metrics.customers}</div>
          </article>
          <article className="stat-card">
            <div className="stat-card-head">
              <strong>线索数</strong>
              <span className="stat-card-meta">获客入口总量</span>
            </div>
            <div className="stat-card-value">{workspace.metrics.leads}</div>
          </article>
          <article className="stat-card">
            <div className="stat-card-head">
              <strong>活跃项目</strong>
              <span className="stat-card-meta">当前推进中</span>
            </div>
            <div className="stat-card-value">{workspace.metrics.activeProjects}</div>
          </article>
          <article className="stat-card">
            <div className="stat-card-head">
              <strong>待确认事项</strong>
              <span className="stat-card-meta">待客户反馈</span>
            </div>
            <div className="stat-card-value">{workspace.metrics.pendingConfirmations}</div>
          </article>
          <article className="stat-card">
            <div className="stat-card-head">
              <strong>活跃风险</strong>
              <span className="stat-card-meta">问题与节点预警</span>
            </div>
            <div className="stat-card-value">{workspace.metrics.activeRisks}</div>
          </article>
          <article className="stat-card stat-card-emphasis">
            <div className="stat-card-head">
              <strong>总报价额</strong>
              <span className="stat-card-meta">项目累计金额</span>
            </div>
            <div className="stat-card-value">¥{workspace.metrics.totalQuotationValue.toLocaleString()}</div>
          </article>
        </div>
      </section>

      <section className="panel" style={{ marginTop: 22 }}>
        <div className="section-title">
          <h2>角色工作入口</h2>
          <span>每个角色进入后看到同一主线上的不同视角</span>
        </div>
        <div className="cards-3">
          {workspace.roleSummaries.map((role) => (
            <Link href={role.targetPath as Route} className="workspace-link-card role-card" key={role.role}>
              <div className="list-row-top">
                <strong>{role.label}</strong>
                <span className="pill">Role</span>
              </div>
              <p className="muted">{role.summary}</p>
              <div className="role-card-metrics">
                <span>待办 {role.taskCount}</span>
                <span>风险 {role.riskCount}</span>
                <span>活跃项目 {role.activeProjects}</span>
              </div>
              <div className="muted">当前重点：{role.primaryTask ?? "暂无待办"}</div>
            </Link>
          ))}
        </div>
      </section>

      <section className="two-col" style={{ marginTop: 22 }}>
        <article className="panel">
          <div className="section-title">
            <h2>项目进度概览</h2>
            <span>按主阶段查看整体分布与本周节点</span>
          </div>
          <div className="stage-summary-grid">
            {workspace.stageSummary.map((item) => (
              <div className="stage-summary-card" key={item.stage}>
                <span>{item.label}</span>
                <strong>{item.count}</strong>
              </div>
            ))}
          </div>
          <div className="subsection-title">项目主线摘要</div>
          <ul className="clean compact-list operational-list" style={{ marginTop: 12 }}>
            {workspace.projectLine.slice(0, 4).map((project) => (
              <li key={project.id}>
                <div className="list-row-top">
                  <strong>{project.name}</strong>
                  <span className="status-chip">{projectStageLabels[project.status]}</span>
                </div>
                <div className="muted">
                  {project.customerName} · 待确认 {project.pendingConfirmationCount} · 问题 {project.openIssueCount}
                </div>
              </li>
            ))}
          </ul>
        </article>

        <article className="panel">
          <div className="section-title">
            <h2>最近动态</h2>
            <span>后端动态流，记录确认、变更与节点留痕</span>
          </div>
          <ul className="clean compact-list activity-list">
            {workspace.activities.map((item) => (
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

      <section className="panel" style={{ marginTop: 22 }}>
        <div className="section-title">
          <h2>项目主线视图</h2>
          <span>围绕客户 - 项目 - 交付组织协作信息</span>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>项目</th>
              <th>客户 / 线索</th>
              <th>当前阶段</th>
              <th>确认与风险</th>
              <th>下一节点</th>
            </tr>
          </thead>
          <tbody>
            {workspace.projectLine.map((project) => (
              <tr key={project.id}>
                <td>
                  <Link href={`/projects/${project.id}` as Route} className="table-link">
                    {project.name}
                  </Link>
                  <div className="muted">{project.code}</div>
                </td>
                <td>
                  {project.customerName}
                  <div className="muted">{project.city}</div>
                </td>
                <td>
                  {projectStageLabels[project.status]}
                  <div className="muted">{project.areaSqm} ㎡</div>
                </td>
                <td>
                  待确认 {project.pendingConfirmationCount} · 问题 {project.openIssueCount}
                  <div className="muted">报价 ¥{project.quotationAmount.toLocaleString()}</div>
                </td>
                <td>{project.nextMilestone ? `${project.nextMilestone.name} / ${project.nextMilestone.plannedDate}` : "暂无"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  );
}
