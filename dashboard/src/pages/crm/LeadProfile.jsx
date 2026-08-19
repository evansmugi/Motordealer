import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useCRMStore } from '../../context/CRMStore'
import ActionTooltip from '../../components/common/ActionTooltip'
import PredictiveSelect from '../../components/common/PredictiveSelect'
import TaskDetailModal from '../../components/common/TaskDetailModal'
import ModernDatePicker from '../../components/common/ModernDatePicker'
import StyledTimePicker from '../../components/common/StyledTimePicker'
import {
  Users, ArrowLeft, Mail, Phone, Building, Calendar, Sparkles, UserCheck,
  Archive, RotateCcw, PenLine, MessageSquare, ShieldCheck, Zap, TrendingUp,
  Activity, Clock, ChevronRight, CheckCircle2, AlertCircle, FileText, Plus,
  Globe, Smartphone, Laptop, MapPin, Eye, Play, DollarSign, Tag, Check, X,
  ExternalLink, Layers, Award, BarChart3, HelpCircle, CheckSquare, Lock, Unlock, Save, Edit3,
  AlertTriangle, Trash2, CornerDownRight
} from 'lucide-react'

export default function LeadProfile() {
  const { id } = useParams()
  const navigate = useNavigate()

  const leads = useCRMStore(state => state.leads) || []
  const opportunities = useCRMStore(state => state.opportunities) || []
  const tasks = useCRMStore(state => state.tasks) || []
  const rawCommunications = useCRMStore(state => state.communications)
  const communications = rawCommunications || []
  const campaigns = useCRMStore(state => state.campaigns) || []
  const sources = useCRMStore(state => state.leadSources) || []
  const adminTheme = useCRMStore(state => state.adminTheme)
  const isLight = adminTheme === 'light'

  const appointments = useCRMStore(state => state.appointments) || []
  const vehicleInventory = useCRMStore(state => state.vehicleInventory) || []
  const addAppointment = useCRMStore(state => state.addAppointment)
  const updateAppointmentStatus = useCRMStore(state => state.updateAppointmentStatus)

  const updateLead = useCRMStore(state => state.updateLead)
  const recalculateLeadScore = useCRMStore(state => state.recalculateLeadScore)
  const toggleLeadCriterion = useCRMStore(state => state.toggleLeadCriterion)
  const convertLeadToCustomer = useCRMStore(state => state.convertLeadToCustomer)
  const archiveLead = useCRMStore(state => state.archiveLead)
  const restoreLead = useCRMStore(state => state.restoreLead)
  const updateOpportunityStage = useCRMStore(state => state.updateOpportunityStage)
  const addOpportunity = useCRMStore(state => state.addOpportunity)
  const addTask = useCRMStore(state => state.addTask)
  const addSubTask = useCRMStore(state => state.addSubTask)
  const toggleSubTask = useCRMStore(state => state.toggleSubTask)
  const completeTask = useCRMStore(state => state.completeTask)
  const deleteTask = useCRMStore(state => state.deleteTask)

  // Modals and local state
  const [activeTab, setActiveTab] = useState('overview') // 'overview' | 'telemetry' | 'opportunities' | 'timeline' | 'tasks'
  const [showEditModal, setShowEditModal] = useState(false)
  const [showConvertModal, setShowConvertModal] = useState(false)
  const [showScoreBreakdown, setShowScoreBreakdown] = useState(false)
  const [showScoreModal, setShowScoreModal] = useState(false)

  // Edit Lead State
  const [editForm, setEditForm] = useState(null)

  // Convert Form State
  const [convertForm, setConvertForm] = useState({ budget: 15000000, company: '', notes: '' })

  // Activity Log State
  const [newLogType, setNewLogType] = useState('phone_call')
  const [newLogNote, setNewLogNote] = useState('')
  const [customLogs, setCustomLogs] = useState([])

  // Task Management & Modal States
  const [selectedTaskForModal, setSelectedTaskForModal] = useState(null)
  const [showCreateTaskModal, setShowCreateTaskModal] = useState(false)
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [inlineSubtaskText, setInlineSubtaskText] = useState({})
  const [newTaskForm, setNewTaskForm] = useState({
    subject: '',
    description: '',
    due_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().replace('T', ' ').substring(0, 16),
    priority: 'high',
    category: 'call',
    assigned_to: 'Alex Kimani',
    financial_weight: 0
  })

  // Appointment Modal State
  const [showAppointmentModal, setShowAppointmentModal] = useState(false)
  const [appointmentForm, setAppointmentForm] = useState({
    vehicle_name: 'Toyota Land Cruiser V8 ZX (2024)',
    appointment_date: '2026-08-10',
    appointment_time: '10:00 AM',
    location_type: 'Showroom VIP Lounge',
    notes: ''
  })

  // Locked Rich Notes State
  const [isNotesEditing, setIsNotesEditing] = useState(false)
  const [notesContent, setNotesContent] = useState('')
  const [isNotesSaving, setIsNotesSaving] = useState(false)
  const [notesSaveSuccess, setNotesSaveSuccess] = useState(false)
  const [showQuickAppend, setShowQuickAppend] = useState(false)
  const [quickAppendText, setQuickAppendText] = useState('')

  const lead = leads.find(l => l.id === id)
  const leadName = lead?.name

  // Update Page Title
  useEffect(() => {
    if (leadName) {
      document.title = `${leadName} | Lead Profile | KnK Automotive CRM`
    }
  }, [leadName])

  // Synchronize notesContent when lead loads
  useEffect(() => {
    if (lead?.notes !== undefined) {
      setNotesContent(lead.notes || '')
    }
  }, [lead?.notes])

  if (!lead) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center space-y-4 font-sans">
        <div className="p-4 rounded-full bg-amber-500/10 text-[#c9a84c] border border-[#c9a84c]/30">
          <Users size={36} />
        </div>
        <h2 className={`text-2xl font-serif font-bold ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
          Lead Profile Not Found
        </h2>
        <p className={`text-sm max-w-md ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
          The lead record you are attempting to view (ID: <span className="font-mono text-[#c9a84c]">{id}</span>) does not exist or has been removed from the directory.
        </p>
        <Link
          to="/crm/leads"
          className="mt-4 px-5 py-2.5 bg-[#c9a84c] text-slate-950 font-bold rounded-xl text-xs tracking-wider uppercase hover:bg-[#d9b85c] transition-all flex items-center gap-2 shadow-lg"
        >
          <ArrowLeft size={16} />
          <span>Back to Lead Directory</span>
        </Link>
      </div>
    )
  }

  // Linked Opportunity
  const linkedOpp = opportunities.find(o => o.lead_id === lead.id)

  // Linked Tasks (Bidirectional real-time sync with central Tasks & Reminders Hub)
  const linkedTasks = tasks.filter(t => 
    t.lead_id === lead.id ||
    t.taskable_id === lead.id ||
    (linkedOpp && t.taskable_id === linkedOpp.id) ||
    (t.subject && t.subject.toLowerCase().includes(lead.name.toLowerCase())) ||
    (t.title && t.title.toLowerCase().includes(lead.name.toLowerCase()))
  )

  // Pipeline Stage Mapping
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

  // Dynamic Stage Change Handler for any Lead
  const handleStageChange = (newStage) => {
    if (linkedOpp) {
      updateOpportunityStage(linkedOpp.id, newStage)
    } else {
      const newOpp = {
        id: `opp-auto-${lead.id}`,
        lead_id: lead.id,
        name: `${lead.company && lead.company !== '—' ? lead.company : lead.name} Pursuit`,
        expected_value: 15000000,
        close_date: '2026-09-30',
        probability: lead.intent_score || lead.conversion_probability || 50,
        stage: newStage,
        created_at: lead.created_at || '2026-08-05',
        updated_at: new Date().toISOString().split('T')[0]
      }
      addOpportunity(newOpp)
    }

    const correspondingLeadStatus = newStage === 'new_lead' ? 'new'
      : newStage === 'onboarding' ? 'contacted'
      : newStage === 'qualified' ? 'qualified'
      : newStage === 'viewing' ? 'qualified'
      : newStage === 'deposit' ? 'qualified'
      : newStage === 'won' ? 'won'
      : newStage === 'lost' ? 'archived'
      : 'qualified'

    updateLead(lead.id, { status: correspondingLeadStatus })
  }

  // Linked Appointments & Vehicles
  const leadAppointments = appointments.filter(a => a.lead_id === lead?.id || a.email === lead?.email)
  const latestAppointment = leadAppointments[0]
  const targetVehicleName = latestAppointment?.vehicle_name || linkedOpp?.vehicle_name || 'Toyota Land Cruiser V8 ZX (2024)'
  const targetVehicleObj = vehicleInventory.find(v => v.name.toLowerCase().includes(targetVehicleName.toLowerCase()) || targetVehicleName.toLowerCase().includes(v.name.toLowerCase())) || vehicleInventory[0]



  const handleSaveNotes = async (customContent) => {
    const textToSave = customContent !== undefined ? customContent : notesContent
    setIsNotesSaving(true)
    try {
      await updateLead(lead.id, { notes: textToSave })
      setNotesSaveSuccess(true)
      setIsNotesEditing(false)
      setShowQuickAppend(false)
      setQuickAppendText('')
      setTimeout(() => setNotesSaveSuccess(false), 3000)
    } catch (err) {
      console.error('Error saving lead notes:', err)
    } finally {
      setIsNotesSaving(false)
    }
  }

  const handleQuickAppend = () => {
    if (!quickAppendText.trim()) return
    const timeStamp = new Date().toLocaleDateString('en-KE', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    const appended = `${notesContent ? notesContent + '\n\n' : ''}[${timeStamp} - Quick Note]: ${quickAppendText.trim()}`
    setNotesContent(appended)
    handleSaveNotes(appended)
  }

  const insertTag = (tagText) => {
    setNotesContent(prev => `${prev ? prev + ' ' : ''}${tagText}`)
  }

  const handleRunScoreCalculation = () => {
    recalculateLeadScore(lead.id)
    setShowScoreModal(true)
  }

  const handleAppointmentSubmit = (e) => {
    e.preventDefault()
    addAppointment({
      lead_id: lead.id,
      lead_name: lead.name,
      phone: lead.phone,
      email: lead.email,
      vehicle_name: appointmentForm.vehicle_name,
      appointment_date: appointmentForm.appointment_date,
      appointment_time: appointmentForm.appointment_time,
      location_type: appointmentForm.location_type,
      notes: appointmentForm.notes,
      status: 'scheduled'
    })
    setShowAppointmentModal(false)
  }

  const currentStageKey = linkedOpp
    ? (linkedOpp.stage === 'proposal' ? 'viewing' : linkedOpp.stage === 'qualification' ? 'qualified' : linkedOpp.stage === 'negotiation' ? 'deposit' : (linkedOpp.stage || 'new_lead'))
    : (lead.status === 'won' || lead.status === 'converted' ? 'won' : lead.status === 'qualified' ? 'qualified' : lead.status === 'contacted' ? 'onboarding' : 'new_lead')

  const stageColors = STAGE_COLORS[currentStageKey] || STAGE_COLORS.new_lead
  const stageTitle = STAGE_LABELS[currentStageKey] || 'New Lead'

  // Intent score calculation details
  const prob = lead.intent_score || lead.conversion_probability || 50
  const metrics = lead.behavioral_metrics || {}

  // Initials for avatar
  const initials = lead.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()

  // Handlers
  const handleOpenEdit = () => {
    setEditForm({ ...lead })
    setShowEditModal(true)
  }

  const handleSaveEdit = (e) => {
    e.preventDefault()
    if (!editForm) return
    updateLead(lead.id, editForm)
    setShowEditModal(false)
  }

  const handleConvertSubmit = (e) => {
    e.preventDefault()
    convertLeadToCustomer(lead.id, convertForm)
    setShowConvertModal(false)
  }

  const handleAddLog = (e) => {
    e.preventDefault()
    if (!newLogNote.trim()) return
    const newEntry = {
      id: `log-${Date.now()}`,
      type: newLogType,
      note: newLogNote,
      created_at: new Date().toLocaleString(),
      author: 'You (Sales Rep)'
    }
    setCustomLogs([newEntry, ...customLogs])
    setNewLogNote('')
  }

  const handleAddQuickTask = (e) => {
    e.preventDefault()
    if (!newTaskTitle.trim()) return
    const taskSubject = `[${lead.name}] ${newTaskTitle}`
    addTask({
      id: `task-${Date.now()}`,
      subject: taskSubject,
      title: taskSubject,
      description: `Task created for ${lead.name}`,
      lead_id: lead.id,
      taskable_id: lead.id,
      taskable_type: 'Lead',
      priority: 'high',
      status: 'pending',
      category: 'call',
      due_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().replace('T', ' ').substring(0, 16),
      assigned_to: lead.assigned_to || 'Alex Kimani',
      financial_weight: linkedOpp ? linkedOpp.expected_value : 0,
      children: [{ id: `sub-${Date.now()}`, parent_id: `task-${Date.now()}`, subject: 'Initial prospect check', status: 'pending', completed: false }]
    })
    setNewTaskTitle('')
  }

  const handleAddFullTask = (e) => {
    e.preventDefault()
    if (!newTaskForm.subject.trim()) return
    const newTask = {
      id: `task-${Date.now()}`,
      subject: newTaskForm.subject.startsWith('[') ? newTaskForm.subject : `[${lead.name}] ${newTaskForm.subject}`,
      title: newTaskForm.subject,
      description: newTaskForm.description || `Follow-up action item created for ${lead.name}`,
      due_date: newTaskForm.due_date || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().replace('T', ' ').substring(0, 16),
      priority: newTaskForm.priority || 'high',
      category: newTaskForm.category || 'call',
      status: 'pending',
      assigned_to: newTaskForm.assigned_to || lead.assigned_to || 'Alex Kimani',
      creator_id: 'admin',
      financial_weight: Number(newTaskForm.financial_weight) || (linkedOpp ? linkedOpp.expected_value : 0),
      lead_id: lead.id,
      taskable_type: linkedOpp ? 'Opportunity' : 'Lead',
      taskable_id: linkedOpp ? linkedOpp.id : lead.id,
      reminders: [{ id: `rem-${Date.now()}`, value: 15, unit: 'minutes', is_acknowledged: false }],
      children: [
        { id: `sub-1-${Date.now()}`, parent_id: `task-${Date.now()}`, subject: 'Initial prospect check', status: 'pending', completed: false }
      ],
      created_at: new Date().toISOString().split('T')[0]
    }

    addTask(newTask)
    setShowCreateTaskModal(false)
    setNewTaskForm({
      subject: '',
      description: '',
      due_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().replace('T', ' ').substring(0, 16),
      priority: 'high',
      category: 'call',
      assigned_to: lead.assigned_to || 'Alex Kimani',
      financial_weight: linkedOpp ? linkedOpp.expected_value : 0
    })
  }

  const handleAddInlineSubtask = (taskId) => {
    const text = inlineSubtaskText[taskId]
    if (!text || !text.trim()) return
    addSubTask(taskId, text.trim())
    setInlineSubtaskText(prev => ({ ...prev, [taskId]: '' }))
  }

  const getTaskDeadlineBadge = (dueDateStr, status) => {
    if (status === 'completed') {
      return { label: 'COMPLETED', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' }
    }
    if (!dueDateStr) {
      return { label: 'NO DEADLINE', color: 'bg-slate-500/20 text-slate-400 border-slate-500/40' }
    }
    const now = new Date()
    const due = new Date(dueDateStr.replace(' ', 'T'))
    const diffHours = (due - now) / (1000 * 60 * 60)
    if (diffHours < 0) {
      return { label: 'OVERDUE', color: 'bg-rose-500/20 text-rose-400 border-rose-500/50 animate-pulse font-bold' }
    } else if (diffHours <= 24) {
      return { label: 'ALMOST OVERDUE', color: 'bg-amber-500/20 text-amber-400 border-amber-500/40 font-bold' }
    }
    return { label: 'ON TRACK', color: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30' }
  }

  return (
    <div className="space-y-6 font-sans">
      {/* Top Breadcrumbs & Back Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs font-mono">
          <Link to="/crm/leads" className={`hover:text-[#c9a84c] flex items-center gap-1 transition-colors ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
            <ArrowLeft size={14} />
            <span>Leads Directory</span>
          </Link>
          <span className="text-slate-500">/</span>
          <span className="text-[#c9a84c] font-bold">Profile: {lead.name}</span>
        </div>

        <div className="flex items-center gap-2">
          <ActionTooltip text="Recalculate Intent Score Telemetry" isLight={isLight}>
            <button
              onClick={() => recalculateLeadScore(lead.id)}
              className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                isLight ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100' : 'bg-slate-900 border-white/10 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <RotateCcw size={14} />
              <span>Recalculate Score</span>
            </button>
          </ActionTooltip>

          <button
            onClick={handleOpenEdit}
            className={`px-3.5 py-1.5 rounded-xl border text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              isLight ? 'bg-amber-50 border-amber-300 text-amber-900 hover:bg-amber-100' : 'bg-amber-500/10 border-amber-500/30 text-[#c9a84c] hover:bg-amber-500/20'
            }`}
          >
            <PenLine size={14} />
            <span>Edit Profile</span>
          </button>

          {lead.status !== 'converted' && lead.status !== 'won' && (
            <button
              onClick={() => { setConvertForm({ budget: linkedOpp?.expected_value || 15000000, company: lead.company, notes: '' }); setShowConvertModal(true); }}
              className="px-4 py-1.5 bg-[#c9a84c] text-slate-950 font-bold rounded-xl text-xs uppercase tracking-wider hover:bg-[#d9b85c] transition-all flex items-center gap-1.5 shadow-md cursor-pointer"
            >
              <UserCheck size={14} />
              <span>Convert to Customer</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Profile Header Banner */}
      <div className={`p-6 md:p-8 rounded-3xl border relative overflow-hidden transition-all duration-300 ${
        isLight
          ? 'bg-white border-slate-200 shadow-xl'
          : 'bg-gradient-to-br from-[#0f172a] via-[#111c35] to-[#0b1021] border-white/10 shadow-2xl'
      }`}>
        {/* Subtle Ambient Gold Glow Background */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#c9a84c]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start md:items-center gap-5">
            {/* Avatar Pill */}
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-[#c9a84c] via-[#e6c76e] to-[#b8973b] text-slate-950 flex items-center justify-center font-serif text-2xl md:text-3xl font-bold shadow-lg shadow-[#c9a84c]/20 flex-shrink-0">
              {initials}
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className={`text-2xl md:text-3xl font-serif font-bold ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                  {lead.name}
                </h1>
                
                {/* Pipeline Stage Badge */}
                <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold border ${isLight ? stageColors.light : stageColors.dark}`}>
                  {stageTitle}
                </span>

                {/* Status Pill */}
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase font-mono font-bold tracking-wider border ${
                  lead.status === 'converted' || lead.status === 'won'
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                    : lead.status === 'qualified'
                    ? 'bg-purple-500/20 text-purple-400 border-purple-500/40'
                    : lead.status === 'contacted'
                    ? 'bg-blue-500/20 text-blue-400 border-blue-500/40'
                    : lead.status === 'archived'
                    ? 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                    : 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                }`}>
                  Status: {lead.status}
                </span>
              </div>

              <div className={`flex flex-wrap items-center gap-4 text-xs font-mono ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                {lead.company && (
                  <span className="flex items-center gap-1.5">
                    <Building size={14} className="text-[#c9a84c]" />
                    <span className="font-semibold">{lead.company}</span>
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <UserCheck size={14} className="text-slate-500" />
                  <span>Rep: <strong className={isLight ? 'text-slate-900' : 'text-slate-200'}>{lead.assigned_to || 'Alex Kimani'}</strong></span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar size={14} className="text-slate-500" />
                  <span>Added {lead.created_at}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Quick Contact Action Bar */}
          <div className="flex flex-wrap items-center gap-2 self-stretch md:self-auto justify-end">
            {lead.phone && (
              <ActionTooltip text="Chat on WhatsApp" isLight={isLight}>
                <a
                  href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 transition-all cursor-pointer flex items-center gap-2 text-xs font-mono font-bold"
                >
                  <MessageSquare size={16} />
                  <span className="hidden sm:inline">WhatsApp</span>
                </a>
              </ActionTooltip>
            )}

            {lead.phone && (
              <ActionTooltip text="Call Client" isLight={isLight}>
                <a
                  href={`tel:${lead.phone}`}
                  className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 hover:bg-blue-500/20 transition-all cursor-pointer flex items-center gap-2 text-xs font-mono font-bold"
                >
                  <Phone size={16} />
                  <span className="hidden sm:inline">Call</span>
                </a>
              </ActionTooltip>
            )}

            {lead.email && (
              <ActionTooltip text="Send Email" isLight={isLight}>
                <a
                  href={`mailto:${lead.email}`}
                  className="p-2.5 rounded-xl bg-[#c9a84c]/10 border border-[#c9a84c]/30 text-[#c9a84c] hover:bg-[#c9a84c]/20 transition-all cursor-pointer flex items-center gap-2 text-xs font-mono font-bold"
                >
                  <Mail size={16} />
                  <span className="hidden sm:inline">Email</span>
                </a>
              </ActionTooltip>
            )}

            {lead.status === 'archived' ? (
              <button
                onClick={() => restoreLead(lead.id)}
                className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 hover:bg-blue-500/20 transition-all cursor-pointer text-xs font-mono font-bold flex items-center gap-1.5"
              >
                <RotateCcw size={16} />
                <span>Restore Lead</span>
              </button>
            ) : (
              <button
                onClick={() => archiveLead(lead.id)}
                className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500/20 transition-all cursor-pointer text-xs font-mono font-bold flex items-center gap-1.5"
              >
                <Archive size={16} />
                <span className="hidden sm:inline">Archive</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Top Telemetry Metric Cards (4 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 font-mono">
        {/* Card 1: Intent Score */}
        <div
          onClick={() => setShowScoreBreakdown(true)}
          className={`p-5 rounded-2xl border transition-all duration-300 cursor-pointer group hover:-translate-y-1 ${
            isLight ? 'bg-white border-slate-200 shadow-md hover:shadow-xl' : 'bg-[#0f172a]/80 border-white/10 shadow-xl hover:border-[#c9a84c]/40'
          }`}
        >
          <div className="flex items-start justify-between">
            <div>
              <span className={`text-[10px] tracking-[2px] uppercase font-bold block ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                Lead Score Telemetry
              </span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className={`text-3xl font-bold font-serif ${prob >= 75 ? 'text-emerald-500' : prob >= 45 ? 'text-amber-500' : 'text-slate-400'}`}>
                  {prob}%
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                  prob >= 75 ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' : prob >= 45 ? 'bg-amber-500/20 text-amber-400 border-amber-500/40' : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}>
                  {lead.intent_tier || (prob >= 75 ? 'HIGH' : prob >= 45 ? 'MEDIUM' : 'LOW')}
                </span>
              </div>
            </div>
            <div className={`p-3 rounded-xl border transition-transform group-hover:scale-110 ${
              prob >= 75 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-amber-500/10 text-[#c9a84c] border-amber-500/30'
            }`}>
              <Sparkles size={20} className={prob >= 75 ? 'animate-pulse' : ''} />
            </div>
          </div>
          {/* Progress Bar */}
          <div className="mt-4 space-y-1">
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div className={`h-full rounded-full transition-all duration-500 ${
                prob >= 75 ? 'bg-gradient-to-r from-emerald-500 to-teal-300' : prob >= 45 ? 'bg-gradient-to-r from-amber-500 to-yellow-300' : 'bg-slate-600'
              }`} style={{ width: `${prob}%` }} />
            </div>
            <div className="flex justify-between text-[9px] text-slate-500 font-bold">
              <span>View Breakdown &gt;</span>
              <span>Updated Live</span>
            </div>
          </div>
        </div>

        {/* Card 2: Buying Timeline & Budget */}
        <div className={`p-5 rounded-2xl border transition-all duration-300 ${
          isLight ? 'bg-white border-slate-200 shadow-md' : 'bg-[#0f172a]/80 border-white/10 shadow-xl'
        }`}>
          <div className="flex items-start justify-between">
            <div>
              <span className={`text-[10px] tracking-[2px] uppercase font-bold block ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                Buying Timeline &amp; Budget
              </span>
              <h3 className={`text-2xl font-bold mt-2 font-serif ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                {lead.buying_timeline || '1-3 months'}
              </h3>
            </div>
            <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/30">
              <Clock size={20} />
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] pt-2 border-t border-white/10">
            <span className={isLight ? 'text-slate-500' : 'text-slate-400'}>Est. Deal Value:</span>
            <span className="text-[#c9a84c] font-bold">
              KES {((linkedOpp?.expected_value || 15000000) / 1000000).toFixed(1)}M
            </span>
          </div>
        </div>

        {/* Card 3: Source & Campaign */}
        <div className={`p-5 rounded-2xl border transition-all duration-300 ${
          isLight ? 'bg-white border-slate-200 shadow-md' : 'bg-[#0f172a]/80 border-white/10 shadow-xl'
        }`}>
          <div className="flex items-start justify-between">
            <div>
              <span className={`text-[10px] tracking-[2px] uppercase font-bold block ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                Acquisition Origin
              </span>
              <h3 className="text-xl font-bold mt-2 text-[#c9a84c]">
                {lead.source || 'Direct Search'}
              </h3>
            </div>
            <div className="p-3 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/30">
              <Globe size={20} />
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] pt-2 border-t border-white/10">
            <span className={isLight ? 'text-slate-500' : 'text-slate-400'}>Campaign:</span>
            <span className={`font-semibold truncate max-w-[120px] ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
              {lead.campaign_id || 'Direct'}
            </span>
          </div>
        </div>

        {/* Card 4: Digital Touchpoints */}
        <div className={`p-5 rounded-2xl border transition-all duration-300 ${
          isLight ? 'bg-white border-slate-200 shadow-md' : 'bg-[#0f172a]/80 border-white/10 shadow-xl'
        }`}>
          <div className="flex items-start justify-between">
            <div>
              <span className={`text-[10px] tracking-[2px] uppercase font-bold block ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                Digital Touchpoints
              </span>
              <h3 className={`text-2xl font-bold mt-2 font-serif ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                {(metrics.vehicle_views || 0) + (metrics.whatsapp_clicks || 0) + (metrics.forms_submitted || 0)} Interactions
              </h3>
            </div>
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <Activity size={20} />
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] pt-2 border-t border-white/10">
            <span className={isLight ? 'text-slate-500' : 'text-slate-400'}>Vehicle Views:</span>
            <span className="text-emerald-400 font-bold">{metrics.vehicle_views || 0} pages</span>
          </div>
        </div>
      </div>

      {/* Tabs Navigation Header */}
      <div className={`flex border-b overflow-x-auto crm-scroll gap-6 ${isLight ? 'border-slate-200' : 'border-white/10'}`}>
        {[
          { id: 'overview', label: 'Lead Overview & Profile', icon: Users },
          { id: 'telemetry', label: 'Behavioral Telemetry', icon: Sparkles },
          { id: 'opportunities', label: 'Linked Deals & Pipeline', icon: TrendingUp },
          { id: 'timeline', label: 'Communication Timeline', icon: MessageSquare },
          { id: 'tasks', label: `Associated Tasks (${linkedTasks.length})`, icon: CheckSquare }
        ].map(tab => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 text-xs tracking-widest uppercase font-bold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'border-[#c9a84c] text-[#c9a84c]'
                  : isLight
                  ? 'border-transparent text-slate-600 hover:text-slate-900'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* Tab 1: Lead Overview & Profile */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-sans">
          {/* Main Info Column (2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact & Corporate Details */}
            <div className={`p-6 rounded-2xl border transition-all ${
              isLight ? 'bg-white border-slate-200 shadow-lg' : 'bg-[#0f172a]/80 border-white/10 shadow-2xl'
            }`}>
              <h3 className={`text-base font-serif font-bold mb-4 flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                <Building size={18} className="text-[#c9a84c]" />
                <span>Contact &amp; Account Information</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                <div className={`p-3.5 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/60 border-white/10'}`}>
                  <span className={`text-[10px] uppercase font-bold block mb-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Full Name</span>
                  <span className={`text-sm font-semibold ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>{lead.name}</span>
                </div>

                <div className={`p-3.5 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/60 border-white/10'}`}>
                  <span className={`text-[10px] uppercase font-bold block mb-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Email Address</span>
                  <a href={`mailto:${lead.email}`} className="text-sm font-semibold text-[#c9a84c] hover:underline flex items-center gap-1">
                    <span>{lead.email}</span>
                    <ExternalLink size={12} />
                  </a>
                </div>

                <div className={`p-3.5 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/60 border-white/10'}`}>
                  <span className={`text-[10px] uppercase font-bold block mb-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Phone Number</span>
                  <a href={`tel:${lead.phone}`} className="text-sm font-semibold text-emerald-400 hover:underline flex items-center gap-1">
                    <span>{lead.phone}</span>
                    <ExternalLink size={12} />
                  </a>
                </div>

                <div className={`p-3.5 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/60 border-white/10'}`}>
                  <span className={`text-[10px] uppercase font-bold block mb-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Company / Organization</span>
                  <span className={`text-sm font-semibold ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>{lead.company || '—'}</span>
                </div>

                <div className={`p-3.5 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/60 border-white/10'}`}>
                  <span className={`text-[10px] uppercase font-bold block mb-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Assigned Account Exec</span>
                  <span className={`text-sm font-semibold ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>{lead.assigned_to || 'Alex Kimani'}</span>
                </div>

                <div className={`p-3.5 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/60 border-white/10'}`}>
                  <span className={`text-[10px] uppercase font-bold block mb-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Buying Timeline</span>
                  <span className="text-sm font-semibold text-purple-400">{lead.buying_timeline || '1-3 months'}</span>
                </div>
              </div>
            </div>

            {/* Sales Rep Notes & Vehicle Interest (Locked Rich Text Editor) */}
            <div className={`p-6 rounded-2xl border transition-all ${
              isLight ? 'bg-white border-slate-200 shadow-lg' : 'bg-[#0f172a]/80 border-white/10 shadow-2xl'
            }`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <h3 className={`text-base font-serif font-bold flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                    <FileText size={18} className="text-[#c9a84c]" />
                    <span>Sales Notes &amp; Vehicle Requirements</span>
                  </h3>

                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase font-mono font-bold flex items-center gap-1 border ${
                    isNotesEditing
                      ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                      : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  }`}>
                    {isNotesEditing ? <Unlock size={10} /> : <Lock size={10} />}
                    <span>{isNotesEditing ? 'Unlocked (Editing)' : 'Locked (Read-Only)'}</span>
                  </span>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto font-mono text-xs">
                  {notesSaveSuccess && (
                    <span className="text-emerald-400 text-[11px] font-bold animate-pulse flex items-center gap-1">
                      <Check size={14} /> Saved Live!
                    </span>
                  )}

                  {!isNotesEditing ? (
                    <>
                      <button
                        onClick={() => setShowQuickAppend(!showQuickAppend)}
                        className={`px-3 py-1.5 rounded-xl border text-[11px] font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                          isLight ? 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200' : 'bg-slate-800 border-white/10 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        <Plus size={13} className="text-[#c9a84c]" />
                        <span>Append Note</span>
                      </button>

                      <button
                        onClick={() => setIsNotesEditing(true)}
                        className="px-3.5 py-1.5 bg-[#c9a84c] text-slate-950 font-bold rounded-xl text-xs uppercase tracking-wider hover:bg-[#d9b85c] transition-all flex items-center gap-1.5 shadow-md cursor-pointer"
                      >
                        <Edit3 size={13} />
                        <span>Edit Notes</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setNotesContent(lead?.notes || '')
                          setIsNotesEditing(false)
                        }}
                        className="px-3 py-1.5 border border-white/10 text-slate-400 font-bold rounded-xl text-xs uppercase hover:text-white transition-all cursor-pointer"
                      >
                        Cancel
                      </button>

                      <button
                        onClick={() => handleSaveNotes()}
                        disabled={isNotesSaving}
                        className="px-4 py-1.5 bg-emerald-500 text-slate-950 font-bold rounded-xl text-xs uppercase hover:bg-emerald-400 transition-all flex items-center gap-1.5 shadow-md cursor-pointer"
                      >
                        <Save size={13} />
                        <span>{isNotesSaving ? 'Saving...' : 'Save Notes'}</span>
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Quick Append Input Drawer */}
              {showQuickAppend && !isNotesEditing && (
                <div className={`mb-4 p-3.5 rounded-xl border flex gap-2 font-mono text-xs ${
                  isLight ? 'bg-amber-50/80 border-amber-200' : 'bg-slate-950/80 border-amber-500/30'
                }`}>
                  <input
                    type="text"
                    placeholder="Type quick update (e.g. Requested trade-in valuation for Prado)..."
                    value={quickAppendText}
                    onChange={e => setQuickAppendText(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleQuickAppend()}
                    className={`flex-1 p-2 rounded-lg border outline-none ${
                      isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-900 border-white/10 text-slate-100'
                    }`}
                  />
                  <button
                    onClick={handleQuickAppend}
                    className="px-3 py-2 bg-[#c9a84c] text-slate-950 font-bold rounded-lg text-xs hover:bg-[#d9b85c] whitespace-nowrap cursor-pointer"
                  >
                    Append &amp; Save
                  </button>
                </div>
              )}

              {/* Unlocked Editor View */}
              {isNotesEditing ? (
                <div className="space-y-3 font-mono text-xs">
                  {/* Rich Toolbar */}
                  <div className={`p-2 rounded-xl border flex flex-wrap items-center gap-1.5 ${
                    isLight ? 'bg-slate-100 border-slate-300' : 'bg-slate-950/80 border-white/10'
                  }`}>
                    <span className="text-[10px] text-slate-500 uppercase font-bold px-2">Quick Tags:</span>
                    {[
                      '[Fleet Order]', '[Custom Specs]', '[Duty Exempt]',
                      '[Trade-In Needed]', '[Financing Requested]', '[VIP Delivery]'
                    ].map(tag => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => insertTag(tag)}
                        className="px-2 py-1 rounded-md text-[9px] font-bold bg-[#c9a84c]/15 text-[#c9a84c] border border-[#c9a84c]/30 hover:bg-[#c9a84c]/30 cursor-pointer"
                      >
                        + {tag}
                      </button>
                    ))}
                  </div>

                  <textarea
                    rows={6}
                    value={notesContent}
                    onChange={e => setNotesContent(e.target.value)}
                    placeholder="Enter detailed sales requirements, vehicle specifications, financing terms..."
                    className={`w-full p-4 rounded-xl border outline-none font-mono text-xs leading-relaxed transition-all ${
                      isLight
                        ? 'bg-amber-50/40 border-amber-300 text-slate-900 focus:border-[#c9a84c]'
                        : 'bg-slate-950/90 border-amber-500/30 text-slate-100 focus:border-[#c9a84c]'
                    }`}
                  />

                  <div className="flex justify-between items-center text-[10px] text-slate-400">
                    <span>Press "Save Notes" above to persist changes instantly without reload.</span>
                    <span>{notesContent.length} characters</span>
                  </div>
                </div>
              ) : (
                /* Locked Formatted Rich View */
                <div className={`p-4 rounded-xl border text-xs leading-relaxed font-mono whitespace-pre-wrap ${
                  isLight ? 'bg-amber-50/60 border-amber-200 text-slate-800' : 'bg-amber-500/5 border-amber-500/20 text-slate-200'
                }`}>
                  {notesContent ? (
                    notesContent.split('\n').map((line, idx) => {
                      if (line.includes('[') && line.includes(']')) {
                        return (
                          <div key={idx} className="my-1">
                            <span className="text-[#c9a84c] font-bold">{line}</span>
                          </div>
                        )
                      }
                      return <div key={idx}>{line || <br />}</div>
                    })
                  ) : (
                    <span className="text-slate-400 italic">No notes recorded yet for this lead. Click "Edit Notes" or "Append Note" above to add requirements.</span>
                  )}
                </div>
              )}
            </div>

            {/* Vehicle Viewing & Test Drive Appointments Card */}
            <div className={`p-6 rounded-2xl border transition-all ${
              isLight ? 'bg-white border-slate-200 shadow-lg' : 'bg-[#0f172a]/80 border-white/10 shadow-2xl'
            }`}>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <h3 className={`text-base font-serif font-bold flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                  <Calendar size={18} className="text-[#c9a84c]" />
                  <span>Vehicle Viewing &amp; Test Drive Appointments</span>
                </h3>

                <button
                  onClick={() => {
                    setAppointmentForm(f => ({ ...f, vehicle_name: targetVehicleName }))
                    setShowAppointmentModal(true)
                  }}
                  className="px-3.5 py-1.5 bg-[#c9a84c] text-slate-950 font-bold rounded-xl text-xs uppercase tracking-wider hover:bg-[#d9b85c] transition-all flex items-center gap-1.5 shadow-md cursor-pointer self-start md:self-auto font-mono"
                >
                  <Plus size={14} />
                  <span>Schedule Appointment</span>
                </button>
              </div>

              {/* Linked Vehicle Information */}
              <div className={`p-4 rounded-xl border mb-4 font-mono ${
                isLight ? 'bg-amber-50/70 border-amber-200' : 'bg-[#1e293b]/70 border-amber-500/30'
              }`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <span className="text-[10px] text-[#c9a84c] uppercase font-bold tracking-widest block">Target Vehicle Requested</span>
                    <div className="flex items-center gap-2">
                      <h4 className={`text-base font-serif font-bold ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                        {targetVehicleName}
                      </h4>
                      {targetVehicleObj?.price && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#c9a84c]/20 text-[#c9a84c] border border-[#c9a84c]/40">
                          KES {(targetVehicleObj.price / 1000000).toFixed(1)}M
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Category: {targetVehicleObj?.category || 'Executive Vehicle'} · Available Inventory: {targetVehicleObj?.stock || 4} units
                    </p>
                  </div>

                  <Link
                    to={`/book-test-drive?vehicle=${encodeURIComponent(targetVehicleName)}`}
                    target="_blank"
                    className="px-3 py-1.5 rounded-xl border border-[#c9a84c]/40 text-[#c9a84c] text-xs font-bold hover:bg-[#c9a84c]/10 transition-all flex items-center gap-1.5 whitespace-nowrap"
                  >
                    <span>Open Client Booking Page</span>
                    <ExternalLink size={12} />
                  </Link>
                </div>
              </div>

              {/* Appointment List / Active Status */}
              {leadAppointments.length > 0 ? (
                <div className="space-y-3 font-mono text-xs">
                  {leadAppointments.map(app => (
                    <div key={app.id} className={`p-4 rounded-xl border transition-all ${
                      isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/60 border-white/10'
                    }`}>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-slate-400 font-bold">📅 {app.appointment_date} at {app.appointment_time}</span>
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold border ${
                              app.status === 'confirmed' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                                : app.status === 'completed' ? 'bg-blue-500/20 text-blue-400 border-blue-500/40'
                                : app.status === 'cancelled' ? 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                                : 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                            }`}>
                              {app.status}
                            </span>
                          </div>
                          <p className={isLight ? 'text-slate-700' : 'text-slate-300'}>
                            Location: <strong>{app.location_type || 'Showroom VIP Lounge'}</strong>
                          </p>
                          {app.notes && <p className="text-slate-400 text-[11px]">Notes: {app.notes}</p>}
                        </div>

                        {/* Quick Status Setter */}
                        <div className="flex items-center gap-1.5 self-start sm:self-auto">
                          <span className="text-[10px] text-slate-500 uppercase font-bold mr-1">Status:</span>
                          {['scheduled', 'confirmed', 'completed', 'cancelled'].map(st => (
                            <button
                              key={st}
                              onClick={() => updateAppointmentStatus(app.id, st)}
                              className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                                app.status === st
                                  ? 'bg-[#c9a84c] text-slate-950 border-[#c9a84c] shadow-sm'
                                  : isLight ? 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200' : 'bg-slate-800 border-white/10 text-slate-300 hover:bg-slate-700'
                              }`}
                            >
                              {st === 'scheduled' ? 'Scheduled' : st === 'confirmed' ? 'Confirmed' : st === 'completed' ? 'Completed' : 'Cancelled'}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={`p-4 rounded-xl border text-center text-xs ${
                  isLight ? 'bg-slate-50 border-slate-200 text-slate-500' : 'bg-slate-950/40 border-white/10 text-slate-400'
                }`}>
                  No viewing appointment scheduled yet for {lead.name}. Click "Schedule Appointment" above to set date &amp; time.
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar Column */}
          <div className="space-y-6">
            {/* Pipeline Stage Quick Shift */}
            <div className={`p-6 rounded-2xl border transition-all ${
              isLight ? 'bg-white border-slate-200 shadow-lg' : 'bg-[#0f172a]/80 border-white/10 shadow-2xl'
            }`}>
              <h3 className={`text-sm font-serif font-bold mb-3 flex items-center justify-between ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                <span className="flex items-center gap-2">
                  <Layers size={16} className="text-[#c9a84c]" />
                  <span>Kanban Stage Progression</span>
                </span>
                <span className="text-[10px] font-mono text-emerald-400 font-bold">⚡ Live Sync</span>
              </h3>

              <div className="space-y-3 font-mono text-xs">
                <div className="flex justify-between items-center">
                  <span className={isLight ? 'text-slate-600' : 'text-slate-400'}>Current Stage:</span>
                  <span className={`px-2.5 py-0.5 rounded-full font-bold border ${isLight ? stageColors.light : stageColors.dark}`}>
                    {stageTitle}
                  </span>
                </div>

                <div className="pt-2 border-t border-white/10">
                  <label className={`block text-[10px] uppercase font-bold mb-2 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                    Advance Kanban Position
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'new_lead', label: 'New Lead' },
                      { id: 'onboarding', label: 'Onboarding' },
                      { id: 'qualified', label: 'Qualified' },
                      { id: 'viewing', label: 'Viewing / Test Drive' },
                      { id: 'deposit', label: 'Deposit Made' },
                      { id: 'won', label: 'Won Deals' },
                      { id: 'lost', label: 'Lost Deals' }
                    ].map(stage => (
                      <button
                        key={stage.id}
                        onClick={() => handleStageChange(stage.id)}
                        className={`px-2.5 py-2 rounded-xl border text-[10px] uppercase font-bold transition-all cursor-pointer ${
                          currentStageKey === stage.id
                            ? 'bg-[#c9a84c] text-slate-950 border-[#c9a84c] shadow-md shadow-[#c9a84c]/20'
                            : isLight
                            ? 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200 hover:border-[#c9a84c]/50'
                            : 'bg-slate-800/80 border-white/10 text-slate-300 hover:bg-slate-700 hover:border-[#c9a84c]/50'
                        }`}
                      >
                        {stage.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Action Reminders */}
            <div className={`p-6 rounded-2xl border transition-all ${
              isLight ? 'bg-white border-slate-200 shadow-lg' : 'bg-[#0f172a]/80 border-white/10 shadow-2xl'
            }`}>
              <h3 className={`text-sm font-serif font-bold mb-3 flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                <Zap size={16} className="text-[#c9a84c]" />
                <span>Quick Actions</span>
              </h3>

              <div className="space-y-2 text-xs font-mono">
                <button
                  onClick={handleRunScoreCalculation}
                  className={`w-full p-2.5 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                    isLight ? 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-800' : 'bg-slate-900 border-white/10 hover:bg-slate-800 text-slate-200'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <RotateCcw size={14} className="text-[#c9a84c]" />
                    <span>Run Score Calculation</span>
                  </span>
                  <ChevronRight size={14} />
                </button>

                <button
                  onClick={handleOpenEdit}
                  className={`w-full p-2.5 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                    isLight ? 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-800' : 'bg-slate-900 border-white/10 hover:bg-slate-800 text-slate-200'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <PenLine size={14} className="text-blue-400" />
                    <span>Update Contact Details</span>
                  </span>
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Digital Behavioral Telemetry */}
      {activeTab === 'telemetry' && (
        <div className="space-y-6 font-mono text-xs">
          {/* Intent Scoring Breakdown Header Card */}
          <div className={`p-6 rounded-2xl border transition-all ${
            isLight ? 'bg-white border-slate-200 shadow-xl' : 'bg-[#0f172a]/80 border-white/10 shadow-2xl'
          }`}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-5 mb-5">
              <div>
                <span className="text-[10px] tracking-[3px] uppercase text-[#c9a84c] font-bold block mb-1">AI Scoring Engine</span>
                <h3 className={`text-2xl font-serif font-bold ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                  Behavioral Telemetry &amp; Intent Matrix
                </h3>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Current Lead Score</span>
                  <span className="text-2xl font-bold text-emerald-400 font-serif">{prob}%</span>
                </div>
                <button
                  onClick={() => recalculateLeadScore(lead.id)}
                  className="px-3.5 py-2 bg-[#c9a84c] text-slate-950 font-bold rounded-xl text-xs uppercase hover:bg-[#d9b85c] transition-all flex items-center gap-1.5 shadow-md cursor-pointer"
                >
                  <RotateCcw size={14} />
                  <span>Recalculate Now</span>
                </button>
              </div>
            </div>

            {/* Metrics Breakdown Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              <div className={`p-3.5 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/60 border-white/10'}`}>
                <div className="flex items-center justify-between text-slate-400 mb-1">
                  <span>Vehicle Views</span>
                  <Eye size={14} className="text-sky-400" />
                </div>
                <span className={`text-xl font-bold ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>{metrics.vehicle_views || 0}</span>
                <span className="text-[10px] text-emerald-400 block mt-0.5">+{(metrics.vehicle_views || 0) * 2} pts</span>
              </div>

              <div className={`p-3.5 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/60 border-white/10'}`}>
                <div className="flex items-center justify-between text-slate-400 mb-1">
                  <span>WhatsApp Clicks</span>
                  <MessageSquare size={14} className="text-emerald-400" />
                </div>
                <span className={`text-xl font-bold ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>{metrics.whatsapp_clicks || 0}</span>
                <span className="text-[10px] text-emerald-400 block mt-0.5">+{(metrics.whatsapp_clicks || 0) * 5} pts</span>
              </div>

              <div className={`p-3.5 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/60 border-white/10'}`}>
                <div className="flex items-center justify-between text-slate-400 mb-1">
                  <span>Forms Submitted</span>
                  <FileText size={14} className="text-purple-400" />
                </div>
                <span className={`text-xl font-bold ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>{metrics.forms_submitted || 0}</span>
                <span className="text-[10px] text-emerald-400 block mt-0.5">+{(metrics.forms_submitted || 0) * 15} pts</span>
              </div>

              <div
                onClick={() => toggleLeadCriterion(lead.id, 'appointment_booked')}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all duration-150 hover:scale-[1.02] ${
                  metrics.appointment_booked
                    ? isLight ? 'bg-emerald-50 border-emerald-300' : 'bg-emerald-950/40 border-emerald-500/40'
                    : isLight ? 'bg-slate-50 border-slate-200 hover:border-amber-400' : 'bg-slate-950/60 border-white/10 hover:border-amber-500/40'
                }`}
                title="Click to toggle Appointment Booked (+5 pts)"
              >
                <div className="flex items-center justify-between text-slate-400 mb-1">
                  <span className="font-semibold text-xs text-slate-200">Appointment Booked</span>
                  <Calendar size={14} className="text-amber-400" />
                </div>
                <span className={`text-xl font-bold ${metrics.appointment_booked ? 'text-emerald-400' : 'text-slate-500'}`}>
                  {metrics.appointment_booked ? 'YES' : 'NO'}
                </span>
                <span className="text-[10px] text-emerald-400 font-bold block mt-0.5">{metrics.appointment_booked ? '+5 pts (Active)' : '+5 pts (Click to add)'}</span>
              </div>

              <div
                onClick={() => toggleLeadCriterion(lead.id, 'showed_up')}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all duration-150 hover:scale-[1.02] ${
                  (latestAppointment?.status === 'completed' || latestAppointment?.status === 'attended' || metrics.showed_up)
                    ? isLight ? 'bg-emerald-50 border-emerald-300' : 'bg-emerald-950/40 border-emerald-500/40'
                    : isLight ? 'bg-slate-50 border-slate-200 hover:border-amber-400' : 'bg-slate-950/60 border-white/10 hover:border-amber-500/40'
                }`}
                title="Click to toggle Viewing Attended (+15 pts)"
              >
                <div className="flex items-center justify-between text-slate-400 mb-1">
                  <span className="font-semibold text-xs text-slate-200">Viewing Attended</span>
                  <UserCheck size={14} className="text-emerald-400" />
                </div>
                <span className={`text-xl font-bold ${(latestAppointment?.status === 'completed' || latestAppointment?.status === 'attended' || metrics.showed_up) ? 'text-emerald-400' : 'text-slate-500'}`}>
                  {(latestAppointment?.status === 'completed' || latestAppointment?.status === 'attended' || metrics.showed_up) ? 'YES' : 'NO'}
                </span>
                <span className="text-[10px] text-emerald-400 font-bold block mt-0.5">{(latestAppointment?.status === 'completed' || latestAppointment?.status === 'attended' || metrics.showed_up) ? '+15 pts (Active)' : '+15 pts (Click to add)'}</span>
              </div>

              <div className={`p-3.5 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/60 border-white/10'}`}>
                <div className="flex items-center justify-between text-slate-400 mb-1">
                  <span>Videos Watched</span>
                  <Play size={14} className="text-rose-400" />
                </div>
                <span className={`text-xl font-bold ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>{metrics.videos_watched || 0}</span>
                <span className="text-[10px] text-emerald-400 block mt-0.5">Max Completion: {metrics.max_video_pct || 0}%</span>
              </div>

              <div
                onClick={() => toggleLeadCriterion(lead.id, 'tradein_uploaded')}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all duration-150 hover:scale-[1.02] ${
                  metrics.tradein_uploaded
                    ? isLight ? 'bg-emerald-50 border-emerald-300' : 'bg-emerald-950/40 border-emerald-500/40'
                    : isLight ? 'bg-slate-50 border-slate-200 hover:border-amber-400' : 'bg-slate-950/60 border-white/10 hover:border-amber-500/40'
                }`}
                title="Click to toggle Trade-In Appraisal (+15 pts)"
              >
                <div className="flex items-center justify-between text-slate-400 mb-1">
                  <span className="font-semibold text-xs text-slate-200">Trade-In Uploaded</span>
                  <Tag size={14} className="text-indigo-400" />
                </div>
                <span className={`text-xl font-bold ${metrics.tradein_uploaded ? 'text-emerald-400' : 'text-slate-500'}`}>
                  {metrics.tradein_uploaded ? 'YES' : 'NO'}
                </span>
                <span className="text-[10px] text-emerald-400 font-bold block mt-0.5">{metrics.tradein_uploaded ? '+15 pts (Active)' : '+15 pts (Click to add)'}</span>
              </div>

              <div className={`p-3.5 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/60 border-white/10'}`}>
                <div className="flex items-center justify-between text-slate-400 mb-1">
                  <span>7-Day Return Visitor</span>
                  <RotateCcw size={14} className="text-blue-400" />
                </div>
                <span className={`text-xl font-bold ${metrics.returns_7d ? 'text-emerald-400' : 'text-slate-500'}`}>
                  {metrics.returns_7d ? 'YES' : 'NO'}
                </span>
                <span className="text-[10px] text-emerald-400 block mt-0.5">{metrics.returns_7d ? '+10 pts' : '0 pts'}</span>
              </div>

              <div className={`p-3.5 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/60 border-white/10'}`}>
                <div className="flex items-center justify-between text-slate-400 mb-1">
                  <span>Session Dwell Time</span>
                  <Clock size={14} className="text-[#c9a84c]" />
                </div>
                <span className={`text-xl font-bold ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>{metrics.similar_time_min || 0}m</span>
                <span className="text-[10px] text-emerald-400 block mt-0.5">High Engagement</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Linked Opportunities & Pipeline */}
      {activeTab === 'opportunities' && (
        <div className="space-y-6 font-sans">
          {linkedOpp ? (
            <div className={`p-6 rounded-2xl border transition-all ${
              isLight ? 'bg-white border-slate-200 shadow-xl' : 'bg-[#0f172a]/80 border-white/10 shadow-2xl'
            }`}>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-5 mb-5">
                <div>
                  <span className="text-[10px] tracking-[3px] uppercase text-[#c9a84c] font-bold block mb-1">Active Deal Item</span>
                  <h3 className={`text-xl font-serif font-bold ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                    {linkedOpp.name}
                  </h3>
                </div>

                <span className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold border ${isLight ? stageColors.light : stageColors.dark}`}>
                  Kanban Position: {stageTitle}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
                <div className={`p-4 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/60 border-white/10'}`}>
                  <span className="text-slate-400 uppercase text-[10px] block mb-1 font-bold">Deal Revenue Value</span>
                  <span className="text-xl font-bold text-[#c9a84c]">
                    KES {((linkedOpp.expected_value || 0) / 1000000).toFixed(1)}M
                  </span>
                </div>

                <div className={`p-4 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/60 border-white/10'}`}>
                  <span className="text-slate-400 uppercase text-[10px] block mb-1 font-bold">Win Probability</span>
                  <span className="text-xl font-bold text-emerald-400">
                    {linkedOpp.probability || 80}%
                  </span>
                </div>

                <div className={`p-4 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/60 border-white/10'}`}>
                  <span className="text-slate-400 uppercase text-[10px] block mb-1 font-bold">Target Close Date</span>
                  <span className={`text-xl font-bold ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                    {linkedOpp.close_date || 'N/A'}
                  </span>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <Link
                  to="/crm/pipeline"
                  className="px-4 py-2 bg-[#c9a84c] text-slate-950 font-bold rounded-xl text-xs uppercase tracking-wider hover:bg-[#d9b85c] transition-all flex items-center gap-1.5 shadow-md"
                >
                  <TrendingUp size={14} />
                  <span>View on Visual Deal Board</span>
                </Link>
              </div>
            </div>
          ) : (
            <div className={`p-12 rounded-2xl border text-center space-y-4 ${
              isLight ? 'bg-white border-slate-200' : 'bg-[#0f172a]/80 border-white/10'
            }`}>
              <div className="w-12 h-12 rounded-full bg-[#c9a84c]/10 text-[#c9a84c] flex items-center justify-center mx-auto border border-[#c9a84c]/30">
                <TrendingUp size={24} />
              </div>
              <h3 className={`text-lg font-serif font-bold ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                No Active Opportunity Found
              </h3>
              <p className={`text-xs max-w-sm mx-auto ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                This lead does not currently have an active deal in the sales pipeline. Convert the lead to create a deal item.
              </p>
              <button
                onClick={() => { setConvertForm({ budget: 15000000, company: lead.company, notes: '' }); setShowConvertModal(true); }}
                className="px-5 py-2.5 bg-[#c9a84c] text-slate-950 font-bold rounded-xl text-xs uppercase tracking-wider hover:bg-[#d9b85c] transition-all inline-flex items-center gap-2 shadow-lg"
              >
                <UserCheck size={16} />
                <span>Create Opportunity Deal</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Communication Timeline & Log */}
      {activeTab === 'timeline' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-sans">
          {/* Activity Form */}
          <div className={`p-6 rounded-2xl border transition-all ${
            isLight ? 'bg-white border-slate-200 shadow-lg' : 'bg-[#0f172a]/80 border-white/10 shadow-2xl'
          }`}>
            <h3 className={`text-base font-serif font-bold mb-4 flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
              <MessageSquare size={18} className="text-[#c9a84c]" />
              <span>Log Interaction / Note</span>
            </h3>

            <form onSubmit={handleAddLog} className="space-y-4 text-xs font-mono">
              <div>
                <PredictiveSelect
                  options={[
                    { value: 'phone_call', label: '📞 Phone Call Note' },
                    { value: 'whatsapp', label: '💬 WhatsApp Message' },
                    { value: 'email', label: '✉️ Email Follow-up' },
                    { value: 'meeting', label: '🤝 In-Person Meeting' },
                    { value: 'note', label: '📝 Internal Sales Note' }
                  ]}
                  value={newLogType}
                  onChange={val => setNewLogType(val || 'phone_call')}
                  isLight={isLight}
                />
              </div>

              <div>
                <label className={`block uppercase font-bold mb-1 ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>Notes &amp; Details</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Record summary of discussion, customer requirements, or next steps..."
                  value={newLogNote}
                  onChange={e => setNewLogNote(e.target.value)}
                  className={`w-full p-3 border rounded-xl outline-none font-mono ${
                    isLight ? 'bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400' : 'bg-slate-950 border-white/10 text-slate-200 placeholder:text-slate-500'
                  }`}
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#c9a84c] text-slate-950 font-bold rounded-xl text-xs uppercase hover:bg-[#d9b85c] transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
              >
                <Plus size={14} />
                <span>Save Interaction Log</span>
              </button>
            </form>
          </div>

          {/* Timeline Feed */}
          <div className={`lg:col-span-2 p-6 rounded-2xl border transition-all ${
            isLight ? 'bg-white border-slate-200 shadow-lg' : 'bg-[#0f172a]/80 border-white/10 shadow-2xl'
          }`}>
            <h3 className={`text-base font-serif font-bold mb-6 flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
              <Clock size={18} className="text-[#c9a84c]" />
              <span>Unified Interaction History</span>
            </h3>

            <div className="space-y-4">
              {/* Custom logs added during session */}
              {customLogs.map(log => (
                <div key={log.id} className={`p-4 rounded-xl border font-mono text-xs space-y-1.5 ${
                  isLight ? 'bg-amber-50/50 border-amber-200' : 'bg-amber-500/10 border-amber-500/30'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#c9a84c] uppercase tracking-wider">
                      {log.type.replace('_', ' ')}
                    </span>
                    <span className="text-[10px] text-slate-400">{log.created_at}</span>
                  </div>
                  <p className={isLight ? 'text-slate-800' : 'text-slate-200'}>{log.note}</p>
                  <span className="text-[10px] text-slate-500 block">Logged by {log.author}</span>
                </div>
              ))}

              {/* Initial lead creation log */}
              <div className={`p-4 rounded-xl border font-mono text-xs space-y-1.5 ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/60 border-white/10'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-400 uppercase tracking-wider">
                    Lead Captured into CRM
                  </span>
                  <span className="text-[10px] text-slate-400">{lead.created_at}</span>
                </div>
                <p className={isLight ? 'text-slate-800' : 'text-slate-300'}>
                  Prospect captured via <strong>{lead.source || 'Direct Search'}</strong>. Attributed campaign: {lead.campaign_id || 'None'}.
                </p>
                <span className="text-[10px] text-slate-500 block">Assigned to {lead.assigned_to || 'Alex Kimani'}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Associated Tasks (Advanced & Synced with Tasks Hub) */}
      {activeTab === 'tasks' && (
        <div className="space-y-6 font-sans">
          {/* Header Action Banner */}
          <div className={`p-6 rounded-2xl border transition-all ${
            isLight ? 'bg-white border-slate-200 shadow-xl' : 'bg-[#0f172a]/80 border-white/10 shadow-2xl'
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] tracking-[3px] uppercase font-bold text-[#c9a84c] block mb-1">Tasks &amp; Reminders Synchronization</span>
                <h3 className={`text-xl font-serif font-bold ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                  Associated Action Items for {lead.name}
                </h3>
              </div>

              <div className="flex items-center gap-3 font-mono text-xs">
                <span className="px-3 py-1 rounded-full bg-[#c9a84c]/10 text-[#c9a84c] border border-[#c9a84c]/30 font-bold">
                  {linkedTasks.length} Total Linked
                </span>
                <button
                  onClick={() => setShowCreateTaskModal(true)}
                  className="px-4 py-2 bg-[#c9a84c] text-slate-950 font-bold rounded-xl text-xs uppercase tracking-wider hover:bg-[#d9b85c] transition-all flex items-center gap-1.5 shadow-md cursor-pointer"
                >
                  <Plus size={15} />
                  <span>Schedule Task</span>
                </button>
              </div>
            </div>
          </div>

          {/* Quick Add Input Box */}
          <div className={`p-5 rounded-2xl border transition-all ${
            isLight ? 'bg-white border-slate-200 shadow-lg' : 'bg-slate-950/60 border-white/10 shadow-xl'
          }`}>
            <form onSubmit={handleAddQuickTask} className="flex gap-3">
              <input
                type="text"
                required
                placeholder={`Quick add task for ${lead.name} (e.g. Call client regarding vehicle inspection)...`}
                value={newTaskTitle}
                onChange={e => setNewTaskTitle(e.target.value)}
                className={`flex-1 px-4 py-2.5 border rounded-xl text-xs font-mono outline-none ${
                  isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-900 border-white/10 text-slate-200'
                }`}
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#c9a84c] text-slate-950 font-bold rounded-xl text-xs uppercase hover:bg-[#d9b85c] transition-all flex items-center gap-1.5 shadow-md cursor-pointer"
              >
                <Plus size={14} />
                <span>Quick Add</span>
              </button>
            </form>
          </div>

          {/* Associated Tasks List */}
          <div className={`p-6 rounded-2xl border transition-all ${
            isLight ? 'bg-white border-slate-200 shadow-xl' : 'bg-[#0f172a]/80 border-white/10 shadow-2xl'
          }`}>
            <h3 className={`text-base font-serif font-bold mb-5 flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
              <CheckSquare size={18} className="text-[#c9a84c]" />
              <span>Synced Tasks Registry ({linkedTasks.length})</span>
            </h3>

            {linkedTasks.length === 0 ? (
              <div className="p-12 text-center space-y-3">
                <CheckSquare size={32} className="text-slate-600 mx-auto" />
                <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                  No active tasks linked to {lead.name} yet. Click <strong>Schedule Task</strong> above to add a follow-up task.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {linkedTasks.map(task => {
                  const subtasks = task.children || task.subtasks || []
                  const completedSubtasks = subtasks.filter(s => s.status === 'completed' || s.completed === true).length
                  const pct = subtasks.length ? Math.round((completedSubtasks / subtasks.length) * 100) : 100
                  const deadline = getTaskDeadlineBadge(task.due_date, task.status)
                  const isTaskCompleted = task.status === 'completed'

                  return (
                    <div
                      key={task.id}
                      className={`p-5 rounded-2xl border transition-all ${
                        isTaskCompleted
                          ? (isLight ? 'bg-emerald-50/60 border-emerald-200 opacity-75' : 'bg-emerald-950/20 border-emerald-500/20 opacity-80')
                          : (isLight ? 'bg-slate-50 border-slate-200 hover:border-slate-300 shadow-sm' : 'bg-slate-950/70 border-white/10 hover:border-[#c9a84c]/40 shadow-lg')
                      }`}
                    >
                      {/* Top Bar: Subject, Priority & Badges */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
                        <div className="flex items-start gap-3">
                          <button
                            onClick={() => completeTask(task.id, 'Completed from Lead Profile')}
                            className={`p-1.5 rounded-lg border transition-all ${
                              isTaskCompleted ? 'bg-emerald-500 text-slate-950 border-emerald-400' : 'border-slate-600 hover:border-[#c9a84c] text-slate-400'
                            }`}
                            title="Toggle Complete"
                          >
                            <CheckCircle2 size={16} />
                          </button>
                          <div>
                            <h4
                              onClick={() => setSelectedTaskForModal(task)}
                              className={`text-sm font-semibold cursor-pointer hover:text-[#c9a84c] transition-colors ${
                                isTaskCompleted ? 'line-through text-slate-500' : (isLight ? 'text-slate-900' : 'text-slate-100')
                              }`}
                            >
                              {task.subject || task.title}
                            </h4>
                            {task.description && (
                              <p className={`text-xs mt-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                                {task.description}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Badges Container */}
                        <div className="flex flex-wrap items-center gap-2 font-mono text-[10px] uppercase font-bold">
                          {/* Category Badge */}
                          <span className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                            {task.category === 'call' ? '📞 Call' : task.category === 'email' ? '✉️ Email' : task.category === 'meeting' ? '🤝 Meeting' : task.category === 'demo' ? '🏎️ Demo' : '⚡ Action'}
                          </span>

                          {/* Priority Badge */}
                          <span className={`px-2.5 py-1 rounded-md border ${
                            task.priority === 'urgent' ? 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                              : task.priority === 'high' ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                              : task.priority === 'medium' ? 'bg-blue-500/20 text-blue-400 border-blue-500/40'
                              : 'bg-slate-500/20 text-slate-400 border-slate-500/40'
                          }`}>
                            {task.priority || 'HIGH'}
                          </span>

                          {/* Deadline Status Badge */}
                          <span className={`px-2.5 py-1 rounded-md border ${deadline.color}`}>
                            {deadline.label}
                          </span>

                          {/* Financial Weight Pill */}
                          {task.financial_weight > 0 && (
                            <span className="px-2.5 py-1 rounded-md bg-[#c9a84c]/20 text-[#c9a84c] border border-[#c9a84c]/40 font-mono">
                              KES {(Number(task.financial_weight)/1000000).toFixed(1)}M
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Subtasks Progress & Checklist */}
                      {subtasks.length > 0 && (
                        <div className="mt-4 space-y-2">
                          <div className="flex items-center justify-between text-[11px] font-mono">
                            <span className="text-slate-400 flex items-center gap-1">
                              <CornerDownRight size={13} className="text-[#c9a84c]" />
                              <span>Subtasks ({completedSubtasks}/{subtasks.length} Done)</span>
                            </span>
                            <span className="text-[#c9a84c] font-bold">{pct}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-[#c9a84c] rounded-full transition-all duration-300" style={{ width: `${pct}%` }} />
                          </div>

                          <div className="pt-2 pl-4 space-y-2 font-mono text-xs">
                            {subtasks.map(st => {
                              const isStDone = st.status === 'completed' || st.completed === true
                              return (
                                <div key={st.id} className="flex items-center justify-between gap-2 p-1.5 rounded-lg hover:bg-white/5">
                                  <div className="flex items-center gap-2">
                                    <input
                                      type="checkbox"
                                      checked={isStDone}
                                      onChange={() => toggleSubTask(task.id, st.id)}
                                      className="accent-[#c9a84c] cursor-pointer w-4 h-4"
                                    />
                                    <span className={isStDone ? 'line-through text-slate-500' : (isLight ? 'text-slate-800' : 'text-slate-200')}>
                                      {st.subject || st.title}
                                    </span>
                                  </div>
                                  {st.resolution_note && (
                                    <span className="text-[10px] text-emerald-400 truncate max-w-[150px]">
                                      Note: {st.resolution_note}
                                    </span>
                                  )}
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      )}

                      {/* Inline Subtask Input Form */}
                      <div className="mt-3 pt-3 border-t border-white/10 flex items-center gap-2">
                        <input
                          type="text"
                          placeholder="Add a subtask..."
                          value={inlineSubtaskText[task.id] || ''}
                          onChange={e => setInlineSubtaskText({ ...inlineSubtaskText, [task.id]: e.target.value })}
                          onKeyDown={e => { if (e.key === 'Enter') handleAddInlineSubtask(task.id) }}
                          className={`flex-1 px-3 py-1.5 border rounded-lg text-xs font-mono outline-none ${
                            isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-900 border-white/10 text-slate-200'
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => handleAddInlineSubtask(task.id)}
                          className="px-3 py-1.5 rounded-lg bg-[#c9a84c]/20 border border-[#c9a84c]/40 text-[#c9a84c] hover:bg-[#c9a84c]/30 text-xs font-mono font-bold uppercase transition-all"
                        >
                          + Add
                        </button>
                      </div>

                      {/* Footer Actions */}
                      <div className="mt-4 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                        <div className="flex items-center gap-3 text-slate-400 text-[11px]">
                          <span className="flex items-center gap-1">
                            <Clock size={13} className="text-[#c9a84c]" /> Due: <strong className={isLight ? 'text-slate-900' : 'text-slate-200'}>{task.due_date || 'No Date'}</strong>
                          </span>
                          <span className="flex items-center gap-1">
                            <UserCheck size={13} className="text-blue-400" /> Assigned: <strong className={isLight ? 'text-slate-900' : 'text-slate-200'}>{task.assigned_to || 'Alex Kimani'}</strong>
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setSelectedTaskForModal(task)}
                            className="px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-300 hover:bg-blue-500/20 text-[11px] uppercase font-bold transition-all"
                          >
                            Inspect Details
                          </button>

                          <button
                            type="button"
                            onClick={() => completeTask(task.id, 'Completed from Lead Profile')}
                            className="px-3 py-1.5 rounded-lg bg-[#c9a84c] text-slate-950 font-bold text-[11px] uppercase hover:bg-[#d9b85c] transition-all shadow-sm cursor-pointer"
                          >
                            {isTaskCompleted ? 'Reopen' : 'Mark Complete'}
                          </button>

                          <button
                            type="button"
                            onClick={() => deleteTask(task.id)}
                            className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-all"
                            title="Delete Task"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Task Detail Interactive Modal */}
      {selectedTaskForModal && (
        <TaskDetailModal
          task={selectedTaskForModal}
          onClose={() => setSelectedTaskForModal(null)}
          onAcknowledge={() => setSelectedTaskForModal(null)}
        />
      )}

      {/* Create New Task Full Modal Overlay */}
      {showCreateTaskModal && (
        <div className="fixed inset-0 z-[99999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto crm-scroll" onClick={() => setShowCreateTaskModal(false)}>
          <div onClick={e => e.stopPropagation()} className={`max-w-xl w-full p-8 rounded-3xl border-2 shadow-2xl relative font-sans ${
            isLight ? 'bg-white border-[#c9a84c]/50 text-slate-900' : 'bg-gradient-to-br from-[#0f172a] to-[#1a1f35] border-[#c9a84c]/30 text-slate-100'
          }`}>
            <div className={`flex items-center justify-between border-b pb-4 mb-5 ${isLight ? 'border-slate-200' : 'border-white/10'}`}>
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-[#c9a84c]/20 text-[#c9a84c] border border-[#c9a84c]/30">
                  <CheckSquare size={22} />
                </div>
                <div>
                  <h3 className={`text-lg font-serif font-bold ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                    Schedule Follow-up Task
                  </h3>
                  <p className="text-xs font-mono text-[#c9a84c]">Associated with Lead: {lead.name}</p>
                </div>
              </div>
              <button onClick={() => setShowCreateTaskModal(false)} className="p-1 text-slate-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddFullTask} className="space-y-4 text-xs font-mono">
              <div>
                <label className={`block uppercase font-bold mb-1 ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>Task Subject / Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Send proforma quote for Land Cruiser V8..."
                  value={newTaskForm.subject}
                  onChange={e => setNewTaskForm({ ...newTaskForm, subject: e.target.value })}
                  className={`w-full p-3 border rounded-xl outline-none font-mono ${
                    isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-950 border-white/10 text-slate-200'
                  }`}
                />
              </div>

              <div>
                <label className={`block uppercase font-bold mb-1 ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>Description &amp; Action Notes</label>
                <textarea
                  rows={3}
                  placeholder="Details regarding action required..."
                  value={newTaskForm.description}
                  onChange={e => setNewTaskForm({ ...newTaskForm, description: e.target.value })}
                  className={`w-full p-3 border rounded-xl outline-none font-mono ${
                    isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-950 border-white/10 text-slate-200'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block uppercase font-bold mb-1 ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>Priority Level</label>
                  <PredictiveSelect
                    options={[
                      { value: 'urgent', label: '🔴 URGENT' },
                      { value: 'high', label: '🟠 HIGH' },
                      { value: 'medium', label: '🔵 MEDIUM' },
                      { value: 'low', label: '⚪ LOW' }
                    ]}
                    value={newTaskForm.priority}
                    onChange={val => setNewTaskForm({ ...newTaskForm, priority: val || 'high' })}
                    isLight={isLight}
                  />
                </div>

                <div>
                  <label className={`block uppercase font-bold mb-1 ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>Category</label>
                  <PredictiveSelect
                    options={[
                      { value: 'call', label: '📞 Phone Call' },
                      { value: 'email', label: '✉️ Email' },
                      { value: 'meeting', label: '🤝 Meeting' },
                      { value: 'demo', label: '🏎️ Test Drive / Demo' },
                      { value: 'custom', label: '⚡ Action Item' }
                    ]}
                    value={newTaskForm.category}
                    onChange={val => setNewTaskForm({ ...newTaskForm, category: val || 'call' })}
                    isLight={isLight}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block uppercase font-bold mb-1 ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>Due Date</label>
                  <ModernDatePicker
                    value={(newTaskForm.due_date || '').split(' ')[0]}
                    onChange={val => {
                      const timePart = (newTaskForm.due_date || '').split(' ')[1] || '14:00'
                      setNewTaskForm({ ...newTaskForm, due_date: `${val} ${timePart}` })
                    }}
                    isLight={isLight}
                    presets={true}
                  />
                </div>
                <div>
                  <label className={`block uppercase font-bold mb-1 ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>Due Time</label>
                  <StyledTimePicker
                    value={(newTaskForm.due_date || '').split(' ')[1] || '14:00'}
                    onChange={val => {
                      const datePart = (newTaskForm.due_date || '').split(' ')[0] || new Date().toISOString().split('T')[0]
                      const time24 = val.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i)
                        ? (() => { let h = parseInt(val); const m = val.match(/:([0-9]{2})/)[1]; const pm = /PM/i.test(val); if (pm && h < 12) h += 12; if (!pm && h === 12) h = 0; return `${String(h).padStart(2,'0')}:${m}` })()
                        : val
                      setNewTaskForm({ ...newTaskForm, due_date: `${datePart} ${time24}` })
                    }}
                    isLight={isLight}
                    use12Hour={false}
                  />
                </div>

                <div>
                  <label className={`block uppercase font-bold mb-1 ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>Assigned Representative</label>
                  <input
                    type="text"
                    value={newTaskForm.assigned_to}
                    onChange={e => setNewTaskForm({ ...newTaskForm, assigned_to: e.target.value })}
                    className={`w-full p-2.5 border rounded-xl outline-none ${
                      isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-950 border-white/10 text-slate-200'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className={`block uppercase font-bold mb-1 ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>Deal Revenue Weight (KES)</label>
                <input
                  type="number"
                  value={newTaskForm.financial_weight}
                  onChange={e => setNewTaskForm({ ...newTaskForm, financial_weight: e.target.value })}
                  placeholder="e.g. 15000000"
                  className={`w-full p-2.5 border rounded-xl outline-none font-mono ${
                    isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-950 border-white/10 text-slate-200'
                  }`}
                />
              </div>

              <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateTaskModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-white/10 text-slate-400 hover:text-white uppercase font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#c9a84c] text-slate-950 font-bold rounded-xl text-xs uppercase hover:bg-[#d9b85c] transition-all shadow-md"
                >
                  Create &amp; Sync Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Lead Modal */}
      {showEditModal && editForm && (
        <div className="fixed inset-0 z-[99999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto crm-scroll" onClick={() => setShowEditModal(false)}>
          <div onClick={e => e.stopPropagation()} className={`max-w-lg w-full my-auto p-8 rounded-3xl border-2 shadow-2xl relative font-sans transition-all ${
            isLight ? 'bg-white border-[#c9a84c]/50 text-slate-900' : 'bg-gradient-to-br from-[#0f172a] to-[#1a1f35] border-[#c9a84c]/30 text-slate-100'
          }`}>
            <div className={`flex items-center justify-between border-b pb-5 mb-5 ${isLight ? 'border-slate-200' : 'border-[#c9a84c]/15'}`}>
              <div>
                <span className="text-[10px] tracking-[3px] uppercase text-[#c9a84c] font-bold block mb-1">Edit Record</span>
                <h3 className="text-xl font-serif font-bold">Update Lead Details</h3>
              </div>
              <button onClick={() => setShowEditModal(false)} className="p-2 rounded-xl text-slate-400 hover:text-slate-200">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs font-mono">
              <div>
                <label className="block uppercase font-bold mb-1">Lead Name *</label>
                <input
                  type="text"
                  required
                  value={editForm.name}
                  onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                  className={`w-full p-2.5 border rounded-xl outline-none ${isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-950 border-white/10 text-slate-200'}`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block uppercase font-bold mb-1">Email</label>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={e => setEditForm({ ...editForm, email: e.target.value })}
                    className={`w-full p-2.5 border rounded-xl outline-none ${isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-950 border-white/10 text-slate-200'}`}
                  />
                </div>
                <div>
                  <label className="block uppercase font-bold mb-1">Phone</label>
                  <input
                    type="text"
                    value={editForm.phone}
                    onChange={e => setEditForm({ ...editForm, phone: e.target.value })}
                    className={`w-full p-2.5 border rounded-xl outline-none ${isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-950 border-white/10 text-slate-200'}`}
                  />
                </div>
              </div>

              <div>
                <label className="block uppercase font-bold mb-1">Company</label>
                <input
                  type="text"
                  value={editForm.company || ''}
                  onChange={e => setEditForm({ ...editForm, company: e.target.value })}
                  className={`w-full p-2.5 border rounded-xl outline-none ${isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-950 border-white/10 text-slate-200'}`}
                />
              </div>

              <div>
                <label className="block uppercase font-bold mb-1">Sales Rep Notes</label>
                <textarea
                  rows={3}
                  value={editForm.notes || ''}
                  onChange={e => setEditForm({ ...editForm, notes: e.target.value })}
                  className={`w-full p-2.5 border rounded-xl outline-none ${isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-950 border-white/10 text-slate-200'}`}
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-white/10">
                <button type="button" onClick={() => setShowEditModal(false)} className="px-4 py-2 border rounded-xl text-xs uppercase font-bold">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 bg-[#c9a84c] text-slate-950 font-bold rounded-xl text-xs uppercase hover:bg-[#d9b85c]">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Convert Modal */}
      {showConvertModal && (
        <div className="fixed inset-0 z-[99999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4" onClick={() => setShowConvertModal(false)}>
          <div onClick={e => e.stopPropagation()} className={`max-w-md w-full p-8 rounded-3xl border-2 font-sans ${
            isLight ? 'bg-white border-emerald-300 text-slate-900' : 'bg-slate-900 border-emerald-500/30 text-slate-100'
          }`}>
            <h3 className="text-xl font-serif font-bold text-emerald-400 mb-2">Convert Lead to Customer</h3>
            <p className="text-xs text-slate-400 mb-4">Promote {lead.name} and open a deal item in the sales pipeline.</p>

            <form onSubmit={handleConvertSubmit} className="space-y-4 text-xs font-mono">
              <div>
                <label className="block uppercase font-bold mb-1">Estimated Deal Budget (KES)</label>
                <input
                  type="number"
                  value={convertForm.budget}
                  onChange={e => setConvertForm({ ...convertForm, budget: Number(e.target.value) })}
                  className={`w-full p-2.5 border rounded-xl outline-none ${isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-950 border-white/10'}`}
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-white/10">
                <button type="button" onClick={() => setShowConvertModal(false)} className="px-4 py-2 border rounded-xl text-xs uppercase font-bold">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 bg-emerald-500 text-slate-950 font-bold rounded-xl text-xs uppercase hover:bg-emerald-400">
                  Confirm Conversion
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Schedule Appointment Modal */}
      {showAppointmentModal && (
        <div className="fixed inset-0 z-[99999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4" onClick={() => setShowAppointmentModal(false)}>
          <div onClick={e => e.stopPropagation()} className={`max-w-md w-full p-8 rounded-3xl border-2 font-sans ${
            isLight ? 'bg-white border-[#c9a84c]/50 text-slate-900' : 'bg-slate-900 border-[#c9a84c]/30 text-slate-100'
          }`}>
            <div className="flex items-center justify-between border-b pb-4 mb-4">
              <div>
                <span className="text-[10px] tracking-[3px] uppercase text-[#c9a84c] font-bold block mb-1">Vehicle Booking</span>
                <h3 className="text-xl font-serif font-bold">Schedule Viewing / Test Drive</h3>
              </div>
              <button onClick={() => setShowAppointmentModal(false)} className="p-2 text-slate-400 hover:text-white">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleAppointmentSubmit} className="space-y-4 text-xs font-mono">
              <div>
                <label className="block uppercase font-bold mb-1">Target Vehicle *</label>
                <PredictiveSelect
                  options={vehicleInventory.map(v => ({
                    value: v.name,
                    label: `${v.name} — KES ${(v.price / 1000000).toFixed(1)}M`
                  }))}
                  value={appointmentForm.vehicle_name}
                  onChange={val => setAppointmentForm({ ...appointmentForm, vehicle_name: val || '' })}
                  isLight={isLight}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block uppercase font-bold mb-1">Preferred Date *</label>
                  <ModernDatePicker
                    value={appointmentForm.appointment_date}
                    onChange={val => setAppointmentForm({ ...appointmentForm, appointment_date: val || '' })}
                    isLight={isLight}
                    presets={true}
                  />
                </div>

                <div>
                  <label className="block uppercase font-bold mb-1">Time Slot *</label>
                  <StyledTimePicker
                    value={appointmentForm.appointment_time}
                    onChange={val => setAppointmentForm({ ...appointmentForm, appointment_time: val })}
                    isLight={isLight}
                  />
                </div>
              </div>

              <div>
                <label className="block uppercase font-bold mb-1">Location Type</label>
                <PredictiveSelect
                  options={[
                    { value: 'Showroom VIP Lounge', label: 'Showroom VIP Lounge (Westlands, Nairobi)' },
                    { value: 'Executive Home Delivery', label: 'Executive Home Delivery Test Drive' },
                    { value: 'Corporate Office Delivery', label: 'Corporate Office Delivery Test Drive' }
                  ]}
                  value={appointmentForm.location_type}
                  onChange={val => setAppointmentForm({ ...appointmentForm, location_type: val || 'Showroom VIP Lounge' })}
                  isLight={isLight}
                />
              </div>

              <div>
                <label className="block uppercase font-bold mb-1">Notes &amp; Special Instructions</label>
                <textarea
                  rows={3}
                  placeholder="e.g. Offroad track test drive requested, trade-in vehicle appraisal..."
                  value={appointmentForm.notes}
                  onChange={e => setAppointmentForm({ ...appointmentForm, notes: e.target.value })}
                  className={`w-full p-2.5 border rounded-xl outline-none ${isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-950 border-white/10 text-slate-200'}`}
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-white/10">
                <button type="button" onClick={() => setShowAppointmentModal(false)} className="px-4 py-2 border rounded-xl uppercase font-bold">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 bg-[#c9a84c] text-slate-950 font-bold rounded-xl uppercase hover:bg-[#d9b85c]">
                  Confirm &amp; Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lead Score Calculation Popup Modal */}
      {showScoreModal && (
        <div className="fixed inset-0 z-[99999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4" onClick={() => setShowScoreModal(false)}>
          <div onClick={e => e.stopPropagation()} className={`max-w-lg w-full p-8 rounded-3xl border-2 font-sans transition-all transform ${
            isLight ? 'bg-white border-[#c9a84c]/50 text-slate-900 shadow-2xl' : 'bg-slate-900 border-[#c9a84c]/40 text-slate-100 shadow-2xl'
          }`}>
            {/* Header */}
            <div className="flex items-center justify-between border-b pb-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-[#c9a84c]/15 text-[#c9a84c] border border-[#c9a84c]/30">
                  <Sparkles size={24} />
                </div>
                <div>
                  <span className="text-[10px] tracking-[3px] uppercase text-[#c9a84c] font-bold block mb-0.5">Quantum Scoring Engine</span>
                  <h3 className="text-xl font-serif font-bold">Score Calculation Result</h3>
                </div>
              </div>
              <button onClick={() => setShowScoreModal(false)} className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-white/10 transition-all cursor-pointer">
                <X size={18} />
              </button>
            </div>

            {/* Main Score Gauge & Grade */}
            <div className={`p-6 rounded-2xl border mb-6 text-center relative overflow-hidden ${
              isLight ? 'bg-amber-50/70 border-amber-200' : 'bg-slate-950/80 border-amber-500/30'
            }`}>
              <div className="absolute top-0 right-0 p-3 opacity-10 text-[#c9a84c]">
                <Award size={96} />
              </div>

              <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400 block mb-2">Calculated Intent Score</span>
              
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-5xl font-black font-serif text-[#c9a84c] tracking-tight">
                  {lead.intent_score || lead.conversion_probability || 75}
                </span>
                <span className="text-2xl font-bold text-slate-500 font-serif">/ 100</span>
              </div>

              <span className={`inline-block px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider border shadow-md ${
                (lead.intent_score || 75) >= 80
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50 shadow-emerald-500/10'
                  : (lead.intent_score || 75) >= 50
                  ? 'bg-amber-500/20 text-amber-400 border-amber-500/50 shadow-amber-500/10'
                  : 'bg-blue-500/20 text-blue-400 border-blue-500/50 shadow-blue-500/10'
              }`}>
                {(lead.intent_score || 75) >= 80 ? '🌟 VIP Hot Lead' : (lead.intent_score || 75) >= 50 ? '⚡ Warm Prospect' : '❄️ Cool Inquiry'}
              </span>
            </div>

            {/* Itemized Score Factors Table */}
            <div className="space-y-3 font-mono text-xs mb-6">
              <h4 className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Weighted Scoring Factors Breakdown</h4>

              <div
                onClick={() => toggleLeadCriterion(lead.id, 'appointment_booked')}
                className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all duration-150 hover:scale-[1.01] ${
                  metrics.appointment_booked
                    ? isLight ? 'bg-emerald-50 border-emerald-300 shadow-sm' : 'bg-emerald-950/40 border-emerald-500/40 shadow-md'
                    : isLight ? 'bg-slate-50 border-slate-200 hover:border-amber-400' : 'bg-slate-950/60 border-white/10 hover:border-amber-500/40'
                }`}
                title="Click to toggle Lead Booking Appointment (+5 pts)"
              >
                <div className="space-y-0.5">
                  <span className={`font-bold block flex items-center gap-1.5 ${isLight ? 'text-slate-900' : 'text-slate-200'}`}>
                    <span>1. Lead Booking Appointment</span>
                    <span className="text-[9px] uppercase font-bold text-[#c9a84c]">(Click to toggle)</span>
                  </span>
                  <span className="text-[10px] text-slate-400">{metrics.appointment_booked ? 'Confirmed viewing / test drive slot booked' : 'Click to add +5 pts'}</span>
                </div>
                <span className={`${metrics.appointment_booked ? 'text-emerald-400' : 'text-slate-500'} font-bold text-sm`}>{metrics.appointment_booked ? '+5 pts' : '0 pts'}</span>
              </div>

              <div
                onClick={() => toggleLeadCriterion(lead.id, 'showed_up')}
                className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all duration-150 hover:scale-[1.01] ${
                  (latestAppointment?.status === 'completed' || latestAppointment?.status === 'attended' || metrics.showed_up)
                    ? isLight ? 'bg-emerald-50 border-emerald-300 shadow-sm' : 'bg-emerald-950/40 border-emerald-500/40 shadow-md'
                    : isLight ? 'bg-slate-50 border-slate-200 hover:border-amber-400' : 'bg-slate-950/60 border-white/10 hover:border-amber-500/40'
                }`}
                title="Click to toggle Lead Showing Up for Vehicle Viewing (+15 pts)"
              >
                <div className="space-y-0.5">
                  <span className={`font-bold block flex items-center gap-1.5 ${isLight ? 'text-slate-900' : 'text-slate-200'}`}>
                    <span>2. Lead Showing Up for Vehicle Viewing</span>
                    <span className="text-[9px] uppercase font-bold text-[#c9a84c]">(Click to toggle)</span>
                  </span>
                  <span className="text-[10px] text-slate-400">{(latestAppointment?.status === 'completed' || latestAppointment?.status === 'attended' || metrics.showed_up) ? 'Physically attended showroom viewing/test drive' : 'Click to add +15 pts'}</span>
                </div>
                <span className={`${(latestAppointment?.status === 'completed' || latestAppointment?.status === 'attended' || metrics.showed_up) ? 'text-emerald-400' : 'text-slate-500'} font-bold text-sm`}>{(latestAppointment?.status === 'completed' || latestAppointment?.status === 'attended' || metrics.showed_up) ? '+15 pts' : '0 pts'}</span>
              </div>

              <div
                onClick={() => toggleLeadCriterion(lead.id, 'tradein_uploaded')}
                className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all duration-150 hover:scale-[1.01] ${
                  metrics.tradein_uploaded
                    ? isLight ? 'bg-emerald-50 border-emerald-300 shadow-sm' : 'bg-emerald-950/40 border-emerald-500/40 shadow-md'
                    : isLight ? 'bg-slate-50 border-slate-200 hover:border-amber-400' : 'bg-slate-950/60 border-white/10 hover:border-amber-500/40'
                }`}
                title="Click to toggle Trade-In Appraisal (+15 pts)"
              >
                <div className="space-y-0.5">
                  <span className={`font-bold block flex items-center gap-1.5 ${isLight ? 'text-slate-900' : 'text-slate-200'}`}>
                    <span>3. Trade-In Appraisal &amp; Photos Uploaded</span>
                    <span className="text-[9px] uppercase font-bold text-[#c9a84c]">(Click to toggle)</span>
                  </span>
                  <span className="text-[10px] text-slate-400">{metrics.tradein_uploaded ? 'Uploaded vehicle trade-in appraisal photos' : 'Click to add +15 pts'}</span>
                </div>
                <span className={`${metrics.tradein_uploaded ? 'text-emerald-400' : 'text-slate-500'} font-bold text-sm`}>{metrics.tradein_uploaded ? '+15 pts' : '0 pts'}</span>
              </div>

              <div className={`p-3 rounded-xl border flex items-center justify-between ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/60 border-white/10'}`}>
                <div className="space-y-0.5">
                  <span className={`font-bold block ${isLight ? 'text-slate-900' : 'text-slate-200'}`}>4. Buying Horizon &amp; Intent Match</span>
                  <span className="text-[10px] text-slate-400">Timeline: {lead.buying_timeline || '1-3 months'}</span>
                </div>
                <span className="text-emerald-400 font-bold text-sm">+15 pts</span>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex items-center justify-between border-t border-white/10 pt-4 font-mono text-xs">
              <Link
                to="/crm/scoring-rules"
                onClick={() => setShowScoreModal(false)}
                className="text-[#c9a84c] hover:underline text-[11px] font-bold flex items-center gap-1"
              >
                <span>Configure Weighting Rules</span>
                <ExternalLink size={12} />
              </Link>

              <button
                onClick={() => setShowScoreModal(false)}
                className="px-5 py-2.5 bg-[#c9a84c] text-slate-950 font-bold rounded-xl text-xs uppercase tracking-wider hover:bg-[#d9b85c] transition-all shadow-md cursor-pointer"
              >
                Done &amp; Apply Score
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
