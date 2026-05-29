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

  const presentCount = attendance.filter(
    (a) => a.status === "present"
  ).length;

  const absentCount = attendance.filter(
    (a) => a.status === "absent"
  ).length;

  const apologyCount = attendance.filter(
    (a) => a.status === "apology"
  ).length;

  const filteredMembers = members.filter((member) =>
    member.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase()) ||

    member.idNumber.includes(searchTerm)
  );

  const MEMBERS_API = "http://localhost:5000/api/members";
  const MEETINGS_API = "http://localhost:5000/api/meetings";

  // Fetch members
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await axios.get(MEMBERS_API);

        setMembers(res.data);

        // Default everyone to present
        const defaultAttendance = res.data.map((member) => ({
          member: member._id,
          status: "present",
        }));

        setAttendance(defaultAttendance);
      } catch (error) {
        console.error(error);
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
        record.member === memberId
          ? { ...record, status }
          : record
      )
    );
  };

  // Save attendance
  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    try {
      await axios.post(MEETINGS_API, {
        ...meetingData,
        attendance,
      });

      toast.success("Attendance saved successfully!");
      setLoading(false);

      setMeetingData({
        title: "",
        notes: "",
      });

      const resetAttendance = members.map((member) => ({
        member: member._id,
        status: "present",
      }));

setAttendance(resetAttendance);
      
    } catch (error) {
      setLoading(false);
      console.error(error);
      toast.error("Failed to save attendance");
    }
  };

  return (
    <div className="h-screen overflow-hidden p-4 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">
        Attendance
      </h1>

      <div className="flex flex-col gap-4 h-[calc(100vh-80px)]">

        {/* Meeting Form */}
        <div className="bg-white border rounded-lg p-4 shadow-sm">
          <form
            onSubmit={handleSubmit}
            className="space-y-3"
          >
            <input
              type="text"
              name="title"
              placeholder="Meeting Title"
              value={meetingData.title}
              onChange={handleMeetingChange}
              className="w-full border px-3 py-2 rounded"
              required
            />

            <textarea
              name="notes"
              placeholder="Meeting Notes"
              value={meetingData.notes}
              onChange={handleMeetingChange}
              className="w-full border px-3 py-2 rounded"
            />

            <button
              disabled={loading}
              className={`text-white px-4 py-2 rounded transition ${
                loading
                  ? "bg-blue-300 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600"
              }`}
            >
              {loading ? "Saving..." : "Save Attendance"}
            </button>
          </form>
        </div>

        {/* Attendance Summary */}
        <div className="bg-white border rounded-lg shadow-sm p-4">
          <div className="flex justify-between text-sm font-medium">

            <p className="text-green-600">
              Present: {presentCount}
            </p>

            <p className="text-red-600">
              Absent: {absentCount}
            </p>

            <p className="text-yellow-600">
              Apology: {apologyCount}
            </p>

          </div>
        </div>

        {/* Search */}
        <div className="bg-white border rounded-lg shadow-sm p-4">
          <input
            type="text"
            placeholder="Search member..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        {/* Attendance List */}
        <div className="flex-1 overflow-hidden bg-white border rounded-lg shadow-sm p-4">
          <div className="overflow-y-auto h-full space-y-3 pr-2">

            {filteredMembers.map((member) => {
              const currentAttendance = attendance.find(
                (a) => a.member === member._id
              );

              return (
                <div
                  key={member._id}
                  className="border rounded-lg p-3 flex items-center justify-between"
                >
                  <div>
                    <p className="font-semibold">
                      {member.name}
                    </p>

                    <p className="text-sm text-gray-500">
                      {member.phone}
                    </p>

                    <p className="text-sm text-gray-500">
                      ID: {member.idNumber}
                    </p>
                  </div>

                  <select
                    value={currentAttendance?.status || "present"}
                    onChange={(e) =>
                      handleStatusChange(
                        member._id,
                        e.target.value
                      )
                    }
                    className="border rounded px-3 py-2"
                  >
                    <option value="present">
                      Present
                    </option>

                    <option value="absent">
                      Absent
                    </option>

                    <option value="apology">
                      Apology
                    </option>
                  </select>
                </div>
              );
            })}

          </div>
        </div>

      </div>
    </div>
  );
};

export default Attendance;