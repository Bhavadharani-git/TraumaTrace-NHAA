import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import PortalHeader from "../components/PortalHeader";
import PortalSidebar from "../components/PortalSidebar";

export const Route = createFileRoute("/reports")({
  head: () => ({
    meta: [
      { title: "NHAA 14566 — Reports" },
      {
        name: "description",
        content:
          "NHAA 14566 — National Atrocity Helpline & Case Intelligence System.",
      },
    ],
  }),
  component: Reports,
});

type ReportCase = {
  id: string;
  location: string;
  category: string;
  description: string;
  priority: "Urgent" | "High" | "Moderate";
  status: "Under Review" | "Active Enquiry" | "Closed" | "Follow-up";
  updated: string;
};

const reportCases: ReportCase[] = [
  {
    id: "NHAA-2026-004821",
    location: "Madurai",
    category: "SC/ST PoA Sec 3(1)(r)",
    description: "Public Insult & Caste Slurs",
    priority: "Urgent",
    status: "Under Review",
    updated: "Today, 10:30 AM",
  },
  {
    id: "NHAA-2026-004790",
    location: "Dharwad",
    category: "SC/ST PoA Sec 3(1)(g)",
    description: "Agricultural Land Dispossession",
    priority: "High",
    status: "Active Enquiry",
    updated: "Yesterday, 4:15 PM",
  },
  {
    id: "NHAA-2026-004652",
    location: "Patna",
    category: "Rule 12(4) Relief Grant",
    description: "Direct Financial Assistance Claim",
    priority: "Moderate",
    status: "Closed",
    updated: "02 Sep 2026",
  },
  {
    id: "NHAA-2026-004618",
    location: "Jaipur",
    category: "Legal Aid Assistance",
    description: "Special Public Prosecutor Appointment",
    priority: "Moderate",
    status: "Follow-up",
    updated: "01 Sep 2026",
  },
  {
    id: "NHAA-2026-004550",
    location: "Warangal",
    category: "Sec 3(1)(w) Gender/Assault",
    description: "Immediate Police Protection Order",
    priority: "Urgent",
    status: "Closed",
    updated: "30 Aug 2026",
  },
];

function Reports() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dateRange, setDateRange] = useState("Last 30 Days");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");

  const [appliedFilters, setAppliedFilters] = useState({
    dateRange: "Last 30 Days",
    status: "All",
    priority: "All",
  });

  const [selectedCase, setSelectedCase] = useState<ReportCase | null>(null);
  const [message, setMessage] = useState("");

  const filteredCases = useMemo(() => {
    return reportCases.filter((item) => {
      const statusMatch =
        appliedFilters.status === "All" ||
        item.status === appliedFilters.status;

      const priorityMatch =
        appliedFilters.priority === "All" ||
        item.priority === appliedFilters.priority;

      return statusMatch && priorityMatch;
    });
  }, [appliedFilters]);

  const applyFilters = () => {
    setAppliedFilters({
      dateRange,
      status: statusFilter,
      priority: priorityFilter,
    });

    setMessage("Report filters applied successfully.");
  };

  const resetFilters = () => {
    setDateRange("Last 30 Days");
    setStatusFilter("All");
    setPriorityFilter("All");

    setAppliedFilters({
      dateRange: "Last 30 Days",
      status: "All",
      priority: "All",
    });

    setMessage("Filters reset.");
  };

  const generateReport = () => {
    setMessage(
      `Custom report generated for ${appliedFilters.dateRange}.`,
    );
  };

  const exportReport = () => {
    const content = [
      "NHAA 14566 — Professional Casework Report",
      `Reporting Period: ${appliedFilters.dateRange}`,
      `Status: ${appliedFilters.status}`,
      `Priority: ${appliedFilters.priority}`,
      "",
      "Case ID,Location,Category,Priority,Status,Last Updated",
      ...filteredCases.map(
        (item) =>
          `"${item.id}","${item.location}","${item.category}","${item.priority}","${item.status}","${item.updated}"`,
      ),
    ].join("\n");

    const blob = new Blob([content], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "NHAA-Professional-Report.csv";
    link.click();

    URL.revokeObjectURL(url);

    setMessage("Report exported successfully.");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Government color strip */}
      <div className="fixed left-0 right-0 top-0 z-50 flex h-[3px]">
        <div className="w-1/3 bg-[#F59E0B]" />
        <div className="w-1/3 bg-white" />
        <div className="w-1/3 bg-[#0D9488]" />
      </div>

      {/* Shared sidebar */}
      <PortalSidebar
        active="reports"
        alertCount={6}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Shared government header */}
        <PortalHeader
          alertCount={6}
          onMenuClick={() => setSidebarOpen(true)}
        />

        <main className="min-h-[calc(100vh-64px)] bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl space-y-6">
            {/* Page heading */}
            <section>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-wider text-slate-500">
                    <span>Operations Desk</span>

                    <span className="material-symbols-outlined text-[14px]">
                      chevron_right
                    </span>

                    <span className="text-[#0D9488]">
                      Reports
                    </span>
                  </div>

                  <h1 className="text-2xl font-bold tracking-tight text-[#0B2545]">
                    Reports
                  </h1>

                  <p className="mt-1 text-sm text-slate-500">
                    View casework summaries and generate professional
                    reports.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={generateReport}
                  className="flex items-center justify-center gap-2 rounded-lg bg-[#0B2545] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#12365D]"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    description
                  </span>

                  Generate Report
                </button>
              </div>
            </section>

            {/* Success / information message */}
            {message && (
              <div className="flex items-center justify-between rounded-lg border border-[#99D5CE] bg-[#F0FDF4] px-4 py-3 text-sm text-[#166534]">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">
                    check_circle
                  </span>

                  <span>{message}</span>
                </div>

                <button
                  type="button"
                  onClick={() => setMessage("")}
                  className="text-slate-500 hover:text-slate-800"
                  aria-label="Close message"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    close
                  </span>
                </button>
              </div>
            )}

            {/* Summary cards */}
            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                icon="folder_shared"
                label="Total Cases"
                value="42"
                description="Assigned casework"
              />

              <StatCard
                icon="task_alt"
                label="Resolved"
                value="25"
                description="Cases successfully closed"
                positive
              />

              <StatCard
                icon="pending_actions"
                label="Pending"
                value="17"
                description="Cases requiring action"
              />

              <StatCard
                icon="schedule"
                label="Follow-ups"
                value="09"
                description="Scheduled citizen follow-ups"
              />
            </section>

            {/* Report filters */}
            <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#0D9488]">
                  filter_alt
                </span>

                <div>
                  <h2 className="text-base font-bold text-[#0B2545]">
                    Report Filters
                  </h2>

                  <p className="text-xs text-slate-500">
                    Select the information you want to include.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <FilterSelect
                  label="Date Range"
                  value={dateRange}
                  onChange={setDateRange}
                  options={[
                    "Last 7 Days",
                    "Last 30 Days",
                    "Last 90 Days",
                    "Current Quarter",
                  ]}
                />

                <FilterSelect
                  label="Case Status"
                  value={statusFilter}
                  onChange={setStatusFilter}
                  options={[
                    "All",
                    "Under Review",
                    "Active Enquiry",
                    "Closed",
                    "Follow-up",
                  ]}
                />

                <FilterSelect
                  label="Priority"
                  value={priorityFilter}
                  onChange={setPriorityFilter}
                  options={[
                    "All",
                    "Urgent",
                    "High",
                    "Moderate",
                  ]}
                />
              </div>

              <div className="mt-4 flex flex-wrap justify-end gap-2">
                <button
                  type="button"
                  onClick={resetFilters}
                  className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Reset
                </button>

                <button
                  type="button"
                  onClick={applyFilters}
                  className="rounded-lg bg-[#0D9488] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0B766F]"
                >
                  Apply Filters
                </button>
              </div>
            </section>

            {/* Casework report */}
            <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="flex flex-col gap-3 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-bold text-[#0B2545]">
                    Casework Report
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    {filteredCases.length} cases match the selected
                    filters.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={exportReport}
                  className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    file_download
                  </span>

                  Export CSV
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[800px] text-left">
                  <thead>
                    <tr className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                      <th className="px-5 py-3 font-semibold">
                        Case ID
                      </th>

                      <th className="px-5 py-3 font-semibold">
                        Category
                      </th>

                      <th className="px-5 py-3 font-semibold">
                        Priority
                      </th>

                      <th className="px-5 py-3 font-semibold">
                        Status
                      </th>

                      <th className="px-5 py-3 font-semibold">
                        Last Updated
                      </th>

                      <th className="px-5 py-3 text-right font-semibold">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {filteredCases.map((item) => (
                      <tr
                        key={item.id}
                        className="hover:bg-slate-50"
                      >
                        <td className="px-5 py-4">
                          <div>
                            <div className="font-mono text-sm font-bold text-[#0B2545]">
                              {item.id}
                            </div>

                            <div className="mt-1 text-xs text-slate-500">
                              {item.location}
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <div className="text-sm font-semibold text-slate-800">
                            {item.category}
                          </div>

                          <div className="mt-1 text-xs text-slate-500">
                            {item.description}
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <PriorityBadge
                            priority={item.priority}
                          />
                        </td>

                        <td className="px-5 py-4">
                          <StatusBadge
                            status={item.status}
                          />
                        </td>

                        <td className="px-5 py-4 text-sm text-slate-600">
                          {item.updated}
                        </td>

                        <td className="px-5 py-4 text-right">
                          <button
                            type="button"
                            onClick={() => setSelectedCase(item)}
                            className="font-semibold text-[#0D9488] hover:text-[#0B2545] hover:underline"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Empty state */}
              {filteredCases.length === 0 && (
                <div className="px-5 py-12 text-center">
                  <span className="material-symbols-outlined text-4xl text-slate-300">
                    search_off
                  </span>

                  <p className="mt-2 text-sm font-semibold text-slate-600">
                    No cases match the selected filters.
                  </p>

                  <button
                    type="button"
                    onClick={resetFilters}
                    className="mt-3 text-sm font-semibold text-[#0D9488] hover:underline"
                  >
                    Reset filters
                  </button>
                </div>
              )}

              {/* Pagination / count */}
              <div className="flex flex-col gap-3 border-t border-slate-200 bg-slate-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <span className="text-sm text-slate-500">
                  Showing{" "}
                  <strong className="text-[#0B2545]">
                    {filteredCases.length}
                  </strong>{" "}
                  of{" "}
                  <strong className="text-[#0B2545]">
                    42
                  </strong>{" "}
                  cases
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled
                    className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-400"
                  >
                    Previous
                  </button>

                  <span className="rounded-lg bg-[#0B2545] px-3 py-1.5 text-sm font-semibold text-white">
                    1
                  </span>

                  <button
                    type="button"
                    className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            </section>

            {/* Report information */}
            <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#EEF2FF] text-[#3730A3]">
                  <span className="material-symbols-outlined">
                    verified_user
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-[#0B2545]">
                    Report & Audit Information
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    Reports are generated from the professional casework
                    records available to the authenticated officer. Final
                    statutory decisions remain with authorized officers.
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

      {/* View Case Modal */}
      {selectedCase && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-xl bg-white shadow-xl">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-200 p-5">
              <div>
                <div className="font-mono text-sm font-bold text-[#0B2545]">
                  {selectedCase.id}
                </div>

                <h2 className="mt-1 text-lg font-bold text-[#0B2545]">
                  Case Report
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setSelectedCase(null)}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                aria-label="Close case report"
              >
                <span className="material-symbols-outlined">
                  close
                </span>
              </button>
            </div>

            {/* Modal Content */}
            <div className="space-y-4 p-5">
              <DetailRow
                label="Location"
                value={selectedCase.location}
              />

              <DetailRow
                label="Category"
                value={selectedCase.category}
              />

              <DetailRow
                label="Description"
                value={selectedCase.description}
              />

              <DetailRow
                label="Priority"
                value={selectedCase.priority}
              />

              <DetailRow
                label="Status"
                value={selectedCase.status}
              />

              <DetailRow
                label="Last Updated"
                value={selectedCase.updated}
              />
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end border-t border-slate-200 bg-slate-50 p-4">
              <button
                type="button"
                onClick={() => setSelectedCase(null)}
                className="rounded-lg bg-[#0B2545] px-4 py-2 text-sm font-semibold text-white hover:bg-[#12365D]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================================================
   Summary Card
   ========================================================= */

function StatCard({
  icon,
  label,
  value,
  description,
  positive = false,
}: {
  icon: string;
  label: string;
  value: string;
  description: string;
  positive?: boolean;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-slate-500">
          {label}
        </span>

        <span
          className={`material-symbols-outlined ${
            positive ? "text-[#0D9488]" : "text-[#0B2545]"
          }`}
        >
          {icon}
        </span>
      </div>

      <div
        className={`mt-3 text-3xl font-bold ${
          positive ? "text-[#0D9488]" : "text-[#0B2545]"
        }`}
      >
        {value}
      </div>

      <p className="mt-1 text-xs text-slate-500">
        {description}
      </p>
    </div>
  );
}

/* =========================================================
   Filter Select
   ========================================================= */

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
        {label}
      </label>

      <div className="relative">
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-10 w-full appearance-none rounded-lg border border-slate-200 bg-slate-50 px-3 pr-9 text-sm text-slate-700 outline-none focus:border-[#0D9488] focus:ring-1 focus:ring-[#0D9488]"
        >
          {options.map((option) => (
            <option
              key={option}
              value={option}
            >
              {option}
            </option>
          ))}
        </select>

        <span className="material-symbols-outlined pointer-events-none absolute right-2 top-2 text-[20px] text-slate-400">
          expand_more
        </span>
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
  priority: ReportCase["priority"];
}) {
  const styles: Record<
    ReportCase["priority"],
    string
  > = {
    Urgent: "bg-red-100 text-red-700",
    High: "bg-amber-100 text-amber-700",
    Moderate: "bg-teal-50 text-teal-700",
  };

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${styles[priority]}`}
    >
      {priority}
    </span>
  );
}

/* =========================================================
   Status Badge
   ========================================================= */

function StatusBadge({
  status,
}: {
  status: ReportCase["status"];
}) {
  const styles: Record<
    ReportCase["status"],
    string
  > = {
    "Under Review": "bg-blue-50 text-blue-700",
    "Active Enquiry": "bg-amber-50 text-amber-700",
    Closed: "bg-green-50 text-green-700",
    "Follow-up": "bg-purple-50 text-purple-700",
  };

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${styles[status]}`}
    >
      {status}
    </span>
  );
}

/* =========================================================
   Modal Detail Row
   ========================================================= */

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-col gap-1 border-b border-slate-100 pb-3 last:border-0">
      <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
        {label}
      </span>

      <span className="text-sm font-medium text-slate-800">
        {value}
      </span>
    </div>
  );
}