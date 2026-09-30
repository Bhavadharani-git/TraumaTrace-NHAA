import { useEffect, useState } from "react";
import Card from "../components/Card";
import Icon from "../components/Icon";

const API_BASE_URL = "http://127.0.0.1:8000";

function getAuthData() {
  try {
    return JSON.parse(
      localStorage.getItem("nhaa_auth") || "{}"
    );
  } catch {
    return {};
  }
}

function formatDate(dateValue) {
  if (!dateValue) {
    return "—";
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return String(dateValue);
  }

  return date.toLocaleString();
}

export default function AdminProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadProfile() {
      try {
        setLoading(true);
        setError("");

        const auth = getAuthData();
        const token =
          auth?.access_token || auth?.token || "";

        if (!token) {
          throw new Error(
            "Authentication session not found."
          );
        }

        const response = await fetch(
          `${API_BASE_URL}/api/v1/auth/me`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        let data = {};

        try {
          data = await response.json();
        } catch {
          data = {};
        }

        if (!response.ok) {
          throw new Error(
            data?.detail ||
              "Unable to load administrator profile."
          );
        }

        if (!cancelled) {
          setUser(data);
        }
      } catch (err) {
        console.error(
          "Admin profile error:",
          err
        );

        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load profile."
          );

          const auth = getAuthData();

          if (auth?.user) {
            setUser(auth.user);
          }
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadProfile();

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <Card>
        <div className="flex items-center justify-center py-space-xl text-body-md text-on-surface-variant">
          Loading administrator profile...
        </div>
      </Card>
    );
  }

  return (
    <>
      <div>
        <h1 className="text-headline-lg text-on-surface">
          Administrator Profile
        </h1>

        <p className="text-body-md text-on-surface-variant mt-1">
          Account information for the currently
          authenticated administrator.
        </p>
      </div>

      {error && (
        <Card>
          <div className="flex items-start gap-3 text-error">
            <Icon
              name="error"
              size={20}
            />

            <div>
              <p className="text-body-md-medium">
                Profile could not be refreshed
              </p>

              <p className="text-label-sm mt-1">
                {error}
              </p>
            </div>
          </div>
        </Card>
      )}

      <Card>
        <div className="flex flex-col sm:flex-row sm:items-center gap-space-md">
          <div className="h-16 w-16 rounded-full bg-secondary-container flex items-center justify-center shrink-0">
            <Icon
              name="admin_panel_settings"
              size={32}
              className="text-on-secondary-container"
            />
          </div>

          <div>
            <h2 className="text-headline-sm text-on-surface">
              {user?.full_name || "Administrator"}
            </h2>

            <p className="text-body-md text-on-surface-variant mt-1">
              {user?.email || "—"}
            </p>
          </div>
        </div>
      </Card>

      <Card>
        <div className="flex items-center gap-space-sm mb-space-md">
          <Icon
            name="person"
            size={22}
            className="text-secondary"
          />

          <h2 className="text-title-lg text-on-surface">
            Account Information
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
          <div>
            <p className="text-label-md text-on-surface-variant">
              Full Name
            </p>

            <p className="text-body-md text-on-surface mt-1">
              {user?.full_name || "—"}
            </p>
          </div>

          <div>
            <p className="text-label-md text-on-surface-variant">
              Email Address
            </p>

            <p className="text-body-md text-on-surface mt-1">
              {user?.email || "—"}
            </p>
          </div>

          <div>
            <p className="text-label-md text-on-surface-variant">
              Account ID
            </p>

            <p className="text-body-md text-on-surface mt-1">
              {user?.id ?? "—"}
            </p>
          </div>

          <div>
            <p className="text-label-md text-on-surface-variant">
              Role
            </p>

            <p className="text-body-md text-on-surface mt-1 capitalize">
              {user?.role || "—"}
            </p>
          </div>

          <div>
            <p className="text-label-md text-on-surface-variant">
              Account Status
            </p>

            <div className="flex items-center gap-2 mt-1">
              <span
                className={`h-2.5 w-2.5 rounded-full ${
                  user?.is_active
                    ? "bg-success"
                    : "bg-error"
                }`}
              />

              <span className="text-body-md text-on-surface">
                {user?.is_active
                  ? "Active"
                  : "Inactive"}
              </span>
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <div className="flex items-center gap-space-sm mb-space-md">
          <Icon
            name="security"
            size={22}
            className="text-secondary"
          />

          <h2 className="text-title-lg text-on-surface">
            Authentication
          </h2>
        </div>

        <div className="flex items-center justify-between gap-space-md border border-outline-variant rounded-lg p-space-md">
          <div>
            <p className="text-body-md-medium text-on-surface">
              Password Authentication
            </p>

            <p className="text-label-sm text-on-surface-variant mt-1">
              This account authenticates through the
              NHAA FastAPI login service.
            </p>
          </div>

          <span className="shrink-0 px-space-sm py-1 rounded-full bg-success-container text-on-success-container text-label-sm font-semibold">
            Active
          </span>
        </div>
      </Card>

      <Card>
        <div className="flex items-center gap-space-sm mb-space-md">
          <Icon
            name="verified_user"
            size={22}
            className="text-secondary"
          />

          <h2 className="text-title-lg text-on-surface">
            Access
          </h2>
        </div>

        <div className="border border-outline-variant rounded-lg p-space-md">
          <p className="text-body-md-medium text-on-surface">
            Administrator Access
          </p>

          <p className="text-label-sm text-on-surface-variant mt-1">
            Your access level is provided by the
            authenticated backend user role.
          </p>

          <p className="text-label-sm text-on-surface-variant mt-space-sm">
            Current role:{" "}
            <span className="font-semibold text-on-surface">
              {user?.role || "—"}
            </span>
          </p>
        </div>
      </Card>
    </>
  );
}