import type { LeadSource, LeadStage } from "@home-design-ops/shared";
import { createLeadIntakeAction, updateLeadStageAction } from "../../../lib/actions";
import { getLeadPipeline, getLeadSummary } from "../../../lib/data";

const stageOrder: LeadStage[] = [
  "new",
  "contacted",
  "measured",
  "proposal",
  "quoted",
  "negotiating",
  "won",
  "lost"
];

const stageLabels: Record<LeadStage, string> = {
  new: "新线索",
  contacted: "已联系",
  measured: "已量房",
  proposal: "方案中",
  quoted: "已报价",
  negotiating: "谈判中",
  won: "已赢单",
  lost: "已流失"
};

const sourceLabels: Record<LeadSource, string> = {
  walk_in: "自然到店",
  referral: "老客户介绍",
  xiaohongshu: "小红书",
  douyin: "抖音",
  local_ads: "本地广告",
  partner: "合作渠道",
  other: "其他来源"
};

const intentLabels = {
  high: "高意向",
  medium: "中意向",
  low: "低意向"
} as const;

export default async function SalesLeadsPage() {
  const [pipeline, summary] = await Promise.all([getLeadPipeline(), getLeadSummary()]);
  const today = "2026-04-19";
  const staleBefore = "2026-04-09";
  const todayFollowUps = pipeline.filter((item) => item.lead.nextFollowUpAt && item.lead.nextFollowUpAt <= today && item.lead.stage !== "won" && item.lead.stage !== "lost");
  const highIntentLeads = pipeline.filter((item) => item.lead.intentLevel === "high" && item.lead.stage !== "won" && item.lead.stage !== "lost");
  const staleLeads = pipeline.filter((item) => item.lead.lastContactedAt && item.lead.lastContactedAt < staleBefore && item.lead.stage !== "won" && item.lead.stage !== "lost");

  return (
    <>
      <section className="workspace-header">
        <div className="workspace-emoji">🗂️</div>
        <div className="workspace-copy">
          <div className="workspace-overline">sales / lead database</div>
          <h1>客户 / 线索录入</h1>
          <p>
            这一页把销售链路整理成一个工作区数据库：先录入客户与线索，再围绕阶段推进做协作，避免新客户信息散落在微信、表格和口头同步里。
          </p>
        </div>
      </section>

      <section className="doc-properties">
        <div className="doc-property">
          <span>视图类型</span>
          <strong>线索数据库</strong>
        </div>
        <div className="doc-property">
          <span>总线索数</span>
          <strong>{summary.total}</strong>
        </div>
        <div className="doc-property">
          <span>基础转化率</span>
          <strong>{summary.conversionRate}%</strong>
        </div>
        <div className="doc-property">
          <span>今日需跟进</span>
          <strong>{summary.todayFollowUpCount + summary.overdueFollowUpCount}</strong>
        </div>
        <div className="doc-property">
          <span>高意向线索</span>
          <strong>{summary.highIntentCount}</strong>
        </div>
      </section>

      <section className="panel">
        <div className="section-title">
          <h2>新建客户与线索</h2>
          <span>Sales intake form</span>
        </div>
        <form action={createLeadIntakeAction} className="intake-form">
          <div className="form-grid">
            <label className="field">
              <span>客户姓名</span>
              <input name="customerName" required placeholder="例如：王先生" />
            </label>
            <label className="field">
              <span>联系电话</span>
              <input name="phone" required placeholder="13800000000" />
            </label>
            <label className="field">
              <span>邮箱</span>
              <input name="email" type="email" placeholder="可选" />
            </label>
            <label className="field">
              <span>城市</span>
              <input name="city" required placeholder="上海" />
            </label>
            <label className="field">
              <span>预算下限</span>
              <input name="budgetMin" type="number" min="0" required placeholder="200000" />
            </label>
            <label className="field">
              <span>预算上限</span>
              <input name="budgetMax" type="number" min="0" required placeholder="300000" />
            </label>
            <label className="field">
              <span>线索来源</span>
              <select name="source" defaultValue="referral">
                {Object.entries(sourceLabels).map(([source, label]) => (
                  <option key={source} value={source}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              <span>当前阶段</span>
              <select name="stage" defaultValue="new">
                {stageOrder.map((stage) => (
                  <option key={stage} value={stage}>
                    {stageLabels[stage]}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              <span>预计签约时间</span>
              <input name="expectedSignDate" type="date" />
            </label>
            <label className="field field-span-2">
              <span>家庭画像</span>
              <input name="householdProfile" required placeholder="例如：三口之家，重视餐厨互动和儿童收纳" />
            </label>
            <label className="field field-span-2">
              <span>风格偏好</span>
              <input name="preferredStyle" placeholder="用逗号分隔，例如：现代木质, 温暖简约" />
            </label>
            <label className="field field-span-2">
              <span>线索摘要</span>
              <textarea name="summary" rows={4} required placeholder="记录这次沟通的主要目标、房屋情况和客户关注点" />
            </label>
            <label className="field field-span-2">
              <span>核心痛点</span>
              <textarea name="painPoints" rows={4} placeholder="按逗号或换行分隔，例如：厨房收纳不足，担心施工返工" />
            </label>
            <label className="field field-span-2">
              <span>客户备注</span>
              <textarea name="customerNotes" rows={4} placeholder="补充沟通细节、禁忌项、决策人信息等" />
            </label>
          </div>
          <div className="button-row">
            <button type="submit" className="primary-button">
              创建客户与线索
            </button>
          </div>
        </form>
      </section>

      <section className="panel" style={{ marginTop: 22 }}>
        <div className="section-title">
          <h2>跟进优先级</h2>
          <span>今日跟进 / 高意向 / 长期未跟进</span>
        </div>
        <div className="lead-stage-grid">
          <article className="stage-column">
            <div className="section-title">
              <h3>今日需跟进</h3>
              <span>{todayFollowUps.length}</span>
            </div>
            <div className="stage-stack">
              {todayFollowUps.slice(0, 4).map((item) => (
                <div className="lead-card" key={item.lead.id}>
                  <div className="lead-card-header">
                    <strong>{item.customer.name}</strong>
                    <span className="badge">{item.lead.nextFollowUpAt}</span>
                  </div>
                  <div className="muted">{item.lead.lastContactSummary}</div>
                </div>
              ))}
              {!todayFollowUps.length ? <div className="empty-state">暂无今日或逾期跟进</div> : null}
            </div>
          </article>
          <article className="stage-column">
            <div className="section-title">
              <h3>高意向机会</h3>
              <span>{highIntentLeads.length}</span>
            </div>
            <div className="stage-stack">
              {highIntentLeads.slice(0, 4).map((item) => (
                <div className="lead-card" key={item.lead.id}>
                  <div className="lead-card-header">
                    <strong>{item.customer.name}</strong>
                    <span className="badge">{stageLabels[item.lead.stage]}</span>
                  </div>
                  <div className="muted">{item.lead.budgetRange} / {sourceLabels[item.lead.source]}</div>
                  <div className="muted">{item.lead.requirementSummary}</div>
                </div>
              ))}
              {!highIntentLeads.length ? <div className="empty-state">暂无高意向待推进线索</div> : null}
            </div>
          </article>
          <article className="stage-column">
            <div className="section-title">
              <h3>长期未跟进</h3>
              <span>{staleLeads.length}</span>
            </div>
            <div className="stage-stack">
              {staleLeads.slice(0, 4).map((item) => (
                <div className="lead-card" key={item.lead.id}>
                  <div className="lead-card-header">
                    <strong>{item.customer.name}</strong>
                    <span className="badge">{item.lead.lastContactedAt}</span>
                  </div>
                  <div className="muted">{item.lead.lastContactSummary}</div>
                </div>
              ))}
              {!staleLeads.length ? <div className="empty-state">暂无长期未跟进线索</div> : null}
            </div>
          </article>
        </div>
      </section>

      <section className="panel" style={{ marginTop: 22 }}>
        <div className="section-title">
          <h2>线索看板</h2>
          <span>{pipeline.length} 条线索</span>
        </div>
        <div className="lead-stage-grid">
          {stageOrder.map((stage) => {
            const items = pipeline.filter((item) => item.lead.stage === stage);

            return (
              <article className="stage-column" key={stage}>
                <div className="section-title">
                  <h3>{stageLabels[stage]}</h3>
                  <span>{items.length}</span>
                </div>
                <div className="stage-stack">
                  {items.length ? (
                    items.map((item) => (
                      <div className="lead-card" key={item.lead.id}>
                        <div className="lead-card-header">
                          <strong>{item.customer.name}</strong>
                          <span className="badge">{stageLabels[item.lead.stage]}</span>
                        </div>
                        <div className="lead-meta-row">
                          <span>{item.customer.city}</span>
                          <span>{sourceLabels[item.lead.source]}</span>
                        </div>
                        <div className="muted">
                          {intentLabels[item.lead.intentLevel]} / 预算：¥{item.customer.budgetMin.toLocaleString()} - ¥{item.customer.budgetMax.toLocaleString()}
                        </div>
                        <div className="muted">下次跟进：{item.lead.nextFollowUpAt ?? "待安排"}</div>
                        <div className="muted">摘要：{item.lead.summary}</div>
                        {item.linkedProject ? (
                          <div className="muted">
                            已关联项目：{item.linkedProject.code} / {item.linkedProject.name}
                          </div>
                        ) : null}
                        <form action={updateLeadStageAction} className="inline-form">
                          <input type="hidden" name="leadId" value={item.lead.id} />
                          <select name="stage" defaultValue={item.lead.stage}>
                            {stageOrder.map((option) => (
                              <option key={option} value={option}>
                                {stageLabels[option]}
                              </option>
                            ))}
                          </select>
                          <button type="submit" className="ghost-button">
                            更新阶段
                          </button>
                        </form>
                      </div>
                    ))
                  ) : (
                    <div className="empty-state">当前阶段暂无线索</div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
        <div className="footer-note">
          <strong>下一步建议：</strong> 这块很适合继续演化成 Notion 风格数据库，补充筛选、来源标签、签约概率和负责人字段。
        </div>
      </section>
    </>
  );
}
