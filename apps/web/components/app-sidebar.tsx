"use client";

import Link from "next/link";
import type { Route } from "next";
import { useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderKanban,
  Palette,
  Calendar,
  Users,
  Package,
  Sparkles,
  Plus,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight
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
  footerItems?: SideNavItem[];
  collapsed?: boolean;
  onToggle?: () => void;
}

const defaultNavItems: SideNavItem[] = [
  { href: "/", label: "Overview", icon: <LayoutDashboard size={20} strokeWidth={1.5} /> },
  { href: "/projects/proj-1", label: "Projects", icon: <FolderKanban size={20} strokeWidth={1.5} /> },
  { href: "/", label: "Moodboards", icon: <Palette size={20} strokeWidth={1.5} /> },
  { href: "/tasks", label: "Schedule", icon: <Calendar size={20} strokeWidth={1.5} /> },
  { href: "/role/sales", label: "Team", icon: <Users size={20} strokeWidth={1.5} /> },
  { href: "/sales/leads", label: "Inventory", icon: <Package size={20} strokeWidth={1.5} /> }
];

const defaultFooterItems: SideNavItem[] = [
  { href: "/", label: "Settings", icon: <Settings size={18} strokeWidth={1.5} /> },
  { href: "/", label: "Support", icon: <HelpCircle size={18} strokeWidth={1.5} /> }
];

export function AppSidebar({
  brandTitle = "Design Studio",
  brandSubtitle = "Atelier Perspective",
  navItems = defaultNavItems,
  ctaHref = "/sales/leads",
  ctaLabel = "新建项目",
  footerItems = defaultFooterItems,
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

      <div className="atelier-sidebar-footer">
        {footerItems.map((item) => (
          <Link key={item.label} href={item.href as Route} title={collapsed ? item.label : undefined}>
            <span>{item.icon}</span>
            {!collapsed && <span>{item.label}</span>}
          </Link>
        ))}
      </div>
    </aside>
  );
}
