import { useEffect, useState } from "react";
import axios from "axios";
import PaymentStatusChart from "../components/charts/PaymentStatusChart";
import AttendanceTrendChart from "../components/charts/AttendanceTrendChart";
import MonthlyCollectionsChart from "../components/charts/MonthlyCollectionsChart";
import OutstandingMembers from "../components/dashboard/OutstandingMembers";
import RecentMeetings from "../components/dashboard/RecentMeetings";
import SummaryCard from "../components/dashboard/SummaryCard";
import {
  FaUsers,
  FaClipboardList,
  FaMoneyBillWave,
  FaExclamationTriangle,
} from "react-icons/fa";

import { MdEventAvailable } from "react-icons/md";

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
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800">Dashboard</h1>

        <p className="text-gray-500 mt-2">
          Welcome back 👋 Here's what's happening in your welfare today.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        <SummaryCard
          title="Members"
          value={dashboardData.summary.totalMembers}
          icon={<FaUsers className="text-blue-500" />}
        />

        <SummaryCard
          title="Meetings"
          value={dashboardData.summary.totalMeetings}
          icon={<FaClipboardList className="text-green-500" />}
        />

        <SummaryCard
          title="Attendance"
          value={`${dashboardData.summary.attendanceRate}%`}
          icon={<MdEventAvailable className="text-purple-500" />}
        />

        <SummaryCard
          title="Financial Records"
          value={dashboardData.summary.totalFinancialRecords}
          icon={<FaClipboardList className="text-orange-500" />}
        />

        <SummaryCard
          title="Collected"
          value={`Ksh ${dashboardData.summary.totalCollected.toLocaleString()}`}
          valueColor="text-green-600"
          icon={<FaMoneyBillWave className="text-green-500" />}
        />

        <SummaryCard
          title="Outstanding"
          value={`Ksh ${dashboardData.summary.totalOutstanding.toLocaleString()}`}
          valueColor="text-red-600"
          icon={<FaExclamationTriangle className="text-red-500" />}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-8">
        <PaymentStatusChart records={dashboardData.financialRecords} />

        <AttendanceTrendChart data={dashboardData.attendanceTrend} />
      </div>

      <div className="mt-6">
        <MonthlyCollectionsChart data={dashboardData.monthlyCollections} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-6">
        <OutstandingMembers members={dashboardData.outstandingMembers} />

        <RecentMeetings meetings={dashboardData.recentMeetings} />
      </div>
    </div>
  );
};

export default Dashboard;
