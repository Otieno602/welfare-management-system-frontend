const RecentMeetings = ({ meetings = [] }) => {
  if (meetings.length === 0) {
    return (
      <div className="bg-welfare-surface border border-welfare-border rounded-xl shadow-sm p-5 md:p-6">
        <div className="mb-5">
          <h2 className="text-lg md:text-xl font-semibold text-welfare-text-primary">
            Recent Meetings
          </h2>
        </div>

        <p className="text-sm text-welfare-text-secondary">
          No meetings found.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-welfare-surface border border-welfare-border rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 p-5 md:p-6">
      <div className="mb-5">
        <h2 className="text-lg md:text-xl font-semibold text-welfare-text-primary">
          Recent Meetings
        </h2>

        <p className="text-sm text-welfare-text-secondary mt-1">
          Showing the most recent meetings
        </p>
      </div>

      <div className="space-y-4">
        {meetings.map((meeting) => (
          <div
            key={meeting.id}
            className="pb-4 border-b border-welfare-border last:border-none last:pb-0"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="font-semibold text-welfare-text-primary truncate">
                  {meeting.title}
                </h3>

                <p className="text-sm text-welfare-text-secondary mt-1">
                  {new Date(meeting.date).toLocaleDateString()}
                </p>
              </div>

              <span className="text-sm font-semibold text-welfare-text-primary shrink-0">
                {meeting.present}/{meeting.total}
              </span>
            </div>

            <div className="flex items-center justify-between mt-3">
              <span className="text-sm text-welfare-text-secondary">
                Attendance
              </span>

              <span className="text-xs font-medium text-welfare-text-secondary">
                {meeting.attendanceRate}%
              </span>
            </div>

            <div className="w-full bg-welfare-primaryLight rounded-full h-2 mt-2 overflow-hidden">
              <div
                className="bg-welfare-primary h-2 rounded-full transition-all duration-500"
                style={{
                  width: `${meeting.attendanceRate}%`,
                }}
              />
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

export default RecentMeetings;