import { Link } from "react-router-dom";
import { Users, Zap, Lock } from "lucide-react";

const BoardCard = ({ board }) => {
  return (
    <Link
      to={`/board/${board.id}`}
      className="group relative overflow-hidden rounded-2xl border border-line bg-surface transition-all hover:shadow-[var(--shadow-soft)] hover:border-line/60 h-48 flex flex-col"
    >
      {/* Color bar */}
      <div
        className="absolute inset-x-0 top-0 h-1.5"
        style={{ backgroundColor: board.color }}
      />

      {/* Content */}
      <div className="flex flex-1 flex-col justify-between p-5">
        {/* Header */}
        <div>
          <h3 className="text-base font-bold text-ink truncate group-hover:underline">
            {board.title}
          </h3>
          <p className="mt-1 text-xs text-muted line-clamp-2">
            {board.description || "No description"}
          </p>
        </div>

        {/* Footer stats */}
        <div className="flex items-center justify-between pt-4 border-t border-line/50">
          <div className="flex items-center gap-4 text-xs text-muted">
            <div className="flex items-center gap-1">
              <Zap className="h-3.5 w-3.5" />
              <span>{board.task_count} tasks</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5" />
              <span>{board.member_count}</span>
            </div>
          </div>
          {board.is_owner && (
            <Lock className="h-3.5 w-3.5 text-faint" />
          )}
        </div>
      </div>
    </Link>
  );
};

const DashboardGrid = ({ boards = [] }) => {
  const ownedBoards = boards.filter((b) => b.is_owner);
  const sharedBoards = boards.filter((b) => !b.is_owner);

  return (
    <div className="space-y-12">
      {/* Owned boards */}
      <section>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-ink">My Boards</h2>
            <p className="mt-1 text-sm text-muted">
              {ownedBoards.length} board{ownedBoards.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {ownedBoards.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-line bg-surface-2 p-12 text-center">
            <Zap className="mx-auto mb-4 h-8 w-8 text-faint" />
            <p className="font-semibold text-ink">No boards yet</p>
            <p className="mt-1 text-sm text-muted">Create your first kanban board to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {ownedBoards.map((board) => (
              <BoardCard key={board.id} board={board} />
            ))}
          </div>
        )}
      </section>

      {/* Shared boards */}
      {sharedBoards.length > 0 && (
        <section>
          <div className="mb-6">
            <h2 className="text-lg font-bold text-ink">Shared with Me</h2>
            <p className="mt-1 text-sm text-muted">
              {sharedBoards.length} board{sharedBoards.length !== 1 ? "s" : ""}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {sharedBoards.map((board) => (
              <BoardCard key={board.id} board={board} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default DashboardGrid;
