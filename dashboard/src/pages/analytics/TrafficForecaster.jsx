import React, { useState } from 'react'
import { useCRMStore } from '../../context/CRMStore'
import { TrendingUp, Sliders, Zap, Award, Target, ArrowUpRight } from 'lucide-react'

export default function TrafficForecaster() {
  const adminTheme = useCRMStore(state => state.adminTheme)
  const isLight = adminTheme === 'light'
  const [horizonDays, setHorizonDays] = useState(14)

  const intentProbabilities = [
    { label: 'Vehicle Purchase Intent', prob: 88, color: '#a3e635' },
    { label: 'Import Consultation Interest', prob: 74, color: '#06b6d4' },
    { label: 'Showroom Viewing Request', prob: 62, color: '#6366f1' },
    { label: 'Accessories Add-on Purchase', prob: 45, color: '#f59e0b' }
  ]

  return (
    <div className="space-y-6 font-sans pb-12">
      {/* Header */}
      <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl border shadow-2xl backdrop-blur-xl ${isLight ? 'bg-white/90 border-slate-200' : 'bg-[#070b14]/90 border-white/10'}`}>
        <div>
          <span className="text-[10px] tracking-[4px] uppercase font-bold text-[#a3e635]">Predictive Telemetry</span>
          <h1 className={`text-2xl font-serif font-light mt-1 ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>Traffic & Intent Forecaster</h1>
        </div>

        {/* Horizon Badge */}
        <div className={`flex items-center gap-3 px-4 py-2 rounded-xl border text-xs font-mono ${isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-950 border-white/10'}`}>
          <span className={isLight ? 'text-slate-600' : 'text-slate-400'}>Horizon Intensity:</span>
          <span className="px-3 py-1 rounded bg-emerald-500/20 text-emerald-600 font-bold border border-emerald-500/40">
            OPTIMAL GROWTH
          </span>
        </div>
      </div>

      {/* Projection Slider & Growth Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Growth Engine Card */}
        <div className={`p-6 rounded-2xl border shadow-2xl space-y-3 ${isLight ? 'bg-white border-slate-200' : 'bg-[#111827] border-white/10'}`}>
          <div className={`flex items-center justify-between text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            <span>Growth Trend Engine</span>
            <TrendingUp size={16} className="text-[#a3e635]" />
          </div>
          <div className={`text-4xl font-mono font-bold ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>+28.4%</div>
          <p className="text-xs text-emerald-500 flex items-center gap-1 font-mono">
            <ArrowUpRight size={14} /> Forecasted increase over prev {horizonDays}d
          </p>
        </div>

        {/* Projection Horizon Controls */}
        <div className={`md:col-span-2 p-6 rounded-2xl border shadow-2xl space-y-4 ${isLight ? 'bg-white border-slate-200' : 'bg-[#111827] border-white/10'}`}>
          <div className="flex items-center justify-between">
            <h3 className={`text-sm font-serif font-semibold ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>Projection Horizon Slider</h3>
            <span className="text-xs font-mono text-[#06b6d4] font-bold">{horizonDays} Days Horizon</span>
          </div>

          <input
            type="range"
            min="7"
            max="30"
            step="7"
            value={horizonDays}
            onChange={e => setHorizonDays(Number(e.target.value))}
            className="w-full accent-[#6366f1] cursor-pointer"
          />

          <div className={`flex justify-between text-xs font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            <span>7 Days</span>
            <span>14 Days</span>
            <span>21 Days</span>
            <span>30 Days</span>
          </div>
        </div>

      </div>

      {/* Automated Intent Probabilities Bars */}
      <div className={`p-6 rounded-2xl border shadow-2xl space-y-4 ${isLight ? 'bg-white border-slate-200' : 'bg-[#111827] border-white/10'}`}>
        <h3 className={`text-lg font-serif font-light ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>Automated Prospect Intent Probabilities</h3>

        <div className="space-y-4">
          {intentProbabilities.map(ip => (
            <div key={ip.label} className="space-y-1.5 font-mono text-xs">
              <div className="flex items-center justify-between">
                <span className={isLight ? 'text-slate-700' : 'text-slate-200'}>{ip.label}</span>
                <span style={{ color: ip.color }} className="font-bold">{ip.prob}% Conversion Probability</span>
              </div>
              <div className={`w-full h-2.5 rounded-full overflow-hidden border ${isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-950 border-white/5'}`}>
                <div className="h-full rounded-full transition-all duration-500" style={{ width: `${ip.prob}%`, backgroundColor: ip.color }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
