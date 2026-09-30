type PortalHeaderProps = {
  alertCount?: number;
  onMenuClick?: () => void;
};

export default function PortalHeader({
  alertCount = 0,
  onMenuClick,
}: PortalHeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-3 shadow-sm sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 lg:hidden"
          aria-label="Open navigation menu"
          title="Open navigation menu"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            className="h-6 w-6"
            aria-hidden="true"
          >
            <path d="M4 6h16" />
            <path d="M4 12h16" />
            <path d="M4 18h16" />
          </svg>
        </button>

        <div className="flex min-w-0 items-center gap-2.5">
          <img
            src="/images/nhaa-logo.png"
            alt="NHAA 14566"
            className="h-9 w-auto shrink-0 object-contain"
          />
          <div className="min-w-0 leading-tight">
            <div className="truncate text-sm font-bold text-[#0B2545] sm:text-base">
              NHAA 14566
            </div>
            <div className="truncate text-[10px] text-slate-500 sm:text-xs">
              Professional Portal
            </div>
          </div>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1 sm:gap-3">
        <div className="mr-2 hidden border-r border-slate-200 pr-4 text-right lg:block">
          <div className="text-[10px] font-bold uppercase tracking-wide text-[#0B2545]">
            Ministry of Social Justice &amp; Empowerment
          </div>
          <div className="text-[10px] text-slate-500">
            Department of Social Justice and Empowerment
          </div>
        </div>

        <a
          href="/alerts"
          className="relative flex h-10 w-10 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
          title="Alerts"
          aria-label="Alerts"
        >
          <span className="material-symbols-outlined text-[22px]">
            notifications
          </span>
          {alertCount > 0 && (
            <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[9px] font-bold text-white">
              {alertCount}
            </span>
          )}
        </a>

        <div className="flex items-center gap-2">
          <div className="hidden text-right md:block">
            <div className="text-sm font-semibold text-[#0B2545]">
              Professional A
            </div>
            <div className="text-[11px] text-slate-500">
              PRO-001 • NHAA Support
            </div>
          </div>
          <div className="h-9 w-9 overflow-hidden rounded-full border border-slate-200 bg-slate-100">
            <img
              src="/images/default-profile.jpeg"
              alt="Professional profile"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
