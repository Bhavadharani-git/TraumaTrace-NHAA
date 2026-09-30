import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Icon from "./Icon";
import { useAuth } from "../admin-context/AuthContext";
import { adminUser } from "../admin-data/mockData";

export default function Header({ onOpenSearch, onOpenSidebar }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    function onClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const handleLogout = () => {
    setMenuOpen(false);
    logout();
    navigate("/login");
  };

  const profileLinks = [
    { path: "/profile/admin", label: "Admin Profile", icon: "person" },
    { path: "/profile/security", label: "Security", icon: "security" },
    { path: "/profile/access", label: "Access & Permissions", icon: "admin_panel_settings" },
    { path: "/profile/settings", label: "Settings", icon: "settings" },
  ];

  return (
    <header className="fixed top-0 left-0 lg:left-72 right-0 h-16 bg-surface-container-lowest/95 backdrop-blur-md border-b border-outline-variant z-30 px-space-md lg:px-space-lg flex items-center justify-between shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="flex items-center gap-space-md flex-1 max-w-xl">
        <button className="lg:hidden p-2 -ml-2 text-on-surface-variant" onClick={onOpenSidebar} aria-label="Open menu">
          <Icon name="menu" />
        </button>
        <button
          onClick={onOpenSearch}
          className="relative w-full text-left hidden sm:block"
        >
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">
            <Icon name="search" size={20} />
          </span>
          <span className="w-full block pl-10 pr-4 py-1.5 h-10 bg-surface-container-low border border-outline-variant rounded-lg text-body-md text-outline">
            Search cases, professionals...          </span>
        </button>
        <button onClick={onOpenSearch} className="sm:hidden p-2 text-on-surface-variant" aria-label="Search">
          <Icon name="search" />
        </button>
        <div className="hidden xl:flex items-center gap-2 px-space-sm py-1 bg-surface-container rounded-full border border-outline-variant whitespace-nowrap">
          <span className="w-2 h-2 rounded-full bg-success" />
          <span className="text-label-sm text-on-surface-variant font-medium">
            System: All Services Operational
          </span>
        </div>
      </div>

      <div className="flex items-center gap-space-md">
        <Link
          to="/alerts"
          className="relative p-2 text-on-surface-variant hover:bg-surface-container hover:text-on-surface rounded-lg transition-colors"
          aria-label="View notifications"
        >
          <Icon name="notifications" size={22} />
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-error rounded-full ring-2 ring-surface-container-lowest" />
        </Link>
        <div className="h-6 w-[1px] bg-outline-variant hidden sm:block" />
        <div className="relative" ref={menuRef}>
          <button
            className="flex items-center gap-space-sm p-1 rounded-lg hover:bg-surface-container transition-colors"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <Icon name="person" className="text-on-primary" size={18} />
            </div>
            <div className="hidden md:flex flex-col text-left">
              <span className="text-label-md text-on-surface leading-tight">{adminUser.name}</span>
              <span className="text-label-sm text-on-surface-variant">{adminUser.role}</span>
            </div>
            <Icon name="expand_more" className="text-on-surface-variant" size={18} />
          </button>
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-surface-container-lowest rounded-lg border border-outline-variant shadow-level2 py-1 z-50">
              <div className="px-4 py-2 border-b border-outline-variant">
                <p className="text-label-md text-on-surface font-semibold">Admin Profile</p>
                <p className="text-label-sm text-on-surface-variant truncate">{adminUser.email}</p>
              </div>
              {profileLinks.map((l) => (
                <Link
                  key={l.path}
                  to={l.path}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 text-body-md text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface"
                >
                  <Icon name={l.icon} size={18} />
                  <span>{l.label}</span>
                </Link>
              ))}
              <div className="border-t border-outline-variant my-1" />
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-2 text-body-md text-error hover:bg-error-container hover:text-on-error-container text-left"
              >
                <Icon name="logout" size={18} />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

