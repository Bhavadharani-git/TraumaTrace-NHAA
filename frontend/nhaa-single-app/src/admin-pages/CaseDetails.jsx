import { useEffect, useState } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import Icon from "../admin-components/Icon";
import Card from "../admin-components/Card";
import StatusBadge from "../admin-components/StatusBadge";
import { API_V1_URL } from "../apiConfig";
const TABS = [
  {
    key: "complaint",
    label: "Complaint",
    icon: "description",
  },
  {
    key: "person",
    label: "Person Information",
    icon: "badge",
  },
  {
    key: "ai",
    label: "AI-Assisted Assessment",
    icon: "auto_awesome",
  },
  {
    key: "review",
    label: "Professional Review",
    icon: "clinical_notes",
  },
  {
    key: "history",
    label: "Case History",
    icon: "history",
  },
  {
    key: "followup",
    label: "Follow-up",
    icon: "event_repeat",
  },
];

const CASE_STAGES = [
  "Received",
  "Review",
  "Investigation",
  "Follow-up",
  "Resolved",
];

const API_BASE_URL =
API_V1_URL

// ============================================================
// AUTH
// ============================================================

function getAuthToken() {
  try {
    const auth = JSON.parse(
      localStorage.getItem("nhaa_auth") || "{}"
    );

    return (
      auth?.access_token ||
      auth?.token ||
      ""
    );
  } catch {
    return "";
  }
}


// ============================================================
// FORMATTING
// ============================================================

function formatStatus(status) {
  if (!status) return "Unknown";

  return String(status)
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase()
    );
}


function formatDate(date) {
  if (!date) return "—";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return String(date);
  }

  return parsed.toLocaleString();
}


// ============================================================
// CASE HELPERS
// ============================================================

function getPriority(item) {
  return String(
    item?.priority ??
      item?.severity ??
      item?.priority_level ??
      ""
  ).toLowerCase();
}


function getRiskLabel(item) {
  const priority = getPriority(item);

  if (
    [
      "critical",
      "urgent",
      "high",
      "level_1",
      "level_2",
    ].includes(priority)
  ) {
    return "High Risk";
  }

  return (
    item?.risk_level ||
    item?.riskLevel ||
    (priority
      ? formatStatus(priority)
      : "Not assessed")
  );
}


// IMPORTANT:
// complaint_id is the canonical case identifier.
// Database numeric id is only used as fallback.
function getCaseId(item) {
  return (
    item?.complaint_id ||
    item?.id ||
    ""
  );
}


function getComplainant(item) {
  return (
    item?.complainant_name ||
    item?.complainantName ||
    item?.victim_name ||
    item?.victimName ||
    item?.user?.full_name ||
    item?.user_name ||
    "Not available"
  );
}


function getCategory(item) {
  return (
    item?.category ||
    item?.complaint_category ||
    item?.case_category ||
    "Not specified"
  );
}


function getChannel(item) {
  return (
    item?.communication_method ||
    item?.communicationMethod ||
    item?.channel ||
    "Not specified"
  );
}


function getDistrict(item) {
  return (
    item?.district ||
    item?.location ||
    item?.user?.district ||
    "Not specified"
  );
}


function getOfficer(item) {
  return (
    item?.assigned_officer ||
    item?.assignedOfficer ||
    item?.professional_name ||
    item?.professional?.full_name ||
    "Unassigned"
  );
}


function getSummary(item) {
  return (
    item?.complaint_text ||
    item?.summary ||
    item?.description ||
    item?.transcript ||
    "No complaint narrative is available for this case."
  );
}


function getStageNumber(status) {
  const normalized = String(
    status || ""
  ).toLowerCase();

  if (
    ["resolved", "closed"].includes(
      normalized
    )
  ) {
    return 5;
  }

  if (
    normalized.includes("follow") ||
    normalized.includes("escalat")
  ) {
    return 4;
  }

  if (
    normalized.includes("investigat") ||
    normalized.includes("assigned")
  ) {
    return 3;
  }

  if (
    normalized.includes("review") ||
    normalized.includes("pending") ||
    normalized.includes("assessment")
  ) {
    return 2;
  }

  return 1;
}


// ============================================================
// CASE DETAILS
// ============================================================

export default function CaseDetails() {
  const { caseId } = useParams();

  const [activeTab, setActiveTab] =
    useState("complaint");

  const [caseData, setCaseData] =
    useState(null);

  const [followUps, setFollowUps] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [followUpsLoading, setFollowUpsLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  useEffect(() => {
    let cancelled = false;


    const loadCase = async () => {
      try {
        setLoading(true);
        setFollowUpsLoading(true);
        setError("");


        const token =
          getAuthToken();

        if (!token) {
          throw new Error(
            "Authentication session not found."
          );
        }


        if (!caseId) {
          throw new Error(
            "Case identifier is missing."
          );
        }


        const headers = {
          Accept:
            "application/json",

          Authorization:
            `Bearer ${token}`,
        };


        // ====================================================
        // IMPORTANT FIX
        // ====================================================
        //
        // Do NOT load the whole complaints collection here.
        //
        // The backend supports:
        //
        // GET /api/v1/complaints/{complaint_id}
        //
        // caseId comes from the Cases list and must be the
        // complaint_id, for example:
        //
        // NHAA-ABC123
        //
        // ====================================================

        const response =
          await fetch(
            `${API_BASE_URL}/complaints/${encodeURIComponent(
              caseId
            )}`,
            {
              method: "GET",
              headers,
            }
          );


        let data = {};

        try {
          data =
            await response.json();
        } catch {
          data = {};
        }


        if (!response.ok) {
          if (
            response.status === 404
          ) {
            throw new Error(
              "Case not found."
            );
          }

          throw new Error(
            data?.detail ||
              "Unable to load case data."
          );
        }


        // Backend returns:
        //
        // {
        //   "complaint": {...}
        // }
        //
        // Keep support for a direct object too.

        const foundCase =
          data?.complaint ||
          data;


        if (
          !foundCase ||
          !getCaseId(foundCase)
        ) {
          throw new Error(
            "Case not found."
          );
        }


        // Make absolutely sure the backend returned
        // the same complaint requested by the URL.

        if (
          String(
            getCaseId(foundCase)
          ) !==
          String(caseId)
        ) {
          throw new Error(
            "Case not found."
          );
        }


        if (!cancelled) {
          setCaseData(
            foundCase
          );
        }


        // ====================================================
        // LOAD FOLLOW-UPS
        // ====================================================

        const followUpsResponse =
          await fetch(
            `${API_BASE_URL}/follow-ups/`,
            {
              method: "GET",
              headers,
            }
          );


        if (
          followUpsResponse.ok
        ) {
          let followUpsData =
            {};

          try {
            followUpsData =
              await followUpsResponse.json();
          } catch {
            followUpsData =
              {};
          }


          const allFollowUps =
            Array.isArray(
              followUpsData?.follow_ups
            )
              ? followUpsData.follow_ups
              : Array.isArray(
                  followUpsData
                )
              ? followUpsData
              : [];


          const matchingFollowUps =
            allFollowUps.filter(
              (followUp) => {
                const followUpCaseId =
                  followUp?.complaint_id ??
                  followUp?.case_id ??
                  "";

                return (
                  String(
                    followUpCaseId
                  ) ===
                  String(caseId)
                );
              }
            );


          if (!cancelled) {
            setFollowUps(
              matchingFollowUps
            );
          }
        } else if (
          !cancelled
        ) {
          setFollowUps([]);
        }

      } catch (err) {
        console.error(
          "Case details error:",
          err
        );


        if (!cancelled) {
          setCaseData(null);

          setError(
            err instanceof Error
              ? err.message
              : "Unable to load case."
          );
        }

      } finally {
        if (!cancelled) {
          setLoading(false);
          setFollowUpsLoading(
            false
          );
        }
      }
    };


    loadCase();


    return () => {
      cancelled = true;
    };
  }, [caseId]);


  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {
    return (
      <Card>
        <div className="flex items-center gap-3 text-on-surface-variant">
          <Icon
            name="progress_activity"
            size={20}
          />

          <span>
            Loading case...
          </span>
        </div>
      </Card>
    );
  }


  // ==========================================================
  // ERROR
  // ==========================================================

  if (!caseData) {
    if (
      error === "Case not found."
    ) {
      return (
        <Navigate
          to="/cases"
          replace
        />
      );
    }


    return (
      <Card>
        <div className="flex items-start gap-3 text-error">
          <Icon
            name="error"
            size={20}
          />

          <div>
            <p className="text-body-md-medium">
              Unable to load case
            </p>

            <p className="text-label-sm mt-1">
              {error ||
                "The requested case could not be loaded."}
            </p>

            <Link
              to="/cases"
              className="inline-block mt-3 text-label-md text-secondary hover:underline"
            >
              Back to Cases
            </Link>
          </div>
        </div>
      </Card>
    );
  }


  const riskLabel =
    getRiskLabel(caseData);

  const currentStage =
    getStageNumber(
      caseData.status
    );


  // ==========================================================
  // MAIN VIEW
  // ==========================================================

  return (
    <>
      {/* Breadcrumb */}

      <div className="flex items-center gap-2 text-label-sm text-on-surface-variant">
        <Link
          to="/cases"
          className="hover:underline"
        >
          Cases
        </Link>

        <Icon
          name="chevron_right"
          size={16}
        />

        <span className="text-on-surface font-medium">
          {getCaseId(caseData)}
        </span>
      </div>


      {/* Header */}

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
        <div>
          <div className="flex items-center gap-space-sm flex-wrap">
            <h1 className="text-headline-lg text-on-surface">
              {getCaseId(caseData)}
            </h1>

            <StatusBadge
              label={riskLabel}
            />

            <StatusBadge
              label={formatStatus(
                caseData.status
              )}
            />
          </div>

          <p className="text-body-md text-on-surface-variant mt-1">
            {getComplainant(
              caseData
            )}
            {" · "}
            {getCategory(
              caseData
            )}
            {" · "}
            {getDistrict(
              caseData
            )}
          </p>
        </div>


        <div className="flex gap-space-sm">
          <button
            type="button"
            className="h-10 px-space-md rounded border border-outline-variant bg-surface-container-lowest text-body-md-medium text-on-surface hover:bg-surface-container-low transition-colors"
          >
            Export Docket
          </button>

          <button
            type="button"
            className="h-10 px-space-md rounded bg-secondary hover:bg-secondary-hover text-on-secondary text-body-md-medium transition-colors"
          >
            Update Status
          </button>
        </div>
      </div>


      {/* Stage tracker */}

      <CaseStageTracker
        currentStage={
          currentStage
        }
      />


      {/* Content */}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
        <div className="lg:col-span-8">

          {/* Tabs */}

          <div className="flex gap-1 overflow-x-auto border-b border-outline-variant mb-space-md">
            {TABS.map(
              (tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() =>
                    setActiveTab(
                      tab.key
                    )
                  }
                  className={`flex items-center gap-1.5 px-space-md py-space-sm text-body-md-medium whitespace-nowrap border-b-2 transition-colors ${
                    activeTab ===
                    tab.key
                      ? "border-secondary text-secondary"
                      : "border-transparent text-on-surface-variant hover:text-on-surface"
                  }`}
                >
                  <Icon
                    name={tab.icon}
                    size={18}
                  />

                  {tab.label}
                </button>
              )
            )}
          </div>


          {activeTab ===
            "complaint" && (
            <ComplaintTab
              caseData={
                caseData
              }
            />
          )}


          {activeTab ===
            "person" && (
            <PersonTab
              caseData={
                caseData
              }
            />
          )}


          {activeTab === "ai" && (
            <AiAssessmentTab
              caseData={
                caseData
              }
            />
          )}


          {activeTab ===
            "review" && (
            <ProfessionalReviewTab
              caseData={
                caseData
              }
            />
          )}


          {activeTab ===
            "history" && (
            <CaseHistoryTab
              caseData={
                caseData
              }
            />
          )}


          {activeTab ===
            "followup" && (
            <FollowUpTab
              caseData={
                caseData
              }
              followUps={
                followUps
              }
              loading={
                followUpsLoading
              }
            />
          )}
        </div>


        {/* Right metadata */}

        <div className="lg:col-span-4 flex flex-col gap-space-md">

          <Card>
            <h3 className="text-label-md text-on-surface-variant uppercase tracking-wide mb-space-sm">
              Case Metadata
            </h3>

            <dl className="flex flex-col gap-space-xs text-body-md">

              <MetaRow
                label="Case ID"
                value={getCaseId(
                  caseData
                )}
              />

              <MetaRow
                label="Assigned Officer"
                value={getOfficer(
                  caseData
                )}
              />

              <MetaRow
                label="Channel"
                value={getChannel(
                  caseData
                )}
              />

              <MetaRow
                label="Filed On"
                value={formatDate(
                  caseData.created_at
                )}
              />

              <MetaRow
                label="Last Updated"
                value={formatDate(
                  caseData.updated_at ||
                    caseData.created_at
                )}
              />

              <MetaRow
                label="District"
                value={getDistrict(
                  caseData
                )}
              />

              <MetaRow
                label="Status"
                value={formatStatus(
                  caseData.status
                )}
              />
            </dl>
          </Card>


          <Card className="border-l-4 border-l-tertiary">
            <div className="flex items-center gap-2 text-on-tertiary-container mb-space-xs">
              <Icon
                name="auto_awesome"
                size={18}
              />

              <span className="text-label-md font-semibold uppercase tracking-wide">
                Governance Reminder
              </span>
            </div>

            <p className="text-body-md text-on-surface-variant">
              AI assists. Humans
              support.
              Professionals decide.
              Administrators monitor.
              Automated suggestions
              should be verified by
              authorized officers
              before entering the
              statutory record.
            </p>
          </Card>

        </div>
      </div>
    </>
  );
}


// ============================================================
// META ROW
// ============================================================

function MetaRow({
  label,
  value,
}) {
  return (
    <div className="flex items-center justify-between gap-space-sm">
      <dt className="text-on-surface-variant">
        {label}
      </dt>

      <dd className="text-on-surface font-medium text-right">
        {value || "—"}
      </dd>
    </div>
  );
}


// ============================================================
// STAGE TRACKER
// ============================================================

function CaseStageTracker({
  currentStage,
}) {
  return (
    <Card>
      <div className="flex items-center">
        {CASE_STAGES.map(
          (stage, index) => {
            const stepNum =
              index + 1;

            const isDone =
              stepNum <
              currentStage;

            const isCurrent =
              stepNum ===
              currentStage;

            return (
              <div
                key={stage}
                className="flex items-center flex-1 last:flex-none"
              >
                <div className="flex flex-col items-center gap-1.5">

                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-label-sm font-bold shrink-0 ${
                      isDone
                        ? "bg-success text-white"
                        : isCurrent
                        ? "bg-secondary text-white"
                        : "bg-surface-container-high text-on-surface-variant"
                    }`}
                  >
                    {isDone ? (
                      <Icon
                        name="check"
                        size={16}
                      />
                    ) : (
                      stepNum
                    )}
                  </div>


                  <span
                    className={`text-label-sm text-center max-w-[90px] leading-tight ${
                      isCurrent
                        ? "text-on-surface font-semibold"
                        : "text-on-surface-variant"
                    }`}
                  >
                    {stage}
                  </span>
                </div>


                {stepNum !==
                  CASE_STAGES.length && (
                  <div
                    className={`flex-1 h-0.5 mx-2 ${
                      isDone
                        ? "bg-success"
                        : "bg-outline-variant"
                    }`}
                  />
                )}
              </div>
            );
          }
        )}
      </div>
    </Card>
  );
}


// ============================================================
// COMPLAINT TAB
// ============================================================

function ComplaintTab({
  caseData,
}) {
  return (
    <Card className="flex flex-col gap-space-md">

      <div>
        <h3 className="text-label-md text-on-surface-variant uppercase tracking-wide mb-1">
          Incident Summary
        </h3>

        <p className="text-body-lg text-on-surface leading-relaxed max-w-[68ch] whitespace-pre-wrap">
          {getSummary(
            caseData
          )}
        </p>
      </div>


      <div className="grid grid-cols-2 gap-space-md pt-space-sm border-t border-outline-variant">

        <MetaRow
          label="Category"
          value={getCategory(
            caseData
          )}
        />

        <MetaRow
          label="Reported Via"
          value={getChannel(
            caseData
          )}
        />

        <MetaRow
          label="Statutory Status"
          value={formatStatus(
            caseData.status
          )}
        />

        <MetaRow
          label="District"
          value={getDistrict(
            caseData
          )}
        />

      </div>


      {caseData.transcript && (
        <div className="pt-space-sm border-t border-outline-variant">

          <h3 className="text-label-md text-on-surface-variant uppercase tracking-wide mb-1">
            Intake Transcript
          </h3>

          <p className="text-body-md text-on-surface leading-relaxed whitespace-pre-wrap">
            {caseData.transcript}
          </p>

        </div>
      )}

    </Card>
  );
}


// ============================================================
// PERSON TAB
// ============================================================

function PersonTab({
  caseData,
}) {
  const preferredLanguage =
    caseData?.language ||
    caseData?.preferred_language ||
    "Not specified";


  return (
    <Card className="flex flex-col gap-space-md">

      <div className="flex items-center gap-space-md">

        <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center text-on-primary">
          <Icon
            name="person"
            size={28}
          />
        </div>


        <div>
          <p className="text-headline-sm text-on-surface">
            {getComplainant(
              caseData
            )}
          </p>

          <p className="text-label-sm text-on-surface-variant">
            Primary Complainant
          </p>
        </div>

      </div>


      <div className="grid grid-cols-2 gap-space-md pt-space-sm border-t border-outline-variant">

        <MetaRow
          label="Contact Channel"
          value={getChannel(
            caseData
          )}
        />

        <MetaRow
          label="District"
          value={getDistrict(
            caseData
          )}
        />

        <MetaRow
          label="Preferred Language"
          value={
            preferredLanguage
          }
        />

        <MetaRow
          label="User ID"
          value={
            caseData.user_id
          }
        />

      </div>


      <div className="pt-space-sm border-t border-outline-variant">

        <h3 className="text-label-md text-on-surface-variant uppercase tracking-wide mb-1">
          Confidentiality Notice
        </h3>

        <p className="text-body-md text-on-surface-variant leading-relaxed max-w-[68ch]">
          Identity details are
          restricted to authorized
          case officers. Disclosure
          outside the authorized case
          record should follow
          applicable statutory and
          administrative controls.
        </p>

      </div>

    </Card>
  );
}


// ============================================================
// AI ASSESSMENT TAB
// ============================================================

function AiAssessmentTab({
  caseData,
}) {
  const aiAssessment =
    caseData?.ai_assessment ||
    caseData?.aiAssessment ||
    caseData?.triage_result ||
    caseData?.ai_triage;


  return (
    <Card className="border border-teal-200 bg-[#f0fdfa]">

      <div className="flex items-center justify-between flex-wrap gap-2 mb-space-sm">

        <div className="flex items-center gap-2 text-on-tertiary-container">

          <Icon
            name="auto_awesome"
            size={18}
          />

          <span className="text-body-md-medium">
            NHAA Automated Case
            Triage
          </span>

        </div>


        <StatusBadge
          label="Machine Assisted"
        />

      </div>


      {aiAssessment ? (
        <p className="text-body-lg text-on-surface leading-relaxed max-w-[68ch] whitespace-pre-wrap">
          {typeof aiAssessment ===
          "string"
            ? aiAssessment
            : JSON.stringify(
                aiAssessment,
                null,
                2
              )}
        </p>
      ) : (
        <p className="text-body-lg text-on-surface leading-relaxed max-w-[68ch]">
          No AI assessment has
          been recorded for this
          case.
        </p>
      )}


      <p className="text-label-sm text-on-tertiary-container mt-space-md flex items-center gap-1">

        <Icon
          name="info"
          size={14}
        />

        AI output requires
        authorized professional
        review before being treated
        as part of the statutory
        record.

      </p>

    </Card>
  );
}


// ============================================================
// PROFESSIONAL REVIEW TAB
// ============================================================

function ProfessionalReviewTab({
  caseData,
}) {
  const review =
    caseData?.professional_review ||
    caseData?.professionalReview ||
    caseData?.review_notes ||
    caseData?.professional_notes;


  const reviewer =
    caseData?.assigned_officer ||
    caseData?.assignedOfficer ||
    caseData?.professional_name ||
    "No professional assigned";


  return (
    <Card className="flex flex-col gap-space-md">

      <div className="flex items-center gap-space-md">

        <div className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container">
          <Icon
            name="clinical_notes"
            size={22}
          />
        </div>


        <div>
          <p className="text-body-md-medium text-on-surface">
            {reviewer}
          </p>

          <p className="text-label-sm text-on-surface-variant">
            Assigned professional
          </p>
        </div>


        <StatusBadge
          label={formatStatus(
            caseData.status
          )}
          className="ml-auto"
        />

      </div>


      <div className="pt-space-sm border-t border-outline-variant">

        <h3 className="text-label-md text-on-surface-variant uppercase tracking-wide mb-1">
          Professional Notes
        </h3>


        {review ? (
          <p className="text-body-lg text-on-surface leading-relaxed max-w-[68ch] whitespace-pre-wrap">
            {typeof review ===
            "string"
              ? review
              : JSON.stringify(
                  review,
                  null,
                  2
                )}
          </p>
        ) : (
          <p className="text-body-lg text-on-surface-variant leading-relaxed max-w-[68ch]">
            No professional review
            has been recorded for
            this case.
          </p>
        )}

      </div>

    </Card>
  );
}


// ============================================================
// CASE HISTORY TAB
// ============================================================

function CaseHistoryTab({
  caseData,
}) {
  const history =
    caseData?.history ||
    caseData?.case_history ||
    caseData?.audit_history;


  if (
    !Array.isArray(history) ||
    history.length === 0
  ) {
    return (
      <Card>

        <div className="flex items-start gap-3 text-on-surface-variant">

          <Icon
            name="history"
            size={20}
          />

          <div>

            <p className="text-body-md-medium text-on-surface">
              No case history
              available
            </p>

            <p className="text-label-sm mt-1">
              The current complaint
              record does not contain a
              detailed audit history.
            </p>

          </div>

        </div>

      </Card>
    );
  }


  return (
    <Card>

      <ol className="flex flex-col gap-space-md">

        {history.map(
          (item, index) => (
            <li
              key={index}
              className="flex gap-space-md"
            >

              <div className="flex flex-col items-center">

                <span className="w-2.5 h-2.5 rounded-full bg-secondary mt-1.5" />

                {index !==
                  history.length -
                    1 && (
                  <span className="w-px flex-1 bg-outline-variant" />
                )}

              </div>


              <div className="pb-space-sm">

                <p className="text-label-sm text-on-surface-variant">
                  {formatDate(
                    item?.created_at ||
                      item?.date ||
                      item?.timestamp
                  )}
                </p>


                <p className="text-body-md text-on-surface">

                  <span className="font-medium">
                    {item?.actor ||
                      item?.user ||
                      item?.performed_by ||
                      "System"}
                  </span>

                  {" — "}

                  {item?.action ||
                    item?.description ||
                    "Case record updated"}

                </p>

              </div>

            </li>
          )
        )}

      </ol>

    </Card>
  );
}


// ============================================================
// FOLLOW-UP TAB
// ============================================================

function FollowUpTab({
  caseData,
  followUps,
  loading,
}) {
  return (
    <Card className="flex flex-col gap-space-md">

      <div className="flex items-center justify-between">

        <h3 className="text-label-md text-on-surface-variant uppercase tracking-wide">
          Scheduled Follow-up
          Actions
        </h3>

        <Link
          to="/follow-ups"
          className="h-8 px-space-sm rounded bg-secondary hover:bg-secondary-hover text-on-secondary text-label-sm font-semibold transition-colors inline-flex items-center"
        >
          View Follow-ups
        </Link>

      </div>


      {loading ? (
        <div className="p-space-md rounded-lg border border-outline-variant bg-surface-container-low text-label-md text-on-surface-variant">
          Loading follow-ups...
        </div>

      ) : followUps.length ===
        0 ? (

        <div className="p-space-md rounded-lg border border-outline-variant bg-surface-container-low text-label-md text-on-surface-variant">
          No follow-ups are
          currently recorded for
          this case.
        </div>

      ) : (

        <div className="flex flex-col gap-space-sm">

          {followUps.map(
            (followUp) => (
              <div
                key={followUp.id}
                className="flex items-center gap-space-md p-space-md rounded-lg border border-outline-variant bg-surface-container-low"
              >

                <Icon
                  name="event_repeat"
                  size={20}
                  className="text-secondary"
                />


                <div className="flex-1 min-w-0">

                  <p className="text-body-md-medium text-on-surface">
                    {followUp.follow_up_type ||
                      followUp.type ||
                      "Follow-up"}
                  </p>


                  <p className="text-label-sm text-on-surface-variant">

                    Case:{" "}
                    {followUp.complaint_id ||
                      getCaseId(
                        caseData
                      )}

                    {" · "}

                    Due:{" "}
                    {formatDate(
                      followUp.scheduled_at
                    )}

                  </p>


                  {followUp.notes && (
                    <p className="text-label-sm text-on-surface-variant mt-1">
                      {followUp.notes}
                    </p>
                  )}

                </div>


                <StatusBadge
                  label={
                    followUp.status
                      ? formatStatus(
                          followUp.status
                        )
                      : "Scheduled"
                  }
                />

              </div>
            )
          )}

        </div>

      )}

    </Card>
  );
}
