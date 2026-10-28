import React from 'react';
import {
  ShieldCheck,
  Sparkles,
  BookOpen,
  History,
  BarChart3,
  UserCheck,
  LogOut,
  LayoutDashboard,
} from 'lucide-react';

const NAV_TABS = [
  { id: 'dashboard',   label: 'Dashboard',   icon: LayoutDashboard },
  { id: 'studio',      label: 'Studio',       icon: Sparkles },
  { id: 'rulebook',    label: 'Rulebook',     icon: BookOpen },
  { id: 'audit',       label: 'Audit Trail',  icon: History },
  { id: 'insights',    label: 'Insights',     icon: BarChart3 },
];

const ROLES = ['Creator', 'Reviewer', 'Brand Manager'];

export default function Navbar({
  activeTab,
  setActiveTab,
  currentUser,
  onLogout,
  currentRole,
  setCurrentRole,
  isBackendOnline,
}) {
  return (
    <>
      {/* ── Main sticky navbar ── */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-900/90 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">

            {/* ── LEFT: Logo ── */}
            <button
              onClick={() => setActiveTab('dashboard')}
              className="flex items-center gap-2.5 flex-shrink-0 group"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-shadow">
                <ShieldCheck className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold tracking-tight text-white">
                  Brand<span className="text-indigo-400">Guard</span>
                </span>
                <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-semibold tracking-widest uppercase">
                  CODEX 48
                </span>
              </div>
            </button>

            {/* ── CENTER: Nav tabs (desktop) ── */}
            <nav className="hidden md:flex items-center gap-1 flex-1 justify-center">
              {NAV_TABS.map(({ id, label, icon: Icon }) => {
                const isActive = activeTab === id;
                return (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id)}
                    className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-150 whitespace-nowrap ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/30'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="w-4 h-4" strokeWidth={isActive ? 2.5 : 2} />
                    {label}
                  </button>
                );
              })}
            </nav>

            {/* ── RIGHT: Status + Role + User ── */}
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">

              {/* System status pill (hidden on xl and above to save space, show on smaller) */}
              <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-slate-800 border border-slate-700">
                <span
                  className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    isBackendOnline
                      ? 'bg-emerald-400 animate-pulse'
                      : 'bg-amber-400'
                  }`}
                />
                <span className="text-xs font-medium text-slate-300 whitespace-nowrap">
                  {isBackendOnline ? 'FastAPI Live' : 'Demo Mode'}
                </span>
              </div>

              {/* Role switcher */}
              <div className="flex items-center gap-1.5 bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-1.5">
                <UserCheck className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                <select
                  value={currentRole}
                  onChange={(e) => setCurrentRole(e.target.value)}
                  className="bg-transparent text-slate-300 text-xs font-medium focus:outline-none cursor-pointer pr-1"
                >
                  {ROLES.map((role) => (
                    <option key={role} value={role} className="bg-slate-800 text-slate-200">
                      {role}
                    </option>
                  ))}
                </select>
              </div>

              {/* User info + logout */}
              <div className="flex items-center gap-2 group">
                {/* Avatar */}
                <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center shadow-sm flex-shrink-0">
                  <span className="text-xs font-bold text-white uppercase">
                    {currentUser?.name?.[0] ?? 'U'}
                  </span>
                </div>

                {/* Name + role text (hidden on mobile) */}
                <div className="hidden sm:flex flex-col leading-tight">
                  <span className="text-sm font-semibold text-white">{currentUser?.name ?? 'User'}</span>
                  <span className="text-[11px] text-slate-400">{currentRole}</span>
                </div>

                {/* Logout button */}
                <button
                  onClick={onLogout}
                  title="Sign out"
                  className="ml-1 p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all duration-150"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ── Mobile bottom tab bar ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-md border-t border-slate-800">
        <div className="flex overflow-x-auto scrollbar-none">
          {NAV_TABS.map(({ id, label }) => {
            const isActive = activeTab === id;
            return (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex-shrink-0 flex-1 min-w-[64px] py-3 text-xs font-medium transition-all duration-150 whitespace-nowrap ${
                  isActive
                    ? 'text-indigo-400 border-t-2 border-indigo-500 -mt-px'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}
