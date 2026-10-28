import React from "react";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  ShieldCheck,
  Zap,
  AlertOctagon,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

// ─── Static Data ──────────────────────────────────────────────────────────────

const KPI_CARDS = [
  {
    label: "Audits Processed",
    value: "54",
    unit: "",
    trend: "+12% this month",
    up: true,
    icon: BarChart3,
    accent: "text-indigo-400",
    border: "border-indigo-800/30",
    iconBg: "bg-indigo-900/30",
  },
  {
    label: "Avg Turnaround",
    value: "14",
    unit: "sec",
    trend: "vs 48–72 hrs before",
    up: true,
    icon: Zap,
    accent: "text-cyan-400",
    border: "border-cyan-800/30",
    iconBg: "bg-cyan-900/30",
  },
  {
    label: "Benchmark Accuracy",
    value: "94.2",
    unit: "%",
    trend: "On 50 labelled creatives",
    up: true,
    icon: ShieldCheck,
    accent: "text-emerald-400",
    border: "border-emerald-800/30",
    iconBg: "bg-emerald-900/30",
  },
  {
    label: "Violations Intercepted",
    value: "138",
    unit: "",
    trend: "Before publication",
    up: false,
    icon: AlertOctagon,
    accent: "text-rose-400",
    border: "border-rose-800/30",
    iconBg: "bg-rose-900/30",
  },
];

const VIOLATED_RULES = [
  {
    id: "R1",
    title: "Tone & Voice Compliance",
    pct: 42,
    count: 58,
    barColor: "bg-rose-500",
    badgeColor: "bg-rose-900/40 text-rose-300 border-rose-700/40",
  },
  {
    id: "R4",
    title: "Logo Usage Standards",
    pct: 26,
    count: 36,
    barColor: "bg-amber-500",
    badgeColor: "bg-amber-900/40 text-amber-300 border-amber-700/40",
  },
  {
    id: "R2",
    title: "Color Palette Adherence",
    pct: 19,
    count: 26,
    barColor: "bg-sky-500",
    badgeColor: "bg-sky-900/40 text-sky-300 border-sky-700/40",
  },
  {
    id: "R3",
    title: "Disclaimer & Legal Copy",
    pct: 13,
    count: 18,
    barColor: "bg-indigo-500",
    badgeColor: "bg-indigo-900/40 text-indigo-300 border-indigo-700/40",
  },
];

const WORKFLOW_ROWS = [
  {
    metric: "Manual review backlog reduced",
    value: "85%",
    positive: true,
  },
  {
    metric: "False-positive rate (Evidence Verifier)",
    value: "0.9%",
    positive: true,
  },
  {
    metric: "Human sign-off compliance",
    value: "100%",
    positive: true,
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function KpiCard({ label, value, unit, trend, up, icon: Icon, accent, border, iconBg }) {
  return (
    <div
      className={`bg-slate-900 rounded-xl border ${border} p-5 flex flex-col gap-3`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">
          {label}
        </span>
        <div className={`p-2 rounded-lg ${iconBg}`}>
          <Icon size={16} className={accent} />
        </div>
      </div>
      <div className="flex items-end gap-1.5">
        <span className={`text-3xl font-bold ${accent}`}>{value}</span>
        {unit && <span className="text-lg font-semibold text-slate-400 mb-0.5">{unit}</span>}
      </div>
      <div className="flex items-center gap-1.5">
        {up ? (
          <TrendingUp size={12} className="text-emerald-400" />
        ) : (
          <TrendingDown size={12} className="text-rose-400" />
        )}
        <span className="text-xs text-slate-500">{trend}</span>
      </div>
    </div>
  );
}

function RuleBar({ id, title, pct, count, barColor, badgeColor }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <span
            className={`inline-block shrink-0 text-xs font-mono font-semibold px-2 py-0.5 rounded border ${badgeColor}`}
          >
            {id}
          </span>
          <span className="text-sm text-slate-300 truncate">{title}</span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs text-slate-500">{count} flags</span>
          <span className="text-sm font-bold text-slate-200 w-10 text-right">
            {pct}%
          </span>
        </div>
      </div>
      <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
        <div
          className={`h-2 rounded-full transition-all duration-700 ${barColor}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AnalyticsDashboard() {
  return (
    <div className="min-h-screen bg-slate-950 px-6 py-8 space-y-8">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-50">
            Governance Insights
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Recurring mistake patterns, workflow impact, and compliance
            benchmarks across your brand.
          </p>
        </div>
        <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-900/40 border border-indigo-700/40 text-indigo-300 text-xs font-semibold shrink-0">
          <Zap size={12} />
          CI/CD for Marketing
        </span>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {KPI_CARDS.map((card) => (
          <KpiCard key={card.label} {...card} />
        ))}
      </div>

      {/* ── Main Two-Column Row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-6">
        {/* Left: Most Violated Brand Rules */}
        <div className="bg-slate-900 rounded-xl border border-slate-800 flex flex-col">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-slate-800">
            <AlertOctagon size={16} className="text-rose-400" />
            <h2 className="text-sm font-semibold text-slate-200">
              Most Violated Brand Rules
            </h2>
            <span className="ml-auto text-xs text-slate-500">
              Last 30 days · 138 total flags
            </span>
          </div>
          <div className="flex flex-col gap-5 p-5">
            {VIOLATED_RULES.map((rule) => (
              <RuleBar key={rule.id} {...rule} />
            ))}
          </div>
        </div>

        {/* Right: Stacked cards */}
        <div className="flex flex-col gap-4">
          {/* Actionable Insight */}
          <div className="bg-indigo-950/40 rounded-xl border border-indigo-800/40 p-5 flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-indigo-400" />
              <h3 className="text-sm font-semibold text-indigo-300">
                Actionable Insight
              </h3>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              <span className="font-semibold text-rose-400">R1 — Tone & Voice</span>{" "}
              accounts for{" "}
              <span className="font-semibold text-slate-100">42%</span> of all
              flagged content. This pattern typically signals gaps in creator
              onboarding.
            </p>
            <div className="flex items-start gap-2 rounded-lg bg-indigo-900/30 border border-indigo-800/30 px-4 py-3">
              <ArrowRight
                size={14}
                className="text-indigo-400 mt-0.5 shrink-0"
              />
              <p className="text-xs text-indigo-200 leading-relaxed">
                Recommend scheduling a{" "}
                <span className="font-semibold">Tone & Voice workshop</span>{" "}
                for content creators and updating the style guide with richer
                examples aligned to the brand persona.
              </p>
            </div>
          </div>

          {/* Workflow Impact */}
          <div className="bg-slate-900 rounded-xl border border-slate-800 flex flex-col flex-1">
            <div className="flex items-center gap-2 px-5 py-4 border-b border-slate-800">
              <TrendingUp size={16} className="text-emerald-400" />
              <h3 className="text-sm font-semibold text-slate-200">
                Workflow Impact
              </h3>
            </div>
            <div className="flex flex-col divide-y divide-slate-800/60">
              {WORKFLOW_ROWS.map(({ metric, value, positive }) => (
                <div
                  key={metric}
                  className="flex items-center justify-between px-5 py-3.5 gap-4"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                    <span className="text-sm text-slate-400 truncate">
                      {metric}
                    </span>
                  </div>
                  <span
                    className={`text-sm font-bold shrink-0 ${
                      positive ? "text-emerald-400" : "text-rose-400"
                    }`}
                  >
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom Callout ── */}
      <div className="flex items-center justify-center gap-3 rounded-xl border border-slate-800 bg-slate-900/50 px-6 py-3.5">
        <BarChart3 size={15} className="text-slate-500 shrink-0" />
        <p className="text-xs text-slate-500 text-center">
          Accuracy evaluated on{" "}
          <span className="font-semibold text-slate-400">
            50 labelled marketing creatives
          </span>{" "}
          — 25 compliant, 25 with violations.
        </p>
      </div>
    </div>
  );
}
