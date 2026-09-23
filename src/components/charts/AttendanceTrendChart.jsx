import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const AttendanceTrendChart = ({ data }) => {
  return (
    <div className="bg-welfare-surface border border-welfare-border rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 p-5 md:p-6">
      <div className="mb-5">
        <h2 className="text-lg md:text-xl font-semibold text-welfare-text-primary">
          Attendance Trends
        </h2>

        <p className="text-sm text-welfare-text-secondary mt-1">
          Attendance percentage per meeting
        </p>
      </div>

      <ResponsiveContainer width="100%" height={320}>
        <LineChart
          data={data}
          margin={{
            top: 10,
            right: 10,
            left: -10,
            bottom: 5,
          }}
        >
          <CartesianGrid
            stroke="#E7DED6"
            strokeDasharray="3 3"
          />

          <XAxis
            dataKey="meeting"
            tick={{ fill: "#6B625B", fontSize: 12 }}
            axisLine={{ stroke: "#E7DED6" }}
            tickLine={false}
          />

          <YAxis
            domain={[0, 100]}
            unit="%"
            tick={{ fill: "#6B625B", fontSize: 12 }}
            axisLine={{ stroke: "#E7DED6" }}
            tickLine={false}
          />

          <Tooltip
            formatter={(value) => [
              `${value}%`,
              "Attendance",
            ]}
          />

          <Line
            type="monotone"
            dataKey="attendanceRate"
            stroke="#A45135"
            strokeWidth={3}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AttendanceTrendChart;