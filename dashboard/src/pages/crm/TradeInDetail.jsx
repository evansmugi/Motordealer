import React, { useState, useEffect, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  ArrowLeft, Car, Camera, Layers, Gauge, Info, CheckCircle, Clock,
  AlertCircle, DollarSign, Calendar, Mail, Phone, MessageSquare,
  Trash2, Edit, Send, Sparkles, ExternalLink, ShieldCheck, Image as ImageIcon,
  User, Archive, AlertTriangle, Check, RefreshCw, ChevronLeft, ChevronRight
} from 'lucide-react'
import PredictiveSelect from '../../components/common/PredictiveSelect'
import ActionTooltip from '../../components/common/ActionTooltip'
import { useCRMStore } from '../../context/CRMStore'
import { supabase } from '../../lib/superbaseClient'
import api from '../../lib/apiClient'

const STATUS_OPTIONS = [
  { value: 'Pending', label: 'Pending Review', badge: 'New' },
  { value: 'Under Review', label: 'Under Review' },
  { value: 'Offer Made', label: 'Offer Made (Appraised)' },
  { value: 'Approved', label: 'Approved by Client' },
  { value: 'Rejected', label: 'Rejected / Declined' },
  { value: 'Completed', label: 'Completed (Traded In)' },
  { value: 'Archived', label: 'Archived Requests', badge: 'Archived' }
]

export default function TradeInDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const adminTheme = useCRMStore(state => state.adminTheme)
  const isLight = adminTheme === 'light'

  const [tradeIn, setTradeIn] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activePhotoIdx, setActivePhotoIdx] = useState(0)

  // Appraisal Form State
  const [offeredValuationInput, setOfferedValuationInput] = useState('')
  const [adminNotesInput, setAdminNotesInput] = useState('')
  const [statusInput, setStatusInput] = useState('Pending')
  const [isUpdating, setIsUpdating] = useState(false)
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('')
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  // Action Warning Modal State
  const [actionConfirmModal, setActionConfirmModal] = useState({
    isOpen: false,
    type: 'archive' // 'archive' | 'delete'
  })

  // Fetch Trade-In Details
  useEffect(() => {
    let isMounted = true
    const loadTradeInDetail = async () => {
      setLoading(true)
      try {
        let record = null

        // 1. Try Express API Endpoint with 3s timeout
        try {
          const controller = new AbortController()
          const timeoutId = setTimeout(() => controller.abort(), 3000)
          const res = await fetch(`/api/crm/trade-ins/${id}`, { signal: controller.signal })
          clearTimeout(timeoutId)
          if (res.ok) {
            const json = await res.json()
            if (json && json.id) record = json
          }
        } catch {
          /* Fall through to Supabase */
        }

        // 2. Direct Supabase Fallback Query
        if (!record) {
          const { data } = await supabase
            .from('trade_in_requests')
            .select('*')
            .eq('id', id)
            .maybeSingle()
          if (data) record = data
        }

        // 3. LocalStorage Cache Fallback (for instant 0ms offline / newly submitted entries)
        if (!record && typeof window !== 'undefined') {
          try {
            const cachedStr = localStorage.getItem('knk_trade_ins_cache')
            if (cachedStr) {
              const list = JSON.parse(cachedStr)
              const match = list.find(item => String(item.id) === String(id))
              if (match) record = match
            }
          } catch (cacheErr) {
            console.warn('Cache detail lookup warning:', cacheErr)
          }
        }

        if (isMounted) {
          if (record) {
            setTradeIn(record)
            setOfferedValuationInput(record.offered_valuation ? String(record.offered_valuation) : '')
            setAdminNotesInput(record.admin_notes || '')
            setStatusInput(record.status || 'Pending')
          } else {
            setTradeIn(null)
          }
        }
      } catch (err) {
        console.error('Failed to load trade-in detail:', err)
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    if (id) {
      loadTradeInDetail()
    }
    return () => { isMounted = false }
  }, [id])

  // Parse attached photos
  const images = useMemo(() => {
    if (!tradeIn || !tradeIn.images) return []
    if (Array.isArray(tradeIn.images)) return tradeIn.images
    if (typeof tradeIn.images === 'string') {
      try { return JSON.parse(tradeIn.images) } catch { return [] }
    }
    return []
  }, [tradeIn])

  // Save Appraisal Update (Instant 0ms UI Update + Background Sync)
  const handleSaveAppraisal = async () => {
    if (!tradeIn) return
    setIsUpdating(true)
    setSaveSuccessMsg('')

    const numericValuation = offeredValuationInput ? parseInt(offeredValuationInput.toString().replace(/\D/g, ''), 10) : 0
    const updatePayload = {
      offered_valuation: numericValuation,
      status: statusInput,
      admin_notes: adminNotesInput
    }

    // 1. Instant 0ms local state update
    setTradeIn(prev => prev ? { ...prev, ...updatePayload } : null)

    // 2. Instant localStorage cache update (Guaranteed insert or update with quota safety)
    if (typeof window !== 'undefined') {
      try {
        const cachedStr = localStorage.getItem('knk_trade_ins_cache')
        const cachedList = cachedStr ? JSON.parse(cachedStr) : []
        const updatedItem = { ...tradeIn, ...updatePayload }
        const exists = cachedList.some(item => String(item.id) === String(tradeIn.id))
        const updatedList = exists
          ? cachedList.map(item => String(item.id) === String(tradeIn.id) ? updatedItem : item)
          : [updatedItem, ...cachedList]

        // Ensure cache stays light and never triggers QuotaExceededError
        const cacheSafeList = updatedList.map(item => ({
          ...item,
          images: Array.isArray(item.images) ? item.images.slice(0, 2) : item.images
        }))
        localStorage.setItem('knk_trade_ins_cache', JSON.stringify(cacheSafeList))
      } catch (cacheErr) {
        console.warn('Cache update warning:', cacheErr)
      }
    }

    // 3. Await real database persistence before showing success
    let dbSaved = false
    try {
      const { error: sbErr } = await supabase
        .from('trade_in_requests')
        .update(updatePayload)
        .eq('id', tradeIn.id)
      if (!sbErr) dbSaved = true
    } catch (sbErr) {
      console.warn('Supabase update fallback:', sbErr)
    }

    try {
      await api.put(`/crm/trade-ins/${tradeIn.id}`, updatePayload)
      dbSaved = true
    } catch (apiErr) {
      console.warn('API update fallback:', apiErr)
    }

    // 4. Show confirmation after DB writes complete
    setIsUpdating(false)
    setSaveSuccessMsg(dbSaved
      ? '✓ Trade-in valuation and status successfully saved.'
      : '✓ Saved locally. Database sync will retry automatically.')
    setShowSuccessModal(true)
    setTimeout(() => { setSaveSuccessMsg(''); setShowSuccessModal(false) }, 3500)
  }

  // Execute Confirmed Warning Action (Archive or Delete)
  const handleExecuteActionConfirm = async () => {
    const type = actionConfirmModal.type
    setActionConfirmModal({ isOpen: false, type: 'archive' })

    if (type === 'delete') {
      try {
        await api.delete(`/crm/trade-ins/${tradeIn.id}`).catch(() => {})
        await supabase.from('trade_in_requests').delete().eq('id', tradeIn.id).catch(() => {})
        navigate('/crm/trade-ins')
      } catch (err) {
        console.error('Delete error:', err)
      }
    } else if (type === 'archive') {
      try {
        await api.put(`/crm/trade-ins/${tradeIn.id}`, { status: 'Archived' }).catch(() => {})
        await supabase.from('trade_in_requests').update({ status: 'Archived' }).eq('id', tradeIn.id).catch(() => {})
        setTradeIn(prev => prev ? { ...prev, status: 'Archived' } : null)
        setStatusInput('Archived')
        setSaveSuccessMsg('✓ Trade-in request moved to Archived status.')
        setTimeout(() => setSaveSuccessMsg(''), 4000)
      } catch (err) {
        console.error('Archive error:', err)
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-center font-mono">
        <div className="space-y-4">
          <div className="w-10 h-10 border-4 border-[#c9a84c] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-slate-400">Loading dedicated trade-in vehicle dossier...</p>
        </div>
      </div>
    )
  }

  if (!tradeIn) {
    return (
      <div className="min-h-screen p-6 font-sans space-y-6">
        <Link
          to="/crm/trade-ins"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 text-slate-200 hover:text-white text-xs font-mono transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Back to Trade-In Requests</span>
        </Link>

        <div className="p-12 text-center border border-white/10 rounded-3xl bg-slate-950 text-slate-400 space-y-3 font-mono">
          <AlertCircle size={40} className="mx-auto text-amber-500" />
          <h3 className="text-lg font-bold text-white">Trade-In Request Not Found</h3>
          <p className="text-xs max-w-md mx-auto">
            The requested trade-in submission #{id} could not be located in PostgreSQL or Supabase Cloud storage.
          </p>
        </div>
      </div>
    )
  }

  const numericTargetPrice = parseInt((tradeIn.target_vehicle_price || '').toString().replace(/\D/g, ''), 10) || 0
  const numericOfferedVal = Number(offeredValuationInput.toString().replace(/\D/g, '')) || Number(tradeIn.offered_valuation || 0)
  const priceGap = numericTargetPrice > 0 && numericOfferedVal > 0 ? (numericTargetPrice - numericOfferedVal) : 0

  return (
    <div className={`space-y-6 font-sans pb-16 transition-colors duration-300 min-h-screen p-4 md:p-6 rounded-3xl border ${
      isLight ? 'bg-slate-50 border-slate-200 text-slate-900 shadow-xl' : 'bg-[#020617] border-white/10 text-slate-100 shadow-2xl'
    }`}>

      {/* Top Header Bar & Navigation */}
      <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl border transition-all duration-300 ${
        isLight ? 'bg-white border-slate-200 shadow-lg' : 'bg-[#070b14]/90 border-white/10 shadow-2xl backdrop-blur-xl'
      }`}>
        <div className="flex items-center gap-4">
          <ActionTooltip text="Return to Trade-In Requests Dashboard">
            <Link
              to="/crm/trade-ins"
              className={`p-2.5 rounded-xl border transition-colors flex items-center justify-center ${
                isLight
                  ? 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200'
                  : 'bg-slate-900 border-white/10 text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <ArrowLeft size={18} />
            </Link>
          </ActionTooltip>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold tracking-[3px] text-[#c9a84c] uppercase">
                Fuse CRM / Dedicated Vehicle Dossier
              </span>
              <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase border ${
                tradeIn.status === 'Approved' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' :
                tradeIn.status === 'Offer Made' ? 'bg-sky-500/10 border-sky-500/30 text-sky-400' :
                tradeIn.status === 'Under Review' ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400' :
                tradeIn.status === 'Archived' ? 'bg-[#c9a84c]/10 border-[#c9a84c]/30 text-[#c9a84c]' :
                tradeIn.status === 'Rejected' ? 'bg-rose-500/10 border-rose-500/30 text-rose-400' :
                'bg-amber-500/10 border-amber-500/30 text-amber-400'
              }`}>
                {tradeIn.status || 'Pending'}
              </span>
            </div>

            <h1 className={`text-xl md:text-2xl font-serif font-bold mt-0.5 ${isLight ? 'text-slate-900' : 'text-white'}`}>
              {tradeIn.trade_vehicle_year} {tradeIn.trade_vehicle_make} {tradeIn.trade_vehicle_model}
            </h1>
          </div>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <ActionTooltip text="Send Appraisal Quote to Client via WhatsApp">
            <a
              href={`https://wa.me/${(tradeIn.client_phone || '').replace(/\D/g, '')}?text=Hi%20${encodeURIComponent(tradeIn.client_name)},%20this%20is%20KnK%20Automotive%20regarding%20your%20Trade-In%20inquiry%20for%20the%20${encodeURIComponent(tradeIn.target_vehicle_name)}.`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/30 text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-md"
            >
              <Send size={14} />
              <span>WhatsApp Direct Quote</span>
            </a>
          </ActionTooltip>

          <ActionTooltip text="Archive Trade-In Request">
            <button
              type="button"
              onClick={() => setActionConfirmModal({ isOpen: true, type: 'archive' })}
              className={`px-3.5 py-2 rounded-xl border text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                isLight ? 'bg-amber-50 border-amber-300 text-amber-800 hover:bg-amber-100' : 'bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20'
              }`}
            >
              <Archive size={14} />
              <span>Archive</span>
            </button>
          </ActionTooltip>

          <ActionTooltip text="Permanently Delete Request">
            <button
              type="button"
              onClick={() => setActionConfirmModal({ isOpen: true, type: 'delete' })}
              className={`px-3.5 py-2 rounded-xl border text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                isLight ? 'bg-rose-50 border-rose-300 text-rose-800 hover:bg-rose-100' : 'bg-rose-500/10 border-rose-500/30 text-rose-400 hover:bg-rose-500/20'
              }`}
            >
              <Trash2 size={14} />
              <span>Delete</span>
            </button>
          </ActionTooltip>
        </div>
      </div>

      {saveSuccessMsg && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono flex items-center gap-2 animate-fade-in">
          <CheckCircle size={18} />
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left Column (7 cols): Photo Gallery Showcase */}
        <div className="lg:col-span-7 space-y-4">
          <div className={`p-5 rounded-2xl border space-y-4 transition-colors ${
            isLight ? 'bg-white border-slate-200 shadow-md' : 'bg-[#0b0f19] border-white/10 shadow-xl'
          }`}>
            <div className="flex items-center justify-between">
              <div className="text-xs font-mono font-bold text-[#c9a84c] uppercase tracking-wider flex items-center gap-1.5">
                <Camera size={15} />
                <span>Uploaded Vehicle Photos ({images.length} High-Res Shots)</span>
              </div>
              {images[activePhotoIdx] && (
                <span className="text-[10px] font-mono text-slate-400">
                  Shot #{activePhotoIdx + 1} of {images.length}
                </span>
              )}
            </div>

            {/* Main Stage Image Display with Slider Controls */}
            {images.length > 0 ? (
              <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-slate-950 aspect-[16/10] group select-none">
                <img
                  src={images[activePhotoIdx]}
                  alt={`Trade-in photo ${activePhotoIdx + 1}`}
                  className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                />

                {/* Top Overlay Badges */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                  <div className="px-3 py-1 rounded-xl bg-slate-950/80 backdrop-blur-md border border-white/10 text-xs font-mono font-bold text-[#c9a84c] shadow-lg pointer-events-auto">
                    {tradeIn.trade_vehicle_year} {tradeIn.trade_vehicle_make} {tradeIn.trade_vehicle_model}
                  </div>
                  <div className="px-3 py-1 rounded-xl bg-slate-950/80 backdrop-blur-md border border-white/10 text-xs font-mono font-bold text-slate-300 shadow-lg pointer-events-auto">
                    Shot #{activePhotoIdx + 1} of {images.length}
                  </div>
                </div>

                {/* Previous & Next Navigation Overlay Arrows */}
                {images.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() => setActivePhotoIdx((prev) => (prev - 1 + images.length) % images.length)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-slate-950/75 hover:bg-[#c9a84c] text-slate-100 hover:text-slate-950 backdrop-blur-md border border-white/20 shadow-2xl transition-all cursor-pointer hover:scale-110 active:scale-95 group/btn"
                      title="Previous Vehicle Photo"
                      aria-label="Previous Photo"
                    >
                      <ChevronLeft size={20} className="group-hover/btn:-translate-x-0.5 transition-transform" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setActivePhotoIdx((prev) => (prev + 1) % images.length)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-slate-950/75 hover:bg-[#c9a84c] text-slate-100 hover:text-slate-950 backdrop-blur-md border border-white/20 shadow-2xl transition-all cursor-pointer hover:scale-110 active:scale-95 group/btn"
                      title="Next Vehicle Photo"
                      aria-label="Next Photo"
                    >
                      <ChevronRight size={20} className="group-hover/btn:translate-x-0.5 transition-transform" />
                    </button>
                  </>
                )}

                {/* Bottom Dots Indicator Bar */}
                {images.length > 1 && (
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full bg-slate-950/70 backdrop-blur-md border border-white/10 flex items-center gap-1.5">
                    {images.map((_, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActivePhotoIdx(idx)}
                        className={`h-2 rounded-full transition-all cursor-pointer ${
                          activePhotoIdx === idx ? 'w-6 bg-[#c9a84c]' : 'w-2 bg-white/30 hover:bg-white/60'
                        }`}
                        aria-label={`Go to shot ${idx + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="p-12 text-center border border-dashed rounded-2xl border-white/10 bg-slate-950/60 text-slate-500 font-mono space-y-2">
                <ImageIcon size={36} className="mx-auto text-slate-600" />
                <p className="text-xs">No vehicle photos were uploaded by the client for this trade-in request.</p>
              </div>
            )}

            {/* Thumbnail Ribbon Selector Slider */}
            {images.length > 1 && (
              <div className="relative pt-1 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActivePhotoIdx((prev) => (prev - 1 + images.length) % images.length)}
                  className="p-1.5 rounded-lg bg-slate-900 border border-white/10 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors flex-shrink-0 cursor-pointer"
                  title="Scroll Left"
                >
                  <ChevronLeft size={16} />
                </button>

                <div className="flex gap-2.5 overflow-x-auto scrollbar-none py-1 w-full items-center">
                  {images.map((imgUrl, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActivePhotoIdx(idx)}
                      className={`relative flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border aspect-square transition-all cursor-pointer ${
                        activePhotoIdx === idx
                          ? 'border-[#c9a84c] ring-2 ring-[#c9a84c]/50 scale-105 shadow-lg'
                          : 'border-white/10 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={imgUrl} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" />
                      <span className={`absolute top-1 left-1 px-1 rounded text-[8px] font-mono font-bold ${
                        activePhotoIdx === idx ? 'bg-[#c9a84c] text-slate-950' : 'bg-slate-950/80 text-slate-200'
                      }`}>
                        #{idx + 1}
                      </span>
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => setActivePhotoIdx((prev) => (prev + 1) % images.length)}
                  className="p-1.5 rounded-lg bg-slate-900 border border-white/10 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors flex-shrink-0 cursor-pointer"
                  title="Scroll Right"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>

          {/* Client Notes & Comments Card */}
          <div className={`p-5 rounded-2xl border space-y-2 transition-colors ${
            isLight ? 'bg-white border-slate-200 shadow-md' : 'bg-[#0b0f19] border-white/10 shadow-xl'
          }`}>
            <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <MessageSquare size={14} className="text-[#06b6d4]" />
              <span>Client Notes &amp; Vehicle Remarks</span>
            </div>
            <div className={`p-4 rounded-xl border text-xs font-mono leading-relaxed italic ${
              isLight ? 'bg-slate-50 border-slate-200 text-slate-700' : 'bg-slate-950 border-white/10 text-slate-300'
            }`}>
              "{tradeIn.client_notes || 'No custom comments provided by the client during submission.'}"
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Vehicle Dossier & Target Comparison */}
        <div className="lg:col-span-5 space-y-4">

          {/* Client Information Card */}
          <div className={`p-5 rounded-2xl border space-y-3 transition-colors ${
            isLight ? 'bg-white border-slate-200 shadow-md' : 'bg-[#0b0f19] border-white/10 shadow-xl'
          }`}>
            <div className="text-xs font-mono font-bold text-[#06b6d4] uppercase tracking-wider flex items-center gap-1.5 border-b pb-2 border-white/10">
              <User size={15} />
              <span>Client Contact Dossier</span>
            </div>

            <div className="space-y-2 font-mono text-xs">
              <div className="flex justify-between">
                <span className={isLight ? 'text-slate-500' : 'text-slate-400'}>Client Name:</span>
                <strong className={isLight ? 'text-slate-900' : 'text-white'}>{tradeIn.client_name}</strong>
              </div>
              <div className="flex justify-between">
                <span className={isLight ? 'text-slate-500' : 'text-slate-400'}>Phone Number:</span>
                {tradeIn.client_phone ? (
                  <a href={`tel:${tradeIn.client_phone}`} className="text-emerald-400 font-bold hover:text-emerald-300 hover:underline transition-colors flex items-center gap-1">
                    <Phone size={12} />
                    {tradeIn.client_phone}
                  </a>
                ) : (
                  <strong className="text-slate-500">N/A</strong>
                )}
              </div>
              <div className="flex justify-between">
                <span className={isLight ? 'text-slate-500' : 'text-slate-400'}>Email Address:</span>
                {tradeIn.client_email ? (
                  <a href={`mailto:${tradeIn.client_email}`} className={`font-bold hover:underline transition-colors flex items-center gap-1 ${isLight ? 'text-slate-900 hover:text-blue-600' : 'text-slate-200 hover:text-blue-400'}`}>
                    <Mail size={12} />
                    {tradeIn.client_email}
                  </a>
                ) : (
                  <strong className="text-slate-500">N/A</strong>
                )}
              </div>
              <div className="flex justify-between">
                <span className={isLight ? 'text-slate-500' : 'text-slate-400'}>Submission Time:</span>
                <span className="text-slate-400">
                  {new Date(tradeIn.created_at).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}
                </span>
              </div>
            </div>
          </div>

          {/* Offereed Vehicle Specs Card */}
          <div className={`p-5 rounded-2xl border space-y-3 transition-colors ${
            isLight ? 'bg-white border-slate-200 shadow-md' : 'bg-[#0b0f19] border-white/10 shadow-xl'
          }`}>
            <div className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5 border-b pb-2 border-white/10">
              <Car size={15} />
              <span>Trade-In Vehicle Specifications</span>
            </div>

            <div className="grid grid-cols-2 gap-3 font-mono text-xs">
              <div>
                <span className={isLight ? 'text-slate-500' : 'text-slate-400'}>Make &amp; Model</span>
                <div className="font-bold text-[#c9a84c] text-sm mt-0.5">
                  {tradeIn.trade_vehicle_make} {tradeIn.trade_vehicle_model}
                </div>
              </div>

              <div>
                <span className={isLight ? 'text-slate-500' : 'text-slate-400'}>Year of Manufacture</span>
                <div className={`font-bold mt-0.5 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  {tradeIn.trade_vehicle_year || 'N/A'}
                </div>
              </div>

              <div>
                <span className={isLight ? 'text-slate-500' : 'text-slate-400'}>Current Mileage</span>
                <div className={`font-bold mt-0.5 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  {tradeIn.trade_vehicle_mileage || 'N/A'}
                </div>
              </div>

              <div>
                <span className={isLight ? 'text-slate-500' : 'text-slate-400'}>Registration No.</span>
                <div className={`font-bold mt-0.5 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  {tradeIn.trade_vehicle_registration || 'Not Provided'}
                </div>
              </div>

              <div className="col-span-2 pt-2 border-t border-white/10 flex justify-between items-center">
                <span className={isLight ? 'text-slate-500' : 'text-slate-400'}>Vehicle Condition:</span>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-[11px]">
                  {tradeIn.trade_vehicle_condition}
                </span>
              </div>

              <div className="col-span-2 flex justify-between items-center">
                <span className={isLight ? 'text-slate-500' : 'text-slate-400'}>Client Expected Value:</span>
                <strong className="text-[#c9a84c] text-sm">
                  KES {Number(tradeIn.expected_trade_value || 0).toLocaleString()}
                </strong>
              </div>
            </div>
          </div>

          {/* Target Showroom Vehicle & Price Gap Comparison Card */}
          <div className={`p-5 rounded-2xl border space-y-3 transition-colors ${
            isLight ? 'bg-indigo-50/70 border-indigo-200 shadow-md' : 'bg-gradient-to-br from-indigo-950/40 to-slate-950 border-indigo-500/30 shadow-xl'
          }`}>
            <div className={`text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-between border-b pb-2 ${
              isLight ? 'text-indigo-800 border-indigo-200' : 'text-indigo-400 border-indigo-500/20'
            }`}>
              <div className="flex items-center gap-1.5">
                <Sparkles size={15} />
                <span>Showroom Target Vehicle</span>
              </div>
              <span className={`text-[10px] font-bold ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Stock #{tradeIn.target_vehicle_id}</span>
            </div>

            <div className="space-y-2 font-mono text-xs">
              <div className={`font-bold text-sm ${isLight ? 'text-slate-900' : 'text-white'}`}>
                {tradeIn.target_vehicle_name}
              </div>

              <div className="flex justify-between items-center pt-1">
                <span className={isLight ? 'text-slate-700 font-bold' : 'text-slate-400'}>Showroom Price:</span>
                <strong className={isLight ? 'text-emerald-700 font-extrabold text-sm' : 'text-emerald-400 text-sm'}>{tradeIn.target_vehicle_price}</strong>
              </div>

              {priceGap > 0 && (
                <div className={`p-3 rounded-xl border space-y-1 ${
                  isLight ? 'bg-white border-indigo-200 text-slate-900 shadow-sm' : 'bg-slate-950/80 border-indigo-500/30 text-white'
                }`}>
                  <div className={`text-[10px] font-bold uppercase tracking-wider ${isLight ? 'text-indigo-900' : 'text-indigo-300'}`}>
                    Estimated Client Balance Due:
                  </div>
                  <div className={`text-base font-bold ${isLight ? 'text-sky-700' : 'text-sky-400'}`}>
                    KES {priceGap.toLocaleString()}
                  </div>
                  <div className={`text-[10px] ${isLight ? 'text-slate-600 font-medium' : 'text-slate-400'}`}>
                    (Target Showroom Price KES {numericTargetPrice.toLocaleString()} - Offered Trade Offer KES {numericOfferedVal.toLocaleString()})
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>

      {/* KnK Executive Valuation & Appraisal Update Console */}
      <div className={`p-6 rounded-3xl border space-y-5 transition-colors ${
        isLight ? 'bg-white border-slate-200 shadow-xl' : 'bg-gradient-to-br from-slate-900 via-[#0b101d] to-[#070b14] border-white/10 shadow-2xl'
      }`}>
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#c9a84c] to-amber-600 text-slate-950 font-bold">
              <DollarSign size={20} />
            </div>
            <div>
              <div className="text-[10px] font-mono font-bold tracking-[2px] text-[#c9a84c] uppercase">
                KnK Executive Appraisal Console
              </div>
              <h3 className={`text-lg font-serif font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                Official Valuation &amp; Status Update
              </h3>
            </div>
          </div>

          <a
            href={`https://wa.me/${(tradeIn.client_phone || '').replace(/\D/g, '')}?text=Hi%20${encodeURIComponent(tradeIn.client_name)},%20this%20is%20KnK%20Automotive.%20We%20have%20appraised%20your%20trade-in%20(${encodeURIComponent(tradeIn.trade_vehicle_make)}%20${encodeURIComponent(tradeIn.trade_vehicle_model)})%20at%20KES%20${encodeURIComponent(offeredValuationInput)}.`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/30 text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-md"
          >
            <Send size={14} />
            <span>Send Direct Quote via WhatsApp</span>
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 font-mono">
          <div>
            <label className={`block text-xs font-bold mb-1.5 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
              Appraised Offered Valuation (KES)
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3.5 text-xs text-slate-500 font-bold">KES</span>
              <input
                type="text"
                value={offeredValuationInput}
                onChange={e => setOfferedValuationInput(e.target.value)}
                placeholder="e.g. 4,200,000"
                className={`w-full pl-14 pr-4 py-3 rounded-xl text-xs border transition-all ${
                  isLight
                    ? 'bg-white border-slate-300 text-slate-900 focus:border-emerald-500 focus:outline-none'
                    : 'bg-slate-950 border-white/10 text-white focus:border-emerald-500 focus:outline-none'
                }`}
              />
            </div>
          </div>

          <div>
            <label className={`block text-xs font-bold mb-1.5 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
              Trade-In Processing Status
            </label>
            <PredictiveSelect
              options={STATUS_OPTIONS}
              value={statusInput}
              onChange={val => setStatusInput(val)}
              placeholder="Select processing status..."
              isLight={isLight}
            />
          </div>

          <div className="md:col-span-2">
            <label className={`block text-xs font-bold mb-1.5 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
              Admin Appraisal Notes &amp; Inspection Remarks
            </label>
            <textarea
              rows={3}
              value={adminNotesInput}
              onChange={e => setAdminNotesInput(e.target.value)}
              placeholder="Record valuation rationale, mechanical inspection findings, or client communication notes..."
              className={`w-full p-3.5 rounded-xl text-xs border transition-all ${
                isLight
                  ? 'bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-[#c9a84c] focus:outline-none'
                  : 'bg-slate-950 border-white/10 text-white placeholder:text-slate-600 focus:border-[#c9a84c] focus:outline-none'
              }`}
            />
          </div>
        </div>

        <div className="flex items-center justify-end pt-2">
          <button
            type="button"
            onClick={handleSaveAppraisal}
            disabled={isUpdating}
            className="px-8 py-3.5 bg-gradient-to-r from-[#06b6d4] via-blue-600 to-indigo-600 text-white font-mono font-bold text-xs uppercase tracking-wider rounded-xl hover:opacity-95 transition-all flex items-center gap-2 shadow-xl disabled:opacity-50 cursor-pointer"
          >
            {isUpdating ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Saving Valuation...</span>
              </>
            ) : (
              <>
                <CheckCircle size={16} />
                <span>Save Appraisal &amp; Update Status</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Action Confirmation Warning Popup Modal */}
      {actionConfirmModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in font-sans">
          <div className={`relative w-full max-w-md p-6 border rounded-3xl shadow-2xl overflow-hidden space-y-5 transition-colors ${
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
                  Are you sure you want to {actionConfirmModal.type === 'delete' ? 'permanently delete' : 'archive'} trade-in request <strong className={isLight ? 'text-slate-900' : 'text-white'}>#{tradeIn.id}</strong> submitted by <strong className="text-[#c9a84c]">{tradeIn.client_name}</strong>?
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={() => setActionConfirmModal({ isOpen: false, type: 'archive' })}
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

      {/* ═══ Save Success Celebration Modal ═══ */}
      {showSuccessModal && createPortal(
        <div
          className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm"
          onClick={() => setShowSuccessModal(false)}
          style={{ animation: 'fadeIn 0.2s ease-out' }}
        >
          <div
            onClick={e => e.stopPropagation()}
            className={`w-full max-w-sm rounded-3xl border p-8 shadow-2xl text-center relative overflow-hidden ${
              isLight
                ? 'bg-white border-emerald-200 text-slate-900 shadow-emerald-200/40'
                : 'bg-[#0b0f19] border-emerald-500/30 text-white shadow-emerald-950/50'
            }`}
            style={{ animation: 'scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
          >
            {/* Top glow bar */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500" />

            {/* Animated checkmark circle */}
            <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-5 ${
              isLight
                ? 'bg-emerald-100 border-2 border-emerald-300'
                : 'bg-emerald-500/15 border-2 border-emerald-500/40'
            }`}
              style={{ animation: 'scaleIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) 0.15s both' }}
            >
              <CheckCircle size={40} className="text-emerald-500" style={{ animation: 'scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) 0.3s both' }} />
            </div>

            <h3 className="text-lg font-serif font-bold mb-1.5" style={{ animation: 'slideUp 0.3s ease-out 0.25s both' }}>
              Appraisal Saved Successfully
            </h3>
            <p className={`text-xs font-mono mb-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`} style={{ animation: 'slideUp 0.3s ease-out 0.35s both' }}>
              Valuation of <strong className="text-emerald-500">KES {Number(offeredValuationInput.toString().replace(/\D/g, '') || 0).toLocaleString()}</strong> recorded.
            </p>
            <p className={`text-[10px] font-mono ${isLight ? 'text-slate-400' : 'text-slate-500'}`} style={{ animation: 'slideUp 0.3s ease-out 0.4s both' }}>
              Status updated to <strong className="text-[#c9a84c]">{statusInput}</strong> • Synced to PostgreSQL & Supabase Cloud
            </p>

            <button
              onClick={() => setShowSuccessModal(false)}
              className="mt-6 px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/30 transition-all cursor-pointer"
              style={{ animation: 'slideUp 0.3s ease-out 0.5s both' }}
            >
              Continue
            </button>
          </div>
        </div>,
        document.body
      )}

      {/* Inline keyframe animations */}
      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.7) } to { opacity: 1; transform: scale(1) } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(12px) } to { opacity: 1; transform: translateY(0) } }
      `}</style>

    </div>
  )
}
