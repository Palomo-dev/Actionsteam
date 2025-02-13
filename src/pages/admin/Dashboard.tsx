import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format, subDays } from "date-fns";
import { es } from "date-fns/locale";
import { DashboardStats } from "@/components/admin/stats/DashboardStats";
import { DashboardCharts } from "@/components/admin/stats/DashboardCharts";
import { useEffect } from "react";

const Dashboard = () => {
  const { data: stats, refetch: refetchStats } = useQuery({
    queryKey: ["admin-dashboard-stats"],
    queryFn: async () => {
      const [
        { count: totalUsers },
        { count: totalCourses },
        { count: completedCourses },
        { data: payments },
        { count: activeSubscribers },
        { count: pendingPayments },
        { count: cancelledPayments }
      ] = await Promise.all([
        supabase.from("profiles").select("*", { count: "exact", head: true }).not('id', 'is', null),
        supabase.from("courses").select("*", { count: "exact", head: true }),
        supabase.from("user_courses").select("*", { count: "exact", head: true }).eq("status", "completed"),
        supabase.from("payments").select("amount").eq("status", "completed"),
        supabase.from("subscriptions").select("*", { count: "exact", head: true }).eq("status", "active"),
        supabase.from("payments").select("*", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("payments").select("*", { count: "exact", head: true }).eq("status", "cancelled")
      ]);

      const totalIncome = payments?.reduce((sum, payment) => sum + Number(payment.amount), 0) || 0;

      return {
        totalUsers,
        totalCourses,
        completedCourses,
        totalIncome,
        activeSubscribers,
        pendingPayments,
        cancelledPayments
      };
    }
  });

  // Suscribirse a cambios en las tablas relevantes
  useEffect(() => {
    const channels = [
      supabase
        .channel('profiles-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'profiles'
          },
          () => {
            refetchStats();
          }
        )
        .subscribe(),

      supabase
        .channel('payments-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'payments'
          },
          () => {
            refetchStats();
          }
        )
        .subscribe(),

      supabase
        .channel('subscriptions-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'subscriptions'
          },
          () => {
            refetchStats();
          }
        )
        .subscribe()
    ];

    return () => {
      channels.forEach(channel => {
        supabase.removeChannel(channel);
      });
    };
  }, [refetchStats]);

  const { data: usersData } = useQuery({
    queryKey: ["users-chart-data"],
    queryFn: async () => {
      const startDate = subDays(new Date(), 30);
      
      const { data: users } = await supabase
        .from("profiles")
        .select("created_at")
        .gte("created_at", startDate.toISOString())
        .order("created_at");

      const dailyUsers = users?.reduce((acc: any[], user) => {
        const date = format(new Date(user.created_at), "dd/MM", { locale: es });
        const existingDay = acc.find(day => day.date === date);
        
        if (existingDay) {
          existingDay.users += 1;
        } else {
          acc.push({ date, users: 1 });
        }
        
        return acc;
      }, []) || [];

      return dailyUsers;
    }
  });

  const { data: revenueData } = useQuery({
    queryKey: ["revenue-chart-data"],
    queryFn: async () => {
      const startDate = subDays(new Date(), 30);
      
      const { data: payments } = await supabase
        .from("payments")
        .select("amount, created_at")
        .eq("status", "completed")
        .gte("created_at", startDate.toISOString())
        .order("created_at");

      const dailyRevenue = payments?.reduce((acc: any[], payment) => {
        const date = format(new Date(payment.created_at), "dd/MM", { locale: es });
        const existingDay = acc.find(day => day.date === date);
        
        if (existingDay) {
          existingDay.revenue += Number(payment.amount);
        } else {
          acc.push({ date, revenue: Number(payment.amount) });
        }
        
        return acc;
      }, []) || [];

      return dailyRevenue;
    }
  });

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">
        Panel de Control
      </h1>

      <DashboardStats stats={stats} />
      <DashboardCharts usersData={usersData || []} revenueData={revenueData || []} />
    </div>
  );
};

export default Dashboard;