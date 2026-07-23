const OutstandingMembers = ({ members = [] }) => {
  console.log(members);
  if (!members.length) {
    return (
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-semibold text-gray-800">
            Outstanding Members
          </h2>
        </div>

        <p className="text-green-600">🎉 Everyone is fully paid.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow hover:shadow-lg transition-all duration-300 p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-semibold text-gray-800">
          Outstanding Members
        </h2>
      </div>

      <p className="text-sm text-gray-500 mb-4">
        Showing top 5 outstanding members
      </p>

      <div className="space-y-4">
        {members.map((member, index) => (
          <div key={index} className="border-b pb-3 last:border-none">
            <h3 className="font-semibold">{member.member}</h3>

            <p className="text-sm text-gray-500">{member.title}</p>

            <div className="flex justify-between mt-1">
              <span className="text-red-600 font-medium">
                Ksh {member.amount.toLocaleString()}
              </span>

              <span
                className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  member.status === "partial"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {member.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      <button className="text-blue-600 text-sm hover:text-blue-700 hover:underline">
        View All →
      </button>
    </div>
  );
};

export default OutstandingMembers;
