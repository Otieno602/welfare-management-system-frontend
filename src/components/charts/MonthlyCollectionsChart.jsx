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
    <div className="bg-welfare-surface border border-welfare-border rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 p-5 md:p-6">
      <div className="mb-5">
        <h2 className="text-lg md:text-xl font-semibold text-welfare-text-primary">
          Monthly Collections
        </h2>

        <p className="text-sm text-welfare-text-secondary mt-1">
          Total money collected each month
        </p>
      </div>

      <ResponsiveContainer width="100%" height={320}>
        <BarChart
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
            dataKey="month"
            tick={{ fill: "#6B625B", fontSize: 12 }}
            axisLine={{ stroke: "#E7DED6" }}
            tickLine={false}
          />

          <YAxis
            tick={{ fill: "#6B625B", fontSize: 12 }}
            axisLine={{ stroke: "#E7DED6" }}
            tickLine={false}
          />

          <Tooltip
            formatter={(value) => [
              `Ksh ${Number(value).toLocaleString()}`,
              "Collected",
            ]}
          />

          <Bar
            dataKey="amount"
            fill="#A45135"
            radius={[6, 6, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonthlyCollectionsChart;