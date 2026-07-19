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
    <div className="bg-white rounded-xl shadow p-6">
      <div className="mb-4">
        <h2 className="text-xl font-semibold">Monthly Collections</h2>

        <p className="text-sm text-gray-500">
          Total money collected each month
        </p>
      </div>

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
