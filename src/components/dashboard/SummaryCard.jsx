const SummaryCard = ({
  title,
  value,
  icon,
  valueColor = "text-gray-800",
}) => {
  return (
    <div className="bg-white rounded-xl shadow hover:shadow-lg transition-all duration-300 p-6">
      <div className="flex justify-between items-center">

        <div>

          <p className="text-sm text-gray-500">
            {title}
          </p>

          <h2
            className={`text-3xl font-bold mt-2 ${valueColor}`}
          >
            {value}
          </h2>

        </div>

        <div className="text-4xl">
          {icon}
        </div>

      </div>
    </div>
  );
};

export default SummaryCard;