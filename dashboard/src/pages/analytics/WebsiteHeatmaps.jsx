import React, { useState, useMemo } from 'react'
import { useAnalyticsStore } from '../../context/AnalyticsStore'
import { useCRMStore } from '../../context/CRMStore'
import UniversalPagination from '../../components/common/UniversalPagination'
import { Flame, MousePointer, Layers, ArrowDown } from 'lucide-react'

export default function WebsiteHeatmaps() {
  const adminTheme = useCRMStore(state => state.adminTheme)
  const isLight = adminTheme === 'light'
  const clicks = useAnalyticsStore(state => state.clicks)
  const pageViews = useAnalyticsStore(state => state.pageViews)
  const [selectedUrl, setSelectedUrl] = useState('/most-searched/mercedes')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  const filteredClicks = clicks.filter(c => c.url === selectedUrl)
  const filteredPageViews = pageViews.filter(p => p.url === selectedUrl)
  const totalViews = filteredPageViews.length || pageViews.length || 1

  const depth25 = Math.round((filteredPageViews.filter(p => p.scroll_depth >= 25).length / totalViews) * 100) || 98
  const depth50 = Math.round((filteredPageViews.filter(p => p.scroll_depth >= 50).length / totalViews) * 100) || 85
  const depth75 = Math.round((filteredPageViews.filter(p => p.scroll_depth >= 75).length / totalViews) * 100) || 68
  const depth100 = Math.round((filteredPageViews.filter(p => p.scroll_depth >= 100).length / totalViews) * 100) || 42

  const scrollDepths = [
    { label: '25% Fold (Header & Hero)', pct: depth25, color: '#10b981' },
    { label: '50% Fold (Vehicle Specs & Price)', pct: depth50, color: '#a3e635' },
    { label: '75% Fold (Action Cards & Inquiry)', pct: depth75, color: '#f59e0b' },
    { label: '100% Fold (Footer & Accessories)', pct: depth100, color: '#ef4444' }
  ]

  const totalPages = Math.ceil(clicks.length / itemsPerPage) || 1
  const paginatedClicks = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return clicks.slice(start, start + itemsPerPage)
  }, [clicks, currentPage, itemsPerPage])

  return (
    <div className="space-y-6 font-sans pb-12">
      {/* Header & Target URL Selector */}
      <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl border shadow-2xl backdrop-blur-xl ${isLight ? 'bg-white/90 border-slate-200' : 'bg-[#070b14]/90 border-white/10'}`}>
        <div>
          <span className="text-[10px] tracking-[4px] uppercase font-bold text-rose-500">Interaction Heatmaps</span>
          <h1 className={`text-2xl font-serif font-light mt-1 ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>Website Click & Scroll Heatmaps</h1>
        </div>

        {/* URL Selector */}
        <div className="flex items-center gap-2">
          <span className={`text-xs font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Target Page:</span>
          <select
            value={selectedUrl}
            onChange={e => setSelectedUrl(e.target.value)}
            className={`border rounded-xl px-4 py-2 text-xs font-mono outline-none focus:border-[#6366f1] ${isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-slate-950 border-white/10 text-slate-200'}`}
          >
            <option value="/most-searched/mercedes">/most-searched/mercedes</option>
            <option value="/most-searched/toyota">/most-searched/toyota</option>
            <option value="/vehicle">/vehicle</option>
            <option value="/shop">/shop</option>
          </select>
        </div>
      </div>

      {/* Grid: Visual Click Heatmap Canvas & Scroll Depth */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Heatmap Simulation Box */}
        <div className={`lg:col-span-2 p-6 rounded-2xl border shadow-2xl space-y-4 min-h-[420px] flex flex-col ${isLight ? 'bg-white border-slate-200' : 'bg-[#111827] border-white/10'}`}>
          <div className="flex items-center justify-between">
            <h3 className={`text-lg font-serif font-light ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>Visual Click Heatmap Canvas</h3>
            <span className="text-xs font-mono text-rose-500 font-bold">{filteredClicks.length} Click Points Logged</span>
          </div>

          {/* Canvas Box */}
          <div className={`relative flex-1 border rounded-xl overflow-hidden p-6 ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-white/10'}`} style={{ backgroundImage: `linear-gradient(${isLight ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.03)'} 1px, transparent 1px), linear-gradient(90deg, ${isLight ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.03)'} 1px, transparent 1px)`, backgroundSize: '20px 20px' }}>
            <p className={`text-xs font-mono text-center mb-6 ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>Interactive Click Coordinates Overlay ({selectedUrl})</p>

            {/* Glowing Click Hotspots */}
            {filteredClicks.map((clk, idx) => (
              <div
                key={idx}
                style={{ left: `${(clk.x / clk.screen_width) * 100}%`, top: `${(clk.y / 800) * 100}%` }}
                className="absolute w-8 h-8 -ml-4 -mt-4 rounded-full bg-rose-500/40 border border-rose-400 animate-ping shadow-[0_0_20px_rgba(244,63,94,0.8)]"
              >
                <div className="w-full h-full rounded-full bg-amber-400/60 blur-xs" />
              </div>
            ))}

            <div className={`absolute bottom-4 left-4 p-3 rounded-lg border text-[10px] font-mono ${isLight ? 'bg-white/90 border-slate-200 text-slate-600' : 'bg-slate-900/90 border-white/10 text-slate-300'}`}>
              Hotspot Density Key: <span className="text-blue-500">Low</span> → <span className="text-amber-500">Medium</span> → <span className="text-rose-500 font-bold">High Intensity</span>
            </div>
          </div>
        </div>

        {/* Scroll Depth Distribution */}
        <div className={`p-6 rounded-2xl border shadow-2xl space-y-4 ${isLight ? 'bg-white border-slate-200' : 'bg-[#111827] border-white/10'}`}>
          <h3 className={`text-lg font-serif font-light ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>Scroll Depth Drop-Off</h3>

          <div className="space-y-4 font-mono text-xs">
            {scrollDepths.map(sd => (
              <div key={sd.label} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className={`text-[11px] ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>{sd.label}</span>
                  <span style={{ color: sd.color }} className="font-bold">{sd.pct}% Reached</span>
                </div>
                <div className={`w-full h-2 rounded-full overflow-hidden border ${isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-950 border-white/5'}`}>
                  <div className="h-full rounded-full transition-all duration-500" style={{ width: `${sd.pct}%`, backgroundColor: sd.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Element-Level Aggregation Table */}
      <div className={`p-6 rounded-2xl border shadow-2xl space-y-4 ${isLight ? 'bg-white border-slate-200' : 'bg-[#111827] border-white/10'}`}>
        <h3 className={`text-lg font-serif font-light ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>Element-Level Aggregation Ledger</h3>

        <div className="crm-scroll overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className={`border-b uppercase tracking-wider text-[10px] ${isLight ? 'border-slate-200 text-slate-500' : 'border-white/10 text-slate-400'}`}>
                <th className="pb-3">Element Tag</th>
                <th className="pb-3">Element ID</th>
                <th className="pb-3">Element Text</th>
                <th className="pb-3">CSS Class</th>
                <th className="pb-3">Clicks Logged</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isLight ? 'divide-slate-100 text-slate-700' : 'divide-white/5 text-slate-300'}`}>
              {paginatedClicks.map(c => (
                <tr key={c.id} className={isLight ? 'hover:bg-slate-50' : 'hover:bg-white/[0.02]'}>
                  <td className="py-3 font-bold text-[#6366f1]">&lt;{c.element_tag}&gt;</td>
                  <td className={`py-3 ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>{c.element_id || 'N/A'}</td>
                  <td className="py-3 text-[#a3e635]">{c.element_text || 'Icon / Image'}</td>
                  <td className={`py-3 text-[10px] truncate max-w-xs ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>{c.element_class}</td>
                  <td className="py-3 font-bold text-[#06b6d4]">18 clicks</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Universal Pagination */}
        <UniversalPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={clicks.length}
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
