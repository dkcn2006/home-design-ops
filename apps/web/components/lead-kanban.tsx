"use client";

import { useState, useTransition } from "react";
import type { LeadPipelineItem, LeadStage, LeadSource } from "@home-design-ops/shared";
import { updateLeadStageAction } from "../lib/actions";

interface LeadKanbanProps {
  pipeline: LeadPipelineItem[];
  stageOrder: LeadStage[];
  stageLabels: Record<LeadStage, string>;
  sourceLabels: Record<LeadSource, string>;
  intentLabels: Record<string, string>;
}

export function LeadKanban({
  pipeline,
  stageOrder,
  stageLabels,
  sourceLabels,
  intentLabels
}: LeadKanbanProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const selectedItem = selectedId
    ? pipeline.find((item) => item.lead.id === selectedId)
    : null;

  const getColumnCount = (stage: LeadStage) =>
    pipeline.filter((item) => item.lead.stage === stage).length;

  const isOverdue = (date?: string) => {
    if (!date) return false;
    return date <= "2026-04-19";
  };

  return (
    <div className="atelier-kanban-wrap">
      {/* Kanban Board */}
      <div className={`atelier-kanban-board ${selectedItem ? "atelier-kanban-board-shrink" : ""}`}>
        {stageOrder.map((stage) => {
          const items = pipeline.filter((item) => item.lead.stage === stage);
          return (
            <div className="atelier-kanban-column" key={stage}>
              <div className="atelier-kanban-column-header">
                <h3>
                  {stageLabels[stage]}
                  <span className={`atelier-kanban-count ${stage === "proposal" ? "atelier-kanban-count-active" : ""}`}>
                    {items.length}
                  </span>
                </h3>
              </div>
              <div className="atelier-kanban-stack">
                {items.map((item) => {
                  const isSelected = selectedId === item.lead.id;
                  const overdue = isOverdue(item.lead.nextFollowUpAt);
                  return (
                    <button
                      key={item.lead.id}
                      className={`atelier-kanban-card ${isSelected ? "atelier-kanban-card-selected" : ""} ${overdue ? "atelier-kanban-card-overdue" : ""}`}
                      onClick={() => setSelectedId(item.lead.id)}
                      type="button"
                    >
                      <div className="atelier-kanban-card-top">
                        <h4>{item.customer.name}</h4>
                        {item.lead.intentLevel === "high" && (
                          <span className="atelier-kanban-star">★</span>
                        )}
                      </div>
                      <div className="atelier-kanban-card-badges">
                        <span className={`atelier-kanban-intent atelier-kanban-intent-${item.lead.intentLevel}`}>
                          {intentLabels[item.lead.intentLevel]}
                        </span>
                      </div>
                      <div className="atelier-kanban-card-meta">
                        <div className="atelier-kanban-card-owner">
                          <div className="atelier-kanban-avatar">
                            {item.customer.name.slice(0, 1)}
                          </div>
                          <span>{item.customer.city}</span>
                        </div>
                        <span className={`atelier-kanban-card-date ${overdue ? "atelier-kanban-card-date-overdue" : ""}`}>
                          {overdue ? "⚠ " : ""}
                          {item.lead.nextFollowUpAt ?? "待安排"}
                        </span>
                      </div>

                      {/* Stage update form */}
                      <form
                        action={(formData) => {
                          startTransition(() => {
                            updateLeadStageAction(formData);
                          });
                        }}
                        className="atelier-kanban-card-form"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input type="hidden" name="leadId" value={item.lead.id} />
                        <select name="stage" defaultValue={item.lead.stage}>
                          {stageOrder.map((option) => (
                            <option key={option} value={option}>
                              {stageLabels[option]}
                            </option>
                          ))}
                        </select>
                        <button type="submit" disabled={isPending}>
                          {isPending ? "…" : "→"}
                        </button>
                      </form>
                    </button>
                  );
                })}
                {items.length === 0 && (
                  <div className="atelier-kanban-empty">当前阶段暂无线索</div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Drawer */}
      {selectedItem && (
        <aside className="atelier-drawer">
          <div className="atelier-drawer-header">
            <div>
              <span className="atelier-drawer-kicker">
                {stageLabels[selectedItem.lead.stage]} 阶段
              </span>
              <h3>{selectedItem.customer.name}</h3>
              <p>
                <span>📍</span> {selectedItem.customer.city}
              </p>
            </div>
            <button
              className="atelier-drawer-close"
              onClick={() => setSelectedId(null)}
              type="button"
            >
              ✕
            </button>
          </div>

          <div className="atelier-drawer-body">
            {/* Contact Info */}
            <div className="atelier-drawer-card">
              <div className="atelier-drawer-contact">
                <div className="atelier-drawer-avatar-lg">
                  {selectedItem.customer.name.slice(0, 1)}
                </div>
                <div>
                  <p className="atelier-drawer-name">{selectedItem.customer.name}</p>
                  <p className="atelier-drawer-role">客户联系人</p>
                </div>
              </div>
              <div className="atelier-drawer-contact-list">
                {selectedItem.customer.phone && (
                  <p>
                    <span>📞</span> {selectedItem.customer.phone}
                  </p>
                )}
                {selectedItem.customer.email && (
                  <p>
                    <span>✉</span> {selectedItem.customer.email}
                  </p>
                )}
              </div>
            </div>

            {/* Budget & Source */}
            <div className="atelier-drawer-section">
              <h4>线索信息</h4>
              <div className="atelier-drawer-info-grid">
                <div>
                  <span>预算范围</span>
                  <strong>
                    ¥{selectedItem.customer.budgetMin.toLocaleString()} - ¥
                    {selectedItem.customer.budgetMax.toLocaleString()}
                  </strong>
                </div>
                <div>
                  <span>来源</span>
                  <strong>{sourceLabels[selectedItem.lead.source]}</strong>
                </div>
                <div>
                  <span>意向</span>
                  <strong>{intentLabels[selectedItem.lead.intentLevel]}</strong>
                </div>
                <div>
                  <span>预计签约</span>
                  <strong>{selectedItem.lead.expectedSignDate ?? "待定"}</strong>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="atelier-drawer-section">
              <h4>内部备注</h4>
              <div className="atelier-drawer-notes">
                <p>{selectedItem.lead.summary || "暂无备注"}</p>
                {selectedItem.lead.painPoints.length > 0 && (
                  <div className="atelier-drawer-painpoints">
                    <span>核心痛点：</span>
                    {selectedItem.lead.painPoints.join("、")}
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="atelier-drawer-actions">
              <button className="atelier-drawer-action-btn" type="button">
                <span>📝</span> 创建任务
              </button>
              <button className="atelier-drawer-action-btn" type="button">
                <span>📞</span> 记录通话
              </button>
            </div>
          </div>

          {/* Drawer Footer */}
          <div className="atelier-drawer-footer">
            <button className="atelier-drawer-primary-btn" type="button">
              <span>✉</span> 发送跟进消息
            </button>
          </div>
        </aside>
      )}
    </div>
  );
}
