import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Icon from "../admin-components/Icon";
import Card from "../admin-components/Card";
import StatusBadge from "../admin-components/StatusBadge";
import { API_V1_URL } from "../apiConfig";
function getAuthToken() {
  try {
    const auth = JSON.parse(localStorage.getItem("nhaa_auth") || "{}");
    return auth?.access_token || auth?.token || "";
  } catch {
    return "";
  }
}

function formatStatus(status) {
  if (!status) return "—";

  return String(status)
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatDate(date) {
  if (!date) return "—";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return String(date);
  }

  return parsed.toLocaleString();
}

export default function FollowUps() {
  const [followUps, setFollowUps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadFollowUps = async () => {
      try {
        setLoading(true);
        setError("");

        const token = getAuthToken();

        if (!token) {
          throw new Error("Authentication session not found.");
        }

        const response = await fetch(
          `${API_V1_URL}/follow-ups/`,
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
              "Unable to load follow-ups from backend."
          );
        }

        const loadedFollowUps = Array.isArray(data?.follow_ups)
          ? data.follow_ups
          : Array.isArray(data)
          ? data
          : [];

        if (!cancelled) {
          setFollowUps(loadedFollowUps);
        }
      } catch (err) {
        console.error("Admin follow-ups error:", err);

        if (!cancelled) {
          setFollowUps([]);
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load follow-ups."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadFollowUps();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-space-sm">
        <div>
          <h1 className="text-headline-lg text-on-surface">
            Follow-ups Management
          </h1>

          <p className="text-body-md text-on-surface-variant mt-1">
            {loading
              ? "Loading scheduled actions..."
              : `${followUps.length} scheduled actions across all active dockets.`}
          </p>
        </div>

        <button
          type="button"
          className="inline-flex items-center gap-2 h-10 px-space-md bg-secondary hover:bg-secondary-hover text-on-secondary rounded text-body-md-medium transition-colors w-fit"
        >
          <Icon name="add_task" size={18} />
          Schedule Follow-up
        </button>
      </div>

      {error && (
        <Card>
          <div className="flex items-start gap-3 text-error">
            <Icon name="error" size={20} />

            <div>
              <p className="text-body-md-medium">
                Unable to load follow-ups
              </p>

              <p className="text-label-sm mt-1">
                {error}
              </p>
            </div>
          </div>
        </Card>
      )}

      <Card noPadding>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[760px]">
            <thead>
              <tr className="text-label-sm text-on-surface-variant uppercase tracking-wide border-b border-outline-variant bg-surface-container-low">
                <th className="px-space-lg py-space-sm font-semibold">
                  Follow-up
                </th>

                <th className="px-space-lg py-space-sm font-semibold">
                  Case
                </th>

                <th className="px-space-lg py-space-sm font-semibold">
                  Owner
                </th>

                <th className="px-space-lg py-space-sm font-semibold">
                  Due Date
                </th>

                <th className="px-space-lg py-space-sm font-semibold">
                  Priority
                </th>

                <th className="px-space-lg py-space-sm font-semibold">
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-space-lg py-space-xl text-center text-body-md text-on-surface-variant"
                  >
                    Loading follow-ups...
                  </td>
                </tr>
              ) : followUps.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-space-lg py-space-xl text-center text-body-md text-on-surface-variant"
                  >
                    No follow-ups available.
                  </td>
                </tr>
              ) : (
                followUps.map((followUp, index) => {
                  const caseId =
                    followUp?.complaint_id ||
                    followUp?.case_id ||
                    followUp?.caseId ||
                    "";

                  const followUpType =
                    followUp?.follow_up_type ||
                    followUp?.type ||
                    "Follow-up";

                  const owner =
                    followUp?.owner ||
                    followUp?.assigned_officer ||
                    followUp?.assignedOfficer ||
                    followUp?.professional_name ||
                    "Unassigned";

                  const priority =
                    followUp?.priority || "Moderate";

                  const status =
                    followUp?.status || "scheduled";

                  const overdue =
                    String(status).toLowerCase() === "overdue";

                  return (
                    <tr
                      key={
                        followUp?.id ||
                        `${caseId}-${followUpType}-${index}`
                      }
                      className={`border-b border-outline-variant last:border-0 hover:bg-surface-container-low transition-colors ${
                        index % 2 === 1
                          ? "bg-surface-container-low/40"
                          : ""
                      } ${
                        overdue
                          ? "border-l-4 border-l-error"
                          : ""
                      }`}
                    >
                      <td className="px-space-lg py-space-sm">
                        <p className="text-body-md-medium text-on-surface">
                          {followUpType}
                        </p>

                        <p className="text-label-sm text-on-surface-variant">
                          {followUp?.id
                            ? `Follow-up #${followUp.id}`
                            : "Scheduled action"}
                        </p>
                      </td>

                      <td className="px-space-lg py-space-sm">
                        {caseId ? (
                          <Link
                            to={`/cases/${caseId}`}
                            className="text-code-sm text-secondary hover:underline"
                          >
                            {caseId}
                          </Link>
                        ) : (
                          <span className="text-body-md text-on-surface-variant">
                            —
                          </span>
                        )}
                      </td>

                      <td className="px-space-lg py-space-sm text-body-md text-on-surface-variant whitespace-nowrap">
                        {owner}
                      </td>

                      <td className="px-space-lg py-space-sm text-body-md text-on-surface-variant whitespace-nowrap">
                        {formatDate(followUp?.scheduled_at)}
                      </td>

                      <td className="px-space-lg py-space-sm">
                        <StatusBadge
                          label={formatStatus(priority)}
                        />
                      </td>

                      <td className="px-space-lg py-space-sm">
                        <StatusBadge
                          label={formatStatus(status)}
                        />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}
