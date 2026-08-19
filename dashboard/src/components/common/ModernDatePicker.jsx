import React, { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X, Clock, Sparkles } from 'lucide-react'

export default function ModernDatePicker({
  value,
  onChange,
  label,
  placeholder = 'Select date...',
  isLight = false,
  className = '',
  presets = true,
  eventCounts = null
}) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef(null)
  const triggerRef = useRef(null)
  const popoverRef = useRef(null)
  const [coords, setCoords] = useState({ top: 0, left: 0 })

  // Helper to parse YYYY-MM-DD from any string format into a local Date without UTC timezone shift
  const parseLocalDate = (dateStr) => {
    if (!dateStr) return null
    const str = String(dateStr).trim()
    const match = str.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/)
    if (match) {
      const y = parseInt(match[1], 10)
      const m = parseInt(match[2], 10) - 1
      const d = parseInt(match[3], 10)
      return new Date(y, m, d)
    }
    const d = new Date(dateStr)
    return isNaN(d) ? null : d
  }

  // Parse current selected date or default to today
  const selectedDate = parseLocalDate(value)
  const [viewMonthState, setViewMonthState] = useState(null)

  // Derive current viewing date from user navigation or selected value
  const viewDate = viewMonthState || (selectedDate && !isNaN(selectedDate) ? new Date(selectedDate) : new Date())

  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()

  const updateCoords = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect()
      const popoverWidth = 288
      let leftPos = rect.left
      if (leftPos + popoverWidth > window.innerWidth - 16) {
        leftPos = Math.max(16, window.innerWidth - popoverWidth - 16)
      }
      
      const spaceBelow = window.innerHeight - rect.bottom
      const showAbove = spaceBelow < 340 && rect.top > 340
      const topPos = showAbove ? rect.top - 340 : rect.bottom + 6

      setCoords({
        top: topPos,
        left: leftPos
      })
    }
  }

  const toggleOpen = () => {
    if (!isOpen) {
      updateCoords()
    }
    setIsOpen(!isOpen)
  }

  useEffect(() => {
    if (isOpen) {
      updateCoords()
      window.addEventListener('resize', updateCoords)
      window.addEventListener('scroll', updateCoords, true)
      return () => {
        window.removeEventListener('resize', updateCoords)
        window.removeEventListener('scroll', updateCoords, true)
      }
    }
  }, [isOpen])

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        containerRef.current && !containerRef.current.contains(e.target) &&
        popoverRef.current && !popoverRef.current.contains(e.target)
      ) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const daysOfWeek = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

  // Days in current view month
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDayOfWeek = new Date(year, month, 1).getDay()

  const handlePrevMonth = (e) => {
    e.preventDefault()
    setViewMonthState(new Date(year, month - 1, 1))
  }

  const handleNextMonth = (e) => {
    e.preventDefault()
    setViewMonthState(new Date(year, month + 1, 1))
  }

  const handleSelectDay = (day) => {
    const y = year
    const m = String(month + 1).padStart(2, '0')
    const d = String(day).padStart(2, '0')
    const formatted = `${y}-${m}-${d}`
    onChange(formatted)
    setViewMonthState(null)
    setIsOpen(false)
  }

  const handlePreset = (type) => {
    const today = new Date()
    let targetDate = new Date()
    if (type === 'today') {
      targetDate = today
    } else if (type === 'tomorrow') {
      targetDate.setDate(today.getDate() + 1)
    } else if (type === '7days') {
      targetDate.setDate(today.getDate() + 7)
    } else if (type === '30days') {
      targetDate.setDate(today.getDate() + 30)
    }
    const y = targetDate.getFullYear()
    const m = String(targetDate.getMonth() + 1).padStart(2, '0')
    const d = String(targetDate.getDate()).padStart(2, '0')
    const formatted = `${y}-${m}-${d}`
    onChange(formatted)
    setViewMonthState(targetDate)
    setIsOpen(false)
  }

  // Format date display (e.g., "Aug 04, 2026")
  const formatDisplay = (dateStr) => {
    if (!dateStr) return placeholder
    const parsed = parseLocalDate(dateStr)
    if (!parsed || isNaN(parsed)) return dateStr
    return parsed.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
  }

  const isToday = (day) => {
    const today = new Date()
    return (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    )
  }

  const isSelected = (day) => {
    if (!selectedDate || isNaN(selectedDate)) return false
    return (
      day === selectedDate.getDate() &&
      month === selectedDate.getMonth() &&
      year === selectedDate.getFullYear()
    )
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
        ref={triggerRef}
        type="button"
        onClick={toggleOpen}
        className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl border text-xs font-mono transition-all duration-200 cursor-pointer ${
          isLight
            ? 'bg-slate-50 border-slate-300 text-slate-900 hover:bg-slate-100 focus:border-[#c9a84c]'
            : 'bg-slate-950/80 border-white/15 text-slate-200 hover:border-[#c9a84c]/50 focus:border-[#c9a84c]'
        } ${isOpen ? 'ring-2 ring-[#c9a84c]/40 border-[#c9a84c]' : ''}`}
      >
        <div className="flex items-center gap-2.5 truncate">
          <CalendarIcon size={15} className="text-[#c9a84c] flex-shrink-0" />
          <span className={value ? 'font-bold' : isLight ? 'text-slate-400' : 'text-slate-500'}>
            {formatDisplay(value)}
          </span>
        </div>
        <div className="flex items-center gap-1">
          {value && (
            <span
              onClick={(e) => { e.stopPropagation(); onChange(''); }}
              className={`p-0.5 rounded hover:bg-rose-500/20 ${isLight ? 'text-slate-400 hover:text-rose-600' : 'text-slate-500 hover:text-rose-400'}`}
              title="Clear date"
            >
              <X size={13} />
            </span>
          )}
        </div>
      </button>

      {/* Modern Popover Window - Portaled to document.body with fixed z-[9999999] */}
      {isOpen && createPortal(
        <div
          ref={popoverRef}
          style={{ top: `${coords.top}px`, left: `${coords.left}px` }}
          className={`fixed z-[9999999] w-72 p-4 rounded-2xl border shadow-2xl backdrop-blur-2xl transition-all duration-150 ${
            isLight
              ? 'bg-white border-slate-300 text-slate-900 shadow-slate-400/50'
              : 'bg-[#090f20] border-[#c9a84c]/50 text-slate-100 shadow-[0_25px_60px_rgba(0,0,0,0.95)]'
          }`}
        >
          {/* Header Month / Year Switcher */}
          <div className="flex items-center justify-between border-b pb-3 mb-3 border-slate-200 dark:border-white/10">
            <button
              onClick={handlePrevMonth}
              className={`p-1 rounded-lg transition-all ${
                isLight ? 'hover:bg-slate-100 text-slate-700' : 'hover:bg-white/10 text-slate-300'
              }`}
            >
              <ChevronLeft size={16} />
            </button>

            <span className="font-serif font-bold text-sm tracking-wide">
              {monthNames[month]} {year}
            </span>

            <button
              onClick={handleNextMonth}
              className={`p-1 rounded-lg transition-all ${
                isLight ? 'hover:bg-slate-100 text-slate-700' : 'hover:bg-white/10 text-slate-300'
              }`}
            >
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Quick Presets Ribbon */}
          {presets && (
            <div className="flex items-center justify-between gap-1 mb-3 text-[10px] uppercase font-bold">
              <button
                type="button"
                onClick={() => handlePreset('today')}
                className={`px-2 py-1 rounded-md border transition-all ${
                  isLight ? 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200' : 'bg-slate-900 border-white/10 text-slate-300 hover:bg-white/10'
                }`}
              >
                Today
              </button>
              <button
                type="button"
                onClick={() => handlePreset('tomorrow')}
                className={`px-2 py-1 rounded-md border transition-all ${
                  isLight ? 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200' : 'bg-slate-900 border-white/10 text-slate-300 hover:bg-white/10'
                }`}
              >
                Tomorrow
              </button>
              <button
                type="button"
                onClick={() => handlePreset('7days')}
                className={`px-2 py-1 rounded-md border transition-all ${
                  isLight ? 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200' : 'bg-slate-900 border-white/10 text-slate-300 hover:bg-white/10'
                }`}
              >
                +7 Days
              </button>
              <button
                type="button"
                onClick={() => handlePreset('30days')}
                className={`px-2 py-1 rounded-md border transition-all ${
                  isLight ? 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200' : 'bg-slate-900 border-white/10 text-slate-300 hover:bg-white/10'
                }`}
              >
                +30 Days
              </button>
            </div>
          )}

          {/* Days of Week Header */}
          <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-slate-400 mb-1">
            {daysOfWeek.map(d => (
              <div key={d} className="py-1">{d}</div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1 text-center text-xs font-mono">
            {/* Blank leading days */}
            {Array.from({ length: firstDayOfWeek }).map((_, i) => (
              <div key={`blank-${i}`} className="p-1.5 opacity-0" />
            ))}

            {/* Month Days */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1
              const formattedDayStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
              const eventCount = eventCounts ? eventCounts[formattedDayStr] || 0 : 0
              const selected = isSelected(day)
              const today = isToday(day)

              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => handleSelectDay(day)}
                  className={`p-1.5 rounded-xl font-bold transition-all duration-150 relative flex flex-col items-center justify-center ${
                    selected
                      ? 'bg-[#c9a84c] text-slate-950 shadow-md shadow-[#c9a84c]/30 scale-105'
                      : today
                      ? isLight ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-amber-500/20 text-[#c9a84c] border border-[#c9a84c]/40'
                      : eventCount > 0
                      ? isLight ? 'bg-blue-50 text-blue-900 border border-blue-300 font-extrabold hover:bg-blue-100' : 'bg-blue-500/15 text-blue-300 border border-blue-500/40 font-extrabold hover:bg-blue-500/25'
                      : isLight
                      ? 'hover:bg-slate-100 text-slate-800'
                      : 'hover:bg-white/10 text-slate-200'
                  }`}
                  title={eventCount > 0 ? `${eventCount} scheduled event(s) on ${formattedDayStr}` : undefined}
                >
                  <span className={eventCount > 0 ? 'relative z-10' : ''}>{day}</span>
                  
                  {/* Event Indicator Badge / Dot */}
                  {eventCount > 0 && (
                    <span className={`w-1.5 h-1.5 rounded-full absolute bottom-0.5 transition-all ${
                      selected
                        ? 'bg-slate-950'
                        : isLight
                        ? 'bg-blue-600'
                        : 'bg-[#c9a84c] shadow-[0_0_8px_#c9a84c]'
                    }`} />
                  )}
                </button>
              )
            })}
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}
