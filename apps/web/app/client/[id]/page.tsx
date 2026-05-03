import { getArchive } from "../../../lib/data";
import { ClientConfirmationForm } from "../../../components/client-confirmation-form";

function getConfirmationLabel(status: "pending" | "confirmed" | "rejected") {
  if (status === "confirmed") return "已确认";
  if (status === "rejected") return "已驳回";
  return "待确认";
}

function getConfirmationTypeLabel(type: string) {
  const map: Record<string, string> = {
    design_version: "设计方案确认",
    rendering_version: "效果图确认",
    construction_drawing: "施工图确认",
    quotation: "报价确认",
    change_order: "变更单确认",
    material_selection: "材料选型确认",
    milestone: "里程碑节点确认"
  };
  return map[type] ?? type;
}

export default async function ClientPortalPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const archive = await getArchive(id);
  const pendingItems = archive.confirmations.filter((item) => item.status === "pending");
  const resolvedItems = archive.confirmations.filter((item) => item.status !== "pending");
  const currentQuotation = archive.quotations[0];

  return (
    <div className="client-portal">
      {/* Header */}
      <header className="client-portal-header">
        <div className="client-portal-header-top">
          <span className="client-portal-overline">客户确认中心</span>
          <h1>{archive.project.name}</h1>
          <p>
            {archive.customer.name} · 待确认 {pendingItems.length} 项
          </p>
        </div>
        <div className="client-portal-header-meta">
          <div className="client-portal-meta-item">
            <span>当前方案</span>
            <strong>{archive.designVersions.find((v) => v.id === archive.project.currentDesignVersionId)?.version ?? "-"}</strong>
          </div>
          <div className="client-portal-meta-item">
            <span>效果图</span>
            <strong>{archive.renderingVersions.find((v) => v.id === archive.project.currentRenderingVersionId)?.version ?? "-"}</strong>
          </div>
          <div className="client-portal-meta-item">
            <span>报价</span>
            <strong>{currentQuotation ? `¥${currentQuotation.amount.toLocaleString()}` : "待定"}</strong>
          </div>
          <div className="client-portal-meta-item">
            <span>项目状态</span>
            <strong>{archive.project.status}</strong>
          </div>
        </div>
      </header>

      {/* Pending Confirmations — Primary Focus */}
      <section className="client-portal-section">
        <div className="client-portal-section-header">
          <h2>
            待确认事项
            {pendingItems.length > 0 && (
              <span className="client-portal-badge client-portal-badge-pending">{pendingItems.length}</span>
            )}
          </h2>
          <span>请审阅以下内容并提交确认或反馈</span>
        </div>

        {pendingItems.length === 0 ? (
          <div className="client-portal-empty">
            <p>当前没有待确认事项</p>
            <span>所有确认均已完成，如有新的版本或变更，团队会在此同步</span>
          </div>
        ) : (
          <div className="client-portal-confirmations">
            {pendingItems.map((item, index) => (
              <article className="client-confirmation-card client-confirmation-card-pending" key={item.id}>
                <div className="client-confirmation-card-header">
                  <div className="client-confirmation-number">{index + 1}</div>
                  <div className="client-confirmation-title">
                    <h3>{getConfirmationTypeLabel(item.type)}</h3>
                    <span className="client-confirmation-target">{item.targetId}</span>
                  </div>
                  <span className="client-portal-badge client-portal-badge-pending">待确认</span>
                </div>

                {item.note && (
                  <div className="client-confirmation-note">
                    <p>{item.note}</p>
                  </div>
                )}

                <ClientConfirmationForm
                  projectId={archive.project.id}
                  confirmationId={item.id}
                  defaultNote={item.note ?? ""}
                />
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Resolved Confirmations — Collapsed */}
      {resolvedItems.length > 0 && (
        <section className="client-portal-section client-portal-section-resolved">
          <details className="client-portal-details">
            <summary>
              <h2>历史确认记录</h2>
              <span>{resolvedItems.length} 项已处理</span>
            </summary>
            <div className="client-portal-confirmations">
              {resolvedItems.map((item) => (
                <article
                  className={`client-confirmation-card client-confirmation-card-${item.status}`}
                  key={item.id}
                >
                  <div className="client-confirmation-card-header">
                    <div className="client-confirmation-title">
                      <h3>{getConfirmationTypeLabel(item.type)}</h3>
                      <span className="client-confirmation-target">{item.targetId}</span>
                    </div>
                    <span className={`client-portal-badge client-portal-badge-${item.status}`}>
                      {getConfirmationLabel(item.status)}
                    </span>
                  </div>
                  {item.note && (
                    <div className="client-confirmation-note">
                      <p>{item.note}</p>
                    </div>
                  )}
                  {item.updatedAt && item.status !== "pending" && (
                    <div className="client-confirmation-resolved">
                      处理时间：{item.updatedAt.slice(0, 10)}
                    </div>
                  )}
                </article>
              ))}
            </div>
          </details>
        </section>
      )}

      {/* Project Timeline */}
      {archive.milestones.length > 0 && (
        <section className="client-portal-section">
          <div className="client-portal-section-header">
            <h2>项目进度</h2>
            <span>近期里程碑</span>
          </div>
          <div className="client-portal-timeline">
            {archive.milestones.map((milestone, index) => (
              <div className="client-portal-timeline-item" key={milestone.id}>
                <div className={`client-portal-timeline-dot ${milestone.status === "done" ? "completed" : ""}`} />
                <div className="client-portal-timeline-content">
                  <div className="client-portal-timeline-main">
                    <strong>{milestone.name}</strong>
                    <span>{milestone.plannedDate}</span>
                  </div>
                  <span className={`client-portal-timeline-status client-portal-timeline-status-${milestone.status}`}>
                    {milestone.status === "done" ? "已完成" : milestone.status === "in_progress" ? "进行中" : milestone.status === "blocked" ? "已阻塞" : "待开始"}
                  </span>
                </div>
                {index < archive.milestones.length - 1 && (
                  <div className="client-portal-timeline-line" />
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Attachments */}
      {archive.attachments.length > 0 && (
        <section className="client-portal-section">
          <div className="client-portal-section-header">
            <h2>资料清单</h2>
            <span>{archive.attachments.length} 个文件</span>
          </div>
          <div className="client-portal-attachments">
            {archive.attachments.map((item) => (
              <div className="client-portal-attachment" key={item.id}>
                <div className="client-portal-attachment-icon">📎</div>
                <div className="client-portal-attachment-info">
                  <strong>{item.filename}</strong>
                  <span>{item.category}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
