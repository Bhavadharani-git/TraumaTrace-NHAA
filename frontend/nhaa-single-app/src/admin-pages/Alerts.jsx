import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Icon from "../admin-components/Icon";
import Card from "../admin-components/Card";
import StatusBadge from "../admin-components/StatusBadge";
import { API_BASE_URL } from "../apiConfig";

const SEVERITY_ICON_COLOR = {
  Critical: "text-error",
  High: "text-error",
  Medium: "text-warning",
  Low: "text-on-surface-variant",
};

function getAuthToken() {
  try {
    const auth = JSON.parse(
      localStorage.getItem("nhaa_auth") || "{}"
    );

    return auth?.access_token || auth?.token || "";
  } catch {
    return "";
  }
}

function formatStatus(status) {
  if (!status) {
    return "Unknown";
  }

  return String(status)
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatDate(date) {
  if (!date) {
    return "—";
  }

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return String(date);
  }

  return parsed.toLocaleString();
}

function getPriority(item) {
  return String(
    item?.priority ??
      item?.severity ??
      item?.priority_level ??
      ""
  ).toLowerCase();
}

function getSeverity(item) {
  const priority = getPriority(item);

  if (priority === "critical" || priority === "urgent") {
    return "Critical";
  }

  if (
    priority === "high" ||
    priority === "level_1" ||
    priority === "level_2"
  ) {
    return "High";
  }

  if (
    priority === "medium" ||
    priority === "moderate"
  ) {
    return "Medium";
  }

  return "Low";
}

function getCaseId(item) {
  return item?.complaint_id || item?.case_id || item?.id || "";
}

function getTitle(item, severity) {
  if (item?.alert_title) {
    return item.alert_title;
  }

  if (item?.title) {
    return item.title;
  }

  return `${severity} priority case requires attention`;
}

function getDescription(item) {
  if (item?.alert_description) {
    return item.alert_description;
  }

  if (item?.description) {
    return item.description;
  }

  const caseId = getCaseId(item);
  const status = formatStatus(item?.status);

  return `Case ${caseId || "record"} is currently marked as ${status}.`;
}

export default function Alerts() {
  const [cases, setCases] = useState([]);
  const [followUps, setFollowUps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadAlerts() {
      try {
        setLoading(true);
        setError("");

        const token = getAuthToken();

        if (!token) {
          throw new Error(
            "Authentication session not found."
          );
        }

        const headers = {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        };

        const [
          complaintsResponse,
          followUpsResponse,
        ] = await Promise.all([
          fetch(`${API_BASE_URL}/api/v1/complaints/`, {
            method: "GET",
            headers,
          }),
          fetch(`${API_BASE_URL}/api/v1/follow-ups/`, {
            method: "GET",
            headers,
          }),
        ]);

        let complaintsData = {};
        let followUpsData = {};

        try {
          complaintsData =
            await complaintsResponse.json();
        } catch {
          complaintsData = {};
        }

        try {
          followUpsData =
            await followUpsResponse.json();
        } catch {
          followUpsData = {};
        }

        if (!complaintsResponse.ok) {
          throw new Error(
            complaintsData?.detail ||
              "Unable to load cases for alerts."
          );
        }

        if (!followUpsResponse.ok) {
          throw new Error(
            followUpsData?.detail ||
              "Unable to load follow-ups for alerts."
          );
        }

        const loadedCases = Array.isArray(
          complaintsData?.complaints
        )
          ? complaintsData.complaints
          : Array.isArray(complaintsData)
          ? complaintsData
          : [];

        const loadedFollowUps = Array.isArray(
          followUpsData?.follow_ups
        )
          ? followUpsData.follow_ups
          : Array.isArray(followUpsData)
          ? followUpsData
          : [];

        if (!cancelled) {
          setCases(loadedCases);
          setFollowUps(loadedFollowUps);
        }
      } catch (err) {
        console.error(
          "Admin alerts error:",
          err
        );

        if (!cancelled) {
          setCases([]);
          setFollowUps([]);

          setError(
            err instanceof Error
              ? err.message
              : "Unable to load alerts."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadAlerts();

    return () => {
      cancelled = true;
    };
  }, []);

  const alerts = useMemo(() => {
    const caseAlerts = cases
      .filter((item) => {
        const priority = getPriority(item);

        return [
          "critical",
          "urgent",
          "high",
          "level_1",
          "level_2",
        ].includes(priority);
      })
      .map((item) => {
        const severity = getSeverity(item);
        const caseId = getCaseId(item);

        return {
          id: `case-${caseId}`,
          type: "case",
          severity,
          title: getTitle(item, severity),
          description: getDescription(item),
          caseId,
          raisedAt: formatDate(
            item?.updated_at ||
              item?.created_at
          ),
        };
      });

    const followUpAlerts = followUps
      .filter((followUp) => {
        const priority = String(
          followUp?.priority || ""
        ).toLowerCase();

        const status = String(
          followUp?.status || ""
        ).toLowerCase();

        return (
          ["critical", "urgent", "high"].includes(
            priority
          ) ||
          status === "overdue"
        );
      })
      .map((followUp) => {
        const priority = String(
          followUp?.priority || ""
        ).toLowerCase();

        const status = String(
          followUp?.status || ""
        ).toLowerCase();

        let severity = "High";

        if (
          status === "overdue" ||
          priority === "critical" ||
          priority === "urgent"
        ) {
          severity = "Critical";
        }

        const caseId =
          followUp?.complaint_id ||
          followUp?.case_id ||
          "";

        return {
          id: `follow-up-${followUp?.id}`,
          type: "follow-up",
          severity,
          title:
            followUp?.follow_up_type ||
            "Priority follow-up requires attention",
          description:
            followUp?.notes ||
            `A ${formatStatus(
              followUp?.priority || "high"
            ).toLowerCase()} priority follow-up is ${formatStatus(
              followUp?.status || "scheduled"
            ).toLowerCase()}.`,
          caseId,
          raisedAt: formatDate(
            followUp?.scheduled_at ||
              followUp?.created_at
          ),
        };
      });

    const severityRank = {
      Critical: 1,
      High: 2,
      Medium: 3,
      Low: 4,
    };

    return [...caseAlerts, ...followUpAlerts].sort(
      (a, b) =>
        severityRank[a.severity] -
        severityRank[b.severity]
    );
  }, [cases, followUps]);

  return (
    <>
      <div>
        <h1 className="text-headline-lg text-on-surface">
          Alerts & Escalated Cases
        </h1>

        <p className="text-body-md text-on-surface-variant mt-1">
          {loading
            ? "Loading active alerts..."
            : `${alerts.length} active alerts require administrator attention.`}
        </p>
      </div>

      {error && (
        <Card>
          <div className="flex items-start gap-3 text-error">
            <Icon name="error" size={20} />

            <div>
              <p className="text-body-md-medium">
                Unable to load alerts
              </p>

              <p className="text-label-sm mt-1">
                {error}
              </p>
            </div>
          </div>
        </Card>
      )}

      <div className="flex flex-col gap-space-md">
        {loading ? (
          <Card>
            <div className="flex items-center justify-center py-space-lg text-body-md text-on-surface-variant">
              Loading alerts...
            </div>
          </Card>
        ) : alerts.length === 0 ? (
          <Card>
            <div className="flex flex-col items-center justify-center py-space-xl text-center">
              <Icon
                name="check_circle"
                size={32}
                className="text-success mb-space-sm"
              />

              <p className="text-body-md-medium text-on-surface">
                No active alerts
              </p>

              <p className="text-label-sm text-on-surface-variant mt-1">
                There are currently no high-priority
                cases or follow-ups requiring
                administrator attention.
              </p>
            </div>
          </Card>
        ) : (
          alerts.map((alert) => {
            const iconColor =
              SEVERITY_ICON_COLOR[
                alert.severity
              ] || "text-on-surface-variant";

            const isCritical =
              alert.severity === "Critical";

            const isHigh =
              alert.severity === "High";

            return (
              <Card
                key={alert.id}
                className={`border-l-4 ${
                  isCritical || isHigh
                    ? "border-l-error"
                    : "border-l-warning"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-space-sm">
                  <div className="flex items-start gap-space-md">
                    <Icon
                      name="warning"
                      size={22}
                      className={`${iconColor} mt-0.5`}
                    />

                    <div>
                      <p className="text-body-md-medium text-on-surface">
                        {alert.title}
                      </p>

                      <p className="text-body-md text-on-surface-variant mt-1 max-w-[60ch]">
                        {alert.description}
                      </p>

                      <div className="flex items-center gap-space-sm mt-space-sm text-label-sm text-on-surface-variant">
                        {alert.caseId ? (
                          <>
                            <Link
                              to={`/cases/${alert.caseId}`}
                              className="text-secondary hover:underline"
                            >
                              {alert.caseId}
                            </Link>

                            <span>·</span>
                          </>
                        ) : null}

                        <span>
                          {alert.raisedAt}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-space-sm shrink-0">
                    <StatusBadge
                      label={alert.severity}
                    />

                    <button
                      type="button"
                      className="h-8 px-space-sm rounded border border-outline-variant text-label-sm font-semibold text-on-surface-variant hover:bg-surface-container-low transition-colors"
                    >
                      Acknowledge
                    </button>
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </>
  );
}
