import React, { useState, useEffect, useMemo } from "react";
import {
  Activity,
  ArrowRight,
  CheckCircle2,
  Clock3,
  FilePlus2,
  History,
  ShieldAlert,
  Sparkles,
  BarChart3,
  FileText,
  UserCheck,
  Crown,
} from "lucide-react";
import { BrandGuardApi } from "../../services/api";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function getFirstName(fullName = "") {
  return fullName.split(" ")[0] || fullName;
}

function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCard({ label, value, icon: Icon, colorClass, borderColor }) {
  return (
    <div
      className={`bg-slate-900 rounded-xl border ${borderColor} p-5 flex flex-col gap-3`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">
          {label}
        </span>
        <div className={`p-2 rounded-lg ${colorClass} bg-opacity-10`}>
          <Icon size={16} className={colorClass} />
        </div>
      </div>
      <span className="text-3xl font-bold text-slate-50">{value}</span>
    </div>
  );
}

function StatusPill({ status }) {
  const map = {
    Approved: "bg-emerald-900/50 text-emerald-300 border border-emerald-700/40",
    "Changes Requested":
      "bg-amber-900/50 text-amber-300 border border-amber-700/40",
    Pending: "bg-slate-700/60 text-slate-300 border border-slate-600/40",
  };
  const cls = map[status] ?? map["Pending"];
  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${cls}`}>
      {status}
    </span>
  );
}

function AuditIdBadge({ id }) {
  return (
    <span className="inline-block font-mono text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
      {id}
    </span>
  );
}

const ROLE_META = {
  creator: {
    icon: FileText,
    label: "Creator",
    description:
      "Draft brand content, submit assets for review, and accept AI-suggested rewrites to meet brand standards.",
    cta: "Go to Studio",
    tab: "studio",
    accent: "text-indigo-400",
    border: "border-indigo-800/40",
    bg: "bg-indigo-900/10",
  },
  reviewer: {
    icon: UserCheck,
    label: "Reviewer",
    description:
      "Evaluate submitted assets, add structured comments, and request changes before brand approval.",
    cta: "Go to Reviews",
    tab: "history",
    accent: "text-amber-400",
    border: "border-amber-800/40",
    bg: "bg-amber-900/10",
  },
  "brand manager": {
    icon: Crown,
    label: "Brand Manager",
    description:
      "Own the brand rulebook, configure governance policies, and issue final sign-off on all published assets.",
    cta: "Manage Rules",
    tab: "rules",
    accent: "text-emerald-400",
    border: "border-emerald-800/40",
    bg: "bg-emerald-900/10",
  },
};

function RoleCard({ currentRole, onNavigate }) {
  const key = (currentRole || "creator").toLowerCase();
  const meta = ROLE_META[key] ?? ROLE_META["creator"];
  const Icon = meta.icon;

  return (
    <div
      className={`bg-slate-900 rounded-xl border ${meta.border} ${meta.bg} p-5 flex flex-col gap-4 h-full`}
    >
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg bg-slate-800 ${meta.accent}`}>
          <Icon size={18} />
        </div>
        <div>
          <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold">
            Your Role
          </p>
          <p className={`text-base font-bold ${meta.accent}`}>{meta.label}</p>
        </div>
      </div>
      <p className="text-sm text-slate-400 leading-relaxed flex-1">
        {meta.description}
      </p>
      <button
        onClick={() => onNavigate(meta.tab)}
        className="flex items-center gap-2 text-sm font-semibold text-slate-200 hover:text-white transition-colors group"
      >
        {meta.cta}
        <ArrowRight
          size={14}
          className="group-hover:translate-x-1 transition-transform"
        />
      </button>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Dashboard({ currentRole, userName, onNavigate }) {
  const [history, setHistory] = useState([]);
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const [h, r] = await Promise.all([
          BrandGuardApi.getHistory(),
          BrandGuardApi.getRules(),
        ]);
        if (!cancelled) {
          setHistory(Array.isArray(h) ? h : []);
          setRules(Array.isArray(r) ? r : []);
        }
      } catch (err) {
        console.error("Dashboard load error:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const stats = useMemo(() => {
    const openReviews = history.filter(
      (h) => h.status === "Pending" || h.status === "Changes Requested"
    ).length;
    const approvedAssets = history.filter(
      (h) => h.status === "Approved"
    ).length;
    const activeRules = rules.filter((r) => r.active !== false).length;
    const scores = history
      .map((h) => Number(h.score ?? h.brandScore ?? 0))
      .filter(Boolean);
    const avgScore =
      scores.length > 0
        ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
        : 0;
    return { openReviews, approvedAssets, activeRules, avgScore };
  }, [history, rules]);

  const recentActivity = useMemo(() => {
    return [...history]
      .sort((a, b) => new Date(b.date ?? b.createdAt ?? 0) - new Date(a.date ?? a.createdAt ?? 0))
      .slice(0, 4);
  }, [history]);

  const firstName = getFirstName(userName);

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-8 space-y-8">
      {/* ── Greeting Row ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-50">
            {getGreeting()},{" "}
            <span className="text-indigo-400">{firstName || "there"}</span>!
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Here's a snapshot of your brand governance workspace.
          </p>
        </div>
        <button
          onClick={() => onNavigate("studio")}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-colors shadow-lg shadow-indigo-900/40 shrink-0"
        >
          <FilePlus2 size={16} />
          New Audit Submission
        </button>
      </div>

      {/* ── Stat Cards ── */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-slate-900 rounded-xl border border-slate-800 p-5 h-28 animate-pulse"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Open Reviews"
            value={stats.openReviews}
            icon={Clock3}
            colorClass="text-amber-400"
            borderColor="border-amber-800/30"
          />
          <StatCard
            label="Approved Assets"
            value={stats.approvedAssets}
            icon={CheckCircle2}
            colorClass="text-emerald-400"
            borderColor="border-emerald-800/30"
          />
          <StatCard
            label="Active Rules"
            value={stats.activeRules}
            icon={ShieldAlert}
            colorClass="text-indigo-400"
            borderColor="border-indigo-800/30"
          />
          <StatCard
            label="Avg Brand Score"
            value={stats.avgScore ? `${stats.avgScore}%` : "—"}
            icon={BarChart3}
            colorClass="text-cyan-400"
            borderColor="border-cyan-800/30"
          />
        </div>
      )}

      {/* ── Main Two-Column Row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_0.6fr] gap-6">
        {/* Left: Recent Audit Activity */}
        <div className="bg-slate-900 rounded-xl border border-slate-800 flex flex-col">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Activity size={16} className="text-indigo-400" />
              <h2 className="text-sm font-semibold text-slate-200">
                Recent Audit Activity
              </h2>
            </div>
            <button
              onClick={() => onNavigate("history")}
              className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 font-medium transition-colors group"
            >
              View full trail
              <ArrowRight
                size={12}
                className="group-hover:translate-x-0.5 transition-transform"
              />
            </button>
          </div>

          {loading ? (
            <div className="p-5 space-y-3">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="h-10 bg-slate-800 rounded animate-pulse"
                />
              ))}
            </div>
          ) : recentActivity.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-14 text-slate-500 gap-2">
              <Sparkles size={24} />
              <p className="text-sm">No audit history yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs text-slate-500 uppercase tracking-wider border-b border-slate-800">
                    <th className="text-left px-5 py-3 font-semibold">
                      Audit ID
                    </th>
                    <th className="text-left px-4 py-3 font-semibold">
                      Title
                    </th>
                    <th className="text-left px-4 py-3 font-semibold">
                      Status
                    </th>
                    <th className="text-left px-4 py-3 font-semibold">
                      Author
                    </th>
                    <th className="text-left px-4 py-3 font-semibold">
                      Date
                    </th>
                    <th className="text-right px-5 py-3 font-semibold">
                      Score
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {recentActivity.map((entry, idx) => {
                    const auditId =
                      entry.id ??
                      entry.auditId ??
                      `AUD-${String(idx + 1).padStart(3, "0")}`;
                    const title =
                      entry.title ??
                      entry.assetName ??
                      entry.fileName ??
                      "Untitled Asset";
                    const author =
                      entry.author ?? entry.submittedBy ?? "Unknown";
                    const date =
                      entry.date ?? entry.createdAt ?? entry.submittedAt;
                    const score =
                      entry.score ?? entry.brandScore;

                    return (
                      <tr
                        key={auditId}
                        className="hover:bg-slate-800/30 transition-colors"
                      >
                        <td className="px-5 py-3">
                          <AuditIdBadge id={String(auditId).slice(0, 10)} />
                        </td>
                        <td className="px-4 py-3 text-slate-300 font-medium max-w-[180px] truncate">
                          {title}
                        </td>
                        <td className="px-4 py-3">
                          <StatusPill status={entry.status ?? "Pending"} />
                        </td>
                        <td className="px-4 py-3 text-slate-400">{author}</td>
                        <td className="px-4 py-3 text-slate-400 whitespace-nowrap">
                          {formatDate(date)}
                        </td>
                        <td className="px-5 py-3 text-right">
                          {score != null ? (
                            <span
                              className={`font-semibold ${
                                Number(score) >= 80
                                  ? "text-emerald-400"
                                  : Number(score) >= 60
                                  ? "text-amber-400"
                                  : "text-rose-400"
                              }`}
                            >
                              {score}%
                            </span>
                          ) : (
                            <span className="text-slate-600">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right: Your Role Card */}
        <RoleCard currentRole={currentRole} onNavigate={onNavigate} />
      </div>

      {/* ── Bottom Banner ── */}
      <div className="flex items-center justify-center gap-3 rounded-xl border border-slate-800 bg-slate-900/50 px-6 py-3.5">
        <ShieldAlert size={15} className="text-slate-500 shrink-0" />
        <p className="text-xs text-slate-500 text-center">
          <span className="font-semibold text-slate-400">BrandGuard</span>{" "}
          never auto-publishes — human sign-off is always required.
        </p>
      </div>
    </div>
  );
}
