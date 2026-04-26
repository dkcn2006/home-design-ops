"use client";

import Link from "next/link";
import type { Route } from "next";
import { ReactNode, useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const topNavItems: { href: string; label: string }[] = [
  { href: "/", label: "Dashboard" },
  { href: "/projects/proj-1", label: "Projects" },
  { href: "/sales/leads", label: "Inventory" }
];

const sideNavItems: { href: string; label: string; icon: string }[] = [
  { href: "/", label: "Overview", icon: "◈" },
  { href: "/projects/proj-1", label: "Projects", icon: "▣" },
  { href: "/", label: "Moodboards", icon: "◉" },
  { href: "/tasks", label: "Schedule", icon: "◐" },
  { href: "/role/sales", label: "Team", icon: "◑" },
  { href: "/sales/leads", label: "Inventory", icon: "◒" }
];

const bottomNavItems: { href: string; label: string; icon: string }[] = [
  { href: "/", label: "Overview", icon: "◈" },
  { href: "/projects/proj-1", label: "Projects", icon: "▣" },
  { href: "/", label: "Mood", icon: "◉" },
  { href: "/", label: "Settings", icon: "◐" }
];

export function Shell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isActive = (href: string) => mounted && pathname === href;

  return (
    <div className="shell atelier-shell">
      {/* Top App Bar */}
      <header className="atelier-topbar">
        <div className="atelier-topbar-left">
          <span className="atelier-logo">Atelier</span>
          <nav className="atelier-topbar-nav">
            {topNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href as Route}
                className={isActive(item.href) ? "active" : ""}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="atelier-topbar-right">
          <span className="atelier-topbar-icon" title="通知">◎</span>
          <span className="atelier-topbar-icon" title="历史">◐</span>
          <div className="atelier-avatar" />
        </div>
      </header>

      {/* Side Nav Bar */}
      <aside className="sidebar atelier-sidebar">
        <div className="atelier-sidebar-brand">
          <div className="atelier-sidebar-icon">✦</div>
          <div>
            <p className="atelier-sidebar-title">Design Studio</p>
            <p className="atelier-sidebar-subtitle">Atelier Perspective</p>
          </div>
        </div>

        <nav className="atelier-sidenav">
          {sideNavItems.map((item) => (
            <Link
              key={item.label}
              href={item.href as Route}
              className={isActive(item.href) ? "active" : ""}
            >
              <span className="atelier-sidenav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <Link href="/sales/leads" className="atelier-new-project-btn">
          <span>＋</span>
          <span>新建项目</span>
        </Link>

        <div className="atelier-sidebar-footer">
          <Link href="/">
            <span>◐</span>
            <span>Settings</span>
          </Link>
          <Link href="/">
            <span>？</span>
            <span>Support</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main atelier-main">{children}</main>

      {/* Mobile Bottom Nav */}
      <nav className="atelier-mobile-nav">
        {bottomNavItems.map((item) => (
          <Link
            key={item.label}
            href={item.href as Route}
            className={isActive(item.href) ? "active" : ""}
          >
            <span className="atelier-mobile-nav-icon">{item.icon}</span>
            <span className="atelier-mobile-nav-label">{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
