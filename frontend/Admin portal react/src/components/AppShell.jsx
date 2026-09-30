import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import GlobalSearch from "./GlobalSearch";

export default function AppShell() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-surface">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <Header onOpenSearch={() => setSearchOpen(true)} onOpenSidebar={() => setSidebarOpen(true)} />
      <div className="lg:pl-72 flex flex-col min-h-screen">
        <main className="w-full pt-16 bg-surface flex-1 px-space-md sm:px-space-lg py-space-lg">
          <div className="flex flex-col w-full max-w-[1440px] mx-auto space-y-space-xl">
            <Outlet />
          </div>
        </main>
      </div>
      <GlobalSearch open={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
}
