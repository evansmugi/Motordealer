import React, { useState, useMemo } from 'react'
import { useAnalyticsStore } from '../../context/AnalyticsStore'
import { useCRMStore } from '../../context/CRMStore'
import UniversalPagination from '../../components/common/UniversalPagination'
import { Eye, Radar, Monitor, Smartphone, Globe, Shield, Clock, MapPin } from 'lucide-react'

export default function VisitorTracking() {
  const adminTheme = useCRMStore(state => state.adminTheme)
  const isLight = adminTheme === 'light'
  const sessions = useAnalyticsStore(state => state.sessions)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(6)

  const activeNodesCount = sessions.length
  const totalPages = Math.ceil(sessions.length / itemsPerPage) || 1

  const paginatedSessions = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return sessions.slice(start, start + itemsPerPage)
  }, [sessions, currentPage, itemsPerPage])

  const topCities = [
    { city: 'Nairobi', count: 142, percentage: 65 },
    { city: 'Mombasa', count: 48, percentage: 22 },
    { city: 'Kisumu', count: 18, percentage: 8 },
    { city: 'Nakuru', count: 11, percentage: 5 }
  ]

  return (
    <div className="space-y-6 font-sans pb-12">
      {/* Header Ticker */}
      <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl border shadow-2xl backdrop-blur-xl ${isLight ? 'bg-white/90 border-slate-200' : 'bg-[#070b14]/90 border-white/10'}`}>
        <div>
          <span className="text-[10px] tracking-[4px] uppercase font-bold text-[#06b6d4]">Real-Time Monitoring</span>
          <h1 className={`text-2xl font-serif font-light mt-1 ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>Visitor Tracking Radar</h1>
        </div>

        {/* Ticker Radar Pill */}
        <div className={`flex items-center gap-4 px-4 py-2 rounded-xl border text-xs font-mono ${isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-950 border-white/10'}`}>
          <div className="flex items-center gap-2">
            <Radar size={16} className="text-[#06b6d4] animate-spin" />
            <span className={isLight ? 'text-slate-600' : 'text-slate-300'}>Active Radar:</span>
            <span className="text-[#a3e635] font-bold">{activeNodesCount} Active Nodes</span>
          </div>
        </div>
      </div>

      {/* Grid of Active Node Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {paginatedSessions.map((node) => (
          <div key={node.id} className={`p-5 rounded-2xl border hover:border-[#06b6d4]/50 transition-all space-y-3 shadow-xl ${isLight ? 'bg-white border-slate-200' : 'bg-[#111827] border-white/10'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className={`font-mono text-sm font-bold ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>{node.ip_address}</span>
              </div>
              <span className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded border text-cyan-600 ${isLight ? 'bg-cyan-50 border-cyan-200' : 'bg-slate-900 border-white/10'}`}>
                {node.browser || 'Chrome 126.0'}
              </span>
            </div>

            {/* Geolocation & Coordinates */}
            <div className={`space-y-1 text-xs font-mono ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
              <div className={`flex items-center gap-1.5 font-semibold ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                <MapPin size={14} className="text-[#06b6d4]" />
                <span className="truncate">{node.location_name || `${node.city}, ${node.geo_country}`}</span>
              </div>
              <div className={`flex items-center gap-1.5 text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                <Globe size={13} className="text-[#a3e635]" />
                <span>Lat/Lng: <strong className={isLight ? 'text-slate-800' : 'text-slate-200'}>{node.latitude || node.geo_lat || -1.286389}, {node.longitude || node.geo_lng || 36.817223}</strong></span>
              </div>
              <div className={`flex items-center gap-1.5 text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                <Monitor size={13} className="text-[#6366f1]" />
                <span>{node.device || 'Desktop (Windows 11)'}</span>
              </div>
              <div className={`flex items-center gap-1.5 text-[11px] truncate ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                <Eye size={13} className="text-rose-400" />
                <span>Section: <strong className={isLight ? 'text-slate-800' : 'text-slate-200'}>{node.page_section || 'Hero & Vehicle Discovery'}</strong></span>
              </div>
            </div>

            <div className={`pt-2 border-t flex items-center justify-between text-[11px] font-mono ${isLight ? 'border-slate-100' : 'border-white/5'}`}>
              <span className={`flex items-center gap-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                <Clock size={12} /> Active Now
              </span>
              {node.is_bot ? (
                <span className="text-rose-500 font-bold px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/30">BOT NODE</span>
              ) : (
                <span className="text-[#a3e635] font-bold px-2 py-0.5 rounded bg-[#a3e635]/10 border border-[#a3e635]/30">Score: {node.conversion_score}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Universal Pagination */}
      <UniversalPagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={sessions.length}
        itemsPerPage={itemsPerPage}
        onPageChange={page => setCurrentPage(page)}
        onItemsPerPageChange={size => {
          setItemsPerPage(size)
          setCurrentPage(1)
        }}
        pageSizeOptions={[6, 12, 24, 48]}
      />


      {/* Top Cities Meter */}
      <div className={`p-6 rounded-2xl border shadow-2xl space-y-4 ${isLight ? 'bg-white border-slate-200' : 'bg-[#111827] border-white/10'}`}>
        <h3 className={`text-lg font-serif font-light ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>Top Cities Traffic Meter</h3>

        <div className="space-y-3">
          {topCities.map(c => (
            <div key={c.city} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className={isLight ? 'text-slate-700' : 'text-slate-200'}>{c.city}</span>
                <span className="text-[#06b6d4] font-bold">{c.count} sessions ({c.percentage}%)</span>
              </div>
              <div className={`w-full h-2 rounded-full overflow-hidden border ${isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-950 border-white/5'}`}>
                <div className="bg-gradient-to-r from-[#6366f1] to-[#06b6d4] h-full rounded-full transition-all duration-500" style={{ width: `${c.percentage}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
