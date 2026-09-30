import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

const API_BASE_URL = "http://127.0.0.1:8000/api/v1";

type Complaint = {
  id?: number;
  complaint_id?: string;
  user_id?: number;
  language?: string | null;
  communication_method?: string | null;
  complaint_text?: string | null;
  transcript?: string | null;
  status?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  priority?: string | null;
  [key: string]: any;
};

type FollowUp = {
  id?: number;
  complaint_id?: string;
  scheduled_at?: string | null;
  follow_up_type?: string | null;
  priority?: string | null;
  status?: string | null;
  notes?: string | null;
  outcome?: string | null;
  [key: string]: any;
};

export const Route = createFileRoute("/cases/$caseId")({
  component: CaseDetailsPage,
});

function getToken(): string | null {
  try {
    const stored = localStorage.getItem("nhaa_auth");

    if (!stored) {
      return null;
    }

    const auth = JSON.parse(stored);

    return auth?.access_token || null;
  } catch {
    return null;
  }
}

function getCaseIdFromUrl(): string {
  const parts = window.location.pathname.split("/").filter(Boolean);

  const casesIndex = parts.indexOf("cases");

  if (casesIndex === -1) {
    return "";
  }

  return decodeURIComponent(parts[casesIndex + 1] || "");
}

function formatDate(value?: string | null): string {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString();
}

function formatStatus(value?: string | null): string {
  if (!value) {
    return "Unknown";
  }

  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function CaseDetailsPage() {
  const caseId = getCaseIdFromUrl();

  const [caseData, setCaseData] = useState<Complaint | null>(null);
  const [followUps, setFollowUps] = useState<FollowUp[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");

  async function loadCase() {
    const token = getToken();

    if (!token) {
      window.location.href = "/";
      return;
    }

    if (!caseId) {
      setError("Case ID is missing.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_BASE_URL}/complaints/${encodeURIComponent(caseId)}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      if (response.status === 401) {
        localStorage.removeItem("nhaa_auth");
        window.location.href = "/";
        return;
      }

      if (!response.ok) {
        const message = await response.text();

        throw new Error(
          message || `Unable to load case. HTTP ${response.status}`
        );
      }

      const data = await response.json();

      setCaseData(data);

      const followUpResponse = await fetch(
        `${API_BASE_URL}/follow-ups/`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      if (followUpResponse.ok) {
        const followUpData = await followUpResponse.json();

        let items: FollowUp[] = [];

        if (Array.isArray(followUpData)) {
          items = followUpData;
        } else if (Array.isArray(followUpData?.follow_ups)) {
          items = followUpData.follow_ups;
        }

        const complaintId = String(
          data?.complaint_id || caseId
        );

        setFollowUps(
          items.filter(
            (item) =>
              String(item?.complaint_id || "") === complaintId
          )
        );
      } else {
        setFollowUps([]);
      }
    } catch (err) {
      console.error("Case loading error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load this case."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadCase();
  }, []);

  async function updateStatus(newStatus: string) {
    const token = getToken();

    if (!token || !caseData?.complaint_id) {
      return;
    }

    try {
      setUpdating(true);
      setError("");

      const params = new URLSearchParams();

      params.set("status", newStatus);

      const response = await fetch(
        `${API_BASE_URL}/complaints/${encodeURIComponent(
          caseData.complaint_id
        )}/status?${params.toString()}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      if (response.status === 401) {
        localStorage.removeItem("nhaa_auth");
        window.location.href = "/";
        return;
      }

      if (!response.ok) {
        const message = await response.text();

        throw new Error(
          message || `Unable to update status. HTTP ${response.status}`
        );
      }

      const data = await response.json();

      if (data?.complaint) {
        setCaseData(data.complaint);
      } else {
        setCaseData({
          ...caseData,
          status: newStatus,
        });
      }
    } catch (err) {
      console.error("Status update error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to update case status."
      );
    } finally {
      setUpdating(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-center">
          <span className="material-symbols-outlined text-4xl text-secondary">
            hourglass_top
          </span>

          <p className="mt-3 text-sm text-on-surface-variant">
            Loading case...
          </p>
        </div>
      </div>
    );
  }

  if (error && !caseData) {
    return (
      <div className="min-h-screen bg-surface p-6">
        <div className="max-w-3xl mx-auto bg-surface-container-lowest rounded-xl shadow-sm p-8">
          <span className="material-symbols-outlined text-error text-3xl">
            error
          </span>

          <h1 className="mt-3 text-xl font-bold text-primary">
            Unable to load case
          </h1>

          <p className="mt-2 text-sm text-on-surface-variant">
            {error}
          </p>

          <div className="mt-6 flex gap-3">
            <a
              href="/cases"
              className="px-4 py-2 rounded-lg bg-primary text-on-primary text-sm font-semibold"
            >
              Back to Cases
            </a>

            <button
              type="button"
              onClick={() => void loadCase()}
              className="px-4 py-2 rounded-lg bg-surface-container text-primary text-sm font-semibold"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!caseData) {
    return (
      <div className="min-h-screen bg-surface p-6">
        <div className="max-w-3xl mx-auto">
          <p className="text-on-surface-variant">
            Case not found.
          </p>

          <a
            href="/cases"
            className="inline-block mt-4 px-4 py-2 rounded-lg bg-primary text-on-primary"
          >
            Back to Cases
          </a>
        </div>
      </div>
    );
  }

  const displayCaseId =
    caseData.complaint_id || caseId || "Unknown";

  return (
    <div className="min-h-screen bg-surface text-on-surface">

      <header className="fixed top-0 left-0 right-0 z-20 h-16 bg-surface-container-lowest border-b border-surface-container shadow-sm">
        <div className="h-full px-6 flex items-center justify-between">

          <div className="flex items-center gap-4">
            <a
              href="/dashboard"
              className="font-bold text-primary"
            >
              NHAA 14566
            </a>

            <span className="hidden md:block text-xs text-on-surface-variant">
              Professional Operations Portal
            </span>
          </div>

          <button
            type="button"
            onClick={() => {
              localStorage.removeItem("nhaa_auth");
              window.location.href = "/";
            }}
            className="px-3 py-2 rounded-lg bg-surface-container text-primary text-sm font-semibold"
          >
            Sign out
          </button>

        </div>
      </header>

      <main className="pt-16 min-h-screen px-6 py-6">
        <div className="max-w-[1400px] mx-auto space-y-6">

          <div className="flex flex-wrap items-center justify-between gap-4">

            <div>
              <a
                href="/cases"
                className="text-sm text-secondary font-semibold hover:underline"
              >
                ← Back to Cases
              </a>

              <h1 className="mt-2 text-2xl font-bold text-primary">
                Case {displayCaseId}
              </h1>

              <p className="mt-1 text-sm text-on-surface-variant">
                Case details and operational review.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">

              <button
                type="button"
                disabled={updating}
                onClick={() =>
                  void updateStatus("under_assessment")
                }
                className="px-4 py-2 rounded-lg bg-surface-container text-primary text-sm font-semibold disabled:opacity-50"
              >
                Under Assessment
              </button>

              <button
                type="button"
                disabled={updating}
                onClick={() =>
                  void updateStatus("resolved")
                }
                className="px-4 py-2 rounded-lg bg-primary text-on-primary text-sm font-semibold disabled:opacity-50"
              >
                Resolve
              </button>

            </div>
          </div>

          {error && (
            <div className="rounded-lg bg-error-container text-on-error-container px-4 py-3 text-sm">
              {error}
            </div>
          )}

          <section className="bg-surface-container-lowest rounded-xl shadow-sm p-6">

            <div className="flex flex-wrap items-center gap-3">

              <span className="px-3 py-1 rounded-full bg-primary text-on-primary text-xs font-bold uppercase">
                Case Dossier
              </span>

              <span className="px-3 py-1 rounded-full bg-surface-container text-primary text-xs font-semibold">
                {formatStatus(caseData.status)}
              </span>

              {caseData.priority && (
                <span className="px-3 py-1 rounded-full bg-surface-container text-primary text-xs font-semibold">
                  {String(caseData.priority)} Priority
                </span>
              )}

            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">

              <InfoCard
                label="Case ID"
                value={displayCaseId}
              />

              <InfoCard
                label="User ID"
                value={caseData.user_id}
              />

              <InfoCard
                label="Language"
                value={caseData.language}
              />

              <InfoCard
                label="Communication"
                value={caseData.communication_method}
              />

              <InfoCard
                label="Status"
                value={formatStatus(caseData.status)}
              />

              <InfoCard
                label="Created"
                value={formatDate(caseData.created_at)}
              />

              <InfoCard
                label="Updated"
                value={formatDate(caseData.updated_at)}
              />

              <InfoCard
                label="Priority"
                value={caseData.priority}
              />

            </div>

          </section>

          <section className="bg-surface-container-lowest rounded-xl shadow-sm p-6">

            <h2 className="text-lg font-bold text-primary">
              Complaint
            </h2>

            <div className="mt-4 rounded-lg bg-surface-container-low p-5 whitespace-pre-wrap text-sm leading-7">
              {caseData.complaint_text ||
                "No complaint text available."}
            </div>

          </section>

          {caseData.transcript && (
            <section className="bg-surface-container-lowest rounded-xl shadow-sm p-6">

              <h2 className="text-lg font-bold text-primary">
                Transcript
              </h2>

              <div className="mt-4 rounded-lg bg-surface-container-low p-5 whitespace-pre-wrap text-sm leading-7">
                {caseData.transcript}
              </div>

            </section>
          )}

          <section className="bg-surface-container-lowest rounded-xl shadow-sm p-6">

            <div className="flex items-center justify-between gap-4">

              <div>
                <h2 className="text-lg font-bold text-primary">
                  Follow-ups
                </h2>

                <p className="mt-1 text-sm text-on-surface-variant">
                  Scheduled follow-ups associated with this case.
                </p>
              </div>

              <span className="px-3 py-1 rounded-full bg-surface-container text-xs font-semibold text-primary">
                {followUps.length}
              </span>

            </div>

            {followUps.length === 0 ? (
              <div className="mt-5 rounded-lg bg-surface-container-low p-5 text-sm text-on-surface-variant">
                No follow-ups scheduled for this case.
              </div>
            ) : (
              <div className="mt-5 space-y-3">

                {followUps.map((item, index) => (
                  <div
                    key={String(
                      item.id ??
                      item.scheduled_at ??
                      index
                    )}
                    className="rounded-lg border border-surface-container p-4"
                  >

                    <div className="flex flex-wrap items-center justify-between gap-3">

                      <div>
                        <div className="font-semibold text-primary">
                          {item.follow_up_type ||
                            "Follow-up"}
                        </div>

                        <div className="mt-1 text-sm text-on-surface-variant">
                          {formatDate(item.scheduled_at)}
                        </div>
                      </div>

                      <span className="px-3 py-1 rounded-full bg-surface-container text-xs font-semibold">
                        {formatStatus(item.status)}
                      </span>

                    </div>

                    {item.notes && (
                      <p className="mt-3 text-sm text-on-surface-variant">
                        {item.notes}
                      </p>
                    )}

                    {item.outcome && (
                      <p className="mt-2 text-sm text-on-surface-variant">
                        Outcome: {item.outcome}
                      </p>
                    )}

                  </div>
                ))}

              </div>
            )}

          </section>

        </div>
      </main>
    </div>
  );
}

function InfoCard({
  label,
  value,
}: {
  label: string;
  value?: string | number | null | undefined;
}) {
  return (
    <div className="rounded-lg bg-surface-container-low p-4">
      <div className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
        {label}
      </div>

      <div className="mt-1 text-sm font-semibold text-primary break-words">
        {value === null || value === undefined || value === ""
          ? "—"
          : String(value)}
      </div>
    </div>
  );
}