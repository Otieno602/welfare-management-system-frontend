import { useEffect, useState } from "react";
import axios from "axios";
import PaymentStatusChart from "../components/charts/PaymentStatusChart";
import AttendanceTrendChart from "../components/charts/AttendanceTrendChart";
import MonthlyCollectionsChart from "../components/charts/MonthlyCollectionsChart";
import OutstandingMembers from "../components/dashboard/OutstandingMembers";
import RecentMeetings from "../components/dashboard/RecentMeetings";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);

  const API_URL = "http://localhost:5000/api/dashboard";

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(API_URL);
        console.log(res.data);
        console.log("Monthly Collections:", res.data.monthlyCollections);
        setDashboardData(res.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchStats();
  }, []);

  if (!dashboardData) {
    return <div className="p-6 text-center">Loading Dashboard...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white shadow rounded-lg p-5">
          <h2 className="text-gray-500">Total Members</h2>
          <p className="text-3xl font-bold">
            {dashboardData.summary.totalMembers}
          </p>
        </div>

        <div className="bg-white shadow rounded-lg p-5">
          <h2 className="text-gray-500">Total Meetings</h2>
          <p className="text-3xl font-bold">
            {dashboardData.summary.totalMeetings}
          </p>
        </div>

        <div className="bg-white shadow rounded-lg p-5">
          <h2 className="text-gray-500">Attendance Rate</h2>
          <p className="text-3xl font-bold">
            {dashboardData.summary.attendanceRate}%
          </p>
        </div>

        <div className="bg-white shadow rounded-lg p-5">
          <h2 className="text-gray-500">Financial Records</h2>
          <p className="text-3xl font-bold">
            {dashboardData.summary.totalFinancialRecords}
          </p>
        </div>

        <div className="bg-white shadow rounded-lg p-5">
          <h2 className="text-gray-500">Amount Collected</h2>
          <p className="text-3xl font-bold text-green-600">
            Ksh {dashboardData.summary.totalCollected}
          </p>
        </div>

        <div className="bg-white shadow rounded-lg p-5">
          <h2 className="text-gray-500">Outstanding Amount</h2>
          <p className="text-3xl font-bold text-red-600">
            Ksh {dashboardData.summary.totalOutstanding}
          </p>
        </div>
      </div>

      <div className="mt-8">
        <PaymentStatusChart records={dashboardData.financialRecords} />
      </div>

      <div className="mt-8">
        <AttendanceTrendChart data={dashboardData.attendanceTrend} />
      </div>

      <div className="mt-8">
        <MonthlyCollectionsChart data={dashboardData.monthlyCollections} />
      </div>

      <div className="mt-8">
        <OutstandingMembers members={dashboardData.outstandingMembers} />
      </div>

      <div className="mt-8">
        <RecentMeetings meetings={dashboardData.recentMeetings} />
      </div>
    </div>
  );
};

export default Dashboard;
