import React, { useState, useRef, useEffect } from 'react'
import { Clock, ChevronDown, X, Zap } from 'lucide-react'

const TIME_SLOTS = []
for (let h = 0; h < 24; h++) {
  for (let m = 0; m < 60; m += 30) {
    const hh = String(h).padStart(2, '0')
    const mm = String(m).padStart(2, '0')
    const val24 = `${hh}:${mm}`
    const period = h >= 12 ? 'PM' : 'AM'
    const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h
    const display = `${h12}:${mm} ${period}`
    TIME_SLOTS.push({ value: val24, display, hour: h, minute: m, period })
  }
}

export default function StyledTimePicker({
  value,
  onChange,
  label,
  placeholder = 'Select time...',
  isLight = false,
  className = '',
  presets = true,
  use12Hour = true
}) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef(null)
  const selectedRef = useRef(null)
  const listRef = useRef(null)

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Auto-scroll to selected time when dropdown opens
  useEffect(() => {
    if (isOpen && selectedRef.current && listRef.current) {
      setTimeout(() => {
        selectedRef.current?.scrollIntoView({ block: 'center', behavior: 'smooth' })
      }, 50)
    }
  }, [isOpen])

  // Normalize value to HH:MM (24h) format
  const normalizeValue = (val) => {
    if (!val) return ''
    // Already in HH:MM 24h format
    if (/^\d{2}:\d{2}$/.test(val)) return val
    // Handle "10:00 AM" style
    const match = val.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i)
    if (match) {
      let h = parseInt(match[1], 10)
      const m = match[2]
      const period = match[3].toUpperCase()
      if (period === 'PM' && h < 12) h += 12
      if (period === 'AM' && h === 12) h = 0
      return `${String(h).padStart(2, '0')}:${m}`
    }
    return val
  }

  const normalizedValue = normalizeValue(value)

  // Find matching slot for display
  const matchedSlot = TIME_SLOTS.find(s => s.value === normalizedValue)

  const formatDisplay = () => {
    if (matchedSlot) return matchedSlot.display
    if (value) return value
    return placeholder
  }

  const handleSelect = (slot) => {
    // Output in the format the consumer expects
    if (use12Hour) {
      onChange(slot.display)
    } else {
      onChange(slot.value)
    }
    setIsOpen(false)
  }

  const handlePreset = (type) => {
    const now = new Date()
    let targetH, targetM

    if (type === 'now') {
      targetH = now.getHours()
      targetM = now.getMinutes() < 30 ? 30 : 0
      if (now.getMinutes() >= 30) targetH += 1
    } else if (type === '+1h') {
      targetH = now.getHours() + 1
      targetM = 0
    } else if (type === '+2h') {
      targetH = now.getHours() + 2
      targetM = 0
    } else if (type === 'morning') {
      targetH = 9
      targetM = 0
    } else if (type === 'afternoon') {
      targetH = 14
      targetM = 0
    }

    if (targetH >= 24) targetH = targetH - 24

    const slot = TIME_SLOTS.find(s => s.hour === targetH && s.minute === targetM)
    if (slot) handleSelect(slot)
  }

  // Determine time-of-day section label
  const getTimeSection = (hour) => {
    if (hour < 6) return 'Early Morning'
    if (hour < 12) return 'Morning'
    if (hour < 17) return 'Afternoon'
    if (hour < 21) return 'Evening'
    return 'Night'
  }

  return (
    <div className={`relative inline-block w-full font-mono ${className}`} ref={containerRef}>
      {label && (
        <label className={`block uppercase tracking-wider mb-1 text-[10px] font-bold ${
          isLight ? 'text-slate-700' : 'text-slate-400'
        }`}>
          {label}
        </label>
      )}

      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl border text-xs font-mono transition-all duration-200 cursor-pointer ${
          isLight
            ? 'bg-slate-50 border-slate-300 text-slate-900 hover:bg-slate-100 focus:border-[#c9a84c]'
            : 'bg-slate-950/80 border-white/15 text-slate-200 hover:border-[#c9a84c]/50 focus:border-[#c9a84c]'
        } ${isOpen ? 'ring-2 ring-[#c9a84c]/40 border-[#c9a84c]' : ''}`}
      >
        <div className="flex items-center gap-2.5 truncate">
          <Clock size={15} className="text-[#c9a84c] flex-shrink-0" />
          <span className={value ? 'font-bold' : isLight ? 'text-slate-400' : 'text-slate-500'}>
            {formatDisplay()}
          </span>
        </div>
        <div className="flex items-center gap-1">
          {value && (
            <span
              onClick={(e) => { e.stopPropagation(); onChange(''); }}
              className={`p-0.5 rounded hover:bg-rose-500/20 ${isLight ? 'text-slate-400 hover:text-rose-600' : 'text-slate-500 hover:text-rose-400'}`}
              title="Clear time"
            >
              <X size={13} />
            </span>
          )}
          <ChevronDown size={14} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''} ${isLight ? 'text-slate-400' : 'text-slate-500'}`} />
        </div>
      </button>

      {/* Dropdown Popover */}
      {isOpen && (
        <div className={`absolute z-[99999] mt-2 w-64 rounded-2xl border shadow-2xl backdrop-blur-2xl transition-all duration-200 left-0 overflow-hidden ${
          isLight
            ? 'bg-white border-slate-300 text-slate-900 shadow-slate-400/50'
            : 'bg-[#090f20] border-[#c9a84c]/40 text-slate-100 shadow-black/90'
        }`}>

          {/* Quick Presets */}
          {presets && (
            <div className={`flex items-center gap-1 p-3 pb-2 text-[10px] uppercase font-bold border-b ${
              isLight ? 'border-slate-200' : 'border-white/10'
            }`}>
              <Zap size={10} className="text-[#c9a84c] mr-1" />
              {[
                { key: 'now', label: 'Next' },
                { key: '+1h', label: '+1hr' },
                { key: '+2h', label: '+2hr' },
                { key: 'morning', label: '9 AM' },
                { key: 'afternoon', label: '2 PM' }
              ].map(p => (
                <button
                  key={p.key}
                  type="button"
                  onClick={() => handlePreset(p.key)}
                  className={`px-2 py-1 rounded-md border transition-all ${
                    isLight ? 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200' : 'bg-slate-900 border-white/10 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          )}

          {/* Scrollable Time List */}
          <div ref={listRef} className="max-h-56 overflow-y-auto crm-scroll">
            {TIME_SLOTS.map((slot, idx) => {
              const isSelected = slot.value === normalizedValue
              const prevSlot = idx > 0 ? TIME_SLOTS[idx - 1] : null
              const showSection = !prevSlot || getTimeSection(slot.hour) !== getTimeSection(prevSlot.hour)

              return (
                <React.Fragment key={slot.value}>
                  {showSection && (
                    <div className={`px-3 py-1.5 text-[9px] uppercase tracking-[3px] font-bold sticky top-0 ${
                      isLight ? 'bg-slate-100 text-slate-500' : 'bg-slate-950 text-slate-500'
                    }`}>
                      {getTimeSection(slot.hour)}
                    </div>
                  )}
                  <button
                    type="button"
                    ref={isSelected ? selectedRef : null}
                    onClick={() => handleSelect(slot)}
                    className={`w-full flex items-center justify-between px-4 py-2 text-xs font-mono transition-all ${
                      isSelected
                        ? 'bg-[#c9a84c] text-slate-950 font-bold'
                        : isLight
                        ? 'hover:bg-slate-100 text-slate-800'
                        : 'hover:bg-white/10 text-slate-200'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Clock size={12} className={isSelected ? 'text-slate-950' : 'text-[#c9a84c]/60'} />
                      {slot.display}
                    </span>
                    {isSelected && (
                      <span className="text-[10px] font-bold tracking-wider opacity-70">SELECTED</span>
                    )}
                  </button>
                </React.Fragment>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
