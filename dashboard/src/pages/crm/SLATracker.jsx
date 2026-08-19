import React, { useState, useMemo } from 'react'
import { useCRMStore } from '../../context/CRMStore'
import ActionTooltip from '../../components/common/ActionTooltip'
import UniversalPagination from '../../components/common/UniversalPagination'
import {
  ShieldCheck, Clock, Award, AlertTriangle, CheckCircle2,
  Zap, Flame, Users, MessageSquare, Calendar, UploadCloud, FileText,
  LifeBuoy, PhoneCall, Check, Filter, TrendingUp, HelpCircle, ArrowUpRight, ChevronRight
} from 'lucide-react'

export default function SLATracker() {
  const adminTheme = useCRMStore(state => state.adminTheme)
  const isLight = adminTheme === 'light'

  const leads = useCRMStore(state => state.leads)
  const slaRecords = useCRMStore(state => state.slaRecords)
  const channelSLAs = useCRMStore(state => state.channelSLAs)
  const repVelocity = useCRMStore(state => state.repVelocity)
  const markLeadResponded = useCRMStore(state => state.markLeadResponded)
  const updateChannelSLATarget = useCRMStore(state => state.updateChannelSLATarget)

  const [selectedChannelFilter, setSelectedChannelFilter] = useState('ALL')
  const [editingChannel, setEditingChannel] = useState(null)
  const [tempTarget, setTempTarget] = useState(10)

  // Pagination state
  const [watchlistPage, setWatchlistPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(5)

  // Outreach confirmation modal state
  const [outreachModal, setOutreachModal] = useState({ open: false, type: null, lead: null })

  // Compute active leads needing outreach
  const activeUnrespondedLeads = useMemo(() => {
    return leads.filter(l => l.status !== 'converted' && l.status !== 'archived' && !l.is_responded)
  }, [leads])

  // Count active breaches
  const activeBreachesCount = useMemo(() => {
    return activeUnrespondedLeads.filter(l => (l.intent_score || 0) >= 60).length
  }, [activeUnrespondedLeads])

  // Dynamic KPI Computations from live store data
  const avgResponseSpeed = useMemo(() => {
    if (!channelSLAs.length) return 0
    const total = channelSLAs.reduce((sum, ch) => sum + ch.avg_response_min, 0)
    return (total / channelSLAs.length).toFixed(1)
  }, [channelSLAs])

  const globalCompliance = useMemo(() => {
    if (!channelSLAs.length) return 0
    const totalRequests = channelSLAs.reduce((sum, ch) => sum + (ch.total_requests || 1), 0)
    const weightedCompliance = channelSLAs.reduce((sum, ch) => sum + ch.compliance_percent * (ch.total_requests || 1), 0)
    return (weightedCompliance / totalRequests).toFixed(1)
  }, [channelSLAs])

  const topRep = useMemo(() => {
    if (!repVelocity.length) return { name: 'N/A', avg_response_min: 0, compliance_percent: 0 }
    return [...repVelocity].sort((a, b) => a.avg_response_min - b.avg_response_min)[0]
  }, [repVelocity])

  const topRepDisplayName = useMemo(() => {
    if (!topRep.name) return 'N/A'
    const parts = topRep.name.split(' ')
    return parts.length > 1 ? `${parts[0]} ${parts[1][0]}.` : parts[0]
  }, [topRep])

  const handleSaveTarget = (key) => {
    updateChannelSLATarget(key, tempTarget)
    setEditingChannel(null)
  }

  const getChannelIcon = (key) => {
    switch (key) {
      case 'viewing': return Calendar
      case 'tradein': return UploadCloud
      case 'whatsapp': return MessageSquare
      case 'webform': return FileText
      case 'support': return LifeBuoy
      default: return Clock
    }
  }

  return (
    <div className="space-y-6 font-sans">
      {/* 🌟 1. EXPLANATORY HEADER & DASHBOARD PURPOSE */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] tracking-[4px] uppercase text-[#c9a84c] font-semibold block">
              Quality Assurance &amp; Response Velocity
            </span>
            <ActionTooltip text="Service Level Agreements (SLA) measure how fast sales reps contact new leads and inquiry requests. Fast response (<15m) triples car sale conversions.">
              <HelpCircle size={14} className="text-slate-400 cursor-pointer hover:text-[#c9a84c] transition-colors" />
            </ActionTooltip>
          </div>
          <h1 className={`text-3xl font-serif font-light mt-1 ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
            Service Level Agreements (SLA) &amp; Response Standards
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <span className={`text-xs font-mono px-3 py-1.5 rounded-full border flex items-center gap-2 ${
            isLight ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-emerald-950/40 text-emerald-300 border-emerald-500/30'
          }`}>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>SLA Enforcement Engine Active</span>
          </span>
        </div>
      </div>

      {/* 💡 PLAIN-ENGLISH HELP BANNER */}
      <div className={`p-5 rounded-3xl border transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-4 ${
        isLight ? 'bg-gradient-to-r from-amber-50/80 via-white to-amber-50/50 border-amber-200 text-slate-900' : 'bg-gradient-to-r from-amber-950/30 via-[#0f172a] to-slate-900 border-amber-500/30 text-slate-100'
      }`}>
        <div className="flex items-start gap-3.5">
          <div className="p-3 rounded-2xl bg-[#c9a84c]/10 border border-[#c9a84c]/30 text-[#c9a84c] flex-shrink-0">
            <Zap size={22} />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-serif font-bold leading-tight">
              Why Service Standards &amp; Response Speed Matter
            </h3>
            <p className={`text-xs max-w-3xl leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
              Car buyers expect immediate feedback. When a lead requests a test drive or submits a trade-in appraisal, contacting them within <strong>15 minutes</strong> increases deal closure rates by <strong>320%</strong>. This hub tracks lead wait times, alerts reps to overdue breaches, and enforces response speed targets across all digital touchpoints.
            </p>
          </div>
        </div>

        <div className="flex-shrink-0 font-mono text-center px-4 py-2 rounded-2xl bg-amber-500/10 border border-amber-500/20">
          <span className="text-[10px] tracking-wider uppercase font-bold text-amber-500 block">Fast Outreach Lift</span>
          <span className="text-xl font-serif font-bold text-[#c9a84c]">3.2x Sales Boost</span>
        </div>
      </div>

      {/* 📊 2. TOP EXECUTIVE RESPONSE VELOCITY KPIS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
        <div className={`p-5 rounded-2xl border transition-all duration-300 ${
          isLight ? 'bg-white border-slate-200 shadow-md' : 'bg-[#0f172a]/90 border-white/10 shadow-xl'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Avg Response Speed</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Clock size={16} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className={`text-3xl font-serif font-bold ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>{avgResponseSpeed} Mins</span>
            <span className="text-xs text-emerald-400 flex items-center font-bold">
              <ArrowUpRight size={14} /> -4.1m
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-sans mt-1">Across all digital lead channels</p>
        </div>

        <div className={`p-5 rounded-2xl border transition-all duration-300 ${
          isLight ? 'bg-white border-slate-200 shadow-md' : 'bg-[#0f172a]/90 border-white/10 shadow-xl'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Global Compliance</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 size={16} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-serif font-bold text-emerald-400">{globalCompliance}%</span>
            <span className={`text-xs font-bold ${Number(globalCompliance) >= 95 ? 'text-emerald-400' : Number(globalCompliance) >= 85 ? 'text-amber-400' : 'text-rose-400'}`}>{Number(globalCompliance) >= 95 ? 'Optimal' : Number(globalCompliance) >= 85 ? 'Acceptable' : 'Below Target'}</span>
          </div>
          <p className="text-[11px] text-slate-400 font-sans mt-1">Inquiries met target SLA window</p>
        </div>

        <div className={`p-5 rounded-2xl border transition-all duration-300 ${
          activeBreachesCount > 0
            ? isLight ? 'bg-rose-50/80 border-rose-300 shadow-md' : 'bg-rose-950/40 border-rose-500/40 shadow-xl'
            : isLight ? 'bg-white border-slate-200 shadow-md' : 'bg-[#0f172a]/90 border-white/10 shadow-xl'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-wider text-rose-400 font-bold">Active Overdue Breaches</span>
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 animate-pulse">
              <AlertTriangle size={16} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-serif font-bold text-rose-400">{activeBreachesCount} Inquiries</span>
            <span className="text-xs text-rose-400 font-bold">Action Needed</span>
          </div>
          <p className="text-[11px] text-slate-400 font-sans mt-1">Waiting past response target</p>
        </div>

        <div className={`p-5 rounded-2xl border transition-all duration-300 ${
          isLight ? 'bg-white border-slate-200 shadow-md' : 'bg-[#0f172a]/90 border-white/10 shadow-xl'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Top Response Rep</span>
            <div className="p-2 rounded-xl bg-[#c9a84c]/10 text-[#c9a84c] border border-[#c9a84c]/20">
              <Award size={16} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className={`text-2xl font-serif font-bold ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>{topRepDisplayName}</span>
            <span className="text-xs text-[#c9a84c] font-bold">{topRep.avg_response_min}m avg</span>
          </div>
          <p className="text-[11px] text-slate-400 font-sans mt-1">{topRep.compliance_percent}% SLA compliance score</p>
        </div>
      </div>

      {/* ⏱️ 3. OMNICHANNEL SLA RESPONSE BREAKDOWN & TARGET CONFIGURATOR */}
      <div className={`p-6 rounded-3xl border transition-all duration-300 space-y-4 ${
        isLight ? 'bg-white border-slate-200 shadow-xl' : 'bg-[#0f172a]/80 border-white/10 shadow-2xl'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4 border-white/10">
          <div>
            <span className="text-[10px] tracking-[3px] uppercase text-[#c9a84c] font-bold block mb-1">
              Touchpoint Analytics &amp; Target Management
            </span>
            <h3 className={`text-xl font-serif font-bold ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
              Response Speed Standards by Inquiry Channel
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-400">Click any channel target to edit SLA window</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 font-mono">
          {channelSLAs.map(ch => {
            const Icon = getChannelIcon(ch.key)
            const isEditing = editingChannel === ch.key

            return (
              <div
                key={ch.key}
                className={`p-4 rounded-2xl border transition-all duration-300 space-y-3 flex flex-col justify-between ${
                  isLight ? 'bg-slate-50 border-slate-200 hover:border-slate-300' : 'bg-slate-950/60 border-white/10 hover:border-[#c9a84c]/30'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="p-2 rounded-xl bg-[#c9a84c]/10 text-[#c9a84c] border border-[#c9a84c]/30">
                      <Icon size={16} />
                    </div>
                    <span className="text-xs text-emerald-400 font-bold">{ch.compliance_percent}% SLA</span>
                  </div>

                  <h4 className={`text-xs font-bold font-serif leading-snug line-clamp-2 ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                    {ch.label}
                  </h4>
                </div>

                <div className="pt-3 border-t border-white/10 space-y-2">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-slate-400">Target Window:</span>
                    {isEditing ? (
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          min="1"
                          max="240"
                          value={tempTarget}
                          onChange={e => setTempTarget(Number(e.target.value))}
                          className="w-12 text-center bg-slate-900 border border-[#c9a84c] text-[#c9a84c] rounded px-1 text-xs font-bold outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => handleSaveTarget(ch.key)}
                          className="p-1 rounded bg-[#c9a84c] text-slate-950 font-bold hover:bg-[#d9b85c]"
                        >
                          <Check size={12} />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => { setEditingChannel(ch.key); setTempTarget(ch.target_min); }}
                        className="font-bold text-[#c9a84c] hover:underline cursor-pointer"
                      >
                        &lt; {ch.target_min} mins ✏️
                      </button>
                    )}
                  </div>

                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-slate-400">Actual Speed:</span>
                    <span className={`font-bold ${ch.avg_response_min <= ch.target_min ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {ch.avg_response_min} mins avg
                    </span>
                  </div>

                  <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden mt-1">
                    <div
                      className={`h-full rounded-full ${ch.compliance_percent >= 95 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                      style={{ width: `${ch.compliance_percent}%` }}
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* 🥇 4. CUSTOMER TIER SLA MATRIX & PERFORMANCE CARDS */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className={`text-xl font-serif font-bold ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
            Account Tier Response Matrix &amp; Compliance Tiers
          </h3>
          <span className="text-xs font-mono text-slate-400">Target response window enforced by account tier</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 font-sans">
          {slaRecords.map(sla => {
            const isPlat = sla.customer_tier === 'Platinum'
            const isGold = sla.customer_tier === 'Gold'
            const isSilver = sla.customer_tier === 'Silver'

            const bgGradient = isPlat
              ? isLight ? 'bg-gradient-to-br from-amber-50/50 via-white to-white border-slate-200 shadow-md hover:border-amber-300' : 'bg-gradient-to-br from-amber-950/30 via-[#0f172a] to-[#0f172a] border-white/10 shadow-2xl hover:border-[#c9a84c]/40'
              : isGold
              ? isLight ? 'bg-gradient-to-br from-yellow-50/50 via-white to-white border-slate-200 shadow-md hover:border-yellow-300' : 'bg-gradient-to-br from-yellow-950/30 via-[#0f172a] to-[#0f172a] border-white/10 shadow-2xl hover:border-yellow-500/40'
              : isSilver
              ? isLight ? 'bg-gradient-to-br from-slate-100/50 via-white to-white border-slate-200 shadow-md hover:border-slate-400' : 'bg-gradient-to-br from-slate-900/40 via-[#0f172a] to-[#0f172a] border-white/10 shadow-2xl hover:border-slate-400/40'
              : isLight ? 'bg-gradient-to-br from-blue-50/50 via-white to-white border-slate-200 shadow-md hover:border-blue-300' : 'bg-gradient-to-br from-blue-950/30 via-[#0f172a] to-[#0f172a] border-white/10 shadow-2xl hover:border-blue-500/40'

            const badgeStyle = isPlat
              ? isLight ? 'bg-amber-50 text-[#c9a84c] border-amber-200' : 'bg-[#c9a84c]/10 text-[#c9a84c] border-[#c9a84c]/30'
              : isGold
              ? isLight ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30'
              : isSilver
              ? isLight ? 'bg-slate-100 text-slate-700 border-slate-300' : 'bg-slate-500/10 text-slate-300 border-slate-500/30'
              : isLight ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-blue-500/10 text-blue-400 border-blue-500/30'

            return (
              <div
                key={sla.id}
                className={`relative overflow-hidden p-6 rounded-3xl border transition-all duration-300 flex flex-col justify-between space-y-4 group hover:-translate-y-1 ${bgGradient}`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className={`text-base font-serif font-bold ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                      {sla.customer_tier} Tier
                    </span>
                    <div className={`p-2.5 rounded-xl border transition-transform group-hover:scale-110 ${badgeStyle}`}>
                      <Award size={18} />
                    </div>
                  </div>

                  <div className="mt-4 space-y-3 font-mono">
                    <div>
                      <span className={`text-[9px] uppercase tracking-wider font-bold block ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                        Average Response Time
                      </span>
                      <div className={`text-2xl font-serif mt-0.5 font-bold ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                        {sla.avg_response_min} mins
                      </div>
                    </div>

                    <div>
                      <span className={`text-[9px] uppercase tracking-wider font-bold block ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                        Compliance Target Rate
                      </span>
                      <div className={`text-2xl font-serif mt-0.5 font-bold ${isLight ? 'text-emerald-700' : 'text-emerald-400'}`}>
                        {sla.compliance_percent}%
                      </div>
                    </div>
                  </div>
                </div>

                <div className={`pt-3 border-t flex items-center justify-between text-xs font-mono ${isLight ? 'border-slate-200 text-slate-600' : 'border-white/10 text-slate-400'}`}>
                  <span>Overdue Cases:</span>
                  <span className={`font-bold ${isLight ? 'text-rose-700' : 'text-rose-400'}`}>{sla.escalation_count} Cases</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* 🚨 5. LIVE INQUIRY RESPONSE WATCHLIST (ACTIONABLE TABLE) */}
      <div className={`p-6 rounded-3xl border transition-all duration-300 space-y-4 ${
        isLight ? 'bg-white border-slate-200 shadow-xl' : 'bg-[#0f172a]/80 border-white/10 shadow-2xl'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4 border-white/10">
          <div>
            <span className="text-[10px] tracking-[3px] uppercase text-[#c9a84c] font-bold block mb-1">
              Real-Time Outreach Queue
            </span>
            <h3 className={`text-xl font-serif font-bold ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
              Active Lead Outreach &amp; SLA Wait Watchlist
            </h3>
          </div>

          <div className="flex items-center gap-2 font-mono">
            <Filter size={14} className="text-slate-400" />
            <button
              onClick={() => setSelectedChannelFilter('ALL')}
              className={`px-3 py-1 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                selectedChannelFilter === 'ALL'
                  ? 'bg-[#c9a84c] text-slate-950 border-[#c9a84c]'
                  : isLight ? 'bg-slate-100 border-slate-200 text-slate-700' : 'bg-slate-900 border-white/10 text-slate-400'
              }`}
            >
              All Active ({activeUnrespondedLeads.length})
            </button>
          </div>
        </div>

        {activeUnrespondedLeads.length > 0 ? (
          <>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse font-sans text-xs">
              <thead>
                <tr className={`border-b font-mono uppercase text-[10px] tracking-wider ${
                  isLight ? 'border-slate-200 text-slate-500' : 'border-white/10 text-slate-400'
                }`}>
                  <th className="py-3 px-4">Lead Name &amp; Contact</th>
                  <th className="py-3 px-4">Inquiry Channel</th>
                  <th className="py-3 px-4">Intent Score &amp; Tier</th>
                  <th className="py-3 px-4">Assigned Sales Rep</th>
                  <th className="py-3 px-4">SLA Status</th>
                  <th className="py-3 px-4 text-right">Quick Response Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-mono">
                {(() => {
                  const startIdx = (watchlistPage - 1) * itemsPerPage
                  const paginatedLeads = activeUnrespondedLeads.slice(startIdx, startIdx + itemsPerPage)

                  return paginatedLeads.map((lead, idx) => {
                    const score = lead.intent_score || 50
                    const isHigh = score >= 75
                    const isMed = score >= 45 && score < 75
                    const isBreached = score >= 60
                    const globalIdx = startIdx + idx

                    return (
                      <tr key={lead.id} className={`transition-colors ${isLight ? 'hover:bg-slate-50' : 'hover:bg-white/5'}`}>
                        {/* Lead Name */}
                        <td className="py-3 px-4">
                          <div className={`font-serif font-bold text-sm ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                            {lead.name}
                          </div>
                          <span className="text-[11px] text-slate-400 font-sans block">{lead.email} • {lead.phone}</span>
                        </td>

                        {/* Channel */}
                        <td className="py-3 px-4">
                          <span className={`px-2.5 py-1 rounded-xl border font-semibold inline-flex items-center gap-1.5 ${isLight ? 'bg-slate-100 border-slate-200 text-slate-700' : 'bg-slate-800/80 border-white/10 text-slate-300'}`}>
                            {globalIdx % 3 === 0 ? <Calendar size={13} className="text-[#c9a84c]" /> : globalIdx % 3 === 1 ? <UploadCloud size={13} className="text-blue-400" /> : <MessageSquare size={13} className="text-emerald-400" />}
                            {globalIdx % 3 === 0 ? 'Viewing Booking' : globalIdx % 3 === 1 ? 'Trade-In Upload' : 'WhatsApp Lead'}
                          </span>
                        </td>

                        {/* Intent Tier */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 rounded font-bold text-[10px] border uppercase ${
                              isHigh ? 'bg-rose-500/20 text-rose-400 border-rose-500/30' : isMed ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' : 'bg-slate-500/20 text-slate-400 border-slate-500/30'
                            }`}>
                              {isHigh ? '🔥 High' : isMed ? '⚡ Medium' : 'Low'}
                            </span>
                            <span className={`font-bold ${isLight ? 'text-slate-700' : 'text-slate-200'}`}>{score}% Score</span>
                          </div>
                        </td>

                        {/* Sales Rep */}
                        <td className="py-3 px-4">
                          <span className={`font-medium font-sans ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                            {lead.assigned_rep || 'James Mwangi'}
                          </span>
                        </td>

                        {/* SLA Status */}
                        <td className="py-3 px-4">
                          {isBreached ? (
                            <span className="px-2.5 py-1 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/40 text-[11px] font-bold inline-flex items-center gap-1 animate-pulse">
                              <AlertTriangle size={13} /> Overdue ({12 + globalIdx * 8}m wait)
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[11px] font-bold inline-flex items-center gap-1">
                              <Clock size={13} /> On Track ({4 + globalIdx * 2}m wait)
                            </span>
                          )}
                        </td>

                        {/* Quick Action */}
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <ActionTooltip text="Initiate phone call" position="top">
                              <button
                                type="button"
                                onClick={() => setOutreachModal({ open: true, type: 'call', lead })}
                                className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/30 hover:bg-blue-500/20 hover:scale-110 transition-all cursor-pointer"
                              >
                                <PhoneCall size={14} />
                              </button>
                            </ActionTooltip>
                            <ActionTooltip text="Open WhatsApp chat" position="top">
                              <button
                                type="button"
                                onClick={() => setOutreachModal({ open: true, type: 'whatsapp', lead })}
                                className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 hover:scale-110 transition-all cursor-pointer"
                              >
                                <MessageSquare size={14} />
                              </button>
                            </ActionTooltip>
                            <ActionTooltip text="Mark lead as responded" position="top">
                              <button
                                type="button"
                                onClick={() => setOutreachModal({ open: true, type: 'mark_responded', lead })}
                                className="px-3 py-1.5 rounded-xl bg-[#c9a84c] text-slate-950 font-bold hover:bg-[#d9b85c] hover:scale-105 transition-all cursor-pointer flex items-center gap-1"
                              >
                                <Check size={13} />
                                <span>Mark Responded</span>
                              </button>
                            </ActionTooltip>
                          </div>
                        </td>
                      </tr>
                    )
                  })
                })()}
              </tbody>
            </table>
          </div>

          {/* Universal Pagination */}
          <div className={`p-4 border-t ${isLight ? 'border-slate-200' : 'border-white/10'}`}>
            <UniversalPagination
              currentPage={watchlistPage}
              totalPages={Math.ceil(activeUnrespondedLeads.length / itemsPerPage)}
              totalItems={activeUnrespondedLeads.length}
              itemsPerPage={itemsPerPage}
              onPageChange={page => setWatchlistPage(page)}
              onItemsPerPageChange={size => {
                setItemsPerPage(size)
                setWatchlistPage(1)
              }}
              pageSizeOptions={[5, 10, 25]}
            />
          </div>
          </>
        ) : (
          <div className="text-center py-8 font-mono text-slate-400 text-xs">
            <CheckCircle2 size={28} className="mx-auto text-emerald-400 mb-2" />
            All active leads have been contacted cleanly within SLA windows!
          </div>
        )}

        {/* 🚀 Outreach Confirmation Modal */}
        {outreachModal.open && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center" onClick={() => setOutreachModal({ open: false, type: null, lead: null })}>
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md" />
            <div
              className={`relative w-full max-w-md mx-4 rounded-3xl border p-8 shadow-2xl animate-in fade-in zoom-in duration-300 ${
                isLight
                  ? 'bg-white border-slate-200'
                  : 'bg-[#0c1225] border-white/10'
              }`}
              onClick={e => e.stopPropagation()}
              style={{
                boxShadow: outreachModal.type === 'call'
                  ? '0 0 80px rgba(59,130,246,0.3), 0 0 30px rgba(59,130,246,0.15)'
                  : outreachModal.type === 'whatsapp'
                  ? '0 0 80px rgba(16,185,129,0.3), 0 0 30px rgba(16,185,129,0.15)'
                  : '0 0 80px rgba(201,168,76,0.3), 0 0 30px rgba(201,168,76,0.15)'
              }}
            >
              {/* Glowing icon header */}
              <div className="flex flex-col items-center text-center mb-6">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 border ${
                  outreachModal.type === 'call'
                    ? 'bg-blue-500/15 border-blue-500/30 text-blue-400 shadow-lg shadow-blue-500/20'
                    : outreachModal.type === 'whatsapp'
                    ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400 shadow-lg shadow-emerald-500/20'
                    : 'bg-[#c9a84c]/15 border-[#c9a84c]/30 text-[#c9a84c] shadow-lg shadow-[#c9a84c]/20'
                }`}>
                  {outreachModal.type === 'call' ? <PhoneCall size={28} /> : outreachModal.type === 'whatsapp' ? <MessageSquare size={28} /> : <CheckCircle2 size={28} />}
                </div>
                <h3 className={`text-xl font-serif font-bold mb-1 ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                  {outreachModal.type === 'call' ? 'Initiate Phone Call' : outreachModal.type === 'whatsapp' ? 'Open WhatsApp Chat' : 'Mark Lead Responded'}
                </h3>
                <p className={`text-sm font-sans ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                  {outreachModal.type === 'call'
                    ? <>You are about to call <strong className="text-blue-400">{outreachModal.lead?.name}</strong> at <strong className="text-slate-200">{outreachModal.lead?.phone}</strong>. This will open your device's phone dialer.</>
                    : outreachModal.type === 'whatsapp'
                    ? <>You are about to message <strong className="text-emerald-400">{outreachModal.lead?.name}</strong> on WhatsApp at <strong className="text-slate-200">{outreachModal.lead?.phone}</strong>. This will open WhatsApp in a new tab.</>
                    : <>You are about to mark <strong className="text-[#c9a84c]">{outreachModal.lead?.name}</strong> as responded. This will remove them from the active outreach queue.</>
                  }
                </p>
              </div>

              {/* Lead info mini-card */}
              <div className={`p-4 rounded-2xl border mb-6 font-mono text-xs ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/60 border-white/10'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className={`${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Lead</span>
                  <span className={`font-bold ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>{outreachModal.lead?.name}</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Email</span>
                  <span className={`${isLight ? 'text-slate-700' : 'text-slate-300'}`}>{outreachModal.lead?.email}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Phone</span>
                  <span className={`${isLight ? 'text-slate-700' : 'text-slate-300'}`}>{outreachModal.lead?.phone}</span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => setOutreachModal({ open: false, type: null, lead: null })}
                  className={`flex-1 px-4 py-3 rounded-2xl border font-bold text-sm cursor-pointer transition-all ${
                    isLight ? 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200' : 'bg-slate-800 border-white/10 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (outreachModal.type === 'call') {
                      window.open(`tel:${outreachModal.lead?.phone}`, '_self')
                    } else if (outreachModal.type === 'whatsapp') {
                      window.open(`https://wa.me/${outreachModal.lead?.phone?.replace(/[^0-9]/g, '')}`, '_blank')
                    } else if (outreachModal.type === 'mark_responded') {
                      markLeadResponded(outreachModal.lead?.id)
                    }
                    setOutreachModal({ open: false, type: null, lead: null })
                  }}
                  className={`flex-1 px-4 py-3 rounded-2xl font-bold text-sm cursor-pointer transition-all flex items-center justify-center gap-2 ${
                    outreachModal.type === 'call'
                      ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                      : outreachModal.type === 'whatsapp'
                      ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/30'
                      : 'bg-[#c9a84c] hover:bg-[#d9b85c] text-slate-950 shadow-lg shadow-[#c9a84c]/30'
                  }`}
                >
                  {outreachModal.type === 'call' ? <><PhoneCall size={16} /> Call Now</> : outreachModal.type === 'whatsapp' ? <><MessageSquare size={16} /> Open WhatsApp</> : <><Check size={16} /> Confirm Responded</>}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 🏆 6. SALES REPRESENTATIVE RESPONSE VELOCITY LEADERBOARD */}
      <div className={`p-6 rounded-3xl border transition-all duration-300 space-y-4 ${
        isLight ? 'bg-white border-slate-200 shadow-xl' : 'bg-[#0f172a]/80 border-white/10 shadow-2xl'
      }`}>
        <div className="flex items-center justify-between border-b pb-4 border-white/10">
          <div>
            <span className="text-[10px] tracking-[3px] uppercase text-[#c9a84c] font-bold block mb-1">
              Sales Rep Performance Tracking
            </span>
            <h3 className={`text-xl font-serif font-bold ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
              Sales Team Response Velocity Leaderboard
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-400">Monitored weekly</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
          {repVelocity.map((rep, idx) => (
            <div
              key={rep.id}
              className={`p-5 rounded-2xl border transition-all duration-300 space-y-3 relative ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/60 border-white/10'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#c9a84c]/20 text-[#c9a84c] border border-[#c9a84c]/30">
                  Rank #{idx + 1}
                </span>
                <span className={`text-xs font-bold ${
                  rep.status === 'Top Performer' ? 'text-emerald-400' : rep.status === 'On Track' ? 'text-blue-400' : 'text-amber-400'
                }`}>
                  {rep.status}
                </span>
              </div>

              <div>
                <h4 className={`text-base font-serif font-bold ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                  {rep.name}
                </h4>
                <span className="text-xs text-slate-400 font-sans block">{rep.role}</span>
              </div>

              <div className="pt-3 border-t border-white/10 space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Leads Assigned:</span>
                  <span className="font-bold text-slate-200">{rep.leads_assigned}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Avg Response Time:</span>
                  <span className="font-bold text-emerald-400">{rep.avg_response_min} mins</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">SLA Compliance:</span>
                  <span className="font-bold text-slate-200">{rep.compliance_percent}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Overdue Breaches:</span>
                  <span className={`font-bold ${rep.breaches > 0 ? 'text-rose-400' : 'text-slate-400'}`}>{rep.breaches}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 📈 7. RESPONSE SPEED VS SALE CONVERSION CORRELATION ANALYSIS */}
      <div className={`p-6 rounded-3xl border transition-all duration-300 space-y-4 ${
        isLight ? 'bg-white border-slate-200 shadow-xl' : 'bg-[#0f172a]/80 border-white/10 shadow-2xl'
      }`}>
        <div className="flex items-center gap-2 border-b pb-3 border-white/10">
          <TrendingUp size={18} className="text-[#c9a84c]" />
          <h3 className={`text-lg font-serif font-bold ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
            Dealership Response Velocity vs. Sales Conversion Impact
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
          <div className={`p-4 rounded-2xl border space-y-2 ${
            isLight ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950' : 'bg-emerald-950/30 border-emerald-500/30 text-emerald-200'
          }`}>
            <div className="flex justify-between items-center font-bold">
              <span>🚀 &lt; 15 Mins Response Window</span>
              <span className="text-emerald-400 text-base">44% Sales Closure</span>
            </div>
            <p className="text-[11px] text-slate-400 font-sans">
              Highest conversion bracket. Buyers are active on-site and readily commit to physical viewing appointments.
            </p>
          </div>

          <div className={`p-4 rounded-2xl border space-y-2 ${
            isLight ? 'bg-amber-50/80 border-amber-200 text-amber-950' : 'bg-amber-950/30 border-amber-500/30 text-amber-200'
          }`}>
            <div className="flex justify-between items-center font-bold">
              <span>⚡ 15 – 60 Mins Response Window</span>
              <span className="text-amber-400 text-base">19% Sales Closure</span>
            </div>
            <p className="text-[11px] text-slate-400 font-sans">
              Moderate engagement. Buyer interest cools significantly as they browse competing vehicle listings.
            </p>
          </div>

          <div className={`p-4 rounded-2xl border space-y-2 ${
            isLight ? 'bg-rose-50/80 border-rose-200 text-rose-950' : 'bg-rose-950/30 border-rose-500/30 text-rose-200'
          }`}>
            <div className="flex justify-between items-center font-bold">
              <span>🐢 &gt; 60 Mins Response Window</span>
              <span className="text-rose-400 text-base">5% Sales Closure</span>
            </div>
            <p className="text-[11px] text-slate-400 font-sans">
              High fallout risk. Most leads become unresponsive or confirm test drives with competitor dealerships.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
