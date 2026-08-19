import React, { useState, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useCRMStore } from '../../context/CRMStore'

/**
 * Universal System-Wide Sci-Fi HUD ActionTooltip Component
 * 
 * Features:
 * - Rendered via React Portal directly at document.body (z-index 999999)
 * - Escapes all parent overflow, scrolling containers, and table stacking contexts
 * - Cyberpunk Sci-Fi HUD styling: corner brackets, scan-line sweep, pulsing neon glow, status indicator
 * - Support for auto theme detection or explicit `isLight` override
 * - Prevents tooltips from being clipped by table boundaries
 */
export default function ActionTooltip({ text, children, isLight: isLightProp, position = 'top', className }) {
  const adminTheme = useCRMStore(state => state.adminTheme)
  const isLight = isLightProp !== undefined ? isLightProp : adminTheme === 'light'
  
  const [show, setShow] = useState(false)
  const [coords, setCoords] = useState({ top: 0, left: 0 })
  const targetRef = useRef(null)

  const handleMouseEnter = () => {
    if (targetRef.current) {
      const rect = targetRef.current.getBoundingClientRect()
      const viewportWidth = window.innerWidth || document.documentElement.clientWidth
      
      const targetLeft = rect.left + rect.width / 2
      const margin = 140 // Half max-width (120px) + padding
      const clampedLeft = Math.min(Math.max(targetLeft, margin), Math.max(margin, viewportWidth - margin))

      if (position === 'bottom') {
        setCoords({
          top: rect.bottom + 8,
          left: clampedLeft,
        })
      } else {
        // default top
        setCoords({
          top: rect.top - 8,
          left: clampedLeft,
        })
      }
      setShow(true)
    }
  }

  const handleMouseLeave = () => {
    setShow(false)
  }

  return (
    <div
      ref={targetRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() => setShow(false)}
      className={className || "inline-flex items-center"}
    >
      {children}
      {show && createPortal(
        <div
          className={`fixed pointer-events-none z-[999999] -translate-x-1/2 max-w-[240px] ${
            position === 'bottom' ? 'translate-y-0' : '-translate-y-full'
          } transition-opacity duration-200`}
          style={{ top: `${coords.top}px`, left: `${coords.left}px` }}
        >
          {position === 'bottom' && (
            <div className="flex justify-center -mb-px">
              <div
                style={{
                  width: 0,
                  height: 0,
                  borderLeft: '6px solid transparent',
                  borderRight: '6px solid transparent',
                  borderBottom: '6px solid rgba(201,168,76,0.6)',
                  filter: 'drop-shadow(0 -2px 4px rgba(201,168,76,0.4))',
                }}
              />
            </div>
          )}

          {/* ── Sci-Fi HUD Tooltip Container ── */}
          <div
            className="relative px-3.5 py-1.5 rounded-[4px] overflow-hidden max-w-[240px]"
            style={{
              background: isLight
                ? 'linear-gradient(135deg, rgba(15,23,42,0.97) 0%, rgba(30,41,59,0.95) 100%)'
                : 'linear-gradient(135deg, rgba(10,15,28,0.98) 0%, rgba(20,28,50,0.96) 100%)',
              border: '1px solid rgba(201,168,76,0.5)',
              boxShadow: '0 0 25px rgba(201,168,76,0.3), 0 10px 30px rgba(0,0,0,0.6)',
              animation: 'hud-glow-pulse 2.5s ease-in-out infinite',
            }}
          >
            {/* Scan-line sweep */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'linear-gradient(90deg, transparent 0%, rgba(201,168,76,0.08) 45%, rgba(201,168,76,0.18) 50%, rgba(201,168,76,0.08) 55%, transparent 100%)',
                animation: 'hud-scanline 2.5s ease-in-out infinite',
              }}
            />

            {/* Corner brackets — top-left */}
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#c9a84c] rounded-tl-[2px]"
              style={{ animation: 'hud-corner-in 0.3s ease-out' }} />
            {/* Corner brackets — top-right */}
            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#c9a84c] rounded-tr-[2px]"
              style={{ animation: 'hud-corner-in 0.3s ease-out 0.05s both' }} />
            {/* Corner brackets — bottom-left */}
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-[#c9a84c] rounded-bl-[2px]"
              style={{ animation: 'hud-corner-in 0.3s ease-out 0.1s both' }} />
            {/* Corner brackets — bottom-right */}
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#c9a84c] rounded-br-[2px]"
              style={{ animation: 'hud-corner-in 0.3s ease-out 0.15s both' }} />

            {/* Text content with status dot */}
            <div className="flex items-center gap-2 relative z-10">
              <div
                className="w-1.5 h-1.5 rounded-full bg-[#c9a84c] shrink-0 self-center"
                style={{
                  boxShadow: '0 0 6px rgba(201,168,76,0.9), 0 0 12px rgba(201,168,76,0.5)',
                  animation: 'hud-status-blink 1.8s ease-in-out infinite',
                }}
              />
              <span
                className="text-[11px] font-mono font-bold tracking-[0.06em] whitespace-pre-line leading-tight text-center break-words"
                style={{
                  color: '#f3e8c9',
                  textShadow: '0 0 10px rgba(201,168,76,0.4)',
                  animation: 'hud-text-reveal 0.4s ease-out',
                }}
              >
                {text}
              </span>
            </div>

            {/* Accent line */}
            <div className="absolute bottom-0 left-2 right-2 h-px bg-gradient-to-r from-transparent via-[#c9a84c]/40 to-transparent" />
          </div>

          {position !== 'bottom' && (
            <div className="flex justify-center -mt-px">
              <div
                style={{
                  width: 0,
                  height: 0,
                  borderLeft: '6px solid transparent',
                  borderRight: '6px solid transparent',
                  borderTop: '6px solid rgba(201,168,76,0.6)',
                  filter: 'drop-shadow(0 2px 4px rgba(201,168,76,0.4))',
                }}
              />
            </div>
          )}
        </div>,
        document.body
      )}
    </div>
  )
}
