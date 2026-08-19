import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCRMStore } from '../../context/CRMStore'
import {
  CheckSquare, X, Clock, AlertTriangle, User, DollarSign,
  CheckCircle2, CornerDownRight, ExternalLink, Calendar, Bell, ChevronDown
} from 'lucide-react'

export default function TaskDetailModal({ task, onClose, onAcknowledge }) {
  const navigate = useNavigate()
  const completeTask = useCRMStore(state => state.completeTask)
  const toggleSubTask = useCRMStore(state => state.toggleSubTask)
  const snoozeTaskReminder = useCRMStore(state => state.snoozeTaskReminder)
  const adminTheme = useCRMStore(state => state.adminTheme)
  const isLight = adminTheme === 'light'

  const [resolutionNote, setResolutionNote] = useState('')
  const [showResolutionBox, setShowResolutionBox] = useState(false)
  const [snoozeOpen, setSnoozeOpen] = useState(false)
  const [completedAnim, setCompletedAnim] = useState(false)

  if (!task) return null

  // Calculate sub-task completion ratio
  const subtasks = task.children || []
  const completedSubtasksCount = subtasks.filter(s => s.status === 'completed').length
  const subtaskPercentage = subtasks.length ? Math.round((completedSubtasksCount / subtasks.length) * 100) : 100

  // Check deadline status for 4-level color coding
  const getDeadlineInfo = (dueDateStr, status) => {
    if (status === 'completed' || !dueDateStr) return null

    const now = new Date()
    now.setHours(0, 0, 0, 0)

    const cleanDateStr = dueDateStr.split(' ')[0]
    const [y, m, d] = cleanDateStr.split('-').map(Number)
    const due = new Date(y, m - 1, d)
    due.setHours(0, 0, 0, 0)

    const diffDays = Math.round((due - now) / (1000 * 60 * 60 * 24))

    if (diffDays < -3) {
      return { label: `OVERDUE (${Math.abs(diffDays)}D AGO)`, color: 'bg-rose-600 text-white font-extrabold animate-pulse' }
    }
    if (diffDays < 0) {
      return { label: `URGENT (${Math.abs(diffDays)}D AGO)`, color: isLight ? 'bg-orange-100 text-orange-900 border border-orange-300 font-bold' : 'bg-orange-500/20 text-orange-400 border border-orange-500/50 font-bold' }
    }
    if (diffDays === 0 || diffDays === 1) {
      return { label: diffDays === 0 ? 'CURRENT (TODAY)' : 'CURRENT (TOMORROW)', color: isLight ? 'bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold' }
    }
    return { label: `UPCOMING (IN ${diffDays}D)`, color: isLight ? 'bg-yellow-100 text-yellow-900 border border-yellow-300 font-bold' : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/40 font-bold' }
  }

  const deadlineInfo = getDeadlineInfo(task.due_date, task.status)

  const handleMarkComplete = () => {
    completeTask(task.id, resolutionNote || 'Task completed successfully from notification modal.')
    if (onAcknowledge) onAcknowledge(task.id)
    setCompletedAnim(true)
    setTimeout(() => {
      onClose()
    }, 900)
  }

  const handleSnooze = (mins) => {
    snoozeTaskReminder(task.id, mins)
    if (onAcknowledge) onAcknowledge(task.id)
    onClose()
  }

  const handleGoToHub = () => {
    if (onAcknowledge) onAcknowledge(task.id)
    onClose()
    navigate('/crm/tasks')
  }

  return (
    <div className="fixed inset-0 z-[99999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto crm-scroll animate-fade-in">
      <div className={`max-w-2xl w-full rounded-3xl border shadow-2xl relative font-sans overflow-hidden transition-all transform ${
        isLight ? 'bg-white border-slate-200 text-slate-900 shadow-slate-400/50' : 'bg-[#0b101d] border-white/15 text-slate-100 shadow-black/90'
      }`}>
        
        {/* Top Gold Glowing Header Accent Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-amber-500 via-[#c9a84c] to-amber-600" />

        {/* Completion Banner Alert */}
        {completedAnim && (
          <div className="bg-emerald-500 text-slate-950 px-4 py-3 font-mono font-bold text-xs flex items-center justify-center gap-2 animate-bounce">
            <CheckCircle2 size={18} />
            <span>TASK COMPLETED &amp; RECORDED IN CRM LEDGER! CLOSING...</span>
          </div>
        )}

        {/* Modal Header */}
        <div className="p-6 pb-4 border-b border-white/10 flex items-start justify-between gap-4">
          <div className="space-y-1 min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-wider">
              {/* Category Badge */}
              <span className="px-2.5 py-0.5 rounded-md bg-[#c9a84c]/20 text-[#c9a84c] border border-[#c9a84c]/30 flex items-center gap-1">
                <CheckSquare size={12} />
                {task.category || 'CRM Directive'}
              </span>

              {/* Priority Badge */}
              <span className={`px-2.5 py-0.5 rounded-md font-extrabold ${
                task.priority === 'urgent'
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse'
                  : task.priority === 'high'
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                    : 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
              }`}>
                {task.priority || 'NORMAL'} PRIORITY
              </span>

              {/* Deadline Status Badge */}
              {deadlineInfo && (
                <span className={`px-2.5 py-0.5 rounded-md flex items-center gap-1 ${deadlineInfo.color}`}>
                  <Clock size={12} />
                  {deadlineInfo.label}
                </span>
              )}

              {task.status === 'completed' && (
                <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <CheckCircle2 size={12} />
                  COMPLETED
                </span>
              )}
            </div>

            <h2 className={`text-xl font-serif font-bold mt-2 ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
              {task.subject}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-slate-200 transition-colors flex-shrink-0"
            title="Close Modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto crm-scroll">
          
          {/* Metadata Cards Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 font-mono">
            {/* High-Impact Pronounced Due Date */}
            <div className={`p-3.5 rounded-xl border flex items-center gap-3 shadow-md ${
              deadlineInfo?.label?.startsWith('OVERDUE')
                ? (isLight ? 'bg-rose-50 border-rose-300' : 'bg-rose-950/40 border-rose-500/50')
                : (isLight ? 'bg-amber-50/80 border-amber-300' : 'bg-amber-950/20 border-[#c9a84c]/40')
            }`}>
              <div className={`p-2.5 rounded-xl border ${
                deadlineInfo?.label?.startsWith('OVERDUE')
                  ? 'bg-rose-500/20 text-rose-400 border-rose-500/40 animate-pulse'
                  : 'bg-amber-500/20 text-amber-400 border-amber-500/40'
              }`}>
                <Clock size={18} />
              </div>
              <div className="min-w-0">
                <span className="text-[9px] uppercase font-mono font-black tracking-wider text-slate-400 block">DEADLINE / DUE DATE</span>
                <span className={`text-sm font-black font-mono tracking-widest truncate block ${
                  deadlineInfo?.label?.startsWith('OVERDUE')
                    ? 'text-rose-400 drop-shadow'
                    : 'text-[#c9a84c]'
                }`}>
                  {task.due_date || 'No deadline'}
                </span>
              </div>
            </div>

            {/* Assigned Rep */}
            <div className={`p-3 rounded-xl border flex items-center gap-3 ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/40 border-white/10'}`}>
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <User size={16} />
              </div>
              <div className="min-w-0">
                <span className="text-[9px] uppercase font-bold text-slate-400 block">Assigned Executive</span>
                <span className={`text-xs font-bold truncate block ${isLight ? 'text-slate-900' : 'text-slate-200'}`}>
                  {task.assigned_to || 'Unassigned'}
                </span>
              </div>
            </div>

            {/* Financial Weight */}
            <div className={`p-3 rounded-xl border flex items-center gap-3 sm:col-span-2 lg:col-span-1 ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/40 border-white/10'}`}>
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <DollarSign size={16} />
              </div>
              <div className="min-w-0">
                <span className="text-[9px] uppercase font-bold text-slate-400 block">Financial Exposure</span>
                <span className="text-xs font-bold text-[#c9a84c] truncate block">
                  {task.financial_weight ? `KES ${Number(task.financial_weight).toLocaleString()}` : 'Standard Priority'}
                </span>
              </div>
            </div>
          </div>

          {/* Sub-tasks Section */}
          {subtasks.length > 0 && (
            <div className={`p-4 rounded-2xl border space-y-3 ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/60 border-white/10'}`}>
              <div className="flex items-center justify-between font-mono">
                <div className="flex items-center gap-2">
                  <CornerDownRight size={14} className="text-[#c9a84c]" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
                    Sub-Task Directives ({completedSubtasksCount}/{subtasks.length})
                  </span>
                </div>
                <span className="text-xs font-bold text-[#c9a84c]">{subtaskPercentage}% Completed</span>
              </div>

              {/* Subtask Progress bar */}
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 transition-all duration-500" style={{ width: `${subtaskPercentage}%` }} />
              </div>

              <div className="space-y-2 pt-1 font-mono">
                {subtasks.map(sub => (
                  <div
                    key={sub.id}
                    onClick={() => toggleSubTask(task.id, sub.id)}
                    className={`p-2.5 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-all ${
                      sub.status === 'completed'
                        ? isLight ? 'bg-emerald-50 border-emerald-200 text-slate-500' : 'bg-emerald-950/20 border-emerald-500/30 text-slate-400'
                        : isLight ? 'bg-white border-slate-200 text-slate-900 hover:border-[#c9a84c]' : 'bg-slate-900 border-white/10 text-slate-100 hover:border-[#c9a84c]'
                    }`}
                  >
                    <div className="flex items-start gap-2.5 min-w-0">
                      <input
                        type="checkbox"
                        checked={sub.status === 'completed'}
                        onChange={() => {}}
                        className="mt-0.5 accent-[#c9a84c] cursor-pointer"
                      />
                      <div className="min-w-0">
                        <p className={`text-xs font-semibold ${sub.status === 'completed' ? 'line-through opacity-70' : ''}`}>
                          {sub.subject}
                        </p>
                        {sub.description && (
                          <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{sub.description}</p>
                        )}
                      </div>
                    </div>

                    <span className="text-[9px] uppercase font-bold px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-400 flex-shrink-0">
                      {sub.assigned_to || 'Assigned'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Completion Resolution Note Box */}
          {showResolutionBox && (
            <div className={`p-4 rounded-2xl border space-y-2 animate-fade-in ${isLight ? 'bg-amber-50 border-amber-200' : 'bg-amber-950/20 border-amber-500/40'}`}>
              <label className="block text-xs font-mono font-bold text-[#c9a84c] uppercase">
                Resolution &amp; Completion Audit Notes
              </label>
              <textarea
                rows={2}
                value={resolutionNote}
                onChange={e => setResolutionNote(e.target.value)}
                placeholder="Enter completion notes (e.g. Residual value confirmed with trade-in team)..."
                className={`w-full p-2.5 rounded-xl border text-xs outline-none font-mono ${
                  isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-950 border-white/10 text-slate-100'
                }`}
              />
              <button
                onClick={handleMarkComplete}
                className="w-full py-2 bg-emerald-500 text-slate-950 font-bold rounded-xl text-xs uppercase tracking-wider hover:bg-emerald-400 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <CheckCircle2 size={16} />
                <span>Confirm &amp; Complete Task</span>
              </button>
            </div>
          )}

        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 bg-slate-950/80 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
          <button
            onClick={handleGoToHub}
            className="px-3.5 py-2 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-300 hover:bg-blue-500/20 text-xs font-bold uppercase transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <ExternalLink size={14} />
            <span>Open Tasks Hub</span>
          </button>

          <div className="flex flex-wrap items-center gap-2">
            {/* Snooze Dropdown */}
            <div className="relative">
              <button
                onClick={() => setSnoozeOpen(!snoozeOpen)}
                className="px-3 py-2 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-300 hover:bg-purple-500/20 text-xs font-bold uppercase transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Clock size={14} />
                <span>Snooze</span>
                <ChevronDown size={12} className={snoozeOpen ? 'rotate-180 transition-transform' : ''} />
              </button>

              {snoozeOpen && (
                <div className="absolute right-0 bottom-12 z-[999999] w-36 bg-slate-900 border border-[#c9a84c]/40 rounded-xl p-1.5 shadow-2xl space-y-1 text-xs uppercase">
                  <button onClick={() => handleSnooze(15)} className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-white/10 text-slate-200">
                    Snooze 15m
                  </button>
                  <button onClick={() => handleSnooze(60)} className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-white/10 text-slate-200">
                    Snooze 1 Hour
                  </button>
                  <button onClick={() => handleSnooze(1440)} className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-white/10 text-slate-200">
                    Snooze 1 Day
                  </button>
                </div>
              )}
            </div>

            {/* Complete Task Trigger */}
            {task.status !== 'completed' && (
              <button
                onClick={() => setShowResolutionBox(!showResolutionBox)}
                className="px-4 py-2 bg-[#c9a84c] text-slate-950 font-bold rounded-xl text-xs uppercase tracking-wider hover:bg-[#d9b85c] transition-all flex items-center gap-1.5 shadow-lg cursor-pointer"
              >
                <CheckCircle2 size={15} />
                <span>Mark Complete</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl border border-white/10 hover:bg-white/10 text-slate-300 text-xs font-bold uppercase transition-all cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
