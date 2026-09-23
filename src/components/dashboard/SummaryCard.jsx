const SummaryCard = ({
  title,
  value,
  icon,
  valueColor = "text-welfare-text-primary",
  iconColor = "text-welfare-primary",
}) => {
  return (
    <div className="bg-welfare-surface border border-welfare-border rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 p-5 md:p-6">
      <div className="flex items-center justify-between gap-4">

        <div className="min-w-0">
          <p className="text-sm font-medium text-welfare-text-secondary">
            {title}
          </p>

          <h2
            className={`text-2xl md:text-3xl font-bold mt-2 break-words ${valueColor}`}
          >
            {value}
          </h2>
        </div>

        <div
          className={`shrink-0 w-12 h-12 rounded-xl bg-welfare-primaryLight flex items-center justify-center text-2xl ${iconColor}`}
        >
          {icon}
        </div>

      </div>
    </div>
  );
};

export default SummaryCard;