import React, { useState, useMemo } from 'react'
import { useAnalyticsStore } from '../../context/AnalyticsStore'
import { useCRMStore } from '../../context/CRMStore'
import UniversalPagination from '../../components/common/UniversalPagination'
import { Shield, ShieldAlert, ShieldCheck, Lock, Unlock, AlertOctagon, Plus, Trash2, CheckCircle2 } from 'lucide-react'

export default function SecurityCenter() {
  const adminTheme = useCRMStore(state => state.adminTheme)
  const isLight = adminTheme === 'light'
  const blacklistedIPs = useAnalyticsStore(state => state.blacklistedIPs)
  const autoShield = useAnalyticsStore(state => state.autoShield)
  const toggleAutoShield = useAnalyticsStore(state => state.toggleAutoShield)
  const blacklistIP = useAnalyticsStore(state => state.blacklistIP)
  const unblockIP = useAnalyticsStore(state => state.unblockIP)

  const [newIP, setNewIP] = useState('')
  const [newReason, setNewReason] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  const totalPages = Math.ceil(blacklistedIPs.length / itemsPerPage) || 1
  const paginatedIPs = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return blacklistedIPs.slice(start, start + itemsPerPage)
  }, [blacklistedIPs, currentPage, itemsPerPage])

  const handleManualBlock = (e) => {
    e.preventDefault()
    if (!newIP.trim()) return
    blacklistIP(newIP, newReason || 'Manual Security Block')
    setNewIP('')
    setNewReason('')
  }

  return (
    <div className="space-y-6 font-sans pb-12">
      {/* Header & Guardian Toggle */}
      <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl border shadow-2xl backdrop-blur-xl ${isLight ? 'bg-white/90 border-rose-200' : 'bg-[#070b14]/90 border-rose-500/30'}`}>
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert size={18} className="text-rose-500" />
            <span className="text-[10px] tracking-[4px] uppercase font-bold text-rose-500">Cyber Telemetry Defense</span>
          </div>
          <h1 className={`text-2xl font-serif font-light mt-1 ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>Security Center & Auto-Shield</h1>
        </div>

        {/* Guardian Switch */}
        <div className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border ${isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-950 border-white/10'}`}>
          <span className={`text-xs font-mono ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>Auto-Shield Guardian:</span>
          <button
            onClick={toggleAutoShield}
            className={`px-3 py-1 rounded-lg text-xs font-bold font-mono transition-all flex items-center gap-1.5 ${
              autoShield ? 'bg-emerald-500/20 text-emerald-600 border border-emerald-500/40' : 'bg-rose-500/20 text-rose-500 border border-rose-500/40'
            }`}
          >
            {autoShield ? <ShieldCheck size={14} /> : <ShieldAlert size={14} />}
            <span>{autoShield ? 'ACTIVE' : 'DISABLED'}</span>
          </button>
        </div>
      </div>

      {/* Threat Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className={`p-5 rounded-2xl border shadow-xl ${isLight ? 'bg-white border-rose-200' : 'bg-[#111827] border-rose-500/30'}`}>
          <div className={`text-xs uppercase tracking-wider ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Blacklisted IP Nodes</div>
          <div className="text-3xl font-mono font-bold text-rose-500 mt-2">{blacklistedIPs.length}</div>
          <p className={`text-[10px] mt-1 ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>Actively blocked vectors</p>
        </div>

        <div className={`p-5 rounded-2xl border shadow-xl ${isLight ? 'bg-white border-amber-200' : 'bg-[#111827] border-amber-500/30'}`}>
          <div className={`text-xs uppercase tracking-wider ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>SQLi / XSS Blocks</div>
          <div className="text-3xl font-mono font-bold text-amber-500 mt-2">14</div>
          <p className={`text-[10px] mt-1 ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>Sanitized malicious queries</p>
        </div>

        <div className={`p-5 rounded-2xl border shadow-xl ${isLight ? 'bg-white border-purple-200' : 'bg-[#111827] border-purple-500/30'}`}>
          <div className={`text-xs uppercase tracking-wider ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Brute Force Defeated</div>
          <div className="text-3xl font-mono font-bold text-purple-500 mt-2">128</div>
          <p className={`text-[10px] mt-1 ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>Rate limited login attempts</p>
        </div>

        <div className={`p-5 rounded-2xl border shadow-xl ${isLight ? 'bg-white border-emerald-200' : 'bg-[#111827] border-emerald-500/30'}`}>
          <div className={`text-xs uppercase tracking-wider ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Shield Status</div>
          <div className="text-3xl font-mono font-bold text-emerald-500 mt-2">100%</div>
          <p className={`text-[10px] mt-1 ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>All ports sanitized</p>
        </div>
      </div>

      {/* Manual IP Blacklist Form */}
      <div className={`p-6 rounded-2xl border shadow-2xl space-y-4 ${isLight ? 'bg-white border-slate-200' : 'bg-[#111827] border-white/10'}`}>
        <h3 className={`text-lg font-serif font-light ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>Manual IP Blacklist Rule</h3>
        <form onSubmit={handleManualBlock} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            required
            placeholder="IP Address (e.g. 185.220.101.5)"
            value={newIP}
            onChange={e => setNewIP(e.target.value)}
            className={`flex-1 border rounded-xl px-4 py-2 text-xs font-mono outline-none focus:border-rose-500 ${isLight ? 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400' : 'bg-slate-950 border-white/10 text-slate-200 placeholder-slate-500'}`}
          />
          <input
            type="text"
            placeholder="Reason (e.g. Suspicious scraping)"
            value={newReason}
            onChange={e => setNewReason(e.target.value)}
            className={`flex-1 border rounded-xl px-4 py-2 text-xs font-mono outline-none focus:border-rose-500 ${isLight ? 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400' : 'bg-slate-950 border-white/10 text-slate-200 placeholder-slate-500'}`}
          />
          <button
            type="submit"
            className="px-6 py-2 bg-rose-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-rose-500 transition-all flex items-center justify-center gap-2 shadow-lg"
          >
            <Plus size={14} />
            <span>Blacklist IP</span>
          </button>
        </form>
      </div>

      {/* Forensic Threat Log Table */}
      <div className={`p-6 rounded-2xl border shadow-2xl space-y-4 ${isLight ? 'bg-white border-slate-200' : 'bg-[#111827] border-white/10'}`}>
        <h3 className={`text-lg font-serif font-light ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>Forensic Threat Blacklist Ledger</h3>

        <div className="crm-scroll overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className={`border-b uppercase tracking-wider text-[10px] ${isLight ? 'border-slate-200 text-slate-500' : 'border-white/10 text-slate-400'}`}>
                <th className="pb-3">Blocked IP</th>
                <th className="pb-3">Reason</th>
                <th className="pb-3">Location</th>
                <th className="pb-3">Blocked Hits</th>
                <th className="pb-3">Date</th>
                <th className="pb-3">Action</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isLight ? 'divide-slate-100 text-slate-700' : 'divide-white/5 text-slate-300'}`}>
              {paginatedIPs.map(b => (
                <tr key={b.id} className={isLight ? 'hover:bg-slate-50' : 'hover:bg-white/[0.02]'}>
                  <td className="py-3 font-bold text-rose-500">{b.ip_address}</td>
                  <td className={`py-3 ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>{b.reason}</td>
                  <td className={`py-3 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>{b.city}, {b.country}</td>
                  <td className="py-3 text-amber-500">{b.hits} hits</td>
                  <td className={`py-3 ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>{new Date(b.created_at).toLocaleDateString()}</td>
                  <td className="py-3">
                    <button
                      onClick={() => unblockIP(b.ip_address)}
                      className="px-3 py-1 rounded bg-emerald-500/20 text-emerald-600 border border-emerald-500/40 hover:bg-emerald-500/30 text-[10px] font-bold transition-all flex items-center gap-1"
                    >
                      <Unlock size={12} /> Unblock
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
          totalItems={blacklistedIPs.length}
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
