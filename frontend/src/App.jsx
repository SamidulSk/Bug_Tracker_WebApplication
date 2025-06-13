import { Routes, Route } from "react-router-dom";
import Login from "./components/Login.jsx";
import Signup from "./components/Signup.jsx";
import Dashboard from "./components/Dashboard.jsx";
import PageNotFound from "./components/PageNotFound.jsx";
import ProtectedRoute from "./components/common/ProtectedRoute.jsx";
import Landing from "./components/Landing.jsx"; // ✅ import

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} /> {/* ✅ Show Landing first */}
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
}

export default App;
