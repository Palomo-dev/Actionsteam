import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface UsersChartProps {
  data: any[];
}

export const UsersChart = ({ data }: UsersChartProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Usuarios Registrados por Día</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="users" name="Usuarios" stroke="#2563eb" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};