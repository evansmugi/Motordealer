import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useCRMStore } from '../../context/CRMStore'
import UniversalPagination from '../../components/common/UniversalPagination'
import PredictiveSelect from '../../components/common/PredictiveSelect'
import ActionTooltip from '../../components/common/ActionTooltip'
import ActionConfirmModal from '../../components/common/ActionConfirmModal'
import ModernDatePicker from '../../components/common/ModernDatePicker'
import {
  Calendar as CalendarIcon, ChevronLeft, ChevronRight, Search, Plus, Filter,
  CheckCircle2, Clock, MapPin, Phone, Mail, User, Car, Sparkles, X,
  Trash2, MessageSquare, ExternalLink, RotateCcw, AlertCircle, ShieldCheck, Eye
} from 'lucide-react'

export default function BookedAppointments() {
  const appointments = useCRMStore(state => state.appointments || [])
  const leads = useCRMStore(state => state.leads || [])
  const adminTheme = useCRMStore(state => state.adminTheme)
  const updateAppointmentStatus = useCRMStore(state => state.updateAppointmentStatus)
  const deleteAppointment = useCRMStore(state => state.deleteAppointment)
  const addAppointment = useCRMStore(state => state.addAppointment)

  const isLight = adminTheme === 'light'

  // Filter States
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedCalendarDate, setSelectedCalendarDate] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(5)

  // Confirmation Modal State
  const [pendingAction, setPendingAction] = useState(null) // { type, title, description, onConfirm }

  // New Appointment Modal State
  const [showNewModal, setShowNewModal] = useState(false)
  const [newForm, setNewForm] = useState({
    lead_name: '',
    phone: '',
    email: '',
    vehicle_name: '',
    appointment_date: '',
    appointment_time: '10:00 AM',
    location_type: 'Nairobi Showroom',
    notes: '',
    assigned_to: 'Alex Kimani'
  })

  // Right Sidebar Calendar State
  const [calendarViewDate, setCalendarViewDate] = useState(new Date())
  const calYear = calendarViewDate.getFullYear()
  const calMonth = calendarViewDate.getMonth()

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]
  const daysOfWeek = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

  // Map of appointments by date string (YYYY-MM-DD) for calendar highlighting & hover tooltips
  const appDateDetails = useMemo(() => {
    const details = {}
    appointments.forEach(app => {
      if (app.appointment_date) {
        const d = String(app.appointment_date).trim()
        if (!details[d]) details[d] = { count: 0, leads: [] }
        details[d].count += 1
        const name = app.lead_name || 'VIP Client'
        if (!details[d].leads.includes(name)) {
          details[d].leads.push(name)
        }
      }
    })
    return details
  }, [appointments])

  // Relative Date Helper
  const getRelativeDateMeta = (dateStr) => {
    if (!dateStr) return { label: 'Unscheduled', badgeClass: 'bg-slate-500/20 text-slate-400 border-slate-500/30' }
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const [y, m, d] = dateStr.split('-').map(Number)
    const target = new Date(y, m - 1, d)
    target.setHours(0, 0, 0, 0)

    const diffDays = Math.round((target - today) / (1000 * 60 * 60 * 24))

    if (diffDays === 0) {
      return { label: 'TODAY', badgeClass: isLight ? 'bg-amber-100 text-amber-900 border-amber-300 font-bold' : 'bg-amber-500/20 text-[#c9a84c] border-[#c9a84c]/50 font-bold' }
    } else if (diffDays === 1) {
      return { label: 'TOMORROW', badgeClass: isLight ? 'bg-blue-100 text-blue-900 border-blue-300 font-bold' : 'bg-blue-500/20 text-blue-300 border-blue-500/40' }
    } else if (diffDays > 1 && diffDays <= 7) {
      return { label: `In ${diffDays} days`, badgeClass: isLight ? 'bg-purple-100 text-purple-900 border-purple-300 font-bold' : 'bg-purple-500/20 text-purple-300 border-purple-500/40' }
    } else if (diffDays > 7) {
      return { label: `In ${diffDays} days`, badgeClass: isLight ? 'bg-emerald-100 text-emerald-900 border-emerald-300 font-bold' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' }
    } else {
      return { label: 'PAST', badgeClass: isLight ? 'bg-slate-200 text-slate-700 border-slate-300 font-medium' : 'bg-slate-800 text-slate-400 border-white/10' }
    }
  }

  // Sorted & Filtered Appointments (Closest to today first)
  const sortedAndFilteredAppointments = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0]

    let result = [...appointments]

    // Search filter
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase().trim()
      result = result.filter(a =>
        (a.lead_name && a.lead_name.toLowerCase().includes(q)) ||
        (a.phone && a.phone.includes(q)) ||
        (a.email && a.email.toLowerCase().includes(q)) ||
        (a.vehicle_name && a.vehicle_name.toLowerCase().includes(q)) ||
        (a.location_type && a.location_type.toLowerCase().includes(q)) ||
        (a.notes && a.notes.toLowerCase().includes(q))
      )
    }

    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter(a => a.status === statusFilter)
    }

    // Selected Calendar Date filter
    if (selectedCalendarDate) {
      result = result.filter(a => a.appointment_date === selectedCalendarDate)
    }

    // Sort hierarchy: Future & Today appointments first (closest date first), then Past appointments
    return result.sort((a, b) => {
      const dateA = a.appointment_date || '9999-99-99'
      const dateB = b.appointment_date || '9999-99-99'
      
      const isFutureA = dateA >= todayStr
      const isFutureB = dateB >= todayStr

      if (isFutureA && !isFutureB) return -1
      if (!isFutureA && isFutureB) return 1

      if (isFutureA && isFutureB) {
        return dateA.localeCompare(dateB) // Closest future date first
      } else {
        return dateB.localeCompare(dateA) // Recent past date first
      }
    })
  }, [appointments, searchTerm, statusFilter, selectedCalendarDate])

  const totalPages = Math.ceil(sortedAndFilteredAppointments.length / itemsPerPage) || 1
  const paginatedAppointments = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return sortedAndFilteredAppointments.slice(start, start + itemsPerPage)
  }, [sortedAndFilteredAppointments, currentPage, itemsPerPage])

  // Handle New Booking Submission
  const handleCreateAppointment = (e) => {
    e.preventDefault()
    if (!newForm.lead_name.trim()) return

    addAppointment({
      ...newForm,
      appointment_date: newForm.appointment_date || new Date().toISOString().split('T')[0]
    })

    setShowNewModal(false)
    setNewForm({
      lead_name: '',
      phone: '',
      email: '',
      vehicle_name: '',
      appointment_date: '',
      appointment_time: '10:00 AM',
      location_type: 'Nairobi Showroom',
      notes: '',
      assigned_to: 'Alex Kimani'
    })
  }

  // Calendar Helper Days
  const daysInCalMonth = new Date(calYear, calMonth + 1, 0).getDate()
  const firstDayOfCalMonth = new Date(calYear, calMonth, 1).getDay()

  return (
    <div className={`p-6 min-h-screen font-sans ${isLight ? 'bg-slate-100 text-slate-900' : 'bg-[#090e1a] text-slate-100'}`}>
      {/* Top Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <CalendarIcon size={18} className="text-[#c9a84c]" />
            <span className="text-xs font-mono uppercase font-bold tracking-widest text-[#c9a84c]">VIP Viewing Logistics</span>
          </div>
          <h1 className={`text-2xl sm:text-3xl font-serif font-light tracking-tight ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
            Booked Appointments
          </h1>
          <p className={`text-xs mt-1 ${isLight ? 'text-slate-600 font-medium' : 'text-slate-400'}`}>
            Manage scheduled client vehicle viewings and test drive logistics across branches.
          </p>
        </div>

        <button
          onClick={() => setShowNewModal(true)}
          className="px-5 py-2.5 bg-gradient-to-r from-[#c9a84c] to-[#e6c76e] text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl hover:opacity-95 transition-all shadow-lg flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <Plus size={16} />
          <span>Book New Viewing</span>
        </button>
      </div>

      {/* KPI Ribbon Grid matching Overview style */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        {/* Card 1: Total Appointments */}
        <div
          className={`relative overflow-hidden p-6 rounded-2xl border transition-all duration-300 group hover:-translate-y-1 ${
            isLight
              ? 'bg-gradient-to-br from-amber-50/50 via-white to-white border-slate-200 shadow-md hover:shadow-xl hover:border-amber-300'
              : 'bg-gradient-to-br from-amber-950/30 via-[#0f172a] to-[#0f172a] border-white/10 shadow-2xl hover:border-[#c9a84c]/40'
          }`}
        >
          <div className="flex items-start justify-between">
            <div>
              <span className={`text-[10px] tracking-[2px] uppercase font-bold block ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                Total Appointments
              </span>
              <h2 className={`text-3xl font-serif font-light mt-2 font-mono font-bold ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                {appointments.length}
              </h2>
            </div>
            <div className={`p-3 rounded-xl border transition-transform group-hover:scale-110 ${
              isLight ? 'bg-amber-50 text-[#c9a84c] border-amber-200' : 'bg-[#c9a84c]/10 text-[#c9a84c] border-[#c9a84c]/30'
            }`}>
              <CalendarIcon size={20} />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs font-mono">
            <span className={`px-2 py-0.5 rounded-md font-bold ${isLight ? 'bg-amber-100 text-amber-900' : 'bg-amber-500/20 text-[#c9a84c]'}`}>
              VIP Leads
            </span>
            <span className={isLight ? 'text-slate-600 font-medium' : 'text-slate-400'}>client viewings</span>
          </div>
        </div>

        {/* Card 2: Upcoming Scheduled */}
        <div
          className={`relative overflow-hidden p-6 rounded-2xl border transition-all duration-300 group hover:-translate-y-1 ${
            isLight
              ? 'bg-gradient-to-br from-blue-50/50 via-white to-white border-slate-200 shadow-md hover:shadow-xl hover:border-blue-300'
              : 'bg-gradient-to-br from-blue-950/30 via-[#0f172a] to-[#0f172a] border-white/10 shadow-2xl hover:border-blue-500/40'
          }`}
        >
          <div className="flex items-start justify-between">
            <div>
              <span className={`text-[10px] tracking-[2px] uppercase font-bold block ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                Upcoming Scheduled
              </span>
              <h2 className={`text-3xl font-serif font-light mt-2 font-mono font-bold ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                {appointments.filter(a => a.status === 'scheduled' || a.status === 'confirmed').length}
              </h2>
            </div>
            <div className={`p-3 rounded-xl border transition-transform group-hover:scale-110 ${
              isLight ? 'bg-blue-50 text-blue-600 border-blue-200' : 'bg-blue-500/10 text-blue-400 border-blue-500/30'
            }`}>
              <Clock size={20} />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs font-mono">
            <span className={`px-2 py-0.5 rounded-md font-bold ${isLight ? 'bg-blue-100 text-blue-900' : 'bg-blue-500/20 text-blue-300'}`}>
              Active Pipeline
            </span>
            <span className={isLight ? 'text-slate-600 font-medium' : 'text-slate-400'}>confirmed & scheduled</span>
          </div>
        </div>

        {/* Card 3: Completed / Attended */}
        <div
          className={`relative overflow-hidden p-6 rounded-2xl border transition-all duration-300 group hover:-translate-y-1 ${
            isLight
              ? 'bg-gradient-to-br from-emerald-50/50 via-white to-white border-slate-200 shadow-md hover:shadow-xl hover:border-emerald-300'
              : 'bg-gradient-to-br from-emerald-950/30 via-[#0f172a] to-[#0f172a] border-white/10 shadow-2xl hover:border-emerald-500/40'
          }`}
        >
          <div className="flex items-start justify-between">
            <div>
              <span className={`text-[10px] tracking-[2px] uppercase font-bold block ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                Completed / Attended
              </span>
              <h2 className={`text-3xl font-serif font-light mt-2 font-mono font-bold ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                {appointments.filter(a => a.status === 'completed' || a.status === 'attended' || a.status === 'showed_up').length}
              </h2>
            </div>
            <div className={`p-3 rounded-xl border transition-transform group-hover:scale-110 ${
              isLight ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
            }`}>
              <CheckCircle2 size={20} />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs font-mono">
            <span className={`px-2 py-0.5 rounded-md font-bold ${isLight ? 'bg-emerald-100 text-emerald-900' : 'bg-emerald-500/20 text-emerald-300'}`}>
              Showed Up
            </span>
            <span className={isLight ? 'text-slate-600 font-medium' : 'text-slate-400'}>viewings concluded</span>
          </div>
        </div>

        {/* Card 4: Viewing Locations */}
        <div
          className={`relative overflow-hidden p-6 rounded-2xl border transition-all duration-300 group hover:-translate-y-1 ${
            isLight
              ? 'bg-gradient-to-br from-purple-50/50 via-white to-white border-slate-200 shadow-md hover:shadow-xl hover:border-purple-300'
              : 'bg-gradient-to-br from-purple-950/30 via-[#0f172a] to-[#0f172a] border-white/10 shadow-2xl hover:border-purple-500/40'
          }`}
        >
          <div className="flex items-start justify-between">
            <div>
              <span className={`text-[10px] tracking-[2px] uppercase font-bold block ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                Viewing Locations
              </span>
              <h2 className={`text-3xl font-serif font-light mt-2 font-mono font-bold ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                5 Branches
              </h2>
            </div>
            <div className={`p-3 rounded-xl border transition-transform group-hover:scale-110 ${
              isLight ? 'bg-purple-50 text-purple-600 border-purple-200' : 'bg-purple-500/10 text-purple-400 border-purple-500/30'
            }`}>
              <MapPin size={20} />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs font-mono">
            <span className={`px-2 py-0.5 rounded-md font-bold ${isLight ? 'bg-purple-100 text-purple-900' : 'bg-purple-500/20 text-purple-300'}`}>
              Nationwide
            </span>
            <span className={isLight ? 'text-slate-600 font-medium' : 'text-slate-400'}>showroom network</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Left/Center Content (Table) + Right Sidebar (Calendar) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left 3 Columns: Table & Controls */}
        <div className="lg:col-span-3 space-y-4">
          {/* Controls Ribbon */}
          <div className={`p-4 rounded-2xl border flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 ${
            isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900/90 border-white/10'
          }`}>
            {/* Search Input */}
            <div className="relative flex-1">
              <Search size={14} className={`absolute left-3.5 top-3 ${isLight ? 'text-slate-400' : 'text-slate-500'}`} />
              <input
                type="text"
                placeholder="Search appointments by lead name, phone, vehicle, or notes..."
                value={searchTerm}
                onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                className={`w-full pl-10 pr-4 py-2 rounded-xl text-xs outline-none border transition-all ${
                  isLight
                    ? 'bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-[#c9a84c]'
                    : 'bg-slate-950 border-white/10 text-slate-200 placeholder:text-slate-500 focus:border-[#c9a84c]'
                }`}
              />
            </div>

            {/* Status PredictiveSelect */}
            <div className="w-full md:w-56">
              <PredictiveSelect
                value={statusFilter}
                onChange={val => { setStatusFilter(val); setCurrentPage(1); }}
                options={[
                  { value: 'all', label: 'All Statuses' },
                  { value: 'scheduled', label: 'Scheduled Viewings', badge: 'Pending' },
                  { value: 'confirmed', label: 'Confirmed VIP', badge: 'Ready' },
                  { value: 'completed', label: 'Completed / Attended', badge: 'Done' },
                  { value: 'cancelled', label: 'Cancelled', badge: 'Archived' }
                ]}
                isLight={isLight}
                placeholder="Filter Status..."
              />
            </div>

            {/* Active Calendar Date Filter Reset Badge */}
            {selectedCalendarDate && (
              <button
                onClick={() => setSelectedCalendarDate('')}
                className="px-3 py-2 rounded-xl border border-[#c9a84c] bg-[#c9a84c]/15 text-[#c9a84c] text-xs font-mono flex items-center gap-1.5 hover:bg-[#c9a84c]/25 transition-all cursor-pointer"
              >
                <span>Filtered: {selectedCalendarDate}</span>
                <X size={13} />
              </button>
            )}
          </div>

          {/* Table Container */}
          <div className={`rounded-2xl border overflow-hidden shadow-xl ${
            isLight ? 'bg-white border-slate-200' : 'bg-slate-900/90 border-white/10'
          }`}>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans">
                <thead>
                  <tr className={`border-b text-[10px] uppercase font-bold tracking-wider font-mono ${
                    isLight ? 'bg-slate-100 border-slate-200 text-slate-700' : 'bg-slate-950/80 border-white/10 text-slate-400'
                  }`}>
                    <th className="p-4">Customer / Lead</th>
                    <th className="p-4">Vehicle of Interest</th>
                    <th className="p-4">Date & Time (Chronological)</th>
                    <th className="p-4">Location</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isLight ? 'divide-slate-200' : 'divide-white/5'}`}>
                  {paginatedAppointments.length > 0 ? (
                    paginatedAppointments.map(app => {
                      const relMeta = getRelativeDateMeta(app.appointment_date)
                      const matchingLead = leads.find(l => l.id === app.lead_id || (l.email && l.email === app.email))
                      const intentScore = matchingLead?.intent_score || matchingLead?.conversion_probability || 50

                      return (
                        <tr key={app.id} className={`transition-colors ${isLight ? 'hover:bg-slate-50' : 'hover:bg-white/5'}`}>
                          {/* 1. Customer / Lead */}
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <Link
                                to={`/crm/leads/${matchingLead?.id || app.lead_id}`}
                                className="w-9 h-9 rounded-xl bg-[#c9a84c]/10 border border-[#c9a84c]/30 text-[#c9a84c] flex items-center justify-center font-bold font-mono hover:bg-[#c9a84c] hover:text-slate-950 transition-all shrink-0"
                              >
                                {app.lead_name ? app.lead_name.substring(0, 2).toUpperCase() : 'VIP'}
                              </Link>
                              <div>
                                <div className="flex items-center gap-2">
                                  <Link
                                    to={`/crm/leads/${matchingLead?.id || app.lead_id}`}
                                    className={`font-serif font-bold text-sm hover:text-[#c9a84c] transition-colors ${isLight ? 'text-slate-900' : 'text-slate-100'}`}
                                  >
                                    {app.lead_name}
                                  </Link>
                                  <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold border ${
                                    intentScore >= 75
                                      ? isLight ? 'bg-emerald-100 text-emerald-900 border-emerald-300' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                                      : isLight ? 'bg-amber-100 text-amber-900 border-amber-300' : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                                  }`}>
                                    {intentScore}% INTENT
                                  </span>
                                </div>
                                <div className={`flex items-center gap-2 mt-0.5 text-[11px] font-mono ${isLight ? 'text-slate-600 font-medium' : 'text-slate-400'}`}>
                                  <span>{app.phone || 'N/A'}</span>
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* 2. Vehicle of Interest */}
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <Car size={14} className="text-[#c9a84c]" />
                              <span className={`font-mono font-bold ${isLight ? 'text-slate-900' : 'text-slate-200'}`}>
                                {app.vehicle_name || 'Luxury Vehicle'}
                              </span>
                            </div>
                          </td>

                          {/* 3. Date & Time */}
                          <td className="p-4">
                            <div className="space-y-1 font-mono">
                              <div className="flex items-center gap-2">
                                <span className={`font-bold ${isLight ? 'text-slate-900' : 'text-slate-200'}`}>{app.appointment_date}</span>
                                <span className={`px-2 py-0.5 rounded text-[9px] font-bold border ${relMeta.badgeClass}`}>
                                  {relMeta.label}
                                </span>
                              </div>
                              <div className={`text-[11px] flex items-center gap-1 ${isLight ? 'text-slate-700 font-medium' : 'text-slate-400'}`}>
                                <Clock size={12} className="text-[#c9a84c]" />
                                <span>{app.appointment_time || '10:00 AM'}</span>
                              </div>
                            </div>
                          </td>

                          {/* 4. Location */}
                          <td className="p-4">
                            <div className={`flex items-center gap-1.5 font-mono text-xs ${isLight ? 'text-slate-800 font-medium' : 'text-slate-300'}`}>
                              <MapPin size={13} className="text-slate-400" />
                              <span>{app.location_type || 'Nairobi Showroom'}</span>
                            </div>
                          </td>

                          {/* 5. Status */}
                          <td className="p-4">
                            <div className="w-36">
                              <PredictiveSelect
                                value={app.status || 'scheduled'}
                                onChange={val => updateAppointmentStatus(app.id, val)}
                                options={[
                                  { value: 'scheduled', label: 'Scheduled', badge: 'Pending' },
                                  { value: 'confirmed', label: 'Confirmed', badge: 'Ready' },
                                  { value: 'completed', label: 'Completed', badge: 'Attended' },
                                  { value: 'cancelled', label: 'Cancelled', badge: 'Void' }
                                ]}
                                isLight={isLight}
                              />
                            </div>
                          </td>

                          {/* 6. Actions */}
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {app.phone && (
                                <ActionTooltip text="Chat on WhatsApp" isLight={isLight}>
                                  <a
                                    href={`https://wa.me/${app.phone.replace(/[^0-9]/g, '')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`p-1.5 rounded-lg border transition-all ${
                                      isLight
                                        ? 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100'
                                        : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                                    }`}
                                  >
                                    <MessageSquare size={13} />
                                  </a>
                                </ActionTooltip>
                              )}

                              {app.phone && (
                                <ActionTooltip text="Call Client" isLight={isLight}>
                                  <a
                                    href={`tel:${app.phone}`}
                                    className={`p-1.5 rounded-lg border transition-all ${
                                      isLight
                                        ? 'bg-blue-50 text-blue-700 border-blue-300 hover:bg-blue-100'
                                        : 'bg-blue-500/10 text-blue-400 border-blue-500/30 hover:bg-blue-500/20'
                                    }`}
                                  >
                                    <Phone size={13} />
                                  </a>
                                </ActionTooltip>
                              )}

                              <ActionTooltip text="Delete Appointment" isLight={isLight}>
                                <button
                                  onClick={() => setPendingAction({
                                    type: 'delete',
                                    title: `Delete Appointment — ${app.lead_name}`,
                                    description: `You are about to permanently delete the scheduled appointment for ${app.lead_name} (${app.vehicle_name || 'Vehicle TBD'}) on ${app.appointment_date} at ${app.appointment_time || '—'}. This action cannot be undone and all associated records will be removed from the CRM pipeline.`,
                                    onConfirm: () => deleteAppointment(app.id)
                                  })}
                                  className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                                    isLight
                                      ? 'bg-rose-50 text-rose-700 border-rose-300 hover:bg-rose-100'
                                      : 'bg-rose-500/10 text-rose-400 border-rose-500/30 hover:bg-rose-500/20'
                                  }`}
                                >
                                  <Trash2 size={13} />
                                </button>
                              </ActionTooltip>
                            </div>
                          </td>
                        </tr>
                      )
                    })
                  ) : (
                    <tr>
                      <td colSpan={6} className={`text-center py-12 font-mono ${isLight ? 'text-slate-500 font-medium' : 'text-slate-400'}`}>
                        No appointments found matching current filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer */}
            <div className={`p-4 border-t ${isLight ? 'border-slate-200' : 'border-white/10'}`}>
              <UniversalPagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={sortedAndFilteredAppointments.length}
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
        </div>

        {/* Right Column: Styled Interactive Calendar Sidebar */}
        <div className="space-y-4">
          <div className={`p-5 rounded-2xl border shadow-xl backdrop-blur-md ${
            isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-900/90 border-[#c9a84c]/30 text-slate-100'
          }`}>
            <div className={`flex items-center justify-between pb-3 mb-4 border-b ${isLight ? 'border-slate-200' : 'border-white/10'}`}>
              <div className="flex items-center gap-2">
                <CalendarIcon size={16} className="text-[#c9a84c]" />
                <h3 className={`font-serif font-bold text-sm ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>Schedule Calendar</h3>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCalendarViewDate(new Date(calYear, calMonth - 1, 1))}
                  className={`p-1 rounded-lg transition-all cursor-pointer ${
                    isLight ? 'text-slate-500 hover:text-slate-900 hover:bg-slate-100' : 'text-slate-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={() => setCalendarViewDate(new Date(calYear, calMonth + 1, 1))}
                  className={`p-1 rounded-lg transition-all cursor-pointer ${
                    isLight ? 'text-slate-500 hover:text-slate-900 hover:bg-slate-100' : 'text-slate-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

            <div className={`text-center font-serif font-bold text-sm tracking-wide mb-3 ${isLight ? 'text-[#9e7f2b]' : 'text-[#c9a84c]'}`}>
              {monthNames[calMonth]} {calYear}
            </div>

            {/* Days Header */}
            <div className={`grid grid-cols-7 gap-1 text-center text-[10px] font-mono font-bold mb-2 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              {daysOfWeek.map(d => (
                <div key={d} className="py-1">{d}</div>
              ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-1 text-center text-xs font-mono">
              {Array.from({ length: firstDayOfCalMonth }).map((_, i) => (
                <div key={`blank-${i}`} className="p-2 opacity-0" />
              ))}

              {Array.from({ length: daysInCalMonth }).map((_, i) => {
                const day = i + 1
                const dateFormatted = `${calYear}-${String(calMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
                const dayDetails = appDateDetails[dateFormatted]
                const count = dayDetails?.count || 0
                const leads = dayDetails?.leads || []
                const tooltipText = leads.length > 0 ? `Viewing Booked\n${leads.join('\n')}` : ''
                const isSelected = selectedCalendarDate === dateFormatted
                const isToday = new Date().toISOString().split('T')[0] === dateFormatted

                const dayButton = (
                  <button
                    key={day}
                    onClick={() => setSelectedCalendarDate(isSelected ? '' : dateFormatted)}
                    className={`w-full p-2 rounded-xl font-bold transition-all relative flex flex-col items-center justify-center cursor-pointer ${
                      isSelected
                        ? 'bg-[#c9a84c] text-slate-950 shadow-md shadow-[#c9a84c]/30 scale-105 font-extrabold'
                        : isToday
                        ? isLight ? 'bg-amber-100 text-amber-900 border border-amber-400 font-bold' : 'bg-amber-500/20 text-[#c9a84c] border border-[#c9a84c]/40 font-bold'
                        : count > 0
                        ? isLight ? 'bg-blue-100 text-blue-900 border border-blue-300 font-extrabold hover:bg-blue-200' : 'bg-blue-500/20 text-blue-300 border border-blue-500/40 font-extrabold hover:bg-blue-500/30'
                        : isLight ? 'hover:bg-slate-100 text-slate-700' : 'hover:bg-white/10 text-slate-300'
                    }`}
                  >
                    <span>{day}</span>
                    {count > 0 && (
                      <span className={`w-1.5 h-1.5 rounded-full absolute bottom-1 ${
                        isSelected ? 'bg-slate-950' : 'bg-[#c9a84c] shadow-[0_0_6px_#c9a84c]'
                      }`} />
                    )}
                  </button>
                )

                return count > 0 ? (
                  <ActionTooltip key={day} text={tooltipText} isLight={isLight}>
                    {dayButton}
                  </ActionTooltip>
                ) : (
                  dayButton
                )
              })}
            </div>

            {/* Calendar Legend */}
            <div className={`mt-5 pt-3 border-t flex items-center justify-around text-[10px] font-mono ${
              isLight ? 'border-slate-200 text-slate-600 font-medium' : 'border-white/10 text-slate-400'
            }`}>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#c9a84c]" />
                <span>Today</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-400" />
                <span>Viewing Scheduled</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* New Booking Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in" onClick={() => setShowNewModal(false)}>
          <div
            onClick={e => e.stopPropagation()}
            className={`relative max-w-lg w-full border rounded-2xl p-6 shadow-2xl font-sans ${
              isLight ? 'bg-white text-slate-900 border-slate-300' : 'bg-[#080d1a] text-slate-100 border-[#c9a84c]/50'
            }`}
          >
            <div className={`flex items-center justify-between border-b pb-4 mb-4 ${isLight ? 'border-slate-200' : 'border-white/10'}`}>
              <div className="flex items-center gap-2">
                <CalendarIcon size={18} className="text-[#c9a84c]" />
                <h3 className={`text-lg font-serif font-bold ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>Schedule VIP Viewing</h3>
              </div>
              <button onClick={() => setShowNewModal(false)} className={`p-1 rounded-lg ${isLight ? 'text-slate-500 hover:text-slate-900' : 'text-slate-400 hover:text-white'}`}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateAppointment} className="space-y-4">
              <div>
                <label className={`text-[10px] uppercase font-bold ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>Customer / Lead Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. James Mwangi"
                  value={newForm.lead_name}
                  onChange={e => setNewForm({ ...newForm, lead_name: e.target.value })}
                  className={`w-full mt-1 rounded-xl px-3.5 py-2.5 text-xs outline-none border transition-all ${
                    isLight ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-[#c9a84c]' : 'bg-slate-950 border-white/10 text-slate-200 focus:border-[#c9a84c]'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`text-[10px] uppercase font-bold ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>Phone Number</label>
                  <input
                    type="tel"
                    placeholder="+254 7XX XXX XXX"
                    value={newForm.phone}
                    onChange={e => setNewForm({ ...newForm, phone: e.target.value })}
                    className={`w-full mt-1 rounded-xl px-3.5 py-2.5 text-xs outline-none border transition-all ${
                      isLight ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-[#c9a84c]' : 'bg-slate-950 border-white/10 text-slate-200 focus:border-[#c9a84c]'
                    }`}
                  />
                </div>
                <div>
                  <label className={`text-[10px] uppercase font-bold ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>Email Address</label>
                  <input
                    type="email"
                    placeholder="client@domain.com"
                    value={newForm.email}
                    onChange={e => setNewForm({ ...newForm, email: e.target.value })}
                    className={`w-full mt-1 rounded-xl px-3.5 py-2.5 text-xs outline-none border transition-all ${
                      isLight ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-[#c9a84c]' : 'bg-slate-950 border-white/10 text-slate-200 focus:border-[#c9a84c]'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className={`text-[10px] uppercase font-bold ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>Vehicle of Interest</label>
                <input
                  type="text"
                  placeholder="e.g. Toyota Land Cruiser Prado TX-L"
                  value={newForm.vehicle_name}
                  onChange={e => setNewForm({ ...newForm, vehicle_name: e.target.value })}
                  className={`w-full mt-1 rounded-xl px-3.5 py-2.5 text-xs outline-none border transition-all ${
                    isLight ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-[#c9a84c]' : 'bg-slate-950 border-white/10 text-slate-200 focus:border-[#c9a84c]'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <ModernDatePicker
                    label="Viewing Date *"
                    value={newForm.appointment_date}
                    onChange={val => setNewForm({ ...newForm, appointment_date: val })}
                    isLight={isLight}
                  />
                </div>
                <div>
                  <label className={`text-[10px] uppercase font-bold ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>Viewing Time</label>
                  <input
                    type="text"
                    placeholder="e.g. 10:00 AM"
                    value={newForm.appointment_time}
                    onChange={e => setNewForm({ ...newForm, appointment_time: e.target.value })}
                    className={`w-full mt-1 rounded-xl px-3.5 py-2.5 text-xs outline-none border transition-all ${
                      isLight ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-[#c9a84c]' : 'bg-slate-950 border-white/10 text-slate-200 focus:border-[#c9a84c]'
                    }`}
                  />
                </div>
              </div>

              <div>
                <PredictiveSelect
                  label="Showroom / Location"
                  options={[
                    { value: 'Nairobi Showroom', label: 'Nairobi HQ Showroom', badge: 'HQ' },
                    { value: 'Mombasa Branch', label: 'Mombasa Coast Branch', badge: 'Coast' },
                    { value: 'Kisumu Branch', label: 'Kisumu Branch', badge: 'Western' },
                    { value: 'Executive Home Delivery', label: 'Executive Home VIP Delivery', badge: 'VIP' }
                  ]}
                  value={newForm.location_type}
                  onChange={val => setNewForm({ ...newForm, location_type: val })}
                  isLight={isLight}
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-[#c9a84c] to-[#e6c76e] text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl hover:opacity-90 transition-all shadow-lg cursor-pointer"
              >
                Confirm Appointment Booking
              </button>
            </form>
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
