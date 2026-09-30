import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Icon from "../components/Icon";
import Card from "../components/Card";
import StatusBadge from "../components/StatusBadge";

function getPriority(item) {
  return String(
    item.priority ??
      item.severity ??
      item.priority_level ??
      ""
  ).toLowerCase();
}

function formatStatus(status) {
  if (!status) return "Unknown";

  return status
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatDate(date) {
  if (!date) return "—";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return date;
  }

  return parsed.toLocaleDateString();
}

export default function Dashboard() {
  const [cases, setCases] = useState([]);
  const [followUps, setFollowUps] = useState([]);
  const [adminUser, setAdminUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const auth = localStorage.getItem("nhaa_auth");

        if (!auth) {
          throw new Error("Authentication session not found.");
        }

        const authData = JSON.parse(auth);

        const token =
          authData?.access_token ||
          authData?.token;

        if (!token) {
          throw new Error("Access token not found.");
        }

        setAdminUser(authData?.user || {});

        const headers = {
          Authorization: `Bearer ${token}`,
        };

        // ================================
        // LOAD CASES
        // ================================

        const complaintsResponse = await fetch(
          "http://127.0.0.1:8000/api/v1/complaints/",
          {
            headers,
          }
        );

        if (!complaintsResponse.ok) {
          throw new Error(
            "Unable to load cases from backend."
          );
        }

        const complaintsData =
          await complaintsResponse.json();

        setCases(
          Array.isArray(complaintsData.complaints)
            ? complaintsData.complaints
            : []
        );

        // ================================
        // LOAD FOLLOW-UPS
        // ================================

        const followUpsResponse = await fetch(
          "http://127.0.0.1:8000/api/v1/follow-ups/",
          {
            headers,
          }
        );

        if (!followUpsResponse.ok) {
          throw new Error(
            "Unable to load follow-ups from backend."
          );
        }

        const followUpsData =
          await followUpsResponse.json();

        setFollowUps(
          Array.isArray(followUpsData.follow_ups)
            ? followUpsData.follow_ups
            : []
        );
      } catch (error) {
        console.error(
          "Admin dashboard error:",
          error
        );

        setError(
          error instanceof Error
            ? error.message
            : "Unable to load dashboard data."
        );

        setCases([]);
        setFollowUps([]);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  // ================================
  // CASE STATISTICS
  // ================================

  const totalCases = cases.length;

  const highRiskOpen = cases.filter((item) => {
    const priority = getPriority(item);

    const highRisk = [
      "urgent",
      "critical",
      "high",
      "level_1",
      "level_2",
    ].includes(priority);

    const resolved =
      item.status === "resolved" ||
      item.status === "closed";

    return highRisk && !resolved;
  }).length;

  const resolvedThisMonth = cases.filter((item) => {
    if (
      item.status !== "resolved" &&
      item.status !== "closed"
    ) {
      return false;
    }

    if (!item.created_at) {
      return false;
    }

    const date = new Date(item.created_at);
    const now = new Date();

    return (
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear()
    );
  }).length;

  // ================================
  // RECENT CASES
  // ================================

  const recentCases = [...cases]
    .sort((a, b) => {
      const first = a.created_at
        ? new Date(a.created_at).getTime()
        : 0;

      const second = b.created_at
        ? new Date(b.created_at).getTime()
        : 0;

      return second - first;
    })
    .slice(0, 4);

  // ================================
  // PRIORITY FOLLOW-UPS
  // ================================

  const urgentFollowUps = [...followUps]
    .filter((followUp) =>
      ["critical", "high"].includes(
        String(followUp.priority || "").toLowerCase()
      )
    )
    .sort((a, b) => {
      const first = a.scheduled_at
        ? new Date(a.scheduled_at).getTime()
        : 0;

      const second = b.scheduled_at
        ? new Date(b.scheduled_at).getTime()
        : 0;

      return first - second;
    })
    .slice(0, 3);

  // ================================
  // ACTIVE ALERTS
  // ================================

  const alerts = cases
    .filter((item) => {
      const priority = getPriority(item);

      return [
        "urgent",
        "critical",
        "high",
        "level_1",
        "level_2",
      ].includes(priority);
    })
    .slice(0, 3);

  // ================================
  // STAT CARDS
  // ================================

  const statCards = [
    {
      label: "Total Active Cases",
      value: loading ? "—" : totalCases,
      icon: "folder_shared",
      accent: "text-secondary",
    },
    {
      label: "High Risk Open",
      value: loading ? "—" : highRiskOpen,
      icon: "warning",
      accent: "text-error",
    },
    {
      label: "Resolved This Month",
      value: loading ? "—" : resolvedThisMonth,
      icon: "task_alt",
      accent: "text-success",
    },
    {
      label: "Follow-ups",
      value: loading ? "—" : followUps.length,
      icon: "schedule",
      accent: "text-tertiary",
    },
  ];

  return (
    <>
      {/* HEADER */}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-space-sm">
        <div>
          <h1 className="text-headline-lg text-on-surface">
            Welcome back,{" "}
            {adminUser.full_name || "Administrator"}
          </h1>

          <p className="text-body-md text-on-surface-variant mt-1">
            {adminUser.email || "Admin Portal"}
            {" · "}
            {adminUser.role || "admin"}
          </p>
        </div>

        <Link
          to="/cases"
          className="inline-flex items-center gap-2 h-10 px-space-md bg-secondary hover:bg-secondary-hover text-on-secondary rounded text-body-md-medium transition-colors w-fit"
        >
          <Icon name="folder_shared" size={18} />
          View All Cases
        </Link>
      </div>

      {/* ERROR */}

      {error && (
        <Card>
          <div className="flex items-center gap-3 text-error">
            <Icon name="error" size={20} />

            <div>
              <p className="text-body-md-medium">
                Unable to load dashboard data
              </p>

              <p className="text-label-sm mt-1">
                {error}
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* STATISTICS */}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-space-md">
        {statCards.map((stat) => (
          <Card
            key={stat.label}
            className="flex items-center gap-space-md"
          >
            <div
              className={`w-11 h-11 rounded-lg bg-surface-container flex items-center justify-center ${stat.accent}`}
            >
              <Icon
                name={stat.icon}
                size={22}
              />
            </div>

            <div>
              <p className="text-headline-lg text-on-surface leading-none">
                {stat.value}
              </p>

              <p className="text-label-sm text-on-surface-variant mt-1">
                {stat.label}
              </p>
            </div>
          </Card>
        ))}
      </div>

      {/* RECENT CASES + FOLLOW-UPS */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-space-lg">
        <Card
          className="lg:col-span-2"
          noPadding
        >
          <div className="flex items-center justify-between px-space-lg py-space-md border-b border-outline-variant">
            <h2 className="text-headline-sm text-on-surface">
              Recent Cases
            </h2>

            <Link
              to="/cases"
              className="text-label-md text-secondary hover:underline"
            >
              View all
            </Link>
          </div>

          <div className="divide-y divide-outline-variant">
            {loading ? (
              <div className="px-space-lg py-space-lg text-label-md text-on-surface-variant">
                Loading cases...
              </div>
            ) : recentCases.length === 0 ? (
              <div className="px-space-lg py-space-lg text-label-md text-on-surface-variant">
                No cases available.
              </div>
            ) : (
              recentCases.map((item, index) => {
                const caseId =
                  item.complaint_id ||
                  item.id ||
                  `CASE-${index + 1}`;

                const priority =
                  getPriority(item);

                return (
                  <Link
                    key={String(caseId)}
                    to={`/cases/${caseId}`}
                    className="flex items-center justify-between gap-space-md px-space-lg py-space-sm hover:bg-surface-container-low transition-colors"
                  >
                    <div className="min-w-0">
                      <p className="text-body-md-medium text-on-surface truncate">
                        {caseId}
                      </p>

                      <p className="text-label-sm text-on-surface-variant truncate">
                        {formatStatus(item.status)}
                        {" · "}
                        {formatDate(item.created_at)}
                      </p>
                    </div>

                    <StatusBadge
                      label={
                        priority
                          ? priority.toUpperCase()
                          : formatStatus(item.status)
                      }
                    />
                  </Link>
                );
              })
            )}
          </div>
        </Card>

        {/* PRIORITY FOLLOW-UPS */}

        <Card noPadding>
          <div className="flex items-center justify-between px-space-lg py-space-md border-b border-outline-variant">
            <h2 className="text-headline-sm text-on-surface">
              Priority Follow-ups
            </h2>

            <Link
              to="/follow-ups"
              className="text-label-md text-secondary hover:underline"
            >
              View all
            </Link>
          </div>

          <div className="divide-y divide-outline-variant">
            {loading ? (
              <div className="px-space-lg py-space-lg text-label-md text-on-surface-variant">
                Loading follow-ups...
              </div>
            ) : urgentFollowUps.length === 0 ? (
              <div className="px-space-lg py-space-lg text-label-md text-on-surface-variant">
                No priority follow-ups.
              </div>
            ) : (
              urgentFollowUps.map((followUp) => (
                <div
                  key={followUp.id}
                  className="px-space-lg py-space-sm"
                >
                  <div className="flex items-center justify-between gap-space-sm">
                    <p className="text-body-md-medium text-on-surface">
                      {followUp.follow_up_type ||
                        "Follow-up"}
                    </p>

                    <StatusBadge
                      label={
                        followUp.priority ||
                        "Moderate"
                      }
                    />
                  </div>

                  <p className="text-label-sm text-on-surface-variant mt-1">
                    {followUp.complaint_id ||
                      "Case"}
                    {" · Due "}
                    {formatDate(
                      followUp.scheduled_at
                    )}
                  </p>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      {/* ACTIVE ALERTS */}

      <Card noPadding>
        <div className="flex items-center justify-between px-space-lg py-space-md border-b border-outline-variant">
          <h2 className="text-headline-sm text-on-surface">
            Active Alerts
          </h2>

          <Link
            to="/alerts"
            className="text-label-md text-secondary hover:underline"
          >
            View all
          </Link>
        </div>

        <div className="divide-y divide-outline-variant">
          {loading ? (
            <div className="px-space-lg py-space-lg text-label-md text-on-surface-variant">
              Loading alerts...
            </div>
          ) : alerts.length === 0 ? (
            <div className="px-space-lg py-space-lg text-label-md text-on-surface-variant">
              No active high-risk alerts.
            </div>
          ) : (
            alerts.map((item, index) => {
              const caseId =
                item.complaint_id ||
                item.id ||
                `CASE-${index + 1}`;

              return (
                <div
                  key={String(caseId)}
                  className="flex items-start gap-space-md px-space-lg py-space-sm"
                >
                  <Icon
                    name="warning"
                    size={20}
                    className="text-error mt-0.5"
                  />

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-space-sm">
                      <p className="text-body-md-medium text-on-surface">
                        High-risk case requires attention
                      </p>

                      <StatusBadge
                        label={getPriority(
                          item
                        ).toUpperCase()}
                      />
                    </div>

                    <p className="text-label-sm text-on-surface-variant mt-1">
                      {caseId}
                      {" · "}
                      {formatStatus(
                        item.status
                      )}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </Card>
    </>
  );
}