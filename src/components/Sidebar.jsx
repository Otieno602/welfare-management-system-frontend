import { useState } from "react";
import { MdDashboard } from "react-icons/md";
import {
  FaUsers,
  FaClipboardCheck,
  FaHistory,
  FaMoneyBillWave,
} from "react-icons/fa";

import SidebarLink from "./SidebarLink";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`fixed top-0 left-0 h-screen bg-gray-800 text-white transition-all duration-300 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-700 flex items-center justify-between">
        {!collapsed && (
          <div>
            <h2 className="text-2xl font-bold">WelfareHub</h2>
            <p className="text-sm text-gray-400">
              Management System
            </p>
          </div>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-2xl hover:text-blue-400 transition"
        >
          ☰
        </button>
      </div>

      {/* Navigation */}
      <nav className="p-3 flex flex-col gap-2">
        <SidebarLink
          to="/"
          icon={<MdDashboard size={20} />}
          label="Dashboard"
          collapsed={collapsed}
        />

        <SidebarLink
          to="/members"
          icon={<FaUsers size={20} />}
          label="Members"
          collapsed={collapsed}
        />

        <SidebarLink
          to="/attendance"
          icon={<FaClipboardCheck size={20} />}
          label="Attendance"
          collapsed={collapsed}
        />

        <SidebarLink
          to="/attendance-history"
          icon={<FaHistory size={20} />}
          label="Attendance History"
          collapsed={collapsed}
        />

        <SidebarLink
          to="/financial-records"
          icon={<FaMoneyBillWave size={20} />}
          label="Financial Records"
          collapsed={collapsed}
        />
      </nav>
    </aside>
  );
};

export default Sidebar;