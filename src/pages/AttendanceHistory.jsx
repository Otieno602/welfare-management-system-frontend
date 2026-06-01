import { useEffect, useState } from "react";
import axios from "axios";

const AttendanceHistory = () => {
  const [meetings, setMeetings] = useState([]);
  const [expandedMeeting, setExpandedMeeting] = useState(null);

  const API_URL = "http://localhost:5000/api/meetings";

  const toggleMeetingDetails = (meetingId) => {
        setExpandedMeeting((prev) =>
            prev === meetingId ? null : meetingId
        );
    };

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const res = await axios.get(API_URL);

        setMeetings(res.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchMeetings();
  }, []);

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">
        Attendance History
      </h1>

      <div className="space-y-4">

        {meetings.map((meeting) => {

          const presentCount = meeting.attendance.filter(
            (a) => a.status === "present"
          ).length;

          const absentCount = meeting.attendance.filter(
            (a) => a.status === "absent"
          ).length;

          const apologyCount = meeting.attendance.filter(
            (a) => a.status === "apology"
          ).length;

          return (
            <div
              key={meeting._id}
              className="bg-white border rounded-lg shadow-sm p-4"
            >
              <h2 className="text-lg font-semibold">
                {meeting.title}
              </h2>

              <p className="text-sm text-gray-500 mb-2">
                {new Date(meeting.date).toLocaleDateString()}
              </p>

              {meeting.notes && (
                <p className="text-gray-700 mb-3">
                  {meeting.notes}
                </p>
              )}

              <div className="flex gap-4 text-sm font-medium">
                <p className="text-green-600">
                  Present: {presentCount}
                </p>

                <p className="text-red-600">
                  Absent: {absentCount}
                </p>

                <p className="text-yellow-600">
                  Apology: {apologyCount}
                </p>

                <button
                    onClick={() => toggleMeetingDetails(meeting._id)}
                    className="mt-3 text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                    {expandedMeeting === meeting._id
                        ? "Hide Details"
                        : "View Details"
                    }
                </button>

                {expandedMeeting === meeting._id && (
                    <div className="mt-4 border-t pt-4 space-y-2">

                        {meeting.attendance.map((record) => (
                            <div
                                key={record._id}
                                className="flex justify-between items-center border rounded p-3"
                            >
                                <div>
                                    <p className="font-medium">
                                        {record.member?.name}
                                    </p>

                                    <p className="text-sm text-gray-500">
                                        {record.member?.phone}
                                    </p>

                                    <p className="text-sm text-gray-400">
                                        ID: {record.member?.idNumber}
                                    </p>
                                </div>

                                <span
                                    className={`text-sm font-medium px-3 py-1 rounded-full ${
                                        record.status === "present"
                                        ? "bg-green-100 text-green-700"
                                        : record.status === "absent"
                                        ? "bg-red-100 text-red-700"
                                        : "bg-yellow-100 text-yellow-700"
                                    }`}
                                >
                                    {record.status}
                                </span>
                            </div>
                        ))}

                    </div>
                 )}
              </div>
            </div>
          );
        })}

      </div>
    </div>
  );
};

export default AttendanceHistory;