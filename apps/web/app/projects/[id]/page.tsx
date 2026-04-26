import Link from "next/link";
import type { Route } from "next";
import { getArchive } from "../../../lib/data";

function getConfirmationLabel(status: "pending" | "confirmed" | "rejected") {
  if (status === "confirmed") return "已确认";
  if (status === "rejected") return "已驳回";
  return "待确认";
}

const statusLabels: Record<string, string> = {
  discovery: "待量房",
  design: "方案设计",
  detailing: "施工准备",
  delivery: "施工中",
  completed: "已完工"
};

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const archive = await getArchive(id);
  const currentQuotation = archive.quotations[0];

  const spaceTags = [
    archive.customer.preferredStyle?.[0] ?? "现代简约",
    "三室两厅",
    "开放式厨房"
  ].filter(Boolean);

  const budgetRange = `¥${archive.customer.budgetMin.toLocaleString()} - ¥${archive.customer.budgetMax.toLocaleString()}`;

  const timelineStart = archive.milestones[0]?.plannedDate ?? "—";
  const timelineEnd = archive.milestones[archive.milestones.length - 1]?.plannedDate ?? "—";

  return (
    <div className="atelier-archive">
      {/* Hero Header */}
      <header className="atelier-archive-hero">
        <div className="atelier-archive-hero-main">
          <div className="atelier-archive-badges">
            <span className="atelier-archive-badge-code">{archive.project.code}</span>
            <span className="atelier-archive-badge-status">
              {statusLabels[archive.project.status] ?? archive.project.status}
            </span>
          </div>
          <h1>{archive.project.name}</h1>
          <p>{archive.requirementSheet.summary || archive.lead.summary || "项目档案"}</p>
        </div>
        <div className="atelier-archive-hero-budget">
          <span>预算范围</span>
          <strong>{budgetRange}</strong>
        </div>
      </header>

      {/* Key Metrics */}
      <div className="atelier-archive-metrics">
        <div className="atelier-archive-metric">
          <span className="atelier-archive-metric-label">客户</span>
          <strong className="atelier-archive-metric-value">{archive.customer.name}</strong>
        </div>
        <div className="atelier-archive-metric">
          <span className="atelier-archive-metric-label">城市</span>
          <strong className="atelier-archive-metric-value">{archive.customer.city}</strong>
        </div>
        <div className="atelier-archive-metric">
          <span className="atelier-archive-metric-label">面积</span>
          <strong className="atelier-archive-metric-value">{archive.project.areaSqm} ㎡</strong>
        </div>
        <div className="atelier-archive-metric">
          <span className="atelier-archive-metric-label">时间线</span>
          <strong className="atelier-archive-metric-value">
            {timelineStart.slice(0, 7)} ~ {timelineEnd.slice(0, 7)}
          </strong>
        </div>
      </div>

      {/* Two Column Grid */}
      <div className="atelier-archive-grid">
        {/* Left Column */}
        <div className="atelier-archive-col-main">
          {/* Requirement Sheet */}
          <div className="atelier-archive-card">
            <h3>
              <span>☰</span> 需求清单
            </h3>
            <ul className="atelier-archive-checklist">
              {archive.requirementSheet.goals.map((item) => (
                <li key={item}>
                  <span className="atelier-archive-check">✓</span>
                  <div>
                    <strong>{item}</strong>
                  </div>
                </li>
              ))}
              {archive.requirementSheet.risks.map((item) => (
                <li key={item}>
                  <span className="atelier-archive-check atelier-archive-check-warn">!</span>
                  <div>
                    <strong>{item}</strong>
                    <span className="atelier-archive-check-note">风险项</span>
                  </div>
                </li>
              ))}
              {archive.requirementSheet.pendingQuestions.map((item) => (
                <li key={item}>
                  <span className="atelier-archive-check atelier-archive-check-pending">?</span>
                  <div>
                    <strong>{item}</strong>
                    <span className="atelier-archive-check-note">待确认</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Renderings */}
          <div className="atelier-archive-card">
            <div className="atelier-archive-card-header">
              <h3>
                <span>◈</span> 效果图版本
              </h3>
              <span className="atelier-archive-viewall">查看全部</span>
            </div>
            <div className="atelier-archive-render-grid">
              {archive.renderingVersions.slice(0, 4).map((item) => (
                <div className="atelier-archive-render-item" key={item.id}>
                  <div className="atelier-archive-render-placeholder" />
                  <div className="atelier-archive-render-label">
                    <strong>{item.version}</strong>
                    <span>{item.styleDirection}</span>
                  </div>
                </div>
              ))}
              {archive.renderingVersions.length === 0 && (
                <div className="atelier-archive-render-empty">暂无效果图</div>
              )}
            </div>
          </div>

          {/* Quotations & Changes */}
          <div className="atelier-archive-card">
            <h3>
              <span>◐</span> 报价与变更
            </h3>
            {currentQuotation ? (
              <div className="atelier-archive-quotation">
                <p className="atelier-archive-quotation-summary">{currentQuotation.summary}</p>
                <ul className="atelier-archive-lineitems">
                  {currentQuotation.lineItems.map((item) => (
                    <li key={item.name}>
                      <span>{item.name}</span>
                      <span>¥{item.amount.toLocaleString()}</span>
                      <span className="atelier-archive-lineitem-cat">{item.category}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="atelier-archive-empty">当前暂无报价记录</p>
            )}

            {archive.changeOrders.length > 0 && (
              <div className="atelier-archive-changes">
                <h4>变更记录</h4>
                <ul>
                  {archive.changeOrders.map((item) => (
                    <li key={item.id}>
                      <strong>{item.title}</strong>
                      <span>{item.reason}</span>
                      <span className={`atelier-archive-change-status atelier-archive-change-status-${item.confirmationStatus}`}>
                        {getConfirmationLabel(item.confirmationStatus)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="atelier-archive-col-side">
          {/* Space Tags */}
          <div className="atelier-archive-card">
            <h3>
              <span>◉</span> 空间标签
            </h3>
            <div className="atelier-archive-tags">
              {spaceTags.map((tag) => (
                <span key={tag} className="atelier-archive-tag">
                  {tag}
                </span>
              ))}
              <span className="atelier-archive-tag atelier-archive-tag-primary">
                {archive.customer.householdProfile?.slice(0, 12) ?? "家庭住宅"}
              </span>
            </div>
          </div>

          {/* Design Versions Timeline */}
          <div className="atelier-archive-card">
            <h3>
              <span>◐</span> 方案版本
            </h3>
            <div className="atelier-archive-timeline">
              {archive.designVersions.map((item, index) => (
                <div className="atelier-archive-timeline-item" key={item.id}>
                  <div
                    className={`atelier-archive-timeline-dot ${index === 0 ? "atelier-archive-timeline-dot-active" : ""}`}
                  />
                  <div className="atelier-archive-timeline-content">
                    <strong>{item.version}</strong>
                    <span>{item.summary}</span>
                  </div>
                </div>
              ))}
              {archive.designVersions.length === 0 && (
                <div className="atelier-archive-empty">暂无版本记录</div>
              )}
            </div>
          </div>

          {/* Construction Drawings */}
          <div className="atelier-archive-card">
            <h3>
              <span>▣</span> 施工图版本
            </h3>
            <div className="atelier-archive-timeline">
              {archive.constructionDrawingVersions.map((item, index) => (
                <div className="atelier-archive-timeline-item" key={item.id}>
                  <div
                    className={`atelier-archive-timeline-dot ${index === 0 ? "atelier-archive-timeline-dot-active" : ""}`}
                  />
                  <div className="atelier-archive-timeline-content">
                    <strong>{item.version}</strong>
                    <span>{item.summary}</span>
                  </div>
                </div>
              ))}
              {archive.constructionDrawingVersions.length === 0 && (
                <div className="atelier-archive-empty">暂无施工图</div>
              )}
            </div>
          </div>

          {/* Customer Info */}
          <div className="atelier-archive-card">
            <h3>
              <span>◑</span> 客户信息
            </h3>
            <div className="atelier-archive-contact">
              <div className="atelier-archive-contact-row">
                <span>家庭画像</span>
                <strong>{archive.customer.householdProfile}</strong>
              </div>
              <div className="atelier-archive-contact-row">
                <span>预算区间</span>
                <strong>{budgetRange}</strong>
              </div>
              <div className="atelier-archive-contact-row">
                <span>线索阶段</span>
                <strong>{archive.lead.stage}</strong>
              </div>
              <div className="atelier-archive-contact-row">
                <span>待确认</span>
                <strong>{archive.confirmations.filter((c) => c.status === "pending").length} 项</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Milestones */}
      <section className="atelier-archive-section">
        <h3>里程碑</h3>
        <div className="atelier-archive-task-grid">
          {archive.milestones.slice(0, 3).map((item) => (
            <div className="atelier-archive-task-card" key={item.id}>
              <div className="atelier-archive-task-header">
                <span
                  className={`atelier-archive-task-priority atelier-archive-task-priority-${item.status}`}
                >
                  {item.status}
                </span>
                <span>{item.plannedDate}</span>
              </div>
              <h4>{item.name}</h4>
              <p>负责人：{item.ownerRole}</p>
            </div>
          ))}
          {archive.milestones.length === 0 && (
            <div className="atelier-archive-empty">暂无里程碑</div>
          )}
        </div>
      </section>

      {/* Inspections */}
      {archive.inspections.length > 0 && (
        <section className="atelier-archive-section">
          <h3>巡检问题</h3>
          <div className="atelier-archive-task-grid">
            {archive.inspections.slice(0, 3).map((item) => (
              <div className="atelier-archive-task-card" key={item.id}>
                <div className="atelier-archive-task-header">
                  <span className="atelier-archive-task-priority atelier-archive-task-priority-high">
                    巡检
                  </span>
                </div>
                <h4>{item.summary}</h4>
                <p>
                  {item.issues.map((issue) => (
                    <span key={issue.title}>
                      {issue.severity} · {issue.assigneeRole} ·{" "}
                      {issue.resolved ? "已关闭" : "待处理"}
                    </span>
                  ))}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Confirmations Table */}
      <section className="atelier-archive-section">
        <h3>客户确认留痕</h3>
        <div className="atelier-archive-table-wrap">
          <table className="atelier-archive-table">
            <thead>
              <tr>
                <th>类型</th>
                <th>目标</th>
                <th>状态</th>
                <th>备注</th>
              </tr>
            </thead>
            <tbody>
              {archive.confirmations.map((item) => (
                <tr key={item.id}>
                  <td>{item.type}</td>
                  <td>{item.targetId}</td>
                  <td>
                    <span
                      className={`atelier-archive-confirm-badge atelier-archive-confirm-badge-${item.status}`}
                    >
                      {getConfirmationLabel(item.status)}
                    </span>
                  </td>
                  <td>{item.note ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* FAB */}
      <Link
        href={`/projects/${id}/board` as Route}
        className="atelier-archive-fab"
      >
        <span>▣</span>
        <span>查看看板</span>
      </Link>
    </div>
  );
}
