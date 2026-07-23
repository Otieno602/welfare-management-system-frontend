const RecentMeetings = ({ meetings = [] }) => {
  if (meetings.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-semibold text-gray-800">
            Recent Meetings
          </h2>
        </div>

        <p className="text-gray-500">No meetings found.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow hover:shadow-lg transition-all duration-300 p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-semibold text-gray-800">Recent Meetings</h2>
      </div>

       <p className="text-sm text-gray-500 mb-4">
          Showin the most recent meetings
      </p>

      <div className="space-y-4">
        {meetings.map((meeting) => (
          <div key={meeting.id} className="border-b pb-3 last:border-none">
            <h3 className="font-semibold">{meeting.title}</h3>

            <p className="text-sm text-gray-500">
              {new Date(meeting.date).toLocaleDateString()}
            </p>

            <div className="flex justify-between mt-2">
              <span className="text-sm">Attendance</span>

              <span className="font-semibold">
                {meeting.present}/{meeting.total}
              </span>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{
                  width: `${meeting.attendanceRate}%`,
                }}
              />
            </div>

            <p className="text-right text-xs text-gray-500 mt-1">
              {meeting.attendanceRate}%
            </p>
          </div>
        ))}
      </div>

      <button className="text-blue-600 text-sm hover:underline">
        View All →
      </button>
    </div>
  );
};

export default RecentMeetings;
