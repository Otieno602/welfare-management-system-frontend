import { useEffect, useState } from "react";
import axios from "axios";

const Dashboard = () => {
  const [stats, setStats] = useState(null);

  const API_URL = "http://localhost:5000/api/dashboard";

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(API_URL);
        setStats(res.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchStats();
  }, []);

  if (!stats) {
    return (
      <div className="p-6 text-center">
        Loading Dashboard...
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">
        Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

        <div className="bg-white shadow rounded-lg p-5">
          <h2 className="text-gray-500">
            Total Members
          </h2>
          <p className="text-3xl font-bold">
            {stats.totalMembers}
          </p>
        </div>

        <div className="bg-white shadow rounded-lg p-5">
          <h2 className="text-gray-500">
            Total Meetings
          </h2>
          <p className="text-3xl font-bold">
            {stats.totalMeetings}
          </p>
        </div>

        <div className="bg-white shadow rounded-lg p-5">
          <h2 className="text-gray-500">
            Attendance Rate
          </h2>
          <p className="text-3xl font-bold">
            {stats.attendanceRate}%
          </p>
        </div>

        <div className="bg-white shadow rounded-lg p-5">
          <h2 className="text-gray-500">
            Financial Records
          </h2>
          <p className="text-3xl font-bold">
            {stats.totalFinancialRecords}
          </p>
        </div>

        <div className="bg-white shadow rounded-lg p-5">
          <h2 className="text-gray-500">
            Amount Collected
          </h2>
          <p className="text-3xl font-bold text-green-600">
            Ksh {stats.totalCollected}
          </p>
        </div>

        <div className="bg-white shadow rounded-lg p-5">
          <h2 className="text-gray-500">
            Outstanding Amount
          </h2>
          <p className="text-3xl font-bold text-red-600">
            Ksh {stats.totalOutstanding}
          </p>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;