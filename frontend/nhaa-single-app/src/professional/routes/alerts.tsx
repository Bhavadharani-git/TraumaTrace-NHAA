import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import PortalHeader from "../components/PortalHeader";
import PortalSidebar from "../components/PortalSidebar";

export const Route = createFileRoute("/alerts")({
  head: () => ({
    meta: [
      { title: "NHAA 14566 — Alerts" },
      {
        name: "description",
        content:
          "NHAA 14566 — National Atrocity Helpline & Case Intelligence System.",
      },
    ],
  }),
  component: AlertsPage,
});

type AlertType =
  | "Urgent"
  | "Follow-up"
  | "Case Update"
  | "System";

type AlertItem = {
  id: number;
  type: AlertType;
  title: string;
  message: string;
  caseId?: string;
  time: string;
  unread: boolean;
  icon: string;
};

const initialAlerts: AlertItem[] = [
  {
    id: 1,
    type: "Urgent",
    title: "Urgent case requires attention",
    message:
      "A high-priority case has been assigned for professional review.",
    caseId: "NHAA-CA2FC7A18A",
    time: "10 minutes ago",
    unread: true,
    icon: "priority_high",
  },
  {
    id: 2,
    type: "Follow-up",
    title: "Follow-up scheduled",
    message:
      "A support call has been scheduled for the selected case.",
    caseId: "NHAA-CA2FC7A18A",
    time: "32 minutes ago",
    unread: true,
    icon: "schedule",
  },
  {
    id: 3,
    type: "Case Update",
    title: "Case status updated",
    message:
      "The status of a case assigned to your desk has been updated.",
    caseId: "NHAA-7B91D42C11",
    time: "1 hour ago",
    unread: true,
    icon: "sync",
  },
  {
    id: 4,
    type: "Follow-up",
    title: "Follow-up due today",
    message:
      "A scheduled professional follow-up is due today.",
    caseId: "NHAA-91D72C4B10",
    time: "2 hours ago",
    unread: true,
    icon: "event",
  },
  {
    id: 5,
    type: "System",
    title: "Portal synchronization completed",
    message:
      "Case and follow-up data synchronization completed successfully.",
    time: "Yesterday",
    unread: false,
    icon: "cloud_done",
  },
  {
    id: 6,
    type: "Case Update",
    title: "Professional note added",
    message:
      "A new professional note has been added to an assigned case.",
    caseId: "NHAA-44C82F190B",
    time: "Yesterday",
    unread: false,
    icon: "notes",
  },
];

function AlertsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [alerts, setAlerts] =
    useState<AlertItem[]>(initialAlerts);

  const [filter, setFilter] = useState<
    "All" | "Unread" | "Urgent"
  >("All");

  const unreadCount = alerts.filter(
    (alert) => alert.unread,
  ).length;

  const urgentCount = alerts.filter(
    (alert) => alert.type === "Urgent",
  ).length;

  const filteredAlerts = useMemo(() => {
    if (filter === "Unread") {
      return alerts.filter((alert) => alert.unread);
    }

    if (filter === "Urgent") {
      return alerts.filter(
        (alert) => alert.type === "Urgent",
      );
    }

    return alerts;
  }, [alerts, filter]);

  function markAsRead(id: number) {
    setAlerts((current) =>
      current.map((alert) =>
        alert.id === id
          ? { ...alert, unread: false }
          : alert,
      ),
    );
  }

  function markAllAsRead() {
    setAlerts((current) =>
      current.map((alert) => ({
        ...alert,
        unread: false,
      })),
    );
  }

  function getTypeStyles(type: AlertType) {
    switch (type) {
      case "Urgent":
        return "bg-red-50 text-red-700 border-red-100";

      case "Follow-up":
        return "bg-amber-50 text-amber-700 border-amber-100";

      case "Case Update":
        return "bg-blue-50 text-blue-700 border-blue-100";

      default:
        return "bg-slate-50 text-slate-600 border-slate-200";
    }
  }

  function getIconStyles(type: AlertType) {
    switch (type) {
      case "Urgent":
        return "bg-red-50 text-red-600";

      case "Follow-up":
        return "bg-amber-50 text-amber-600";

      case "Case Update":
        return "bg-blue-50 text-blue-600";

      default:
        return "bg-slate-50 text-slate-600";
    }
  }

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
        active="alerts"
        alertCount={unreadCount}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Shared Government Header */}
        <PortalHeader
          alertCount={unreadCount}
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
                      Alerts
                    </span>
                  </div>

                  <h1 className="text-2xl font-bold tracking-tight text-[#0B2545]">
                    Alerts
                  </h1>

                  <p className="mt-1 text-sm text-slate-500">
                    Notifications and operational alerts requiring
                    your attention.
                  </p>
                </div>

                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={markAllAsRead}
                    className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      done_all
                    </span>

                    Mark all as read
                  </button>
                )}
              </div>
            </section>

            {/* Summary Cards */}
            <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <SummaryCard
                label="Total Alerts"
                value={alerts.length}
                icon="notifications"
              />

              <SummaryCard
                label="Unread"
                value={unreadCount}
                icon="mark_email_unread"
              />

              <SummaryCard
                label="Urgent"
                value={urgentCount}
                icon="priority_high"
              />
            </section>

            {/* Filters */}
            <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-sm font-bold text-[#0B2545]">
                    Alert Filters
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    Filter notifications by type and read status.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {(
                    ["All", "Unread", "Urgent"] as const
                  ).map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setFilter(item)}
                      className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                        filter === item
                          ? "bg-[#0B2545] text-white"
                          : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {item}

                      {item === "Unread" &&
                        unreadCount > 0 && (
                          <span
                            className={`ml-2 rounded-full px-1.5 py-0.5 text-xs ${
                              filter === item
                                ? "bg-white/20 text-white"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {unreadCount}
                          </span>
                        )}
                    </button>
                  ))}
                </div>
              </div>
            </section>

            {/* Recent Alerts */}
            <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-200 px-5 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-[#0B2545]">
                      Recent Alerts
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      {filteredAlerts.length} alert
                      {filteredAlerts.length === 1
                        ? ""
                        : "s"} displayed
                    </p>
                  </div>

                  <span className="material-symbols-outlined text-[#0D9488]">
                    notifications_active
                  </span>
                </div>
              </div>

              <div className="divide-y divide-slate-100">
                {filteredAlerts.length === 0 ? (
                  <div className="px-6 py-12 text-center">
                    <span className="material-symbols-outlined text-4xl text-slate-300">
                      notifications_off
                    </span>

                    <p className="mt-3 text-sm font-semibold text-slate-700">
                      No alerts found
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      There are no alerts matching the selected
                      filter.
                    </p>

                    <button
                      type="button"
                      onClick={() => setFilter("All")}
                      className="mt-3 text-sm font-semibold text-[#0D9488] hover:underline"
                    >
                      Show all alerts
                    </button>
                  </div>
                ) : (
                  filteredAlerts.map((alert) => (
                    <div
                      key={alert.id}
                      className={`flex flex-col gap-4 px-5 py-5 transition hover:bg-slate-50 sm:flex-row sm:items-start ${
                        alert.unread
                          ? "bg-slate-50/60"
                          : "bg-white"
                      }`}
                    >
                      {/* Alert Icon */}
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${getIconStyles(
                          alert.type,
                        )}`}
                      >
                        <span className="material-symbols-outlined text-[21px]">
                          {alert.icon}
                        </span>
                      </div>

                      {/* Alert Content */}
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3
                            className={`text-sm ${
                              alert.unread
                                ? "font-bold text-slate-900"
                                : "font-semibold text-slate-700"
                            }`}
                          >
                            {alert.title}
                          </h3>

                          <span
                            className={`rounded border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${getTypeStyles(
                              alert.type,
                            )}`}
                          >
                            {alert.type}
                          </span>

                          {alert.unread && (
                            <span
                              className="h-2 w-2 rounded-full bg-red-500"
                              title="Unread"
                            />
                          )}
                        </div>

                        <p className="mt-1 text-sm leading-6 text-slate-600">
                          {alert.message}
                        </p>

                        <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-400">
                          <span>{alert.time}</span>

                          {alert.caseId && (
                            <>
                              <span>•</span>

                              <Link
                                to="/cases"
                                className="font-semibold text-[#0D9488] hover:text-[#0B2545] hover:underline"
                              >
                                {alert.caseId}
                              </Link>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Action */}
                      {alert.unread && (
                        <button
                          type="button"
                          onClick={() =>
                            markAsRead(alert.id)
                          }
                          className="flex w-fit shrink-0 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                        >
                          <span className="material-symbols-outlined text-[16px]">
                            done
                          </span>

                          Mark read
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
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
                    Alert Information
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    Alerts highlight case updates, scheduled
                    follow-ups, urgent actions, and important
                    portal events requiring professional attention.
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
   Summary Card
   ========================================================= */

function SummaryCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            {label}
          </div>

          <div className="mt-2 text-3xl font-bold text-[#0B2545]">
            {value}
          </div>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-[#0D9488]">
          <span className="material-symbols-outlined">
            {icon}
          </span>
        </div>
      </div>
    </div>
  );
}