import React, { useState, useEffect, useRef, useMemo } from 'react'
import { Search, X, Check, ChevronDown } from 'lucide-react'

export default function PredictiveSelect({
  options = [],
  value,
  onChange,
  placeholder = 'Select option...',
  label,
  isLight = false,
  className = '',
  disabled = false,
  showSearch = true
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const containerRef = useRef(null)

  // Normalize options array into { value, label, badge, image, subtext, icon } objects
  const normalizedOptions = useMemo(() => {
    return options.map(opt => {
      if (typeof opt === 'string' || typeof opt === 'number') {
        return { value: String(opt), label: String(opt) }
      }
      return {
        value: String(opt.value),
        label: opt.label || String(opt.value),
        badge: opt.badge || (opt.count !== undefined ? String(opt.count) : null),
        count: opt.count,
        image: opt.image,
        subtext: opt.subtext,
        icon: opt.icon
      }
    })
  }, [options])

  // Resolve currently selected option object
  const selectedOption = useMemo(() => {
    return normalizedOptions.find(o => String(o.value) === String(value)) || null
  }, [normalizedOptions, value])

  // Predictive filtering
  const filteredOptions = useMemo(() => {
    if (!query.trim()) return normalizedOptions
    const q = query.toLowerCase().trim()
    return normalizedOptions.filter(o =>
      o.label.toLowerCase().includes(q) ||
      o.value.toLowerCase().includes(q) ||
      (o.subtext && o.subtext.toLowerCase().includes(q)) ||
      (o.badge && o.badge.toLowerCase().includes(q))
    )
  }, [normalizedOptions, query])

  // Click outside listener to close dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (val) => {
    if (disabled) return
    onChange(val)
    setQuery('')
    setIsOpen(false)
  }

  return (
    <div ref={containerRef} className={`relative font-sans text-xs ${isOpen ? 'z-50' : 'z-10'} ${className}`}>
      {label && (
        <label className={`block font-mono font-bold text-xs mb-1.5 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
          {label}
        </label>
      )}

      {/* Selected Box / Search Input Trigger */}
      <div
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl border transition-all cursor-pointer select-none ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        } ${
          isLight
            ? 'bg-slate-50 border-slate-300 text-slate-900 hover:border-[#6366f1]'
            : 'bg-slate-950 border-white/10 text-slate-100 hover:border-[#c9a84c]'
        } ${isOpen ? (isLight ? 'border-[#6366f1] ring-1 ring-[#6366f1]/40' : 'border-[#c9a84c] ring-1 ring-[#c9a84c]/40') : ''}`}
      >
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {selectedOption?.image && (
            <img src={selectedOption.image} alt="" className="w-5 h-5 rounded object-cover border border-white/10 flex-shrink-0" />
          )}
          {selectedOption?.icon && (
            <selectedOption.icon size={14} className={isLight ? 'text-[#6366f1]' : 'text-[#c9a84c]'} />
          )}
          <span className={`truncate font-mono ${selectedOption ? 'font-semibold' : (isLight ? 'text-slate-500' : 'text-slate-400')}`}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          {selectedOption?.badge && (
            <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-[#c9a84c]/20 text-[#c9a84c] border border-[#c9a84c]/30 flex-shrink-0">
              {selectedOption.badge}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1">
          {selectedOption && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onChange('')
                setQuery('')
              }}
              className="p-0.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-slate-200"
              title="Clear selection"
            >
              <X size={12} />
            </button>
          )}
          <ChevronDown size={14} className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180 text-[#c9a84c]' : ''}`} />
        </div>
      </div>

      {/* Floating Predictive Suggestions Panel */}
      {isOpen && (
        <div className={`absolute left-0 right-0 top-full mt-1.5 z-[9999] min-w-[200px] max-h-60 overflow-y-auto rounded-xl border shadow-2xl space-y-1 p-1.5 crm-scroll ${
          isLight ? 'bg-white border-slate-300 text-slate-900 shadow-slate-300/50' : 'bg-[#090f20] border-white/20 text-slate-100 shadow-black/90'
        }`}>
          {/* Internal Predictive Search Bar */}
          {showSearch && (
            <div className="relative p-1 mb-1 border-b border-white/10">
              <Search size={14} className={`absolute left-3 top-3 ${isLight ? 'text-slate-400' : 'text-slate-500'}`} />
              <input
                type="text"
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type to filter predictively..."
                className={`w-full border rounded-lg pl-8 pr-7 py-1.5 text-xs font-mono outline-none transition-all ${
                  isLight ? 'bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-500' : 'bg-slate-950 border-white/10 text-slate-100 placeholder:text-slate-500'
                }`}
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-200"
                >
                  <X size={12} />
                </button>
              )}
            </div>
          )}

          {/* Predictive Options List */}
          {filteredOptions.length > 0 ? (
            filteredOptions.map(opt => {
              const isSelected = String(opt.value) === String(value)
              const IconComponent = opt.icon

              return (
                <div
                  key={opt.value}
                  onClick={() => handleSelect(opt.value)}
                  className={`p-2 rounded-lg flex items-center justify-between gap-2.5 cursor-pointer transition-all ${
                    isSelected
                      ? isLight ? 'bg-slate-100 text-[#6366f1] font-bold border border-[#6366f1]/30' : 'bg-[#6366f1]/20 text-[#6366f1] font-bold border border-[#6366f1]/40'
                      : isLight ? 'hover:bg-slate-50 text-slate-800' : 'hover:bg-white/5 text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    {opt.image && (
                      <img src={opt.image} alt="" className="w-7 h-7 rounded object-cover border border-white/10 flex-shrink-0" />
                    )}
                    {IconComponent && (
                      <IconComponent size={14} className={isSelected ? (isLight ? 'text-[#6366f1]' : 'text-[#c9a84c]') : 'text-slate-500'} />
                    )}
                    <div className="truncate">
                      <p className="text-xs font-mono truncate">{opt.label}</p>
                      {opt.subtext && <p className="text-[10px] text-slate-400 font-mono truncate">{opt.subtext}</p>}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    {opt.badge && (
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-[#c9a84c]/20 text-[#c9a84c] border border-[#c9a84c]/30">
                        {opt.badge}
                      </span>
                    )}
                    {isSelected && <Check size={14} className="text-[#6366f1]" />}
                  </div>
                </div>
              )
            })
          ) : (
            <div className="p-3 text-center text-xs font-mono text-slate-400">
              No results matching "{query}"
            </div>
          )}
        </div>
      )}
    </div>
  )
}
