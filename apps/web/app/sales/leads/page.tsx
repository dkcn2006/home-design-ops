import type { LeadSource, LeadStage } from "@home-design-ops/shared";
import { createLeadIntakeAction } from "../../../lib/actions";
import { getLeadPipeline, getLeadSummary } from "../../../lib/data";
import { LeadKanban } from "../../../components/lead-kanban";

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

  return (
    <div className="atelier-pipeline">
      {/* Metrics Bar */}
      <div className="atelier-metrics">
        <div className="atelier-metric-card">
          <p className="atelier-metric-label">总线索数</p>
          <div className="atelier-metric-value-wrap">
            <span className="atelier-metric-value">{summary.total}</span>
            <span className="atelier-metric-delta">+12%</span>
          </div>
        </div>
        <div className="atelier-metric-card">
          <p className="atelier-metric-label">今日需跟进</p>
          <div className="atelier-metric-value-wrap">
            <span className="atelier-metric-value">
              {summary.todayFollowUpCount + summary.overdueFollowUpCount}
            </span>
            <span className="atelier-metric-meta">
              {summary.overdueFollowUpCount} 条逾期
            </span>
          </div>
        </div>
        <div className="atelier-metric-card">
          <p className="atelier-metric-label">高意向线索</p>
          <div className="atelier-metric-value-wrap">
            <span className="atelier-metric-value">{summary.highIntentCount}</span>
            <span className="atelier-metric-meta">优先跟进</span>
          </div>
        </div>
        <div className="atelier-metric-card">
          <p className="atelier-metric-label">转化率</p>
          <div className="atelier-metric-value-wrap">
            <span className="atelier-metric-value">{summary.conversionRate}%</span>
            <span className="atelier-metric-meta">近 30 天</span>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="atelier-filter-bar">
        <div className="atelier-filter-group">
          <span className="atelier-filter-pill">
            <span>☰</span> 筛选
          </span>
          <select className="atelier-filter-select">
            <option>来源：全部</option>
            {Object.entries(sourceLabels).map(([source, label]) => (
              <option key={source} value={source}>
                {label}
              </option>
            ))}
          </select>
          <select className="atelier-filter-select">
            <option>意向：全部</option>
            <option value="high">高意向</option>
            <option value="medium">中意向</option>
            <option value="low">低意向</option>
          </select>
          <select className="atelier-filter-select">
            <option>负责人：全部</option>
            <option>销售团队</option>
          </select>
        </div>
        <div className="atelier-filter-date">
          <span>📅</span>
          <span>2026年1月 - 2026年12月</span>
        </div>
      </div>

      {/* Kanban Board */}
      <section className="atelier-kanban-section">
        <LeadKanban
          pipeline={pipeline}
          stageOrder={stageOrder}
          stageLabels={stageLabels}
          sourceLabels={sourceLabels}
          intentLabels={intentLabels}
        />
      </section>

      {/* New Lead Form */}
      <section className="atelier-intake-section">
        <div className="atelier-section-header">
          <h2>新建客户与线索</h2>
          <span>录入新客户信息</span>
        </div>
        <form action={createLeadIntakeAction} className="atelier-intake-form">
          <div className="atelier-intake-grid">
            <label className="atelier-field">
              <span>客户姓名</span>
              <input name="customerName" required placeholder="例如：王先生" />
            </label>
            <label className="atelier-field">
              <span>联系电话</span>
              <input name="phone" required placeholder="13800000000" />
            </label>
            <label className="atelier-field">
              <span>邮箱</span>
              <input name="email" type="email" placeholder="可选" />
            </label>
            <label className="atelier-field">
              <span>城市</span>
              <input name="city" required placeholder="上海" />
            </label>
            <label className="atelier-field">
              <span>预算下限</span>
              <input name="budgetMin" type="number" min="0" required placeholder="200000" />
            </label>
            <label className="atelier-field">
              <span>预算上限</span>
              <input name="budgetMax" type="number" min="0" required placeholder="300000" />
            </label>
            <label className="atelier-field">
              <span>线索来源</span>
              <select name="source" defaultValue="referral">
                {Object.entries(sourceLabels).map(([source, label]) => (
                  <option key={source} value={source}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
            <label className="atelier-field">
              <span>当前阶段</span>
              <select name="stage" defaultValue="new">
                {stageOrder.map((stage) => (
                  <option key={stage} value={stage}>
                    {stageLabels[stage]}
                  </option>
                ))}
              </select>
            </label>
            <label className="atelier-field">
              <span>预计签约时间</span>
              <input name="expectedSignDate" type="date" />
            </label>
            <label className="atelier-field atelier-field-span-2">
              <span>家庭画像</span>
              <input
                name="householdProfile"
                required
                placeholder="例如：三口之家，重视餐厨互动和儿童收纳"
              />
            </label>
            <label className="atelier-field atelier-field-span-2">
              <span>风格偏好</span>
              <input name="preferredStyle" placeholder="用逗号分隔，例如：现代木质, 温暖简约" />
            </label>
            <label className="atelier-field atelier-field-span-2">
              <span>线索摘要</span>
              <textarea
                name="summary"
                rows={4}
                required
                placeholder="记录这次沟通的主要目标、房屋情况和客户关注点"
              />
            </label>
            <label className="atelier-field atelier-field-span-2">
              <span>核心痛点</span>
              <textarea
                name="painPoints"
                rows={4}
                placeholder="按逗号或换行分隔，例如：厨房收纳不足，担心施工返工"
              />
            </label>
            <label className="atelier-field atelier-field-span-2">
              <span>客户备注</span>
              <textarea
                name="customerNotes"
                rows={4}
                placeholder="补充沟通细节、禁忌项、决策人信息等"
              />
            </label>
          </div>
          <div className="atelier-intake-actions">
            <button type="submit" className="atelier-intake-submit">
              创建客户与线索
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
