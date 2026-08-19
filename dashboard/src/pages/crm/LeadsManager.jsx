import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useCRMStore } from '../../context/CRMStore'
import UniversalPagination from '../../components/common/UniversalPagination'
import PredictiveSelect from '../../components/common/PredictiveSelect'
import ActionTooltip from '../../components/common/ActionTooltip'
import ActionConfirmModal from '../../components/common/ActionConfirmModal'
import {
  Users, Search, Filter, Plus, UserCheck, Archive, RotateCcw, Trash2,
  Sparkles, CheckCircle2, X, Phone, Mail, Building, Tag, ArrowRight, TrendingUp,
  Eye, PenLine, Download, Upload, MessageSquare, Calendar, Zap, Check, User, ExternalLink,
  ArrowUpDown, ArrowUp, ArrowDown
} from 'lucide-react'

export default function LeadsManager() {
  const leads = useCRMStore(state => state.leads)
  const opportunities = useCRMStore(state => state.opportunities)
  const campaigns = useCRMStore(state => state.campaigns)
  const sources = useCRMStore(state => state.leadSources)
  const adminTheme = useCRMStore(state => state.adminTheme)
  const scoringWeights = useCRMStore(state => state.scoringWeights)

  // Pipeline stage labels for Kanban board position
  const STAGE_LABELS = {
    new_lead: 'New Lead',
    onboarding: 'Onboarding',
    qualified: 'Qualified',
    viewing: 'Viewing / Test Drive',
    deposit: 'Deposit Made',
    won: 'Won Deals',
    lost: 'Lost Deals',
    proposal: 'Viewing / Test Drive',
    qualification: 'Qualified',
    negotiation: 'Deposit Made'
  }

  const STAGE_COLORS = {
    new_lead: { dark: 'bg-sky-500/15 text-sky-400 border-sky-500/40', light: 'bg-sky-100 text-sky-800 border-sky-400/60' },
    onboarding: { dark: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/40', light: 'bg-indigo-100 text-indigo-800 border-indigo-400/60' },
    qualified: { dark: 'bg-blue-500/15 text-blue-400 border-blue-500/40', light: 'bg-blue-100 text-blue-800 border-blue-400/60' },
    viewing: { dark: 'bg-[#c9a84c]/15 text-[#c9a84c] border-[#c9a84c]/40', light: 'bg-amber-100 text-amber-800 border-amber-400/60' },
    deposit: { dark: 'bg-purple-500/15 text-purple-400 border-purple-500/40', light: 'bg-purple-100 text-purple-800 border-purple-400/60' },
    won: { dark: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40', light: 'bg-emerald-100 text-emerald-800 border-emerald-400/60' },
    lost: { dark: 'bg-rose-500/15 text-rose-400 border-rose-500/40', light: 'bg-rose-100 text-rose-800 border-rose-400/60' }
  }

  // Resolve a lead's pipeline stage from their linked opportunity on the Kanban board
  const getLeadPipelineStage = (lead) => {
    const opp = opportunities.find(o => o.lead_id === lead.id)
    if (opp) {
      const normalized = opp.stage === 'proposal' ? 'viewing' : opp.stage === 'qualification' ? 'qualified' : opp.stage === 'negotiation' ? 'deposit' : (opp.stage || 'new_lead')
      return normalized
    }
    // Fallback: infer from lead status
    if (lead.status === 'won' || lead.status === 'converted') return 'won'
    if (lead.status === 'qualified') return 'qualified'
    if (lead.status === 'contacted') return 'onboarding'
    return 'new_lead'
  }
  const isLight = adminTheme === 'light'
  
  const addLead = useCRMStore(state => state.addLead)
  const updateLead = useCRMStore(state => state.updateLead)
  const convertLeadToCustomer = useCRMStore(state => state.convertLeadToCustomer)
  const archiveLead = useCRMStore(state => state.archiveLead)
  const restoreLead = useCRMStore(state => state.restoreLead)
  const deleteLeadPermanently = useCRMStore(state => state.deleteLeadPermanently)
  const recalculateLeadScore = useCRMStore(state => state.recalculateLeadScore)
  const toggleLeadCriterion = useCRMStore(state => state.toggleLeadCriterion)

  const [activeTab, setActiveTab] = useState('active') // 'active' | 'archive'
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sourceFilter, setSourceFilter] = useState('all')
  const [repFilter, setRepFilter] = useState('all')
  const [intentFilter, setIntentFilter] = useState('all') // 'all' | 'high' | 'medium' | 'low'
  const [sortBy, setSortBy] = useState('score_desc') // 'score_desc' | 'score_asc' | 'newest' | 'oldest' | 'name_asc' | 'name_desc'
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false)
  const [showImportModal, setShowImportModal] = useState(false)
  const [viewTarget, setViewTarget] = useState(null)
  const [editTarget, setEditTarget] = useState(null)
  const [convertTarget, setConvertTarget] = useState(null)
  const [scoreBreakdownTarget, setScoreBreakdownTarget] = useState(null)
  const [pendingAction, setPendingAction] = useState(null)

  // Lead form
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', company: '', source: 'Direct Search',
    assigned_to: 'Alex Kimani', notes: '', campaign_id: 'camp-1', buying_timeline: '1-3 months'
  })

  // Conversion form
  const [convertForm, setConvertForm] = useState({ budget: 15000000, company: '', notes: '' })

  const handleAddLead = (e) => {
    e.preventDefault()
    if (!formData.name) return
    addLead(formData)
    setShowAddModal(false)
    setFormData({ name: '', email: '', phone: '', company: '', source: 'Direct Search', assigned_to: 'Alex Kimani', notes: '', campaign_id: 'camp-1', buying_timeline: '1-3 months' })
  }

  const handleConvertSubmit = (e) => {
    e.preventDefault()
    if (!convertTarget) return
    convertLeadToCustomer(convertTarget.id, convertForm)
    setConvertTarget(null)
  }

  const handleExportCSV = () => {
    const headers = ['ID', 'Name', 'Email', 'Phone', 'Company', 'Source', 'Status', 'Probability', 'Assigned To', 'Created At']
    const rows = displayedList.map(l => [l.id, l.name, l.email, l.phone, l.company, l.source, l.status, `${l.conversion_probability || 50}%`, l.assigned_to, l.created_at])
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.map(x => `"${x || ''}"`).join(','))].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `KnK_Leads_Export_${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleEditSubmit = (e) => {
    e.preventDefault()
    if (!editTarget) return
    updateLead(editTarget.id, editTarget)
    setEditTarget(null)
  }

  const handleImportSubmit = (e) => {
    e.preventDefault()
    const sampleLeads = [
      { name: 'Eng. Paul Kinyanjui', email: 'p.kinyanjui@kenyahighways.co.ke', phone: '+254711223344', company: 'Kenya Highways Construction', source: 'Trade Show', status: 'new', assigned_to: 'Alex Kimani', notes: 'Imported via CSV batch' },
      { name: 'Dr. Susan Wambui', email: 'susan@nairobilabs.co.ke', phone: '+254722334455', company: 'Nairobi Bio Labs', source: 'Organic Search', status: 'new', assigned_to: 'Sarah Jenkins', notes: 'Imported via CSV batch' }
    ]
    sampleLeads.forEach(addLead)
    setShowImportModal(false)
  }

  const activeLeads = leads.filter(l => l.status !== 'archived' && l.status !== 'converted')
  const archiveLeads = leads.filter(l => l.status === 'archived' || l.status === 'converted')

  const displayedList = useMemo(() => {
    const q = (searchTerm || '').toLowerCase().trim()
    return (activeTab === 'active' ? activeLeads : archiveLeads).filter(l => {
      const name = (l.name || '').toLowerCase()
      const company = (l.company || '').toLowerCase()
      const email = (l.email || '').toLowerCase()
      const phone = (l.phone || '').toLowerCase()
      const matchesSearch = !q || name.includes(q) || company.includes(q) || email.includes(q) || phone.includes(q)
      const matchesStatus = statusFilter === 'all' || l.status === statusFilter
      const matchesSource = sourceFilter === 'all' || l.source === sourceFilter
      const matchesRep = repFilter === 'all' || l.assigned_to === repFilter
      const score = l.intent_score || l.conversion_probability || 50
      const matchesIntent = intentFilter === 'all'
        ? true
        : intentFilter === 'high'
        ? score >= 75
        : intentFilter === 'medium'
        ? (score >= 45 && score < 75)
        : score < 45
      return matchesSearch && matchesStatus && matchesSource && matchesRep && matchesIntent
    }).sort((a, b) => {
      const scoreA = Number(a.intent_score || a.conversion_probability || 50)
      const scoreB = Number(b.intent_score || b.conversion_probability || 50)
      
      const parseDate = (item) => {
        if (item.created_at) {
          const t = new Date(item.created_at).getTime()
          if (!isNaN(t) && t > 0) return t
        }
        const digits = item.id ? item.id.replace(/\D/g, '') : ''
        return digits ? Number(digits) : 0
      }

      const dateA = parseDate(a)
      const dateB = parseDate(b)

      const nameA = (a.name || '').toLowerCase()
      const nameB = (b.name || '').toLowerCase()

      if (sortBy === 'score_desc') return scoreB - scoreA
      if (sortBy === 'score_asc') return scoreA - scoreB
      if (sortBy === 'newest') return dateB - dateA
      if (sortBy === 'oldest') return dateA - dateB
      if (sortBy === 'name_asc') return nameA.localeCompare(nameB)
      if (sortBy === 'name_desc') return nameB.localeCompare(nameA)

      return scoreB - scoreA
    })
  }, [activeTab, activeLeads, archiveLeads, searchTerm, statusFilter, sourceFilter, repFilter, intentFilter, sortBy])

  const totalPages = Math.ceil(displayedList.length / itemsPerPage) || 1
  const paginatedLeads = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return displayedList.slice(start, start + itemsPerPage)
  }, [displayedList, currentPage, itemsPerPage])

  // Conversion yield
  const totalConverted = leads.filter(l => l.status === 'converted' || l.status === 'won').length
  const yieldRate = Math.round((totalConverted / (leads.length || 1)) * 100)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] tracking-[4px] uppercase text-[#c9a84c] font-semibold block">Leads Directory</span>
          <h1 className={`text-3xl font-serif font-light mt-1 ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
            Manage Leads &amp; Client Directory
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <ActionTooltip text="Import Leads from CSV" isLight={isLight}>
            <button
              onClick={() => setShowImportModal(true)}
              className={`px-3.5 py-2.5 rounded-xl text-xs font-mono font-bold tracking-wider uppercase border flex items-center gap-2 transition-all cursor-pointer ${
                isLight ? 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200' : 'bg-slate-800/80 border-white/10 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Upload size={14} />
              <span>Import</span>
            </button>
          </ActionTooltip>

          <ActionTooltip text="Export Directory to CSV" isLight={isLight}>
            <button
              onClick={handleExportCSV}
              className={`px-3.5 py-2.5 rounded-xl text-xs font-mono font-bold tracking-wider uppercase border flex items-center gap-2 transition-all cursor-pointer ${
                isLight ? 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200' : 'bg-slate-800/80 border-white/10 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Download size={14} />
              <span>Export</span>
            </button>
          </ActionTooltip>

          <ActionTooltip text="Add New Client / Lead" isLight={isLight}>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2.5 bg-[#c9a84c] text-slate-950 font-bold rounded-xl text-xs tracking-wider uppercase hover:bg-[#d9b85c] transition-all flex items-center gap-2 shadow-lg cursor-pointer"
            >
              <Plus size={16} />
              <span>Add New Lead</span>
            </button>
          </ActionTooltip>
        </div>
      </div>



      {/* View Tabs */}
      <div className={`flex border-b gap-6 ${isLight ? 'border-slate-200' : 'border-white/10'}`}>
        <button
          onClick={() => setActiveTab('active')}
          className={`pb-3 text-xs tracking-widest uppercase font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
            activeTab === 'active' ? 'border-[#c9a84c] text-[#c9a84c]' : isLight ? 'border-transparent text-slate-600 hover:text-slate-900' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Users size={16} />
          <span>Active Leads ({activeLeads.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('archive')}
          className={`pb-3 text-xs tracking-widest uppercase font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
            activeTab === 'archive' ? 'border-[#c9a84c] text-[#c9a84c]' : isLight ? 'border-transparent text-slate-600 hover:text-slate-900' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Archive size={16} />
          <span>Archived &amp; Converted Leads ({archiveLeads.length})</span>
        </button>
      </div>

      {/* Archive Yield Metrics Header (if in Archive view) */}
      {activeTab === 'archive' && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 font-sans">
          {/* Card 1: Lead Conversion Rate */}
          <div
            className={`relative overflow-hidden p-5 rounded-2xl border transition-all duration-300 group hover:-translate-y-1 ${
              isLight
                ? 'bg-gradient-to-br from-emerald-50/50 via-white to-white border-slate-200 shadow-md hover:shadow-xl hover:border-emerald-300'
                : 'bg-gradient-to-br from-emerald-950/30 via-[#0f172a] to-[#0f172a] border-white/10 shadow-2xl hover:border-emerald-500/40'
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <span className={`text-[10px] tracking-[2px] uppercase font-bold block ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                  Lead Conversion Rate
                </span>
                <h3 className="text-3xl font-serif text-emerald-600 dark:text-emerald-400 mt-2 font-mono font-bold">
                  {yieldRate}%
                </h3>
              </div>
              <div className={`p-3 rounded-xl border transition-transform group-hover:scale-110 ${
                isLight ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
              }`}>
                <TrendingUp size={20} />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1.5 text-[11px] font-mono">
              <span className={`px-2 py-0.5 rounded-md font-bold ${isLight ? 'bg-emerald-100 text-emerald-800' : 'bg-emerald-500/20 text-emerald-300'}`}>
                +4.5%
              </span>
              <span className={isLight ? 'text-slate-500 font-medium' : 'text-slate-400'}>vs regional benchmark</span>
            </div>
          </div>

          {/* Card 2: Converted Customers */}
          <div
            className={`relative overflow-hidden p-5 rounded-2xl border transition-all duration-300 group hover:-translate-y-1 ${
              isLight
                ? 'bg-gradient-to-br from-blue-50/50 via-white to-white border-slate-200 shadow-md hover:shadow-xl hover:border-blue-300'
                : 'bg-gradient-to-br from-blue-950/30 via-[#0f172a] to-[#0f172a] border-white/10 shadow-2xl hover:border-blue-500/40'
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <span className={`text-[10px] tracking-[2px] uppercase font-bold block ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                  Converted Customers
                </span>
                <h3 className={`text-3xl font-serif mt-2 font-mono font-bold ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                  {totalConverted}
                </h3>
              </div>
              <div className={`p-3 rounded-xl border transition-transform group-hover:scale-110 ${
                isLight ? 'bg-blue-50 text-blue-600 border-blue-200' : 'bg-blue-500/10 text-blue-400 border-blue-500/30'
              }`}>
                <UserCheck size={20} />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1.5 text-[11px] font-mono">
              <span className={`px-2 py-0.5 rounded-md font-bold ${isLight ? 'bg-blue-100 text-blue-800' : 'bg-blue-500/20 text-blue-300'}`}>
                Active Fleet
              </span>
              <span className={isLight ? 'text-slate-500 font-medium' : 'text-slate-400'}>onboarded to CRM</span>
            </div>
          </div>

          {/* Card 3: Archived Leads */}
          <div
            className={`relative overflow-hidden p-5 rounded-2xl border transition-all duration-300 group hover:-translate-y-1 ${
              isLight
                ? 'bg-gradient-to-br from-amber-50/50 via-white to-white border-slate-200 shadow-md hover:shadow-xl hover:border-amber-300'
                : 'bg-gradient-to-br from-amber-950/30 via-[#0f172a] to-[#0f172a] border-white/10 shadow-2xl hover:border-amber-500/40'
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <span className={`text-[10px] tracking-[2px] uppercase font-bold block ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                  Archived Leads
                </span>
                <h3 className={`text-3xl font-serif mt-2 font-mono font-bold ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                  {leads.filter(l => l.status === 'archived').length}
                </h3>
              </div>
              <div className={`p-3 rounded-xl border transition-transform group-hover:scale-110 ${
                isLight ? 'bg-amber-50 text-amber-600 border-amber-200' : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
              }`}>
                <Archive size={20} />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1.5 text-[11px] font-mono">
              <span className={`px-2 py-0.5 rounded-md font-bold ${isLight ? 'bg-amber-100 text-amber-800' : 'bg-amber-500/20 text-amber-300'}`}>
                Inactive
              </span>
              <span className={isLight ? 'text-slate-500 font-medium' : 'text-slate-400'}>restorable anytime</span>
            </div>
          </div>
        </div>
      )}

      {/* Filter Toolbar */}
      <div className={`p-4 rounded-2xl border transition-all duration-300 space-y-3 ${
        isLight ? 'bg-white border-slate-200 shadow-xl' : 'bg-[#0f172a]/80 border-white/10 shadow-2xl'
      }`}>
        <div className="flex flex-col xl:flex-row gap-3 items-center justify-between w-full">
          {/* Global Search Input */}
          <div className="relative w-full xl:w-64 flex-shrink-0">
            <Search size={16} className={`absolute left-3.5 top-3 ${isLight ? 'text-slate-400' : 'text-slate-500'}`} />
            <input
              type="text"
              placeholder="Search leads by name, company..."
              value={searchTerm}
              onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
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

          {/* Predictive Filters - 5 aligned controls in responsive grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 w-full flex-1 font-mono">
            {/* Sort & Order Predictive Filter */}
            <PredictiveSelect
              isLight={isLight}
              placeholder="Sort / Order..."
              value={sortBy}
              onChange={val => { setSortBy(val || 'score_desc'); setCurrentPage(1); }}
              options={[
                { value: 'score_desc', label: '🏆 Rank: High Score First', badge: 'Default' },
                { value: 'score_asc', label: '❄️ Rank: Low Score First' },
                { value: 'newest', label: '📅 Date: Newest Leads First', badge: 'Newest' },
                { value: 'oldest', label: '⏳ Date: Oldest Leads First' },
                { value: 'name_asc', label: '🔤 Name: A to Z' },
                { value: 'name_desc', label: '🔤 Name: Z to A' }
              ]}
              className="w-full"
            />

            {/* Status Predictive Filter */}
            <PredictiveSelect
              isLight={isLight}
              placeholder="Filter Status..."
              value={statusFilter}
              onChange={val => { setStatusFilter(val || 'all'); setCurrentPage(1); }}
              options={[
                { value: 'all', label: 'All Statuses', count: (activeTab === 'active' ? activeLeads : archiveLeads).length },
                { value: 'new', label: 'New Pursuits', count: leads.filter(l => l.status === 'new').length },
                { value: 'contacted', label: 'Contacted', count: leads.filter(l => l.status === 'contacted').length },
                { value: 'qualified', label: 'Qualified', count: leads.filter(l => l.status === 'qualified').length },
                { value: 'converted', label: 'Converted', count: leads.filter(l => l.status === 'converted').length },
                { value: 'archived', label: 'Archived', count: leads.filter(l => l.status === 'archived').length }
              ]}
              className="w-full"
            />

            {/* Source Predictive Filter */}
            <PredictiveSelect
              isLight={isLight}
              placeholder="Filter Source..."
              value={sourceFilter}
              onChange={val => { setSourceFilter(val || 'all'); setCurrentPage(1); }}
              options={[
                { value: 'all', label: 'All Lead Sources', count: (activeTab === 'active' ? activeLeads : archiveLeads).length },
                ...sources.map(s => ({
                  value: s.name,
                  label: s.name,
                  count: leads.filter(l => l.source === s.name).length
                }))
              ]}
              className="w-full"
            />

            {/* Rep Predictive Filter */}
            <PredictiveSelect
              isLight={isLight}
              placeholder="Filter Sales Rep..."
              value={repFilter || 'all'}
              onChange={val => { setRepFilter(val || 'all'); setCurrentPage(1); }}
              options={[
                { value: 'all', label: 'All Sales Reps' },
                { value: 'Alex Kimani', label: 'Alex Kimani', count: leads.filter(l => l.assigned_to === 'Alex Kimani').length },
                { value: 'Sarah Jenkins', label: 'Sarah Jenkins', count: leads.filter(l => l.assigned_to === 'Sarah Jenkins').length },
                { value: 'Michael Chen', label: 'Michael Chen', count: leads.filter(l => l.assigned_to === 'Michael Chen').length }
              ]}
              className="w-full"
            />

            {/* Intent Probability Filter */}
            <PredictiveSelect
              isLight={isLight}
              placeholder="Filter Intent..."
              value={intentFilter || 'all'}
              onChange={val => { setIntentFilter(val || 'all'); setCurrentPage(1); }}
              options={[
                { value: 'all', label: 'All Intent Scores' },
                { value: 'high', label: '🔥 High Intent (≥75%)', badge: 'High' },
                { value: 'medium', label: '⚡ Medium Intent (45-74%)', badge: 'Medium' },
                { value: 'low', label: '❄️ Low Intent (<45%)', badge: 'Low' }
              ]}
              className="w-full"
            />
          </div>
        </div>

        {/* Filter Summary Ribbon & Active Chips */}
        {(searchTerm || statusFilter !== 'all' || sourceFilter !== 'all' || (repFilter && repFilter !== 'all') || sortBy !== 'score_desc') && (
          <div className="pt-2 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`text-[11px] ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Active Filters &amp; Order:</span>
              {sortBy !== 'score_desc' && (
                <span className="px-2 py-0.5 rounded-lg bg-[#c9a84c]/20 text-[#c9a84c] border border-[#c9a84c]/30 flex items-center gap-1">
                  Sorted: {sortBy === 'newest' ? 'Newest First' : sortBy === 'oldest' ? 'Oldest First' : sortBy === 'score_asc' ? 'Low Score First' : sortBy === 'name_asc' ? 'Name A-Z' : 'Name Z-A'}
                  <button onClick={() => setSortBy('score_desc')}><X size={12} /></button>
                </span>
              )}
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
              {sourceFilter !== 'all' && (
                <span className="px-2 py-0.5 rounded-lg bg-[#c9a84c]/20 text-[#c9a84c] border border-[#c9a84c]/30 flex items-center gap-1">
                  Source: {sourceFilter}
                  <button onClick={() => setSourceFilter('all')}><X size={12} /></button>
                </span>
              )}
              {repFilter && repFilter !== 'all' && (
                <span className="px-2 py-0.5 rounded-lg bg-[#c9a84c]/20 text-[#c9a84c] border border-[#c9a84c]/30 flex items-center gap-1">
                  Rep: {repFilter}
                  <button onClick={() => setRepFilter('all')}><X size={12} /></button>
                </span>
              )}
            </div>

            <button
              onClick={() => {
                setSearchTerm('')
                setStatusFilter('all')
                setSourceFilter('all')
                setRepFilter('all')
                setSortBy('score_desc')
                setCurrentPage(1)
              }}
              className="text-[11px] text-rose-400 hover:text-rose-300 underline cursor-pointer"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>

      {/* Data Table */}
      <div className={`rounded-2xl border transition-all duration-300 ${
        isLight ? 'bg-white border-slate-200 shadow-xl' : 'bg-[#0f172a]/80 border-white/10 shadow-2xl'
      }`}>
        <div className="overflow-x-auto crm-scroll pt-2 pb-2">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className={`border-b text-[10px] uppercase tracking-widest font-bold ${
                isLight ? 'bg-slate-100/90 border-slate-200 text-slate-800' : 'bg-slate-950/50 border-white/10 text-slate-400'
              }`}>
                <th className="p-4 cursor-pointer hover:text-[#c9a84c] transition-colors" onClick={() => setSortBy(sortBy === 'name_asc' ? 'name_desc' : 'name_asc')}>
                  <div className="flex items-center gap-1.5">
                    <span>Lead Name</span>
                    {sortBy === 'name_asc' ? <ArrowUp size={12} className="text-[#c9a84c]" /> : sortBy === 'name_desc' ? <ArrowDown size={12} className="text-[#c9a84c]" /> : <ArrowUpDown size={12} className="opacity-40" />}
                  </div>
                </th>
                <th className="p-4 cursor-pointer hover:text-[#c9a84c] transition-colors" onClick={() => setSortBy(sortBy === 'newest' ? 'oldest' : 'newest')}>
                  <div className="flex items-center gap-1.5">
                    <span>Contact &amp; Added Date</span>
                    {sortBy === 'newest' ? <ArrowDown size={12} className="text-[#c9a84c]" /> : sortBy === 'oldest' ? <ArrowUp size={12} className="text-[#c9a84c]" /> : <ArrowUpDown size={12} className="opacity-40" />}
                  </div>
                </th>
                <th className="p-4">Pipeline Stage</th>
                <th className="p-4 max-w-[140px] whitespace-nowrap">Lead Source</th>
                <th className="p-4 min-w-[175px] whitespace-nowrap cursor-pointer hover:text-[#c9a84c] transition-colors" onClick={() => setSortBy(sortBy === 'score_desc' ? 'score_asc' : 'score_desc')}>
                  <div className="flex items-center gap-1.5 whitespace-nowrap">
                    <span>Lead Score</span>
                    {sortBy === 'score_desc' ? <ArrowDown size={12} className="text-[#c9a84c]" /> : sortBy === 'score_asc' ? <ArrowUp size={12} className="text-[#c9a84c]" /> : <ArrowUpDown size={12} className="opacity-40" />}
                  </div>
                </th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className={`divide-y text-xs ${isLight ? 'divide-slate-200' : 'divide-white/5'}`}>
              {paginatedLeads.length === 0 ? (
                <tr>
                  <td colSpan={7} className={`p-8 text-center font-medium ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>
                    No leads found matching current filter criteria.
                  </td>
                </tr>
              ) : (
                paginatedLeads.map(lead => {
                  const prob = lead.conversion_probability || 50

                  return (
                    <tr key={lead.id} className={`transition-colors relative hover:z-30 ${isLight ? 'hover:bg-slate-50/80' : 'hover:bg-white/[0.02]'}`}>
                      {/* 1. Lead Name */}
                      <td className="p-4">
                        <Link
                          to={`/crm/leads/${lead.id}`}
                          className="group inline-flex items-center gap-2 cursor-pointer"
                        >
                          <div className={`w-6 h-6 rounded-md flex items-center justify-center transition-all group-hover:scale-110 flex-shrink-0 ${
                            isLight
                              ? 'bg-[#c9a84c]/15 text-[#9a7822] border border-[#c9a84c]/40 group-hover:bg-[#c9a84c] group-hover:text-slate-950'
                              : 'bg-[#c9a84c]/20 text-[#c9a84c] border border-[#c9a84c]/40 group-hover:bg-[#c9a84c] group-hover:text-slate-950'
                          }`}>
                            <User size={13} />
                          </div>
                          <span className={`font-serif font-bold text-sm transition-colors group-hover:text-[#c9a84c] group-hover:underline underline-offset-4 ${
                            isLight ? 'text-slate-900' : 'text-slate-100'
                          }`}>
                            {lead.name}
                          </span>
                          <ExternalLink size={11} className="opacity-40 group-hover:opacity-100 transition-all text-[#c9a84c] group-hover:translate-x-0.5" />
                        </Link>
                        <div className={`flex items-center gap-1 text-[10px] mt-0.5 ${isLight ? 'text-slate-500 font-medium' : 'text-slate-500'}`}>
                          {lead.company && <><Building size={10} className="text-slate-500" /><span>{lead.company}</span><span className="mx-0.5">·</span></>}
                          <span>Added {lead.created_at}</span>
                        </div>
                      </td>

                      {/* 2. Contact Info */}
                      <td className="p-4 space-y-0.5 font-mono">
                        <div className={`flex items-center gap-1.5 ${isLight ? 'text-slate-800 font-medium' : 'text-slate-300'}`}>
                          <Mail size={12} className="text-[#c9a84c]" />
                          <span>{lead.email}</span>
                        </div>
                        <div className={`flex items-center gap-1.5 text-[11px] ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                          <Phone size={12} className={isLight ? 'text-slate-500' : 'text-slate-500'} />
                          <span>{lead.phone}</span>
                        </div>
                      </td>

                      {/* 3. Pipeline Stage (from Kanban board position) */}
                      <td className="p-4">
                        {(() => {
                          const stageId = getLeadPipelineStage(lead)
                          const colors = STAGE_COLORS[stageId] || STAGE_COLORS.new_lead
                          return (
                            <span className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold border whitespace-nowrap ${
                              isLight ? colors.light : colors.dark
                            }`}>
                              {STAGE_LABELS[stageId] || 'New Lead'}
                            </span>
                          )
                        })()}
                      </td>

                      {/* 4. Lead Source */}
                      <td className="p-4 max-w-[140px] whitespace-nowrap truncate">
                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold border truncate max-w-[130px] inline-block ${
                          isLight ? 'bg-slate-100 text-slate-800 border-slate-300' : 'bg-slate-800 text-slate-300 border-slate-700'
                        }`} title={lead.source}>
                          {lead.source}
                        </span>
                      </td>

                      {/* 5. Lead Score */}
                      <td className="p-4 min-w-[175px] whitespace-nowrap">
                        <div className="flex items-center gap-1.5 whitespace-nowrap">
                          <button
                            onClick={() => setScoreBreakdownTarget(lead)}
                            className={`px-2.5 py-1 rounded-lg border text-[10px] font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                              prob >= 75
                                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 shadow-sm shadow-emerald-500/20 hover:bg-emerald-500/30'
                                : prob >= 45
                                ? 'bg-amber-500/20 text-amber-400 border-amber-500/40 hover:bg-amber-500/30'
                                : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
                            }`}
                          >
                            <Sparkles size={11} className={prob >= 75 ? 'text-emerald-400 animate-pulse' : 'text-amber-400'} />
                            <span className="whitespace-nowrap">{prob}% ({lead.intent_tier || (prob >= 75 ? 'HIGH' : prob >= 45 ? 'MEDIUM' : 'LOW')})</span>
                          </button>

                          <ActionTooltip text="Recalculate Lead Score" isLight={isLight}>
                            <button
                              onClick={() => recalculateLeadScore(lead.id)}
                              className={`p-1 rounded-md border text-[10px] transition-all cursor-pointer shrink-0 ${
                                isLight ? 'bg-slate-100 border-slate-300 text-slate-600 hover:text-slate-900' : 'bg-slate-800 border-white/10 text-slate-400 hover:text-white'
                              }`}
                            >
                              <RotateCcw size={11} />
                            </button>
                          </ActionTooltip>
                        </div>
                      </td>

                      {/* 6. Status */}
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-lg text-[10px] uppercase tracking-wider font-bold border ${
                          lead.status === 'converted' || lead.status === 'won'
                            ? isLight ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : lead.status === 'qualified'
                            ? isLight ? 'bg-purple-100 text-purple-800 border-purple-300' : 'bg-purple-500/10 text-purple-400 border-purple-500/30'
                            : lead.status === 'contacted'
                            ? isLight ? 'bg-blue-100 text-blue-800 border-blue-300' : 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                            : lead.status === 'archived'
                            ? isLight ? 'bg-rose-100 text-rose-800 border-rose-300' : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                            : isLight ? 'bg-amber-100 text-amber-800 border-amber-300' : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                        }`}>
                          {lead.status}
                        </span>
                      </td>

                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {activeTab === 'active' ? (
                            <>
                              <ActionTooltip text="View Lead Profile & History" isLight={isLight}>
                                <button
                                  onClick={() => setViewTarget(lead)}
                                  className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                                    isLight ? 'bg-slate-50 border-slate-300 text-slate-700 hover:bg-slate-100 hover:text-slate-900' : 'bg-slate-800/80 border-white/10 text-slate-300 hover:bg-slate-700 hover:text-white'
                                  }`}
                                >
                                  <Eye size={13} />
                                </button>
                              </ActionTooltip>

                              {lead.phone && (
                                <ActionTooltip text="Chat on WhatsApp" isLight={isLight}>
                                  <a
                                    href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                                      isLight ? 'bg-emerald-50 border-emerald-300 text-emerald-700 hover:bg-emerald-100' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                                    }`}
                                  >
                                    <MessageSquare size={13} />
                                  </a>
                                </ActionTooltip>
                              )}

                              {lead.phone && (
                                <ActionTooltip text="Call Client" isLight={isLight}>
                                  <a
                                    href={`tel:${lead.phone}`}
                                    className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                                      isLight ? 'bg-blue-50 border-blue-300 text-blue-700 hover:bg-blue-100' : 'bg-blue-500/10 border-blue-500/30 text-blue-400 hover:bg-blue-500/20'
                                    }`}
                                  >
                                    <Phone size={13} />
                                  </a>
                                </ActionTooltip>
                              )}

                              <ActionTooltip text="Edit Lead Information" isLight={isLight}>
                                <button
                                  onClick={() => setEditTarget({ ...lead })}
                                  className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                                    isLight ? 'bg-amber-50 border-amber-300 text-amber-800 hover:bg-amber-100' : 'bg-amber-500/10 border-amber-500/30 text-[#c9a84c] hover:bg-amber-500/20'
                                  }`}
                                >
                                  <PenLine size={13} />
                                </button>
                              </ActionTooltip>

                              <ActionTooltip text="Convert to Customer" isLight={isLight}>
                                <button
                                  onClick={() => { setConvertTarget(lead); setConvertForm({ budget: 15000000, company: lead.company, notes: '' }); }}
                                  className={`px-2 py-1 rounded-lg border text-[10px] uppercase font-bold flex items-center gap-1 cursor-pointer transition-all ${
                                    isLight ? 'bg-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-100' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                                  }`}
                                >
                                  <UserCheck size={12} />
                                  <span>Convert</span>
                                </button>
                              </ActionTooltip>

                              <ActionTooltip text="Archive Lead" isLight={isLight}>
                                <button
                                  onClick={() => archiveLead(lead.id)}
                                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                                    isLight ? 'text-slate-500 hover:text-amber-600 hover:bg-amber-50' : 'text-slate-500 hover:text-amber-400 hover:bg-amber-500/10'
                                  }`}
                                >
                                  <Archive size={13} />
                                </button>
                              </ActionTooltip>

                              <ActionTooltip text="Delete Lead Permanently" isLight={isLight}>
                                <button
                                  onClick={() => setPendingAction({
                                    type: 'delete',
                                    title: `Delete Lead — ${lead.name}`,
                                    description: `You are about to permanently delete lead "${lead.name}" (${lead.email || 'No email'}). This action cannot be undone. All associated data including activity history, notes, and pipeline records will be removed from the CRM.`,
                                    onConfirm: () => deleteLeadPermanently(lead.id)
                                  })}
                                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                                    isLight ? 'text-slate-500 hover:text-rose-600 hover:bg-rose-50' : 'text-slate-500 hover:text-rose-400 hover:bg-rose-500/10'
                                  }`}
                                >
                                  <Trash2 size={13} />
                                </button>
                              </ActionTooltip>
                            </>
                          ) : (
                            <ActionTooltip text="Restore Archived Lead" isLight={isLight}>
                              <button
                                onClick={() => restoreLead(lead.id)}
                                className={`px-2.5 py-1 rounded-lg border text-[10px] uppercase font-bold flex items-center gap-1 cursor-pointer transition-all ${
                                  isLight ? 'bg-blue-50 border-blue-300 text-blue-800 hover:bg-blue-100' : 'bg-blue-500/10 border-blue-500/30 text-blue-400 hover:bg-blue-500/20'
                                }`}
                              >
                                <RotateCcw size={12} />
                                <span>Restore</span>
                              </button>
                            </ActionTooltip>
                          )}
                        </div>
                      </td>

                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Universal Pagination */}
        <div className={`p-4 border-t ${isLight ? 'border-slate-200' : 'border-white/10'}`}>
          <UniversalPagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={displayedList.length}
            itemsPerPage={itemsPerPage}
            onPageChange={page => setCurrentPage(page)}
            onItemsPerPageChange={size => {
              setItemsPerPage(size)
              setCurrentPage(1)
            }}
            pageSizeOptions={[5, 10, 25, 50]}
          />
        </div>
      </div>

      {/* Add Lead Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[99999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto crm-scroll" onClick={() => setShowAddModal(false)}>
          <div onClick={e => e.stopPropagation()} className={`max-w-lg w-full my-auto p-8 rounded-3xl border-2 shadow-2xl relative font-sans transition-all duration-300 animate-in fade-in zoom-in-95 ${
            isLight
              ? 'bg-white border-[#c9a84c]/50 text-slate-900 shadow-[0_0_50px_rgba(201,168,76,0.2)]'
              : 'bg-gradient-to-br from-[#0f172a] to-[#1a1f35] border-[#c9a84c]/30 text-slate-100 shadow-[0_0_60px_rgba(201,168,76,0.15)]'
          }`}>
            {/* Gold accent line */}
            <div className="absolute top-0 left-8 right-8 h-[2px] bg-gradient-to-r from-transparent via-[#c9a84c] to-transparent rounded-full" />

            <div className={`flex items-center justify-between border-b pb-5 mb-5 ${isLight ? 'border-slate-200' : 'border-[#c9a84c]/15'}`}>
              <div>
                <span className="text-[10px] tracking-[3px] uppercase text-[#c9a84c] font-bold block mb-1">New Entry</span>
                <h3 className={`text-xl font-serif font-bold ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>Create New Prospect Lead</h3>
              </div>
              <button onClick={() => setShowAddModal(false)} className={`p-2 rounded-xl border transition-all ${isLight ? 'border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-800' : 'border-white/10 text-slate-400 hover:bg-white/5 hover:text-slate-200'}`}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleAddLead} className="space-y-5 text-[13px] font-mono">
              <div>
                <label className={`block text-[11px] uppercase tracking-wider mb-1.5 font-bold ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>
                  Lead Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none transition-all focus:ring-2 focus:ring-[#c9a84c]/30 ${
                    isLight ? 'bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400' : 'bg-slate-950/80 border-white/10 text-slate-200 placeholder:text-slate-500'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-[11px] uppercase tracking-wider mb-1.5 font-bold ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="john@company.com"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none transition-all focus:ring-2 focus:ring-[#c9a84c]/30 ${
                      isLight ? 'bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400' : 'bg-slate-950/80 border-white/10 text-slate-200 placeholder:text-slate-500'
                    }`}
                  />
                </div>
                <div>
                  <label className={`block text-[11px] uppercase tracking-wider mb-1.5 font-bold ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>
                    Phone Number
                  </label>
                  <input
                    type="text"
                    placeholder="+254..."
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none transition-all focus:ring-2 focus:ring-[#c9a84c]/30 ${
                      isLight ? 'bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400' : 'bg-slate-950/80 border-white/10 text-slate-200 placeholder:text-slate-500'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className={`block text-[11px] uppercase tracking-wider mb-1.5 font-bold ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>
                  Company / Organization
                </label>
                <input
                  type="text"
                  placeholder="Company Name"
                  value={formData.company}
                  onChange={e => setFormData({ ...formData, company: e.target.value })}
                  className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none transition-all focus:ring-2 focus:ring-[#c9a84c]/30 ${
                    isLight ? 'bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400' : 'bg-slate-950/80 border-white/10 text-slate-200 placeholder:text-slate-500'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <PredictiveSelect
                    label="Acquisition Source"
                    options={sources.map(s => ({ value: s.name, label: s.name, badge: s.type }))}
                    value={formData.source}
                    onChange={val => setFormData({ ...formData, source: val })}
                    isLight={isLight}
                  />
                </div>
                <div>
                  <PredictiveSelect
                    label="Attributed Campaign"
                    options={campaigns.map(c => ({ value: c.id, label: c.name, badge: c.type }))}
                    value={formData.campaign_id}
                    onChange={val => setFormData({ ...formData, campaign_id: val })}
                    isLight={isLight}
                  />
                </div>
              </div>

              <div>
                <PredictiveSelect
                  label="Buying Timeline"
                  options={[
                    { value: '< 30 days', label: '🔥 Within 30 Days', badge: 'Urgent' },
                    { value: '1-3 months', label: '⚡ 1–3 Months', badge: 'Active' },
                    { value: '3+ months', label: '❄️ 3+ Months', badge: 'Planning' }
                  ]}
                  value={formData.buying_timeline}
                  onChange={val => setFormData({ ...formData, buying_timeline: val })}
                  isLight={isLight}
                />
              </div>

              <div className={`pt-5 flex justify-end gap-3 border-t ${isLight ? 'border-slate-200' : 'border-white/10'}`}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className={`px-5 py-2.5 rounded-xl border text-xs font-bold uppercase transition-all ${
                    isLight ? 'border-slate-300 text-slate-700 hover:bg-slate-100' : 'border-slate-700 text-slate-400 hover:bg-white/5'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#c9a84c] text-slate-950 font-bold rounded-xl text-xs uppercase hover:bg-[#d9b85c] shadow-lg shadow-[#c9a84c]/20 cursor-pointer transition-all"
                >
                  Save Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Convert Lead Modal */}
      {convertTarget && (
        <div className="fixed inset-0 z-[99999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto crm-scroll" onClick={() => setConvertTarget(null)}>
          <div onClick={e => e.stopPropagation()} className={`max-w-md w-full my-auto p-8 rounded-3xl border-2 shadow-2xl relative font-sans transition-all duration-300 ${
            isLight
              ? 'bg-white border-emerald-400/60 text-slate-900 shadow-[0_0_50px_rgba(16,185,129,0.15)]'
              : 'bg-gradient-to-br from-[#0f172a] to-[#0f1f1a] border-emerald-500/30 text-slate-100 shadow-[0_0_60px_rgba(16,185,129,0.12)]'
          }`}>
            {/* Emerald accent line */}
            <div className="absolute top-0 left-8 right-8 h-[2px] bg-gradient-to-r from-transparent via-emerald-500 to-transparent rounded-full" />

            <div className={`flex items-center justify-between border-b pb-5 mb-5 ${isLight ? 'border-slate-200' : 'border-emerald-500/15'}`}>
              <div>
                <span className="text-[10px] tracking-[3px] uppercase text-emerald-500 font-bold block mb-1">Conversion</span>
                <h3 className={`text-xl font-serif font-bold ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>Convert Lead to Customer</h3>
              </div>
              <button onClick={() => setConvertTarget(null)} className={`p-2 rounded-xl border transition-all ${isLight ? 'border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-800' : 'border-white/10 text-slate-400 hover:bg-white/5 hover:text-slate-200'}`}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleConvertSubmit} className="space-y-5 text-[13px] font-mono">
              <p className={`text-sm leading-relaxed ${isLight ? 'text-slate-700 font-medium' : 'text-slate-300'}`}>
                Converting <strong className="text-[#c9a84c] font-serif font-bold">{convertTarget.name}</strong> will create a Customer Onboarding record and initiate a high-probability sales deal.
              </p>

              <div>
                <label className={`block text-[11px] uppercase tracking-wider mb-1.5 font-bold ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>
                  Expected Opportunity Budget (KES)
                </label>
                <input
                  type="number"
                  value={convertForm.budget}
                  onChange={e => setConvertForm({ ...convertForm, budget: e.target.value })}
                  className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none transition-all focus:ring-2 focus:ring-emerald-500/30 ${
                    isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-950/80 border-white/10 text-slate-200'
                  }`}
                />
              </div>

              <div className={`pt-5 flex justify-end gap-3 border-t ${isLight ? 'border-slate-200' : 'border-white/10'}`}>
                <button
                  type="button"
                  onClick={() => setConvertTarget(null)}
                  className={`px-5 py-2.5 rounded-xl border text-xs font-bold uppercase transition-all ${
                    isLight ? 'border-slate-300 text-slate-700 hover:bg-slate-100' : 'border-slate-700 text-slate-400 hover:bg-white/5'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-emerald-500 text-slate-950 font-bold rounded-xl text-xs uppercase hover:bg-emerald-400 shadow-lg shadow-emerald-500/20 cursor-pointer transition-all"
                >
                  Confirm Conversion
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Lead Profile Modal */}
      {viewTarget && (
        <div className="fixed inset-0 z-[99999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto crm-scroll" onClick={() => setViewTarget(null)}>
          <div onClick={e => e.stopPropagation()} className={`max-w-lg w-full my-auto p-8 rounded-3xl border-2 shadow-2xl relative font-sans transition-all duration-300 ${
            isLight
              ? 'bg-white border-[#c9a84c]/40 text-slate-900 shadow-[0_0_50px_rgba(201,168,76,0.12)]'
              : 'bg-gradient-to-br from-[#0f172a] to-[#1a1f35] border-[#c9a84c]/25 text-slate-100 shadow-[0_0_60px_rgba(201,168,76,0.1)]'
          }`}>
            {/* Gold accent line */}
            <div className="absolute top-0 left-8 right-8 h-[2px] bg-gradient-to-r from-transparent via-[#c9a84c] to-transparent rounded-full" />

            <div className={`flex items-center justify-between border-b pb-5 mb-5 ${isLight ? 'border-slate-200' : 'border-[#c9a84c]/15'}`}>
              <div>
                <span className="text-[10px] tracking-[3px] uppercase text-[#c9a84c] font-bold block mb-1">Lead Profile</span>
                <h3 className={`text-xl font-serif font-bold ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>{viewTarget.name}</h3>
              </div>
              <button onClick={() => setViewTarget(null)} className={`p-2 rounded-xl border transition-all ${isLight ? 'border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-800' : 'border-white/10 text-slate-400 hover:bg-white/5 hover:text-slate-200'}`}>
                <X size={16} />
              </button>
            </div>

            <div className="space-y-4 text-[13px] font-mono">
              <div className="grid grid-cols-2 gap-4">
                <div className={`p-4 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/60 border-white/10'}`}>
                  <span className={`text-[10px] uppercase font-bold block mb-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Company</span>
                  <span className={`font-bold font-sans text-sm ${isLight ? 'text-slate-900' : 'text-slate-200'}`}>{viewTarget.company || 'Individual'}</span>
                </div>
                <div className={`p-4 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/60 border-white/10'}`}>
                  <span className={`text-[10px] uppercase font-bold block mb-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Source Channel</span>
                  <span className="font-bold text-[#c9a84c] text-sm">{viewTarget.source}</span>
                </div>
              </div>

              <div className={`p-4 rounded-xl border space-y-3 ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/60 border-white/10'}`}>
                <div className="flex items-center gap-3">
                  <Mail size={15} className="text-[#c9a84c]" />
                  <span className="text-sm">{viewTarget.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone size={15} className={isLight ? 'text-slate-500' : 'text-slate-400'} />
                  <span className="text-sm">{viewTarget.phone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Building size={15} className={isLight ? 'text-slate-500' : 'text-slate-400'} />
                  <span className="text-sm">Assigned Rep: <strong>{viewTarget.assigned_to}</strong></span>
                </div>
              </div>

              <div className={`p-4 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/60 border-white/10'}`}>
                <span className={`text-[10px] uppercase font-bold block mb-1.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Lead Notes & Interest</span>
                <p className={`font-sans text-sm leading-relaxed ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>{viewTarget.notes || 'No specific lead notes provided.'}</p>
              </div>

              <div className={`pt-4 flex justify-between items-center border-t ${isLight ? 'border-slate-200' : 'border-white/10'}`}>
                <span className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Registered on {viewTarget.created_at}</span>
                <button
                  onClick={() => setViewTarget(null)}
                  className="px-5 py-2.5 bg-[#c9a84c] text-slate-950 font-bold rounded-xl text-xs uppercase hover:bg-[#d9b85c] shadow-lg shadow-[#c9a84c]/20 cursor-pointer transition-all"
                >
                  Close Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Lead Modal */}
      {editTarget && (
        <div className="fixed inset-0 z-[99999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto crm-scroll" onClick={() => setEditTarget(null)}>
          <div onClick={e => e.stopPropagation()} className={`max-w-lg w-full my-auto p-8 rounded-3xl border-2 shadow-2xl relative font-sans transition-all duration-300 ${
            isLight
              ? 'bg-white border-amber-400/50 text-slate-900 shadow-[0_0_50px_rgba(201,168,76,0.15)]'
              : 'bg-gradient-to-br from-[#0f172a] to-[#1a1f35] border-amber-500/25 text-slate-100 shadow-[0_0_60px_rgba(201,168,76,0.1)]'
          }`}>
            {/* Amber accent line */}
            <div className="absolute top-0 left-8 right-8 h-[2px] bg-gradient-to-r from-transparent via-amber-500 to-transparent rounded-full" />

            <div className={`flex items-center justify-between border-b pb-5 mb-5 ${isLight ? 'border-slate-200' : 'border-[#c9a84c]/15'}`}>
              <div>
                <span className="text-[10px] tracking-[3px] uppercase text-amber-500 font-bold block mb-1">Edit Record</span>
                <h3 className={`text-xl font-serif font-bold ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>Edit Lead Record</h3>
              </div>
              <button onClick={() => setEditTarget(null)} className={`p-2 rounded-xl border transition-all ${isLight ? 'border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-800' : 'border-white/10 text-slate-400 hover:bg-white/5 hover:text-slate-200'}`}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-5 text-[13px] font-mono">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-[11px] uppercase tracking-wider mb-1.5 font-bold ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>Full Name</label>
                  <input
                    type="text"
                    value={editTarget.name}
                    onChange={e => setEditTarget({ ...editTarget, name: e.target.value })}
                    className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none transition-all focus:ring-2 focus:ring-[#c9a84c]/30 ${
                      isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-950/80 border-white/10 text-slate-200'
                    }`}
                  />
                </div>
                <div>
                  <label className={`block text-[11px] uppercase tracking-wider mb-1.5 font-bold ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>Company Name</label>
                  <input
                    type="text"
                    value={editTarget.company || ''}
                    onChange={e => setEditTarget({ ...editTarget, company: e.target.value })}
                    className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none transition-all focus:ring-2 focus:ring-[#c9a84c]/30 ${
                      isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-950/80 border-white/10 text-slate-200'
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-[11px] uppercase tracking-wider mb-1.5 font-bold ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>Email Address</label>
                  <input
                    type="email"
                    value={editTarget.email || ''}
                    onChange={e => setEditTarget({ ...editTarget, email: e.target.value })}
                    className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none transition-all focus:ring-2 focus:ring-[#c9a84c]/30 ${
                      isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-950/80 border-white/10 text-slate-200'
                    }`}
                  />
                </div>
                <div>
                  <label className={`block text-[11px] uppercase tracking-wider mb-1.5 font-bold ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>Phone Number</label>
                  <input
                    type="text"
                    value={editTarget.phone || ''}
                    onChange={e => setEditTarget({ ...editTarget, phone: e.target.value })}
                    className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none transition-all focus:ring-2 focus:ring-[#c9a84c]/30 ${
                      isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-950/80 border-white/10 text-slate-200'
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <PredictiveSelect
                    label="Lead Status"
                    options={[
                      { value: 'new', label: 'NEW' },
                      { value: 'contacted', label: 'CONTACTED' },
                      { value: 'qualified', label: 'QUALIFIED' },
                      { value: 'converted', label: 'CONVERTED' },
                      { value: 'archived', label: 'ARCHIVED' }
                    ]}
                    value={editTarget.status}
                    onChange={val => setEditTarget({ ...editTarget, status: val })}
                    isLight={isLight}
                  />
                </div>
                <div>
                  <PredictiveSelect
                    label="Assigned Sales Rep"
                    options={[
                      { value: 'Alex Kimani', label: 'Alex Kimani' },
                      { value: 'Sarah Jenkins', label: 'Sarah Jenkins' },
                      { value: 'Michael Chen', label: 'Michael Chen' }
                    ]}
                    value={editTarget.assigned_to}
                    onChange={val => setEditTarget({ ...editTarget, assigned_to: val })}
                    isLight={isLight}
                  />
                </div>
              </div>

              <div>
                <PredictiveSelect
                  label="Buying Timeline"
                  options={[
                    { value: '< 30 days', label: '🔥 Within 30 Days', badge: 'Urgent' },
                    { value: '1-3 months', label: '⚡ 1–3 Months', badge: 'Active' },
                    { value: '3+ months', label: '❄️ 3+ Months', badge: 'Planning' }
                  ]}
                  value={editTarget.buying_timeline || '1-3 months'}
                  onChange={val => setEditTarget({ ...editTarget, buying_timeline: val })}
                  isLight={isLight}
                />
              </div>

              <div className={`pt-5 flex justify-end gap-3 border-t ${isLight ? 'border-slate-200' : 'border-white/10'}`}>
                <button
                  type="button"
                  onClick={() => setEditTarget(null)}
                  className={`px-5 py-2.5 rounded-xl border text-xs font-bold uppercase transition-all ${
                    isLight ? 'border-slate-300 text-slate-700 hover:bg-slate-100' : 'border-slate-700 text-slate-400 hover:bg-white/5'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#c9a84c] text-slate-950 font-bold rounded-xl text-xs uppercase hover:bg-[#d9b85c] shadow-lg shadow-[#c9a84c]/20 cursor-pointer transition-all"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Import Leads Modal */}
      {showImportModal && (
        <div className="fixed inset-0 z-[99999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto crm-scroll" onClick={() => setShowImportModal(false)}>
          <div onClick={e => e.stopPropagation()} className={`max-w-md w-full my-auto p-8 rounded-3xl border-2 shadow-2xl relative font-sans transition-all duration-300 ${
            isLight
              ? 'bg-white border-[#c9a84c]/40 text-slate-900 shadow-[0_0_50px_rgba(201,168,76,0.12)]'
              : 'bg-gradient-to-br from-[#0f172a] to-[#1a1f35] border-[#c9a84c]/25 text-slate-100 shadow-[0_0_60px_rgba(201,168,76,0.1)]'
          }`}>
            {/* Gold accent line */}
            <div className="absolute top-0 left-8 right-8 h-[2px] bg-gradient-to-r from-transparent via-[#c9a84c] to-transparent rounded-full" />

            <div className={`flex items-center justify-between border-b pb-5 mb-5 ${isLight ? 'border-slate-200' : 'border-[#c9a84c]/15'}`}>
              <div>
                <span className="text-[10px] tracking-[3px] uppercase text-[#c9a84c] font-bold block mb-1">Bulk Import</span>
                <h3 className={`text-xl font-serif font-bold ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>Import Leads via CSV</h3>
              </div>
              <button onClick={() => setShowImportModal(false)} className={`p-2 rounded-xl border transition-all ${isLight ? 'border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-800' : 'border-white/10 text-slate-400 hover:bg-white/5 hover:text-slate-200'}`}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleImportSubmit} className="space-y-5 text-[13px] font-mono">
              <div className={`p-6 rounded-2xl border-2 border-dashed text-center space-y-3 transition-all hover:border-[#c9a84c]/50 ${
                isLight ? 'bg-slate-50 border-slate-300 text-slate-600' : 'bg-slate-950/60 border-white/20 text-slate-400'
              }`}>
                <div className={`w-12 h-12 rounded-2xl mx-auto flex items-center justify-center ${isLight ? 'bg-amber-50' : 'bg-[#c9a84c]/10'}`}>
                  <Upload size={22} className="text-[#c9a84c]" />
                </div>
                <p className="font-sans font-semibold text-sm">Drag and drop your lead list CSV here</p>
                <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>or click to browse files</p>
                <span className="text-[11px] text-slate-500 block">Accepted formats: .csv, .xlsx (Max 5,000 leads)</span>
              </div>

              <div className={`pt-5 flex justify-end gap-3 border-t ${isLight ? 'border-slate-200' : 'border-white/10'}`}>
                <button
                  type="button"
                  onClick={() => setShowImportModal(false)}
                  className={`px-5 py-2.5 rounded-xl border text-xs font-bold uppercase transition-all ${
                    isLight ? 'border-slate-300 text-slate-700 hover:bg-slate-100' : 'border-slate-700 text-slate-400 hover:bg-white/5'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#c9a84c] text-slate-950 font-bold rounded-xl text-xs uppercase hover:bg-[#d9b85c] shadow-lg shadow-[#c9a84c]/20 cursor-pointer transition-all"
                >
                  Simulate Import Batch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Intent Signals Breakdown Modal */}
      {scoreBreakdownTarget && (
        <div className="fixed inset-0 z-[99999] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto crm-scroll" onClick={() => setScoreBreakdownTarget(null)}>
          <div onClick={e => e.stopPropagation()} className={`max-w-2xl w-full my-auto p-8 rounded-3xl border-2 shadow-2xl relative font-sans transition-all duration-300 ${
            isLight
              ? 'bg-white border-[#c9a84c]/40 text-slate-900 shadow-[0_0_50px_rgba(201,168,76,0.12)]'
              : 'bg-gradient-to-br from-[#0f172a] via-[#111827] to-[#1a1f35] border-[#c9a84c]/30 text-slate-100 shadow-[0_0_60px_rgba(201,168,76,0.15)]'
          }`}>
            <div className="absolute top-0 left-8 right-8 h-[2px] bg-gradient-to-r from-transparent via-[#c9a84c] to-transparent rounded-full" />

            <div className={`flex items-center justify-between border-b pb-4 mb-5 ${isLight ? 'border-slate-200' : 'border-white/10'}`}>
              <div>
                <span className="text-[10px] tracking-[3px] uppercase text-[#c9a84c] font-bold block mb-1">Intent Scoring Telemetry</span>
                <h3 className={`text-2xl font-serif font-bold ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                  {scoreBreakdownTarget.name} — Signals Breakdown
                </h3>
              </div>
              <button onClick={() => setScoreBreakdownTarget(null)} className={`p-2 rounded-xl border transition-all ${isLight ? 'border-slate-200 text-slate-500 hover:bg-slate-100' : 'border-white/10 text-slate-400 hover:bg-white/5'}`}>
                <X size={16} />
              </button>
            </div>

            {/* Score Summary Banner */}
            <div className={`p-4 rounded-2xl border flex items-center justify-between mb-6 ${
              (scoreBreakdownTarget.intent_score || scoreBreakdownTarget.conversion_probability || 50) >= 75
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : (scoreBreakdownTarget.intent_score || scoreBreakdownTarget.conversion_probability || 50) >= 45
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                : 'bg-slate-800/80 border-slate-700 text-slate-300'
            }`}>
              <div>
                <span className="text-[10px] uppercase tracking-widest font-mono font-bold text-slate-400">Total Purchase Intent Score</span>
                <div className="text-3xl font-mono font-bold mt-1">
                  {scoreBreakdownTarget.intent_score || scoreBreakdownTarget.conversion_probability || 50}% ({scoreBreakdownTarget.intent_tier || ((scoreBreakdownTarget.intent_score || scoreBreakdownTarget.conversion_probability || 50) >= 75 ? 'HIGH POSSIBILITY BUYER' : 'MEDIUM POSSIBILITY BUYER')})
                </div>
              </div>
              <button
                onClick={async () => {
                  await recalculateLeadScore(scoreBreakdownTarget.id)
                  const updated = leads.find(l => l.id === scoreBreakdownTarget.id)
                  if (updated) setScoreBreakdownTarget(updated)
                }}
                className="px-4 py-2 bg-[#c9a84c] text-slate-950 font-bold rounded-xl text-xs uppercase hover:bg-[#d9b85c] flex items-center gap-1.5 cursor-pointer shadow-lg"
              >
                <RotateCcw size={13} />
                <span>Recalculate Telemetry</span>
              </button>
            </div>

            {/* 12 Lead Scoring Criteria Checklist (Interactive Admin Toggle) */}
            <div className="space-y-2.5 max-h-[50vh] overflow-y-auto crm-scroll pr-1">
              {[
                { key: 'appointment_booked', label: 'Lead Booking Appointment', pts: `+${scoringWeights?.booking_appointment || 5}`, triggered: !!scoreBreakdownTarget.behavioral_metrics?.appointment_booked, val: scoreBreakdownTarget.behavioral_metrics?.appointment_booked ? 'Viewing Slot Confirmed' : `Click to Toggle (+${scoringWeights?.booking_appointment || 5} pts)` },
                { key: 'showed_up', label: 'Lead Showing Up for Vehicle Viewing', pts: `+${scoringWeights?.showed_up_viewing || 15}`, triggered: !!scoreBreakdownTarget.behavioral_metrics?.showed_up, val: scoreBreakdownTarget.behavioral_metrics?.showed_up ? 'Physically Attended Viewing' : `Click to Toggle (+${scoringWeights?.showed_up_viewing || 15} pts)` },
                { key: 'tradein_uploaded', label: 'Trade-In Page Visited & Photos Uploaded', pts: `+${scoringWeights?.tradein_photos || 15}`, triggered: !!scoreBreakdownTarget.behavioral_metrics?.tradein_uploaded, val: scoreBreakdownTarget.behavioral_metrics?.tradein_uploaded ? 'Photos Appraisal Submitted' : `Click to Toggle (+${scoringWeights?.tradein_photos || 15} pts)` },
                { key: 'buying_timeline', label: 'Buying Timeline Stated (< 30 Days)', pts: `+${scoringWeights?.buying_timeline || 15}`, triggered: scoreBreakdownTarget.buying_timeline === '< 30 days', val: scoreBreakdownTarget.buying_timeline || '< 30 days' },
                { key: 'forms_submitted', label: 'Forms Filled & Submitted', pts: `+${scoringWeights?.form_submitted || 10}`, triggered: (scoreBreakdownTarget.behavioral_metrics?.forms_submitted || 0) >= 1, val: `${scoreBreakdownTarget.behavioral_metrics?.forms_submitted || 0} forms submitted` },
                { key: 'video_watch_high', label: 'Video Sequence Watched (≥ 75%)', pts: `+${scoringWeights?.video_watch_high || 10}`, triggered: (scoreBreakdownTarget.behavioral_metrics?.max_video_pct || 0) >= 75, val: `Max Watch %: ${scoreBreakdownTarget.behavioral_metrics?.max_video_pct || 0}%` },
                { key: 'vehicle_views', label: 'Vehicle Detail Pages Viewed (≥ 4)', pts: `+${scoringWeights?.vehicle_views || 5}`, triggered: (scoreBreakdownTarget.behavioral_metrics?.vehicle_views || 0) >= 4, val: `${scoreBreakdownTarget.behavioral_metrics?.vehicle_views || 0} vehicle views` },
                { key: 'returns_7d', label: 'Return Visit within 7 Days', pts: `+${scoringWeights?.return_visit || 5}`, triggered: scoreBreakdownTarget.behavioral_metrics?.returns_7d === true, val: scoreBreakdownTarget.behavioral_metrics?.returns_7d === true ? 'Returned within 7 days' : 'Single session' },
                { key: 'whatsapp_clicks', label: 'WhatsApp Clicks & Chat Initiated', pts: `+${scoringWeights?.whatsapp_click || 5}`, triggered: (scoreBreakdownTarget.behavioral_metrics?.whatsapp_clicks || 0) > 0, val: `${scoreBreakdownTarget.behavioral_metrics?.whatsapp_clicks || 0} WhatsApp clicks` },
                { key: 'similar_time_min', label: 'Time Spent Viewing Similar Models (≥ 3m)', pts: `+${scoringWeights?.similar_time || 4}`, triggered: (scoreBreakdownTarget.behavioral_metrics?.similar_time_min || 0) >= 3, val: `${scoreBreakdownTarget.behavioral_metrics?.similar_time_min || 0} minutes` },
                { key: 'photos_downloaded', label: 'Photo Downloads / Shares', pts: `+${scoringWeights?.photo_download || 3}`, triggered: (scoreBreakdownTarget.behavioral_metrics?.photos_downloaded || 0) > 0, val: `${scoreBreakdownTarget.behavioral_metrics?.photos_downloaded || 0} downloads` },
                { key: 'blogs_viewed', label: 'Vehicle Blog Posts Viewed', pts: `+${scoringWeights?.blog_view || 3}`, triggered: (scoreBreakdownTarget.behavioral_metrics?.blogs_viewed || 0) > 0, val: `${scoreBreakdownTarget.behavioral_metrics?.blogs_viewed || 0} articles read` }
              ].map((c, i) => (
                <div
                  key={i}
                  onClick={() => {
                    toggleLeadCriterion(scoreBreakdownTarget.id, c.key)
                    setTimeout(() => {
                      const updated = useCRMStore.getState().leads.find(l => l.id === scoreBreakdownTarget.id)
                      if (updated) setScoreBreakdownTarget({ ...updated })
                    }, 80)
                  }}
                  className={`p-3 rounded-xl border flex items-center justify-between font-mono text-xs cursor-pointer transition-all duration-150 hover:scale-[1.01] ${
                    c.triggered
                      ? isLight ? 'bg-emerald-50 border-emerald-300 text-emerald-900 shadow-sm' : 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300 shadow-md'
                      : isLight ? 'bg-slate-50 border-slate-200 text-slate-500 hover:border-amber-400' : 'bg-slate-900/50 border-white/5 text-slate-500 hover:border-amber-500/40'
                  }`}
                  title="Click to toggle criterion for this lead"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] transition-all ${
                      c.triggered ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30' : 'bg-slate-800 text-slate-400 border border-slate-600'
                    }`}>
                      {c.triggered ? '✓' : '•'}
                    </div>
                    <div>
                      <div className="font-sans font-semibold text-xs flex items-center gap-1.5">
                        <span>{c.label}</span>
                        <span className="text-[9px] uppercase font-bold text-[#c9a84c] opacity-80">(Toggle)</span>
                      </div>
                      <div className="text-[10px] opacity-75">{c.val}</div>
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-lg font-bold text-xs ${
                    c.triggered ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {c.pts} pts
                  </span>
                </div>
              ))}
            </div>

            <div className={`mt-6 pt-4 border-t flex justify-end ${isLight ? 'border-slate-200' : 'border-white/10'}`}>
              <button
                onClick={() => setScoreBreakdownTarget(null)}
                className="px-6 py-2.5 bg-slate-800 text-white font-bold rounded-xl text-xs uppercase hover:bg-slate-700 transition-all"
              >
                Close Breakdown
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Action Confirmation Modal */}
      <ActionConfirmModal
        isOpen={!!pendingAction}
        onClose={() => setPendingAction(null)}
        onConfirm={pendingAction?.onConfirm || (() => {})}
        title={pendingAction?.title || ''}
        description={pendingAction?.description || ''}
        actionType={pendingAction?.type || 'confirm'}
        confirmText={pendingAction?.confirmText}
        isLight={isLight}
      />
    </div>
  )
}

