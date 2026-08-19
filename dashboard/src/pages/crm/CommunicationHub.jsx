import React, { useState, useMemo } from 'react'
import { useCRMStore } from '../../context/CRMStore'
import {
  MessageSquare, Plus, Phone, Mail, Users as MeetingIcon, Video, Calendar,
  Clock, X, Search, CheckCircle2, AlertTriangle, Eye, Archive, RotateCcw,
  Trash2, User, Building, FileText, CornerDownRight, Edit3, Save
} from 'lucide-react'
import ModernDatePicker from '../../components/common/ModernDatePicker'
import StyledTimePicker from '../../components/common/StyledTimePicker'
import PredictiveSelect from '../../components/common/PredictiveSelect'
import UniversalPagination from '../../components/common/UniversalPagination'
import ActionTooltip from '../../components/common/ActionTooltip'

export default function CommunicationHub() {
  const logs = useCRMStore(state => state.communicationLogs)
  const leads = useCRMStore(state => state.leads)
  const tasks = useCRMStore(state => state.tasks)
  
  const addCommunicationLog = useCRMStore(state => state.addCommunicationLog)
  const updateCommunicationLog = useCRMStore(state => state.updateCommunicationLog)
  const archiveCommunicationLog = useCRMStore(state => state.archiveCommunicationLog)
  const restoreCommunicationLog = useCRMStore(state => state.restoreCommunicationLog)
  const deleteCommunicationLog = useCRMStore(state => state.deleteCommunicationLog)
  
  const adminTheme = useCRMStore(state => state.adminTheme)
  const isLight = adminTheme === 'light'

  const [activeTab, setActiveTab] = useState('active') // 'active' | 'archive'
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDate, setSelectedDate] = useState('2026-08-04')

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedLogModal, setSelectedLogModal] = useState(null)
  const [archiveConfirmTarget, setArchiveConfirmTarget] = useState(null)
  const [deleteConfirmTarget, setDeleteConfirmTarget] = useState(null)

  // Edit Log state
  const [isEditingLog, setIsEditingLog] = useState(false)
  const [editLogForm, setEditLogForm] = useState(null)

  // Add Log form state
  const [logForm, setLogForm] = useState({
    lead_id: 'lead-1',
    type: 'call',
    subject: '',
    content: '',
    log_date: '2026-08-04',
    log_time: '14:00'
  })

  const handleAddLog = (e) => {
    e.preventDefault()
    if (!logForm.subject) return
    const lead = leads.find(l => l.id === logForm.lead_id)
    const combinedLogDate = `${logForm.log_date || '2026-08-04'} ${logForm.log_time || '14:00'}`

    addCommunicationLog({
      ...logForm,
      log_date: combinedLogDate,
      lead_name: lead ? lead.name : 'Prospect Lead'
    })
    setShowAddModal(false)
    setLogForm({
      lead_id: 'lead-1',
      type: 'call',
      subject: '',
      content: '',
      log_date: '2026-08-04',
      log_time: '14:00'
    })
  }

  const handleStartEditLog = (log) => {
    const rawDate = log.log_date || '2026-08-04 14:00'
    const parts = rawDate.split(' ')
    setEditLogForm({
      id: log.id,
      lead_id: log.lead_id || leads[0]?.id || 'lead-1',
      type: log.type || 'call',
      subject: log.subject || '',
      content: log.content || '',
      log_date: parts[0] || '2026-08-04',
      log_time: parts[1] || '14:00'
    })
    setIsEditingLog(true)
  }

  const handleSaveEditLog = (e) => {
    e.preventDefault()
    if (!editLogForm || !editLogForm.subject) return
    const lead = leads.find(l => l.id === editLogForm.lead_id)
    const combinedLogDate = `${editLogForm.log_date || '2026-08-04'} ${editLogForm.log_time || '14:00'}`

    const updatedData = {
      ...editLogForm,
      log_date: combinedLogDate,
      lead_name: lead ? lead.name : 'Prospect Lead'
    }

    updateCommunicationLog(editLogForm.id, updatedData)

    if (selectedLogModal && selectedLogModal.id === editLogForm.id) {
      setSelectedLogModal({ ...selectedLogModal, ...updatedData })
    }

    setIsEditingLog(false)
    setEditLogForm(null)
  }

  // Split into active and archived lists
  const activeLogsList = useMemo(() => logs.filter(l => !l.is_archived), [logs])
  const archiveLogsList = useMemo(() => logs.filter(l => l.is_archived), [logs])

  // Filtered dataset based on search term and active tab
  const displayedList = useMemo(() => {
    const list = activeTab === 'active' ? activeLogsList : archiveLogsList
    const q = searchTerm.toLowerCase().trim()
    if (!q) return list

    return list.filter(l =>
      l.subject.toLowerCase().includes(q) ||
      (l.lead_name && l.lead_name.toLowerCase().includes(q)) ||
      (l.content && l.content.toLowerCase().includes(q)) ||
      (l.type && l.type.toLowerCase().includes(q))
    )
  }, [activeTab, activeLogsList, archiveLogsList, searchTerm])

  // Pagination logic
  const totalPages = Math.ceil(displayedList.length / itemsPerPage) || 1
  const paginatedLogs = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return displayedList.slice(start, start + itemsPerPage)
  }, [displayedList, currentPage, itemsPerPage])

  // Map of date YYYY-MM-DD -> number of scheduled events (tasks + communication logs)
  const eventCountsByDate = useMemo(() => {
    const map = {}

    tasks.forEach(t => {
      if (t.due_date) {
        const dateKey = t.due_date.split(' ')[0].split('T')[0]
        map[dateKey] = (map[dateKey] || 0) + 1
      }
    })

    logs.forEach(l => {
      if (l.log_date) {
        const dateKey = l.log_date.split(' ')[0].split('T')[0]
        map[dateKey] = (map[dateKey] || 0) + 1
      }
    })

    return map
  }, [tasks, logs])

  // Dynamic calculation of scheduled events for selectedDate
  const scheduledEventsForDate = useMemo(() => {
    if (!selectedDate) return []

    // 1. Tasks scheduled on selectedDate
    const matchingTasks = tasks.filter(t => t.due_date && t.due_date.startsWith(selectedDate)).map(t => ({
      id: t.id,
      title: t.subject,
      timeStr: t.due_date.includes(' ') ? t.due_date.split(' ')[1] : '14:00',
      assigned: t.assigned_to || 'Sales Executive',
      badge: t.priority === 'urgent' ? 'URGENT TASK' : 'FOLLOW-UP TASK',
      type: 'task',
      colorClass: t.priority === 'urgent'
        ? (isLight ? 'bg-rose-50 border-rose-200 text-rose-900' : 'bg-rose-500/10 border-rose-500/30 text-rose-300')
        : (isLight ? 'bg-blue-50 border-blue-200 text-blue-900' : 'bg-blue-500/10 border-blue-500/30 text-blue-300')
    }))

    // 2. Interaction logs recorded on selectedDate
    const matchingLogs = logs.filter(l => l.log_date && l.log_date.startsWith(selectedDate)).map(l => ({
      id: l.id,
      title: l.subject,
      timeStr: l.log_date.includes(' ') ? l.log_date.split(' ')[1] : '10:30',
      assigned: l.lead_name || 'Client Contact',
      badge: (l.type || 'interaction').toUpperCase(),
      type: 'log',
      colorClass: isLight ? 'bg-purple-50 border-purple-200 text-purple-900' : 'bg-purple-500/10 border-purple-500/30 text-purple-300'
    }))

    return [...matchingTasks, ...matchingLogs]
  }, [tasks, logs, selectedDate, isLight])

  const getTypeIcon = (type) => {
    switch (type) {
      case 'call': return <Phone size={14} className="text-blue-500" />
      case 'email': return <Mail size={14} className="text-purple-500" />
      case 'meeting': return <MeetingIcon size={14} className="text-[#c9a84c]" />
      case 'demo': return <Video size={14} className="text-emerald-500" />
      default: return <MessageSquare size={14} className="text-slate-500" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] tracking-[4px] uppercase text-[#c9a84c] font-semibold block">Omnichannel Logging</span>
          <h1 className={`text-3xl font-serif font-light mt-1 ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
            Customer Communications Log &amp; Calendar
          </h1>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 bg-[#c9a84c] text-slate-950 font-bold rounded-xl text-xs tracking-wider uppercase hover:bg-[#d9b85c] transition-all flex items-center gap-2 shadow-lg cursor-pointer"
        >
          <Plus size={16} />
          <span>Log Interaction</span>
        </button>
      </div>

      {/* Main Container Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Logs Feed Column (Left 2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Active / Archive View Tabs */}
          <div className={`flex border-b gap-6 ${isLight ? 'border-slate-200' : 'border-white/10'}`}>
            <button
              onClick={() => { setActiveTab('active'); setCurrentPage(1); }}
              className={`pb-3 text-xs tracking-widest uppercase font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
                activeTab === 'active' ? 'border-[#c9a84c] text-[#c9a84c]' : isLight ? 'border-transparent text-slate-600 hover:text-slate-900' : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <MessageSquare size={16} />
              <span>Active Logs ({activeLogsList.length})</span>
            </button>

            <button
              onClick={() => { setActiveTab('archive'); setCurrentPage(1); }}
              className={`pb-3 text-xs tracking-widest uppercase font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
                activeTab === 'archive' ? 'border-[#c9a84c] text-[#c9a84c]' : isLight ? 'border-transparent text-slate-600 hover:text-slate-900' : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Archive size={16} />
              <span>Archived Logs ({archiveLogsList.length})</span>
            </button>
          </div>

          {/* Search Ribbon */}
          <div className={`p-4 rounded-2xl border transition-all duration-300 flex items-center justify-between ${
            isLight ? 'bg-white border-slate-200 shadow-xl' : 'bg-[#0f172a]/80 border-white/10 shadow-2xl'
          }`}>
            <div className="relative w-full">
              <Search size={16} className={`absolute left-3.5 top-3 ${isLight ? 'text-slate-400' : 'text-slate-500'}`} />
              <input
                type="text"
                placeholder="Filter logs by client, type, or subject..."
                value={searchTerm}
                onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                className={`w-full pl-10 pr-8 py-2 border rounded-xl text-xs outline-none font-mono transition-all ${
                  isLight
                    ? 'bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-[#c9a84c]'
                    : 'bg-slate-950/60 border-white/10 text-slate-200 placeholder:text-slate-500 focus:border-[#c9a84c]'
                }`}
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm('')} className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-200">
                  <X size={14} />
                </button>
              )}
            </div>
          </div>

          {/* Logs Feed Cards List */}
          <div className="space-y-3">
            {paginatedLogs.length > 0 ? (
              paginatedLogs.map(log => (
                <div key={log.id} className={`p-4 rounded-2xl border transition-all space-y-3 group ${
                  isLight ? 'bg-white border-slate-200 text-slate-900 shadow-md hover:border-slate-300' : 'bg-[#0f172a]/80 border-white/10 text-slate-100 shadow-2xl hover:border-white/20'
                }`}>
                  {/* Top Section: Icon, Title, Lead & Date Badge */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                      <div className={`p-2.5 rounded-xl border mt-0.5 flex-shrink-0 ${isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-900 border-white/10'}`}>
                        {getTypeIcon(log.type)}
                      </div>

                      <div className="space-y-0.5 min-w-0 flex-1">
                        <h4 className={`text-sm font-serif font-bold truncate ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>{log.subject}</h4>
                        <div className="text-xs text-[#c9a84c] font-bold font-mono truncate">{log.lead_name}</div>
                        <p className={`text-xs pt-0.5 line-clamp-2 ${isLight ? 'text-slate-700 font-medium' : 'text-slate-300'}`}>{log.content}</p>
                      </div>
                    </div>

                    {/* Date Timestamp Badge - Always visible top right */}
                    <span className={`px-2.5 py-1 rounded-xl border text-[11px] sm:text-xs font-mono font-bold flex items-center gap-1.5 flex-shrink-0 shadow-sm transition-all ${
                      isLight
                        ? 'bg-slate-100 border-slate-300 text-slate-900 shadow-slate-200'
                        : 'bg-slate-950/80 border-white/15 text-slate-100 shadow-black/40'
                    }`}>
                      <Clock size={13} className="text-[#c9a84c] flex-shrink-0" />
                      <span>{log.log_date}</span>
                    </span>
                  </div>

                  {/* Bottom Toolbar: Interactive Action Buttons */}
                  <div className={`pt-2.5 border-t flex flex-wrap items-center justify-end gap-2 sm:gap-2.5 font-mono text-xs ${
                    isLight ? 'border-slate-100' : 'border-white/10'
                  }`}>
                    {/* View Button */}
                    <ActionTooltip text="View Log Details" isLight={isLight}>
                      <button
                        onClick={() => {
                          setSelectedLogModal(log)
                          setIsEditingLog(false)
                        }}
                        className={`px-3 py-1.5 rounded-xl border transition-all flex items-center gap-1.5 font-bold whitespace-nowrap cursor-pointer hover:scale-105 shadow-sm ${
                          isLight ? 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100' : 'bg-blue-500/10 border-blue-500/30 text-blue-300 hover:bg-blue-500/20'
                        }`}
                      >
                        <Eye size={14} />
                        <span>View</span>
                      </button>
                    </ActionTooltip>

                    {/* Edit Button */}
                    <ActionTooltip text="Edit Communication Log" isLight={isLight}>
                      <button
                        onClick={() => {
                          setSelectedLogModal(log)
                          handleStartEditLog(log)
                        }}
                        className={`px-3 py-1.5 rounded-xl border transition-all flex items-center gap-1.5 font-bold whitespace-nowrap cursor-pointer hover:scale-105 shadow-sm ${
                          isLight ? 'bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100' : 'bg-purple-500/10 border-purple-500/30 text-purple-300 hover:bg-purple-500/20'
                        }`}
                      >
                        <Edit3 size={14} />
                        <span>Edit</span>
                      </button>
                    </ActionTooltip>

                    {/* Archive / Restore Button */}
                    {log.is_archived ? (
                      <ActionTooltip text="Restore to Active Logs" isLight={isLight}>
                        <button
                          onClick={() => restoreCommunicationLog(log.id)}
                          className={`px-3 py-1.5 rounded-xl border transition-all flex items-center gap-1.5 font-bold whitespace-nowrap cursor-pointer hover:scale-105 shadow-sm ${
                            isLight ? 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20'
                          }`}
                        >
                          <RotateCcw size={14} />
                          <span>Restore</span>
                        </button>
                      </ActionTooltip>
                    ) : (
                      <ActionTooltip text="Archive Communication Log" isLight={isLight}>
                        <button
                          onClick={() => setArchiveConfirmTarget(log)}
                          className={`px-3 py-1.5 rounded-xl border transition-all flex items-center gap-1.5 font-bold whitespace-nowrap cursor-pointer hover:scale-105 shadow-sm ${
                            isLight ? 'bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100' : 'bg-amber-500/10 border-amber-500/30 text-amber-300 hover:bg-amber-500/20'
                          }`}
                        >
                          <Archive size={14} />
                          <span>Archive</span>
                        </button>
                      </ActionTooltip>
                    )}

                    {/* Delete Button */}
                    <ActionTooltip text="Delete Communication Log" isLight={isLight}>
                      <button
                        onClick={() => setDeleteConfirmTarget(log)}
                        className="px-3 py-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-all flex items-center gap-1.5 font-bold whitespace-nowrap cursor-pointer hover:scale-105 shadow-sm"
                      >
                        <Trash2 size={14} />
                        <span>Delete</span>
                      </button>
                    </ActionTooltip>
                  </div>
                </div>
              ))
            ) : (
              <div className={`p-8 rounded-2xl border text-center space-y-3 font-mono ${
                isLight ? 'bg-white border-slate-200 text-slate-600' : 'bg-[#0f172a]/80 border-white/10 text-slate-400'
              }`}>
                <MessageSquare size={28} className="mx-auto text-[#c9a84c]" />
                <p className="text-xs">No communication logs match your current filter query.</p>
              </div>
            )}
          </div>

          {/* Universal Pagination */}
          <UniversalPagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={displayedList.length}
            itemsPerPage={itemsPerPage}
            onPageChange={page => setCurrentPage(page)}
            onItemsPerPageChange={size => { setItemsPerPage(size); setCurrentPage(1); }}
          />

        </div>

        {/* Embedded Mini Calendar Preview (Right 1 col) */}
        <div className={`relative z-20 p-6 rounded-2xl border transition-all duration-300 h-fit space-y-4 ${
          isLight
            ? 'bg-gradient-to-br from-blue-50/40 via-white to-white border-slate-200 shadow-md hover:shadow-xl hover:border-blue-300'
            : 'bg-gradient-to-br from-blue-950/30 via-[#0f172a] to-[#0f172a] border-white/10 shadow-2xl hover:border-blue-500/40'
        }`}>
          <div className={`flex items-center gap-2.5 border-b pb-3 ${isLight ? 'border-slate-200' : 'border-white/10'}`}>
            <div className={`p-2 rounded-xl border ${
              isLight ? 'bg-blue-50 text-blue-600 border-blue-200' : 'bg-blue-500/10 text-blue-400 border-blue-500/30'
            }`}>
              <Calendar size={18} />
            </div>
            <h3 className={`text-lg font-serif font-bold ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>Interaction Calendar</h3>
          </div>

          <div className={`text-xs ${isLight ? 'text-slate-600 font-medium' : 'text-slate-400'}`}>
            Select date to view scheduled reminders:
          </div>

          <ModernDatePicker
            value={selectedDate}
            onChange={val => setSelectedDate(val || '2026-08-04')}
            isLight={isLight}
            eventCounts={eventCountsByDate}
          />

          <div className={`p-4 rounded-xl border space-y-3 text-xs ${
            isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-slate-950/60 border-white/5 text-slate-200'
          }`}>
            <div className={`font-bold flex items-center justify-between ${isLight ? 'text-slate-900' : 'text-slate-300'}`}>
              <span>Scheduled for {selectedDate}:</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#c9a84c]/20 text-[#c9a84c] border border-[#c9a84c]/30 font-mono">
                {scheduledEventsForDate.length} Events
              </span>
            </div>
            
            {scheduledEventsForDate.length > 0 ? (
              scheduledEventsForDate.map(item => (
                <div key={item.id} className={`p-2.5 rounded-lg border font-mono transition-all hover:scale-[1.01] ${item.colorClass}`}>
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-[9px] uppercase font-bold tracking-wider opacity-80">{item.badge}</span>
                    <span className="text-[10px] font-bold">{item.timeStr}</span>
                  </div>
                  <div className="font-bold text-xs">{item.title}</div>
                  <div className={`text-[10px] mt-1 ${isLight ? 'text-slate-600 font-semibold' : 'text-slate-400'}`}>{item.assigned}</div>
                </div>
              ))
            ) : (
              <div className={`p-4 rounded-xl border text-center space-y-2 font-mono ${
                isLight ? 'bg-white border-slate-200 text-slate-600' : 'bg-slate-900/60 border-white/10 text-slate-400'
              }`}>
                <Clock size={20} className="mx-auto text-slate-500" />
                <p className="text-xs">No communications or tasks scheduled for {selectedDate}.</p>
                <button
                  onClick={() => {
                    setLogForm(prev => ({ ...prev, log_date: selectedDate }))
                    setShowAddModal(true)
                  }}
                  className="px-3 py-1.5 bg-[#c9a84c] text-slate-950 font-bold rounded-lg text-[10px] uppercase tracking-wider hover:bg-[#d9b85c] transition-all cursor-pointer inline-flex items-center gap-1 mt-1 shadow-md"
                >
                  <Plus size={12} />
                  <span>Schedule Event</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 1. Log Interaction Note Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[99999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto crm-scroll">
          <div className={`max-w-lg w-full my-auto p-6 rounded-3xl border shadow-2xl relative font-sans transition-all duration-300 ${
            isLight
              ? 'bg-white border-[#c9a84c]/60 text-slate-900 shadow-[0_0_30px_rgba(201,168,76,0.25)]'
              : 'bg-[#0f172a] border-[#c9a84c]/40 text-slate-100 shadow-[0_0_35px_rgba(201,168,76,0.3)]'
          }`}>
            <div className={`flex items-center justify-between border-b pb-4 mb-4 ${isLight ? 'border-slate-200' : 'border-[#c9a84c]/20'}`}>
              <div>
                <span className="text-[9px] uppercase tracking-widest font-mono text-[#c9a84c] font-bold block">Omnichannel Audit</span>
                <h3 className={`text-lg font-serif font-bold ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>Log Interaction Note</h3>
              </div>
              <button onClick={() => setShowAddModal(false)} className={isLight ? 'text-slate-500 hover:text-slate-800' : 'text-slate-400 hover:text-slate-200'}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddLog} className="space-y-4 text-xs font-mono">
              <div>
                <PredictiveSelect
                  label="Associated Lead / Prospect *"
                  options={leads.map(l => ({ value: l.id, label: `${l.name} (${l.company})`, badge: l.status, subtext: l.email }))}
                  value={logForm.lead_id}
                  onChange={val => setLogForm({ ...logForm, lead_id: val })}
                  isLight={isLight}
                  placeholder="Select lead / client..."
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <PredictiveSelect
                    label="Interaction Type"
                    options={[
                      { value: 'call', label: 'Phone Call', badge: 'Audio' },
                      { value: 'email', label: 'Email', badge: 'Message' },
                      { value: 'meeting', label: 'In-Person Meeting', badge: 'Onsite' },
                      { value: 'demo', label: 'Vehicle Demo / Test Drive', badge: 'Showroom' }
                    ]}
                    value={logForm.type}
                    onChange={val => setLogForm({ ...logForm, type: val })}
                    isLight={isLight}
                  />
                </div>
                <div>
                  <label className={`block uppercase tracking-wider mb-1 font-bold ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>
                    Subject Header *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Discovery Call"
                    value={logForm.subject}
                    onChange={e => setLogForm({ ...logForm, subject: e.target.value })}
                    className={`w-full border rounded-xl px-3 py-2 outline-none ${
                      isLight ? 'bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400' : 'bg-slate-950 border-white/10 text-slate-200 placeholder:text-slate-500'
                    }`}
                  />
                </div>
              </div>

              {/* Date & Time Allocation Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`block uppercase tracking-wider mb-1 font-bold ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>
                    Interaction Date *
                  </label>
                  <ModernDatePicker
                    value={logForm.log_date}
                    onChange={val => setLogForm({ ...logForm, log_date: val || '2026-08-04' })}
                    isLight={isLight}
                    eventCounts={eventCountsByDate}
                  />
                </div>
                <div>
                  <label className={`block uppercase tracking-wider mb-1 font-bold ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>
                    Scheduled Time *
                  </label>
                  <StyledTimePicker
                    value={logForm.log_time}
                    onChange={val => setLogForm({ ...logForm, log_time: val })}
                    isLight={isLight}
                    use12Hour={false}
                  />
                </div>
              </div>

              <div>
                <label className={`block uppercase tracking-wider mb-1 font-bold ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>
                  Interaction Content &amp; Notes
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Record summary of discussion..."
                  value={logForm.content}
                  onChange={e => setLogForm({ ...logForm, content: e.target.value })}
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
                  Save Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Communication Detail View / Edit Modal */}
      {selectedLogModal && (
        <div className="fixed inset-0 z-[99999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto crm-scroll animate-fade-in">
          <div className={`max-w-lg w-full rounded-3xl border shadow-2xl p-6 relative font-sans transition-all duration-300 ${
            isLight
              ? 'bg-white border-[#c9a84c]/60 text-slate-900 shadow-[0_0_30px_rgba(201,168,76,0.25)]'
              : 'bg-[#0b101d] border-[#c9a84c]/40 text-slate-100 shadow-[0_0_35px_rgba(201,168,76,0.3)]'
          }`}>
            <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4 mb-4">
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-[#c9a84c]/20 text-[#c9a84c] border border-[#c9a84c]/30 uppercase">
                    {selectedLogModal.type || 'Interaction'}
                  </span>
                  <span className={`px-2 py-0.5 rounded-md text-xs font-mono font-bold flex items-center gap-1 border ${
                    isLight
                      ? 'bg-slate-100 border-slate-300 text-slate-900'
                      : 'bg-slate-900 border-white/15 text-slate-200'
                  }`}>
                    <Clock size={12} className="text-[#c9a84c]" />
                    <span>{selectedLogModal.log_date}</span>
                  </span>
                </div>
                <h3 className={`text-xl font-serif font-bold ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                  {isEditingLog ? 'Edit Communication Log' : selectedLogModal.subject}
                </h3>
              </div>

              <button
                onClick={() => {
                  setSelectedLogModal(null)
                  setIsEditingLog(false)
                  setEditLogForm(null)
                }}
                className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-slate-200"
              >
                <X size={18} />
              </button>
            </div>

            {isEditingLog && editLogForm ? (
              <form onSubmit={handleSaveEditLog} className="space-y-4 text-xs font-mono">
                <div>
                  <PredictiveSelect
                    label="Associated Lead / Prospect *"
                    options={leads.map(l => ({ value: l.id, label: `${l.name} (${l.company})`, badge: l.status, subtext: l.email }))}
                    value={editLogForm.lead_id}
                    onChange={val => setEditLogForm({ ...editLogForm, lead_id: val })}
                    isLight={isLight}
                    placeholder="Select lead / client..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <PredictiveSelect
                      label="Interaction Type"
                      options={[
                        { value: 'call', label: 'Phone Call', badge: 'Audio' },
                        { value: 'email', label: 'Email', badge: 'Message' },
                        { value: 'meeting', label: 'In-Person Meeting', badge: 'Onsite' },
                        { value: 'demo', label: 'Vehicle Demo / Test Drive', badge: 'Showroom' }
                      ]}
                      value={editLogForm.type}
                      onChange={val => setEditLogForm({ ...editLogForm, type: val })}
                      isLight={isLight}
                    />
                  </div>
                  <div>
                    <label className={`block uppercase tracking-wider mb-1 font-bold ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>
                      Subject Header *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Discovery Call"
                      value={editLogForm.subject}
                      onChange={e => setEditLogForm({ ...editLogForm, subject: e.target.value })}
                      className={`w-full border rounded-xl px-3 py-2 outline-none ${
                        isLight ? 'bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400' : 'bg-slate-950 border-white/10 text-slate-200 placeholder:text-slate-500'
                      }`}
                    />
                  </div>
                </div>

                {/* Date & Time Allocation Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={`block uppercase tracking-wider mb-1 font-bold ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>
                      Interaction Date *
                    </label>
                    <ModernDatePicker
                      value={editLogForm.log_date}
                      onChange={val => setEditLogForm({ ...editLogForm, log_date: val || '2026-08-04' })}
                      isLight={isLight}
                      eventCounts={eventCountsByDate}
                    />
                  </div>
                  <div>
                    <label className={`block uppercase tracking-wider mb-1 font-bold ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>
                      Scheduled Time *
                    </label>
                    <StyledTimePicker
                      value={editLogForm.log_time}
                      onChange={val => setEditLogForm({ ...editLogForm, log_time: val })}
                      isLight={isLight}
                      use12Hour={false}
                    />
                  </div>
                </div>

                <div>
                  <label className={`block uppercase tracking-wider mb-1 font-bold ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>
                    Conversation Description &amp; Notes
                  </label>
                  <textarea
                    rows={5}
                    required
                    placeholder="Edit summary of discussion, key details..."
                    value={editLogForm.content}
                    onChange={e => setEditLogForm({ ...editLogForm, content: e.target.value })}
                    className={`w-full border rounded-xl px-3 py-2 outline-none font-sans text-xs leading-relaxed ${
                      isLight ? 'bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400' : 'bg-slate-950 border-white/10 text-slate-200 placeholder:text-slate-500'
                    }`}
                  />
                </div>

                <div className="pt-4 flex justify-end gap-3 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditingLog(false)
                      setEditLogForm(null)
                    }}
                    className={`px-4 py-2 rounded-xl border text-xs font-bold uppercase ${
                      isLight ? 'border-slate-300 text-slate-700 hover:bg-slate-100' : 'border-slate-700 text-slate-400 hover:bg-white/5'
                    }`}
                  >
                    Cancel Edit
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#c9a84c] text-slate-950 font-bold rounded-xl text-xs uppercase hover:bg-[#d9b85c] shadow-lg cursor-pointer flex items-center gap-1.5"
                  >
                    <Save size={14} />
                    <span>Save Changes</span>
                  </button>
                </div>
              </form>
            ) : (
              <>
                <div className="space-y-4 font-mono text-xs">
                  {/* Lead Info Box */}
                  <div className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 ${
                    isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/60 border-white/10'
                  }`}>
                    <div>
                      <span className="text-[9px] uppercase text-slate-400 font-bold block">Associated Client / Prospect</span>
                      <span className="text-xs font-bold text-[#c9a84c]">{selectedLogModal.lead_name}</span>
                    </div>
                    <div className={`p-2 rounded-lg border ${isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-white/10'}`}>
                      {getTypeIcon(selectedLogModal.type)}
                    </div>
                  </div>

                  {/* Multi-line Notes Box */}
                  <div className={`p-4 rounded-xl border space-y-1.5 ${
                    isLight ? 'bg-slate-50 border-slate-200 text-slate-800' : 'bg-slate-950/60 border-white/10 text-slate-200'
                  }`}>
                    <span className="text-[9px] uppercase text-[#c9a84c] font-bold block">Interaction Summary &amp; Notes</span>
                    <p className="text-xs leading-relaxed whitespace-pre-line font-sans">
                      {selectedLogModal.content}
                    </p>
                  </div>
                </div>

                <div className="pt-4 mt-5 border-t border-white/10 flex items-center justify-between gap-3 font-mono text-xs">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleStartEditLog(selectedLogModal)}
                      className={`px-3.5 py-2 rounded-xl border transition-all flex items-center gap-1.5 text-xs font-bold uppercase cursor-pointer ${
                        isLight ? 'bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100' : 'bg-purple-500/10 border-purple-500/30 text-purple-300 hover:bg-purple-500/20'
                      }`}
                    >
                      <Edit3 size={14} />
                      <span>Edit Log</span>
                    </button>

                    {selectedLogModal.is_archived ? (
                      <button
                        onClick={() => {
                          restoreCommunicationLog(selectedLogModal.id)
                          setSelectedLogModal(null)
                        }}
                        className="px-3.5 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20 text-xs font-bold uppercase transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <RotateCcw size={14} />
                        <span>Restore Log</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setArchiveConfirmTarget(selectedLogModal)
                        }}
                        className="px-3.5 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 text-xs font-bold uppercase transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <Archive size={14} />
                        <span>Archive Log</span>
                      </button>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      setSelectedLogModal(null)
                      setIsEditingLog(false)
                      setEditLogForm(null)
                    }}
                    className="px-4 py-2 rounded-xl bg-[#c9a84c] text-slate-950 font-bold text-xs uppercase hover:bg-[#d9b85c] cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* 3. Archive Confirmation Dialog Modal */}
      {archiveConfirmTarget && (
        <div className="fixed inset-0 z-[999999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className={`max-w-md w-full rounded-2xl border shadow-2xl p-6 relative font-sans ${
            isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#0f172a] border-white/15 text-slate-100'
          }`}>
            <div className="flex items-center gap-3 text-amber-400 mb-3">
              <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30">
                <Archive size={20} />
              </div>
              <h3 className="text-base font-bold font-mono uppercase">Confirm Move to Archive</h3>
            </div>

            <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
              Are you sure you want to move the communication log <strong>"{archiveConfirmTarget.subject}"</strong> to the Archived Logs safe zone? You can restore it to Active Logs anytime.
            </p>

            <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-end gap-3 font-mono text-xs">
              <button
                onClick={() => setArchiveConfirmTarget(null)}
                className={`px-4 py-2 rounded-xl border font-bold uppercase ${
                  isLight ? 'border-slate-300 text-slate-700 hover:bg-slate-100' : 'border-slate-700 text-slate-400 hover:bg-white/5'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  archiveCommunicationLog(archiveConfirmTarget.id)
                  setArchiveConfirmTarget(null)
                }}
                className="px-4 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl uppercase hover:bg-amber-400 transition-all shadow-lg cursor-pointer"
              >
                Confirm Archive
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Delete Confirmation Dialog Modal */}
      {deleteConfirmTarget && (
        <div className="fixed inset-0 z-[99999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className={`max-w-md w-full rounded-2xl border shadow-2xl p-6 relative font-sans ${
            isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#0f172a] border-white/15 text-slate-100'
          }`}>
            <div className="flex items-center gap-3 text-rose-500 mb-3">
              <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30">
                <AlertTriangle size={20} />
              </div>
              <h3 className="text-base font-bold font-mono uppercase">Confirm Permanent Deletion</h3>
            </div>

            <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
              Are you sure you want to permanently delete the log <strong>"{deleteConfirmTarget.subject}"</strong>? This action cannot be undone.
            </p>

            <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-end gap-3 font-mono text-xs">
              <button
                onClick={() => setDeleteConfirmTarget(null)}
                className={`px-4 py-2 rounded-xl border font-bold uppercase ${
                  isLight ? 'border-slate-300 text-slate-700 hover:bg-slate-100' : 'border-slate-700 text-slate-400 hover:bg-white/5'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteCommunicationLog(deleteConfirmTarget.id)
                  setDeleteConfirmTarget(null)
                }}
                className="px-4 py-2 bg-rose-600 text-white font-bold rounded-xl uppercase hover:bg-rose-500 transition-all shadow-lg cursor-pointer"
              >
                Delete Log
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
