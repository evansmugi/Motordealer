import React, { useState, useEffect, useMemo } from 'react'
import { useCRMStore } from '../../context/CRMStore'
import ActionTooltip from '../../components/common/ActionTooltip'
import { api } from '../../lib/apiClient'
import {
  Sliders, Sparkles, CheckCircle2, AlertTriangle, RotateCcw,
  Save, Zap, Flame, ShieldAlert, Award, Calendar, RefreshCw,
  Eye, MessageSquare, FileText, Download, PlayCircle, Clock, UploadCloud,
  X, Lock, ShieldCheck, UserCheck
} from 'lucide-react'

const DEFAULT_CONFIG = {
  weights: {
    booking_appointment: 5,
    showed_up_viewing: 15,
    tradein_photos: 15,
    buying_timeline: 15,
    form_submitted: 10,
    video_watch_high: 10,
    video_watch_med: 5,
    vehicle_views: 5,
    return_visit: 5,
    whatsapp_click: 5,
    similar_time: 4,
    photo_download: 3,
    blog_view: 3,
    inactivity_decay: -15
  },
  thresholds: {
    high: 75,
    medium: 45
  }
}

const CRITERIA_METADATA = [
  { key: 'booking_appointment', label: 'Lead Booking Appointment', category: 'Conversion', icon: Calendar, desc: 'Client scheduled a viewing or test drive appointment slot.', defaultPts: 5 },
  { key: 'showed_up_viewing', label: 'Lead Showing Up for Vehicle Viewing', category: 'Conversion', icon: UserCheck, desc: 'Client physically attended their scheduled vehicle viewing or test drive.', defaultPts: 15 },
  { key: 'tradein_photos', label: 'Trade-In Appraisal & Photos Uploaded', category: 'Conversion', icon: UploadCloud, desc: 'Client visited trade-in page & uploaded vehicle appraisal photos.', defaultPts: 15 },
  { key: 'buying_timeline', label: 'Buying Timeline < 30 Days', category: 'Intent', icon: Flame, desc: 'Stated purchase intent within the next 30 days.', defaultPts: 15 },
  { key: 'form_submitted', label: 'Inquiry Form Filled & Submitted', category: 'Conversion', icon: FileText, desc: 'Filled out test drive, quote, or vehicle inquiry form.', defaultPts: 10 },
  { key: 'video_watch_high', label: 'Video Sequence Watched (≥ 75%)', category: 'Engagement', icon: PlayCircle, desc: 'Watched 75%+ of vehicle YouTube walkthrough video.', defaultPts: 10 },
  { key: 'video_watch_med', label: 'Moderate Video Watched (50–74%)', category: 'Engagement', icon: PlayCircle, desc: 'Watched 50% to 74% of vehicle YouTube video.', defaultPts: 5 },
  { key: 'vehicle_views', label: 'Vehicle Detail Pages Viewed (≥ 4)', category: 'Engagement', icon: Eye, desc: 'Explored 4 or more distinct vehicle listing pages in a session.', defaultPts: 5 },
  { key: 'return_visit', label: 'Return Visit within 7 Days', category: 'Retention', icon: RefreshCw, desc: 'Client returned to site within a 7-day window.', defaultPts: 5 },
  { key: 'whatsapp_click', label: 'WhatsApp Chat Initiated', category: 'Engagement', icon: MessageSquare, desc: 'Clicked wa.me or floating WhatsApp button.', defaultPts: 5 },
  { key: 'similar_time', label: 'Time Spent on Similar Models (≥ 3 min)', category: 'Content', icon: Clock, desc: 'Spent 3+ minutes browsing similar vehicle specs.', defaultPts: 4 },
  { key: 'photo_download', label: 'High-Res Photo Download / Share', category: 'Content', icon: Download, desc: 'Downloaded or shared high-res vehicle gallery photos.', defaultPts: 3 },
  { key: 'blog_view', label: 'Vehicle Blog Articles Read', category: 'Content', icon: FileText, desc: 'Read car buying guide or vehicle comparison blog.', defaultPts: 3 },
  { key: 'inactivity_decay', label: 'Inactivity Penalty (> 14 Days)', category: 'Decay', icon: AlertTriangle, desc: 'Deducted when lead has zero interactions for 14+ days.', defaultPts: -15, isPenalty: true }
]

export default function ScoringRulesPage() {
  const adminTheme = useCRMStore(state => state.adminTheme)
  const isLight = adminTheme === 'light'
  const leads = useCRMStore(state => state.leads)

  const [weights, setWeights] = useState(DEFAULT_CONFIG.weights)
  const [thresholds, setThresholds] = useState(DEFAULT_CONFIG.thresholds)
  const [cronIntervalMs, setCronIntervalMs] = useState(3600000) // Default: 1 Hour (3,600,000 ms)
  const [isSaving, setIsSaving] = useState(false)
  const [isRecalculating, setIsRecalculating] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [pendingAction, setPendingAction] = useState(null) // 'save' | 'recalculate'
  const [savedWeights, setSavedWeights] = useState(DEFAULT_CONFIG.weights) // track last-saved for diff

  // Load existing rules from API on mount (normalize to 100 if stored rules exceed 100)
  useEffect(() => {
    api.get('/crm/scoring-rules')
      .then(res => {
        if (res && res.weights) {
          const sum = Object.entries(res.weights)
            .filter(([k, v]) => k !== 'inactivity_decay' && v > 0)
            .reduce((acc, [, v]) => acc + (Number(v) || 0), 0)
          if (sum > 100) {
            setWeights(DEFAULT_CONFIG.weights)
            setSavedWeights(DEFAULT_CONFIG.weights)
          } else {
            setWeights(res.weights)
            setSavedWeights(res.weights)
          }
        }
        if (res && res.thresholds) setThresholds(res.thresholds)
        if (res && res.cronIntervalMs) setCronIntervalMs(Number(res.cronIntervalMs))
      })
      .catch(() => null)
  }, [])

  // Calculate Total Positive Weight (excluding penalties)
  const totalPositiveWeight = useMemo(() => {
    return Object.entries(weights)
      .filter(([key, val]) => key !== 'inactivity_decay' && val > 0)
      .reduce((sum, [, val]) => sum + (Number(val) || 0), 0)
  }, [weights])

  const isOverLimit = totalPositiveWeight > 100
  const isExact100 = totalPositiveWeight === 100

  const handleWeightChange = (key, value) => {
    const val = Number(value)
    setWeights(prev => ({
      ...prev,
      [key]: isNaN(val) ? 0 : val
    }))
    setSaveSuccess(false)
  }

  // Compute changed weights for the confirmation modal diff
  const changedWeights = useMemo(() => {
    return CRITERIA_METADATA.filter(m => {
      const oldVal = savedWeights[m.key] ?? m.defaultPts
      const newVal = weights[m.key] ?? m.defaultPts
      return oldVal !== newVal
    }).map(m => ({
      label: m.label,
      key: m.key,
      oldVal: savedWeights[m.key] ?? m.defaultPts,
      newVal: weights[m.key] ?? m.defaultPts
    }))
  }, [weights, savedWeights])

  // Open confirmation modal instead of saving directly
  const requestSave = () => {
    if (isOverLimit) return
    setPendingAction('save')
    setShowConfirmModal(true)
  }

  const requestRecalculate = () => {
    if (isOverLimit) return
    setPendingAction('recalculate')
    setShowConfirmModal(true)
  }

  const setScoringRules = useCRMStore(state => state.setScoringRules)
  const recalculateAllLeads = useCRMStore(state => state.recalculateAllLeads)

  // Actual save (called after modal confirmation)
  const handleSaveConfig = async () => {
    if (isOverLimit) return
    setShowConfirmModal(false)
    setIsSaving(true)
    try {
      setScoringRules(weights, thresholds)
      setSavedWeights({ ...weights })
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (e) {
      console.error('Failed to save scoring rules:', e)
    } finally {
      setIsSaving(false)
    }
  }

  const handleResetDefaults = () => {
    setWeights(DEFAULT_CONFIG.weights)
    setThresholds(DEFAULT_CONFIG.thresholds)
    setCronIntervalMs(3600000)
    setSaveSuccess(false)
  }

  // Actual recalculate (called after modal confirmation)
  const handleRecalculateAll = async () => {
    setShowConfirmModal(false)
    setIsRecalculating(true)
    try {
      setScoringRules(weights, thresholds)
      setSavedWeights({ ...weights })
      recalculateAllLeads()
      setSaveSuccess(true)
    } catch (e) {
      console.error('Bulk recalculation failed:', e)
    } finally {
      setIsRecalculating(false)
    }
  }

  const handleConfirmAction = () => {
    if (pendingAction === 'save') handleSaveConfig()
    else if (pendingAction === 'recalculate') handleRecalculateAll()
  }

  return (
    <div className="space-y-6 font-sans">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] tracking-[4px] uppercase text-[#c9a84c] font-semibold block">
            Intent Scoring Rules &amp; Weight Matrix
          </span>
          <h1 className={`text-3xl font-serif font-light mt-1 ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
            Lead Scoring Weight Configuration
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3 font-mono">
          <button
            onClick={handleResetDefaults}
            className={`px-3.5 py-2.5 rounded-xl text-xs uppercase font-bold tracking-wider border flex items-center gap-2 transition-all cursor-pointer ${
              isLight ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100' : 'bg-slate-900 border-white/10 text-slate-400 hover:text-white'
            }`}
          >
            <RotateCcw size={14} />
            <span>Reset Defaults</span>
          </button>

          <button
            onClick={requestRecalculate}
            disabled={isRecalculating || isOverLimit}
            className={`px-4 py-2.5 rounded-xl text-xs uppercase font-bold tracking-wider border flex items-center gap-2 transition-all cursor-pointer ${
              isLight
                ? 'bg-blue-50 border-blue-300 text-blue-800 hover:bg-blue-100'
                : 'bg-blue-500/10 border-blue-500/30 text-blue-300 hover:bg-blue-500/20'
            } ${isRecalculating ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <RefreshCw size={14} className={isRecalculating ? 'animate-spin' : ''} />
            <span>{isRecalculating ? 'Recalculating...' : 'Recalculate All Leads'}</span>
          </button>

          <button
            onClick={requestSave}
            disabled={isSaving || isOverLimit}
            className={`px-5 py-2.5 rounded-xl text-xs uppercase font-bold tracking-wider flex items-center gap-2 shadow-lg transition-all cursor-pointer ${
              isOverLimit
                ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                : saveSuccess
                ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'
                : 'bg-[#c9a84c] text-slate-950 hover:bg-[#d9b85c] shadow-[#c9a84c]/20'
            }`}
          >
            {saveSuccess ? <CheckCircle2 size={16} /> : <Save size={16} />}
            <span>{isSaving ? 'Saving...' : saveSuccess ? 'Weights Saved!' : 'Save & Apply Weights'}</span>
          </button>
        </div>
      </div>

      {/* 🔴 MANDATORY WEIGHT TOTAL VALIDATION CARD (POPS AUTOMATICALLY ON OVERFLOW BEFORE SAVING) */}
      <div className={`p-6 rounded-3xl border-2 transition-all duration-300 relative overflow-hidden ${
        isOverLimit
          ? isLight
            ? 'bg-rose-50 border-rose-500 text-rose-950 ring-4 ring-rose-400/40 shadow-[0_0_40px_rgba(244,63,94,0.3)] animate-pulse'
            : 'bg-rose-950/60 border-rose-500 text-rose-200 ring-4 ring-rose-500/50 shadow-[0_0_50px_rgba(244,63,94,0.4)] animate-pulse'
          : isExact100
          ? isLight ? 'bg-emerald-50/80 border-emerald-400 text-emerald-950' : 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
          : isLight ? 'bg-amber-50/80 border-amber-400 text-amber-950' : 'bg-amber-950/40 border-amber-500/50 text-amber-200'
      }`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className={`text-[10px] tracking-[3px] uppercase font-bold font-mono px-2.5 py-0.5 rounded border ${
                isOverLimit
                  ? 'bg-rose-500 text-white border-rose-600 animate-bounce'
                  : isExact100
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                  : 'bg-amber-500/20 text-amber-400 border-amber-500/40'
              }`}>
                Weight Balance Audit
              </span>
              {isOverLimit ? (
                <span className="text-xs font-mono font-bold text-rose-500 dark:text-rose-400 flex items-center gap-1">
                  <AlertTriangle size={15} className="animate-spin" /> 🚨 ALLOCATION OVERFLOW WARNING!
                </span>
              ) : isExact100 ? (
                <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 size={14} /> OPTIMAL BALANCE (100 PTS)
                </span>
              ) : (
                <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                  <Zap size={14} /> {100 - totalPositiveWeight} POINTS REMAINING
                </span>
              )}
            </div>

            <h3 className="text-xl font-serif font-bold">
              Total Allocation: <span className={`font-mono text-2xl font-bold ${isOverLimit ? 'text-rose-600 dark:text-rose-400' : ''}`}>{totalPositiveWeight} / 100 Points</span>
            </h3>

            <p className="text-xs max-w-2xl leading-relaxed">
              {isOverLimit
                ? 'CRITICAL WARNING: The total allocated positive weights exceed the 100-point maximum capacity limit! Please adjust your criterion weights so that positive criteria sum to 100 points or less before saving.'
                : isExact100
                ? 'PERFECT CAPACITY: Your positive criteria weights sum to exactly 100 points. The scoring engine is perfectly calibrated for 0–100% intent scores.'
                : `CAPACITY AVAILABLE: You have allocated ${totalPositiveWeight} points out of 100 maximum points. You can add ${100 - totalPositiveWeight} more points across your active criteria.`}
            </p>
          </div>

          {/* Visual Progress Bar */}
          <div className="w-full lg:w-72 space-y-2 font-mono">
            <div className="flex justify-between text-xs font-bold">
              <span>Accumulated Points:</span>
              <span className={isOverLimit ? 'text-rose-400' : isExact100 ? 'text-emerald-400' : 'text-amber-400'}>
                {totalPositiveWeight} / 100 Pts
              </span>
            </div>
            <div className="w-full h-3 rounded-full bg-slate-900/40 overflow-hidden border border-white/10 p-0.5">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  isOverLimit
                    ? 'bg-rose-500 animate-pulse'
                    : isExact100
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                    : 'bg-gradient-to-r from-amber-500 to-yellow-400'
                }`}
                style={{ width: `${Math.min(100, (totalPositiveWeight / 100) * 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Threshold Tier Configuration */}
      <div className={`p-6 rounded-3xl border transition-all duration-300 space-y-4 ${
        isLight ? 'bg-white border-slate-200 shadow-xl' : 'bg-[#0f172a]/80 border-white/10 shadow-2xl'
      }`}>
        <div className="flex items-center gap-2 border-b pb-3 border-white/10">
          <Award size={18} className="text-[#c9a84c]" />
          <h3 className={`text-lg font-serif font-bold ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
            Buyer Qualification Tiers
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono">
          <div className={`p-4 rounded-2xl border space-y-2 ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/60 border-white/10'}`}>
            <div className="flex justify-between items-center">
              <label className="text-xs uppercase font-bold text-emerald-400 flex items-center gap-1.5">
                <Flame size={14} /> 🔥 High-Possibility Buyer Threshold (≥ %)
              </label>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30">
                {thresholds.high}% +
              </span>
            </div>
            <input
              type="range"
              min="50"
              max="95"
              value={thresholds.high}
              onChange={e => setThresholds({ ...thresholds, high: Number(e.target.value) })}
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <p className="text-[11px] text-slate-400 font-sans">
              Leads scoring at or above {thresholds.high}% are flagged as High Possibility and receive instant sales hotline alerts.
            </p>
          </div>

          <div className={`p-4 rounded-2xl border space-y-2 ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/60 border-white/10'}`}>
            <div className="flex justify-between items-center">
              <label className="text-xs uppercase font-bold text-amber-400 flex items-center gap-1.5">
                <Zap size={14} /> ⚡ Medium-Possibility Buyer Threshold (≥ %)
              </label>
              <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 text-xs font-bold border border-amber-500/30">
                {thresholds.medium}% - {thresholds.high - 1}%
              </span>
            </div>
            <input
              type="range"
              min="20"
              max="65"
              value={thresholds.medium}
              onChange={e => setThresholds({ ...thresholds, medium: Number(e.target.value) })}
              className="w-full accent-amber-500 cursor-pointer"
            />
            <p className="text-[11px] text-slate-400 font-sans">
              Leads scoring between {thresholds.medium}% and {thresholds.high - 1}% receive regular rep assignment and automated WhatsApp brochures.
            </p>
          </div>
        </div>
      </div>

      {/* ⏱️ AUTOMATED BACKGROUND RECALCULATION TIMEFRAME (AUTO-SYNC DAEMON) */}
      <div className={`p-6 rounded-3xl border transition-all duration-300 space-y-4 ${
        isLight ? 'bg-white border-slate-200 shadow-xl' : 'bg-[#0f172a]/80 border-white/10 shadow-2xl'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b pb-3 border-white/10">
          <div className="flex items-center gap-2">
            <Clock size={18} className="text-[#c9a84c]" />
            <div>
              <h3 className={`text-lg font-serif font-bold ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                Background Recalculation Timeframe (Auto-Sync)
              </h3>
              <p className="text-xs text-slate-400 font-sans">
                Set how frequently the server automatically recalculates "Conversion Chance %" across all active leads in the background.
              </p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full bg-[#c9a84c]/20 text-[#c9a84c] border border-[#c9a84c]/30 text-xs font-mono font-bold self-start md:self-auto">
            Current Schedule: Every {
              cronIntervalMs === 900000 ? '15 Minutes' :
              cronIntervalMs === 1800000 ? '30 Minutes' :
              cronIntervalMs === 3600000 ? '1 Hour (Default)' :
              cronIntervalMs === 10800000 ? '3 Hours' :
              cronIntervalMs === 21600000 ? '6 Hours' :
              cronIntervalMs === 43200000 ? '12 Hours' :
              cronIntervalMs === 86400000 ? '24 Hours' :
              `${Math.round(cronIntervalMs / 60000)} Minutes`
            }
          </span>
        </div>

        <div className="space-y-3 font-mono">
          <label className="text-xs uppercase font-bold text-slate-400 block">
            Select Preset Recalculation Interval:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
            {[
              { label: '15 Mins', ms: 900000 },
              { label: '30 Mins', ms: 1800000 },
              { label: '1 Hour', ms: 3600000, tag: 'Default' },
              { label: '3 Hours', ms: 10800000 },
              { label: '6 Hours', ms: 21600000 },
              { label: '12 Hours', ms: 43200000 },
              { label: '24 Hours', ms: 86400000 }
            ].map(preset => {
              const isSelected = cronIntervalMs === preset.ms
              return (
                <button
                  key={preset.ms}
                  type="button"
                  onClick={() => setCronIntervalMs(preset.ms)}
                  className={`p-3 rounded-2xl border text-xs font-bold transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                    isSelected
                      ? 'bg-gradient-to-r from-[#c9a84c] to-[#d9b85c] text-slate-950 border-[#c9a84c] shadow-lg shadow-[#c9a84c]/20 scale-105'
                      : isLight
                      ? 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
                      : 'bg-slate-950/60 border-white/10 text-slate-300 hover:bg-white/10 hover:border-white/20'
                  }`}
                >
                  <span>{preset.label}</span>
                  {preset.tag && (
                    <span className={`text-[9px] px-1.5 py-0.2 rounded uppercase font-extrabold tracking-wider ${
                      isSelected ? 'bg-slate-950 text-[#c9a84c]' : 'bg-[#c9a84c]/20 text-[#c9a84c]'
                    }`}>
                      {preset.tag}
                    </span>
                  )}
                </button>
              )
            })}
          </div>

          <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs ${
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/40 border-white/10'
          }`}>
            <span className="text-slate-400 font-sans">
              ℹ️ Continuous manual sync via the <strong className={isLight ? 'text-slate-800' : 'text-white'}>Leads &amp; Clients page sync button</strong> remains available anytime in addition to this schedule.
            </span>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-slate-400">Custom (Mins):</span>
              <input
                type="number"
                min="1"
                max="1440"
                value={Math.round(cronIntervalMs / 60000)}
                onChange={e => {
                  const mins = Math.max(1, Number(e.target.value) || 1)
                  setCronIntervalMs(mins * 60000)
                }}
                className={`w-20 text-center border rounded-xl py-1.5 text-xs font-bold outline-none ${
                  isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-900 border-white/10 text-slate-100'
                }`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 12 Criteria Weight Grid */}
      <div className={`p-6 rounded-3xl border transition-all duration-300 space-y-5 ${
        isLight ? 'bg-white border-slate-200 shadow-xl' : 'bg-[#0f172a]/80 border-white/10 shadow-2xl'
      }`}>
        <div className="flex items-center justify-between border-b pb-4 border-white/10">
          <div>
            <span className="text-[10px] tracking-[3px] uppercase text-[#c9a84c] font-bold block mb-1">
              Custom Criteria Matrix
            </span>
            <h3 className={`text-xl font-serif font-bold ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
              12 Lead Scoring Criteria &amp; Weight Modifiers
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-400">13 Active Factors</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {CRITERIA_METADATA.map((meta, index) => {
            const Icon = meta.icon
            const currentWeight = weights[meta.key] !== undefined ? weights[meta.key] : meta.defaultPts

            return (
              <div
                key={meta.key}
                className={`p-5 rounded-2xl border transition-all duration-300 space-y-3 relative group ${
                  meta.isPenalty
                    ? isLight ? 'bg-rose-50/50 border-rose-200' : 'bg-rose-950/20 border-rose-500/30'
                    : isLight ? 'bg-slate-50 border-slate-200 hover:border-slate-300' : 'bg-slate-950/60 border-white/10 hover:border-[#c9a84c]/40'
                }`}
              >
                {/* Category Pill & Index */}
                <div className="flex items-center justify-between font-mono">
                  <span className={`text-[9px] uppercase tracking-wider px-2 py-0.5 rounded font-bold border ${
                    meta.isPenalty
                      ? 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                      : 'bg-[#c9a84c]/20 text-[#c9a84c] border border-[#c9a84c]/30'
                  }`}>
                    #{index + 1} • {meta.category}
                  </span>

                  <span className={`text-xs font-bold ${
                    meta.isPenalty
                      ? 'text-rose-400'
                      : currentWeight > 0 ? 'text-emerald-400' : 'text-slate-400'
                  }`}>
                    {currentWeight > 0 ? `+${currentWeight}` : currentWeight} Pts
                  </span>
                </div>

                {/* Criterion Title */}
                <div className="flex items-start gap-2.5">
                  <div className={`p-2 rounded-xl border flex-shrink-0 ${
                    meta.isPenalty
                      ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                      : 'bg-[#c9a84c]/10 text-[#c9a84c] border border-[#c9a84c]/30'
                  }`}>
                    <Icon size={16} />
                  </div>
                  <div>
                    <h4 className={`text-sm font-semibold leading-tight font-serif ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                      {meta.label}
                    </h4>
                    <p className={`text-xs mt-1 line-clamp-2 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                      {meta.desc}
                    </p>
                  </div>
                </div>

                {/* Interactive Slider & Stepper Inputs */}
                <div className="pt-2 border-t border-white/10 space-y-2 font-mono">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[11px] text-slate-400">Points Weight:</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleWeightChange(meta.key, currentWeight - (meta.isPenalty ? -1 : 1))}
                        className={`w-7 h-7 rounded-lg border text-xs font-bold flex items-center justify-center transition-all ${
                          isLight ? 'bg-slate-200 border-slate-300 text-slate-800 hover:bg-slate-300' : 'bg-slate-800 border-white/10 text-slate-200 hover:bg-slate-700'
                        }`}
                      >
                        -
                      </button>
                      <input
                        type="number"
                        value={currentWeight}
                        onChange={e => handleWeightChange(meta.key, e.target.value)}
                        className={`w-16 text-center border rounded-lg py-1 text-xs font-bold outline-none ${
                          meta.isPenalty
                            ? 'bg-rose-500/10 border-rose-500/40 text-rose-300'
                            : isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-900 border-white/10 text-slate-100'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => handleWeightChange(meta.key, currentWeight + (meta.isPenalty ? -1 : 1))}
                        className={`w-7 h-7 rounded-lg border text-xs font-bold flex items-center justify-center transition-all ${
                          isLight ? 'bg-slate-200 border-slate-300 text-slate-800 hover:bg-slate-300' : 'bg-slate-800 border-white/10 text-slate-200 hover:bg-slate-700'
                        }`}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <input
                    type="range"
                    min={meta.isPenalty ? -50 : 0}
                    max={meta.isPenalty ? 0 : 50}
                    value={currentWeight}
                    onChange={e => handleWeightChange(meta.key, e.target.value)}
                    className={`w-full cursor-pointer ${meta.isPenalty ? 'accent-rose-500' : 'accent-[#c9a84c]'}`}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          🔐 SENSITIVE CHANGE CONFIRMATION MODAL
          ═══════════════════════════════════════════════════════════ */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" onClick={() => setShowConfirmModal(false)}>
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

          {/* Modal Card */}
          <div
            className={`relative w-full max-w-lg rounded-3xl border-2 shadow-2xl overflow-hidden ${
              isLight
                ? 'bg-white border-amber-300 shadow-amber-200/30'
                : 'bg-[#0c1222] border-amber-500/40 shadow-amber-500/10'
            }`}
            onClick={e => e.stopPropagation()}
            style={{ animation: 'modalSlideIn 0.25s ease-out' }}
          >
            {/* Hazard Header Bar */}
            <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                  <ShieldAlert size={22} className="text-white" />
                </div>
                <div>
                  <h2 className="text-white font-serif font-bold text-lg leading-tight">
                    {pendingAction === 'recalculate' ? 'Recalculate All Lead Scores?' : 'Apply Weight Changes?'}
                  </h2>
                  <span className="text-white/80 text-[10px] tracking-[3px] uppercase font-mono font-bold">
                    Sensitive System Change
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowConfirmModal(false)}
                className="p-1.5 rounded-lg bg-white/20 text-white hover:bg-white/30 transition-all cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-5 space-y-4">
              {/* Warning Callout */}
              <div className={`p-4 rounded-2xl border flex items-start gap-3 ${
                isLight
                  ? 'bg-amber-50 border-amber-200 text-amber-900'
                  : 'bg-amber-950/30 border-amber-500/30 text-amber-200'
              }`}>
                <AlertTriangle size={20} className="text-amber-500 flex-shrink-0 mt-0.5" />
                <div className="text-xs leading-relaxed space-y-1">
                  <p className="font-bold">
                    {pendingAction === 'recalculate'
                      ? `This will save your weight configuration AND recalculate intent scores for all ${leads.length} active leads.`
                      : 'This will permanently update the lead scoring weight configuration used across the entire CRM system.'}
                  </p>
                  <p>
                    All future lead scores will be calculated using the new weights. Existing lead tier classifications (High / Medium / Low) may change as a result.
                  </p>
                </div>
              </div>

              {/* Change Diff Summary */}
              {changedWeights.length > 0 ? (
                <div className="space-y-2">
                  <span className={`text-[10px] tracking-[2px] uppercase font-bold font-mono ${
                    isLight ? 'text-slate-600' : 'text-slate-400'
                  }`}>
                    Modified Criteria ({changedWeights.length} changed)
                  </span>
                  <div className={`rounded-xl border overflow-hidden divide-y ${
                    isLight ? 'border-slate-200 divide-slate-100' : 'border-white/10 divide-white/5'
                  }`}>
                    {changedWeights.map(cw => (
                      <div key={cw.key} className={`flex items-center justify-between px-4 py-2.5 text-xs font-mono ${
                        isLight ? 'hover:bg-slate-50' : 'hover:bg-white/5'
                      }`}>
                        <span className={`font-semibold truncate mr-3 ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                          {cw.label}
                        </span>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="text-rose-400 line-through">{cw.oldVal} pts</span>
                          <span className="text-slate-500">→</span>
                          <span className={`font-bold ${
                            cw.newVal > cw.oldVal ? 'text-emerald-400' : 'text-rose-400'
                          }`}>
                            {cw.newVal} pts
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className={`text-center py-4 text-xs font-mono ${
                  isLight ? 'text-slate-500' : 'text-slate-400'
                }`}>
                  <ShieldCheck size={24} className="mx-auto mb-2 text-emerald-400" />
                  No weight modifications detected — saving current configuration as-is.
                </div>
              )}

              {/* Allocation & Cron Schedule Summary */}
              <div className={`space-y-2 p-3.5 rounded-xl border font-mono text-xs ${
                isExact100
                  ? isLight ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300'
                  : isLight ? 'bg-amber-50 border-amber-200 text-amber-800' : 'bg-amber-950/30 border-amber-500/30 text-amber-300'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="font-bold">Total Weight Allocation:</span>
                  <span className="font-bold text-sm">{totalPositiveWeight} / 100 Pts</span>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-current/20 text-[11px]">
                  <span className="font-semibold">Auto-Sync Schedule:</span>
                  <span className="font-bold">Every {Math.round(cronIntervalMs / 60000)} Mins ({
                    cronIntervalMs < 3600000 ? `${Math.round(cronIntervalMs / 60000)} Mins` : `${(cronIntervalMs / 3600000).toFixed(1)} Hrs`
                  })</span>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className={`px-6 py-4 border-t flex items-center justify-end gap-3 ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/50 border-white/10'
            }`}>
              <button
                onClick={() => setShowConfirmModal(false)}
                className={`px-5 py-2.5 rounded-xl text-xs uppercase font-bold tracking-wider border flex items-center gap-2 transition-all cursor-pointer ${
                  isLight ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100' : 'bg-slate-900 border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                <X size={14} />
                Cancel
              </button>

              <button
                onClick={handleConfirmAction}
                className="px-6 py-2.5 rounded-xl text-xs uppercase font-bold tracking-wider flex items-center gap-2 shadow-lg transition-all cursor-pointer bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white hover:shadow-xl hover:shadow-orange-500/20 hover:scale-[1.02] active:scale-[0.98]"
              >
                <Lock size={14} />
                {pendingAction === 'recalculate'
                  ? `Confirm & Recalculate ${leads.length} Leads`
                  : 'Confirm & Apply Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Animation Keyframes */}
      <style>{`
        @keyframes modalSlideIn {
          from { opacity: 0; transform: scale(0.92) translateY(10px); }
          to   { opacity: 1; transform: scale(1)    translateY(0);    }
        }
      `}</style>
    </div>
  )
}
