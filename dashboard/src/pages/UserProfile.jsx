import React, { useState } from 'react';
import { User, Key, Shield, Mail, Phone, Check, RefreshCw, Lock } from 'lucide-react';
import CRMLayout from '../components/crm/CRMLayout';

export default function UserProfile() {
  const [saved, setSaved] = useState(false);

  const [profile, setProfile] = useState({
    name: 'Executive Chief Officer',
    email: 'admin@knkautomotive.com',
    phone: '+254 700 000 000',
    role: 'Super Administrator',
    department: 'Executive Management',
    twoFactorEnabled: true
  });

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <CRMLayout title="User Security Profile | KnK Automotive">
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-5">
          <div>
            <h1 className="text-xl font-bold text-white uppercase tracking-tight flex items-center gap-2">
              <User className="text-[#c9a84c]" size={20} /> User Security Profile & Credentials
            </h1>
            <p className="text-xs text-neutral-400">Manage account preferences, authentication keys, and role access permissions</p>
          </div>
        </div>

        {saved && (
          <div className="p-4 bg-emerald-950/40 border border-emerald-500/50 rounded-xl text-emerald-400 text-sm flex items-center gap-2">
            <Check size={18} /> Profile settings updated successfully!
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          <div className="bg-[#0a0a0a] border border-neutral-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-semibold text-[#c9a84c] uppercase tracking-wider flex items-center gap-2">
              <Shield size={16} /> Personal Information & Role
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-400 mb-1">Full Name</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full bg-[#121212] border border-neutral-800 focus:border-[#c9a84c] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-400 mb-1">Email Address</label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="w-full bg-[#121212] border border-neutral-800 focus:border-[#c9a84c] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-400 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  className="w-full bg-[#121212] border border-neutral-800 focus:border-[#c9a84c] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-400 mb-1">Access Role</label>
                <input
                  type="text"
                  disabled
                  value={profile.role}
                  className="w-full bg-[#161616] border border-neutral-800 rounded-xl px-4 py-2.5 text-sm text-neutral-400 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-400 mb-1">Department</label>
                <input
                  type="text"
                  value={profile.department}
                  onChange={(e) => setProfile({ ...profile, department: e.target.value })}
                  className="w-full bg-[#121212] border border-neutral-800 focus:border-[#c9a84c] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="bg-[#0a0a0a] border border-neutral-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-semibold text-[#c9a84c] uppercase tracking-wider flex items-center gap-2">
              <Lock size={16} /> Security & Authentication
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-[#121212] border border-neutral-800 rounded-xl">
                <div>
                  <div className="text-sm font-semibold text-white">Two-Factor Authentication (2FA)</div>
                  <div className="text-xs text-neutral-400">Enforce TOTP hardware token verification for Admin login</div>
                </div>
                <input
                  type="checkbox"
                  checked={profile.twoFactorEnabled}
                  onChange={(e) => setProfile({ ...profile, twoFactorEnabled: e.target.checked })}
                  className="w-5 h-5 accent-[#c9a84c] cursor-pointer"
                />
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  className="aq-btn-secondary px-4 py-2.5 border border-neutral-800 rounded-xl text-xs text-neutral-300 flex items-center gap-2"
                >
                  <Key size={14} /> Change Security Password
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="aq-btn-primary"
              style={{
                background: 'linear-gradient(135deg, #e5c158 0%, #c9a84c 100%)',
                boxShadow: '0 10px 25px -5px rgba(201, 168, 76, 0.4)',
                padding: '12px 28px',
                height: '48px',
                borderRadius: '14px',
                fontSize: '12px',
                fontWeight: 950,
                letterSpacing: '1px',
                color: '#080808'
              }}
            >
              SAVE PROFILE SETTINGS
            </button>
          </div>
        </form>
      </div>
    </CRMLayout>
  );
}
