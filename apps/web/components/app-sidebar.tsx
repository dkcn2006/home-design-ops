"use client";

import Link from "next/link";
import type { Route } from "next";
import { useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderKanban,
  Palette,
  Users,
  Package,
  Sparkles,
  Plus,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Bell,
  History
} from "lucide-react";

export interface SideNavItem {
  href: string;
  label: string;
  icon: ReactNode;
}

export interface AppSidebarProps {
  brandTitle?: string;
  brandSubtitle?: string;
  navItems?: SideNavItem[];
  ctaHref?: string;
  ctaLabel?: string;
  collapsed?: boolean;
  onToggle?: () => void;
}

const defaultNavItems: SideNavItem[] = [
  { href: "/", label: "总览", icon: <LayoutDashboard size={20} strokeWidth={1.5} /> },
  { href: "/projects/proj-1", label: "项目", icon: <FolderKanban size={20} strokeWidth={1.5} /> },
  { href: "/tasks", label: "个人工作台", icon: <Palette size={20} strokeWidth={1.5} /> },
  { href: "/role/sales", label: "团队", icon: <Users size={20} strokeWidth={1.5} /> },
  { href: "/sales/leads", label: "库存", icon: <Package size={20} strokeWidth={1.5} /> }
];

export function AppSidebar({
  brandTitle = "设计工作室",
  brandSubtitle = "工作室视角",
  navItems = defaultNavItems,
  ctaHref = "/",
  ctaLabel = "新建项目",
  collapsed = false,
  onToggle
}: AppSidebarProps) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isActive = (href: string) => mounted && pathname === href;

  return (
    <aside className={`sidebar atelier-sidebar ${collapsed ? "collapsed" : ""}`}>
      <button
        type="button"
        className="atelier-sidebar-toggle"
        onClick={onToggle}
        title={collapsed ? "展开" : "收起"}
        aria-label={collapsed ? "展开侧边栏" : "收起侧边栏"}
      >
        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      <div className="atelier-sidebar-brand">
        <div className="atelier-sidebar-icon">
          <Sparkles size={20} strokeWidth={1.5} />
        </div>
        {!collapsed && (
          <div>
            <p className="atelier-sidebar-title">{brandTitle}</p>
            <p className="atelier-sidebar-subtitle">{brandSubtitle}</p>
          </div>
        )}
      </div>

      <nav className="atelier-sidenav">
        {navItems.map((item) => (
          <Link
            key={item.label}
            href={item.href as Route}
            className={isActive(item.href) ? "active" : ""}
            title={collapsed ? item.label : undefined}
          >
            <span className="atelier-sidenav-icon">{item.icon}</span>
            {!collapsed && <span>{item.label}</span>}
          </Link>
        ))}
      </nav>

      <Link href={ctaHref as Route} className="atelier-new-project-btn" title={collapsed ? ctaLabel : undefined}>
        <Plus size={18} strokeWidth={2} />
        {!collapsed && <span>{ctaLabel}</span>}
      </Link>

      <div className="atelier-sidebar-toolbar">
        <button
          type="button"
          className="atelier-sidebar-tool"
          title="通知"
          aria-label="通知"
        >
          <Bell size={18} strokeWidth={1.5} />
        </button>
        <button
          type="button"
          className="atelier-sidebar-tool"
          title="历史"
          aria-label="历史"
        >
          <History size={18} strokeWidth={1.5} />
        </button>
        <Link href="/" className="atelier-sidebar-tool" title="设置">
          <Settings size={18} strokeWidth={1.5} />
        </Link>
        <Link href="/" className="atelier-sidebar-tool" title="支持">
          <HelpCircle size={18} strokeWidth={1.5} />
        </Link>
      </div>

      <div className="atelier-sidebar-user">
        <div className="atelier-avatar" />
        {!collapsed && <span>用户</span>}
      </div>
    </aside>
  );
}
