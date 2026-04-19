import { notFound } from "next/navigation";
import { getDashboard } from "../../../lib/data";
import type { UserRole } from "@home-design-ops/shared";

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

  const dashboard = getDashboard(role);

  return (
    <>
      <section className="hero-card">
        <h1>{roleLabels[role]}工作台</h1>
        <p>每个角色只看到自己的关键指标、待办事项和项目动作，但底层共用同一份项目档案与版本记录。</p>
        <div className="badge-row">
          <span className="badge">Role: {role}</span>
          <span className="badge">Projects: {dashboard.metrics.activeProjects}</span>
          <span className="badge">Pending Confirmations: {dashboard.metrics.pendingConfirmations}</span>
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
          <strong>报价额 / 预算视图</strong>
          <span>¥{dashboard.metrics.quotationValue.toLocaleString()}</span>
        </article>
        <article className="stat-card">
          <strong>开放问题</strong>
          <span>{dashboard.metrics.openIssues}</span>
        </article>
      </section>

      <section className="panel" style={{ marginTop: 22 }}>
        <div className="two-col">
          <article className="kanban-card">
            <div className="section-title">
              <h3>当前关注</h3>
              <span>Role specific focus</span>
            </div>
            <ul className="clean">
              {dashboard.focus.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
          <article className="ai-card">
            <div className="section-title">
              <h3>AI 场景入口</h3>
              <span>嵌入式助手</span>
            </div>
            <ul className="clean">
              <li>需求整理：把纪要整理为结构化需求单</li>
              <li>方案建议：给出 SU 布局和收纳方向</li>
              <li>报价说明：把增减项转换成客户可读文案</li>
              <li>施工校核：生成交底前提醒清单</li>
            </ul>
          </article>
        </div>
      </section>

      <section className="panel" style={{ marginTop: 22 }}>
        <div className="section-title">
          <h2>项目清单</h2>
          <span>Shared project data</span>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>项目</th>
              <th>阶段</th>
              <th>下一动作</th>
            </tr>
          </thead>
          <tbody>
            {dashboard.projects.map((project) => (
              <tr key={project.id}>
                <td>{project.name}</td>
                <td>{project.status}</td>
                <td>{project.nextAction}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  );
}

