import React, { useState, useEffect, useMemo } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { supabase } from '../lib/superbaseClient'
import { useCRMStore } from '../context/CRMStore'
import { useAnalyticsStore } from '../context/AnalyticsStore'

import PredictiveSelect from '../components/common/PredictiveSelect'
import UniversalPagination from '../components/common/UniversalPagination'
import ModernDatePicker from '../components/common/ModernDatePicker'
import StyledTimePicker from '../components/common/StyledTimePicker'
import ExecutiveExportModal from '../components/common/ExecutiveExportModal'
import AdminLiveChatToast from '../components/Chat/AdminLiveChatToast'
import ActionTooltip from '../components/common/ActionTooltip'
import ActionConfirmModal from '../components/common/ActionConfirmModal'
import ConfirmSignOutModal from '../components/common/ConfirmSignOutModal'
import SystemSyncModal from '../components/common/SystemSyncModal'
import NotificationSettingsModal from '../components/common/NotificationSettingsModal'

import {
  Pencil, Trash2, Eye, AlertTriangle, RefreshCw, Plus, Calendar, Check, X, Clock,
  TrendingUp, Users, Car, PlusCircle, GitPullRequest, Megaphone, MessageSquare, CheckSquare,
  LifeBuoy, ShieldCheck, Globe, Activity, Sparkles, DollarSign, Layers, Zap, Award,
  ArrowUpRight, Sliders, Shield, PieChart as PieIcon, Search, ArrowRight, ExternalLink,
  PhoneCall, Share2, ShoppingCart, Video, QrCode, Package, Server, HardDrive, Filter, ChevronRight, LogOut,
  LayoutDashboard, Sun, Moon, FileText, Bell, BellOff, Trophy, AlertCircle, CheckCircle2
} from 'lucide-react'

import {
  ResponsiveContainer, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line
} from 'recharts'

import BlogManager        from '../components/Blog/BlogManager'
import AccessoriesManager from '../components/accessories/AccessoriesManager'
import AdminSidebar       from '../components/Layout/AdminSidebar'
import BrandLogo          from '../components/common/BrandLogo'
import { VEHICLES }       from '../data/mock-dataset'

const TABLE  = 'car_listings'
const BUCKET = 'car-images'

function formatDateLabel(dateStr) {
  if (!dateStr) return '—'
  const [y, m, d] = dateStr.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('en-KE', {
    weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
  })
}

// ─── STATUS CONFIG FOR APPOINTMENTS ──────────────────────────────────────────
const STATUS_CONFIG = {
  pending:   { label: 'Pending',   color: '#c9a84c', bg: 'rgba(201,168,76,0.08)',  border: 'rgba(201,168,76,0.3)'  },
  confirmed: { label: 'Confirmed', color: '#4ade80', bg: 'rgba(74,222,128,0.08)',  border: 'rgba(74,222,128,0.3)'  },
  rejected:  { label: 'Rejected',  color: '#ef4444', bg: 'rgba(239,68,68,0.08)',   border: 'rgba(239,68,68,0.3)'   },
  cancelled: { label: 'Cancelled', color: '#6b7280', bg: 'rgba(107,114,128,0.08)', border: 'rgba(107,114,128,0.3)' },
}

const thStyle = {
  fontFamily: "'Inter', sans-serif", fontSize: 11, letterSpacing: 1.5,
  textTransform: 'uppercase', color: 'inherit', fontWeight: 700,
  padding: '14px 16px', textAlign: 'left', borderBottom: '1px solid rgba(255,255,255,0.1)',
}
const tdStyle = { padding: '14px 16px', verticalAlign: 'middle', fontSize: 13 }

// ─── APPOINTMENTS MANAGER SUB-COMPONENT ──────────────────────────────────────
function AppointmentsManager({ showToast, onStatusChange, isLight }) {
  const storeAppointments = useCRMStore(state => state.appointments || [])
  const storeUpdateStatus = useCRMStore(state => state.updateAppointmentStatus)
  const storeDeleteAppointment = useCRMStore(state => state.deleteAppointment)

  const [appointments,  setAppointments]  = useState(storeAppointments)
  const [loading,       setLoading]       = useState(false)
  const [updatingId,    setUpdatingId]    = useState(null)
  const [deletingId,    setDeletingId]    = useState(null)
  const [filterStatus,  setFilterStatus]  = useState('all')
  const [pendingAction, setPendingAction] = useState(null)
  const [apptPage, setApptPage] = useState(1)
  const [apptPerPage, setApptPerPage] = useState(5)

  const fetchAppointments = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('crm_appointments')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (!error && data && data.length > 0) {
        setAppointments(data)
        if (onStatusChange) onStatusChange(data)
      } else {
        setAppointments(storeAppointments)
        if (onStatusChange) onStatusChange(storeAppointments)
      }
    } catch {
      setAppointments(storeAppointments)
      if (onStatusChange) onStatusChange(storeAppointments)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAppointments()
  }, [storeAppointments])

  const updateStatus = async (id, newStatus) => {
    setUpdatingId(id)
    try {
      if (storeUpdateStatus) storeUpdateStatus(id, newStatus)
      const updated = appointments.map(a => a.id === id ? { ...a, status: newStatus } : a)
      setAppointments(updated)
      if (onStatusChange) onStatusChange(updated)
      showToast('success', `Appointment marked as ${newStatus}.`)
    } catch {
      showToast('error', 'Failed to update appointment.')
    } finally {
      setUpdatingId(null)
    }
  }

  const executeDelete = async (id) => {
    setDeletingId(id)
    try {
      if (storeDeleteAppointment) storeDeleteAppointment(id)
      const updated = appointments.filter(a => a.id !== id)
      setAppointments(updated)
      if (onStatusChange) onStatusChange(updated)
      showToast('success', 'Appointment deleted successfully.')
    } catch {
      showToast('error', 'Failed to delete appointment.')
    } finally {
      setDeletingId(null)
    }
  }

  const filtered = filterStatus === 'all'
    ? appointments
    : filterStatus === 'pending'
      ? appointments.filter(a => a.status === 'pending' || a.status === 'scheduled')
      : appointments.filter(a => a.status === filterStatus)

  const apptTotalPages = Math.ceil(filtered.length / apptPerPage) || 1
  const paginatedFiltered = filtered.slice((apptPage - 1) * apptPerPage, apptPage * apptPerPage)

  const counts = {
    all:       appointments.length,
    pending:   appointments.filter(a => a.status === 'pending' || a.status === 'scheduled').length,
    confirmed: appointments.filter(a => a.status === 'confirmed').length,
    rejected:  appointments.filter(a => a.status === 'rejected').length,
    cancelled: appointments.filter(a => a.status === 'cancelled').length,
  }

  return (
    <div className={`border rounded-2xl overflow-hidden shadow-2xl transition-colors ${
      isLight ? 'bg-white border-slate-200' : 'bg-[#0b101d] border-white/10'
    }`}>
      {/* Header */}
      <div className={`px-6 py-4 border-b flex items-center justify-between flex-wrap gap-3 ${
        isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#070b15] border-white/10'
      }`}>
        <div className="flex items-center gap-3">
          <Calendar size={18} className="text-[#c9a84c]" />
          <div>
            <h3 className={`text-xs tracking-[3px] uppercase font-bold ${isLight ? 'text-slate-900' : 'text-[#c9a84c]'}`}>Booked Appointments & Test Drives</h3>
            <p className="text-[10px] text-slate-400 font-medium">{counts.all} Total Scheduled Requests</p>
          </div>
        </div>
        <button onClick={fetchAppointments} className={`p-2 rounded-lg border transition-colors ${
          isLight ? 'border-slate-300 text-slate-600 hover:text-[#c9a84c]' : 'border-white/10 text-slate-400 hover:text-[#c9a84c]'
        }`} title="Refresh">
          <RefreshCw size={14} />
        </button>
      </div>

      {/* Filter tabs */}
      <div className={`px-6 py-3 border-b flex gap-2 flex-wrap ${
        isLight ? 'bg-slate-100/50 border-slate-200' : 'bg-[#080d1a] border-white/5'
      }`}>
        {[
          ['all','All'], 
          ['pending','Pending'], 
          ['confirmed','Confirmed'], 
          ['rejected','Rejected'], 
          ['cancelled','Cancelled']
        ].map(([val, label]) => (
          <button
            key={val}
            onClick={() => setFilterStatus(val)}
            className={`px-3.5 py-1.5 text-[10px] tracking-[1.5px] uppercase border transition-all rounded-lg font-semibold ${
              filterStatus === val
                ? 'border-[#c9a84c] bg-[#c9a84c]/20 text-[#c9a84c] shadow-sm'
                : isLight
                  ? 'border-slate-300 text-slate-600 hover:border-slate-400'
                  : 'border-white/10 text-slate-400 hover:border-slate-600'
            }`}
          >
            {label} {counts[val] > 0 ? `(${counts[val]})` : ''}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="px-6 py-16 flex flex-col items-center gap-3">
          <div className="w-5 h-5 border-2 border-slate-600 border-t-[#c9a84c] rounded-full animate-spin" />
          <p className="text-[10px] tracking-[3px] uppercase text-slate-400 font-semibold">Loading Appointments…</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="px-6 py-12 text-center text-slate-400 text-xs font-medium">
          No {filterStatus === 'all' ? '' : filterStatus} appointments found.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className={isLight ? 'bg-slate-50' : 'bg-[#070b15]'}>
                <th style={thStyle}>Client</th>
                <th style={thStyle}>Phone</th>
                <th style={thStyle}>Date</th>
                <th style={thStyle}>Time</th>
                <th style={thStyle}>Vehicle</th>
                <th style={thStyle}>Location / Type</th>
                <th style={thStyle}>Status</th>
                <th style={{ ...thStyle, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedFiltered.map(appt => {
                const name = appt.lead_name || appt.client_name || 'VIP Client'
                const phone = appt.phone || appt.client_phone || '—'
                const dateStr = appt.appointment_date || appt.date || ''
                const timeStr = appt.appointment_time || appt.time || '—'
                const vehicle = appt.vehicle_name || appt.vehicle_type || '—'
                const location = appt.location_type || appt.budget || 'Nairobi Showroom'
                const statusKey = (appt.status === 'scheduled' || !appt.status) ? 'pending' : appt.status
                const cfg = STATUS_CONFIG[statusKey] || STATUS_CONFIG.pending
                const isToday = dateStr === new Date().toISOString().split('T')[0]
                const updating = updatingId === appt.id
                const deleting = deletingId === appt.id

                return (
                  <tr key={appt.id} className={`border-b transition-colors ${
                    isLight ? 'border-slate-200 hover:bg-slate-50' : 'border-white/5 hover:bg-white/[0.02]'
                  }`}>
                    <td style={tdStyle}>
                      <div className="flex items-center gap-2">
                        {isToday && <span className="w-2 h-2 rounded-full bg-[#c9a84c] shadow-[0_0_8px_#c9a84c]" />}
                        <span className={`font-serif text-sm font-medium ${isLight ? 'text-slate-900' : 'text-slate-200'}`}>
                          {name}
                        </span>
                      </div>
                    </td>
                    <td style={tdStyle}>
                      <a href={`tel:${phone}`} className="text-[#c9a84c] text-xs font-semibold hover:underline">
                        {phone}
                      </a>
                    </td>
                    <td style={tdStyle}>
                      <p className={`text-xs ${isToday ? 'text-[#c9a84c] font-bold' : isLight ? 'text-slate-700' : 'text-slate-400'}`}>
                        {formatDateLabel(dateStr)}
                        {isToday && <span className="text-[9px] text-[#c9a84c] ml-1.5 font-bold uppercase tracking-wider">TODAY</span>}
                      </p>
                    </td>
                    <td style={tdStyle}>
                      <div className="flex items-center gap-1.5 text-xs text-slate-400">
                        <Clock size={11} className="text-slate-400" />
                        <span>{timeStr}</span>
                      </div>
                    </td>
                    <td style={tdStyle}><p className={`text-xs ${isLight ? 'text-slate-800' : 'text-slate-300'}`}>{vehicle}</p></td>
                    <td style={tdStyle}><p className="text-xs text-slate-400">{location}</p></td>
                    <td style={tdStyle}>
                      <span className="inline-block text-[9px] tracking-wider uppercase px-2.5 py-1 border rounded-md font-bold"
                        style={{ borderColor: cfg.border, background: cfg.bg, color: cfg.color }}>
                        {cfg.label}
                      </span>
                    </td>
                    <td style={{ ...tdStyle, textAlign: 'right', whiteSpace: 'nowrap' }}>
                      {deleting || updating ? (
                        <div className="w-4 h-4 border-2 border-slate-600 border-t-[#c9a84c] rounded-full animate-spin inline-block" />
                      ) : (
                        <div className="flex items-center justify-end gap-1">
                          {appt.status !== 'confirmed' && (
                            <ActionTooltip text="Confirm Appointment" isLight={isLight}>
                              <button onClick={() => setPendingAction({
                                type: 'confirm',
                                title: `Confirm Appointment — ${name}`,
                                description: `You are about to confirm the scheduled appointment for ${name} on ${formatDateLabel(dateStr)} at ${timeStr}. The client will be marked as confirmed and the sales team will be notified to prepare for the visit.`,
                                onConfirm: () => updateStatus(appt.id, 'confirmed')
                              })}
                                className="p-1.5 text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-all cursor-pointer">
                                <Check size={14} />
                              </button>
                            </ActionTooltip>
                          )}
                          {appt.status !== 'rejected' && (
                            <ActionTooltip text="Reject Appointment" isLight={isLight}>
                              <button onClick={() => setPendingAction({
                                type: 'reject',
                                title: `Reject Appointment — ${name}`,
                                description: `You are about to reject the scheduled appointment for ${name} on ${formatDateLabel(dateStr)} at ${timeStr}. The appointment will be marked as rejected and the client may need to reschedule.`,
                                onConfirm: () => updateStatus(appt.id, 'rejected')
                              })}
                                className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all cursor-pointer">
                                <X size={14} />
                              </button>
                            </ActionTooltip>
                          )}
                          <ActionTooltip text="Delete Appointment" isLight={isLight}>
                            <button onClick={() => setPendingAction({
                              type: 'delete',
                              title: `Delete Appointment — ${name}`,
                              description: `You are about to permanently delete the appointment for ${name} (${vehicle}) on ${formatDateLabel(dateStr)} at ${timeStr}. This action cannot be undone and all associated records will be removed.`,
                              onConfirm: () => executeDelete(appt.id)
                            })}
                              className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all cursor-pointer">
                              <Trash2 size={14} />
                            </button>
                          </ActionTooltip>
                        </div>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Footer */}
      {!loading && filtered.length > 0 && (
        <div className={`px-6 py-3 border-t ${isLight ? 'border-slate-200' : 'border-white/10'}`}>
          <UniversalPagination
            currentPage={apptPage}
            totalPages={apptTotalPages}
            totalItems={filtered.length}
            itemsPerPage={apptPerPage}
            onPageChange={page => setApptPage(page)}
            onItemsPerPageChange={size => { setApptPerPage(size); setApptPage(1) }}
            pageSizeOptions={[5, 10, 25, 50]}
          />
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

const STOREFRONT_MASTER_VEHICLES = (VEHICLES || []).map(v => ({
  id: v.id,
  listing_title: `${v.year || 2024} ${v.make || ''} ${v.model || ''} ${v.trim ? v.trim : ''}`.trim(),
  make: v.make || 'Mercedes-Benz',
  model: v.model || 'Luxury Model',
  year: String(v.year || '2024'),
  price: String(v.pricing?.cashPrice || v.price || 24500000),
  condition: v.condition === 'NEW' ? 'Brand New' : v.condition === 'CERTIFIED_PRE_OWNED' ? 'Certified Pre-Owned' : 'Foreign Used',
  transmission: typeof v.transmission === 'object' ? (v.transmission.type || 'Automatic') : (v.transmission || 'Automatic'),
  engine: typeof v.engine === 'object' ? (v.engine.type || '3.0L Turbo') : (v.engine || 'V8 Biturbo'),
  fuel_type: typeof v.fuelEnergy === 'object' ? (v.fuelEnergy.fuelType || 'Petrol') : (v.fuel_type || 'Petrol'),
  mileage: v.history?.odometerKm ? `${v.history.odometerKm} KM` : (v.mileage || '45 KM'),
  color: v.colorExterior || 'Obsidian Black',
  interior_color: v.colorInterior || 'Nappa Leather',
  offer_type: (v.badges && v.badges.includes('FEATURED')) || v.isFeatured ? 'Featured' : 'For Sale',
  currentStatus: 'Available',
  images: Array.isArray(v.images) && v.images.length > 0
    ? v.images.map(img => typeof img === 'string' ? { url: img } : img)
    : [{ url: v.heroImage || 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&auto=format&fit=crop' }]
}))

// ─── MASTER EXECUTIVE COMMAND CENTER DASHBOARD ─────────────────────────────────
export default function AdminDashboard() {
  const navigate = useNavigate()
  const location = useLocation()
  const [adminEmail,      setAdminEmail]      = useState('')
  const [listings,        setListings]        = useState([])
  const [appointments,    setAppointments]    = useState([])
  const [loadingListings, setLoadingListings] = useState(true)
  const [deletingId,      setDeletingId]      = useState(null)
  const [confirmDelete,   setConfirmDelete]   = useState(null)
  const [toast,           setToast]           = useState(null)
  const [activeTab,       setActiveTab]       = useState('overview') // 'overview' | 'listings' | 'appointments' | 'accessories' | 'blog'
  const [isExportModalOpen, setIsExportModalOpen] = useState(false)
  const [showSignOutModal,  setShowSignOutModal]  = useState(false)
  const [showSyncModal,     setShowSyncModal]     = useState(false)
  const [showAlertsModal,   setShowAlertsModal]   = useState(false)

  // Filter state for Vehicle Listings tab using PredictiveSelect
  const [selectedOfferType, setSelectedOfferType] = useState('All')
  const [selectedMake, setSelectedMake]           = useState('All')
  const [vehiclePage, setVehiclePage]             = useState(1)
  const [vehiclePerPage, setVehiclePerPage]       = useState(5)

  // Connect to Zustand stores for CRM and Analytics Telemetry & Theme Toggle
  const leads                         = useCRMStore(state => state.leads) || []
  const opportunities                 = useCRMStore(state => state.opportunities) || []
  const tasks                         = useCRMStore(state => state.tasks) || []
  const crmAppointments               = useCRMStore(state => state.appointments) || []
  const campaigns                     = useCRMStore(state => state.campaigns) || []
  const nexusThreads                  = useCRMStore(state => state.nexusThreads) || []
  const adminTheme                    = useCRMStore(state => state.adminTheme) || 'dark'
  const isLight                       = adminTheme === 'light'
  const liveChatNotificationsEnabled  = useCRMStore(state => state.liveChatNotificationsEnabled)
  const toggleAdminTheme               = useCRMStore(state => state.toggleAdminTheme)

  const sessions                      = useAnalyticsStore(state => state.sessions) || []
  const pageViews                     = useAnalyticsStore(state => state.pageViews) || []

  const showToast = (type, message) => {
    setToast({ type, message })
    setTimeout(() => setToast(null), 4000)
  }

  const fetchListings = async () => {
    setLoadingListings(true)
    let fetchedListings = []

    // 1. Try Strapi REST API
    try {
      const res = await fetch('http://localhost:1338/api/car-listings')
      if (res.ok) {
        const json = await res.json()
        const items = Array.isArray(json.data) ? json.data : (json ? [json] : [])
        fetchedListings = items.map(item => {
          const d = item.attributes || item
          return {
            id: item.id || d.id,
            documentId: item.documentId || item.id,
            listing_title: d.listing_title || d.title || `${d.year || ''} ${d.make || ''} ${d.model || ''}`.trim() || 'Luxury Vehicle',
            tagline: d.tagline || '',
            price: d.price || '0',
            make: d.make || 'Mercedes-Benz',
            model: d.model || 'S-Class',
            condition: d.condition || 'Foreign Used',
            year: d.year || '2024',
            transmission: d.transmission || 'Automatic',
            engine: d.engine || 'V8 Biturbo',
            fuel_type: d.fuel_type || d.fuel || 'Petrol',
            mileage: d.mileage || '0',
            color: d.color || 'Obsidian Black',
            interior_color: d.interior_color || 'Black',
            offer_type: d.offer_type || 'Featured',
            listing_description: d.listing_description || '',
            youtube_video_url: d.youtube_video_url || '',
            currentStatus: d.currentStatus || 'Available',
            images: Array.isArray(d.images) && d.images.length > 0
              ? d.images
              : [{ url: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&auto=format&fit=crop' }]
          }
        })
      }
    } catch (err) {
      console.log('Fetch Strapi notice:', err)
    }

    // 2. Try Supabase Cloud Database
    try {
      const { data: supaData } = await supabase.from(TABLE).select('*').order('id', { ascending: false })
      if (supaData && supaData.length > 0) {
        const existingIds = new Set(fetchedListings.map(l => String(l.id)))
        supaData.forEach(item => {
          if (!existingIds.has(String(item.id))) {
            fetchedListings.push(item)
          }
        })
      }
    } catch (err) {
      console.log('Fetch Supabase notice:', err)
    }

    // 3. Combine with Master Storefront Vehicle Dataset so storefront vehicles are ALWAYS present
    const combined = [...fetchedListings]
    const existingTitlesOrIds = new Set(combined.map(l => (l.listing_title || '').toLowerCase()))

    STOREFRONT_MASTER_VEHICLES.forEach(veh => {
      if (!existingTitlesOrIds.has(veh.listing_title.toLowerCase())) {
        combined.push(veh)
      }
    })

    setListings(combined)
    setLoadingListings(false)
  }

  useEffect(() => { fetchListings() }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/admin', { replace: true })
  }

  const handleDelete = async () => {
    if (!confirmDelete) return
    const target = confirmDelete
    setDeletingId(target.id)
    setConfirmDelete(null)
    try {
      const docId = target.documentId || target.id
      await fetch(`http://localhost:1338/api/car-listings/${docId}`, { method: 'DELETE' }).catch(() => null)
      await supabase.from(TABLE).delete().eq('id', target.id).catch(() => null)
      setListings(prev => prev.filter(l => l.id !== target.id))
      showToast('success', 'Listing deleted successfully.')
    } catch (_err) {
      showToast('error', 'Failed to delete listing.')
    } finally {
      setDeletingId(null)
    }
  }

  const formatPrice = p => p ? `KES ${Number(p).toLocaleString()}` : '—'
  const coverImage  = l => Array.isArray(l.images) && l.images.length ? l.images[0].url : null

  // ─── CALCULATED EXECUTIVE NORTH STAR METRICS ─────────────────────────────────
  const metrics = useMemo(() => {
    const safeListings = Array.isArray(listings) ? listings : []
    const safeOpps     = Array.isArray(opportunities) ? opportunities : []
    const safeLeads    = Array.isArray(leads) ? leads : []
    const safeTasks    = Array.isArray(tasks) ? tasks : []
    const safeAppts    = Array.isArray(crmAppointments) ? crmAppointments : []
    const safeSessions = Array.isArray(sessions) ? sessions : []
    const safePageViews= Array.isArray(pageViews) ? pageViews : []

    // Inventory Capital
    const totalInventoryValue = safeListings.reduce((sum, l) => sum + (Number(l.price) || 0), 0)
    const totalVehiclesCount  = safeListings.length
    const forSaleCount        = safeListings.filter(l => l.offer_type === 'For Sale' || l.offer_type === 'Featured').length
    const forHireCount        = safeListings.filter(l => l.offer_type === 'For Hire' || l.offer_type === 'Lease').length

    // CRM Metrics
    const pipelineValue = safeOpps
      .filter(o => o.stage !== 'lost')
      .reduce((sum, o) => sum + (Number(o.expected_value) || 0), 0)

    const wonRevenue = safeOpps
      .filter(o => o.stage === 'won')
      .reduce((sum, o) => sum + (Number(o.expected_value) || 0), 0)

    const activeLeadsCount = safeLeads.filter(l => ['new', 'contacted', 'qualified'].includes(l.status)).length
    const urgentTasksCount = safeTasks.filter(t => t.priority === 'urgent' && t.status !== 'completed').length
    const pendingAppointmentsCount = safeAppts.filter(a => a.status === 'pending' || a.status === 'scheduled' || !a.status).length

    // Analytics Metrics
    const totalSessions = safeSessions.length || 1420
    const totalPageViews = safePageViews.length || 4180
    const topViewedVehicles = safeListings.slice(0, 5)

    // Aged Stock (>45 days on lot)
    const agedStockCount = safeListings.filter(l => {
      if (!l.created_at) return false
      const days = (new Date() - new Date(l.created_at)) / (1000 * 60 * 60 * 24)
      return days > 45
    }).length

    // Audit quality (listings missing photos)
    const incompleteListings = safeListings.filter(l => !Array.isArray(l.images) || l.images.length === 0).length

    return {
      totalInventoryValue,
      totalVehiclesCount,
      forSaleCount,
      forHireCount,
      pipelineValue,
      wonRevenue,
      activeLeadsCount,
      urgentTasksCount,
      pendingAppointmentsCount,
      totalAppointmentsCount: safeAppts.length,
      totalSessions,
      totalPageViews,
      topViewedVehicles,
      agedStockCount,
      incompleteListings,
    }
  }, [listings, opportunities, leads, tasks, crmAppointments, sessions, pageViews])

  // Unique makes for PredictiveSelect filter
  const makeOptions = useMemo(() => {
    const safeListings = Array.isArray(listings) ? listings : []
    const set = new Set(safeListings.map(l => l.make).filter(Boolean))
    return ['All', ...Array.from(set)]
  }, [listings])

  const filteredListings = useMemo(() => {
    const safeListings = Array.isArray(listings) ? listings : []
    return safeListings.filter(l => {
      const offerTypeLower = (l.offer_type || '').toLowerCase()
      const selOfferLower = (selectedOfferType || 'All').toLowerCase()

      const matchOffer =
        selOfferLower === 'all' ||
        offerTypeLower === selOfferLower ||
        (selOfferLower === 'featured' && (offerTypeLower === 'featured' || offerTypeLower === 'for sale' || !offerTypeLower)) ||
        (selOfferLower === 'for sale' && (offerTypeLower === 'for sale' || offerTypeLower === 'featured' || !offerTypeLower))

      const matchMake = !selectedMake || selectedMake === 'All' || (l.make || '').toLowerCase() === selectedMake.toLowerCase()
      return matchOffer && matchMake
    })
  }, [listings, selectedOfferType, selectedMake])

  // Chart data for 14-Day System Trend
  const trendChartData = useMemo(() => [
    { day: 'Jul 28', leads: 4, views: 12, deals: 2 },
    { day: 'Jul 30', leads: 7, views: 24, deals: 4 },
    { day: 'Aug 01', leads: 12, views: 42, deals: 5 },
    { day: 'Aug 03', leads: 18, views: 58, deals: 8 },
    { day: 'Aug 05', leads: 14, views: 48, deals: 6 },
    { day: 'Aug 07', leads: 22, views: 64, deals: 11 },
    { day: 'Aug 09', leads: 19, views: 52, deals: 9 },
    { day: 'Aug 11', leads: 26, views: 78, deals: 14 },
  ], [])

  // Dynamic Omnichannel Audit Stream combining live events from CRM, inventory, and campaigns
  const auditStream = useMemo(() => {
    const apptItems = (crmAppointments || []).map((appt, idx) => {
      const client = appt.client_name || appt.lead_name || appt.name || 'VIP Client'
      const vehicle = appt.car_name || appt.listing_title || appt.vehicle_name || appt.vehicle || appt.car_title || appt.car || 'Showroom Vehicle'
      const dateStr = appt.appointment_date || appt.date || 'Upcoming'
      const timeStr = appt.appointment_time || appt.time || '10:00 AM'
      const status = appt.status || 'scheduled'

      let title = 'Test Drive Scheduled'
      let color = '#c9a84c'
      if (status === 'confirmed') {
        title = 'Appointment Confirmed'
        color = '#22c55e'
      } else if (status === 'rejected' || status === 'cancelled') {
        title = 'Appointment Cancelled'
        color = '#f43f5e'
      }

      return {
        id: `appt-${appt.id || idx}`,
        type: 'appointment',
        time: `${dateStr} · ${timeStr}`,
        icon: Calendar,
        color,
        title,
        desc: `${client} booked test drive for ${vehicle} (${status.toUpperCase()})`
      }
    })

    const leadItems = (leads || []).map((lead, idx) => {
      const name = lead.name || 'New Lead'
      const company = lead.company ? ` (${lead.company})` : ''
      const score = lead.intent_score || lead.conversion_probability || 80
      const source = lead.source || 'Website'
      const time = lead.created_at || 'Recent'

      return {
        id: `lead-${lead.id || idx}`,
        type: 'lead',
        time: typeof time === 'string' ? time.substring(0, 10) : 'Today',
        icon: Users,
        color: score >= 80 ? '#4ade80' : '#60a5fa',
        title: `Inbound Lead — ${lead.intent_tier || 'High Intent'}`,
        desc: `${name}${company} via ${source} (Intent Score: ${score})`
      }
    })

    const oppItems = (opportunities || []).map((opp, idx) => {
      const title = opp.title || opp.name || 'Sales Opportunity'
      const val = Number(opp.expected_value || opp.value) || 0
      const valFormatted = val > 0 ? `KES ${val.toLocaleString()}` : 'Qualified Deal'
      const stage = (opp.stage || 'qualification').toUpperCase()

      return {
        id: `opp-${opp.id || idx}`,
        type: 'deal',
        time: opp.created_at ? String(opp.created_at).substring(0, 10) : 'Live',
        icon: TrendingUp,
        color: stage === 'WON' ? '#22c55e' : '#a78bfa',
        title: `Pipeline Opportunity (${stage})`,
        desc: `"${title}" valued at ${valFormatted}`
      }
    })

    const listingItems = (listings || []).map((item, idx) => {
      const title = item.listing_title || `${item.make || ''} ${item.model || ''}`.trim() || 'Inventory Vehicle'
      const price = item.price ? `KES ${Number(item.price).toLocaleString()}` : 'Contact for Price'
      const offer = item.offer_type || 'For Sale'

      return {
        id: `listing-${item.id || idx}`,
        type: 'inventory',
        time: 'Active Stock',
        icon: Car,
        color: '#38bdf8',
        title: `Showroom Inventory (${offer})`,
        desc: `"${title}" active on storefront at ${price}`
      }
    })

    const campItems = (campaigns || []).map((camp, idx) => {
      const name = camp.name || camp.title || 'Omnichannel Campaign'
      const leadsCnt = camp.leads_count || camp.conversions || 5

      return {
        id: `camp-${camp.id || idx}`,
        type: 'campaign',
        time: camp.status ? camp.status.toUpperCase() : 'ACTIVE',
        icon: Megaphone,
        color: '#f472b6',
        title: `Campaign Conversion Pulse`,
        desc: `Campaign "${name}" generated ${leadsCnt} inbound qualified conversions`
      }
    })

    const combined = []
    const maxLength = Math.max(apptItems.length, leadItems.length, oppItems.length, listingItems.length, campItems.length)
    for (let i = 0; i < maxLength; i++) {
      if (apptItems[i]) combined.push(apptItems[i])
      if (leadItems[i]) combined.push(leadItems[i])
      if (oppItems[i]) combined.push(oppItems[i])
      if (listingItems[i]) combined.push(listingItems[i])
      if (campItems[i]) combined.push(campItems[i])
    }

    if (combined.length === 0) {
      return [
        { id: 'fb-1', type: 'lead', time: 'Just Now', icon: Users, color: '#4ade80', title: 'New High-Score Lead', desc: 'Joseph M. submitted financing inquiry for Prado (Score: 85)' },
        { id: 'fb-2', type: 'analytics', time: '10m ago', icon: Eye, color: '#60a5fa', title: 'High Storefront Interest', desc: 'Visitor from Nairobi spent 6 mins on 2023 Land Cruiser V8' },
        { id: 'fb-3', type: 'appointment', time: '1h ago', icon: Calendar, color: '#c9a84c', title: 'Test Drive Scheduled', desc: 'Sarah W. booked test drive for Mercedes GLE 450' }
      ]
    }

    return combined.slice(0, 7)
  }, [crmAppointments, leads, opportunities, listings, campaigns])

  return (
    <AdminSidebar>
      <div
        data-theme={adminTheme}
        className={`min-h-screen relative font-sans overflow-x-hidden transition-colors duration-300 ${
          isLight ? 'light-theme bg-slate-100 text-slate-900' : 'bg-[#020617] text-slate-100'
        }`}
      >

        {/* Quantum Mesh Blobs (Clipping Container - Fuse ERP Standard) */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div className="qb-blob qb1" />
          <div className="qb-blob qb2" />
          <div className="qb-blob qb3" />
          <div className="qb-blob qb4" />
        </div>

        {/* Global Toast */}
        {toast && (
          <div className={`fixed top-6 right-6 z-[9999] px-6 py-3.5 rounded-xl border font-sans text-xs tracking-wide shadow-2xl flex items-center gap-3 animate-bounce ${
            isLight
              ? (toast.type === 'success' ? 'bg-white border-[#c9a84c] text-amber-900 shadow-amber-500/10' : 'bg-white border-rose-500 text-rose-800 shadow-rose-500/10')
              : (toast.type === 'success' ? 'bg-[#0b101d] border-[#c9a84c] text-amber-200' : 'bg-[#0b101d] border-rose-500 text-rose-300')
          }`}>
            <Sparkles size={16} className={toast.type === 'success' ? (isLight ? 'text-[#a17e28]' : 'text-[#c9a84c]') : 'text-rose-500'} />
            <span className="font-medium">{toast.message}</span>
          </div>
        )}

        {/* Delete Modal */}
        {confirmDelete && (
          <div className="fixed inset-0 bg-black/80 z-[1000] flex items-center justify-center p-4" onClick={() => setConfirmDelete(null)}>
            <div className="bg-[#0b101d] border border-rose-500/40 p-8 max-w-md w-full rounded-2xl relative shadow-2xl" onClick={e => e.stopPropagation()}>
              <div className="flex items-center gap-3 mb-4 text-rose-500">
                <AlertTriangle size={20} />
                <h3 className="font-serif text-xl text-slate-100">Confirm Deletion</h3>
              </div>
              <p className="text-slate-300 text-xs leading-relaxed mb-6">
                Are you sure you want to permanently delete <strong className="text-slate-100">{confirmDelete.listing_title}</strong>? This action cannot be reversed.
              </p>
              <div className="flex items-center justify-end gap-3">
                <button className="px-5 py-2 rounded-lg border border-slate-700 text-slate-300 text-xs font-semibold hover:bg-slate-800 uppercase tracking-wider" onClick={() => setConfirmDelete(null)}>Cancel</button>
                <button className="px-5 py-2 rounded-lg bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 uppercase tracking-wider shadow-lg shadow-rose-600/30" onClick={handleDelete}>Delete Permanently</button>
              </div>
            </div>
          </div>
        )}

        {/* Global Live Chat Toast */}
        <AdminLiveChatToast />

        {/* Executive PDF & Excel Modal */}
        <ExecutiveExportModal
          isOpen={isExportModalOpen}
          onClose={() => setIsExportModalOpen(false)}
        />

        {/* STICKY TOP HEADER (Matching CRM, Analytics, Campaign Monitor Layout) */}
        <header className="sticky top-0 z-40 backdrop-blur-xl bg-[#020617]/95 border-b border-white/10 shadow-2xl">
          <div className="w-full px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3.5 flex items-center justify-between gap-2">

            {/* Brand & Module Status Badge */}
            <div className="flex items-center gap-3">
              <Link to="/admin/dashboard" className="flex items-center gap-2 group">
                <BrandLogo variant="admin" size="md" showSubtitle={false} />
                <span className="text-[10px] tracking-[1.5px] uppercase font-bold px-2 py-0.5 rounded border text-[#c9a84c] bg-[#c9a84c]/10 border-[#c9a84c]/30">
                  ADMIN COMMAND
                </span>
              </Link>

              <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full text-[10px] tracking-widest uppercase font-semibold border bg-amber-500/10 border-amber-500/30 text-amber-400">
                <span className="w-2 h-2 rounded-full animate-ping bg-amber-400" />
                ADMIN-ACTIVE
              </div>
            </div>

            {/* Header Right Controls */}
            <div className="flex items-center gap-1.5 sm:gap-3">
              {/* Live Chat Alert Toggle */}
              <button
                onClick={() => setShowAlertsModal(true)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-[11px] sm:text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                  liveChatNotificationsEnabled
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                    : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
                }`}
              >
                {liveChatNotificationsEnabled ? (
                  <>
                    <Bell size={14} className="text-emerald-400 animate-pulse" />
                    <span className="hidden sm:inline">Alerts:</span>
                    <span className="font-mono text-emerald-300">ON</span>
                  </>
                ) : (
                  <>
                    <BellOff size={14} className="text-slate-500" />
                    <span className="hidden sm:inline">Alerts:</span>
                    <span className="font-mono text-slate-500">OFF</span>
                  </>
                )}
              </button>

              {/* Dark / Light Theme Engine Toggle */}
              <button
                onClick={toggleAdminTheme}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-[11px] sm:text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                  isLight
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-500 hover:bg-amber-500/20'
                    : 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/20'
                }`}
              >
                {isLight ? (
                  <>
                    <Sun size={14} className="text-amber-500" />
                    <span className="hidden sm:inline">Light Mode</span>
                  </>
                ) : (
                  <>
                    <Moon size={14} className="text-indigo-400" />
                    <span className="hidden sm:inline">Dark Mode</span>
                  </>
                )}
              </button>

              {/* Executive Reports Modal Trigger */}
              <button
                onClick={() => setIsExportModalOpen(true)}
                className="px-2.5 py-1.5 sm:px-3.5 sm:py-1.5 rounded-lg border border-[#c9a84c]/40 bg-[#c9a84c]/10 text-[#c9a84c] text-[11px] sm:text-xs tracking-wider uppercase font-bold hover:bg-[#c9a84c] hover:text-slate-950 transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <FileText size={14} />
                <span className="hidden md:inline">Executive Reports</span>
              </button>

              {/* Refresh Sync Button */}
              <button
                onClick={() => setShowSyncModal(true)}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-br from-cyan-950/40 via-slate-900 to-slate-950 border border-cyan-500/30 hover:border-cyan-400 text-cyan-300 hover:text-cyan-100 shadow-md shadow-cyan-950/20 flex items-center justify-center transition-all cursor-pointer group"
              >
                <RefreshCw size={14} className="text-cyan-400 group-hover:rotate-180 transition-transform duration-500" />
              </button>

              <button
                onClick={() => setShowSignOutModal(true)}
                className="relative group overflow-hidden px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-2xl bg-gradient-to-r from-rose-950/40 via-[#111625] to-slate-950 border border-rose-500/30 hover:border-rose-400/80 shadow-lg shadow-rose-950/20 hover:shadow-rose-500/20 transition-all duration-300 flex items-center gap-2 text-[11px] sm:text-xs tracking-[1.5px] uppercase font-bold cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-rose-500/0 via-rose-500/15 to-rose-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                <span className="text-slate-100 group-hover:text-rose-200 font-mono font-bold tracking-widest">Sign Out</span>
                <div className="w-5 h-5 rounded-lg bg-rose-500/15 border border-rose-500/40 flex items-center justify-center text-rose-400 group-hover:bg-rose-500 group-hover:text-slate-950 transition-all">
                  <LogOut size={11} className="transition-transform group-hover:translate-x-0.5" />
                </div>
              </button>
            </div>
          </div>

          {/* NAVIGATION RIBBON */}
          <div className="border-t border-white/10 bg-slate-950/80 backdrop-blur-md px-4 py-2">
            <nav className="flex gap-2 overflow-x-auto crm-scroll py-1.5">
              {[
                { id: 'overview',     label: 'OVERVIEW',            icon: LayoutDashboard },
                { id: 'listings',     label: `VEHICLES (${metrics.totalVehiclesCount})`, icon: Car },
                { id: 'appointments', label: `APPOINTMENTS (${metrics.totalAppointmentsCount})`, icon: Calendar, badge: metrics.pendingAppointmentsCount > 0 },
                { id: 'accessories',  label: 'ACCESSORIES MANAGER', icon: Package },
                { id: 'blog',         label: 'BLOG MANAGER',        icon: Sparkles },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-xl text-xs tracking-[1.5px] uppercase font-bold transition-all flex items-center gap-2 border whitespace-nowrap shadow-md group ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-[#c9a84c] to-[#eab308] text-slate-950 border border-[#fef08a] shadow-lg shadow-[#c9a84c]/25 font-black scale-[1.02]'
                      : 'bg-slate-900/90 border border-slate-700/80 text-slate-100 hover:text-white hover:bg-slate-800 hover:border-[#c9a84c]/50 hover:shadow-[#c9a84c]/10'
                  }`}
                >
                  <tab.icon size={14} className={activeTab === tab.id ? 'text-slate-950' : 'text-amber-400/80 group-hover:text-amber-300 transition-colors'} />
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping shadow-rose-500/50" />
                  )}
                </button>
              ))}
            </nav>
          </div>
        </header>

        {/* ── DASHBOARD BODY CONTAINER ─────────────────────────────────────────── */}
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-8 flex flex-col gap-8">

          {/* TAB 1: EXECUTIVE COMMAND OVERVIEW (DEFAULT LANDING VIEW) */}
          {activeTab === 'overview' && (
            <>
              {/* PAGE BANNER HEADER */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] tracking-[4px] uppercase text-[#c9a84c] font-bold block">
                    DASHBOARD • MASTER ADMIN COMMAND CENTER
                  </span>
                  <h1 className={`text-3xl font-serif font-light mt-1 ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                    Admin Business Overview
                  </h1>
                  <p className={`text-xs mt-1 ${isLight ? 'text-slate-600 font-medium' : 'text-slate-400'}`}>
                    Real-time 360-degree telemetry across Motor Vehicles, Fuse CRM, Fuse Analytics, and Campaign Monitor.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <Link
                    to="/add-listing"
                    className="px-4 py-2.5 bg-[#c9a84c] text-slate-950 font-bold rounded-xl text-xs tracking-wider uppercase hover:bg-[#d9b85c] transition-all flex items-center gap-2 shadow-lg cursor-pointer"
                  >
                    <span>+ Add New Vehicle</span>
                    <ArrowUpRight size={16} />
                  </Link>
                </div>
              </div>

              {/* 1. EXECUTIVE NORTH STAR MULTI-ROW KPI RIBBON */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {/* Card 1: Urgent Tasks & Alerts */}
                <div className={`relative overflow-hidden p-6 rounded-2xl border transition-all duration-300 group hover:-translate-y-1 ${
                  isLight
                    ? 'bg-gradient-to-br from-rose-50/50 via-white to-white border-slate-200 shadow-md hover:shadow-xl hover:border-rose-300'
                    : 'bg-gradient-to-br from-rose-950/30 via-[#0f172a] to-[#0f172a] border-white/10 shadow-2xl hover:border-rose-500/40'
                }`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <span className={`text-[10px] tracking-[2px] uppercase font-bold block ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                        Urgent Operations SLA
                      </span>
                      <h2 className={`text-3xl font-serif font-light mt-2 font-mono font-bold ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                        {metrics.urgentTasksCount + metrics.pendingAppointmentsCount} <span className="text-xs font-sans text-slate-400">items</span>
                      </h2>
                    </div>
                    <div className={`p-3 rounded-xl border transition-transform group-hover:scale-110 ${
                      isLight ? 'bg-rose-50 text-rose-600 border-rose-200' : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                    }`}>
                      <AlertCircle size={20} />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-1.5 text-xs font-mono">
                    <span className={`px-2 py-0.5 rounded-md font-bold ${isLight ? 'bg-rose-100 text-rose-800' : 'bg-rose-500/20 text-rose-300'}`}>
                      Action Due
                    </span>
                    <span className={isLight ? 'text-slate-500 font-medium' : 'text-slate-400'}>{metrics.pendingAppointmentsCount} appts pending</span>
                  </div>
                </div>

                {/* Card 2: Inventory Capital */}
                <div className={`relative overflow-hidden p-6 rounded-2xl border transition-all duration-300 group hover:-translate-y-1 ${
                  isLight
                    ? 'bg-gradient-to-br from-blue-50/50 via-white to-white border-slate-200 shadow-md hover:shadow-xl hover:border-blue-300'
                    : 'bg-gradient-to-br from-blue-950/30 via-[#0f172a] to-[#0f172a] border-white/10 shadow-2xl hover:border-blue-500/40'
                }`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <span className={`text-[10px] tracking-[2px] uppercase font-bold block ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                        Inventory Capital
                      </span>
                      <h2 className={`text-3xl font-serif font-light mt-2 font-mono font-bold ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                        KES {(metrics.totalInventoryValue / 1000000).toFixed(1)}M
                      </h2>
                    </div>
                    <div className={`p-3 rounded-xl border transition-transform group-hover:scale-110 ${
                      isLight ? 'bg-blue-50 text-blue-600 border-blue-200' : 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                    }`}>
                      <Car size={20} />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-1.5 text-xs font-mono">
                    <span className="text-blue-400 font-bold">{metrics.totalVehiclesCount} On Lot</span>
                    <span>•</span>
                    <span className={isLight ? 'text-slate-500' : 'text-slate-400'}>{metrics.forSaleCount} For Sale</span>
                  </div>
                </div>

                {/* Card 3: CRM Active Pipeline */}
                <div className={`relative overflow-hidden p-6 rounded-2xl border transition-all duration-300 group hover:-translate-y-1 ${
                  isLight
                    ? 'bg-gradient-to-br from-amber-50/50 via-white to-white border-slate-200 shadow-md hover:shadow-xl hover:border-amber-300'
                    : 'bg-gradient-to-br from-amber-950/30 via-[#0f172a] to-[#0f172a] border-white/10 shadow-2xl hover:border-[#c9a84c]/40'
                }`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <span className={`text-[10px] tracking-[2px] uppercase font-bold block ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                        CRM Active Pipeline
                      </span>
                      <h2 className={`text-3xl font-serif font-light mt-2 font-mono font-bold ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                        KES {(metrics.pipelineValue / 1000000).toFixed(1)}M
                      </h2>
                    </div>
                    <div className={`p-3 rounded-xl border transition-transform group-hover:scale-110 ${
                      isLight ? 'bg-amber-50 text-[#c9a84c] border-amber-200' : 'bg-[#c9a84c]/10 text-[#c9a84c] border-[#c9a84c]/30'
                    }`}>
                      <TrendingUp size={20} />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-2 text-xs font-mono">
                    <span className={`px-2 py-0.5 rounded-md font-bold ${isLight ? 'bg-emerald-100 text-emerald-800' : 'bg-emerald-500/20 text-emerald-300'}`}>
                      Won: KES {(metrics.wonRevenue / 1000000).toFixed(1)}M
                    </span>
                    <span className={isLight ? 'text-slate-500 font-medium' : 'text-slate-400'}>{metrics.activeLeadsCount} active leads</span>
                  </div>
                </div>

                {/* Card 4: Storefront & ROAS */}
                <div className={`relative overflow-hidden p-6 rounded-2xl border transition-all duration-300 group hover:-translate-y-1 ${
                  isLight
                    ? 'bg-gradient-to-br from-purple-50/50 via-white to-white border-slate-200 shadow-md hover:shadow-xl hover:border-purple-300'
                    : 'bg-gradient-to-br from-purple-950/30 via-[#0f172a] to-[#0f172a] border-white/10 shadow-2xl hover:border-purple-500/40'
                }`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <span className={`text-[10px] tracking-[2px] uppercase font-bold block ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                        Ad Attribution & ROAS
                      </span>
                      <h2 className={`text-3xl font-serif font-light mt-2 font-mono font-bold ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                        4.8x ROAS
                      </h2>
                    </div>
                    <div className={`p-3 rounded-xl border transition-transform group-hover:scale-110 ${
                      isLight ? 'bg-purple-50 text-purple-600 border-purple-200' : 'bg-purple-500/10 text-purple-400 border-purple-500/30'
                    }`}>
                      <Megaphone size={20} />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-1.5 text-xs font-mono">
                    <span className={`px-2 py-0.5 rounded-md font-bold ${isLight ? 'bg-purple-100 text-purple-800' : 'bg-purple-500/20 text-purple-300'}`}>
                      {metrics.totalSessions} Visitors
                    </span>
                    <span className={isLight ? 'text-slate-500 font-medium' : 'text-slate-400'}>13 Channels</span>
                  </div>
                </div>
              </div>

              {/* 2. 14-DAY CLIENT & INVENTORY INTERACTION ACTIVITY CHART */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className={`lg:col-span-2 p-6 rounded-2xl border ${
                  isLight ? 'bg-white border-slate-200 shadow-md' : 'bg-[#0b101d] border-white/10 shadow-2xl'
                }`}>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <span className="text-[10px] tracking-[2px] uppercase font-bold text-[#c9a84c]">Omnichannel Activity Velocity</span>
                      <h3 className={`text-xl font-serif font-light mt-1 ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                        14-Day System Interaction & Engagement Trend
                      </h3>
                    </div>
                    <div className="px-3 py-1 rounded-full bg-[#c9a84c]/10 border border-[#c9a84c]/30 text-[#c9a84c] text-[10px] font-bold uppercase tracking-widest">
                      ACTIVITY: HIGH
                    </div>
                  </div>

                  <div className="h-72 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={trendChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#c9a84c" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#c9a84c" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke={isLight ? '#e2e8f0' : '#1e293b'} />
                        <XAxis dataKey="day" stroke={isLight ? '#64748b' : '#64748b'} fontSize={11} />
                        <YAxis stroke={isLight ? '#64748b' : '#64748b'} fontSize={11} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: isLight ? '#ffffff' : '#0f172a',
                            borderColor: '#c9a84c',
                            borderRadius: '12px',
                            fontSize: '12px',
                            color: isLight ? '#0f172a' : '#f8fafc'
                          }}
                        />
                        <Area type="monotone" dataKey="views" stroke="#c9a84c" strokeWidth={3} fillOpacity={1} fill="url(#goldGrad)" />
                        <Area type="monotone" dataKey="leads" stroke="#60a5fa" strokeWidth={2} fill="none" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* DEALS & INVENTORY STAGE SUMMARY */}
                <div className={`p-6 rounded-2xl border flex flex-col justify-between ${
                  isLight ? 'bg-white border-slate-200 shadow-md' : 'bg-[#0b101d] border-white/10 shadow-2xl'
                }`}>
                  <div>
                    <span className="text-[10px] tracking-[2px] uppercase font-bold text-[#c9a84c]">Pipeline Breakdown</span>
                    <h3 className={`text-xl font-serif font-light mt-1 mb-4 ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                      Deals & Inventory Stage
                    </h3>

                    <div className="space-y-3">
                      {[
                        { label: 'Qualification', count: 8, pct: 24, color: 'bg-blue-500' },
                        { label: 'Proposal & Quote', count: 6, pct: 18, color: 'bg-purple-500' },
                        { label: 'Negotiation', count: 5, pct: 15, color: 'bg-amber-500' },
                        { label: 'Won Deals / Handover', count: 12, pct: 36, color: 'bg-emerald-500' },
                      ].map(stage => (
                        <div key={stage.label} className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1.5">
                          <div className="flex items-center justify-between text-xs">
                            <span className={isLight ? 'text-slate-700 font-semibold' : 'text-slate-300'}>{stage.label}</span>
                            <span className="font-mono font-bold text-[#c9a84c]">{stage.count} ({stage.pct}%)</span>
                          </div>
                          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                            <div className={`${stage.color} h-full rounded-full`} style={{ width: `${stage.pct}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Link to="/crm/pipeline" className="mt-6 w-full py-2.5 bg-[#c9a84c]/10 text-[#c9a84c] border border-[#c9a84c]/30 hover:bg-[#c9a84c] hover:text-slate-950 font-bold rounded-xl text-xs uppercase tracking-wider text-center transition-all block">
                    Open Interactive Pipeline Kanban
                  </Link>
                </div>
              </div>

              {/* 3. THE 6-PILLAR SYSTEM TELEMETRY GRID */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Layers size={18} className="text-[#c9a84c]" />
                    <h2 className={`font-serif text-2xl font-light ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>6-Pillar System Telemetry</h2>
                  </div>
                  <span className="text-[10px] tracking-[2px] uppercase text-slate-500 font-bold">Cross-Engine Operational Analysis</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                  {/* PILLAR 1: INVENTORY & VEHICLES */}
                  <div className={`p-6 rounded-2xl border flex flex-col justify-between transition-all duration-300 ${
                    isLight ? 'bg-white border-slate-200 shadow-md hover:border-[#c9a84c]' : 'bg-[#0b101d] border-white/10 shadow-2xl hover:border-[#c9a84c]/40'
                  }`}>
                    <div>
                      <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
                        <div className="flex items-center gap-2.5">
                          <Car size={20} className="text-[#c9a84c]" />
                          <h3 className={`font-serif text-lg ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>1. Vehicle Inventory Engine</h3>
                        </div>
                        <button onClick={() => setActiveTab('listings')} className="text-xs text-[#c9a84c] hover:underline flex items-center gap-1 font-semibold">
                          <span>View All</span>
                          <ChevronRight size={14} />
                        </button>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-400 font-medium">Total Active Vehicles</span>
                          <span className="font-serif text-slate-200 font-bold text-base">{metrics.totalVehiclesCount} Units</span>
                        </div>
                        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden flex">
                          <div style={{ width: `${(metrics.forSaleCount / (metrics.totalVehiclesCount || 1)) * 100}%` }} className="bg-[#c9a84c] h-full" title="For Sale" />
                          <div style={{ width: `${(metrics.forHireCount / (metrics.totalVehiclesCount || 1)) * 100}%` }} className="bg-sky-400 h-full" title="Hire / Lease" />
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-[11px] pt-2">
                          <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                            <span className="text-slate-400 block">For Sale</span>
                            <span className="text-slate-200 font-bold text-sm">{metrics.forSaleCount} Units</span>
                          </div>
                          <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                            <span className="text-slate-400 block">Hire / Lease</span>
                            <span className="text-slate-200 font-bold text-sm">{metrics.forHireCount} Units</span>
                          </div>
                        </div>

                        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-slate-300 text-[11px] flex items-center justify-between font-mono">
                          <span>Stagnant Inventory (&gt;45 Days)</span>
                          <span className="text-amber-400 font-bold">{metrics.agedStockCount} Units</span>
                        </div>
                      </div>
                    </div>

                    <Link to="/add-listing" className="mt-6 w-full py-2.5 bg-[#c9a84c]/10 text-[#c9a84c] border border-[#c9a84c]/30 hover:bg-[#c9a84c] hover:text-slate-950 rounded-xl font-bold tracking-wider uppercase text-center block transition-all">
                      + Add New Vehicle Listing
                    </Link>
                  </div>

                  {/* PILLAR 2: FUSE CRM & SALES VELOCITY */}
                  <div className={`p-6 rounded-2xl border flex flex-col justify-between transition-all duration-300 ${
                    isLight ? 'bg-white border-slate-200 shadow-md hover:border-emerald-400' : 'bg-[#0b101d] border-white/10 shadow-2xl hover:border-emerald-500/40'
                  }`}>
                    <div>
                      <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
                        <div className="flex items-center gap-2.5">
                          <GitPullRequest size={20} className="text-emerald-400" />
                          <h3 className={`font-serif text-lg ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>2. Fuse CRM & Sales Velocity</h3>
                        </div>
                        <Link to="/crm" className="text-xs text-emerald-400 hover:underline flex items-center gap-1 font-semibold">
                          <span>CRM Overview</span>
                          <ChevronRight size={14} />
                        </Link>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-400 font-medium">Total Unweighted Pipeline</span>
                          <span className="font-serif text-slate-200 font-bold text-base">KES {(metrics.pipelineValue / 1000000).toFixed(1)}M</span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-[11px]">
                          <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                            <span className="text-slate-400 block">Active Leads</span>
                            <span className="text-emerald-400 font-bold text-sm">{metrics.activeLeadsCount} Prospects</span>
                          </div>
                          <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                            <span className="text-slate-400 block">Won Revenue</span>
                            <span className="text-slate-200 font-bold text-sm">KES {(metrics.wonRevenue / 1000000).toFixed(1)}M</span>
                          </div>
                        </div>

                        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-slate-300 text-[11px] flex items-center justify-between font-mono">
                          <span>Support Threads Open</span>
                          <span className="text-emerald-400 font-bold">{(nexusThreads || []).filter(s => s.status !== 'resolved').length || 2} Open</span>
                        </div>
                      </div>
                    </div>

                    <Link to="/crm/pipeline" className="mt-6 w-full py-2.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500 hover:text-slate-950 rounded-xl font-bold tracking-wider uppercase text-center block transition-all">
                      View Sales Pipeline Board
                    </Link>
                  </div>

                  {/* PILLAR 3: CAMPAIGN MONITOR & ATTRIBUTION */}
                  <div className={`p-6 rounded-2xl border flex flex-col justify-between transition-all duration-300 ${
                    isLight ? 'bg-white border-slate-200 shadow-md hover:border-purple-400' : 'bg-[#0b101d] border-white/10 shadow-2xl hover:border-purple-500/40'
                  }`}>
                    <div>
                      <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
                        <div className="flex items-center gap-2.5">
                          <Megaphone size={20} className="text-purple-400" />
                          <h3 className={`font-serif text-lg ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>3. Campaign Monitor</h3>
                        </div>
                        <Link to="/analytics/campaign-monitor" className="text-xs text-purple-400 hover:underline flex items-center gap-1 font-semibold">
                          <span>Attribution Suite</span>
                          <ChevronRight size={14} />
                        </Link>
                      </div>

                      <div className="space-y-4">
                        <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-between font-mono">
                          <span className="text-slate-300 text-xs">Omnichannel Average ROAS</span>
                          <span className="font-serif text-purple-300 text-lg font-bold">4.8x Return</span>
                        </div>

                        <div className="space-y-2 text-[11px]">
                          <div className="flex items-center justify-between text-slate-400">
                            <span>Facebook & Instagram Ads</span>
                            <span className="text-slate-200 font-semibold">ROAS 5.2x</span>
                          </div>
                          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-purple-500 h-full w-[85%]" />
                          </div>

                          <div className="flex items-center justify-between text-slate-400 pt-1">
                            <span>WhatsApp Direct Campaigns</span>
                            <span className="text-slate-200 font-semibold">ROAS 6.4x</span>
                          </div>
                          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-emerald-400 h-full w-[92%]" />
                          </div>
                        </div>
                      </div>
                    </div>

                    <Link to="/analytics/campaign-monitor" className="mt-6 w-full py-2.5 bg-purple-500/10 text-purple-400 border border-purple-500/30 hover:bg-purple-500 hover:text-slate-950 rounded-xl font-bold tracking-wider uppercase text-center block transition-all">
                      Open Campaign Planner & ROI
                    </Link>
                  </div>

                  {/* PILLAR 4: FUSE ANALYTICS & TELEMETRY */}
                  <div className={`p-6 rounded-2xl border flex flex-col justify-between transition-all duration-300 ${
                    isLight ? 'bg-white border-slate-200 shadow-md hover:border-sky-400' : 'bg-[#0b101d] border-white/10 shadow-2xl hover:border-sky-500/40'
                  }`}>
                    <div>
                      <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
                        <div className="flex items-center gap-2.5">
                          <Globe size={20} className="text-sky-400" />
                          <h3 className={`font-serif text-lg ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>4. Fuse Storefront Telemetry</h3>
                        </div>
                        <Link to="/analytics/dashboard" className="text-xs text-sky-400 hover:underline flex items-center gap-1 font-semibold">
                          <span>Analytics</span>
                          <ChevronRight size={14} />
                        </Link>
                      </div>

                      <div className="space-y-3 text-[11px]">
                        <span className="text-slate-400 uppercase tracking-wider text-[10px] font-bold block">Top 3 Viewed Vehicles Today</span>
                        {metrics.topViewedVehicles.slice(0, 3).map((v, i) => (
                          <div key={v.id || i} className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
                            <span className="text-slate-200 font-serif truncate max-w-[180px]">{v.listing_title}</span>
                            <span className="text-sky-400 font-bold font-mono">{(142 - i * 28)} Views</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Link to="/analytics/watch" className="mt-6 w-full py-2.5 bg-sky-500/10 text-sky-400 border border-sky-500/30 hover:bg-sky-500 hover:text-slate-950 rounded-xl font-bold tracking-wider uppercase text-center block transition-all">
                      View Live Visitors Watch Map
                    </Link>
                  </div>

                  {/* PILLAR 5: COMMUNICATION & TASK CENTRAL */}
                  <div className={`p-6 rounded-2xl border flex flex-col justify-between transition-all duration-300 ${
                    isLight ? 'bg-white border-slate-200 shadow-md hover:border-amber-400' : 'bg-[#0b101d] border-white/10 shadow-2xl hover:border-amber-500/40'
                  }`}>
                    <div>
                      <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
                        <div className="flex items-center gap-2.5">
                          <MessageSquare size={20} className="text-amber-400" />
                          <h3 className={`font-serif text-lg ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>5. Communication Central</h3>
                        </div>
                        <Link to="/crm/communication" className="text-xs text-amber-400 hover:underline flex items-center gap-1 font-semibold">
                          <span>Comm Logs</span>
                          <ChevronRight size={14} />
                        </Link>
                      </div>

                      <div className="space-y-4">
                        <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
                          <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                            <PhoneCall size={14} className="mx-auto text-amber-400 mb-1" />
                            <span className="text-slate-400 block text-[10px]">Calls</span>
                            <span className="text-slate-200 font-bold">24 Today</span>
                          </div>
                          <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                            <MessageSquare size={14} className="mx-auto text-emerald-400 mb-1" />
                            <span className="text-slate-400 block text-[10px]">WhatsApp</span>
                            <span className="text-slate-200 font-bold">48 Chats</span>
                          </div>
                          <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                            <CheckSquare size={14} className="mx-auto text-purple-400 mb-1" />
                            <span className="text-slate-400 block text-[10px]">Tasks</span>
                            <span className="text-slate-200 font-bold">{tasks.length} Open</span>
                          </div>
                        </div>

                        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-slate-300 text-[11px] flex items-center justify-between font-mono">
                          <span>SLA Average First Response</span>
                          <span className="text-amber-300 font-bold">14 Mins</span>
                        </div>
                      </div>
                    </div>

                    <Link to="/crm/tasks" className="mt-6 w-full py-2.5 bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500 hover:text-slate-950 rounded-xl font-bold tracking-wider uppercase text-center block transition-all">
                      Open Rep Task Hub
                    </Link>
                  </div>

                  {/* PILLAR 6: INFRASTRUCTURE & SECURITY VITALS */}
                  <div className={`p-6 rounded-2xl border flex flex-col justify-between transition-all duration-300 ${
                    isLight ? 'bg-white border-slate-200 shadow-md hover:border-rose-400' : 'bg-[#0b101d] border-white/10 shadow-2xl hover:border-rose-500/40'
                  }`}>
                    <div>
                      <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
                        <div className="flex items-center gap-2.5">
                          <Server size={20} className="text-rose-400" />
                          <h3 className={`font-serif text-lg ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>6. Infrastructure & Vitals</h3>
                        </div>
                        <Link to="/analytics/vitals" className="text-xs text-rose-400 hover:underline flex items-center gap-1 font-semibold">
                          <span>Server Vitals</span>
                          <ChevronRight size={14} />
                        </Link>
                      </div>

                      <div className="space-y-3 text-[11px]">
                        <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between font-mono">
                          <span className="text-slate-300">Supabase API Latency</span>
                          <span className="text-emerald-400 font-bold">24 ms (Healthy)</span>
                        </div>

                        <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between font-mono">
                          <span className="text-slate-400">Media CDN Bandwidth</span>
                          <span className="text-slate-200 font-bold">1.4 GB / 10 GB</span>
                        </div>

                        <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between font-mono">
                          <span className="text-slate-400">Security Center Status</span>
                          <span className="text-emerald-400 font-bold">0 Active Threats</span>
                        </div>
                      </div>
                    </div>

                    <Link to="/analytics/shield" className="mt-6 w-full py-2.5 bg-rose-500/10 text-rose-400 border border-rose-500/30 hover:bg-rose-500 hover:text-white rounded-xl font-bold tracking-wider uppercase text-center block transition-all">
                      Open Security Center
                    </Link>
                  </div>

                </div>
              </div>

              {/* 4. REAL-TIME OMNICHANNEL AUDIT STREAM */}
              <div className={`p-6 rounded-2xl border shadow-2xl ${
                isLight ? 'bg-white border-slate-200' : 'bg-[#0b101d] border-white/10'
              }`}>
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                    <h3 className={`font-serif text-xl font-light ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>Real-Time Omnichannel Activity Audit Feed</h3>
                  </div>
                  <span className="text-[10px] tracking-[2px] uppercase text-slate-400 font-bold">Live Pulse Stream</span>
                </div>

                <div className="space-y-3">
                  {auditStream.map(item => (
                    <div key={item.id} className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between hover:bg-white/[0.04] transition-all">
                      <div className="flex items-center gap-3.5">
                        <div className="p-2 rounded-xl" style={{ backgroundColor: `${item.color}15`, color: item.color }}>
                          <item.icon size={16} />
                        </div>
                        <div>
                          <h4 className={`text-xs font-semibold ${isLight ? 'text-slate-900' : 'text-slate-200'}`}>{item.title}</h4>
                          <p className={`text-[11px] mt-0.5 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>{item.desc}</p>
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">{item.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* TAB 2: VEHICLE LISTINGS WORKSPACE */}
          {activeTab === 'listings' && (
            <div className={`border rounded-2xl overflow-hidden shadow-2xl transition-colors ${
              isLight ? 'bg-white border-slate-200' : 'bg-[#0b101d] border-white/10'
            }`}>
              <div className={`px-6 py-4 border-b relative z-30 flex items-center justify-between flex-wrap gap-4 ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#070b15] border-white/10'
              }`}>
                <div>
                  <h2 className={`font-serif text-xl font-light ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>Vehicle Inventory Management</h2>
                  <p className="text-slate-400 text-xs mt-0.5">{filteredListings.length} Vehicles Displayed</p>
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                  {/* PredictiveSelect for Offer Type */}
                  <div className="w-44">
                    <PredictiveSelect
                      label="Offer Type"
                      value={selectedOfferType}
                      onChange={setSelectedOfferType}
                      options={[
                        { value: 'All', label: 'All Offers' },
                        { value: 'Featured', label: 'Featured Inventory' },
                        { value: 'For Sale', label: 'For Sale' },
                        { value: 'For Hire', label: 'For Hire' },
                        { value: 'Lease', label: 'Lease' },
                      ]}
                    />
                  </div>

                  {/* PredictiveSelect for Make */}
                  <div className="w-44">
                    <PredictiveSelect
                      label="Vehicle Make"
                      value={selectedMake}
                      onChange={setSelectedMake}
                      options={makeOptions.map(m => ({ value: m, label: m === 'All' ? 'All Makes' : m }))}
                    />
                  </div>

                  <Link to="/add-listing" className="px-4 py-2 bg-[#c9a84c] text-slate-950 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-[#d9b85c] flex items-center gap-2 shadow-lg">
                    <Plus size={16} />
                    <span>Add Listing</span>
                  </Link>
                </div>
              </div>

              {loadingListings ? (
                <div className="px-6 py-20 flex flex-col items-center gap-3">
                  <div className="w-6 h-6 border-2 border-slate-600 border-t-[#c9a84c] rounded-full animate-spin" />
                  <p className="text-xs tracking-[3px] uppercase text-slate-400 font-bold">Loading Inventory...</p>
                </div>
              ) : filteredListings.length === 0 ? (
                <div className="px-6 py-16 text-center text-slate-400 text-xs font-medium">
                  No vehicles match the selected filter criteria.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className={isLight ? 'bg-slate-50' : 'bg-[#070b15]'}>
                        <th style={thStyle}>Photo</th>
                        <th style={thStyle}>Title</th>
                        <th style={thStyle}>Make / Year</th>
                        <th style={thStyle}>Price</th>
                        <th style={thStyle}>Condition</th>
                        <th style={thStyle}>Type</th>
                        <th style={{ ...thStyle, textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredListings.slice((vehiclePage - 1) * vehiclePerPage, vehiclePage * vehiclePerPage).map(listing => {
                        const badge =
                          listing.offer_type === 'For Sale' ? 'text-[#c9a84c] border-[#c9a84c]/30 bg-[#c9a84c]/10' :
                          listing.offer_type === 'For Hire' ? 'text-sky-400 border-sky-400/30 bg-sky-400/10' :
                          'text-purple-400 border-purple-400/30 bg-purple-400/10'

                        return (
                          <tr key={listing.id} className={`border-b transition-colors ${
                            isLight ? 'border-slate-200 hover:bg-slate-50' : 'border-white/5 hover:bg-white/[0.02]'
                          }`}>
                            <td style={tdStyle}>
                              {coverImage(listing) ? (
                                <img className="w-14 h-10 object-cover rounded-lg border border-white/10 shadow-sm" src={coverImage(listing)} alt="" />
                              ) : (
                                <div className="w-14 h-10 bg-slate-900 border border-white/10 rounded-lg flex items-center justify-center text-[9px] text-slate-500 uppercase font-mono">
                                  No Img
                                </div>
                              )}
                            </td>
                            <td style={tdStyle}>
                              <p className={`font-serif text-sm font-medium ${isLight ? 'text-slate-900' : 'text-slate-200'}`}>
                                {listing.listing_title || '—'}
                              </p>
                            </td>
                            <td style={tdStyle}>
                              <p className="text-xs text-slate-400">{listing.make || '—'}{listing.year ? ` · ${listing.year}` : ''}</p>
                            </td>
                            <td style={tdStyle}>
                              <p className="font-serif text-sm text-[#c9a84c] font-bold">{formatPrice(listing.price)}</p>
                            </td>
                            <td style={tdStyle}>
                              <p className="text-xs text-slate-400">{listing.condition || '—'}</p>
                            </td>
                            <td style={tdStyle}>
                              <span className={`inline-block text-[9px] tracking-wider uppercase px-2.5 py-0.5 border rounded-md font-bold ${badge}`}>
                                {listing.offer_type || 'For Sale'}
                              </span>
                            </td>
                            <td style={{ ...tdStyle, textAlign: 'right', whiteSpace: 'nowrap' }}>
                              <div className="flex items-center justify-end gap-1">
                                <ActionTooltip text="Preview Un-editable Dedicated Vehicle Dossier">
                                  <button className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-white/5 rounded-lg transition-all cursor-pointer" onClick={() => navigate(`/view-listing/${listing.id}`)}>
                                    <Eye size={14} />
                                  </button>
                                </ActionTooltip>
                                <ActionTooltip text="Edit Vehicle Specs & Pricing Details">
                                  <button className="p-1.5 text-slate-400 hover:text-[#c9a84c] hover:bg-[#c9a84c]/10 rounded-lg transition-all cursor-pointer" onClick={() => navigate(`/edit-listing/${listing.id}`)}>
                                    <Pencil size={14} />
                                  </button>
                                </ActionTooltip>
                                <ActionTooltip text="Permanently Delete Vehicle Listing">
                                  <button className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all cursor-pointer" onClick={() => setConfirmDelete(listing)}>
                                    <Trash2 size={14} />
                                  </button>
                                </ActionTooltip>
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Pagination Footer */}
              {!loadingListings && filteredListings.length > 0 && (
                <div className={`px-6 py-3 border-t ${isLight ? 'border-slate-200' : 'border-white/10'}`}>
                  <UniversalPagination
                    currentPage={vehiclePage}
                    totalPages={Math.ceil(filteredListings.length / vehiclePerPage) || 1}
                    totalItems={filteredListings.length}
                    itemsPerPage={vehiclePerPage}
                    onPageChange={page => setVehiclePage(page)}
                    onItemsPerPageChange={size => { setVehiclePerPage(size); setVehiclePage(1) }}
                    pageSizeOptions={[5, 10, 25, 50]}
                  />
                </div>
              )}
            </div>
          )}

          {/* TAB 3: BOOKED APPOINTMENTS WORKSPACE */}
          {activeTab === 'appointments' && (
            <AppointmentsManager 
              showToast={showToast} 
              onStatusChange={(updatedList) => setAppointments(updatedList)} 
              isLight={isLight}
            />
          )}

          {/* TAB 4: ACCESSORIES MANAGER WORKSPACE */}
          {activeTab === 'accessories' && (
            <div className={`border rounded-2xl p-6 shadow-2xl ${
              isLight ? 'bg-white border-slate-200' : 'bg-[#0b101d] border-white/10'
            }`}>
              <AccessoriesManager showToast={showToast} />
            </div>
          )}

          {/* TAB 5: BLOG MANAGER WORKSPACE */}
          {activeTab === 'blog' && (
            <div className={`border rounded-2xl p-6 shadow-2xl ${
              isLight ? 'bg-white border-slate-200' : 'bg-[#0b101d] border-white/10'
            }`}>
              <BlogManager showToast={showToast} />
            </div>
          )}

        </div>
      </div>

      {/* Sign Out Confirmation Modal */}
      <ConfirmSignOutModal
        isOpen={showSignOutModal}
        onClose={() => setShowSignOutModal(false)}
        onConfirm={handleLogout}
        isLight={isLight}
      />

      {/* Real-time System Sync Status Modal */}
      <SystemSyncModal
        isOpen={showSyncModal}
        onClose={() => setShowSyncModal(false)}
        isLight={isLight}
      />

      {/* Omnichannel Notification Settings Modal */}
      <NotificationSettingsModal
        isOpen={showAlertsModal}
        onClose={() => setShowAlertsModal(false)}
        isLight={isLight}
      />

    </AdminSidebar>
  )
}