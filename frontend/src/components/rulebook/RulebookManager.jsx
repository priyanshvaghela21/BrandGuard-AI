import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, Trash2, Search, Palette } from 'lucide-react';
import { BrandGuardApi } from '../../services/api';
import { INITIAL_PALETTE } from '../../data/mockData';

export default function RulebookManager({ currentRole }) {
  const isManager = (currentRole || '').toLowerCase().includes('manager');
  const [rules, setRules] = useState([]);
  const [palette] = useState(INITIAL_PALETTE);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Rule Form State
  const [newRule, setNewRule] = useState({
    id: 'R5',
    category: 'Legal & Claims',
    severity: 'High',
    title: '',
    description: '',
    bannedPatterns: '',
    approvedFacts: ''
  });

  useEffect(() => {
    BrandGuardApi.getRules().then(setRules);
  }, []);

  const loadRules = async () => {
    const data = await BrandGuardApi.getRules();
    setRules(data);
  };

  const handleCreateRule = async (e) => {
    e.preventDefault();
    if (!newRule.title || !newRule.description) return;

    const formattedRule = {
      ...newRule,
      bannedPatterns: typeof newRule.bannedPatterns === 'string' 
        ? newRule.bannedPatterns.split(',').map(s => s.trim()).filter(Boolean)
        : newRule.bannedPatterns,
      approvedFacts: typeof newRule.approvedFacts === 'string'
        ? newRule.approvedFacts.split(',').map(s => s.trim()).filter(Boolean)
        : newRule.approvedFacts
    };

    await BrandGuardApi.createRule(formattedRule);
    await loadRules();
    setIsAddModalOpen(false);
    setNewRule({
      id: `R${Math.floor(10 + Math.random() * 20)}`,
      category: 'Legal & Claims',
      severity: 'High',
      title: '',
      description: '',
      bannedPatterns: '',
      approvedFacts: ''
    });
  };

  const handleDeleteRule = async (ruleId) => {
    if (window.confirm(`Are you sure you want to delete Rule ${ruleId}?`)) {
      await BrandGuardApi.deleteRule(ruleId);
      await loadRules();
    }
  };

  const categories = ['All', 'Legal & Claims', 'Terminology', 'Visual & Palette', 'Compliance & Pricing'];

  const filteredRules = rules.filter((r) => {
    const matchesCategory = selectedCategory === 'All' || r.category === selectedCategory;
    const matchesSearch = r.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          r.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          r.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center space-x-2">
            <BookOpen className="h-5 w-5 text-indigo-400" />
            <h2 className="text-2xl font-bold text-white tracking-tight">Structured Brand Rulebook</h2>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Machine-checkable governance guidelines cited by deterministic rules and Gemini contextual verification.
          </p>
        </div>

        {isManager ? (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center space-x-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold shadow-lg shadow-indigo-600/25 transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Add Brand Rule</span>
          </button>
        ) : (
          <div className="text-xs text-amber-300 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-xl font-medium flex items-center space-x-1.5">
            <span>🔒 Read-Only (Manager required to add/edit rules)</span>
          </div>
        )}
      </div>

      {/* Brand Color Palette Row (Proposal P0/P1) */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Palette className="h-4 w-4 text-cyan-400" />
            <h3 className="text-sm font-semibold text-white">Official Brand Color Palette (CIELAB Reference)</h3>
          </div>
          <span className="text-xs text-slate-400">Strict Palette Standard</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {palette.map((c, i) => (
            <div key={i} className="flex items-center space-x-3 p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div
                className="h-10 w-10 rounded-lg border border-white/20 shrink-0 shadow-sm"
                style={{ backgroundColor: c.hex }}
              ></div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-white truncate">{c.name}</p>
                <p className="text-[11px] font-mono text-cyan-400">{c.hex}</p>
                <p className="text-[10px] text-slate-400 truncate">{c.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="h-4 w-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search by rule ID, title or keyword..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Rules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredRules.map((rule) => (
          <div
            key={rule.id}
            className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4 hover:border-slate-700 transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              {/* Header */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-sm font-bold text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-lg border border-indigo-500/20">
                    {rule.id}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                    rule.severity === 'High'
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      : rule.severity === 'Medium'
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      : 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                  }`}>
                    {rule.severity} Severity
                  </span>
                </div>

                {isManager && (
                  <button
                    onClick={() => handleDeleteRule(rule.id)}
                    className="text-slate-500 hover:text-rose-400 p-1 rounded transition-colors cursor-pointer"
                    title="Delete Rule"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Title & Category */}
              <div>
                <h4 className="text-base font-semibold text-white leading-snug">{rule.title}</h4>
                <span className="text-xs text-indigo-400/90 font-medium">{rule.category}</span>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-300 leading-relaxed">
                {rule.description}
              </p>

              {/* Banned Patterns */}
              {rule.bannedPatterns && rule.bannedPatterns.length > 0 && (
                <div className="pt-2 border-t border-slate-800/80">
                  <span className="text-[10px] uppercase font-mono text-slate-500 block mb-1">
                    Banned Patterns / Superlatives:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {rule.bannedPatterns.map((p, pIdx) => (
                      <span
                        key={pIdx}
                        className="text-[11px] px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 border border-rose-500/20 font-mono"
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Approved Ground Truth */}
            {rule.approvedFacts && rule.approvedFacts.length > 0 && (
              <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
                <span className="text-slate-500 font-mono text-[10px] block">Approved Ground Truth:</span>
                <span className="text-emerald-400">{rule.approvedFacts[0]}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add Rule Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white">Create Structured Brand Rule</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white text-lg font-mono cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateRule} className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-400 block mb-1">Rule ID</label>
                  <input
                    type="text"
                    required
                    value={newRule.id}
                    onChange={(e) => setNewRule({ ...newRule, id: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-400 block mb-1">Severity</label>
                  <select
                    value={newRule.severity}
                    onChange={(e) => setNewRule({ ...newRule, severity: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-400 block mb-1">Category</label>
                  <select
                    value={newRule.category}
                    onChange={(e) => setNewRule({ ...newRule, category: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="Legal & Claims">Legal & Claims</option>
                    <option value="Terminology">Terminology</option>
                    <option value="Visual & Palette">Visual & Palette</option>
                    <option value="Compliance & Pricing">Compliance & Pricing</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-400 block mb-1">Rule Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Prohibit Unverified Absolute Guarantees"
                  value={newRule.title}
                  onChange={(e) => setNewRule({ ...newRule, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-400 block mb-1">Rule Description & Rationale</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Explain why this rule exists and when it triggers..."
                  value={newRule.description}
                  onChange={(e) => setNewRule({ ...newRule, description: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-400 block mb-1">Banned Phrases (Comma-separated)</label>
                <input
                  type="text"
                  placeholder="guarantee 100%, miraculous, cure-all"
                  value={newRule.bannedPatterns}
                  onChange={(e) => setNewRule({ ...newRule, bannedPatterns: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-400 block mb-1">Approved Alternative / Ground Truth Fact</label>
                <input
                  type="text"
                  placeholder="E.g., Preferred term is 'customer' or 'patient'"
                  value={newRule.approvedFacts}
                  onChange={(e) => setNewRule({ ...newRule, approvedFacts: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Save Rule to Database
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
