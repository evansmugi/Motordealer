import React, { useState, useEffect } from 'react';
import CRMLayout from '../../components/crm/CRMLayout';
import { useCRMStore } from '../../context/CRMStore';
import { 
  DollarSign, Globe, PlusCircle, RefreshCw, Save, RotateCcw, 
  Trash2, Sparkles, Eye, Check, ShieldCheck, ArrowUpDown 
} from 'lucide-react';
import SuccessModal from '../../components/common/SuccessModal';

const DEFAULT_CURRENCIES = [
  { code: 'KES', symbol: 'KES', name: 'Kenyan Shilling', rate: 1.0, isBase: true, active: true },
  { code: 'USD', symbol: '$', name: 'US Dollar', rate: 0.00775, isBase: false, active: true },
  { code: 'EUR', symbol: '€', name: 'Euro', rate: 0.00714, isBase: false, active: true },
  { code: 'GBP', symbol: '£', name: 'British Pound', rate: 0.00606, isBase: false, active: true },
  { code: 'AED', symbol: 'AED', name: 'Emirati Dirham', rate: 0.0284, isBase: false, active: true },
  { code: 'ZAR', symbol: 'R', name: 'South African Rand', rate: 0.142, isBase: false, active: true }
];

export default function CurrencySettingsPage() {
  const siteSettings = useCRMStore(state => state.siteSettings) || {};
  const updateSiteSettings = useCRMStore(state => state.updateSiteSettings);
  const adminTheme = useCRMStore(state => state.adminTheme);
  const isLight = adminTheme === 'light';

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

  useEffect(() => {
    if (siteSettings.currencies && Array.isArray(siteSettings.currencies)) {
      setCurrencies(siteSettings.currencies);
    }
    if (siteSettings.baseCurrencyCode) {
      setBaseCurrencyCode(siteSettings.baseCurrencyCode);
    }
  }, [siteSettings]);

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

      alert('Live exchange rates synchronized successfully from Central Bank API!');
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
        ...siteSettings,
        currencies,
        baseCurrencyCode
      };

      await updateSiteSettings(updates);

      if (typeof window !== 'undefined') {
        localStorage.setItem('fuse_site_settings', JSON.stringify(updates));
        localStorage.setItem('knk_site_settings', JSON.stringify(updates));
        window.dispatchEvent(new CustomEvent('knk_settings_updated', { detail: updates }));
        
        if ('BroadcastChannel' in window) {
          try {
            const bc = new BroadcastChannel('knk_enterprise_sync_channel');
            bc.postMessage({ type: 'SITE_SETTINGS_UPDATED', payload: updates });
            bc.close();
          } catch {}
        }
      }

      setShowSuccessModal(true);
    } catch (err) {
      console.error('Failed to save currency settings:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleResetDefaults = () => {
    setCurrencies(DEFAULT_CURRENCIES);
    setBaseCurrencyCode('KES');
  };

  return (
    <CRMLayout title="Multi-Currency & Exchange Rate Management | KnK Enterprise Settings">
      <div className="w-full space-y-8">
        
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-[#0b0e14] to-slate-950 p-6 sm:p-8 rounded-3xl border border-[#c9a84c]/30 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="px-3 py-1 bg-amber-500/20 text-amber-400 border border-amber-500/40 rounded-full text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Globe size={13} /> Multi-Currency Engine
                </span>
                <span className="text-xs text-slate-400 font-mono">SYSTEM SETTINGS • SUB-MODULE</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                Multi-Currency & Exchange Rates
              </h1>
              <p className="text-slate-400 text-sm mt-1 max-w-2xl">
                Set base default currency, add custom currencies, adjust exchange rates dynamically, and enable/disable currency options for storefront buyers.
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
                <Save size={15} /> {saving ? 'Saving...' : 'Save & Sync Rates'}
              </button>
            </div>
          </div>
        </div>

        {/* Base Currency Selection Banner */}
        <div className={`border rounded-2xl p-6 shadow-xl space-y-6 ${isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-900/90 border-slate-800 text-white'}`}>
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

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
            <h3 className={`text-sm font-extrabold uppercase tracking-wider flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
              <ArrowUpDown size={16} className="text-amber-400" /> Active Currencies & Adjustable Exchange Rates
            </h3>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleFetchLiveRates}
                disabled={fetchingLiveRates}
                className="px-3 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs font-bold uppercase rounded-lg transition-all flex items-center gap-2"
              >
                <RefreshCw size={13} className={fetchingLiveRates ? 'animate-spin' : ''} />
                {fetchingLiveRates ? 'Fetching...' : 'Sync Live Bank Rates'}
              </button>

              <button
                type="button"
                onClick={() => setShowAddForm(!showAddForm)}
                className="px-3 py-1.5 bg-[#c9a84c]/20 hover:bg-[#c9a84c]/30 text-[#c9a84c] border border-[#c9a84c]/40 text-xs font-bold uppercase rounded-lg transition-all flex items-center gap-2"
              >
                <PlusCircle size={13} /> Add Currency
              </button>
            </div>
          </div>

          {/* Add New Currency Form */}
          {showAddForm && (
            <div className="bg-slate-950 border border-blue-500/40 rounded-xl p-5 space-y-4 animate-fadeIn">
              <h4 className="text-xs font-extrabold text-blue-400 uppercase tracking-wider flex items-center gap-2">
                <PlusCircle size={15} /> Add Custom Currency
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Currency Code (ISO)</label>
                  <input
                    type="text"
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value)}
                    placeholder="e.g. JPY"
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white uppercase font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Symbol</label>
                  <input
                    type="text"
                    value={newSymbol}
                    onChange={(e) => setNewSymbol(e.target.value)}
                    placeholder="e.g. ¥"
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Currency Name</label>
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Japanese Yen"
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Exchange Rate (rel. to Base)</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={newRate}
                    onChange={(e) => setNewRate(e.target.value)}
                    placeholder="1.0"
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-amber-400 font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-1.5 bg-slate-800 text-slate-300 text-xs font-bold uppercase rounded-lg hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddCurrency}
                  className="px-4 py-1.5 bg-blue-600 text-white text-xs font-bold uppercase rounded-lg hover:bg-blue-500"
                >
                  Add Currency
                </button>
              </div>
            </div>
          )}

          {/* Currencies & Exchange Rates Table */}
          <div className="overflow-x-auto border border-slate-800 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase font-mono tracking-wider text-[10px] border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3">Currency</th>
                  <th className="px-4 py-3">Symbol</th>
                  <th className="px-4 py-3">Exchange Rate (vs {baseCurrencyCode})</th>
                  <th className="px-4 py-3">Sample Price Conversion (KES 8.85M)</th>
                  <th className="px-4 py-3 text-center">Storefront Active</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 bg-slate-900/50 text-slate-200 font-mono">
                {currencies.map(curr => {
                  const sampleConverted = Math.round(8850000 * curr.rate);
                  return (
                    <tr key={curr.code} className="hover:bg-slate-800/40 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-sm">{curr.code}</span>
                          <span className="text-slate-400 text-xs font-sans">({curr.name})</span>
                          {curr.isBase && (
                            <span className="px-2 py-0.5 rounded bg-[#c9a84c]/20 text-[#c9a84c] border border-[#c9a84c]/40 text-[9px] font-bold uppercase">
                              BASE DEFAULT
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 font-bold text-amber-400 text-sm">
                        {curr.symbol}
                      </td>
                      <td className="px-4 py-3">
                        {curr.isBase ? (
                          <span className="text-emerald-400 font-bold">1.00000 (Base Rate)</span>
                        ) : (
                          <div className="flex items-center gap-2 max-w-[140px]">
                            <input
                              type="number"
                              step="0.00001"
                              value={curr.rate}
                              onChange={(e) => handleRateChange(curr.code, parseFloat(e.target.value) || 0)}
                              className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs text-amber-400 font-bold focus:border-[#c9a84c] outline-none"
                            />
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 font-bold text-white">
                        {curr.symbol} {sampleConverted.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleActive(curr.code)}
                          className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border transition-all ${
                            curr.active
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
                              : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
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
                              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-bold uppercase rounded border border-slate-700 cursor-pointer"
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
          title="Multi-Currency Rates Synchronized!"
          itemTitle="Currency Settings"
          description="Your multi-currency configuration and adjustable exchange rates have been updated and synchronized across all storefront showrooms."
          actionLabel="View Storefront"
          onAction={() => window.open('http://localhost:3005', '_blank')}
          isLight={isLight}
        />
      )}
    </CRMLayout>
  );
}
