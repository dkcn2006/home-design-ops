import { submitConfirmationAction } from "../../../lib/actions";
import { getArchive } from "../../../lib/data";

function getConfirmationLabel(status: "pending" | "confirmed" | "rejected") {
  if (status === "confirmed") {
    return "已确认";
  }
  if (status === "rejected") {
    return "已驳回";
  }
  return "待确认";
}

export default async function ClientPortalPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const archive = await getArchive(id);
  const pendingItems = archive.confirmations.filter((item) => item.status === "pending");
  const currentQuotation = archive.quotations[0];

  return (
    <>
      <section className="hero-card">
        <h1>客户端门户</h1>
        <p>
          这里已经不是只读展示页。客户现在可以直接对待确认事项做确认或驳回，动作会写回 API，并同步反映到项目档案和首页指标里。
        </p>
        <div className="badge-row">
          <span className="badge">{archive.customer.name}</span>
          <span className="badge">当前项目：{archive.project.name}</span>
          <span className="badge">待确认 {pendingItems.length} 项</span>
        </div>
      </section>

      <section className="panel">
        <div className="cards-2">
          <article className="kanban-card">
            <div className="section-title">
              <h3>当前有效版本</h3>
              <span>Approved content only</span>
            </div>
            <ul className="clean">
              <li>SU 方案：{archive.designVersions.find((item) => item.id === archive.project.currentDesignVersionId)?.version}</li>
              <li>效果图：{archive.renderingVersions.find((item) => item.id === archive.project.currentRenderingVersionId)?.version}</li>
              <li>施工图：{archive.constructionDrawingVersions.find((item) => item.id === archive.project.currentConstructionDrawingVersionId)?.version}</li>
              <li>报价：{currentQuotation ? `¥${currentQuotation.amount.toLocaleString()}` : "暂无"}</li>
            </ul>
          </article>
          <article className="kanban-card">
            <div className="section-title">
              <h3>项目进度</h3>
              <span>Transparent delivery updates</span>
            </div>
            <ul className="clean">
              {archive.milestones.map((item) => (
                <li key={item.id}>
                  <strong>{item.name}</strong>
                  <div className="muted">计划日期：{item.plannedDate}</div>
                  <div className="muted">状态：{item.status}</div>
                </li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      <section className="panel" style={{ marginTop: 22 }}>
        <div className="section-title">
          <h2>待确认事项</h2>
          <span>Write back to API</span>
        </div>
        <div className="cards-2">
          {archive.confirmations.map((item) => (
            <article className="timeline-card" key={item.id}>
              <div className="section-title">
                <h3>{item.type}</h3>
                <span>{getConfirmationLabel(item.status)}</span>
              </div>
              <p className="muted">目标记录：{item.targetId}</p>
              <p className="muted">当前备注：{item.note ?? "暂无"}</p>

              {item.status === "pending" ? (
                <form action={submitConfirmationAction} className="confirmation-form">
                  <input type="hidden" name="projectId" value={archive.project.id} />
                  <input type="hidden" name="confirmationId" value={item.id} />
                  <label className="field">
                    <span>确认说明</span>
                    <textarea
                      name="note"
                      rows={4}
                      defaultValue={item.note ?? ""}
                      placeholder="补充本次确认或驳回原因"
                    />
                  </label>
                  <div className="button-row">
                    <button type="submit" name="status" value="confirmed" className="primary-button">
                      确认
                    </button>
                    <button type="submit" name="status" value="rejected" className="ghost-button">
                      驳回
                    </button>
                  </div>
                </form>
              ) : (
                <div className="footer-note">
                  <strong>已处理：</strong> 当前记录已经完成处理，如需再次变更可在后续版本中追加新的确认记录。
                </div>
              )}
            </article>
          ))}
        </div>
      </section>

      <section className="panel" style={{ marginTop: 22 }}>
        <div className="section-title">
          <h2>资料清单</h2>
          <span>Attachments</span>
        </div>
        <ul className="clean">
          {archive.attachments.map((item) => (
            <li key={item.id}>
              <strong>{item.filename}</strong>
              <div className="muted">{item.category}</div>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
