import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCRMStore } from '../../context/CRMStore'
import { useAnalyticsStore } from '../../context/AnalyticsStore'
import {
  Megaphone, Plus, Search, DollarSign, Users, Award, Play,
  Sparkles, Layers, Sliders, CheckCircle2, X, RefreshCw, Send, ExternalLink, Share2, Video, PhoneCall, QrCode
} from 'lucide-react'
import ModernDatePicker from '../../components/common/ModernDatePicker'
import PredictiveSelect from '../../components/common/PredictiveSelect'

export default function CampaignsManager() {
  const campaigns = useCRMStore(state => state.campaigns)
  const addCampaign = useCRMStore(state => state.addCampaign)
  const analyticsCampaigns = useAnalyticsStore(state => state.campaigns) || []
  const adminTheme = useCRMStore(state => state.adminTheme)
  const isLight = adminTheme === 'light'

  const [showAddModal, setShowAddModal] = useState(false)
  const [showSegmentModal, setShowSegmentModal] = useState(false)
  const [showBulkModal, setShowBulkModal] = useState(false)
  const [activeAdsModalCamp, setActiveAdsModalCamp] = useState(null)

  // New Campaign Form State
  const [campForm, setCampForm] = useState({
    name: '', type: 'Email Campaign', budget: 300000, start_date: '2026-08-01', end_date: '2026-09-30', description: ''
  })

  // Segment Builder State
  const [segmentFilters, setSegmentFilters] = useState({
    loyaltyTier: 'Gold', inactivityDays: 30, minSpend: 5000000
  })

  // Bulk Dispatch State
  const [dispatchStatus, setDispatchStatus] = useState({ isRunning: false, progress: 0 })

  const handleAddCampaign = (e) => {
    e.preventDefault()
    if (!campForm.name) return
    addCampaign(campForm)
    setShowAddModal(false)
    setCampForm({ name: '', type: 'Email Campaign', budget: 300000, start_date: '2026-08-01', end_date: '2026-09-30', description: '' })
  }

  const runBulkDispatch = () => {
    setDispatchStatus({ isRunning: true, progress: 10 })
    let current = 10
    const timer = setInterval(() => {
      current += 25
      if (current >= 100) {
        clearInterval(timer)
        setDispatchStatus({ isRunning: false, progress: 100 })
        setTimeout(() => setShowBulkModal(false), 1200)
      } else {
        setDispatchStatus({ isRunning: true, progress: current })
      }
    }, 400)
  }

  // Simulated Segment Calculation
  const calculatedTargetCount = segmentFilters.loyaltyTier === 'Platinum' ? 14 : segmentFilters.loyaltyTier === 'Gold' ? 38 : 72

  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')

  const filteredCampaigns = campaigns.filter(c => {
    const q = searchTerm.toLowerCase().trim()
    const matchesSearch = !q || c.name.toLowerCase().includes(q) || (c.description && c.description.toLowerCase().includes(q)) || (c.slug && c.slug.toLowerCase().includes(q))
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter
    const matchesType = typeFilter === 'all' || c.type === typeFilter
    return matchesSearch && matchesStatus && matchesType
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] tracking-[4px] uppercase text-[#c9a84c] font-semibold block">Marketing Automation</span>
          <h1 className={`text-3xl font-serif font-light mt-1 ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
            Campaigns &amp; Audience Segment Builder
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3 font-mono">
          <button
            onClick={() => setShowSegmentModal(true)}
            className={`px-3.5 py-2 rounded-xl border text-xs tracking-wider uppercase font-bold transition-all flex items-center gap-2 cursor-pointer ${
              isLight
                ? 'border-purple-300 bg-purple-50 text-purple-900 hover:bg-purple-100'
                : 'border-purple-500/40 bg-purple-500/10 text-purple-300 hover:bg-purple-500/20'
            }`}
          >
            <Layers size={15} />
            <span>Segment Builder</span>
          </button>

          <button
            onClick={() => setShowBulkModal(true)}
            className={`px-3.5 py-2 rounded-xl border text-xs tracking-wider uppercase font-bold transition-all flex items-center gap-2 cursor-pointer ${
              isLight
                ? 'border-emerald-300 bg-emerald-50 text-emerald-900 hover:bg-emerald-100'
                : 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20'
            }`}
          >
            <Send size={15} />
            <span>Bulk Dispatch</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-[#c9a84c] text-slate-950 font-bold rounded-xl text-xs tracking-wider uppercase hover:bg-[#d9b85c] transition-all flex items-center gap-2 shadow-lg cursor-pointer"
          >
            <Plus size={16} />
            <span>Create Campaign</span>
          </button>
        </div>
      </div>

      {/* Predictive Filter Toolbar */}
      <div className={`p-4 rounded-2xl border transition-all duration-300 space-y-3 ${
        isLight ? 'bg-white border-slate-200 shadow-xl' : 'bg-[#0f172a]/80 border-white/10 shadow-2xl'
      }`}>
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="relative w-full lg:w-80">
            <Search size={16} className={`absolute left-3.5 top-3 ${isLight ? 'text-slate-400' : 'text-slate-500'}`} />
            <input
              type="text"
              placeholder="Search campaigns by name, slug, or description..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-8 py-2 border rounded-xl text-xs outline-none font-mono transition-all ${
                isLight
                  ? 'bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-[#c9a84c]'
                  : 'bg-slate-950/60 border-white/10 text-slate-200 placeholder:text-slate-500 focus:border-[#c9a84c]'
              }`}
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-200">
                <X size={14} />
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full lg:w-auto font-mono">
            {/* Predictive Status Filter */}
            <PredictiveSelect
              isLight={isLight}
              placeholder="Filter Status..."
              value={statusFilter}
              onChange={val => setStatusFilter(val || 'all')}
              options={[
                { value: 'all', label: 'All Statuses', count: campaigns.length },
                { value: 'Active', label: 'Active', count: campaigns.filter(c => c.status === 'Active').length },
                { value: 'Completed', label: 'Completed', count: campaigns.filter(c => c.status === 'Completed').length },
                { value: 'Scheduled', label: 'Scheduled', count: campaigns.filter(c => c.status === 'Scheduled').length },
                { value: 'Draft', label: 'Draft', count: campaigns.filter(c => c.status === 'Draft').length }
              ]}
              className="w-full sm:w-44"
            />

            {/* Predictive Type Filter */}
            <PredictiveSelect
              isLight={isLight}
              placeholder="Filter Type..."
              value={typeFilter}
              onChange={val => setTypeFilter(val || 'all')}
              options={[
                { value: 'all', label: 'All Types', count: campaigns.length },
                { value: 'Email Campaign', label: 'Email Campaign', count: campaigns.filter(c => c.type === 'Email Campaign').length },
                { value: 'Paid Search', label: 'Paid Search', count: campaigns.filter(c => c.type === 'Paid Search').length },
                { value: 'Trade Show', label: 'Trade Show', count: campaigns.filter(c => c.type === 'Trade Show').length },
                { value: 'ABM Outreach', label: 'ABM Outreach', count: campaigns.filter(c => c.type === 'ABM Outreach').length },
                { value: 'Paid Social', label: 'Paid Social', count: campaigns.filter(c => c.type === 'Paid Social').length }
              ]}
              className="w-full sm:w-48"
            />
          </div>

          <div className={`text-xs font-mono font-bold whitespace-nowrap ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>
            Showing {filteredCampaigns.length} of {campaigns.length} Campaigns
          </div>
        </div>

        {/* Filter Summary Ribbon & Active Chips */}
        {(searchTerm || statusFilter !== 'all' || typeFilter !== 'all') && (
          <div className="pt-2 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`text-[11px] ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Active Filters:</span>
              {searchTerm && (
                <span className="px-2 py-0.5 rounded-lg bg-[#c9a84c]/20 text-[#c9a84c] border border-[#c9a84c]/30 flex items-center gap-1">
                  Search: "{searchTerm}"
                  <button onClick={() => setSearchTerm('')}><X size={12} /></button>
                </span>
              )}
              {statusFilter !== 'all' && (
                <span className="px-2 py-0.5 rounded-lg bg-[#c9a84c]/20 text-[#c9a84c] border border-[#c9a84c]/30 flex items-center gap-1">
                  Status: {statusFilter}
                  <button onClick={() => setStatusFilter('all')}><X size={12} /></button>
                </span>
              )}
              {typeFilter !== 'all' && (
                <span className="px-2 py-0.5 rounded-lg bg-[#c9a84c]/20 text-[#c9a84c] border border-[#c9a84c]/30 flex items-center gap-1">
                  Type: {typeFilter}
                  <button onClick={() => setTypeFilter('all')}><X size={12} /></button>
                </span>
              )}
            </div>

            <button
              onClick={() => {
                setSearchTerm('')
                setStatusFilter('all')
                setTypeFilter('all')
              }}
              className="text-[11px] text-rose-400 hover:text-rose-300 underline cursor-pointer"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>

      {/* Campaign Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCampaigns.map(camp => (
          <div key={camp.id} className={`p-6 rounded-2xl border transition-all duration-300 flex flex-col justify-between space-y-4 border-t-4 border-t-[#c9a84c] ${
            isLight ? 'bg-white border-slate-200 shadow-xl text-slate-900' : 'bg-[#0f172a]/80 border-white/10 shadow-2xl text-slate-100'
          }`}>
            <div>
              <div className="flex items-center justify-between">
                <span className={`text-[10px] uppercase font-mono px-2.5 py-0.5 rounded-lg border font-bold ${
                  isLight ? 'bg-purple-50 text-purple-900 border-purple-200' : 'bg-purple-500/10 text-purple-400 border-purple-500/30'
                }`}>
                  {camp.type}
                </span>
                <span className={`text-[10px] uppercase font-bold font-mono ${
                  camp.status === 'Active'
                    ? isLight ? 'text-emerald-700 font-extrabold' : 'text-emerald-400'
                    : isLight ? 'text-slate-500' : 'text-slate-400'
                }`}>
                  {camp.status}
                </span>
              </div>

              <h3 className={`text-lg font-serif mt-3 font-bold ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>{camp.name}</h3>
              <p className={`text-xs mt-1 line-clamp-2 ${isLight ? 'text-slate-600 font-medium' : 'text-slate-400'}`}>{camp.description}</p>
              
              <div className={`mt-3 p-2.5 rounded-xl border text-[10px] font-mono flex items-center justify-between gap-2 ${
                isLight ? 'bg-slate-50 border-slate-200 text-slate-700' : 'bg-slate-950/60 border-white/10 text-slate-300'
              }`}>
                <div className="truncate">
                  <span className="text-[#c9a84c] font-bold">UTM Slug:</span> {camp.slug}
                </div>
                {(() => {
                  const linkedAds = analyticsCampaigns.filter(a => a.crmCampaignId === camp.id || (a.utm_campaign && a.utm_campaign.includes(camp.slug)))
                  return (
                    <button
                      onClick={() => setActiveAdsModalCamp(camp)}
                      className="px-2 py-0.5 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-500 dark:text-indigo-400 font-bold hover:bg-indigo-500/20 transition-all flex items-center gap-1 cursor-pointer flex-shrink-0"
                    >
                      <Sparkles size={11} />
                      <span>{linkedAds.length} Linked Ads</span>
                    </button>
                  )
                })()}
              </div>
            </div>

            <div className={`pt-4 border-t grid grid-cols-2 gap-3 text-xs ${isLight ? 'border-slate-200' : 'border-white/5'}`}>
              <div>
                <span className={`text-[9px] uppercase tracking-wider font-bold ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Budget Allocated</span>
                <div className={`font-mono font-bold ${isLight ? 'text-slate-900' : 'text-slate-200'}`}>KES {Number(camp.budget).toLocaleString()}</div>
              </div>
              <div>
                <span className={`text-[9px] uppercase tracking-wider font-bold ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Leads Acquired</span>
                <div className={`font-mono font-bold ${isLight ? 'text-blue-700 font-extrabold' : 'text-blue-400'}`}>{camp.leads_count || 0} Leads</div>
              </div>
              <div>
                <span className={`text-[9px] uppercase tracking-wider font-bold ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Total Revenue Won</span>
                <div className="font-mono font-bold text-[#c9a84c]">KES {((camp.total_revenue || 0)/1000000).toFixed(1)}M</div>
              </div>
              <div>
                <span className={`text-[9px] uppercase tracking-wider font-bold ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>ROI Yield Rate</span>
                <div className={`font-mono font-bold ${isLight ? 'text-emerald-700 font-extrabold' : 'text-emerald-400'}`}>{camp.conversion_rate || 0}%</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Campaign Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[99999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto crm-scroll">
          <div className={`max-w-lg w-full my-auto p-6 rounded-3xl border shadow-2xl relative font-sans transition-all duration-300 ${
            isLight
              ? 'bg-white border-[#c9a84c]/60 text-slate-900 shadow-[0_0_30px_rgba(201,168,76,0.25)]'
              : 'bg-[#0f172a] border-[#c9a84c]/40 text-slate-100 shadow-[0_0_35px_rgba(201,168,76,0.3)]'
          }`}>
            <div className={`flex items-center justify-between border-b pb-4 mb-4 ${isLight ? 'border-slate-200' : 'border-[#c9a84c]/20'}`}>
              <h3 className={`text-lg font-serif font-bold ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>Create Marketing Campaign</h3>
              <button onClick={() => setShowAddModal(false)} className={isLight ? 'text-slate-500 hover:text-slate-800' : 'text-slate-400 hover:text-slate-200'}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddCampaign} className="space-y-4 text-xs font-mono">
              <div>
                <label className={`block uppercase tracking-wider mb-1 font-bold ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>
                  Campaign Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Q4 Executive SUV Blast"
                  value={campForm.name}
                  onChange={e => setCampForm({ ...campForm, name: e.target.value })}
                  className={`w-full border rounded-xl px-3 py-2 outline-none ${
                    isLight ? 'bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400' : 'bg-slate-950 border-white/10 text-slate-200 placeholder:text-slate-500'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <PredictiveSelect
                    label="Campaign Type"
                    options={[
                      { value: 'Email Campaign', label: 'Email Campaign', badge: 'Outreach' },
                      { value: 'Paid Search', label: 'Paid Search', badge: 'SEM' },
                      { value: 'Trade Show', label: 'Trade Show', badge: 'Event' },
                      { value: 'ABM Outreach', label: 'ABM Outreach', badge: 'B2B' },
                      { value: 'Paid Social', label: 'Paid Social', badge: 'Social' }
                    ]}
                    value={campForm.type}
                    onChange={val => setCampForm({ ...campForm, type: val })}
                    isLight={isLight}
                  />
                </div>
                <div>
                  <label className={`block uppercase tracking-wider mb-1 font-bold ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>
                    Budget (KES)
                  </label>
                  <input
                    type="number"
                    value={campForm.budget}
                    onChange={e => setCampForm({ ...campForm, budget: e.target.value })}
                    className={`w-full border rounded-xl px-3 py-2 outline-none ${
                      isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-950 border-white/10 text-slate-200'
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <ModernDatePicker
                  label="Campaign Start Date"
                  value={campForm.start_date}
                  onChange={val => setCampForm({ ...campForm, start_date: val || '2026-08-01' })}
                  isLight={isLight}
                />
                <ModernDatePicker
                  label="Campaign End Date"
                  value={campForm.end_date}
                  onChange={val => setCampForm({ ...campForm, end_date: val || '2026-09-30' })}
                  isLight={isLight}
                />
              </div>

              <div>
                <label className={`block uppercase tracking-wider mb-1 font-bold ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>
                  Campaign Objective &amp; Description
                </label>
                <textarea
                  rows={3}
                  value={campForm.description}
                  onChange={e => setCampForm({ ...campForm, description: e.target.value })}
                  className={`w-full border rounded-xl px-3 py-2 outline-none ${
                    isLight ? 'bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400' : 'bg-slate-950 border-white/10 text-slate-200 placeholder:text-slate-500'
                  }`}
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className={`px-4 py-2 rounded-xl border text-xs font-bold uppercase ${
                    isLight ? 'border-slate-300 text-slate-700 hover:bg-slate-100' : 'border-slate-700 text-slate-400 hover:bg-white/5'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#c9a84c] text-slate-950 font-bold rounded-xl text-xs uppercase hover:bg-[#d9b85c] shadow-lg cursor-pointer"
                >
                  Save Campaign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Audience Segment Builder Modal */}
      {showSegmentModal && (
        <div className="fixed inset-0 z-[99999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto crm-scroll">
          <div className={`max-w-lg w-full my-auto p-6 rounded-3xl border border-l-4 border-l-purple-500 shadow-2xl relative font-sans transition-all duration-300 ${
            isLight
              ? 'bg-white border-purple-300 text-slate-900 shadow-[0_0_30px_rgba(168,85,247,0.2)]'
              : 'bg-[#0f172a] border-purple-500/40 text-slate-100 shadow-[0_0_35px_rgba(168,85,247,0.25)]'
          }`}>
            <div className={`flex items-center justify-between border-b pb-4 mb-4 ${isLight ? 'border-slate-200' : 'border-[#c9a84c]/20'}`}>
              <div className="flex items-center gap-2">
                <Sliders className="text-purple-500" size={20} />
                <h3 className={`text-lg font-serif font-bold ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>Audience Segment Builder</h3>
              </div>
              <button onClick={() => setShowSegmentModal(false)} className={isLight ? 'text-slate-500 hover:text-slate-800' : 'text-slate-400 hover:text-slate-200'}>
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4 text-xs font-mono">
              <div>
                <PredictiveSelect
                  label="Target Loyalty Tier"
                  options={[
                    { value: 'Standard', label: 'Standard Tier', badge: 'Tier 1' },
                    { value: 'Silver', label: 'Silver Tier', badge: 'Tier 2' },
                    { value: 'Gold', label: 'Gold Tier', badge: 'Tier 3' },
                    { value: 'Platinum', label: 'Platinum Tier', badge: 'VIP' }
                  ]}
                  value={segmentFilters.loyaltyTier}
                  onChange={val => setSegmentFilters({ ...segmentFilters, loyaltyTier: val })}
                  isLight={isLight}
                />
              </div>

              <div>
                <label className={`block uppercase tracking-wider mb-1 font-bold ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>
                  Inactivity Threshold (Days without Order)
                </label>
                <input
                  type="number"
                  value={segmentFilters.inactivityDays}
                  onChange={e => setSegmentFilters({ ...segmentFilters, inactivityDays: e.target.value })}
                  className={`w-full border rounded-xl px-3 py-2 outline-none ${
                    isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-950 border-white/10 text-slate-200'
                  }`}
                />
              </div>

              <div>
                <label className={`block uppercase tracking-wider mb-1 font-bold ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>
                  Minimum Lifetime Spend (KES)
                </label>
                <input
                  type="number"
                  value={segmentFilters.minSpend}
                  onChange={e => setSegmentFilters({ ...segmentFilters, minSpend: e.target.value })}
                  className={`w-full border rounded-xl px-3 py-2 outline-none ${
                    isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-950 border-white/10 text-slate-200'
                  }`}
                />
              </div>

              {/* Instant Target Size Recalculation */}
              <div className={`p-4 rounded-xl border flex items-center justify-between ${
                isLight ? 'bg-purple-50 border-purple-200 text-purple-950' : 'bg-purple-500/10 border-purple-500/30 text-purple-300'
              }`}>
                <div>
                  <span className={`text-[10px] uppercase font-bold ${isLight ? 'text-purple-800' : 'text-purple-300'}`}>Recalculated Audience Size</span>
                  <div className={`text-xl font-serif font-bold ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>{calculatedTargetCount} Target Accounts</div>
                </div>
                <div className="px-3 py-1 rounded-lg bg-purple-600 text-white text-[10px] uppercase font-bold">
                  Ready
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowSegmentModal(false)}
                  className="px-5 py-2 bg-purple-600 text-white font-bold rounded-xl text-xs uppercase hover:bg-purple-700 cursor-pointer shadow-lg"
                >
                  Save Segment Filter
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Campaign Dispatcher Modal */}
      {showBulkModal && (
        <div className="fixed inset-0 z-[999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto crm-scroll">
          <div className={`max-w-md w-full max-h-[90vh] my-auto overflow-y-auto crm-scroll p-6 rounded-3xl border border-l-4 border-l-emerald-500 shadow-2xl relative font-sans ${
            isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#0f172a] border-white/10 text-slate-100'
          }`}>
            <div className={`flex items-center justify-between border-b pb-4 mb-4 ${isLight ? 'border-slate-200' : 'border-[#c9a84c]/20'}`}>
              <div className="flex items-center gap-2">
                <Send className="text-emerald-500" size={20} />
                <h3 className={`text-lg font-serif font-bold ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>Bulk Campaign Dispatch Simulator</h3>
              </div>
              <button onClick={() => setShowBulkModal(false)} className={isLight ? 'text-slate-500 hover:text-slate-800' : 'text-slate-400 hover:text-slate-200'}>
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4 text-xs font-mono">
              <div>
                <PredictiveSelect
                  label="Target Campaign"
                  options={campaigns.map(c => ({ value: c.id, label: c.name, badge: c.type }))}
                  value={campaigns[0]?.id || ''}
                  onChange={() => {}}
                  isLight={isLight}
                />
              </div>

              <div>
                <PredictiveSelect
                  label="Outreach Channel"
                  options={[
                    { value: 'email', label: 'Bulk Email (SendGrid / AWS SES)', badge: 'Email' },
                    { value: 'sms', label: 'SMS Blast (AfricasTalking API)', badge: 'SMS' }
                  ]}
                  value="email"
                  onChange={() => {}}
                  isLight={isLight}
                />
              </div>

              {dispatchStatus.isRunning && (
                <div className="space-y-2 pt-2">
                  <div className={`flex justify-between font-bold ${isLight ? 'text-slate-800' : 'text-slate-300'}`}>
                    <span>Dispatching Queue...</span>
                    <span className="font-mono">{dispatchStatus.progress}%</span>
                  </div>
                  <div className={`w-full h-2 rounded-full overflow-hidden ${isLight ? 'bg-slate-200' : 'bg-slate-900'}`}>
                    <div className="bg-emerald-500 h-full transition-all duration-300 rounded-full" style={{ width: `${dispatchStatus.progress}%` }} />
                  </div>
                </div>
              )}

              <div className="pt-4 flex justify-end gap-3 border-t border-white/10">
                <button
                  type="button"
                  disabled={dispatchStatus.isRunning}
                  onClick={runBulkDispatch}
                  className="w-full py-2.5 bg-emerald-500 text-slate-950 font-bold rounded-xl text-xs uppercase hover:bg-emerald-400 flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                >
                  <Send size={14} />
                  <span>{dispatchStatus.isRunning ? 'Dispatching...' : 'Launch Bulk Queue'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Linked Digital Adverts Unification Modal */}
      {activeAdsModalCamp && (
        <div className="fixed inset-0 z-[999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto crm-scroll">
          <div className={`max-w-2xl w-full max-h-[90vh] my-auto overflow-y-auto crm-scroll p-6 rounded-3xl border shadow-2xl relative font-sans ${
            isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#0f172a] border-white/10 text-slate-100'
          }`}>
            <div className={`flex items-center justify-between border-b pb-4 mb-4 ${isLight ? 'border-slate-200' : 'border-[#c9a84c]/20'}`}>
              <div>
                <div className="flex items-center gap-2">
                  <Sparkles className="text-[#c9a84c]" size={20} />
                  <h3 className={`text-lg font-serif font-bold ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                    Linked Campaign Monitor Adverts
                  </h3>
                </div>
                <p className={`text-xs font-mono mt-0.5 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                  CRM Campaign: <span className="text-[#c9a84c] font-bold">{activeAdsModalCamp.name}</span>
                </p>
              </div>
              <button onClick={() => setActiveAdsModalCamp(null)} className={isLight ? 'text-slate-500 hover:text-slate-800' : 'text-slate-400 hover:text-slate-200'}>
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              {(() => {
                const linked = analyticsCampaigns.filter(a => a.crmCampaignId === activeAdsModalCamp.id || (a.utm_campaign && a.utm_campaign.includes(activeAdsModalCamp.slug)))
                if (linked.length === 0) {
                  return (
                    <div className={`p-8 text-center rounded-2xl border font-mono ${isLight ? 'bg-slate-50 border-slate-200 text-slate-600' : 'bg-slate-950/60 border-white/10 text-slate-400'}`}>
                      <Megaphone size={32} className="mx-auto mb-2 opacity-50 text-[#c9a84c]" />
                      <p className="font-bold text-sm">No Active Adverts Linked Yet</p>
                      <p className="text-xs mt-1">Create a new trackable link in Campaign Monitor aligned to this CRM Campaign.</p>
                      <Link
                        to="/analytics/campaign-monitor?tab=links"
                        onClick={() => setActiveAdsModalCamp(null)}
                        className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-[#c9a84c] text-slate-950 font-bold rounded-xl text-xs uppercase tracking-wider hover:bg-[#d9b85c] transition-all"
                      >
                        <Plus size={14} />
                        <span>Launch Ad in Campaign Monitor</span>
                      </Link>
                    </div>
                  )
                }

                return (
                  <div className="space-y-3 font-mono text-xs max-h-96 overflow-y-auto crm-scroll pr-1">
                    {linked.map(ad => (
                      <div
                        key={ad.id}
                        className={`p-4 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-3 ${
                          isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/80 border-white/10'
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#c9a84c]/20 text-[#c9a84c] border border-[#c9a84c]/30 uppercase">
                              {ad.platform}
                            </span>
                            <span className="font-bold text-sm">{ad.name}</span>
                          </div>
                          <p className={`text-[11px] mt-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                            Vehicle: <span className="text-emerald-500 font-bold">{ad.vehicleName}</span> ({ad.vehiclePrice})
                          </p>
                          <p className="text-[10px] text-slate-500 mt-0.5 truncate max-w-md">
                            UTM: <span className="text-cyan-400">{ad.utm_campaign}</span>
                          </p>
                        </div>

                        <div className="flex items-center gap-4 text-center border-t md:border-t-0 md:border-l pt-3 md:pt-0 md:pl-4 border-white/10">
                          <div>
                            <span className="text-[9px] uppercase text-slate-400 block font-bold">Clicks</span>
                            <span className="font-mono font-bold text-blue-400">{ad.clicksCount || 0}</span>
                          </div>
                          <div>
                            <span className="text-[9px] uppercase text-slate-400 block font-bold">Leads</span>
                            <span className="font-mono font-bold text-emerald-400">{ad.leadsCount || 0}</span>
                          </div>
                          <div>
                            <span className="text-[9px] uppercase text-slate-400 block font-bold">Budget</span>
                            <span className="font-mono font-bold text-[#c9a84c]">{ad.budget}</span>
                          </div>
                        </div>
                      </div>
                    ))}

                    <div className="pt-2 text-right">
                      <Link
                        to="/analytics/campaign-monitor"
                        onClick={() => setActiveAdsModalCamp(null)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs uppercase tracking-wider hover:bg-indigo-500 transition-all shadow-md"
                      >
                        <ExternalLink size={13} />
                        <span>Open Campaign Monitor Dashboard</span>
                      </Link>
                    </div>
                  </div>
                )
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
