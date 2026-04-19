import Link from "next/link";
import type { Route } from "next";
import { ReactNode } from "react";

export function Shell({ children }: { children: ReactNode }) {
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
            <Link href="/">总览</Link>
            <Link href={"/sales/leads" as Route}>线索与客户</Link>
            <Link href="/projects/proj-1">项目中心</Link>
            <Link href="/client/proj-1">客户确认</Link>
          </nav>
        </div>
        <div className="sidebar-group">
          <div className="sidebar-label">角色工作台</div>
          <nav className="nav">
            <Link href="/role/sales">销售工作台</Link>
            <Link href="/role/designer">设计工作台</Link>
            <Link href="/role/project_manager">项目经理工作台</Link>
          </nav>
        </div>
      </aside>
      <main className="main">{children}</main>
    </div>
  );
}
