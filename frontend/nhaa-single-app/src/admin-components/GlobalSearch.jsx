import { useMemo, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "./Icon";
import { cases, professionals, followUps } from "../admin-data/mockData";

export default function GlobalSearch({ open, onClose }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (open) {
      setQuery("");
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose();
    }
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return { caseResults: [], proResults: [], followResults: [] };
    return {
      caseResults: cases
        .filter(
          (c) =>
            c.id.toLowerCase().includes(q) ||
            c.complainantName.toLowerCase().includes(q) ||
            c.category.toLowerCase().includes(q)
        )
        .slice(0, 5),
      proResults: professionals
        .filter((p) => p.name.toLowerCase().includes(q) || p.role.toLowerCase().includes(q))
        .slice(0, 5),
      followResults: followUps
        .filter((f) => f.id.toLowerCase().includes(q) || f.caseId.toLowerCase().includes(q) || f.type.toLowerCase().includes(q))
        .slice(0, 5),
    };
  }, [query]);

  if (!open) return null;

  const hasResults =
    results.caseResults.length || results.proResults.length || results.followResults.length;

  const go = (path) => {
    navigate(path);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-24 px-4 bg-[#0f172a]/40" onClick={onClose}>
      <div
        className="w-full max-w-xl bg-surface-container-lowest rounded-xl border border-outline-variant shadow-level3 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-space-sm px-space-md h-14 border-b border-outline-variant">
          <Icon name="search" className="text-on-surface-variant" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search cases, professionals, follow-ups..."
            className="flex-1 h-full bg-transparent outline-none text-body-md text-on-surface placeholder:text-outline"
          />
          <kbd className="text-label-sm text-outline border border-outline-variant rounded px-1.5 py-0.5">
            Esc
          </kbd>
        </div>
        <div className="max-h-96 overflow-y-auto">
          {!query && (
            <p className="p-space-lg text-body-md text-on-surface-variant text-center">
              Start typing to search across cases, professionals, and follow-ups.
            </p>
          )}
          {query && !hasResults && (
            <p className="p-space-lg text-body-md text-on-surface-variant text-center">
              No results found for &ldquo;{query}&rdquo;.
            </p>
          )}
          {results.caseResults.length > 0 && (
            <SearchSection title="Cases">
              {results.caseResults.map((c) => (
                <SearchRow
                  key={c.id}
                  icon="folder_shared"
                  title={c.id}
                  subtitle={`${c.complainantName} · ${c.category}`}
                  onClick={() => go(`/cases/${c.id}`)}
                />
              ))}
            </SearchSection>
          )}
          {results.proResults.length > 0 && (
            <SearchSection title="Professionals">
              {results.proResults.map((p) => (
                <SearchRow
                  key={p.id}
                  icon="clinical_notes"
                  title={p.name}
                  subtitle={p.role}
                  onClick={() => go("/professionals")}
                />
              ))}
            </SearchSection>
          )}
          {results.followResults.length > 0 && (
            <SearchSection title="Follow-ups">
              {results.followResults.map((f) => (
                <SearchRow
                  key={f.id}
                  icon="event_repeat"
                  title={`${f.id} · ${f.type}`}
                  subtitle={`Case ${f.caseId} · Due ${f.dueDate}`}
                  onClick={() => go("/follow-ups")}
                />
              ))}
            </SearchSection>
          )}
        </div>
      </div>
    </div>
  );
}

function SearchSection({ title, children }) {
  return (
    <div className="py-space-xs">
      <p className="px-space-md pt-space-xs pb-1 text-label-sm text-on-surface-variant uppercase tracking-wide">
        {title}
      </p>
      {children}
    </div>
  );
}

function SearchRow({ icon, title, subtitle, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-space-sm px-space-md py-space-xs hover:bg-surface-container-low text-left transition-colors"
    >
      <span className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-on-surface-variant shrink-0">
        <Icon name={icon} size={18} />
      </span>
      <div className="min-w-0">
        <p className="text-body-md-medium text-on-surface truncate">{title}</p>
        <p className="text-label-sm text-on-surface-variant truncate">{subtitle}</p>
      </div>
    </button>
  );
}

