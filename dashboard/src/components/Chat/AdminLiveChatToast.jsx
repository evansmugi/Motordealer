import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useCRMStore } from '../../context/CRMStore'
import { Bell, X, MessageSquare, Image as ImageIcon, FileText, Car, ArrowRight, Sparkles } from 'lucide-react'

// Key for persisting seen message IDs across page reloads
const SEEN_STORAGE_KEY = 'knk_seen_toast_message_ids'

function getStoredSeenIds() {
  try {
    const stored = sessionStorage.getItem(SEEN_STORAGE_KEY)
    return stored ? new Set(JSON.parse(stored)) : new Set()
  } catch {
    return new Set()
  }
}

function saveStoredSeenIds(seenSet) {
  try {
    sessionStorage.setItem(SEEN_STORAGE_KEY, JSON.stringify(Array.from(seenSet)))
  } catch { /* ignore */ }
}

export default function AdminLiveChatToast() {
  const navigate = useNavigate()
  const location = useLocation()
  const liveChatNotificationsEnabled = useCRMStore(state => state.liveChatNotificationsEnabled)
  const nexusThreads = useCRMStore(state => state.nexusThreads)
  const adminTheme = useCRMStore(state => state.adminTheme)
  const isLight = adminTheme === 'light'

  const [toastMessage, setToastMessage] = useState(null)
  const [toastTradeIn, setToastTradeIn] = useState(null)
  const seenMessageIds = useRef(getStoredSeenIds())

  // Soft Web Audio API Chime for Admin
  const playAdminChime = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext
      if (!AudioCtx) return
      const ctx = new AudioCtx()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(659.25, ctx.currentTime) // E5
      osc.frequency.exponentialRampToValueAtTime(987.77, ctx.currentTime + 0.25) // B5
      gain.gain.setValueAtTime(0.25, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start()
      osc.stop(ctx.currentTime + 0.45)
    } catch {
      /* AudioContext disabled */
    }
  }

  // Populate seen message IDs for all existing historical threads on first load
  useEffect(() => {
    if (nexusThreads && nexusThreads.length) {
      let updated = false
      const currentSet = seenMessageIds.current

      nexusThreads.forEach(t => {
        t.messages?.forEach(m => {
          if (m.is_from_portal && !currentSet.has(m.id)) {
            const msgTime = new Date(m.created_at || m.timestamp).getTime()
            const now = Date.now()
            const isRecent = !isNaN(msgTime) && (now - msgTime) < 5 * 60 * 1000

            if (!isRecent) {
              currentSet.add(m.id)
              updated = true
            }
          }
        })
      })

      if (updated) {
        saveStoredSeenIds(currentSet)
      }
    }
  }, [nexusThreads])

  // Watch for new incoming portal live chat messages
  useEffect(() => {
    if (location.pathname === '/crm/support') return
    if (!nexusThreads || !nexusThreads.length || !liveChatNotificationsEnabled) return

    let newestPortalMessage = null
    const currentSet = seenMessageIds.current

    nexusThreads.forEach(t => {
      t.messages?.forEach(m => {
        if (m.is_from_portal && !currentSet.has(m.id)) {
          const msgTime = new Date(m.created_at || m.timestamp).getTime()
          const now = Date.now()
          const isRecent = !isNaN(msgTime) && (now - msgTime) < 5 * 60 * 1000

          currentSet.add(m.id)
          saveStoredSeenIds(currentSet)

          if (isRecent) {
            newestPortalMessage = m
          }
        }
      })
    })

    if (newestPortalMessage) {
      playAdminChime()
      setToastMessage(newestPortalMessage)
    }
  }, [nexusThreads, liveChatNotificationsEnabled, location.pathname])

  // Multi-Tab Listener for Live Chat Threads & Dedicated Trade-In Request Notifications
  useEffect(() => {
    if (typeof window === 'undefined' || !('BroadcastChannel' in window)) return

    const bcChat = new BroadcastChannel('knk_live_chat_channel')
    bcChat.onmessage = (event) => {
      if (event.data && event.data.type === 'SYNC_THREADS') {
        useCRMStore.setState({ nexusThreads: event.data.nexusThreads })
      }
    }

    const bcTradeIn = new BroadcastChannel('knk_trade_in_notification_channel')
    bcTradeIn.onmessage = (event) => {
      if (event.data && event.data.type === 'NEW_TRADE_IN_NOTIFICATION') {
        playAdminChime()
        setToastTradeIn(event.data.tradeIn)
      }
    }

    return () => {
      bcChat.close()
      bcTradeIn.close()
    }
  }, [])

  // 1. Dedicated Vehicle Trade-In Request Toast Alert
  if (toastTradeIn && liveChatNotificationsEnabled) {
    return (
      <div className={`fixed top-24 right-6 z-[99999] max-w-sm w-full rounded-2xl p-4 backdrop-blur-2xl animate-slide-in border-2 border-[#c9a84c] shadow-2xl ${
        isLight 
          ? 'bg-white text-slate-900 shadow-slate-400/50' 
          : 'bg-[#0b101d] text-slate-100 shadow-[0_25px_60px_rgba(0,0,0,0.9)]'
      }`}>
        <div
          onClick={() => {
            const tradeId = toastTradeIn.id
            setToastTradeIn(null)
            navigate(`/crm/trade-ins/details/${tradeId}`)
          }}
          className="flex items-start justify-between gap-3 cursor-pointer group"
        >
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#c9a84c] to-amber-600 text-slate-950 font-bold shrink-0 animate-bounce shadow-lg group-hover:scale-110 transition-transform">
            <Car size={22} />
          </div>

          <div className="flex-1 min-w-0 font-sans">
            <div className="flex items-center gap-1.5 font-mono">
              <span className="text-[9px] tracking-[2px] uppercase font-bold text-[#c9a84c]">
                New Vehicle Trade-In Request
              </span>
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping shrink-0" />
            </div>

            <h5 className={`text-xs font-bold font-serif mt-0.5 truncate ${
              isLight ? 'text-slate-900' : 'text-slate-100'
            }`}>
              {toastTradeIn.client_name} <span className="font-mono text-[10px] text-slate-400">({toastTradeIn.client_phone})</span>
            </h5>

            <div className="mt-1.5 space-y-0.5 font-mono text-[11px]">
              <div className="text-emerald-500 font-bold truncate">
                Offered: {toastTradeIn.trade_vehicle}
              </div>
              <div className={`truncate ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                Target: <strong className={isLight ? 'text-slate-900' : 'text-white'}>{toastTradeIn.target_vehicle}</strong>
              </div>
              <div className="text-sky-400 text-[10px]">
                Exp. Value: KES {Number(toastTradeIn.expected_value || 0).toLocaleString()} • {toastTradeIn.image_count} Photos
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              setToastTradeIn(null)
            }}
            className={`p-1 rounded-lg transition-all shrink-0 ${
              isLight 
                ? 'text-slate-500 hover:text-slate-900 hover:bg-slate-100' 
                : 'text-slate-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <X size={16} />
          </button>
        </div>

        <div className={`mt-3 pt-3 border-t flex items-center justify-end gap-2 ${
          isLight ? 'border-slate-200' : 'border-white/10'
        }`}>
          <button
            type="button"
            onClick={() => {
              const tradeId = toastTradeIn.id
              setToastTradeIn(null)
              navigate(`/crm/trade-ins/details/${tradeId}`)
            }}
            className="w-full py-2 bg-gradient-to-r from-[#c9a84c] via-amber-500 to-amber-600 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl hover:opacity-95 transition-all flex items-center justify-center gap-1.5 shadow-lg cursor-pointer font-mono"
          >
            <Car size={14} />
            <span>Open Dedicated Trade-In Page</span>
            <ArrowRight size={13} />
          </button>
        </div>
      </div>
    )
  }

  // 2. Standard Live Customer Support Chat Toast Alert
  if (!toastMessage || !liveChatNotificationsEnabled || location.pathname === '/crm/support') return null

  return (
    <div className={`fixed top-24 right-6 z-[99999] max-w-sm w-full rounded-2xl p-4 backdrop-blur-2xl animate-slide-in border-2 border-[#c9a84c] ${
      isLight 
        ? 'bg-white text-slate-900 shadow-[0_20px_50px_rgba(0,0,0,0.15)]' 
        : 'bg-[#0b101d] text-slate-100 shadow-[0_25px_60px_rgba(0,0,0,0.9)]'
    }`}>

      <div className="flex items-start justify-between gap-3">
        <div className={`p-2.5 rounded-xl border shrink-0 animate-pulse ${
          isLight 
            ? 'bg-[#fef9c3] text-[#854d0e] border-[#fef08a]' 
            : 'bg-[#c9a84c]/20 text-[#c9a84c] border-[#c9a84c]/40'
        }`}>
          <Bell size={20} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className={`text-[9px] tracking-[2px] uppercase font-bold ${
              isLight ? 'text-[#854d0e]' : 'text-[#c9a84c]'
            }`}>
              New Live Website Message
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          </div>

          <h5 className={`text-xs font-bold font-serif mt-0.5 truncate ${
            isLight ? 'text-slate-900' : 'text-slate-100'
          }`}>
            {toastMessage.sender_name}
          </h5>

          {toastMessage.attachment_name && (
            <div className={`flex items-center gap-1 text-[11px] font-mono mt-1 ${
              isLight ? 'text-[#854d0e]' : 'text-[#c9a84c]'
            }`}>
              {toastMessage.attachment_type === 'image' ? <ImageIcon size={12} /> : <FileText size={12} />}
              <span className="truncate max-w-[180px]">{toastMessage.attachment_name}</span>
            </div>
          )}

          {toastMessage.content && (
            <p className={`text-xs mt-1 line-clamp-2 leading-snug ${
              isLight ? 'text-slate-700 font-medium' : 'text-slate-300'
            }`}>
              "{toastMessage.content}"
            </p>
          )}

          <div className={`text-[9px] font-mono mt-1.5 ${
            isLight ? 'text-slate-500 font-medium' : 'text-slate-500'
          }`}>
            {toastMessage.created_at}
          </div>
        </div>

        <button
          type="button"
          onClick={() => setToastMessage(null)}
          className={`p-1 rounded-lg transition-all shrink-0 ${
            isLight 
              ? 'text-slate-500 hover:text-slate-900 hover:bg-slate-100' 
              : 'text-slate-400 hover:text-white hover:bg-white/10'
          }`}
        >
          <X size={16} />
        </button>
      </div>

      <div className={`mt-3 pt-3 border-t flex items-center justify-end gap-2 ${
        isLight ? 'border-slate-200' : 'border-white/10'
      }`}>
        <button
          type="button"
          onClick={() => {
            setToastMessage(null)
            navigate('/crm/support')
          }}
          className="w-full py-2 bg-gradient-to-r from-[#c9a84c] to-[#d9b85c] text-black font-bold text-xs uppercase tracking-wider rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-1.5 shadow-md font-mono"
        >
          <MessageSquare size={14} />
          <span>Open Customer Support</span>
        </button>
      </div>
    </div>
  )
}
