import Link from "next/link";
import type { Route } from "next";
import { getProjectTaskBoard } from "../../../../lib/data";
import { ProjectBoardClient } from "../../../../components/project-board-client";

export default async function ProjectBoardPage({
  params,
  searchParams
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    assignee?: string;
    status?: string;
    priority?: string;
  }>;
}) {
  const { id } = await params;
  const filters = await searchParams;
  const board = await getProjectTaskBoard(id);

  const activeFilters = {
    assignee: filters.assignee,
    status: filters.status,
    priority: filters.priority
  };

  return (
    <div className="atelier-board">
      <ProjectBoardClient
        projectId={id}
        board={board}
        filters={activeFilters}
      />

      {/* Back link */}
      <div className="atelier-board-back">
        <Link href={`/projects/${id}` as Route}>
          ← 返回项目档案
        </Link>
      </div>
    </div>
  );
}
