import React, { useState, useMemo } from 'react'
import { useCRMStore } from '../../context/CRMStore'
import ActionTooltip from '../../components/common/ActionTooltip'
import UniversalPagination from '../../components/common/UniversalPagination'
import { TrendingUp, Plus, Search, Calendar, DollarSign, ArrowUpDown, X, Edit3, Car, UserCheck, Building, Tag, Sparkles, CheckCircle2, RefreshCw, Archive, Trash2, RotateCcw } from 'lucide-react'
import ModernDatePicker from '../../components/common/ModernDatePicker'
import PredictiveSelect from '../../components/common/PredictiveSelect'

export default function OpportunitiesGrid() {
  const opportunities = useCRMStore(state => state.opportunities)
  const leads = useCRMStore(state => state.leads)
  const rawInventory = useCRMStore(state => state.vehicleInventory)
  const vehicleInventory = useMemo(() => rawInventory || [], [rawInventory])

  const rawCampaigns = useCRMStore(state => state.campaigns)
  const campaigns = useMemo(() => rawCampaigns || [], [rawCampaigns])
  const adminTheme = useCRMStore(state => state.adminTheme)
  const isLight = adminTheme === 'light'
  
  const addOpportunity = useCRMStore(state => state.addOpportunity)
  const updateOpportunity = useCRMStore(state => state.updateOpportunity)
  const archiveOpportunity = useCRMStore(state => state.archiveOpportunity)
  const restoreOpportunity = useCRMStore(state => state.restoreOpportunity)
  const deleteOpportunity = useCRMStore(state => state.deleteOpportunity)

  const leadOptions = useMemo(() => {
    return leads.map(l => ({
      value: l.id,
      label: `${l.name} — ${l.company || 'Individual'}`,
      badge: l.status,
      subtext: l.email
    }))
  }, [leads])

  const vehicleOptions = useMemo(() => {
    return vehicleInventory.map(v => ({
      value: v.id,
      label: `${v.name}`,
      badge: `KES ${(v.price / 1000000).toFixed(1)}M`,
      subtext: `${v.category} • In Stock (${v.stock})`
    }))
  }, [vehicleInventory])

  const stageOptions = [
    { value: 'new_lead', label: 'New Lead', badge: 'Fresh Capture' },
    { value: 'onboarding', label: 'Onboarding', badge: 'Client Setup' },
    { value: 'qualified', label: 'Qualified', badge: 'Verified Intent' },
    { value: 'viewing', label: 'Viewing / Test Drive', badge: 'Active Demo' },
    { value: 'deposit', label: 'Deposit Made', badge: 'Commitment' },
    { value: 'won', label: 'Won Deals', badge: 'Closed Won' },
    { value: 'lost', label: 'Lost Deals', badge: 'Closed Lost' }
  ]

  const campaignOptions = useMemo(() => {
    return [
      { value: '', label: 'No Campaign Attribution' },
      ...campaigns.map(c => ({
        value: c.id,
        label: c.name,
        badge: c.type,
        subtext: c.status
      }))
    ]
  }, [campaigns])

  const [searchTerm, setSearchTerm] = useState('')
  const [stageFilter, setStageFilter] = useState('all')
  const [vehicleFilter, setVehicleFilter] = useState('all')
  const [sortField, setSortField] = useState('expected_value')
  const [sortAsc, setSortAsc] = useState(false)

  // View Mode: 'active' or 'archived'
  const [viewMode, setViewMode] = useState('active')

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  // Modals & Action Target States
  const [showModal, setShowModal] = useState(false)
  const [editingOpp, setEditingOpp] = useState(null)
  const [isSaving, setIsSaving] = useState(false)
  const [showSavedModal, setShowSavedModal] = useState(false)
  const [savedOppData, setSavedOppData] = useState(null)

  const [archiveTarget, setArchiveTarget] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [restoreTarget, setRestoreTarget] = useState(null)
  const [actionSuccessModal, setActionSuccessModal] = useState(null)

  const [formData, setFormData] = useState({
    name: '',
    expected_value: 22500000,
    close_date: '2026-08-30',
    probability: 70,
    stage: 'qualification',
    lead_id: 'lead-1',
    vehicle_id: 'veh-101',
    vehicle_name: 'Toyota Land Cruiser V8 ZX (2024)',
    campaign_id: 'camp-1',
    notes: ''
  })

  const handleLeadChange = (leadId) => {
    const selectedLead = leads.find(l => l.id === leadId)
    const veh = vehicleInventory.find(v => v.id === formData.vehicle_id)
    const vehShort = veh ? veh.name.split('(')[0].trim() : ''
    const autoTitle = selectedLead ? `${selectedLead.company || selectedLead.name} ${vehShort} Pursuit`.trim() : formData.name

    setFormData(prev => ({
      ...prev,
      lead_id: leadId,
      name: prev.name && !editingOpp ? prev.name : autoTitle
    }))
  }

  const handleVehicleChange = (vehId) => {
    const veh = vehicleInventory.find(v => v.id === vehId)
    if (!veh) return

    const selectedLead = leads.find(l => l.id === formData.lead_id)
    const vehShort = veh.name.split('(')[0].trim()
    const autoTitle = selectedLead ? `${selectedLead.company || selectedLead.name} ${vehShort} Pursuit`.trim() : `${veh.name} Pursuit`

    setFormData(prev => ({
      ...prev,
      vehicle_id: veh.id,
      vehicle_name: veh.name,
      expected_value: veh.price || prev.expected_value,
      name: editingOpp ? prev.name : autoTitle
    }))
  }

  const handleSort = (field) => {
    if (sortField === field) setSortAsc(!sortAsc)
    else { setSortField(field); setSortAsc(true); }
  }

  // Counts for the toggle badges
  const activeCount = useMemo(() => (opportunities || []).filter(o => o.stage !== 'archived' && !o.is_archived).length, [opportunities])
  const archivedCount = useMemo(() => (opportunities || []).filter(o => o.stage === 'archived' || o.is_archived).length, [opportunities])

  const filteredList = useMemo(() => {
    return opportunities.filter(o => {
      // View mode filter: active vs archived
      const isArchived = o.stage === 'archived' || o.is_archived
      if (viewMode === 'active' && isArchived) return false
      if (viewMode === 'archived' && !isArchived) return false

      const q = searchTerm.toLowerCase().trim()
      const matchesSearch = !q ||
        (o.name && o.name.toLowerCase().includes(q)) ||
        (o.vehicle_name && o.vehicle_name.toLowerCase().includes(q)) ||
        (o.notes && o.notes.toLowerCase().includes(q))
      
      const matchesStage = stageFilter === 'all' || o.stage === stageFilter
      const matchesVehicle = vehicleFilter === 'all' || o.vehicle_id === vehicleFilter

      return matchesSearch && matchesStage && matchesVehicle
    })
  }, [opportunities, searchTerm, stageFilter, vehicleFilter, viewMode])

  const sortedList = useMemo(() => {
    return [...filteredList].sort((a, b) => {
      let valA = a[sortField]
      let valB = b[sortField]
      if (sortField === 'expected_value' || sortField === 'probability') {
        valA = Number(valA) || 0
        valB = Number(valB) || 0
      }
      if (valA < valB) return sortAsc ? -1 : 1
      if (valA > valB) return sortAsc ? 1 : -1
      return 0
    })
  }, [filteredList, sortField, sortAsc])

  // Paginated List
  const totalPages = Math.ceil(sortedList.length / itemsPerPage) || 1
  const paginatedList = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return sortedList.slice(start, start + itemsPerPage)
  }, [sortedList, currentPage, itemsPerPage])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.name || isSaving) return
    setIsSaving(true)

    try {
      let result = null
      if (editingOpp) {
        result = await updateOpportunity(editingOpp.id, formData)
      } else {
        result = await addOpportunity(formData)
      }
      
      const targetLead = leads.find(l => l.id === formData.lead_id)
      const targetVeh = vehicleInventory.find(v => v.id === formData.vehicle_id)

      const savedDetails = {
        ...formData,
        id: result?.id || editingOpp?.id || 'opp-saved',
        lead_name: targetLead ? `${targetLead.name} (${targetLead.company || 'Client'})` : formData.lead_id,
        vehicle_display: targetVeh ? targetVeh.name : formData.vehicle_name,
        isEdit: !!editingOpp
      }

      setShowModal(false)
      setEditingOpp(null)
      setSavedOppData(savedDetails)
      setShowSavedModal(true)
    } catch (err) {
      console.error('Error saving opportunity:', err)
      alert(`Error saving opportunity: ${err.message || 'Unknown error'}`)
    } finally {
      setIsSaving(false)
    }
  }

  const handleConfirmArchive = async () => {
    if (!archiveTarget) return
    const oppToArchive = archiveTarget
    setArchiveTarget(null)
    try {
      if (archiveOpportunity) await archiveOpportunity(oppToArchive.id)
      setActionSuccessModal({
        title: 'Opportunity Archived',
        message: `"${oppToArchive.name}" has been successfully moved to archived status.`,
        type: 'archive'
      })
    } catch (err) {
      alert(`Failed to archive opportunity: ${err.message}`)
    }
  }

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return
    const oppToDelete = deleteTarget
    setDeleteTarget(null)
    try {
      if (deleteOpportunity) await deleteOpportunity(oppToDelete.id)
      setActionSuccessModal({
        title: 'Opportunity Deleted',
        message: `"${oppToDelete.name}" has been permanently removed from database records.`,
        type: 'delete'
      })
    } catch (err) {
      alert(`Failed to delete opportunity: ${err.message}`)
    }
  }

  const handleConfirmRestore = async () => {
    if (!restoreTarget) return
    const oppToRestore = restoreTarget
    setRestoreTarget(null)
    try {
      if (restoreOpportunity) await restoreOpportunity(oppToRestore.id, 'qualification')
      setActionSuccessModal({
        title: 'Opportunity Restored',
        message: `"${oppToRestore.name}" has been restored to the active pipeline as Qualification stage.`,
        type: 'restore'
      })
    } catch (err) {
      alert(`Failed to restore opportunity: ${err.message}`)
    }
  }

  const handleReloadPage = () => {
    window.location.reload()
  }

  const openEdit = (opp) => {
    setEditingOpp(opp)
    setFormData({
      name: opp.name,
      expected_value: opp.expected_value,
      close_date: opp.close_date,
      probability: opp.probability,
      stage: opp.stage,
      lead_id: opp.lead_id || (leads[0] ? leads[0].id : ''),
      vehicle_id: opp.vehicle_id || (vehicleInventory[0] ? vehicleInventory[0].id : ''),
      vehicle_name: opp.vehicle_name || (vehicleInventory[0] ? vehicleInventory[0].name : ''),
      campaign_id: opp.campaign_id || 'camp-1',
      notes: opp.notes || ''
    })
    setShowModal(true)
  }

  const openNewModal = () => {
    setEditingOpp(null)
    const defaultLead = leads[0] || {}
    const defaultVeh = vehicleInventory[0] || {}
    const vehShort = defaultVeh.name ? defaultVeh.name.split('(')[0].trim() : ''
    
    setFormData({
      name: `${defaultLead.company || defaultLead.name || 'Client'} ${vehShort} Pursuit`.trim(),
      expected_value: defaultVeh.price || 22500000,
      close_date: '2026-08-30',
      probability: 70,
      stage: 'qualification',
      lead_id: defaultLead.id || 'lead-1',
      vehicle_id: defaultVeh.id || 'veh-101',
      vehicle_name: defaultVeh.name || 'Toyota Land Cruiser V8 ZX (2024)',
      campaign_id: 'camp-1',
      notes: ''
    })
    setShowModal(true)
  }

  const formatCurrency = (val) => `KES ${Number(val).toLocaleString()}`

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] tracking-[4px] uppercase text-[#c9a84c] font-semibold block">Client Pursuit Management</span>
          <h1 className={`text-3xl font-serif font-light mt-1 ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
            {viewMode === 'archived' ? 'Archived Opportunities' : 'Deals & Inventory Alignments'}
          </h1>
        </div>

        <button
          onClick={openNewModal}
          className="px-4 py-2.5 bg-[#c9a84c] text-slate-950 font-bold rounded-xl text-xs tracking-wider uppercase hover:bg-[#d9b85c] transition-all flex items-center gap-2 shadow-lg cursor-pointer"
        >
          <Plus size={16} />
          <span>Add New Deal Alignment</span>
        </button>
      </div>

      {/* Active / Archived Toggle Tabs */}
      <div className={`flex items-center gap-1 p-1 rounded-2xl border w-fit ${
        isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-950/60 border-white/10'
      }`}>
        <button
          onClick={() => { setViewMode('active'); setCurrentPage(1); setStageFilter('all'); }}
          className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
            viewMode === 'active'
              ? 'bg-[#c9a84c] text-slate-950 shadow-lg'
              : isLight ? 'text-slate-600 hover:text-slate-900 hover:bg-white' : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'
          }`}
        >
          <TrendingUp size={14} />
          <span>Active Pipeline</span>
          <span className={`ml-1 px-1.5 py-0.5 rounded-md text-[10px] font-bold ${
            viewMode === 'active'
              ? 'bg-slate-950/20 text-slate-950'
              : isLight ? 'bg-slate-200 text-slate-600' : 'bg-white/10 text-slate-400'
          }`}>{activeCount}</span>
        </button>
        <button
          onClick={() => { setViewMode('archived'); setCurrentPage(1); setStageFilter('all'); }}
          className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
            viewMode === 'archived'
              ? 'bg-amber-500 text-slate-950 shadow-lg'
              : isLight ? 'text-slate-600 hover:text-slate-900 hover:bg-white' : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'
          }`}
        >
          <Archive size={14} />
          <span>Archived</span>
          <span className={`ml-1 px-1.5 py-0.5 rounded-md text-[10px] font-bold ${
            viewMode === 'archived'
              ? 'bg-slate-950/20 text-slate-950'
              : isLight ? 'bg-slate-200 text-slate-600' : 'bg-white/10 text-slate-400'
          }`}>{archivedCount}</span>
        </button>
      </div>

      {/* Toolbar */}
      <div className={`p-4 rounded-2xl border transition-all duration-300 space-y-3 ${
        isLight ? 'bg-white border-slate-200 shadow-xl' : 'bg-[#0f172a]/80 border-white/10 shadow-2xl'
      }`}>
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="relative w-full lg:w-80">
            <Search size={16} className={`absolute left-3.5 top-3 ${isLight ? 'text-slate-400' : 'text-slate-500'}`} />
            <input
              type="text"
              placeholder="Search by deal title, client lead, or vehicle..."
              value={searchTerm}
              onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className={`w-full pl-10 pr-8 py-2 border rounded-xl text-xs outline-none font-mono transition-all ${
                isLight
                  ? 'bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-[#c9a84c]'
                  : 'bg-slate-950/60 border-white/10 text-slate-200 placeholder:text-slate-500 focus:border-[#c9a84c]'
              }`}
            />
            {searchTerm && (
              <button onClick={() => { setSearchTerm(''); setCurrentPage(1); }} className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-200">
                <X size={14} />
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full lg:w-auto font-mono">
            {/* Predictive Stage Filter */}
            <PredictiveSelect
              isLight={isLight}
              placeholder="Filter Stage..."
              value={stageFilter}
              onChange={val => { setStageFilter(val || 'all'); setCurrentPage(1); }}
              options={[
                { value: 'all', label: 'All Stages', count: opportunities.length },
                { value: 'qualification', label: 'Qualification Stage', count: opportunities.filter(o => o.stage === 'qualification').length },
                { value: 'proposal', label: 'Proposal Stage', count: opportunities.filter(o => o.stage === 'proposal').length },
                { value: 'negotiation', label: 'Negotiation Stage', count: opportunities.filter(o => o.stage === 'negotiation').length },
                { value: 'won', label: 'Won Deals', count: opportunities.filter(o => o.stage === 'won').length },
                { value: 'lost', label: 'Lost Deals', count: opportunities.filter(o => o.stage === 'lost').length }
              ]}
            />

            {/* Predictive Vehicle Inventory Filter */}
            <PredictiveSelect
              isLight={isLight}
              placeholder="Filter Vehicle Model..."
              value={vehicleFilter}
              onChange={val => { setVehicleFilter(val || 'all'); setCurrentPage(1); }}
              options={[
                { value: 'all', label: 'All Vehicles', count: opportunities.length },
                ...vehicleInventory.map(v => ({
                  value: v.id,
                  label: v.name,
                  badge: v.category,
                  count: opportunities.filter(o => o.vehicle_id === v.id).length
                }))
              ]}
            />
          </div>
        </div>

        {(searchTerm || stageFilter !== 'all' || vehicleFilter !== 'all') && (
          <div className="flex items-center justify-between pt-2 border-t border-white/5 font-mono text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`text-[11px] ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Active Filters:</span>
              {searchTerm && (
                <span className="px-2 py-0.5 rounded-lg bg-[#c9a84c]/20 text-[#c9a84c] border border-[#c9a84c]/30 flex items-center gap-1">
                  Search: "{searchTerm}"
                  <button onClick={() => { setSearchTerm(''); setCurrentPage(1); }}><X size={12} /></button>
                </span>
              )}
              {stageFilter !== 'all' && (
                <span className="px-2 py-0.5 rounded-lg bg-[#c9a84c]/20 text-[#c9a84c] border border-[#c9a84c]/30 flex items-center gap-1">
                  Stage: {stageFilter}
                  <button onClick={() => { setStageFilter('all'); setCurrentPage(1); }}><X size={12} /></button>
                </span>
              )}
              {vehicleFilter !== 'all' && (
                <span className="px-2 py-0.5 rounded-lg bg-[#c9a84c]/20 text-[#c9a84c] border border-[#c9a84c]/30 flex items-center gap-1">
                  Vehicle: {vehicleFilter}
                  <button onClick={() => { setVehicleFilter('all'); setCurrentPage(1); }}><X size={12} /></button>
                </span>
              )}
            </div>

            <button
              onClick={() => {
                setSearchTerm('')
                setStageFilter('all')
                setVehicleFilter('all')
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
      <div className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
        isLight ? 'bg-white border-slate-200 shadow-xl' : 'bg-[#0f172a]/80 border-white/10 shadow-2xl'
      }`}>
        <div className="overflow-x-auto crm-scroll">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className={`border-b text-[10px] uppercase tracking-widest font-bold ${
                isLight ? 'bg-slate-100/90 border-slate-200 text-slate-800' : 'bg-slate-950/50 border-white/10 text-slate-400'
              }`}>
                <th className={`p-4 cursor-pointer transition-colors ${isLight ? 'hover:text-slate-950' : 'hover:text-slate-200'}`} onClick={() => handleSort('name')}>
                  <div className="flex items-center gap-1">
                    <span>Opportunity Title</span>
                    <ArrowUpDown size={12} />
                  </div>
                </th>
                <th className="p-4">Target Client / Lead</th>
                <th className="p-4">Aligned Vehicle Inventory</th>
                <th className={`p-4 cursor-pointer transition-colors ${isLight ? 'hover:text-slate-950' : 'hover:text-slate-200'}`} onClick={() => handleSort('expected_value')}>
                  <div className="flex items-center gap-1">
                    <span>Expected Deal Value</span>
                    <ArrowUpDown size={12} />
                  </div>
                </th>
                <th className={`p-4 cursor-pointer transition-colors ${isLight ? 'hover:text-slate-950' : 'hover:text-slate-200'}`} onClick={() => handleSort('probability')}>
                  <div className="flex items-center gap-1">
                    <span>Win Prob %</span>
                    <ArrowUpDown size={12} />
                  </div>
                </th>
                <th className="p-4">Stage</th>
                <th className={`p-4 cursor-pointer transition-colors ${isLight ? 'hover:text-slate-950' : 'hover:text-slate-200'}`} onClick={() => handleSort('close_date')}>
                  <div className="flex items-center gap-1">
                    <span>Target Close</span>
                    <ArrowUpDown size={12} />
                  </div>
                </th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className={`divide-y text-xs ${isLight ? 'divide-slate-200' : 'divide-white/5'}`}>
              {paginatedList.map(opp => {
                const alignedLead = leads.find(l => l.id === opp.lead_id)
                const alignedVeh = vehicleInventory.find(v => v.id === opp.vehicle_id) || { name: opp.vehicle_name || 'Custom Vehicle Spec' }

                return (
                  <tr key={opp.id} className={`transition-colors ${isLight ? 'hover:bg-slate-50/80' : 'hover:bg-white/[0.02]'}`}>
                    <td className="p-4">
                      <div className={`font-serif font-bold text-sm ${isLight ? 'text-slate-900' : 'text-slate-200'}`}>{opp.name}</div>
                      <div className={`text-[10px] ${isLight ? 'text-slate-500 font-medium' : 'text-slate-500'}`}>{opp.notes || 'No description notes'}</div>
                    </td>

                    {/* Aligned Lead / Client Pursuit */}
                    <td className="p-4 font-sans">
                      {alignedLead ? (
                        <div className="space-y-0.5">
                          <div className={`font-bold flex items-center gap-1.5 ${isLight ? 'text-slate-900' : 'text-slate-200'}`}>
                            <UserCheck size={13} className="text-blue-500" />
                            <span>{alignedLead.name}</span>
                          </div>
                          <div className={`text-[10px] font-mono flex items-center gap-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                            <Building size={11} className="text-amber-500" />
                            <span>{alignedLead.company}</span>
                          </div>
                        </div>
                      ) : (
                        <span className={`text-[10px] italic ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>Unassigned Lead</span>
                      )}
                    </td>

                    {/* Aligned Vehicle / Product Inventory */}
                    <td className="p-4 font-sans">
                      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl border text-[11px] font-medium ${
                        isLight ? 'bg-purple-50 text-purple-900 border-purple-200' : 'bg-purple-500/10 text-purple-300 border-purple-500/30'
                      }`}>
                        <Car size={13} className="text-purple-500 flex-shrink-0" />
                        <span className="truncate max-w-[180px]" title={alignedVeh.name}>{alignedVeh.name}</span>
                      </div>
                    </td>

                    <td className="p-4 font-mono font-bold text-[#c9a84c]">
                      {formatCurrency(opp.expected_value)}
                    </td>

                    <td className="p-4 font-mono">
                      <span className={`px-2.5 py-1 rounded-lg border text-[10px] font-bold ${
                        isLight ? 'bg-amber-100 text-amber-900 border-amber-300' : 'bg-[#c9a84c]/10 text-[#c9a84c] border-[#c9a84c]/30'
                      }`}>
                        {opp.probability}%
                      </span>
                    </td>

                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] uppercase tracking-wider font-bold border ${
                        opp.stage === 'won'
                          ? isLight ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : opp.stage === 'lost'
                          ? isLight ? 'bg-rose-100 text-rose-800 border-rose-300' : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                          : opp.stage === 'deposit'
                          ? isLight ? 'bg-purple-100 text-purple-800 border-purple-300' : 'bg-purple-500/10 text-purple-400 border-purple-500/30'
                          : opp.stage === 'viewing'
                          ? isLight ? 'bg-amber-100 text-amber-900 border-amber-300' : 'bg-[#c9a84c]/10 text-[#c9a84c] border-[#c9a84c]/30'
                          : opp.stage === 'qualified'
                          ? isLight ? 'bg-blue-100 text-blue-800 border-blue-300' : 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                          : opp.stage === 'onboarding'
                          ? isLight ? 'bg-indigo-100 text-indigo-800 border-indigo-300' : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30'
                          : opp.stage === 'new_lead'
                          ? isLight ? 'bg-sky-100 text-sky-800 border-sky-300' : 'bg-sky-500/10 text-sky-400 border-sky-500/30'
                          : opp.stage === 'archived'
                          ? isLight ? 'bg-slate-200 text-slate-700 border-slate-300' : 'bg-slate-800 text-slate-400 border-white/10'
                          : isLight ? 'bg-blue-100 text-blue-800 border-blue-300' : 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                      }`}>
                        {opp.stage === 'new_lead' ? 'New Lead' : opp.stage === 'onboarding' ? 'Onboarding' : opp.stage === 'qualified' ? 'Qualified' : opp.stage === 'viewing' ? 'Viewing / Demo' : opp.stage === 'deposit' ? 'Deposit Made' : opp.stage}
                      </span>
                    </td>

                    <td className={`p-4 font-mono ${isLight ? 'text-slate-700 font-medium' : 'text-slate-400'}`}>
                      <div className="flex items-center gap-1.5">
                        <Calendar size={12} className={isLight ? 'text-slate-500' : 'text-slate-500'} />
                        <span>{opp.close_date}</span>
                      </div>
                    </td>

                    {/* Actions Column — context-aware based on viewMode */}
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {viewMode === 'archived' ? (
                          /* Archived view: Restore + Delete */
                          <>
                            <ActionTooltip text="Restore to Active Pipeline" isLight={isLight}>
                              <button
                                onClick={() => setRestoreTarget(opp)}
                                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                                  isLight ? 'text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50' : 'text-emerald-400 hover:text-emerald-200 hover:bg-emerald-500/10'
                                }`}
                              >
                                <RotateCcw size={14} />
                              </button>
                            </ActionTooltip>

                            <ActionTooltip text="Permanently Delete" isLight={isLight}>
                              <button
                                onClick={() => setDeleteTarget(opp)}
                                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                                  isLight ? 'text-rose-600 hover:text-rose-800 hover:bg-rose-50' : 'text-rose-400 hover:text-rose-200 hover:bg-rose-500/10'
                                }`}
                              >
                                <Trash2 size={14} />
                              </button>
                            </ActionTooltip>
                          </>
                        ) : (
                          /* Active view: Edit + Archive + Delete */
                          <>
                            <ActionTooltip text="Edit Opportunity Alignment" isLight={isLight}>
                              <button
                                onClick={() => openEdit(opp)}
                                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                                  isLight ? 'text-blue-600 hover:text-blue-800 hover:bg-blue-50' : 'text-blue-400 hover:text-blue-200 hover:bg-blue-500/10'
                                }`}
                              >
                                <Edit3 size={14} />
                              </button>
                            </ActionTooltip>

                            <ActionTooltip text="Archive Opportunity Alignment" isLight={isLight}>
                              <button
                                onClick={() => setArchiveTarget(opp)}
                                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                                  isLight ? 'text-amber-600 hover:text-amber-800 hover:bg-amber-50' : 'text-amber-400 hover:text-amber-200 hover:bg-amber-500/10'
                                }`}
                              >
                                <Archive size={14} />
                              </button>
                            </ActionTooltip>

                            <ActionTooltip text="Delete Opportunity Alignment" isLight={isLight}>
                              <button
                                onClick={() => setDeleteTarget(opp)}
                                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                                  isLight ? 'text-rose-600 hover:text-rose-800 hover:bg-rose-50' : 'text-rose-400 hover:text-rose-200 hover:bg-rose-500/10'
                                }`}
                              >
                                <Trash2 size={14} />
                              </button>
                            </ActionTooltip>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Universal Pagination */}
        <div className="p-3 border-t border-white/5">
          <UniversalPagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={sortedList.length}
            itemsPerPage={itemsPerPage}
            onPageChange={page => setCurrentPage(page)}
            onItemsPerPageChange={size => {
              setItemsPerPage(size)
              setCurrentPage(1)
            }}
          />
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[99999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto crm-scroll">
          <div className={`max-w-xl w-full my-auto p-6 rounded-3xl border shadow-2xl relative font-sans transition-all duration-300 ${
            isLight
              ? 'bg-white border-[#c9a84c]/60 text-slate-900 shadow-[0_0_30px_rgba(201,168,76,0.25)]'
              : 'bg-[#0f172a] border-[#c9a84c]/40 text-slate-100 shadow-[0_0_35px_rgba(201,168,76,0.3)]'
          }`}>
            <div className={`flex items-center justify-between border-b pb-4 mb-4 ${isLight ? 'border-slate-200' : 'border-[#c9a84c]/20'}`}>
              <div className="flex items-center gap-2">
                <Sparkles size={18} className="text-[#c9a84c]" />
                <h3 className={`text-lg font-serif font-bold ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                  {editingOpp ? 'Edit Opportunity Alignment' : 'Create Sales Opportunity & Inventory Pursuit'}
                </h3>
              </div>
              <button onClick={() => setShowModal(false)} className={isLight ? 'text-slate-500 hover:text-slate-800' : 'text-slate-400 hover:text-slate-200'}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
              
              {/* Lead & Vehicle Pursuit Associations */}
              <div className={`p-4 rounded-2xl border space-y-3 ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/60 border-white/10'
              }`}>
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#c9a84c] block">
                  1. Client &amp; Vehicle Pursuit Associations
                </span>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <PredictiveSelect
                      label="Target Lead / Client *"
                      options={leadOptions}
                      value={formData.lead_id}
                      onChange={val => handleLeadChange(val)}
                      isLight={isLight}
                      placeholder="Select target client..."
                    />
                  </div>

                  <div>
                    <PredictiveSelect
                      label="Target Vehicle Inventory *"
                      options={vehicleOptions}
                      value={formData.vehicle_id}
                      onChange={val => handleVehicleChange(val)}
                      isLight={isLight}
                      placeholder="Select vehicle model..."
                    />
                  </div>
                </div>
              </div>

              {/* Opportunity General Information */}
              <div>
                <label className={`block uppercase tracking-wider mb-1 font-bold ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>
                  Opportunity Pursuit Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apex Logistics Land Cruiser V8 Fleet Pursuit"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full border rounded-xl px-3 py-2 outline-none ${
                    isLight ? 'bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400' : 'bg-slate-950 border-white/10 text-slate-200 placeholder:text-slate-500'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`block uppercase tracking-wider mb-1 font-bold ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>
                    Expected Deal Value (KES)
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.expected_value}
                    onChange={e => setFormData({ ...formData, expected_value: e.target.value })}
                    className={`w-full border rounded-xl px-3 py-2 outline-none ${
                      isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-950 border-white/10 text-slate-200'
                    }`}
                  />
                </div>
                <div>
                  <ModernDatePicker
                    label="Target Close Date *"
                    value={formData.close_date}
                    onChange={val => setFormData({ ...formData, close_date: val || '2026-08-30' })}
                    isLight={isLight}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <PredictiveSelect
                    label="Pipeline Stage"
                    options={stageOptions}
                    value={formData.stage}
                    onChange={val => setFormData({ ...formData, stage: val })}
                    isLight={isLight}
                  />
                </div>
                <div>
                  <label className={`block uppercase tracking-wider mb-1 font-bold ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>
                    Probability (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.probability}
                    onChange={e => setFormData({ ...formData, probability: e.target.value })}
                    className={`w-full border rounded-xl px-3 py-2 outline-none ${
                      isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-950 border-white/10 text-slate-200'
                    }`}
                  />
                </div>
              </div>

              <div>
                <PredictiveSelect
                  label="Attributed Marketing Campaign"
                  options={campaignOptions}
                  value={formData.campaign_id}
                  onChange={val => setFormData({ ...formData, campaign_id: val })}
                  isLight={isLight}
                  placeholder="Select marketing campaign..."
                />
              </div>

              <div>
                <label className={`block uppercase tracking-wider mb-1 font-bold ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>
                  Strategic Pursuit Notes &amp; Vehicle Customizations
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Client requested 3x Land Cruiser V8 units with bulletproof armoring package"
                  value={formData.notes}
                  onChange={e => setFormData({ ...formData, notes: e.target.value })}
                  className={`w-full border rounded-xl px-3 py-2 outline-none ${
                    isLight ? 'bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400' : 'bg-slate-950 border-white/10 text-slate-200 placeholder:text-slate-500'
                  }`}
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  disabled={isSaving}
                  className={`px-4 py-2 rounded-xl border text-xs font-bold uppercase ${
                    isLight ? 'border-slate-300 text-slate-700 hover:bg-slate-100' : 'border-slate-700 text-slate-400 hover:bg-white/5'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 bg-[#c9a84c] text-slate-950 font-bold rounded-xl text-xs uppercase hover:bg-[#d9b85c] shadow-lg cursor-pointer flex items-center gap-2 disabled:opacity-50"
                >
                  {isSaving && <RefreshCw size={14} className="animate-spin" />}
                  <span>{isSaving ? 'Saving Opportunity...' : 'Save Opportunity Alignment'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Success Popup Modal */}
      {showSavedModal && savedOppData && (
        <div className="fixed inset-0 z-[999999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className={`max-w-md w-full p-6 rounded-3xl border shadow-2xl relative text-center space-y-5 transition-all duration-300 ${
            isLight
              ? 'bg-white border-emerald-500/50 text-slate-900 shadow-[0_0_40px_rgba(16,185,129,0.25)]'
              : 'bg-[#0f172a] border-emerald-500/40 text-slate-100 shadow-[0_0_40px_rgba(16,185,129,0.3)]'
          }`}>
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-500 shadow-inner">
              <CheckCircle2 size={36} />
            </div>

            <div>
              <span className="text-[10px] tracking-[3px] uppercase font-bold text-emerald-500 block mb-1">
                {savedOppData.isEdit ? 'Opportunity Updated' : 'Opportunity Saved Successfully!'}
              </span>
              <h3 className={`text-xl font-serif font-bold ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                {savedOppData.name}
              </h3>
            </div>

            <div className={`p-4 rounded-2xl border text-left text-xs font-mono space-y-2.5 ${
              isLight ? 'bg-slate-50 border-slate-200 text-slate-800' : 'bg-slate-950/70 border-white/10 text-slate-300'
            }`}>
              <div className="flex justify-between items-center pb-2 border-b border-dashed border-slate-300/30">
                <span className="text-slate-400">Target Client:</span>
                <span className="font-bold text-[#c9a84c] truncate max-w-[200px]">{savedOppData.lead_name}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-dashed border-slate-300/30">
                <span className="text-slate-400">Vehicle Inventory:</span>
                <span className="font-bold truncate max-w-[200px]">{savedOppData.vehicle_display || savedOppData.vehicle_name}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-dashed border-slate-300/30">
                <span className="text-slate-400">Expected Deal Value:</span>
                <span className="font-bold text-emerald-400">KES {Number(savedOppData.expected_value).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Pipeline Stage:</span>
                <span className="uppercase font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px]">
                  {savedOppData.stage} ({savedOppData.probability}%)
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-400">
              The opportunity record has been persisted into PostgreSQL &amp; Supabase database. Click below to reload the CRM view.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowSavedModal(false)}
                className={`w-1/3 py-3 rounded-xl border text-xs font-bold uppercase ${
                  isLight ? 'border-slate-300 text-slate-700 hover:bg-slate-100' : 'border-slate-700 text-slate-400 hover:bg-white/5'
                }`}
              >
                Close
              </button>
              <button
                onClick={handleReloadPage}
                className="w-2/3 py-3 bg-[#c9a84c] hover:bg-[#d9b85c] text-slate-950 font-bold uppercase tracking-wider text-xs rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <RefreshCw size={16} />
                <span>Reload Page</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Archive Confirmation Popup Modal */}
      {archiveTarget && (
        <div className="fixed inset-0 z-[999999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className={`max-w-md w-full p-6 rounded-3xl border shadow-2xl relative text-center space-y-4 font-sans ${
            isLight ? 'bg-white border-amber-500/50 text-slate-900 shadow-[0_0_30px_rgba(245,158,11,0.2)]' : 'bg-[#0f172a] border-amber-500/40 text-slate-100 shadow-[0_0_30px_rgba(245,158,11,0.25)]'
          }`}>
            <div className="w-14 h-14 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-500 shadow-inner">
              <Archive size={30} />
            </div>
            <div>
              <span className="text-[10px] tracking-[3px] uppercase font-bold text-amber-500 block mb-1">Confirm Archive Action</span>
              <h3 className={`text-lg font-serif font-bold ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                Archive "{archiveTarget.name}"?
              </h3>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              This will update the deal stage to archived. The opportunity will be preserved in database records but hidden from active deal pipelines.
            </p>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setArchiveTarget(null)}
                className={`w-1/2 py-2.5 rounded-xl border text-xs font-bold uppercase ${
                  isLight ? 'border-slate-300 text-slate-700 hover:bg-slate-100' : 'border-slate-700 text-slate-400 hover:bg-white/5'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmArchive}
                className="w-1/2 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold uppercase tracking-wider text-xs rounded-xl transition-all shadow-lg cursor-pointer"
              >
                Confirm Archive
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Restore Confirmation Popup Modal */}
      {restoreTarget && (
        <div className="fixed inset-0 z-[999999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className={`max-w-md w-full p-6 rounded-3xl border shadow-2xl relative text-center space-y-4 font-sans ${
            isLight ? 'bg-white border-emerald-500/50 text-slate-900 shadow-[0_0_30px_rgba(16,185,129,0.2)]' : 'bg-[#0f172a] border-emerald-500/40 text-slate-100 shadow-[0_0_30px_rgba(16,185,129,0.25)]'
          }`}>
            <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-500 shadow-inner">
              <RotateCcw size={30} />
            </div>
            <div>
              <span className="text-[10px] tracking-[3px] uppercase font-bold text-emerald-500 block mb-1">Restore to Active Pipeline</span>
              <h3 className={`text-lg font-serif font-bold ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                Restore "{restoreTarget.name}"?
              </h3>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              This will move the opportunity back to the active pipeline as a <strong className="text-emerald-400">Qualification</strong> stage deal, making it visible and actionable again.
            </p>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setRestoreTarget(null)}
                className={`w-1/2 py-2.5 rounded-xl border text-xs font-bold uppercase ${
                  isLight ? 'border-slate-300 text-slate-700 hover:bg-slate-100' : 'border-slate-700 text-slate-400 hover:bg-white/5'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmRestore}
                className="w-1/2 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold uppercase tracking-wider text-xs rounded-xl transition-all shadow-lg cursor-pointer"
              >
                Restore Deal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Popup Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-[999999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className={`max-w-md w-full p-6 rounded-3xl border shadow-2xl relative text-center space-y-4 font-sans ${
            isLight ? 'bg-white border-rose-500/50 text-slate-900 shadow-[0_0_30px_rgba(244,63,94,0.2)]' : 'bg-[#0f172a] border-rose-500/40 text-slate-100 shadow-[0_0_30px_rgba(244,63,94,0.25)]'
          }`}>
            <div className="w-14 h-14 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mx-auto text-rose-500 shadow-inner">
              <Trash2 size={30} />
            </div>
            <div>
              <span className="text-[10px] tracking-[3px] uppercase font-bold text-rose-500 block mb-1">Permanent Deletion Warning</span>
              <h3 className={`text-lg font-serif font-bold ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                Delete "{deleteTarget.name}"?
              </h3>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              This will permanently remove this opportunity record from PostgreSQL &amp; Supabase database. This action cannot be undone.
            </p>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setDeleteTarget(null)}
                className={`w-1/2 py-2.5 rounded-xl border text-xs font-bold uppercase ${
                  isLight ? 'border-slate-300 text-slate-700 hover:bg-slate-100' : 'border-slate-700 text-slate-400 hover:bg-white/5'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="w-1/2 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold uppercase tracking-wider text-xs rounded-xl transition-all shadow-lg cursor-pointer"
              >
                Delete Record
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Action Success Toast Modal */}
      {actionSuccessModal && (
        <div className="fixed inset-0 z-[999999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className={`max-w-md w-full p-6 rounded-3xl border shadow-2xl relative text-center space-y-4 font-sans ${
            isLight ? 'bg-white border-emerald-500/50 text-slate-900 shadow-[0_0_30px_rgba(16,185,129,0.2)]' : 'bg-[#0f172a] border-emerald-500/40 text-slate-100 shadow-[0_0_30px_rgba(16,185,129,0.25)]'
          }`}>
            <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-500 shadow-inner">
              <CheckCircle2 size={30} />
            </div>
            <div>
              <span className="text-[10px] tracking-[3px] uppercase font-bold text-emerald-500 block mb-1">Operation Complete</span>
              <h3 className={`text-lg font-serif font-bold ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                {actionSuccessModal.title}
              </h3>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              {actionSuccessModal.message}
            </p>
            <button
              onClick={() => setActionSuccessModal(null)}
              className="w-full py-2.5 bg-[#c9a84c] hover:bg-[#d9b85c] text-slate-950 font-bold uppercase tracking-wider text-xs rounded-xl transition-all shadow-lg cursor-pointer"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
