import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = {
  paid: "#16A34A",
  partial: "#D97706",
  unpaid: "#DC2626",
};

const PaymentStatusChart = ({ records }) => {
  const allPayments = records.flatMap(
    (record) => record.payments || []
  );

  const paid = allPayments.filter(
    (payment) => payment.status === "paid"
  ).length;

  const partial = allPayments.filter(
    (payment) => payment.status === "partial"
  ).length;

  const unpaid = allPayments.filter(
    (payment) => payment.status === "unpaid"
  ).length;

  const data = [
    {
      name: "Paid",
      value: paid,
      color: COLORS.paid,
    },
    {
      name: "Partial",
      value: partial,
      color: COLORS.partial,
    },
    {
      name: "Unpaid",
      value: unpaid,
      color: COLORS.unpaid,
    },
  ].filter((item) => item.value > 0);

  return (
    <div className="bg-welfare-surface border border-welfare-border rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 p-5 md:p-6">
      <div className="mb-5">
        <h2 className="text-lg md:text-xl font-semibold text-welfare-text-primary">
          Payment Status
        </h2>

        <p className="text-sm text-welfare-text-secondary mt-1">
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
            {data.map((entry) => (
              <Cell
                key={entry.name}
                fill={entry.color}
              />
            ))}
          </Pie>

          <Tooltip
            formatter={(value) => [
              `${value} Members`,
              "Count",
            ]}
          />

          <Legend />
        </PieChart>
      </ResponsiveContainer>

      <div className="grid grid-cols-3 gap-3 md:gap-4 mt-6 text-center">
        <div>
          <p className="text-welfare-success text-xl md:text-2xl font-bold">
            {paid}
          </p>

          <p className="text-sm text-welfare-text-secondary">
            Paid
          </p>
        </div>

        <div>
          <p className="text-welfare-warning text-xl md:text-2xl font-bold">
            {partial}
          </p>

          <p className="text-sm text-welfare-text-secondary">
            Partial
          </p>
        </div>

        <div>
          <p className="text-welfare-danger text-xl md:text-2xl font-bold">
            {unpaid}
          </p>

          <p className="text-sm text-welfare-text-secondary">
            Unpaid
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentStatusChart;