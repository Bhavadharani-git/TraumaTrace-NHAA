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

export default function Settings() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [settings, setSettings] = useState({
    compactMode: false,
    browserNotifications: false,
  });

  useEffect(() => {
    let cancelled = false;

    async function loadSettings() {
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
              "Unable to load account settings."
          );
        }

        if (!cancelled) {
          setUser(data);
        }
      } catch (err) {
        console.error(
          "Settings page error:",
          err
        );

        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load settings."
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

    loadSettings();

    return () => {
      cancelled = true;
    };
  }, []);

  function updateSetting(name, value) {
    setSettings((current) => ({
      ...current,
      [name]: value,
    }));
  }

  if (loading) {
    return (
      <Card>
        <div className="flex items-center justify-center py-space-xl text-body-md text-on-surface-variant">
          Loading settings...
        </div>
      </Card>
    );
  }

  return (
    <>
      <div>
        <h1 className="text-headline-lg text-on-surface">
          Settings
        </h1>

        <p className="text-body-md text-on-surface-variant mt-1">
          Administrator portal preferences and account
          information.
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
                Account information could not be
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
            name="person"
            size={22}
            className="text-secondary"
          />

          <div>
            <h2 className="text-title-lg text-on-surface">
              Account
            </h2>

            <p className="text-label-sm text-on-surface-variant mt-1">
              Current authenticated administrator.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
          <div className="border border-outline-variant rounded-lg p-space-md">
            <p className="text-label-md text-on-surface-variant">
              Name
            </p>

            <p className="text-body-md-medium text-on-surface mt-1">
              {user?.full_name || "—"}
            </p>
          </div>

          <div className="border border-outline-variant rounded-lg p-space-md">
            <p className="text-label-md text-on-surface-variant">
              Email
            </p>

            <p className="text-body-md-medium text-on-surface mt-1">
              {user?.email || "—"}
            </p>
          </div>

          <div className="border border-outline-variant rounded-lg p-space-md">
            <p className="text-label-md text-on-surface-variant">
              Role
            </p>

            <p className="text-body-md-medium text-on-surface mt-1 capitalize">
              {user?.role || "—"}
            </p>
          </div>

          <div className="border border-outline-variant rounded-lg p-space-md">
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

              <span className="text-body-md-medium text-on-surface">
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
            name="tune"
            size={22}
            className="text-secondary"
          />

          <div>
            <h2 className="text-title-lg text-on-surface">
              Interface Preferences
            </h2>

            <p className="text-label-sm text-on-surface-variant mt-1">
              These preferences affect this browser only.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-space-sm">
          <div className="flex items-center justify-between gap-space-md border border-outline-variant rounded-lg p-space-md">
            <div>
              <p className="text-body-md-medium text-on-surface">
                Compact Mode
              </p>

              <p className="text-label-sm text-on-surface-variant mt-1">
                Use a more compact layout for dashboard
                content.
              </p>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={settings.compactMode}
              onClick={() =>
                updateSetting(
                  "compactMode",
                  !settings.compactMode
                )
              }
              className={`relative h-6 w-11 rounded-full transition-colors ${
                settings.compactMode
                  ? "bg-secondary"
                  : "bg-surface-container-high"
              }`}
            >
              <span
                className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-transform ${
                  settings.compactMode
                    ? "translate-x-6"
                    : "translate-x-1"
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between gap-space-md border border-outline-variant rounded-lg p-space-md">
            <div>
              <p className="text-body-md-medium text-on-surface">
                Browser Notifications
              </p>

              <p className="text-label-sm text-on-surface-variant mt-1">
                Allow this browser to receive notification
                prompts.
              </p>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={
                settings.browserNotifications
              }
              onClick={() =>
                updateSetting(
                  "browserNotifications",
                  !settings.browserNotifications
                )
              }
              className={`relative h-6 w-11 rounded-full transition-colors ${
                settings.browserNotifications
                  ? "bg-secondary"
                  : "bg-surface-container-high"
              }`}
            >
              <span
                className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-transform ${
                  settings.browserNotifications
                    ? "translate-x-6"
                    : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>
      </Card>

      <Card>
        <div className="flex items-center gap-space-sm mb-space-md">
          <Icon
            name="storage"
            size={22}
            className="text-secondary"
          />

          <div>
            <h2 className="text-title-lg text-on-surface">
              Data & Session
            </h2>

            <p className="text-label-sm text-on-surface-variant mt-1">
              Information about how this prototype stores
              the current session.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-space-sm">
          <div className="border border-outline-variant rounded-lg p-space-md">
            <p className="text-body-md-medium text-on-surface">
              Authentication Session
            </p>

            <p className="text-label-sm text-on-surface-variant mt-1">
              The current JWT authentication response is
              stored in this browser under the NHAA
              authentication session.
            </p>
          </div>

          <div className="border border-outline-variant rounded-lg p-space-md">
            <p className="text-body-md-medium text-on-surface">
              Backend Data
            </p>

            <p className="text-label-sm text-on-surface-variant mt-1">
              Cases, follow-ups, users, and other
              operational records are loaded from the
              FastAPI backend and shared database.
            </p>
          </div>
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
              Prototype note
            </p>

            <p className="text-label-sm text-on-surface-variant mt-1">
              Interface preferences above are local
              browser preferences. They are not written to
              the backend and do not modify the shared NHAA
              database.
            </p>
          </div>
        </div>
      </Card>
    </>
  );
}
