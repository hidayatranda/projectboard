import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  Zap,
  Users,
  FolderKanban,
  TrendingUp,
} from "lucide-react";
import { useBoards } from "../context/BoardsContext";
import { useAuth } from "../context/AuthContext";
import { useLayout } from "../components/layout/AppLayout";
import Topbar from "../components/layout/Topbar";
import DashboardGrid from "../components/DashboardGrid";
import { BoardCardSkeleton } from "../components/ui/Skeleton";

const StatCard = ({ icon: Icon, label, value, trend = null, color = "bg-blue-500" }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="rounded-2xl border border-line bg-surface p-5 shadow-[var(--shadow-card)]"
  >
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <p className="text-xs font-semibold text-faint uppercase tracking-wide">{label}</p>
        <p className="mt-2 text-2xl font-bold text-ink">{value}</p>
        {trend && (
          <div className="mt-2 flex items-center gap-1">
            <TrendingUp className="h-3 w-3 text-green-600" />
            <span className="text-xs font-medium text-green-600">{trend}</span>
          </div>
        )}
      </div>
      <div className={`rounded-full ${color} p-3 text-white`}>
        <Icon className="h-5 w-5" />
      </div>
    </div>
  </motion.div>
);

const Dashboard = () => {
  const { boards, loading } = useBoards();
  const { user } = useAuth();
  const { openCreateBoard } = useLayout();

  const stats = useMemo(() => {
    const totalTasks = boards.reduce(
      (sum, b) => sum + Number(b.task_count || 0),
      0,
    );
    const owned = boards.filter((b) => b.is_owner).length;
    const shared = boards.filter((b) => !b.is_owner).length;
    return { 
      total: boards.length, 
      totalTasks, 
      owned, 
      shared,
      avgTasksPerBoard: boards.length > 0 ? Math.round(totalTasks / boards.length) : 0,
    };
  }, [boards]);

  return (
    <>
      <Topbar
        title="Dashboard"
        subtitle="Manage your boards and projects"
        onCreateBoard={openCreateBoard}
      />

      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-ink">
              Welcome back, {user?.name?.split(" ")[0]} 👋
            </h2>
            <p className="mt-2 text-muted">Manage your kanban boards and collaborate with your team</p>
          </div>

          {/* Stats */}
          <div className="mb-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              icon={FolderKanban}
              label="Total Boards"
              value={stats.total}
              color="bg-blue-500"
            />
            <StatCard
              icon={Zap}
              label="Total Tasks"
              value={stats.totalTasks}
              color="bg-amber-500"
            />
            <StatCard
              icon={Users}
              label="Shared Boards"
              value={stats.shared}
              color="bg-green-500"
            />
            <StatCard
              icon={TrendingUp}
              label="Avg per Board"
              value={stats.avgTasksPerBoard}
              color="bg-purple-500"
            />
          </div>

          {/* Boards Grid */}
          {loading ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <BoardCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <DashboardGrid boards={boards} />
          )}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
