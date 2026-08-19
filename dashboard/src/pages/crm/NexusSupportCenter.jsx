import React, { useState, useEffect, useRef } from 'react'
import { useCRMStore } from '../../context/CRMStore'
import { sortChatMessages, formatChatTime } from '../../utils/chatUtils'
import { LifeBuoy, MessageSquare, Send, Paperclip, CheckCircle2, ShieldAlert, User, Clock, FileText, Bell, BellOff, Sparkles, X, Globe, MapPin, Monitor, Cpu, CornerDownRight } from 'lucide-react'

export default function NexusSupportCenter() {
  const nexusThreads = useCRMStore(state => state.nexusThreads)
  const addNexusMessage = useCRMStore(state => state.addNexusMessage)
  const resolveNexusThread = useCRMStore(state => state.resolveNexusThread)
  const toggleAIForThread = useCRMStore(state => state.toggleAIForThread)
  const liveChatNotificationsEnabled = useCRMStore(state => state.liveChatNotificationsEnabled)
  const toggleLiveChatNotifications = useCRMStore(state => state.toggleLiveChatNotifications)
  const syncSupportThreads = useCRMStore(state => state.syncSupportThreads)
  const adminTheme = useCRMStore(state => state.adminTheme)
  const isLight = adminTheme === 'light'

  const [activeThreadId, setActiveThreadId] = useState(() => {
    const liveThread = nexusThreads.find(t => t.id.startsWith('th-live-'))
    return liveThread ? liveThread.id : (nexusThreads[0]?.id || 'th-1')
  })

  const [replyText, setReplyText] = useState('')
  const [attachment, setAttachment] = useState(null)

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
      gain.gain.setValueAtTime(0.2, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start()
      osc.stop(ctx.currentTime + 0.4)
    } catch {
      /* AudioContext disabled */
    }
  }

  const seenMessageIds = useRef(new Set())
  const isInitialMount = useRef(true)

  // Populate initial seen message IDs
  useEffect(() => {
    if (isInitialMount.current && nexusThreads.length) {
      nexusThreads.forEach(t => {
        t.messages?.forEach(m => {
          if (m.is_from_portal) seenMessageIds.current.add(m.id)
        })
      })
      isInitialMount.current = false
    }
  }, [nexusThreads])

  // Play chime when new portal message arrives
  useEffect(() => {
    if (isInitialMount.current) return
    let hasNewPortalMessage = false
    nexusThreads.forEach(t => {
      t.messages?.forEach(m => {
        if (m.is_from_portal && !seenMessageIds.current.has(m.id)) {
          seenMessageIds.current.add(m.id)
          hasNewPortalMessage = true
        }
      })
    })

    if (hasNewPortalMessage && liveChatNotificationsEnabled) {
      playAdminChime()
    }
  }, [nexusThreads, liveChatNotificationsEnabled])

  // Active 3-second live chat polling daemon for instant sub-3s response delivery on Admin side
  useEffect(() => {
    syncSupportThreads()
    const interval = setInterval(() => {
      syncSupportThreads()
    }, 3000)

    return () => clearInterval(interval)
  }, [syncSupportThreads])

  // Multi-tab BroadcastChannel listener for instant admin chat sync
  useEffect(() => {
    if (typeof window === 'undefined') return

    let bc
    if ('BroadcastChannel' in window) {
      bc = new BroadcastChannel('knk_live_chat_channel')
      bc.onmessage = (event) => {
        if (event.data && event.data.type === 'SYNC_THREADS') {
          const updated = event.data.nexusThreads
          useCRMStore.setState({ nexusThreads: updated })
        }
      }
    }

    return () => {
      if (bc) bc.close()
    }
  }, [])

  const activeThread = nexusThreads.find(t => t.id === activeThreadId) || nexusThreads[0]

  const handleSendReply = (e) => {
    e.preventDefault()
    if (!replyText.trim() && !attachment) return

    addNexusMessage(activeThreadId, {
      sender_name: 'Support Agent (Alex)',
      is_from_portal: false,
      content: replyText,
      attachment_name: attachment ? attachment.name : undefined,
      attachment_type: attachment ? attachment.type : undefined,
      attachment_url: attachment ? attachment.url : undefined
    })

    setReplyText('')
    setAttachment(null)
  }

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (file.size > 10 * 1024 * 1024) {
      alert('File size exceeds 10MB limit.')
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      const dataUrl = event.target.result
      const isImage = file.type.startsWith('image/')
      setAttachment({
        name: file.name,
        type: isImage ? 'image' : 'document',
        url: dataUrl
      })
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] tracking-[4px] uppercase text-[#c9a84c] font-semibold block">Customer Service</span>
          <h1 className={`text-3xl font-serif font-light mt-1 ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
            Support Tickets &amp; Live Messages
          </h1>
        </div>

        {/* AI Concierge Status Indicator */}
        <div className="flex items-center gap-2">
          <div className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl border text-xs font-semibold uppercase tracking-wider ${
            isLight ? 'bg-amber-50 border-amber-300 text-amber-900' : 'bg-[#c9a84c]/10 border-[#c9a84c]/40 text-[#c9a84c]'
          }`}>
            <Sparkles size={16} className="text-[#c9a84c] animate-pulse" />
            <span>AI Concierge Engine: <strong className="font-mono text-[#c9a84c] font-bold">ACTIVE</strong></span>
          </div>

          {/* Live Chat Notification Preference Toggle Button */}
          <button
            onClick={toggleLiveChatNotifications}
            className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border text-xs font-semibold uppercase tracking-wider transition-all shadow-md cursor-pointer ${
              liveChatNotificationsEnabled
                ? isLight ? 'bg-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-100' : 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/20'
                : isLight ? 'bg-slate-100 border-slate-300 text-slate-600 hover:bg-slate-200' : 'bg-slate-900 border-white/10 text-slate-400 hover:border-white/20'
            }`}
            title="Turn real-time live chat notification popups ON or OFF"
          >
            {liveChatNotificationsEnabled ? (
              <>
                <Bell size={16} className="text-emerald-500 animate-pulse" />
                <span>Alerts: <strong className="font-mono text-emerald-700 dark:text-emerald-300 font-bold">ON</strong></span>
              </>
            ) : (
              <>
                <BellOff size={16} className="text-slate-400" />
                <span>Alerts: <strong className="font-mono text-slate-500">OFF</strong></span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ticket Inbox Sidebar */}
        <div className={`p-4 rounded-2xl border transition-all duration-300 h-[600px] flex flex-col ${
          isLight ? 'bg-white border-slate-200 shadow-xl text-slate-900' : 'bg-[#0f172a]/80 border-white/10 shadow-2xl text-slate-100'
        }`}>
          <div className={`flex items-center justify-between border-b pb-3 ${isLight ? 'border-slate-200' : 'border-white/10'}`}>
            <h3 className={`text-sm font-serif font-semibold ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
              Ticket Inbox ({nexusThreads.length})
            </h3>
          </div>

          <div className="flex-1 overflow-y-auto crm-scroll space-y-2.5 pr-1 mt-3">
            {nexusThreads.map(thread => {
              const isActive = thread.id === activeThreadId
              return (
                <div
                  key={thread.id}
                  onClick={() => setActiveThreadId(thread.id)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    isActive
                      ? isLight ? 'bg-amber-50 border-amber-400 shadow-md text-slate-900' : 'bg-[#c9a84c]/20 border-[#c9a84c] shadow-md text-slate-100'
                      : isLight ? 'bg-slate-50 border-slate-200 text-slate-800 hover:border-amber-300 hover:bg-slate-100' : 'bg-slate-950/60 border-white/5 text-slate-200 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-bold font-serif ${isLight ? 'text-slate-900' : 'text-slate-200'}`}>
                      {thread.customer_name}
                    </span>
                    <span className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded border ${
                      thread.status === 'resolved'
                        ? isLight ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : isLight ? 'bg-amber-100 text-amber-900 border-amber-300' : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                    }`}>
                      {thread.status}
                    </span>
                  </div>

                  <div className={`text-[11px] mt-1 font-mono truncate ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                    {thread.subject}
                  </div>
                  <div className="flex items-center justify-between mt-2 text-[10px] text-slate-400 font-mono">
                    <span className={`px-1.5 py-0.5 rounded uppercase font-bold text-[9px] ${
                      thread.priority === 'high' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-slate-800 text-slate-300'
                    }`}>
                      {thread.priority} Priority
                    </span>
                    <span>{thread.created_at || 'Just now'}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Selected Thread Active View */}
        {activeThread ? (
          <div className={`lg:col-span-2 p-5 rounded-2xl border transition-all duration-300 h-[600px] flex flex-col ${
            isLight ? 'bg-white border-slate-200 shadow-xl text-slate-900' : 'bg-[#0f172a]/80 border-white/10 shadow-2xl text-slate-100'
          }`}>
            {/* Thread Top Bar */}
            <div className={`flex items-center justify-between border-b pb-3 ${isLight ? 'border-slate-200' : 'border-white/10'}`}>
              <div>
                <h2 className={`text-base font-serif font-bold ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                  {activeThread.subject}
                </h2>
                <div className={`flex items-center gap-2 text-xs mt-0.5 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                  <span className="font-semibold text-[#c9a84c]">{activeThread.customer_name}</span>
                  <span>•</span>
                  <span className="font-mono">{activeThread.id}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleAIForThread(activeThread.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                    activeThread.ai_disabled
                      ? isLight ? 'bg-slate-100 border-slate-300 text-slate-500 hover:bg-slate-200' : 'bg-slate-900 border-white/10 text-slate-400 hover:border-white/20'
                      : isLight ? 'bg-amber-50 border-amber-300 text-amber-900 hover:bg-amber-100' : 'bg-[#c9a84c]/10 border-[#c9a84c]/40 text-[#c9a84c] hover:bg-[#c9a84c]/20'
                  }`}
                  title={activeThread.ai_disabled ? "Enable AI Concierge auto-reply for this thread" : "Pause AI Concierge auto-reply for this thread"}
                >
                  <Sparkles size={14} className={activeThread.ai_disabled ? '' : 'animate-pulse text-[#c9a84c]'} />
                  <span>AI Auto-Reply: <strong className="font-mono">{activeThread.ai_disabled ? 'OFF' : 'ON'}</strong></span>
                </button>

                {activeThread.status !== 'resolved' && (
                  <button
                    onClick={() => resolveNexusThread(activeThread.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                      isLight
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-100'
                        : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                    }`}
                  >
                    <CheckCircle2 size={14} />
                    <span>Resolve</span>
                  </button>
                )}
              </div>
            </div>

            {/* Chat Messages Log */}
            <div className="flex-1 overflow-y-auto crm-scroll py-4 space-y-4 pr-2">
              {(() => {
                const sorted = sortChatMessages(activeThread.messages)
                return sorted.map((msg, idx) => {
                  const isClient = msg.is_from_portal
                  const precedingClientMsg = !isClient
                    ? sorted.slice(0, idx).reverse().find(prev => prev.is_from_portal && !(prev.id || '').includes('m-auto'))
                    : null
                  const formattedTime = formatChatTime(msg.created_at)

                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${msg.is_from_portal ? 'items-start' : 'items-end'}`}
                    >
                      <div className={`flex items-center gap-2 text-[10px] mb-1 px-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                        {(msg.sender_name === 'KnK Sales Concierge' || msg.sender_name === 'KnK Auto Bot') && (
                          <span className="px-1.5 py-0.5 rounded bg-[#c9a84c]/20 text-[#c9a84c] border border-[#c9a84c]/40 text-[9px] font-mono font-bold flex items-center gap-1">
                            <Sparkles size={10} className="animate-pulse" /> AI Agent
                          </span>
                        )}
                        <span className={`font-bold ${isLight ? 'text-slate-900' : 'text-slate-300'}`}>{msg.sender_name ? msg.sender_name.replace(/\s*\(.*\)$/, '') : (isClient ? 'Client' : 'Agent')}</span>
                        <span>•</span>
                        <span className="font-mono">{formattedTime}</span>
                      </div>

                      <div className={`p-3.5 rounded-2xl max-w-lg text-xs leading-relaxed ${
                        msg.is_from_portal
                          ? isLight
                            ? 'bg-slate-100 border border-slate-300 text-slate-900 rounded-tl-none font-medium shadow-sm'
                            : 'bg-slate-900 border border-white/10 text-slate-200 rounded-tl-none'
                          : isLight
                            ? 'bg-amber-100/90 border border-amber-300 text-amber-950 rounded-tr-none font-medium shadow-sm'
                            : 'bg-[#c9a84c]/20 border border-[#c9a84c]/40 text-slate-100 rounded-tr-none'
                      }`}>
                        {/* Conversation Mode Thread Reply Quote */}
                        {precedingClientMsg && (
                          <div className={`mb-2.5 px-2.5 py-1.5 rounded-xl border-l-2 text-[11px] font-sans italic flex items-center gap-1.5 ${
                            isLight
                              ? 'bg-slate-200/70 border-[#c9a84c] text-slate-800'
                              : 'bg-black/40 border-[#c9a84c] text-slate-300'
                          }`}>
                            <CornerDownRight size={12} className="text-[#c9a84c] shrink-0" />
                            <span className="truncate">
                              <strong className="not-italic text-[#c9a84c] font-semibold">{precedingClientMsg.sender_name?.replace(/\s*\(.*\)$/, '') || 'Client'}:</strong> "{precedingClientMsg.content || precedingClientMsg.message_text}"
                            </span>
                          </div>
                        )}

                        {/* Inline Image Attachment */}
                        {msg.attachment_url && msg.attachment_type === 'image' && (
                          <div className="mb-2">
                            <img
                              src={msg.attachment_url}
                              alt={msg.attachment_name || 'Attached Photo'}
                              className="max-w-full max-h-56 rounded-xl border border-slate-300 dark:border-white/20 object-cover cursor-pointer hover:opacity-90 transition-all"
                              onClick={() => window.open(msg.attachment_url, '_blank')}
                            />
                          </div>
                        )}

                        {/* Document Attachment Card */}
                        {msg.attachment_name && msg.attachment_type !== 'image' && (
                          <div className="mb-2">
                            <a
                              href={msg.attachment_url || '#'}
                              download={msg.attachment_name}
                              className={`flex items-center gap-2 p-2.5 rounded-lg border font-mono text-xs transition-all ${
                                isLight
                                  ? 'bg-white border-slate-300 text-slate-900 hover:bg-slate-50'
                                  : 'bg-black/40 border-white/20 text-slate-100 hover:bg-black/60'
                              }`}
                            >
                              <FileText size={16} className="text-[#c9a84c] shrink-0" />
                              <span className="truncate max-w-[200px] font-bold">{msg.attachment_name}</span>
                            </a>
                          </div>
                        )}

                        {(msg.content || msg.message_text) && (
                          <div className="whitespace-pre-line">
                            {(msg.content || msg.message_text).replace(/\[WIDGET:([A-Z_]+)\|(.*?)\]/g, '').trim()}
                            {(msg.content || msg.message_text).includes('[WIDGET:FINANCING') && (
                              <div className="mt-2 text-[10px] font-mono text-[#c9a84c] bg-[#c9a84c]/10 border border-[#c9a84c]/30 rounded px-2 py-1 flex items-center gap-1">
                                ⚡ Client interactive Bank Asset Financing Calculator rendered
                              </div>
                            )}
                            {(msg.content || msg.message_text).includes('[WIDGET:CAR_CARD') && (
                              <div className="mt-2 text-[10px] font-mono text-amber-400 bg-amber-500/10 border border-amber-500/30 rounded px-2 py-1 flex items-center gap-1">
                                🚗 Client interactive Vehicle Specification Card rendered
                              </div>
                            )}
                            {(msg.content || msg.message_text).includes('[WIDGET:BOOKING') && (
                              <div className="mt-2 text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 rounded px-2 py-1 flex items-center gap-1">
                                📅 Client interactive Test Drive Appointment Booking Widget rendered
                              </div>
                            )}
                            {(msg.content || msg.message_text).includes('[WIDGET:PDF_QUOTE') && (
                              <div className="mt-2 text-[10px] font-mono text-sky-400 bg-sky-500/10 border border-sky-500/30 rounded px-2 py-1 flex items-center gap-1">
                                📄 Formal PDF Quotation generated and dispatched via Email & WhatsApp
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })
              })()}
            </div>

            {/* Agent Reply Box */}
            <form onSubmit={handleSendReply} className={`pt-4 border-t flex flex-col gap-3 ${isLight ? 'border-slate-200' : 'border-white/10'}`}>
              {attachment && (
                <div className={`flex items-center justify-between p-2.5 rounded-xl border text-xs font-bold ${
                  isLight ? 'bg-amber-50 border-amber-300 text-amber-900' : 'bg-slate-900 border-white/10 text-[#c9a84c]'
                }`}>
                  <span className="flex items-center gap-1.5"><Paperclip size={14} /> {attachment.name}</span>
                  <button type="button" onClick={() => setAttachment(null)} className="text-slate-400 hover:text-slate-700">Remove</button>
                </div>
              )}

              <div className="flex items-center gap-2">
                <label className={`p-2.5 rounded-xl border cursor-pointer transition-all ${
                  isLight ? 'bg-slate-100 border-slate-300 text-slate-600 hover:text-amber-800 hover:bg-slate-200' : 'bg-slate-900 border-white/10 text-slate-400 hover:text-[#c9a84c]'
                }`}>
                  <Paperclip size={16} />
                  <input type="file" accept="image/*,.pdf,.doc,.docx,.xlsx,.txt" onChange={handleFileUpload} className="hidden" />
                </label>

                <input
                  type="text"
                  placeholder="Type agent reply message..."
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                  className={`flex-1 border rounded-xl px-4 py-2.5 text-xs outline-none transition-all ${
                    isLight
                      ? 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-amber-500 focus:bg-white font-medium'
                      : 'bg-slate-950 border-white/10 text-slate-200 placeholder-slate-500 focus:border-[#c9a84c]'
                  }`}
                />

                <button
                  type="submit"
                  disabled={!replyText.trim() && !attachment}
                  className="px-4 py-2.5 bg-[#c9a84c] text-slate-950 font-bold rounded-xl text-xs uppercase hover:bg-[#d9b85c] disabled:opacity-40 flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
                >
                  <Send size={14} />
                  <span>Reply</span>
                </button>
              </div>
            </form>
          </div>
        ) : null}
      </div>
    </div>
  )
}

