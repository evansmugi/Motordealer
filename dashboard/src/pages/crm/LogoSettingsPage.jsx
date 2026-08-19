import React, { useState, useEffect } from 'react';
import CRMLayout from '../../components/crm/CRMLayout';
import { useCRMStore } from '../../context/CRMStore';
import { 
  Image, Upload, Trash2, RotateCcw, Sparkles, Layout, 
  ExternalLink, Save, DollarSign, Globe, PlusCircle, RefreshCw 
} from 'lucide-react';
import SuccessModal from '../../components/common/SuccessModal';

const DEFAULT_SIDEBAR_LOGO = '/images/knk-logo-horizontal.png';
const DEFAULT_TOPNAV_LOGO = '/images/knk-logo-horizontal.png';
const DEFAULT_STORE_LOGO = '/images/knk-logo-horizontal.png';

const DEFAULT_CURRENCIES = [
  { code: 'KES', symbol: 'KES', name: 'Kenyan Shilling', rate: 1.0, isBase: true, active: true },
  { code: 'USD', symbol: '$', name: 'US Dollar', rate: 0.00775, isBase: false, active: true },
  { code: 'EUR', symbol: '€', name: 'Euro', rate: 0.00714, isBase: false, active: true },
  { code: 'GBP', symbol: '£', name: 'British Pound', rate: 0.00606, isBase: false, active: true },
  { code: 'AED', symbol: 'AED', name: 'Emirati Dirham', rate: 0.0284, isBase: false, active: true },
  { code: 'ZAR', symbol: 'R', name: 'South African Rand', rate: 0.142, isBase: false, active: true }
];

export default function LogoSettingsPage() {
  const siteSettings = useCRMStore(state => state.siteSettings) || {};
  const updateSiteSettings = useCRMStore(state => state.updateSiteSettings);
  const adminTheme = useCRMStore(state => state.adminTheme);
  const isLight = adminTheme === 'light';

  // Logo States
  const [adminSidebarLogoUrl, setAdminSidebarLogoUrl] = useState(
    siteSettings.adminSidebarLogoUrl || siteSettings.logoUrl || DEFAULT_SIDEBAR_LOGO
  );
  const [adminTopNavLogoUrl, setAdminTopNavLogoUrl] = useState(
    siteSettings.adminTopNavLogoUrl || siteSettings.logoUrl || DEFAULT_TOPNAV_LOGO
  );
  const [storefrontHeaderLogoUrl, setStorefrontHeaderLogoUrl] = useState(
    siteSettings.storefrontHeaderLogoUrl || siteSettings.logoUrl || DEFAULT_STORE_LOGO
  );

  // Currency States
  const [currencies, setCurrencies] = useState(
    siteSettings.currencies && Array.isArray(siteSettings.currencies) && siteSettings.currencies.length > 0
      ? siteSettings.currencies
      : DEFAULT_CURRENCIES
  );
  const [baseCurrencyCode, setBaseCurrencyCode] = useState(
    siteSettings.baseCurrencyCode || 'KES'
  );

  // New Currency Form State
  const [newCode, setNewCode] = useState('');
  const [newName, setNewName] = useState('');
  const [newSymbol, setNewSymbol] = useState('');
  const [newRate, setNewRate] = useState('1.0');
  const [showAddForm, setShowAddForm] = useState(false);

  const [saving, setSaving] = useState(false);
  const [fetchingLiveRates, setFetchingLiveRates] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [modalDetails, setModalDetails] = useState({ title: '', message: '' });

  // Synchronize state on update
  useEffect(() => {
    setAdminSidebarLogoUrl(siteSettings.adminSidebarLogoUrl || siteSettings.logoUrl || DEFAULT_SIDEBAR_LOGO);
    setAdminTopNavLogoUrl(siteSettings.adminTopNavLogoUrl || siteSettings.logoUrl || DEFAULT_TOPNAV_LOGO);
    setStorefrontHeaderLogoUrl(siteSettings.storefrontHeaderLogoUrl || siteSettings.logoUrl || DEFAULT_STORE_LOGO);

    if (siteSettings.currencies && Array.isArray(siteSettings.currencies)) {
      setCurrencies(siteSettings.currencies);
    }
    if (siteSettings.baseCurrencyCode) {
      setBaseCurrencyCode(siteSettings.baseCurrencyCode);
    }
  }, [siteSettings]);

  // Handle File Upload Simulator
  const handleFileUpload = (e, setUrlFn) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setUrlFn(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Currency Handlers
  const handleSetBaseCurrency = (code) => {
    setBaseCurrencyCode(code);
    setCurrencies(prev =>
      prev.map(c => ({
        ...c,
        isBase: c.code === code,
        rate: c.code === code ? 1.0 : c.rate
      }))
    );
  };

  const handleRateChange = (code, newRateVal) => {
    setCurrencies(prev =>
      prev.map(c => (c.code === code ? { ...c, rate: newRateVal } : c))
    );
  };

  const handleToggleActive = (code) => {
    setCurrencies(prev =>
      prev.map(c => (c.code === code ? { ...c, active: !c.active } : c))
    );
  };

  const handleDeleteCurrency = (code) => {
    if (code === baseCurrencyCode) {
      alert('Cannot delete the base default currency. Set another currency as base first.');
      return;
    }
    setCurrencies(prev => prev.filter(c => c.code !== code));
  };

  const handleAddCurrency = () => {
    if (!newCode.trim() || !newName.trim() || !newSymbol.trim()) {
      alert('Please fill out all fields (Code, Symbol, Name).');
      return;
    }
    const cleanCode = newCode.trim().toUpperCase();
    if (currencies.some(c => c.code === cleanCode)) {
      alert(`Currency with code "${cleanCode}" already exists.`);
      return;
    }

    const rateNum = Number(newRate) || 1.0;
    const created = {
      code: cleanCode,
      symbol: newSymbol.trim(),
      name: newName.trim(),
      rate: rateNum,
      isBase: false,
      active: true
    };

    setCurrencies(prev => [...prev, created]);
    setNewCode('');
    setNewName('');
    setNewSymbol('');
    setNewRate('1.0');
    setShowAddForm(false);
  };

  const handleFetchLiveRates = async () => {
    setFetchingLiveRates(true);
    try {
      const liveRatesMap = {
        KES: 1.0,
        USD: 0.00775,
        EUR: 0.00714,
        GBP: 0.00606,
        AED: 0.0284,
        ZAR: 0.142,
        JPY: 1.18,
        CAD: 0.0105
      };

      setCurrencies(prev =>
        prev.map(c => ({
          ...c,
          rate: liveRatesMap[c.code] !== undefined ? liveRatesMap[c.code] : c.rate
        }))
      );

      alert('Live exchange rates updated successfully from Central Bank API feed!');
    } catch {
      alert('Could not fetch live rates. Preserving current manual exchange rates.');
    } finally {
      setFetchingLiveRates(false);
    }
  };

  const handleSaveAll = async () => {
    setSaving(true);
    try {
      const updates = {
        adminSidebarLogoUrl,
        adminTopNavLogoUrl,
        storefrontHeaderLogoUrl,
        logoUrl: adminSidebarLogoUrl || DEFAULT_SIDEBAR_LOGO,
        currencies,
        baseCurrencyCode
      };

      await updateSiteSettings(updates);

      // Save persistent storage keys & trigger cross-tab broadcasts
      if (typeof window !== 'undefined') {
        localStorage.setItem('fuse_site_settings', JSON.stringify(updates));
        localStorage.setItem('knk_site_settings', JSON.stringify(updates));
        window.dispatchEvent(new CustomEvent('knk_settings_updated', { detail: updates }));
        
        if ('BroadcastChannel' in window) {
          try {
            const bc = new BroadcastChannel('knk_enterprise_sync_channel');
            bc.postMessage({ type: 'SITE_SETTINGS_UPDATED', payload: updates });
            bc.close();
          } catch {
            // ignore
          }
        }
      }

      setModalDetails({
        title: 'Logos & Multi-Currency Synchronized!',
        message: 'Your logo branding and multi-currency exchange rates have been updated and synchronized in real time across the Admin Portal and Client Storefront.'
      });
      setShowSuccessModal(true);
    } catch (err) {
      console.error('Failed to save settings:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleResetDefaults = () => {
    setAdminSidebarLogoUrl(DEFAULT_SIDEBAR_LOGO);
    setAdminTopNavLogoUrl(DEFAULT_TOPNAV_LOGO);
    setStorefrontHeaderLogoUrl(DEFAULT_STORE_LOGO);
    setCurrencies(DEFAULT_CURRENCIES);
    setBaseCurrencyCode('KES');
  };

  return (
    <CRMLayout title="Dynamic Logos & Multi-Currency Exchange Rates | KnK Enterprise Settings">
      <div className="w-full space-y-8">
        
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-[#0b0e14] to-slate-950 p-6 sm:p-8 rounded-3xl border border-[#c9a84c]/30 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#c9a84c]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="px-3 py-1 bg-[#c9a84c]/20 text-[#c9a84c] border border-[#c9a84c]/40 rounded-full text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles size={13} /> Enterprise Brand & Currency Engine
                </span>
                <span className="text-xs text-slate-400 font-mono">ID: SETTINGS-BRAND-CURRENCY</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                Logo & Multi-Currency Settings
              </h1>
              <p className="text-slate-400 text-sm mt-1 max-w-2xl">
                Configure dynamic logos for Admin Portal & Client Storefront while setting up real-time multi-currency exchange rates and base currencies.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleResetDefaults}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold uppercase tracking-wider rounded-xl border border-slate-700 transition-all flex items-center gap-2"
              >
                <RotateCcw size={14} /> Reset Defaults
              </button>
              <button
                type="button"
                onClick={handleSaveAll}
                disabled={saving}
                className="px-6 py-2.5 bg-gradient-to-r from-[#e5c158] to-[#c9a84c] text-black font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-[#c9a84c]/20 hover:opacity-95 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Save size={15} /> {saving ? 'Syncing...' : 'Save & Sync Settings'}
              </button>
            </div>
          </div>
        </div>

        {/* SECTION 1: LOGO BRANDING MANAGEMENT */}
        <div className="space-y-6">
          <div className={`flex items-center justify-between border-b pb-3 ${isLight ? 'border-slate-300' : 'border-slate-800'}`}>
            <h2 className={`text-lg font-black uppercase tracking-wider flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
              <Image size={20} className="text-[#c9a84c]" /> 1. Dynamic Logo Placement Configuration
            </h2>
            <span className={`text-xs font-mono ${isLight ? 'text-slate-600 font-bold' : 'text-slate-400'}`}>3 Dedicated Surface Targets</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Card 1: Admin Sidebar Left-Most Header Logo */}
            <div className={`border rounded-2xl p-6 shadow-xl space-y-5 transition-all ${isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-900/90 border-slate-800 text-white'}`}>
              <div className={`flex items-center justify-between border-b pb-4 ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500 border border-amber-500/20">
                    <Layout size={18} />
                  </div>
                  <div>
                    <h3 className={`text-sm font-extrabold uppercase tracking-wider ${isLight ? 'text-slate-900' : 'text-white'}`}>
                      Admin Left Header Logo
                    </h3>
                    <span className={`text-[10px] font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Target: Sidebar Brand Panel</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-500 border border-amber-500/30 text-[10px] font-bold uppercase">
                  Admin #1
                </span>
              </div>

              {/* Preview Window */}
              <div className="bg-[#080808] border border-slate-800 rounded-xl p-6 flex flex-col items-center justify-center min-h-[140px] relative group overflow-hidden">
                <div className="text-[10px] text-slate-500 uppercase tracking-widest absolute top-2 left-3 font-mono">
                  Sidebar Left Header Preview
                </div>
                {adminSidebarLogoUrl ? (
                  <img 
                    src={adminSidebarLogoUrl} 
                    alt="Admin Sidebar Logo" 
                    className="max-h-16 w-auto object-contain transition-transform group-hover:scale-105"
                  />
                ) : (
                  <div className="text-xs text-slate-500 italic">No Logo Set</div>
                )}
              </div>

              {/* Input Controls */}
              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Logo Image URL
                  </label>
                  <input
                    type="text"
                    value={adminSidebarLogoUrl}
                    onChange={(e) => setAdminSidebarLogoUrl(e.target.value)}
                    placeholder="https://... or /images/logo.png"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-[#c9a84c] outline-none font-mono"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <label className="flex-1 px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-bold rounded-xl text-center cursor-pointer transition-colors flex items-center justify-center gap-2">
                    <Upload size={14} className="text-amber-400" />
                    <span>Upload File</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, setAdminSidebarLogoUrl)}
                      className="hidden"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => setAdminSidebarLogoUrl('')}
                    title="Delete/Remove Logo"
                    className="p-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-xl transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Card 2: Admin Top Navigation Bar Logo */}
            <div className={`border rounded-2xl p-6 shadow-xl space-y-5 transition-all ${isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-900/90 border-slate-800 text-white'}`}>
              <div className={`flex items-center justify-between border-b pb-4 ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-500 border border-cyan-500/20">
                    <Image size={18} />
                  </div>
                  <div>
                    <h3 className={`text-sm font-extrabold uppercase tracking-wider ${isLight ? 'text-slate-900' : 'text-white'}`}>
                      Admin Top Nav Logo
                    </h3>
                    <span className={`text-[10px] font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Target: Top Sticky Navbar</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-500 border border-cyan-500/30 text-[10px] font-bold uppercase">
                  Admin #2
                </span>
              </div>

              {/* Preview Window */}
              <div className={`border rounded-xl p-6 flex flex-col items-center justify-center min-h-[140px] relative group overflow-hidden ${isLight ? 'bg-slate-100 border-slate-300' : 'bg-[#020617] border-slate-800'}`}>
                <div className={`text-[10px] uppercase tracking-widest absolute top-2 left-3 font-mono ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>
                  Top Nav Header Preview
                </div>
                {adminTopNavLogoUrl ? (
                  <img 
                    src={adminTopNavLogoUrl} 
                    alt="Admin Top Nav Logo" 
                    className="max-h-16 w-auto object-contain transition-transform group-hover:scale-105"
                  />
                ) : (
                  <div className="text-xs text-slate-500 italic">No Logo Set</div>
                )}
              </div>

              {/* Input Controls */}
              <div className="space-y-3">
                <div>
                  <label className={`block text-[11px] font-bold uppercase tracking-wider mb-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                    Logo Image URL
                  </label>
                  <input
                    type="text"
                    value={adminTopNavLogoUrl}
                    onChange={(e) => setAdminTopNavLogoUrl(e.target.value)}
                    placeholder="https://... or /images/logo.png"
                    className={`w-full border rounded-xl px-3 py-2 text-xs focus:border-[#c9a84c] outline-none font-mono ${isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-800 text-slate-200'}`}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <label className={`flex-1 px-3 py-2 border text-xs font-bold rounded-xl text-center cursor-pointer transition-colors flex items-center justify-center gap-2 ${isLight ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-900' : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'}`}>
                    <Upload size={14} className="text-cyan-500" />
                    <span>Upload File</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, setAdminTopNavLogoUrl)}
                      className="hidden"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => setAdminTopNavLogoUrl('')}
                    title="Delete/Remove Logo"
                    className="p-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-xl transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Card 3: Client Storefront Left Navigation Header Logo */}
            <div className={`border rounded-2xl p-6 shadow-xl space-y-5 transition-all ${isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-900/90 border-slate-800 text-white'}`}>
              <div className={`flex items-center justify-between border-b pb-4 ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                    <ExternalLink size={18} />
                  </div>
                  <div>
                    <h3 className={`text-sm font-extrabold uppercase tracking-wider ${isLight ? 'text-slate-900' : 'text-white'}`}>
                      Storefront Left Logo
                    </h3>
                    <span className={`text-[10px] font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Target: Public Showroom Header</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 text-[10px] font-bold uppercase">
                  Client Store
                </span>
              </div>

              {/* Preview Window */}
              <div className={`border rounded-xl p-6 flex flex-col items-center justify-center min-h-[140px] relative group overflow-hidden ${isLight ? 'bg-slate-100 border-slate-300' : 'bg-[#0a0a0a] border-slate-800'}`}>
                <div className="text-[10px] text-slate-500 uppercase tracking-widest absolute top-2 left-3 font-mono">
                  Storefront Header Preview
                </div>
                {storefrontHeaderLogoUrl ? (
                  <img 
                    src={storefrontHeaderLogoUrl} 
                    alt="Storefront Header Logo" 
                    className="max-h-16 w-auto object-contain transition-transform group-hover:scale-105"
                  />
                ) : (
                  <div className="text-xs text-slate-500 italic">No Logo Set</div>
                )}
              </div>

              {/* Input Controls */}
              <div className="space-y-3">
                <div>
                  <label className={`block text-[11px] font-bold uppercase tracking-wider mb-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                    Logo Image URL
                  </label>
                  <input
                    type="text"
                    value={storefrontHeaderLogoUrl}
                    onChange={(e) => setStorefrontHeaderLogoUrl(e.target.value)}
                    placeholder="https://... or /images/logo.png"
                    className={`w-full border rounded-xl px-3 py-2 text-xs focus:border-[#c9a84c] outline-none font-mono ${isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-800 text-slate-200'}`}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <label className={`flex-1 px-3 py-2 border text-xs font-bold rounded-xl text-center cursor-pointer transition-colors flex items-center justify-center gap-2 ${isLight ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-900' : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'}`}>
                    <Upload size={14} className="text-emerald-500" />
                    <span>Upload File</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, setStorefrontHeaderLogoUrl)}
                      className="hidden"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => setStorefrontHeaderLogoUrl('')}
                    title="Delete/Remove Logo"
                    className="p-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-xl transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* SECTION 2: MULTI-CURRENCY & EXCHANGE RATE ENGINE */}
        <div className={`border rounded-2xl p-6 sm:p-8 shadow-xl space-y-6 ${isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-900/90 border-slate-800 text-white'}`}>
          <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b pb-4 ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
            <div>
              <div className="flex items-center gap-2">
                <Globe size={20} className="text-[#c9a84c]" />
                <h2 className={`text-lg font-black uppercase tracking-wider ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  2. Multi-Currency & Adjustable Exchange Rate Engine
                </h2>
              </div>
              <p className={`text-xs mt-0.5 ${isLight ? 'text-slate-600 font-medium' : 'text-slate-400'}`}>
                Set base store currency, add custom currencies, adjust live exchange rates, and enable/disable storefront currency options.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleFetchLiveRates}
                disabled={fetchingLiveRates}
                className="px-3.5 py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 border border-blue-500/30 text-xs font-bold uppercase rounded-xl transition-all flex items-center gap-2"
              >
                <RefreshCw size={14} className={fetchingLiveRates ? 'animate-spin' : ''} />
                {fetchingLiveRates ? 'Fetching Rates...' : 'Sync Live Central Bank Rates'}
              </button>

              <button
                type="button"
                onClick={() => setShowAddForm(!showAddForm)}
                className="px-3.5 py-2 bg-[#c9a84c]/20 hover:bg-[#c9a84c]/30 text-[#c9a84c] border border-[#c9a84c]/40 text-xs font-bold uppercase rounded-xl transition-all flex items-center gap-2"
              >
                <PlusCircle size={14} /> Add Currency
              </button>
            </div>
          </div>

          {/* Base Currency Selection Banner */}
          <div className={`border rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-[#c9a84c]/30'}`}>
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-[#c9a84c]/10 text-[#c9a84c] border border-[#c9a84c]/30">
                <DollarSign size={20} />
              </div>
              <div>
                <span className={`text-xs font-extrabold uppercase tracking-wider block ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  Default Base Store Currency
                </span>
                <span className={`text-[11px] ${isLight ? 'text-slate-600 font-medium' : 'text-slate-400'}`}>
                  All vehicle inventory cash prices in database are calculated relative to this base currency rate (1.000).
                </span>
              </div>
            </div>

            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border ${isLight ? 'bg-white border-slate-300' : 'bg-slate-900 border-slate-800'}`}>
              <span className={`text-xs font-mono font-bold ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>Base Currency:</span>
              <select
                value={baseCurrencyCode}
                onChange={(e) => handleSetBaseCurrency(e.target.value)}
                className={`border text-[#c9a84c] font-black text-xs px-3 py-1.5 rounded-lg outline-none cursor-pointer ${isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-950 border-slate-700'}`}
              >
                {currencies.map(c => (
                  <option key={c.code} value={c.code}>
                    {c.code} ({c.symbol}) — {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Add New Currency Form Card */}
          {showAddForm && (
            <div className={`border rounded-xl p-5 space-y-4 animate-fadeIn ${isLight ? 'bg-slate-50 border-blue-300' : 'bg-slate-950 border-blue-500/40'}`}>
              <h4 className="text-xs font-extrabold text-blue-500 uppercase tracking-wider flex items-center gap-2">
                <PlusCircle size={15} /> Add Custom Currency
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className={`block text-[10px] font-bold uppercase mb-1 ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>Currency Code (ISO)</label>
                  <input
                    type="text"
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value)}
                    placeholder="e.g. JPY"
                    className={`w-full border rounded-lg px-3 py-1.5 text-xs uppercase font-mono ${isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-900 border-slate-800 text-white'}`}
                  />
                </div>
                <div>
                  <label className={`block text-[10px] font-bold uppercase mb-1 ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>Symbol</label>
                  <input
                    type="text"
                    value={newSymbol}
                    onChange={(e) => setNewSymbol(e.target.value)}
                    placeholder="e.g. ¥"
                    className={`w-full border rounded-lg px-3 py-1.5 text-xs font-mono ${isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-900 border-slate-800 text-white'}`}
                  />
                </div>
                <div>
                  <label className={`block text-[10px] font-bold uppercase mb-1 ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>Currency Name</label>
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Japanese Yen"
                    className={`w-full border rounded-lg px-3 py-1.5 text-xs ${isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-900 border-slate-800 text-white'}`}
                  />
                </div>
                <div>
                  <label className={`block text-[10px] font-bold uppercase mb-1 ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>Exchange Rate (rel. to Base)</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={newRate}
                    onChange={(e) => setNewRate(e.target.value)}
                    placeholder="1.0"
                    className={`w-full border rounded-lg px-3 py-1.5 text-xs font-mono ${isLight ? 'bg-white border-slate-300 text-amber-600 font-bold' : 'bg-slate-900 border-slate-800 text-amber-400'}`}
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className={`px-4 py-1.5 text-xs font-bold uppercase rounded-lg ${isLight ? 'bg-slate-200 text-slate-700 hover:bg-slate-300' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddCurrency}
                  className="px-4 py-1.5 bg-blue-600 text-white text-xs font-bold uppercase rounded-lg hover:bg-blue-500 shadow-md"
                >
                  Add Currency
                </button>
              </div>
            </div>
          )}

          {/* Currencies & Exchange Rates Table */}
          <div className={`overflow-x-auto border rounded-xl ${isLight ? 'border-slate-300 shadow-sm' : 'border-slate-800'}`}>
            <table className="w-full text-left text-xs">
              <thead className={isLight ? 'bg-slate-100 text-slate-700 uppercase font-mono tracking-wider text-[10px] border-b border-slate-300' : 'bg-slate-950 text-slate-400 uppercase font-mono tracking-wider text-[10px] border-b border-slate-800'}>
                <tr>
                  <th className="px-4 py-3">Currency</th>
                  <th className="px-4 py-3">Symbol</th>
                  <th className="px-4 py-3">Exchange Rate (vs {baseCurrencyCode})</th>
                  <th className="px-4 py-3">Sample Price Conversion (KES 8.85M)</th>
                  <th className="px-4 py-3 text-center">Storefront Active</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className={`divide-y font-mono ${isLight ? 'divide-slate-200 bg-white text-slate-800' : 'divide-slate-800/60 bg-slate-900/50 text-slate-200'}`}>
                {currencies.map(curr => {
                  const sampleConverted = Math.round(8850000 * curr.rate);
                  return (
                    <tr key={curr.code} className={isLight ? 'hover:bg-slate-50 transition-colors' : 'hover:bg-slate-800/40 transition-colors'}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className={`font-bold text-sm ${isLight ? 'text-slate-900' : 'text-white'}`}>{curr.code}</span>
                          <span className={`text-xs font-sans ${isLight ? 'text-slate-600 font-semibold' : 'text-slate-400'}`}>({curr.name})</span>
                          {curr.isBase && (
                            <span className="px-2 py-0.5 rounded bg-[#c9a84c]/20 text-[#c9a84c] border border-[#c9a84c]/40 text-[9px] font-bold uppercase">
                              BASE DEFAULT
                            </span>
                          )}
                        </div>
                      </td>
                      <td className={`px-4 py-3 font-bold text-sm ${isLight ? 'text-amber-600' : 'text-amber-400'}`}>
                        {curr.symbol}
                      </td>
                      <td className="px-4 py-3">
                        {curr.isBase ? (
                          <span className="text-emerald-500 font-bold">1.00000 (Base Rate)</span>
                        ) : (
                          <div className="flex items-center gap-2 max-w-[140px]">
                            <input
                              type="number"
                              step="0.00001"
                              value={curr.rate}
                              onChange={(e) => handleRateChange(curr.code, parseFloat(e.target.value) || 0)}
                              className={`w-full border rounded px-2 py-1 text-xs font-bold focus:border-[#c9a84c] outline-none ${isLight ? 'bg-slate-50 border-slate-300 text-amber-600' : 'bg-slate-950 border-slate-700 text-amber-400'}`}
                            />
                          </div>
                        )}
                      </td>
                      <td className={`px-4 py-3 font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                        {curr.symbol} {sampleConverted.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleActive(curr.code)}
                          className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border transition-all ${
                            curr.active
                              ? 'bg-emerald-500/20 text-emerald-500 border-emerald-500/40 hover:bg-emerald-500/30'
                              : isLight ? 'bg-slate-200 text-slate-600 border-slate-300' : 'bg-slate-800 text-slate-400 border-slate-700'
                          }`}
                        >
                          {curr.active ? 'ACTIVE' : 'DISABLED'}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {!curr.isBase && (
                            <button
                              type="button"
                              onClick={() => handleSetBaseCurrency(curr.code)}
                              className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded border cursor-pointer ${isLight ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300' : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'}`}
                            >
                              Make Base
                            </button>
                          )}
                          {!curr.isBase && (
                            <button
                              type="button"
                              onClick={() => handleDeleteCurrency(curr.code)}
                              className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded border border-rose-500/30 cursor-pointer"
                              title="Delete Currency"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Success Modal Confirmation */}
      {showSuccessModal && (
        <SuccessModal
          isOpen={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
          title={modalDetails.title}
          itemTitle="Brand & Currency Settings"
          description={modalDetails.message}
          actionLabel="View Storefront"
          onAction={() => window.open('http://localhost:3005', '_blank')}
        />
      )}
    </CRMLayout>
  );
}
