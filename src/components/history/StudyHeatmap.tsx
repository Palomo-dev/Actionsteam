import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  Tooltip,
  Cell,
  ResponsiveContainer
} from "recharts";
import { HeatmapDataPoint } from "@/types/study-history";
import { formatSeconds } from "@/utils/timeUtils";

type StudyHeatmapProps = {
  heatmapData: HeatmapDataPoint[];
};

export const StudyHeatmap = ({ heatmapData }: StudyHeatmapProps) => {
  const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  const getColor = (seconds: number) => {
    if (seconds === 0) return '#1a1a1a';
    if (seconds < 1800) return '#312e81'; // Less than 30 minutes
    if (seconds < 3600) return '#4338ca'; // Less than 1 hour
    if (seconds < 7200) return '#6366f1'; // Less than 2 hours
    return '#818cf8';
  };

  return (
    <Card className="bg-gray-800/50 border-gray-700/50">
      <CardHeader>
        <CardTitle className="text-lg text-gray-100">
          Mapa de Calor de Actividad
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart
              margin={{ top: 20, right: 20, bottom: 20, left: 40 }}
            >
              <XAxis
                type="number"
                dataKey="hour"
                name="Hora"
                domain={[0, 23]}
                tickFormatter={(hour) => `${hour}:00`}
              />
              <YAxis
                type="number"
                dataKey="day"
                name="Día"
                domain={[0, 6]}
                tickFormatter={(day) => dayNames[day]}
              />
              <ZAxis type="number" dataKey="value" range={[50, 500]} />
              <Tooltip
                cursor={{ strokeDasharray: '3 3' }}
                content={({ payload }) => {
                  if (payload && payload.length > 0) {
                    const data = payload[0].payload as HeatmapDataPoint;
                    return (
                      <div className="bg-gray-800 p-2 rounded shadow">
                        <p className="text-white">{`${dayNames[data.day]} ${data.hour}:00`}</p>
                        <p className="text-purple-400">{formatSeconds(data.value)}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Scatter data={heatmapData} shape="circle">
                {heatmapData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={getColor(entry.value)}
                  />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};