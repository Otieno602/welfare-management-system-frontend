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
        console.log(
          "Monthly Collections:",
          res.data.monthlyCollections
        );

        setDashboardData(res.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchStats();
  }, []);

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-welfare-background flex items-center justify-center p-6">
        <p className="text-welfare-text-secondary">
          Loading Dashboard...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-welfare-background p-6 md:p-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-welfare-text-primary">
            Dashboard
          </h1>

          <p className="text-welfare-text-secondary mt-2">
            Welcome back. Here's what's happening in your welfare today.
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 md:gap-6">
          <SummaryCard
            title="Members"
            value={dashboardData.summary.totalMembers}
            icon={<FaUsers />}
          />

          <SummaryCard
            title="Meetings"
            value={dashboardData.summary.totalMeetings}
            icon={<FaClipboardList />}
          />

          <SummaryCard
            title="Attendance"
            value={`${dashboardData.summary.attendanceRate}%`}
            icon={<MdEventAvailable />}
          />

          <SummaryCard
            title="Financial Records"
            value={dashboardData.summary.totalFinancialRecords}
            icon={<FaClipboardList />}
          />

          <SummaryCard
            title="Collected"
            value={`Ksh ${dashboardData.summary.totalCollected.toLocaleString()}`}
            valueColor="text-welfare-success"
            icon={<FaMoneyBillWave />}
            iconColor="text-welfare-success"
          />

          <SummaryCard
            title="Outstanding"
            value={`Ksh ${dashboardData.summary.totalOutstanding.toLocaleString()}`}
            valueColor="text-welfare-danger"
            icon={<FaExclamationTriangle />}
            iconColor="text-welfare-danger"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 md:gap-6 mt-6 md:mt-8">
          <PaymentStatusChart
            records={dashboardData.financialRecords}
          />

          <AttendanceTrendChart
            data={dashboardData.attendanceTrend}
          />
        </div>

        <div className="mt-5 md:mt-6">
          <MonthlyCollectionsChart
            data={dashboardData.monthlyCollections}
          />
        </div>

        {/* Dashboard Lists */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 md:gap-6 mt-5 md:mt-6">
          <OutstandingMembers
            members={dashboardData.outstandingMembers}
          />

          <RecentMeetings
            meetings={dashboardData.recentMeetings}
          />
        </div>

      </div>
    </div>
  );
};

export default Dashboard;