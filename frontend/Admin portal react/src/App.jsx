import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import AppShell from "./components/AppShell";

import Login from "./pages/Login";
import TwoFactor from "./pages/TwoFactor";
import Dashboard from "./pages/Dashboard";
import CasesList from "./pages/CasesList";
import CaseDetails from "./pages/CaseDetails";
import Professionals from "./pages/Professionals";
import FollowUps from "./pages/FollowUps";
import Alerts from "./pages/Alerts";
import Reports from "./pages/Reports";
import AdminProfile from "./pages/AdminProfile";
import Security from "./pages/Security";
import AccessPermissions from "./pages/AccessPermissions";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

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
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}