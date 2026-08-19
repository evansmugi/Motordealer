import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { useLocation, Link } from 'react-router-dom'
import {
  Car, Search, SlidersHorizontal, RotateCcw, X, Eye, CheckCircle,
  Clock, AlertCircle, DollarSign, Calendar, Mail, Phone, MessageSquare,
  ChevronLeft, ChevronRight, Download, Trash2, Edit, Send, Sparkles,
  ExternalLink, Layers, ShieldCheck, Image as ImageIcon, User, Archive, AlertTriangle
} from 'lucide-react'
import UniversalPagination from '../../components/common/UniversalPagination'
import PredictiveSelect from '../../components/common/PredictiveSelect'
import ModernDatePicker from '../../components/common/ModernDatePicker'
import ActionTooltip from '../../components/common/ActionTooltip'
import { useCRMStore } from '../../context/CRMStore'
import { supabase } from '../../lib/superbaseClient'
import api from '../../lib/apiClient'

const STATUS_OPTIONS = [
  { value: 'all', label: 'All Request Statuses' },
  { value: 'Pending', label: 'Pending Review', badge: 'New' },
  { value: 'Under Review', label: 'Under Review' },
  { value: 'Offer Made', label: 'Offer Made (Appraised)' },
  { value: 'Approved', label: 'Approved by Client' },
  { value: 'Rejected', label: 'Rejected / Declined' },
  { value: 'Completed', label: 'Completed (Traded In)' },
  { value: 'Archived', label: 'Archived Requests', badge: 'Archived' }
]

export default function TradeInsManager() {
  const adminTheme = useCRMStore(state => state.adminTheme)
  const isLight = adminTheme === 'light'

  const [tradeIns, setTradeIns] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem('knk_trade_ins_cache')
        return cached ? JSON.parse(cached) : []
      } catch { return [] }
    }
    return []
  })
  const [loading, setLoading] = useState(() => tradeIns.length === 0)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  // Filter States
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [targetVehicleFilter, setTargetVehicleFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('')

  // Modal State for Inspecting / Appraising Request
  const [selectedTradeIn, setSelectedTradeIn] = useState(null)
  const [activePhotoIdx, setActivePhotoIdx] = useState(0)
  const [offeredValuationInput, setOfferedValuationInput] = useState('')
  const [adminNotesInput, setAdminNotesInput] = useState('')
  const [statusInput, setStatusInput] = useState('Pending')
  const [isUpdating, setIsUpdating] = useState(false)

  // Fast Parallel Fetch Trade-In Requests from Database
  const fetchTradeIns = useCallback(async () => {
    if (tradeIns.length === 0) setLoading(true)
    try {
      const fetchApiData = async () => {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 1200)
        const res = await fetch('/api/crm/trade-ins', { signal: controller.signal })
        clearTimeout(timeoutId)
        if (res.ok) {
          const json = await res.json()
          if (Array.isArray(json) && json.length > 0) return json
        }
        throw new Error('API empty or unreachable')
      }

      const fetchSupabaseData = async () => {
        const { data: sbData, error } = await supabase
          .from('trade_in_requests')
          .select('*')
          .order('created_at', { ascending: false })
        if (!error && sbData && Array.isArray(sbData)) return sbData
        throw new Error('Supabase failed')
      }

      const fetchStrapiData = async () => {
        const res = await fetch('http://localhost:1338/api/trade-in-requests')
        if (res.ok) {
          const json = await res.json()
          if (json && Array.isArray(json.data) && json.data.length > 0) {
            return json.data.map(item => {
              const d = item.attributes || item
              return {
                id: item.id || d.id,
                client_name: d.client_name || d.clientName || 'Anonymous Client',
                client_phone: d.client_phone || d.clientPhone || 'N/A',
                client_email: d.client_email || d.clientEmail || 'N/A',
                trade_make: d.trade_make || d.tradeMake || 'N/A',
                trade_model: d.trade_model || d.tradeModel || 'N/A',
                trade_year: d.trade_year || d.tradeYear || '2022',
                trade_mileage: d.trade_mileage || d.tradeMileage || '0',
                trade_condition: d.trade_condition || d.tradeCondition || 'Good Condition',
                expected_value: d.expected_value || d.expectedValue || '0',
                target_vehicle: d.target_vehicle || d.targetVehicle || 'Mercedes-Benz S 580',
                status: d.status || 'Pending',
                created_at: d.createdAt || d.created_at || new Date().toISOString()
              }
            })
          }
        }
        throw new Error('Strapi empty or unreachable')
      }

      let freshData = null
      try {
        freshData = await Promise.any([fetchStrapiData(), fetchSupabaseData(), fetchApiData()])
      } catch {
        const results = await Promise.allSettled([fetchStrapiData(), fetchSupabaseData(), fetchApiData()])
        for (const res of results) {
          if (res.status === 'fulfilled' && Array.isArray(res.value)) {
            freshData = res.value
            break
          }
        }
      }

      if (freshData) {
        setTradeIns(prev => {
          // Keep any optimistic/recent entries that have not synced to DB response yet
          const dbIdSet = new Set(freshData.map(item => String(item.id)))
          const pendingOptimistic = prev.filter(item => item && item.id && !dbIdSet.has(String(item.id)))
          const mergedData = [...pendingOptimistic, ...freshData]

          if (typeof window !== 'undefined') {
            try { localStorage.setItem('knk_trade_ins_cache', JSON.stringify(mergedData)) } catch (err) {
              console.warn('Cache write failed:', err)
            }
          }
          return mergedData
        })
      }
    } catch (err) {
      console.error('Failed to load trade-in requests:', err)
    } finally {
      setLoading(false)
    }
  }, [tradeIns.length])

  const location = useLocation()

  useEffect(() => {
    let ignore = false
    const loadData = async () => {
      if (!ignore) await fetchTradeIns()
    }
    loadData()

    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      const bcChat = new BroadcastChannel('knk_live_chat_channel')
      bcChat.onmessage = (event) => {
        if (event.data && event.data.type === 'SYNC_THREADS') {
          fetchTradeIns()
        }
      }

      const bcTradeIn = new BroadcastChannel('knk_trade_in_notification_channel')
      bcTradeIn.onmessage = (event) => {
        if (event.data && event.data.type === 'NEW_TRADE_IN_NOTIFICATION') {
          if (event.data.fullPayload) {
            setTradeIns(prev => [event.data.fullPayload, ...prev.filter(x => x.id !== event.data.fullPayload.id)])
          }
          fetchTradeIns()
        }
      }

      return () => {
        ignore = true
        bcChat.close()
        bcTradeIn.close()
      }
    }
    return () => { ignore = true }
  }, [fetchTradeIns])

  // Auto-open inspection modal if URL parameter ?id=... is present
  useEffect(() => {
    if (!tradeIns || tradeIns.length === 0) return
    const params = new URLSearchParams(location.search)
    const targetId = params.get('id') || params.get('tradeId')
    if (targetId) {
      const match = tradeIns.find(t => String(t.id) === String(targetId))
      if (match) {
        const timer = setTimeout(() => {
          setSelectedTradeIn(match)
          setActivePhotoIdx(0)
          setOfferedValuationInput(match.offered_valuation ? String(match.offered_valuation) : '')
          setAdminNotesInput(match.admin_notes || '')
          setStatusInput(match.status || 'Pending')
        }, 50)
        return () => clearTimeout(timer)
      }
    }
  }, [location.search, tradeIns])

  // Target Showroom Vehicle Options for Filter
  const targetVehicleOptions = useMemo(() => {
    const counts = {}
    tradeIns.forEach(t => {
      const name = t.target_vehicle_name || 'Showroom Vehicle'
      counts[name] = (counts[name] || 0) + 1
    })
    const opts = [{ value: 'all', label: 'All Target Showroom Vehicles', badge: String(tradeIns.length) }]
    Object.keys(counts).sort().forEach(name => {
      opts.push({ value: name, label: name, badge: String(counts[name]) })
    })
    return opts
  }, [tradeIns])

  // Filter Computation
  const filteredTradeIns = useMemo(() => {
    return tradeIns.filter(item => {
      // 1. Text Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim()
        const matchId = (item.id || '').toLowerCase().includes(q)
        const matchClient = (item.client_name || '').toLowerCase().includes(q)
        const matchPhone = (item.client_phone || '').toLowerCase().includes(q)
        const matchEmail = (item.client_email || '').toLowerCase().includes(q)
        const matchMake = (item.trade_vehicle_make || '').toLowerCase().includes(q)
        const matchModel = (item.trade_vehicle_model || '').toLowerCase().includes(q)
        const matchReg = (item.trade_vehicle_registration || '').toLowerCase().includes(q)
        const matchTarget = (item.target_vehicle_name || '').toLowerCase().includes(q)
        if (!matchId && !matchClient && !matchPhone && !matchEmail && !matchMake && !matchModel && !matchReg && !matchTarget) {
          return false
        }
      }

      // 2. Status Filter
      if (statusFilter !== 'all' && item.status !== statusFilter) {
        return false
      }

      // 3. Target Vehicle Filter
      if (targetVehicleFilter !== 'all' && item.target_vehicle_name !== targetVehicleFilter) {
        return false
      }

      // 4. Date Filter
      if (dateFilter) {
        const itemDate = new Date(item.created_at).toISOString().split('T')[0]
        if (itemDate !== dateFilter) return false
      }

      return true
    })
  }, [tradeIns, searchQuery, statusFilter, targetVehicleFilter, dateFilter])

  // Active filter count calculation
  const activeFilterCount = useMemo(() => {
    let count = 0
    if (searchQuery.trim()) count++
    if (statusFilter !== 'all') count++
    if (targetVehicleFilter !== 'all') count++
    if (dateFilter) count++
    return count
  }, [searchQuery, statusFilter, targetVehicleFilter, dateFilter])

  const handleResetFilters = () => {
    setSearchQuery('')
    setStatusFilter('all')
    setTargetVehicleFilter('all')
    setDateFilter('')
    setCurrentPage(1)
  }

  // Pagination Slice
  const totalPages = Math.ceil(filteredTradeIns.length / itemsPerPage) || 1
  const paginatedTradeIns = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return filteredTradeIns.slice(start, start + itemsPerPage)
  }, [filteredTradeIns, currentPage, itemsPerPage])

  // Telemetry Summary Cards metrics
  const totalRequests = tradeIns.length
  const pendingCount = tradeIns.filter(t => t.status === 'Pending' || t.status === 'Under Review').length
  const offersMadeCount = tradeIns.filter(t => t.status === 'Offer Made' || t.status === 'Approved').length
  const totalValuationSum = tradeIns.reduce((sum, t) => sum + (Number(t.expected_trade_value) || 0), 0)

  // Open Inspection Modal
  const handleOpenInspect = (item) => {
    setSelectedTradeIn(item)
    setActivePhotoIdx(0)
    setOfferedValuationInput(item.offered_valuation ? String(item.offered_valuation) : '')
    setAdminNotesInput(item.admin_notes || '')
    setStatusInput(item.status || 'Pending')
  }

  // Save Appraisal Update (Instant 0ms UI Update + Background Sync)
  const handleSaveAppraisal = async () => {
    if (!selectedTradeIn) return
    setIsUpdating(true)

    const numericValuation = offeredValuationInput ? parseInt(offeredValuationInput.toString().replace(/\D/g, ''), 10) : 0
    const updatePayload = {
      offered_valuation: numericValuation,
      status: statusInput,
      admin_notes: adminNotesInput
    }

    // 1. Instant local state update
    setTradeIns(prev => {
      const updated = prev.map(t => String(t.id) === String(selectedTradeIn.id) ? { ...t, ...updatePayload } : t)
      if (typeof window !== 'undefined') {
        try {
          const cacheSafeList = updated.map(item => ({
            ...item,
            images: Array.isArray(item.images) ? item.images.slice(0, 2) : item.images
          }))
          localStorage.setItem('knk_trade_ins_cache', JSON.stringify(cacheSafeList))
        } catch (e) {
          console.warn('Cache write failed:', e)
        }
      }
      return updated
    })
    setSelectedTradeIn(prev => prev ? { ...prev, ...updatePayload } : null)

    // 2. Await real database persistence
    let dbSaved = false
    try {
      const { error: sbErr } = await supabase
        .from('trade_in_requests')
        .update(updatePayload)
        .eq('id', selectedTradeIn.id)
      if (!sbErr) dbSaved = true
    } catch (sbErr) {
      console.warn('Supabase update fallback:', sbErr)
    }

    try {
      await api.put(`/crm/trade-ins/${selectedTradeIn.id}`, updatePayload)
      dbSaved = true
    } catch (apiErr) {
      console.warn('API update fallback:', apiErr)
    }

    if (!dbSaved) console.error('Appraisal saved locally only — database sync failed for', selectedTradeIn.id)
    setIsUpdating(false)
  }

  // Action Confirmation Warning Popup Modal State
  const [actionConfirmModal, setActionConfirmModal] = useState({
    isOpen: false,
    type: 'archive', // 'archive' | 'delete'
    item: null
  })

  // Execute Confirmed Warning Action (Archive or Delete)
  const handleExecuteActionConfirm = async () => {
    const { type, item } = actionConfirmModal
    if (!item) return

    setActionConfirmModal({ isOpen: false, type: 'archive', item: null })

    if (type === 'delete') {
      try {
        await api.delete(`/crm/trade-ins/${item.id}`).catch(() => {})
        await supabase.from('trade_in_requests').delete().eq('id', item.id).catch(() => {})
        setTradeIns(prev => prev.filter(t => t.id !== item.id))
        if (selectedTradeIn?.id === item.id) setSelectedTradeIn(null)
      } catch (err) {
        console.error('Delete trade-in error:', err)
      }
    } else if (type === 'archive') {
      try {
        await api.put(`/crm/trade-ins/${item.id}`, { status: 'Archived' }).catch(() => {})
        await supabase.from('trade_in_requests').update({ status: 'Archived' }).eq('id', item.id).catch(() => {})
        setTradeIns(prev => prev.map(t => t.id === item.id ? { ...t, status: 'Archived' } : t))
        if (selectedTradeIn?.id === item.id) {
          setSelectedTradeIn(prev => prev ? { ...prev, status: 'Archived' } : null)
          setStatusInput('Archived')
        }
      } catch (err) {
        console.error('Archive trade-in error:', err)
      }
    }
  }

  // Helper to parse images array from JSON string or Array
  const parseImages = (imgs) => {
    if (!imgs) return []
    if (Array.isArray(imgs)) return imgs
    if (typeof imgs === 'string') {
      try { return JSON.parse(imgs) } catch { return [] }
    }
    return []
  }

  return (
    <div className={`space-y-6 font-sans pb-12 transition-colors duration-300 min-h-screen p-4 md:p-6 rounded-3xl border ${
      isLight ? 'bg-slate-50 border-slate-200 text-slate-900 shadow-xl' : 'bg-[#020617] border-white/10 text-slate-100 shadow-2xl'
    }`}>
      
      {/* Header Bar */}
      <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl border transition-all duration-300 ${
        isLight ? 'bg-white border-slate-200 shadow-xl' : 'bg-[#070b14]/90 border-white/10 shadow-2xl backdrop-blur-xl'
      }`}>
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-[#c9a84c] to-amber-600 text-slate-950 font-bold shadow-lg">
            <Car size={24} />
          </div>
          <div>
            <div className={`text-[10px] font-mono font-bold tracking-[3px] uppercase ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              Fuse CRM <span className="text-[#c9a84c]">/</span> Trade-In Management
            </div>
            <h1 className={`text-2xl font-serif font-light mt-0.5 flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
              <span>Client Vehicle Trade-In Requests</span>
            </h1>
          </div>
        </div>

        <button
          onClick={fetchTradeIns}
          className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-white/10 rounded-xl text-xs font-mono flex items-center gap-2 transition-all shadow-md"
        >
          <RotateCcw size={14} className={loading ? 'animate-spin' : ''} />
          <span>Refresh Database</span>
        </button>
      </div>

      {/* 4 Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 font-mono">
        <div className={`p-4 rounded-2xl border transition-all duration-300 ${isLight ? 'bg-white border-slate-200 shadow-xl' : 'bg-[#0f172a]/80 border-white/10 shadow-2xl'}`}>
          <span className={`text-[10px] uppercase tracking-wider block ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Total Requests</span>
          <span className={`text-2xl font-bold mt-1 block ${isLight ? 'text-slate-900' : 'text-white'}`}>{totalRequests}</span>
          <span className="text-[10px] text-emerald-500 mt-1 block font-semibold">● Persistent in DB</span>
        </div>

        <div className={`p-4 rounded-2xl border transition-all duration-300 ${isLight ? 'bg-white border-slate-200 shadow-xl' : 'bg-[#0f172a]/80 border-white/10 shadow-2xl'}`}>
          <span className={`text-[10px] uppercase tracking-wider block ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Pending Appraisals</span>
          <span className="text-2xl font-bold text-amber-500 mt-1 block">{pendingCount}</span>
          <span className="text-[10px] text-amber-500 mt-1 block">Awaiting admin review</span>
        </div>

        <div className={`p-4 rounded-2xl border transition-all duration-300 ${isLight ? 'bg-white border-slate-200 shadow-xl' : 'bg-[#0f172a]/80 border-white/10 shadow-2xl'}`}>
          <span className={`text-[10px] uppercase tracking-wider block ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Offers Made</span>
          <span className="text-2xl font-bold text-[#06b6d4] mt-1 block">{offersMadeCount}</span>
          <span className="text-[10px] text-[#06b6d4] mt-1 block">Appraisal offers sent</span>
        </div>

        <div className={`p-4 rounded-2xl border transition-all duration-300 ${isLight ? 'bg-white border-slate-200 shadow-xl' : 'bg-[#0f172a]/80 border-white/10 shadow-2xl'}`}>
          <span className={`text-[10px] uppercase tracking-wider block ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Total Expected Value</span>
          <span className="text-2xl font-bold text-[#c9a84c] mt-1 block">KES {(totalValuationSum / 1000000).toFixed(1)}M</span>
          <span className="text-[10px] text-[#c9a84c] mt-1 block">Combined client valuation</span>
        </div>
      </div>

      {/* Main Trade-Ins Table Container */}
      <div className={`p-5 rounded-2xl border transition-all duration-300 space-y-4 ${
        isLight ? 'bg-white border-slate-200 shadow-xl' : 'bg-[#0f172a]/80 border-white/10 shadow-2xl'
      }`}>
        <div className={`flex items-center justify-between border-b pb-4 ${isLight ? 'border-slate-200' : 'border-white/10'}`}>
          <h3 className={`text-lg font-serif font-light flex items-center gap-2 ${isLight ? 'text-slate-900 font-medium' : 'text-slate-100'}`}>
            <Car size={18} className="text-[#c9a84c]" />
            <span>Granular Client Trade-In Submissions</span>
          </h3>
          <span className="text-xs font-mono text-emerald-600 font-bold bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full">
            ● Supabase Cloud Sync Active
          </span>
        </div>

        {/* Multi-Criteria Filter Bar */}
        <div className={`p-4 rounded-xl border space-y-3 ${
          isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/60 border-white/10'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <SlidersHorizontal size={16} className="text-[#06b6d4]" />
              <span className={`text-xs font-mono font-bold uppercase tracking-wider ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                Trade-In Request Filters
              </span>
              {activeFilterCount > 0 && (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono bg-[#06b6d4]/20 text-[#06b6d4] border border-[#06b6d4]/30">
                  {activeFilterCount} Active Filter{activeFilterCount > 1 ? 's' : ''}
                </span>
              )}
            </div>
            
            {activeFilterCount > 0 && (
              <button
                onClick={handleResetFilters}
                className="flex items-center gap-1.5 text-xs font-mono font-bold text-rose-500 hover:text-rose-400 transition-colors"
              >
                <RotateCcw size={13} />
                <span>Reset All Filters</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {/* 1. Global Search Input */}
            <div className="relative flex items-center">
              <Search size={14} className={`absolute left-3 ${isLight ? 'text-slate-400' : 'text-slate-500'}`} />
              <input
                type="text"
                value={searchQuery}
                onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                placeholder="Search client, make, model..."
                className={`w-full pl-9 pr-8 py-2 rounded-xl text-xs font-mono border transition-all ${
                  isLight
                    ? 'bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-[#06b6d4] focus:outline-none'
                    : 'bg-slate-950 border-white/10 text-white placeholder:text-slate-500 focus:border-[#06b6d4] focus:outline-none'
                }`}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className={`absolute right-2.5 p-0.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 ${
                    isLight ? 'text-slate-500' : 'text-slate-400'
                  }`}
                >
                  <X size={12} />
                </button>
              )}
            </div>

            {/* 2. Status PredictiveSelect */}
            <PredictiveSelect
              options={STATUS_OPTIONS}
              value={statusFilter}
              onChange={val => { setStatusFilter(val); setCurrentPage(1); }}
              placeholder="Filter Status..."
              isLight={isLight}
            />

            {/* 3. Target Vehicle PredictiveSelect */}
            <PredictiveSelect
              options={targetVehicleOptions}
              value={targetVehicleFilter}
              onChange={val => { setTargetVehicleFilter(val); setCurrentPage(1); }}
              placeholder="Filter Target Showroom Car..."
              isLight={isLight}
            />

            {/* 4. ModernDatePicker Date Filter */}
            <ModernDatePicker
              value={dateFilter}
              onChange={val => { setDateFilter(val); setCurrentPage(1); }}
              placeholder="Filter Date..."
              isLight={isLight}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono pt-1">
            <span className={isLight ? 'text-slate-600' : 'text-slate-400'}>
              Showing <strong className={isLight ? 'text-slate-900' : 'text-white'}>{filteredTradeIns.length}</strong> of <strong className={isLight ? 'text-slate-900' : 'text-white'}>{tradeIns.length}</strong> trade-in submissions
            </span>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs border-collapse">
            <thead>
              <tr className={`border-b uppercase text-[10px] tracking-wider ${
                isLight ? 'border-slate-300 text-slate-900 bg-slate-100 font-bold' : 'border-white/10 text-slate-400 bg-slate-950/40'
              }`}>
                <th className="p-3 whitespace-nowrap">ID &amp; Date</th>
                <th className="p-3 whitespace-nowrap">Client Contact</th>
                <th className="p-3 min-w-[180px]">Client Vehicle Offered</th>
                <th className="p-3 min-w-[180px]">Target Showroom Car</th>
                <th className="p-3 whitespace-nowrap">Photos Uploaded</th>
                <th className="p-3 whitespace-nowrap">Expected vs Offered</th>
                <th className="p-3 whitespace-nowrap">Status</th>
                <th className="p-3 whitespace-nowrap text-right">Actions</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isLight ? 'divide-slate-200' : 'divide-white/5'}`}>
              {loading ? (
                <tr>
                  <td colSpan={8} className="p-12 text-center text-slate-500 font-mono">
                    <div className="w-6 h-6 border-2 border-[#c9a84c] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    Loading trade-in database records...
                  </td>
                </tr>
              ) : paginatedTradeIns.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-12 text-center text-slate-500 font-mono">
                    No trade-in submissions found matching active filters.
                  </td>
                </tr>
              ) : (
                paginatedTradeIns.map((item) => {
                  const imgs = parseImages(item.images)
                  return (
                    <tr key={item.id} className={isLight ? 'hover:bg-slate-50 transition-colors' : 'hover:bg-white/[0.02] transition-colors'}>
                      {/* ID & Date */}
                      <td className="p-3 whitespace-nowrap">
                        <div className="font-bold text-slate-200">#{item.id}</div>
                        <div className="text-[10px] text-slate-500">
                          {new Date(item.created_at).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>

                      {/* Client Contact */}
                      <td className="p-3 whitespace-nowrap">
                        <div className="font-bold text-white flex items-center gap-1.5">
                          <User size={13} className="text-[#06b6d4]" />
                          <span>{item.client_name}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 flex items-center gap-2 mt-0.5">
                          {item.client_phone && (
                            <a href={`tel:${item.client_phone}`} className="flex items-center gap-1 hover:text-emerald-300 transition-colors">
                              <Phone size={10} className="text-emerald-400" />
                              {item.client_phone}
                            </a>
                          )}
                          {item.client_email && (
                            <a href={`mailto:${item.client_email}`} className="flex items-center gap-1 hover:text-purple-300 transition-colors">
                              <Mail size={10} className="text-purple-400" />
                              {item.client_email}
                            </a>
                          )}
                        </div>
                      </td>

                      {/* Client Vehicle Offered */}
                      <td className="p-3">
                        <ActionTooltip text="Open Full Dedicated Vehicle Detail Dossier Page">
                          <Link
                            to={`/crm/trade-ins/details/${item.id}`}
                            className="font-bold text-[#c9a84c] hover:text-amber-300 hover:underline transition-colors flex items-center gap-1.5 group cursor-pointer"
                          >
                            <span>{item.trade_vehicle_year} {item.trade_vehicle_make} {item.trade_vehicle_model}</span>
                            <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity text-[#c9a84c]" />
                          </Link>
                        </ActionTooltip>
                        <div className="text-[10px] text-slate-400 flex items-center gap-2 mt-0.5">
                          <span>Mileage: {item.trade_vehicle_mileage || '—'}</span>
                          <span>•</span>
                          <span className="text-slate-300 font-semibold">{item.trade_vehicle_condition}</span>
                        </div>
                      </td>

                      {/* Target Showroom Car */}
                      <td className="p-3">
                        <div className="font-bold text-slate-200 line-clamp-1">{item.target_vehicle_name}</div>
                        <div className="text-[10px] text-emerald-400">{item.target_vehicle_price}</div>
                      </td>

                      {/* Photos Uploaded Pill */}
                      <td className="p-3 whitespace-nowrap">
                        <ActionTooltip text="Inspect Vehicle Photos Lightbox">
                          <button
                            onClick={() => handleOpenInspect(item)}
                            className="px-2.5 py-1 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/20 font-bold text-[11px] flex items-center gap-1.5 transition-all cursor-pointer"
                          >
                            <ImageIcon size={13} />
                            <span>{imgs.length} Photo{imgs.length === 1 ? '' : 's'}</span>
                          </button>
                        </ActionTooltip>
                      </td>

                      {/* Expected vs Offered Valuation */}
                      <td className="p-3 whitespace-nowrap">
                        <div className="text-slate-300">
                          Exp: <span className="font-bold text-white">KES {Number(item.expected_trade_value || 0).toLocaleString()}</span>
                        </div>
                        <div className="text-[11px]">
                          Offer: <span className="font-bold text-emerald-400">
                            {item.offered_valuation ? `KES ${Number(item.offered_valuation).toLocaleString()}` : 'Not Appraised'}
                          </span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="p-3 whitespace-nowrap">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider ${
                          item.status === 'Approved' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' :
                          item.status === 'Offer Made' ? 'bg-sky-500/10 border-sky-500/30 text-sky-400' :
                          item.status === 'Under Review' ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400' :
                          item.status === 'Archived' ? 'bg-[#c9a84c]/10 border-[#c9a84c]/30 text-[#c9a84c]' :
                          item.status === 'Rejected' ? 'bg-rose-500/10 border-rose-500/30 text-rose-400' :
                          'bg-amber-500/10 border-amber-500/30 text-amber-400'
                        }`}>
                          {item.status || 'Pending'}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="p-3 whitespace-nowrap text-right space-x-1">
                        <ActionTooltip text="Inspect Request & Photos">
                          <button
                            onClick={() => handleOpenInspect(item)}
                            className="px-2.5 py-1.5 rounded-lg bg-sky-500/10 border border-sky-500/30 text-sky-400 hover:bg-sky-500/20 font-bold text-[11px] inline-flex items-center gap-1 transition-all cursor-pointer"
                          >
                            <Eye size={13} />
                            <span>Inspect</span>
                          </button>
                        </ActionTooltip>

                        <ActionTooltip text="Archive Trade-In Request">
                          <button
                            onClick={() => setActionConfirmModal({ isOpen: true, type: 'archive', item })}
                            className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20 inline-flex items-center transition-all cursor-pointer"
                          >
                            <Archive size={13} />
                          </button>
                        </ActionTooltip>

                        <ActionTooltip text="Permanently Delete Request">
                          <button
                            onClick={() => setActionConfirmModal({ isOpen: true, type: 'delete', item })}
                            className="p-1.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500/20 inline-flex items-center transition-all cursor-pointer"
                          >
                            <Trash2 size={13} />
                          </button>
                        </ActionTooltip>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Universal Pagination */}
        <UniversalPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredTradeIns.length}
          itemsPerPage={itemsPerPage}
          onPageChange={page => setCurrentPage(page)}
          onItemsPerPageChange={size => {
            setItemsPerPage(size)
            setCurrentPage(1)
          }}
          pageSizeOptions={[5, 10, 25, 50]}
        />
      </div>

      {/* Trade-In Inspection & Photo Gallery Modal */}
      {selectedTradeIn && (
        <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md animate-fade-in overflow-y-auto ${isLight ? 'bg-slate-900/40' : 'bg-slate-950/80'}`}>
          <div className={`relative w-full max-w-4xl my-8 rounded-3xl shadow-2xl overflow-hidden font-sans border ${
            isLight ? 'bg-white text-slate-900 border-slate-200' : 'bg-[#0b0f19] text-white border-white/10'
          }`}>
            
            {/* Header */}
            <div className={`flex items-center justify-between p-5 border-b ${
              isLight ? 'border-slate-200 bg-slate-50' : 'border-white/10 bg-slate-900/60'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl font-bold border ${
                  isLight ? 'bg-amber-50 text-[#b8942f] border-amber-200' : 'bg-[#c9a84c]/20 text-[#c9a84c] border-[#c9a84c]/30'
                }`}>
                  <Car size={20} />
                </div>
                <div>
                  <h3 className={`text-lg font-serif font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    Trade-In Request #{selectedTradeIn.id}
                  </h3>
                  <div className={`text-xs font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                    Submitted by <strong className={isLight ? 'text-slate-800' : 'text-white'}>{selectedTradeIn.client_name}</strong> • Phone: {selectedTradeIn.client_phone}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedTradeIn(null)}
                className={`p-2 rounded-xl border transition-colors ${
                  isLight ? 'border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-100' : 'border-white/10 text-slate-400 hover:text-white hover:bg-white/10'
                }`}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 max-h-[80vh] overflow-y-auto space-y-6">

              {/* Photo Gallery Lightbox */}
              {(() => {
                const photos = parseImages(selectedTradeIn.images)
                if (photos.length === 0) return (
                  <div className={`p-8 text-center rounded-2xl border font-mono text-xs ${
                    isLight ? 'bg-slate-50 border-slate-200 text-slate-400' : 'bg-slate-900/50 border-white/10 text-slate-400'
                  }`}>
                    📷 No vehicle photos uploaded by client for this trade-in submission.
                  </div>
                )

                return (
                  <div className={`p-4 rounded-2xl border space-y-3 ${
                    isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/60 border-white/10'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className={`text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                        isLight ? 'text-indigo-600' : 'text-indigo-400'
                      }`}>
                        <ImageIcon size={14} />
                        <span>Client Vehicle Photo Gallery ({photos.length} Photos)</span>
                      </div>
                      <span className={`text-[10px] font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                        Photo #{activePhotoIdx + 1} of {photos.length}
                      </span>
                    </div>

                    {/* Main Featured Photo Frame */}
                    <div className={`relative w-full aspect-video rounded-2xl overflow-hidden border flex items-center justify-center ${
                      isLight ? 'border-slate-200 bg-slate-100' : 'border-white/10 bg-slate-950'
                    }`}>
                      <img
                        src={photos[activePhotoIdx]}
                        alt={`Client Trade-In Photo ${activePhotoIdx + 1}`}
                        className="w-full h-full object-contain"
                      />

                      {photos.length > 1 && (
                        <>
                          <button
                            onClick={() => setActivePhotoIdx(prev => (prev > 0 ? prev - 1 : photos.length - 1))}
                            className={`absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full border transition-colors shadow-lg ${
                              isLight ? 'bg-white/90 text-slate-700 border-slate-200 hover:bg-white' : 'bg-slate-950/80 text-white border-white/20 hover:bg-slate-900'
                            }`}
                          >
                            <ChevronLeft size={20} />
                          </button>
                          <button
                            onClick={() => setActivePhotoIdx(prev => (prev < photos.length - 1 ? prev + 1 : 0))}
                            className={`absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full border transition-colors shadow-lg ${
                              isLight ? 'bg-white/90 text-slate-700 border-slate-200 hover:bg-white' : 'bg-slate-950/80 text-white border-white/20 hover:bg-slate-900'
                            }`}
                          >
                            <ChevronRight size={20} />
                          </button>
                        </>
                      )}
                    </div>

                    {/* Thumbnails Carousel */}
                    {photos.length > 1 && (
                      <div className="flex items-center gap-2 overflow-x-auto pt-1 pb-2">
                        {photos.map((url, idx) => (
                          <button
                            key={idx}
                            onClick={() => setActivePhotoIdx(idx)}
                            className={`relative w-20 h-14 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${
                              activePhotoIdx === idx
                                ? 'border-[#c9a84c] scale-105 shadow-md'
                                : isLight ? 'border-slate-200 opacity-60 hover:opacity-100' : 'border-white/10 opacity-60 hover:opacity-100'
                            }`}
                          >
                            <img src={url} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })()}

              {/* Specs Grid: Trade Vehicle vs Target Showroom Vehicle */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Offered Vehicle Specs */}
                <div className={`p-4 rounded-2xl border space-y-2 font-mono text-xs ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/60 border-white/10'
                }`}>
                  <div className={`font-bold text-xs uppercase tracking-wider mb-2 flex items-center gap-1 ${
                    isLight ? 'text-emerald-600' : 'text-emerald-400'
                  }`}>
                    <Car size={14} />
                    <span>Client's Vehicle Offered</span>
                  </div>
                  <div className={`flex justify-between border-b pb-1 ${isLight ? 'border-slate-100' : 'border-white/5'}`}>
                    <span className={isLight ? 'text-slate-500' : 'text-slate-400'}>Make &amp; Model:</span>
                    <span className={`font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>{selectedTradeIn.trade_vehicle_year} {selectedTradeIn.trade_vehicle_make} {selectedTradeIn.trade_vehicle_model}</span>
                  </div>
                  <div className={`flex justify-between border-b pb-1 ${isLight ? 'border-slate-100' : 'border-white/5'}`}>
                    <span className={isLight ? 'text-slate-500' : 'text-slate-400'}>Mileage:</span>
                    <span className={isLight ? 'text-slate-700' : 'text-slate-200'}>{selectedTradeIn.trade_vehicle_mileage || '—'}</span>
                  </div>
                  <div className={`flex justify-between border-b pb-1 ${isLight ? 'border-slate-100' : 'border-white/5'}`}>
                    <span className={isLight ? 'text-slate-500' : 'text-slate-400'}>Condition:</span>
                    <span className={isLight ? 'text-slate-700' : 'text-slate-200'}>{selectedTradeIn.trade_vehicle_condition}</span>
                  </div>
                  <div className={`flex justify-between border-b pb-1 ${isLight ? 'border-slate-100' : 'border-white/5'}`}>
                    <span className={isLight ? 'text-slate-500' : 'text-slate-400'}>Registration:</span>
                    <span className={isLight ? 'text-slate-700' : 'text-slate-200'}>{selectedTradeIn.trade_vehicle_registration || 'Not provided'}</span>
                  </div>
                  <div className="flex justify-between pt-1">
                    <span className={isLight ? 'text-slate-500' : 'text-slate-400'}>Client Expected Value:</span>
                    <span className="font-bold text-[#c9a84c]">KES {Number(selectedTradeIn.expected_trade_value || 0).toLocaleString()}</span>
                  </div>
                </div>

                {/* Target Showroom Vehicle */}
                <div className={`p-4 rounded-2xl border space-y-2 font-mono text-xs ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/60 border-white/10'
                }`}>
                  <div className={`font-bold text-xs uppercase tracking-wider mb-2 flex items-center gap-1 ${
                    isLight ? 'text-cyan-600' : 'text-[#06b6d4]'
                  }`}>
                    <Sparkles size={14} />
                    <span>Showroom Target Vehicle</span>
                  </div>
                  <div className={`flex justify-between border-b pb-1 ${isLight ? 'border-slate-100' : 'border-white/5'}`}>
                    <span className={isLight ? 'text-slate-500' : 'text-slate-400'}>Vehicle Title:</span>
                    <span className={`font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>{selectedTradeIn.target_vehicle_name}</span>
                  </div>
                  <div className={`flex justify-between border-b pb-1 ${isLight ? 'border-slate-100' : 'border-white/5'}`}>
                    <span className={isLight ? 'text-slate-500' : 'text-slate-400'}>Showroom Price:</span>
                    <span className={`font-bold ${isLight ? 'text-emerald-600' : 'text-emerald-400'}`}>{selectedTradeIn.target_vehicle_price}</span>
                  </div>
                  <div className={`pt-2 text-[11px] ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                    <strong className={`block mb-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Client Comments / Notes:</strong>
                    <div className={`p-2.5 rounded-xl border italic leading-relaxed ${
                      isLight ? 'bg-white border-slate-200 text-slate-600' : 'bg-slate-950 border-white/10 text-slate-300'
                    }`}>
                      "{selectedTradeIn.client_notes || 'No comments provided by client.'}"
                    </div>
                  </div>
                </div>
              </div>

              {/* Appraisal Controls & Official Valuation Form */}
              <div className={`p-5 rounded-2xl border space-y-4 font-mono ${
                isLight ? 'bg-gradient-to-br from-slate-50 to-white border-slate-200' : 'bg-gradient-to-br from-slate-900 to-[#0c1427] border-white/10'
              }`}>
                <div className={`flex items-center justify-between border-b pb-3 ${isLight ? 'border-slate-200' : 'border-white/10'}`}>
                  <div className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                    isLight ? 'text-[#b8942f]' : 'text-[#c9a84c]'
                  }`}>
                    <DollarSign size={16} />
                    <span>KnK Official Valuation &amp; Appraisal Update</span>
                  </div>
                  <a
                    href={`https://wa.me/${(selectedTradeIn.client_phone || '').replace(/\D/g, '')}?text=Hi%20${encodeURIComponent(selectedTradeIn.client_name)},%20this%20is%20KnK%20Automotive%20regarding%20your%20Trade-In%20inquiry%20for%20the%20${encodeURIComponent(selectedTradeIn.target_vehicle_name)}.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all ${
                      isLight ? 'bg-emerald-50 border-emerald-200 text-emerald-600 hover:bg-emerald-100' : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/30'
                    }`}
                  >
                    <Send size={13} />
                    <span>WhatsApp Direct Quote</span>
                  </a>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-[11px] mb-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Appraised Offered Valuation (KES)</label>
                    <div className="relative flex items-center">
                      <span className={`absolute left-3 text-xs font-bold ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>KES</span>
                      <input
                        type="text"
                        value={offeredValuationInput}
                        onChange={e => setOfferedValuationInput(e.target.value)}
                        placeholder="e.g. 4,200,000"
                        className={`w-full pl-12 pr-3 py-2 rounded-xl border text-xs focus:outline-none ${
                          isLight ? 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-emerald-500' : 'bg-slate-950 border-white/10 text-white focus:border-emerald-500'
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={`block text-[11px] mb-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Trade-In Status</label>
                    <PredictiveSelect
                      options={STATUS_OPTIONS.filter(s => s.value !== 'all')}
                      value={statusInput}
                      onChange={val => setStatusInput(val)}
                      placeholder="Set status..."
                      isLight={isLight}
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-[11px] mb-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Admin Appraisal Notes</label>
                  <textarea
                    rows={2}
                    value={adminNotesInput}
                    onChange={e => setAdminNotesInput(e.target.value)}
                    placeholder="Enter valuation rationale, inspection scheduling notes, or internal remarks..."
                    className={`w-full p-3 rounded-xl border text-xs focus:outline-none ${
                      isLight ? 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-[#c9a84c]' : 'bg-slate-950 border-white/10 text-white placeholder:text-slate-600 focus:border-[#c9a84c]'
                    }`}
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={handleSaveAppraisal}
                    disabled={isUpdating}
                    className="px-6 py-2.5 bg-gradient-to-r from-[#06b6d4] to-blue-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:opacity-95 transition-all flex items-center gap-2 shadow-lg disabled:opacity-50"
                  >
                    {isUpdating ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Saving Appraisal...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle size={15} />
                        <span>Save Appraisal &amp; Update Status</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* Action Confirmation Warning Popup Modal */}
      {actionConfirmModal.isOpen && actionConfirmModal.item && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in font-sans">
          <div className={`relative w-full max-w-md p-6 border rounded-3xl shadow-2xl overflow-hidden space-y-5 transition-colors duration-300 ${
            isLight ? 'bg-white text-slate-900 border-slate-200' : 'bg-[#0b0f19] text-white border-white/10'
          }`}>
            <div className="flex items-start gap-4">
              <div className={`p-3.5 rounded-2xl border shrink-0 animate-pulse ${
                actionConfirmModal.type === 'delete'
                  ? 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                  : 'bg-amber-500/20 text-amber-400 border-amber-500/40'
              }`}>
                {actionConfirmModal.type === 'delete' ? <Trash2 size={24} /> : <Archive size={24} />}
              </div>

              <div className="flex-1 min-w-0">
                <span className={`text-[10px] font-mono font-bold tracking-[2px] uppercase ${
                  actionConfirmModal.type === 'delete' ? 'text-rose-400' : 'text-amber-400'
                }`}>
                  ⚠️ Warning Action Required
                </span>
                <h3 className={`text-lg font-serif font-bold mt-0.5 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  {actionConfirmModal.type === 'delete' ? 'Delete Trade-In Request?' : 'Archive Trade-In Request?'}
                </h3>
                <p className={`text-xs font-mono mt-1.5 leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                  Are you sure you want to {actionConfirmModal.type === 'delete' ? 'permanently delete' : 'archive'} trade-in request <strong className={isLight ? 'text-slate-900' : 'text-white'}>#{actionConfirmModal.item.id}</strong> submitted by <strong className="text-[#c9a84c]">{actionConfirmModal.item.client_name}</strong>?
                </p>

                <div className={`mt-3 p-3 rounded-xl border font-mono text-[11px] space-y-1 ${
                  isLight ? 'bg-slate-50 border-slate-200 text-slate-700' : 'bg-slate-950 border-white/10 text-slate-300'
                }`}>
                  <div>Offered Vehicle: <span className="font-bold text-emerald-400">{actionConfirmModal.item.trade_vehicle_year} {actionConfirmModal.item.trade_vehicle_make} {actionConfirmModal.item.trade_vehicle_model}</span></div>
                  <div>Target Stock: <span className="font-bold text-sky-400">{actionConfirmModal.item.target_vehicle_name}</span></div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={() => setActionConfirmModal({ isOpen: false, type: 'archive', item: null })}
                className={`px-4 py-2.5 rounded-xl border font-mono text-xs transition-colors ${
                  isLight ? 'border-slate-300 text-slate-700 hover:bg-slate-100' : 'border-white/10 text-slate-300 hover:bg-white/5'
                }`}
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleExecuteActionConfirm}
                className={`px-5 py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider text-slate-950 transition-all shadow-lg flex items-center gap-1.5 cursor-pointer ${
                  actionConfirmModal.type === 'delete'
                    ? 'bg-gradient-to-r from-rose-500 to-red-600 text-white hover:opacity-90'
                    : 'bg-gradient-to-r from-amber-400 to-[#c9a84c] text-slate-950 hover:opacity-90'
                }`}
              >
                {actionConfirmModal.type === 'delete' ? (
                  <>
                    <Trash2 size={14} />
                    <span>Yes, Delete Permanently</span>
                  </>
                ) : (
                  <>
                    <Archive size={14} />
                    <span>Yes, Move to Archive</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
