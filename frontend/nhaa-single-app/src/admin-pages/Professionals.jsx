import { useEffect, useMemo, useState } from "react";
import Icon from "../admin-components/Icon";
import Card from "../admin-components/Card";
import StatusBadge from "../admin-components/StatusBadge";
import { API_V1_URL } from "../apiConfig";
function getAuthToken() {
  try {
    const auth = JSON.parse(localStorage.getItem("nhaa_auth") || "{}");
    return auth?.access_token || auth?.token || "";
  } catch {
    return "";
  }
}

function formatRole(role) {
  if (!role) return "Professional";

  return String(role)
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function getProfessionalName(user) {
  return (
    user?.full_name ||
    user?.name ||
    user?.professional_name ||
    "Unnamed Professional"
  );
}

function getProfessionalRole(user) {
  return formatRole(
    user?.role ||
      user?.designation ||
      user?.professional_role
  );
}

function getStatus(user) {
  if (typeof user?.is_active === "boolean") {
    return user.is_active ? "Active" : "Inactive";
  }

  return user?.status || "Active";
}

function getDistrict(user) {
  return (
    user?.district ||
    user?.location ||
    user?.office ||
    "Not specified"
  );
}

function getSpecialization(user) {
  return (
    user?.specialization ||
    user?.speciality ||
    user?.specialty ||
    user?.department ||
    "Not specified"
  );
}

function getLanguages(user) {
  if (Array.isArray(user?.languages)) {
    return user.languages;
  }

  if (typeof user?.languages === "string") {
    return user.languages
      .split(",")
      .map((language) => language.trim())
      .filter(Boolean);
  }

  if (user?.language) {
    return [user.language];
  }

  return [];
}

export default function Professionals() {
  const [professionals, setProfessionals] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadProfessionals = async () => {
      try {
        setLoading(true);
        setError("");

        const token = getAuthToken();

        if (!token) {
          throw new Error("Authentication session not found.");
        }

        /*
         * Professionals are users whose role is professional.
         * The Admin page uses the same backend user source as the
         * authentication system instead of mockData.
         */
        const response = await fetch(
`${API_V1_URL}/users/?role=professional`,          {
            method: "GET",
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        let data = {};

        try {
          data = await response.json();
        } catch {
          data = {};
        }

        if (!response.ok) {
          throw new Error(
            data?.detail ||
              "Unable to load professionals from backend."
          );
        }

        const loadedProfessionals = Array.isArray(data?.users)
          ? data.users
          : Array.isArray(data?.professionals)
          ? data.professionals
          : Array.isArray(data)
          ? data
          : [];

        if (!cancelled) {
          setProfessionals(loadedProfessionals);
        }
      } catch (err) {
        console.error("Admin professionals error:", err);

        if (!cancelled) {
          setProfessionals([]);
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load professionals."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadProfessionals();

    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    if (!q) {
      return professionals;
    }

    return professionals.filter((professional) => {
      const name = getProfessionalName(professional).toLowerCase();
      const role = getProfessionalRole(professional).toLowerCase();
      const specialization =
        getSpecialization(professional).toLowerCase();
      const district = getDistrict(professional).toLowerCase();

      return (
        name.includes(q) ||
        role.includes(q) ||
        specialization.includes(q) ||
        district.includes(q)
      );
    });
  }, [professionals, query]);

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-space-sm">
        <div>
          <h1 className="text-headline-lg text-on-surface">
            Professionals Directory
          </h1>

          <p className="text-body-md text-on-surface-variant mt-1">
            {loading
              ? "Loading professionals..."
              : `${professionals.length} professionals available in the system.`}
          </p>
        </div>

        <button
          type="button"
          className="inline-flex items-center gap-2 h-10 px-space-md bg-secondary hover:bg-secondary-hover text-on-secondary rounded text-body-md-medium transition-colors w-fit"
        >
          <Icon name="person_add" size={18} />
          Add Professional
        </button>
      </div>

      {error && (
        <Card>
          <div className="flex items-start gap-3 text-error">
            <Icon name="error" size={20} />

            <div>
              <p className="text-body-md-medium">
                Unable to load professionals
              </p>

              <p className="text-label-sm mt-1">
                {error}
              </p>
            </div>
          </div>
        </Card>
      )}

      <div className="relative max-w-md">
        <Icon
          name="search"
          size={20}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant"
        />

        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by name, role, or specialization..."
          className="w-full h-10 pl-10 pr-4 bg-surface-container-lowest border border-outline-variant rounded text-body-md text-on-surface placeholder:text-outline focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20"
        />
      </div>

      {loading ? (
        <Card>
          <div className="flex items-center justify-center py-space-xl text-body-md text-on-surface-variant">
            Loading professionals...
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-space-md">
          {filtered.map((professional) => {
            const languages = getLanguages(professional);
            const status = getStatus(professional);

            return (
              <Card
                key={
                  professional?.id ||
                  professional?.email ||
                  getProfessionalName(professional)
                }
                className="flex flex-col gap-space-sm"
              >
                <div className="flex items-start justify-between gap-space-sm">
                  <div className="flex items-center gap-space-sm min-w-0">
                    <div className="w-11 h-11 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container shrink-0">
                      <Icon name="person" size={22} />
                    </div>

                    <div className="min-w-0">
                      <p className="text-body-md-medium text-on-surface truncate">
                        {getProfessionalName(professional)}
                      </p>

                      <p className="text-label-sm text-on-surface-variant">
                        {getProfessionalRole(professional)}
                      </p>
                    </div>
                  </div>

                  <StatusBadge label={status} />
                </div>

                <p className="text-body-md text-on-surface-variant">
                  {getSpecialization(professional)}
                </p>

                <div className="flex items-center justify-between text-label-sm text-on-surface-variant pt-space-sm border-t border-outline-variant">
                  <span className="flex items-center gap-1">
                    <Icon name="folder_shared" size={14} />
                    {professional?.caseload ??
                      professional?.active_cases ??
                      0}{" "}
                    active cases
                  </span>

                  <span className="flex items-center gap-1">
                    <Icon name="location_on" size={14} />
                    {getDistrict(professional)
                      .split(",")[0]
                      .trim()}
                  </span>
                </div>

                {languages.length > 0 && (
                  <div className="flex gap-1 flex-wrap">
                    {languages.map((language) => (
                      <span
                        key={language}
                        className="text-label-sm bg-surface-container px-2 py-0.5 rounded-full text-on-surface-variant"
                      >
                        {language}
                      </span>
                    ))}
                  </div>
                )}

                {professional?.email && (
                  <div className="pt-space-xs text-label-sm text-on-surface-variant truncate">
                    {professional.email}
                  </div>
                )}
              </Card>
            );
          })}

          {filtered.length === 0 && (
            <Card className="col-span-full">
              <div className="text-center py-space-lg text-body-md text-on-surface-variant">
                {professionals.length === 0
                  ? "No professionals are currently available."
                  : "No professionals match your search."}
              </div>
            </Card>
          )}
        </div>
      )}
    </>
  );
}
