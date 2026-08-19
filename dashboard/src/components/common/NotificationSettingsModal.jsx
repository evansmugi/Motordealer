import React from 'react'
import { createPortal } from 'react-dom'
import { Bell, BellOff, Volume2, ShieldCheck, X, Sparkles } from 'lucide-react'
import { useCRMStore } from '../../context/CRMStore'

export default function NotificationSettingsModal({ isOpen, onClose, isLight }) {
  const liveChatNotificationsEnabled = useCRMStore(state => state.liveChatNotificationsEnabled)
  const toggleLiveChatNotifications = useCRMStore(state => state.toggleLiveChatNotifications)

  if (!isOpen) return null

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn" onClick={onClose}>
      <div onClick={e => e.stopPropagation()} className={`w-full max-w-md rounded-2xl border p-6 shadow-2xl transition-all relative overflow-hidden ${
        isLight ? 'bg-white border-slate-200 text-slate-900 shadow-slate-400/30' : 'bg-[#090e1a] border-emerald-500/30 text-slate-100 shadow-emerald-950/50'
      }`}>

        {/* Glow Header Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500" />

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
            isLight ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
          }`}>
            <Bell size={22} className="animate-pulse" />
          </div>
          <div>
            <h3 className="font-serif text-lg font-bold tracking-tight">Omnichannel Notification Settings</h3>
            <p className="text-xs text-slate-400 font-mono mt-0.5">Live Lead Inquiries & Audio Alerts</p>
          </div>
        </div>

        {/* Controls List */}
        <div className="space-y-3 font-sans text-xs">
          
          {/* Main Toggle Item */}
          <div className={`p-4 rounded-xl border flex items-center justify-between transition-all ${
            liveChatNotificationsEnabled
              ? (isLight ? 'bg-emerald-50/70 border-emerald-300' : 'bg-emerald-500/10 border-emerald-500/30')
              : (isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/60 border-slate-800')
          }`}>
            <div className="flex items-center gap-3">
              {liveChatNotificationsEnabled ? <Bell size={18} className="text-emerald-400" /> : <BellOff size={18} className="text-slate-500" />}
              <div>
                <span className="font-bold block">Live Chat Popup Alerts</span>
                <span className="text-[11px] text-slate-400">Receive instant popups when customers inquire on WhatsApp or webchat</span>
              </div>
            </div>

            <button
              onClick={toggleLiveChatNotifications}
              className={`px-3 py-1.5 rounded-lg font-mono font-bold text-[10px] uppercase border transition-all cursor-pointer ${
                liveChatNotificationsEnabled
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md shadow-emerald-500/30'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
            >
              {liveChatNotificationsEnabled ? 'ACTIVE' : 'OFF'}
            </button>
          </div>

          {/* Audio Chime Notification */}
          <div className="p-3.5 rounded-xl border border-white/5 bg-white/[0.02] flex items-center justify-between text-slate-300">
            <div className="flex items-center gap-2.5">
              <Volume2 size={16} className="text-[#c9a84c]" />
              <span>HQ Audio Chime Tone</span>
            </div>
            <span className="font-mono text-[10px] text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">ENABLED</span>
          </div>

          {/* Security & SLA Compliance */}
          <div className="p-3.5 rounded-xl border border-white/5 bg-white/[0.02] flex items-center justify-between text-slate-300">
            <div className="flex items-center gap-2.5">
              <ShieldCheck size={16} className="text-sky-400" />
              <span>SLA Response SLA Priority Flag</span>
            </div>
            <span className="font-mono text-[10px] text-sky-400 font-bold bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">15-MIN TARGET</span>
          </div>

        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-white/10 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/30 transition-all cursor-pointer"
          >
            Save & Apply Settings
          </button>
        </div>

      </div>
    </div>,
    document.body
  )
}
