import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Icon from "../admin-components/Icon";
import Card from "../admin-components/Card";
import StatusBadge from "../admin-components/StatusBadge";
import { API_V1_URL } from "../apiConfig";
const API_BASE_URL =
  API_V1_URL;

function getAuthToken() {
  try {
    const auth = JSON.parse(
      localStorage.getItem("nhaa_auth") || "{}"
    );

    return (
      auth?.access_token ||
      auth?.token ||
      ""
    );
  } catch {
    return "";
  }
}

function formatStatus(status) {
  if (!status) return "Unknown";

  return String(status)
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase()
    );
}

function formatDate(date) {
  if (!date) return "—";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return String(date);
  }

  return parsed.toLocaleString();
}

function getCaseId(item) {
  return (
    item?.complaint_id ||
    item?.id ||
    ""
  );
}

function getSummary(item) {
  return (
    item?.complaint_text ||
    item?.summary ||
    item?.description ||
    item?.transcript ||
    "No complaint description available."
  );
}

function getChannel(item) {
  return (
    item?.communication_method ||
    item?.communicationMethod ||
    item?.channel ||
    "Not specified"
  );
}

function getDistrict(item) {
  return (
    item?.district ||
    item?.location ||
    "Not specified"
  );
}

function getRisk(item) {
  const priority = String(
    item?.priority ||
      item?.severity ||
      item?.priority_level ||
      ""
  ).toLowerCase();

  if (
    ["critical", "urgent", "high"].includes(
      priority
    )
  ) {
    return "High Risk";
  }

  if (priority) {
    return formatStatus(priority);
  }

  return "Not assessed";
}

export default function CasesList() {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] =
    useState(true);
  const [error, setError] =
    useState("");
  const [search, setSearch] =
    useState("");
  const [statusFilter, setStatusFilter] =
    useState("all");

  useEffect(() => {
    let cancelled = false;

    async function loadCases() {
      try {
        setLoading(true);
        setError("");

        const token =
          getAuthToken();

        if (!token) {
          throw new Error(
            "Authentication session not found."
          );
        }

        const response =
          await fetch(
            `${API_BASE_URL}/complaints/`,
            {
              method: "GET",
              headers: {
                Accept:
                  "application/json",
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        let data = {};

        try {
          data =
            await response.json();
        } catch {
          data = {};
        }

        if (!response.ok) {
          throw new Error(
            data?.detail ||
              "Unable to load cases."
          );
        }

        const loadedCases =
          Array.isArray(
            data?.complaints
          )
            ? data.complaints
            : Array.isArray(data)
            ? data
            : [];

        if (!cancelled) {
          setCases(
            loadedCases
          );
        }
      } catch (err) {
        console.error(
          "Cases loading error:",
          err
        );

        if (!cancelled) {
          setCases([]);

          setError(
            err instanceof Error
              ? err.message
              : "Unable to load cases."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadCases();

    return () => {
      cancelled = true;
    };
  }, []);

  const filteredCases =
    useMemo(() => {
      const query =
        search
          .trim()
          .toLowerCase();

      return cases.filter(
        (item) => {
          const caseId =
            String(
              getCaseId(item)
            ).toLowerCase();

          const text =
            String(
              getSummary(item)
            ).toLowerCase();

          const channel =
            String(
              getChannel(item)
            ).toLowerCase();

          const district =
            String(
              getDistrict(item)
            ).toLowerCase();

          const status =
            String(
              item?.status || ""
            ).toLowerCase();

          const matchesSearch =
            !query ||
            caseId.includes(
              query
            ) ||
            text.includes(
              query
            ) ||
            channel.includes(
              query
            ) ||
            district.includes(
              query
            );

          const matchesStatus =
            statusFilter ===
              "all" ||
            status ===
              statusFilter;

          return (
            matchesSearch &&
            matchesStatus
          );
        }
      );
    }, [
      cases,
      search,
      statusFilter,
    ]);

  const statusCounts =
    useMemo(() => {
      return cases.reduce(
        (counts, item) => {
          const status =
            item?.status ||
            "unknown";

          counts[status] =
            (counts[status] ||
              0) + 1;

          return counts;
        },
        {}
      );
    }, [cases]);

  if (loading) {
    return (
      <div className="flex flex-col gap-space-lg">
        <div>
          <h1 className="text-headline-lg text-on-surface">
            Cases
          </h1>

          <p className="text-body-md text-on-surface-variant mt-1">
            Loading operational
            case records...
          </p>
        </div>

        <Card>
          <div className="flex items-center gap-3 text-on-surface-variant">
            <Icon
              name="progress_activity"
              size={22}
            />

            <span>
              Loading cases...
            </span>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-space-lg">

      {/* HEADER */}

      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-md">

        <div>
          <div className="flex items-center gap-2 text-label-sm text-on-surface-variant mb-1">
            <span>
              Administration
            </span>

            <Icon
              name="chevron_right"
              size={15}
            />

            <span className="text-on-surface">
              Cases
            </span>
          </div>

          <h1 className="text-headline-lg text-on-surface">
            Cases
          </h1>

          <p className="text-body-md text-on-surface-variant mt-1">
            Shared NHAA complaint
            records from the
            operational database.
          </p>
        </div>

        <div className="flex items-center gap-2">

          <div className="px-3 py-2 rounded-lg bg-surface-container-low border border-outline-variant">
            <span className="text-label-sm text-on-surface-variant">
              Total
            </span>

            <span className="ml-2 text-body-md-medium text-on-surface">
              {cases.length}
            </span>
          </div>

        </div>
      </div>


      {/* ERROR */}

      {error && (
        <Card>
          <div className="flex items-start gap-3 text-error">

            <Icon
              name="error"
              size={22}
            />

            <div>
              <p className="text-body-md-medium">
                Unable to load cases
              </p>

              <p className="text-label-sm mt-1">
                {error}
              </p>

              <button
                type="button"
                onClick={() =>
                  window.location.reload()
                }
                className="mt-3 h-9 px-3 rounded bg-secondary text-on-secondary text-label-md font-semibold"
              >
                Retry
              </button>
            </div>

          </div>
        </Card>
      )}


      {/* FILTERS */}

      <Card>
        <div className="flex flex-col lg:flex-row gap-space-md">

          <div className="flex-1 relative">
            <Icon
              name="search"
              size={19}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant"
            />

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              placeholder="Search case ID, complaint, district..."
              className="w-full h-10 pl-10 pr-3 rounded border border-outline-variant bg-surface-container-lowest text-body-md text-on-surface outline-none focus:border-secondary"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(
                event.target.value
              )
            }
            className="h-10 px-3 rounded border border-outline-variant bg-surface-container-lowest text-body-md text-on-surface outline-none focus:border-secondary"
          >
            <option value="all">
              All statuses
            </option>

            {Object.keys(
              statusCounts
            ).map((status) => (
              <option
                key={status}
                value={status}
              >
                {formatStatus(
                  status
                )}
              </option>
            ))}
          </select>

        </div>
      </Card>


      {/* CASES */}

      <Card className="overflow-hidden p-0">

        <div className="px-space-md py-space-md border-b border-outline-variant flex items-center justify-between">

          <div>
            <h2 className="text-body-md-medium text-on-surface">
              Case Register
            </h2>

            <p className="text-label-sm text-on-surface-variant mt-0.5">
              {filteredCases.length}{" "}
              record
              {filteredCases.length ===
              1
                ? ""
                : "s"}{" "}
              shown
            </p>
          </div>

        </div>


        {filteredCases.length ===
        0 ? (
          <div className="p-10 text-center">

            <Icon
              name="folder_open"
              size={40}
              className="mx-auto text-on-surface-variant"
            />

            <h3 className="mt-3 text-body-md-medium text-on-surface">
              No cases found
            </h3>

            <p className="mt-1 text-label-sm text-on-surface-variant">
              {cases.length ===
              0
                ? "No complaints have been submitted yet."
                : "No cases match the current search or filter."}
            </p>

          </div>
        ) : (
          <div className="overflow-x-auto">

            <table className="w-full min-w-[900px]">

              <thead>
                <tr className="border-b border-outline-variant bg-surface-container-low">

                  <th className="px-4 py-3 text-left text-label-md text-on-surface-variant font-semibold">
                    Case ID
                  </th>

                  <th className="px-4 py-3 text-left text-label-md text-on-surface-variant font-semibold">
                    Complaint
                  </th>

                  <th className="px-4 py-3 text-left text-label-md text-on-surface-variant font-semibold">
                    Channel
                  </th>

                  <th className="px-4 py-3 text-left text-label-md text-on-surface-variant font-semibold">
                    District
                  </th>

                  <th className="px-4 py-3 text-left text-label-md text-on-surface-variant font-semibold">
                    Status
                  </th>

                  <th className="px-4 py-3 text-left text-label-md text-on-surface-variant font-semibold">
                    Risk
                  </th>

                  <th className="px-4 py-3 text-left text-label-md text-on-surface-variant font-semibold">
                    Filed
                  </th>

                  <th className="px-4 py-3 text-right text-label-md text-on-surface-variant font-semibold">
                    Action
                  </th>

                </tr>
              </thead>


              <tbody>

                {filteredCases.map(
                  (item) => {
                    const caseId =
                      getCaseId(
                        item
                      );

                    return (
                      <tr
                        key={
                          String(
                            caseId
                          )
                        }
                        className="border-b border-outline-variant last:border-b-0 hover:bg-surface-container-low transition-colors"
                      >

                        {/* CASE ID */}

                        <td className="px-4 py-4 align-top">

                          <Link
                            to={`/cases/${encodeURIComponent(
                              caseId
                            )}`}
                            className="text-body-md-medium text-secondary hover:underline"
                          >
                            {caseId ||
                              "—"}
                          </Link>

                          {item?.user_id && (
                            <p className="text-label-sm text-on-surface-variant mt-1">
                              User #
                              {
                                item.user_id
                              }
                            </p>
                          )}

                        </td>


                        {/* COMPLAINT */}

                        <td className="px-4 py-4 align-top max-w-[360px]">

                          <p className="text-body-md text-on-surface line-clamp-3 whitespace-pre-wrap">
                            {getSummary(
                              item
                            )}
                          </p>

                        </td>


                        {/* CHANNEL */}

                        <td className="px-4 py-4 align-top">

                          <span className="text-body-md text-on-surface">
                            {getChannel(
                              item
                            )}
                          </span>

                        </td>


                        {/* DISTRICT */}

                        <td className="px-4 py-4 align-top">

                          <span className="text-body-md text-on-surface">
                            {getDistrict(
                              item
                            )}
                          </span>

                        </td>


                        {/* STATUS */}

                        <td className="px-4 py-4 align-top">

                          <StatusBadge
                            label={formatStatus(
                              item?.status
                            )}
                          />

                        </td>


                        {/* RISK */}

                        <td className="px-4 py-4 align-top">

                          <StatusBadge
                            label={getRisk(
                              item
                            )}
                          />

                        </td>


                        {/* DATE */}

                        <td className="px-4 py-4 align-top whitespace-nowrap">

                          <span className="text-label-md text-on-surface-variant">
                            {formatDate(
                              item?.created_at
                            )}
                          </span>

                        </td>


                        {/* ACTION */}

                        <td className="px-4 py-4 align-top text-right">

                          <Link
                            to={`/cases/${encodeURIComponent(
                              caseId
                            )}`}
                            className="inline-flex items-center gap-1.5 h-9 px-3 rounded border border-outline-variant bg-surface-container-lowest text-label-md font-semibold text-on-surface hover:bg-surface-container-low transition-colors"
                          >
                            View

                            <Icon
                              name="arrow_forward"
                              size={16}
                            />
                          </Link>

                        </td>

                      </tr>
                    );
                  }
                )}

              </tbody>

            </table>

          </div>
        )}

      </Card>


      {/* GOVERNANCE */}

      <Card className="border-l-4 border-l-tertiary">

        <div className="flex items-center gap-2 text-on-tertiary-container mb-space-xs">

          <Icon
            name="info"
            size={18}
          />

          <span className="text-label-md font-semibold uppercase tracking-wide">
            Operational Record
          </span>

        </div>

        <p className="text-body-md text-on-surface-variant">
          Cases displayed here are
          loaded from the shared NHAA
          backend database. The case
          identifier used for navigation
          is the complaint ID generated
          when the complaint is submitted.
        </p>

      </Card>

    </div>
  );
}
