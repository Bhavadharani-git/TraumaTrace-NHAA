type PortalSidebarProps = {
  active:
    | "dashboard"
    | "cases"
    | "follow-ups"
    | "alerts"
    | "reports"
    | "profile";
  alertCount?: number;
  open?: boolean;
  onClose?: () => void;
};

type SidebarContentProps = {
  active: PortalSidebarProps["active"];
  alertCount: number;
  onNavigate?: (() => void) | undefined;
};

export default function PortalSidebar({
  active,
  alertCount = 0,
  open = false,
  onClose,
}: PortalSidebarProps) {
  return (
    <>
      <aside className="fixed bottom-0 left-0 top-0 z-40 hidden w-64 flex-col bg-white shadow-sm lg:flex">
        <SidebarContent
          active={active}
          alertCount={alertCount}
        />
      </aside>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-slate-900/40"
            onClick={onClose}
            aria-label="Close navigation menu"
          />

          <aside className="relative flex h-full w-72 max-w-[85vw] flex-col bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <div className="flex items-center gap-2.5">
                <img
                  src="/images/nhaa-logo.png"
                  alt="NHAA 14566"
                  className="h-11 w-auto object-contain"
                />
                <div className="leading-tight">
                  <div className="text-sm font-bold text-[#0B2545]">
                    NHAA 14566
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Professional Portal
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
                aria-label="Close navigation menu"
                title="Close navigation menu"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  className="h-5 w-5"
                  aria-hidden="true"
                >
                  <path d="M6 6l12 12" />
                  <path d="M18 6L6 18" />
                </svg>
              </button>
            </div>

            <SidebarContent
              active={active}
              alertCount={alertCount}
              onNavigate={onClose}
            />
          </aside>
        </div>
      )}
    </>
  );
}

function SidebarContent({
  active,
  alertCount,
  onNavigate,
}: SidebarContentProps) {
  return (
    <>

      <div className="px-5 py-4">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
          Operations Desk
        </span>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        <NavItem href="/dashboard" icon="grid_view" label="Dashboard" active={active === "dashboard"} onNavigate={onNavigate} />
        <NavItem href="/cases" icon="folder_shared" label="Cases" active={active === "cases"} onNavigate={onNavigate} />
        <NavItem href="/follow-ups" icon="schedule" label="Follow-ups" active={active === "follow-ups"} onNavigate={onNavigate} />
        <NavItem href="/alerts" icon="notifications_active" label="Alerts" active={active === "alerts"} badge={alertCount > 0 ? String(alertCount) : undefined} onNavigate={onNavigate} />
        <NavItem href="/reports" icon="summarize" label="Reports" active={active === "reports"} onNavigate={onNavigate} />
        <NavItem href="/profile" icon="manage_accounts" label="Profile & Security" active={active === "profile"} onNavigate={onNavigate} />
      </nav>

      <div className="border-t border-slate-200 bg-slate-50 p-4">
        <div className="rounded-lg bg-white p-3">
          <div className="flex gap-2">
            <span className="material-symbols-outlined text-[#0D9488]">
              verified_user
            </span>
            <div>
              <div className="text-xs font-semibold text-[#0B2545]">
                Professional Access
              </div>
              <div className="mt-1 text-[11px] text-slate-500">
                Authenticated session
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function NavItem({
  href,
  icon,
  label,
  active = false,
  badge,
  onNavigate,
}: {
  href: string;
  icon: string;
  label: string;
  active?: boolean;
  badge?: string | undefined;
  onNavigate?: (() => void) | undefined;
}) {
  return (
    <a
      href={href}
      onClick={onNavigate}
      className={`flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm ${
        active
          ? "bg-[#0B2545] font-semibold text-white"
          : "text-slate-600 hover:bg-slate-100"
      }`}
    >
      <span className="material-symbols-outlined text-[20px]">
        {icon}
      </span>

      <span className="min-w-0 flex-1">{label}</span>

      {badge && (
        <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-700">
          {badge}
        </span>
      )}
    </a>
  );
}
