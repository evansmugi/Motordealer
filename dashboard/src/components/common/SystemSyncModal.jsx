import React, { useEffect, useState } from 'react'
import { RefreshCw, CheckCircle2, Server, Database, Activity, X } from 'lucide-react'

export default function SystemSyncModal({ isOpen, onClose, isLight }) {
  const [step, setStep] = useState(1)

  useEffect(() => {
    if (isOpen) {
      setStep(1)
      const timer1 = setTimeout(() => setStep(2), 700)
      const timer2 = setTimeout(() => setStep(3), 1400)
      return () => {
        clearTimeout(timer1)
        clearTimeout(timer2)
      }
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className={`w-full max-w-md rounded-2xl border p-6 shadow-2xl transition-all relative overflow-hidden ${
        isLight ? 'bg-white border-slate-200 text-slate-900 shadow-slate-400/30' : 'bg-[#090e1a] border-cyan-500/30 text-slate-100 shadow-cyan-950/50'
      }`}>

        {/* Glow Header Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-sky-400 to-indigo-500" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/10 transition-all"
        >
          <X size={16} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className={`p-3 rounded-2xl border ${
            isLight ? 'bg-cyan-50 border-cyan-200 text-cyan-600' : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
          }`}>
            <RefreshCw size={22} className={step < 3 ? 'animate-spin' : ''} />
          </div>
          <div>
            <h3 className="font-serif text-lg font-bold tracking-tight">
              {step < 3 ? 'Synchronizing Telemetry...' : 'System Fully Synchronized'}
            </h3>
            <p className="text-xs text-slate-400 font-mono mt-0.5">Real-Time Database & Store Cache</p>
          </div>
        </div>

        {/* Sync Progress Steps */}
        <div className="space-y-2.5 font-mono text-xs">
          <div className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
            step >= 1 ? (isLight ? 'bg-cyan-50/50 border-cyan-200 text-slate-800' : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-200') : 'opacity-40 border-transparent'
          }`}>
            <div className="flex items-center gap-2.5">
              <Database size={15} className="text-cyan-400" />
              <span>Vehicle Inventory & Listings DB</span>
            </div>
            {step >= 2 ? <CheckCircle2 size={16} className="text-emerald-400" /> : <div className="w-3.5 h-3.5 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />}
          </div>

          <div className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
            step >= 2 ? (isLight ? 'bg-sky-50/50 border-sky-200 text-slate-800' : 'bg-sky-500/10 border-sky-500/30 text-sky-200') : 'opacity-40 border-transparent'
          }`}>
            <div className="flex items-center gap-2.5">
              <Server size={15} className="text-sky-400" />
              <span>Omnichannel CRM Leads & Tasks</span>
            </div>
            {step >= 3 ? <CheckCircle2 size={16} className="text-emerald-400" /> : step === 2 ? <div className="w-3.5 h-3.5 rounded-full border-2 border-sky-400 border-t-transparent animate-spin" /> : <span className="text-[10px] text-slate-500">WAITING</span>}
          </div>

          <div className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
            step >= 3 ? (isLight ? 'bg-emerald-50/50 border-emerald-200 text-slate-800' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200') : 'opacity-40 border-transparent'
          }`}>
            <div className="flex items-center gap-2.5">
              <Activity size={15} className="text-emerald-400" />
              <span>Supabase Latency & CDN (24ms)</span>
            </div>
            {step >= 3 ? <CheckCircle2 size={16} className="text-emerald-400" /> : <span className="text-[10px] text-slate-500">WAITING</span>}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-white/10 flex justify-end">
          <button
            onClick={onClose}
            disabled={step < 3}
            className={`px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
              step < 3
                ? 'opacity-50 cursor-not-allowed bg-slate-800 text-slate-500'
                : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/30 cursor-pointer'
            }`}
          >
            {step < 3 ? 'Syncing...' : 'Done'}
          </button>
        </div>

      </div>
    </div>
  )
}
