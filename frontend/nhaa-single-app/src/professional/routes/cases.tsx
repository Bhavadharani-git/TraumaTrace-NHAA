import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";

import PortalHeader from "../components/PortalHeader";
import PortalSidebar from "../components/PortalSidebar";

import { API_V1_URL } from "../../apiConfig.ts";
const API_BASE_URL = API_V1_URL;
export const Route = createFileRoute("/cases")({
  head: () => ({
    meta: [
      { title: "NHAA 14566 - Cases" },
      {
        name: "description",
        content:
          "NHAA 14566 professional case management.",
      },
    ],
  }),
  component: Cases,
});

type Complaint = {
  id?: number;
  complaint_id?: string;
  user_id?: number;
  language?: string;
  communication_method?: string;
  complaint_text?: string;
  transcript?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
};

function getToken() {
  try {
    return (
      JSON.parse(
        localStorage.getItem("nhaa_auth") || "{}",
      )?.access_token || ""
    );
  } catch {
    return "";
  }
}

function Cases() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [cases, setCases] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  useEffect(() => {
    const loadCases = async () => {
      try {
        setLoading(true);
        setError("");

        const token = getToken();

        if (!token) {
          window.location.href = "/";
          return;
        }

        const response = await fetch(
          `${API_BASE_URL}/complaints/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (response.status === 401) {
          localStorage.removeItem("nhaa_auth");
          window.location.href = "/";
          return;
        }

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data?.detail || "Unable to load cases.",
          );
        }

        setCases(
          Array.isArray(data?.complaints)
            ? data.complaints
            : Array.isArray(data)
              ? data
              : [],
        );
      } catch (err) {
        console.error("Cases error:", err);

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load cases.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadCases();
  }, []);

  const displayStatus = (value?: string) => {
    const labels: Record<string, string> = {
      received: "New",
      under_assessment: "Under Assessment",
      support_recommended: "Support Recommended",
      under_review: "Under Review",
      action_in_progress: "Action In Progress",
      resolved: "Resolved",
      closed: "Closed",
    };

    return labels[value || ""] || value || "Unknown";
  };

  const filteredCases = useMemo(() => {
    const value = search.trim().toLowerCase();

    return cases.filter((item) => {
      const matchesSearch =
        !value ||
        [
          item.complaint_id,
          item.complaint_text,
          item.transcript,
          item.language,
          item.communication_method,
          item.status,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(value);

      const matchesStatus =
        status === "all" ||
        item.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [cases, search, status]);

  const formatDate = (value?: string) => {
    if (!value) return "—";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "—";
    }

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Government color strip */}
      <div className="fixed left-0 right-0 top-0 z-50 flex h-[3px]">
        <div className="w-1/3 bg-[#F59E0B]" />
        <div className="w-1/3 bg-white" />
        <div className="w-1/3 bg-[#0D9488]" />
      </div>

      {/* Shared Sidebar */}
      <PortalSidebar
        active="cases"
        alertCount={6}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Shared Government Header */}
        <PortalHeader
          alertCount={6}
          onMenuClick={() => setSidebarOpen(true)}
        />

        <main className="min-h-[calc(100vh-64px)] bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl space-y-6">
            {/* Page Heading */}
            <section>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-wider text-slate-500">
                    <span>Operations Desk</span>

                    <span className="material-symbols-outlined text-[14px]">
                      chevron_right
                    </span>

                    <span className="text-[#0D9488]">
                      Cases
                    </span>
                  </div>

                  <h1 className="text-2xl font-bold tracking-tight text-[#0B2545]">
                    Cases
                  </h1>

                  <p className="mt-1 text-sm text-slate-500">
                    Cases currently available through the NHAA
                    backend.
                  </p>
                </div>
              </div>
            </section>

            {/* Search and Filter */}
            <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#0D9488]">
                  filter_alt
                </span>

                <div>
                  <h2 className="text-base font-bold text-[#0B2545]">
                    Case Filters
                  </h2>

                  <p className="text-xs text-slate-500">
                    Search and filter cases available to your
                    professional desk.
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3 md:flex-row">
                <div className="relative flex-1">
                  <span className="material-symbols-outlined pointer-events-none absolute left-3 top-2.5 text-[20px] text-slate-400">
                    search
                  </span>

                  <input
                    value={search}
                    onChange={(event) =>
                      setSearch(event.target.value)
                    }
                    placeholder="Search case ID, complaint, language or channel..."
                    className="h-10 w-full rounded-lg border border-slate-300 bg-white pl-10 pr-3 text-sm outline-none focus:border-[#0D9488] focus:ring-1 focus:ring-[#0D9488]"
                  />
                </div>

                <select
                  value={status}
                  onChange={(event) =>
                    setStatus(event.target.value)
                  }
                  className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none focus:border-[#0D9488] focus:ring-1 focus:ring-[#0D9488]"
                >
                  <option value="all">
                    All statuses
                  </option>

                  <option value="received">
                    New
                  </option>

                  <option value="under_assessment">
                    Under Assessment
                  </option>

                  <option value="support_recommended">
                    Support Recommended
                  </option>

                  <option value="under_review">
                    Under Review
                  </option>

                  <option value="action_in_progress">
                    Action In Progress
                  </option>

                  <option value="resolved">
                    Resolved
                  </option>

                  <option value="closed">
                    Closed
                  </option>
                </select>
              </div>
            </section>

            {/* Error */}
            {error && (
              <div className="flex items-start justify-between gap-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                <div className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-[18px]">
                    error
                  </span>

                  <span>{error}</span>
                </div>

                <button
                  type="button"
                  onClick={() => setError("")}
                  className="text-red-500 hover:text-red-800"
                  aria-label="Close error"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    close
                  </span>
                </button>
              </div>
            )}

            {/* Cases Table */}
            <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="flex flex-col gap-2 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-bold text-[#0B2545]">
                    Case Records
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    {filteredCases.length} case
                    {filteredCases.length === 1
                      ? ""
                      : "s"} displayed
                  </p>
                </div>

                <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                  {cases.length} Total Cases
                </div>
              </div>

              {loading ? (
                <div className="p-12 text-center">
                  <span className="material-symbols-outlined animate-spin text-3xl text-[#0D9488]">
                    progress_activity
                  </span>

                  <p className="mt-3 text-sm text-slate-500">
                    Loading cases...
                  </p>
                </div>
              ) : filteredCases.length === 0 ? (
                <div className="p-12 text-center">
                  <span className="material-symbols-outlined text-4xl text-slate-300">
                    folder_open
                  </span>

                  <p className="mt-3 text-sm font-semibold text-slate-700">
                    No cases found
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Try changing your search or status filter.
                  </p>

                  <button
                    type="button"
                    onClick={() => {
                      setSearch("");
                      setStatus("all");
                    }}
                    className="mt-3 text-sm font-semibold text-[#0D9488] hover:underline"
                  >
                    Clear filters
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[950px] text-left text-sm">
                    <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                      <tr>
                        <th className="px-5 py-3 font-semibold">
                          Case ID
                        </th>

                        <th className="px-5 py-3 font-semibold">
                          Complaint
                        </th>

                        <th className="px-5 py-3 font-semibold">
                          Language
                        </th>

                        <th className="px-5 py-3 font-semibold">
                          Channel
                        </th>

                        <th className="px-5 py-3 font-semibold">
                          Status
                        </th>

                        <th className="px-5 py-3 font-semibold">
                          Created
                        </th>

                        <th className="px-5 py-3 font-semibold">
                          Action
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                      {filteredCases.map((item) => {
                        const caseId =
                          item.complaint_id ||
                          String(item.id || "");

                        return (
                          <tr
                            key={caseId}
                            className="hover:bg-slate-50"
                          >
                            {/* Case ID */}
                            <td className="px-5 py-4">
                              <div className="font-mono text-sm font-bold text-[#0B2545]">
                                {caseId || "—"}
                              </div>
                            </td>

                            {/* Complaint */}
                            <td className="max-w-[400px] px-5 py-4">
                              <div className="truncate text-slate-700">
                                {item.complaint_text ||
                                  item.transcript ||
                                  "No complaint text"}
                              </div>
                            </td>

                            {/* Language */}
                            <td className="px-5 py-4 text-slate-500">
                              {item.language || "—"}
                            </td>

                            {/* Channel */}
                            <td className="px-5 py-4 text-slate-500">
                              {item.communication_method ||
                                "—"}
                            </td>

                            {/* Status */}
                            <td className="px-5 py-4">
                              <StatusBadge
                                status={item.status}
                                displayStatus={displayStatus(
                                  item.status,
                                )}
                              />
                            </td>

                            {/* Created */}
                            <td className="px-5 py-4 text-slate-500">
                              {formatDate(item.created_at)}
                            </td>

                            {/* Action */}
                            <td className="px-5 py-4">
                              <Link
                                to="/cases/$caseId"
                                params={{
                                  caseId,
                                }}
                                className="inline-flex items-center gap-1 rounded-lg bg-[#0B2545] px-3 py-2 text-xs font-semibold text-white hover:bg-[#134074]"
                              >
                                Open

                                <span className="material-symbols-outlined text-[16px]">
                                  arrow_forward
                                </span>
                              </Link>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Bottom Count */}
              {!loading &&
                filteredCases.length > 0 && (
                  <div className="border-t border-slate-200 bg-slate-50 px-5 py-4">
                    <span className="text-xs text-slate-500">
                      Showing{" "}
                      <strong className="text-[#0B2545]">
                        {filteredCases.length}
                      </strong>{" "}
                      of{" "}
                      <strong className="text-[#0B2545]">
                        {cases.length}
                      </strong>{" "}
                      cases
                    </span>
                  </div>
                )}
            </section>

            {/* Information Card */}
            <section className="rounded-xl border border-[#C7D2FE] bg-[#F8FAFF] p-5">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#EEF2FF] text-[#3730A3]">
                  <span className="material-symbols-outlined">
                    info
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-[#0B2545]">
                    Case Information
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    Case records shown here are retrieved from the
                    authenticated NHAA backend. Open a case to
                    review its available details.
                  </p>
                </div>
              </div>
            </section>

            {/* Footer */}
            <footer className="flex flex-col gap-2 border-t border-slate-200 py-5 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <span className="font-semibold text-[#0B2545]">
                  National Helpline Against Atrocities (NHAA 14566)
                </span>

                <div>
                  Department of Social Justice & Empowerment,
                  Government of India.
                </div>
              </div>

              <div className="font-semibold">
                Portal v4.2.8-PROD
              </div>
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}

/* =========================================================
   Status Badge
   ========================================================= */

function StatusBadge({
  status,
  displayStatus,
}: {
  status?: string | undefined;
  displayStatus: string;
}) {
  let className =
    "bg-slate-100 text-slate-700";

  switch (status) {
    case "received":
      className = "bg-blue-50 text-blue-700";
      break;

    case "under_assessment":
      className = "bg-amber-50 text-amber-700";
      break;

    case "support_recommended":
      className = "bg-purple-50 text-purple-700";
      break;

    case "under_review":
      className = "bg-indigo-50 text-indigo-700";
      break;

    case "action_in_progress":
      className = "bg-orange-50 text-orange-700";
      break;

    case "resolved":
      className = "bg-green-50 text-green-700";
      break;

    case "closed":
      className = "bg-slate-100 text-slate-700";
      break;

    default:
      className = "bg-slate-100 text-slate-700";
  }

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${className}`}
    >
      {displayStatus || status || "Unknown"}
    </span>
  );
}
