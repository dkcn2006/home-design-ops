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
      <section className="workspace-header client-workspace-header">
        <div className="workspace-emoji">🤝</div>
        <div className="workspace-copy">
          <div className="workspace-overline">client portal / shared project page</div>
          <h1>客户确认页面</h1>
          <p>
            这里用于同步当前项目的有效版本、近期进度和待确认事项。客户可以直接提交确认或反馈，信息会同步回项目档案，减少口头确认和聊天记录遗漏。
          </p>
        </div>
      </section>

      <section className="doc-properties client-doc-properties">
        <div className="doc-property">
          <span>客户</span>
          <strong>{archive.customer.name}</strong>
        </div>
        <div className="doc-property">
          <span>项目</span>
          <strong>{archive.project.name}</strong>
        </div>
        <div className="doc-property">
          <span>待确认事项</span>
          <strong>{pendingItems.length} 项</strong>
        </div>
      </section>

      <section className="panel">
        <div className="cards-2">
          <article className="kanban-card">
            <div className="section-title">
              <h3>当前有效版本</h3>
              <span>当前可执行内容</span>
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
              <span>近期安排</span>
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
          <span>请直接提交意见</span>
        </div>
        <div className="cards-2">
          {archive.confirmations.map((item) => (
            <article className={`timeline-card client-confirmation-card${item.status === "pending" ? " is-pending" : ""}`} key={item.id}>
              <div className="section-title">
                <h3>{item.type}</h3>
                <span className={`status-chip status-${item.status}`}>{getConfirmationLabel(item.status)}</span>
              </div>
              <p className="muted">对应记录：{item.targetId}</p>
              <p className="muted">当前说明：{item.note ?? "暂无"}</p>

              {item.status === "pending" ? (
                <form action={submitConfirmationAction} className="confirmation-form">
                  <input type="hidden" name="projectId" value={archive.project.id} />
                  <input type="hidden" name="confirmationId" value={item.id} />
                  <label className="field">
                    <span>补充说明</span>
                    <textarea
                      name="note"
                      rows={4}
                      defaultValue={item.note ?? ""}
                      placeholder="如果有需要，可补充本次确认或反馈说明"
                    />
                  </label>
                  <div className="button-row">
                    <button type="submit" name="status" value="confirmed" className="primary-button">
                      确认通过
                    </button>
                    <button type="submit" name="status" value="rejected" className="ghost-button">
                      提交反馈
                    </button>
                  </div>
                </form>
              ) : (
                <div className="footer-note">
                  <strong>已处理：</strong> 当前事项已经完成处理，如需再次调整，可在后续版本中追加新的确认记录。
                </div>
              )}
            </article>
          ))}
        </div>
        <div className="footer-note">
          <strong>说明：</strong> 这里只展示需要客户关注的核心信息，更多内部执行细节由项目团队在内部工作区处理。
        </div>
      </section>

      <section className="panel" style={{ marginTop: 22 }}>
        <div className="section-title">
          <h2>资料清单</h2>
          <span>当前项目资料</span>
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
