import React, { useState, useMemo } from 'react'
import { useAnalyticsStore } from '../../context/AnalyticsStore'
import { useCRMStore } from '../../context/CRMStore'
import UniversalPagination from '../../components/common/UniversalPagination'
import { Compass, Target, DoorOpen, MousePointer, Repeat, UserCheck, Eye, X } from 'lucide-react'

export default function VisitorProfiles() {
  const adminTheme = useCRMStore(state => state.adminTheme)
  const isLight = adminTheme === 'light'
  const sessions = useAnalyticsStore(state => state.sessions)
  const [selectedVisitor, setSelectedVisitor] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  const total = sessions.length || 1
  const totalPages = Math.ceil(sessions.length / itemsPerPage) || 1

  const paginatedSessions = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return sessions.slice(start, start + itemsPerPage)
  }, [sessions, currentPage, itemsPerPage])

  const decisionMakers = sessions.filter(s => s.conversion_score >= 70).length
  const explorers = sessions.filter(s => s.total_events >= 10 && s.conversion_score < 70).length
  const engagers = sessions.filter(s => s.engagement_points >= 80).length
  const returners = sessions.filter(s => s.is_whitelisted || s.acquisition_source === 'Direct').length
  const bouncers = sessions.filter(s => s.total_events <= 1).length

  const archetypes = [
    { title: 'The Decision Maker', icon: Target, count: decisionMakers, pct: Math.round((decisionMakers / total) * 100), color: '#a3e635', desc: 'High intent inquiries & vehicle specs' },
    { title: 'The Explorer', icon: Compass, count: explorers, pct: Math.round((explorers / total) * 100), color: '#06b6d4', desc: 'Broad catalog & multi-brand browsing' },
    { title: 'The Engager', icon: MousePointer, count: engagers, pct: Math.round((engagers / total) * 100), color: '#6366f1', desc: 'Deep scroll depth & click activity' },
    { title: 'The Returner', icon: Repeat, count: returners, pct: Math.round((returners / total) * 100), color: '#f59e0b', desc: 'Multiple returning sessions' },
    { title: 'The Bouncer', icon: DoorOpen, count: bouncers, pct: Math.round((bouncers / total) * 100), color: '#ef4444', desc: 'Single view fast exit' }
  ]

  return (
    <div className="space-y-6 font-sans pb-12">
      {/* Header */}
      <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl border shadow-2xl backdrop-blur-xl ${isLight ? 'bg-white/90 border-slate-200' : 'bg-[#070b14]/90 border-white/10'}`}>
        <div>
          <span className="text-[10px] tracking-[4px] uppercase font-bold text-[#06b6d4]">AI Classification</span>
          <h1 className={`text-2xl font-serif font-light mt-1 ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>Visitor Behavioral Archetypes</h1>
        </div>
      </div>

      {/* Archetype Persona Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {archetypes.map(a => {
          const Icon = a.icon
          return (
            <div key={a.title} className={`p-5 rounded-2xl border shadow-xl space-y-3 transition-all ${isLight ? 'bg-white border-slate-200 hover:border-slate-300' : 'bg-[#111827] border-white/10 hover:border-white/20'}`}>
              <div className="flex items-center justify-between">
                <Icon size={20} style={{ color: a.color }} />
                <span style={{ color: a.color }} className="text-xs font-mono font-bold">{a.pct}%</span>
              </div>
              <h4 className={`text-sm font-serif font-semibold ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>{a.title}</h4>
              <div className={`text-2xl font-mono font-bold ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>{a.count}</div>
              <p className={`text-[10px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>{a.desc}</p>
            </div>
          )
        })}
      </div>

      {/* Visitor Session Drill-down Table */}
      <div className={`p-6 rounded-2xl border shadow-2xl space-y-4 ${isLight ? 'bg-white border-slate-200' : 'bg-[#111827] border-white/10'}`}>
        <h3 className={`text-lg font-serif font-light ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>Individual Visitor Profiles Ledger</h3>

        <div className="crm-scroll overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className={`border-b uppercase tracking-wider text-[10px] ${isLight ? 'border-slate-200 text-slate-500' : 'border-white/10 text-slate-400'}`}>
                <th className="pb-3">IP Address</th>
                <th className="pb-3">Location</th>
                <th className="pb-3">Browser / Device</th>
                <th className="pb-3">Conversion Score</th>
                <th className="pb-3">Action</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isLight ? 'divide-slate-100 text-slate-700' : 'divide-white/5 text-slate-300'}`}>
              {paginatedSessions.map(s => (
                <tr key={s.id} className={isLight ? 'hover:bg-slate-50' : 'hover:bg-white/[0.02]'}>
                  <td className={`py-3 font-bold ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>{s.ip_address}</td>
                  <td className="py-3">{s.city}, {s.geo_country}</td>
                  <td className={`py-3 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>{s.browser} ({s.device})</td>
                  <td className="py-3 font-bold text-[#a3e635]">{s.conversion_score} pts</td>
                  <td className="py-3">
                    <button
                      onClick={() => setSelectedVisitor(s)}
                      className="px-3 py-1 bg-[#6366f1]/20 border border-[#6366f1]/40 text-[#6366f1] rounded font-bold hover:bg-[#6366f1]/30 transition-all flex items-center gap-1 text-[10px]"
                    >
                      <Eye size={12} /> Inspect Drill-down
                    </button>
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
          totalItems={sessions.length}
          itemsPerPage={itemsPerPage}
          onPageChange={page => setCurrentPage(page)}
          onItemsPerPageChange={size => {
            setItemsPerPage(size)
            setCurrentPage(1)
          }}
          pageSizeOptions={[5, 10, 25, 50]}
        />
      </div>

      {/* Drill-down Modal */}
      {selectedVisitor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedVisitor(null)}>
          <div className={`max-w-lg w-full p-6 rounded-2xl border shadow-2xl space-y-4 ${isLight ? 'bg-white border-[#06b6d4]/30' : 'bg-[#070b14] border-[#06b6d4]/50'}`} onClick={e => e.stopPropagation()}>
            <div className={`flex items-center justify-between border-b pb-3 ${isLight ? 'border-slate-200' : 'border-white/10'}`}>
              <h4 className={`text-lg font-serif ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>Visitor Drill-down: {selectedVisitor.ip_address}</h4>
              <button onClick={() => setSelectedVisitor(null)} className={isLight ? 'text-slate-400 hover:text-slate-700' : 'text-slate-400 hover:text-white'}>
                <X size={18} />
              </button>
            </div>
            <div className={`space-y-2 text-xs font-mono ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
              <div><strong className={isLight ? 'text-slate-500' : 'text-slate-400'}>Location:</strong> {selectedVisitor.city}, {selectedVisitor.geo_country}</div>
              <div><strong className={isLight ? 'text-slate-500' : 'text-slate-400'}>Browser / OS:</strong> {selectedVisitor.browser} ({selectedVisitor.os})</div>
              <div><strong className={isLight ? 'text-slate-500' : 'text-slate-400'}>Landing Page:</strong> {selectedVisitor.landing_page}</div>
              <div><strong className={isLight ? 'text-slate-500' : 'text-slate-400'}>Acquisition Source:</strong> {selectedVisitor.acquisition_source}</div>
              <div><strong className={isLight ? 'text-slate-500' : 'text-slate-400'}>Conversion Score:</strong> <span className="text-[#a3e635] font-bold">{selectedVisitor.conversion_score} pts</span></div>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
