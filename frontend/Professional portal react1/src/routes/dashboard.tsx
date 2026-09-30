import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import PortalHeader from "../components/PortalHeader";
import PortalSidebar from "../components/PortalSidebar";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "NHAA 14566 - Professional Dashboard" },
      {
        name: "description",
        content:
          "NHAA 14566 — National Atrocity Helpline & Case Intelligence System.",
      },
    ],
  }),
  component: Dashboard,
});

type Complaint = {
  id?: number | string;
  complaint_id?: string;
  language?: string;
  communication_method?: string;
  complaint_text?: string;
  transcript?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
};

type FollowUp = {
  id?: number;
  complaint_id?: string;
  scheduled_at?: string;
  follow_up_type?: string;
  priority?: string;
  status?: string;
};

type User = {
  id?: number;
  full_name?: string;
  email?: string;
  role?: string;
};

function getAuth() {
  try {
    return JSON.parse(localStorage.getItem("nhaa_auth") || "{}");
  } catch {
    return {};
  }
}

function getToken() {
  const auth = getAuth();
  return auth?.access_token || "";
}

function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [followUps, setFollowUps] = useState<FollowUp[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const token = getToken();

        if (!token) {
          window.location.href = "/";
          return;
        }

        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const [meResponse, complaintsResponse, followUpsResponse] =
          await Promise.all([
            fetch("http://127.0.0.1:8000/api/v1/auth/me", {
              headers,
            }),
            fetch("http://127.0.0.1:8000/api/v1/complaints/", {
              headers,
            }),
            fetch("http://127.0.0.1:8000/api/v1/follow-ups/", {
              headers,
            }),
          ]);

        if (
          meResponse.status === 401 ||
          complaintsResponse.status === 401 ||
          followUpsResponse.status === 401
        ) {
          localStorage.removeItem("nhaa_auth");
          window.location.href = "/";
          return;
        }

        const meData = await meResponse.json();
        const complaintsData = await complaintsResponse.json();
        const followUpsData = await followUpsResponse.json();

        if (!meResponse.ok) {
          throw new Error(
            meData?.detail || "Unable to load professional profile.",
          );
        }

        if (!complaintsResponse.ok) {
          throw new Error(
            complaintsData?.detail || "Unable to load complaints.",
          );
        }

        if (!followUpsResponse.ok) {
          throw new Error(
            followUpsData?.detail || "Unable to load follow-ups.",
          );
        }

        setUser(meData);

        setComplaints(
          Array.isArray(complaintsData?.complaints)
            ? complaintsData.complaints
            : Array.isArray(complaintsData)
              ? complaintsData
              : [],
        );

        setFollowUps(
          Array.isArray(followUpsData?.follow_ups)
            ? followUpsData.follow_ups
            : [],
        );
      } catch (err) {
        console.error("Dashboard error:", err);

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load dashboard.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const stats = useMemo(() => {
    const total = complaints.length;

    const newCases = complaints.filter(
      (item) => item.status === "received",
    ).length;

    const screeningCases = complaints.filter(
      (item) => item.status === "under_assessment",
    ).length;

    const activeCases = complaints.filter((item) =>
      [
        "under_assessment",
        "support_recommended",
        "under_review",
        "action_in_progress",
      ].includes(item.status || ""),
    ).length;

    const resolvedCases = complaints.filter(
      (item) => item.status === "resolved",
    ).length;

    const pendingFollowUps = followUps.filter(
      (item) =>
        item.status !== "completed" &&
        item.status !== "rescheduled",
    ).length;

    return {
      total,
      newCases,
      screeningCases,
      activeCases,
      resolvedCases,
      pendingFollowUps,
    };
  }, [complaints, followUps]);

  const recentCases = useMemo(() => {
    return [...complaints]
      .sort((a, b) => {
        const aDate = new Date(
          a.updated_at || a.created_at || 0,
        ).getTime();

        const bDate = new Date(
          b.updated_at || b.created_at || 0,
        ).getTime();

        return bDate - aDate;
      })
      .slice(0, 6);
  }, [complaints]);

  const formatDate = (value?: string) => {
    if (!value) return "—";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "—";

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatStatus = (status?: string) => {
    const labels: Record<string, string> = {
      received: "New",
      under_assessment: "Under Assessment",
      support_recommended: "Support Recommended",
      under_review: "Under Review",
      action_in_progress: "Action In Progress",
      resolved: "Resolved",
      closed: "Closed",
    };

    return labels[status || ""] || status || "Unknown";
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <div className="fixed left-0 right-0 top-0 z-50 flex h-[3px]">
        <div className="w-1/3 bg-[#F59E0B]" />
        <div className="w-1/3 bg-white" />
        <div className="w-1/3 bg-[#0D9488]" />
      </div>

      <PortalSidebar
        active="dashboard"
        alertCount={6}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="lg:pl-64">
       <PortalHeader
          alertCount={6}
          onMenuClick={() => setSidebarOpen(true)}
        />

        <main className="min-h-[calc(100vh-64px)] px-4 py-6 sm:px-6">
          <div className="mx-auto max-w-[1500px] space-y-6">
            <section>
              <div className="text-xs font-semibold uppercase tracking-wider text-[#0D9488]">
                Professional Operations Desk
              </div>

              <h1 className="mt-1 text-2xl font-bold text-[#0B2545]">
                Welcome, {user?.full_name || "Professional"}
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Live case and follow-up information from the NHAA system.
              </p>
            </section>

            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
                {error}
              </div>
            )}

            <section className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
              <StatCard
                label="Total Cases"
                value={loading ? "—" : stats.total}
              />

              <StatCard
                label="New Cases"
                value={loading ? "—" : stats.newCases}
              />

              <StatCard
                label="Under Assessment"
                value={loading ? "—" : stats.screeningCases}
              />

              <StatCard
                label="Active Cases"
                value={loading ? "—" : stats.activeCases}
              />

              <StatCard
                label="Follow-ups"
                value={loading ? "—" : stats.pendingFollowUps}
              />

              <StatCard
                label="Resolved"
                value={loading ? "—" : stats.resolvedCases}
              />
            </section>

            <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-200 p-5">
                <div>
                  <h2 className="font-semibold text-[#0B2545]">
                    Recent Cases
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    Latest cases available to the professional portal.
                  </p>
                </div>

                <a
                  href="/cases"
                  className="rounded-lg bg-[#0B2545] px-4 py-2 text-xs font-semibold text-white hover:bg-[#134074]"
                >
                  View Cases
                </a>
              </div>

              {loading ? (
                <div className="p-10 text-center text-sm text-slate-500">
                  Loading dashboard...
                </div>
              ) : recentCases.length === 0 ? (
                <div className="p-10 text-center text-sm text-slate-500">
                  No cases available.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[800px] text-left text-sm">
                    <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                      <tr>
                        <th className="px-5 py-3">Case ID</th>
                        <th className="px-5 py-3">Complaint</th>
                        <th className="px-5 py-3">Channel</th>
                        <th className="px-5 py-3">Status</th>
                        <th className="px-5 py-3">Created</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                      {recentCases.map((item) => {
                        const id =
                          item.complaint_id ||
                          String(item.id || "");

                        return (
                          <tr
                            key={id}
                            className="hover:bg-slate-50"
                          >
                            <td className="px-5 py-4">
                              <a
                                href={`/cases/${encodeURIComponent(id)}`}
                                className="font-semibold text-[#0B2545] hover:underline"
                              >
                                {id || "—"}
                              </a>
                            </td>

                            <td className="max-w-md px-5 py-4">
                              <div className="truncate text-slate-700">
                                {item.complaint_text ||
                                  item.transcript ||
                                  "No complaint text"}
                              </div>
                            </td>

                            <td className="px-5 py-4 text-slate-500">
                              {item.communication_method || "—"}
                            </td>

                            <td className="px-5 py-4">
                              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                                {formatStatus(item.status)}
                              </span>
                            </td>

                            <td className="px-5 py-4 text-slate-500">
                              {formatDate(item.created_at)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}

function NavItem({
  href,
  icon,
  label,
  active = false,
}: {
  href: string;
  icon: string;
  label: string;
  active?: boolean;
}) {
  return (
    <a
      href={href}
      className={`flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm ${active
          ? "bg-[#0B2545] font-semibold text-white"
          : "text-slate-600 hover:bg-slate-100"
        }`}
    >
      <span className="material-symbols-outlined text-[20px]">
        {icon}
      </span>

      {label}
    </a>
  );
}

function StatCard({
  label,
  value,
}: {
  label: string;
  value: number | string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
        {label}
      </div>

      <div className="mt-3 text-3xl font-bold text-[#0B2545]">
        {value}
      </div>
    </div>
  );
}