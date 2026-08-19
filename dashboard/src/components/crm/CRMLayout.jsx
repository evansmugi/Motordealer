// CRMLayout — Updated 2026-08-15 with Trade-In Requests header nav entry
import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom'

import { useCRMStore } from '../../context/CRMStore'
import { useAnalyticsStore } from '../../context/AnalyticsStore'
import AdminSidebar from '../Layout/AdminSidebar'
import AdminLiveChatToast from '../Chat/AdminLiveChatToast'

import {
  LayoutDashboard, Users, GitPullRequest, TrendingUp, Megaphone,
  MessageSquare, CheckSquare, LifeBuoy, Sliders, ShieldCheck, Calendar,
  Bell, BellOff, RefreshCw, LogOut, Sparkles, ChevronLeft, ChevronRight, X, Clock, AlertTriangle,
  Eye, Globe, Package, Sun, Moon, PlusCircle, Share2, QrCode,
  ShoppingCart, Video, PhoneCall, Zap, Layers, FileText, Download, Trophy, Settings,
  CheckCircle2, ShieldAlert, Car, Image, DollarSign
} from 'lucide-react'

import ExecutiveExportModal from '../common/ExecutiveExportModal'
import TaskDetailModal from '../common/TaskDetailModal'
import BrandLogo from '../common/BrandLogo'
import ActionTooltip from '../common/ActionTooltip'
import SystemSyncModal from '../common/SystemSyncModal'
import NotificationSettingsModal from '../common/NotificationSettingsModal'


const navItems = [
  { path: '/crm',             label: 'Overview',            icon: LayoutDashboard },
  { path: '/crm/tasks',       label: 'Tasks',               icon: CheckSquare },
  { path: '/crm/appointments',label: 'Appointments',        icon: Calendar },
  { path: '/crm/leads',       label: 'Leads & Clients',     icon: Users },
  { path: '/crm/pipeline',    label: 'Sales Pipeline',      icon: GitPullRequest },
  { path: '/crm/won-deals',   label: 'Won Deals & Handover',icon: Trophy },
  { path: '/crm/trade-ins',   label: 'Trade-In Requests',   icon: Car },
  { path: '/crm/opportunities', label: 'Deals & Quotes',    icon: TrendingUp },
  { path: '/crm/campaigns',   label: 'Marketing Campaigns', icon: Megaphone },
  { path: '/crm/communication', label: 'Communications',    icon: MessageSquare },
  { path: '/crm/support',     label: 'Customer Support',   icon: LifeBuoy }
]

const settingsNavItems = [
  { path: '/crm/logo-settings',     label: 'Logo & Branding',       icon: Image },
  { path: '/crm/currency-settings', label: 'Multi-Currency & Rates', icon: DollarSign },
  { path: '/crm/team',              label: 'User & Team Hub',       icon: Users },
  { path: '/crm/lead-sources',      label: 'Lead Sources',          icon: Sliders },
  { path: '/crm/scoring-rules',     label: 'Scoring Rules',        icon: Sparkles },
  { path: '/crm/sla',               label: 'Service Standards',     icon: ShieldCheck },
  { path: '/crm/ai-settings',       label: 'AI & API Settings',     icon: Settings }
]

const analyticsNavItems = [
  { path: '/analytics/dashboard',     label: 'Insights Dashboard',    icon: LayoutDashboard },
  { path: '/analytics/watch',         label: 'Visitor Tracking',      icon: Eye },
  { path: '/analytics/topology',      label: 'Visitor Map',           icon: Globe },
  { path: '/analytics/shield',        label: 'Security Center',       icon: ShieldCheck },
  { path: '/analytics/forecast',      label: 'Forecaster',            icon: TrendingUp },
  { path: '/analytics/heatmaps',      label: 'Website Heatmaps',      icon: Sparkles },
  { path: '/analytics/journeys',      label: 'Customer Journeys',     icon: GitPullRequest },
  { path: '/analytics/profiles',      label: 'Visitor Profiles',      icon: Users },
  { path: '/analytics/live-activity', label: 'Live Site Activity',    icon: Bell },
  { path: '/analytics/vitals',           label: 'Server Status',         icon: Package },
  { path: '/analytics/history',          label: 'Activity History',      icon: Clock },
  { path: '/analytics/visitors',         label: 'Traffic Logs',          icon: Sliders },
]

const campaignMonitorNavItems = [
  { path: '/analytics/campaign-monitor',               label: 'Ad Attribution Suite',  icon: Megaphone },
  { path: '/analytics/campaign-analytics',             label: 'Campaign Metrics & CAC', icon: TrendingUp },
  { path: '/analytics/campaign-monitor?tab=planner',    label: 'AI Campaign Planner',   icon: Zap },
  { path: '/analytics/campaign-monitor?tab=attribution',label: 'Multi-Touch Revenue',  icon: Layers },
  { path: '/analytics/campaign-monitor?tab=roi',        label: 'ROI & ROAS Intelligence',icon: TrendingUp },
  { path: '/analytics/campaign-monitor?tab=links',      label: 'Trackable Link Builder',icon: PlusCircle },
  { path: '/analytics/campaign-monitor?tab=facebook',   label: 'Facebook Paid Ads',     icon: Share2 },
  { path: '/analytics/campaign-monitor?tab=instagram',  label: 'Instagram Paid Ads',    icon: Share2 },
  { path: '/analytics/campaign-monitor?tab=whatsapp',   label: 'WhatsApp Campaigns',    icon: MessageSquare },
  { path: '/analytics/campaign-monitor?tab=email',      label: 'Email Broadcasts',      icon: Sparkles },
  { path: '/analytics/campaign-monitor?tab=classifieds',label: 'Classified Portals',    icon: ShoppingCart },
  { path: '/analytics/campaign-monitor?tab=youtube',    label: 'YouTube & Reviews',     icon: Video },
  { path: '/analytics/campaign-monitor?tab=sms',        label: 'SMS Bulk Outreach',     icon: PhoneCall },
  { path: '/analytics/campaign-monitor?tab=qr',         label: 'Showroom QR Codes',     icon: QrCode },
]

const vehiclesNavItems = [
  { path: '/admin/vehicles',       label: 'Vehicle Inventory',   icon: Car },
  { path: '/add-listing',           label: 'Add Vehicle',         icon: PlusCircle },
  { path: '/brand-identity',        label: 'Brand Assets',        icon: Sparkles },
  { path: '/crm/trade-in-requests', label: 'Trade-In Valuations', icon: RefreshCw },
  { path: '/crm/appointments',      label: 'Test Drive Bookings', icon: Calendar },
]

export default function CRMLayout({ children = null }) {
  const location = useLocation()
  const navigate = useNavigate()
  const tasks = useCRMStore(state => state.tasks)
  const [isExportModalOpen, setIsExportModalOpen] = useState(false)

  const isVehiclesPage = location.pathname.startsWith('/admin/vehicles') ||
                         location.pathname.startsWith('/vehicles') ||
                         location.pathname.startsWith('/add-listing') ||
                         location.pathname.startsWith('/edit-listing') ||
                         location.pathname.startsWith('/view-listing')

  const isCampaignMonitorPage = location.pathname.startsWith('/analytics/campaign-monitor') ||
                                location.pathname.startsWith('/analytics/campaign-analytics') ||
                                location.pathname.startsWith('/analytics/metrics') ||
                                location.pathname.startsWith('/crm/campaigns')
  const isAnalyticsPage = location.pathname.startsWith('/analytics') && !isCampaignMonitorPage

  const isSettingsPage = location.pathname.startsWith('/crm/team') ||
                         location.pathname.startsWith('/crm/sources') ||
                         location.pathname.startsWith('/crm/lead-sources') ||
                         location.pathname.startsWith('/crm/scoring-rules') ||
                         location.pathname.startsWith('/crm/sla') ||
                         location.pathname.startsWith('/crm/ai-settings') ||
                         location.pathname.startsWith('/crm/logo-settings')

  const currentNavItems = isVehiclesPage
    ? vehiclesNavItems
    : isSettingsPage
      ? settingsNavItems
      : isCampaignMonitorPage
        ? campaignMonitorNavItems
        : isAnalyticsPage
          ? analyticsNavItems
          : navItems

  const acknowledgeTaskReminder = useCRMStore(state => state.acknowledgeTaskReminder)
  const snoozeTaskReminder = useCRMStore(state => state.snoozeTaskReminder)
  const liveChatNotificationsEnabled = useCRMStore(state => state.liveChatNotificationsEnabled)
  const adminTheme = useCRMStore(state => state.adminTheme)
  const toggleAdminTheme = useCRMStore(state => state.toggleAdminTheme)

  const [snoozeMenu, setSnoozeMenu] = useState(false)
  const [selectedTaskForModal, setSelectedTaskForModal] = useState(null)
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false)
  const [isAlertsModalOpen, setIsAlertsModalOpen] = useState(false)
  const [reminderIndex, setReminderIndex] = useState(0)
  const [dismissedTaskIds, setDismissedTaskIds] = useState(() => new Set())
  
  const initCRM = useCRMStore(state => state.initCRM)
  const initAnalytics = useAnalyticsStore(state => state.initAnalytics)

  useEffect(() => {
    if (initCRM) initCRM()
    if (initAnalytics) initAnalytics()
  }, [initCRM, initAnalytics])

  useEffect(() => {
    const bg = adminTheme === 'light' ? '#f1f5f9' : '#020617'
    document.body.style.backgroundColor = bg
    document.documentElement.style.backgroundColor = bg
  }, [adminTheme])

  const getTaskReminderStatus = (task) => {
    if (!task || task.status === 'completed' || task.status === 'archived') return 'completed'
    if (!task.due_date) return 'current'

    const now = new Date()
    now.setHours(0, 0, 0, 0)
    const cleanDateStr = String(task.due_date).split(' ')[0]
    const [y, m, d] = cleanDateStr.split('-').map(Number)
    if (!y || !m || !d) return 'current'

    const due = new Date(y, m - 1, d)
    due.setHours(0, 0, 0, 0)
    const diffDays = Math.round((due - now) / (1000 * 60 * 60 * 24))

    return diffDays < 0 ? 'overdue' : diffDays <= 1 ? 'current' : 'upcoming'
  }

  const eligibleReminderTasks = tasks.filter(t => {
    if (t.status === 'completed' || t.status === 'archived') return false
    if (dismissedTaskIds.has(t.id)) return false
    if (t.reminders_acknowledged || t.is_acknowledged) return false
    if (t.reminders && t.reminders.length > 0 && t.reminders.every(r => r.is_acknowledged)) return false
    const cat = getTaskReminderStatus(t)
    return cat === 'overdue' || cat === 'current'
  })

  const safeIndex = eligibleReminderTasks.length > 0 ? (reminderIndex % eligibleReminderTasks.length) : 0
  const activeReminderTask = eligibleReminderTasks.length > 0 ? eligibleReminderTasks[safeIndex] : null

  useEffect(() => {
    if (eligibleReminderTasks.length <= 1) return
    const timer = setInterval(() => {
      setReminderIndex(prev => (prev + 1) % eligibleReminderTasks.length)
    }, 7000)
    return () => clearInterval(timer)
  }, [eligibleReminderTasks.length])

  const handleAcknowledge = () => {
    if (activeReminderTask) {
      setDismissedTaskIds(prev => new Set([...prev, activeReminderTask.id]))
      acknowledgeTaskReminder(activeReminderTask.id)
    }
    setSnoozeMenu(false)
  }

  const handleDismissAll = () => {
    if (eligibleReminderTasks.length > 0) {
      const allIds = eligibleReminderTasks.map(t => t.id)
      setDismissedTaskIds(prev => new Set([...prev, ...allIds]))
      allIds.forEach(id => acknowledgeTaskReminder(id))
    }
    setSnoozeMenu(false)
  }

  const handleSnooze = (mins) => {
    if (activeReminderTask) {
      snoozeTaskReminder(activeReminderTask.id, mins)
    }
    setSnoozeMenu(false)
  }

  return (
    <AdminSidebar>
      <div
        data-theme={adminTheme}
        className={`min-h-screen relative font-sans overflow-x-hidden transition-colors duration-300 ${
          adminTheme === 'light' ? 'light-theme bg-slate-100 text-slate-900' : 'bg-[#020617] text-slate-100'
        }`}
      >

      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="qb-blob qb1" />
        <div className="qb-blob qb2" />
        <div className="qb-blob qb3" />
        <div className="qb-blob qb4" />
      </div>

      {activeReminderTask && (() => {
        const reminderCategory = getTaskReminderStatus(activeReminderTask)
        const isOverdue = reminderCategory === 'overdue'

        return (
          <div className={`fixed bottom-6 left-6 lg:left-80 z-[9999] max-w-sm w-full rounded-2xl p-4 shadow-2xl animate-slide-in backdrop-blur-2xl border transition-all cursor-pointer group ${
            isOverdue
              ? (adminTheme === 'light'
                  ? 'bg-rose-50/95 border-rose-400 text-slate-900 shadow-rose-500/20 hover:border-rose-500'
                  : 'bg-[#180a0f] border-rose-500/80 text-slate-100 shadow-rose-950/60 hover:border-rose-400')
              : (adminTheme === 'light'
                  ? 'bg-emerald-50/95 border-emerald-400 text-slate-900 shadow-emerald-500/20 hover:border-emerald-500'
                  : 'bg-[#091811] border-emerald-500/70 text-slate-100 shadow-emerald-950/60 hover:border-emerald-400')
          }`}>

            <div className={`absolute top-0 left-0 right-0 h-1 rounded-t-xl bg-gradient-to-r from-transparent ${
              isOverdue ? 'via-rose-500' : 'via-emerald-400'
            } to-transparent`} />

            <div
              onClick={() => setSelectedTaskForModal(activeReminderTask)}
              className="flex items-start justify-between gap-3"
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className={`p-3 rounded-xl border animate-pulse group-hover:scale-105 transition-transform flex-shrink-0 ${
                  isOverdue
                    ? 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                    : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                }`}>
                  {isOverdue ? <ShieldAlert size={22} /> : <CheckCircle2 size={22} />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className={`text-[9px] tracking-[2px] uppercase font-mono font-bold truncate ${
                        isOverdue ? 'text-rose-400' : 'text-emerald-400'
                      }`}>
                        {isOverdue ? 'OVERDUE TASK ALERT' : 'CURRENT TASK REMINDER'}
                      </span>
                      <span className={`w-2 h-2 rounded-full animate-ping shrink-0 ${
                        isOverdue ? 'bg-rose-500' : 'bg-emerald-400'
                      }`} />
                    </div>

                    {eligibleReminderTasks.length > 1 && (
                      <div className="flex items-center gap-1 bg-black/40 px-2 py-0.5 rounded-lg border border-white/10 text-[10px] font-mono shrink-0">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            setReminderIndex(prev => (prev - 1 + eligibleReminderTasks.length) % eligibleReminderTasks.length)
                          }}
                          className="p-0.5 hover:text-white text-slate-400"
                          title="Previous Task Alert"
                        >
                          <ChevronLeft size={12} />
                        </button>
                        <span className="font-bold text-slate-200">
                          {safeIndex + 1}/{eligibleReminderTasks.length}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            setReminderIndex(prev => (prev + 1) % eligibleReminderTasks.length)
                          }}
                          className="p-0.5 hover:text-white text-slate-400"
                          title="Next Task Alert"
                        >
                          <ChevronRight size={12} />
                        </button>
                      </div>
                    )}
                  </div>
                  <h4 className={`text-sm font-semibold mt-0.5 font-serif transition-colors truncate ${
                    isOverdue
                      ? 'group-hover:text-rose-400'
                      : 'group-hover:text-emerald-400'
                  } ${adminTheme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>
                    {activeReminderTask.subject}
                  </h4>
                  <p className={`text-xs mt-1 line-clamp-2 ${adminTheme === 'light' ? 'text-slate-600 font-medium' : 'text-slate-300'}`}>
                    {activeReminderTask.description || (isOverdue ? 'Critical past-deadline task requires immediate resolution.' : 'Current active task schedule.')}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  handleDismissAll()
                }}
                className={`p-1 ${adminTheme === 'light' ? 'text-slate-500 hover:text-slate-900' : 'text-slate-400 hover:text-slate-100'}`}
                title="Close Toast"
              >
                <X size={18} />
              </button>
            </div>

            <div className={`mt-4 pt-3 border-t flex flex-wrap items-center justify-between gap-2 text-xs ${adminTheme === 'light' ? 'border-slate-200' : 'border-white/10'}`}>
              <span className={`flex items-center gap-1.5 font-mono text-[11px] ${adminTheme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>
                <Clock size={13} className={isOverdue ? 'text-rose-400' : 'text-emerald-400'} /> Due: <strong className={adminTheme === 'light' ? 'text-slate-900' : 'text-slate-200'}>{activeReminderTask.due_date}</strong>
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedTaskForModal(activeReminderTask)}
                  className={`px-2.5 py-1.5 rounded text-[10px] uppercase font-bold transition-all flex items-center gap-1 shadow-sm cursor-pointer border ${
                    isOverdue
                      ? 'bg-rose-500/20 border-rose-500/40 text-rose-300 hover:bg-rose-500/30'
                      : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/30'
                  }`}
                >
                  <span>View Details</span>
                </button>

                <Link
                  to="/crm/tasks"
                  className="px-2.5 py-1.5 rounded bg-blue-500/10 border border-blue-500/30 text-blue-300 hover:bg-blue-500/20 text-[10px] uppercase font-semibold transition-all"
                >
                  Hub
                </Link>

                {/* Snooze Dropdown Trigger */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      setSnoozeMenu(!snoozeMenu)
                    }}
                    className="px-2.5 py-1.5 rounded bg-purple-500/10 border border-purple-500/30 text-purple-300 hover:bg-purple-500/20 text-[10px] uppercase font-semibold transition-all flex items-center gap-1"
                  >
                    <span>Snooze</span>
                    <ChevronRight size={12} className={snoozeMenu ? 'rotate-90 transition-transform' : ''} />
                  </button>

                  {snoozeMenu && (
                    <div className="absolute right-0 bottom-8 z-[99999] w-32 bg-slate-900 border border-white/20 rounded-lg p-1.5 shadow-2xl space-y-1 text-[10px] uppercase">
                      <button onClick={() => handleSnooze(15)} className="w-full text-left px-2.5 py-1.5 rounded hover:bg-white/10 text-slate-200">
                        Snooze 15m
                      </button>
                      <button onClick={() => handleSnooze(60)} className="w-full text-left px-2.5 py-1.5 rounded hover:bg-white/10 text-slate-200">
                        Snooze 1 Hour
                      </button>
                      <button onClick={() => handleSnooze(1440)} className="w-full text-left px-2.5 py-1.5 rounded hover:bg-white/10 text-slate-200">
                        Snooze 1 Day
                      </button>
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleAcknowledge()
                  }}
                  className={`px-3 py-1.5 text-slate-950 font-bold rounded text-[10px] tracking-wider uppercase transition-all shadow-md ${
                    isOverdue ? 'bg-rose-500 hover:bg-rose-400 text-white' : 'bg-emerald-400 hover:bg-emerald-300'
                  }`}
                >
                  Acknowledge
                </button>
              </div>
            </div>
          </div>
        )
      })()}


      {/* Responsive Header */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-[#020617]/95 border-b border-white/10 shadow-2xl">
        <div className="w-full px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3.5 flex items-center justify-between gap-2">
          
          {/* Brand & Status Pill (Desktop Logo / Mobile Pill Only) */}
          <div className="flex items-center gap-3">
            {/* Desktop Brand Link (Hidden on Mobile to avoid duplicate logos) */}
            <Link to="/admin/dashboard" className="hidden sm:flex items-center gap-2 group">
              <BrandLogo location="topnav" size="md" />
              <span className={`text-[9px] sm:text-[10px] tracking-[1.5px] uppercase font-bold px-2 py-0.5 rounded border ${
                    isSettingsPage
                      ? 'text-purple-400 bg-purple-500/10 border-purple-500/30'
                      : isCampaignMonitorPage
                        ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
                        : isAnalyticsPage
                          ? 'text-[#6366f1] bg-[#6366f1]/10 border-[#6366f1]/30'
                          : 'text-[#c9a84c] bg-[#c9a84c]/10 border-[#c9a84c]/30'
                  }`}>
                    {isSettingsPage ? 'SETTINGS' : isCampaignMonitorPage ? 'CAMPAIGN MONITOR' : isAnalyticsPage ? 'ANALYTICS' : 'CRM'}
              </span>
            </Link>

            {/* Mobile-Only Clean Module Badge (Hides 2nd duplicate KNK logo on small screens) */}
            <div className="flex sm:hidden items-center">
              <span className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                isVehiclesPage
                  ? 'text-[#c9a84c] bg-[#c9a84c]/10 border-[#c9a84c]/30'
                  : isSettingsPage
                    ? 'text-purple-400 bg-purple-500/10 border-purple-500/30'
                    : isCampaignMonitorPage
                      ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
                      : isAnalyticsPage
                        ? 'text-[#6366f1] bg-[#6366f1]/10 border-[#6366f1]/30'
                        : 'text-[#c9a84c] bg-[#c9a84c]/10 border-[#c9a84c]/30'
              }`}>
                {isVehiclesPage ? 'VEHICLE MANAGEMENT' : isSettingsPage ? 'SETTINGS' : isCampaignMonitorPage ? 'CAMPAIGN MONITOR' : isAnalyticsPage ? 'ANALYTICS' : 'CRM'}
              </span>
            </div>

            <div className={`hidden lg:flex items-center gap-2 px-3 py-1 rounded-full text-[10px] tracking-widest uppercase font-semibold border ${
              isVehiclesPage
                ? 'bg-[#c9a84c]/10 border-[#c9a84c]/30 text-[#c9a84c]'
                : isSettingsPage
                  ? 'bg-purple-500/10 border-purple-500/30 text-purple-400'
                  : isCampaignMonitorPage
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                    : isAnalyticsPage
                      ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
                      : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
            }`}>
              <span className={`w-2 h-2 rounded-full animate-ping ${isVehiclesPage ? 'bg-[#c9a84c]' : isSettingsPage ? 'bg-purple-400' : isCampaignMonitorPage ? 'bg-emerald-400' : isAnalyticsPage ? 'bg-cyan-400' : 'bg-emerald-400'}`} />
              {isVehiclesPage ? 'VEHICLES-MODULE-ACTIVE' : isSettingsPage ? 'SETTINGS-ACTIVE' : isCampaignMonitorPage ? 'CAMPAIGN-ACTIVE' : isAnalyticsPage ? 'ANALYTICS-ACTIVE' : 'CRM-ACTIVE'}
            </div>
          </div>

          {/* Quick Actions & Nav controls */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* Live Chat Alert Toggle */}
            <button
              onClick={() => setIsAlertsModalOpen(true)}
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

            {/* Dark / Light Theme Engine Toggle Button */}
            <button
              onClick={toggleAdminTheme}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-[11px] sm:text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                adminTheme === 'light'
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-500 hover:bg-amber-500/20'
                  : 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/20'
              }`}
            >
              {adminTheme === 'light' ? (
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

            {/* Executive Reports PDF & Excel Center */}
            <button
              onClick={() => setIsExportModalOpen(true)}
              className="px-2.5 py-1.5 sm:px-3.5 sm:py-1.5 rounded-lg border border-[#c9a84c]/40 bg-[#c9a84c]/10 text-[#c9a84c] text-[11px] sm:text-xs tracking-wider uppercase font-bold hover:bg-[#c9a84c] hover:text-slate-950 transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <FileText size={14} />
              <span className="hidden md:inline">Executive Reports</span>
            </button>

            {/* Sync Refresh */}
            <button
              onClick={() => setIsSyncModalOpen(true)}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-br from-cyan-950/40 via-slate-900 to-slate-950 border border-cyan-500/30 hover:border-cyan-400 text-cyan-300 hover:text-cyan-100 shadow-md shadow-cyan-950/20 flex items-center justify-center transition-all cursor-pointer group"
            >
              <RefreshCw size={14} className="text-cyan-400 group-hover:rotate-180 transition-transform duration-500" />
            </button>

            {/* Admin Link */}
            <Link
              to="/admin/dashboard"
              className="relative group overflow-hidden px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-2xl bg-gradient-to-r from-indigo-950/40 via-[#111625] to-slate-950 border border-indigo-500/30 hover:border-indigo-400/80 shadow-lg shadow-indigo-950/20 hover:shadow-indigo-500/20 transition-all duration-300 flex items-center gap-2 text-[11px] sm:text-xs tracking-[1.5px] uppercase font-bold"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-indigo-500/15 to-indigo-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              <span className="hidden sm:inline text-slate-100 group-hover:text-indigo-200 font-mono font-bold tracking-widest">Admin Command</span>
              <span className="sm:hidden text-slate-100 font-mono">Admin</span>
              <div className="w-5 h-5 rounded-lg bg-indigo-500/15 border border-indigo-500/40 flex items-center justify-center text-indigo-300 group-hover:bg-indigo-500 group-hover:text-slate-950 transition-all">
                <ChevronRight size={12} className="transition-transform group-hover:translate-x-0.5" />
              </div>
            </Link>
          </div>
        </div>

        {/* Global Live Chat Toast Container */}
        <AdminLiveChatToast />

        {/* Executive PDF & Excel Modal */}
        <ExecutiveExportModal
          isOpen={isExportModalOpen}
          onClose={() => setIsExportModalOpen(false)}
        />

        {/* System Sync Modal */}
        <SystemSyncModal
          isOpen={isSyncModalOpen}
          onClose={() => setIsSyncModalOpen(false)}
          isLight={adminTheme === 'light'}
        />

        {/* Notification Settings Control Modal */}
        <NotificationSettingsModal
          isOpen={isAlertsModalOpen}
          onClose={() => setIsAlertsModalOpen(false)}
          isLight={adminTheme === 'light'}
        />

        {/* Navigation Ribbon & Mobile Select Box */}
        <div className="border-t border-white/5 bg-slate-950/60 backdrop-blur-md">
          <div className="w-full px-3 sm:px-6 lg:px-8 py-1.5 sm:py-2">
            
            {/* Mobile Dropdown Menu Selector (< sm) */}
            <div className="sm:hidden flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 flex-shrink-0">Jump To:</span>
              <select
                value={currentNavItems.find(i => location.pathname === i.path || (i.path !== '/crm' && i.path !== '/analytics/dashboard' && location.pathname.startsWith(i.path)))?.path || currentNavItems[0]?.path}
                onChange={e => navigate(e.target.value)}
                className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-slate-200 font-mono outline-none focus:border-[#c9a84c] transition-all cursor-pointer"
              >
                {currentNavItems.map(item => (
                  <option key={item.path} value={item.path}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Scrollable Horizontal Ribbon (Desktop & Tablet) */}
            <nav className="hidden sm:flex gap-1.5 overflow-x-auto crm-scroll py-1.5">
              {currentNavItems.map(item => {
                const Icon = item.icon
                const currentFullPath = location.pathname + location.search
                const isActive = isCampaignMonitorPage
                  ? (currentFullPath === item.path || (item.path === '/analytics/campaign-monitor' && location.pathname === '/analytics/campaign-monitor' && !location.search))
                  : (location.pathname === item.path || (item.path !== '/crm' && item.path !== '/analytics/dashboard' && location.pathname.startsWith(item.path)))

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-[10px] sm:text-[11px] font-bold tracking-wider uppercase transition-all whitespace-nowrap shadow-md group ${
                      isActive
                        ? isCampaignMonitorPage
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 border border-emerald-300 shadow-emerald-500/20 font-black scale-[1.02]'
                          : isAnalyticsPage
                            ? 'bg-gradient-to-r from-[#6366f1] to-indigo-400 text-white border border-indigo-300 shadow-indigo-500/25 font-black scale-[1.02]'
                            : 'bg-gradient-to-r from-[#c9a84c] to-[#eab308] text-slate-950 border border-[#fef08a] shadow-[#c9a84c]/25 font-black scale-[1.02]'
                        : 'bg-slate-900/90 border border-slate-700/80 text-slate-100 hover:text-white hover:bg-slate-800 hover:border-[#c9a84c]/50 hover:shadow-[#c9a84c]/10'
                    }`}
                  >
                    <Icon size={14} className={isActive ? (isCampaignMonitorPage ? 'text-slate-950' : isAnalyticsPage ? 'text-white' : 'text-slate-950') : 'text-amber-400/80 group-hover:text-amber-300 transition-colors'} />
                    <span className="drop-shadow-sm">{item.label}</span>
                  </Link>
                )
              })}
            </nav>

          </div>
        </div>
      </header>


      {/* Main Page Area - Responsive Edge-to-Edge Theme Surface */}
      <main className={`w-full px-2 sm:px-4 lg:px-6 py-6 relative min-h-[calc(100vh-120px)] transition-colors duration-300 ${
        adminTheme === 'light' ? 'bg-slate-100 text-slate-900' : 'bg-[#020617] text-slate-100'
      }`}>
        {children ? children : <Outlet context={{ adminTheme, isLight: adminTheme === 'light' }} />}
      </main>

      {/* Interactive Task Detail Modal */}
      {selectedTaskForModal && (
        <TaskDetailModal
          task={selectedTaskForModal}
          onClose={() => setSelectedTaskForModal(null)}
          onAcknowledge={handleAcknowledge}
        />
      )}

      </div>
    </AdminSidebar>
  )
}
