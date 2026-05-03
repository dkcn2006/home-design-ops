"use client";

import { useState, useTransition, useEffect, useCallback, useMemo } from "react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import type { Route } from "next";
import type { LeadPipelineItem, LeadStage, LeadSource, LeadIntentLevel } from "@home-design-ops/shared";
import { updateLeadStageAction } from "../lib/actions";
import { EmptyState } from "./ui/empty-state";

interface LeadKanbanProps {
  pipeline: LeadPipelineItem[];
  stageOrder: LeadStage[];
  stageLabels: Record<LeadStage, string>;
  sourceLabels: Record<LeadSource, string>;
  intentLabels: Record<string, string>;
  filters: {
    source?: LeadSource;
    intent?: LeadIntentLevel;
    owner?: string;
    stage?: LeadStage;
    sort?: string;
  };
}

type ToastType = "success" | "error";
interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

const sortOptions = [
  { value: "followUp", label: "按跟进时间" },
  { value: "intentDesc", label: "意向高→低" },
  { value: "intentAsc", label: "意向低→高" },
  { value: "budgetDesc", label: "预算高→低" },
  { value: "newest", label: "最新录入" }
];

export function LeadKanban({
  pipeline,
  stageOrder,
  stageLabels,
  sourceLabels,
  intentLabels,
  filters
}: LeadKanbanProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [toasts, setToasts] = useState<Toast[]>([]);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      return params.toString();
    },
    [searchParams]
  );

  const setFilter = useCallback(
    (name: string, value: string) => {
      const qs = createQueryString(name, value);
      router.replace(`${pathname}?${qs}` as Route, { scroll: false });
    },
    [createQueryString, pathname, router]
  );

  const clearFilters = useCallback(() => {
    router.replace(pathname as Route, { scroll: false });
  }, [pathname, router]);

  const filteredPipeline = useMemo(() => {
    let result = [...pipeline];

    if (filters.source) {
      result = result.filter((item) => item.lead.source === filters.source);
    }
    if (filters.intent) {
      result = result.filter((item) => item.lead.intentLevel === filters.intent);
    }
    if (filters.owner) {
      result = result.filter((item) => item.lead.ownerId === filters.owner);
    }
    if (filters.stage) {
      result = result.filter((item) => item.lead.stage === filters.stage);
    }

    const sort = filters.sort ?? "followUp";
    switch (sort) {
      case "followUp":
        result.sort((a, b) => {
          const da = a.lead.nextFollowUpAt ?? "9999-12-31";
          const db = b.lead.nextFollowUpAt ?? "9999-12-31";
          return da.localeCompare(db);
        });
        break;
      case "intentDesc":
        result.sort((a, b) => {
          const order = { high: 3, medium: 2, low: 1 };
          return (order[b.lead.intentLevel] ?? 0) - (order[a.lead.intentLevel] ?? 0);
        });
        break;
      case "intentAsc":
        result.sort((a, b) => {
          const order = { high: 3, medium: 2, low: 1 };
          return (order[a.lead.intentLevel] ?? 0) - (order[b.lead.intentLevel] ?? 0);
        });
        break;
      case "budgetDesc":
        result.sort((a, b) => b.customer.budgetMax - a.customer.budgetMax);
        break;
      case "newest":
        result.sort((a, b) => (b.lead.createdAt ?? "").localeCompare(a.lead.createdAt ?? ""));
        break;
    }

    return result;
  }, [pipeline, filters]);

  const hasActiveFilters = filters.source || filters.intent || filters.owner || filters.stage;

  const selectedItem = selectedId
    ? filteredPipeline.find((item) => item.lead.id === selectedId)
    : null;

  const getColumnCount = (stage: LeadStage) =>
    filteredPipeline.filter((item) => item.lead.stage === stage).length;

  const todayISO = new Date().toISOString().slice(0, 10);
  const isOverdue = (date?: string) => {
    if (!date) return false;
    return date < todayISO;
  };

  const showToast = useCallback((message: string, type: ToastType) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const handleCardKeyDown = useCallback(
    (e: React.KeyboardEvent, leadId: string) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        setSelectedId(leadId);
      }
    },
    []
  );

  const handleDrawerKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedId(null);
      }
    },
    []
  );

  useEffect(() => {
    if (selectedId) {
      document.addEventListener("keydown", handleDrawerKeyDown as unknown as EventListener);
      return () => document.removeEventListener("keydown", handleDrawerKeyDown as unknown as EventListener);
    }
  }, [selectedId, handleDrawerKeyDown]);

  const handleStageSubmit = (formData: FormData) => {
    startTransition(async () => {
      try {
        await updateLeadStageAction(formData);
        showToast("阶段更新成功", "success");
      } catch (err) {
        showToast(err instanceof Error ? err.message : "阶段更新失败", "error");
      }
    });
  };

  return (
    <div className="atelier-kanban-wrap">
      {/* Toasts */}
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`atelier-toast atelier-toast-${toast.type}`}
          role="status"
          aria-live="polite"
        >
          {toast.message}
        </div>
      ))}

      {/* Filter Bar */}
      <div className="atelier-filter-bar">
        <div className="atelier-filter-group">
          <span className="atelier-filter-pill">
            <span>☰</span> 筛选
          </span>
          <select
            className="atelier-filter-select"
            value={filters.source ?? ""}
            onChange={(e) => setFilter("source", e.target.value)}
            aria-label="按来源筛选"
          >
            <option value="">来源：全部</option>
            {Object.entries(sourceLabels).map(([source, label]) => (
              <option key={source} value={source}>
                {label}
              </option>
            ))}
          </select>
          <select
            className="atelier-filter-select"
            value={filters.intent ?? ""}
            onChange={(e) => setFilter("intent", e.target.value)}
            aria-label="按意向筛选"
          >
            <option value="">意向：全部</option>
            <option value="high">高意向</option>
            <option value="medium">中意向</option>
            <option value="low">低意向</option>
          </select>
          <select
            className="atelier-filter-select"
            value={filters.stage ?? ""}
            onChange={(e) => setFilter("stage", e.target.value)}
            aria-label="按阶段筛选"
          >
            <option value="">阶段：全部</option>
            {stageOrder.map((stage) => (
              <option key={stage} value={stage}>
                {stageLabels[stage]}
              </option>
            ))}
          </select>
          <select
            className="atelier-filter-select"
            value={filters.sort ?? "followUp"}
            onChange={(e) => setFilter("sort", e.target.value)}
            aria-label="排序方式"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          {hasActiveFilters && (
            <button
              type="button"
              className="atelier-filter-clear"
              onClick={clearFilters}
            >
              清除筛选
            </button>
          )}
        </div>
        <div className="atelier-filter-result-count">
          共 {filteredPipeline.length} 条线索
        </div>
      </div>

      {/* Kanban Board */}
      <div className="atelier-kanban-board">
        {stageOrder.map((stage) => {
          const items = filteredPipeline.filter((item) => item.lead.stage === stage);
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
                    <div
                      key={item.lead.id}
                      className={`atelier-kanban-card ${isSelected ? "atelier-kanban-card-selected" : ""} ${overdue ? "atelier-kanban-card-overdue" : ""}`}
                      onClick={() => setSelectedId(item.lead.id)}
                      onKeyDown={(e) => handleCardKeyDown(e, item.lead.id)}
                      role="button"
                      tabIndex={0}
                      aria-pressed={isSelected}
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
                        {item.lead.source && (
                          <span className="atelier-kanban-source">
                            {sourceLabels[item.lead.source]}
                          </span>
                        )}
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
                        action={handleStageSubmit}
                        className="atelier-kanban-card-form"
                        onClick={(e) => e.stopPropagation()}
                        onKeyDown={(e) => e.stopPropagation()}
                      >
                        <input type="hidden" name="leadId" value={item.lead.id} />
                        <select name="stage" defaultValue={item.lead.stage}>
                          {stageOrder.map((option) => (
                            <option key={option} value={option}>
                              {stageLabels[option]}
                            </option>
                          ))}
                        </select>
                        <button type="submit" disabled={isPending} aria-label="更新阶段">
                          {isPending ? "…" : "→"}
                        </button>
                      </form>
                    </div>
                  );
                })}
                {items.length === 0 && (
                  <EmptyState title="当前阶段暂无线索" className="atelier-kanban-empty-compact" />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {selectedItem && (
        <div
          className="atelier-modal-backdrop"
          onClick={() => setSelectedId(null)}
          role="presentation"
        >
        <aside
          className="atelier-drawer atelier-drawer-modal"
          role="dialog"
          aria-modal="true"
          aria-label="线索详情"
          onClick={(e) => e.stopPropagation()}
        >
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
              aria-label="关闭详情"
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
        </div>
      )}
    </div>
  );
}
