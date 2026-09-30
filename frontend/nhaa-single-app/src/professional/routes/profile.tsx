import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";

import PortalHeader from "../components/PortalHeader";
import PortalSidebar from "../components/PortalSidebar";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "NHAA 14566 — Profile & Security" },
      {
        name: "description",
        content:
          "NHAA 14566 — National Atrocity Helpline & Case Intelligence System.",
      },
    ],
  }),
  component: Profile,
});

function Profile() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [twoFA, setTwoFA] = useState(true);
  const [message, setMessage] = useState("");

  const [name, setName] = useState("Professional A");
  const [email, setEmail] = useState("pro-001@nhaa.gov.in");
  const [phone, setPhone] = useState("+91 98XXX-XXX12");

  const handleSave = () => {
    setEditing(false);
    setMessage("Profile information updated successfully.");
  };

  const handlePassword = () => {
    setMessage("Password change request initiated.");
  };

  const handleTwoFA = () => {
    const nextState = !twoFA;

    setTwoFA(nextState);

    setMessage(
      nextState
        ? "Two-factor authentication has been enabled."
        : "Two-factor authentication has been disabled for this demo session.",
    );
  };

  const handleLogout = () => {
    setMessage("Secure logout action triggered.");
  };

  const handleCopyOfficerId = () => {
    navigator.clipboard?.writeText("PRO-001");
    setMessage("Officer ID copied.");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Government strip */}
      <div className="fixed left-0 right-0 top-0 z-50 flex h-[3px]">
        <div className="w-1/3 bg-[#F59E0B]" />
        <div className="w-1/3 bg-white" />
        <div className="w-1/3 bg-[#0D9488]" />
      </div>

      {/* Shared Sidebar */}
      <PortalSidebar
        active="profile"
        alertCount={6}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main */}
      <div className="lg:pl-64">
        {/* Shared Header */}
        <PortalHeader
          alertCount={6}
          onMenuClick={() => setSidebarOpen(true)}
        />

        {/* Page */}
        <main className="min-h-[calc(100vh-64px)] bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl space-y-6">
            {/* Page heading */}
            <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-wider text-slate-500">
                  <span>Operations Desk</span>

                  <span className="material-symbols-outlined text-[14px]">
                    chevron_right
                  </span>

                  <span className="text-[#0D9488]">
                    Profile &amp; Security
                  </span>
                </div>

                <h1 className="text-2xl font-bold tracking-tight text-[#0B2545]">
                  Profile &amp; Security
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                  Manage your professional account information and
                  security settings.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setEditing(!editing)}
                  className="flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-[#0B2545] shadow-sm ring-1 ring-slate-200 hover:bg-slate-50"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {editing ? "close" : "edit"}
                  </span>

                  {editing ? "Cancel Edit" : "Edit Profile"}
                </button>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center gap-2 rounded-lg bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-700 hover:bg-red-100"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    logout
                  </span>

                  Secure Logout
                </button>
              </div>
            </section>

            {/* Message */}
            {message && (
              <div className="flex items-center justify-between gap-4 rounded-lg border border-[#99D5CE] bg-[#F0FDF4] px-4 py-3 text-sm text-[#166534]">
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

            {/* Profile card */}
            <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  {/* Actual profile image */}
                  <div className="relative">
                    <div className="h-20 w-20 overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                      <img
                        src="/images/default-profile.jpeg"
                        alt="Professional profile"
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#0D9488] text-white">
                      <span className="material-symbols-outlined text-[14px]">
                        check
                      </span>
                    </div>
                  </div>

                  <div>
                    <div className="mb-2 flex flex-wrap gap-2">
                      <span className="rounded-full bg-green-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-green-700">
                        Verified Officer
                      </span>

                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                        PRO-001
                      </span>
                    </div>

                    <h2 className="text-xl font-bold text-[#0B2545]">
                      Professional A
                    </h2>

                    <p className="mt-1 text-sm font-semibold text-[#0D9488]">
                      Senior Social Defense Caseworker
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      NHAA Central Support Centre
                    </p>
                  </div>
                </div>

                <div className="rounded-lg bg-slate-50 px-4 py-3">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Officer ID
                  </div>

                  <div className="mt-1 flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-[#0B2545]">
                      PRO-001
                    </span>

                    <button
                      type="button"
                      onClick={handleCopyOfficerId}
                      className="rounded p-1 text-slate-400 hover:bg-white hover:text-[#0D9488]"
                      title="Copy Officer ID"
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        content_copy
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Account information */}
            <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <SectionTitle
                icon="badge"
                title="Account Information"
                description="Official professional account details."
              />

              <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
                <InputField
                  label="Full Name"
                  value={name}
                  editing={editing}
                  onChange={setName}
                />

                <InputField
                  label="Officer ID"
                  value="PRO-001"
                  editing={false}
                  onChange={() => {}}
                />

                <InputField
                  label="Official Email"
                  value={email}
                  editing={editing}
                  onChange={setEmail}
                />

                <InputField
                  label="Secure Contact"
                  value={phone}
                  editing={editing}
                  onChange={setPhone}
                />

                <div className="md:col-span-2">
                  <div className="rounded-lg bg-slate-50 p-4">
                    <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Department
                    </div>

                    <div className="mt-1 text-sm font-semibold text-[#0B2545]">
                      Department of Social Justice and Empowerment
                    </div>
                  </div>
                </div>
              </div>

              {editing && (
                <div className="mt-5 flex justify-end gap-2 border-t border-slate-100 pt-4">
                  <button
                    type="button"
                    onClick={() => setEditing(false)}
                    className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={handleSave}
                    className="rounded-lg bg-[#0B2545] px-4 py-2 text-sm font-semibold text-white hover:bg-[#12365D]"
                  >
                    Save Changes
                  </button>
                </div>
              )}
            </section>

            {/* Security */}
            <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <SectionTitle
                icon="security"
                title="Security"
                description="Manage your account authentication and access."
              />

              <div className="mt-5 space-y-3">
                <SecurityRow
                  icon="password"
                  title="Password"
                  description="Last updated 3 days ago."
                  status="Protected"
                  statusType="success"
                  actionLabel="Change Password"
                  onAction={handlePassword}
                />

                <SecurityRow
                  icon="phonelink_lock"
                  title="Two-Factor Authentication"
                  description={
                    twoFA
                      ? "Authenticator and secure device verification are enabled."
                      : "Two-factor authentication is currently disabled."
                  }
                  status={twoFA ? "Active" : "Inactive"}
                  statusType={twoFA ? "success" : "warning"}
                  actionLabel={twoFA ? "Disable" : "Enable"}
                  onAction={handleTwoFA}
                />

                <SecurityRow
                  icon="timer"
                  title="Session Security"
                  description="Automatic session lock after 15 minutes of inactivity."
                  status="Enabled"
                  statusType="success"
                  actionLabel="Lock Screen"
                  onAction={() =>
                    setMessage(
                      "Screen lock triggered for this demo.",
                    )
                  }
                />
              </div>
            </section>

            {/* Login activity */}
            <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="flex flex-col gap-2 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between">
                <SectionTitle
                  icon="history"
                  title="Recent Login Activity"
                  description="Recent account access events."
                />

                <span className="flex w-fit items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-600" />
                  Secure
                </span>
              </div>

              <div className="divide-y divide-slate-100">
                <LoginRow
                  time="Today, 09:00 AM"
                  event="Web Portal Login"
                  device="Desk #04"
                  status="Successful"
                />

                <LoginRow
                  time="Yesterday, 02:15 PM"
                  event="Session Re-authentication"
                  device="Official Desktop"
                  status="Successful"
                />

                <LoginRow
                  time="04 Sep 2026, 08:45 AM"
                  event="Password & Key Rotation"
                  device="Operations Desk"
                  status="Completed"
                />
              </div>

              <div className="border-t border-slate-200 bg-slate-50 p-4 text-center">
                <button
                  type="button"
                  onClick={() =>
                    setMessage(
                      "Full audit trail opened for this demo.",
                    )
                  }
                  className="text-sm font-semibold text-[#0D9488] hover:underline"
                >
                  View Full Audit Trail
                </button>
              </div>
            </section>

            {/* Account status */}
            <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <SectionTitle
                icon="verified_user"
                title="Account Status"
                description="Current professional access status."
              />

              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <StatusCard
                  icon="check_circle"
                  label="Account"
                  value="Active"
                />

                <StatusCard
                  icon="verified"
                  label="Officer Verification"
                  value="Verified"
                />

                <StatusCard
                  icon="shield"
                  label="Security"
                  value={twoFA ? "Protected" : "Review Required"}
                />
              </div>
            </section>

            {/* Security note */}
            <section className="rounded-xl border border-[#C7D2FE] bg-[#F8FAFF] p-5">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#EEF2FF] text-[#3730A3]">
                  <span className="material-symbols-outlined">
                    info
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-[#0B2545]">
                    Security Reminder
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    Keep your professional credentials secure and
                    never share authentication codes or account
                    passwords with other users.
                  </p>
                </div>
              </div>
            </section>

            {/* Footer */}
            <footer className="flex flex-col gap-2 border-t border-slate-200 py-5 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <span className="font-semibold text-[#0B2545]">
                  National Helpline Against Atrocities (NHAA
                  14566)
                </span>

                <div>
                  Department of Social Justice &amp; Empowerment,
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
   Section Title
   ========================================================= */

function SectionTitle({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-[#0B2545]">
        <span className="material-symbols-outlined text-[20px]">
          {icon}
        </span>
      </div>

      <div>
        <h2 className="text-base font-bold text-[#0B2545]">
          {title}
        </h2>

        <p className="text-xs text-slate-500">
          {description}
        </p>
      </div>
    </div>
  );
}

/* =========================================================
   Input Field
   ========================================================= */

function InputField({
  label,
  value,
  editing,
  onChange,
}: {
  label: string;
  value: string;
  editing: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
        {label}
      </label>

      {editing ? (
        <input
          value={value}
          onChange={(event) =>
            onChange(event.target.value)
          }
          className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none focus:border-[#0D9488] focus:ring-1 focus:ring-[#0D9488]"
        />
      ) : (
        <div className="flex h-10 items-center rounded-lg bg-slate-50 px-3 text-sm font-medium text-[#0B2545]">
          {value}
        </div>
      )}
    </div>
  );
}

/* =========================================================
   Security Row
   ========================================================= */

function SecurityRow({
  icon,
  title,
  description,
  status,
  statusType,
  actionLabel,
  onAction,
}: {
  icon: string;
  title: string;
  description: string;
  status: string;
  statusType: "success" | "warning";
  actionLabel: string;
  onAction: () => void;
}) {
  return (
    <div className="flex flex-col gap-4 rounded-lg bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <span className="material-symbols-outlined mt-0.5 text-[#0D9488]">
          {icon}
        </span>

        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-bold text-[#0B2545]">
              {title}
            </h3>

            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                statusType === "success"
                  ? "bg-green-100 text-green-700"
                  : "bg-amber-100 text-amber-700"
              }`}
            >
              {status}
            </span>
          </div>

          <p className="mt-1 text-xs text-slate-500">
            {description}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onAction}
        className="shrink-0 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-[#0B2545] hover:bg-slate-100"
      >
        {actionLabel}
      </button>
    </div>
  );
}

/* =========================================================
   Login Row
   ========================================================= */

function LoginRow({
  time,
  event,
  device,
  status,
}: {
  time: string;
  event: string;
  device: string;
  status: string;
}) {
  return (
    <div className="flex flex-col gap-2 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#0D9488]" />

        <div>
          <div className="text-sm font-semibold text-[#0B2545]">
            {event}
          </div>

          <div className="mt-1 text-xs text-slate-500">
            {time} • {device}
          </div>
        </div>
      </div>

      <span className="w-fit rounded-full bg-green-50 px-2.5 py-1 text-[10px] font-bold uppercase text-green-700">
        {status}
      </span>
    </div>
  );
}

/* =========================================================
   Status Card
   ========================================================= */

function StatusCard({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg bg-slate-50 p-4">
      <span className="material-symbols-outlined text-[#0D9488]">
        {icon}
      </span>

      <div>
        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
          {label}
        </div>

        <div className="mt-0.5 text-sm font-bold text-[#0B2545]">
          {value}
        </div>
      </div>
    </div>
  );
}