import React, { useEffect, useRef, useState, useCallback } from 'react'
import { trackTelemetryEvent } from '../../utils/telemetryTracker'
import { Film } from 'lucide-react'

/**
 * YouTubeVideoTracker Component
 * Embeds a YouTube Video and tracks exact playback duration, seconds watched,
 * and milestone percentages for Lead Scoring ("Seinfeld Sequence").
 */
export default function YouTubeVideoTracker({ videoUrl, videoId: propVideoId, title, vehicleId, className = '' }) {
  const containerRef = useRef(null)
  const playerRef = useRef(null)
  const intervalRef = useRef(null)
  const maxTimeWatchedRef = useRef(0)

  const [watchStats, setWatchStats] = useState({
    secondsWatched: 0,
    totalDuration: 0,
    percentage: 0,
    isCompleted: false
  })

  // Extract YouTube ID from full URL if provided
  const extractVideoId = (inputUrl) => {
    if (!inputUrl) return propVideoId || 'dQw4w9WgXcQ'
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = inputUrl.match(regExp)
    return (match && match[2].length === 11) ? match[2] : (propVideoId || 'dQw4w9WgXcQ')
  }

  const activeVideoId = extractVideoId(videoUrl)

  const sendFinalTelemetry = useCallback(() => {
    if (!playerRef.current || typeof playerRef.current.getDuration !== 'function') return
    const currentTime = Math.round(maxTimeWatchedRef.current)
    const duration = Math.round(playerRef.current.getDuration() || 1)
    const pct = Math.min(100, Math.round((currentTime / duration) * 100))

    if (currentTime > 2) {
      trackTelemetryEvent('VIDEO_WATCH_PROGRESS', {
        video_id: activeVideoId,
        video_title: title || 'Vehicle Showcase Video',
        vehicle_id: vehicleId,
        seconds_watched: currentTime,
        total_duration_seconds: duration,
        watch_percentage: pct,
        is_final: true
      })
    }
  }, [activeVideoId, title, vehicleId])

  const handleStateChange = useCallback((event) => {
    // YT.PlayerState.PLAYING = 1, PAUSED = 2, ENDED = 0
    if (event.data === 1) { // Playing
      intervalRef.current = setInterval(() => {
        if (!playerRef.current || typeof playerRef.current.getCurrentTime !== 'function') return

        const currentTime = playerRef.current.getCurrentTime() || 0
        const duration = playerRef.current.getDuration() || 1

        if (currentTime > maxTimeWatchedRef.current) {
          maxTimeWatchedRef.current = currentTime
        }

        const currentWatched = Math.round(maxTimeWatchedRef.current)
        const totalDurationSec = Math.round(duration)
        const pct = Math.min(100, Math.round((currentWatched / totalDurationSec) * 100))

        setWatchStats({
          secondsWatched: currentWatched,
          totalDuration: totalDurationSec,
          percentage: pct,
          isCompleted: pct >= 95
        })

        // Log telemetry at key milestones (25%, 50%, 75%, 100%)
        if ([25, 50, 75, 100].includes(pct)) {
          trackTelemetryEvent('VIDEO_WATCH_PROGRESS', {
            video_id: activeVideoId,
            video_title: title || 'Vehicle Showcase Video',
            vehicle_id: vehicleId,
            seconds_watched: currentWatched,
            total_duration_seconds: totalDurationSec,
            watch_percentage: pct,
            milestone: `${pct}%`
          })
        }
      }, 1000)
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current)
      sendFinalTelemetry()
    }
  }, [activeVideoId, title, vehicleId, sendFinalTelemetry])

  useEffect(() => {
    // 1. Inject YouTube IFrame API script dynamically if missing
    if (!window.YT) {
      const tag = document.createElement('script')
      tag.src = 'https://www.youtube.com/iframe_api'
      const firstScriptTag = document.getElementsByTagName('script')[0]
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag)
    }

    const initPlayer = () => {
      if (!containerRef.current || playerRef.current) return
      playerRef.current = new window.YT.Player(containerRef.current, {
        videoId: activeVideoId,
        playerVars: {
          autoplay: 0,
          controls: 1,
          rel: 0,
          modestbranding: 1
        },
        events: {
          onStateChange: handleStateChange
        }
      })
    }

    if (window.YT && window.YT.Player) {
      initPlayer()
    } else {
      window.onYouTubeIframeAPIReady = initPlayer
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      sendFinalTelemetry()
    }
  }, [activeVideoId, handleStateChange, sendFinalTelemetry])

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-slate-950">
        <div ref={containerRef} className="w-full h-full" />
      </div>

      {/* Live Telemetry Progress Pill */}
      <div className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-xs font-mono text-slate-300">
        <div className="flex items-center gap-2">
          <Film size={14} className="text-[#06b6d4]" />
          <span className="font-semibold text-slate-200">{title || 'Showcase Video telemetry'}</span>
        </div>
        <div className="flex items-center gap-3">
          <span>Watched: <strong className="text-cyan-400">{watchStats.secondsWatched}s</strong> / {watchStats.totalDuration}s</span>
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
            watchStats.percentage >= 75
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              : watchStats.percentage >= 50
              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
              : 'bg-slate-800 text-slate-400 border border-white/10'
          }`}>
            {watchStats.percentage}% Watched
          </span>
        </div>
      </div>
    </div>
  )
}
