const STYLE_MAP = {
  "High Risk": "bg-error-container text-on-error-container border-red-300",
  Critical: "bg-error-container text-on-error-container border-red-300",
  "Needs Review": "bg-warning-container text-on-warning-container border-amber-300",
  Pending: "bg-warning-container text-on-warning-container border-amber-300",
  Overdue: "bg-error-container text-on-error-container border-red-300",
  Medium: "bg-warning-container text-on-warning-container border-amber-300",
  High: "bg-error-container text-on-error-container border-red-300",
  Low: "bg-surface-container-high text-on-surface-variant border-outline-variant",
  "Active / Verified": "bg-success-container text-on-success-container border-green-300",
  Verified: "bg-success-container text-on-success-container border-green-300",
  Resolved: "bg-success-container text-on-success-container border-green-300",
  Scheduled: "bg-success-container text-on-success-container border-green-300",
  Available: "bg-success-container text-on-success-container border-green-300",
  "Machine Assisted": "bg-tertiary-container text-on-tertiary-container border-teal-300",
  "Under Investigation": "bg-secondary-container text-on-secondary-container border-indigo-300",
  Escalated: "bg-error-container text-on-error-container border-red-300",
  "Professional Review": "bg-secondary-container text-on-secondary-container border-indigo-300",
  "Awaiting Verification": "bg-warning-container text-on-warning-container border-amber-300",
  "On Field Visit": "bg-secondary-container text-on-secondary-container border-indigo-300",
  Unavailable: "bg-surface-container-high text-on-surface-variant border-outline-variant",
};

export default function StatusBadge({ label, className = "" }) {
  const style = STYLE_MAP[label] || "bg-surface-container-high text-on-surface-variant border-outline-variant";
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 h-6 rounded-full border text-[11px] font-bold uppercase tracking-wide whitespace-nowrap ${style} ${className}`}
    >
      {label}
    </span>
  );
}
