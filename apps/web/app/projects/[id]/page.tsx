import { getArchive } from "../../../lib/data";

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const archive = getArchive(id);

  return (
    <>
      <section className="hero-card">
        <h1>{archive.project.name}</h1>
        <p>
          项目档案中心把需求、方案版本、效果图、施工图、报价、变更、巡检和客户确认统一收口。当前演示的是 MVP 里的单项目总览。
        </p>
        <div className="badge-row">
          <span className="badge">项目编号 {archive.project.code}</span>
          <span className="badge">状态 {archive.project.status}</span>
          <span className="badge">客户 {archive.customer.name}</span>
          <span className="badge">面积 {archive.project.areaSqm} ㎡</span>
        </div>
      </section>

      <section className="panel">
        <div className="two-col">
          <article className="kanban-card">
            <div className="section-title">
              <h3>需求与风险</h3>
              <span>Requirement Sheet</span>
            </div>
            <p className="muted">{archive.requirementSheet.summary}</p>
            <ul className="clean">
              {archive.requirementSheet.goals.map((item) => (
                <li key={item}>目标：{item}</li>
              ))}
              {archive.requirementSheet.risks.map((item) => (
                <li key={item}>风险：{item}</li>
              ))}
            </ul>
          </article>
          <article className="ai-card">
            <div className="section-title">
              <h3>AI 助手入口</h3>
              <span>Scene native assistants</span>
            </div>
            <ul className="clean">
              <li>需求整理：补全待确认问题</li>
              <li>SU 布局建议：校验动线和收纳</li>
              <li>效果图建议：输出方向型渲染说明</li>
              <li>施工图校核：提醒设备点位和交底清单</li>
            </ul>
          </article>
        </div>
      </section>

      <section className="panel" style={{ marginTop: 22 }}>
        <div className="section-title">
          <h2>版本中心</h2>
          <span>Current effective version control</span>
        </div>
        <div className="cards-3">
          <article className="artifact-card">
            <div className="pill">SU 模型图</div>
            <ul className="clean" style={{ marginTop: 14 }}>
              {archive.designVersions.map((item) => (
                <li key={item.id}>
                  <strong>{item.version}</strong>
                  <div className="muted">{item.summary}</div>
                </li>
              ))}
            </ul>
          </article>
          <article className="artifact-card">
            <div className="pill">效果图</div>
            <ul className="clean" style={{ marginTop: 14 }}>
              {archive.renderingVersions.map((item) => (
                <li key={item.id}>
                  <strong>{item.version}</strong>
                  <div className="muted">{item.styleDirection}</div>
                </li>
              ))}
            </ul>
          </article>
          <article className="artifact-card">
            <div className="pill">施工图</div>
            <ul className="clean" style={{ marginTop: 14 }}>
              {archive.constructionDrawingVersions.map((item) => (
                <li key={item.id}>
                  <strong>{item.version}</strong>
                  <div className="muted">{item.summary}</div>
                </li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      <section className="panel" style={{ marginTop: 22 }}>
        <div className="cards-2">
          <article className="timeline-card">
            <div className="section-title">
              <h3>报价与变更</h3>
              <span>Linked to versions</span>
            </div>
            <table className="table">
              <thead>
                <tr>
                  <th>类型</th>
                  <th>说明</th>
                  <th>状态</th>
                </tr>
              </thead>
              <tbody>
                {archive.quotations.map((item) => (
                  <tr key={item.id}>
                    <td>报价</td>
                    <td>{item.summary}</td>
                    <td>{item.status}</td>
                  </tr>
                ))}
                {archive.changeOrders.map((item) => (
                  <tr key={item.id}>
                    <td>变更</td>
                    <td>{item.title} / {item.reason}</td>
                    <td>{item.confirmationStatus}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </article>
          <article className="timeline-card">
            <div className="section-title">
              <h3>节点与巡检</h3>
              <span>Delivery workflow</span>
            </div>
            <ul className="clean">
              {archive.milestones.map((item) => (
                <li key={item.id}>
                  <strong>{item.name}</strong>
                  <div className="muted">计划时间：{item.plannedDate} · 状态：{item.status}</div>
                </li>
              ))}
              {archive.inspections.map((item) => (
                <li key={item.id}>
                  <strong>巡检摘要</strong>
                  <div className="muted">{item.summary}</div>
                </li>
              ))}
            </ul>
          </article>
        </div>
      </section>
    </>
  );
}

