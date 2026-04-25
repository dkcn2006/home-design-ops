"use client";

import Link from "next/link";
import type { Route } from "next";
import { ReactNode, useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const navItems: { href: string; label: string }[] = [
  { href: "/", label: "总览" },
  { href: "/sales/leads", label: "线索与客户" },
  { href: "/projects/proj-1", label: "项目中心" },
  { href: "/client/proj-1", label: "客户确认" },
  { href: "/tasks", label: "我的任务" }
];

const roleItems: { href: string; label: string }[] = [
  { href: "/role/sales", label: "销售工作台" },
  { href: "/role/designer", label: "设计工作台" },
  { href: "/role/project_manager", label: "项目经理工作台" }
];

export function Shell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand">
          家装运营工作台
          <span>业务协同与交付推进</span>
        </div>
        <div className="sidebar-group">
          <div className="sidebar-label">业务主线</div>
          <nav className="nav">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href as Route}
                className={mounted && pathname === item.href ? "active" : ""}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="sidebar-group">
          <div className="sidebar-label">角色工作台</div>
          <nav className="nav">
            {roleItems.map((item) => (
              <Link
                key={item.href}
                href={item.href as Route}
                className={mounted && pathname === item.href ? "active" : ""}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </aside>
      <main className="main">{children}</main>
    </div>
  );
}
