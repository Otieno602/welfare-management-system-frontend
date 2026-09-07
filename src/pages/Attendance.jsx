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
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const presentCount = attendance.filter((a) => a.status === "present").length;

  const absentCount = attendance.filter((a) => a.status === "absent").length;

  const apologyCount = attendance.filter((a) => a.status === "apology").length;

  const filteredMembers = members.filter(
    (member) =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.idNumber.includes(searchTerm),
  );

  const MEMBERS_API = "http://localhost:5000/api/members";
  const MEETINGS_API = "http://localhost:5000/api/meetings";

  // Fetch members
  useEffect(() => {
    const fetchMembers = async () => {
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
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  // Handle meeting form
  const handleMeetingChange = (e) => {
    setMeetingData({
      ...meetingData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle attendance status change
  const handleStatusChange = (memberId, status) => {
    setAttendance((prev) =>
      prev.map((record) =>
        record.member === memberId ? { ...record, status } : record,
      ),
    );
  };

  // Save attendance
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

  return (
    <div className="min-h-screen p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800">Attendance</h1>

        <p className="text-gray-500 mt-2">
          Record attendance for your welfare meetings.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {/* Meeting Form */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Meeting Details
          </h2>

          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="text"
              name="title"
              placeholder="Meeting Title"
              value={meetingData.title}
              onChange={handleMeetingChange}
              className="w-full border border-gray-200 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />

            <textarea
              name="notes"
              placeholder="Meeting Notes"
              value={meetingData.notes}
              onChange={handleMeetingChange}
              className="w-full border border-gray-200 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              type="submit"
              disabled={saving}
              className={`text-white px-5 py-2.5 rounded-lg font-medium transition ${
                saving
                  ? "bg-blue-300 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {saving ? "Saving..." : "Save Attendance"}
            </button>
          </form>
        </div>

        {/* Attendance Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Present */}
          <div className="bg-white rounded-xl shadow p-5">
            <p className="text-sm font-medium text-gray-500">Present</p>

            <p className="text-3xl font-bold text-green-600 mt-2">
              {presentCount}
            </p>

            <p className="text-sm text-gray-400 mt-1">Members</p>
          </div>

          {/* Absent */}
          <div className="bg-white rounded-xl shadow p-5">
            <p className="text-sm font-medium text-gray-500">Absent</p>

            <p className="text-3xl font-bold text-red-600 mt-2">
              {absentCount}
            </p>

            <p className="text-sm text-gray-400 mt-1">Members</p>
          </div>

          {/* Apology */}
          <div className="bg-white rounded-xl shadow p-5">
            <p className="text-sm font-medium text-gray-500">Apology</p>

            <p className="text-3xl font-bold text-yellow-600 mt-2">
              {apologyCount}
            </p>

            <p className="text-sm text-gray-400 mt-1">Members</p>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search by name or ID number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border border-gray-200 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="text-sm text-gray-500 whitespace-nowrap">
              {searchTerm
                ? `Showing ${filteredMembers.length} of ${members.length}`
                : `${members.length} members`}
            </div>
          </div>
        </div>

        {/* Attendance List */}
        <div className="bg-white rounded-xl shadow p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-10 h-10 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>

              <p className="text-gray-600 font-medium">Loading members...</p>

              <p className="text-sm text-gray-400 mt-1">
                Please wait while we prepare the attendance list.
              </p>
            </div>
          ) : members.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="text-4xl mb-4">👥</div>

              <h3 className="text-lg font-semibold text-gray-800">
                No members yet
              </h3>

              <p className="text-sm text-gray-500 mt-1">
                Add members before recording attendance.
              </p>
            </div>
          ) : filteredMembers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="text-4xl mb-4">🔎</div>

              <h3 className="text-lg font-semibold text-gray-800">
                No members found
              </h3>

              <p className="text-sm text-gray-500 mt-1">
                Try searching with a different name or ID number.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredMembers.map((member) => {
                const currentAttendance = attendance.find(
                  (a) => a.member === member._id,
                );

                return (
                  <div
                    key={member._id}
                    className="border border-gray-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 transition-all duration-200 hover:shadow-sm"
                  >
                    <div>
                      <p className="font-semibold text-gray-800">
                        {member.name}
                      </p>

                      <p className="text-sm text-gray-500 mt-1">
                        {member.phone || "No phone number"}
                      </p>

                      <p className="text-xs text-gray-400 mt-1">
                        ID: {member.idNumber}
                      </p>
                    </div>

                    <select
                      value={currentAttendance?.status || "absent"}
                      onChange={(e) =>
                        handleStatusChange(member._id, e.target.value)
                      }
                      className={`border px-3 py-2.5 rounded-lg font-medium text-sm cursor-pointer focus:outline-none focus:ring-2 transition ${
                        currentAttendance?.status === "present"
                          ? "bg-green-50 border-green-200 text-green-700 focus:ring-green-500"
                          : currentAttendance?.status === "apology"
                            ? "bg-yellow-50 border-yellow-200 text-yellow-700 focus:ring-yellow-500"
                            : "bg-red-50 border-red-200 text-red-700 focus:ring-red-500"
                      }`}
                    >
                      <option value="present">✓ Present</option>
                      <option value="absent">✕ Absent</option>
                      <option value="apology">! Apology</option>
                    </select>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Attendance;
