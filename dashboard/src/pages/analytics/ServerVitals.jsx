import React from 'react'
import { useCRMStore } from '../../context/CRMStore'
import { HardDrive, Cpu, Database, Server, Clock, Activity, CheckCircle2 } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function ServerVitals() {
  const adminTheme = useCRMStore(state => state.adminTheme)
  const isLight = adminTheme === 'light'

  const loadData = [
    { hour: '00:00', requests: 120 },
    { hour: '04:00', requests: 45 },
    { hour: '08:00', requests: 380 },
    { hour: '12:00', requests: 650 },
    { hour: '16:00', requests: 890 },
    { hour: '20:00', requests: 410 }
  ]

  return (
    <div className="space-y-6 font-sans pb-12">
      {/* Header */}
      <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl border shadow-2xl backdrop-blur-xl ${isLight ? 'bg-white/90 border-slate-200' : 'bg-[#070b14]/90 border-white/10'}`}>
        <div>
          <span className="text-[10px] tracking-[4px] uppercase font-bold text-[#a3e635]">Infrastructure Telemetry</span>
          <h1 className={`text-2xl font-serif font-light mt-1 ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>Server Status & System Vitals</h1>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-emerald-500 bg-emerald-500/10 px-4 py-2 rounded-xl border border-emerald-500/30">
          <CheckCircle2 size={16} />
          <span>PostgreSQL 18 & Node Runtime Connected</span>
        </div>
      </div>

      {/* Infrastructure Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
        <div className={`p-5 rounded-2xl border shadow-xl space-y-2 ${isLight ? 'bg-white border-slate-200' : 'bg-[#111827] border-white/10'}`}>
          <div className={`flex items-center justify-between text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            <span>DB Latency</span>
            <Database size={16} className="text-[#a3e635]" />
          </div>
          <div className={`text-3xl font-bold ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>1.8 ms</div>
          <p className="text-[10px] text-emerald-500">PostgreSQL 18 Local</p>
        </div>

        <div className={`p-5 rounded-2xl border shadow-xl space-y-2 ${isLight ? 'bg-white border-slate-200' : 'bg-[#111827] border-white/10'}`}>
          <div className={`flex items-center justify-between text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            <span>Memory Usage</span>
            <Cpu size={16} className="text-[#06b6d4]" />
          </div>
          <div className={`text-3xl font-bold ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>142 MB</div>
          <p className={`text-[10px] ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>Peak: 256MB / Limit 2GB</p>
        </div>

        <div className={`p-5 rounded-2xl border shadow-xl space-y-2 ${isLight ? 'bg-white border-slate-200' : 'bg-[#111827] border-white/10'}`}>
          <div className={`flex items-center justify-between text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            <span>Runtime Engine</span>
            <Server size={16} className="text-[#6366f1]" />
          </div>
          <div className={`text-3xl font-bold ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>Node v22</div>
          <p className={`text-[10px] ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>Vite 7.3 Client Engine</p>
        </div>

        <div className={`p-5 rounded-2xl border shadow-xl space-y-2 ${isLight ? 'bg-white border-slate-200' : 'bg-[#111827] border-white/10'}`}>
          <div className={`flex items-center justify-between text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            <span>Database Tables</span>
            <HardDrive size={16} className="text-amber-400" />
          </div>
          <div className={`text-3xl font-bold ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>18 Tables</div>
          <p className={`text-[10px] ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>Schema Synced</p>
        </div>
      </div>

      {/* Disk Usage Progress Meter */}
      <div className={`p-6 rounded-2xl border shadow-2xl space-y-3 ${isLight ? 'bg-white border-slate-200' : 'bg-[#111827] border-white/10'}`}>
        <div className="flex items-center justify-between font-mono text-xs">
          <span className={`font-bold ${isLight ? 'text-slate-700' : 'text-slate-200'}`}>Disk Space Utilization</span>
          <span className="text-[#a3e635] font-bold">48.2 GB Free of 512 GB (90% Available)</span>
        </div>
        <div className={`w-full h-3 rounded-full overflow-hidden border ${isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-950 border-white/10'}`}>
          <div className="bg-gradient-to-r from-[#6366f1] to-[#a3e635] h-full rounded-full" style={{ width: '10%' }} />
        </div>
      </div>

      {/* 24-Hour Server Performance Load Map */}
      <div className={`p-6 rounded-2xl border shadow-2xl space-y-4 ${isLight ? 'bg-white border-slate-200' : 'bg-[#111827] border-white/10'}`}>
        <h3 className={`text-lg font-serif font-light ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>24-Hour Server Performance Load Map</h3>
        <div className="h-64 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={loadData}>
              <CartesianGrid strokeDasharray="3 3" stroke={isLight ? '#e2e8f0' : '#1f2937'} />
              <XAxis dataKey="hour" stroke={isLight ? '#94a3b8' : '#6b7280'} fontSize={11} />
              <YAxis stroke={isLight ? '#94a3b8' : '#6b7280'} fontSize={11} />
              <Tooltip contentStyle={{ backgroundColor: isLight ? '#ffffff' : '#070b14', borderColor: isLight ? '#e2e8f0' : '#374151', borderRadius: '12px' }} />
              <Bar dataKey="requests" fill="#6366f1" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
