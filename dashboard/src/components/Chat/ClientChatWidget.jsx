import React, { useState, useEffect, useRef } from 'react'
import { useCRMStore } from '../../context/CRMStore'
import { getClientTelemetry } from '../../lib/telemetry'
import { sortChatMessages, formatChatTime } from '../../utils/chatUtils'
import {
  MessageSquare, X, Send, Sparkles, User, ShieldCheck, Paperclip, FileText,
  Download, Image as ImageIcon, Phone, Mail, CheckCircle2, ArrowRight, CornerDownRight,
  Calculator, Calendar, Building2, Check, Sun, Moon
} from 'lucide-react'

function InteractiveFinancingCard({ car, price, onSelectAction }) {
  const [depositPct, setDepositPct] = useState(20)
  const [months, setMonths] = useState(48)

  const numPrice = Number(price) || 8500000
  const depositVal = Math.round(numPrice * (depositPct / 100))
  const loanAmount = numPrice - depositVal
  const annualRate = 0.13
  const r = annualRate / 12
  const monthlyRepayment = Math.round((loanAmount * (r * Math.pow(1 + r, months))) / (Math.pow(1 + r, months) - 1))

  return (
    <div className="mt-2.5 p-3 rounded-xl bg-black/70 border border-[#c9a84c]/50 text-slate-100 font-sans shadow-lg">
      <div className="flex items-center gap-1.5 mb-2 pb-1.5 border-b border-white/10 text-xs font-bold text-[#c9a84c]">
        <Calculator size={14} />
        <span>Bank Asset Financing Calculator</span>
        <span className="ml-auto text-[9px] px-1.5 py-0.5 rounded bg-[#c9a84c]/20 text-[#c9a84c]">80% Max</span>
      </div>

      <div className="text-[11px] font-semibold text-slate-200 mb-0.5">{car || 'Toyota Land Cruiser Prado'}</div>
      <div className="text-[10px] text-slate-400 mb-2.5">Vehicle Price: <strong className="text-white font-mono">KES {numPrice.toLocaleString()}</strong></div>

      {/* Deposit Slider */}
      <div className="mb-2.5">
        <div className="flex justify-between text-[10px] text-slate-300 mb-1 font-mono">
          <span>Deposit ({depositPct}%):</span>
          <span className="text-[#c9a84c] font-bold">KES {depositVal.toLocaleString()}</span>
        </div>
        <input
          type="range"
          min="10"
          max="50"
          step="5"
          value={depositPct}
          onChange={(e) => setDepositPct(Number(e.target.value))}
          className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#c9a84c]"
        />
      </div>

      {/* Loan Tenure Selector */}
      <div className="mb-2.5">
        <div className="text-[10px] text-slate-400 mb-1 font-mono">Repayment Tenure:</div>
        <div className="grid grid-cols-4 gap-1">
          {[12, 24, 36, 48, 60].map(m => (
            <button
              key={m}
              type="button"
              onClick={() => setMonths(m)}
              className={`py-1 rounded text-[10px] font-mono font-bold transition-all ${
                months === m
                  ? 'bg-[#c9a84c] text-black shadow-sm'
                  : 'bg-slate-900 border border-slate-800 text-slate-300 hover:border-slate-600'
              }`}
            >
              {m} Mo
            </button>
          ))}
        </div>
      </div>

      {/* Result Monthly Payment */}
      <div className="p-2 rounded-lg bg-[#c9a84c]/10 border border-[#c9a84c]/30 flex items-center justify-between mb-2.5">
        <div>
          <div className="text-[9px] uppercase tracking-wider font-mono text-slate-400">Est. Monthly Repayment</div>
          <div className="text-xs font-bold font-mono text-[#c9a84c]">KES {monthlyRepayment.toLocaleString()} <span className="text-[9px] text-slate-400 font-normal">/mo</span></div>
        </div>
        <div className="text-right text-[8px] font-mono text-slate-400">
          <div>NCBA · KCB</div>
          <div>Stanbic</div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => onSelectAction && onSelectAction(`I would like to apply for bank asset financing for ${car || 'this vehicle'} with KES ${depositVal.toLocaleString()} deposit.`)}
        className="w-full py-1.5 rounded-lg bg-gradient-to-r from-[#c9a84c] to-[#b39137] text-black font-bold text-[10px] hover:brightness-110 transition-all flex items-center justify-center gap-1.5 shadow-md"
      >
        <span>Apply for Asset Financing</span>
        <ArrowRight size={12} />
      </button>
    </div>
  )
}

function InteractiveCarCard({ title, price, year, engine, transmission, location, onSelectAction }) {
  const numPrice = Number(price) || 8500000
  return (
    <div className="mt-2.5 p-3 rounded-xl bg-black/70 border border-slate-700 text-slate-100 font-sans shadow-lg">
      <div className="flex items-center gap-1.5 mb-1.5">
        <span className="px-1.5 py-0.5 rounded bg-[#c9a84c]/20 text-[#c9a84c] border border-[#c9a84c]/40 text-[9px] font-mono font-bold">
          Ready Stock
        </span>
        <span className="text-[9px] text-slate-400 ml-auto flex items-center gap-1 font-mono">
          <Building2 size={10} className="text-[#c9a84c]" /> {location || 'Kilimani HQ Nairobi'}
        </span>
      </div>

      <div className="text-[11px] font-bold text-white mb-0.5">{title || 'Toyota Land Cruiser Prado TX-L'} ({year || '2020'})</div>
      <div className="text-xs font-extrabold text-[#c9a84c] font-mono mb-2">KES {numPrice.toLocaleString()}</div>

      <div className="grid grid-cols-2 gap-1 mb-2.5 text-[9px] font-mono text-slate-300">
        <div className="p-1 rounded bg-slate-900 border border-slate-800">Engine: <strong>{engine || '2.8L Diesel'}</strong></div>
        <div className="p-1 rounded bg-slate-900 border border-slate-800">Trans: <strong>{transmission || 'Automatic'}</strong></div>
      </div>

      <div className="grid grid-cols-2 gap-1.5">
        <button
          type="button"
          onClick={() => onSelectAction && onSelectAction(`Please calculate bank asset financing for ${title}`)}
          className="py-1 px-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 font-semibold text-[9px] hover:border-[#c9a84c] transition-all flex items-center justify-center gap-1"
        >
          <Calculator size={10} className="text-[#c9a84c]" />
          <span>Financing</span>
        </button>
        <button
          type="button"
          onClick={() => onSelectAction && onSelectAction(`I would like to book a test drive for ${title}`)}
          className="py-1 px-1.5 rounded-lg bg-[#c9a84c] text-black font-bold text-[9px] hover:brightness-110 transition-all flex items-center justify-center gap-1 shadow-sm"
        >
          <Calendar size={10} />
          <span>Book Viewing</span>
        </button>
      </div>
    </div>
  )
}

function InteractiveBookingCard({ car, onSelectAction }) {
  const [selectedBranch, setSelectedBranch] = useState('Nairobi HQ (Kilimani)')
  const [selectedSlot, setSelectedSlot] = useState('Tomorrow 10:00 AM')
  const [booked, setBooked] = useState(false)

  const slots = ['Tomorrow 10:00 AM', 'Tomorrow 2:30 PM', 'Tomorrow 4:30 PM']

  const handleConfirm = () => {
    setBooked(true)
    if (onSelectAction) {
      onSelectAction(`I would like to confirm a test drive for ${car || 'vehicle'} at ${selectedBranch} on ${selectedSlot}.`)
    }
  }

  return (
    <div className="mt-2.5 p-3 rounded-xl bg-black/70 border border-[#c9a84c]/50 text-slate-100 font-sans shadow-lg">
      <div className="flex items-center gap-1.5 mb-2 pb-1.5 border-b border-white/10 text-xs font-bold text-[#c9a84c]">
        <Calendar size={14} />
        <span>Schedule Test Drive & Viewing</span>
      </div>

      <div className="text-[11px] font-semibold text-slate-200 mb-2">{car || 'KnK Luxury Ready Stock'}</div>

      {!booked ? (
        <>
          {/* Branch Selector */}
          <div className="mb-2">
            <div className="text-[9px] font-mono text-slate-400 mb-1">Showroom Location:</div>
            <div className="grid grid-cols-2 gap-1">
              {['Nairobi HQ (Kilimani)', 'Mombasa (Nyali)'].map(b => (
                <button
                  key={b}
                  type="button"
                  onClick={() => setSelectedBranch(b)}
                  className={`py-1 px-1 rounded text-[9px] font-mono text-center transition-all ${
                    selectedBranch.includes(b.split(' ')[0])
                      ? 'bg-[#c9a84c]/20 border border-[#c9a84c] text-[#c9a84c] font-bold'
                      : 'bg-slate-900 border border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          {/* Time Slot Picker */}
          <div className="mb-2.5">
            <div className="text-[9px] font-mono text-slate-400 mb-1">Preferred Time Slot:</div>
            <div className="flex flex-col gap-1">
              {slots.map(s => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSelectedSlot(s)}
                  className={`py-1 px-2 rounded text-[9px] font-mono text-left transition-all flex items-center justify-between ${
                    selectedSlot === s
                      ? 'bg-[#c9a84c] text-black font-bold shadow-sm'
                      : 'bg-slate-900 border border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <span>{s}</span>
                  {selectedSlot === s && <Check size={10} />}
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={handleConfirm}
            className="w-full py-1.5 rounded-lg bg-gradient-to-r from-[#c9a84c] to-[#b39137] text-black font-bold text-[10px] hover:brightness-110 transition-all flex items-center justify-center gap-1.5 shadow-md"
          >
            <span>Confirm Viewing Appointment</span>
            <ArrowRight size={12} />
          </button>
        </>
      ) : (
        <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-center font-mono text-[10px]">
          ✓ Reserved for {selectedSlot} at {selectedBranch}!
        </div>
      )}
    </div>
  )
}

function InteractivePdfQuoteCard({ quoteId, car, price, pdfUrl, whatsappUrl }) {
  const fullPdfUrl = pdfUrl ? (pdfUrl.startsWith('http') ? pdfUrl : `http://localhost:3001${pdfUrl}`) : '#'
  const fullWaUrl = whatsappUrl ? decodeURIComponent(whatsappUrl) : '#'

  return (
    <div className="mt-2.5 p-3 rounded-xl bg-gradient-to-r from-slate-900 to-black border border-[#c9a84c] text-slate-100 font-sans shadow-xl">
      <div className="flex items-center gap-1.5 mb-2 pb-1.5 border-b border-white/10 text-xs font-bold text-[#c9a84c]">
        <FileText size={14} />
        <span>Official Formal PDF Quotation</span>
        <span className="ml-auto text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#c9a84c]/20 text-[#c9a84c] border border-[#c9a84c]/30">{quoteId || 'QT-READY'}</span>
      </div>

      <div className="text-[11px] font-bold text-white mb-0.5">{car || 'Toyota Land Cruiser Prado'}</div>
      <div className="text-xs font-mono font-extrabold text-[#c9a84c] mb-2.5">
        KES {price ? Number(price).toLocaleString() : '8,500,000'}
      </div>

      <div className="grid grid-cols-2 gap-1.5">
        <a
          href={fullPdfUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="py-1.5 px-2 rounded-lg bg-gradient-to-r from-[#c9a84c] to-[#b39137] text-black font-bold text-[10px] hover:brightness-110 transition-all flex items-center justify-center gap-1 shadow-sm no-underline"
        >
          <Download size={12} />
          <span>Download PDF</span>
        </a>
        <a
          href={fullWaUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="py-1.5 px-2 rounded-lg bg-emerald-600 border border-emerald-500 text-white font-bold text-[10px] hover:bg-emerald-500 transition-all flex items-center justify-center gap-1 shadow-sm no-underline"
        >
          <Send size={10} />
          <span>WhatsApp PDF</span>
        </a>
      </div>
    </div>
  )
}

export default function ClientChatWidget() {
  const [isOpen, setIsOpen] = useState(false)

  // Client Modal Theme Switch State with localStorage persistence
  const [modalTheme, setModalTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('knk_client_modal_theme') || 'dark'
    }
    return 'dark'
  })
  const isLight = modalTheme === 'light'

  const toggleModalTheme = () => {
    const next = isLight ? 'dark' : 'light'
    setModalTheme(next)
    if (typeof window !== 'undefined') {
      try { localStorage.setItem('knk_client_modal_theme', next) } catch { /* ignore */ }
    }
  }

  // Visitor contact info state initialized lazily from localStorage
  const [visitorData] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('knk_chat_visitor_lead')
        if (saved) {
          const parsed = JSON.parse(saved)
          if (parsed.name && parsed.phone) return parsed
        }
      } catch { /* ignore */ }
    }
    return null
  })

  const [visitorName, setVisitorName] = useState(visitorData?.name || '')
  const [visitorPhone, setVisitorPhone] = useState(visitorData?.phone || '')
  const [visitorEmail, setVisitorEmail] = useState(visitorData?.email || '')
  const [isLeadSaved, setIsLeadSaved] = useState(!!(visitorData?.name && visitorData?.phone))
  const [formError, setFormError] = useState('')
  const [inputText, setInputText] = useState('')
  const [attachment, setAttachment] = useState(null)

  // Visitor thread ID initializer (unique per device/session)
  const [visitorThreadId] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        let storedId = localStorage.getItem('knk_visitor_thread_id')
        if (!storedId) {
          storedId = `th-live-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`
          localStorage.setItem('knk_visitor_thread_id', storedId)
        }
        return storedId
      } catch { /* ignore */ }
    }
    return `th-live-${Date.now().toString(36)}`
  })

  const nexusThreads = useCRMStore(state => state.nexusThreads)
  const syncSupportThreads = useCRMStore(state => state.syncSupportThreads)
  const sendClientChatMessage = useCRMStore(state => state.sendClientChatMessage)
  const addLead = useCRMStore(state => state.addLead)
  const saveChatLead = useCRMStore(state => state.saveChatLead)

  const cleanVisitorPhone = visitorPhone ? visitorPhone.replace(/\D/g, '') : ''
  const cleanVisitorEmail = visitorEmail ? visitorEmail.trim().toLowerCase() : ''

  // Isolate client thread specifically for current visitor (NO fallbacks to shared th-live-client)
  const clientThread = nexusThreads.find(t => {
    if (!t) return false

    // 1. Direct thread ID match (matches current visitor's stored thread ID)
    if (visitorThreadId && t.id === visitorThreadId) return true

    // 2. Contact phone match (matches thread by customer_phone or phone digits in customer_name)
    if (cleanVisitorPhone && cleanVisitorPhone.length >= 6) {
      const threadPhoneDigits = (t.customer_phone || t.customer_name || '').replace(/\D/g, '')
      if (threadPhoneDigits.length >= 6 && (threadPhoneDigits.includes(cleanVisitorPhone) || cleanVisitorPhone.includes(threadPhoneDigits))) {
        return true
      }
    }

    // 3. Contact email match (matches thread by customer_email or email in customer_name)
    if (cleanVisitorEmail && cleanVisitorEmail.includes('@')) {
      const threadEmail = (t.customer_email || t.customer_name || '').toLowerCase()
      if (threadEmail.includes(cleanVisitorEmail)) {
        return true
      }
    }

    return false
  })
  const rawMessages = clientThread ? clientThread.messages : []
  const messages = sortChatMessages(rawMessages)

  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  // Active 3-second live chat polling daemon for instant sub-3s response delivery across devices
  useEffect(() => {
    syncSupportThreads()
    const interval = setInterval(() => {
      syncSupportThreads()
    }, 3000)

    return () => clearInterval(interval)
  }, [syncSupportThreads])

  // Multi-tab BroadcastChannel listener for client widget
  useEffect(() => {
    if (typeof window === 'undefined' || !('BroadcastChannel' in window)) return

    const bc = new BroadcastChannel('knk_live_chat_channel')
    bc.onmessage = (event) => {
      if (event.data && event.data.type === 'SYNC_THREADS') {
        useCRMStore.setState({ nexusThreads: event.data.nexusThreads })
      }
    }

    return () => bc.close()
  }, [])

  useEffect(() => {
    if (isOpen && isLeadSaved) {
      scrollToBottom()
    }
  }, [messages.length, isOpen, isLeadSaved])

  const handleLeadSubmit = (e) => {
    e.preventDefault()
    setFormError('')

    const cleanName = visitorName.trim()
    const cleanPhone = visitorPhone.trim()
    const cleanEmail = visitorEmail.trim()

    if (!cleanName) {
      setFormError('Please enter your full name.')
      return
    }
    if (!cleanPhone || cleanPhone.length < 7) {
      setFormError('Please enter a valid phone number.')
      return
    }

    // Save lead to localStorage and database via saveChatLead action
    const telemetryData = getClientTelemetry()
    const visitorDataObj = {
      name: cleanName,
      phone: cleanPhone,
      email: cleanEmail,
      ...telemetryData
    }
    if (saveChatLead) {
      saveChatLead(visitorDataObj)
    } else if (typeof window !== 'undefined') {
      localStorage.setItem('knk_chat_visitor_lead', JSON.stringify(visitorDataObj))
    }

    // Trigger CRM Lead capture
    try {
      addLead({
        name: cleanName,
        phone: cleanPhone,
        email: cleanEmail || `${cleanName.toLowerCase().replace(/\s+/g, '.')}@chatlead.knk`,
        source: 'Live Support Chat',
        notes: `Captured via Live Chat Widget. Phone: ${cleanPhone}`,
        status: 'new',
        conversion_probability: 70,
        intent_score: 75,
        intent_tier: 'HIGH'
      })
    } catch (err) {
      console.error('Lead auto-registration failed:', err)
    }

    setIsLeadSaved(true)
  }

  const handleFileSelect = (e) => {
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

  const handleSend = (e) => {
    e.preventDefault()
    if (!inputText.trim() && !attachment) return

    const displayName = visitorPhone ? `${visitorName} (${visitorPhone})` : visitorName
    sendClientChatMessage(displayName || 'Website Visitor', inputText.trim(), attachment, visitorThreadId, getClientTelemetry())
    setInputText('')
    setAttachment(null)
  }

  const dispatchUserMessage = (text) => {
    if (!text) return
    const displayName = visitorPhone ? `${visitorName} (${visitorPhone})` : visitorName
    sendClientChatMessage(displayName || 'Website Visitor', text, null, visitorThreadId, getClientTelemetry())
  }

  const renderMessageContentWithWidgets = (rawText) => {
    if (!rawText) return null

    let widgetType = null
    let widgetParams = {}
    let textBody = rawText

    const widgetMatch = rawText.match(/\[WIDGET:([A-Z_]+)\|(.*?)\]/)
    if (widgetMatch) {
      widgetType = widgetMatch[1]
      textBody = rawText.replace(widgetMatch[0], '').trim()

      widgetMatch[2].split('|').forEach(pair => {
        const parts = pair.split('=')
        if (parts.length >= 2) {
          widgetParams[parts[0].trim()] = parts.slice(1).join('=').trim()
        }
      })
    }

    return (
      <>
        {textBody && (
          <div className="whitespace-pre-line">
            {textBody.split(/(\*\*.*?\*\*)/g).map((part, i) => {
              if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={i} className="font-bold text-[#c9a84c]">{part.slice(2, -2)}</strong>
              }
              return part
            })}
          </div>
        )}

        {widgetType === 'FINANCING' && (
          <InteractiveFinancingCard
            car={widgetParams.car}
            price={widgetParams.price}
            onSelectAction={dispatchUserMessage}
          />
        )}

        {widgetType === 'CAR_CARD' && (
          <InteractiveCarCard
            title={widgetParams.title}
            price={widgetParams.price}
            year={widgetParams.year}
            engine={widgetParams.engine}
            transmission={widgetParams.transmission}
            location={widgetParams.location}
            onSelectAction={dispatchUserMessage}
          />
        )}

        {widgetType === 'BOOKING' && (
          <InteractiveBookingCard
            car={widgetParams.car}
            onSelectAction={dispatchUserMessage}
          />
        )}

        {widgetType === 'PDF_QUOTE' && (
          <InteractivePdfQuoteCard
            quoteId={widgetParams.quoteId}
            car={widgetParams.car}
            price={widgetParams.price}
            pdfUrl={widgetParams.pdfUrl}
            whatsappUrl={widgetParams.whatsappUrl}
          />
        )}
      </>
    )
  }

  return (
    <>
      {/* Floating Chat Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 p-4 rounded-full bg-gradient-to-r from-[#c9a84c] to-[#e6c76e] text-black font-bold shadow-[0_10px_30px_rgba(201,168,76,0.5)] hover:scale-110 transition-all flex items-center gap-2.5 group"
          title="Chat with Support"
        >
          <div className="relative">
            <MessageSquare size={22} className="text-black" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-black animate-pulse" />
          </div>
          <span className="hidden sm:inline text-xs font-semibold uppercase tracking-wider pr-1">
            Live Support
          </span>
        </button>
      )}

      {/* Floating Chat Popup Window */}
      {isOpen && (
        <div className={`fixed bottom-6 right-6 z-50 w-80 sm:w-96 h-[520px] border rounded-2xl shadow-2xl flex flex-col overflow-hidden font-sans backdrop-blur-2xl animate-slide-in transition-colors duration-300 ${
          isLight
            ? 'bg-white border-slate-300 text-slate-900 shadow-slate-400/40'
            : 'bg-[#090d16] border-[#c9a84c]/50 text-white shadow-[0_25px_60px_rgba(0,0,0,0.9)]'
        }`}>
          
          {/* Header */}
          <div className={`p-4 border-b flex items-center justify-between transition-colors ${
            isLight ? 'bg-slate-100 border-slate-200' : 'bg-gradient-to-r from-[#0b101d] via-slate-900 to-[#0b101d] border-[#c9a84c]/30'
          }`}>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-[#c9a84c]/20 border border-[#c9a84c]/40 text-[#c9a84c]">
                <Sparkles size={18} />
              </div>
              <div>
                <h4 className={`text-sm font-semibold font-serif ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>KnK Live Support</h4>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className={`text-[10px] uppercase tracking-widest ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Agent Online</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={toggleModalTheme}
                className={`p-1.5 rounded-lg border text-xs flex items-center gap-1 transition-all ${
                  isLight
                    ? 'bg-slate-200 border-slate-300 text-slate-800 hover:bg-slate-300'
                    : 'bg-white/10 border-white/10 text-amber-400 hover:bg-white/20'
                }`}
                title={isLight ? 'Switch Chat to Dark Theme' : 'Switch Chat to Light Theme'}
              >
                {isLight ? <Moon size={14} className="text-indigo-600" /> : <Sun size={14} className="text-amber-400" />}
              </button>

              <button
                onClick={() => setIsOpen(false)}
                className={`p-1.5 rounded-lg transition-all ${
                  isLight ? 'text-slate-500 hover:text-slate-900 hover:bg-slate-200' : 'text-slate-400 hover:text-slate-100 hover:bg-white/10'
                }`}
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Mandatory Lead Collection Screen */}
          {!isLeadSaved ? (
            <div className="flex-1 p-5 flex flex-col justify-between bg-[#040711] overflow-y-auto crm-scroll">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#c9a84c]/15 border border-[#c9a84c]/40 text-[#c9a84c] flex items-center justify-center mx-auto mb-3 shadow-lg">
                  <ShieldCheck size={24} />
                </div>
                <h5 className="text-center text-base font-semibold text-slate-100 font-serif">Start Live Chat</h5>
                <p className="text-center text-xs text-slate-400 mt-1 mb-5">
                  Please provide your name & phone number to connect with a sales representative.
                </p>

                {formError && (
                  <div className="mb-4 p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs text-center font-medium">
                    {formError}
                  </div>
                )}

                <form onSubmit={handleLeadSubmit} className="space-y-3.5">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-300 uppercase tracking-wider mb-1.5">
                      Your Name <span className="text-[#c9a84c]">*</span>
                    </label>
                    <div className="relative">
                      <User size={15} className="absolute left-3.5 top-3 text-slate-400" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. John Mwangi"
                        value={visitorName}
                        onChange={e => setVisitorName(e.target.value)}
                        className="w-full bg-slate-950 border border-white/15 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 outline-none focus:border-[#c9a84c] transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-300 uppercase tracking-wider mb-1.5">
                      Phone Number <span className="text-[#c9a84c]">*</span>
                    </label>
                    <div className="relative">
                      <Phone size={15} className="absolute left-3.5 top-3 text-slate-400" />
                      <input
                        type="tel"
                        required
                        placeholder="e.g. +254 712 345 678"
                        value={visitorPhone}
                        onChange={e => setVisitorPhone(e.target.value)}
                        className="w-full bg-slate-950 border border-white/15 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 outline-none focus:border-[#c9a84c] transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-1.5">
                      Email Address <span className="text-slate-500">(Optional)</span>
                    </label>
                    <div className="relative">
                      <Mail size={15} className="absolute left-3.5 top-3 text-slate-400" />
                      <input
                        type="email"
                        placeholder="e.g. john@company.co.ke"
                        value={visitorEmail}
                        onChange={e => setVisitorEmail(e.target.value)}
                        className="w-full bg-slate-950 border border-white/15 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 outline-none focus:border-[#c9a84c] transition-all"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-[#c9a84c] to-[#e6c76e] text-black font-semibold text-xs tracking-wider uppercase shadow-md hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Start Conversation</span>
                    <ArrowRight size={15} />
                  </button>
                </form>
              </div>

              <div className="mt-4 pt-3 border-t border-white/5 text-center">
                <p className="text-[10px] text-slate-500">Your information is protected under KnK privacy standards.</p>
              </div>
            </div>
          ) : (
            /* Active Live Chat View */
            <>
              {/* Active Lead Visitor Sub-bar */}
              <div className="px-4 py-2 bg-slate-950/90 border-b border-white/10 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-slate-300 font-medium truncate">
                  <User size={13} className="text-[#c9a84c] shrink-0" />
                  <span className="truncate">{visitorName}</span>
                  <span className="text-slate-500">•</span>
                  <span className="text-[11px] text-slate-400 font-mono">{visitorPhone}</span>
                </div>
                <button
                  onClick={() => setIsLeadSaved(false)}
                  className="text-[10px] text-[#c9a84c] hover:underline shrink-0 ml-2"
                  title="Change contact details"
                >
                  Edit
                </button>
              </div>

              {/* Messages Feed */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3.5 crm-scroll bg-[#040711]">
                
                {/* Welcome banner if empty */}
                {messages.length === 0 && (
                  <div className="text-center py-6 px-4">
                    <div className="w-10 h-10 rounded-full bg-[#c9a84c]/10 border border-[#c9a84c]/30 text-[#c9a84c] flex items-center justify-center mx-auto mb-2">
                      <ShieldCheck size={20} />
                    </div>
                    <h5 className="text-xs font-semibold text-slate-200 font-serif">Connected as {visitorName}</h5>
                    <p className="text-[11px] text-slate-400 mt-1">Ask us anything about vehicle quotes, imports, or share files/photos!</p>
                  </div>
                )}

                {messages.map((m, index) => {
                  const isClient = m.is_from_portal
                  const isAI = !isClient && (
                    (m.sender_name || '').includes('Concierge') ||
                    (m.sender_name || '').includes('Bot') ||
                    (m.sender_name || '').includes('AI')
                  )

                  // Find the specific preceding client question this AI/Agent message is responding to
                  const precedingClientMsg = !isClient
                    ? messages.slice(0, index).reverse().find(prev => prev.is_from_portal && !(prev.id || '').includes('m-auto'))
                    : null

                  const formattedTime = formatChatTime(m.created_at)

                  return (
                    <div
                      key={m.id}
                      className={`flex flex-col ${isClient ? 'items-end' : 'items-start'}`}
                    >
                      <div className="flex items-center gap-1.5 mb-1 text-[9px] font-mono text-slate-400">
                        {isAI && (
                          <span className="px-1.5 py-0.5 rounded bg-[#c9a84c]/20 text-[#c9a84c] border border-[#c9a84c]/40 text-[9px] font-mono font-bold flex items-center gap-1">
                            <Sparkles size={10} className="animate-pulse" /> AI Sales Concierge
                          </span>
                        )}
                        <span className="font-semibold text-slate-300">{m.sender_name ? m.sender_name.replace(/\s*\(.*\)$/, '') : (isClient ? 'You' : 'Agent')}</span>
                        <span>•</span>
                        <span className="text-[9px] font-mono text-slate-400">{formattedTime}</span>
                      </div>

                      <div
                        className={`max-w-[88%] px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed ${
                          isClient
                            ? 'bg-gradient-to-r from-[#c9a84c] to-[#b39137] text-black font-medium rounded-tr-none shadow-md'
                            : isAI
                              ? 'bg-slate-900 border border-[#c9a84c]/40 text-slate-100 rounded-tl-none shadow-md'
                              : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none shadow-sm'
                        }`}
                      >
                        {/* Conversation Mode Thread Reply Context Quote */}
                        {precedingClientMsg && (
                          <div className="mb-2 px-2.5 py-1.5 rounded-xl bg-black/50 border-l-2 border-[#c9a84c] text-[11px] text-slate-300 font-sans italic flex items-center gap-1.5 shadow-inner">
                            <CornerDownRight size={12} className="text-[#c9a84c] shrink-0" />
                            <span className="truncate">
                              <strong className="not-italic text-[#c9a84c] font-semibold">{precedingClientMsg.sender_name?.replace(/\s*\(.*\)$/, '') || 'Client'}:</strong> "{precedingClientMsg.content || precedingClientMsg.message_text}"
                            </span>
                          </div>
                        )}

                        {/* Render Image Attachment */}
                        {m.attachment_url && m.attachment_type === 'image' && (
                          <div className="mb-2">
                            <img
                              src={m.attachment_url}
                              alt={m.attachment_name || 'Attached Image'}
                              className="max-w-full max-h-48 rounded-xl border border-white/20 object-cover cursor-pointer hover:opacity-90 transition-all"
                              onClick={() => window.open(m.attachment_url, '_blank')}
                            />
                          </div>
                        )}

                        {/* Render Document Attachment */}
                        {m.attachment_name && m.attachment_type !== 'image' && (
                          <div className="mb-2">
                            <a
                              href={m.attachment_url || '#'}
                              download={m.attachment_name}
                              className="flex items-center gap-2 p-2 rounded-lg bg-black/30 border border-white/20 text-slate-100 hover:bg-black/50 transition-all font-mono text-[11px]"
                            >
                              <FileText size={16} className="text-[#c9a84c] shrink-0" />
                              <span className="truncate max-w-[160px]">{m.attachment_name}</span>
                              <Download size={14} className="ml-auto text-slate-400 shrink-0" />
                            </a>
                          </div>
                        )}

                        {renderMessageContentWithWidgets(m.content || m.message_text)}
                      </div>
                    </div>
                  )
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Attachment Selected Badge */}
              {attachment && (
                <div className="px-4 py-1.5 bg-[#c9a84c]/15 border-t border-[#c9a84c]/40 flex items-center justify-between text-xs text-[#c9a84c]">
                  <div className="flex items-center gap-1.5 truncate">
                    {attachment.type === 'image' ? <ImageIcon size={14} /> : <FileText size={14} />}
                    <span className="truncate max-w-[200px] text-[11px] font-mono">{attachment.name}</span>
                  </div>
                  <button onClick={() => setAttachment(null)} className="text-slate-400 hover:text-white">
                    <X size={14} />
                  </button>
                </div>
              )}

              {/* Chat Input Bar */}
              <form onSubmit={handleSend} className="p-3 bg-[#080d1a] border-t border-[#c9a84c]/30 flex items-center gap-2">
                <label className="p-2 rounded-xl bg-slate-900 border border-white/10 text-slate-400 hover:text-[#c9a84c] hover:border-[#c9a84c]/50 cursor-pointer transition-all">
                  <Paperclip size={16} />
                  <input
                    type="file"
                    accept="image/*,.pdf,.doc,.docx,.xlsx,.txt"
                    className="hidden"
                    onChange={handleFileSelect}
                  />
                </label>

                <input
                  type="text"
                  placeholder="Type message or attach photo/doc..."
                  value={inputText}
                  onChange={e => setInputText(e.target.value)}
                  className="flex-1 bg-slate-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 placeholder-slate-500 outline-none focus:border-[#c9a84c]"
                />

                <button
                  type="submit"
                  disabled={!inputText.trim() && !attachment}
                  className="p-2.5 rounded-xl bg-[#c9a84c] text-black hover:bg-[#d9b85c] disabled:opacity-40 transition-all cursor-pointer"
                >
                  <Send size={16} />
                </button>
              </form>
            </>
          )}

        </div>
      )}
    </>
  )
}


