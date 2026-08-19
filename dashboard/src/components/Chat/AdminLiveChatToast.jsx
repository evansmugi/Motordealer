import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useCRMStore } from '../../context/CRMStore'
import { Bell, X, MessageSquare, Image as ImageIcon, FileText, Car, ArrowRight, Sparkles, User, ShieldCheck } from 'lucide-react'

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
  const [toastLead, setToastLead] = useState(null)
  const seenMessageIds = useRef(getStoredSeenIds())
  const seenTradeInIds = useRef(new Set())
  const seenLeadIds = useRef(new Set())

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
      gain.gain.setValueAtTime(0.3, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start()
      osc.stop(ctx.currentTime + 0.5)
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

  // Multi-Tab & LocalStorage Listeners for Live Chat Threads, Trade-Ins & Lead Notifications
  useEffect(() => {
    if (typeof window === 'undefined') return

    // 1. BroadcastChannel Listeners
    let bcChat, bcTradeIn, bcLead
    if ('BroadcastChannel' in window) {
      bcChat = new BroadcastChannel('knk_live_chat_channel')
      bcChat.onmessage = (event) => {
        if (event.data && event.data.type === 'SYNC_THREADS') {
          useCRMStore.setState({ nexusThreads: event.data.nexusThreads })
        }
      }

      bcTradeIn = new BroadcastChannel('knk_trade_in_notification_channel')
      bcTradeIn.onmessage = (event) => {
        if (event.data && event.data.type === 'NEW_TRADE_IN_NOTIFICATION') {
          playAdminChime()
          setToastTradeIn(event.data.tradeIn)
        }
      }

      bcLead = new BroadcastChannel('knk_lead_notification_channel')
      bcLead.onmessage = (event) => {
        if (event.data && event.data.type === 'NEW_LEAD_NOTIFICATION') {
          playAdminChime()
          setToastLead(event.data.lead)
        }
      }
    }

    // 2. Storage Event Listener (for cross-tab localStorage triggers)
    const handleStorageChange = (e) => {
      if (e.key === 'knk_latest_trade_in_event' && e.newValue) {
        try {
          const data = JSON.parse(e.newValue)
          if (data.tradeIn && !seenTradeInIds.current.has(data.tradeIn.id)) {
            seenTradeInIds.current.add(data.tradeIn.id)
            playAdminChime()
            setToastTradeIn(data.tradeIn)
          }
        } catch { /* ignore */ }
      } else if (e.key === 'knk_latest_lead_event' && e.newValue) {
        try {
          const data = JSON.parse(e.newValue)
          if (data.lead) {
            playAdminChime()
            setToastLead(data.lead)
          }
        } catch { /* ignore */ }
      }
    }

    window.addEventListener('storage', handleStorageChange)

    // 3. Fast 8-Second Polling for Recent Strapi Inbound Trade-Ins & Leads
    const pollInterval = setInterval(async () => {
      try {
        // Poll Trade-Ins
        const tRes = await fetch('http://localhost:1338/api/trade-in-requests').then(r => r.ok ? r.json() : null)
        if (tRes && Array.isArray(tRes.data) && tRes.data.length > 0) {
          const newestItem = tRes.data[tRes.data.length - 1] || tRes.data[0]
          const attr = newestItem.attributes || newestItem
          const tradeId = `strapi-trade-${newestItem.id}`
          const createdTime = new Date(attr.publishedAt || attr.createdAt || new Date()).getTime()
          const isRecent = (Date.now() - createdTime) < 3 * 60 * 1000 // Last 3 minutes

          if (isRecent && !seenTradeInIds.current.has(tradeId)) {
            seenTradeInIds.current.add(tradeId)
            playAdminChime()
            setToastTradeIn({
              id: newestItem.id,
              client_name: attr.client_name || attr.clientName || 'VIP Prospect',
              client_phone: attr.client_phone || attr.clientPhone || '',
              trade_vehicle: `${attr.trade_year || ''} ${attr.trade_make || ''} ${attr.trade_model || ''}`.trim() || 'Trade Vehicle',
              target_vehicle: attr.target_vehicle || 'Target Vehicle',
              expected_value: attr.expected_value || attr.expectedValue || '0',
              image_count: 1
            })
          }
        }

        // Poll Leads
        const lRes = await fetch('http://localhost:1338/api/crm-leads').then(r => r.ok ? r.json() : null)
        if (lRes && Array.isArray(lRes.data) && lRes.data.length > 0) {
          const newestLead = lRes.data[lRes.data.length - 1] || lRes.data[0]
          const attr = newestLead.attributes || newestLead
          const leadId = `strapi-lead-${newestLead.id}`
          const createdTime = new Date(attr.publishedAt || attr.createdAt || new Date()).getTime()
          const isRecent = (Date.now() - createdTime) < 3 * 60 * 1000

          if (isRecent && !seenLeadIds.current.has(leadId)) {
            seenLeadIds.current.add(leadId)
            if (!attr.source?.includes('Trade-In')) {
              playAdminChime()
              setToastLead({
                name: attr.name || 'Storefront Prospect',
                phone: attr.phone || '',
                source: attr.source || 'Storefront Digital Matrix',
                notes: attr.notes || '',
                intentScore: attr.intent_score || 85
              })
            }
          }
        }
      } catch { /* ignore poll errors */ }
    }, 8000)

    return () => {
      if (bcChat) bcChat.close()
      if (bcTradeIn) bcTradeIn.close()
      if (bcLead) bcLead.close()
      window.removeEventListener('storage', handleStorageChange)
      clearInterval(pollInterval)
    }
  }, [])

  // 1. Dedicated Vehicle Trade-In Request Toast Alert
  if (toastTradeIn && liveChatNotificationsEnabled) {
    return (
      <div className={`fixed top-24 right-6 z-[99999] max-w-sm w-full rounded-2xl p-4 backdrop-blur-2xl animate-slide-in border-2 border-[#c9a84c] shadow-[0_25px_60px_rgba(0,0,0,0.9)] ${
        isLight ? 'bg-white text-slate-900 shadow-slate-400/50' : 'bg-[#0b101d] text-slate-100'
      }`}>
        <div
          onClick={() => {
            setToastTradeIn(null)
            navigate(`/crm/trade-ins`)
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

            <h5 className={`text-xs font-bold mt-0.5 truncate ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
              {toastTradeIn.client_name} <span className="font-mono text-[10px] text-slate-400">({toastTradeIn.client_phone})</span>
            </h5>

            <div className="mt-1.5 space-y-0.5 font-mono text-[11px]">
              <div className="text-emerald-400 font-bold truncate">
                Offered: {toastTradeIn.trade_vehicle}
              </div>
              <div className={`truncate ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                Target: <strong className={isLight ? 'text-slate-900' : 'text-white'}>{toastTradeIn.target_vehicle}</strong>
              </div>
              <div className="text-[#c9a84c] text-[10px]">
                Exp. Value: KES {Number(toastTradeIn.expected_value || 0).toLocaleString()}
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
              isLight ? 'text-slate-500 hover:text-slate-900 hover:bg-slate-100' : 'text-slate-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <X size={16} />
          </button>
        </div>

        <div className={`mt-3 pt-3 border-t flex items-center justify-end gap-2 ${isLight ? 'border-slate-200' : 'border-white/10'}`}>
          <button
            type="button"
            onClick={() => {
              setToastTradeIn(null)
              navigate(`/crm/trade-ins`)
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

  // 2. Dedicated Inbound Lead & Viewing Request Toast Alert
  if (toastLead && liveChatNotificationsEnabled) {
    return (
      <div className={`fixed top-24 right-6 z-[99999] max-w-sm w-full rounded-2xl p-4 backdrop-blur-2xl animate-slide-in border-2 border-emerald-500/80 shadow-[0_25px_60px_rgba(0,0,0,0.9)] ${
        isLight ? 'bg-white text-slate-900' : 'bg-[#0b101d] text-slate-100'
      }`}>
        <div
          onClick={() => {
            setToastLead(null)
            navigate(`/crm/leads`)
          }}
          className="flex items-start justify-between gap-3 cursor-pointer group"
        >
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-slate-950 font-bold shrink-0 animate-pulse shadow-lg">
            <User size={22} />
          </div>

          <div className="flex-1 min-w-0 font-sans">
            <div className="flex items-center gap-1.5 font-mono">
              <span className="text-[9px] tracking-[2px] uppercase font-bold text-emerald-400">
                New Telemetry Lead Captured
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
            </div>

            <h5 className="text-xs font-bold mt-0.5 truncate text-white">
              {toastLead.name} <span className="font-mono text-[10px] text-slate-400">({toastLead.phone})</span>
            </h5>

            <div className="mt-1 space-y-0.5 font-mono text-[11px]">
              <div className="text-[#c9a84c] font-bold truncate">
                Source: {toastLead.source}
              </div>
              <p className="text-slate-300 text-xs line-clamp-2 leading-tight mt-1">
                "{toastLead.notes}"
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              setToastLead(null)
            }}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 shrink-0"
          >
            <X size={16} />
          </button>
        </div>

        <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => {
              setToastLead(null)
              navigate(`/crm/leads`)
            }}
            className="w-full py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:opacity-95 transition-all flex items-center justify-center gap-1.5 shadow-lg cursor-pointer font-mono"
          >
            <Sparkles size={14} />
            <span>Open Leads Manager</span>
            <ArrowRight size={13} />
          </button>
        </div>
      </div>
    )
  }

  // 3. Standard Live Customer Support Chat Toast Alert
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

          <h5 className={`text-xs font-bold mt-0.5 truncate ${
            isLight ? 'text-slate-900' : 'text-slate-100'
          }`}>
            {toastMessage.sender_name}
          </h5>

          {toastMessage.content && (
            <p className={`text-xs mt-1 line-clamp-2 leading-snug ${
              isLight ? 'text-slate-700 font-medium' : 'text-slate-300'
            }`}>
              "{toastMessage.content}"
            </p>
          )}
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
