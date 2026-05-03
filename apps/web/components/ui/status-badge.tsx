import type { ReactNode } from "react";

export type BadgeTone =
  | "default"
  | "primary"
  | "accent"
  | "success"
  | "warning"
  | "danger"
  | "blocked"
  | "waiting"
  | "progress";

interface StatusBadgeProps {
  children: ReactNode;
  tone?: BadgeTone;
  icon?: ReactNode;
  dot?: boolean;
  className?: string;
}

const toneClassMap: Record<BadgeTone, string> = {
  default: "atelier-badge-default",
  primary: "atelier-badge-primary",
  accent: "atelier-badge-accent",
  success: "atelier-badge-success",
  warning: "atelier-badge-warning",
  danger: "atelier-badge-danger",
  blocked: "atelier-badge-blocked",
  waiting: "atelier-badge-waiting",
  progress: "atelier-badge-progress"
};

export function StatusBadge({
  children,
  tone = "default",
  icon,
  dot = false,
  className = ""
}: StatusBadgeProps) {
  return (
    <span className={`atelier-badge ${toneClassMap[tone]} ${className}`}>
      {dot && <span className="atelier-badge-dot" />}
      {icon}
      {children}
    </span>
  );
}
