import { useEffect, useMemo, useState } from "react";
import Card from "../admin-components/Card";
import Icon from "../admin-components/Icon";
import { API_BASE_URL } from "../apiConfig";

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

function getPriority(item) {
  return String(
    item?.priority ??
      item?.severity ??
      item?.priority_level ??
      ""
  ).toLowerCase();
}

function getStatus(item) {
  return String(item?.status || "").toLowerCase();
}

function getCaseId(item) {
  return (
    item?.complaint_id ||
    item?.case_id ||
    item?.id ||
    ""
  );
}

function getDate(item) {
  return item?.created_at || item?.updated_at || null;
}

function getMonthKey(dateValue) {
  if (!dateValue) {
    return "";
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return `${date.getFullYear()}-${String(
    date.getMonth() + 1
  ).padStart(2, "0")}`;
}

function formatMonth(monthKey) {
  if (!monthKey) {
    return "Unknown";
  }

  const [year, month] = monthKey.split("-");

  const date = new Date(
    Number(year),
    Number(month) - 1,
    1
  );

  return date.toLocaleDateString(undefined, {
    month: "short",
    year: "numeric",
  });
}

export default function Reports() {
  const [cases, setCases] = useState([]);
  const [followUps, setFollowUps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadReports() {
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
              "Unable to load complaint data."
          );
        }

        if (!followUpsResponse.ok) {
          throw new Error(
            followUpsData?.detail ||
              "Unable to load follow-up data."
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
          "Admin reports error:",
          err
        );

        if (!cancelled) {
          setCases([]);
          setFollowUps([]);

          setError(
            err instanceof Error
              ? err.message
              : "Unable to load report data."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadReports();

    return () => {
      cancelled = true;
    };
  }, []);

  const report = useMemo(() => {
    const totalCases = cases.length;

    const resolvedCases = cases.filter((item) => {
      const status = getStatus(item);

      return [
        "resolved",
        "closed",
        "completed",
      ].includes(status);
    }).length;

    const activeCases = cases.filter((item) => {
      const status = getStatus(item);

      return ![
        "resolved",
        "closed",
        "completed",
      ].includes(status);
    }).length;

    const criticalCases = cases.filter((item) => {
      const priority = getPriority(item);

      return [
        "critical",
        "urgent",
      ].includes(priority);
    }).length;

    const highPriorityCases = cases.filter((item) => {
      const priority = getPriority(item);

      return [
        "high",
        "level_1",
        "level_2",
      ].includes(priority);
    }).length;

    const scheduledFollowUps =
      followUps.filter((item) => {
        const status = getStatus(item);

        return status === "scheduled";
      }).length;

    const completedFollowUps =
      followUps.filter((item) => {
        const status = getStatus(item);

        return [
          "completed",
          "closed",
          "done",
        ].includes(status);
      }).length;

    const overdueFollowUps =
      followUps.filter((item) => {
        const status = getStatus(item);

        return status === "overdue";
      }).length;

    const statusCounts = cases.reduce(
      (result, item) => {
        const status = formatStatus(
          item?.status
        );

        result[status] =
          (result[status] || 0) + 1;

        return result;
      },
      {}
    );

    const priorityCounts = cases.reduce(
      (result, item) => {
        const priority = formatStatus(
          getPriority(item)
        );

        if (priority !== "Unknown") {
          result[priority] =
            (result[priority] || 0) + 1;
        }

        return result;
      },
      {}
    );

    const monthlyCounts = cases.reduce(
      (result, item) => {
        const month = getMonthKey(
          getDate(item)
        );

        if (month) {
          result[month] =
            (result[month] || 0) + 1;
        }

        return result;
      },
      {}
    );

    const monthlyData = Object.entries(
      monthlyCounts
    )
      .sort(([a], [b]) =>
        a.localeCompare(b)
      )
      .slice(-6)
      .map(([month, count]) => ({
        month: formatMonth(month),
        count,
      }));

    const resolutionRate =
      totalCases > 0
        ? Math.round(
            (resolvedCases / totalCases) * 100
          )
        : 0;

    return {
      totalCases,
      resolvedCases,
      activeCases,
      criticalCases,
      highPriorityCases,
      scheduledFollowUps,
      completedFollowUps,
      overdueFollowUps,
      resolutionRate,
      statusCounts,
      priorityCounts,
      monthlyData,
    };
  }, [cases, followUps]);

  return (
    <>
      <div>
        <h1 className="text-headline-lg text-on-surface">
          Reports & Analytics
        </h1>

        <p className="text-body-md text-on-surface-variant mt-1">
          Live operational metrics calculated from
          NHAA case and follow-up records.
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
                Unable to load reports
              </p>

              <p className="text-label-sm mt-1">
                {error}
              </p>
            </div>
          </div>
        </Card>
      )}

      {loading ? (
        <Card>
          <div className="flex items-center justify-center py-space-xl text-body-md text-on-surface-variant">
            Loading report data...
          </div>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-space-md">
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-label-md text-on-surface-variant">
                    Total Cases
                  </p>

                  <p className="text-display-sm text-on-surface mt-1">
                    {report.totalCases}
                  </p>
                </div>

                <Icon
                  name="folder"
                  size={28}
                  className="text-secondary"
                />
              </div>
            </Card>

            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-label-md text-on-surface-variant">
                    Active Cases
                  </p>

                  <p className="text-display-sm text-on-surface mt-1">
                    {report.activeCases}
                  </p>
                </div>

                <Icon
                  name="pending_actions"
                  size={28}
                  className="text-warning"
                />
              </div>
            </Card>

            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-label-md text-on-surface-variant">
                    Resolved Cases
                  </p>

                  <p className="text-display-sm text-on-surface mt-1">
                    {report.resolvedCases}
                  </p>
                </div>

                <Icon
                  name="check_circle"
                  size={28}
                  className="text-success"
                />
              </div>
            </Card>

            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-label-md text-on-surface-variant">
                    Resolution Rate
                  </p>

                  <p className="text-display-sm text-on-surface mt-1">
                    {report.resolutionRate}%
                  </p>
                </div>

                <Icon
                  name="analytics"
                  size={28}
                  className="text-secondary"
                />
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-space-md">
            <Card>
              <div className="flex items-center justify-between mb-space-md">
                <div>
                  <h2 className="text-title-lg text-on-surface">
                    Case Status
                  </h2>

                  <p className="text-label-sm text-on-surface-variant mt-1">
                    Current distribution of cases.
                  </p>
                </div>

                <Icon
                  name="donut_small"
                  size={24}
                  className="text-secondary"
                />
              </div>

              {Object.keys(
                report.statusCounts
              ).length === 0 ? (
                <p className="text-body-md text-on-surface-variant">
                  No case data available.
                </p>
              ) : (
                <div className="flex flex-col gap-space-sm">
                  {Object.entries(
                    report.statusCounts
                  ).map(
                    ([status, count]) => {
                      const percentage =
                        report.totalCases > 0
                          ? Math.round(
                              (count /
                                report.totalCases) *
                                100
                            )
                          : 0;

                      return (
                        <div
                          key={status}
                          className="flex flex-col gap-1"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-body-md text-on-surface">
                              {status}
                            </span>

                            <span className="text-label-md text-on-surface-variant">
                              {count} (
                              {percentage}
                              %)
                            </span>
                          </div>

                          <div className="h-2 rounded-full bg-surface-container">
                            <div
                              className="h-2 rounded-full bg-secondary"
                              style={{
                                width: `${percentage}%`,
                              }}
                            />
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              )}
            </Card>

            <Card>
              <div className="flex items-center justify-between mb-space-md">
                <div>
                  <h2 className="text-title-lg text-on-surface">
                    Priority Distribution
                  </h2>

                  <p className="text-label-sm text-on-surface-variant mt-1">
                    Priority levels recorded in cases.
                  </p>
                </div>

                <Icon
                  name="priority_high"
                  size={24}
                  className="text-warning"
                />
              </div>

              {Object.keys(
                report.priorityCounts
              ).length === 0 ? (
                <p className="text-body-md text-on-surface-variant">
                  No priority data available.
                </p>
              ) : (
                <div className="flex flex-col gap-space-sm">
                  {Object.entries(
                    report.priorityCounts
                  ).map(
                    ([priority, count]) => {
                      const percentage =
                        report.totalCases > 0
                          ? Math.round(
                              (count /
                                report.totalCases) *
                                100
                            )
                          : 0;

                      return (
                        <div
                          key={priority}
                          className="flex items-center justify-between border-b border-outline-variant pb-space-sm"
                        >
                          <span className="text-body-md text-on-surface">
                            {priority}
                          </span>

                          <span className="text-body-md-medium text-on-surface">
                            {count}
                          </span>

                          <span className="text-label-sm text-on-surface-variant">
                            {percentage}%
                          </span>
                        </div>
                      );
                    }
                  )}
                </div>
              )}
            </Card>
          </div>

          <Card>
            <div className="flex items-center justify-between mb-space-md">
              <div>
                <h2 className="text-title-lg text-on-surface">
                  Recent Case Volume
                </h2>

                <p className="text-label-sm text-on-surface-variant mt-1">
                  Cases recorded by month.
                </p>
              </div>

              <Icon
                name="bar_chart"
                size={24}
                className="text-secondary"
              />
            </div>

            {report.monthlyData.length === 0 ? (
              <div className="py-space-lg text-center text-body-md text-on-surface-variant">
                No dated case records available.
              </div>
            ) : (
              <div className="flex flex-col gap-space-md">
                {report.monthlyData.map(
                  (item) => {
                    const maxCount =
                      Math.max(
                        ...report.monthlyData.map(
                          (entry) =>
                            entry.count
                        ),
                        1
                      );

                    const width =
                      Math.round(
                        (item.count /
                          maxCount) *
                          100
                      );

                    return (
                      <div
                        key={item.month}
                        className="flex items-center gap-space-md"
                      >
                        <span className="w-20 shrink-0 text-label-md text-on-surface-variant">
                          {item.month}
                        </span>

                        <div className="flex-1 h-3 rounded-full bg-surface-container">
                          <div
                            className="h-3 rounded-full bg-secondary"
                            style={{
                              width: `${width}%`,
                            }}
                          />
                        </div>

                        <span className="w-10 text-right text-body-md-medium text-on-surface">
                          {item.count}
                        </span>
                      </div>
                    );
                  }
                )}
              </div>
            )}
          </Card>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-md">
            <Card>
              <p className="text-label-md text-on-surface-variant">
                Critical Cases
              </p>

              <p className="text-display-sm text-error mt-1">
                {report.criticalCases}
              </p>
            </Card>

            <Card>
              <p className="text-label-md text-on-surface-variant">
                High Priority Cases
              </p>

              <p className="text-display-sm text-warning mt-1">
                {report.highPriorityCases}
              </p>
            </Card>

            <Card>
              <p className="text-label-md text-on-surface-variant">
                Overdue Follow-ups
              </p>

              <p className="text-display-sm text-error mt-1">
                {report.overdueFollowUps}
              </p>
            </Card>
          </div>

          <Card>
            <div className="flex items-center justify-between mb-space-md">
              <div>
                <h2 className="text-title-lg text-on-surface">
                  Follow-up Activity
                </h2>

                <p className="text-label-sm text-on-surface-variant mt-1">
                  Current follow-up workload.
                </p>
              </div>

              <Icon
                name="event"
                size={24}
                className="text-secondary"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-md">
              <div className="border border-outline-variant rounded-lg p-space-md">
                <p className="text-label-md text-on-surface-variant">
                  Scheduled
                </p>

                <p className="text-headline-md text-on-surface mt-1">
                  {report.scheduledFollowUps}
                </p>
              </div>

              <div className="border border-outline-variant rounded-lg p-space-md">
                <p className="text-label-md text-on-surface-variant">
                  Completed
                </p>

                <p className="text-headline-md text-success mt-1">
                  {report.completedFollowUps}
                </p>
              </div>

              <div className="border border-outline-variant rounded-lg p-space-md">
                <p className="text-label-md text-on-surface-variant">
                  Overdue
                </p>

                <p className="text-headline-md text-error mt-1">
                  {report.overdueFollowUps}
                </p>
              </div>
            </div>
          </Card>
        </>
      )}
    </>
  );
}
