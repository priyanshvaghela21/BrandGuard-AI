import React, { useState } from 'react';
import { ArrowRight, LockKeyhole, ShieldCheck, Sparkles, UserRound } from 'lucide-react';

const DEMO_USERS = {
  creator: { name: 'Priyansh Vaghela', email: 'creator@brandguard.demo', label: 'Creator' },
  reviewer: { name: 'Review Team', email: 'reviewer@brandguard.demo', label: 'Reviewer' },
  manager: { name: 'Sanskruti Antala', email: 'manager@brandguard.demo', label: 'Brand Manager' },
};

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('creator@brandguard.demo');
  const [password, setPassword] = useState('demo123');
  const [error, setError] = useState('');

  const submit = (event) => {
    event.preventDefault();
    const role = Object.keys(DEMO_USERS).find((key) => DEMO_USERS[key].email === email.trim().toLowerCase());
    if (!role || password.length < 4) {
      setError('Use one of the demo accounts below and a password with at least 4 characters.');
      return;
    }
    onLogin({ ...DEMO_USERS[role], role });
  };

  const chooseRole = (role) => {
    setEmail(DEMO_USERS[role].email);
    setPassword('demo123');
    setError('');
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-5">
      <div className="w-full max-w-5xl grid lg:grid-cols-[1.05fr_0.95fr] overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/80 shadow-2xl shadow-indigo-950/30">
        <section className="hidden lg:flex flex-col justify-between p-10 bg-gradient-to-br from-indigo-950 via-slate-950 to-cyan-950/60">
          <div>
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <span className="text-2xl font-bold">Brand<span className="text-indigo-300">Guard</span></span>
            </div>
            <div className="mt-20 max-w-md">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">CODEX 48 • Governance platform</p>
              <h1 className="mt-4 text-4xl font-bold leading-tight">Ship faster without losing trust.</h1>
              <p className="mt-5 text-sm leading-7 text-slate-300">Review every claim, phrase and creative against structured brand rules before it reaches the public.</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400"><Sparkles className="h-4 w-4 text-indigo-300" /> Rules first. AI second. Human approval always.</div>
        </section>

        <section className="p-6 sm:p-10">
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center"><ShieldCheck className="h-5 w-5" /></div>
            <span className="text-xl font-bold">Brand<span className="text-indigo-400">Guard</span></span>
          </div>
          <div className="mb-8">
            <p className="text-sm font-semibold text-indigo-300">Welcome back</p>
            <h2 className="mt-2 text-3xl font-bold text-white">Sign in to your workspace</h2>
            <p className="mt-2 text-sm text-slate-400">Use a demo role to explore the complete governed workflow.</p>
          </div>

          <form onSubmit={submit} className="space-y-5">
            <label className="block text-sm text-slate-300">Email
              <div className="relative mt-2"><UserRound className="absolute left-3 top-3 h-4 w-4 text-slate-500" /><input value={email} onChange={(event) => setEmail(event.target.value)} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-10 py-2.5 text-sm text-white outline-none transition focus:border-indigo-500" type="email" /></div>
            </label>
            <label className="block text-sm text-slate-300">Password
              <div className="relative mt-2"><LockKeyhole className="absolute left-3 top-3 h-4 w-4 text-slate-500" /><input value={password} onChange={(event) => setPassword(event.target.value)} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-10 py-2.5 text-sm text-white outline-none transition focus:border-indigo-500" type="password" /></div>
            </label>
            {error && <p className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300">{error}</p>}
            <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500" type="submit">Enter workspace <ArrowRight className="h-4 w-4" /></button>
          </form>

          <div className="mt-8 border-t border-slate-800 pt-6">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Quick demo access</p>
            <div className="grid gap-2 sm:grid-cols-3">
              {Object.entries(DEMO_USERS).map(([role, user]) => (
                <button key={role} onClick={() => chooseRole(role)} className="rounded-xl border border-slate-800 bg-slate-950/70 p-3 text-left transition hover:border-indigo-500/60 hover:bg-indigo-500/10">
                  <span className="block text-xs font-semibold text-slate-200">{user.label}</span>
                  <span className="mt-1 block truncate text-[10px] text-slate-500">{user.email}</span>
                </button>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
