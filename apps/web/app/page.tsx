import Link from "next/link";
import { getDashboard, getPortfolioOverview } from "../lib/data";

const workflowSteps = [
  {
    title: "1. 客户与线索",
    description: "沉淀客户画像、预算区间、痛点和线索阶段，避免信息只留在聊天记录里。"
  },
  {
    title: "2. 需求与方案",
    description: "将需求单、SU 方案、效果图和施工图收口到同一项目档案，并记录当前有效版本。"
  },
  {
    title: "3. 报价与变更",
    description: "报价绑定方案版本，后续增减项单独留痕，避免口头确认导致扯皮。"
  },
  {
    title: "4. 交付与巡检",
    description: "围绕里程碑推进交底、下单、巡检和问题关闭，形成项目执行视图。"
  },
  {
    title: "5. 客户确认",
    description: "把方案确认、报价确认和变更确认统一到客户端门户，形成可追踪记录。"
  }
];

export default async function HomePage() {
  const [salesDashboard, overview] = await Promise.all([getDashboard("sales"), getPortfolioOverview()]);
  const [pilotProject] = overview.projects;

  return (
    <>
      <section className="hero-card">
        <h1>面向小型家装团队的前后端 MVP 已切到真实 API 结构</h1>
        <p>
          当前首页不再直接读取本地种子数据，而是通过 NestJS API 获取项目运营概览。MVP 的下一阶段重点是把每个业务节点都做成可操作、可追踪、可确认的真实流程。
        </p>
        <div className="badge-row">
          <span className="badge">Next.js Web</span>
          <span className="badge">NestJS API</span>
          <span className="badge">Project Archive Center</span>
          <span className="badge">Confirmation Workflow</span>
        </div>
      </section>

      <section className="grid stats">
        <article className="stat-card">
          <strong>客户数</strong>
          <span>{overview.metrics.customers}</span>
        </article>
        <article className="stat-card">
          <strong>活跃项目</strong>
          <span>{overview.metrics.activeProjects}</span>
        </article>
        <article className="stat-card">
          <strong>待确认事项</strong>
          <span>{overview.metrics.pendingConfirmations}</span>
        </article>
        <article className="stat-card">
          <strong>总报价额</strong>
          <span>¥{overview.metrics.totalQuotationValue.toLocaleString()}</span>
        </article>
      </section>

      <section className="panel" style={{ marginTop: 22 }}>
        <div className="section-title">
          <h2>MVP 详细功能落地顺序</h2>
          <span>从信息收口到执行闭环</span>
        </div>
        <div className="cards-3">
          {workflowSteps.map((step) => (
            <article className="kanban-card" key={step.title}>
              <div className="pill">Step</div>
              <h3 style={{ marginTop: 14 }}>{step.title}</h3>
              <p className="muted" style={{ marginTop: 10 }}>
                {step.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      {pilotProject ? (
        <section className="panel" style={{ marginTop: 22 }}>
          <div className="section-title">
            <h2>当前试点项目</h2>
            <span>{pilotProject.name}</span>
          </div>
          <div className="cards-2">
            <article className="kanban-card">
              <h3>项目运营概览</h3>
              <ul className="clean" style={{ marginTop: 14 }}>
                <li>客户：{pilotProject.customerName}</li>
                <li>城市：{pilotProject.city}</li>
                <li>阶段：{pilotProject.status}</li>
                <li>线索阶段：{pilotProject.leadStage}</li>
                <li>预算区间：¥{pilotProject.budgetRange.min.toLocaleString()} - ¥{pilotProject.budgetRange.max.toLocaleString()}</li>
                <li>当前报价总额：¥{pilotProject.quotationAmount.toLocaleString()}</li>
                <li>待确认事项：{pilotProject.pendingConfirmationCount}</li>
                <li>未关闭问题：{pilotProject.openIssueCount}</li>
              </ul>
            </article>
            <article className="kanban-card">
              <h3>下一步动作</h3>
              <ul className="clean" style={{ marginTop: 14 }}>
                {salesDashboard.focus.map((item) => (
                  <li key={item}>{item}</li>
                ))}
                <li>
                  下一里程碑：
                  {pilotProject.nextMilestone
                    ? `${pilotProject.nextMilestone.name} / ${pilotProject.nextMilestone.plannedDate}`
                    : "暂无"}
                </li>
              </ul>
              <div className="footer-note" style={{ marginTop: 18 }}>
                <strong>当前已实现：</strong> 运营概览、项目档案、角色工作台和客户端确认流已经通过 API 串起来，可以继续往真实数据库迁移。
              </div>
            </article>
          </div>
          <div className="badge-row">
            <Link href={`/projects/${pilotProject.id}`} className="badge">
              查看项目档案
            </Link>
            <Link href="/role/designer" className="badge">
              查看设计工作台
            </Link>
            <Link href={`/client/${pilotProject.id}`} className="badge">
              查看客户端门户
            </Link>
          </div>
        </section>
      ) : null}
    </>
  );
}
