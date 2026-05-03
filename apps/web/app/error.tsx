"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

export default function GlobalError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="atelier-empty-state">
      <div className="atelier-empty-icon">
        <AlertTriangle size={32} strokeWidth={1.5} />
      </div>
      <h2>页面出错了</h2>
      <p>抱歉，加载页面时遇到了问题。请稍后重试或联系技术支持。</p>
      {error.digest && <code className="atelier-empty-code">{error.digest}</code>}
      <button className="atelier-empty-btn" onClick={reset} type="button">
        重试
      </button>
    </div>
  );
}
