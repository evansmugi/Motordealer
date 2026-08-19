import React, { useState, useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'
import { useCRMStore } from '../../context/CRMStore'
import PredictiveSelect from '../../components/common/PredictiveSelect'
import {
  Sparkles, Key, CheckCircle, AlertTriangle, ShieldCheck, Zap,
  Save, Eye, EyeOff, Bot, RefreshCw, Cpu, Check, Layers, Sliders, Info,
  Database, Server, Lock
} from 'lucide-react'

const MODEL_OPTIONS = [
  {
    value: 'gemini-3.6-flash',
    label: 'Google Gemini 3.6 Flash (Recommended)',
    subtext: 'Next-generation Gemini 3.6 engine with high-speed RAG intelligence',
    badge: 'Gemini 3.6',
    icon: Sparkles
  },
  {
    value: 'gemini-2.5-flash',
    label: 'Google Gemini 2.5 Flash (Recommended Modern Engine)',
    subtext: 'State-of-the-art modern Gemini 2.5 engine with high throughput',
    badge: 'Gemini 2.5',
    icon: Sparkles
  },
  {
    value: 'gemini-2.0-flash',
    label: 'Google Gemini 2.0 Flash (Strictly Gemini API)',
    subtext: 'Next-generation Gemini engine, uses ONLY Google Gemini API',
    badge: 'Gemini 2.0',
    icon: Zap
  },
  {
    value: 'gpt-4o-mini',
    label: 'OpenAI GPT-4o Mini (Strictly OpenAI API)',
    subtext: 'Uses ONLY OpenAI GPT-4o Mini for customer support speed',
    badge: 'OpenAI Only',
    icon: Cpu
  },
  {
    value: 'gpt-4o',
    label: 'OpenAI GPT-4o Flagship (Strictly OpenAI API)',
    subtext: 'Uses ONLY OpenAI GPT-4o flagship model',
    badge: 'OpenAI Only',
    icon: Bot
  },
  {
    value: 'auto-fallback',
    label: 'Auto Multi-Provider Fallback (Gemini 3.6 + OpenAI)',
    subtext: 'Tries Gemini 3.6 primary provider first, falls back to OpenAI secondary',
    badge: 'Hybrid Dual Engine',
    icon: Zap
  },
  {
    value: 'rules-only',
    label: 'Built-in Smart Knowledge Engine Only (Offline)',
    subtext: 'Pure database keyword & rule parser (no external API calls)',
    badge: 'Offline RAG',
    icon: Layers
  }
]

const DEFAULT_SYSTEM_PROMPT = `You are Alex, an expert human Executive Sales & Support Consultant at KnK Automotive Kenya (Luxury & SUV Automotive Dealership in Nairobi & Mombasa).
Your task is to respond naturally, warmly, and knowledgeably to website client chat inquiries.

SHOWROOM LOCATIONS & SERVICES:
- Showroom HQ: Ring Road Kilimani, Nairobi | Branch: Nyali Road, Mombasa
- Viewing Hours: Mon-Sat 8:00 AM - 6:00 PM
- Services: Ready Stock Sales, 30-Day Custom Direct Import from Japan/UK, Bank Asset Financing (up to 80%), Trade-In Valuations.`

export default function AISettingsPage() {
  const { isLight } = useOutletContext() || { isLight: false }
  const aiSettings = useCRMStore(state => state.aiSettings)
  const fetchAISettings = useCRMStore(state => state.fetchAISettings)
  const saveAISettings = useCRMStore(state => state.saveAISettings)
  const testAIKey = useCRMStore(state => state.testAIKey)

  const [providerDefault, setProviderDefault] = useState('gemini-3.6-flash')
  const [geminiKeyInput, setGeminiKeyInput] = useState('')
  const [openaiKeyInput, setOpenaiKeyInput] = useState('')
  const [showGeminiKey, setShowGeminiKey] = useState(false)
  const [showOpenaiKey, setShowOpenaiKey] = useState(false)
  const [systemPrompt, setSystemPrompt] = useState(DEFAULT_SYSTEM_PROMPT)
  const [temperature, setTemperature] = useState(0.7)
  const [maxTokens, setMaxTokens] = useState(500)
  const [autoReplyGlobal, setAutoReplyGlobal] = useState(true)

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [testStatus, setTestStatus] = useState({ gemini: null, openai: null })
  const [testingKey, setTestingKey] = useState({ gemini: false, openai: false })
  const [saveMessage, setSaveMessage] = useState(null)

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      const data = await fetchAISettings()
      if (data) {
        const loadedModel = data.AI_PROVIDER_DEFAULT
        const validModel = (!loadedModel || loadedModel.includes('1.5')) ? 'gemini-2.5-flash' : loadedModel
        setProviderDefault(validModel)
        setSystemPrompt(data.AI_SYSTEM_PROMPT || DEFAULT_SYSTEM_PROMPT)
        setTemperature(data.AI_TEMPERATURE !== undefined ? data.AI_TEMPERATURE : 0.7)
        setMaxTokens(data.AI_MAX_TOKENS || 500)
        setAutoReplyGlobal(data.AI_AUTO_REPLY_GLOBAL !== false)
        if (data.gemini_key_masked) setGeminiKeyInput(data.gemini_key_masked)
        if (data.openai_key_masked) setOpenaiKeyInput(data.openai_key_masked)
      }
      setLoading(false)
    }
    loadData()
  }, [fetchAISettings])

  const handleSave = async (e) => {
    if (e) e.preventDefault()
    setSaving(true)
    setSaveMessage(null)

    try {
      const payload = {
        AI_PROVIDER_DEFAULT: providerDefault,
        AI_SYSTEM_PROMPT: systemPrompt,
        AI_TEMPERATURE: temperature,
        AI_MAX_TOKENS: maxTokens,
        AI_AUTO_REPLY_GLOBAL: autoReplyGlobal
      }

      if (geminiKeyInput && !geminiKeyInput.includes('...')) {
        payload.AI_GEMINI_KEY = geminiKeyInput.trim()
      }
      if (openaiKeyInput && !openaiKeyInput.includes('...')) {
        payload.AI_OPENAI_KEY = openaiKeyInput.trim()
      }

      await saveAISettings(payload)
      setSaveMessage({ type: 'success', text: 'AI Settings saved successfully to PostgreSQL database!' })
      setTimeout(() => setSaveMessage(null), 4000)
    } catch (err) {
      setSaveMessage({ type: 'error', text: `Failed to save settings: ${err.message}` })
    } finally {
      setSaving(false)
    }
  }

  const handleTestKey = async (provider) => {
    setTestingKey(prev => ({ ...prev, [provider]: true }))
    setTestStatus(prev => ({ ...prev, [provider]: null }))

    const inputKey = provider === 'gemini' ? geminiKeyInput : openaiKeyInput
    const res = await testAIKey(provider, inputKey, providerDefault)

    setTestingKey(prev => ({ ...prev, [provider]: false }))
    if (res && res.success) {
      setTestStatus(prev => ({ ...prev, [provider]: { success: true, message: res.message } }))
    } else {
      setTestStatus(prev => ({ ...prev, [provider]: { success: false, error: res?.error || 'Validation failed' } }))
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <div className="w-10 h-10 border-4 border-slate-700 border-t-[#c9a84c] rounded-full animate-spin" />
        <p className="text-xs font-mono tracking-widest text-slate-400 uppercase">Loading AI Configuration Engine...</p>
      </div>
    )
  }

  return (
    <div className="w-full space-y-6 pb-24 font-sans px-2 sm:px-4">

      {/* Edge-to-Edge Top Header Banner */}
      <div className={`p-6 sm:p-8 rounded-3xl border shadow-2xl relative overflow-hidden transition-all ${
        isLight
          ? 'bg-gradient-to-br from-white via-slate-50 to-amber-50/40 border-slate-200 text-slate-900'
          : 'bg-gradient-to-br from-[#0b1021] via-[#070b18] to-[#020617] border-[#c9a84c]/30 text-slate-100'
      }`}>
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#c9a84c]/10 blur-3xl rounded-full pointer-events-none" />

        <div className="flex flex-wrap items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-2xl bg-[#c9a84c]/20 text-[#c9a84c] border border-[#c9a84c]/40 shadow-lg">
                <Sparkles size={24} />
              </div>
              <span className="text-xs font-mono font-bold tracking-[2.5px] uppercase text-[#c9a84c]">
                AI Engine & Database Center
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold font-serif tracking-tight">
              AI Sales Concierge & API Settings
            </h1>
            <p className={`text-xs sm:text-sm max-w-3xl ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              Configure Google Gemini API and OpenAI API keys, customize live sales prompts, fine-tune model parameters, and manage real-time PostgreSQL persistence.
            </p>
          </div>

          {/* Quick System Badges & Auto-Pilot Toggle */}
          <div className="flex flex-wrap items-center gap-3">
            <div className={`px-4 py-2.5 rounded-2xl border flex items-center gap-2.5 text-xs font-mono ${
              isLight ? 'bg-slate-100 border-slate-300 text-slate-700' : 'bg-slate-900/90 border-white/10 text-slate-300'
            }`}>
              <ShieldCheck size={18} className="text-emerald-400" />
              <span>DB Sync: <strong className="text-emerald-400">PostgreSQL + Supabase</strong></span>
            </div>

            <button
              type="button"
              onClick={() => setAutoReplyGlobal(!autoReplyGlobal)}
              className={`px-5 py-2.5 rounded-2xl font-mono text-xs font-bold uppercase tracking-wider transition-all border flex items-center gap-2 cursor-pointer shadow-lg ${
                autoReplyGlobal
                  ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 hover:bg-emerald-500/30'
                  : 'bg-rose-500/20 border-rose-500/50 text-rose-300 hover:bg-rose-500/30'
              }`}
            >
              {autoReplyGlobal ? <CheckCircle size={16} /> : <AlertTriangle size={16} />}
              <span>{autoReplyGlobal ? 'AUTO-PILOT: ENABLED' : 'AUTO-PILOT: PAUSED'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Edge-to-Edge Form in 2-Column Grid */}
      <form onSubmit={handleSave} className="space-y-6">

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">

          {/* LEFT COLUMN: Model Selection, API Keys, & Creativity (Span 6) */}
          <div className="xl:col-span-6 space-y-6">

            {/* Card 1: Primary AI Model Engine Selection */}
            <div className={`p-6 sm:p-7 rounded-2xl border space-y-5 transition-all ${
              isLight ? 'bg-white border-slate-200 shadow-md' : 'bg-slate-900/70 border-white/10 shadow-xl'
            }`}>
              <div className="flex items-center gap-3 pb-3 border-b border-white/10">
                <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
                  <Bot size={20} />
                </div>
                <div>
                  <h3 className={`text-base font-bold font-serif ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                    Primary AI Model Engine
                  </h3>
                  <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                    Select the active LLM engine for evaluating incoming client messages.
                  </p>
                </div>
              </div>

              {/* PredictiveSelect for Model Selection */}
              <div>
                <PredictiveSelect
                  label="Active Model Engine"
                  options={MODEL_OPTIONS}
                  value={providerDefault}
                  onChange={(val) => setProviderDefault(val || 'gemini-2.5-flash')}
                  placeholder="Select AI Model Engine..."
                  isLight={isLight}
                />
              </div>
            </div>

            {/* Card 2: API Credentials & Database Keys */}
            <div className={`p-6 sm:p-7 rounded-2xl border space-y-6 transition-all ${
              isLight ? 'bg-white border-slate-200 shadow-md' : 'bg-slate-900/70 border-white/10 shadow-xl'
            }`}>
              <div className="flex items-center gap-3 pb-3 border-b border-white/10">
                <div className="p-2 rounded-xl bg-amber-500/20 text-[#c9a84c] border border-[#c9a84c]/30">
                  <Key size={20} />
                </div>
                <div>
                  <h3 className={`text-base font-bold font-serif ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                    API Credentials & Database Keys
                  </h3>
                  <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                    Keys saved here persist in PostgreSQL (`crm_site_settings`) and reload dynamically without server restarts.
                  </p>
                </div>
              </div>

              <div className="space-y-5">

                {/* Google Gemini API Key */}
                <div className={`p-4 sm:p-5 rounded-xl border space-y-3 ${
                  isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-950/80 border-white/10'
                }`}>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Sparkles size={16} className="text-[#c9a84c]" />
                      <label className={`font-mono font-bold text-xs ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                        Google Gemini API Key
                      </label>
                    </div>

                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                      aiSettings.gemini_source === 'database'
                        ? 'bg-[#c9a84c]/20 text-[#c9a84c] border border-[#c9a84c]/40'
                        : aiSettings.gemini_source === 'env'
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                          : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                    }`}>
                      {aiSettings.gemini_source === 'database' ? 'DB Stored' : aiSettings.gemini_source === 'env' ? '.env Active' : 'Not Set'}
                    </span>
                  </div>

                  <div className="relative">
                    <input
                      type={showGeminiKey ? 'text' : 'password'}
                      value={geminiKeyInput}
                      onChange={(e) => setGeminiKeyInput(e.target.value)}
                      placeholder="AIzaSy..."
                      className={`w-full border rounded-xl px-3.5 py-2.5 text-xs font-mono outline-none pr-10 transition-all ${
                        isLight
                          ? 'bg-white border-slate-300 text-slate-900 focus:border-[#c9a84c]'
                          : 'bg-slate-900 border-white/15 text-slate-100 focus:border-[#c9a84c]'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowGeminiKey(!showGeminiKey)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-slate-200"
                    >
                      {showGeminiKey ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-1">
                    <p className="text-[10px] text-slate-400 font-mono">
                      Google AI Studio (<a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-[#c9a84c] underline hover:text-amber-300">aistudio.google.com</a>)
                    </p>

                    <button
                      type="button"
                      onClick={() => handleTestKey('gemini')}
                      disabled={testingKey.gemini}
                      className="px-3 py-1.5 rounded-lg bg-amber-500/20 text-[#c9a84c] border border-[#c9a84c]/40 hover:bg-amber-500/30 text-[11px] font-mono font-bold uppercase transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      {testingKey.gemini ? (
                        <RefreshCw size={12} className="animate-spin text-[#c9a84c]" />
                      ) : (
                        <Zap size={12} />
                      )}
                      <span>{testingKey.gemini ? 'Testing...' : 'Test Key'}</span>
                    </button>
                  </div>

                  {testStatus.gemini && (
                    <div className={`p-2.5 rounded-lg text-xs font-mono flex items-start gap-2 border ${
                      testStatus.gemini.success
                        ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                        : 'bg-rose-500/15 border-rose-500/40 text-rose-300'
                    }`}>
                      {testStatus.gemini.success ? <CheckCircle size={14} className="mt-0.5 text-emerald-400 flex-shrink-0" /> : <AlertTriangle size={14} className="mt-0.5 text-rose-400 flex-shrink-0" />}
                      <span>{testStatus.gemini.success ? testStatus.gemini.message : testStatus.gemini.error}</span>
                    </div>
                  )}
                </div>

                {/* OpenAI API Key */}
                <div className={`p-4 sm:p-5 rounded-xl border space-y-3 ${
                  isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-950/80 border-white/10'
                }`}>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Cpu size={16} className="text-purple-400" />
                      <label className={`font-mono font-bold text-xs ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                        OpenAI API Key
                      </label>
                    </div>

                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                      aiSettings.openai_source === 'database'
                        ? 'bg-[#c9a84c]/20 text-[#c9a84c] border border-[#c9a84c]/40'
                        : aiSettings.openai_source === 'env'
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                          : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                    }`}>
                      {aiSettings.openai_source === 'database' ? 'DB Stored' : aiSettings.openai_source === 'env' ? '.env Active' : 'Not Set'}
                    </span>
                  </div>

                  <div className="relative">
                    <input
                      type={showOpenaiKey ? 'text' : 'password'}
                      value={openaiKeyInput}
                      onChange={(e) => setOpenaiKeyInput(e.target.value)}
                      placeholder="sk-proj-..."
                      className={`w-full border rounded-xl px-3.5 py-2.5 text-xs font-mono outline-none pr-10 transition-all ${
                        isLight
                          ? 'bg-white border-slate-300 text-slate-900 focus:border-purple-500'
                          : 'bg-slate-900 border-white/15 text-slate-100 focus:border-purple-500'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowOpenaiKey(!showOpenaiKey)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-slate-200"
                    >
                      {showOpenaiKey ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-1">
                    <p className="text-[10px] text-slate-400 font-mono">
                      OpenAI Platform (platform.openai.com)
                    </p>

                    <button
                      type="button"
                      onClick={() => handleTestKey('openai')}
                      disabled={testingKey.openai}
                      className="px-3 py-1.5 rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/40 hover:bg-purple-500/30 text-[11px] font-mono font-bold uppercase transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      {testingKey.openai ? (
                        <RefreshCw size={12} className="animate-spin text-purple-300" />
                      ) : (
                        <Zap size={12} />
                      )}
                      <span>{testingKey.openai ? 'Testing...' : 'Test Key'}</span>
                    </button>
                  </div>

                  {testStatus.openai && (
                    <div className={`p-2.5 rounded-lg text-xs font-mono flex items-start gap-2 border ${
                      testStatus.openai.success
                        ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                        : 'bg-rose-500/15 border-rose-500/40 text-rose-300'
                    }`}>
                      {testStatus.openai.success ? <CheckCircle size={14} className="mt-0.5 text-emerald-400 flex-shrink-0" /> : <AlertTriangle size={14} className="mt-0.5 text-rose-400 flex-shrink-0" />}
                      <span>{testStatus.openai.success ? testStatus.openai.message : testStatus.openai.error}</span>
                    </div>
                  )}
                </div>

              </div>
            </div>

            {/* Card 3: Creativity & Generation Parameters */}
            <div className={`p-6 sm:p-7 rounded-2xl border space-y-5 transition-all ${
              isLight ? 'bg-white border-slate-200 shadow-md' : 'bg-slate-900/70 border-white/10 shadow-xl'
            }`}>
              <div className="flex items-center gap-3 pb-3 border-b border-white/10">
                <div className="p-2 rounded-xl bg-amber-500/20 text-[#c9a84c] border border-[#c9a84c]/30">
                  <Zap size={20} />
                </div>
                <div>
                  <h3 className={`text-base font-bold font-serif ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                    Creativity & Generation Controls
                  </h3>
                  <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                    Tune temperature randomness and maximum token response length.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

                {/* Temperature Slider */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className={isLight ? 'text-slate-700 font-bold' : 'text-slate-300 font-bold'}>
                      Temperature: <strong className="text-[#c9a84c]">{temperature}</strong>
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="1.0"
                    step="0.05"
                    value={temperature}
                    onChange={(e) => setTemperature(parseFloat(e.target.value))}
                    className="w-full accent-[#c9a84c] cursor-pointer"
                  />
                  <p className="text-[10px] font-mono text-slate-400">
                    {temperature <= 0.3 ? 'Strict / Factual' : temperature <= 0.7 ? 'Balanced Sales (Recommended)' : 'Highly Creative'}
                  </p>
                </div>

                {/* Max Output Tokens */}
                <div className="space-y-2">
                  <label className={`block text-xs font-mono font-bold ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                    Max Tokens Limit
                  </label>
                  <input
                    type="number"
                    min="100"
                    max="2000"
                    step="50"
                    value={maxTokens}
                    onChange={(e) => setMaxTokens(parseInt(e.target.value) || 500)}
                    className={`w-full border rounded-xl px-3.5 py-2.5 text-xs font-mono outline-none ${
                      isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-950 border-white/15 text-slate-100'
                    }`}
                  />
                  <p className="text-[10px] font-mono text-slate-400">Default: 500 (~350 words)</p>
                </div>

              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: System Prompt Editor & Database Sync Card (Span 6) */}
          <div className="xl:col-span-6 space-y-6 flex flex-col h-full">

            {/* Card 4: Sales Concierge Persona & System Prompt (Full Height) */}
            <div className={`p-6 sm:p-7 rounded-2xl border space-y-5 flex-1 flex flex-col transition-all ${
              isLight ? 'bg-white border-slate-200 shadow-md' : 'bg-slate-900/70 border-white/10 shadow-xl'
            }`}>
              <div className="flex items-center justify-between gap-4 pb-3 border-b border-white/10 flex-wrap">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                    <Sliders size={20} />
                  </div>
                  <div>
                    <h3 className={`text-base font-bold font-serif ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                      Sales Concierge Persona & System Prompt
                    </h3>
                    <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                      Customize personality, showroom details, and sales instructions for "Alex".
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSystemPrompt(DEFAULT_SYSTEM_PROMPT)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 border border-white/10 text-slate-300 hover:text-white text-xs font-mono uppercase tracking-wider transition-all"
                >
                  Reset Default
                </button>
              </div>

              <div className="space-y-3 flex-1 flex flex-col">
                <textarea
                  rows={14}
                  value={systemPrompt}
                  onChange={(e) => setSystemPrompt(e.target.value)}
                  className={`w-full flex-1 border rounded-xl p-4 text-xs font-mono outline-none leading-relaxed transition-all crm-scroll min-h-[320px] ${
                    isLight
                      ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-[#c9a84c]'
                      : 'bg-slate-950 border-white/15 text-slate-100 focus:border-[#c9a84c]'
                  }`}
                />
                <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <Info size={13} className="text-[#c9a84c]" /> Live vehicle catalog RAG data is injected automatically during chat evaluations.
                  </span>
                  <span>{systemPrompt.length} characters</span>
                </div>
              </div>
            </div>

            {/* Card 5: Real-time Persistence & Cloud Sync Overview */}
            <div className={`p-6 rounded-2xl border space-y-4 transition-all ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/90 border-white/10'
            }`}>
              <div className="flex items-center gap-2.5 text-xs font-mono font-bold uppercase text-[#c9a84c]">
                <Database size={16} />
                <span>PostgreSQL & Supabase Architecture</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
                <div className="p-3 rounded-xl bg-slate-900/60 border border-white/10">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-bold mb-1">
                    <Server size={14} /> PostgreSQL
                  </div>
                  <p className="text-[11px] text-slate-400">Saved to `crm_site_settings` table</p>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/60 border border-white/10">
                  <div className="flex items-center gap-1.5 text-cyan-400 font-bold mb-1">
                    <ShieldCheck size={14} /> Supabase Sync
                  </div>
                  <p className="text-[11px] text-slate-400">Replicated real-time via `syncRecord`</p>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/60 border border-white/10">
                  <div className="flex items-center gap-1.5 text-purple-400 font-bold mb-1">
                    <Lock size={14} /> Zero Restart
                  </div>
                  <p className="text-[11px] text-slate-400">Hot reloaded into AI Agent Engine</p>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Sticky Full-Width Bottom Save Action Bar */}
        <div className={`sticky bottom-4 z-40 p-4 sm:p-5 rounded-2xl border backdrop-blur-xl shadow-2xl flex flex-wrap items-center justify-between gap-4 transition-all ${
          isLight
            ? 'bg-white/95 border-slate-300 shadow-slate-400/20'
            : 'bg-[#090f20]/95 border-[#c9a84c]/40 shadow-black/80'
        }`}>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#c9a84c]/20 text-[#c9a84c] border border-[#c9a84c]/30">
              <Save size={18} />
            </div>
            <div>
              <p className={`text-xs font-bold font-mono uppercase ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                Save Configuration Changes
              </p>
              <p className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                Persists settings immediately to database and activates live AI Concierge models.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {saveMessage && (
              <div className={`px-4 py-2 rounded-xl text-xs font-mono flex items-center gap-2 border ${
                saveMessage.type === 'success'
                  ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                  : 'bg-rose-500/20 border-rose-500/50 text-rose-300'
              }`}>
                {saveMessage.type === 'success' ? <CheckCircle size={16} /> : <AlertTriangle size={16} />}
                <span>{saveMessage.text}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={saving}
              className="aq-btn-primary px-8 py-3.5 rounded-xl font-bold uppercase tracking-wider text-xs flex items-center gap-2 shadow-2xl transition-all cursor-pointer"
            >
              {saving ? <RefreshCw size={16} className="animate-spin text-slate-950" /> : <Save size={16} />}
              <span>{saving ? 'Saving to Database...' : 'Save AI Settings'}</span>
            </button>
          </div>
        </div>

      </form>

    </div>
  )
}
