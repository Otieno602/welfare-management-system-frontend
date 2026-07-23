import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const MonthlyCollectionsChart = ({ data }) => {
  return (
    <div className="bg-white rounded-xl shadow hover:shadow-lg transition-all duration-300 p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-semibold text-gray-800">
            Monthly Collections
          </h2>
        </div>

        <p className="text-sm text-gray-500 mb-4">
          Total money collected each month
        </p>

      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="month" />

          <YAxis />

          <Tooltip
            formatter={(value) => [
              `Ksh ${Number(value).toLocaleString()}`,
              "Collected",
            ]}
          />

          <Bar dataKey="amount" fill="#2563eb" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonthlyCollectionsChart;
