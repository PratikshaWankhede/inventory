import { Routes, Route } from "react-router-dom";
import Login from "./pages/Auth/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import Invite from "./pages/Auth/Invite";
import SetPassword from "./pages/Auth/SetPassword";
import Toastify from "./components/common/Tostify";
import DashboardLayout from "./components/layout/DashboardLayout";

const AppRoutes = () => (
  <>
    <Toastify />
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route path="/set-password" element={<SetPassword />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />

        <Route
          path="invite"
          element={
            <ProtectedRoute roles={["ADMIN", "MANAGER"]}>
              <Invite />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  </>
);

export default AppRoutes;
