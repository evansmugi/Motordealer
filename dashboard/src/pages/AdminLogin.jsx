import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, Mail, ArrowRight, Sparkles } from 'lucide-react';
import KNKLogo from '../components/KNKLogo';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@knkautomotive.com');
  const [password, setPassword] = useState('••••••••••••');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    setTimeout(() => {
      setLoading(false);
      localStorage.setItem('knk_admin_token', 'jwt_mock_token_knk_2026');
      localStorage.setItem('knk_admin_user', JSON.stringify({ email, role: 'Super Admin', name: 'Executive Officer' }));
      navigate('/admin/dashboard');
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#080808] text-white flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Glow Effects */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#c9a84c]/10 rounded-full filter blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-[#6366f1]/10 rounded-full filter blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-[#0a0a0a] border border-[#c9a84c]/20 rounded-2xl p-8 shadow-2xl backdrop-blur-xl relative z-10">
        <div className="flex flex-col items-center mb-8 text-center">
          <KNKLogo className="w-16 h-16 mb-3" />
          <h1 className="text-2xl font-extrabold tracking-tight text-white uppercase">
            KnK <span className="text-[#c9a84c]">Automotive</span>
          </h1>
          <p className="text-xs text-neutral-400 uppercase tracking-widest mt-1">Enterprise Command Center</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-900/30 border border-red-500/50 rounded-xl text-red-400 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase text-neutral-400 mb-2">Admin Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={18} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-[#111111] border border-neutral-800 focus:border-[#c9a84c] rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none transition-colors"
                placeholder="admin@knkautomotive.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-neutral-400 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={18} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-[#111111] border border-neutral-800 focus:border-[#c9a84c] rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-neutral-400 pt-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded border-neutral-700 bg-neutral-900 text-[#c9a84c] focus:ring-0" />
              Remember Session
            </label>
            <a href="#forgot" className="text-[#c9a84c] hover:underline">Forgot Key?</a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full aq-btn-primary flex items-center justify-center gap-2 text-center"
            style={{
              background: 'linear-gradient(135deg, #e5c158 0%, #c9a84c 100%)',
              boxShadow: '0 10px 25px -5px rgba(201, 168, 76, 0.4)',
              padding: '12px 24px',
              height: '48px',
              borderRadius: '14px',
              fontSize: '12px',
              fontWeight: 900,
              letterSpacing: '1px',
              color: '#080808'
            }}
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>ENTER COMMAND CENTER</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-neutral-800 flex items-center justify-between text-[11px] text-neutral-500">
          <span className="flex items-center gap-1">
            <ShieldCheck size={14} className="text-[#c9a84c]" /> 256-bit Encrypted
          </span>
          <span>v5.2.0 Production</span>
        </div>
      </div>
    </div>
  );
}
