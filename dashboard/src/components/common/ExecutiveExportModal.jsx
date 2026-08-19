import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useLocation } from 'react-router-dom'
import { useCRMStore } from '../../context/CRMStore'
import { useAnalyticsStore } from '../../context/AnalyticsStore'
import { generateExecutivePDF, generateExecutiveExcel } from '../../utils/executiveReportExporter'
import {
  FileText, Download, X, Check, FileSpreadsheet, Shield, Sparkles,
  TrendingUp, Megaphone, Car, Clock, ShieldCheck, Printer, CheckCircle2, Globe, Monitor,
  Award, PieChart, Activity, Cpu, Users, BarChart3
} from 'lucide-react'

export default function ExecutiveExportModal({ isOpen, onClose }) {
  const location = useLocation()
  const crmState = useCRMStore()
  const analyticsState = useAnalyticsStore()
  const isLight = crmState.adminTheme === 'light'

  const getSuggestedReport = (path) => {
    if (!path) return 'page_specific'
    if (path.includes('/campaign-analytics') || path.includes('/metrics')) {
      return 'campaign-analytics'
    } else if (path.includes('/topology') || path.includes('/visitor-map') || path.includes('/visitor-tracking') || path.includes('/security-center') || path.includes('/server-vitals') || path.includes('/traffic-logs')) {
      return 'security'
    } else if (path.includes('/campaign-monitor') || path.includes('/campaigns') || path.includes('/funnel')) {
      return 'campaigns'
    } else if (path.includes('/inventory') || path.includes('/product-traffic') || path.includes('/most-searched')) {
      return 'inventory'
    } else if (path.includes('/tasks') || path.includes('/communication') || path.includes('/sla-tracker') || path.includes('/support')) {
      return 'sla'
    }
    return 'page_specific'
  }

  const [selectedReport, setSelectedReport] = useState(() => getSuggestedReport(location.pathname))
  const [selectedFormat, setSelectedFormat] = useState('pdf')
  const [isExporting, setIsExporting] = useState(false)
  const [exportSuccess, setExportSuccess] = useState(false)

  // Reset report suite selection whenever modal is freshly opened
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        setSelectedReport(getSuggestedReport(location.pathname))
      }, 0)
      return () => clearTimeout(timer)
    }
  }, [isOpen, location.pathname])

  if (!isOpen) return null

  const reportSuites = [
    {
      id: 'page_specific',
      title: 'Active Page Dynamic Audit',
      subtitle: `Auto-customized report tailored directly to your active view (${location.pathname})`,
      icon: Sparkles,
      badge: 'Page Specific'
    },
    {
      id: 'campaign-analytics',
      title: 'Executive Campaign Performance & Attribution Audit',
      subtitle: 'Omnichannel CPL, CAC, channel conversions, city intelligence & landing telemetry',
      icon: Megaphone,
      badge: 'Campaign Analytics'
    },
    {
      id: 'board',
      title: 'Executive Board & Revenue Audit',
      subtitle: 'Sales pipeline forecast, win/loss ratio, deal velocity & rep leaderboard',
      icon: TrendingUp,
      badge: 'Board & C-Suite'
    },
    {
      id: 'sales_rep',
      title: 'Sales Rep Performance & Commission Audit',
      subtitle: 'Quota attainment, deal closing velocity & sales commission payouts',
      icon: Award,
      badge: 'Sales Operations'
    },
    {
      id: 'campaigns',
      title: 'Digital Campaign ROI & ROAS Intelligence',
      subtitle: 'Ad attribution, spend vs revenue, CTR & W-Shaped multi-touch attribution',
      icon: Megaphone,
      badge: 'CMO & Marketing'
    },
    {
      id: 'attribution',
      title: 'Multi-Touch Attribution & CPA Matrix',
      subtitle: 'W-Shaped funnel touchpoints, cost-per-acquisition & channel ROI',
      icon: PieChart,
      badge: 'Marketing Intelligence'
    },
    {
      id: 'inventory',
      title: 'Vehicle Fleet Demand & Interest Forecast',
      subtitle: 'Product views, inquiry scores, regional interest & replenishment alerts',
      icon: Car,
      badge: 'Inventory & Operations'
    },
    {
      id: 'geo_demographics',
      title: 'Regional Demographics & Geo-Expansion Report',
      subtitle: 'County buyer demand, regional vehicle preference & diplomatic export metrics',
      icon: Globe,
      badge: 'Strategy & Expansion'
    },
    {
      id: 'sla',
      title: 'Customer SLA & Support Compliance Ledger',
      subtitle: 'Response times, escalation frequency & omnichannel interaction log',
      icon: Clock,
      badge: 'Customer Care & Operations'
    },
    {
      id: 'security',
      title: 'Cybersecurity, WAF & Vitals Audit Log',
      subtitle: 'Threat mitigations, IP blacklists, bot ratio & server health vitals',
      icon: ShieldCheck,
      badge: 'CTO & Security'
    },
    {
      id: 'tech_vitals',
      title: 'Infrastructure Vitals & Technical SLA Audit',
      subtitle: 'Core Web Vitals, API response latency, CPU/RAM telemetry & uptime',
      icon: Cpu,
      badge: 'DevOps & Systems'
    }
  ]

  const handleExecuteExport = () => {
    setIsExporting(true)
    setTimeout(() => {
      if (selectedFormat === 'pdf') {
        generateExecutivePDF(selectedReport, crmState, analyticsState, location.pathname)
      } else {
        generateExecutiveExcel(selectedReport, crmState, analyticsState, location.pathname)
      }
      setIsExporting(false)
      setExportSuccess(true)
      setTimeout(() => setExportSuccess(false), 3000)
    }, 400)
  }

  return createPortal(
    <div className="fixed inset-0 z-[99999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto crm-scroll">
      <div className={`max-w-2xl w-full max-h-[85vh] my-auto flex flex-col p-6 rounded-3xl border shadow-2xl relative font-sans transition-all overflow-hidden ${
        isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#0f172a] border-white/10 text-slate-100'
      }`}>
        {/* Header */}
        <div className={`flex items-center justify-between border-b pb-4 mb-4 flex-shrink-0 ${isLight ? 'border-slate-200' : 'border-[#c9a84c]/20'}`}>
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="text-[#c9a84c]" size={22} />
              <h2 className={`text-xl font-serif font-bold ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                Executive Report Center
              </h2>
            </div>
            <p className={`text-xs font-mono mt-0.5 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              Print-Perfect A4 Corporate PDFs &amp; Formatted Microsoft Excel Workbooks
            </p>
          </div>
          <button onClick={onClose} className={`p-1 rounded-lg transition-colors cursor-pointer ${isLight ? 'text-slate-500 hover:text-slate-800 hover:bg-slate-100' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'}`}>
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Modal Content Body */}
        <div className="flex-1 overflow-y-auto crm-scroll pr-1 space-y-5">
          {/* Step 1: Select Report Suite */}
          <div>
            <label className={`block uppercase text-[10px] font-mono tracking-wider font-bold mb-2 ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>
              1. Select Executive Report Suite
            </label>

            <div className="space-y-2 max-h-56 overflow-y-auto crm-scroll pr-1">
              {reportSuites.map(suite => {
                const Icon = suite.icon
                const isSelected = selectedReport === suite.id
                return (
                  <div
                    key={suite.id}
                    onClick={() => setSelectedReport(suite.id)}
                    className={`p-3 rounded-2xl border flex items-center justify-between gap-3 cursor-pointer transition-all ${
                      isSelected
                        ? isLight
                          ? 'bg-amber-50 border-[#c9a84c] text-slate-900 shadow-md ring-1 ring-[#c9a84c]'
                          : 'bg-[#c9a84c]/10 border-[#c9a84c] text-slate-100 shadow-lg ring-1 ring-[#c9a84c]/50'
                        : isLight ? 'bg-slate-50 border-slate-200 hover:bg-slate-100' : 'bg-slate-950/60 border-white/10 hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`p-2 rounded-xl border ${
                        isSelected ? 'bg-[#c9a84c] text-slate-950 border-[#c9a84c]' : 'bg-slate-900 text-slate-400 border-white/10'
                      }`}>
                        <Icon size={16} />
                      </div>
                      <div className="truncate">
                        <div className="font-serif font-bold text-sm truncate">{suite.title}</div>
                        <div className={`text-[10px] font-mono truncate ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>{suite.subtitle}</div>
                      </div>
                    </div>

                    <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border uppercase flex-shrink-0 ${
                      isSelected
                        ? 'bg-[#c9a84c]/20 text-[#c9a84c] border-[#c9a84c]/40'
                        : isLight ? 'bg-slate-200 text-slate-700 border-slate-300' : 'bg-slate-900 text-slate-400 border-white/10'
                    }`}>
                      {suite.badge}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Step 2: Format Selector */}
          <div>
            <label className={`block uppercase text-[10px] font-mono tracking-wider font-bold mb-2 ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>
              2. Select Output Document Format
            </label>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSelectedFormat('pdf')}
                className={`p-3.5 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                  selectedFormat === 'pdf'
                    ? 'bg-rose-500/10 border-rose-500 text-rose-500 ring-1 ring-rose-500/40 shadow-lg'
                    : isLight ? 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100' : 'bg-slate-950/60 border-white/10 text-slate-400 hover:bg-white/5'
                }`}
              >
                <FileText size={22} className="text-rose-500" />
                <div>
                  <div className="font-bold text-xs font-mono">Corporate A4 PDF</div>
                  <div className="text-[10px] text-slate-500">Print-Perfect Vector Page Margins</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedFormat('excel')}
                className={`p-3.5 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                  selectedFormat === 'excel'
                    ? 'bg-emerald-500/10 border-emerald-500 text-emerald-500 ring-1 ring-emerald-500/40 shadow-lg'
                    : isLight ? 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100' : 'bg-slate-950/60 border-white/10 text-slate-400 hover:bg-white/5'
                }`}
              >
                <FileSpreadsheet size={22} className="text-emerald-500" />
                <div>
                  <div className="font-bold text-xs font-mono">Microsoft Excel (.xlsx)</div>
                  <div className="text-[10px] text-slate-500">Formatted Spreadsheet Workbook</div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div className={`pt-4 mt-4 border-t flex-shrink-0 flex items-center justify-between ${isLight ? 'border-slate-200' : 'border-white/10'}`}>
          <div className="flex items-center gap-2">
            {exportSuccess && (
              <span className="text-xs font-mono font-bold text-emerald-500 flex items-center gap-1.5 animate-pulse">
                <CheckCircle2 size={16} />
                <span>Report Generated &amp; Downloaded Successfully!</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 rounded-xl border text-xs font-mono font-bold cursor-pointer ${
                isLight ? 'border-slate-300 text-slate-700 hover:bg-slate-100' : 'border-white/10 text-slate-300 hover:bg-white/5'
              }`}
            >
              Close
            </button>

            <button
              type="button"
              disabled={isExporting}
              onClick={handleExecuteExport}
              className="px-6 py-2.5 bg-gradient-to-r from-[#c9a84c] via-amber-500 to-[#d9b85c] text-slate-950 font-bold rounded-xl text-xs uppercase tracking-wider hover:opacity-90 transition-all shadow-xl shadow-[#c9a84c]/20 flex items-center gap-2 cursor-pointer"
            >
              <Download size={15} />
              <span>{isExporting ? 'Generating Report...' : `Export ${selectedFormat.toUpperCase()}`}</span>
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}
