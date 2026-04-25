import Link from "next/link";
import type { Route } from "next";
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

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const archive = await getArchive(id);
  const currentQuotation = archive.quotations[0];

  return (
    <>
      <section className="workspace-header">
        <div className="workspace-emoji">📁</div>
        <div className="workspace-copy">
          <div className="workspace-overline">project archive / single source of truth</div>
          <h1>{archive.project.name}</h1>
          <p>
            这个页面把客户、需求、设计版本、报价、变更、交付和确认记录收进同一份项目文档，方便后续从 demo 数据迁移到真实数据库时保持业务结构稳定。
          </p>
        </div>
      </section>

      <section className="doc-properties">
        <div className="doc-property">
          <span>项目编号</span>
          <strong>{archive.project.code}</strong>
        </div>
        <div className="doc-property">
          <span>状态</span>
          <strong>{archive.project.status}</strong>
        </div>
        <div className="doc-property">
          <span>客户</span>
          <strong>{archive.customer.name}</strong>
        </div>
        <div className="doc-property">
          <span>面积</span>
          <strong>{archive.project.areaSqm} ㎡</strong>
        </div>
        <div className="doc-property">
          <span>线索阶段</span>
          <strong>{archive.lead.stage}</strong>
        </div>
        <div className="doc-property">
          <span>待确认</span>
          <strong>{archive.confirmations.filter((item) => item.status === "pending").length} 项</strong>
        </div>
      </section>

      <section style={{ marginBottom: 18 }}>
        <Link href={`/projects/${id}/board` as Route} className="ghost-button">
          查看项目看板 →
        </Link>
      </section>

      <section className="panel">
        <div className="section-title">
          <h2>1. 客户与需求</h2>
          <span>Lead + requirement sheet</span>
        </div>
        <div className="cards-2">
          <article className="kanban-card">
            <div className="doc-block-title">客户属性</div>
            <ul className="clean">
              <li>客户：{archive.customer.name}</li>
              <li>城市：{archive.customer.city}</li>
              <li>家庭画像：{archive.customer.householdProfile}</li>
              <li>预算区间：¥{archive.customer.budgetMin.toLocaleString()} - ¥{archive.customer.budgetMax.toLocaleString()}</li>
              <li>线索阶段：{archive.lead.stage}</li>
              <li>线索摘要：{archive.lead.summary}</li>
            </ul>
          </article>
          <article className="ai-card">
            <div className="doc-block-title">需求摘要</div>
            <p className="muted">{archive.requirementSheet.summary}</p>
            <ul className="clean" style={{ marginTop: 14 }}>
              {archive.requirementSheet.goals.map((item) => (
                <li key={item}>目标：{item}</li>
              ))}
              {archive.requirementSheet.risks.map((item) => (
                <li key={item}>风险：{item}</li>
              ))}
              {archive.requirementSheet.pendingQuestions.map((item) => (
                <li key={item}>待确认：{item}</li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      <section className="panel" style={{ marginTop: 22 }}>
        <div className="section-title">
          <h2>2. 版本与设计资产</h2>
          <span>SU / rendering / drawings</span>
        </div>
        <div className="cards-3">
          <article className="artifact-card">
            <div className="pill">SU 模型图</div>
            <div className="doc-block-title" style={{ marginTop: 12 }}>当前版本序列</div>
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
            <div className="doc-block-title" style={{ marginTop: 12 }}>风格输出</div>
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
            <div className="doc-block-title" style={{ marginTop: 12 }}>交底依据</div>
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
        <div className="section-title">
          <h2>3. 报价与变更</h2>
          <span>Version-linked commercial records</span>
        </div>
        <div className="cards-2">
          <article className="timeline-card">
            <div className="doc-block-title">当前有效报价</div>
            <h3 style={{ marginTop: 8 }}>当前报价</h3>
            {currentQuotation ? (
              <>
                <p className="muted">{currentQuotation.summary}</p>
                <ul className="clean" style={{ marginTop: 14 }}>
                  {currentQuotation.lineItems.map((item) => (
                    <li key={item.name}>
                      {item.name} · ¥{item.amount.toLocaleString()} · {item.category}
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <p className="muted">当前暂无报价记录。</p>
            )}
          </article>
          <article className="timeline-card">
            <div className="doc-block-title">变更留痕</div>
            <h3 style={{ marginTop: 8 }}>变更记录</h3>
            <ul className="clean" style={{ marginTop: 14 }}>
              {archive.changeOrders.map((item) => (
                <li key={item.id}>
                  <strong>{item.title}</strong>
                  <div className="muted">{item.reason}</div>
                  <div className="muted">金额变化：¥{item.amountDelta.toLocaleString()}</div>
                  <div className="muted">状态：{getConfirmationLabel(item.confirmationStatus)}</div>
                </li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      <section className="panel" style={{ marginTop: 22 }}>
        <div className="section-title">
          <h2>4. 交付执行</h2>
          <span>Milestones + inspections</span>
        </div>
        <div className="cards-2">
          <article className="timeline-card">
            <div className="doc-block-title">里程碑数据库</div>
            <ul className="clean">
              {archive.milestones.map((item) => (
                <li key={item.id}>
                  <strong>{item.name}</strong>
                  <div className="muted">计划时间：{item.plannedDate}</div>
                  <div className="muted">负责人：{item.ownerRole}</div>
                  <div className="muted">状态：{item.status}</div>
                </li>
              ))}
            </ul>
          </article>
          <article className="timeline-card">
            <div className="doc-block-title">巡检问题</div>
            <ul className="clean">
              {archive.inspections.map((item) => (
                <li key={item.id}>
                  <strong>{item.summary}</strong>
                  {item.issues.map((issue) => (
                    <div className="muted" key={issue.title}>
                      {issue.severity} · {issue.assigneeRole} · {issue.resolved ? "已关闭" : "待处理"} · {issue.title}
                    </div>
                  ))}
                </li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      <section className="panel" style={{ marginTop: 22 }}>
        <div className="section-title">
          <h2>5. 客户确认留痕</h2>
          <span>Client-facing confirmation records</span>
        </div>
        <table className="table">
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
                <td>{getConfirmationLabel(item.status)}</td>
                <td>{item.note ?? "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="footer-note">
          <strong>说明：</strong> 当前确认记录已经贯通到客户端门户，可直接用于演示“发起确认、客户反馈、项目同步”的闭环。
        </div>
      </section>
    </>
  );
}
