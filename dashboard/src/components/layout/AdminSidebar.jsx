import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useCRMStore } from '../../context/CRMStore'
import {
  LayoutDashboard, Car, PlusCircle, Users, GitPullRequest, TrendingUp,
  Megaphone, MessageSquare, CheckSquare, LifeBuoy, Sliders, ShieldCheck,
  BookOpen, Package, Calendar, ChevronDown, ChevronRight, Power, Menu, X,
  Sparkles, ExternalLink, Bell, BellOff, Eye, Globe, Share2, QrCode,
  ShoppingCart, Video, PhoneCall, Zap, Layers, Trophy, Settings, Image, DollarSign
} from 'lucide-react'

import { supabase } from '../../lib/superbaseClient'
import BrandLogo from '../common/BrandLogo'

import ActionTooltip from '../common/ActionTooltip'
import ConfirmSignOutModal from '../common/ConfirmSignOutModal'
import NotificationSettingsModal from '../common/NotificationSettingsModal'

export default function AdminSidebar({ children }) {
  const location = useLocation()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
  const isCampaignRoute = location.pathname.startsWith('/analytics/campaign-monitor') ||
                          location.pathname.startsWith('/analytics/campaign-analytics') ||
                          location.pathname.startsWith('/analytics/metrics') ||
                          location.pathname.startsWith('/crm/campaigns')
  const isAnalyticsRoute = location.pathname.startsWith('/analytics') && !isCampaignRoute
  const isSettingsRoute = location.pathname.startsWith('/crm/team') ||
                          location.pathname.startsWith('/crm/sources') ||
                          location.pathname.startsWith('/crm/lead-sources') ||
                          location.pathname.startsWith('/crm/scoring-rules') ||
                          location.pathname.startsWith('/crm/sla') ||
                          location.pathname.startsWith('/crm/ai-settings') ||
                          location.pathname.startsWith('/crm/logo-settings') ||
                          location.pathname.startsWith('/crm/currency-settings') ||
                          location.pathname.startsWith('/brand-identity') ||
                          location.pathname.startsWith('/brand-settings') ||
                          location.pathname.startsWith('/brand-logo')
  const isCrmRoute = (location.pathname.startsWith('/crm') || location.pathname === '/crm') && !isCampaignRoute && !isSettingsRoute

  const isVehiclesRoute = location.pathname.startsWith('/admin/vehicles') ||
                          location.pathname.startsWith('/vehicles') ||
                          location.pathname === '/add-listing' ||
                          location.pathname.startsWith('/edit-listing') ||
                          location.pathname.startsWith('/view-listing')

  const [vehiclesOpen, setVehiclesOpen] = useState(isVehiclesRoute)
  const [crmOpen, setCrmOpen] = useState(isCrmRoute)
  const [analyticsOpen, setAnalyticsOpen] = useState(isAnalyticsRoute)
  const [campaignOpen, setCampaignOpen] = useState(isCampaignRoute)
  const [settingsOpen, setSettingsOpen] = useState(isSettingsRoute)
  const [showSignOutModal, setShowSignOutModal] = useState(false)
  const [showAlertsModal, setShowAlertsModal] = useState(false)

  // Synchronize open accordions dynamically whenever location changes
  useEffect(() => {
    if (isVehiclesRoute) setVehiclesOpen(true)
    if (isCrmRoute) setCrmOpen(true)
    if (isAnalyticsRoute) setAnalyticsOpen(true)
    if (isCampaignRoute) setCampaignOpen(true)
    if (isSettingsRoute) setSettingsOpen(true)
  }, [location.pathname, isVehiclesRoute, isCrmRoute, isAnalyticsRoute, isCampaignRoute, isSettingsRoute])

  const tasks = useCRMStore(state => state.tasks)
  const adminTheme = useCRMStore(state => state.adminTheme)
  const liveChatNotificationsEnabled = useCRMStore(state => state.liveChatNotificationsEnabled)
  const urgentTasksCount = tasks.filter(t => t.priority === 'urgent' && t.status !== 'completed').length

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/admin', { replace: true })
  }

  const vehiclesSubItems = [
    { path: '/admin/vehicles', label: 'Vehicle Inventory', icon: Car },
    { path: '/add-listing',     label: 'Add Vehicle',       icon: PlusCircle },
  ]

  const crmSubItems = [
    { path: '/crm',               label: 'Overview',            icon: LayoutDashboard },
    { path: '/crm/tasks',         label: 'Tasks & Reminders',   icon: CheckSquare, badge: urgentTasksCount > 0 ? urgentTasksCount : null },
    { path: '/crm/appointments',  label: 'Booked Appointments', icon: Calendar },
    { path: '/crm/leads',         label: 'Leads & Clients',     icon: Users },
    { path: '/crm/pipeline',      label: 'Sales Pipeline',      icon: GitPullRequest },
    { path: '/crm/opportunities', label: 'Deals & Quotes',    icon: TrendingUp },
    { path: '/crm/won-deals',     label: 'Won Deals & Handover', icon: Trophy },
    { path: '/crm/trade-ins',     label: 'Trade-In Requests',   icon: Car },
    { path: '/crm/campaigns',     label: 'Marketing Campaigns', icon: Megaphone },
    { path: '/crm/communication', label: 'Communication Logs',icon: MessageSquare },
    { path: '/crm/support',       label: 'Customer Support',   icon: LifeBuoy },
  ]

  const settingsSubItems = [
    { path: '/brand-identity',        label: 'Logo & Brand Identity', icon: Sparkles },
    { path: '/crm/currency-settings', label: 'Multi-Currency & Rates', icon: DollarSign },
    { path: '/crm/team',              label: 'User & Team Hub',       icon: Users },
    { path: '/crm/sources',           label: 'Lead Sources',          icon: Sliders },
    { path: '/crm/scoring-rules',     label: 'Scoring Rules',        icon: Sparkles },
    { path: '/crm/sla',               label: 'Service Standards',     icon: ShieldCheck },
    { path: '/crm/ai-settings',       label: 'AI & API Settings',     icon: Settings },
  ]

  const analyticsSubItems = [
    { path: '/analytics/dashboard',     label: 'Insights Dashboard',    icon: LayoutDashboard },
    { path: '/analytics/watch',         label: 'Visitor Tracking',      icon: Eye },
    { path: '/analytics/topology',      label: 'Visitor Map',           icon: Globe },
    { path: '/analytics/product-traffic', label: 'Product Intelligence', icon: Car },
    { path: '/analytics/shield',        label: 'Security Center',       icon: ShieldCheck },
    { path: '/analytics/forecast',      label: 'Forecaster',            icon: TrendingUp },
    { path: '/analytics/heatmaps',      label: 'Website Heatmaps',      icon: Sparkles },
    { path: '/analytics/journeys',      label: 'Customer Journeys',     icon: GitPullRequest },
    { path: '/analytics/profiles',      label: 'Visitor Profiles',      icon: Users },
    { path: '/analytics/live-activity', label: 'Live Site Activity',    icon: Bell },
    { path: '/analytics/vitals',        label: 'Server Status',         icon: Package },
    { path: '/analytics/history',       label: 'Activity History',      icon: Calendar },
    { path: '/analytics/visitors',      label: 'Traffic Logs',          icon: Sliders },
  ]

  const campaignMonitorSubItems = [
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

  const mainNav = [
    { path: '/admin/dashboard', label: 'Admin Dashboard', icon: LayoutDashboard },
  ]

  const isLight = adminTheme === 'light'

  const sidebarContent = (
    <div className={`h-full flex flex-col justify-between border-r p-4 font-sans select-none transition-colors duration-300 ${
      isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#080808] border-[#c9a84c]/20 text-slate-300'
    }`}>
      
      {/* Brand Header */}
      <div>
        <div className="flex items-center justify-between pb-6 mb-6 border-b border-white/10">
          <Link to="/admin/dashboard" className="flex items-center gap-2.5">
            <BrandLogo location="sidebar" size="md" />
          </Link>

          {/* Close button on mobile */}
          <button onClick={() => setMobileOpen(false)} className="lg:hidden text-slate-400 hover:text-slate-100 p-1">
            <X size={20} />
          </button>
        </div>

        {/* Navigation Items */}
        <div className="space-y-1.5 crm-scroll overflow-y-auto max-h-[calc(100vh-220px)] pr-1">
          
          {/* Dashboard Main Link */}
          {mainNav.map(item => {
            const Icon = item.icon
            const isActive = location.pathname === item.path

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-sm group ${
                  isActive
                    ? 'bg-gradient-to-r from-[#c9a84c] to-[#eab308] text-slate-950 border border-[#fef08a] font-black shadow-md'
                    : 'bg-slate-900/80 border border-slate-800 text-slate-100 hover:text-white hover:bg-slate-800 hover:border-[#c9a84c]/50'
                }`}
              >
                <span>{item.label}</span>
                <Icon size={16} className={isActive ? 'text-slate-950' : 'text-amber-400/80 group-hover:text-amber-300 transition-colors'} />
              </Link>
            )
          })}

          {/* Vehicles Management Accordion Menu */}
          <div>
            <button
              onClick={() => setVehiclesOpen(!vehiclesOpen)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all shadow-sm group ${
                isVehiclesRoute
                  ? 'bg-[#c9a84c]/20 text-[#c9a84c] border-[#c9a84c]/50 font-black shadow-md'
                  : 'bg-slate-900/80 border-slate-800 text-slate-100 hover:text-amber-300 hover:bg-slate-800 hover:border-[#c9a84c]/50'
              }`}
            >
              <div className="flex items-center gap-2">
                <span>Vehicles Management</span>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-[#c9a84c]/20 text-[#c9a84c] border border-[#c9a84c]/30">{vehiclesSubItems.length}</span>
                {vehiclesOpen ? <ChevronDown size={14} className="text-amber-400" /> : <ChevronRight size={14} className="text-amber-400/80 group-hover:text-amber-300" />}
              </div>
            </button>

            {/* Sub-menu Items */}
            {vehiclesOpen && (
              <div className="mt-2 ml-2 pl-3 border-l-2 border-l-[#c9a84c]/40 space-y-1.5">
                {vehiclesSubItems.map(sub => {
                  const SubIcon = sub.icon
                  const isSubActive = location.pathname === sub.path || 
                    (sub.path === '/add-listing' && (location.pathname === '/add-listing' || location.pathname === '/admin/vehicles/add')) || 
                    (sub.path === '/admin/vehicles' && (location.pathname === '/admin/vehicles' || location.pathname === '/vehicles'));

                  return (
                    <Link
                      key={sub.path}
                      to={sub.path}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center justify-between px-3 py-2 rounded-lg text-[11px] font-bold tracking-wider uppercase transition-all shadow-sm group ${
                        isSubActive
                          ? 'bg-gradient-to-r from-[#c9a84c] to-[#eab308] text-slate-950 font-black border border-[#fef08a] shadow-md scale-[1.01]'
                          : 'bg-slate-900/90 border border-slate-800 text-slate-100 hover:text-white hover:bg-slate-800 hover:border-[#c9a84c]/50'
                      }`}
                    >
                      <span>{sub.label}</span>
                      <SubIcon size={14} className={isSubActive ? 'text-slate-950' : 'text-amber-400/80 group-hover:text-amber-300 transition-colors'} />
                    </Link>
                  )
                })}
              </div>
            )}
          </div>

          {/* Fuse CRM Suite Accordion Menu */}
          <div className="pt-3">
            <button
              onClick={() => setCrmOpen(!crmOpen)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all shadow-sm group ${
                location.pathname.startsWith('/crm')
                  ? 'bg-[#c9a84c]/20 text-[#c9a84c] border-[#c9a84c]/50 font-black shadow-md'
                  : 'bg-slate-900/80 border-slate-800 text-slate-100 hover:text-amber-300 hover:bg-slate-800 hover:border-[#c9a84c]/50'
              }`}
            >
              <div className="flex items-center gap-2">
                <span>Fuse CRM Suite</span>
                {urgentTasksCount > 0 && (
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping shadow-rose-500/50" />
                )}
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-[#c9a84c]/20 text-[#c9a84c] border border-[#c9a84c]/30">{crmSubItems.length}</span>
                {crmOpen ? <ChevronDown size={14} className="text-amber-400" /> : <ChevronRight size={14} className="text-amber-400/80 group-hover:text-amber-300" />}
              </div>
            </button>

            {/* Sub-menu Items */}
            {crmOpen && (
              <div className="mt-2 ml-2 pl-3 border-l-2 border-l-[#c9a84c]/40 space-y-1.5">
                {crmSubItems.map(sub => {
                  const SubIcon = sub.icon
                  const isSubActive = location.pathname === sub.path

                  return (
                    <Link
                      key={sub.path}
                      to={sub.path}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center justify-between px-3 py-2 rounded-lg text-[11px] font-bold tracking-wider uppercase transition-all shadow-sm group ${
                        isSubActive
                          ? 'bg-gradient-to-r from-[#c9a84c] to-[#eab308] text-slate-950 font-black border border-[#fef08a] shadow-md scale-[1.01]'
                          : 'bg-slate-900/90 border border-slate-800 text-slate-100 hover:text-white hover:bg-slate-800 hover:border-[#c9a84c]/50'
                      }`}
                    >
                      <span>{sub.label}</span>
                      
                      <div className="flex items-center gap-2">
                        {sub.badge && (
                          <span className="px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-400 font-mono text-[9px] font-bold border border-rose-500/30">
                            {sub.badge}
                          </span>
                        )}
                        <SubIcon size={14} className={isSubActive ? 'text-slate-950' : 'text-amber-400/80 group-hover:text-amber-300 transition-colors'} />
                      </div>
                    </Link>
                  )
                })}
              </div>
            )}
          </div>

          {/* Fuse Analytics Accordion Menu */}

            <div className="pt-3">
              <button
                onClick={() => setAnalyticsOpen(!analyticsOpen)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all shadow-sm group ${
                  location.pathname.startsWith('/analytics')
                    ? 'bg-[#6366f1]/20 text-[#6366f1] border-[#6366f1]/50 font-black shadow-md'
                    : 'bg-slate-900/80 border-slate-800 text-slate-100 hover:text-indigo-300 hover:bg-slate-800 hover:border-[#6366f1]/50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span>Fuse Analytics</span>
                  <span className="w-2.5 h-2.5 rounded-full bg-[#06b6d4] animate-pulse shadow-cyan-500/50" />
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-[#6366f1]/20 text-[#6366f1] border border-[#6366f1]/30">{analyticsSubItems.length}</span>
                  {analyticsOpen ? <ChevronDown size={14} className="text-indigo-400" /> : <ChevronRight size={14} className="text-indigo-400/80 group-hover:text-indigo-300" />}
                </div>
              </button>

              {/* Analytics Sub-menu Items */}
              {analyticsOpen && (
                <div className="mt-2 ml-2 pl-3 border-l-2 border-l-[#6366f1]/50 space-y-1.5">
                  {analyticsSubItems.map(sub => {
                    const SubIcon = sub.icon
                    const isSubActive = location.pathname === sub.path

                    return (
                      <Link
                        key={sub.path}
                        to={sub.path}
                        onClick={() => setMobileOpen(false)}
                        className={`flex items-center justify-between px-3 py-2 rounded-lg text-[11px] font-bold tracking-wider uppercase transition-all shadow-sm group ${
                          isSubActive
                            ? 'bg-gradient-to-r from-[#6366f1] to-indigo-500 text-white font-black border border-indigo-300 shadow-md scale-[1.01]'
                            : 'bg-slate-900/90 border border-slate-800 text-slate-100 hover:text-white hover:bg-slate-800 hover:border-[#6366f1]/50'
                        }`}
                      >
                        <span>{sub.label}</span>
                        <SubIcon size={14} className={isSubActive ? 'text-white' : 'text-indigo-400/80 group-hover:text-indigo-300 transition-colors'} />
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>

          {/* Campaign Monitor Parent Accordion Menu */}
          <div className="pt-3">
            <button
              onClick={() => setCampaignOpen(!campaignOpen)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all shadow-sm group ${
                location.pathname.startsWith('/analytics/campaign-monitor')
                  ? 'bg-gradient-to-r from-[#6366f1]/25 to-[#c9a84c]/25 text-white border-[#6366f1]/60 shadow-lg font-black'
                  : 'bg-slate-900/80 border-slate-800 text-slate-100 hover:text-emerald-300 hover:bg-slate-800 hover:border-emerald-500/50'
              }`}
            >
              <div className="flex items-center gap-2">
                <span>Campaign Monitor</span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping shadow-emerald-500/50" />
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-[#6366f1]/20 text-[#6366f1] border border-[#6366f1]/30">{campaignMonitorSubItems.length}</span>
                {campaignOpen ? <ChevronDown size={14} className="text-emerald-400" /> : <ChevronRight size={14} className="text-emerald-400/80 group-hover:text-emerald-300" />}
              </div>
            </button>

            {/* Campaign Monitor Sub-menu Items */}
            {campaignOpen && (
              <div className="mt-2 ml-2 pl-3 border-l-2 border-l-[#c9a84c]/50 space-y-1.5">
                {campaignMonitorSubItems.map(sub => {
                  const SubIcon = sub.icon
                  const isSubActive = (location.pathname + location.search) === sub.path || (sub.path === '/analytics/campaign-monitor' && location.pathname === '/analytics/campaign-monitor' && !location.search)

                  return (
                    <Link
                      key={sub.path}
                      to={sub.path}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center justify-between px-3 py-2 rounded-lg text-[11px] font-bold tracking-wider uppercase transition-all shadow-sm group ${
                        isSubActive
                          ? 'bg-gradient-to-r from-[#c9a84c] to-[#eab308] text-slate-950 font-black border border-[#fef08a] shadow-md scale-[1.01]'
                          : 'bg-slate-900/90 border border-slate-800 text-slate-100 hover:text-white hover:bg-slate-800 hover:border-[#c9a84c]/50'
                      }`}
                    >
                      <span>{sub.label}</span>
                      <SubIcon size={14} className={isSubActive ? 'text-slate-950' : 'text-amber-400/80 group-hover:text-amber-300 transition-colors'} />
                    </Link>
                  )
                })}
              </div>
            )}
          </div>

          {/* System Settings Main Accordion Menu */}
          <div className="pt-3">
            <button
              onClick={() => setSettingsOpen(!settingsOpen)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all shadow-sm group ${
                isSettingsRoute
                  ? 'bg-gradient-to-r from-purple-500/25 to-[#c9a84c]/25 text-white border-purple-500/60 shadow-lg font-black'
                  : 'bg-slate-900/80 border-slate-800 text-slate-100 hover:text-purple-300 hover:bg-slate-800 hover:border-purple-500/50'
              }`}
            >
              <div className="flex items-center gap-2">
                <span>System Settings</span>
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-pulse shadow-purple-500/50" />
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">{settingsSubItems.length}</span>
                {settingsOpen ? <ChevronDown size={14} className="text-purple-400" /> : <ChevronRight size={14} className="text-purple-400/80 group-hover:text-purple-300" />}
              </div>
            </button>

            {/* Settings Sub-menu Items */}
            {settingsOpen && (
              <div className="mt-2 ml-2 pl-3 border-l-2 border-l-purple-500/50 space-y-1.5">
                {settingsSubItems.map(sub => {
                  const SubIcon = sub.icon
                  const isSubActive = location.pathname === sub.path

                  return (
                    <Link
                      key={sub.path}
                      to={sub.path}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center justify-between px-3 py-2 rounded-lg text-[11px] font-bold tracking-wider uppercase transition-all shadow-sm group ${
                        isSubActive
                          ? 'bg-gradient-to-r from-purple-600 to-indigo-500 text-white font-black border border-purple-300 shadow-md scale-[1.01]'
                          : 'bg-slate-900/90 border border-slate-800 text-slate-100 hover:text-white hover:bg-slate-800 hover:border-purple-500/50'
                      }`}
                    >
                      <span>{sub.label}</span>
                      <SubIcon size={14} className={isSubActive ? 'text-white' : 'text-purple-400/80 group-hover:text-purple-300 transition-colors'} />
                    </Link>
                  )
                })}
              </div>
            )}
          </div>

          {/* Admin Preferences & Quick Links */}
          <div className="pt-4 border-t border-white/10 mt-4 space-y-2">
            <span className="text-[9px] tracking-[2px] uppercase text-slate-500 font-semibold px-3.5">Preferences</span>
            
            {/* Live Chat Notification Preference Toggle */}
            <ActionTooltip text="Configure Real-Time Live Lead & Chat Notification Settings" className="w-full">
              <button
                onClick={() => setShowAlertsModal(true)}
                className="w-full flex items-center justify-between px-3.5 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider border transition-all cursor-pointer bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
              >
                <div className="flex items-center gap-2">
                  {liveChatNotificationsEnabled ? <Bell size={14} className="animate-pulse text-emerald-400" /> : <BellOff size={14} className="text-slate-500" />}
                  <span>Chat Alerts</span>
                </div>
                <span className={`text-[9px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                  liveChatNotificationsEnabled ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-500'
                }`}>
                  {liveChatNotificationsEnabled ? 'ON' : 'OFF'}
                </span>
              </button>
            </ActionTooltip>

            <ActionTooltip text="Open Public Customer Storefront in New Window" className="w-full">
              <a
                href="/"
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-between px-3.5 py-2 rounded-lg text-xs text-slate-400 hover:text-slate-200 hover:bg-white/5 uppercase tracking-wider"
              >
                <span>View Live Website</span>
                <ExternalLink size={14} className="text-slate-500" />
              </a>
            </ActionTooltip>
          </div>

        </div>
      </div>

      {/* Footer / Logout */}
      <div className="pt-4 border-t border-white/10">
        <ActionTooltip text="Terminate Active Command Session" className="w-full">
          <button
            onClick={() => setShowSignOutModal(true)}
            className="w-full relative group overflow-hidden px-4 py-3 rounded-2xl bg-gradient-to-r from-rose-950/40 via-[#111625] to-slate-950 border border-rose-500/30 hover:border-rose-400/80 shadow-lg shadow-rose-950/20 hover:shadow-rose-500/20 transition-all duration-300 flex items-center justify-between text-xs tracking-[1.5px] uppercase font-bold cursor-pointer"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-rose-500/0 via-rose-500/15 to-rose-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            <span className="text-slate-100 group-hover:text-rose-200 font-mono font-bold tracking-widest text-[11px]">Sign Out</span>
            <div className="w-7 h-7 rounded-xl bg-rose-500/15 border border-rose-500/40 flex items-center justify-center text-rose-400 group-hover:bg-rose-500 group-hover:text-slate-950 group-hover:scale-105 transition-all shadow-sm">
              <Power size={13} className="transition-transform group-hover:scale-110" />
            </div>
          </button>
        </ActionTooltip>
      </div>

      {/* Sign Out Confirmation Modal */}
      <ConfirmSignOutModal
        isOpen={showSignOutModal}
        onClose={() => setShowSignOutModal(false)}
        onConfirm={handleLogout}
        isLight={adminTheme === 'light'}
      />

      {/* Notification Control Modal */}
      <NotificationSettingsModal
        isOpen={showAlertsModal}
        onClose={() => setShowAlertsModal(false)}
        isLight={adminTheme === 'light'}
      />
    </div>
  )

  return (
    <div className={`min-h-screen flex flex-col lg:flex-row transition-colors duration-300 ${
      adminTheme === 'light' ? 'bg-slate-100 text-slate-900' : 'bg-[#0a0a0a] text-slate-100'
    }`}>
      
      {/* Mobile Top Bar */}
      <div className="lg:hidden sticky top-0 z-40 bg-[#080808] border-b border-[#c9a84c]/20 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => setMobileOpen(true)} className="p-2 text-[#c9a84c] hover:bg-white/5 rounded-lg">
            <Menu size={22} />
          </button>

          <Link to="/admin/dashboard">
            <BrandLogo variant="admin" size="sm" showSubtitle={false} />
          </Link>
        </div>
      </div>

      {/* Mobile Slide-over Drawer Overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex">
          <div className="w-72 h-full">
            {sidebarContent}
          </div>
          <div className="flex-1" onClick={() => setMobileOpen(false)} />
        </div>
      )}

      {/* Desktop Fixed Left Sidebar (Anchored Viewport Architecture) */}
      <div className="hidden lg:block w-72 h-screen fixed top-0 left-0 z-30 shrink-0">
        {sidebarContent}
      </div>

      {/* Main Page Body Container (Offset by Sidebar Width) */}
      <div className={`flex-1 min-w-0 lg:pl-72 min-h-screen relative transition-colors duration-300 ${
        adminTheme === 'light' ? 'bg-slate-100' : 'bg-[#020617]'
      }`}>
        {children}
      </div>

    </div>
  )
}
