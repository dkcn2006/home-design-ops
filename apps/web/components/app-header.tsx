"use client";

import Link from "next/link";
import type { Route } from "next";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Bell, History } from "lucide-react";

export interface TopNavItem {
  href: string;
  label: string;
}

export interface AppHeaderProps {
  logoText?: string;
  navItems?: TopNavItem[];
}

const defaultNavItems: TopNavItem[] = [
  { href: "/", label: "Dashboard" },
  { href: "/projects/proj-1", label: "Projects" },
  { href: "/sales/leads", label: "Inventory" }
];

export function AppHeader({
  logoText = "Atelier",
  navItems = defaultNavItems
}: AppHeaderProps) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isActive = (href: string) => mounted && pathname === href;

  return (
    <header className="atelier-topbar">
      <div className="atelier-topbar-left">
        <span className="atelier-logo">{logoText}</span>
        <nav className="atelier-topbar-nav">
          {navItems.map((item) => (
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
        <span className="atelier-topbar-icon" title="通知" aria-label="通知">
          <Bell size={18} strokeWidth={1.5} />
        </span>
        <span className="atelier-topbar-icon" title="历史" aria-label="历史">
          <History size={18} strokeWidth={1.5} />
        </span>
        <div className="atelier-avatar" />
      </div>
    </header>
  );
}
