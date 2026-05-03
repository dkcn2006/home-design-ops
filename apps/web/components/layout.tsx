"use client";

import Link from "next/link";
import type { Route } from "next";
import { ReactNode, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FolderKanban, Palette, Settings } from "lucide-react";
import { AppHeader } from "./app-header";
import { AppSidebar } from "./app-sidebar";

const bottomNavItems: { href: string; label: string; icon: ReactNode }[] = [
  { href: "/", label: "Overview", icon: <LayoutDashboard size={20} strokeWidth={1.5} /> },
  { href: "/projects/proj-1", label: "Projects", icon: <FolderKanban size={20} strokeWidth={1.5} /> },
  { href: "/", label: "Mood", icon: <Palette size={20} strokeWidth={1.5} /> },
  { href: "/", label: "Settings", icon: <Settings size={20} strokeWidth={1.5} /> }
];

export function Shell({ children }: { children: ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className={`shell atelier-shell ${sidebarCollapsed ? "collapsed" : ""}`}>
      <AppHeader />
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
