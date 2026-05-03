"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

interface ErrorFallbackProps {
  error: Error & { digest?: string };
  reset: () => void;
  title?: string;
  description?: string;
}

export function ErrorFallback({
  error,
  reset,
  title = "页面出错了",
  description = "抱歉，加载页面时遇到了问题。请稍后重试或联系技术支持。"
}: ErrorFallbackProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="atelier-empty-state">
      <div className="atelier-empty-icon">
        <AlertTriangle size={32} strokeWidth={1.5} />
      </div>
      <h2>{title}</h2>
      <p>{description}</p>
      {error.digest && <code className="atelier-empty-code">{error.digest}</code>}
      <button className="atelier-empty-btn" onClick={reset} type="button">
        重试
      </button>
    </div>
  );
}
