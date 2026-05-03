"use client";

import { useState, useTransition, useCallback } from "react";
import { submitConfirmationAction } from "../lib/actions";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

type ToastType = "success" | "error";
interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

interface ClientConfirmationFormProps {
  projectId: string;
  confirmationId: string;
  defaultNote?: string;
  onSubmitted?: () => void;
}

export function ClientConfirmationForm({
  projectId,
  confirmationId,
  defaultNote = "",
  onSubmitted
}: ClientConfirmationFormProps) {
  const [isPending, startTransition] = useTransition();
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [note, setNote] = useState(defaultNote);

  const showToast = useCallback((message: string, type: ToastType) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const handleSubmit = (status: "confirmed" | "rejected") => {
    const formData = new FormData();
    formData.append("projectId", projectId);
    formData.append("confirmationId", confirmationId);
    formData.append("status", status);
    formData.append("note", note);

    startTransition(async () => {
      try {
        await submitConfirmationAction(formData);
        showToast(
          status === "confirmed" ? "确认已通过，任务已同步更新" : "反馈已提交，团队将跟进处理",
          "success"
        );
        onSubmitted?.();
      } catch (err) {
        showToast(err instanceof Error ? err.message : "提交失败，请重试", "error");
      }
    });
  };

  return (
    <div className="client-confirmation-form-wrap">
      {/* Toasts */}
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`atelier-toast atelier-toast-${toast.type}`}
          role="status"
          aria-live="polite"
        >
          {toast.type === "success" ? <CheckCircle size={14} /> : <XCircle size={14} />}
          {toast.message}
        </div>
      ))}

      <div className="client-form-field">
        <label htmlFor={`note-${confirmationId}`}>补充说明（可选）</label>
        <textarea
          id={`note-${confirmationId}`}
          rows={3}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="如有具体意见或修改要求，请在此说明"
          disabled={isPending}
        />
      </div>

      <div className="client-form-actions">
        <button
          type="button"
          className="client-btn-confirm"
          onClick={() => handleSubmit("confirmed")}
          disabled={isPending}
        >
          {isPending ? <Loader2 size={14} className="spin" /> : <CheckCircle size={14} />}
          确认通过
        </button>
        <button
          type="button"
          className="client-btn-reject"
          onClick={() => handleSubmit("rejected")}
          disabled={isPending}
        >
          {isPending ? <Loader2 size={14} className="spin" /> : <XCircle size={14} />}
          提交反馈
        </button>
      </div>
    </div>
  );
}
