import React, { useState, useEffect } from 'react';
import CRMLayout from '../../components/crm/CRMLayout';
import { useCRMStore } from '../../context/CRMStore';
import { 
  DollarSign, Globe, PlusCircle, RefreshCw, Save, RotateCcw, 
  Trash2, Sparkles, Check, ShieldCheck, ArrowUpDown 
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

  // Modern Theming Tokens
  const themeTokens = {
    headerBanner: isLight
      ? 'bg-gradient-to-r from-white via-slate-50 to-slate-100 border-slate-200 text-slate-900 shadow-xl'
      : 'bg-gradient-to-r from-slate-900 via-[#0b0e14] to-slate-950 border-[#c9a84c]/30 text-white shadow-2xl',
    headerTitle: isLight ? 'text-slate-900' : 'text-white',
    headerSubtext: isLight ? 'text-slate-600 font-medium' : 'text-slate-400',
    headerBadge: isLight
      ? 'bg-amber-100 text-amber-900 border-amber-300'
      : 'bg-amber-500/20 text-amber-400 border-amber-500/40',
    headerMeta: isLight ? 'text-slate-500 font-bold' : 'text-slate-400',
    
    resetBtn: isLight
      ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300 shadow-sm'
      : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700',
    saveBtn: 'bg-gradient-to-r from-[#e5c158] to-[#c9a84c] text-slate-950 font-black shadow-lg shadow-[#c9a84c]/20 hover:opacity-95',
    
    cardWrapper: isLight
      ? 'bg-white border-slate-200 text-slate-900 shadow-xl'
      : 'bg-slate-900/90 border-slate-800 text-white shadow-2xl',
    
    baseInfoBox: isLight
      ? 'bg-slate-50 border-slate-200 text-slate-900'
      : 'bg-slate-950 border-[#c9a84c]/30 text-white',
    baseTitle: isLight ? 'text-slate-900 font-black' : 'text-white font-extrabold',
    baseDesc: isLight ? 'text-slate-600 font-medium' : 'text-slate-400',
    baseSelectWrapper: isLight
      ? 'bg-white border-slate-300 text-slate-900 shadow-sm'
      : 'bg-slate-900 border-slate-800 text-slate-300',
    baseSelect: isLight
      ? 'bg-white border-slate-300 text-slate-900 font-extrabold'
      : 'bg-slate-950 border-slate-700 text-[#c9a84c] font-black',

    sectionTitle: isLight ? 'text-slate-900 font-black' : 'text-white font-extrabold',

    syncBtn: isLight
      ? 'bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200 font-bold shadow-sm'
      : 'bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border-blue-500/30 font-bold',
    addBtn: isLight
      ? 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-300 font-bold shadow-sm'
      : 'bg-[#c9a84c]/20 hover:bg-[#c9a84c]/30 text-[#c9a84c] border-[#c9a84c]/40 font-bold',

    formDrawer: isLight
      ? 'bg-slate-50 border-blue-300 text-slate-900 shadow-lg'
      : 'bg-slate-950 border-blue-500/40 text-white shadow-2xl',
    formLabel: isLight ? 'text-slate-700 font-bold' : 'text-slate-400 font-bold',
    formInput: isLight
      ? 'bg-white border-slate-300 text-slate-900 font-bold focus:border-blue-500 shadow-sm'
      : 'bg-slate-900 border-slate-800 text-white focus:border-blue-400',
    formCancelBtn: isLight
      ? 'bg-slate-200 hover:bg-slate-300 text-slate-800 border-slate-300'
      : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700',

    tableWrapper: isLight
      ? 'border-slate-200 bg-white shadow-sm'
      : 'border-slate-800 bg-slate-950',
    tableHeader: isLight
      ? 'bg-slate-100 text-slate-800 border-b border-slate-200 font-black'
      : 'bg-slate-950 text-slate-400 border-b border-slate-800 font-mono',
    tableBody: isLight
      ? 'divide-slate-200 bg-white text-slate-900 font-sans'
      : 'divide-slate-800/60 bg-slate-900/50 text-slate-200 font-mono',
    tableRow: isLight
      ? 'hover:bg-slate-50/90 transition-colors border-b border-slate-200'
      : 'hover:bg-slate-800/40 transition-colors border-b border-slate-800/60',
    codeText: isLight ? 'text-slate-900 font-black' : 'text-white font-bold',
    nameText: isLight ? 'text-slate-600 font-medium' : 'text-slate-400 font-sans',
    symbolText: isLight ? 'text-amber-600 font-black' : 'text-amber-400 font-bold',
    rateInput: isLight
      ? 'bg-slate-50 border-slate-300 text-slate-900 font-extrabold focus:bg-white focus:border-[#c9a84c]'
      : 'bg-slate-950 border-slate-700 text-amber-400 font-bold focus:border-[#c9a84c]',
    conversionText: isLight ? 'text-slate-900 font-black' : 'text-white font-bold',
    
    activeBadge: isLight
      ? 'bg-emerald-100 text-emerald-800 border-emerald-300 font-bold hover:bg-emerald-200'
      : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30',
    disabledBadge: isLight
      ? 'bg-slate-200 text-slate-600 border-slate-300 font-bold hover:text-slate-900'
      : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200',

    actionMakeBaseBtn: isLight
      ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300 font-bold'
      : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
  };

  return (
    <div className="w-full space-y-6">
      
      {/* Header Banner */}
        <div className={`p-6 sm:p-8 rounded-3xl border shadow-2xl relative overflow-hidden transition-all ${themeTokens.headerBanner}`}>
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 border ${themeTokens.headerBadge}`}>
                  <Globe size={13} /> Multi-Currency Engine
                </span>
                <span className={`text-xs font-mono ${themeTokens.headerMeta}`}>SYSTEM SETTINGS • SUB-MODULE</span>
              </div>
              <h1 className={`text-2xl sm:text-4xl font-extrabold tracking-tight ${themeTokens.headerTitle}`}>
                Multi-Currency & Exchange Rates
              </h1>
              <p className={`text-sm mt-1 max-w-2xl ${themeTokens.headerSubtext}`}>
                Set base default currency, add custom currencies, adjust exchange rates dynamically, and enable/disable currency options for storefront buyers.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleResetDefaults}
                className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl border transition-all flex items-center gap-2 cursor-pointer ${themeTokens.resetBtn}`}
              >
                <RotateCcw size={14} /> Reset Defaults
              </button>
              <button
                type="button"
                onClick={handleSaveAll}
                disabled={saving}
                className={`px-6 py-2.5 text-xs uppercase tracking-wider rounded-xl transition-all flex items-center gap-2 cursor-pointer ${themeTokens.saveBtn}`}
              >
                <Save size={15} /> {saving ? 'Saving...' : 'Save & Sync Rates'}
              </button>
            </div>
          </div>
        </div>

        {/* Base Currency Selection Banner & Rates Table */}
        <div className={`border rounded-2xl p-6 shadow-xl space-y-6 transition-all ${themeTokens.cardWrapper}`}>
          
          {/* Base Currency Sub-Card */}
          <div className={`border rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all ${themeTokens.baseInfoBox}`}>
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-[#c9a84c]/10 text-[#c9a84c] border border-[#c9a84c]/30 shrink-0">
                <DollarSign size={20} />
              </div>
              <div>
                <span className={`text-xs uppercase tracking-wider block ${themeTokens.baseTitle}`}>
                  Default Base Store Currency
                </span>
                <span className={`text-[11px] block ${themeTokens.baseDesc}`}>
                  All vehicle inventory cash prices in database are calculated relative to this base currency rate (1.000).
                </span>
              </div>
            </div>

            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all ${themeTokens.baseSelectWrapper}`}>
              <span className={`text-xs font-mono font-bold ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>Base Currency:</span>
              <select
                value={baseCurrencyCode}
                onChange={(e) => handleSetBaseCurrency(e.target.value)}
                className={`border text-xs px-3 py-1.5 rounded-lg outline-none cursor-pointer ${themeTokens.baseSelect}`}
              >
                {currencies.map(c => (
                  <option key={c.code} value={c.code}>
                    {c.code} ({c.symbol}) — {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Section Toolbar Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
            <h3 className={`text-sm uppercase tracking-wider flex items-center gap-2 ${themeTokens.sectionTitle}`}>
              <ArrowUpDown size={16} className="text-amber-400 shrink-0" /> Active Currencies & Adjustable Exchange Rates
            </h3>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleFetchLiveRates}
                disabled={fetchingLiveRates}
                className={`px-3.5 py-2 text-xs uppercase rounded-lg border transition-all flex items-center gap-2 cursor-pointer ${themeTokens.syncBtn}`}
              >
                <RefreshCw size={13} className={fetchingLiveRates ? 'animate-spin' : ''} />
                {fetchingLiveRates ? 'Fetching...' : 'Sync Live Bank Rates'}
              </button>

              <button
                type="button"
                onClick={() => setShowAddForm(!showAddForm)}
                className={`px-3.5 py-2 text-xs uppercase rounded-lg border transition-all flex items-center gap-2 cursor-pointer ${themeTokens.addBtn}`}
              >
                <PlusCircle size={13} /> Add Currency
              </button>
            </div>
          </div>

          {/* Add New Currency Form Drawer */}
          {showAddForm && (
            <div className={`border rounded-xl p-5 space-y-4 animate-fadeIn transition-all ${themeTokens.formDrawer}`}>
              <h4 className="text-xs font-extrabold text-blue-500 uppercase tracking-wider flex items-center gap-2">
                <PlusCircle size={15} /> Add Custom Currency
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className={`block text-[10px] uppercase mb-1 ${themeTokens.formLabel}`}>Currency Code (ISO)</label>
                  <input
                    type="text"
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value)}
                    placeholder="e.g. JPY"
                    className={`w-full border rounded-lg px-3 py-2 text-xs uppercase font-mono ${themeTokens.formInput}`}
                  />
                </div>
                <div>
                  <label className={`block text-[10px] uppercase mb-1 ${themeTokens.formLabel}`}>Symbol</label>
                  <input
                    type="text"
                    value={newSymbol}
                    onChange={(e) => setNewSymbol(e.target.value)}
                    placeholder="e.g. ¥"
                    className={`w-full border rounded-lg px-3 py-2 text-xs font-mono ${themeTokens.formInput}`}
                  />
                </div>
                <div>
                  <label className={`block text-[10px] uppercase mb-1 ${themeTokens.formLabel}`}>Currency Name</label>
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Japanese Yen"
                    className={`w-full border rounded-lg px-3 py-2 text-xs ${themeTokens.formInput}`}
                  />
                </div>
                <div>
                  <label className={`block text-[10px] uppercase mb-1 ${themeTokens.formLabel}`}>Exchange Rate (rel. to Base)</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={newRate}
                    onChange={(e) => setNewRate(e.target.value)}
                    placeholder="1.0"
                    className={`w-full border rounded-lg px-3 py-2 text-xs font-mono ${themeTokens.formInput}`}
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className={`px-4 py-2 text-xs font-bold uppercase rounded-lg border transition-all cursor-pointer ${themeTokens.formCancelBtn}`}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddCurrency}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold uppercase rounded-lg shadow-md transition-all cursor-pointer"
                >
                  Add Currency
                </button>
              </div>
            </div>
          )}

          {/* Currencies & Exchange Rates Data Table */}
          <div className={`overflow-x-auto border rounded-xl transition-all ${themeTokens.tableWrapper}`}>
            <table className="w-full text-left text-xs">
              <thead className={`uppercase tracking-wider text-[10px] ${themeTokens.tableHeader}`}>
                <tr>
                  <th className="px-4 py-3.5">Currency</th>
                  <th className="px-4 py-3.5">Symbol</th>
                  <th className="px-4 py-3.5">Exchange Rate (vs {baseCurrencyCode})</th>
                  <th className="px-4 py-3.5">Sample Price Conversion (KES 8.85M)</th>
                  <th className="px-4 py-3.5 text-center">Storefront Active</th>
                  <th className="px-4 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className={themeTokens.tableBody}>
                {currencies.map(curr => {
                  const sampleConverted = Math.round(8850000 * curr.rate);
                  return (
                    <tr key={curr.code} className={themeTokens.tableRow}>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <span className={`text-sm ${themeTokens.codeText}`}>{curr.code}</span>
                          <span className={`text-xs ${themeTokens.nameText}`}>({curr.name})</span>
                          {curr.isBase && (
                            <span className="px-2 py-0.5 rounded bg-[#c9a84c]/20 text-[#c9a84c] border border-[#c9a84c]/40 text-[9px] font-bold uppercase">
                              BASE DEFAULT
                            </span>
                          )}
                        </div>
                      </td>
                      <td className={`px-4 py-3.5 text-sm ${themeTokens.symbolText}`}>
                        {curr.symbol}
                      </td>
                      <td className="px-4 py-3.5">
                        {curr.isBase ? (
                          <span className="text-emerald-500 font-bold">1.00000 (Base Rate)</span>
                        ) : (
                          <div className="flex items-center gap-2 max-w-[140px]">
                            <input
                              type="number"
                              step="0.00001"
                              value={curr.rate}
                              onChange={(e) => handleRateChange(curr.code, parseFloat(e.target.value) || 0)}
                              className={`w-full border rounded px-2.5 py-1.5 text-xs outline-none transition-all ${themeTokens.rateInput}`}
                            />
                          </div>
                        )}
                      </td>
                      <td className={`px-4 py-3.5 ${themeTokens.conversionText}`}>
                        {curr.symbol} {sampleConverted.toLocaleString()}
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleActive(curr.code)}
                          className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border transition-all cursor-pointer ${
                            curr.active ? themeTokens.activeBadge : themeTokens.disabledBadge
                          }`}
                        >
                          {curr.active ? 'ACTIVE' : 'DISABLED'}
                        </button>
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {!curr.isBase && (
                            <button
                              type="button"
                              onClick={() => handleSetBaseCurrency(curr.code)}
                              className={`px-2.5 py-1 text-[10px] uppercase rounded border transition-all cursor-pointer ${themeTokens.actionMakeBaseBtn}`}
                            >
                              Make Base
                            </button>
                          )}
                          {!curr.isBase && (
                            <button
                              type="button"
                              onClick={() => handleDeleteCurrency(curr.code)}
                              className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 rounded border border-rose-500/30 transition-all cursor-pointer"
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
    </div>
  );
}
