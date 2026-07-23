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
    <div className="bg-white rounded-xl shadow hover:shadow-lg transition-all duration-300 p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-semibold text-gray-800">
            Attendance Trends
          </h2>
        </div>

        <p className="text-sm text-gray-500 mb-4">
          Attendance percentage per meeting
        </p>

      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="meeting" />

          <YAxis domain={[0, 100]} unit="%" />

          <Tooltip formatter={(value) => [`${value}%`, "Attendance"]} />

          <Line
            type="monotone"
            dataKey="attendanceRate"
            stroke="#2563eb"
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AttendanceTrendChart;
