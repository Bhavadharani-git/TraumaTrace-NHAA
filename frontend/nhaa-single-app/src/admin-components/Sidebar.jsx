import { NavLink } from "react-router-dom";
import Icon from "./Icon";
import nhaaLogo from "../admin-assets/nhaa-logo.png";

const NAV_ITEMS = [
  { path: "/dashboard", label: "Dashboard", icon: "dashboard" },
  { path: "/cases", label: "Cases", icon: "folder_shared" },
  { path: "/professionals", label: "Professionals", icon: "clinical_notes" },
  { path: "/follow-ups", label: "Follow-ups", icon: "event_repeat" },
  { path: "/alerts", label: "Alerts", icon: "warning" },
  { path: "/reports", label: "Reports", icon: "analytics" },
];

export default function Sidebar({ open = false, onClose }) {
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed left-0 top-0 h-full w-72 bg-surface-container-low border-r border-outline-variant z-50 flex flex-col justify-between shadow-[0_1px_8px_rgba(0,0,0,0.04)] transition-transform duration-200 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col">
          <div className="px-space-lg py-space-md border-b border-outline-variant bg-surface-container-lowest flex items-center gap-space-sm">
            <img src={nhaaLogo} alt="NHAA 14566 Official Emblem" className="h-9 w-auto object-contain" />
            <div className="flex flex-col">
              <span className="text-label-md tracking-tight uppercase text-primary font-bold">
                NHAA 14566
              </span>
              <span className="text-label-sm text-on-surface-variant font-medium">Support Admin</span>
            </div>
          </div>
          <div className="px-space-md py-space-sm bg-surface-container-high/60 border-b border-outline-variant">
            <p className="text-label-sm text-on-surface-variant leading-tight">
              Statutory Case Management &amp; Complainant Rights
            </p>
          </div>
          <nav className="flex flex-col gap-1 p-space-md">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-space-sm px-space-md py-space-xs rounded-lg transition-colors text-body-md font-medium ${
                    isActive
                      ? "bg-primary-container text-on-primary-container font-bold"
                      : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
                  }`
                }
              >
                <Icon name={item.icon} size={20} />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>
        <div className="p-space-md border-t border-outline-variant bg-surface-container-lowest">
          <div className="bg-surface-container p-space-sm rounded-lg border border-outline-variant">
            <div className="flex items-center gap-1 text-on-tertiary-container">
              <Icon name="verified_user" size={16} />
              <span className="text-label-sm font-semibold uppercase tracking-wider">
                Governance Standard
              </span>
            </div>
            <p className="mt-1 text-label-sm text-on-surface-variant leading-relaxed">
              AI assists. Humans support. Professionals decide. Administrators monitor.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}

