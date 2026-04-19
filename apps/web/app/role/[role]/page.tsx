import { notFound } from "next/navigation";
import type { UserRole } from "@home-design-ops/shared";
import { getDashboard, getPortfolioOverview } from "../../../lib/data";

const roleLabels: Record<UserRole, string> = {
  sales: "销售顾问",
  designer: "设计师",
  detailer: "深化设计",
  project_manager: "项目经理",
  client: "客户",
  admin: "管理员"
};

export default async function RolePage({ params }: { params: Promise<{ role: UserRole }> }) {
  const { role } = await params;
  if (!roleLabels[role]) {
    notFound();
  }

  const [dashboard, overview] = await Promise.all([getDashboard(role), getPortfolioOverview()]);

  return (
    <>
      <section className="workspace-header">
        <div className="workspace-emoji">🧭</div>
        <div className="workspace-copy">
          <div className="workspace-overline">role view / operational workspace</div>
          <h1>{roleLabels[role]}工作台</h1>
          <p>
            工作台保留角色视角，但底层统一读取 API 返回的数据。这样每个角色都基于同一份项目事实协作，不再出现前端各看各的数据快照。
          </p>
        </div>
      </section>

      <section className="doc-properties">
        <div className="doc-property">
          <span>角色标识</span>
          <strong>{role}</strong>
        </div>
        <div className="doc-property">
          <span>活跃项目</span>
          <strong>{dashboard.metrics.activeProjects}</strong>
        </div>
        <div className="doc-property">
          <span>待确认事项</span>
          <strong>{dashboard.metrics.pendingConfirmations}</strong>
        </div>
      </section>

      <section className="grid stats">
        <article className="stat-card">
          <strong>活跃项目</strong>
          <span>{dashboard.metrics.activeProjects}</span>
        </article>
        <article className="stat-card">
          <strong>待确认事项</strong>
          <span>{dashboard.metrics.pendingConfirmations}</span>
        </article>
        <article className="stat-card">
          <strong>报价视图</strong>
          <span>¥{dashboard.metrics.quotationValue.toLocaleString()}</span>
        </article>
        <article className="stat-card">
          <strong>开放问题</strong>
          <span>{dashboard.metrics.openIssues}</span>
        </article>
      </section>

      <section className="panel" style={{ marginTop: 22 }}>
        <div className="cards-2">
          <article className="kanban-card">
            <div className="section-title">
              <h3>当前关注</h3>
              <span>Role focus</span>
            </div>
            <ul className="clean">
              {dashboard.focus.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
          <article className="ai-card">
            <div className="section-title">
              <h3>建议继续实现的下一层能力</h3>
              <span>Based on current MVP</span>
            </div>
            <ul className="clean">
              <li>客户线索创建与阶段推进</li>
              <li>需求单编辑与问题补录</li>
              <li>报价与变更审批链</li>
              <li>巡检问题关闭与责任人流转</li>
            </ul>
          </article>
        </div>
      </section>

      <section className="panel" style={{ marginTop: 22 }}>
        <div className="section-title">
          <h2>项目运营视图</h2>
          <span>Shared project facts</span>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>项目</th>
              <th>客户</th>
              <th>当前版本</th>
              <th>执行状态</th>
              <th>下一节点</th>
            </tr>
          </thead>
          <tbody>
            {overview.projects.map((project) => (
              <tr key={project.id}>
                <td>{project.name}</td>
                <td>{project.customerName}</td>
                <td>
                  SU {project.currentDesignVersion ?? "-"} / 效果图 {project.currentRenderingVersion ?? "-"} / 施工图{" "}
                  {project.currentConstructionDrawingVersion ?? "-"}
                </td>
                <td>
                  {project.status} · 待确认 {project.pendingConfirmationCount} · 问题 {project.openIssueCount}
                </td>
                <td>{project.nextMilestone ? `${project.nextMilestone.name} / ${project.nextMilestone.plannedDate}` : "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="footer-note">
          <strong>提示：</strong> 这里更适合继续演化成类似 Notion 数据库视图的项目表，支持过滤、排序和责任人视角切换。
        </div>
      </section>
    </>
  );
}
