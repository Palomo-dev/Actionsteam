import { StatsCard } from "@/components/dashboard/StatsCard";
import { Users, BookOpen, GraduationCap, TrendingUp, Clock, XCircle } from "lucide-react";

interface DashboardStatsProps {
  stats: {
    totalUsers: number;
    totalCourses: number;
    completedCourses: number;
    totalIncome: number;
    pendingPayments: number;
    cancelledPayments: number;
  } | undefined;
}

export const DashboardStats = ({ stats }: DashboardStatsProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <StatsCard
        title="Total Usuarios"
        value={stats?.totalUsers || 0}
        icon={Users}
      />
      <StatsCard
        title="Cursos Activos"
        value={stats?.totalCourses || 0}
        icon={BookOpen}
      />
      <StatsCard
        title="Cursos Completados"
        value={stats?.completedCourses || 0}
        icon={GraduationCap}
      />
      <StatsCard
        title="Ingresos Totales"
        value={`$${(stats?.totalIncome || 0).toLocaleString('es-CO')}`}
        icon={TrendingUp}
      />
      <StatsCard
        title="Pagos Pendientes"
        value={stats?.pendingPayments || 0}
        icon={Clock}
      />
      <StatsCard
        title="Pagos Cancelados"
        value={stats?.cancelledPayments || 0}
        icon={XCircle}
      />
    </div>
  );
};