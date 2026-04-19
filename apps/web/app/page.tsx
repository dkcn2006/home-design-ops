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
      <section className="workspace-header">
        <div className="workspace-emoji">🏠</div>
        <div className="workspace-copy">
          <div className="workspace-overline">workspace / overview</div>
          <h1>家装运营总览</h1>
          <p>
            当前系统已经进入可联调的 MVP 阶段：首页通过 NestJS API 读取项目事实，用一个工作区视图把线索、项目、报价、确认和下一步动作整理在一起。
          </p>
        </div>
      </section>

      <section className="doc-properties">
        <div className="doc-property">
          <span>系统状态</span>
          <strong>本地可运行</strong>
        </div>
        <div className="doc-property">
          <span>数据来源</span>
          <strong>NestJS API</strong>
        </div>
        <div className="doc-property">
          <span>当前阶段</span>
          <strong>MVP 联调中</strong>
        </div>
        <div className="doc-property">
          <span>重点方向</span>
          <strong>流程闭环与持久化</strong>
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
          <h2>工作区入口</h2>
          <span>常用视图</span>
        </div>
        <div className="cards-3">
          <Link href="/sales/leads" className="workspace-link-card">
            <div className="pill">Sales</div>
            <h3>客户 / 线索录入</h3>
            <p className="muted">录入客户、创建线索、更新销售阶段，形成前端和 API 贯通的链路入口。</p>
          </Link>
          <Link href="/role/sales" className="workspace-link-card">
            <div className="pill">Role View</div>
            <h3>销售工作台</h3>
            <p className="muted">查看销售视角的关注事项、共享项目事实和近期待推动节点。</p>
          </Link>
          <Link href={pilotProject ? `/projects/${pilotProject.id}` : "/"} className="workspace-link-card">
            <div className="pill">Archive</div>
            <h3>项目档案</h3>
            <p className="muted">进入项目单一事实来源页面，查看需求、版本、报价、交付和客户确认。</p>
          </Link>
        </div>
      </section>

      <section className="panel" style={{ marginTop: 22 }}>
        <div className="section-title">
          <h2>MVP 功能路径</h2>
          <span>从线索到确认</span>
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
            <span>{pilotProject.code}</span>
          </div>
          <div className="doc-properties">
            <div className="doc-property">
              <span>客户</span>
              <strong>{pilotProject.customerName}</strong>
            </div>
            <div className="doc-property">
              <span>城市</span>
              <strong>{pilotProject.city}</strong>
            </div>
            <div className="doc-property">
              <span>项目阶段</span>
              <strong>{pilotProject.status}</strong>
            </div>
            <div className="doc-property">
              <span>线索阶段</span>
              <strong>{pilotProject.leadStage}</strong>
            </div>
            <div className="doc-property">
              <span>报价总额</span>
              <strong>¥{pilotProject.quotationAmount.toLocaleString()}</strong>
            </div>
            <div className="doc-property">
              <span>待确认</span>
              <strong>{pilotProject.pendingConfirmationCount} 项</strong>
            </div>
          </div>
          <div className="cards-2" style={{ marginTop: 18 }}>
            <article className="kanban-card">
              <h3>当前上下文</h3>
              <ul className="clean" style={{ marginTop: 14 }}>
                <li>预算区间：¥{pilotProject.budgetRange.min.toLocaleString()} - ¥{pilotProject.budgetRange.max.toLocaleString()}</li>
                <li>未关闭问题：{pilotProject.openIssueCount}</li>
                <li>
                  下一里程碑：
                  {pilotProject.nextMilestone
                    ? `${pilotProject.nextMilestone.name} / ${pilotProject.nextMilestone.plannedDate}`
                    : "暂无"}
                </li>
              </ul>
            </article>
            <article className="kanban-card">
              <h3>销售下一步动作</h3>
              <ul className="clean" style={{ marginTop: 14 }}>
                {salesDashboard.focus.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <div className="footer-note" style={{ marginTop: 18 }}>
                <strong>当前状态：</strong> 首页、项目档案、角色工作台和客户端确认流已经通过 API 串起来，下一步更适合补持久化和权限。
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
