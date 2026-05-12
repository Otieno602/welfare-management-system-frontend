import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Members from "./pages/Members";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Members />} />
        <Route path="/members" element={<Members />} />
      </Routes>
    </Router>
  );
}

export default App;

