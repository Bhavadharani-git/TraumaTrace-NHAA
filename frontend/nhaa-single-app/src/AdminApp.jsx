import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./admin-context/AuthContext";
import AppShell from "./admin-components/AppShell";
import Login from "./admin-pages/Login";
import TwoFactor from "./admin-pages/TwoFactor";
import Dashboard from "./admin-pages/Dashboard";
import CasesList from "./admin-pages/CasesList";
import CaseDetails from "./admin-pages/CaseDetails";
import Professionals from "./admin-pages/Professionals";
import FollowUps from "./admin-pages/FollowUps";
import Alerts from "./admin-pages/Alerts";
import Reports from "./admin-pages/Reports";
import AdminProfile from "./admin-pages/AdminProfile";
import Security from "./admin-pages/Security";
import AccessPermissions from "./admin-pages/AccessPermissions";
import Settings from "./admin-pages/Settings";
import NotFound from "./admin-pages/NotFound";

function RequireAuth({ children }) {
  const { authenticated } = useAuth();

  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function RootRedirect() {
  const { authenticated } = useAuth();

  if (authenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Navigate to="/login" replace />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />

      <Route path="/login" element={<Login />} />

      {/* Kept for compatibility, but MFA is no longer used. */}
      <Route
        path="/verify"
        element={<Navigate to="/login" replace />}
      />

      <Route
        element={
          <RequireAuth>
            <AppShell />
          </RequireAuth>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/cases" element={<CasesList />} />
        <Route path="/cases/:caseId" element={<CaseDetails />} />
        <Route path="/professionals" element={<Professionals />} />
        <Route path="/follow-ups" element={<FollowUps />} />
        <Route path="/alerts" element={<Alerts />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/profile/admin" element={<AdminProfile />} />
        <Route path="/profile/security" element={<Security />} />
        <Route path="/profile/access" element={<AccessPermissions />} />
        <Route path="/profile/settings" element={<Settings />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default function App() {
  return (
    <div className="admin-portal">
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}