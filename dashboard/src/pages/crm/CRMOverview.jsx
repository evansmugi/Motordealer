import React from 'react'
import { Link } from 'react-router-dom'
import { useCRMStore } from '../../context/CRMStore'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'
import {
  TrendingUp, Users, Zap, AlertCircle, ArrowUpRight, GitPullRequest,
  Megaphone, MessageSquare, CheckSquare, LifeBuoy, ArrowRight, Shield
} from 'lucide-react'

const dummyVelocityData = [
  { day: 'Jul 22', logs: 3 },
  { day: 'Jul 24', logs: 5 },
  { day: 'Jul 26', logs: 8 },
  { day: 'Jul 28', logs: 12 },
  { day: 'Jul 30', logs: 7 },
  { day: 'Aug 01', logs: 14 },
  { day: 'Aug 03', logs: 19 },
  { day: 'Aug 04', logs: 15 },
]

export default function CRMOverview() {
  const leads = useCRMStore(state => state.leads)
  const opportunities = useCRMStore(state => state.opportunities)
  const tasks = useCRMStore(state => state.tasks)
  const logs = useCRMStore(state => state.communicationLogs)
  const adminTheme = useCRMStore(state => state.adminTheme)
  const isLight = adminTheme === 'light'

  // KPI Calculations
  const totalPipelineValue = opportunities
    .filter(o => o.stage !== 'lost')
    .reduce((sum, o) => sum + (Number(o.expected_value) || 0), 0)

  const activeLeadsCount = leads.filter(l => ['new', 'contacted', 'qualified'].includes(l.status)).length
  const urgentTasksCount = tasks.filter(t => t.priority === 'urgent' && t.status !== 'completed').length
  const recentLogsCount = logs.length

  const formatCurrency = (amount) => {
    return `KES ${(amount / 1000000).toFixed(1)}M`
  }

  // Topology calculations
  const totalOpps = opportunities.length || 1
  const stageCounts = {
    qualification: opportunities.filter(o => o.stage === 'qualification').length,
    proposal: opportunities.filter(o => o.stage === 'proposal').length,
    negotiation: opportunities.filter(o => o.stage === 'negotiation').length,
    won: opportunities.filter(o => o.stage === 'won').length,
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Executive Welcome & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] tracking-[4px] uppercase text-[#c9a84c] font-semibold block">Dashboard</span>
          <h1 className={`text-3xl font-serif font-light mt-1 ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
            CRM Business Overview
          </h1>
          <p className={`text-xs mt-1 ${isLight ? 'text-slate-600 font-medium' : 'text-slate-400'}`}>
            Real-time sales summary, lead activity, and task status.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/crm/pipeline"
            className="px-4 py-2.5 bg-[#c9a84c] text-slate-950 font-bold rounded-xl text-xs tracking-wider uppercase hover:bg-[#d9b85c] transition-all flex items-center gap-2 shadow-lg cursor-pointer"
          >
            <span>View Sales Pipeline</span>
            <ArrowUpRight size={16} />
          </Link>
        </div>
      </div>

      {/* KPI Ribbon Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Urgent Tasks Pending */}
        <div
          className={`relative overflow-hidden p-6 rounded-2xl border transition-all duration-300 group hover:-translate-y-1 ${
            isLight
              ? 'bg-gradient-to-br from-rose-50/50 via-white to-white border-slate-200 shadow-md hover:shadow-xl hover:border-rose-300'
              : 'bg-gradient-to-br from-rose-950/30 via-[#0f172a] to-[#0f172a] border-white/10 shadow-2xl hover:border-rose-500/40'
          }`}
        >
          <div className="flex items-start justify-between">
            <div>
              <span className={`text-[10px] tracking-[2px] uppercase font-bold block ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                Urgent Tasks Pending
              </span>
              <h2 className={`text-3xl font-serif font-light mt-2 font-mono font-bold ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                {urgentTasksCount}
              </h2>
            </div>
            <div className={`p-3 rounded-xl border transition-transform group-hover:scale-110 ${
              isLight ? 'bg-rose-50 text-rose-600 border-rose-200' : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
            }`}>
              <AlertCircle size={20} />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-xs font-mono">
            <span className={`px-2 py-0.5 rounded-md font-bold ${isLight ? 'bg-rose-100 text-rose-800' : 'bg-rose-500/20 text-rose-300'}`}>
              Action Due
            </span>
            <span className={isLight ? 'text-slate-500 font-medium' : 'text-slate-400'}>requires immediate attention</span>
          </div>
        </div>

        {/* Card 2: Active Leads */}
        <div
          className={`relative overflow-hidden p-6 rounded-2xl border transition-all duration-300 group hover:-translate-y-1 ${
            isLight
              ? 'bg-gradient-to-br from-blue-50/50 via-white to-white border-slate-200 shadow-md hover:shadow-xl hover:border-blue-300'
              : 'bg-gradient-to-br from-blue-950/30 via-[#0f172a] to-[#0f172a] border-white/10 shadow-2xl hover:border-blue-500/40'
          }`}
        >
          <div className="flex items-start justify-between">
            <div>
              <span className={`text-[10px] tracking-[2px] uppercase font-bold block ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                Active Leads
              </span>
              <h2 className={`text-3xl font-serif font-light mt-2 font-mono font-bold ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                {activeLeadsCount}
              </h2>
            </div>
            <div className={`p-3 rounded-xl border transition-transform group-hover:scale-110 ${
              isLight ? 'bg-blue-50 text-blue-600 border-blue-200' : 'bg-blue-500/10 text-blue-400 border-blue-500/30'
            }`}>
              <Users size={20} />
            </div>
          </div>
          <div className={`mt-4 w-full rounded-full h-1.5 overflow-hidden ${isLight ? 'bg-slate-200' : 'bg-slate-800'}`}>
            <div className="bg-blue-500 h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(100, activeLeadsCount * 10)}%` }} />
          </div>
        </div>

        {/* Card 3: Recent Communications */}
        <div
          className={`relative overflow-hidden p-6 rounded-2xl border transition-all duration-300 group hover:-translate-y-1 ${
            isLight
              ? 'bg-gradient-to-br from-purple-50/50 via-white to-white border-slate-200 shadow-md hover:shadow-xl hover:border-purple-300'
              : 'bg-gradient-to-br from-purple-950/30 via-[#0f172a] to-[#0f172a] border-white/10 shadow-2xl hover:border-purple-500/40'
          }`}
        >
          <div className="flex items-start justify-between">
            <div>
              <span className={`text-[10px] tracking-[2px] uppercase font-bold block ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                Recent Communications
              </span>
              <h2 className={`text-3xl font-serif font-light mt-2 font-mono font-bold ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                {recentLogsCount} <span className={`text-xs font-sans font-normal ${isLight ? 'text-slate-500 font-semibold' : 'text-slate-400'}`}>notes</span>
              </h2>
            </div>
            <div className={`p-3 rounded-xl border transition-transform group-hover:scale-110 ${
              isLight ? 'bg-purple-50 text-purple-600 border-purple-200' : 'bg-purple-500/10 text-purple-400 border-purple-500/30'
            }`}>
              <Zap size={20} />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-xs font-mono">
            <span className={`px-2 py-0.5 rounded-md font-bold ${isLight ? 'bg-purple-100 text-purple-800' : 'bg-purple-500/20 text-purple-300'}`}>
              High Activity
            </span>
            <span className={isLight ? 'text-slate-500 font-medium' : 'text-slate-400'}>client touchpoints</span>
          </div>
        </div>

        {/* Card 4: Total Open Deals Value */}
        <div
          className={`relative overflow-hidden p-6 rounded-2xl border transition-all duration-300 group hover:-translate-y-1 ${
            isLight
              ? 'bg-gradient-to-br from-amber-50/50 via-white to-white border-slate-200 shadow-md hover:shadow-xl hover:border-amber-300'
              : 'bg-gradient-to-br from-amber-950/30 via-[#0f172a] to-[#0f172a] border-white/10 shadow-2xl hover:border-[#c9a84c]/40'
          }`}
        >
          <div className="flex items-start justify-between">
            <div>
              <span className={`text-[10px] tracking-[2px] uppercase font-bold block ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                Total Open Deals Value
              </span>
              <h2 className={`text-3xl font-serif font-light mt-2 font-mono font-bold ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                {formatCurrency(totalPipelineValue)}
              </h2>
            </div>
            <div className={`p-3 rounded-xl border transition-transform group-hover:scale-110 ${
              isLight ? 'bg-amber-50 text-[#c9a84c] border-amber-200' : 'bg-[#c9a84c]/10 text-[#c9a84c] border-[#c9a84c]/30'
            }`}>
              <TrendingUp size={20} />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs font-mono">
            <span className={`px-2 py-0.5 rounded-md font-bold ${isLight ? 'bg-emerald-100 text-emerald-800' : 'bg-emerald-500/20 text-emerald-300'}`}>
              +14.2%
            </span>
            <span className={isLight ? 'text-slate-500 font-medium' : 'text-slate-400'}>vs last month</span>
          </div>
        </div>
      </div>

      {/* Analytics Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interaction Momentum Chart */}
        <div className={`p-6 rounded-2xl border transition-all duration-300 lg:col-span-2 flex flex-col justify-between ${
          isLight ? 'bg-white border-slate-200 shadow-xl text-slate-900' : 'bg-[#0f172a]/80 border-white/10 shadow-2xl text-slate-100'
        }`}>
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className={`text-lg font-serif font-bold ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>14-Day Client Interaction Activity</h3>
                <p className={`text-xs ${isLight ? 'text-slate-600 font-medium' : 'text-slate-400'}`}>Daily calls, emails, meetings, and test drives logged</p>
              </div>
              <span className={`text-xs px-2.5 py-1 rounded-lg font-mono font-bold border ${
                isLight ? 'bg-amber-50 text-amber-900 border-amber-300' : 'bg-[#c9a84c]/10 text-[#c9a84c] border-[#c9a84c]/30'
              }`}>
                ACTIVITY: HIGH
              </span>
            </div>
            
            <div className="h-64 w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dummyVelocityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.05)'} />
                  <XAxis dataKey="day" stroke={isLight ? '#475569' : '#64748b'} fontSize={11} />
                  <YAxis stroke={isLight ? '#475569' : '#64748b'} fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isLight ? '#ffffff' : '#0f172a',
                      borderColor: '#c9a84c',
                      borderRadius: '12px',
                      color: isLight ? '#0f172a' : '#f8fafc',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.15)'
                    }}
                  />
                  <Line type="monotone" dataKey="logs" stroke="#c9a84c" strokeWidth={3} dot={{ fill: '#c9a84c', r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Pipeline Stage Breakdown */}
        <div className={`p-6 rounded-2xl border transition-all duration-300 flex flex-col justify-between ${
          isLight ? 'bg-white border-slate-200 shadow-xl text-slate-900' : 'bg-[#0f172a]/80 border-white/10 shadow-2xl text-slate-100'
        }`}>
          <div>
            <h3 className={`text-lg font-serif font-bold mb-1 ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>Deals by Stage</h3>
            <p className={`text-xs mb-6 ${isLight ? 'text-slate-600 font-medium' : 'text-slate-400'}`}>Breakdown of open deals by current stage</p>

            <div className="space-y-4">
              {[
                { label: 'Qualification', count: stageCounts.qualification, color: 'bg-blue-500' },
                { label: 'Proposal', count: stageCounts.proposal, color: 'bg-[#c9a84c]' },
                { label: 'Negotiation', count: stageCounts.negotiation, color: 'bg-purple-500' },
                { label: 'Won Deals', count: stageCounts.won, color: 'bg-emerald-500' },
              ].map(s => {
                const pct = Math.round((s.count / totalOpps) * 100)
                return (
                  <div key={s.label}>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className={`font-bold ${isLight ? 'text-slate-800' : 'text-slate-300'}`}>{s.label}</span>
                      <span className={`font-mono ${isLight ? 'text-slate-600 font-semibold' : 'text-slate-400'}`}>{s.count} ({pct}%)</span>
                    </div>
                    <div className={`w-full h-2 rounded-full overflow-hidden ${isLight ? 'bg-slate-200' : 'bg-slate-800'}`}>
                      <div className={`h-full ${s.color} rounded-full transition-all duration-500`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className={`mt-6 pt-4 border-t flex items-center justify-between text-xs ${isLight ? 'border-slate-200 text-slate-600' : 'border-white/5 text-slate-400'}`}>
            <span>Total Active Deals</span>
            <span className={`font-bold ${isLight ? 'text-slate-900' : 'text-slate-200'}`}>{opportunities.length}</span>
          </div>
        </div>
      </div>

      {/* Module Quick Navigation Bar */}
      <div>
        <h3 className={`text-xs tracking-[3px] uppercase font-bold mb-4 ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>CRM Suite Modules</h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { title: 'Leads Directory', path: '/crm/leads', icon: Users, color: 'text-blue-500', count: `${leads.length} Leads` },
            { title: 'Pipeline Kanban', path: '/crm/pipeline', icon: GitPullRequest, color: 'text-[#c9a84c]', count: `${opportunities.length} Deals` },
            { title: 'Campaigns', path: '/crm/campaigns', icon: Megaphone, color: 'text-purple-500', count: 'Active UTMs' },
            { title: 'Comm Logs', path: '/crm/communication', icon: MessageSquare, color: 'text-emerald-500', count: `${logs.length} Logs` },
            { title: 'Task Hub', path: '/crm/tasks', icon: CheckSquare, color: 'text-amber-500', count: `${tasks.length} Tasks` },
            { title: 'Nexus Support', path: '/crm/support', icon: LifeBuoy, color: 'text-rose-500', count: 'Tickets' },
          ].map(m => {
            const Icon = m.icon
            return (
              <Link
                key={m.title}
                to={m.path}
                className={`p-4 rounded-2xl border transition-all flex flex-col justify-between group cursor-pointer ${
                  isLight ? 'bg-white border-slate-200 shadow-md hover:shadow-xl hover:border-slate-300' : 'bg-[#0f172a]/80 border-white/10 shadow-2xl hover:-translate-y-1'
                }`}
              >
                <div>
                  <div className={`p-2.5 rounded-xl border w-fit ${m.color} ${isLight ? 'bg-slate-100 border-slate-200' : 'bg-white/5 border-white/10'} group-hover:scale-110 transition-all`}>
                    <Icon size={20} />
                  </div>
                  <h4 className={`text-sm font-bold mt-3 transition-all ${isLight ? 'text-slate-900 group-hover:text-[#c9a84c]' : 'text-slate-200 group-hover:text-[#c9a84c]'}`}>{m.title}</h4>
                  <p className={`text-[10px] font-mono mt-0.5 ${isLight ? 'text-slate-500 font-semibold' : 'text-slate-400'}`}>{m.count}</p>
                </div>
                <div className="mt-4 flex items-center justify-end text-slate-400 group-hover:text-[#c9a84c]">
                  <ArrowRight size={14} />
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
