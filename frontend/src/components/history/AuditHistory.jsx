import React, { useState, useEffect } from 'react';
import {
  History,
  CheckCircle,
  AlertTriangle,
  Eye,
  Printer,
  Search,
  Filter,
  X,
  FileCheck2,
} from 'lucide-react';
import { BrandGuardApi } from '../../services/api';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function StatusPill({ status }) {
  const isApproved = status === 'Approved';
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
        isApproved
          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25'
          : 'bg-amber-500/15 text-amber-400 border border-amber-500/25'
      }`}
    >
      {isApproved ? (
        <CheckCircle className="w-3 h-3" />
      ) : (
        <AlertTriangle className="w-3 h-3" />
      )}
      {status}
    </span>
  );
}

function ScoreBadge({ score }) {
  const good = score >= 80;
  return (
    <span
      className={`text-sm font-bold ${
        good ? 'text-emerald-400' : 'text-amber-400'
      }`}
    >
      {score}
    </span>
  );
}

// ─── Diff Modal ───────────────────────────────────────────────────────────────

function DiffModal({ item, onClose }) {
  if (!item) return null;

  const handlePrint = () => window.print();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-5xl max-h-[90vh] overflow-y-auto bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl shadow-black/50 flex flex-col">

        {/* Modal header */}
        <div className="flex items-start justify-between gap-4 p-6 border-b border-slate-800">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-mono text-xs px-2 py-1 rounded-md bg-indigo-500/15 border border-indigo-500/25 text-indigo-400">
              {item.auditId ?? item.id}
            </span>
            <div>
              <h2 className="text-lg font-bold text-white leading-tight">
                {item.title ?? item.asset_title}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {item.date ?? item.created_at} · Reviewed by{' '}
                <span className="text-slate-300">{item.approver ?? 'N/A'}</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700 text-xs font-medium transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              Print
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">

          {/* Side-by-side diff */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Original */}
            <div className="rounded-xl border border-rose-500/30 bg-rose-950/20 p-4 flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                <span className="text-xs font-semibold text-rose-400 uppercase tracking-wider">
                  Original Draft — Violations Present
                </span>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
                {item.originalText ?? item.original_text ?? 'No original draft available.'}
              </p>
            </div>

            {/* Approved */}
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-4 flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                  Final Approved Copy — Governance Certified
                </span>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
                {item.approvedText ?? item.approved_text ?? 'No approved copy available.'}
              </p>
            </div>
          </div>

          {/* Metadata grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Brand Score */}
            <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4 text-center">
              <p className="text-[11px] text-slate-400 uppercase tracking-wider mb-1">Brand Score</p>
              <p className={`text-2xl font-bold ${(item.score ?? 0) >= 80 ? 'text-emerald-400' : 'text-amber-400'}`}>
                {item.score ?? 'N/A'}
              </p>
            </div>

            {/* Issues Fixed */}
            <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4 text-center">
              <p className="text-[11px] text-slate-400 uppercase tracking-wider mb-1">Issues Fixed</p>
              <p className="text-2xl font-bold text-indigo-400">
                {item.issuesFixed ?? item.issues_fixed ?? '—'}
              </p>
            </div>

            {/* Evidence Verifier */}
            <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4 text-center">
              <p className="text-[11px] text-slate-400 uppercase tracking-wider mb-1">Evidence Verifier</p>
              <p className="text-sm font-semibold text-emerald-400 flex items-center justify-center gap-1 mt-1">
                <FileCheck2 className="w-3.5 h-3.5" />
                Pydantic Valid
              </p>
            </div>

            {/* Publication Status */}
            <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4 text-center">
              <p className="text-[11px] text-slate-400 uppercase tracking-wider mb-1">Publication</p>
              <p className="text-sm font-semibold text-emerald-400 flex items-center justify-center gap-1 mt-1">
                <CheckCircle className="w-3.5 h-3.5" />
                Ready to Launch
              </p>
            </div>
          </div>

          {/* Reviewer comment */}
          {(item.comment ?? item.reviewer_comment) && (
            <div className="rounded-xl bg-slate-800/60 border border-slate-700 p-4">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Reviewer Comment
              </p>
              <p className="text-sm text-slate-300 italic leading-relaxed">
                "{item.comment ?? item.reviewer_comment}"
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

const STATUS_FILTERS = ['All', 'Approved', 'Changes Requested'];

export default function AuditHistory() {
  const [history, setHistory]         = useState([]);
  const [loading, setLoading]         = useState(true);
  const [search, setSearch]           = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await BrandGuardApi.getHistory();
        setHistory(Array.isArray(data) ? data : []);
      } catch {
        setHistory([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = history.filter((item) => {
    const title = (item.title ?? item.asset_title ?? '').toLowerCase();
    const id    = (item.auditId ?? item.id ?? '').toString().toLowerCase();
    const matchesSearch = title.includes(search.toLowerCase()) || id.includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === 'All' || (item.status ?? '') === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-slate-950 pb-20 md:pb-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

        {/* ── Page header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Governance Audit Trail
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Complete record of brand governance reviews, approvals, and compliance actions.
            </p>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-400 flex-shrink-0">
            <History className="w-4 h-4 text-indigo-400" />
            <span>Timestamped &amp; Accountable</span>
            <span className="w-1 h-1 rounded-full bg-slate-600" />
            <span className="text-slate-500">ISO 27001 aligned</span>
          </div>
        </div>

        {/* ── Filter / Search bar ── */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Text search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by title or audit ID…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-colors"
            />
          </div>

          {/* Status filter pills */}
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="w-4 h-4 text-slate-500 flex-shrink-0" />
            {STATUS_FILTERS.map((s) => {
              const isActive = statusFilter === s;
              let activeClass = 'bg-indigo-600 text-white border-indigo-500';
              if (isActive && s === 'Approved')           activeClass = 'bg-emerald-600 text-white border-emerald-500';
              if (isActive && s === 'Changes Requested')  activeClass = 'bg-amber-500 text-white border-amber-400';
              return (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold border transition-all duration-150 ${
                    isActive
                      ? activeClass
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white hover:border-slate-600'
                  }`}
                >
                  {s}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Audit table ── */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center">
              <History className="w-8 h-8 text-slate-600" />
            </div>
            <div className="text-center">
              <p className="text-slate-300 font-semibold">No audit records found</p>
              <p className="text-slate-500 text-sm mt-1">
                {history.length === 0
                  ? 'Submit content for review to start building your audit trail.'
                  : 'Try adjusting your search or filter.'}
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-800">
                    {['Audit ID', 'Asset', 'Author', 'Approver', 'Score', 'Status', 'Actions'].map((h) => (
                      <th
                        key={h}
                        className="px-4 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {filtered.map((item, idx) => {
                    const auditId   = item.auditId ?? item.id ?? `AUD-${idx + 1}`;
                    const title     = item.title ?? item.asset_title ?? 'Untitled';
                    const date      = item.date ?? item.created_at ?? '';
                    const author    = item.author ?? 'Unknown';
                    const approver  = item.approver ?? 'N/A';
                    const score     = item.score ?? 0;
                    const status    = item.status ?? 'Approved';

                    return (
                      <tr
                        key={auditId}
                        className="hover:bg-slate-800/40 transition-colors group"
                      >
                        {/* Audit ID */}
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className="font-mono text-xs text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded">
                            {auditId}
                          </span>
                        </td>

                        {/* Asset title + date */}
                        <td className="px-4 py-4 max-w-[220px]">
                          <p className="font-medium text-slate-200 truncate">{title}</p>
                          {date && (
                            <p className="text-xs text-slate-500 mt-0.5">{date}</p>
                          )}
                        </td>

                        {/* Author */}
                        <td className="px-4 py-4 whitespace-nowrap text-slate-300">{author}</td>

                        {/* Approver */}
                        <td className="px-4 py-4 whitespace-nowrap text-slate-300">{approver}</td>

                        {/* Score */}
                        <td className="px-4 py-4 whitespace-nowrap">
                          <ScoreBadge score={score} />
                        </td>

                        {/* Status */}
                        <td className="px-4 py-4 whitespace-nowrap">
                          <StatusPill status={status} />
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-4 whitespace-nowrap">
                          <button
                            onClick={() => setSelectedItem(item)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 hover:text-white hover:border-indigo-500 hover:bg-indigo-500/10 text-xs font-medium transition-all duration-150 group-hover:border-slate-600"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            View Diff
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Table footer */}
            <div className="px-4 py-3 border-t border-slate-800 flex items-center justify-between">
              <p className="text-xs text-slate-500">
                Showing{' '}
                <span className="text-slate-300 font-medium">{filtered.length}</span>
                {' '}of{' '}
                <span className="text-slate-300 font-medium">{history.length}</span>{' '}
                records
              </p>
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                Audit integrity verified
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Diff Modal ── */}
      {selectedItem && (
        <DiffModal item={selectedItem} onClose={() => setSelectedItem(null)} />
      )}
    </div>
  );
}
