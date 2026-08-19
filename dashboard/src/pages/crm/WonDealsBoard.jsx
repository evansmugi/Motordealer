import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCRMStore } from '../../context/CRMStore'
import ActionTooltip from '../../components/common/ActionTooltip'
import UniversalPagination from '../../components/common/UniversalPagination'
import { Trophy, CheckCircle2, Car, UserCheck, Search, Filter, Calendar, DollarSign, ArrowRight, ShieldCheck, FileText, Sparkles, RefreshCw, X, ChevronRight } from 'lucide-react'

const SUB_STAGES = [
  { id: 'invoiced', label: 'Invoiced', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30', lightColor: 'bg-blue-100 text-blue-800 border-blue-300' },
  { id: 'prep', label: 'Vehicle in Prep', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30', lightColor: 'bg-amber-100 text-amber-800 border-amber-300' },
  { id: 'ready', label: 'Ready for Handover', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30', lightColor: 'bg-purple-100 text-purple-800 border-purple-300' },
  { id: 'delivered', label: 'Delivered', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30', lightColor: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
  { id: 'complete', label: 'Complete', color: 'bg-slate-800 text-slate-300 border-slate-700', lightColor: 'bg-slate-200 text-slate-800 border-slate-300' }
]

export default function WonDealsBoard() {
  const navigate = useNavigate()
  const rawOpps = useCRMStore(state => state.opportunities)
  const opportunities = useMemo(() => rawOpps || [], [rawOpps])
  const leads = useCRMStore(state => state.leads) || []
  const vehicleInventory = useCRMStore(state => state.vehicleInventory) || []
  const updateWonDealSubStage = useCRMStore(state => state.updateWonDealSubStage)
  const adminTheme = useCRMStore(state => state.adminTheme)
  const isLight = adminTheme === 'light'

  const [searchTerm, setSearchTerm] = useState('')
  const [subStageFilter, setSubStageFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  // Filter only won deals
  const wonList = useMemo(() => {
    return opportunities.filter(o => o.stage === 'won')
  }, [opportunities])

  const totalWonRevenue = useMemo(() => {
    return wonList.reduce((sum, o) => sum + (Number(o.expected_value) || 0), 0)
  }, [wonList])

  const filteredWonList = useMemo(() => {
    return wonList.filter(o => {
      const q = searchTerm.toLowerCase().trim()
      const matchesSearch = !q ||
        (o.name && o.name.toLowerCase().includes(q)) ||
        (o.vehicle_name && o.vehicle_name.toLowerCase().includes(q))
      
      const currentSubStage = o.won_substage || 'invoiced'
      const matchesSubStage = subStageFilter === 'all' || currentSubStage === subStageFilter

      return matchesSearch && matchesSubStage
    })
  }, [wonList, searchTerm, subStageFilter])

  const totalPages = Math.ceil(filteredWonList.length / itemsPerPage) || 1
  const paginatedList = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return filteredWonList.slice(start, start + itemsPerPage)
  }, [filteredWonList, currentPage, itemsPerPage])

  const handleAdvanceSubStage = async (opp) => {
    const current = opp.won_substage || 'invoiced'
    const flow = ['invoiced', 'prep', 'ready', 'delivered', 'complete']
    const nextIdx = (flow.indexOf(current) + 1) % flow.length
    const nextSubStage = flow[nextIdx]
    await updateWonDealSubStage(opp.id, nextSubStage)
  }

  const formatCurrency = (val) => `KES ${Number(val).toLocaleString()}`

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] tracking-[4px] uppercase text-emerald-400 font-semibold block">Post-Win Handover Command Center</span>
          <h1 className={`text-3xl font-serif font-light mt-1 flex items-center gap-2.5 ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
            <Trophy className="text-[#c9a84c]" size={28} />
            <span>Won Deals &amp; Fulfillment</span>
          </h1>
        </div>

        <button
          onClick={() => navigate('/crm/pipeline')}
          className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-xs tracking-wider uppercase border border-white/10 transition-all flex items-center gap-2 shadow-lg cursor-pointer"
        >
          <span>Back to Deal Board</span>
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
        <div className={`p-5 rounded-2xl border transition-all ${
          isLight ? 'bg-white border-emerald-200 shadow-lg' : 'bg-gradient-to-br from-[#0c2e1d] to-[#06190f] border-emerald-500/30 shadow-xl'
        }`}>
          <div className="flex justify-between items-center text-slate-400 text-xs uppercase tracking-wider">
            <span>Total Revenue</span>
            <DollarSign size={16} className="text-emerald-400" />
          </div>
          <div className="text-2xl font-serif font-bold text-emerald-400 mt-2">
            {formatCurrency(totalWonRevenue)}
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Closed deals value</p>
        </div>

        <div className={`p-5 rounded-2xl border transition-all ${
          isLight ? 'bg-white border-slate-200 shadow-lg' : 'bg-[#0f172a] border-white/10 shadow-xl'
        }`}>
          <div className="flex justify-between items-center text-slate-400 text-xs uppercase tracking-wider">
            <span>Total Won Deals</span>
            <Trophy size={16} className="text-[#c9a84c]" />
          </div>
          <div className="text-2xl font-serif font-bold text-[#c9a84c] mt-2">
            {wonList.length} Deals
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Converted from pipeline</p>
        </div>

        <div className={`p-5 rounded-2xl border transition-all ${
          isLight ? 'bg-white border-amber-200 shadow-lg' : 'bg-gradient-to-br from-[#291e0a] to-[#140e04] border-amber-500/30 shadow-xl'
        }`}>
          <div className="flex justify-between items-center text-slate-400 text-xs uppercase tracking-wider">
            <span>In Handover Prep</span>
            <Car size={16} className="text-amber-400" />
          </div>
          <div className="text-2xl font-serif font-bold text-amber-400 mt-2">
            {wonList.filter(o => (o.won_substage || 'invoiced') !== 'complete').length} Deals
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Active delivery process</p>
        </div>

        <div className={`p-5 rounded-2xl border transition-all ${
          isLight ? 'bg-white border-blue-200 shadow-lg' : 'bg-gradient-to-br from-[#0a1e36] to-[#040e1c] border-blue-500/30 shadow-xl'
        }`}>
          <div className="flex justify-between items-center text-slate-400 text-xs uppercase tracking-wider">
            <span>Avg Handover Time</span>
            <Calendar size={16} className="text-blue-400" />
          </div>
          <div className="text-2xl font-serif font-bold text-blue-400 mt-2">
            4.2 Days
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Invoice to key handover</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className={`p-4 rounded-2xl border transition-all duration-300 space-y-3 ${
        isLight ? 'bg-white border-slate-200 shadow-xl' : 'bg-[#0f172a]/80 border-white/10 shadow-2xl'
      }`}>
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="relative w-full lg:w-80">
            <Search size={16} className={`absolute left-3.5 top-3 ${isLight ? 'text-slate-400' : 'text-slate-500'}`} />
            <input
              type="text"
              placeholder="Search won deals..."
              value={searchTerm}
              onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className={`w-full pl-10 pr-8 py-2 border rounded-xl text-xs outline-none font-mono transition-all ${
                isLight
                  ? 'bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-[#c9a84c]'
                  : 'bg-slate-950/60 border-white/10 text-slate-200 placeholder:text-slate-500 focus:border-[#c9a84c]'
              }`}
            />
            {searchTerm && (
              <button onClick={() => { setSearchTerm(''); setCurrentPage(1); }} className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-200">
                <X size={14} />
              </button>
            )}
          </div>

          {/* Sub-stage filter tabs */}
          <div className="flex flex-wrap items-center gap-1.5 font-mono text-xs">
            <button
              onClick={() => { setSubStageFilter('all'); setCurrentPage(1); }}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                subStageFilter === 'all'
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : isLight ? 'bg-slate-100 text-slate-700' : 'bg-slate-900 text-slate-300'
              }`}
            >
              All Won ({wonList.length})
            </button>
            {SUB_STAGES.map(stg => {
              const cnt = wonList.filter(o => (o.won_substage || 'invoiced') === stg.id).length
              return (
                <button
                  key={stg.id}
                  onClick={() => { setSubStageFilter(stg.id); setCurrentPage(1); }}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
                    subStageFilter === stg.id
                      ? 'bg-[#c9a84c] text-slate-950 shadow-md'
                      : isLight ? 'bg-slate-100 text-slate-700' : 'bg-slate-900 text-slate-300'
                  }`}
                >
                  <span>{stg.label}</span>
                  <span className="px-1.5 py-0.2 rounded-md bg-black/20 text-[10px]">{cnt}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Won Deals Table */}
      <div className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
        isLight ? 'bg-white border-slate-200 shadow-xl' : 'bg-[#0f172a]/80 border-white/10 shadow-2xl'
      }`}>
        <div className="overflow-x-auto crm-scroll">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className={`border-b text-[10px] uppercase tracking-widest font-bold ${
                isLight ? 'bg-slate-100/90 border-slate-200 text-slate-800' : 'bg-slate-950/50 border-white/10 text-slate-400'
              }`}>
                <th className="p-4">Opportunity Title</th>
                <th className="p-4">Customer Lead</th>
                <th className="p-4">Vehicle Inventory</th>
                <th className="p-4">Deal Revenue</th>
                <th className="p-4">Handover Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className={`divide-y text-xs ${isLight ? 'divide-slate-200' : 'divide-white/5'}`}>
              {paginatedList.map(opp => {
                const lead = leads.find(l => l.id === opp.lead_id)
                const veh = vehicleInventory.find(v => v.id === opp.vehicle_id) || { name: opp.vehicle_name || 'Vehicle' }
                const currentSubStageId = opp.won_substage || 'invoiced'
                const currentSubStageObj = SUB_STAGES.find(s => s.id === currentSubStageId) || SUB_STAGES[0]

                return (
                  <tr key={opp.id} className={`transition-colors ${isLight ? 'hover:bg-slate-50/80' : 'hover:bg-white/[0.02]'}`}>
                    <td className="p-4">
                      <div className={`font-serif font-bold text-sm flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-slate-200'}`}>
                        <Trophy size={14} className="text-[#c9a84c]" />
                        <span>{opp.name}</span>
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono mt-0.5">{opp.notes || 'Won deal record'}</div>
                    </td>

                    <td className="p-4 font-sans">
                      {lead ? (
                        <div>
                          <div className={`font-bold flex items-center gap-1.5 ${isLight ? 'text-slate-900' : 'text-slate-200'}`}>
                            <UserCheck size={13} className="text-emerald-500" />
                            <span>{lead.name}</span>
                          </div>
                          <div className="text-[10px] font-mono text-slate-400">{lead.company || 'Customer'}</div>
                        </div>
                      ) : (
                        <span className="text-[10px] text-slate-500 italic">Unassigned Customer</span>
                      )}
                    </td>

                    <td className="p-4 font-sans">
                      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl border text-[11px] font-medium ${
                        isLight ? 'bg-purple-50 text-purple-900 border-purple-200' : 'bg-purple-500/10 text-purple-300 border-purple-500/30'
                      }`}>
                        <Car size={13} className="text-purple-500" />
                        <span className="truncate max-w-[180px]">{veh.name}</span>
                      </div>
                    </td>

                    <td className="p-4 font-mono font-bold text-emerald-400">
                      {formatCurrency(opp.expected_value)}
                    </td>

                    <td className="p-4 font-mono">
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] uppercase font-bold border ${
                        isLight ? currentSubStageObj.lightColor : currentSubStageObj.color
                      }`}>
                        {currentSubStageObj.label}
                      </span>
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <ActionTooltip text="Advance Handover Sub-Stage" isLight={isLight}>
                          <button
                            onClick={() => handleAdvanceSubStage(opp)}
                            className="px-2.5 py-1 bg-[#c9a84c] hover:bg-[#d9b85c] text-slate-950 font-bold rounded-lg text-[10px] uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-all shadow"
                          >
                            <span>Advance</span>
                            <ArrowRight size={12} />
                          </button>
                        </ActionTooltip>

                        <ActionTooltip text="View Onboarding Tasks" isLight={isLight}>
                          <button
                            onClick={() => navigate('/crm/tasks')}
                            className={`p-1.5 rounded-lg border text-xs transition-all cursor-pointer ${
                              isLight ? 'border-slate-300 text-slate-700 hover:bg-slate-100' : 'border-white/10 text-slate-300 hover:bg-white/5'
                            }`}
                          >
                            <FileText size={14} />
                          </button>
                        </ActionTooltip>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Universal Pagination */}
        <div className="p-3 border-t border-white/5">
          <UniversalPagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredWonList.length}
            itemsPerPage={itemsPerPage}
            onPageChange={page => setCurrentPage(page)}
            onItemsPerPageChange={size => {
              setItemsPerPage(size)
              setCurrentPage(1)
            }}
          />
        </div>
      </div>
    </div>
  )
}
