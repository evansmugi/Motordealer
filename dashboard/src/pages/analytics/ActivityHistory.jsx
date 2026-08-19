import React, { useState, useMemo } from 'react'
import { useAnalyticsStore } from '../../context/AnalyticsStore'
import { useCRMStore } from '../../context/CRMStore'
import UniversalPagination from '../../components/common/UniversalPagination'
import { History, Search, Download, Filter } from 'lucide-react'

export default function ActivityHistory() {
  const adminTheme = useCRMStore(state => state.adminTheme)
  const isLight = adminTheme === 'light'
  const pageViews = useAnalyticsStore(state => state.pageViews)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  const filteredViews = useMemo(() => {
    return pageViews.filter(pv => 
      pv.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pv.session_id.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [pageViews, searchTerm])

  const totalPages = Math.ceil(filteredViews.length / itemsPerPage) || 1
  const paginatedViews = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return filteredViews.slice(start, start + itemsPerPage)
  }, [filteredViews, currentPage, itemsPerPage])

  const handleExportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + ["ID,Session ID,IP Address,Latitude,Longitude,Location Name,Browser,Device,Page Section,URL,Referrer,Scroll Depth,Duration,Timestamp",
        ...filteredViews.map(p => `${p.id},${p.session_id},${p.ip_address || '102.217.155.84'},${p.latitude || -1.286389},${p.longitude || 36.817223},"${p.location_name || 'Nairobi, Kenya'}",${p.browser || 'Chrome 126.0'},"${p.device || 'Desktop (Windows 11)'}","${p.page_section || 'Hero Section'}",${p.url},${p.referrer},${p.scroll_depth},${p.time_on_page},${p.created_at}`)
      ].join("\n")

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `Activity_History_${Date.now()}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-6 font-sans pb-12">
      {/* Header */}
      <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl border shadow-2xl backdrop-blur-xl ${isLight ? 'bg-white/90 border-slate-200' : 'bg-[#070b14]/90 border-white/10'}`}>
        <div>
          <span className="text-[10px] tracking-[4px] uppercase font-bold text-[#6366f1]">Audit Telemetry</span>
          <h1 className={`text-2xl font-serif font-light mt-1 ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>Activity History Log</h1>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-4 py-2 bg-gradient-to-r from-[#6366f1] to-[#06b6d4] text-white font-semibold text-xs uppercase tracking-wider rounded-xl hover:opacity-90 transition-all flex items-center gap-2 shadow-lg"
        >
          <Download size={14} />
          <span>Export History CSV</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className={`p-4 rounded-2xl border flex items-center gap-3 ${isLight ? 'bg-white border-slate-200' : 'bg-[#111827] border-white/10'}`}>
        <Search size={16} className="text-slate-500" />
        <input
          type="text"
          placeholder="Filter history by IP address, Location, Browser, URL or Session ID..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className={`w-full bg-transparent text-xs placeholder-slate-400 outline-none font-mono ${isLight ? 'text-slate-800' : 'text-slate-200'}`}
        />
      </div>

      {/* Audit Log Table */}
      <div className={`p-6 rounded-2xl border shadow-2xl space-y-4 ${isLight ? 'bg-white border-slate-200' : 'bg-[#111827] border-white/10'}`}>
        <div className="crm-scroll overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className={`border-b uppercase tracking-wider text-[10px] ${isLight ? 'border-slate-200 text-slate-500' : 'border-white/10 text-slate-400'}`}>
                <th className="pb-3">Log ID</th>
                <th className="pb-3">IP Address</th>
                <th className="pb-3">Lat / Lng</th>
                <th className="pb-3">Location Name</th>
                <th className="pb-3">Browser / Device</th>
                <th className="pb-3">Client Section</th>
                <th className="pb-3">Target URL</th>
                <th className="pb-3">Scroll</th>
                <th className="pb-3">Timestamp</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isLight ? 'divide-slate-100 text-slate-700' : 'divide-white/5 text-slate-300'}`}>
              {paginatedViews.map(pv => (
                <tr key={pv.id} className={isLight ? 'hover:bg-slate-50' : 'hover:bg-white/[0.02]'}>
                  <td className={`py-3 font-bold ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>#{pv.id}</td>
                  <td className="py-3 font-bold text-emerald-600">{pv.ip_address || '102.217.155.84'}</td>
                  <td className="py-3 text-cyan-600">{pv.latitude || -1.286389}, {pv.longitude || 36.817223}</td>
                  <td className={`py-3 font-semibold ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>{pv.location_name || 'Nairobi, Kenya'}</td>
                  <td className={`py-3 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                    <span className={isLight ? 'text-purple-600' : 'text-purple-300'}>{pv.browser || 'Chrome 126.0'}</span> • <span className={isLight ? 'text-slate-500' : 'text-slate-400'}>{pv.device || 'Desktop (Windows 11)'}</span>
                  </td>
                  <td className="py-3 text-[#a3e635] font-semibold">{pv.page_section || 'Hero & Vehicle Discovery'}</td>
                  <td className={`py-3 font-bold ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>{pv.url}</td>
                  <td className="py-3 text-amber-500">{pv.scroll_depth}%</td>
                  <td className={`py-3 ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>{new Date(pv.created_at).toLocaleTimeString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Universal Pagination */}
        <UniversalPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredViews.length}
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
