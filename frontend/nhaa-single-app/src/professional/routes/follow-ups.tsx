import { createFileRoute } from "@tanstack/react-router";
import {
  useEffect,
  useMemo,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";

import PortalHeader from "../components/PortalHeader";
import PortalSidebar from "../components/PortalSidebar";
import { API_V1_URL } from "../../apiConfig.ts";
export const Route = createFileRoute("/follow-ups")({
  head: () => ({
    meta: [
      { title: "NHAA 14566 - Follow-ups" },
      {
        name: "description",
        content:
          "NHAA 14566 — Professional follow-up management.",
      },
    ],
  }),
  component: FollowUps,
});

type FollowUp = {
  id: number;
  complaint_id: string;
  scheduled_at: string;
  follow_up_type: string;
  priority: string;
  status: string;
  notes?: string;
  outcome?: string;
  created_at?: string;
  updated_at?: string;
};

function getToken() {
  try {
    const auth = JSON.parse(
      localStorage.getItem("nhaa_auth") || "{}",
    );

    return auth?.access_token || "";
  } catch {
    return "";
  }
}

function FollowUps() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [followUps, setFollowUps] = useState<FollowUp[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const [selectedId, setSelectedId] =
    useState<number | null>(null);

  const [showSchedule, setShowSchedule] =
    useState(false);

  const [showComplete, setShowComplete] =
    useState(false);

  const [showReschedule, setShowReschedule] =
    useState(false);

  const [actionLoading, setActionLoading] =
    useState(false);

  const loadFollowUps = async () => {
    try {
      setLoading(true);
      setError("");

      const token = getToken();

      if (!token) {
        window.location.href = "/";
        return;
      }

      const response = await fetch(
        `${API_V1_URL}/follow-ups/`,
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
          data?.detail ||
            "Unable to load follow-ups.",
        );
      }

      setFollowUps(
        Array.isArray(data?.follow_ups)
          ? data.follow_ups
          : [],
      );
    } catch (err) {
      console.error("Follow-ups error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load follow-ups.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFollowUps();
  }, []);

  const filteredFollowUps = useMemo(() => {
    const value = search.trim().toLowerCase();

    return followUps.filter((item) => {
      const matchesSearch =
        !value ||
        [
          item.complaint_id,
          item.follow_up_type,
          item.priority,
          item.status,
          item.notes,
          item.outcome,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(value);

      if (filter === "all") {
        return matchesSearch;
      }

      if (filter === "pending") {
        return (
          matchesSearch &&
          item.status !== "completed" &&
          item.status !== "rescheduled"
        );
      }

      if (filter === "completed") {
        return (
          matchesSearch &&
          item.status === "completed"
        );
      }

      if (filter === "overdue") {
        return (
          matchesSearch &&
          item.status !== "completed" &&
          item.status !== "rescheduled" &&
          new Date(item.scheduled_at) < new Date()
        );
      }

      return matchesSearch;
    });
  }, [followUps, search, filter]);

  const stats = useMemo(() => {
    const pending = followUps.filter(
      (item) =>
        item.status !== "completed" &&
        item.status !== "rescheduled",
    ).length;

    const completed = followUps.filter(
      (item) => item.status === "completed",
    ).length;

    const overdue = followUps.filter(
      (item) =>
        item.status !== "completed" &&
        item.status !== "rescheduled" &&
        new Date(item.scheduled_at) < new Date(),
    ).length;

    return {
      total: followUps.length,
      pending,
      completed,
      overdue,
    };
  }, [followUps]);

  const formatDate = (value?: string) => {
    if (!value) return "—";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "—";
    }

    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleSchedule = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    try {
      setActionLoading(true);
      setError("");

      const token = getToken();

      if (!token) {
        throw new Error(
          "Authentication token not found.",
        );
      }

      const formData = new FormData(
        event.currentTarget,
      );

      const complaintId = String(
        formData.get("complaint_id") || "",
      ).trim();

      const date = String(
        formData.get("date") || "",
      );

      const time = String(
        formData.get("time") || "",
      );

      const followUpType = String(
        formData.get("follow_up_type") || "",
      );

      const priority = String(
        formData.get("priority") || "Moderate",
      );

      const notes = String(
        formData.get("notes") || "",
      );

      if (
        !complaintId ||
        !date ||
        !time ||
        !followUpType
      ) {
        throw new Error(
          "Please complete all required fields.",
        );
      }

      const response = await fetch(
        `${API_V1_URL}/follow-ups/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            complaint_id: complaintId,
            scheduled_at: `${date}T${time}:00`,
            follow_up_type: followUpType,
            priority,
            notes,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.detail ||
            "Unable to schedule follow-up.",
        );
      }

      setShowSchedule(false);

      await loadFollowUps();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to schedule follow-up.",
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleComplete = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!selectedId) return;

    try {
      setActionLoading(true);
      setError("");

      const token = getToken();

      if (!token) {
        throw new Error(
          "Authentication token not found.",
        );
      }

      const formData = new FormData(
        event.currentTarget,
      );

      const outcome = String(
        formData.get("outcome") || "",
      ).trim();

      if (!outcome) {
        throw new Error(
          "Please enter the follow-up outcome.",
        );
      }

      const response = await fetch(
        `${API_V1_URL}/follow-ups/${selectedId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: "completed",
            outcome,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.detail ||
            "Unable to complete follow-up.",
        );
      }

      setShowComplete(false);
      setSelectedId(null);

      await loadFollowUps();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to complete follow-up.",
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleReschedule = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!selectedId) return;

    try {
      setActionLoading(true);
      setError("");

      const token = getToken();

      if (!token) {
        throw new Error(
          "Authentication token not found.",
        );
      }

      const formData = new FormData(
        event.currentTarget,
      );

      const date = String(
        formData.get("date") || "",
      );

      const time = String(
        formData.get("time") || "",
      );

      if (!date || !time) {
        throw new Error(
          "Please select a date and time.",
        );
      }

      const response = await fetch(
        `${API_V1_URL}/follow-ups/${selectedId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            scheduled_at: `${date}T${time}:00`,
            status: "rescheduled",
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.detail ||
            "Unable to reschedule follow-up.",
        );
      }

      setShowReschedule(false);
      setSelectedId(null);

      await loadFollowUps();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to reschedule follow-up.",
      );
    } finally {
      setActionLoading(false);
    }
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
        active="follow-ups"
        alertCount={6}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Area */}
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
                      Follow-ups
                    </span>
                  </div>

                  <h1 className="text-2xl font-bold tracking-tight text-[#0B2545]">
                    Follow-ups
                  </h1>

                  <p className="mt-1 text-sm text-slate-500">
                    Manage scheduled case follow-ups.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setError("");
                    setShowSchedule(true);
                  }}
                  className="flex items-center justify-center gap-2 rounded-lg bg-[#0B2545] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#12365D]"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    add
                  </span>

                  Schedule Follow-up
                </button>
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

            {/* Stats */}
            <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              <StatCard
                label="Total"
                value={stats.total}
              />

              <StatCard
                label="Pending"
                value={stats.pending}
              />

              <StatCard
                label="Completed"
                value={stats.completed}
              />

              <StatCard
                label="Overdue"
                value={stats.overdue}
              />
            </section>

            {/* Search & Filters */}
            <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#0D9488]">
                  filter_alt
                </span>

                <div>
                  <h2 className="text-base font-bold text-[#0B2545]">
                    Follow-up Filters
                  </h2>

                  <p className="text-xs text-slate-500">
                    Search and filter scheduled follow-ups.
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
                    placeholder="Search case ID, type, priority..."
                    className="h-10 w-full rounded-lg border border-slate-300 bg-white pl-10 pr-3 text-sm outline-none focus:border-[#0D9488] focus:ring-1 focus:ring-[#0D9488]"
                  />
                </div>

                <select
                  value={filter}
                  onChange={(event) =>
                    setFilter(event.target.value)
                  }
                  className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none focus:border-[#0D9488] focus:ring-1 focus:ring-[#0D9488]"
                >
                  <option value="all">
                    All follow-ups
                  </option>

                  <option value="pending">
                    Pending
                  </option>

                  <option value="completed">
                    Completed
                  </option>

                  <option value="overdue">
                    Overdue
                  </option>
                </select>
              </div>
            </section>

            {/* Follow-up Table */}
            <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="flex flex-col gap-2 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-bold text-[#0B2545]">
                    Scheduled Follow-ups
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    {filteredFollowUps.length} follow-up
                    {filteredFollowUps.length === 1
                      ? ""
                      : "s"} matching the selected filter.
                  </p>
                </div>
              </div>

              {loading ? (
                <div className="p-12 text-center">
                  <span className="material-symbols-outlined animate-spin text-3xl text-[#0D9488]">
                    progress_activity
                  </span>

                  <p className="mt-3 text-sm text-slate-500">
                    Loading follow-ups...
                  </p>
                </div>
              ) : filteredFollowUps.length === 0 ? (
                <div className="p-12 text-center">
                  <span className="material-symbols-outlined text-4xl text-slate-300">
                    event_busy
                  </span>

                  <p className="mt-3 text-sm font-semibold text-slate-700">
                    No follow-ups found
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    There are currently no follow-ups matching
                    your filter.
                  </p>

                  <button
                    type="button"
                    onClick={() => {
                      setSearch("");
                      setFilter("all");
                    }}
                    className="mt-3 text-sm font-semibold text-[#0D9488] hover:underline"
                  >
                    Clear filters
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[900px] text-left text-sm">
                    <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                      <tr>
                        <th className="px-5 py-3">
                          Case
                        </th>

                        <th className="px-5 py-3">
                          Scheduled
                        </th>

                        <th className="px-5 py-3">
                          Type
                        </th>

                        <th className="px-5 py-3">
                          Priority
                        </th>

                        <th className="px-5 py-3">
                          Status
                        </th>

                        <th className="px-5 py-3">
                          Actions
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                      {filteredFollowUps.map((item) => (
                        <tr
                          key={item.id}
                          className="hover:bg-slate-50"
                        >
                          <td className="px-5 py-4">
                            <a
                              href={`/cases/${encodeURIComponent(
                                item.complaint_id,
                              )}`}
                              className="font-semibold text-[#0B2545] hover:underline"
                            >
                              {item.complaint_id}
                            </a>

                            {item.notes && (
                              <div className="mt-1 max-w-xs truncate text-xs text-slate-500">
                                {item.notes}
                              </div>
                            )}
                          </td>

                          <td className="px-5 py-4 text-slate-600">
                            {formatDate(
                              item.scheduled_at,
                            )}
                          </td>

                          <td className="px-5 py-4 text-slate-700">
                            {item.follow_up_type || "—"}
                          </td>

                          <td className="px-5 py-4">
                            <PriorityBadge
                              priority={item.priority}
                            />
                          </td>

                          <td className="px-5 py-4">
                            <StatusBadge
                              status={item.status}
                              scheduledAt={
                                item.scheduled_at
                              }
                            />
                          </td>

                          <td className="px-5 py-4">
                            {item.status !==
                              "completed" &&
                              item.status !==
                                "rescheduled" && (
                                <div className="flex flex-wrap gap-2">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setSelectedId(
                                        item.id,
                                      );
                                      setError("");
                                      setShowComplete(
                                        true,
                                      );
                                    }}
                                    className="rounded-lg bg-[#0B2545] px-3 py-2 text-xs font-semibold text-white hover:bg-[#12365D]"
                                  >
                                    Complete
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => {
                                      setSelectedId(
                                        item.id,
                                      );
                                      setError("");
                                      setShowReschedule(
                                        true,
                                      );
                                    }}
                                    className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                                  >
                                    Reschedule
                                  </button>
                                </div>
                              )}

                            {item.status ===
                              "completed" && (
                              <span className="text-xs font-semibold text-green-700">
                                Completed
                              </span>
                            )}

                            {item.status ===
                              "rescheduled" && (
                              <span className="text-xs font-semibold text-slate-500">
                                Rescheduled
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>

            {/* Information Card */}
            <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#EEF2FF] text-[#3730A3]">
                  <span className="material-symbols-outlined">
                    info
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-[#0B2545]">
                    Follow-up Information
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    Follow-ups are scheduled against case records
                    available to the authenticated professional.
                    Completed and rescheduled actions are recorded
                    against the follow-up record.
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

      {/* Schedule Modal */}
      {showSchedule && (
        <Modal
          title="Schedule Follow-up"
          onClose={() => {
            if (!actionLoading) {
              setShowSchedule(false);
            }
          }}
        >
          <form
            onSubmit={handleSchedule}
            className="space-y-4"
          >
            <div>
              <label
                htmlFor="schedule-complaint-id"
                className="text-sm font-semibold text-slate-700"
              >
                Case ID
              </label>

              <input
                id="schedule-complaint-id"
                name="complaint_id"
                required
                placeholder="Example: NHAA-CA2FC7A18A"
                className="mt-2 w-full rounded-lg border border-slate-300 p-3 text-sm outline-none focus:border-[#0D9488] focus:ring-1 focus:ring-[#0D9488]"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="schedule-date"
                  className="text-sm font-semibold text-slate-700"
                >
                  Date
                </label>

                <input
                  id="schedule-date"
                  name="date"
                  type="date"
                  required
                  className="mt-2 w-full rounded-lg border border-slate-300 p-3 text-sm outline-none focus:border-[#0D9488] focus:ring-1 focus:ring-[#0D9488]"
                />
              </div>

              <div>
                <label
                  htmlFor="schedule-time"
                  className="text-sm font-semibold text-slate-700"
                >
                  Time
                </label>

                <input
                  id="schedule-time"
                  name="time"
                  type="time"
                  required
                  className="mt-2 w-full rounded-lg border border-slate-300 p-3 text-sm outline-none focus:border-[#0D9488] focus:ring-1 focus:ring-[#0D9488]"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="schedule-type"
                className="text-sm font-semibold text-slate-700"
              >
                Follow-up Type
              </label>

              <select
                id="schedule-type"
                name="follow_up_type"
                required
                className="mt-2 w-full rounded-lg border border-slate-300 bg-white p-3 text-sm outline-none focus:border-[#0D9488] focus:ring-1 focus:ring-[#0D9488]"
              >
                <option value="">
                  Select follow-up type
                </option>

                <option value="Support Call">
                  Support Call
                </option>

                <option value="Counselling Session">
                  Counselling Session
                </option>

                <option value="Legal Follow-up">
                  Legal Follow-up
                </option>

                <option value="Professional Review">
                  Professional Review
                </option>
              </select>
            </div>

            <div>
              <label
                htmlFor="schedule-priority"
                className="text-sm font-semibold text-slate-700"
              >
                Priority
              </label>

              <select
                id="schedule-priority"
                name="priority"
                defaultValue="Moderate"
                className="mt-2 w-full rounded-lg border border-slate-300 bg-white p-3 text-sm outline-none focus:border-[#0D9488] focus:ring-1 focus:ring-[#0D9488]"
              >
                <option value="Urgent">
                  Urgent
                </option>

                <option value="High">
                  High
                </option>

                <option value="Moderate">
                  Moderate
                </option>

                <option value="Low">
                  Low
                </option>
              </select>
            </div>

            <div>
              <label
                htmlFor="schedule-notes"
                className="text-sm font-semibold text-slate-700"
              >
                Notes
              </label>

              <textarea
                id="schedule-notes"
                name="notes"
                rows={3}
                placeholder="Add operational notes..."
                className="mt-2 w-full rounded-lg border border-slate-300 p-3 text-sm outline-none focus:border-[#0D9488] focus:ring-1 focus:ring-[#0D9488]"
              />
            </div>

            <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
              <button
                type="button"
                onClick={() =>
                  setShowSchedule(false)
                }
                disabled={actionLoading}
                className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={actionLoading}
                className="rounded-lg bg-[#0B2545] px-4 py-2.5 text-sm font-semibold text-white disabled:bg-slate-400"
              >
                {actionLoading
                  ? "Scheduling..."
                  : "Schedule Follow-up"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Complete Modal */}
      {showComplete && (
        <Modal
          title="Complete Follow-up"
          onClose={() => {
            if (!actionLoading) {
              setShowComplete(false);
              setSelectedId(null);
            }
          }}
        >
          <form
            onSubmit={handleComplete}
            className="space-y-4"
          >
            <div>
              <label
                htmlFor="follow-up-outcome"
                className="text-sm font-semibold text-slate-700"
              >
                Outcome
              </label>

              <textarea
                id="follow-up-outcome"
                name="outcome"
                required
                rows={4}
                placeholder="Record the follow-up outcome..."
                className="mt-2 w-full rounded-lg border border-slate-300 p-3 text-sm outline-none focus:border-[#0D9488] focus:ring-1 focus:ring-[#0D9488]"
              />
            </div>

            <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
              <button
                type="button"
                onClick={() => {
                  setShowComplete(false);
                  setSelectedId(null);
                }}
                disabled={actionLoading}
                className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={actionLoading}
                className="rounded-lg bg-[#0B2545] px-4 py-2.5 text-sm font-semibold text-white disabled:bg-slate-400"
              >
                {actionLoading
                  ? "Saving..."
                  : "Mark Completed"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Reschedule Modal */}
      {showReschedule && (
        <Modal
          title="Reschedule Follow-up"
          onClose={() => {
            if (!actionLoading) {
              setShowReschedule(false);
              setSelectedId(null);
            }
          }}
        >
          <form
            onSubmit={handleReschedule}
            className="space-y-4"
          >
            <div>
              <label
                htmlFor="reschedule-date"
                className="text-sm font-semibold text-slate-700"
              >
                New Date
              </label>

              <input
                id="reschedule-date"
                name="date"
                type="date"
                required
                className="mt-2 w-full rounded-lg border border-slate-300 p-3 text-sm outline-none focus:border-[#0D9488] focus:ring-1 focus:ring-[#0D9488]"
              />
            </div>

            <div>
              <label
                htmlFor="reschedule-time"
                className="text-sm font-semibold text-slate-700"
              >
                New Time
              </label>

              <input
                id="reschedule-time"
                name="time"
                type="time"
                required
                className="mt-2 w-full rounded-lg border border-slate-300 p-3 text-sm outline-none focus:border-[#0D9488] focus:ring-1 focus:ring-[#0D9488]"
              />
            </div>

            <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
              <button
                type="button"
                onClick={() => {
                  setShowReschedule(false);
                  setSelectedId(null);
                }}
                disabled={actionLoading}
                className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={actionLoading}
                className="rounded-lg bg-[#0B2545] px-4 py-2.5 text-sm font-semibold text-white disabled:bg-slate-400"
              >
                {actionLoading
                  ? "Saving..."
                  : "Reschedule"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

/* =========================================================
   Stat Card
   ========================================================= */

function StatCard({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
        {label}
      </div>

      <div className="mt-2 text-3xl font-bold text-[#0B2545]">
        {value}
      </div>
    </div>
  );
}

/* =========================================================
   Priority Badge
   ========================================================= */

function PriorityBadge({
  priority,
}: {
  priority: string;
}) {
  const normalized = priority.toLowerCase();

  let className =
    "bg-slate-100 text-slate-700";

  if (normalized === "urgent") {
    className = "bg-red-100 text-red-700";
  } else if (normalized === "high") {
    className = "bg-amber-100 text-amber-700";
  } else if (normalized === "moderate") {
    className = "bg-blue-50 text-blue-700";
  } else if (normalized === "low") {
    className = "bg-green-50 text-green-700";
  }

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${className}`}
    >
      {priority || "—"}
    </span>
  );
}

/* =========================================================
   Status Badge
   ========================================================= */

function StatusBadge({
  status,
  scheduledAt,
}: {
  status: string;
  scheduledAt: string;
}) {
  const normalized = status.toLowerCase();

  let className =
    "bg-slate-100 text-slate-700";

  if (normalized === "completed") {
    className = "bg-green-50 text-green-700";
  } else if (normalized === "rescheduled") {
    className = "bg-purple-50 text-purple-700";
  } else if (
    normalized === "scheduled" ||
    normalized === "pending"
  ) {
    if (new Date(scheduledAt) < new Date()) {
      className = "bg-red-50 text-red-700";
      status = "Overdue";
    } else {
      className = "bg-blue-50 text-blue-700";
    }
  }

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${className}`}
    >
      {status || "—"}
    </span>
  );
}

/* =========================================================
   Modal
   ========================================================= */

function Modal({
  title,
  children,
  onClose,
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-black/40 p-4">
      <div className="my-8 w-full max-w-md rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 p-5">
          <h2 className="font-semibold text-[#0B2545]">
            {title}
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close modal"
          >
            <span className="material-symbols-outlined">
              close
            </span>
          </button>
        </div>

        <div className="p-5">
          {children}
        </div>
      </div>
    </div>
  );
}