import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

import Members from "./pages/Members";
import Attendance from "./pages/Attendance";
import AttendanceHistory from "./pages/AttendanceHistory";
import FinancialRecords from "./pages/FinancialRecords";
import Dashboard from "./pages/Dashboard";
import Layout from "./components/Layout";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">

        {/* Pages */}
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />

            <Route path="/members" element={<Members />} />

            <Route path="/attendance" element={<Attendance />} />

            <Route path="/attendance-history" element={<AttendanceHistory />} />

            <Route path="/financial-records" element={<FinancialRecords />} />
          </Routes>
        </Layout>
      </div>
    </Router>
  );
}

export default App;
