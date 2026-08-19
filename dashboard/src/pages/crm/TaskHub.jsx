import React, { useState, useMemo } from 'react'
import { useCRMStore } from '../../context/CRMStore'
import UniversalPagination from '../../components/common/UniversalPagination'
import PredictiveSelect from '../../components/common/PredictiveSelect'
import TaskDetailModal from '../../components/common/TaskDetailModal'
import ActionTooltip from '../../components/common/ActionTooltip'
import ModernDatePicker from '../../components/common/ModernDatePicker'
import StyledTimePicker from '../../components/common/StyledTimePicker'
import {
  CheckSquare, Plus, Zap, AlertTriangle, ShieldCheck, ChevronRight, ChevronDown,
  Clock, DollarSign, Users, Link as LinkIcon, CheckCircle2, X, Search,
  Calendar, UserCheck, CornerDownRight, Trash2, Edit3, Layers, UserX,
  Archive, RotateCcw, ShieldAlert
} from 'lucide-react'

// Available System Users for Task Assignment
const TEAM_USERS = [
  { value: 'Alex Kimani', label: 'Alex Kimani (Senior Executive)', badge: 'Sales Lead' },
  { value: 'Michael Chen', label: 'Michael Chen (Logistics Manager)', badge: 'Operations' },
  { value: 'Sarah Wanjiku', label: 'Sarah Wanjiku (CRM Specialist)', badge: 'Marketing' },
  { value: 'David Omondi', label: 'David Omondi (Finance Officer)', badge: 'Accounts' },
  { value: 'Grace Mutua', label: 'Grace Mutua (Support Lead)', badge: 'Support' }
]

export default function TaskHub() {
  const tasks = useCRMStore(state => state.tasks)
  const leads = useCRMStore(state => state.leads)
  const opportunities = useCRMStore(state => state.opportunities)
  const addTask = useCRMStore(state => state.addTask)
  const addSubTask = useCRMStore(state => state.addSubTask)
  const toggleSubTask = useCRMStore(state => state.toggleSubTask)
  const completeTask = useCRMStore(state => state.completeTask)
  const archiveTask = useCRMStore(state => state.archiveTask)
  const restoreTask = useCRMStore(state => state.restoreTask)
  const permanentlyDeleteTask = useCRMStore(state => state.permanentlyDeleteTask)
  const adminTheme = useCRMStore(state => state.adminTheme)
  const teamMembers = useCRMStore(state => state.teamMembers) || []
  const isLight = adminTheme === 'light'

  const teamUsersOptions = useMemo(() => {
    return teamMembers.map(m => ({
      value: m.name,
      label: `${m.name} (${m.role || 'Executive'})`,
      badge: m.department || 'Sales'
    }))
  }, [teamMembers])

  // Expandable Task Rows
  const [expandedTaskIds, setExpandedTaskIds] = useState(['task-1'])
  
  // Filter & Search State
  const [activeFilterTab, setActiveFilterTab] = useState('all') // 'all' | 'my' | 'group' | 'urgent' | 'archived'
  const [searchTerm, setSearchTerm] = useState('')
  const [currentUser] = useState('Alex Kimani') // Active logged-in user

  // Archive & Permanent Delete Warning Modal States
  const [archiveTarget, setArchiveTarget] = useState(null)
  const [archiveReasonInput, setArchiveReasonInput] = useState('')
  const [permanentDeleteTarget, setPermanentDeleteTarget] = useState(null)

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false)
  const [subTaskModalParentId, setSubTaskModalParentId] = useState(null)
  const [resolutionTarget, setResolutionTarget] = useState(null)
  const [resolutionNote, setResolutionNote] = useState('')

  // Helper: Default ISO date string builder
  const getDefaultFutureDate = (hoursAhead) => {
    return new Date(Date.now() + hoursAhead * 60 * 60 * 1000).toISOString().replace('T', ' ').substring(0, 16)
  }

  // New Parent Task Form State
  const [taskForm, setTaskForm] = useState(() => ({
    subject: '',
    description: '',
    due_date: getDefaultFutureDate(24),
    priority: 'high',
    category: 'call',
    assignment_type: 'individual', // 'individual' | 'group'
    assigned_to: 'Alex Kimani',
    financial_weight: 0,
    taskable_type: 'Opportunity',
    taskable_id: 'opp-1'
  }))

  // New Sub-task Form State
  const [subTaskForm, setSubTaskForm] = useState(() => ({
    subject: '',
    description: '',
    assigned_to: 'Michael Chen',
    due_date: getDefaultFutureDate(12)
  }))

  // Helper: Deadline Status 4-Level Color Coding Strategy
  const getDeadlineStatus = (dueDateStr, status) => {
    if (status === 'completed') {
      return {
        label: 'COMPLETED',
        type: 'completed',
        color: isLight ? 'bg-emerald-100 text-emerald-900 border-emerald-300 font-bold' : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 font-bold',
        cardClass: isLight ? 'bg-slate-50/70 border-slate-200' : 'bg-slate-900/60 border-white/10',
        icon: CheckCircle2
      }
    }

    if (!dueDateStr) {
      return {
        label: 'NO DEADLINE',
        type: 'normal',
        color: isLight ? 'bg-slate-200 text-slate-700 border-slate-300' : 'bg-slate-800 text-slate-400 border-white/10',
        cardClass: isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/60 border-white/10',
        icon: Clock
      }
    }

    const now = new Date()
    now.setHours(0, 0, 0, 0)

    const cleanDateStr = dueDateStr.split(' ')[0]
    const [y, m, d] = cleanDateStr.split('-').map(Number)
    const due = new Date(y, m - 1, d)
    due.setHours(0, 0, 0, 0)

    const diffDays = Math.round((due - now) / (1000 * 60 * 60 * 24))

    // 1. Overdue (past by over 3 days) -> Red
    if (diffDays < -3) {
      return {
        label: `OVERDUE (${Math.abs(diffDays)}D AGO)`,
        type: 'overdue',
        color: isLight ? 'bg-rose-100 text-rose-900 border-rose-300 font-bold' : 'bg-rose-500/20 text-rose-400 border-rose-500/50 shadow-sm shadow-rose-500/20 font-bold animate-pulse',
        cardClass: isLight ? 'bg-rose-50/80 border-rose-300 shadow-md hover:border-rose-400' : 'bg-rose-950/20 border-rose-500/40 shadow-lg shadow-rose-950/30 hover:border-rose-500/60',
        icon: AlertTriangle
      }
    }

    // 2. Urgent (past 1-2 days) -> Orange
    if (diffDays < 0) {
      return {
        label: `URGENT (${Math.abs(diffDays)}D AGO)`,
        type: 'urgent',
        color: isLight ? 'bg-orange-100 text-orange-900 border-orange-300 font-bold' : 'bg-orange-500/20 text-orange-400 border-orange-500/50 shadow-sm shadow-orange-500/20 font-bold',
        cardClass: isLight ? 'bg-orange-50/80 border-orange-300 shadow-md hover:border-orange-400' : 'bg-orange-950/20 border-orange-500/40 shadow-lg shadow-orange-950/30 hover:border-orange-500/60',
        icon: ShieldAlert
      }
    }

    // 3. Current (today & tomorrow) -> Green
    if (diffDays === 0 || diffDays === 1) {
      return {
        label: diffDays === 0 ? 'CURRENT (TODAY)' : 'CURRENT (TOMORROW)',
        type: 'current',
        color: isLight ? 'bg-emerald-100 text-emerald-900 border-emerald-300 font-bold' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-bold',
        cardClass: isLight ? 'bg-emerald-50/50 border-emerald-300 shadow-sm hover:border-emerald-400' : 'bg-emerald-950/20 border-emerald-500/30 shadow-md hover:border-emerald-500/50',
        icon: CheckCircle2
      }
    }

    // 4. Upcoming (3+ days from today) -> Yellow
    return {
      label: `UPCOMING (IN ${diffDays}D)`,
      type: 'upcoming',
      color: isLight ? 'bg-yellow-100 text-yellow-900 border-yellow-300 font-bold' : 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40 font-bold',
      cardClass: isLight ? 'bg-yellow-50/50 border-yellow-300 shadow-sm hover:border-yellow-400' : 'bg-yellow-950/20 border-yellow-500/30 shadow-md hover:border-yellow-500/50',
      icon: Clock
    }
  }

  // Filtered Tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter(t => {
      // Search filter
      const matchesSearch = !searchTerm ||
        t.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (t.description && t.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (t.assigned_to && t.assigned_to.toLowerCase().includes(searchTerm.toLowerCase()))

      if (!matchesSearch) return false

      // Archived Safe Zone Filter
      if (activeFilterTab === 'archived') {
        return t.status === 'archived'
      }

      // Active tabs MUST exclude archived tasks
      if (t.status === 'archived') return false

      // Filter tabs
      if (activeFilterTab === 'my') {
        return t.assigned_to === currentUser || (t.shared_user_ids && t.shared_user_ids.includes(currentUser))
      }
      if (activeFilterTab === 'group') {
        return t.assignment_type === 'group' || t.assigned_to === 'Group / All Team' || (t.shared_user_ids && t.shared_user_ids.length > 0)
      }
      if (activeFilterTab === 'overdue') {
        return getDeadlineStatus(t.due_date, t.status).type === 'overdue'
      }
      if (activeFilterTab === 'urgent') {
        return getDeadlineStatus(t.due_date, t.status).type === 'urgent'
      }
      if (activeFilterTab === 'current') {
        return getDeadlineStatus(t.due_date, t.status).type === 'current'
      }
      if (activeFilterTab === 'upcoming') {
        return getDeadlineStatus(t.due_date, t.status).type === 'upcoming'
      }

      return true
    })
  }, [tasks, searchTerm, activeFilterTab, currentUser])

  // Pagination Slice
  const totalPages = Math.ceil(filteredTasks.length / itemsPerPage) || 1
  const paginatedTasks = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return filteredTasks.slice(start, start + itemsPerPage)
  }, [filteredTasks, currentPage, itemsPerPage])

  // KPI Metrics (Active vs Archived)
  const activeTasks = tasks.filter(t => t.status !== 'archived')
  const archivedTasks = tasks.filter(t => t.status === 'archived')
  const totalCount = activeTasks.length

  const overdueTasks = activeTasks.filter(t => t.status !== 'completed' && getDeadlineStatus(t.due_date, t.status).type === 'overdue')
  const urgentTasks = activeTasks.filter(t => t.status !== 'completed' && getDeadlineStatus(t.due_date, t.status).type === 'urgent')
  const currentTasks = activeTasks.filter(t => t.status !== 'completed' && getDeadlineStatus(t.due_date, t.status).type === 'current')
  const upcomingTasks = activeTasks.filter(t => t.status !== 'completed' && getDeadlineStatus(t.due_date, t.status).type === 'upcoming')

  const toggleExpand = (id) => {
    setExpandedTaskIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])
  }

  const handleCreateParentTask = (e) => {
    e.preventDefault()
    if (!taskForm.subject.trim()) return

    addTask({
      ...taskForm,
      assigned_to: taskForm.assignment_type === 'group' ? 'Group / All Team' : taskForm.assigned_to,
      financial_weight: Number(taskForm.financial_weight) || 0,
      creator_id: currentUser,
      children: []
    })

    setShowAddModal(false)
  }

  const handleCreateSubTask = (e) => {
    e.preventDefault()
    if (!subTaskModalParentId || !subTaskForm.subject.trim()) return

    addSubTask(subTaskModalParentId, subTaskForm)
    setSubTaskModalParentId(null)
  }

  const handleCompleteSubmit = (e) => {
    e.preventDefault()
    if (!resolutionTarget) return
    completeTask(resolutionTarget.id, resolutionNote || 'Task marked completed.')
    setResolutionTarget(null)
    setResolutionNote('')
  }

  const handleConfirmArchive = (e) => {
    e.preventDefault()
    if (!archiveTarget) return
    archiveTask(archiveTarget.id, archiveReasonInput || 'Moved to safe zone for verification')
    setArchiveTarget(null)
    setArchiveReasonInput('')
  }

  const handleConfirmPermanentDelete = () => {
    if (!permanentDeleteTarget) return
    permanentlyDeleteTask(permanentDeleteTarget.id)
    setPermanentDeleteTarget(null)
  }

  return (
    <div className="space-y-6 font-sans">
      
      {/* Executive Header */}
      <div className={`p-6 rounded-3xl border transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-4 ${
        isLight ? 'bg-white border-slate-200 shadow-xl' : 'bg-[#070b14]/90 border-white/10 shadow-2xl backdrop-blur-xl'
      }`}>
        <div>
          <div className={`text-[10px] font-mono font-bold tracking-[3px] uppercase ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            Fuse CRM Suite <span className="text-[#c9a84c]">/</span> Task Management
          </div>
          <h1 className={`text-2xl md:text-3xl font-serif font-light mt-0.5 ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
            Tasks &amp; Follow-up Reminders
          </h1>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 bg-gradient-to-r from-[#6366f1] via-[#06b6d4] to-[#c9a84c] text-white font-semibold rounded-xl text-xs tracking-wider uppercase hover:opacity-90 transition-all flex items-center gap-2 shadow-lg shadow-[#6366f1]/20 cursor-pointer"
        >
          <Plus size={16} />
          <span>Create New Task</span>
        </button>
      </div>

      {/* KPI Metrics Ribbon — 4-Level Color Coding Strategy */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* 1. Overdue (+3D Ago) — RED */}
        <div className={`p-5 rounded-2xl border transition-all ${
          isLight ? 'bg-white border-rose-200 shadow-lg' : 'bg-[#0f172a]/80 border-rose-500/30 shadow-xl'
        }`}>
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-rose-500 font-bold">OVERDUE (&gt;3D AGO)</span>
            <AlertTriangle size={16} className="text-rose-500 animate-pulse" />
          </div>
          <h2 className="text-2xl font-serif text-rose-500 mt-2">{overdueTasks.length}</h2>
          <p className={`text-[11px] font-mono mt-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            Critical past deadline
          </p>
        </div>

        {/* 2. Urgent (1-2D Ago) — ORANGE */}
        <div className={`p-5 rounded-2xl border transition-all ${
          isLight ? 'bg-white border-orange-200 shadow-lg' : 'bg-[#0f172a]/80 border-orange-500/30 shadow-xl'
        }`}>
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-orange-500 font-bold">URGENT (1-2D AGO)</span>
            <ShieldAlert size={16} className="text-orange-500" />
          </div>
          <h2 className="text-2xl font-serif text-orange-500 mt-2">{urgentTasks.length}</h2>
          <p className={`text-[11px] font-mono mt-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            Requires fast resolution
          </p>
        </div>

        {/* 3. Current (Today & Tomorrow) — GREEN */}
        <div className={`p-5 rounded-2xl border transition-all ${
          isLight ? 'bg-white border-emerald-200 shadow-lg' : 'bg-[#0f172a]/80 border-emerald-500/30 shadow-xl'
        }`}>
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-emerald-500 font-bold">CURRENT (TODAY / D+1)</span>
            <CheckCircle2 size={16} className="text-emerald-500" />
          </div>
          <h2 className="text-2xl font-serif text-emerald-500 mt-2">{currentTasks.length}</h2>
          <p className={`text-[11px] font-mono mt-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            Active schedule for today
          </p>
        </div>

        {/* 4. Upcoming (3+ Days Away) — YELLOW */}
        <div className={`p-5 rounded-2xl border transition-all ${
          isLight ? 'bg-white border-yellow-200 shadow-lg' : 'bg-[#0f172a]/80 border-yellow-500/30 shadow-xl'
        }`}>
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-yellow-500 font-bold">UPCOMING (+3D AWAY)</span>
            <Clock size={16} className="text-yellow-500" />
          </div>
          <h2 className="text-2xl font-serif text-yellow-500 mt-2">{upcomingTasks.length}</h2>
          <p className={`text-[11px] font-mono mt-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            Scheduled future tasks
          </p>
        </div>

      </div>

      {/* Filter Tabs & Search Bar */}
      <div className={`p-5 rounded-2xl border transition-all space-y-4 ${
        isLight ? 'bg-white border-slate-200 shadow-xl' : 'bg-[#0f172a]/80 border-white/10 shadow-2xl'
      }`}>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Navigation Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <button
              onClick={() => { setActiveFilterTab('all'); setCurrentPage(1); }}
              className={`px-3 py-1.5 rounded-xl font-mono text-xs transition-all ${
                activeFilterTab === 'all'
                  ? 'bg-[#6366f1] text-white font-bold shadow-md'
                  : isLight ? 'bg-slate-100 text-slate-700 hover:bg-slate-200' : 'bg-slate-900 text-slate-300 hover:text-white'
              }`}
            >
              All Tasks ({activeTasks.length})
            </button>

            <button
              onClick={() => { setActiveFilterTab('my'); setCurrentPage(1); }}
              className={`px-3 py-1.5 rounded-xl font-mono text-xs transition-all flex items-center gap-1.5 ${
                activeFilterTab === 'my'
                  ? 'bg-[#6366f1] text-white font-bold shadow-md'
                  : isLight ? 'bg-slate-100 text-slate-700 hover:bg-slate-200' : 'bg-slate-900 text-slate-300 hover:text-white'
              }`}
            >
              <UserCheck size={14} />
              <span>My Tasks ({tasks.filter(t => t.assigned_to === currentUser).length})</span>
            </button>

            <button
              onClick={() => { setActiveFilterTab('group'); setCurrentPage(1); }}
              className={`px-3 py-1.5 rounded-xl font-mono text-xs transition-all flex items-center gap-1.5 ${
                activeFilterTab === 'group'
                  ? 'bg-[#6366f1] text-white font-bold shadow-md'
                  : isLight ? 'bg-slate-100 text-slate-700 hover:bg-slate-200' : 'bg-slate-900 text-slate-300 hover:text-white'
              }`}
            >
              <Users size={14} />
              <span>Group / Team Tasks</span>
            </button>

            {/* Overdue (Red) */}
            <button
              onClick={() => { setActiveFilterTab('overdue'); setCurrentPage(1); }}
              className={`px-3 py-1.5 rounded-xl font-mono text-xs transition-all flex items-center gap-1.5 ${
                activeFilterTab === 'overdue'
                  ? 'bg-rose-600 text-white font-bold shadow-md'
                  : isLight ? 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100' : 'bg-rose-950/40 text-rose-400 border border-rose-500/30'
              }`}
            >
              <AlertTriangle size={14} />
              <span>Overdue ({overdueTasks.length})</span>
            </button>

            {/* Urgent (Orange) */}
            <button
              onClick={() => { setActiveFilterTab('urgent'); setCurrentPage(1); }}
              className={`px-3 py-1.5 rounded-xl font-mono text-xs transition-all flex items-center gap-1.5 ${
                activeFilterTab === 'urgent'
                  ? 'bg-orange-600 text-white font-bold shadow-md'
                  : isLight ? 'bg-orange-50 text-orange-700 border border-orange-200 hover:bg-orange-100' : 'bg-orange-950/40 text-orange-400 border border-orange-500/30'
              }`}
            >
              <ShieldAlert size={14} />
              <span>Urgent ({urgentTasks.length})</span>
            </button>

            {/* Current (Green) */}
            <button
              onClick={() => { setActiveFilterTab('current'); setCurrentPage(1); }}
              className={`px-3 py-1.5 rounded-xl font-mono text-xs transition-all flex items-center gap-1.5 ${
                activeFilterTab === 'current'
                  ? 'bg-emerald-600 text-white font-bold shadow-md'
                  : isLight ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100' : 'bg-emerald-950/40 text-emerald-400 border border-emerald-500/30'
              }`}
            >
              <CheckCircle2 size={14} />
              <span>Current ({currentTasks.length})</span>
            </button>

            {/* Upcoming (Yellow) */}
            <button
              onClick={() => { setActiveFilterTab('upcoming'); setCurrentPage(1); }}
              className={`px-3 py-1.5 rounded-xl font-mono text-xs transition-all flex items-center gap-1.5 ${
                activeFilterTab === 'upcoming'
                  ? 'bg-yellow-600 text-white font-bold shadow-md'
                  : isLight ? 'bg-yellow-50 text-yellow-800 border border-yellow-200 hover:bg-yellow-100' : 'bg-yellow-950/40 text-yellow-300 border border-yellow-500/30'
              }`}
            >
              <Clock size={14} />
              <span>Upcoming ({upcomingTasks.length})</span>
            </button>

            <button
              onClick={() => { setActiveFilterTab('archived'); setCurrentPage(1); }}
              className={`px-3 py-1.5 rounded-xl font-mono text-xs transition-all flex items-center gap-1.5 ${
                activeFilterTab === 'archived'
                  ? 'bg-slate-700 text-white font-bold shadow-md'
                  : isLight ? 'bg-slate-100 text-slate-800 border border-slate-200 hover:bg-slate-200' : 'bg-slate-900 text-slate-300 border border-white/10'
              }`}
            >
              <Archive size={14} />
              <span>Archived Safe Zone ({archivedTasks.length})</span>
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search size={14} className={`absolute left-3 top-3 ${isLight ? 'text-slate-400' : 'text-slate-500'}`} />
            <input
              type="text"
              placeholder="Search title, details, assigned user..."
              value={searchTerm}
              onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className={`w-full border rounded-xl pl-9 pr-3 py-2 text-xs font-mono outline-none focus:border-[#6366f1] transition-all ${
                isLight ? 'bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400' : 'bg-slate-950 border-white/10 text-slate-100 placeholder:text-slate-500'
              }`}
            />
          </div>
        </div>

        {/* Task List */}
        <div className="space-y-4">
          {paginatedTasks.length > 0 ? (
            paginatedTasks.map(task => {
              const isExpanded = expandedTaskIds.includes(task.id)
              const deadline = getDeadlineStatus(task.due_date, task.status)
              const DeadlineIcon = deadline.icon
              const subtasks = task.children || []
              const completedSubtasksCount = subtasks.filter(s => s.status === 'completed').length
              const subtaskPct = subtasks.length > 0 ? Math.round((completedSubtasksCount / subtasks.length) * 100) : 0

              return (
                <div
                  key={task.id}
                  className={`rounded-2xl border transition-all duration-300 overflow-hidden ${deadline.cardClass}`}
                >
                  {/* Task Card Main Row */}
                  <div className="p-4 md:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      
                      {/* Expand / Collapse Subtasks Button */}
                      <button
                        onClick={() => toggleExpand(task.id)}
                        className={`p-1.5 rounded-lg border mt-0.5 transition-all flex-shrink-0 ${
                          isLight ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100' : 'bg-slate-950 border-white/10 text-slate-300 hover:text-white'
                        }`}
                        title={isExpanded ? 'Collapse Sub-tasks' : 'Expand Sub-tasks'}
                      >
                        {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                      </button>

                      <div className="space-y-1 flex-1 min-w-0">
                        {/* Title & Status Badges */}
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className={`text-base font-bold font-sans truncate ${
                            task.status === 'completed'
                              ? 'line-through text-slate-400'
                              : (isLight ? 'text-slate-900' : 'text-slate-100')
                          }`}>
                            {task.subject}
                          </h3>

                          {/* Deadline Warning Badge */}
                          <span className={`px-3 py-1 rounded-xl text-xs font-mono font-black tracking-wider border flex items-center gap-1.5 uppercase shadow-md ${deadline.color}`}>
                            <DeadlineIcon size={14} className="animate-pulse" />
                            <span>{deadline.label}</span>
                          </span>

                          {/* Priority Badge */}
                          <span className={`px-2.5 py-1 rounded-xl text-[10px] font-mono font-black uppercase tracking-wider ${
                            task.priority === 'urgent' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 shadow-sm' :
                            task.priority === 'high' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 shadow-sm' :
                            'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                          }`}>
                            {task.priority}
                          </span>

                          {/* Assignment Badge */}
                          <span className={`px-2.5 py-1 rounded-xl text-[10px] font-mono font-bold border flex items-center gap-1 ${
                            task.assigned_to === 'Group / All Team'
                              ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                              : isLight ? 'bg-slate-200 text-slate-800 border-slate-300' : 'bg-slate-800 text-slate-300 border-white/10'
                          }`}>
                            <UserCheck size={12} />
                            <span>{task.assigned_to}</span>
                          </span>
                        </div>

                        {/* Description */}
                        {task.description && (
                          <p className={`text-xs font-mono line-clamp-2 ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                            {task.description}
                          </p>
                        )}

                        {/* Sub-tasks Progress bar indicator */}
                        {subtasks.length > 0 && (
                          <div className="pt-1.5 flex items-center gap-3 font-mono text-[11px]">
                            <span className={isLight ? 'text-slate-500' : 'text-slate-400'}>
                              Subtasks: <strong className={isLight ? 'text-slate-800' : 'text-slate-200'}>{completedSubtasksCount}/{subtasks.length} Done</strong> ({subtaskPct}%)
                            </span>
                            <div className={`w-32 h-2 rounded-full overflow-hidden border ${isLight ? 'bg-slate-200 border-slate-300' : 'bg-slate-950 border-white/10'}`}>
                              <div
                                className="h-full bg-gradient-to-r from-[#6366f1] to-emerald-500 rounded-full transition-all duration-500"
                                style={{ width: `${subtaskPct}%` }}
                              />
                            </div>
                          </div>
                        )}

                        {/* High-Impact Pronounced Deadline & Financial Metadata Banner */}
                        <div className="pt-2 flex flex-wrap items-center gap-3 font-mono">
                          <div className={`px-3 py-1.5 rounded-xl border flex items-center gap-2 shadow-md transition-all ${
                            deadline.type === 'overdue'
                              ? (isLight ? 'bg-rose-100 border-rose-400 text-rose-950 font-black' : 'bg-rose-950/60 border-rose-500/70 text-rose-300 shadow-rose-950/50')
                              : deadline.type === 'urgent'
                                ? (isLight ? 'bg-orange-100 border-orange-400 text-orange-950 font-black' : 'bg-orange-950/60 border-orange-500/70 text-orange-300 shadow-orange-950/50')
                                : deadline.type === 'current'
                                  ? (isLight ? 'bg-emerald-100 border-emerald-400 text-emerald-950 font-black' : 'bg-emerald-950/60 border-emerald-500/70 text-emerald-300 shadow-emerald-950/50')
                                  : deadline.type === 'completed'
                                    ? (isLight ? 'bg-slate-200 border-slate-300 text-slate-700 font-bold' : 'bg-slate-900 border-white/10 text-slate-400 font-bold')
                                    : (isLight ? 'bg-amber-100 border-amber-300 text-amber-950 font-black' : 'bg-amber-950/40 border-[#c9a84c]/50 text-[#c9a84c]')
                          }`}>
                            <Calendar size={15} className="shrink-0 animate-pulse text-[#c9a84c]" />
                            <span className="text-[10px] tracking-wider uppercase font-black opacity-80">DEADLINE / DUE:</span>
                            <span className="text-xs font-black tracking-widest font-mono drop-shadow">{task.due_date || 'NO DEADLINE SET'}</span>
                          </div>

                          {task.financial_weight > 0 && (
                            <div className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-bold ${
                              isLight ? 'bg-amber-50 border-amber-200 text-amber-900' : 'bg-amber-950/20 border-[#c9a84c]/30 text-[#c9a84c]'
                            }`}>
                              Weight: KES {(task.financial_weight).toLocaleString()}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Action Control Buttons */}
                    <div className="flex items-center justify-end gap-2 flex-shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-white/10">
                      {task.status !== 'archived' ? (
                        <>
                          {/* Add Subtask Button */}
                          <button
                            onClick={() => setSubTaskModalParentId(task.id)}
                            className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-semibold flex items-center gap-1.5 transition-all ${
                              isLight
                                ? 'bg-slate-100 border-slate-300 text-slate-800 hover:bg-slate-200'
                                : 'bg-slate-900 border-white/10 text-slate-300 hover:text-white hover:border-[#c9a84c]'
                            }`}
                            title="Add Sub-task under this parent task"
                          >
                            <Plus size={14} className="text-[#c9a84c]" />
                            <span>Add Subtask</span>
                          </button>

                          {/* Complete Task Button */}
                          {task.status !== 'completed' ? (
                            <button
                              onClick={() => setResolutionTarget(task)}
                              className="px-3.5 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl text-xs font-mono font-bold uppercase tracking-wider hover:opacity-90 transition-all flex items-center gap-1.5 shadow-md shadow-emerald-600/20"
                            >
                              <CheckCircle2 size={14} />
                              <span>Mark Complete</span>
                            </button>
                          ) : (
                            <span className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 text-xs font-mono font-bold flex items-center gap-1">
                              <CheckCircle2 size={14} />
                              <span>Completed</span>
                            </span>
                          )}

                          {/* Archive Task to Safe Zone */}
                          <button
                            onClick={() => setArchiveTarget(task)}
                            className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                              isLight ? 'bg-amber-50 border-amber-300 text-amber-800 hover:bg-amber-100' : 'bg-amber-950/40 border-amber-500/30 text-amber-300 hover:text-white'
                            }`}
                            title="Move Task to Archived Safe Zone"
                          >
                            <Archive size={14} />
                            <span>Archive</span>
                          </button>

                          {/* Delete Task Button */}
                          <button
                            onClick={() => setPermanentDeleteTarget(task)}
                            className={`p-1.5 rounded-xl border transition-all cursor-pointer ${
                              isLight ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border-rose-200' : 'bg-rose-950/40 text-rose-400 hover:text-white border-rose-500/30'
                            }`}
                            title="Delete Task (Triggers Confirmation Warning)"
                          >
                            <Trash2 size={14} />
                          </button>
                        </>
                      ) : (
                        <>
                          {/* Verify & Restore Task */}
                          <button
                            onClick={() => restoreTask(task.id)}
                            className="px-3.5 py-1.5 bg-gradient-to-r from-[#6366f1] to-cyan-500 text-white rounded-xl text-xs font-mono font-bold uppercase tracking-wider hover:opacity-90 transition-all flex items-center gap-1.5 shadow-md"
                            title="Verify and restore task back to active list"
                          >
                            <RotateCcw size={14} />
                            <span>Verify &amp; Restore</span>
                          </button>

                          {/* Permanent Delete Task */}
                          <button
                            onClick={() => setPermanentDeleteTarget(task)}
                            className="px-3 py-1.5 bg-rose-600/20 border border-rose-500/40 text-rose-400 rounded-xl text-xs font-mono font-bold hover:bg-rose-600 hover:text-white transition-all flex items-center gap-1"
                            title="Permanently Delete Task"
                          >
                            <Trash2 size={14} />
                            <span>Permanent Delete</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Sub-tasks Accordion Section */}
                  {isExpanded && (
                    <div className={`p-4 border-t space-y-2.5 transition-all ${
                      isLight ? 'bg-slate-100/60 border-slate-200' : 'bg-slate-950/60 border-white/10'
                    }`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-xs font-mono font-bold uppercase flex items-center gap-1.5 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                          <CornerDownRight size={14} className="text-[#c9a84c]" />
                          <span>Attached Sub-tasks ({subtasks.length})</span>
                        </span>

                        <button
                          onClick={() => setSubTaskModalParentId(task.id)}
                          className="text-[11px] font-mono text-[#6366f1] font-bold hover:underline flex items-center gap-1"
                        >
                          <Plus size={12} />
                          <span>Add New Sub-task</span>
                        </button>
                      </div>

                      {subtasks.length > 0 ? (
                        subtasks.map(sub => (
                          <div
                            key={sub.id}
                            className={`p-3 rounded-xl border flex items-center justify-between gap-3 font-mono text-xs transition-all ${
                              sub.status === 'completed'
                                ? (isLight ? 'bg-emerald-50/60 border-emerald-200' : 'bg-emerald-950/20 border-emerald-500/30')
                                : (isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-white/10')
                            }`}
                          >
                            <div className="flex items-start gap-2.5 flex-1 min-w-0">
                              <input
                                type="checkbox"
                                checked={sub.status === 'completed'}
                                onChange={() => toggleSubTask(task.id, sub.id)}
                                className="mt-1 w-4 h-4 rounded text-[#6366f1] cursor-pointer"
                              />

                              <div className="space-y-0.5 flex-1 min-w-0">
                                <span className={`font-semibold block truncate ${
                                  sub.status === 'completed' ? 'line-through text-slate-400' : (isLight ? 'text-slate-800' : 'text-slate-200')
                                }`}>
                                  {sub.subject}
                                </span>
                                {sub.description && (
                                  <p className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                                    {sub.description}
                                  </p>
                                )}
                                {sub.resolution_note && (
                                  <p className="text-[10px] text-emerald-600 font-mono italic">
                                    Resolution: {sub.resolution_note}
                                  </p>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-3 flex-shrink-0 text-[10px]">
                              <span className={`px-2 py-0.5 rounded border ${isLight ? 'bg-slate-100 text-slate-700 border-slate-300' : 'bg-slate-800 text-slate-300 border-white/10'}`}>
                                Assigned: {sub.assigned_to}
                              </span>

                              <span className={sub.status === 'completed' ? 'text-emerald-600 font-bold' : 'text-amber-500 font-bold'}>
                                ● {sub.status === 'completed' ? 'Completed' : 'Pending'}
                              </span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className={`p-4 rounded-xl border text-center font-mono text-xs ${
                          isLight ? 'bg-white border-slate-200 text-slate-500' : 'bg-slate-900/40 border-white/5 text-slate-400'
                        }`}>
                          No sub-tasks attached yet. Click "Add Subtask" to assign sub-tasks.
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })
          ) : (
            <div className={`p-8 rounded-2xl border text-center font-mono text-xs ${
              isLight ? 'bg-white border-slate-200 text-slate-500' : 'bg-[#0f172a]/80 border-white/10 text-slate-400'
            }`}>
              No tasks found matching your active filter criteria.
            </div>
          )}
        </div>

        {/* Universal Pagination */}
        <UniversalPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredTasks.length}
          itemsPerPage={itemsPerPage}
          onPageChange={page => setCurrentPage(page)}
          onItemsPerPageChange={size => {
            setItemsPerPage(size)
            setCurrentPage(1)
          }}
          pageSizeOptions={[5, 10, 20]}
        />
      </div>

      {/* --- MODAL 1: Create New Parent Task --- */}
      {showAddModal && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto crm-scroll">
          <div className={`w-full max-w-xl my-auto p-6 rounded-3xl border shadow-2xl transition-all font-sans relative ${
            isLight
              ? 'bg-white border-[#c9a84c]/60 text-slate-900 shadow-[0_0_30px_rgba(201,168,76,0.25)]'
              : 'bg-[#0f172a] border-[#c9a84c]/40 text-slate-100 shadow-[0_0_35px_rgba(201,168,76,0.3)]'
          }`}>
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute right-5 top-5 p-1.5 rounded-full hover:bg-white/10 transition-colors text-slate-400"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-3 mb-4 border-b pb-3 border-white/10">
              <div className="p-3 rounded-xl bg-[#6366f1]/10 text-[#6366f1] border border-[#6366f1]/30">
                <CheckSquare size={22} />
              </div>
              <div>
                <h3 className="text-xl font-serif font-light">Create New CRM Task</h3>
                <p className={`text-xs font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                  Assign tasks to individuals or group team members with automated deadline alerts.
                </p>
              </div>
            </div>

            <form onSubmit={handleCreateParentTask} className="space-y-4 font-mono text-xs">
              {/* Task Subject / Title */}
              <div>
                <label className={`block font-bold mb-1.5 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                  Task Title / Subject <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Schedule Coastline Tours Safari Roof Demo"
                  value={taskForm.subject}
                  onChange={e => setTaskForm({ ...taskForm, subject: e.target.value })}
                  className={`w-full border rounded-xl px-3 py-2.5 outline-none transition-all ${
                    isLight ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-[#6366f1]' : 'bg-slate-950 border-white/10 text-slate-100 focus:border-[#c9a84c]'
                  }`}
                />
              </div>

              {/* Task Description */}
              <div>
                <label className={`block font-bold mb-1.5 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                  Task Description &amp; Instructions
                </label>
                <textarea
                  rows={3}
                  placeholder="Provide detailed instructions, customer notes, or specific deliverables..."
                  value={taskForm.description}
                  onChange={e => setTaskForm({ ...taskForm, description: e.target.value })}
                  className={`w-full border rounded-xl p-3 outline-none transition-all ${
                    isLight ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-[#6366f1]' : 'bg-slate-950 border-white/10 text-slate-100 focus:border-[#c9a84c]'
                  }`}
                />
              </div>

              {/* Assignment Type & User Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={`block font-bold mb-1.5 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                    Assignment Scope
                  </label>
                  <PredictiveSelect
                    options={[
                      { value: 'individual', label: 'Assign to Individual User' },
                      { value: 'group', label: 'Group Assignment (All Team Members)' }
                    ]}
                    value={taskForm.assignment_type}
                    onChange={val => setTaskForm({ ...taskForm, assignment_type: val || 'individual' })}
                    isLight={isLight}
                  />
                </div>

                {taskForm.assignment_type === 'individual' && (
                  <div>
                    <label className={`block font-bold mb-1.5 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                      Assigned Executive
                    </label>
                    <PredictiveSelect
                      options={teamUsersOptions.length > 0 ? teamUsersOptions : TEAM_USERS}
                      value={taskForm.assigned_to}
                      onChange={val => setTaskForm({ ...taskForm, assigned_to: val || 'Alex Kimani' })}
                      isLight={isLight}
                    />
                  </div>
                )}
              </div>

              {/* Deadline & Priority */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={`block font-bold mb-1.5 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                    Deadline Date <span className="text-rose-500">*</span>
                  </label>
                  <ModernDatePicker
                    value={(taskForm.due_date || '').split(' ')[0]}
                    onChange={val => {
                      const timePart = (taskForm.due_date || '').split(' ')[1] || '14:00'
                      setTaskForm({ ...taskForm, due_date: `${val} ${timePart}` })
                    }}
                    isLight={isLight}
                    presets={true}
                  />
                </div>

                <div>
                  <label className={`block font-bold mb-1.5 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                    Deadline Time
                  </label>
                  <StyledTimePicker
                    value={(taskForm.due_date || '').split(' ')[1] || '14:00'}
                    onChange={val => {
                      const datePart = (taskForm.due_date || '').split(' ')[0] || new Date().toISOString().split('T')[0]
                      const time24 = val.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i)
                        ? (() => { let h = parseInt(val); const m = val.match(/:([0-9]{2})/)[1]; const pm = /PM/i.test(val); if (pm && h < 12) h += 12; if (!pm && h === 12) h = 0; return `${String(h).padStart(2,'0')}:${m}` })()
                        : val
                      setTaskForm({ ...taskForm, due_date: `${datePart} ${time24}` })
                    }}
                    isLight={isLight}
                    use12Hour={false}
                  />
                </div>

                <div>
                  <label className={`block font-bold mb-1.5 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                    Priority Level
                  </label>
                  <PredictiveSelect
                    options={[
                      { value: 'urgent', label: '🔴 Urgent Priority' },
                      { value: 'high', label: '🟠 High Priority' },
                      { value: 'medium', label: '🔵 Medium Priority' },
                      { value: 'low', label: '⚪ Low Priority' }
                    ]}
                    value={taskForm.priority}
                    onChange={val => setTaskForm({ ...taskForm, priority: val || 'high' })}
                    isLight={isLight}
                  />
                </div>
              </div>

              {/* Related Opportunity or Lead */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={`block font-bold mb-1.5 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                    Related Deal / Client
                  </label>
                  <PredictiveSelect
                    options={[
                      ...opportunities.map(o => ({ value: o.id, label: o.name, badge: 'Deal' })),
                      ...leads.map(l => ({ value: l.id, label: `${l.name} (${l.company || 'Client'})`, badge: 'Lead' }))
                    ]}
                    value={taskForm.taskable_id}
                    onChange={val => setTaskForm({ ...taskForm, taskable_id: val || 'opp-1' })}
                    isLight={isLight}
                  />
                </div>

                <div>
                  <label className={`block font-bold mb-1.5 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                    Financial Weight (KES)
                  </label>
                  <input
                    type="number"
                    value={taskForm.financial_weight}
                    onChange={e => setTaskForm({ ...taskForm, financial_weight: e.target.value })}
                    className={`w-full border rounded-xl px-3 py-2.5 outline-none transition-all ${
                      isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-950 border-white/10 text-slate-100'
                    }`}
                  />
                </div>
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className={`px-4 py-2 rounded-xl border font-bold ${
                    isLight ? 'border-slate-300 text-slate-700 hover:bg-slate-100' : 'border-white/10 text-slate-300 hover:bg-white/5'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#6366f1] via-[#06b6d4] to-[#c9a84c] text-white font-bold text-xs uppercase tracking-wider hover:opacity-90 transition-all shadow-lg shadow-[#6366f1]/20 cursor-pointer"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL 2: Attach Sub-task to Parent Task --- */}
      {subTaskModalParentId && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
          <div className={`w-full max-w-lg p-6 rounded-3xl border shadow-2xl transition-all font-sans relative ${
            isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#0f172a] border-white/10 text-slate-100'
          }`}>
            <button
              onClick={() => setSubTaskModalParentId(null)}
              className="absolute right-5 top-5 p-1.5 rounded-full hover:bg-white/10 transition-colors text-slate-400"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-3 mb-4 border-b pb-3 border-white/10">
              <div className="p-3 rounded-xl bg-[#c9a84c]/10 text-[#c9a84c] border border-[#c9a84c]/30">
                <CornerDownRight size={22} />
              </div>
              <div>
                <h3 className="text-xl font-serif font-light">Attach Sub-task</h3>
                <p className={`text-xs font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                  Parent Task ID: <span className="text-[#c9a84c] font-bold">{subTaskModalParentId}</span>
                </p>
              </div>
            </div>

            <form onSubmit={handleCreateSubTask} className="space-y-4 font-mono text-xs">
              <div>
                <label className={`block font-bold mb-1.5 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                  Sub-task Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Verify Chassis Numbers at Port"
                  value={subTaskForm.subject}
                  onChange={e => setSubTaskForm({ ...subTaskForm, subject: e.target.value })}
                  className={`w-full border rounded-xl px-3 py-2.5 outline-none transition-all ${
                    isLight ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-[#6366f1]' : 'bg-slate-950 border-white/10 text-slate-100 focus:border-[#c9a84c]'
                  }`}
                />
              </div>

              <div>
                <label className={`block font-bold mb-1.5 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                  Sub-task Instructions
                </label>
                <textarea
                  rows={2}
                  placeholder="Detailed instructions for assigned team member..."
                  value={subTaskForm.description}
                  onChange={e => setSubTaskForm({ ...subTaskForm, description: e.target.value })}
                  className={`w-full border rounded-xl p-3 outline-none transition-all ${
                    isLight ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-[#6366f1]' : 'bg-slate-950 border-white/10 text-slate-100 focus:border-[#c9a84c]'
                  }`}
                />
              </div>

              <div>
                <label className={`block font-bold mb-1.5 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                  Assign Sub-task To
                </label>
                <PredictiveSelect
                  options={teamUsersOptions.length > 0 ? teamUsersOptions : TEAM_USERS}
                  value={subTaskForm.assigned_to}
                  onChange={val => setSubTaskForm({ ...subTaskForm, assigned_to: val || 'Michael Chen' })}
                  isLight={isLight}
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setSubTaskModalParentId(null)}
                  className={`px-4 py-2 rounded-xl border font-bold ${
                    isLight ? 'border-slate-300 text-slate-700 hover:bg-slate-100' : 'border-white/10 text-slate-300 hover:bg-white/5'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#6366f1] to-emerald-500 text-white font-bold text-xs uppercase tracking-wider hover:opacity-90 transition-all shadow-lg cursor-pointer"
                >
                  Add Sub-task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL 3: Mark Complete with Resolution Note --- */}
      {resolutionTarget && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
          <div className={`w-full max-w-md p-6 rounded-3xl border shadow-2xl transition-all font-sans relative ${
            isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#0f172a] border-white/10 text-slate-100'
          }`}>
            <button
              onClick={() => setResolutionTarget(null)}
              className="absolute right-5 top-5 p-1.5 rounded-full hover:bg-white/10 transition-colors text-slate-400"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-3 mb-4 border-b pb-3 border-white/10">
              <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/30">
                <CheckCircle2 size={22} />
              </div>
              <div>
                <h3 className="text-xl font-serif font-light">Complete Task</h3>
                <p className={`text-xs font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                  {resolutionTarget.subject}
                </p>
              </div>
            </div>

            <form onSubmit={handleCompleteSubmit} className="space-y-4 font-mono text-xs">
              <div>
                <label className={`block font-bold mb-1.5 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                  Resolution Notes &amp; Outcome Summary
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Record deal outcome, customer confirmation, or resolution summary..."
                  value={resolutionNote}
                  onChange={e => setResolutionNote(e.target.value)}
                  className={`w-full border rounded-xl p-3 outline-none transition-all ${
                    isLight ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-emerald-500' : 'bg-slate-950 border-white/10 text-slate-100 focus:border-emerald-500'
                  }`}
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setResolutionTarget(null)}
                  className={`px-4 py-2 rounded-xl border font-bold ${
                    isLight ? 'border-slate-300 text-slate-700 hover:bg-slate-100' : 'border-white/10 text-slate-300 hover:bg-white/5'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs uppercase tracking-wider hover:bg-emerald-500 transition-all shadow-lg cursor-pointer"
                >
                  Mark Completed
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL 4: Archive Task Confirmation & Verification Warning Modal --- */}
      {archiveTarget && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className={`w-full max-w-md p-6 rounded-3xl border shadow-2xl transition-all font-sans relative ${
            isLight ? 'bg-white border-amber-200 text-slate-900' : 'bg-[#0f172a] border-amber-500/30 text-slate-100'
          }`}>
            <button
              onClick={() => setArchiveTarget(null)}
              className="absolute right-5 top-5 p-1.5 rounded-full hover:bg-white/10 transition-colors text-slate-400"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-3 mb-4 border-b pb-3 border-white/10">
              <div className="p-3 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/30">
                <Archive size={24} />
              </div>
              <div>
                <h3 className="text-xl font-serif font-light text-amber-500">Archive Task to Safe Zone</h3>
                <p className={`text-xs font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                  Verification Safe Zone Protocol
                </p>
              </div>
            </div>

            <form onSubmit={handleConfirmArchive} className="space-y-4 font-mono text-xs">
              <div className={`p-3.5 rounded-2xl border ${
                isLight ? 'bg-amber-50 border-amber-200 text-amber-900' : 'bg-amber-950/30 border-amber-500/20 text-amber-300'
              }`}>
                <p className="font-bold flex items-center gap-1.5 mb-1">
                  <ShieldCheck size={14} className="text-amber-500" />
                  <span>Task Safeguard Notice:</span>
                </p>
                <p className="text-[11px] leading-relaxed">
                  Moving <strong className="underline">{archiveTarget.subject}</strong> to the Archived Safe Zone removes it from active queues while preserving full task history and sub-tasks for future verification.
                </p>
              </div>

              <div>
                <label className={`block font-bold mb-1.5 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                  Archive &amp; Safeguard Reason (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Awaiting client trade-in document verification"
                  value={archiveReasonInput}
                  onChange={e => setArchiveReasonInput(e.target.value)}
                  className={`w-full border rounded-xl px-3 py-2 text-xs font-mono outline-none ${
                    isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-950 border-white/10 text-slate-100'
                  }`}
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setArchiveTarget(null)}
                  className={`px-4 py-2 rounded-xl border font-bold ${
                    isLight ? 'border-slate-300 text-slate-700 hover:bg-slate-100' : 'border-white/10 text-slate-300 hover:bg-white/5'
                  }`}
                >
                  Cancel Keep Active
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-600 text-white font-bold uppercase tracking-wider hover:bg-amber-500 transition-all shadow-lg cursor-pointer flex items-center gap-1.5"
                >
                  <Archive size={14} />
                  <span>Archive Task</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL 5: Critical Permanent Delete Warning Modal --- */}
      {permanentDeleteTarget && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className={`w-full max-w-md p-6 rounded-3xl border shadow-2xl transition-all font-sans relative text-center ${
            isLight ? 'bg-white border-rose-300 text-slate-900' : 'bg-[#0f172a] border-rose-500/30 text-slate-100'
          }`}>
            <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-500 flex items-center justify-center shadow-lg shadow-rose-500/10">
              <ShieldAlert size={28} />
            </div>

            <h3 className="text-xl font-serif font-light text-rose-500">Critical Permanent Deletion!</h3>
            <p className={`text-xs font-mono mt-2 ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
              Are you sure you want to permanently delete task <span className="font-bold text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/20">{permanentDeleteTarget.subject}</span>?
            </p>
            <p className="text-[11px] font-mono text-rose-400/80 mt-1 font-bold">
              ⚠️ Warning: This action cannot be undone. All attached sub-tasks will be permanently destroyed.
            </p>

            <div className="flex items-center justify-center gap-3 mt-6 pt-3 border-t border-white/10 font-mono text-xs">
              <button
                type="button"
                onClick={() => setPermanentDeleteTarget(null)}
                className={`px-5 py-2.5 rounded-xl border font-bold ${
                  isLight ? 'border-slate-300 text-slate-700 hover:bg-slate-100' : 'border-white/10 text-slate-300 hover:bg-white/5'
                }`}
              >
                Cancel Keep Archived
              </button>
              <button
                type="button"
                onClick={handleConfirmPermanentDelete}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 text-white font-bold uppercase tracking-wider hover:opacity-90 transition-all shadow-lg shadow-rose-600/30 flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 size={14} />
                <span>Yes Permanent Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
