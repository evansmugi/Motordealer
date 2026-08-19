import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import { useCRMStore } from '../../context/CRMStore'
import { GitPullRequest, DollarSign, Calendar, AlertTriangle, Trophy, Sparkles, X, Filter } from 'lucide-react'

const STAGES = [
  {
    id: 'new_lead',
    title: 'New Lead',
    titleColor: 'text-sky-400',
    lightTitleColor: 'text-sky-700',
    badgeColor: 'bg-sky-500/25 text-sky-300 border border-sky-500/50',
    lightBadgeColor: 'bg-sky-100 text-sky-800 border border-sky-400/60',
    subtotalColor: 'text-sky-300 font-bold',
    lightSubtotalColor: 'text-sky-900 font-bold',
    cardHeaderBg: 'bg-gradient-to-br from-[#061824] via-[#041018] to-[#020810] border border-sky-500/40 shadow-[0_8px_20px_rgba(14,165,233,0.12)]',
    lightCardHeaderBg: 'bg-gradient-to-br from-sky-50 via-white to-sky-100/40 border-2 border-sky-400/80 shadow-[0_8px_25px_rgba(14,165,233,0.22)]',
    lightContainerBg: 'bg-sky-50/40 border border-sky-200/90 shadow-sm',
    dotColor: 'bg-sky-500 animate-pulse'
  },
  {
    id: 'onboarding',
    title: 'Onboarding',
    titleColor: 'text-indigo-400',
    lightTitleColor: 'text-indigo-700',
    badgeColor: 'bg-indigo-500/25 text-indigo-300 border border-indigo-500/50',
    lightBadgeColor: 'bg-indigo-100 text-indigo-800 border border-indigo-400/60',
    subtotalColor: 'text-indigo-300 font-bold',
    lightSubtotalColor: 'text-indigo-900 font-bold',
    cardHeaderBg: 'bg-gradient-to-br from-[#0d0a2b] via-[#08061e] to-[#04030f] border border-indigo-500/40 shadow-[0_8px_20px_rgba(99,102,241,0.12)]',
    lightCardHeaderBg: 'bg-gradient-to-br from-indigo-50 via-white to-indigo-100/40 border-2 border-indigo-400/80 shadow-[0_8px_25px_rgba(99,102,241,0.22)]',
    lightContainerBg: 'bg-indigo-50/40 border border-indigo-200/90 shadow-sm',
    dotColor: 'bg-indigo-500 animate-pulse'
  },
  {
    id: 'qualified',
    title: 'Qualified',
    titleColor: 'text-blue-400',
    lightTitleColor: 'text-blue-700',
    badgeColor: 'bg-blue-500/25 text-blue-300 border border-blue-500/50',
    lightBadgeColor: 'bg-blue-100 text-blue-800 border border-blue-400/60',
    subtotalColor: 'text-blue-300 font-bold',
    lightSubtotalColor: 'text-blue-900 font-bold',
    cardHeaderBg: 'bg-gradient-to-br from-[#0c1e38] via-[#091526] to-[#040914] border border-blue-500/40 shadow-[0_8px_20px_rgba(59,130,246,0.12)]',
    lightCardHeaderBg: 'bg-gradient-to-br from-blue-50 via-white to-blue-100/40 border-2 border-blue-400/80 shadow-[0_8px_25px_rgba(59,130,246,0.22)]',
    lightContainerBg: 'bg-blue-50/40 border border-blue-200/90 shadow-sm',
    dotColor: 'bg-blue-500 animate-pulse'
  },
  {
    id: 'viewing',
    title: 'Viewing / Test Drive',
    titleColor: 'text-[#e6c76e]',
    lightTitleColor: 'text-amber-800',
    badgeColor: 'bg-[#c9a84c]/25 text-[#c9a84c] border border-[#c9a84c]/50',
    lightBadgeColor: 'bg-amber-100 text-amber-900 border border-amber-400/60',
    subtotalColor: 'text-[#c9a84c] font-bold',
    lightSubtotalColor: 'text-amber-950 font-bold',
    cardHeaderBg: 'bg-gradient-to-br from-[#241d0a] via-[#1a1406] to-[#0a0802] border border-[#c9a84c]/40 shadow-[0_8px_20px_rgba(201,168,76,0.12)]',
    lightCardHeaderBg: 'bg-gradient-to-br from-amber-50 via-white to-amber-100/40 border-2 border-[#c9a84c]/80 shadow-[0_8px_25px_rgba(201,168,76,0.22)]',
    lightContainerBg: 'bg-amber-50/40 border border-amber-200/90 shadow-sm',
    dotColor: 'bg-[#c9a84c] animate-pulse'
  },
  {
    id: 'deposit',
    title: 'Deposit Made',
    titleColor: 'text-purple-400',
    lightTitleColor: 'text-purple-800',
    badgeColor: 'bg-purple-500/25 text-purple-300 border border-purple-500/50',
    lightBadgeColor: 'bg-purple-100 text-purple-800 border border-purple-400/60',
    subtotalColor: 'text-purple-300 font-bold',
    lightSubtotalColor: 'text-purple-950 font-bold',
    cardHeaderBg: 'bg-gradient-to-br from-[#220d33] via-[#180924] to-[#0a0312] border border-purple-500/40 shadow-[0_8px_20px_rgba(168,85,247,0.12)]',
    lightCardHeaderBg: 'bg-gradient-to-br from-purple-50 via-white to-purple-100/40 border-2 border-purple-400/80 shadow-[0_8px_25px_rgba(168,85,247,0.22)]',
    lightContainerBg: 'bg-purple-50/40 border border-purple-200/90 shadow-sm',
    dotColor: 'bg-purple-500 animate-pulse'
  },
  {
    id: 'won',
    title: 'Won Deals',
    titleColor: 'text-emerald-400',
    lightTitleColor: 'text-emerald-800',
    badgeColor: 'bg-emerald-500/25 text-emerald-300 border border-emerald-500/50',
    lightBadgeColor: 'bg-emerald-100 text-emerald-800 border border-emerald-400/60',
    subtotalColor: 'text-emerald-300 font-bold',
    lightSubtotalColor: 'text-emerald-950 font-bold',
    cardHeaderBg: 'bg-gradient-to-br from-[#0a2618] via-[#061c11] to-[#020d07] border border-emerald-500/40 shadow-[0_8px_20px_rgba(16,185,129,0.12)]',
    lightCardHeaderBg: 'bg-gradient-to-br from-emerald-50 via-white to-emerald-100/40 border-2 border-emerald-400/80 shadow-[0_8px_25px_rgba(16,185,129,0.22)]',
    lightContainerBg: 'bg-emerald-50/40 border border-emerald-200/90 shadow-sm',
    dotColor: 'bg-emerald-500 animate-pulse'
  },
  {
    id: 'lost',
    title: 'Lost Deals',
    titleColor: 'text-rose-400',
    lightTitleColor: 'text-rose-800',
    badgeColor: 'bg-rose-500/25 text-rose-300 border border-rose-500/50',
    lightBadgeColor: 'bg-rose-100 text-rose-800 border border-rose-400/60',
    subtotalColor: 'text-rose-300 font-bold',
    lightSubtotalColor: 'text-rose-950 font-bold',
    cardHeaderBg: 'bg-gradient-to-br from-[#2b0e14] via-[#1f090e] to-[#0f0306] border border-rose-500/40 shadow-[0_8px_20px_rgba(244,63,94,0.12)]',
    lightCardHeaderBg: 'bg-gradient-to-br from-rose-50 via-white to-rose-100/40 border-2 border-rose-400/80 shadow-[0_8px_25px_rgba(244,63,94,0.22)]',
    lightContainerBg: 'bg-rose-50/40 border border-rose-200/90 shadow-sm',
    dotColor: 'bg-rose-500'
  },
]

export default function PipelineKanban() {
  const navigate = useNavigate()
  const opportunities = useCRMStore(state => state.opportunities)
  const leads = useCRMStore(state => state.leads)
  const updateOpportunityStage = useCRMStore(state => state.updateOpportunityStage)
  const createOnboardingTasks = useCRMStore(state => state.createOnboardingTasks)
  const promoteLeadToCustomer = useCRMStore(state => state.promoteLeadToCustomer)
  const adminTheme = useCRMStore(state => state.adminTheme)
  const isLight = adminTheme === 'light'

  // Resolve a lead's intent score from the opportunity's lead_id
  const getLeadIntent = (opp) => {
    const lead = leads.find(l => l.id === opp.lead_id)
    if (!lead) return { score: opp.probability || 50, tier: opp.probability >= 75 ? 'HIGH' : opp.probability >= 45 ? 'MEDIUM' : 'LOW' }
    const score = lead.intent_score || lead.conversion_probability || 50
    return { score, tier: lead.intent_tier || (score >= 75 ? 'HIGH' : score >= 45 ? 'MEDIUM' : 'LOW') }
  }
  
  const [filterRetention, setFilterRetention] = useState(false)
  const [victoriousModal, setVictoriousModal] = useState(null)

  // Dynamic unification: Combine explicit opportunities with auto-synthesized cards for unmapped active leads
  const unifiedOpportunities = useMemo(() => {
    const oppMap = new Map()
    const safeOpps = opportunities || []
    const safeLeads = leads || []

    // 1. Existing explicit opportunities
    safeOpps.forEach(o => {
      if (o && o.id) {
        oppMap.set(o.id, o)
      }
    })

    // 2. Add active leads that don't have an opportunity record yet
    safeLeads.forEach(lead => {
      if (lead.status === 'archived') return
      const hasOpp = safeOpps.some(o => o.lead_id === lead.id)
      if (!hasOpp) {
        const stage = lead.status === 'new' ? 'new_lead'
          : lead.status === 'contacted' ? 'onboarding'
          : lead.status === 'qualified' ? 'qualified'
          : lead.status === 'won' || lead.status === 'converted' ? 'won'
          : 'new_lead'

        const synthId = `opp-auto-${lead.id}`
        oppMap.set(synthId, {
          id: synthId,
          lead_id: lead.id,
          name: `${lead.company && lead.company !== '—' ? lead.company : lead.name} Pursuit`,
          expected_value: 15000000,
          probability: lead.intent_score || lead.conversion_probability || 50,
          stage,
          close_date: '2026-09-30',
          created_at: lead.created_at || '2026-08-05',
          updated_at: lead.created_at || '2026-08-05'
        })
      }
    })

    return Array.from(oppMap.values())
  }, [opportunities, leads])

  const onDragEnd = (result) => {
    const { destination, draggableId } = result
    if (!destination) return
    const newStage = destination.droppableId
    updateOpportunityStage(draggableId, newStage)

    if (newStage === 'won') {
      const opp = unifiedOpportunities.find(o => o.id === draggableId)
      setVictoriousModal(opp)
    }
  }

  const STAGE_MAP = {
    proposal: 'viewing',
    qualification: 'qualified',
    negotiation: 'deposit',
    new: 'new_lead',
    contacted: 'onboarding'
  }

  const normalizeStage = (stage) => STAGE_MAP[stage] || stage || 'new_lead'

  // Filter 7-day retention rule if enabled, then sort by intent score descending
  const getFilteredOpps = (stageId) => {
    return unifiedOpportunities
      .map(o => ({ ...o, stage: normalizeStage(o.stage) }))
      .filter(o => {
        if (o.stage !== stageId) return false
        if (filterRetention && (stageId === 'won' || stageId === 'lost')) {
          const diffDays = (new Date() - new Date(o.updated_at)) / (1000 * 60 * 60 * 24)
          return diffDays <= 7
        }
        return true
      })
      .sort((a, b) => getLeadIntent(b).score - getLeadIntent(a).score)
  }

  const formatCurrency = (val) => `KES ${(val / 1000000).toFixed(1)}M`

  // Stagnancy check
  const isStagnant = (updatedAt) => {
    if (!updatedAt) return false
    const diffDays = (new Date() - new Date(updatedAt)) / (1000 * 60 * 60 * 24)
    return diffDays > 7
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] tracking-[4px] uppercase text-[#c9a84c] font-semibold block">Sales Pipeline</span>
          <h1 className={`text-3xl font-serif font-light mt-1 ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
            Visual Sales Deal Board
          </h1>
        </div>

        <div className="flex items-center gap-3 font-mono">
          <button
            onClick={() => setFilterRetention(!filterRetention)}
            className={`px-3.5 py-2 rounded-xl text-xs uppercase font-bold tracking-wider border flex items-center gap-2 transition-all cursor-pointer ${
              filterRetention
                ? 'bg-[#c9a84c]/20 text-[#c9a84c] border-[#c9a84c]'
                : isLight ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100' : 'bg-slate-900 border-white/10 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Filter size={14} />
            <span>{filterRetention ? '7-Day Retention: ON' : '7-Day Retention: OFF'}</span>
          </button>
        </div>
      </div>

      {/* Kanban Board - 1 Single Row */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-3.5 overflow-x-auto crm-scroll pb-4 items-start min-w-full">
          {STAGES.map(stage => {
            const stageOpps = getFilteredOpps(stage.id)
            const subtotal = stageOpps.reduce((sum, o) => sum + (Number(o.expected_value) || 0), 0)

            return (
              <div key={stage.id} className="flex flex-col min-w-[240px] max-w-[300px] flex-1 space-y-3">
                {/* High Contrast Color-Coded Column Header */}
                <div className={`p-4 rounded-2xl border flex flex-col gap-2 transition-all ${
                  isLight
                    ? stage.lightCardHeaderBg
                    : stage.cardHeaderBg
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${stage.dotColor}`} />
                      <h3 className={`text-sm font-serif font-bold tracking-wide uppercase ${isLight ? stage.lightTitleColor : stage.titleColor}`}>
                        {stage.title}
                      </h3>
                    </div>
                    <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold ${
                      isLight ? stage.lightBadgeColor : stage.badgeColor
                    }`}>
                      {stageOpps.length}
                    </span>
                  </div>
                  <div className={`flex items-center justify-between text-xs font-mono pt-1.5 border-t ${
                    isLight ? 'border-slate-300/80' : 'border-white/10'
                  }`}>
                    <span className={`text-[9px] uppercase tracking-widest font-bold ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Subtotal</span>
                    <span className={`font-bold ${isLight ? stage.lightSubtotalColor : stage.subtotalColor}`}>{formatCurrency(subtotal)}</span>
                  </div>
                </div>

                {/* Droppable Area */}
                <Droppable droppableId={stage.id}>
                  {(provided, snapshot) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className={`flex-1 min-h-[500px] p-2 rounded-2xl transition-all space-y-3 border ${
                        snapshot.isDraggingOver
                          ? 'bg-[#c9a84c]/10 border-dashed border-[#c9a84c]'
                          : isLight ? stage.lightContainerBg : 'bg-slate-950/40 border-white/5'
                      }`}
                    >

                      {stageOpps.map((opp, index) => {
                        const stagnant = isStagnant(opp.updated_at)

                        return (
                          <Draggable key={opp.id} draggableId={opp.id} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`p-4 rounded-xl border transition-all ${
                                  isLight
                                    ? 'bg-white border-slate-200 text-slate-900 shadow-md hover:border-slate-300'
                                    : 'bg-[#0f172a]/90 border-white/10 text-slate-100 shadow-2xl hover:border-[#c9a84c]/40'
                                } ${snapshot.isDragging ? 'shadow-2xl border-[#c9a84c] scale-105 z-50' : ''}`}
                              >
                                {stagnant && opp.stage !== 'won' && opp.stage !== 'lost' && (
                                  <div className={`mb-2 flex items-center gap-1 text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-lg border w-fit ${
                                    isLight ? 'bg-rose-100 text-rose-800 border-rose-300' : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                                  }`}>
                                    <AlertTriangle size={11} />
                                    <span>Stagnant Deal (&gt;7d)</span>
                                  </div>
                                )}

                                <h4 className={`text-sm font-serif font-bold ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>{opp.name}</h4>

                                {/* Intent Score Badge */}
                                {(() => {
                                  const { score, tier } = getLeadIntent(opp)
                                  return (
                                    <div className={`mt-1.5 mb-1 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-[9px] font-mono font-bold border ${
                                      score >= 75
                                        ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30 shadow-sm shadow-emerald-500/10'
                                        : score >= 45
                                        ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                                        : 'bg-slate-800/80 text-slate-400 border-slate-700'
                                    }`}>
                                      <Sparkles size={10} className={score >= 75 ? 'animate-pulse' : ''} />
                                      <span>{score}% {tier}</span>
                                    </div>
                                  )
                                })()}

                                <div className="text-xs font-mono font-bold text-[#c9a84c] mt-1">
                                  KES {Number(opp.expected_value).toLocaleString()}
                                </div>

                                <div className={`mt-3 pt-2 border-t flex items-center justify-between text-[10px] ${
                                  isLight ? 'border-slate-200 text-slate-600 font-medium' : 'border-white/5 text-slate-400'
                                }`}>
                                  <span className="flex items-center gap-1">
                                    <Calendar size={11} className={isLight ? 'text-slate-500' : 'text-slate-500'} />
                                    {opp.close_date}
                                  </span>
                                  <span className={`font-mono px-1.5 py-0.5 rounded-lg font-bold border ${
                                    isLight ? 'bg-amber-100 text-amber-900 border-amber-300' : 'bg-slate-800 text-[#c9a84c]'
                                  }`}>
                                    {opp.probability}%
                                  </span>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        )
                      })}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            )
          })}
        </div>
      </DragDropContext>

      {/* Victorious Modal Trigger */}
      {victoriousModal && (
        <div className="fixed inset-0 z-[999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className={`max-w-md w-full p-6 rounded-3xl border border-l-4 border-l-[#c9a84c] shadow-2xl relative text-center space-y-4 font-sans ${
            isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#0f172a] border-white/10 text-slate-100'
          }`}>
            <div className="p-4 rounded-full bg-[#c9a84c]/20 text-[#c9a84c] w-fit mx-auto animate-bounce">
              <Trophy size={36} />
            </div>

            <div>
              <span className="text-[10px] tracking-[3px] uppercase text-[#c9a84c] font-bold block">Victory Alert</span>
              <h3 className={`text-2xl font-serif mt-1 font-bold ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>OPPORTUNITY VICTORIOUS!</h3>
              <p className={`text-xs mt-2 ${isLight ? 'text-slate-700 font-medium' : 'text-slate-300'}`}>
                Deal <strong className="text-[#c9a84c]">{victoriousModal.name}</strong> valued at <strong className="text-emerald-600 dark:text-emerald-400 font-mono font-bold">KES {Number(victoriousModal.expected_value).toLocaleString()}</strong> was successfully closed!
              </p>
            </div>

            <div className="pt-4 flex gap-3 justify-center">
              <button
                onClick={() => setVictoriousModal(null)}
                className={`px-4 py-2.5 rounded-xl border text-xs font-bold uppercase ${
                  isLight ? 'border-slate-300 text-slate-700 hover:bg-slate-100' : 'border-slate-700 text-slate-400 hover:bg-white/5'
                }`}
              >
                Close
              </button>
              <button
                onClick={() => {
                  const opp = victoriousModal
                  const lead = leads.find(l => l.id === opp.lead_id)
                  if (createOnboardingTasks) createOnboardingTasks(opp, lead)
                  if (promoteLeadToCustomer && opp.lead_id) promoteLeadToCustomer(opp.lead_id, opp)
                  setVictoriousModal(null)
                  navigate('/crm/won-deals')
                }}
                className="px-6 py-2.5 bg-[#c9a84c] text-slate-950 font-bold rounded-xl text-xs uppercase tracking-wider hover:bg-[#d9b85c] cursor-pointer shadow-lg flex items-center gap-2"
              >
                <span>Complete Onboarding</span>
                <Trophy size={14} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
