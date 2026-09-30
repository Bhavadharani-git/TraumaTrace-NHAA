import { useEffect, useState } from "react";
import Card from "../admin-components/Card";
import Icon from "../admin-components/Icon";
import { API_BASE_URL } from "../apiConfig";

function getAuthData() {
  try {
    return JSON.parse(
      localStorage.getItem("nhaa_auth") || "{}"
    );
  } catch {
    return {};
  }
}

function formatRole(role) {
  if (!role) {
    return "Unknown";
  }

  return String(role)
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export default function AccessPermissions() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadAccess() {
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
              "Unable to load access information."
          );
        }

        if (!cancelled) {
          setUser(data);
        }
      } catch (err) {
        console.error(
          "Access permissions error:",
          err
        );

        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load access information."
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

    loadAccess();

    return () => {
      cancelled = true;
    };
  }, []);

  const isAdmin =
    String(user?.role || "").toLowerCase() ===
    "admin";

  const permissions = [
    {
      name: "View Cases",
      description:
        "View complaint and case records available to the administrator.",
      enabled: isAdmin,
      icon: "folder",
    },
    {
      name: "View Follow-ups",
      description:
        "View scheduled and completed follow-up records.",
      enabled: isAdmin,
      icon: "event",
    },
    {
      name: "View Professionals",
      description:
        "View professional accounts and their available profile information.",
      enabled: isAdmin,
      icon: "groups",
    },
    {
      name: "View Alerts",
      description:
        "View active high-priority cases and follow-up alerts.",
      enabled: isAdmin,
      icon: "warning",
    },
    {
      name: "View Reports",
      description:
        "View operational reports calculated from backend records.",
      enabled: isAdmin,
      icon: "analytics",
    },
    {
      name: "Manage Administration",
      description:
        "Access the administrator portal and its administrative views.",
      enabled: isAdmin,
      icon: "admin_panel_settings",
    },
  ];

  if (loading) {
    return (
      <Card>
        <div className="flex items-center justify-center py-space-xl text-body-md text-on-surface-variant">
          Loading access information...
        </div>
      </Card>
    );
  }

  return (
    <>
      <div>
        <h1 className="text-headline-lg text-on-surface">
          Access & Permissions
        </h1>

        <p className="text-body-md text-on-surface-variant mt-1">
          Permissions are determined by the authenticated
          backend user role.
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
                Access information could not be refreshed
              </p>

              <p className="text-label-sm mt-1">
                {error}
              </p>
            </div>
          </div>
        </Card>
      )}

      <Card>
        <div className="flex items-center gap-space-md">
          <div className="h-12 w-12 rounded-full bg-secondary-container flex items-center justify-center">
            <Icon
              name="admin_panel_settings"
              size={26}
              className="text-on-secondary-container"
            />
          </div>

          <div>
            <p className="text-label-md text-on-surface-variant">
              Authenticated account
            </p>

            <h2 className="text-title-lg text-on-surface mt-1">
              {user?.full_name || "Administrator"}
            </h2>

            <p className="text-label-sm text-on-surface-variant mt-1">
              {user?.email || "—"}
            </p>
          </div>
        </div>
      </Card>

      <Card>
        <div className="flex items-center justify-between gap-space-md mb-space-md">
          <div>
            <h2 className="text-title-lg text-on-surface">
              Current Role
            </h2>

            <p className="text-label-sm text-on-surface-variant mt-1">
              Role returned by the NHAA backend.
            </p>
          </div>

          <span className="px-space-sm py-1 rounded-full bg-secondary-container text-on-secondary-container text-label-sm font-semibold">
            {formatRole(user?.role)}
          </span>
        </div>

        <div className="border border-outline-variant rounded-lg p-space-md">
          <div className="flex items-center gap-space-sm">
            <Icon
              name="verified_user"
              size={22}
              className="text-secondary"
            />

            <div>
              <p className="text-body-md-medium text-on-surface">
                Backend-controlled access
              </p>

              <p className="text-label-sm text-on-surface-variant mt-1">
                The portal uses the authenticated user
                role returned by the API rather than a
                hard-coded user identity.
              </p>
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <div className="mb-space-md">
          <h2 className="text-title-lg text-on-surface">
            Permissions
          </h2>

          <p className="text-label-sm text-on-surface-variant mt-1">
            Access available to the current role in this
            prototype.
          </p>
        </div>

        <div className="flex flex-col gap-space-sm">
          {permissions.map((permission) => (
            <div
              key={permission.name}
              className="flex items-center justify-between gap-space-md border border-outline-variant rounded-lg p-space-md"
            >
              <div className="flex items-start gap-space-sm">
                <Icon
                  name={permission.icon}
                  size={22}
                  className={
                    permission.enabled
                      ? "text-secondary mt-0.5"
                      : "text-on-surface-variant mt-0.5"
                  }
                />

                <div>
                  <p className="text-body-md-medium text-on-surface">
                    {permission.name}
                  </p>

                  <p className="text-label-sm text-on-surface-variant mt-1">
                    {permission.description}
                  </p>
                </div>
              </div>

              <span
                className={`shrink-0 px-space-sm py-1 rounded-full text-label-sm font-semibold ${
                  permission.enabled
                    ? "bg-success-container text-on-success-container"
                    : "bg-surface-container text-on-surface-variant"
                }`}
              >
                {permission.enabled
                  ? "Granted"
                  : "Restricted"}
              </span>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <div className="flex items-start gap-space-sm">
          <Icon
            name="info"
            size={22}
            className="text-secondary mt-0.5"
          />

          <div>
            <p className="text-body-md-medium text-on-surface">
              Permission source
            </p>

            <p className="text-label-sm text-on-surface-variant mt-1">
              This page reflects the authenticated
              backend role. It does not create or modify
              permissions independently in the frontend.
            </p>

            <p className="text-label-sm text-on-surface-variant mt-space-sm">
              Current role:{" "}
              <span className="font-semibold text-on-surface">
                {formatRole(user?.role)}
              </span>
            </p>
          </div>
        </div>
      </Card>
    </>
  );
}
