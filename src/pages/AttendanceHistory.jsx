import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const formatMeetingNotes = (notes) => {
  if (!notes) return [];

  return notes
    .split(/\s+(?=\d+\.)/)
    .map((note) => note.trim())
    .filter(Boolean)
    .map((note) => note.replace(/^(\d+\.)\s*\.\s*/, "$1 "));
};

const AttendanceHistory = () => {
  const [meetings, setMeetings] = useState([]);
  const [expandedMeeting, setExpandedMeeting] = useState(null);
  const [editingMeeting, setEditingMeeting] = useState(null);
  const [editLoading, setEditLoading] = useState(false);

  const API_URL = "http://localhost:5000/api/meetings";

  const toggleMeetingDetails = (meetingId) => {
    setExpandedMeeting((prev) => (prev === meetingId ? null : meetingId));
  };

  const handleEditClick = (meeting) => {
    setExpandedMeeting(null);

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

    toast.success("Meeting updated successfully!");
  } catch (error) {
    console.error(error);

    toast.error("Failed to update meeting");
  } finally {
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
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800">Attendance History</h1>

        <p className="text-gray-500 mt-2">
          Review previous meetings, attendance records and member participation.
        </p>
      </div>

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
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-200 hover:shadow-md"
            >
              {/* Meeting Summary */}
              <div className="p-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">
                      {meeting.title}
                    </h2>

                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(meeting.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Notes */}
                {meeting.notes && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-500 mb-2">
                      Meeting Notes
                    </p>

                    <div className="space-y-2">
                      {formatMeetingNotes(meeting.notes).map((note, index) => (
                        <p
                          key={index}
                          className="text-gray-600 leading-relaxed"
                        >
                          {note}
                        </p>
                      ))}
                    </div>
                  </div>
                )}

                {/* Attendance Summary */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
                  <div className="bg-green-50 border border-green-100 rounded-xl p-4">
                    <p className="text-sm font-medium text-green-700">
                      Present
                    </p>

                    <p className="text-2xl font-bold text-green-700 mt-1">
                      {presentCount}
                    </p>

                    <p className="text-xs text-green-600 mt-1">Members</p>
                  </div>

                  <div className="bg-red-50 border border-red-100 rounded-xl p-4">
                    <p className="text-sm font-medium text-red-700">Absent</p>

                    <p className="text-2xl font-bold text-red-700 mt-1">
                      {absentCount}
                    </p>

                    <p className="text-xs text-red-600 mt-1">Members</p>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-4">
                    <p className="text-sm font-medium text-yellow-700">
                      Apology
                    </p>

                    <p className="text-2xl font-bold text-yellow-700 mt-1">
                      {apologyCount}
                    </p>

                    <p className="text-xs text-yellow-600 mt-1">Members</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row sm:justify-end gap-2 mt-6 pt-5 border-t border-gray-100">
                  <button
                    onClick={() => toggleMeetingDetails(meeting._id)}
                    className="px-4 py-2.5 rounded-lg text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 transition"
                  >
                    {expandedMeeting === meeting._id
                      ? "Hide Details"
                      : "View Details"}
                  </button>

                  <button
                    onClick={() => handleEditClick(meeting)}
                    className="px-4 py-2.5 rounded-lg text-sm font-medium text-yellow-700 bg-yellow-50 hover:bg-yellow-100 transition"
                  >
                    Edit Meeting
                  </button>
                </div>
              </div>

              {/* Attendance Details */}
              {expandedMeeting === meeting._id && (
                <div className="border-t border-gray-200 bg-gray-50 p-6">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                      Attendance Details
                    </h3>

                    <p className="text-sm text-gray-500 mt-1">
                      Attendance recorded for this meeting.
                    </p>
                  </div>

                  <div className="space-y-3">
                    {meeting.attendance.map((record) => (
                      <div
                        key={record._id}
                        className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
                      >
                        <div>
                          <p className="font-medium text-gray-800">
                            {record.member?.name}
                          </p>

                          <p className="text-sm text-gray-500 mt-1">
                            {record.member?.phone || "No phone number"}
                          </p>

                          <p className="text-xs text-gray-400 mt-1">
                            ID: {record.member?.idNumber}
                          </p>
                        </div>

                        <span
                          className={`text-sm font-medium px-3 py-1.5 rounded-full ${
                            record.status === "present"
                              ? "bg-green-100 text-green-700"
                              : record.status === "absent"
                                ? "bg-red-100 text-red-700"
                                : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {record.status === "present"
                            ? "✓ Present"
                            : record.status === "absent"
                              ? "✕ Absent"
                              : "! Apology"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {editingMeeting?._id === meeting._id && (
                <div className="border-t border-gray-200 bg-gray-50 p-6">
                  {/* Edit Header */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-800">
                      Edit Meeting
                    </h3>

                    <p className="text-sm text-gray-500 mt-1">
                      Update the meeting details and attendance records.
                    </p>
                  </div>

                  {/* Meeting Information */}
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Meeting Title
                      </label>

                      <input
                        type="text"
                        value={editingMeeting.title}
                        onChange={(e) =>
                          setEditingMeeting({
                            ...editingMeeting,
                            title: e.target.value,
                          })
                        }
                        className="w-full border border-gray-200 bg-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Meeting Notes
                      </label>

                      <textarea
                        value={editingMeeting.notes || ""}
                        onChange={(e) =>
                          setEditingMeeting({
                            ...editingMeeting,
                            notes: e.target.value,
                          })
                        }
                        rows="4"
                        className="w-full border border-gray-200 bg-white px-4 py-3 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {/* Attendance */}
                  <div className="mt-8">
                    <div className="mb-4">
                      <h4 className="text-base font-semibold text-gray-800">
                        Attendance
                      </h4>

                      <p className="text-sm text-gray-500 mt-1">
                        Update the attendance status for each member.
                      </p>
                    </div>

                    <div className="space-y-3">
                      {editingMeeting.attendance.map((record) => (
                        <div
                          key={record._id}
                          className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                        >
                          <div>
                            <p className="font-medium text-gray-800">
                              {record.member?.name}
                            </p>

                            <p className="text-sm text-gray-500 mt-1">
                              {record.member?.phone || "No phone number"}
                            </p>

                            <p className="text-xs text-gray-400 mt-1">
                              ID: {record.member?.idNumber}
                            </p>
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
                            className={`border px-3 py-2.5 rounded-lg font-medium text-sm cursor-pointer focus:outline-none focus:ring-2 transition ${
                              record.status === "present"
                                ? "bg-green-50 border-green-200 text-green-700 focus:ring-green-500"
                                : record.status === "apology"
                                  ? "bg-yellow-50 border-yellow-200 text-yellow-700 focus:ring-yellow-500"
                                  : "bg-red-50 border-red-200 text-red-700 focus:ring-red-500"
                            }`}
                          >
                            <option value="present">✓ Present</option>
                            <option value="absent">✕ Absent</option>
                            <option value="apology">! Apology</option>
                          </select>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 mt-8 pt-5 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => setEditingMeeting(null)}
                      disabled={editLoading}
                      className="px-5 py-2.5 rounded-lg text-sm font-medium text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 transition"
                    >
                      Cancel
                    </button>

                    <button
                      type="button"
                      onClick={() => handleUpdateMeeting(meeting._id)}
                      disabled={editLoading}
                      className={`px-5 py-2.5 rounded-lg text-sm font-medium text-white transition ${
                        editLoading
                          ? "bg-blue-300 cursor-not-allowed"
                          : "bg-blue-600 hover:bg-blue-700"
                      }`}
                    >
                      {editLoading ? "Saving Changes..." : "Save Changes"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AttendanceHistory;
