"use client";

import { useState, useTransition, useCallback, useRef } from "react";
import { createLeadIntakeAction } from "../lib/actions";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import type { LeadSource, LeadStage } from "@home-design-ops/shared";

type ToastType = "success" | "error";

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

interface LeadIntakeFormProps {
  sourceLabels: Record<LeadSource, string>;
  stageLabels: Record<LeadStage, string>;
  stageOrder: LeadStage[];
}

export function LeadIntakeForm({
  sourceLabels,
  stageLabels,
  stageOrder,
}: LeadIntakeFormProps) {
  const [isPending, startTransition] = useTransition();
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [formError, setFormError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const showToast = useCallback((message: string, type: ToastType) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);

    const form = e.currentTarget;
    const formData = new FormData(form);

    const phone = String(formData.get("phone") ?? "").trim();
    const summary = String(formData.get("summary") ?? "").trim();
    const budgetMin = Number(formData.get("budgetMin") ?? 0);
    const budgetMax = Number(formData.get("budgetMax") ?? 0);

    if (!phone) {
      setFormError("联系电话不能为空");
      return;
    }

    if (!summary) {
      setFormError("线索摘要不能为空");
      return;
    }

    if (budgetMax < budgetMin) {
      setFormError("预算上限必须大于等于预算下限");
      return;
    }

    startTransition(async () => {
      try {
        await createLeadIntakeAction(formData);
        showToast("线索已创建", "success");
        form.reset();
        const kanbanSection = document.querySelector(".atelier-kanban-section");
        if (kanbanSection) {
          kanbanSection.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      } catch (err) {
        setFormError(err instanceof Error ? err.message : "创建失败，请重试");
      }
    });
  };

  return (
    <>
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`atelier-toast atelier-toast-${toast.type}`}
          role="status"
          aria-live="polite"
        >
          {toast.type === "success" ? (
            <CheckCircle size={14} />
          ) : (
            <XCircle size={14} />
          )}
          {toast.message}
        </div>
      ))}

      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="atelier-intake-form"
      >
        {formError && (
          <div
            style={{
              marginBottom: 16,
              padding: "12px 16px",
              borderRadius: 8,
              background: "#fef2f2",
              color: "#991b1b",
              border: "1px solid #fecaca",
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            {formError}
          </div>
        )}

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
            <input
              name="budgetMin"
              type="number"
              min="0"
              required
              placeholder="200000"
            />
          </label>
          <label className="atelier-field">
            <span>预算上限</span>
            <input
              name="budgetMax"
              type="number"
              min="0"
              required
              placeholder="300000"
            />
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
            <input
              name="preferredStyle"
              placeholder="用逗号分隔，例如：现代木质, 温暖简约"
            />
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
          <button
            type="submit"
            className="atelier-intake-submit"
            disabled={isPending}
          >
            {isPending ? <Loader2 size={14} className="spin" /> : null}
            {isPending ? "创建中…" : "创建客户与线索"}
          </button>
        </div>
      </form>
    </>
  );
}
