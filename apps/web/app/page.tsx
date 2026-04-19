import Link from "next/link";
import { getArchive, getDashboard } from "../lib/data";

export default function HomePage() {
  const salesDashboard = getDashboard("sales");
  const archive = getArchive("proj-1");

  return (
    <>
      <section className="hero-card">
        <h1>从项目档案出发，打通销售、设计、深化、施工交付与客户确认</h1>
        <p>
          这是一版面向小型家装团队内部试点的 MVP：优先把关键资料、版本、报价、变更和确认记录统一起来，再把 AI 嵌入需求整理、SU 方案辅助、效果图分级输出和施工图校核。
        </p>
        <div className="badge-row">
          <span className="badge">Next.js Web</span>
          <span className="badge">NestJS API</span>
          <span className="badge">Project Archive Center</span>
          <span className="badge">AI In Workflow</span>
        </div>
      </section>

      <section className="grid stats">
        <article className="stat-card">
          <strong>活跃项目</strong>
          <span>{salesDashboard.metrics.activeProjects}</span>
        </article>
        <article className="stat-card">
          <strong>待客户确认</strong>
          <span>{salesDashboard.metrics.pendingConfirmations}</span>
        </article>
        <article className="stat-card">
          <strong>报价金额</strong>
          <span>¥{salesDashboard.metrics.quotationValue.toLocaleString()}</span>
        </article>
        <article className="stat-card">
          <strong>开放问题</strong>
          <span>{salesDashboard.metrics.openIssues}</span>
        </article>
      </section>

      <section className="panel" style={{ marginTop: 22 }}>
        <div className="section-title">
          <h2>MVP 主线</h2>
          <span>销售 → 设计 → 深化 → 交付 → 客户确认</span>
        </div>
        <div className="cards-3">
          <article className="kanban-card">
            <div className="pill">客户与线索</div>
            <p className="muted">结构化录入客户需求、预算、家庭结构和沟通纪要。</p>
            <ul className="clean">
              <li>线索阶段流转</li>
              <li>需求摘要与痛点整理</li>
              <li>客户画像沉淀</li>
            </ul>
          </article>
          <article className="kanban-card">
            <div className="pill">设计协同</div>
            <p className="muted">统一管理 SU 模型图、效果图和施工图版本。</p>
            <ul className="clean">
              <li>版本号与修改说明</li>
              <li>当前有效版本指针</li>
              <li>AI 方案与校核助手</li>
            </ul>
          </article>
          <article className="kanban-card">
            <div className="pill">交付与确认</div>
            <p className="muted">报价、变更、巡检和客户确认记录全部挂到同一项目档案。</p>
            <ul className="clean">
              <li>报价与版本绑定</li>
              <li>交底和巡检记录</li>
              <li>客户端确认留痕</li>
            </ul>
          </article>
        </div>
      </section>

      <section className="panel" style={{ marginTop: 22 }}>
        <div className="section-title">
          <h2>试点项目</h2>
          <span>{archive.project.name}</span>
        </div>
        <div className="two-col">
          <div className="kanban-card">
            <h3>当前项目状态</h3>
            <ul className="clean">
              <li>项目阶段：{archive.project.status}</li>
              <li>当前 SU 方案版本：{archive.designVersions.find((item) => item.id === archive.project.currentDesignVersionId)?.version}</li>
              <li>当前效果图版本：{archive.renderingVersions.find((item) => item.id === archive.project.currentRenderingVersionId)?.version}</li>
              <li>当前施工图版本：{archive.constructionDrawingVersions.find((item) => item.id === archive.project.currentConstructionDrawingVersionId)?.version}</li>
            </ul>
          </div>
          <div className="kanban-card">
            <h3>快速入口</h3>
            <ul className="clean">
              <li><Link href="/projects/proj-1">查看项目档案</Link></li>
              <li><Link href="/role/designer">查看设计工作台</Link></li>
              <li><Link href="/client/proj-1">查看客户端门户</Link></li>
            </ul>
          </div>
        </div>
        <div className="footer-note">
          <strong>实现说明：</strong> 当前前端直接使用共享种子数据渲染，和 API 的资源结构保持一致，方便后续切换到真实 PostgreSQL 数据源和对象存储。
        </div>
      </section>
    </>
  );
}

