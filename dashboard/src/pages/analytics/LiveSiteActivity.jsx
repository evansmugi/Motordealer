import React, { useState, useEffect, useMemo } from 'react'
import { useCRMStore } from '../../context/CRMStore'
import UniversalPagination from '../../components/common/UniversalPagination'
import { Terminal, Radio, Shield, Zap, Activity } from 'lucide-react'

export default function LiveSiteActivity() {
  const adminTheme = useCRMStore(state => state.adminTheme)
  const isLight = adminTheme === 'light'

  const [logs, setLogs] = useState([
    { id: 1, time: '08:34:12', type: 'PAGEVIEW', ip: '102.217.155.84', coords: '-1.286389, 36.817223', loc: 'Nairobi, Kenya', browser: 'Chrome 126.0', device: 'Desktop (Windows 11)', section: 'Direct Action Inquiry Cards', details: 'Client accessed /most-searched/mercedes' },
    { id: 2, time: '08:34:15', type: 'CLICK', ip: '102.217.155.84', coords: '-1.286389, 36.817223', loc: 'Nairobi, Kenya', browser: 'Chrome 126.0', device: 'Desktop (Windows 11)', section: 'Direct Action Inquiry Cards', details: 'Client clicked <button#req-quote-btn>' },
    { id: 3, time: '08:34:18', type: 'EVENT', ip: '197.232.88.12', coords: '-4.043477, 39.668206', loc: 'Mombasa, Kenya', browser: 'Safari 17.5', device: 'Mobile (iPhone 15 Pro)', section: 'Vehicle Specifications', details: 'Inquiry form field "phone" focused' },
    { id: 4, time: '08:34:22', type: 'SECURITY', ip: '82.165.197.1', coords: '51.507351, -0.127758', loc: 'London, UK', browser: 'HeadlessChrome 125.0', device: 'Desktop (Headless Bot)', section: 'Admin Portal Probe', details: 'SQLi Attempt blocked from Tor proxy' },
    { id: 5, time: '08:34:30', type: 'PAGEVIEW', ip: '105.163.2.90', coords: '-0.091702, 34.767956', loc: 'Kisumu, Kenya', browser: 'Firefox 127.0', device: 'Desktop (macOS)', section: 'Hero & Vehicle Discovery', details: 'Client accessed /vehicle/v-101' },
    { id: 6, time: '08:34:35', type: 'CLICK', ip: '196.201.214.10', coords: '-0.303099, 36.080025', loc: 'Nakuru, Kenya', browser: 'Edge 125.0', device: 'Desktop (Windows 11)', section: 'Financing Calculator', details: 'Client adjusted loan period slider' }
  ])

  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  useEffect(() => {
    const locations = [
      { ip: '102.217.155.84', coords: '-1.286389, 36.817223', loc: 'Nairobi, Kenya' },
      { ip: '197.232.88.12', coords: '-4.043477, 39.668206', loc: 'Mombasa, Kenya' },
      { ip: '105.163.2.90', coords: '-0.091702, 34.767956', loc: 'Kisumu, Kenya' },
      { ip: '196.201.214.10', coords: '-0.303099, 36.080025', loc: 'Nakuru, Kenya' }
    ]
    const sections = ['Hero & Vehicle Discovery', 'Vehicle Specifications & Price Specs', 'Direct Action Inquiry Cards', 'Financing & Trade-In Calculator']

    const interval = setInterval(() => {
      const times = new Date().toTimeString().split(' ')[0]
      const types = ['PAGEVIEW', 'CLICK', 'SCROLL', 'INQUIRY_START']
      const randomType = types[Math.floor(Math.random() * types.length)]
      const targetLoc = locations[Math.floor(Math.random() * locations.length)]
      const targetSec = sections[Math.floor(Math.random() * sections.length)]

      const newLog = {
        id: Date.now(),
        time: times,
        type: randomType,
        ip: targetLoc.ip,
        coords: targetLoc.coords,
        loc: targetLoc.loc,
        browser: 'Chrome 126.0',
        device: 'Desktop (Windows 11)',
        section: targetSec,
        details: `Telemetry hit received for ${randomType.toLowerCase()} on /vehicle`
      }
      setLogs(prev => [newLog, ...prev.slice(0, 50)])
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  const totalPages = Math.ceil(logs.length / itemsPerPage) || 1
  const paginatedLogs = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return logs.slice(start, start + itemsPerPage)
  }, [logs, currentPage, itemsPerPage])

  return (
    <div className="space-y-6 font-sans pb-12">
      {/* Header */}
      <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl border shadow-2xl backdrop-blur-xl ${isLight ? 'bg-white/90 border-slate-200' : 'bg-[#070b14]/90 border-white/10'}`}>
        <div>
          <span className="text-[10px] tracking-[4px] uppercase font-bold text-emerald-500">Sentinel Real-Time Engine</span>
          <h1 className={`text-2xl font-serif font-light mt-1 ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>Live Site Activity Terminal</h1>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-emerald-500 bg-emerald-500/10 px-4 py-2 rounded-xl border border-emerald-500/30">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span>Server Pulse Healthy (24ms)</span>
        </div>
      </div>

      {/* Sentinel Terminal Window */}
      <div className={`p-6 rounded-2xl border shadow-2xl space-y-4 font-mono ${isLight ? 'bg-white border-slate-200' : 'bg-[#080d1a] border-white/10'}`}>
        <div className={`flex items-center justify-between border-b pb-3 ${isLight ? 'border-slate-200' : 'border-white/10'}`}>
          <div className="flex items-center gap-2">
            <Terminal size={18} className="text-[#6366f1]" />
            <span className={`text-xs font-bold ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>Sentinel Telemetry Stream Terminal</span>
          </div>
          <span className={`text-[10px] ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>Auto-scroll: ENABLED</span>
        </div>

        <div className="space-y-2 text-xs overflow-y-auto crm-scroll pr-2">
          {paginatedLogs.map(l => (
            <div key={l.id} className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-2 border-b px-2 rounded ${isLight ? 'border-slate-100 hover:bg-slate-50' : 'border-white/5 hover:bg-white/[0.02]'}`}>
              <div className="flex items-center gap-2 flex-wrap">
                <span className={isLight ? 'text-slate-400' : 'text-slate-500'}>[{l.time}]</span>
                <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                  l.type === 'SECURITY' ? 'bg-rose-500/20 text-rose-500' :
                  l.type === 'CLICK' ? 'bg-amber-500/20 text-amber-600' : 'bg-emerald-500/20 text-emerald-600'
                }`}>
                  {l.type}
                </span>
                <span className="font-bold text-emerald-600">{l.ip}</span>
                <span className="text-cyan-600 text-[11px]">({l.coords})</span>
                <span className={`font-semibold ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>{l.loc}</span>
                <span className={`text-[11px] ${isLight ? 'text-purple-600' : 'text-purple-300'}`}>{l.browser}</span>
                <span className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>({l.device})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#a3e635] text-[11px] font-semibold">Section: {l.section}</span>
                <span className={`font-medium truncate max-w-xs ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>{l.details}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Universal Pagination */}
        <UniversalPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={logs.length}
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
  )
}
