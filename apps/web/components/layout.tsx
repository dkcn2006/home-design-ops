import Link from "next/link";
import { ReactNode } from "react";

export function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand">
          home-design-ops
          <span>家装业务协同与 AI 提效 MVP</span>
        </div>
        <nav className="nav">
          <Link href="/">总览</Link>
          <Link href="/role/sales">销售工作台</Link>
          <Link href="/role/designer">设计工作台</Link>
          <Link href="/role/project_manager">项目经理工作台</Link>
          <Link href="/projects/proj-1">项目档案</Link>
          <Link href="/client/proj-1">客户端门户</Link>
        </nav>
      </aside>
      <main className="main">{children}</main>
    </div>
  );
}

