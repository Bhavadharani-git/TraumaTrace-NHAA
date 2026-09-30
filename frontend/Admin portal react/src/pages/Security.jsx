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

export default function Security() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadSecurityProfile() {
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
              "Unable to load security information."
          );
        }

        if (!cancelled) {
          setUser(data);
        }
      } catch (err) {
        console.error(
          "Security page error:",
          err
        );

        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load security information."
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

    loadSecurityProfile();

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <Card>
        <div className="flex items-center justify-center py-space-xl text-body-md text-on-surface-variant">
          Loading security information...
        </div>
      </Card>
    );
  }

  return (
    <>
      <div>
        <h1 className="text-headline-lg text-on-surface">
          Security
        </h1>

        <p className="text-body-md text-on-surface-variant mt-1">
          Authentication and account security information
          for the current administrator.
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
                Security information could not be
                refreshed
              </p>

              <p className="text-label-sm mt-1">
                {error}
              </p>
            </div>
          </div>
        </Card>
      )}

      <Card>
        <div className="flex items-center gap-space-sm mb-space-md">
          <Icon
            name="lock"
            size={22}
            className="text-secondary"
          />

          <div>
            <h2 className="text-title-lg text-on-surface">
              Authentication
            </h2>

            <p className="text-label-sm text-on-surface-variant mt-1">
              Current authentication method used by the
              Admin portal.
            </p>
          </div>
        </div>

        <div className="border border-outline-variant rounded-lg p-space-md">
          <div className="flex items-start justify-between gap-space-md">
            <div className="flex items-start gap-space-sm">
              <Icon
                name="password"
                size={22}
                className="text-secondary mt-0.5"
              />

              <div>
                <p className="text-body-md-medium text-on-surface">
                  Email and Password
                </p>

                <p className="text-label-sm text-on-surface-variant mt-1">
                  Authentication is verified by the NHAA
                  FastAPI backend before a JWT access token
                  is issued.
                </p>
              </div>
            </div>

            <span className="shrink-0 px-space-sm py-1 rounded-full bg-success-container text-on-success-container text-label-sm font-semibold">
              Active
            </span>
          </div>
        </div>
      </Card>

      <Card>
        <div className="flex items-center gap-space-sm mb-space-md">
          <Icon
            name="vpn_key"
            size={22}
            className="text-secondary"
          />

          <div>
            <h2 className="text-title-lg text-on-surface">
              Session
            </h2>

            <p className="text-label-sm text-on-surface-variant mt-1">
              Current browser authentication session.
            </p>
          </div>
        </div>

        <div className="border border-outline-variant rounded-lg p-space-md">
          <div className="flex items-start gap-space-sm">
            <Icon
              name="computer"
              size={22}
              className="text-secondary mt-0.5"
            />

            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-space-sm">
                <div>
                  <p className="text-body-md-medium text-on-surface">
                    Current browser session
                  </p>

                  <p className="text-label-sm text-on-surface-variant mt-1">
                    {user?.email || "Authenticated administrator"}
                  </p>
                </div>

                <span className="px-space-sm py-1 rounded-full bg-success-container text-on-success-container text-label-sm font-semibold w-fit">
                  Active
                </span>
              </div>

              <p className="text-label-sm text-on-surface-variant mt-space-md">
                Session credentials are stored locally in
                this browser for the prototype and sent to
                protected backend endpoints as a Bearer
                token.
              </p>
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <div className="flex items-center gap-space-sm mb-space-md">
          <Icon
            name="verified_user"
            size={22}
            className="text-secondary"
          />

          <div>
            <h2 className="text-title-lg text-on-surface">
              Account Status
            </h2>

            <p className="text-label-sm text-on-surface-variant mt-1">
              Status returned by the backend.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
          <div className="border border-outline-variant rounded-lg p-space-md">
            <p className="text-label-md text-on-surface-variant">
              Account
            </p>

            <div className="flex items-center gap-2 mt-2">
              <span
                className={`h-2.5 w-2.5 rounded-full ${
                  user?.is_active
                    ? "bg-success"
                    : "bg-error"
                }`}
              />

              <span className="text-body-md-medium text-on-surface">
                {user?.is_active
                  ? "Active"
                  : "Inactive"}
              </span>
            </div>
          </div>

          <div className="border border-outline-variant rounded-lg p-space-md">
            <p className="text-label-md text-on-surface-variant">
              Role
            </p>

            <p className="text-body-md-medium text-on-surface mt-2 capitalize">
              {user?.role || "—"}
            </p>
          </div>

          <div className="border border-outline-variant rounded-lg p-space-md">
            <p className="text-label-md text-on-surface-variant">
              Account ID
            </p>

            <p className="text-body-md-medium text-on-surface mt-2">
              {user?.id ?? "—"}
            </p>
          </div>
        </div>
      </Card>

      <Card>
        <div className="flex items-center gap-space-sm mb-space-md">
          <Icon
            name="info"
            size={22}
            className="text-secondary"
          />

          <h2 className="text-title-lg text-on-surface">
            Security Notes
          </h2>
        </div>

        <div className="flex flex-col gap-space-sm">
          <div className="flex items-start gap-space-sm">
            <Icon
              name="check_circle"
              size={20}
              className="text-success mt-0.5"
            />

            <p className="text-body-md text-on-surface-variant">
              Password verification is performed by the
              backend.
            </p>
          </div>

          <div className="flex items-start gap-space-sm">
            <Icon
              name="check_circle"
              size={20}
              className="text-success mt-0.5"
            />

            <p className="text-body-md text-on-surface-variant">
              Protected API requests use the authenticated
              JWT access token.
            </p>
          </div>

          <div className="flex items-start gap-space-sm">
            <Icon
              name="check_circle"
              size={20}
              className="text-success mt-0.5"
            />

            <p className="text-body-md text-on-surface-variant">
              Multi-factor authentication is not enabled
              in the current prototype authentication flow.
            </p>
          </div>
        </div>
      </Card>
    </>
  );
}