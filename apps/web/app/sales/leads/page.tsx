import type { LeadSource, LeadStage, LeadIntentLevel } from "@home-design-ops/shared";
import { getLeadPipeline, getLeadSummary } from "../../../lib/data";
import { LeadKanban } from "../../../components/lead-kanban";
import { LeadIntakeForm } from "../../../components/lead-intake-form";
import { ScrollToAnchor } from "../../../components/scroll-to-anchor";

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

interface PageProps {
  searchParams: Promise<{
    source?: string;
    intent?: string;
    owner?: string;
    stage?: string;
    sort?: string;
  }>;
}

export default async function SalesLeadsPage({ searchParams }: PageProps) {
  const filters = await searchParams;
  const [pipeline, summary] = await Promise.all([getLeadPipeline(), getLeadSummary()]);

  const activeFilters = {
    source: filters.source as LeadSource | undefined,
    intent: filters.intent as LeadIntentLevel | undefined,
    owner: filters.owner,
    stage: filters.stage as LeadStage | undefined,
    sort: filters.sort ?? "followUp"
  };

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

      {/* Kanban Board with Filters */}
      <section className="atelier-kanban-section">
        <LeadKanban
          pipeline={pipeline}
          stageOrder={stageOrder}
          stageLabels={stageLabels}
          sourceLabels={sourceLabels}
          intentLabels={intentLabels}
          filters={activeFilters}
        />
      </section>

      <ScrollToAnchor />

      {/* New Lead Form */}
      <section id="new-lead" className="atelier-intake-section">
        <div className="atelier-section-header">
          <h2>新建客户与线索</h2>
          <span>录入新客户信息</span>
        </div>
        <LeadIntakeForm
          sourceLabels={sourceLabels}
          stageLabels={stageLabels}
          stageOrder={stageOrder}
        />
      </section>
    </div>
  );
}
