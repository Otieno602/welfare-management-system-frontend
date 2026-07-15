import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = [
  "#22c55e", // Paid
  "#facc15", // Partial
  "#ef4444", // Unpaid
];

const PaymentStatusChart = ({ records }) => {
  const allPayments = records.flatMap((record) => record.payments || []);

  const paid = allPayments.filter(
    (payment) => payment.status === "paid",
  ).length;

  const partial = allPayments.filter(
    (payment) => payment.status === "partial",
  ).length;

  const unpaid = allPayments.filter(
    (payment) => payment.status === "unpaid",
  ).length;

  const data = [
    {
      name: "Paid",
      value: paid,
    },
    {
      name: "Partial",
      value: partial,
    },
    {
      name: "Unpaid",
      value: unpaid,
    },
  ].filter((item) => item.value > 0);

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <div className="mb-4">
        <h2 className="text-xl font-semibold">Overall Payment Status</h2>

        <p className="text-sm text-gray-500">
          Distribution of payment records across all financial contributions.
        </p>
      </div>

      <ResponsiveContainer width="100%" height={320}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            outerRadius={100}
            label
          >
            {data.map((entry, index) => (
              <Cell key={entry.name} fill={COLORS[index]} />
            ))}
          </Pie>

          <Tooltip formatter={(value) => [`${value} Members`, "Count"]} />

          <Legend />
        </PieChart>
      </ResponsiveContainer>

      <div className="grid grid-cols-3 gap-4 mt-6 text-center">
        <div>
          <p className="text-green-600 text-2xl font-bold">{paid}</p>

          <p className="text-sm text-gray-500">Paid</p>
        </div>

        <div>
          <p className="text-yellow-500 text-2xl font-bold">{partial}</p>

          <p className="text-sm text-gray-500">Partial</p>
        </div>

        <div>
          <p className="text-red-500 text-2xl font-bold">{unpaid}</p>

          <p className="text-sm text-gray-500">Unpaid</p>
        </div>
      </div>
    </div>
  );
};

export default PaymentStatusChart;
