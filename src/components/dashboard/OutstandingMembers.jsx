const OutstandingMembers = ({ members = [] }) => {
  if (!members.length) {
    return (
      <div className="bg-welfare-surface border border-welfare-border rounded-xl shadow-sm p-5 md:p-6">
        <div className="mb-5">
          <h2 className="text-lg md:text-xl font-semibold text-welfare-text-primary">
            Outstanding Members
          </h2>
        </div>

        <div className="rounded-lg bg-green-50 border border-green-100 p-4">
          <p className="text-sm font-medium text-welfare-success">
            🎉 Everyone is fully paid.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-welfare-surface border border-welfare-border rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 p-5 md:p-6">
      <div className="mb-5">
        <h2 className="text-lg md:text-xl font-semibold text-welfare-text-primary">
          Outstanding Members
        </h2>

        <p className="text-sm text-welfare-text-secondary mt-1">
          Showing top 5 outstanding members
        </p>
      </div>

      <div className="space-y-4">
        {members.map((member, index) => (
          <div
            key={index}
            className="pb-4 border-b border-welfare-border last:border-none last:pb-0"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="font-semibold text-welfare-text-primary truncate">
                  {member.member}
                </h3>

                <p className="text-sm text-welfare-text-secondary mt-1">
                  {member.title}
                </p>
              </div>

              <span
                className={`shrink-0 px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${
                  member.status === "partial"
                    ? "bg-orange-50 text-welfare-warning"
                    : "bg-red-50 text-welfare-danger"
                }`}
              >
                {member.status}
              </span>
            </div>

            <div className="flex items-center justify-between mt-3">
              <span className="text-sm text-welfare-text-secondary">
                Outstanding
              </span>

              <span className="text-sm font-bold text-welfare-danger">
                Ksh {member.amount.toLocaleString()}
              </span>
            </div>
          </div>
        ))}
      </div>

      <button className="mt-5 text-sm font-medium text-welfare-primary hover:text-welfare-primaryDark transition-colors">
        View All →
      </button>
    </div>
  );
};

export default OutstandingMembers;