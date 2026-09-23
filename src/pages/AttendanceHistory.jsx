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
  const [loading, setLoading] = useState(true);

  const API_URL = "http://localhost:5000/api/meetings";

  // ============================================================
  // TOGGLE MEETING DETAILS
  // ============================================================

  const toggleMeetingDetails = (meetingId) => {
    setExpandedMeeting((prev) =>
      prev === meetingId ? null : meetingId
    );
  };

  // ============================================================
  // EDIT MEETING
  // ============================================================

  const handleEditClick = (meeting) => {
    setExpandedMeeting(null);

    setEditingMeeting({
      ...meeting,
    });
  };

  // ============================================================
  // UPDATE MEETING
  // ============================================================

  const handleUpdateMeeting = async (meetingId) => {
    try {
      setEditLoading(true);

      await axios.put(
        `${API_URL}/${meetingId}`,
        editingMeeting
      );

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

  // ============================================================
  // FETCH MEETINGS
  // ============================================================

  useEffect(() => {
    const fetchMeetings = async () => {
      setLoading(true);

      try {
        const res = await axios.get(API_URL);

        setMeetings(res.data);
      } catch (error) {
        console.error(error);

        toast.error("Failed to load attendance history");
      } finally {
        setLoading(false);
      }
    };

    fetchMeetings();
  }, []);

  // ============================================================
  // STATUS STYLES
  // ============================================================

  const getStatusStyles = (status) => {
    if (status === "present") {
      return {
        badge:
          "bg-green-50 text-welfare-success",
        select:
          "bg-green-50 border-green-200 text-welfare-success focus:ring-welfare-success/30 focus:border-welfare-success",
      };
    }

    if (status === "apology") {
      return {
        badge:
          "bg-orange-50 text-welfare-warning",
        select:
          "bg-orange-50 border-orange-200 text-welfare-warning focus:ring-welfare-warning/30 focus:border-welfare-warning",
      };
    }

    return {
      badge:
        "bg-red-50 text-welfare-danger",
      select:
        "bg-red-50 border-red-200 text-welfare-danger focus:ring-welfare-danger/30 focus:border-welfare-danger",
    };
  };

  return (
    <div className="min-h-screen bg-welfare-background p-6 md:p-8">
      <div className="max-w-7xl mx-auto">

        {/* =====================================================
            PAGE HEADER
        ====================================================== */}

        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-welfare-text-primary">
            Attendance History
          </h1>

          <p className="text-welfare-text-secondary mt-2">
            Review previous meetings, attendance records and member participation.
          </p>
        </div>

        {/* =====================================================
            LOADING
        ====================================================== */}

        {loading ? (
          <div className="bg-welfare-surface border border-welfare-border rounded-xl shadow-sm p-8 md:p-12">

            <div className="flex flex-col items-center justify-center text-center">

              <div className="w-10 h-10 border-4 border-welfare-primaryLight border-t-welfare-primary rounded-full animate-spin mb-4"></div>

              <p className="text-welfare-text-primary font-medium">
                Loading attendance history...
              </p>

              <p className="text-sm text-welfare-text-secondary mt-1">
                Please wait while we retrieve previous meetings.
              </p>

            </div>

          </div>
        ) : meetings.length === 0 ? (

          /* ===================================================
             EMPTY STATE
          ==================================================== */

          <div className="bg-welfare-surface border border-welfare-border rounded-xl shadow-sm p-8 md:p-12">

            <div className="flex flex-col items-center justify-center text-center">

              <div className="w-14 h-14 rounded-full bg-welfare-primaryLight flex items-center justify-center text-2xl mb-4">
                📅
              </div>

              <h3 className="text-lg font-semibold text-welfare-text-primary">
                No attendance history yet
              </h3>

              <p className="text-sm text-welfare-text-secondary mt-1 max-w-md">
                Saved welfare meetings and their attendance records will appear here.
              </p>

            </div>

          </div>
        ) : (

          /* ===================================================
             MEETINGS
          ==================================================== */

          <div className="space-y-5">

            {meetings.map((meeting) => {

              const presentCount =
                meeting.attendance.filter(
                  (a) => a.status === "present"
                ).length;

              const absentCount =
                meeting.attendance.filter(
                  (a) => a.status === "absent"
                ).length;

              const apologyCount =
                meeting.attendance.filter(
                  (a) => a.status === "apology"
                ).length;

              return (
                <div
                  key={meeting._id}
                  className="bg-welfare-surface border border-welfare-border rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
                >

                  {/* =================================================
                      MEETING SUMMARY
                  ================================================== */}

                  <div className="p-5 md:p-6">

                    {/* Header */}

                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">

                      <div className="min-w-0">

                        <h2 className="text-lg md:text-xl font-semibold text-welfare-text-primary">
                          {meeting.title}
                        </h2>

                        <p className="text-sm text-welfare-text-secondary mt-1">
                          {new Date(
                            meeting.date
                          ).toLocaleDateString()}
                        </p>

                      </div>

                      <div className="self-start bg-welfare-primaryLight text-welfare-primary px-3 py-1.5 rounded-lg text-xs font-semibold">
                        Meeting
                      </div>

                    </div>

                    {/* Notes */}

                    {meeting.notes && (
                      <div className="mt-5">

                        <p className="text-sm font-medium text-welfare-text-secondary mb-2">
                          Meeting Notes
                        </p>

                        <div className="bg-welfare-background border border-welfare-border rounded-xl p-4 space-y-2">

                          {formatMeetingNotes(
                            meeting.notes
                          ).map((note, index) => (
                            <p
                              key={index}
                              className="text-sm md:text-base text-welfare-text-secondary leading-relaxed"
                            >
                              {note}
                            </p>
                          ))}

                        </div>

                      </div>
                    )}

                    {/* Attendance Summary */}

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">

                      {/* Present */}

                      <div className="bg-green-50 border border-green-100 rounded-xl p-4">

                        <p className="text-sm font-medium text-welfare-success">
                          Present
                        </p>

                        <p className="text-2xl font-bold text-welfare-success mt-1">
                          {presentCount}
                        </p>

                        <p className="text-xs text-welfare-success/80 mt-1">
                          Members
                        </p>

                      </div>

                      {/* Absent */}

                      <div className="bg-red-50 border border-red-100 rounded-xl p-4">

                        <p className="text-sm font-medium text-welfare-danger">
                          Absent
                        </p>

                        <p className="text-2xl font-bold text-welfare-danger mt-1">
                          {absentCount}
                        </p>

                        <p className="text-xs text-welfare-danger/80 mt-1">
                          Members
                        </p>

                      </div>

                      {/* Apology */}

                      <div className="bg-orange-50 border border-orange-100 rounded-xl p-4">

                        <p className="text-sm font-medium text-welfare-warning">
                          Apology
                        </p>

                        <p className="text-2xl font-bold text-welfare-warning mt-1">
                          {apologyCount}
                        </p>

                        <p className="text-xs text-welfare-warning/80 mt-1">
                          Members
                        </p>

                      </div>

                    </div>

                    {/* Actions */}

                    <div className="flex flex-col sm:flex-row sm:justify-end gap-2 mt-6 pt-5 border-t border-welfare-border">

                      <button
                        type="button"
                        onClick={() =>
                          toggleMeetingDetails(
                            meeting._id
                          )
                        }
                        className="w-full sm:w-auto px-4 py-2.5 rounded-lg text-sm font-medium text-welfare-primary bg-welfare-primaryLight hover:bg-welfare-primaryLight transition"
                      >
                        {expandedMeeting === meeting._id
                          ? "Hide Details"
                          : "View Details"}
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleEditClick(meeting)
                        }
                        className="w-full sm:w-auto px-4 py-2.5 rounded-lg text-sm font-medium text-welfare-text-primary bg-welfare-background border border-welfare-border hover:bg-welfare-primaryLight hover:text-welfare-primary transition"
                      >
                        Edit Meeting
                      </button>

                    </div>

                  </div>

                  {/* =================================================
                      ATTENDANCE DETAILS
                  ================================================== */}

                  {expandedMeeting === meeting._id && (
                    <div className="border-t border-welfare-border bg-welfare-background p-5 md:p-6">

                      <div className="mb-5">

                        <h3 className="text-lg font-semibold text-welfare-text-primary">
                          Attendance Details
                        </h3>

                        <p className="text-sm text-welfare-text-secondary mt-1">
                          Attendance recorded for this meeting.
                        </p>

                      </div>

                      <div className="space-y-3">

                        {meeting.attendance.map(
                          (record) => {

                            const statusStyles =
                              getStatusStyles(
                                record.status
                              );

                            return (
                              <div
                                key={record._id}
                                className="bg-welfare-surface border border-welfare-border rounded-xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
                              >

                                <div className="min-w-0">

                                  <p className="font-semibold text-welfare-text-primary">
                                    {record.member?.name}
                                  </p>

                                  <p className="text-sm text-welfare-text-secondary mt-1">
                                    {record.member?.phone ||
                                      "No phone number"}
                                  </p>

                                  <p className="text-xs text-welfare-text-muted mt-1">
                                    ID:{" "}
                                    {record.member?.idNumber}
                                  </p>

                                </div>

                                <span
                                  className={`self-start sm:self-auto px-3 py-1.5 rounded-full text-xs font-semibold ${statusStyles.badge}`}
                                >
                                  {record.status ===
                                  "present"
                                    ? "✓ Present"
                                    : record.status ===
                                      "absent"
                                    ? "✕ Absent"
                                    : "! Apology"}
                                </span>

                              </div>
                            );
                          }
                        )}

                      </div>

                    </div>
                  )}

                  {/* =================================================
                      EDIT MEETING
                  ================================================== */}

                  {editingMeeting?._id ===
                    meeting._id && (
                    <div className="border-t border-welfare-border bg-welfare-background p-5 md:p-6">

                      {/* Edit Header */}

                      <div className="mb-6">

                        <h3 className="text-lg font-semibold text-welfare-text-primary">
                          Edit Meeting
                        </h3>

                        <p className="text-sm text-welfare-text-secondary mt-1">
                          Update the meeting details and attendance records.
                        </p>

                      </div>

                      {/* Meeting Information */}

                      <div className="bg-welfare-surface border border-welfare-border rounded-xl p-5 md:p-6">

                        <div className="space-y-5">

                          {/* Meeting Title */}

                          <div>

                            <label className="block text-sm font-medium text-welfare-text-secondary mb-1.5">
                              Meeting Title
                            </label>

                            <input
                              type="text"
                              value={
                                editingMeeting.title
                              }
                              onChange={(e) =>
                                setEditingMeeting({
                                  ...editingMeeting,
                                  title:
                                    e.target.value,
                                })
                              }
                              className="w-full border border-welfare-border bg-welfare-surface px-4 py-3 rounded-lg text-welfare-text-primary placeholder:text-welfare-text-muted focus:outline-none focus:ring-2 focus:ring-welfare-primary/30 focus:border-welfare-primary transition"
                            />

                          </div>

                          {/* Meeting Notes */}

                          <div>

                            <label className="block text-sm font-medium text-welfare-text-secondary mb-1.5">
                              Meeting Notes
                            </label>

                            <textarea
                              value={
                                editingMeeting.notes ||
                                ""
                              }
                              onChange={(e) =>
                                setEditingMeeting({
                                  ...editingMeeting,
                                  notes:
                                    e.target.value,
                                })
                              }
                              rows={4}
                              className="w-full border border-welfare-border bg-welfare-surface px-4 py-3 rounded-lg text-welfare-text-primary placeholder:text-welfare-text-muted focus:outline-none focus:ring-2 focus:ring-welfare-primary/30 focus:border-welfare-primary transition resize-y"
                            />

                          </div>

                        </div>

                      </div>

                      {/* Attendance */}

                      <div className="mt-6">

                        <div className="mb-4">

                          <h4 className="text-base font-semibold text-welfare-text-primary">
                            Attendance
                          </h4>

                          <p className="text-sm text-welfare-text-secondary mt-1">
                            Update the attendance status for each member.
                          </p>

                        </div>

                        <div className="space-y-3">

                          {editingMeeting.attendance.map(
                            (record) => {

                              const statusStyles =
                                getStatusStyles(
                                  record.status
                                );

                              return (
                                <div
                                  key={record._id}
                                  className="bg-welfare-surface border border-welfare-border rounded-xl p-4 md:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                                >

                                  <div className="min-w-0">

                                    <p className="font-semibold text-welfare-text-primary">
                                      {record.member?.name}
                                    </p>

                                    <p className="text-sm text-welfare-text-secondary mt-1">
                                      {record.member?.phone ||
                                        "No phone number"}
                                    </p>

                                    <p className="text-xs text-welfare-text-muted mt-1">
                                      ID:{" "}
                                      {record.member?.idNumber}
                                    </p>

                                  </div>

                                  <select
                                    value={
                                      record.status
                                    }
                                    onChange={(e) => {
                                      const updatedAttendance =
                                        editingMeeting.attendance.map(
                                          (a) =>
                                            a._id ===
                                            record._id
                                              ? {
                                                  ...a,
                                                  status:
                                                    e.target
                                                      .value,
                                                }
                                              : a
                                        );

                                      setEditingMeeting({
                                        ...editingMeeting,
                                        attendance:
                                          updatedAttendance,
                                      });
                                    }}
                                    className={`w-full sm:w-auto border px-3 py-2.5 rounded-lg font-medium text-sm cursor-pointer focus:outline-none focus:ring-2 transition ${statusStyles.select}`}
                                  >
                                    <option value="present">
                                      ✓ Present
                                    </option>

                                    <option value="absent">
                                      ✕ Absent
                                    </option>

                                    <option value="apology">
                                      ! Apology
                                    </option>
                                  </select>

                                </div>
                              );
                            }
                          )}

                        </div>

                      </div>

                      {/* Edit Actions */}

                      <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 mt-8 pt-5 border-t border-welfare-border">

                        <button
                          type="button"
                          onClick={() =>
                            setEditingMeeting(null)
                          }
                          disabled={editLoading}
                          className="w-full sm:w-auto px-5 py-2.5 rounded-lg text-sm font-medium text-welfare-text-secondary bg-welfare-surface border border-welfare-border hover:bg-welfare-primaryLight hover:text-welfare-primary transition"
                        >
                          Cancel
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleUpdateMeeting(
                              meeting._id
                            )
                          }
                          disabled={editLoading}
                          className={`w-full sm:w-auto px-5 py-2.5 rounded-lg text-sm font-medium text-white shadow-sm transition ${
                            editLoading
                              ? "bg-gray-400 cursor-not-allowed"
                              : "bg-welfare-primary hover:bg-welfare-primaryDark hover:shadow"
                          }`}
                        >
                          {editLoading
                            ? "Saving Changes..."
                            : "Save Changes"}
                        </button>

                      </div>

                    </div>
                  )}

                </div>
              );
            })}

          </div>
        )}

      </div>
    </div>
  );
};

export default AttendanceHistory;