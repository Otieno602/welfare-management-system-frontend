import { useEffect, useState } from "react";
import axios from "axios";

const AttendanceHistory = () => {
  const [meetings, setMeetings] = useState([]);
  const [expandedMeeting, setExpandedMeeting] = useState(null);
  const [editingMeeting, setEditingMeeting] = useState(null);

  const API_URL = "http://localhost:5000/api/meetings";

  const toggleMeetingDetails = (meetingId) => {
    setExpandedMeeting((prev) => (prev === meetingId ? null : meetingId));
  };

  const handleEditClick = (meeting) => {
    setEditingMeeting({
      ...meeting,
    });
  };

  const handleUpdateMeeting = async (meetingId) => {
    try {
      setEditLoading(true);

      await axios.put(`${API_URL}/${meetingId}`, editingMeeting);

      const res = await axios.get(API_URL);

      setMeetings(res.data);

      setEditingMeeting(null);

      setEditLoading(false);
    } catch (error) {
      console.error(error);

      setEditLoading(false);
    }
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
      <h1 className="text-2xl font-bold mb-6">Attendance History</h1>

      <div className="space-y-4">
        {meetings.map((meeting) => {
          const presentCount = meeting.attendance.filter(
            (a) => a.status === "present",
          ).length;

          const absentCount = meeting.attendance.filter(
            (a) => a.status === "absent",
          ).length;

          const apologyCount = meeting.attendance.filter(
            (a) => a.status === "apology",
          ).length;

          return (
            <div
              key={meeting._id}
              className="bg-white border rounded-lg shadow-sm p-4"
            >
              <h2 className="text-lg font-semibold">{meeting.title}</h2>

              <p className="text-sm text-gray-500 mb-2">
                {new Date(meeting.date).toLocaleDateString()}
              </p>

              {meeting.notes && (
                <p className="text-gray-700 mb-3">{meeting.notes}</p>
              )}

              <div className="flex gap-4 text-sm font-medium">
                <p className="text-green-600">Present: {presentCount}</p>

                <p className="text-red-600">Absent: {absentCount}</p>

                <p className="text-yellow-600">Apology: {apologyCount}</p>

                <button
                  onClick={() => toggleMeetingDetails(meeting._id)}
                  className="mt-3 text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  {expandedMeeting === meeting._id
                    ? "Hide Details"
                    : "View Details"}
                </button>

                <button
                  onClick={() => handleEditClick(meeting)}
                  className="mt-3 ml-4 text-yellow-600 hover:text-yellow-800 text-sm font-medium"
                >
                  Edit Meeting
                </button>

                {expandedMeeting === meeting._id && (
                  <div className="mt-4 border-t pt-4 space-y-2">
                    {meeting.attendance.map((record) => (
                      <div
                        key={record._id}
                        className="flex justify-between items-center border rounded p-3"
                      >
                        <div>
                          <p className="font-medium">{record.member?.name}</p>

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
                {editingMeeting?._id === meeting._id && (
                  <div className="mt-4 border-t pt-4 space-y-4">
                    {/* Title */}
                    <input
                      type="text"
                      value={editingMeeting.title}
                      onChange={(e) =>
                        setEditingMeeting({
                          ...editingMeeting,
                          title: e.target.value,
                        })
                      }
                      className="w-full border rounded px-3 py-2"
                    />

                    {/* Notes */}
                    <textarea
                      value={editingMeeting.notes}
                      onChange={(e) =>
                        setEditingMeeting({
                          ...editingMeeting,
                          notes: e.target.value,
                        })
                      }
                      className="w-full border rounded px-3 py-2"
                    />

                    {/* Attendance */}
                    <div className="space-y-2">
                      {editingMeeting.attendance.map((record) => (
                        <div
                          key={record._id}
                          className="flex justify-between items-center border rounded p-3"
                        >
                          <div>
                            <p className="font-medium">{record.member?.name}</p>
                          </div>

                          <select
                            value={record.status}
                            onChange={(e) => {
                              const updatedAttendance =
                                editingMeeting.attendance.map((a) =>
                                  a._id === record._id
                                    ? {
                                        ...a,
                                        status: e.target.value,
                                      }
                                    : a,
                                );

                              setEditingMeeting({
                                ...editingMeeting,
                                attendance: updatedAttendance,
                              });
                            }}
                            className="border rounded px-3 py-2"
                          >
                            <option value="present">Present</option>

                            <option value="absent">Absent</option>

                            <option value="apology">Apology</option>
                          </select>
                        </div>
                      ))}
                    </div>

                    {/* Save Button */}
                    <button
                      onClick={() => handleUpdateMeeting(meeting._id)}
                      disabled={editLoading}
                      className={`text-white px-4 py-2 rounded transition ${
                        editLoading
                          ? "bg-blue-300 cursor-not-allowed"
                          : "bg-blue-500 hover:bg-blue-600"
                      }`}
                    >
                      {editLoading ? "Saving..." : "Save Changes"}
                    </button>
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
