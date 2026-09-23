import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const Attendance = () => {
  const [members, setMembers] = useState([]);

  const [meetingData, setMeetingData] = useState({
    title: "",
    notes: "",
  });

  const [attendance, setAttendance] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const presentCount = attendance.filter(
    (a) => a.status === "present"
  ).length;

  const absentCount = attendance.filter(
    (a) => a.status === "absent"
  ).length;

  const apologyCount = attendance.filter(
    (a) => a.status === "apology"
  ).length;

  const filteredMembers = members.filter(
    (member) =>
      member.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      member.idNumber.includes(searchTerm)
  );

  const MEMBERS_API = "http://localhost:5000/api/members";
  const MEETINGS_API = "http://localhost:5000/api/meetings";

  // ============================================================
  // FETCH MEMBERS
  // ============================================================

  useEffect(() => {
    const fetchMembers = async () => {
      setLoading(true);

      try {
        const res = await axios.get(MEMBERS_API);

        setMembers(res.data);

        const defaultAttendance = res.data.map((member) => ({
          member: member._id,
          status: "absent",
        }));

        setAttendance(defaultAttendance);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load members");
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  // ============================================================
  // MEETING FORM
  // ============================================================

  const handleMeetingChange = (e) => {
    setMeetingData({
      ...meetingData,
      [e.target.name]: e.target.value,
    });
  };

  // ============================================================
  // ATTENDANCE STATUS
  // ============================================================

  const handleStatusChange = (memberId, status) => {
    setAttendance((prev) =>
      prev.map((record) =>
        record.member === memberId
          ? { ...record, status }
          : record
      )
    );
  };

  // ============================================================
  // SAVE ATTENDANCE
  // ============================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSaving(true);

    try {
      await axios.post(MEETINGS_API, {
        ...meetingData,
        attendance,
      });

      toast.success("Attendance saved successfully!");

      setMeetingData({
        title: "",
        notes: "",
      });

      const resetAttendance = members.map((member) => ({
        member: member._id,
        status: "absent",
      }));

      setAttendance(resetAttendance);
    } catch (error) {
      console.error(error);
      toast.error("Failed to save attendance");
    } finally {
      setSaving(false);
    }
  };

  // ============================================================
  // STATUS STYLES
  // ============================================================

  const getStatusStyles = (status) => {
    if (status === "present") {
      return {
        select:
          "bg-green-50 border-green-200 text-welfare-success focus:ring-welfare-success/30 focus:border-welfare-success",
        badge:
          "bg-green-50 text-welfare-success",
      };
    }

    if (status === "apology") {
      return {
        select:
          "bg-orange-50 border-orange-200 text-welfare-warning focus:ring-welfare-warning/30 focus:border-welfare-warning",
        badge:
          "bg-orange-50 text-welfare-warning",
      };
    }

    return {
      select:
        "bg-red-50 border-red-200 text-welfare-danger focus:ring-welfare-danger/30 focus:border-welfare-danger",
      badge:
        "bg-red-50 text-welfare-danger",
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
            Attendance
          </h1>

          <p className="text-welfare-text-secondary mt-2">
            Record attendance for your welfare meetings.
          </p>
        </div>

        {/* =====================================================
            MEETING DETAILS
        ====================================================== */}

        <div className="bg-welfare-surface border border-welfare-border rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 p-5 md:p-6 mb-6">

          <div className="mb-5">
            <h2 className="text-lg md:text-xl font-semibold text-welfare-text-primary">
              Meeting Details
            </h2>

            <p className="text-sm text-welfare-text-secondary mt-1">
              Add the meeting information before recording attendance.
            </p>
          </div>

          <div className="space-y-4">

            {/* Meeting Title */}

            <div>
              <label className="block text-sm font-medium text-welfare-text-secondary mb-1.5">
                Meeting Title
              </label>

              <input
                type="text"
                name="title"
                placeholder="e.g. September Welfare Meeting"
                value={meetingData.title}
                onChange={handleMeetingChange}
                className="w-full border border-welfare-border bg-welfare-surface px-4 py-3 rounded-lg text-welfare-text-primary placeholder:text-welfare-text-muted focus:outline-none focus:ring-2 focus:ring-welfare-primary/30 focus:border-welfare-primary transition"
                required
              />
            </div>

            {/* Meeting Notes */}

            <div>
              <label className="block text-sm font-medium text-welfare-text-secondary mb-1.5">
                Meeting Notes
              </label>

              <textarea
                name="notes"
                placeholder="Add any important meeting notes..."
                value={meetingData.notes}
                onChange={handleMeetingChange}
                rows={4}
                className="w-full border border-welfare-border bg-welfare-surface px-4 py-3 rounded-lg text-welfare-text-primary placeholder:text-welfare-text-muted focus:outline-none focus:ring-2 focus:ring-welfare-primary/30 focus:border-welfare-primary transition resize-y"
              />
            </div>

          </div>
        </div>

        {/* =====================================================
            ATTENDANCE SUMMARY
        ====================================================== */}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">

          {/* Present */}

          <div className="bg-welfare-surface border border-welfare-border rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 p-5 md:p-6">
            <div className="flex items-center justify-between gap-4">

              <div>
                <p className="text-sm font-medium text-welfare-text-secondary">
                  Present
                </p>

                <p className="text-2xl md:text-3xl font-bold text-welfare-success mt-2">
                  {presentCount}
                </p>

                <p className="text-sm text-welfare-text-muted mt-1">
                  Members
                </p>
              </div>

              <div className="shrink-0 w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-xl">
                ✓
              </div>

            </div>
          </div>

          {/* Absent */}

          <div className="bg-welfare-surface border border-welfare-border rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 p-5 md:p-6">
            <div className="flex items-center justify-between gap-4">

              <div>
                <p className="text-sm font-medium text-welfare-text-secondary">
                  Absent
                </p>

                <p className="text-2xl md:text-3xl font-bold text-welfare-danger mt-2">
                  {absentCount}
                </p>

                <p className="text-sm text-welfare-text-muted mt-1">
                  Members
                </p>
              </div>

              <div className="shrink-0 w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center text-xl">
                ✕
              </div>

            </div>
          </div>

          {/* Apology */}

          <div className="bg-welfare-surface border border-welfare-border rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 p-5 md:p-6">
            <div className="flex items-center justify-between gap-4">

              <div>
                <p className="text-sm font-medium text-welfare-text-secondary">
                  Apology
                </p>

                <p className="text-2xl md:text-3xl font-bold text-welfare-warning mt-2">
                  {apologyCount}
                </p>

                <p className="text-sm text-welfare-text-muted mt-1">
                  Members
                </p>
              </div>

              <div className="shrink-0 w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center text-xl">
                !
              </div>

            </div>
          </div>

        </div>

        {/* =====================================================
            SEARCH
        ====================================================== */}

        <div className="bg-welfare-surface border border-welfare-border rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 p-5 md:p-6 mb-6">

          <div className="mb-5">
            <h2 className="text-lg md:text-xl font-semibold text-welfare-text-primary">
              Attendance List
            </h2>

            <p className="text-sm text-welfare-text-secondary mt-1">
              Search for a member and mark their attendance.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

            <div className="flex-1">
              <label className="block text-sm font-medium text-welfare-text-secondary mb-1.5">
                Search Members
              </label>

              <input
                type="text"
                placeholder="Search by name or ID number..."
                value={searchTerm}
                onChange={(e) =>
                  setSearchTerm(e.target.value)
                }
                className="w-full border border-welfare-border bg-welfare-surface px-4 py-3 rounded-xl text-welfare-text-primary placeholder:text-welfare-text-muted focus:outline-none focus:ring-2 focus:ring-welfare-primary/30 focus:border-welfare-primary transition shadow-sm"
              />
            </div>

            <div className="sm:pt-6">
              <div className="inline-flex items-center bg-welfare-primaryLight text-welfare-primary px-3 py-2 rounded-lg text-sm font-medium">
                {searchTerm
                  ? `Showing ${filteredMembers.length} of ${members.length}`
                  : `${members.length} ${
                      members.length === 1
                        ? "member"
                        : "members"
                    }`}
              </div>
            </div>

          </div>
        </div>

        {/* =====================================================
            MEMBER ATTENDANCE
        ====================================================== */}

        <div className="bg-welfare-surface border border-welfare-border rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 p-5 md:p-6">

          {loading ? (
            /* Loading */

            <div className="flex flex-col items-center justify-center py-16 text-center">

              <div className="w-10 h-10 border-4 border-welfare-primaryLight border-t-welfare-primary rounded-full animate-spin mb-4"></div>

              <p className="text-welfare-text-primary font-medium">
                Loading members...
              </p>

              <p className="text-sm text-welfare-text-secondary mt-1">
                Please wait while we prepare the attendance list.
              </p>

            </div>
          ) : members.length === 0 ? (
            /* No Members */

            <div className="flex flex-col items-center justify-center py-16 text-center">

              <div className="w-14 h-14 rounded-full bg-welfare-primaryLight flex items-center justify-center text-2xl mb-4">
                👥
              </div>

              <h3 className="text-lg font-semibold text-welfare-text-primary">
                No members yet
              </h3>

              <p className="text-sm text-welfare-text-secondary mt-1 max-w-md">
                Add members before recording attendance.
              </p>

            </div>
          ) : filteredMembers.length === 0 ? (
            /* No Search Results */

            <div className="flex flex-col items-center justify-center py-16 text-center">

              <div className="w-14 h-14 rounded-full bg-welfare-primaryLight flex items-center justify-center text-2xl mb-4">
                🔎
              </div>

              <h3 className="text-lg font-semibold text-welfare-text-primary">
                No members found
              </h3>

              <p className="text-sm text-welfare-text-secondary mt-1 max-w-md">
                Try searching with a different name or ID number.
              </p>

            </div>
          ) : (
            /* Member List */

            <div className="space-y-3">

              {filteredMembers.map((member) => {
                const currentAttendance =
                  attendance.find(
                    (a) => a.member === member._id
                  );

                const status =
                  currentAttendance?.status || "absent";

                const statusStyles =
                  getStatusStyles(status);

                return (
                  <div
                    key={member._id}
                    className="border border-welfare-border rounded-xl p-4 md:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 hover:shadow-sm transition-all duration-200"
                  >

                    {/* Member Information */}

                    <div className="min-w-0">

                      <div className="flex items-center gap-3">

                        <div className="w-10 h-10 shrink-0 rounded-full bg-welfare-primaryLight flex items-center justify-center text-welfare-primary font-semibold">
                          {member.name
                            ?.charAt(0)
                            .toUpperCase()}
                        </div>

                        <div className="min-w-0">

                          <p className="font-semibold text-welfare-text-primary truncate">
                            {member.name}
                          </p>

                          <p className="text-sm text-welfare-text-secondary mt-0.5">
                            {member.phone ||
                              "No phone number"}
                          </p>

                        </div>

                      </div>

                      <p className="text-xs text-welfare-text-muted mt-3 ml-[52px]">
                        ID: {member.idNumber}
                      </p>

                    </div>

                    {/* Attendance Selector */}

                    <div className="flex items-center gap-3 sm:shrink-0">

                      <span
                        className={`hidden sm:inline-flex px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${statusStyles.badge}`}
                      >
                        {status}
                      </span>

                      <select
                        value={status}
                        onChange={(e) =>
                          handleStatusChange(
                            member._id,
                            e.target.value
                          )
                        }
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

                  </div>
                );
              })}

            </div>
          )}

        </div>

        {/* =====================================================
            SUBMISSION AREA
        ====================================================== */}

        {!loading && members.length > 0 && (
          <div className="mt-6 bg-welfare-surface border border-welfare-border rounded-xl shadow-sm p-5 md:p-6">

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

              <div>
                <h2 className="text-base md:text-lg font-semibold text-welfare-text-primary">
                  Ready to Save?
                </h2>

                <p className="text-sm text-welfare-text-secondary mt-1">
                  Review the attendance summary above before saving this meeting.
                </p>
              </div>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={saving}
                className={`w-full lg:w-auto px-6 py-3 rounded-lg font-medium text-white shadow-sm transition-all duration-200 ${
                  saving
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-welfare-primary hover:bg-welfare-primaryDark hover:shadow"
                }`}
              >
                {saving ? "Saving..." : "Save Attendance"}
              </button>

            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default Attendance;