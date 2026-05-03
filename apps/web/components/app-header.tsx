"use client";

import Link from "next/link";
import type { Route } from "next";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export interface TopNavItem {
  href: string;
  label: string;
}

export interface AppHeaderProps {
  navItems?: TopNavItem[];
}

const defaultNavItems: TopNavItem[] = [];

export function AppHeader({
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
    </header>
  );
}
