"use client";

import Link from "next/link";
import type { Route } from "next";
import { ReactNode, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FolderKanban, Palette, Settings } from "lucide-react";
import { AppSidebar } from "./app-sidebar";

const bottomNavItems: { href: string; label: string; icon: ReactNode }[] = [
  { href: "/", label: "总览", icon: <LayoutDashboard size={20} strokeWidth={1.5} /> },
  { href: "/projects/proj-1", label: "项目", icon: <FolderKanban size={20} strokeWidth={1.5} /> },
  { href: "/tasks", label: "个人工作台", icon: <Palette size={20} strokeWidth={1.5} /> },
  { href: "/", label: "设置", icon: <Settings size={20} strokeWidth={1.5} /> }
];

export function Shell({ children }: { children: ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className={`shell atelier-shell ${sidebarCollapsed ? "collapsed" : ""}`}>
      <AppSidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed((v) => !v)} />
      <main className="main atelier-main">{children}</main>
      <MobileBottomNav />
    </div>
  );
}

function MobileBottomNav() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isActive = (href: string) => mounted && pathname === href;

  return (
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
  );
}
