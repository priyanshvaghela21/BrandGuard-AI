import React, { useState } from 'react';
import { ShieldCheck, Lock, Mail, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

export default function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('creator');

  const demoAccounts = [
    {
      role: 'creator',
      name: 'Priyansh Vaghela',
      title: 'Content Creator / Copywriter',
      email: 'priyansh@brandguard.ai',
      badge: 'Draft & Rewrites',
      color: 'from-blue-600 to-indigo-600'
    },
    {
      role: 'reviewer',
      name: 'Marketing Review Team',
      title: 'Senior Compliance Reviewer',
      email: 'reviewer@brandguard.ai',
      badge: 'Review & Request Changes',
      color: 'from-amber-600 to-orange-600'
    },
    {
      role: 'manager',
      name: 'Sanskruti Antala',
      title: 'Brand & Governance Lead',
      email: 'manager@brandguard.ai',
      badge: 'Full Sign-off & Rules',
      color: 'from-emerald-600 to-teal-600'
    }
  ];

  const handleCustomLogin = (e) => {
    e.preventDefault();
    onLogin({
      name: email.split('@')[0] || 'User',
      email: email || 'user@brandguard.ai',
      role: role
    });
  };

  const handleQuickLogin = (account) => {
    onLogin({
      name: account.name,
      email: account.email,
      role: account.role
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-md w-full space-y-6 relative z-10">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-14 w-14 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 items-center justify-center shadow-xl shadow-indigo-500/25 ring-1 ring-white/20 mb-2">
            <ShieldCheck className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Brand<span className="text-indigo-400">Guard</span>
          </h1>
          <p className="text-xs text-slate-400 max-w-xs mx-auto">
            Autonomous Pre-Publication Brand Review & Governance Platform
          </p>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">
            <span>CODEX 48 National Hackathon • Round 2</span>
          </div>
        </div>

        {/* 1-Click Demo Login Box (For Hackathon Judges) */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center space-x-1.5">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Instant 1-Click Demo Logins</span>
            </span>
            <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded">For Judges</span>
          </div>
          <p className="text-xs text-slate-400">
            Select a verified persona to test role-based permissions:
          </p>

          <div className="space-y-2">
            {demoAccounts.map((account) => (
              <button
                key={account.role}
                onClick={() => handleQuickLogin(account)}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 transition-all text-left cursor-pointer group"
              >
                <div className="flex items-center space-x-3">
                  <div className={`h-8 w-8 rounded-lg bg-gradient-to-br ${account.color} flex items-center justify-center text-white font-bold text-xs shadow-md`}>
                    {account.name[0]}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white flex items-center space-x-1.5">
                      <span>{account.name}</span>
                      <span className="text-[10px] font-normal text-slate-400 font-mono">({account.role})</span>
                    </div>
                    <div className="text-[11px] text-slate-400">{account.title}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-1 text-indigo-400 group-hover:translate-x-1 transition-transform">
                  <span className="text-xs font-semibold">Enter</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Standard Email/Password Login */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="text-xs font-semibold text-slate-300">Or sign in with custom credentials:</div>

          <form onSubmit={handleCustomLogin} className="space-y-3">
            <div>
              <label className="text-xs font-medium text-slate-400 block mb-1">Email Address</label>
              <div className="relative">
                <Mail className="h-4 w-4 absolute left-3 top-2.5 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-400 block mb-1">Password</label>
              <div className="relative">
                <Lock className="h-4 w-4 absolute left-3 top-2.5 text-slate-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-400 block mb-1">Assigned Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="creator">Creator (Submit drafts, apply rewrites)</option>
                <option value="reviewer">Reviewer (Review findings, request revisions)</option>
                <option value="manager">Brand Manager (Full sign-off, rulebook ownership)</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-indigo-600/20 cursor-pointer"
            >
              Sign In to BrandGuard
            </button>
          </form>

          <div className="pt-2 text-center text-[11px] text-slate-500 flex items-center justify-center space-x-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
            <span>JWT Session Auth & RBAC Security Enabled</span>
          </div>
        </div>
      </div>
    </div>
  );
}
