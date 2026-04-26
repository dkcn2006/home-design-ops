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
  high: "高",
  medium: "中",
  low: "低"
} as const;

function getWeekLabel() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  const diff = now.getTime() - start.getTime();
  const oneWeek = 1000 * 60 * 60 * 24 * 7;
  const week = Math.floor(diff / oneWeek) + 1;
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `Week ${week} — ${months[now.getMonth()]} ${now.getFullYear()}`;
}

function getPhaseLabel(type: string) {
  if (type in taskTypeLabels) {
    return taskTypeLabels[type as keyof typeof taskTypeLabels];
  }
  return type;
}

export default async function HomePage() {
  const workspace = await getWorkspaceHome();
  const [pilotProject] = workspace.projectLine;

  const blockedCount = workspace.metrics.activeRisks;
  const riskProjects = workspace.risks
    .filter((r) => r.projectName)
    .reduce(
      (acc, risk) => {
        const name = risk.projectName ?? "未知项目";
        acc[name] = (acc[name] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );
  const topRiskProjects = Object.entries(riskProjects)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2);

  return (
    <div className="atelier-page">
      {/* Header Section */}
      <header className="atelier-page-header">
        <div>
          <h1>客户项目</h1>
          <p>欢迎回到工作室。这里是您当前推进中的室内设计项目与施工任务的整体视图。</p>
        </div>
        <span className="atelier-week-badge">{getWeekLabel()}</span>
      </header>

      {/* Summary Cards */}
      <div className="atelier-summary-grid">
        <div className="atelier-summary-card">
          <span className="atelier-summary-label">活跃项目</span>
          <div className="atelier-summary-value-wrap">
            <span className="atelier-summary-value">{workspace.metrics.activeProjects}</span>
            <span className="atelier-summary-delta">+2 本月新增</span>
          </div>
        </div>
        <div className="atelier-summary-card">
          <span className="atelier-summary-label">待办任务</span>
          <span className="atelier-summary-value">{workspace.tasks.length}</span>
        </div>
        <div className="atelier-summary-card atelier-summary-card-accent">
          <div className="atelier-summary-card-decor" />
          <span className="atelier-summary-label atelier-summary-label-accent">活跃风险</span>
          <span className="atelier-summary-value atelier-summary-value-accent">{blockedCount}</span>
        </div>
        <div className="atelier-summary-card">
          <span className="atelier-summary-label">待确认事项</span>
          <span className="atelier-summary-value">{workspace.metrics.pendingConfirmations}</span>
        </div>
        <div className="atelier-summary-card">
          <span className="atelier-summary-label">线索总数</span>
          <span className="atelier-summary-value atelier-summary-value-tertiary">
            {workspace.metrics.leads}
          </span>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="atelier-two-col">
        {/* Tasks Table */}
        <div className="atelier-col-main">
          <div className="atelier-section-header">
            <h2>
              待办任务 <span>My Work</span>
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
                    <td className="atelier-table-due">{task.dueDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Risk Alerts */}
        <div className="atelier-col-side">
          <h2>
            风险预警 <span>Risk Alerts</span>
          </h2>
          <div className="atelier-risk-stack">
            {/* Structural Blocks */}
            <div className="atelier-risk-card">
              <div className="atelier-risk-card-header">
                <span>⚠</span>
                <span>项目风险</span>
              </div>
              <div className="atelier-risk-list">
                {topRiskProjects.length > 0 ? (
                  topRiskProjects.map(([name, count]) => (
                    <div className="atelier-risk-item" key={name}>
                      <div>
                        <p className="atelier-risk-item-name">{name}</p>
                        <p className="atelier-risk-item-count">{count} 个活跃风险</p>
                      </div>
                      <span className="atelier-risk-item-arrow">›</span>
                    </div>
                  ))
                ) : (
                  <div className="atelier-risk-item">
                    <p className="atelier-risk-item-name">暂无项目风险</p>
                  </div>
                )}
              </div>
            </div>

            {/* Lead Stagnation */}
            <div className="atelier-risk-card atelier-risk-card-warm">
              <div className="atelier-risk-card-header">
                <span>⧗</span>
                <span>线索跟进</span>
              </div>
              <div className="atelier-risk-list">
                <div className="atelier-risk-item">
                  <div className="atelier-risk-avatar">销</div>
                  <div>
                    <p className="atelier-risk-item-name">待跟进线索</p>
                    <p className="atelier-risk-item-count">
                      {workspace.metrics.leads} 条线索待处理
                    </p>
                  </div>
                  <span className="atelier-risk-item-arrow">›</span>
                </div>
              </div>
            </div>

            {/* CTA Card */}
            <div className="atelier-cta-card">
              <div className="atelier-cta-glow" />
              <p className="atelier-cta-kicker">Pro Feature</p>
              <h3>AI 设计方案生成器</h3>
              <p>将客户需求描述快速转化为高保真设计布局。</p>
              <button className="atelier-cta-btn">试用 Beta</button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Links Row (保留原有快捷操作) */}
      <div className="atelier-quick-row">
        <div className="atelier-section-header">
          <h2>
            快捷操作 <span>Quick Actions</span>
          </h2>
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
          <Link
            href={(pilotProject ? `/projects/${pilotProject.id}` : "/") as Route}
            className="atelier-quick-card"
          >
            <strong>项目主档</strong>
            <span>进入项目单一事实来源</span>
          </Link>
          <Link
            href={(pilotProject ? `/client/${pilotProject.id}` : "/") as Route}
            className="atelier-quick-card"
          >
            <strong>发起确认</strong>
            <span>跟进客户确认与驳回反馈</span>
          </Link>
        </div>
      </div>

      {/* Studio Moodboard */}
      <section className="atelier-moodboard">
        <div className="atelier-moodboard-header">
          <span>精选灵感</span>
          <h2>工作室灵感板</h2>
        </div>
        <div className="atelier-moodboard-grid">
          <div className="atelier-moodboard-item atelier-moodboard-item-large">
            <div className="atelier-moodboard-image atelier-moodboard-image-1" />
            <div className="atelier-moodboard-overlay">
              <p className="atelier-moodboard-title">现代简约客厅</p>
              <p className="atelier-moodboard-sub">北欧温暖风 — 方案设计阶段</p>
            </div>
          </div>
          <div className="atelier-moodboard-item">
            <div className="atelier-moodboard-image atelier-moodboard-image-2" />
          </div>
          <div className="atelier-moodboard-item">
            <div className="atelier-moodboard-image atelier-moodboard-image-3" />
          </div>
        </div>
      </section>
    </div>
  );
}
