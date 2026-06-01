import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";

import Members from "./pages/Members";
import Attendance from "./pages/Attendance";
import AttendanceHistory from "./pages/AttendanceHistory";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">

        {/* Navigation */}
        <nav className="bg-white shadow-sm border-b px-4 py-3 flex gap-4">
          
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? "text-blue-600 font-semibold"
                : "text-gray-600"
            }
          >
            Members
          </NavLink>

          <NavLink
            to="/attendance"
            className={({ isActive }) =>
              isActive
                ? "text-blue-600 font-semibold"
                : "text-gray-600"
            }
          >
            Attendance
          </NavLink>

          <NavLink
            to="/attendance-history"
            className={({ isActive }) =>
              isActive
                ? "text-blue-600 font-semibold"
                : "text-gray-600"
            }
          >
            History
          </NavLink>

        </nav>

        {/* Pages */}
        <Routes>
          <Route path="/" element={<Members />} />

          <Route
            path="/attendance"
            element={<Attendance />}
          />

          <Route
            path="/attendance-history"
            element={<AttendanceHistory />}
          />
        </Routes>

      </div>
    </Router>
  );
}

export default App;