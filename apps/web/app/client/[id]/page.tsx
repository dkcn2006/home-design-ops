import { getArchive } from "../../../lib/data";

export default async function ClientPortalPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const archive = getArchive(id);

  return (
    <>
      <section className="hero-card">
        <h1>客户端门户</h1>
        <p>
          客户可以查看当前有效方案、报价、变更和施工进度，并在关键节点完成确认留痕。移动端将优先保证这部分可用。
        </p>
        <div className="badge-row">
          <span className="badge">{archive.customer.name}</span>
          <span className="badge">当前项目：{archive.project.name}</span>
          <span className="badge">待确认 {archive.confirmations.filter((item) => item.status === "pending").length} 项</span>
        </div>
      </section>

      <section className="panel">
        <div className="cards-2">
          <article className="kanban-card">
            <div className="section-title">
              <h3>当前有效版本</h3>
              <span>Only approved / current content</span>
            </div>
            <ul className="clean">
              <li>SU 方案：{archive.designVersions.find((item) => item.id === archive.project.currentDesignVersionId)?.version}</li>
              <li>效果图：{archive.renderingVersions.find((item) => item.id === archive.project.currentRenderingVersionId)?.version}</li>
              <li>施工图：{archive.constructionDrawingVersions.find((item) => item.id === archive.project.currentConstructionDrawingVersionId)?.version}</li>
              <li>报价：¥{archive.quotations[0].amount.toLocaleString()}</li>
            </ul>
          </article>
          <article className="kanban-card">
            <div className="section-title">
              <h3>待确认事项</h3>
              <span>Confirmation records</span>
            </div>
            <ul className="clean">
              {archive.confirmations.map((item) => (
                <li key={item.id}>
                  <strong>{item.type}</strong>
                  <div className="muted">状态：{item.status}</div>
                  {item.note ? <div className="muted">{item.note}</div> : null}
                </li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      <section className="panel" style={{ marginTop: 22 }}>
        <div className="section-title">
          <h2>项目进度与资料</h2>
          <span>Transparent delivery updates</span>
        </div>
        <div className="cards-2">
          <article className="timeline-card">
            <ul className="clean">
              {archive.milestones.map((item) => (
                <li key={item.id}>
                  <strong>{item.name}</strong>
                  <div className="muted">计划日期：{item.plannedDate} · 状态：{item.status}</div>
                </li>
              ))}
            </ul>
          </article>
          <article className="timeline-card">
            <ul className="clean">
              {archive.attachments.map((item) => (
                <li key={item.id}>
                  <strong>{item.filename}</strong>
                  <div className="muted">{item.category}</div>
                </li>
              ))}
            </ul>
          </article>
        </div>
      </section>
    </>
  );
}

