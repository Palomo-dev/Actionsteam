import { Card, CardContent } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";

interface PaymentStatsProps {
  stats: {
    totalIncome: number;
    confirmedPayments: number;
    pendingPayments: number;
    cancelledPayments: number;
    activeSubscribers: number;
    totalCoursesSold: number;
  };
}

export const PaymentStats = ({ stats }: PaymentStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Card className="bg-gradient-to-br from-red-600 to-red-800 text-white">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-red-100">Ingresos Totales</h3>
          <p className="text-3xl font-bold mt-2">{formatPrice(stats.totalIncome)}</p>
        </CardContent>
      </Card>

      <Card className="bg-white border border-gray-100">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-600">Pagos Confirmados</h3>
          <p className="text-3xl font-bold mt-2 text-red-700">{stats.confirmedPayments}</p>
        </CardContent>
      </Card>

      <Card className="bg-white border border-gray-100">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-600">Pagos Pendientes</h3>
          <p className="text-3xl font-bold mt-2 text-amber-500">{stats.pendingPayments}</p>
        </CardContent>
      </Card>

      <Card className="bg-white border border-gray-100">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-600">Pagos Cancelados</h3>
          <p className="text-3xl font-bold mt-2 text-gray-500">{stats.cancelledPayments}</p>
        </CardContent>
      </Card>

      <Card className="bg-white border border-gray-100">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-600">Suscriptores Activos</h3>
          <p className="text-3xl font-bold mt-2 text-green-600">{stats.activeSubscribers}</p>
        </CardContent>
      </Card>

      <Card className="bg-white border border-gray-100">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-600">Cursos Vendidos</h3>
          <p className="text-3xl font-bold mt-2 text-blue-600">{stats.totalCoursesSold}</p>
        </CardContent>
      </Card>
    </div>
  );
};