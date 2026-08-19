import React, { useState } from 'react';
import { Image, Shield, Check, RefreshCw, Upload, Eye } from 'lucide-react';
import CRMLayout from '../components/crm/CRMLayout';
import KNKLogo from '../components/KNKLogo';

export default function BrandIdentity() {
  const [saved, setSaved] = useState(false);

  const [assets, setAssets] = useState({
    media1_favicon: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=100&auto=format&fit=crop',
    media2_logo: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=300&auto=format&fit=crop',
    media3_lockup: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&auto=format&fit=crop',
    primaryColor: '#c9a84c',
    darkBg: '#080808',
    cardBg: '#0a0a0a'
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <CRMLayout title="Brand Asset Matrix | KnK Automotive">
      <div className="p-6 max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-5">
          <div>
            <h1 className="text-xl font-bold text-white uppercase tracking-tight flex items-center gap-2">
              <Shield className="text-[#c9a84c]" size={20} /> Brand Identity & Media Asset Matrix
            </h1>
            <p className="text-xs text-neutral-400">Manage Media 1 (Favicon Emblem), Media 2 (Universal System Logo), and Media 3 (Horizontal Lockup)</p>
          </div>
          <button
            onClick={handleSave}
            className="aq-btn-primary"
            style={{
              background: 'linear-gradient(135deg, #e5c158 0%, #c9a84c 100%)',
              boxShadow: '0 10px 25px -5px rgba(201, 168, 76, 0.4)',
              padding: '10px 24px',
              height: '48px',
              borderRadius: '14px',
              fontSize: '11px',
              fontWeight: 950,
              letterSpacing: '1px',
              color: '#080808'
            }}
          >
            {saved ? <Check size={16} /> : <RefreshCw size={16} />}
            {saved ? 'ASSETS UPDATED' : 'SAVE BRAND MATRIX'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Media 1: Favicon Emblem */}
          <div className="bg-[#0a0a0a] border border-neutral-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white uppercase">Media 1: Favicon Emblem</h3>
              <span className="text-[10px] bg-[#c9a84c]/20 text-[#c9a84c] px-2 py-0.5 rounded font-mono">64x64 PNG</span>
            </div>
            <div className="h-40 bg-[#121212] border border-dashed border-neutral-700 rounded-xl flex flex-col items-center justify-center p-4">
              <KNKLogo className="w-16 h-16 mb-2" />
              <span className="text-xs text-neutral-400">KnK Crown Emblem</span>
            </div>
            <button className="w-full aq-btn-secondary py-2.5 rounded-xl border border-neutral-800 text-xs text-neutral-300 flex items-center justify-center gap-2">
              <Upload size={14} /> Replace Favicon Emblem
            </button>
          </div>

          {/* Media 2: Universal System Logo */}
          <div className="bg-[#0a0a0a] border border-neutral-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white uppercase">Media 2: Universal Logo</h3>
              <span className="text-[10px] bg-[#c9a84c]/20 text-[#c9a84c] px-2 py-0.5 rounded font-mono">SVG Vector</span>
            </div>
            <div className="h-40 bg-[#121212] border border-dashed border-neutral-700 rounded-xl flex flex-col items-center justify-center p-4">
              <div className="flex items-center gap-3">
                <KNKLogo className="w-12 h-12" />
                <div className="text-left">
                  <div className="text-base font-extrabold text-white">KnK <span className="text-[#c9a84c]">AUTOMOTIVE</span></div>
                  <div className="text-[9px] text-neutral-500 uppercase tracking-widest">Enterprise Platform</div>
                </div>
              </div>
            </div>
            <button className="w-full aq-btn-secondary py-2.5 rounded-xl border border-neutral-800 text-xs text-neutral-300 flex items-center justify-center gap-2">
              <Upload size={14} /> Replace Universal Logo
            </button>
          </div>

          {/* Media 3: Horizontal Header Lockup */}
          <div className="bg-[#0a0a0a] border border-neutral-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white uppercase">Media 3: Horizontal Lockup</h3>
              <span className="text-[10px] bg-[#c9a84c]/20 text-[#c9a84c] px-2 py-0.5 rounded font-mono">1200x300 PNG</span>
            </div>
            <div className="h-40 bg-[#121212] border border-dashed border-neutral-700 rounded-xl flex flex-col items-center justify-center p-4">
              <div className="text-center space-y-1">
                <span className="text-xs font-bold text-[#c9a84c] uppercase tracking-widest">KnK AUTOMOTIVE ENTERPRISE</span>
                <p className="text-[10px] text-neutral-400">LUXURY AUTOMOTIVE MARKETPLACE & FUSE ERP</p>
              </div>
            </div>
            <button className="w-full aq-btn-secondary py-2.5 rounded-xl border border-neutral-800 text-xs text-neutral-300 flex items-center justify-center gap-2">
              <Upload size={14} /> Replace Header Lockup
            </button>
          </div>
        </div>

        {/* Theme Palette Matrix */}
        <div className="bg-[#0a0a0a] border border-neutral-800 rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Luxury Dark Gold Theme Tokens</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-[#080808] border border-neutral-800 rounded-xl space-y-2">
              <div className="w-full h-8 bg-[#080808] rounded border border-neutral-700" />
              <div className="text-xs font-bold text-white">#080808</div>
              <div className="text-[10px] text-neutral-500">Master Dark Background</div>
            </div>

            <div className="p-4 bg-[#080808] border border-neutral-800 rounded-xl space-y-2">
              <div className="w-full h-8 bg-[#0a0a0a] rounded border border-neutral-700" />
              <div className="text-xs font-bold text-white">#0a0a0a</div>
              <div className="text-[10px] text-neutral-500">Surface Card Background</div>
            </div>

            <div className="p-4 bg-[#080808] border border-neutral-800 rounded-xl space-y-2">
              <div className="w-full h-8 bg-[#c9a84c] rounded border border-[#c9a84c]" />
              <div className="text-xs font-bold text-[#c9a84c]">#c9a84c</div>
              <div className="text-[10px] text-neutral-500">Primary Luxury Gold</div>
            </div>

            <div className="p-4 bg-[#080808] border border-neutral-800 rounded-xl space-y-2">
              <div className="w-full h-8 bg-[#6366f1] rounded border border-[#6366f1]" />
              <div className="text-xs font-bold text-[#6366f1]">#6366f1</div>
              <div className="text-[10px] text-neutral-500">CRM Suite Indigo Accent</div>
            </div>
          </div>
        </div>
      </div>
    </CRMLayout>
  );
}
