import { NavLink } from "react-router-dom";

const SidebarLink = ({ to, icon, label, collapsed, onClick }) => {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center ${
          collapsed ? "justify-center" : "gap-3"
        } p-2 rounded-lg transition-all duration-200 ${
          isActive
            ? "bg-welfare-primary text-white shadow-sm"
            : "text-gray-300 hover:bg-welfare-sidebarHover hover:text-white"
        }`
      }
    >
      <span className="text-xl">{icon}</span>

      {!collapsed && <span>{label}</span>}
    </NavLink>
  );
};

export default SidebarLink;