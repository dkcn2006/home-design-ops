import Link from "next/link";
import type { Route } from "next";
import { getArchive, getDashboard, getPortfolioOverview } from "../lib/data";

const roleLabels = {
  sales: "销售",
  designer: "设计",
  project_manager: "项目经理"
} as const;

const projectStageLabels = {
  discovery: "待量房",
  design: "方案设计",
  detailing: "施工准备",
  delivery: "施工中",
  completed: "已完工"
} as const;

const leadStageLabels = {
  new: "新线索",
  following_up: "已联系",
  site_measurement: "已预约量房",
  proposal_pending: "方案中",
  signed: "已签约",
  closed: "已流失"
} as const;

const confirmationTypeLabels = {
  proposal: "方案确认",
  quotation: "报价确认",
  change_order: "增减项确认",
  milestone: "节点确认",
  completion: "验收确认"
} as const;

export default async function HomePage() {
  const [salesDashboard, designerDashboard, managerDashboard, overview] = await Promise.all([
    getDashboard("sales"),
    getDashboard("designer"),
    getDashboard("project_manager"),
    getPortfolioOverview()
  ]);

  const [pilotProject] = overview.projects;
  const pilotArchive = pilotProject ? await getArchive(pilotProject.id) : null;

  const quickLinks = [
    {
      href: "/sales/leads",
      label: "新建线索",
      note: "录入客户、来源与下次跟进",
      tag: "Lead"
    },
    {
      href: "/role/sales",
      label: "销售跟进",
      note: "查看今日待跟进与转化重点",
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

  const todayTodos = [
    ...salesDashboard.focus.map((item) => ({ role: "sales", title: item })),
    ...designerDashboard.focus.map((item) => ({ role: "designer", title: item })),
    ...managerDashboard.focus.map((item) => ({ role: "project_manager", title: item }))
  ].slice(0, 6);

  const riskItems = overview.projects
    .flatMap((project) => {
      const items = [];

      if (project.pendingConfirmationCount > 0) {
        items.push({
          projectId: project.id,
          title: `${project.name} 有 ${project.pendingConfirmationCount} 项待确认`,
          note: "客户确认未闭环"
        });
      }

      if (project.openIssueCount > 0) {
        items.push({
          projectId: project.id,
          title: `${project.name} 有 ${project.openIssueCount} 个待处理问题`,
          note: "施工/深化问题需继续推进"
        });
      }

      if (project.nextMilestone) {
        items.push({
          projectId: project.id,
          title: `${project.nextMilestone.name} 将于 ${project.nextMilestone.plannedDate} 推进`,
          note: "注意节点准备与责任人同步"
        });
      }

      return items;
    })
    .slice(0, 5);

  const stageSummary = Object.entries(projectStageLabels).map(([key, label]) => ({
    key,
    label,
    count: overview.projects.filter((project) => project.status === key).length
  }));

  const roleBoards = [
    {
      href: "/role/sales",
      name: "销售工作台",
      summary: "强跟进、强转化、强提醒",
      dashboard: salesDashboard
    },
    {
      href: "/role/designer",
      name: "设计工作台",
      summary: "清楚知道待量房、待出图与待确认",
      dashboard: designerDashboard
    },
    {
      href: "/role/project_manager",
      name: "项目经理工作台",
      summary: "盯节点、盯风险、盯验收闭环",
      dashboard: managerDashboard
    }
  ];

  const upcomingProjects = overview.projects
    .filter((project) => project.nextMilestone)
    .slice(0, 4);

  const recentActivities = pilotArchive
    ? [
        ...pilotArchive.confirmations.map((item) => ({
          time: item.updatedAt,
          title: `${confirmationTypeLabels[item.type]} · ${item.status === "pending" ? "待处理" : item.status === "confirmed" ? "已确认" : "已驳回"}`,
          note: item.note ?? `客户：${item.clientName}`,
          href: `/client/${pilotArchive.project.id}` as Route
        })),
        ...pilotArchive.changeOrders.map((item) => ({
          time: item.updatedAt,
          title: `设计变更 · ${item.title}`,
          note: `${item.confirmationStatus === "pending" ? "待确认" : "已处理"} · 金额变化 ¥${item.amountDelta.toLocaleString()}`,
          href: `/projects/${pilotArchive.project.id}` as Route
        })),
        ...pilotArchive.milestones.map((item) => ({
          time: item.updatedAt,
          title: `施工节点 · ${item.name}`,
          note: `${item.plannedDate} · 责任角色 ${roleLabels[item.ownerRole as keyof typeof roleLabels] ?? item.ownerRole}`,
          href: `/projects/${pilotArchive.project.id}` as Route
        }))
      ]
        .sort((a, b) => b.time.localeCompare(a.time))
        .slice(0, 5)
    : [];

  return (
    <>
      <section className="workspace-header">
        <div className="workspace-emoji">🏠</div>
        <div className="workspace-copy">
          <div className="workspace-overline">workspace / overview</div>
          <h1>家装运营总览</h1>
          <p>以客户到项目交付为主线，把待办、确认、风险和角色协作收在同一个工作区首页。</p>
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
            <span>今日优先处理</span>
          </div>
          <ul className="clean operational-list">
            {todayTodos.map((item) => (
              <li key={`${item.role}-${item.title}`}>
                <div className="list-row-top">
                  <strong>{item.title}</strong>
                  <span className="status-chip">{roleLabels[item.role as keyof typeof roleLabels]}</span>
                </div>
              </li>
            ))}
          </ul>
        </article>

        <article className="panel">
          <div className="section-title">
            <h2>风险与提醒</h2>
            <span>待确认、问题与临近节点</span>
          </div>
          <ul className="clean operational-list">
            {riskItems.map((item) => (
              <li key={`${item.projectId}-${item.title}`}>
                <div className="list-row-top">
                  <strong>{item.title}</strong>
                  <Link href={`/projects/${item.projectId}`} className="table-link">
                    查看项目
                  </Link>
                </div>
                <div className="muted">{item.note}</div>
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
            <div className="stat-card-value">{overview.metrics.customers}</div>
          </article>
          <article className="stat-card">
            <div className="stat-card-head">
              <strong>线索数</strong>
              <span className="stat-card-meta">获客入口总量</span>
            </div>
            <div className="stat-card-value">{overview.metrics.leads}</div>
          </article>
          <article className="stat-card">
            <div className="stat-card-head">
              <strong>活跃项目</strong>
              <span className="stat-card-meta">当前推进中</span>
            </div>
            <div className="stat-card-value">{overview.metrics.activeProjects}</div>
          </article>
          <article className="stat-card">
            <div className="stat-card-head">
              <strong>待确认事项</strong>
              <span className="stat-card-meta">待客户反馈</span>
            </div>
            <div className="stat-card-value">{overview.metrics.pendingConfirmations}</div>
          </article>
          <article className="stat-card">
            <div className="stat-card-head">
              <strong>待处理问题</strong>
              <span className="stat-card-meta">问题待闭环</span>
            </div>
            <div className="stat-card-value">{overview.metrics.openIssues}</div>
          </article>
          <article className="stat-card stat-card-emphasis">
            <div className="stat-card-head">
              <strong>总报价额</strong>
              <span className="stat-card-meta">项目累计金额</span>
            </div>
            <div className="stat-card-value">¥{overview.metrics.totalQuotationValue.toLocaleString()}</div>
          </article>
        </div>
      </section>

      <section className="panel" style={{ marginTop: 22 }}>
        <div className="section-title">
          <h2>角色工作入口</h2>
          <span>打开系统先看到最需要处理的信息</span>
        </div>
        <div className="cards-3">
          {roleBoards.map((board) => (
            <Link href={board.href as Route} className="workspace-link-card role-card" key={board.name}>
              <div className="list-row-top">
                <strong>{board.name}</strong>
                <span className="pill">Role</span>
              </div>
              <p className="muted">{board.summary}</p>
              <div className="role-card-metrics">
                <span>活跃项目 {board.dashboard.metrics.activeProjects}</span>
                <span>待确认 {board.dashboard.metrics.pendingConfirmations}</span>
                <span>开放问题 {board.dashboard.metrics.openIssues}</span>
              </div>
              <div className="muted">当前重点：{board.dashboard.focus[0]}</div>
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
            {stageSummary.map((item) => (
              <div className="stage-summary-card" key={item.key}>
                <span>{item.label}</span>
                <strong>{item.count}</strong>
              </div>
            ))}
          </div>
          <div className="subsection-title">本周关键节点</div>
          <ul className="clean compact-list operational-list" style={{ marginTop: 12 }}>
            {upcomingProjects.map((project) => (
              <li key={project.id}>
                <div className="list-row-top">
                  <strong>{project.nextMilestone?.name}</strong>
                  <span className="status-chip">{projectStageLabels[project.status]}</span>
                </div>
                <div className="muted">
                  {project.name} · {project.nextMilestone?.plannedDate}
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
          <ul className="clean compact-list activity-list">
            {recentActivities.map((item) => (
              <li key={`${item.time}-${item.title}`}>
                <div className="list-row-top">
                  <strong>{item.title}</strong>
                  <Link href={item.href} className="table-link">
                    查看
                  </Link>
                </div>
                <div className="muted">{item.note}</div>
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
            {overview.projects.map((project) => (
              <tr key={project.id}>
                <td>
                  <Link href={`/projects/${project.id}`} className="table-link">
                    {project.name}
                  </Link>
                  <div className="muted">{project.code}</div>
                </td>
                <td>
                  {project.customerName}
                  <div className="muted">{leadStageLabels[project.leadStage]}</div>
                </td>
                <td>
                  {projectStageLabels[project.status]}
                  <div className="muted">{project.city} · {project.areaSqm} ㎡</div>
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
