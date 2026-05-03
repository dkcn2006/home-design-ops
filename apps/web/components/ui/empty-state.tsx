import type { ReactNode } from "react";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  className?: string;
}

export function EmptyState({ icon, title, description, className = "" }: EmptyStateProps) {
  return (
    <div className={`atelier-empty-state ${className}`}>
      {icon && <div className="atelier-empty-state-icon">{icon}</div>}
      <p className="atelier-empty-state-title">{title}</p>
      {description && <span className="atelier-empty-state-desc">{description}</span>}
    </div>
  );
}
