import React, { useState, useMemo } from 'react'
import { useAnalyticsStore } from '../../context/AnalyticsStore'
import { useCRMStore } from '../../context/CRMStore'
import UniversalPagination from '../../components/common/UniversalPagination'
import ActionTooltip from '../../components/common/ActionTooltip'
import { ListFilter, Download, Search, ShieldCheck, Bot, Filter, ExternalLink } from 'lucide-react'

export default function TrafficLogs() {
  const adminTheme = useCRMStore(state => state.adminTheme)
  const isLight = adminTheme === 'light'
  const sessions = useAnalyticsStore(state => state.sessions)
  const [searchTerm, setSearchTerm] = useState('')
  const [sourceFilter, setSourceFilter] = useState('ALL')
  const [scoreFilter, setScoreFilter] = useState('ALL')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  const filteredSessions = useMemo(() => {
    return sessions.filter(s => {
      const matchesSearch = s.ip_address.toLowerCase().includes(searchTerm.toLowerCase()) || s.city.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesSource = sourceFilter === 'ALL' || s.acquisition_source === sourceFilter
      const matchesScore = scoreFilter === 'ALL' ? true :
        scoreFilter === 'HIGH' ? s.conversion_score >= 70 :
        scoreFilter === 'MEDIUM' ? (s.conversion_score >= 30 && s.conversion_score < 70) : s.conversion_score < 30
      return matchesSearch && matchesSource && matchesScore
    })
  }, [sessions, searchTerm, sourceFilter, scoreFilter])

  const totalPages = Math.ceil(filteredSessions.length / itemsPerPage) || 1
  const paginatedSessions = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return filteredSessions.slice(start, start + itemsPerPage)
  }, [filteredSessions, currentPage, itemsPerPage])

  const handleExportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + ["Session ID,IP Address,Latitude,Longitude,Location Name,Browser,Device,Page Section,Source,Conversion Score,Created At",
        ...filteredSessions.map(s => `${s.id},${s.ip_address},${s.latitude || s.geo_lat || -1.286389},${s.longitude || s.geo_lng || 36.817223},"${s.location_name || `${s.city}, ${s.geo_country}`}",${s.browser || 'Chrome 126.0'},"${s.device || 'Desktop (Windows 11)'}","${s.page_section || 'Hero Section'}",${s.acquisition_source},${s.conversion_score},${s.created_at}`)
      ].join("\n")

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `Traffic_Logs_Ledger_${Date.now()}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-6 font-sans pb-12">
      {/* Header */}
      <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl border shadow-2xl backdrop-blur-xl ${isLight ? 'bg-white/90 border-slate-200' : 'bg-[#070b14]/90 border-white/10'}`}>
        <div>
          <span className="text-[10px] tracking-[4px] uppercase font-bold text-[#06b6d4]">Full Session Ledger</span>
          <h1 className={`text-2xl font-serif font-light mt-1 ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>Traffic & Session Logs</h1>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-4 py-2 bg-gradient-to-r from-[#6366f1] to-[#06b6d4] text-white font-semibold text-xs uppercase tracking-wider rounded-xl hover:opacity-90 transition-all flex items-center gap-2 shadow-lg"
        >
          <Download size={14} />
          <span>Export Visitor Matrix</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className={`p-4 rounded-2xl border flex flex-col md:flex-row gap-3 ${isLight ? 'bg-white border-slate-200' : 'bg-[#111827] border-white/10'}`}>
        <div className={`flex-1 flex items-center gap-2 px-3 py-2 rounded-xl border text-xs ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-white/10'}`}>
          <Search size={14} className="text-slate-500" />
          <input
            type="text"
            placeholder="Search IP, Location Name, or Browser..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className={`w-full bg-transparent placeholder-slate-400 outline-none font-mono ${isLight ? 'text-slate-800' : 'text-slate-200'}`}
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={sourceFilter}
            onChange={e => setSourceFilter(e.target.value)}
            className={`border rounded-xl px-3 py-2 text-xs font-mono outline-none ${isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-slate-950 border-white/10 text-slate-200'}`}
          >
            <option value="ALL">All Sources</option>
            <option value="Direct">Direct</option>
            <option value="Organic Search">Organic Search</option>
            <option value="Social">Social</option>
            <option value="Referral">Referral</option>
          </select>

          <select
            value={scoreFilter}
            onChange={e => setScoreFilter(e.target.value)}
            className={`border rounded-xl px-3 py-2 text-xs font-mono outline-none ${isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-slate-950 border-white/10 text-slate-200'}`}
          >
            <option value="ALL">All Score Levels</option>
            <option value="HIGH">High Score (&ge;70 pts)</option>
            <option value="MEDIUM">Medium Score (30-69 pts)</option>
            <option value="LOW">Low Score (&lt;30 pts)</option>
          </select>
        </div>
      </div>

      {/* Session Ledger Table */}
      <div className={`p-6 rounded-2xl border shadow-2xl space-y-4 ${isLight ? 'bg-white border-slate-200' : 'bg-[#111827] border-white/10'}`}>
        <div className="crm-scroll overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className={`border-b uppercase tracking-wider text-[10px] ${isLight ? 'border-slate-200 text-slate-500' : 'border-white/10 text-slate-400'}`}>
                <th className="pb-3">Session IP</th>
                <th className="pb-3">Lat / Lng</th>
                <th className="pb-3">Location Name</th>
                <th className="pb-3">Browser / Device</th>
                <th className="pb-3">Client Section</th>
                <th className="pb-3">Acquisition Source</th>
                <th className="pb-3">Conversion Score</th>
                <th className="pb-3">Security Flag</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isLight ? 'divide-slate-100 text-slate-700' : 'divide-white/5 text-slate-300'}`}>
              {paginatedSessions.map(s => (
                <tr key={s.id} className={isLight ? 'hover:bg-slate-50' : 'hover:bg-white/[0.02]'}>
                  <td className="py-3 font-bold text-emerald-600">{s.ip_address}</td>
                  <td className="py-3">
                    {(() => {
                      const lat = s.latitude || s.geo_lat || -1.286389
                      const lng = s.longitude || s.geo_lng || 36.817223
                      const mapsUrl = `https://www.google.com/maps?q=${lat},${lng}`
                      return (
                        <ActionTooltip text="View Coordinates on Google Maps">
                          <a
                            href={mapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`underline font-mono inline-flex items-center gap-1.5 hover:scale-105 transition-all font-semibold ${isLight ? 'text-cyan-600 hover:text-cyan-700' : 'text-cyan-400 hover:text-cyan-300'}`}
                          >
                            <span>{lat}, {lng}</span>
                            <ExternalLink size={11} className="text-cyan-500/70 shrink-0" />
                          </a>
                        </ActionTooltip>
                      )
                    })()}
                  </td>
                  <td className={`py-3 font-semibold ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>{s.location_name || `${s.city}, ${s.geo_country}`}</td>
                  <td className={`py-3 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                    <span className={isLight ? 'text-purple-600' : 'text-purple-300'}>{s.browser || 'Chrome 126.0'}</span> • <span className={isLight ? 'text-slate-500' : 'text-slate-400'}>{s.device || 'Desktop (Windows 11)'}</span>
                  </td>
                  <td className="py-3 text-[#a3e635] font-semibold">{s.page_section || 'Hero & Vehicle Discovery'}</td>
                  <td className="py-3 text-[#06b6d4]">{s.acquisition_source}</td>
                  <td className="py-3 font-bold text-[#a3e635]">{s.conversion_score} pts</td>
                  <td className="py-3">
                    {s.is_bot ? (
                      <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-500 border border-rose-500/40 text-[10px]">BOT</span>
                    ) : (
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-600 border border-emerald-500/40 text-[10px]">HUMAN</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Universal Pagination */}
        <UniversalPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredSessions.length}
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
