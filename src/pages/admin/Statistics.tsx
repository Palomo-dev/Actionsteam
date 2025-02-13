import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format, subDays } from "date-fns";
import { PaymentStats } from "@/components/admin/stats/PaymentStats";
import { RevenueChart } from "@/components/admin/stats/RevenueChart";
import { UsersChart } from "@/components/admin/stats/UsersChart";

type TimeRange = "7days" | "30days" | "90days" | "year";

const Statistics = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>("30days");

  const getDateRange = () => {
    const now = new Date();
    switch (timeRange) {
      case "7days":
        return { start: subDays(now, 7), end: now };
      case "30days":
        return { start: subDays(now, 30), end: now };
      case "90days":
        return { start: subDays(now, 90), end: now };
      case "year":
        return { start: subDays(now, 365), end: now };
      default:
        return { start: subDays(now, 30), end: now };
    }
  };

  // Query para obtener estadísticas de pagos
  const { data: stats } = useQuery({
    queryKey: ['admin-payment-stats', timeRange],
    queryFn: async () => {
      const { start, end } = getDateRange();

      // Pagos confirmados
      const { data: confirmedPayments, error: confirmedError } = await supabase
        .from('payments')
        .select('amount')
        .eq('status', 'completed')
        .gte('created_at', start.toISOString())
        .lte('created_at', end.toISOString());

      if (confirmedError) throw confirmedError;

      // Pagos pendientes
      const { data: pendingPayments, error: pendingError } = await supabase
        .from('payments')
        .select('count')
        .eq('status', 'pending')
        .gte('created_at', start.toISOString())
        .lte('created_at', end.toISOString())
        .single();

      if (pendingError) throw pendingError;

      // Pagos cancelados
      const { data: cancelledPayments, error: cancelledError } = await supabase
        .from('payments')
        .select('count')
        .eq('status', 'cancelled')
        .gte('created_at', start.toISOString())
        .lte('created_at', end.toISOString())
        .single();

      if (cancelledError) throw cancelledError;

      // Suscriptores activos - Usando dos consultas separadas
      const { data: subscribedProfiles, error: subscribedError } = await supabase
        .from('profiles')
        .select('id')
        .eq('is_subscribed', true);

      if (subscribedError) throw subscribedError;

      const { data: activeSubscriptions, error: subscriptionsError } = await supabase
        .from('subscriptions')
        .select('user_id')
        .eq('status', 'active')
        .gt('current_period_end', new Date().toISOString());

      if (subscriptionsError) throw subscriptionsError;

      // Combinar los IDs únicos de usuarios suscritos
      const subscriberIds = new Set([
        ...(subscribedProfiles?.map(p => p.id) || []),
        ...(activeSubscriptions?.map(s => s.user_id) || [])
      ]);

      // Cursos vendidos
      const { data: coursesSold, error: coursesError } = await supabase
        .from('user_courses')
        .select('count')
        .gte('created_at', start.toISOString())
        .lte('created_at', end.toISOString())
        .single();

      if (coursesError) throw coursesError;

      const totalIncome = confirmedPayments?.reduce((sum, payment) => sum + Number(payment.amount), 0) || 0;

      return {
        totalIncome,
        confirmedPayments: confirmedPayments?.length || 0,
        pendingPayments: pendingPayments?.count || 0,
        cancelledPayments: cancelledPayments?.count || 0,
        activeSubscribers: subscriberIds.size,
        totalCoursesSold: coursesSold?.count || 0,
      };
    }
  });

  // Query para obtener datos de ingresos por día
  const { data: revenueData } = useQuery({
    queryKey: ['revenue-chart', timeRange],
    queryFn: async () => {
      const { start, end } = getDateRange();
      
      const { data: payments, error } = await supabase
        .from('payments')
        .select('amount, created_at')
        .eq('status', 'completed')
        .gte('created_at', start.toISOString())
        .lte('created_at', end.toISOString())
        .order('created_at');

      if (error) throw error;

      const dailyRevenue = payments?.reduce((acc: any[], payment) => {
        const date = format(new Date(payment.created_at), 'yyyy-MM-dd');
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

  // Query para obtener datos de usuarios registrados por día
  const { data: usersData } = useQuery({
    queryKey: ['users-chart', timeRange],
    queryFn: async () => {
      const { start, end } = getDateRange();
      
      const { data: users, error } = await supabase
        .from('profiles')
        .select('created_at')
        .gte('created_at', start.toISOString())
        .lte('created_at', end.toISOString())
        .order('created_at');

      if (error) throw error;

      const dailyUsers = users?.reduce((acc: any[], user) => {
        const date = format(new Date(user.created_at), 'yyyy-MM-dd');
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

  return (
    <div className="space-y-6 p-4">
      <div className="bg-gradient-to-r from-red-600 to-red-800 text-white p-6 rounded-lg shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Estadísticas</h1>
            <p className="text-red-100 mt-1">Análisis de rendimiento y métricas</p>
          </div>
          <Select value={timeRange} onValueChange={(value: TimeRange) => setTimeRange(value)}>
            <SelectTrigger className="w-[180px] bg-white/10 border-white/20 text-white hover:bg-white/20 transition-colors">
              <SelectValue placeholder="Seleccionar período" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="7days" className="hover:bg-red-50">Últimos 7 días</SelectItem>
              <SelectItem value="30days" className="hover:bg-red-50">Últimos 30 días</SelectItem>
              <SelectItem value="90days" className="hover:bg-red-50">Últimos 90 días</SelectItem>
              <SelectItem value="year" className="hover:bg-red-50">Este año</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-100">
        {stats && <PaymentStats stats={stats} />}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-100">
          <RevenueChart data={revenueData || []} />
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-100">
          <UsersChart data={usersData || []} />
        </div>
      </div>
    </div>
  );
};

export default Statistics;